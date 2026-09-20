import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { isProUser } from "@/lib/subscription";
import { canReviewMistakes } from "@/lib/actions/mistake-actions";
import { SessionRunner } from "@/app/(app)/practice/session/session-runner";

export default async function MistakeReviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isPro = await isProUser(user.id);

  const gate = await canReviewMistakes(user.id);
  if (!gate.allowed) redirect("/pricing?from=mistake-review-limit");

  const mistakes = await prisma.mistake.findMany({
    where: { userId: user.id, resolved: false, nextReviewAt: { lte: new Date() } },
    include: { problem: { include: { topic: true } } },
    orderBy: { nextReviewAt: "asc" },
    take: isPro ? 15 : Math.min(5, gate.remaining ?? 0),
  });

  if (mistakes.length === 0) redirect("/mistakes");

  return (
    <SessionRunner
      topicName="Mistake Review"
      focusMessage="These are problems you previously missed — resolving them removes them from your review queue."
      isPro={isPro}
      mode="MISTAKE_REVIEW"
      problems={mistakes.map((m) => ({
        id: m.problem.id,
        question: m.problem.question,
        diagram: m.problem.diagram,
        format: m.problem.format,
        choices: parseChoices(m.problem.choices),
        hints: parseHints(m.problem.hints),
        difficulty: m.problem.difficulty,
        topicName: m.problem.topic.name,
      }))}
    />
  );
}
