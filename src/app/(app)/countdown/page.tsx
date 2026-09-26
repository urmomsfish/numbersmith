import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canStartCountdown, startCountdownAction } from "@/lib/actions/countdown-actions";
import { COUNTDOWN_QUESTIONS, SECONDS_PER_QUESTION } from "@/lib/engine/countdown";

export default async function CountdownPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gate = await canStartCountdown(user.id);
  const chosen = await prisma.userCompetition.findMany({
    where: { userId: user.id },
    include: { competition: true },
    orderBy: { isPrimary: "desc" },
  });
  const recent = await prisma.competitionAttempt.findMany({
    where: { userId: user.id, mode: "COUNTDOWN", status: "SUBMITTED" },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });
  const best = recent.reduce((m, r) => Math.max(m, r.correctCount), 0);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-card p-8 text-center dark:border-slate-700">
        <Badge tone="ember" className="mb-3">
          Countdown
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Countdown Round</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {COUNTDOWN_QUESTIONS} questions, {SECONDS_PER_QUESTION} seconds each. Answer and move on.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Questions</dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">{COUNTDOWN_QUESTIONS}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Per question</dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">{SECONDS_PER_QUESTION}s</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Your best</dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {recent.length ? `${best}/${COUNTDOWN_QUESTIONS}` : "—"}
            </dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-1.5 text-left text-sm text-slate-700 dark:text-slate-400">
          <li>• The answer is revealed the moment you pick one.</li>
          <li>• Run out of time on a question and it counts as missed.</li>
          <li>• Stop whenever you like — you keep what you scored.</li>
          <li>• Difficulty follows your rating, so it should feel quick, not impossible.</li>
        </ul>

        {!gate.allowed && (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-400">
            Countdown is a Pro feature.
          </p>
        )}

        <form action={startCountdownAction} className="mt-6">
          {chosen.length > 0 && (
            <label className="mb-3 block text-left">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Draw from
              </span>
              <select
                name="slug"
                className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
              >
                <option value="">Everything at my level</option>
                {chosen.map((c) => (
                  <option key={c.competition.slug} value={c.competition.slug}>
                    {c.competition.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={!gate.allowed}>
            {gate.allowed ? "Start Countdown" : "Upgrade to Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
