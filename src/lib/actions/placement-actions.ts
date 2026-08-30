"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitPlacementAnswer, getNextPlacementQuestion } from "@/lib/engine/placement";
import { parseChoices } from "@/lib/engine/scoring";

export type PlacementQuestionPayload = {
  id: string;
  question: string;
  format: string;
  choices: string[];
  difficulty: number;
  topicName: string;
  questionNumber: number;
  minQuestions: number;
  maxQuestions: number;
};

export async function submitPlacementAnswerAction(input: {
  testId: string;
  problemId: string;
  answerGiven: string;
  timeSeconds: number;
}): Promise<
  | { done: true; correct: boolean; testId: string }
  | { done: false; correct: boolean; next: PlacementQuestionPayload }
> {
  const user = await requireUser();

  const test = await prisma.placementTest.findUniqueOrThrow({ where: { id: input.testId } });
  if (test.userId !== user.id) throw new Error("Not your placement test");

  const result = await submitPlacementAnswer(
    input.testId,
    input.problemId,
    input.answerGiven,
    input.timeSeconds
  );

  if (result.done) {
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (profile?.onboardingStep === "PLACEMENT") {
      await prisma.profile.update({ where: { userId: user.id }, data: { onboardingStep: "RESULTS" } });
    }
    return { done: true, correct: result.correct, testId: input.testId };
  }

  const next = await getNextPlacementQuestion(input.testId);
  if (next.done || !next.problem) {
    // Pool exhausted unexpectedly — finalize gracefully instead of erroring.
    const { finalizePlacementTest } = await import("@/lib/engine/placement");
    await finalizePlacementTest(input.testId);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (profile?.onboardingStep === "PLACEMENT") {
      await prisma.profile.update({ where: { userId: user.id }, data: { onboardingStep: "RESULTS" } });
    }
    return { done: true, correct: result.correct, testId: input.testId };
  }

  const topic = await prisma.topic.findUniqueOrThrow({ where: { id: next.problem.topicId } });

  return {
    done: false,
    correct: result.correct,
    next: {
      id: next.problem.id,
      question: next.problem.question,
      format: next.problem.format,
      choices: parseChoices(next.problem.choices),
      difficulty: next.problem.difficulty,
      topicName: topic.name,
      questionNumber: next.questionNumber,
      minQuestions: next.minQuestions,
      maxQuestions: next.maxQuestions,
    },
  };
}
