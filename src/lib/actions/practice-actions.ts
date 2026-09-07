"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnswer, parseHints } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { applyRatingDelta } from "@/lib/engine/rating";
import { touchDailyActivity, recordProblemOutcome, awardXp } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { isProUser, FREE_DAILY_PROBLEM_LIMIT } from "@/lib/subscription";
import { streakDayKey, STREAK_UTC_OFFSET_HOURS } from "@/lib/streak";
import type { AttemptMode, MistakeReason } from "@/lib/types";

export async function getTodayAttemptCount(userId: string) {
  // The free cap resets on the same 00:00 UTC-7 boundary as streaks and the
  // daily challenge. setHours() here was local time — midnight UTC on Vercel —
  // so the cap reset at a different moment than everything else.
  const start = new Date(streakDayKey().getTime() - STREAK_UTC_OFFSET_HOURS * 60 * 60 * 1000);
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

  // Re-answering a problem you already missed must not pay out. Otherwise the
  // mistake queue becomes the cheapest XP and rating in the app: the questions
  // are ones you have already seen the solution to, and they can be cycled
  // repeatedly. Mastery, streak, and the mistake bookkeeping still apply —
  // review is real practice, it just isn't rewarded twice.
  const isReview = mode === "MISTAKE_REVIEW";

  await updateTopicAndDomainMastery(user.id, problem.topicId, correct);
  const ratingResult = isReview
    ? { delta: 0, value: null as number | null }
    : await applyRatingDelta(
        user.id,
        "OVERALL",
        problem.difficulty,
        correct,
        mode === "DAILY_CHALLENGE" ? "Daily Challenge" : "Practice session"
      );
  await touchDailyActivity(user.id);
  await recordProblemOutcome(user.id, correct);

  const xp = isReview ? 0 : xpForDifficulty(problem.difficulty, correct);
  if (xp > 0) await awardXp(user.id, xp);

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
