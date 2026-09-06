import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { IconFlame } from "@/components/app/icons";
import { getActiveStudyPlan, todaysPlanDay } from "@/lib/engine/study-plan";
import { pickPriorityTopic } from "@/lib/engine/practice";
import { ratingTier } from "@/lib/types";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [profile, stats, rating, userCompetitions, plan, priorityTopic] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.userStats.findUnique({ where: { userId: user.id } }),
    prisma.rating.findUnique({ where: { userId_category: { userId: user.id, category: "OVERALL" } } }),
    prisma.userCompetition.findMany({
      where: { userId: user.id },
      include: { competition: { include: { topics: { include: { topic: true } } } } },
      orderBy: { isPrimary: "desc" },
    }),
    getActiveStudyPlan(user.id),
    pickPriorityTopic(user.id),
  ]);

  const allMastery = await prisma.topicMastery.findMany({ where: { userId: user.id } });
  const masteryByTopicId = new Map(allMastery.map((m) => [m.topicId, m.masteryPercent]));
  const priorityMastery = masteryByTopicId.get(priorityTopic.id) ?? 40;

  const competitionProgress = userCompetitions.map((uc) => {
    const topics = uc.competition.topics;
    let weightedSum = 0;
    let weightTotal = 0;
    for (const ct of topics) {
      const m = masteryByTopicId.get(ct.topicId) ?? 35;
      weightedSum += m * ct.weight;
      weightTotal += ct.weight;
    }
    const pct = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 35;
    return { competition: uc.competition, pct, isPrimary: uc.isPrimary };
  });

  const today = plan ? todaysPlanDay(plan.days) : null;
  const ratingValue = rating?.value ?? 1000;
  const tier = ratingTier(ratingValue);
  const problemCount = today?.problemCount ?? Math.max(3, Math.round((profile?.dailyPracticeMinutes ?? 30) / 6));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Welcome back, {user.name.split(" ")[0]}!
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Here&apos;s what NumberSmith recommends for today.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Today&apos;s Goal
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{problemCount}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">problems</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                    {profile?.dailyPracticeMinutes ?? 30}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">80%+</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">accuracy</p>
                </div>
              </div>
              {today && (
                <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  Today&apos;s plan: <span className="font-semibold text-slate-700 dark:text-slate-200">{today.label}</span>
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Continue Training
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">{priorityTopic.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <ProgressBar value={priorityMastery} tone="brand" className="max-w-[200px]" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{priorityMastery}% mastered</span>
              </div>
              <LinkButton href={`/practice?topic=${priorityTopic.slug}`} className="mt-4">
                Continue →
              </LinkButton>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Competition Progress
              </p>
              <div className="mt-3 space-y-3">
                {competitionProgress.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    You haven&apos;t selected any competitions yet.{" "}
                    <Link href="/settings/competitions" className="text-brand-600 dark:text-brand-400 underline">
                      Choose your competitions
                    </Link>
                  </p>
                )}
                {competitionProgress.map((cp) => (
                  <div key={cp.competition.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                        {cp.competition.shortName}
                        {cp.isPrimary && <Badge tone="brand">Primary</Badge>}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{cp.pct}% mastered</span>
                    </div>
                    <ProgressBar value={cp.pct} tone="success" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Current Rating
              </p>
              <p className="mt-2 text-4xl font-extrabold text-brand-700 dark:text-brand-300">{ratingValue}</p>
              <Badge tone="brand" className="mt-2">
                {tier.label}
              </Badge>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Daily Streak
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-3xl font-extrabold text-ember-600 dark:text-ember-400">
                <IconFlame className="h-7 w-7" />
                {stats?.currentStreak ?? 0} days
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Longest: {stats?.longestStreak ?? 0} days</p>
            </CardBody>
          </Card>

          <div className="rounded-2xl border border-brand-900 bg-brand-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">
              Recommended
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-50">
              Your recent results show that{" "}
              <span className="font-semibold text-white">{priorityTopic.name}</span> is holding
              back your overall score.
            </p>
            <LinkButton
              href={`/practice?topic=${priorityTopic.slug}`}
              variant="secondary"
              className="mt-4 !bg-white !text-brand-700 hover:!bg-brand-50"
            >
              Practice {priorityTopic.name} →
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
