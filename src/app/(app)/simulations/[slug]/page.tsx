import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { canStartSimulation, startOfficialSimulationAction } from "@/lib/actions/simulation-actions";
import { FORMAT_LABEL } from "@/lib/competition-meta";

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

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <Badge tone="brand" className="mb-3">
          Simulation
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900">{competition.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{competition.shortName} full-length practice test</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-[11px] uppercase text-slate-400">Questions</dt>
            <dd className="text-lg font-bold text-slate-900">{competition.numQuestions ?? 20}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-[11px] uppercase text-slate-400">Time</dt>
            <dd className="text-lg font-bold text-slate-900">{competition.timeLimitMinutes ?? 60}m</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-[11px] uppercase text-slate-400">Format</dt>
            <dd className="text-xs font-bold text-slate-900">{FORMAT_LABEL[competition.format]}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-1.5 text-left text-sm text-slate-500">
          <li>• The timer starts as soon as you begin and cannot be paused.</li>
          <li>• You can flag questions and navigate freely between them.</li>
          <li>• Answers and solutions stay hidden until you submit.</li>
          <li>• The test auto-submits when time expires.</li>
        </ul>

        {!gate.allowed && (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You&apos;ve used your free simulations for this week.
          </p>
        )}

        <form action={startOfficialSimulationAction} className="mt-6">
          <input type="hidden" name="slug" value={competition.slug} />
          <Button type="submit" size="lg" className="w-full" disabled={!gate.allowed}>
            {gate.allowed ? "Begin Simulation" : "Upgrade to Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
