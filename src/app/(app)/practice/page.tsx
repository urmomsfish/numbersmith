import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel } from "@/lib/types";
import { PracticeFilters } from "./filters";

const PAGE_SIZE = 20;

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{
    topic?: string;
    competition?: string;
    difficulty?: string;
    format?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const isPro = await isProUser(user.id);

  const [domains, subtopics, competitions] = await Promise.all([
    prisma.topic.findMany({ where: { parentId: null }, orderBy: { order: "asc" } }),
    prisma.topic.findMany({ where: { NOT: { parentId: null } }, orderBy: { order: "asc" } }),
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
  ]);

  const selectedTopic = params.topic
    ? (domains.find((t) => t.slug === params.topic) ?? subtopics.find((t) => t.slug === params.topic))
    : null;

  const topicFilter = selectedTopic
    ? domains.some((d) => d.id === selectedTopic.id)
      ? { OR: [{ topicId: selectedTopic.id }, { topic: { parentId: selectedTopic.id } }] }
      : { topicId: selectedTopic.id }
    : {};

  const where = {
    isPublished: true,
    ...topicFilter,
    ...(params.competition ? { competition: { slug: params.competition } } : {}),
    ...(params.format ? { format: params.format } : {}),
    ...(params.difficulty ? { difficulty: Number(params.difficulty) } : {}),
    ...(params.q ? { question: { contains: params.q } } : {}),
  };

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      include: { topic: true, competition: true },
      orderBy: { difficulty: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.problem.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Problem Database</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{total} problems match your filters.</p>
        </div>
        <LinkButton href={`/practice/session${params.topic ? `?topic=${params.topic}` : ""}`}>
          Start Adaptive Session →
        </LinkButton>
      </div>

      <div className="mt-6">
        <PracticeFilters domains={domains} subtopics={subtopics} competitions={competitions} current={params} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => {
          const locked = p.difficulty >= 8 && !isPro;
          return (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4"
            >
              <div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="brand">{p.topic.name}</Badge>
                  <Badge tone="slate">{difficultyLabel(p.difficulty)}</Badge>
                  {p.competition && <Badge tone="ember">{p.competition.shortName}</Badge>}
                  {locked && <Badge tone="warning">⭐ Pro</Badge>}
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{p.question}</p>
              </div>
              <div className="mt-4">
                {locked ? (
                  <Link href="/pricing" className="text-sm font-semibold text-ember-600 dark:text-ember-400 hover:text-ember-700">
                    Unlock with Pro →
                  </Link>
                ) : (
                  <Link href={`/practice/${p.slug}`} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                    Solve →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {problems.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-slate-700 dark:text-slate-500">
            No problems match these filters. Try broadening your search.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const qs = new URLSearchParams({ ...params, page: String(p) } as Record<string, string>);
            return (
              <Link
                key={p}
                href={`/practice?${qs.toString()}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  p === page ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"
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
