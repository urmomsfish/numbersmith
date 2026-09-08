/** The shape of a study plan: how long it runs, what phase each week is in, and
 * which day's task is the current one.
 *
 * Deliberately free of database access and of the `server-only` guard that
 * `study-plan.ts` carries, so this can be exercised directly by
 * `scripts/check-progress-model.ts` without a request context. Same split as
 * `reward.ts` and `progress.ts`: the rules are pure, the persistence is not.
 */
import { streakDayIndex, streakWeekday } from "@/lib/streak";

/** How many weeks a generated plan covers.
 *
 * The plan used to be a single week repeated forever, which made "training plan"
 * a weekly chore list rather than a route to a competition. Twelve weeks is a
 * realistic run-up to a contest and long enough for the phases below to mean
 * something — you cannot consolidate in week 2 what you have not learned yet.
 */
export const PLAN_WEEKS = 12;

/** The phases a plan moves through, and the week each begins. */
export const PLAN_PHASES = [
  {
    name: "Foundations",
    startWeek: 1,
    description:
      "Learn and shore up the weakest topics, one at a time, with lessons alongside practice.",
  },
  {
    name: "Build",
    startWeek: 5,
    description:
      "Heavier mixed practice and timed sets, widening across the competition's topic list.",
  },
  {
    name: "Competition prep",
    startWeek: 9,
    description: "Full simulations, mistake review, and pace work under contest conditions.",
  },
] as const;

export type PlanPhase = (typeof PLAN_PHASES)[number];

export function phaseForWeek(week: number): PlanPhase {
  let current: PlanPhase = PLAN_PHASES[0];
  for (const phase of PLAN_PHASES) if (week >= phase.startWeek) current = phase;
  return current;
}

export function planTotalWeeks(plan: { days: { weekNumber: number }[] }): number {
  return plan.days.reduce((max, d) => Math.max(max, d.weekNumber), 1);
}

/** Which week of the plan the student is currently in, 1-based.
 *
 * Measured in whole weeks since the plan was generated, on the same
 * midnight-Pacific boundary as streaks. Clamped to the final week rather than
 * wrapping: after the last week the plan is finished, and silently restarting it
 * at week 1 would quietly undo the progression.
 */
export function currentPlanWeek(
  plan: { generatedAt: Date },
  totalWeeks: number = PLAN_WEEKS,
  now: Date = new Date()
): number {
  const elapsedDays = streakDayIndex(now) - streakDayIndex(plan.generatedAt);
  const week = Math.floor(elapsedDays / 7) + 1;
  return Math.min(Math.max(1, week), Math.max(1, totalWeeks));
}

/** Whether the student has run past the end of the plan and should regenerate. */
export function isPlanComplete(
  plan: { generatedAt: Date; days: { weekNumber: number }[] },
  now: Date = new Date()
): boolean {
  const elapsedDays = streakDayIndex(now) - streakDayIndex(plan.generatedAt);
  return Math.floor(elapsedDays / 7) + 1 > planTotalWeeks(plan);
}

/** The task scheduled for today.
 *
 * Needs the whole plan, not just its days: with a multi-week plan the weekday
 * alone no longer identifies a task. Matching on dayOfWeek by itself is what
 * made the old plan a one-week loop.
 */
export function todaysPlanDay<T extends { dayOfWeek: number; weekNumber: number }>(
  plan: { generatedAt: Date; days: T[] },
  now: Date = new Date()
): T | null {
  // 0=Sunday..6=Saturday, matching our schema convention. Uses the same
  // midnight-Pacific boundary as streaks: getDay() would be the *server's*
  // weekday, so on Vercel a user's plan flipped to tomorrow's at 5pm their time.
  const today = streakWeekday(now);
  const week = currentPlanWeek(plan, planTotalWeeks(plan), now);
  return plan.days.find((d) => d.weekNumber === week && d.dayOfWeek === today) ?? null;
}

/** The days belonging to one week of the plan, in weekday order starting Monday. */
export function weekDays<T extends { dayOfWeek: number; weekNumber: number }>(
  days: T[],
  week: number
): T[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return days
    .filter((d) => d.weekNumber === week)
    .sort((a, b) => order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek));
}

// ---------------------------------------------------------------------------
// Building the plan around the student's actual competition calendar.
// ---------------------------------------------------------------------------

export type ScheduledCompetition = {
  competitionId: string;
  shortName: string;
  targetDate: Date | null;
  isPrimary: boolean;
  /** 1-10, from the Competition row — what the contest actually asks for. */
  difficultyMin: number;
  difficultyMax: number;
  format: string;
  numQuestions: number | null;
  timeLimitMinutes: number | null;
};

/** One week of the plan, and which contest it is preparing for. */
export type ScheduledWeek = {
  weekNumber: number;
  /** The competition this week is aimed at, or null when nothing is dated. */
  target: ScheduledCompetition | null;
  /** Whole weeks remaining until that contest at the start of this week. */
  weeksUntilTarget: number | null;
  phase: PlanPhase;
  /** The last week before a contest — volume drops, review dominates. */
  isTaper: boolean;
};

/** Whole weeks from `from` to `to`, floored at 0. */
export function weeksBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((streakDayIndex(to) - streakDayIndex(from)) / 7));
}

/** Competitions with a date still in the future, soonest first. */
export function upcomingCompetitions(
  schedule: ScheduledCompetition[],
  now: Date = new Date()
): ScheduledCompetition[] {
  const today = streakDayIndex(now);
  return schedule
    .filter((c) => c.targetDate !== null && streakDayIndex(c.targetDate) >= today)
    .sort((a, b) => streakDayIndex(a.targetDate!) - streakDayIndex(b.targetDate!));
}

/** Lays out the plan's weeks against the student's contest dates.
 *
 * Each week is assigned to the next contest that has not happened yet, so a
 * student sitting MATHCOUNTS in three weeks and AMC 10 in ten trains for
 * MATHCOUNTS first and switches the moment it is behind them.
 *
 * The phase is derived from *time remaining*, not from a fixed week number —
 * three weeks out is competition prep whatever week of the plan it happens to
 * be. With no dated contest at all this falls back to the generic progression,
 * which is the right behaviour for someone still exploring.
 */
export function buildScheduleWeeks(
  schedule: ScheduledCompetition[],
  now: Date = new Date(),
  fallbackWeeks: number = PLAN_WEEKS
): ScheduledWeek[] {
  const upcoming = upcomingCompetitions(schedule, now);

  if (upcoming.length === 0) {
    return Array.from({ length: fallbackWeeks }, (_, i) => ({
      weekNumber: i + 1,
      target: null,
      weeksUntilTarget: null,
      phase: phaseForWeek(i + 1),
      isTaper: false,
    }));
  }

  const last = upcoming[upcoming.length - 1];
  // Run to the final contest, but always give at least one week, and cap the
  // horizon so a date two years out does not generate a hundred weeks of rows.
  const horizon = Math.min(Math.max(1, weeksBetween(now, last.targetDate!) + 1), 52);

  const weeks: ScheduledWeek[] = [];
  for (let i = 0; i < horizon; i++) {
    const weekStart = new Date(now.getTime() + i * 7 * 86_400_000);
    const startIndex = streakDayIndex(weekStart);
    const target =
      upcoming.find((c) => streakDayIndex(c.targetDate!) >= startIndex) ?? last;
    const weeksUntil = weeksBetween(weekStart, target.targetDate!);
    weeks.push({
      weekNumber: i + 1,
      target,
      weeksUntilTarget: weeksUntil,
      phase: phaseForTimeRemaining(weeksUntil),
      isTaper: weeksUntil === 0,
    });
  }
  return weeks;
}

/** The phase a given week of a stored plan is in.
 *
 * Must agree with how the plan was generated. generateStudyPlan chooses the
 * phase from time remaining when there is a contest date, so reading it back
 * with the position-based phaseForWeek would mislabel the week — a plan built
 * five weeks out from a contest starts in Build, but phaseForWeek(1) says
 * Foundations.
 */
export function phaseForPlanWeek(
  plan: { generatedAt: Date; competitionDate: Date | null },
  week: number
): PlanPhase {
  if (!plan.competitionDate) return phaseForWeek(week);
  const weekStart = new Date(plan.generatedAt.getTime() + (week - 1) * 7 * 86_400_000);
  return phaseForTimeRemaining(weeksBetween(weekStart, plan.competitionDate));
}

/** Phase chosen by how long is left, rather than by position in the plan.
 *
 * Someone who signs up two weeks before their contest should not spend those
 * two weeks on foundations; someone with six months should not start with
 * simulations. */
export function phaseForTimeRemaining(weeksUntil: number): PlanPhase {
  if (weeksUntil <= 3) return PLAN_PHASES[2]; // Competition prep
  if (weeksUntil <= 8) return PLAN_PHASES[1]; // Build
  return PLAN_PHASES[0]; // Foundations
}

/** The difficulty band to draw practice problems from for a given contest and
 * week.
 *
 * Starts near the bottom of the contest's own range and climbs to its top as
 * the date approaches, so an AMC 8 student is not thrown AIME-level problems and
 * an AIME student is not fed arithmetic drills. The range comes from the
 * Competition row, which is what "understanding the content" means here. */
export function difficultyBandFor(
  target: Pick<ScheduledCompetition, "difficultyMin" | "difficultyMax"> | null,
  weeksUntil: number | null
): { min: number; max: number } {
  if (!target) return { min: 2, max: 6 };
  const { difficultyMin, difficultyMax } = target;
  if (weeksUntil === null) return { min: difficultyMin, max: difficultyMax };
  // 12+ weeks out: bottom half. On the week of: the full range.
  const closeness = Math.max(0, Math.min(1, 1 - weeksUntil / 12));
  const span = difficultyMax - difficultyMin;
  const min = Math.round(difficultyMin + span * closeness * 0.4);
  return { min, max: difficultyMax };
}
