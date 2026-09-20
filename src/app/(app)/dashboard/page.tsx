import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { getActiveStudyPlan, todaysPlanDay } from "@/lib/engine/study-plan";
import { pickPriorityTopic } from "@/lib/engine/practice";
import {
  topicProgress,
  evidenceLabel,
  competitionProgress as competitionProgressPct,
} from "@/lib/engine/progress";
import { dateKeyIndex, streakDayIndex } from "@/lib/streak";

/** Formats a date-only value without letting the viewer's timezone shift it —
 * targetDate is stored as UTC midnight, the same convention the schedule uses. */
function formatContestDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function countdown(daysAway: number) {
  if (daysAway === 0) return "today";
  if (daysAway === 1) return "tomorrow";
  return `in ${daysAway} days`;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [profile, userCompetitions, plan, priorityTopic] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.userCompetition.findMany({
      where: { userId: user.id },
      include: { competition: { include: { topics: true } } },
      orderBy: [{ isPrimary: "desc" }, { targetDate: "asc" }],
    }),
    getActiveStudyPlan(user.id),
    pickPriorityTopic(user.id),
  ]);

  // The topic rows carry their topic so the weak-topic list can name and link
  // them; previously only the ids were fetched, which is why the dashboard could
  // show a single priority topic and nothing else.
  const allMastery = await prisma.topicMastery.findMany({
    where: { userId: user.id },
    include: { topic: true },
  });
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

  // Weakest first, and where two topics sit equal, the one with less evidence
  // behind it goes first — that is the one practice will actually move.
  const weakTopics = allMastery
    .filter((m) => m.topic.parentId === null && m.topicId !== priorityTopic.id)
    .map((m) => ({
      id: m.id,
      name: m.topic.name,
      slug: m.topic.slug,
      attempted: m.problemsAttempted,
      progress: topicProgress(m.masteryPercent, m.problemsAttempted),
    }))
    .sort((a, b) => a.progress - b.progress || a.attempted - b.attempted)
    .slice(0, 5);

  const today = streakDayIndex(new Date());
  const competitions = userCompetitions.map((uc) => ({
    id: uc.competition.id,
    shortName: uc.competition.shortName,
    slug: uc.competition.slug,
    isPrimary: uc.isPrimary,
    targetDate: uc.targetDate,
    // targetDate is a date-only value — dateKeyIndex, not streakDayIndex.
    daysAway: uc.targetDate ? dateKeyIndex(uc.targetDate) - today : null,
    pct: competitionProgressPct(
      uc.competition.topics.map((ct) => ({ topicId: ct.topicId, weight: ct.weight })),
      masteryByTopicId
    ),
  }));

  const planDay = plan ? todaysPlanDay(plan) : null;
  const minutes = profile?.dailyPracticeMinutes ?? 30;
  const problemCount = planDay?.problemCount ?? Math.max(3, Math.round(minutes / 6));
  const nextContest = competitions.find((c) => c.daysAway !== null && c.daysAway >= 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Good to see you, {user.name.split(" ")[0]}.
        </h1>
        {nextContest?.targetDate && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {nextContest.shortName} {countdown(nextContest.daysAway!)} ·{" "}
            {formatContestDate(nextContest.targetDate)}
          </p>
        )}
      </header>

      {/* The one thing to do next, given the most weight on the page. Everything
          below it is context for the decision, not a second decision. */}
      <section className="mt-6 rounded-lg border border-slate-200 bg-card p-5 sm:p-6 dark:border-slate-700">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Today&apos;s practice
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {problemCount} problems · about {minutes} minutes
            {planDay ? ` · ${planDay.label}` : ""}
          </p>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {priorityTopic.name} is the topic holding your score back the most right now.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-medium text-slate-900 dark:text-slate-50">{priorityTopic.name}</p>
          {/* Capped: a 12% fill stretched across a 900px card reads as an empty
              page element rather than as a measurement. */}
          <div className="flex w-full max-w-sm items-center gap-3 sm:w-auto sm:flex-1">
            <ProgressBar value={priorityMastery} tone="brand" />
            <span className="shrink-0 tabular-nums text-sm text-slate-700 dark:text-slate-400">
              {priorityMastery}%
            </span>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
          {evidenceLabel(priorityRow?.problemsAttempted ?? 0)}
        </p>

        <LinkButton
          href={`/practice?topic=${priorityTopic.slug}`}
          className="mt-5 w-full sm:w-auto"
        >
          Start practice
        </LinkButton>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Weakest topics
            </h2>
            <Link
              href="/stats"
              className="text-sm link"
            >
              All topics
            </Link>
          </div>
          {weakTopics.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Practice a few more topics and the weakest ones will be listed here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {weakTopics.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/practice?topic=${t.slug}`}
                    className="-mx-2 flex items-center gap-4 rounded-md px-2 py-2.5 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:hover:bg-slate-800"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                      {t.name}
                    </span>
                    <span className="w-24 shrink-0">
                      <ProgressBar value={t.progress} tone={t.progress >= 40 ? "brand" : "ember"} />
                    </span>
                    <span className="w-9 shrink-0 text-right tabular-nums text-sm text-slate-700 dark:text-slate-400">
                      {t.progress}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Competition progress
            </h2>
            <Link
              href="/schedule"
              className="text-sm link"
            >
              Schedule
            </Link>
          </div>
          {competitions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              You haven&apos;t chosen a competition yet.{" "}
              <Link
                href="/settings/competitions"
                className="link"
              >
                Pick one
              </Link>{" "}
              and your plan will build around it.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {competitions.map((c) => (
                <li key={c.id} className="py-2.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <Link
                      href={`/competitions/${c.slug}`}
                      className="font-medium text-slate-900 hover:underline dark:text-slate-50"
                    >
                      {c.shortName}
                      {c.isPrimary && (
                        <span className="ml-2 text-xs font-normal text-slate-600 dark:text-slate-400">
                          primary
                        </span>
                      )}
                    </Link>
                    <span className="shrink-0 tabular-nums text-slate-700 dark:text-slate-400">
                      {c.pct}%
                    </span>
                  </div>
                  <ProgressBar value={c.pct} tone="success" className="mt-1.5" />
                  {c.targetDate && c.daysAway !== null && (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {c.daysAway >= 0
                        ? `${formatContestDate(c.targetDate)} · ${countdown(c.daysAway)}`
                        : `${formatContestDate(c.targetDate)} · past`}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
