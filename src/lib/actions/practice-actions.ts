"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnswer, parseHints } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { applyRatingDelta } from "@/lib/engine/rating";
import { touchDailyActivity, recordProblemOutcome, awardXp } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { isProUser, FREE_DAILY_PROBLEM_LIMIT } from "@/lib/subscription";
import type { AttemptMode, MistakeReason } from "@/lib/types";

export async function getTodayAttemptCount(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return prisma.attempt.count({ where: { userId, createdAt: { gte: start } } });
}

export async function hasReachedFreeDailyLimit(userId: string): Promise<boolean> {
  if (await isProUser(userId)) return false;
  const count = await getTodayAttemptCount(userId);
  return count >= FREE_DAILY_PROBLEM_LIMIT;
}

function xpForDifficulty(difficulty: number, correct: boolean) {
  if (!correct) return 3; // small participation XP even on a miss
  return 8 + difficulty * 2;
}

export async function submitPracticeAnswerAction(input: {
  problemId: string;
  answerGiven: string;
  timeSeconds: number;
  hintsUsed: number;
  mode?: AttemptMode;
}) {
  const user = await requireUser();

  if (await hasReachedFreeDailyLimit(user.id)) {
    return { capped: true as const };
  }

  const problem = await prisma.problem.findUniqueOrThrow({ where: { id: input.problemId } });
  const correct = checkAnswer(problem, input.answerGiven);
  const mode: AttemptMode = input.mode ?? "PRACTICE";

  await prisma.attempt.create({
    data: {
      userId: user.id,
      problemId: problem.id,
      mode,
      answerGiven: input.answerGiven,
      correct,
      timeSeconds: input.timeSeconds,
      hintsUsed: input.hintsUsed,
    },
  });

  await updateTopicAndDomainMastery(user.id, problem.topicId, correct);
  const ratingResult = await applyRatingDelta(
    user.id,
    "OVERALL",
    problem.difficulty,
    correct,
    mode === "DAILY_CHALLENGE" ? "Daily Challenge" : "Practice session"
  );
  await touchDailyActivity(user.id);
  await recordProblemOutcome(user.id, correct);

  const xp = xpForDifficulty(problem.difficulty, correct);
  await awardXp(user.id, xp);

  if (!correct || input.hintsUsed >= 2 || input.timeSeconds > problem.estimatedTimeSeconds * 2) {
    const reason: MistakeReason = !correct ? "INCORRECT" : input.hintsUsed >= 2 ? "MULTI_HINT" : "SLOW";
    await prisma.mistake.upsert({
      where: { userId_problemId: { userId: user.id, problemId: problem.id } },
      update: {
        reason,
        resolved: correct,
        nextReviewAt: new Date(Date.now() + (correct ? 7 : 2) * 24 * 60 * 60 * 1000),
      },
      create: {
        userId: user.id,
        problemId: problem.id,
        reason,
        nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });
  } else {
    // Clean, fast, unaided correct answer resolves any prior mistake entry.
    await prisma.mistake.updateMany({
      where: { userId: user.id, problemId: problem.id },
      data: { resolved: true },
    });
  }

  const newlyUnlocked = await checkAndUnlockAchievements(user.id);

  return {
    capped: false as const,
    correct,
    solution: problem.solution,
    correctAnswer: problem.answer,
    ratingDelta: ratingResult.delta,
    newRating: ratingResult.value,
    xpAwarded: xp,
    newlyUnlocked: newlyUnlocked.map((a) => ({ name: a.name, icon: a.icon, xpReward: a.xpReward })),
  };
}

export async function getHintsForProblem(problemId: string) {
  const problem = await prisma.problem.findUniqueOrThrow({ where: { id: problemId } });
  return parseHints(problem.hints);
}
