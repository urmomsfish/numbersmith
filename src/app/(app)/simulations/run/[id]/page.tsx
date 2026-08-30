import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChoices } from "@/lib/engine/scoring";
import { TestRunner } from "./test-runner";

export default async function SimulationRunPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const attempt = await prisma.competitionAttempt.findUnique({
    where: { id },
    include: {
      competition: true,
      items: { include: { problem: true }, orderBy: { order: "asc" } },
    },
  });

  if (!attempt || attempt.userId !== user.id) redirect("/simulations");
  if (attempt.status === "SUBMITTED") redirect(`/simulations/results/${attempt.id}`);

  // Server component: renders once per request, so the clock read is stable for
  // this render. The client timer counts down from the value we hand it, which
  // keeps the remaining time correct even if the student reloads mid-test.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - attempt.startedAt.getTime()) / 1000);
  const remainingSeconds = Math.max(0, attempt.timeLimitSeconds - elapsedSeconds);

  return (
    <TestRunner
      attemptId={attempt.id}
      title={attempt.mode === "CUSTOM" ? "Custom Competition" : attempt.competition.name}
      shortName={attempt.mode === "CUSTOM" ? "Custom" : attempt.competition.shortName}
      remainingSeconds={remainingSeconds}
      items={attempt.items.map((item) => ({
        id: item.id,
        order: item.order,
        question: item.problem.question,
        format: item.problem.format,
        choices: parseChoices(item.problem.choices),
      }))}
    />
  );
}
