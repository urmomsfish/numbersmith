import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProblemForm } from "@/components/admin/problem-form";
import { updateProblemAction, deleteProblemAction } from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";

export default async function EditProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const [problem, topics, competitions, attemptCount] = await Promise.all([
    prisma.problem.findUnique({ where: { id } }),
    prisma.topic.findMany({ orderBy: { order: "asc" } }),
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
    prisma.attempt.count({ where: { problemId: id } }),
  ]);

  if (!problem) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/admin/problems" className="text-sm font-medium text-slate-700 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        ← Problems
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Edit Problem</h1>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-500">
            {attemptCount} student attempt{attemptCount === 1 ? "" : "s"} recorded
          </p>
        </div>
        <Link
          href={`/practice/${problem.slug}`}
          className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
        >
          View as student →
        </Link>
      </div>

      {sp.saved && (
        <p className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 px-4 py-2 text-sm text-success-600 dark:text-emerald-400">
          Changes saved.
        </p>
      )}

      <div className="mt-6">
        <ProblemForm
          action={updateProblemAction}
          problem={problem}
          topics={topics}
          competitions={competitions}
          error={sp.error}
          submitLabel="Save Changes"
        />
      </div>

      <div className="mt-10 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-5">
        <h2 className="text-sm font-bold text-danger-600 dark:text-red-400">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Deleting this problem also removes {attemptCount} student attempt
          {attemptCount === 1 ? "" : "s"} and any linked mistakes, bookmarks, and lesson references.
          This cannot be undone.
        </p>
        <form action={deleteProblemAction} className="mt-4">
          <input type="hidden" name="id" value={problem.id} />
          <Button type="submit" variant="danger" size="sm">
            Delete Problem
          </Button>
        </form>
      </div>
    </div>
  );
}
