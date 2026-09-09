import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isProUser } from "@/lib/subscription";
import { canStartSimulation, startOfficialSimulationAction } from "@/lib/actions/simulation-actions";
import { CustomSimulationForm } from "./custom-form";

export default async function SimulationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [competitions, topics, recent, isPro, gate] = await Promise.all([
    prisma.competition.findMany({
      where: { format: { not: "PROOF" } },
      orderBy: { order: "asc" },
    }),
    prisma.topic.findMany({ where: { parentId: null }, orderBy: { order: "asc" } }),
    prisma.competitionAttempt.findMany({
      where: { userId: user.id, status: "SUBMITTED" },
      include: { competition: true },
      orderBy: { submittedAt: "desc" },
      take: 5,
    }),
    isProUser(user.id),
    canStartSimulation(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Competition Simulations</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Full-length, realistically timed practice tests with question navigation and flagging.
      </p>

      {!isPro && (
        <p className="mt-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-400">
          Free plan: {gate.allowed ? `${gate.remaining} simulation${gate.remaining === 1 ? "" : "s"} left this week` : "Weekly simulation limit reached"}.{" "}
          <Link href="/pricing" className="font-semibold underline">
            Unlock unlimited with Pro
          </Link>
        </p>
      )}

      <h2 className="mt-8 text-base font-bold text-slate-900 dark:text-slate-50">Official Formats</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {competitions.map((c) => (
          <Card key={c.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{c.shortName}</h3>
                <Badge tone="slate">
                  {c.format === "INTEGER" ? "Integer" : c.format === "MULTIPLE_CHOICE" ? "MC" : "Short"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {c.numQuestions ?? 20} questions · {c.timeLimitMinutes ?? 60} minutes
              </p>
              <form action={startOfficialSimulationAction} className="mt-4">
                <input type="hidden" name="slug" value={c.slug} />
                <Button type="submit" size="sm" className="w-full" disabled={!gate.allowed}>
                  {gate.allowed ? "Start Simulation" : "Limit Reached"}
                </Button>
              </form>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-base font-bold text-slate-900 dark:text-slate-50">Custom Competition</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Build your own timed set: choose the number of problems, topics, difficulty, and time limit.
      </p>
      <div className="mt-3">
        <CustomSimulationForm topics={topics} isPro={isPro} canStart={gate.allowed} />
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="mt-10 text-base font-bold text-slate-900 dark:text-slate-50">Recent Results</h2>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-card">
            {recent.map((a) => (
              <Link
                key={a.id}
                href={`/simulations/results/${a.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {a.competition.shortName}
                    {a.mode === "CUSTOM" && <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">Custom</span>}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{a.submittedAt?.toLocaleString() ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {a.correctCount}/{a.totalQuestions}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{a.score}%</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
