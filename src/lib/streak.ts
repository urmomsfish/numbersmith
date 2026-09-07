/** Streak day boundaries.
 *
 * Everyone's streak rolls over at 00:00 UTC-7, regardless of where the user is
 * or where the server happens to run. One shared boundary means two people
 * practising "the same evening" always get the same streak result, and it can
 * be stated plainly in the UI.
 *
 * A fixed offset rather than a named timezone is deliberate: America/Los_Angeles
 * would shift twice a year, producing one 23-hour day and one 25-hour day. On a
 * 23-hour day two calendar days can collapse into one index, silently costing
 * someone a streak they earned. A fixed offset makes every day exactly 24 hours.
 * The trade-off is that in winter the rollover lands at 11pm Pacific rather than
 * midnight; that is the intended behaviour, not drift.
 */
export const STREAK_UTC_OFFSET_HOURS = -7;

const DAY_MS = 24 * 60 * 60 * 1000;
const OFFSET_MS = STREAK_UTC_OFFSET_HOURS * 60 * 60 * 1000;

/** Index of the UTC-7 day a timestamp falls in. Consecutive days differ by
 * exactly 1, so streak arithmetic is plain subtraction — no calendar handling,
 * and no dependence on the server's local timezone (the previous implementation
 * used Date#getDate(), which silently meant "midnight UTC" on Vercel and
 * "midnight wherever the developer is" locally). */
export function streakDayIndex(at: Date): number {
  return Math.floor((at.getTime() + OFFSET_MS) / DAY_MS);
}

/** Whether two timestamps land on the same streak day. */
export function isSameStreakDay(a: Date, b: Date): boolean {
  return streakDayIndex(a) === streakDayIndex(b);
}

/** Day of week (0=Sunday) on the same UTC-7 boundary, for anything that has to
 * agree with the streak about what day it is — "today's plan" sits directly
 * beside the streak on the dashboard, so the two disagreeing would be visible. */
export function streakWeekday(at: Date = new Date()): number {
  return new Date(at.getTime() + OFFSET_MS).getUTCDay();
}

/** The streak as it should read *right now*.
 *
 * The stored counter only moves when a user is active, so someone who stopped
 * three days ago still has their old number sitting in the database. Reading it
 * raw would show a live streak for an account that has plainly broken it. This
 * collapses it to 0 once the chain is gone.
 *
 * Practising yesterday still counts: the user has until the next 00:00 UTC-7 to
 * keep it alive, which is what makes the number on screen match the deadline
 * they are actually racing.
 */
export function effectiveStreak(
  currentStreak: number,
  lastActiveDate: Date | null | undefined,
  now: Date = new Date()
): number {
  if (!lastActiveDate) return 0;
  const daysSince = streakDayIndex(now) - streakDayIndex(lastActiveDate);
  // Negative can only come from clock skew or a seeded future date; treat it as
  // still-active rather than punishing the user for it.
  return daysSince <= 1 ? currentStreak : 0;
}
