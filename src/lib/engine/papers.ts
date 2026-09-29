import "server-only";
import { prisma } from "@/lib/prisma";
import {
  parseJsonArray,
  scoreAnswers,
  isPastDeadline,
  parseQuestions,
  isQuizzable,
  type PaperResult,
  type PaperQuestion,
} from "@/lib/papers";
import { markQuestions, type ToMark } from "@/lib/engine/paper-mark";
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
  const questions = parseQuestions(attempt.paper.questions);
  const count = attempt.paper.questionCount;

  if (attempt.status === "SUBMITTED") {
    // Marked already. Return what was stored rather than re-deriving: the
    // explanations cost real money to produce and must read the same every
    // time the student opens their results.
    const stored = parseJsonArray(attempt.answers);
    const storedExplanations = parseJsonArray(attempt.explanations);
    return {
      ...scoreAnswers(key, stored),
      questionCount: count,
      key,
      answers: stored,
      timedOut: false,
      explanations: storedExplanations,
    };
  }

  const timedOut = isPastDeadline(attempt.startedAt, attempt.paper.timeLimitMinutes);
  // Answers still count when the clock has run out. A paper sat at home is not
  // a contest with an invigilator, and marking a late submission zero would
  // destroy the only thing the student came for — knowing which questions they
  // can actually do. The overrun is reported instead.
  const trimmed = Array.from({ length: count }, (_, i) => (answers[i] ?? "").trim());

  const marked = await markSitting({ questions, key, answers: trimmed, count });

  await prisma.uploadedPaperAttempt.update({
    where: { id: attemptId },
    data: {
      answers: JSON.stringify(trimmed),
      explanations: JSON.stringify(marked.explanations),
      correctCount: marked.correctCount,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  // A key worked out here is cached onto the paper, so a second sitting is
  // marked against exactly the same answers as the first — two attempts that
  // disagreed about what was correct would make the scores incomparable — and
  // so the paper is only ever worked out once.
  if (marked.derivedKey) {
    await prisma.uploadedPaper.update({
      where: { id: attempt.paperId },
      data: { answerKey: JSON.stringify(marked.derivedKey), answerSource: "SOLVED" },
    });
  }

  return {
    correct: marked.correct,
    correctCount: marked.correctCount,
    questionCount: count,
    key: marked.derivedKey ?? key,
    answers: trimmed,
    timedOut,
    explanations: marked.explanations,
  };
}

/**
 * Works out what is right, what is wrong, and why — for one sitting.
 *
 * Three paths, cheapest first:
 *
 *   - No question text (a hand-entered paper): mark against the typed key and
 *     stop. There is nothing to explain from, since the questions were never
 *     read.
 *   - A printed key: it is ground truth, so marking is local and free, and
 *     only the questions the student got wrong are sent to be explained. A
 *     paper sat perfectly costs nothing at all.
 *   - No key: the answers have to be worked out, so everything goes — and the
 *     resulting key is handed back to be cached.
 */
async function markSitting(input: {
  questions: PaperQuestion[];
  key: string[];
  answers: string[];
  count: number;
}): Promise<{
  correct: boolean[];
  correctCount: number;
  explanations: string[];
  derivedKey?: string[];
}> {
  const { questions, key, answers, count } = input;
  const blank = Array.from({ length: count }, () => "");

  if (!isQuizzable(questions, count)) {
    const scored = scoreAnswers(key, answers);
    return { ...scored, explanations: blank };
  }

  const hasPrintedKey = key.length === count && key.some((k) => k.trim() !== "");

  if (hasPrintedKey) {
    const scored = scoreAnswers(key, answers);
    const wrong: ToMark[] = [];
    scored.correct.forEach((ok, i) => {
      if (!ok) {
        wrong.push({ index: i, question: questions[i], studentAnswer: answers[i], printedAnswer: key[i] });
      }
    });
    if (wrong.length === 0) return { ...scored, explanations: blank };

    const result = await markQuestions(wrong);
    const explanations = [...blank];
    if (result.ok) {
      wrong.forEach((item, n) => {
        explanations[item.index] = result.marks[n].explanation;
      });
    }
    // The printed key still decides the score. An explanation failing is a
    // missing explanation, never a changed mark.
    return { ...scored, explanations };
  }

  const items: ToMark[] = questions.map((question, i) => ({
    index: i,
    question,
    studentAnswer: answers[i],
  }));
  const result = await markQuestions(items);
  if (!result.ok) {
    return { correct: blank.map(() => false), correctCount: 0, explanations: blank };
  }

  const correct = result.marks.map((m, i) => m.correct && answers[i].trim().length > 0);
  return {
    correct,
    correctCount: correct.filter(Boolean).length,
    explanations: result.marks.map((m) => m.explanation),
    derivedKey: result.marks.map((m) => m.correctAnswer),
  };
}
