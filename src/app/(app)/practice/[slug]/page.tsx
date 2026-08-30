import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { isProUser } from "@/lib/subscription";
import { hasReachedFreeDailyLimit } from "@/lib/actions/practice-actions";
import { DailyCapUpsell } from "@/components/practice/problem-solver";
import { SolverPageClient } from "./solver-client";

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: { topic: true },
  });
  if (!problem) redirect("/practice");

  const isPro = await isProUser(user.id);
  if (problem.difficulty >= 8 && !isPro) redirect("/pricing");

  if (await hasReachedFreeDailyLimit(user.id)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <DailyCapUpsell />
      </div>
    );
  }

  const next = await prisma.problem.findFirst({
    where: { topicId: problem.topicId, id: { not: problem.id }, isPublished: true },
    orderBy: { difficulty: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/practice" className="text-sm font-medium text-slate-400 hover:text-slate-600">
        ← Back to Problem Database
      </Link>
      <div className="mt-4">
        <SolverPageClient
          problem={{
            id: problem.id,
            question: problem.question,
            format: problem.format,
            choices: parseChoices(problem.choices),
            hints: parseHints(problem.hints),
            difficulty: problem.difficulty,
            topicName: problem.topic.name,
          }}
          nextSlug={next?.slug}
        />
      </div>
    </div>
  );
}
