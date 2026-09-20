import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { togglePublishAction } from "@/lib/actions/admin-actions";
import { difficultyLabel } from "@/lib/types";

const PAGE_SIZE = 25;

export default async function AdminProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string; page?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(params.q ? { question: { contains: params.q } } : {}),
    ...(params.topic ? { topic: { slug: params.topic } } : {}),
  };

  const [problems, total, topics] = await Promise.all([
    prisma.problem.findMany({
      where,
      include: { topic: true, competition: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.problem.count({ where }),
    prisma.topic.findMany({ orderBy: { order: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Problem Management</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{total} problems in the database.</p>
        </div>
        <LinkButton href="/admin/problems/new">+ New Problem</LinkButton>
      </div>

      {params.deleted && (
        <p className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 px-4 py-2 text-sm text-success-600 dark:text-emerald-400">
          Problem deleted.
        </p>
      )}

      <form className="mt-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-3">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search question text…"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"
        />
        <select
          name="topic"
          defaultValue={params.topic ?? ""}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.parentId ? `— ${t.name}` : t.name}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm">
          Filter
        </Button>
      </form>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">
              <th className="px-4 py-2.5">Question</th>
              <th className="px-3 py-2.5">Topic</th>
              <th className="px-3 py-2.5">Difficulty</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {problems.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="max-w-md px-4 py-2.5">
                  <Link
                    href={`/admin/problems/${p.id}`}
                    className="line-clamp-1 font-medium text-slate-800 dark:text-slate-100 hover:text-brand-700 dark:hover:text-brand-300"
                  >
                    {p.question}
                  </Link>
                  <p className="text-[11px] text-slate-700 dark:text-slate-500">{p.slug}</p>
                </td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{p.topic.name}</td>
                <td className="px-3 py-2.5">
                  <Badge tone="slate">
                    {p.difficulty} · {difficultyLabel(p.difficulty)}
                  </Badge>
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={p.isPublished ? "success" : "warning"}>
                    {p.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <form action={togglePublishAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                    >
                      {p.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-700 dark:text-slate-500">
                  No problems match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const qs = new URLSearchParams();
            if (params.q) qs.set("q", params.q);
            if (params.topic) qs.set("topic", params.topic);
            qs.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/admin/problems?${qs.toString()}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  p === page
                    ? "bg-brand-600 text-white"
                    : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
