import "server-only";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { setRating } from "@/lib/engine/rating";
import { touchDailyActivity, awardXp } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { recommendCompetition } from "@/lib/engine/recommend";
import { DOMAIN_TOPIC_SLUGS, ratingTier, type PlacementLevel } from "@/lib/types";
import type { PriorExperience } from "@/lib/types";

const MIN_QUESTIONS = 20;
const MAX_QUESTIONS = 30;

// Domains rotate in this order; "advanced-olympiad" only joins the rotation
// once a student is performing well enough to warrant olympiad-flavored items.
const CORE_DOMAINS = [
  "arithmetic",
  "algebra",
  "geometry",
  "number-theory",
  "combinatorics",
  "probability",
  "logic",
] as const;

export function computeStartingDifficulty(grade: number, priorExperience: PriorExperience): number {
  let base = 2;
  if (grade >= 6 && grade <= 8) base = 3;
  else if (grade >= 9 && grade <= 10) base = 5;
  else if (grade >= 11) base = 6;

  const experienceAdjust: Record<PriorExperience, number> = {
    NONE: -1,
    SOME: 0,
    EXPERIENCED: 1,
    ADVANCED: 2,
  };
  return Math.max(1, Math.min(8, base + experienceAdjust[priorExperience]));
}

export async function startPlacementTest(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const startingDifficulty = computeStartingDifficulty(
    profile?.grade ?? 7,
    (profile?.priorExperience as PriorExperience) ?? "NONE"
  );

  const test = await prisma.placementTest.create({
    data: {
      userId,
      status: "IN_PROGRESS",
      currentDifficulty: startingDifficulty,
    },
  });

  return test;
}

function domainRotation(currentDifficulty: number) {
  return currentDifficulty >= 8 ? [...CORE_DOMAINS, "advanced-olympiad"] : CORE_DOMAINS;
}

/** The test can stop early once the difficulty the student is being served has
 * settled into a narrow band — that means we've found their level and further
 * questions add little information. The band is 2 rather than 1 because the
 * served difficulty can drift slightly from the target when the pool is sparse
 * at a given difficulty/topic combination. */
function stabilized(recentDifficulties: number[]): boolean {
  if (recentDifficulties.length < 6) return false;
  const last6 = recentDifficulties.slice(-6);
  return Math.max(...last6) - Math.min(...last6) <= 2;
}

export async function getNextPlacementQuestion(placementTestId: string) {
  const test = await prisma.placementTest.findUniqueOrThrow({
    where: { id: placementTestId },
    include: { attempts: { orderBy: { order: "asc" } } },
  });

  if (test.status === "COMPLETED") return { done: true as const, test };
  if (test.attempts.length >= MAX_QUESTIONS) return { done: true as const, test };
  if (test.attempts.length >= MIN_QUESTIONS) {
    const difficulties = test.attempts.map((a) => a.difficultyAtTime);
    if (stabilized(difficulties)) return { done: true as const, test };
  }

  const rotation = domainRotation(test.currentDifficulty);
  const domainSlug = rotation[test.attempts.length % rotation.length];
  const domain = await prisma.topic.findUnique({ where: { slug: domainSlug } });
  if (!domain) throw new Error(`Missing domain topic: ${domainSlug}`);

  const usedProblemIds = test.attempts.map((a) => a.problemId);
  const target = test.currentDifficulty;

  const candidatePools = [
    [Math.max(1, target - 1), Math.min(10, target + 1)],
    [Math.max(1, target - 2), Math.min(10, target + 2)],
    [1, 10],
  ] as const;

  let candidates: { id: string; difficulty: number }[] = [];
  for (const [min, max] of candidatePools) {
    candidates = await prisma.problem.findMany({
      where: {
        isPlacement: true,
        isPublished: true,
        id: { notIn: usedProblemIds },
        difficulty: { gte: min, lte: max },
        topic: { OR: [{ id: domain.id }, { parentId: domain.id }] },
      },
      select: { id: true, difficulty: true },
    });
    if (candidates.length > 0) break;
  }

  if (candidates.length === 0) {
    // Domain pool exhausted — fall back to any unused placement problem.
    candidates = await prisma.problem.findMany({
      where: { isPlacement: true, isPublished: true, id: { notIn: usedProblemIds } },
      select: { id: true, difficulty: true },
    });
  }

  if (candidates.length === 0) return { done: true as const, test };

  candidates.sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target));
  const bestDistance = Math.abs(candidates[0].difficulty - target);
  const tied = candidates.filter((c) => Math.abs(c.difficulty - target) === bestDistance);
  const chosen = tied[Math.floor(Math.random() * tied.length)];

  const problem = await prisma.problem.findUniqueOrThrow({ where: { id: chosen.id } });

  return {
    done: false as const,
    test,
    problem,
    questionNumber: test.attempts.length + 1,
    minQuestions: MIN_QUESTIONS,
    maxQuestions: MAX_QUESTIONS,
  };
}

export async function submitPlacementAnswer(
  placementTestId: string,
  problemId: string,
  answerGiven: string,
  timeSeconds: number
) {
  const [test, problem] = await Promise.all([
    prisma.placementTest.findUniqueOrThrow({ where: { id: placementTestId } }),
    prisma.problem.findUniqueOrThrow({ where: { id: problemId } }),
  ]);

  const correct = checkAnswer(problem, answerGiven);
  const order = await prisma.placementAttempt.count({ where: { placementTestId } });

  await prisma.placementAttempt.create({
    data: {
      placementTestId,
      problemId,
      order,
      difficultyAtTime: problem.difficulty,
      answerGiven,
      correct,
      timeSeconds,
    },
  });

  let nextDifficulty = test.currentDifficulty;
  let consecutiveCorrect = test.consecutiveCorrect;
  let consecutiveIncorrect = test.consecutiveIncorrect;

  if (correct) {
    nextDifficulty = Math.min(10, nextDifficulty + 1);
    consecutiveCorrect += 1;
    consecutiveIncorrect = 0;
    if (consecutiveCorrect >= 3) {
      nextDifficulty = Math.min(10, nextDifficulty + 1);
      consecutiveCorrect = 0;
    }
  } else {
    nextDifficulty = Math.max(1, nextDifficulty - 1);
    consecutiveIncorrect += 1;
    consecutiveCorrect = 0;
    if (consecutiveIncorrect >= 2) {
      nextDifficulty = Math.max(1, nextDifficulty - 1);
      consecutiveIncorrect = 0;
    }
  }

  await prisma.placementTest.update({
    where: { id: placementTestId },
    data: { currentDifficulty: nextDifficulty, consecutiveCorrect, consecutiveIncorrect },
  });

  const attemptCount = order + 1;
  const difficulties = [
    ...(await prisma.placementAttempt.findMany({
      where: { placementTestId },
      orderBy: { order: "asc" },
      select: { difficultyAtTime: true },
    })).map((a) => a.difficultyAtTime),
  ];

  const shouldFinish =
    attemptCount >= MAX_QUESTIONS || (attemptCount >= MIN_QUESTIONS && stabilized(difficulties));

  if (shouldFinish) {
    const result = await finalizePlacementTest(placementTestId);
    return { correct, done: true as const, result };
  }

  return { correct, done: false as const };
}

function levelFromRating(rating: number): PlacementLevel {
  const tier = ratingTier(rating).label;
  if (tier === "Novice") return "BEGINNER";
  return tier.toUpperCase() as PlacementLevel;
}

export async function finalizePlacementTest(placementTestId: string) {
  const test = await prisma.placementTest.findUniqueOrThrow({
    where: { id: placementTestId },
    include: {
      attempts: { include: { problem: { include: { topic: { include: { parent: true } } } } } },
      user: { include: { profile: true } },
    },
  });

  const domainStats = new Map<string, { correct: number; total: number }>();
  for (const slug of DOMAIN_TOPIC_SLUGS) domainStats.set(slug, { correct: 0, total: 0 });

  let totalCorrect = 0;
  for (const attempt of test.attempts) {
    const topic = attempt.problem.topic;
    const domainSlug = topic.parent?.slug ?? topic.slug;
    const bucket = domainStats.get(domainSlug);
    if (bucket) {
      bucket.total += 1;
      if (attempt.correct) bucket.correct += 1;
    }
    if (attempt.correct) totalCorrect += 1;
  }

  const totalAttempts = test.attempts.length;
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  // Only report domains the student was actually tested on — inventing a score
  // for an unassessed topic would be a fabricated statistic.
  const skillBreakdown: Record<string, number> = {};
  for (const [slug, { correct, total }] of domainStats) {
    if (total === 0) continue;
    skillBreakdown[slug] = Math.round((correct / total) * 100);
  }

  const last6 = test.attempts.slice(-6);
  const finalDifficulty =
    last6.length > 0
      ? last6.reduce((sum, a) => sum + a.difficultyAtTime, 0) / last6.length
      : test.currentDifficulty;

  const base = 950 + Math.round(finalDifficulty * 115);
  const accuracyAdjustment = Math.round((overallAccuracy - 70) * 2);
  const resultRating = Math.max(800, Math.min(2300, base + accuracyAdjustment));
  const resultLevel = levelFromRating(resultRating);

  const testedDomains = Array.from(domainStats.entries()).filter(([, v]) => v.total > 0);
  const strength = testedDomains.length
    ? testedDomains.reduce((best, cur) => (cur[1].correct / cur[1].total > best[1].correct / best[1].total ? cur : best))
    : null;
  const opportunity = testedDomains.length
    ? testedDomains.reduce((worst, cur) => (cur[1].correct / cur[1].total < worst[1].correct / worst[1].total ? cur : worst))
    : null;

  const strengthTopic = strength ? await prisma.topic.findUnique({ where: { slug: strength[0] } }) : null;
  const opportunityTopic = opportunity
    ? await prisma.topic.findUnique({ where: { slug: opportunity[0] } })
    : null;

  const grade = test.user.profile?.grade ?? 7;
  const { competition: recommendedCompetition } = await recommendCompetition(grade, resultRating);

  await prisma.placementTest.update({
    where: { id: placementTestId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      resultRating,
      resultLevel,
      skillBreakdown: JSON.stringify(skillBreakdown),
      strengthTopicId: strengthTopic?.id,
      opportunityTopicId: opportunityTopic?.id,
      recommendedCompetitionId: recommendedCompetition?.id,
    },
  });

  // Side effects: seed the student's overall rating + topic mastery from
  // the placement result, so their dashboard is populated immediately.
  await setRating(test.userId, "OVERALL", resultRating, "Placement Test");

  for (const [slug, pct] of Object.entries(skillBreakdown)) {
    const topic = await prisma.topic.findUnique({ where: { slug } });
    if (!topic) continue;
    const stats = domainStats.get(slug)!;
    await prisma.topicMastery.upsert({
      where: { userId_topicId: { userId: test.userId, topicId: topic.id } },
      update: {
        masteryPercent: pct,
        problemsAttempted: { increment: stats.total },
        problemsCorrect: { increment: stats.correct },
        lastPracticedAt: new Date(),
      },
      create: {
        userId: test.userId,
        topicId: topic.id,
        masteryPercent: pct,
        problemsAttempted: stats.total,
        problemsCorrect: stats.correct,
        lastPracticedAt: new Date(),
      },
    });
  }

  await touchDailyActivity(test.userId);

  // Count the real placement attempts toward lifetime stats so the numbers on
  // the statistics page agree with the attempts the student actually made.
  await prisma.userStats.upsert({
    where: { userId: test.userId },
    update: {
      problemsSolved: { increment: totalAttempts },
      problemsCorrect: { increment: totalCorrect },
    },
    create: {
      userId: test.userId,
      problemsSolved: totalAttempts,
      problemsCorrect: totalCorrect,
    },
  });

  await awardXp(test.userId, 50);
  await checkAndUnlockAchievements(test.userId);

  return prisma.placementTest.findUniqueOrThrow({ where: { id: placementTestId } });
}
