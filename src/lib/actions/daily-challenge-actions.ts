"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { applyRatingDelta } from "@/lib/engine/rating";
import { touchDailyActivity, recordProblemOutcome, awardXp } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { streakDayKey } from "@/lib/streak";

const DAILY_CHALLENGE_BONUS_XP = 40;

export async function submitDailyChallengeAction(input: {
  dailyChallengeId: string;
  answerGiven: string;
  timeSeconds: number;
}) {
  const user = await requireUser();

  const challenge = await prisma.dailyChallenge.findUniqueOrThrow({
    where: { id: input.dailyChallengeId },
    include: { problem: true },
  });

  // The challenge must be *today's*.
  //
  // A Server Action is a public endpoint, so the id arriving here is whatever
  // the caller sent, not necessarily what the page rendered. Every past day's
  // challenge is still a live row with its own id, and the only other guard is
  // one-attempt-per-challenge — so walking backwards through historical ids
  // paid out 40 + difficulty x 3 bonus XP per day, plus a rating change, for
  // as many days as the app has existed.
  //
  // Compared through streakDayKey rather than by arithmetic on timestamps: the
  // day boundary is midnight US Pacific and DST-aware, and DailyChallenge.date
  // is that day normalised to UTC midnight, which is what streakDayKey returns.
  if (challenge.date.getTime() !== streakDayKey().getTime()) {
    return {
      expired: true as const,
      correct: false,
      solution: challenge.problem.solution,
      correctAnswer: challenge.problem.answer,
    };
  }

  const already = await prisma.dailyChallengeAttempt.findUnique({
    where: { userId_dailyChallengeId: { userId: user.id, dailyChallengeId: challenge.id } },
  });
  if (already) {
    return {
      expired: false as const,
      alreadyDone: true as const,
      correct: already.correct,
      solution: challenge.problem.solution,
      correctAnswer: challenge.problem.answer,
    };
  }

  const correct = checkAnswer(challenge.problem, input.answerGiven);
  const xp = correct ? DAILY_CHALLENGE_BONUS_XP + challenge.problem.difficulty * 3 : 10;

  await prisma.dailyChallengeAttempt.create({
    data: {
      userId: user.id,
      dailyChallengeId: challenge.id,
      correct,
      timeSeconds: input.timeSeconds,
      xpAwarded: xp,
    },
  });

  await prisma.attempt.create({
    data: {
      userId: user.id,
      problemId: challenge.problemId,
      mode: "DAILY_CHALLENGE",
      answerGiven: input.answerGiven,
      correct,
      timeSeconds: input.timeSeconds,
    },
  });

  await updateTopicAndDomainMastery(user.id, challenge.problem.topicId, correct);
  const ratingResult = await applyRatingDelta(
    user.id,
    "OVERALL",
    challenge.problem.difficulty,
    correct,
    "Daily Challenge"
  );
  await touchDailyActivity(user.id);
  await recordProblemOutcome(user.id, correct);
  await awardXp(user.id, xp);

  if (!correct) {
    await prisma.mistake.upsert({
      where: { userId_problemId: { userId: user.id, problemId: challenge.problemId } },
      update: { reason: "INCORRECT", resolved: false },
      create: {
        userId: user.id,
        problemId: challenge.problemId,
        reason: "INCORRECT",
        nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const newlyUnlocked = await checkAndUnlockAchievements(user.id);

  return {
    expired: false as const,
    alreadyDone: false as const,
    correct,
    solution: challenge.problem.solution,
    correctAnswer: challenge.problem.answer,
    xpAwarded: xp,
    ratingDelta: ratingResult.delta,
    newlyUnlocked: newlyUnlocked.map((a) => ({ name: a.name, icon: a.icon })),
  };
}
