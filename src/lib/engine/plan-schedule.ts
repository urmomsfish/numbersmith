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
