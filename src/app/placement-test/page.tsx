import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startPlacementTest, getNextPlacementQuestion } from "@/lib/engine/placement";
import { parseChoices } from "@/lib/engine/scoring";
import { PlacementRunner } from "./placement-runner";

export default async function PlacementTestPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let test = await prisma.placementTest.findFirst({
    where: { userId: user.id, status: "IN_PROGRESS" },
    orderBy: { startedAt: "desc" },
  });

  if (!test) {
    test = await startPlacementTest(user.id);
  }

  const next = await getNextPlacementQuestion(test.id);
  if (next.done || !next.problem) {
    redirect(`/placement-test/results?test=${test.id}`);
  }

  const topic = await prisma.topic.findUniqueOrThrow({ where: { id: next.problem.topicId } });

  return (
    <PlacementRunner
      testId={test.id}
      initialQuestion={{
        id: next.problem.id,
        question: next.problem.question,
        format: next.problem.format,
        choices: parseChoices(next.problem.choices),
        difficulty: next.problem.difficulty,
        topicName: topic.name,
        questionNumber: next.questionNumber,
        minQuestions: next.minQuestions,
        maxQuestions: next.maxQuestions,
      }}
    />
  );
}
