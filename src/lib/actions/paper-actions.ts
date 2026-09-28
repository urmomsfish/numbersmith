"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  validatePaper,
  hasHitScanCap,
  parseAnswerSource,
  MAX_PAPER_BASE64,
  MAX_QUESTIONS,
  MAX_SCANS_PER_DAY,
  type PaperResult,
  type PaperQuestion,
  type AnswerSource,
} from "@/lib/papers";
import { solvePaper } from "@/lib/engine/paper-solve";
import {
  startOrResumeAttempt,
  submitAttempt,
  countScansToday,
  recordScan,
} from "@/lib/engine/papers";
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

/** One answer per question, aligned by position, whatever produced it. */
export type ScannedAnswer = { answer: string; confidence: "high" | "low"; note: string };

export type ScanResult =
  | {
      ok: true;
      paper: ExtractedPaper;
      summary: ReturnType<typeof extractionSummary>;
      answers: ScannedAnswer[];
      answerSource: AnswerSource;
    }
  | { ok: false; error: string };

/**
 * Reads an uploaded PDF and returns the questions and a marking key, without
 * saving anything.
 *
 * Two passes, and the split matters. Extraction transcribes and copies only an
 * answer the paper itself prints; if the paper prints no key — the normal case
 * for official papers — a second call solves the transcribed questions. Asking
 * one call to do both would put "copy what is written" and "work out what is
 * true" in conflict on every question, and the first of those is the rule that
 * stops a printed key being silently "corrected".
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
 *
 * The Pro gate does nothing while payments are off — `isProUser` short-circuits
 * to true — so it is not the cost control it looks like. `MAX_SCANS_PER_DAY` is:
 * it applies to every account and works today.
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

    // Checked last, after the cheap rejections, so a student never burns a
    // scan on a file that was never going to be sent.
    if (hasHitScanCap(await countScansToday(user.id))) {
      return {
        ok: false,
        error: `That's ${MAX_SCANS_PER_DAY} scans today — the limit resets at midnight Pacific. You can still enter this paper by hand.`,
      };
    }
    // Before the call, not after: the tokens are spent whether or not the scan
    // comes back usable.
    await recordScan(user.id);

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

    const summary = extractionSummary(result.paper);

    // The paper printed its own key. Nothing to work out — a printed key beats
    // anything we could derive, including where it disagrees with the maths.
    if (!summary.needsManualKey) {
      return {
        ok: true,
        paper: result.paper,
        summary,
        answers: result.paper.questions.map((q) => ({
          answer: q.answer,
          confidence: q.confidence,
          note: "",
        })),
        answerSource: "PRINTED",
      };
    }

    // No key on the paper, which is the normal case. Work them out.
    const solved = await solvePaper(result.paper.questions);
    if (!solved.ok) {
      // Falling back rather than failing: the transcription is still good, and
      // a student with 25 real questions and a blank key is far better off than
      // one staring at an error. They fill the key in, as before.
      return {
        ok: true,
        paper: result.paper,
        summary,
        answers: result.paper.questions.map(() => ({
          answer: "",
          confidence: "low" as const,
          note: "",
        })),
        answerSource: "MANUAL",
      };
    }

    return { ok: true, paper: result.paper, summary, answers: solved.answers, answerSource: "SOLVED" };
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
  /** Where the key came from, before the student edited it. */
  answerSource?: AnswerSource;
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
        // A hand-entered paper is MANUAL whatever the caller claims, since
        // there is no scan behind it to have produced anything else.
        answerSource: questions.length > 0 ? parseAnswerSource(input.answerSource) : "MANUAL",
        questions: JSON.stringify(
          questions.map((q) => ({
            text: q.text.trim(),
            choices: q.choices.map((c) => c.trim()).filter(Boolean),
            confidence: q.confidence === "low" ? "low" : "high",
            note: q.note.trim(),
            ...(q.answerConfidence ? { answerConfidence: q.answerConfidence } : {}),
            ...(q.answerNote ? { answerNote: q.answerNote.trim() } : {}),
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
