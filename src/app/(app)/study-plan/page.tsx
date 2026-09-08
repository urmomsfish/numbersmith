import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { WeekPlanTable } from "@/components/week-plan-table";
import {
  getActiveStudyPlan,
  currentPlanWeek,
  planTotalWeeks,
  phaseForPlanWeek,
  weekDays,
  todaysPlanDay,
  isPlanComplete,
} from "@/lib/engine/study-plan";
import { regenerateStudyPlanAction, saveGoalAction } from "@/lib/actions/study-plan-actions";
import { ratingTier } from "@/lib/types";
import { streakDayKey, streakDayIndex } from "@/lib/streak";

export default async function StudyPlanPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [plan, competitions, rating, nextContest] = await Promise.all([
    getActiveStudyPlan(user.id),
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
    prisma.rating.findUnique({ where: { userId_category: { userId: user.id, category: "OVERALL" } } }),
    // The soonest contest still ahead of the student — what the plan is aimed at.
    prisma.userCompetition.findFirst({
      where: { userId: user.id, targetDate: { gte: streakDayKey() } },
      include: { competition: true },
      orderBy: { targetDate: "asc" },
    }),
  ]);

  const currentRating = rating?.value ?? 1000;

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="font-semibold text-slate-900 dark:text-slate-50">You don&apos;t have an active study plan yet.</p>
        <form action={regenerateStudyPlanAction} className="mt-4">
          <Button type="submit">Generate My Plan</Button>
        </form>
      </div>
    );
  }

  // Server component: renders once per request, so reading the clock is stable here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const totalWeeks = planTotalWeeks(plan);
  const week = currentPlanWeek(plan, totalWeeks);
  // Must match how the plan was generated — see phaseForPlanWeek.
  const phase = phaseForPlanWeek(plan, week);
  const planComplete = isPlanComplete(plan);
  // Whole days on the shared streak boundary, so this counts down in step with
  // everything else rather than at whatever hour the page happens to render.
  const daysUntilCompetition = plan.competitionDate
    ? Math.max(0, streakDayIndex(plan.competitionDate) - streakDayIndex(new Date(now)))
    : null;

  const progressToTarget = plan.targetRating
    ? Math.max(
        0,
        Math.min(
          100,
          ((currentRating - plan.currentRating) / Math.max(1, plan.targetRating - plan.currentRating)) * 100
        )
      )
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Study Planner</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Your plan updates automatically as your mastery and rating change.
          </p>
        </div>
        <form action={regenerateStudyPlanAction}>
          <Button type="submit" variant="outline">
            Regenerate Plan
          </Button>
        </form>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Week {week} of {totalWeeks} · {phase.name}
                </h2>
                {(nextContest?.competition ?? plan.primaryCompetition) && (
                  <Badge tone="brand">
                    {(nextContest?.competition ?? plan.primaryCompetition)!.shortName}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{phase.description}</p>
              {nextContest?.targetDate && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Built around{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {nextContest.competition.shortName}
                  </span>{" "}
                  on{" "}
                  {nextContest.targetDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                  .{" "}
                  <Link href="/schedule" className="text-brand-600 dark:text-brand-400 underline">
                    Edit schedule
                  </Link>
                </p>
              )}
              {!nextContest?.targetDate && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  No contest date set.{" "}
                  <Link href="/schedule" className="text-brand-600 dark:text-brand-400 underline">
                    Add one
                  </Link>{" "}
                  and the plan rebuilds around it.
                </p>
              )}
              {planComplete && (
                <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                  You&apos;ve reached the end of this {totalWeeks}-week plan. Regenerate it to build a
                  fresh one around where your mastery is now.
                </p>
              )}
              <div className="mt-4">
                <WeekPlanTable days={weekDays(plan.days, week)} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => (
                  <span
                    key={w}
                    title={`Week ${w} — ${phaseForPlanWeek(plan, w).name}`}
                    className={
                      "h-1.5 flex-1 min-w-[10px] rounded-full " +
                      (w < week
                        ? "bg-brand-400 dark:bg-brand-500"
                        : w === week
                          ? "bg-brand-600 dark:bg-brand-400"
                          : "bg-slate-200 dark:bg-slate-700")
                    }
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Set a Goal</h2>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Add your competition date and target rating, and the plan rebuilds around it.
              </p>
              <form action={saveGoalAction} className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Competition</span>
                  <select
                    name="competitionSlug"
                    defaultValue={
                      competitions.find((c) => c.id === plan.primaryCompetitionId)?.slug ?? ""
                    }
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
                  >
                    <option value="">No specific competition</option>
                    {competitions.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Competition date
                  </span>
                  <input
                    type="date"
                    name="competitionDate"
                    defaultValue={plan.competitionDate?.toISOString().slice(0, 10) ?? ""}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Target rating
                  </span>
                  <input
                    type="number"
                    name="targetRating"
                    min={800}
                    max={2400}
                    step={10}
                    defaultValue={plan.targetRating ?? currentRating + 150}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Practice per day
                  </span>
                  <select
                    name="minutesPerDay"
                    defaultValue={String(plan.minutesPerDay)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
                  >
                    {[15, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>
                        {m} minutes
                      </option>
                    ))}
                  </select>
                </label>
                <div className="sm:col-span-2">
                  <Button type="submit">Save Goal & Rebuild Plan</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Current Rating
              </p>
              <p className="mt-2 text-4xl font-extrabold text-brand-700 dark:text-brand-300">{currentRating}</p>
              <Badge tone="brand" className="mt-2">
                {ratingTier(currentRating).label}
              </Badge>
            </CardBody>
          </Card>

          {plan.targetRating && (
            <Card>
              <CardBody>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Progress to Target
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{plan.targetRating}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">target</span>
                </div>
                <ProgressBar value={progressToTarget} tone="success" className="mt-3" />
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  {Math.round(progressToTarget)}% of the way from {plan.currentRating}
                </p>
              </CardBody>
            </Card>
          )}

          {daysUntilCompetition !== null && (
            <Card>
              <CardBody className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Days Until Competition
                </p>
                <p className="mt-2 text-4xl font-extrabold text-ember-600 dark:text-ember-400">{daysUntilCompetition}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {/* Stored as UTC midnight, so it must be read back in UTC —
                      otherwise a contest on the 13th renders as the 12th for
                      anyone west of Greenwich. */}
                  {plan.competitionDate?.toLocaleDateString("en-US", { timeZone: "UTC" })}
                </p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Today&apos;s Task
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {todaysPlanDay(plan)?.label ?? "Rest day"}
              </p>
              <LinkButton href="/practice/session" className="mt-4 w-full">
                Start Today&apos;s Practice
              </LinkButton>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
