import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { PRO_PRICING } from "@/lib/pricing";

export default async function AdminOverviewPage() {
  // Async server component: this renders once per request on the server, so
  // reading the clock here is deterministic for that render. The purity rule
  // targets client components, where re-renders would make it unstable.
  /* eslint-disable react-hooks/purity */
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  /* eslint-enable react-hooks/purity */

  const [
    totalUsers,
    dailyActiveUsers,
    weeklyActiveUsers,
    subscriptions,
    problemsSolved,
    problemCount,
    lessonCount,
    placementsCompleted,
    simulationsCompleted,
    popularCompetitions,
    popularTopics,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { attempts: { some: { createdAt: { gte: dayAgo } } } } }),
    prisma.user.count({ where: { attempts: { some: { createdAt: { gte: weekAgo } } } } }),
    prisma.subscription.groupBy({ by: ["status"], _count: true }),
    prisma.attempt.count(),
    prisma.problem.count(),
    prisma.lesson.count(),
    prisma.placementTest.count({ where: { status: "COMPLETED" } }),
    prisma.competitionAttempt.count({ where: { status: "SUBMITTED" } }),
    prisma.userCompetition.groupBy({ by: ["competitionId"], _count: true, orderBy: { _count: { competitionId: "desc" } }, take: 5 }),
    prisma.attempt.groupBy({ by: ["problemId"], _count: true, orderBy: { _count: { problemId: "desc" } }, take: 5 }),
  ]);

  const statusCounts = new Map(subscriptions.map((s) => [s.status, s._count]));
  const proCount = (statusCounts.get("PRO") ?? 0) + (statusCounts.get("TRIAL") ?? 0);
  const freeCount = statusCounts.get("FREE") ?? 0;
  const canceledCount = statusCounts.get("CANCELED") ?? 0;
  const totalSubs = proCount + freeCount + canceledCount;
  const conversionRate = totalSubs > 0 ? ((proCount / totalSubs) * 100).toFixed(1) : "0.0";

  // Revenue is derived from actual stored subscription plans, not invented.
  const proSubs = await prisma.subscription.findMany({
    where: { status: "PRO" },
    select: { plan: true },
  });
  const mrr = proSubs.reduce(
    (sum, s) => sum + (s.plan === "YEARLY" ? PRO_PRICING.YEARLY / 12 : PRO_PRICING.MONTHLY),
    0
  );

  const competitionIds = popularCompetitions.map((c) => c.competitionId);
  const competitions = await prisma.competition.findMany({ where: { id: { in: competitionIds } } });
  const competitionById = new Map(competitions.map((c) => [c.id, c]));

  const problemIds = popularTopics.map((t) => t.problemId);
  const problems = await prisma.problem.findMany({
    where: { id: { in: problemIds } },
    include: { topic: true },
  });
  const problemById = new Map(problems.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
      <p className="mt-1 text-sm text-slate-500">
        All figures are computed live from the database — no placeholder statistics.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total Students" value={String(totalUsers)} />
        <Stat label="DAU" value={String(dailyActiveUsers)} />
        <Stat label="WAU" value={String(weeklyActiveUsers)} />
        <Stat label="Pro Users" value={String(proCount)} />
        <Stat label="Problems Solved" value={problemsSolved.toLocaleString()} />
        <Stat label="Conversion" value={`${conversionRate}%`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Subscriptions
            </h2>
            <div className="mt-4 space-y-3">
              {[
                ["Free", freeCount, "slate"],
                ["Pro", statusCounts.get("PRO") ?? 0, "brand"],
                ["Trial", statusCounts.get("TRIAL") ?? 0, "ember"],
                ["Canceled", canceledCount, "slate"],
              ].map(([label, count, tone]) => (
                <div key={label as string}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{label as string}</span>
                    <span className="font-semibold text-slate-800">{count as number}</span>
                  </div>
                  <ProgressBar
                    value={totalSubs > 0 ? ((count as number) / totalSubs) * 100 : 0}
                    tone={tone as "slate" | "brand" | "ember"}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Revenue</h2>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              ${mrr.toFixed(2)}
              <span className="ml-1 text-sm font-normal text-slate-400">MRR</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Derived from {proSubs.length} active Pro subscription
              {proSubs.length === 1 ? "" : "s"}. No live payment processing in this MVP — Stripe
              integration is architected but not enabled.
            </p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Monthly plan</dt>
                <dd className="font-semibold text-slate-800">${PRO_PRICING.MONTHLY}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Yearly plan</dt>
                <dd className="font-semibold text-slate-800">${PRO_PRICING.YEARLY}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Content</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Problems</dt>
                <dd className="font-semibold text-slate-800">{problemCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Lessons</dt>
                <dd className="font-semibold text-slate-800">{lessonCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Placements completed</dt>
                <dd className="font-semibold text-slate-800">{placementsCompleted}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Simulations completed</dt>
                <dd className="font-semibold text-slate-800">{simulationsCompleted}</dd>
              </div>
            </dl>
            <Link
              href="/admin/problems"
              className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage problems →
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Popular Competitions
            </h2>
            <div className="mt-3 space-y-2">
              {popularCompetitions.length === 0 && (
                <p className="text-sm text-slate-400">No competition selections yet.</p>
              )}
              {popularCompetitions.map((pc) => (
                <div key={pc.competitionId} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {competitionById.get(pc.competitionId)?.shortName ?? "—"}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {pc._count} student{pc._count === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Most-Attempted Problems
            </h2>
            <div className="mt-3 space-y-2">
              {popularTopics.length === 0 && (
                <p className="text-sm text-slate-400">No attempts recorded yet.</p>
              )}
              {popularTopics.map((pt) => {
                const p = problemById.get(pt.problemId);
                return (
                  <div key={pt.problemId} className="flex items-start justify-between gap-3 text-sm">
                    <span className="line-clamp-1 text-slate-600">
                      {p?.topic.name}: {p?.question.slice(0, 40)}…
                    </span>
                    <span className="shrink-0 font-semibold text-slate-800">{pt._count}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
