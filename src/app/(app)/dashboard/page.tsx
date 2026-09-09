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
import { topicProgress, competitionProgress as competitionProgressPct } from "@/lib/engine/progress";
import { ratingTier } from "@/lib/types";
import { effectiveStreak } from "@/lib/streak";

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
  const masteryByTopicId = new Map(
    allMastery.map((m) => [
      m.topicId,
      { masteryPercent: m.masteryPercent, problemsAttempted: m.problemsAttempted },
    ])
  );
  // Progress is the accuracy estimate discounted by how much practice backs it —
  // see src/lib/engine/progress.ts. Reading masteryPercent raw here is what made
  // a twelve-question placement test read as "86% mastered".
  const priorityRow = masteryByTopicId.get(priorityTopic.id);
  const priorityMastery = priorityRow
    ? topicProgress(priorityRow.masteryPercent, priorityRow.problemsAttempted)
    : 0;

  const competitionProgress = userCompetitions.map((uc) => ({
    competition: uc.competition,
    pct: competitionProgressPct(
      uc.competition.topics.map((ct) => ({ topicId: ct.topicId, weight: ct.weight })),
      masteryByTopicId
    ),
    isPrimary: uc.isPrimary,
  }));

  const today = plan ? todaysPlanDay(plan) : null;
  const ratingValue = rating?.value ?? 1000;
  const tier = ratingTier(ratingValue);
  const streak = effectiveStreak(stats?.currentStreak ?? 0, stats?.lastActiveDate);
  const longestStreak = stats?.longestStreak ?? 0;
  const problemCount = today?.problemCount ?? Math.max(3, Math.round((profile?.dailyPracticeMinutes ?? 30) / 6));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
        {user.name.split(" ")[0]}&apos;s training
      </h1>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardBody>
              {/* Leads with the task itself. The previous version showed three
                  big numbers, one of which ("80%+ accuracy") was not derived
                  from anything — it was a target nobody had set. */}
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Today</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                {today?.label ?? "Rest day"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {problemCount} problems · about {profile?.dailyPracticeMinutes ?? 30} minutes
              </p>
              <LinkButton href="/practice/session" className="mt-4">
                Start
              </LinkButton>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Continue Training
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">{priorityTopic.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Weakest against what your competitions weight most.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={priorityMastery} tone="brand" className="max-w-[200px]" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{priorityMastery}% mastered</span>
              </div>
              <LinkButton href={`/practice?topic=${priorityTopic.slug}`} variant="secondary" className="mt-4">
                Practice {priorityTopic.name}
              </LinkButton>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Daily Streak
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-3xl font-extrabold text-ember-600 dark:text-ember-400">
                <IconFlame className="h-7 w-7" />
                {streak} {streak === 1 ? "day" : "days"}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Longest: {longestStreak} {longestStreak === 1 ? "day" : "days"}
              </p>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}
