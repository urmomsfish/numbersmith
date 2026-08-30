"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { applyRatingDelta } from "@/lib/engine/rating";
import { touchDailyActivity, recordProblemOutcome, awardXp } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";

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

  const already = await prisma.dailyChallengeAttempt.findUnique({
    where: { userId_dailyChallengeId: { userId: user.id, dailyChallengeId: challenge.id } },
  });
  if (already) {
    return {
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
    alreadyDone: false as const,
    correct,
    solution: challenge.problem.solution,
    correctAnswer: challenge.problem.answer,
    xpAwarded: xp,
    ratingDelta: ratingResult.delta,
    newlyUnlocked: newlyUnlocked.map((a) => ({ name: a.name, icon: a.icon })),
  };
}
