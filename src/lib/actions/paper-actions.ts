"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validatePaper, type PaperResult } from "@/lib/papers";
import { startOrResumeAttempt, submitAttempt } from "@/lib/engine/papers";

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

export async function uploadPaperAction(input: {
  title: string;
  fileData: string;
  questionCount: number;
  timeLimitMinutes: number;
  answerKey: string[];
}): Promise<{ ok: true; paperId: string } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    // Validated server-side in full. The form's `required`, `min` and `max`
    // attributes are a convenience for the person typing, not a check — this
    // action is a public endpoint and receives whatever the caller sends.
    const checked = validatePaper(input);
    if (!checked.ok) return checked;

    const paper = await prisma.uploadedPaper.create({
      data: {
        userId: user.id,
        title: checked.value.title,
        fileData: checked.value.fileData,
        questionCount: checked.value.questionCount,
        timeLimitMinutes: checked.value.timeLimitMinutes,
        answerKey: JSON.stringify(checked.value.answerKey),
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
