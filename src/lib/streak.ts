/** Streak day boundaries.
 *
 * Everyone's streak rolls over at midnight US Pacific time, regardless of where
 * the user is or where the server happens to run. One shared boundary means two
 * people practising "the same evening" always get the same streak result, and
 * it can be stated plainly in the UI.
 *
 * This follows Pacific *clock* time, so it tracks daylight saving: the rollover
 * is at midnight in both PST and PDT rather than drifting to 11pm each winter.
 *
 * Why that is safe, given DST produces a 23-hour and a 25-hour day each year:
 * the day index below is the zone's **calendar date**, converted to a day
 * number. Two consecutive Pacific dates therefore always differ by exactly 1,
 * however many hours elapsed between them. The hazard that motivated the
 * earlier fixed-offset version was doing wall-clock *arithmetic* with a shifting
 * offset — floor((t + offset) / 24h) — where a short day really can collapse two
 * dates onto one index and silently eat a streak. Reading the date instead of
 * computing it removes that failure mode rather than trading it for another.
 *
 * The other thing that makes this tractable: US Pacific changes its clocks at
 * 02:00 local, so local midnight always exists and is never ambiguous. There is
 * no "this time occurred twice" or "this time never happened" case to resolve at
 * the boundary itself.
 */
export const STREAK_TIME_ZONE = "America/Los_Angeles";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Built once — `formatToParts` is called on most page renders, and constructing
 * an Intl formatter is far more expensive than using one. */
const ZONE_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: STREAK_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

/** The wall-clock reading in the streak timezone for a given instant. */
function zonedParts(at: Date): ZonedParts {
  const parts = ZONE_PARTS.formatToParts(at);
  const value = (type: string) => {
    const found = parts.find((p) => p.type === type);
    if (!found) throw new Error(`streak: Intl did not return a ${type} part`);
    return Number(found.value);
  };
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    // Some engines render midnight as hour 24 under an h24 cycle; normalise so
    // the offset maths below can never be a day out.
    hour: value("hour") % 24,
    minute: value("minute"),
    second: value("second"),
  };
}

/** Offset of the streak timezone from UTC at a given instant, in ms.
 * Negative for Pacific: -7h in PDT, -8h in PST. */
function zoneOffsetMs(at: Date): number {
  const p = zonedParts(at);
  const asIfUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  // Truncate `at` to whole seconds — the parts have no sub-second component, so
  // leaving the milliseconds in would bleed into the offset.
  return asIfUTC - Math.floor(at.getTime() / 1000) * 1000;
}

/** Index of the Pacific calendar day a timestamp falls in.
 *
 * Consecutive days differ by exactly 1 — including across both DST transitions,
 * because this counts dates rather than elapsed hours. Streak arithmetic stays
 * plain subtraction, with no dependence on the server's own timezone (an early
 * implementation used Date#getDate(), which silently meant "midnight UTC" on
 * Vercel and "midnight wherever the developer is" locally). */
export function streakDayIndex(at: Date): number {
  const { year, month, day } = zonedParts(at);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

/** Whether two timestamps land on the same streak day. */
export function isSameStreakDay(a: Date, b: Date): boolean {
  return streakDayIndex(a) === streakDayIndex(b);
}

/** The calendar day a moment belongs to, expressed as that day's UTC midnight.
 *
 * This is the storage key for date-only rows (DailyChallenge.date). Storing UTC
 * midnight for a date is a normal convention and is unchanged; what this decides
 * is *which* date an instant maps to. It holds the invariant
 * `streakDayKey(t).getTime() / 86400000 === streakDayIndex(t)`, which is what
 * guarantees the daily challenge and the streak never disagree about the day.
 *
 * Note this is a date label, not an instant — it is NOT the moment the day
 * began. For that, use `streakDayStart`, which is the piece that actually has to
 * know about DST.
 */
export function streakDayKey(at: Date = new Date()): Date {
  const { year, month, day } = zonedParts(at);
  return new Date(Date.UTC(year, month - 1, day));
}

/** The real UTC instant at which the current streak day began — midnight
 * Pacific, which is 07:00Z in summer and 08:00Z in winter.
 *
 * Anything querying "rows created today" needs this rather than `streakDayKey`,
 * which is only a label. Deriving it by subtracting a constant offset from the
 * key is exactly the bug this function exists to prevent.
 *
 * Two passes: the offset in force at `at` may not be the offset in force at
 * midnight (on a transition day they differ by an hour), so the first result is
 * re-resolved using the offset at that candidate instant. Because Pacific never
 * changes its clocks at midnight, the second pass always lands on the true
 * boundary. `verify:streak` checks this at every hour of every DST transition
 * from 2024 to 2030 rather than taking it on trust.
 */
export function streakDayStart(at: Date = new Date()): Date {
  const { year, month, day } = zonedParts(at);
  const wallMidnight = Date.UTC(year, month - 1, day);
  const firstPass = wallMidnight - zoneOffsetMs(at);
  return new Date(wallMidnight - zoneOffsetMs(new Date(firstPass)));
}

/** Day of week (0=Sunday) on the same boundary, for anything that has to agree
 * with the streak about what day it is — "today's plan" sits directly beside the
 * streak on the dashboard, so the two disagreeing would be visible. */
export function streakWeekday(at: Date = new Date()): number {
  return streakDayKey(at).getUTCDay();
}

/** The streak as it should read *right now*.
 *
 * The stored counter only moves when a user is active, so someone who stopped
 * three days ago still has their old number sitting in the database. Reading it
 * raw would show a live streak for an account that has plainly broken it. This
 * collapses it to 0 once the chain is gone.
 *
 * Practising yesterday still counts: the user has until the next midnight
 * Pacific to keep it alive, which is what makes the number on screen match the
 * deadline they are actually racing.
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
