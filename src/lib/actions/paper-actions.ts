"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  validatePaper,
  MAX_PAPER_BASE64,
  MAX_QUESTIONS,
  type PaperResult,
  type PaperQuestion,
} from "@/lib/papers";
import { startOrResumeAttempt, submitAttempt } from "@/lib/engine/papers";
import { extractPaper, extractionSummary, type ExtractedPaper } from "@/lib/engine/paper-extract";
import { aiIsConfigured } from "@/lib/ai";
import { isProUser } from "@/lib/subscription";

/**
 * Past-paper actions.
 *
 * A paper is one student's private file. Nothing here, and nothing on the file
 * route, will serve or modify a paper to anyone but the account that uploaded
 * it — every query below pairs the id with `userId: user.id` in a single
 * `where`, so a paper id belonging to someone else simply does not match.
 *
 * Errors are values, not throws: Next replaces a thrown Server Action message
 * with an opaque digest in production, and "That PDF is too large" is exactly
 * the kind of thing a student needs to read.
 */

function asValue(err: unknown, message: string) {
  const digest = (err as { digest?: unknown } | null)?.digest;
  if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
  console.error(`${message}:`, err);
  return { ok: false as const, error: message };
}

export type PaperActionResult = { ok: true } | { ok: false; error: string };

export type ScanResult =
  | { ok: true; paper: ExtractedPaper; summary: ReturnType<typeof extractionSummary> }
  | { ok: false; error: string };

/**
 * Reads an uploaded PDF and returns what it found, without saving anything.
 *
 * Deliberately does not write to the database. The student reviews and corrects
 * the extraction first, and only the reviewed version is saved — so a bad scan
 * costs a click, not a stored paper full of mangled questions. That separation
 * is the whole safety story for reading PDFs at all.
 *
 * Pro only. I argued the other way when building this — scanning is what makes
 * the feature usable, so gating it leaves free accounts with the worse half.
 * That is still true, and it loses to the cost shape: one call here is a whole
 * PDF through Opus, which is a different order of magnitude from a chat turn,
 * and an ungated endpoint can be re-run on the same file indefinitely by anyone
 * with an account. Uploading and sitting a paper stay free; only the scan is
 * gated, so the by-hand path a free account gets is the entire feature minus
 * the typing.
 *
 * The check is here, not only in the page that decides whether to render the
 * button, because a Server Action is a public HTTP endpoint.
 */
export async function scanPaperAction(input: {
  fileData: string;
}): Promise<ScanResult> {
  try {
    const user = await requireUser();
    if (!(await isProUser(user.id))) {
      return {
        ok: false,
        error: "Scanning a paper is a Pro feature. You can still enter this one by hand.",
      };
    }
    if (!aiIsConfigured()) {
      return { ok: false, error: "Scanning is unavailable right now — enter the paper by hand." };
    }
    if (!input.fileData) return { ok: false, error: "Choose a PDF first." };
    if (input.fileData.length > MAX_PAPER_BASE64) {
      return { ok: false, error: "That PDF is too large — 3 MB is the limit." };
    }

    const result = await extractPaper(input.fileData);
    if (!result.ok) return result;

    if (result.paper.questions.length === 0) {
      return {
        ok: false,
        error: "No questions could be read from that file. You can still enter it by hand.",
      };
    }
    if (result.paper.questions.length > MAX_QUESTIONS) {
      return {
        ok: false,
        error: `That paper has more than ${MAX_QUESTIONS} questions — enter it by hand instead.`,
      };
    }

    return { ok: true, paper: result.paper, summary: extractionSummary(result.paper) };
  } catch (err) {
    return asValue(err, "Couldn't scan that paper");
  }
}

export async function uploadPaperAction(input: {
  title: string;
  fileData: string;
  questionCount: number;
  timeLimitMinutes: number;
  answerKey: string[];
  /** The reviewed extraction, or an empty array for a hand-entered paper. */
  questions?: PaperQuestion[];
}): Promise<{ ok: true; paperId: string } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    // Validated server-side in full. The form's `required`, `min` and `max`
    // attributes are a convenience for the person typing, not a check — this
    // action is a public endpoint and receives whatever the caller sends.
    const checked = validatePaper(input);
    if (!checked.ok) return checked;

    // A scanned paper must have a question per key slot, or the sitting would
    // ask fewer questions than it marks. Rejecting here rather than silently
    // dropping to the PDF-on-screen mode, because the student reviewed these
    // questions and would not expect them to vanish.
    const questions = (input.questions ?? []).filter((q) => q.text.trim().length > 0);
    if (questions.length > 0 && questions.length !== checked.value.questionCount) {
      return {
        ok: false,
        error: `There are ${questions.length} questions but ${checked.value.questionCount} answers.`,
      };
    }

    const paper = await prisma.uploadedPaper.create({
      data: {
        userId: user.id,
        title: checked.value.title,
        fileData: checked.value.fileData,
        questionCount: checked.value.questionCount,
        timeLimitMinutes: checked.value.timeLimitMinutes,
        answerKey: JSON.stringify(checked.value.answerKey),
        questions: JSON.stringify(
          questions.map((q) => ({
            text: q.text.trim(),
            choices: q.choices.map((c) => c.trim()).filter(Boolean),
            confidence: q.confidence === "low" ? "low" : "high",
            note: q.note.trim(),
          }))
        ),
      },
      select: { id: true },
    });
    revalidatePath("/papers");
    return { ok: true, paperId: paper.id };
  } catch (err) {
    return asValue(err, "Couldn't upload that paper");
  }
}

export async function deletePaperAction(input: { paperId: string }): Promise<PaperActionResult> {
  try {
    const user = await requireUser();
    const deleted = await prisma.uploadedPaper.deleteMany({
      where: { id: input.paperId, userId: user.id },
    });
    if (deleted.count === 0) return { ok: false, error: "Not your paper." };
    revalidatePath("/papers");
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't delete that paper");
  }
}

export async function startPaperAction(input: {
  paperId: string;
}): Promise<{ ok: true; attemptId: string } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    const paper = await prisma.uploadedPaper.findFirst({
      where: { id: input.paperId, userId: user.id },
      select: { id: true },
    });
    if (!paper) return { ok: false, error: "Not your paper." };

    const attempt = await startOrResumeAttempt(paper.id, user.id);
    return { ok: true, attemptId: attempt.id };
  } catch (err) {
    return asValue(err, "Couldn't start that paper");
  }
}

export async function submitPaperAction(input: {
  attemptId: string;
  answers: string[];
}): Promise<{ ok: true; result: PaperResult } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    // The attempt is paired with the caller in one query. This is the check
    // that stops a crafted attempt id revealing someone else's answer key,
    // which `submitAttempt` returns so the student can see what they missed.
    const attempt = await prisma.uploadedPaperAttempt.findFirst({
      where: { id: input.attemptId, userId: user.id },
      select: { id: true, paperId: true },
    });
    if (!attempt) return { ok: false, error: "Not your attempt." };

    const result = await submitAttempt(attempt.id, input.answers);
    revalidatePath(`/papers/${attempt.paperId}`);
    return { ok: true, result };
  } catch (err) {
    return asValue(err, "Couldn't submit that paper");
  }
}

/** Abandons an in-progress sitting without scoring it, so a student who
 * started by accident is not left with a stale clock that blocks a real
 * attempt later — `startOrResumeAttempt` resumes whatever is open. */
export async function abandonAttemptAction(input: {
  attemptId: string;
}): Promise<PaperActionResult> {
  try {
    const user = await requireUser();
    const deleted = await prisma.uploadedPaperAttempt.deleteMany({
      where: { id: input.attemptId, userId: user.id, status: "IN_PROGRESS" },
    });
    if (deleted.count === 0) return { ok: false, error: "Nothing to discard." };
    revalidatePath("/papers");
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't discard that attempt");
  }
}
