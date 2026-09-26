import "server-only";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { setRating, ratingDelta, clampRating } from "@/lib/engine/rating";
import { touchDailyActivity, awardXp, recordProblemOutcome } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { ratingCategoryForCompetition } from "@/lib/engine/simulation";

/**
 * Countdown: one question at a time, a few seconds each, answer revealed
 * immediately, next question straight away.
 *
 * This exists because the full simulation is the only timed format in the
 * product and students do not finish it — 19 started and 2 submitted. A
 * 25-question paper on an unpausable 40-minute clock is a commitment, and an
 * interrupted attempt loses everything. Countdown is the opposite trade: about
 * two minutes end to end, nothing lost by stopping, and the format students
 * actually enjoy — it is the MATHCOUNTS round people remember.
 *
 * It reuses CompetitionAttempt with mode "COUNTDOWN" rather than adding a
 * table. `mode` is already a plain string column, so this needs no migration,
 * and results, history and scoring all keep working unchanged.
 *
 * The clock is per question, not per paper. `timeLimitSeconds` on the row is
 * the whole-run budget and exists only as a server-side backstop; the real
 * limit a student feels is SECONDS_PER_QUESTION, enforced on the client and
 * re-checked here when an answer arrives.
 */

export const COUNTDOWN_QUESTIONS = 10;
export const SECONDS_PER_QUESTION = 45;

/** A late answer is still recorded, but scored wrong — the clock is the point
 * of the format. Allows a little slack for network latency so a student who
 * answered in time is not punished for a slow round trip. */
const LATENESS_GRACE_SECONDS = 3;

export type CountdownQuestion = {
  itemId: string;
  order: number;
  question: string;
  diagram: string | null;
  format: string;
  choices: string[];
  difficulty: number;
  topicName: string;
};

function toQuestion(item: {
  id: string;
  order: number;
  problem: {
    question: string;
    diagram: string | null;
    format: string;
    choices: string | null;
    difficulty: number;
    topic: { name: string };
  };
}): CountdownQuestion {
  return {
    itemId: item.id,
    order: item.order,
    question: item.problem.question,
    diagram: item.problem.diagram,
    format: item.problem.format,
    choices: item.problem.choices ? (JSON.parse(item.problem.choices) as string[]) : [],
    difficulty: item.problem.difficulty,
    topicName: item.problem.topic.name,
  };
}

/**
 * Builds a run. Difficulty is centred on what this student can currently do
 * rather than on a contest's ramp: a countdown round is about speed on
 * problems you can already solve, so a paper that climbs into material they
 * cannot finish in 45 seconds would just be a stopwatch on failure.
 */
export async function startCountdown(userId: string, competitionSlug?: string | null) {
  const competition = competitionSlug
    ? await prisma.competition.findUnique({ where: { slug: competitionSlug } })
    : null;

  // Anchor to the student's rating, mapped back through the same scale the
  // rating engine uses: rating = 900 + 120 * difficulty.
  const rating = await prisma.rating.findUnique({
    where: { userId_category: { userId, category: "OVERALL" } },
  });
  const centre = Math.round(((rating?.value ?? 1000) - 900) / 120);
  const floor = Math.max(1, centre - 1);
  const ceiling = Math.min(10, Math.max(floor + 1, centre + 1));

  const pool = await prisma.problem.findMany({
    where: {
      isPublished: true,
      isPlacement: false,
      difficulty: { gte: floor, lte: ceiling },
      // Multiple choice only. Typing a free-form answer against a 45-second
      // clock measures keyboard speed, not mathematics.
      format: "MULTIPLE_CHOICE",
      ...(competition ? { competitionId: competition.id } : {}),
    },
    select: { id: true },
    take: 400,
  });

  if (pool.length === 0) throw new Error("No problems available for a countdown round.");

  const picked: string[] = [];
  const seen = new Set<number>();
  while (picked.length < Math.min(COUNTDOWN_QUESTIONS, pool.length)) {
    const i = Math.floor(Math.random() * pool.length);
    if (seen.has(i)) continue;
    seen.add(i);
    picked.push(pool[i].id);
  }

  // Every countdown attempt needs a competition row for reporting, matching how
  // custom simulations already borrow the student's primary competition.
  const fallbackId =
    competition?.id ??
    (await prisma.userCompetition.findFirst({ where: { userId, isPrimary: true } }))?.competitionId ??
    (await prisma.competition.findFirstOrThrow({ where: { slug: "amc8" } })).id;

  return prisma.competitionAttempt.create({
    data: {
      userId,
      competitionId: fallbackId,
      mode: "COUNTDOWN",
      status: "IN_PROGRESS",
      timeLimitSeconds: picked.length * SECONDS_PER_QUESTION,
      totalQuestions: picked.length,
      items: { create: picked.map((problemId, i) => ({ problemId, order: i })) },
    },
  });
}

/** The questions of a run, in order, with answers withheld. */
export async function countdownQuestions(attemptId: string): Promise<CountdownQuestion[]> {
  const items = await prisma.competitionAttemptItem.findMany({
    where: { competitionAttemptId: attemptId },
    orderBy: { order: "asc" },
    include: { problem: { include: { topic: true } } },
  });
  return items.map(toQuestion);
}

export type CountdownAnswerResult = {
  correct: boolean;
  /** The key, revealed straight away — immediate feedback is the format. */
  correctAnswer: string;
  solution: string;
  timedOut: boolean;
  finished: boolean;
};

/**
 * Records one answer and says whether it was right.
 *
 * Unlike a simulation, the key is returned immediately, so this must never be
 * callable for a question the student has not been served — the caller checks
 * attempt ownership before reaching here.
 */
export async function answerCountdownItem(
  attemptId: string,
  itemId: string,
  answerGiven: string,
  timeSeconds: number
): Promise<CountdownAnswerResult> {
  const item = await prisma.competitionAttemptItem.findFirstOrThrow({
    where: { id: itemId, competitionAttemptId: attemptId },
    include: { problem: true, competitionAttempt: true },
  });

  const timedOut = timeSeconds > SECONDS_PER_QUESTION + LATENESS_GRACE_SECONDS;
  const correct = !timedOut && !!answerGiven && checkAnswer(item.problem, answerGiven);

  // First answer wins. A resubmitted item would otherwise double-count XP and
  // mastery, and the key has already been shown by then.
  if (item.correct === null) {
    await prisma.competitionAttemptItem.update({
      where: { id: item.id },
      data: { answerGiven: answerGiven || null, correct, timeSeconds: Math.round(timeSeconds) },
    });
    await prisma.attempt.create({
      data: {
        userId: item.competitionAttempt.userId,
        problemId: item.problemId,
        mode: "COUNTDOWN",
        answerGiven: answerGiven || null,
        correct,
        timeSeconds: Math.round(timeSeconds),
      },
    });
    await updateTopicAndDomainMastery(item.competitionAttempt.userId, item.problem.topicId, correct);
    await recordProblemOutcome(item.competitionAttempt.userId, correct);
  }

  const remaining = await prisma.competitionAttemptItem.count({
    where: { competitionAttemptId: attemptId, correct: null },
  });

  return {
    correct,
    correctAnswer: item.problem.answer,
    solution: item.problem.solution,
    timedOut,
    finished: remaining === 0,
  };
}

/** Closes a run and pays out. Rating moves less than a full simulation: ten
 * quick questions are weaker evidence than a full paper. */
export async function finishCountdown(attemptId: string) {
  const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { items: { include: { problem: true } }, competition: true },
  });
  if (attempt.status === "SUBMITTED") return attempt;

  const answered = attempt.items.filter((i) => i.correct !== null);
  const correctCount = answered.filter((i) => i.correct).length;

  const submitted = await prisma.competitionAttempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      correctCount,
      score: Math.round((correctCount / Math.max(1, attempt.totalQuestions)) * 100),
    },
  });

  if (answered.length > 0) {
    const avgDifficulty =
      answered.reduce((s, i) => s + i.problem.difficulty, 0) / answered.length;
    const accuracy = correctCount / answered.length;
    const category = ratingCategoryForCompetition(attempt.competition.slug);

    for (const cat of new Set(["OVERALL", category])) {
      const existing = await prisma.rating.upsert({
        where: { userId_category: { userId: attempt.userId, category: cat } },
        update: {},
        create: { userId: attempt.userId, category: cat, value: 1000 },
      });
      const perProblem = ratingDelta(existing.value, Math.round(avgDifficulty), accuracy >= 0.5);
      // Capped at 2x a single problem — a two-minute round should nudge the
      // rating, not reset it.
      const scaled = Math.round(perProblem * Math.min(2, answered.length / 5));
      await setRating(attempt.userId, cat, clampRating(existing.value + scaled), "Countdown");
    }
  }

  await touchDailyActivity(attempt.userId);
  await awardXp(attempt.userId, 10 + correctCount * 4);
  await checkAndUnlockAchievements(attempt.userId);
  return submitted;
}
