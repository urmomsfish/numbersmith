import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { getActiveStudyPlan, planTotalWeeks, weekDays } from "@/lib/engine/study-plan";
import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/lib/actions/onboarding-actions";
import { WeekPlanTable } from "@/components/week-plan-table";

const DOMAIN_LABELS: Record<string, string> = {
  arithmetic: "Arithmetic",
  algebra: "Algebra",
  geometry: "Geometry",
  "number-theory": "Number Theory",
  combinatorics: "Combinatorics",
  probability: "Probability",
  logic: "Logic",
};

export default async function OnboardingPlanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [userCompetitions, placementTest, plan] = await Promise.all([
    prisma.userCompetition.findMany({
      where: { userId: user.id },
      include: { competition: true },
      orderBy: { isPrimary: "desc" },
    }),
    prisma.placementTest.findFirst({
      where: { userId: user.id, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    }),
    getActiveStudyPlan(user.id),
  ]);

  if (!plan) redirect("/onboarding/competitions");

  const skillBreakdown: Record<string, number> = placementTest?.skillBreakdown
    ? JSON.parse(placementTest.skillBreakdown)
    : {};
  const strongest = Object.entries(skillBreakdown).sort((a, b) => b[1] - a[1])[0];
  const focusTopics = Object.entries(skillBreakdown)
    .filter(([slug]) => slug !== "advanced-olympiad")
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([slug]) => DOMAIN_LABELS[slug] ?? slug);

  const primary = userCompetitions.find((c) => c.isPrimary);
  const secondary = userCompetitions.find((c) => !c.isPrimary);

  return (
    <OnboardingShell activeStep="PLAN">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">Your Training Profile</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Here&apos;s the personalized plan NumberSmith built from your placement results and goals.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <ProfileStat label="Primary Goal" value={primary?.competition.shortName ?? "—"} />
          <ProfileStat label="Secondary Goal" value={secondary?.competition.shortName ?? "—"} />
          <ProfileStat label="Current Rating" value={String(plan.currentRating)} />
          <ProfileStat label="Strongest Topic" value={strongest ? DOMAIN_LABELS[strongest[0]] ?? strongest[0] : "—"} />
          <ProfileStat label="Focus Topics" value={focusTopics.join(" + ") || "—"} />
          <ProfileStat label="Recommended Practice" value={`${plan.minutesPerDay} minutes/day`} />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Your {planTotalWeeks(plan)}-week training plan
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Week 1 of {planTotalWeeks(plan)} is below. The plan moves through foundations, then
            heavier mixed practice, then contest simulation — and it updates as your mastery changes.
          </p>
          <div className="mt-5">
            <WeekPlanTable days={weekDays(plan.days, 1)} />
          </div>
        </div>

        <form action={completeOnboardingAction} className="mt-8 flex justify-center">
          <Button type="submit" size="lg">
            Start Training →
          </Button>
        </form>
      </div>
    </OnboardingShell>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
