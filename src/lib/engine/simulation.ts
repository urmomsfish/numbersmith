import "server-only";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { setRating, ratingDelta, clampRating } from "@/lib/engine/rating";
import { touchDailyActivity, awardXp, recordProblemOutcome } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";

/** Maps a competition to the rating category its simulations should move. */
export function ratingCategoryForCompetition(slug: string): string {
  if (slug.startsWith("amc") || slug === "aime") return "AMC";
  if (slug === "mathcounts") return "MATHCOUNTS";
  if (["usamo", "imo", "imo-shortlist", "egmo", "usamts"].includes(slug)) return "OLYMPIAD";
  return "OVERALL";
}

export type CustomConfig = {
  problemCount: number;
  difficultyMin: number;
  difficultyMax: number;
  topicSlugs: string[];
  timeLimitMinutes: number;
};

async function pickSimulationProblems(opts: {
  competitionId?: string;
  count: number;
  difficultyMin: number;
  difficultyMax: number;
  topicIds?: string[];
}) {
  const baseWhere = {
    isPublished: true,
    difficulty: { gte: opts.difficultyMin, lte: opts.difficultyMax },
    format: { in: ["MULTIPLE_CHOICE", "SHORT_ANSWER", "INTEGER"] },
    ...(opts.topicIds && opts.topicIds.length > 0
      ? { OR: [{ topicId: { in: opts.topicIds } }, { topic: { parentId: { in: opts.topicIds } } }] }
      : {}),
  };

  // Prefer problems tagged to this competition, then widen to the whole pool
  // so a simulation always fills its full question count.
  const preferred = opts.competitionId
    ? await prisma.problem.findMany({ where: { ...baseWhere, competitionId: opts.competitionId } })
    : [];
  const rest = await prisma.problem.findMany({
    where: { ...baseWhere, ...(preferred.length ? { id: { notIn: preferred.map((p) => p.id) } } : {}) },
  });

  const pool = [...shuffle(preferred), ...shuffle(rest)];

  if (pool.length < opts.count) {
    const fallback = await prisma.problem.findMany({
      where: { isPublished: true, id: { notIn: pool.map((p) => p.id) } },
    });
    pool.push(...shuffle(fallback));
  }

  return pool.slice(0, opts.count).sort((a, b) => a.difficulty - b.difficulty);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function startOfficialSimulation(userId: string, competitionSlug: string) {
  const competition = await prisma.competition.findUniqueOrThrow({ where: { slug: competitionSlug } });
  if (competition.format === "PROOF") {
    throw new Error("Proof-based competitions do not support timed simulations");
  }

  const count = competition.numQuestions ?? 20;
  const timeLimitMinutes = competition.timeLimitMinutes ?? 60;

  const problems = await pickSimulationProblems({
    competitionId: competition.id,
    count,
    difficultyMin: Math.max(1, competition.difficultyMin - 1),
    difficultyMax: Math.min(10, competition.difficultyMax + 1),
  });

  const attempt = await prisma.competitionAttempt.create({
    data: {
      userId,
      competitionId: competition.id,
      mode: "OFFICIAL",
      status: "IN_PROGRESS",
      timeLimitSeconds: timeLimitMinutes * 60,
      totalQuestions: problems.length,
      items: {
        create: problems.map((p, i) => ({ problemId: p.id, order: i })),
      },
    },
  });

  return attempt;
}

export async function startCustomSimulation(userId: string, config: CustomConfig) {
  const topics = config.topicSlugs.length
    ? await prisma.topic.findMany({ where: { slug: { in: config.topicSlugs } } })
    : [];

  const problems = await pickSimulationProblems({
    count: config.problemCount,
    difficultyMin: config.difficultyMin,
    difficultyMax: config.difficultyMax,
    topicIds: topics.map((t) => t.id),
  });

  // Custom sets are still attached to a competition row for reporting; we use
  // the student's primary competition, falling back to AMC 8 as a neutral default.
  const primary = await prisma.userCompetition.findFirst({
    where: { userId, isPrimary: true },
  });
  const fallback = await prisma.competition.findUniqueOrThrow({ where: { slug: "amc8" } });
  const competitionId = primary?.competitionId ?? fallback.id;

  return prisma.competitionAttempt.create({
    data: {
      userId,
      competitionId,
      mode: "CUSTOM",
      status: "IN_PROGRESS",
      timeLimitSeconds: config.timeLimitMinutes * 60,
      totalQuestions: problems.length,
      config: JSON.stringify(config),
      items: { create: problems.map((p, i) => ({ problemId: p.id, order: i })) },
    },
  });
}

export async function submitSimulation(
  attemptId: string,
  answers: Record<string, string>,
  flagged: string[]
) {
  const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { items: { include: { problem: true } }, competition: true },
  });

  if (attempt.status === "SUBMITTED") return attempt;

  const flaggedSet = new Set(flagged);
  let correctCount = 0;

  for (const item of attempt.items) {
    const given = answers[item.id] ?? "";
    const correct = given ? checkAnswer(item.problem, given) : false;
    if (correct) correctCount += 1;

    await prisma.competitionAttemptItem.update({
      where: { id: item.id },
      data: { answerGiven: given || null, correct, flagged: flaggedSet.has(item.id) },
    });

    await prisma.attempt.create({
      data: {
        userId: attempt.userId,
        problemId: item.problemId,
        mode: "SIMULATION",
        answerGiven: given || null,
        correct,
        timeSeconds: Math.round(attempt.timeLimitSeconds / Math.max(1, attempt.totalQuestions)),
      },
    });

    await updateTopicAndDomainMastery(attempt.userId, item.problem.topicId, correct);
    await recordProblemOutcome(attempt.userId, correct);

    if (!correct) {
      await prisma.mistake.upsert({
        where: { userId_problemId: { userId: attempt.userId, problemId: item.problemId } },
        update: {
          reason: given ? "INCORRECT" : "SKIPPED",
          resolved: false,
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: attempt.userId,
          problemId: item.problemId,
          reason: given ? "INCORRECT" : "SKIPPED",
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  const submitted = await prisma.competitionAttempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      correctCount,
      score: Math.round((correctCount / Math.max(1, attempt.totalQuestions)) * 100),
    },
  });

  // Simulations move both the overall rating and the competition-family rating.
  const avgDifficulty =
    attempt.items.reduce((sum, i) => sum + i.problem.difficulty, 0) / Math.max(1, attempt.items.length);
  const accuracy = correctCount / Math.max(1, attempt.totalQuestions);
  const category = ratingCategoryForCompetition(attempt.competition.slug);
  const reason = `${attempt.competition.shortName} Simulation`;

  for (const cat of new Set(["OVERALL", category])) {
    const existing = await prisma.rating.upsert({
      where: { userId_category: { userId: attempt.userId, category: cat } },
      update: {},
      create: { userId: attempt.userId, category: cat, value: 1000 },
    });
    // Scale a single-problem delta up by the number of questions, damped so a
    // full simulation moves the rating meaningfully but not wildly.
    const perProblem = ratingDelta(existing.value, Math.round(avgDifficulty), accuracy >= 0.5);
    const scaled = Math.round(perProblem * Math.min(6, attempt.totalQuestions / 4));
    await setRating(attempt.userId, cat, clampRating(existing.value + scaled), reason);
  }

  await touchDailyActivity(attempt.userId);
  await awardXp(attempt.userId, 40 + correctCount * 5);
  await checkAndUnlockAchievements(attempt.userId);

  return submitted;
}
