import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProblemForm } from "@/components/admin/problem-form";
import { createProblemAction } from "@/lib/actions/admin-actions";

export default async function NewProblemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [topics, competitions] = await Promise.all([
    prisma.topic.findMany({ orderBy: { order: "asc" } }),
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/admin/problems" className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        ← Problems
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-50">New Problem</h1>

      <div className="mt-6">
        <ProblemForm
          action={createProblemAction}
          topics={topics}
          competitions={competitions}
          error={params.error}
          submitLabel="Create Problem"
        />
      </div>
    </div>
  );
}
