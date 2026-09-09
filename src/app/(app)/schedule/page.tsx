import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { CATEGORY_LABEL, difficultyRangeLabel } from "@/lib/competition-meta";
import { dateKeyIndex, streakDayIndex } from "@/lib/streak";
import {
  addScheduledCompetitionAction,
  setCompetitionDateAction,
  removeScheduledCompetitionAction,
  setPrimaryCompetitionAction,
} from "@/lib/actions/schedule-actions";

export const metadata = { title: "Competition Schedule — NumberSmith" };

/** Renders a date-only value without letting the viewer's timezone shift it.
 * These are stored as UTC midnight, so they must be read back in UTC. */
function formatContestDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function inputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function SchedulePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [scheduled, allCompetitions] = await Promise.all([
    prisma.userCompetition.findMany({
      where: { userId: user.id },
      include: { competition: true },
      orderBy: [{ targetDate: "asc" }, { addedAt: "asc" }],
    }),
    prisma.competition.findMany({ where: { isPlaceholder: false }, orderBy: { order: "asc" } }),
  ]);

  const today = streakDayIndex(new Date());
  const withTiming = scheduled.map((s) => ({
    ...s,
    // targetDate is a date-only value — dateKeyIndex, not streakDayIndex.
    daysAway: s.targetDate ? dateKeyIndex(s.targetDate) - today : null,
  }));
  const upcoming = withTiming.filter((s) => s.daysAway !== null && s.daysAway >= 0);
  const past = withTiming.filter((s) => s.daysAway !== null && s.daysAway < 0);
  const undated = withTiming.filter((s) => s.daysAway === null);

  const scheduledIds = new Set(scheduled.map((s) => s.competitionId));
  const addable = allCompetitions.filter((c) => !scheduledIds.has(c.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Competition Schedule</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Add the contests you&apos;re sitting and when. Your training plan is built backwards from
            these dates, using what each competition actually tests.
          </p>
        </div>
        <LinkButton href="/study-plan" variant="secondary">
          View training plan →
        </LinkButton>
      </div>

      {/* ---------------------------------------------------------------- */}
      <Card className="mt-6">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Upcoming
          </h2>

          {upcoming.length === 0 && undated.length === 0 && (
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              Nothing scheduled yet. Add a competition below and your plan will build itself around
              it.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {[...upcoming, ...undated].map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/competitions/${s.competition.slug}`}
                        className="font-semibold text-slate-900 dark:text-slate-50 hover:underline"
                      >
                        {s.competition.name}
                      </Link>
                      {s.isPrimary && <Badge tone="brand">Primary</Badge>}
                      {s.daysAway !== null && s.daysAway <= 7 && (
                        <Badge tone="ember">
                          {s.daysAway === 0 ? "Today" : `${s.daysAway} day${s.daysAway === 1 ? "" : "s"} away`}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {CATEGORY_LABEL[s.competition.category] ?? s.competition.category} ·{" "}
                      {difficultyRangeLabel(s.competition.difficultyMin, s.competition.difficultyMax)}
                      {s.competition.numQuestions && s.competition.timeLimitMinutes
                        ? ` · ${s.competition.numQuestions} questions in ${s.competition.timeLimitMinutes} min`
                        : ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {s.targetDate ? (
                        <>
                          {formatContestDate(s.targetDate)}
                          {s.daysAway !== null && s.daysAway > 7 && (
                            <span className="text-slate-400 dark:text-slate-500">
                              {" "}
                              · {Math.floor(s.daysAway / 7)} weeks away
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">
                          No date set — shapes your practice, but doesn&apos;t anchor the calendar.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <form action={setCompetitionDateAction} className="flex items-center gap-2">
                      <input type="hidden" name="userCompetitionId" value={s.id} />
                      <input
                        type="date"
                        name="targetDate"
                        defaultValue={inputValue(s.targetDate)}
                        className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500"
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Save
                      </Button>
                    </form>
                    {!s.isPrimary && (
                      <form action={setPrimaryCompetitionAction}>
                        <input type="hidden" name="userCompetitionId" value={s.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          Make primary
                        </Button>
                      </form>
                    )}
                    <form action={removeScheduledCompetitionAction}>
                      <input type="hidden" name="userCompetitionId" value={s.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {past.length > 0 && (
        <Card className="mt-5">
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Past
            </h2>
            <div className="mt-3 space-y-2">
              {past.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    {s.competition.shortName} · {s.targetDate && formatContestDate(s.targetDate)}
                  </span>
                  <form action={removeScheduledCompetitionAction}>
                    <input type="hidden" name="userCompetitionId" value={s.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      Remove
                    </Button>
                  </form>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Past contests no longer steer your plan — training has already moved on to the next
              one.
            </p>
          </CardBody>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      <Card className="mt-5">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Add a competition
          </h2>
          {addable.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              You&apos;ve added every competition in the directory.
            </p>
          ) : (
            <form action={addScheduledCompetitionAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Competition
                </span>
                <select
                  name="competitionId"
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500"
                >
                  {addable.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Date (optional)
                </span>
                <input
                  type="date"
                  name="targetDate"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500"
                />
              </label>
              <div className="flex items-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Add
                </Button>
              </div>
            </form>
          )}
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Changing anything here rebuilds your training plan straight away.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
