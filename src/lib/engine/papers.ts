import "server-only";
import { prisma } from "@/lib/prisma";
import { parseJsonArray, scoreAnswers, isPastDeadline, type PaperResult } from "@/lib/papers";
import { streakDayStart } from "@/lib/streak";

/**
 * The database half of past papers. The rules — validation, marking, the clock
 * — live in `@/lib/papers`, which is pure and importable from the browser;
 * only what touches Prisma is here, behind `server-only`.
 */

/** How many scans this account has run since the day boundary.
 *
 * `streakDayStart()` rather than "midnight" or a 24-hour window: the cap resets
 * at the same midnight-Pacific moment as streaks, the daily challenge and the
 * free practice limit, so a student never has to hold two different ideas of
 * when "today" ends. It is also DST-correct, which subtracting a fixed offset
 * from a date key would not be. */
export async function countScansToday(userId: string): Promise<number> {
  return prisma.paperScan.count({
    where: { userId, createdAt: { gte: streakDayStart() } },
  });
}

/** Records a scan attempt against the cap.
 *
 * Called before the API request, so a scan that errors still counts — it spent
 * the tokens either way, and a cap that only counted successes would let a
 * paper the model chokes on be retried without limit. */
export async function recordScan(userId: string): Promise<void> {
  await prisma.paperScan.create({ data: { userId } });
}

/** Starts a sitting, or resumes the one already open.
 *
 * Resuming rather than always creating matters twice over: a student who
 * reloads mid-paper would otherwise get a fresh clock, which is both a way to
 * buy unlimited time and a way to lose twenty minutes of answers by accident.
 */
export async function startOrResumeAttempt(paperId: string, userId: string) {
  const open = await prisma.uploadedPaperAttempt.findFirst({
    where: { paperId, userId, status: "IN_PROGRESS" },
    orderBy: { startedAt: "desc" },
  });
  if (open) return open;
  return prisma.uploadedPaperAttempt.create({ data: { paperId, userId } });
}

/**
 * Closes a sitting and marks it.
 *
 * Idempotent: a second submit returns the stored result rather than re-marking.
 * Without that, a double-firing submit button — or a student reopening a
 * finished paper — would overwrite a real score with whatever the form happened
 * to hold at the time.
 */
export async function submitAttempt(attemptId: string, answers: string[]): Promise<PaperResult> {
  const attempt = await prisma.uploadedPaperAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { paper: true },
  });
  const key = parseJsonArray(attempt.paper.answerKey);

  if (attempt.status === "SUBMITTED") {
    const stored = parseJsonArray(attempt.answers);
    return {
      ...scoreAnswers(key, stored),
      questionCount: attempt.paper.questionCount,
      key,
      answers: stored,
      timedOut: false,
    };
  }

  const timedOut = isPastDeadline(attempt.startedAt, attempt.paper.timeLimitMinutes);
  // Answers still count when the clock has run out. A paper sat at home is not
  // a contest with an invigilator, and marking a late submission zero would
  // destroy the only thing the student came for — knowing which questions they
  // can actually do. The overrun is reported instead.
  const trimmed = key.map((_, i) => (answers[i] ?? "").trim());
  const { correct, correctCount } = scoreAnswers(key, trimmed);

  await prisma.uploadedPaperAttempt.update({
    where: { id: attemptId },
    data: {
      answers: JSON.stringify(trimmed),
      correctCount,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return {
    correct,
    correctCount,
    questionCount: attempt.paper.questionCount,
    key,
    answers: trimmed,
    timedOut,
  };
}
