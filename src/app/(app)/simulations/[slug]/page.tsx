import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { canStartSimulation, startOfficialSimulationAction } from "@/lib/actions/simulation-actions";
import { FORMAT_LABEL } from "@/lib/competition-meta";
import { levelsFor, levelForGrade } from "@/lib/competition-levels";

export default async function StartSimulationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const competition = await prisma.competition.findUnique({ where: { slug } });
  if (!competition || competition.format === "PROOF") redirect("/simulations");

  const gate = await canStartSimulation(user.id);

  // Contests that are really several papers under one name ask which one to
  // sit. The student's own grade picks the default, so the common case is a
  // glance rather than a decision.
  const levels = levelsFor(slug);
  const profile = levels.length
    ? await prisma.profile.findUnique({ where: { userId: user.id }, select: { grade: true } })
    : null;
  const defaultLevel = levels.length
    ? levelForGrade(slug, profile?.grade ?? competition.gradeMin)
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-8 text-center">
        <Badge tone="brand" className="mb-3">
          Simulation
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{competition.name}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{competition.shortName} full-length practice test</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Questions</dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {defaultLevel?.numQuestions ?? competition.numQuestions ?? 20}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Time</dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {defaultLevel?.timeLimitMinutes ?? competition.timeLimitMinutes ?? 60}m
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Format</dt>
            <dd className="text-xs font-bold text-slate-900 dark:text-slate-50">{FORMAT_LABEL[competition.format]}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-1.5 text-left text-sm text-slate-700 dark:text-slate-400">
          <li>• The timer starts as soon as you begin and cannot be paused.</li>
          <li>• You can flag questions and navigate freely between them.</li>
          <li>• Answers and solutions stay hidden until you submit.</li>
          <li>• The test auto-submits when time expires.</li>
        </ul>

        {!gate.allowed && (
          <p className="mt-5 rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-800 dark:text-amber-400">
            Full-length simulations are a Pro feature.
          </p>
        )}

        <form action={startOfficialSimulationAction} className="mt-6">
          <input type="hidden" name="slug" value={competition.slug} />
          {levels.length > 0 && (
            <label className="mb-3 block text-left">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Which paper are you sitting?
              </span>
              <select
                name="level"
                defaultValue={defaultLevel?.id}
                className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
              >
                {levels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} — {l.numQuestions} questions, {l.timeLimitMinutes} min
                  </option>
                ))}
              </select>
              <span className="mt-1.5 block text-[11px] text-slate-600 dark:text-slate-400">
                Set from your grade. Each level is a different paper, not the same test
                re-timed.
              </span>
            </label>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={!gate.allowed}>
            {gate.allowed ? "Begin Simulation" : "Upgrade to Continue"}
          </Button>
        </form>

        {/* The same paper, laid out for a printer. Competition maths is sat
            with a pencil, and practising only on screen trains a different
            skill from the one the contest tests. */}
        {gate.allowed && (
          <a
            href={`/paper/${competition.slug}${defaultLevel ? `?level=${defaultLevel.id}` : ""}`}
            className="mt-3 inline-block text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Print this paper instead
          </a>
        )}
      </div>
    </div>
  );
}
