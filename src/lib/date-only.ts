/**
 * Dates that name a day rather than an instant — a contest date, an assignment
 * due date.
 *
 * The convention across NumberSmith is that such a day is stored as that day's
 * **UTC midnight** and rendered back with `timeZone: "UTC"`. Both halves are
 * required, and getting either wrong shifts the date by a day:
 *
 *   - `new Date("2026-09-20")` parses as UTC midnight, but a bare
 *     `toLocaleDateString()` renders it in the *server's* zone. On Vercel that
 *     is UTC and looks fine; west of Greenwich it reads 19 September.
 *   - `new Date("2026-09-20T23:59:59")` parses in the server's zone, so the
 *     same input lands on a different instant depending on where it ran.
 *
 * These helpers existed only as a private copy inside `schedule-actions.ts`.
 * Coach mode needed the same rule and I wrote a fresh, wrong version of it —
 * the assignment due dates came out a day early — which is the argument for
 * one implementation rather than a convention people re-derive.
 *
 * This is a different thing from `streakDayKey()`, which answers "what day is
 * it *for this user*" and is deliberately anchored to US Pacific. Here the day
 * is already known; only its storage and display are in question. For the
 * other direction — turning a timestamp into the day it happened — see
 * `formatInstantDay` below.
 */
import { STREAK_TIME_ZONE } from "@/lib/streak";

/** Parses a `<input type="date">` value into that day's UTC midnight.
 * Returns null for anything that is not a real calendar day. */
export function parseDateOnly(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (Number.isNaN(date.getTime())) return null;
  // Guard against "2027-02-31" silently rolling into March.
  if (date.getUTCMonth() !== Number(mo) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date;
}

/** Renders a stored day. Always UTC, so it reads back as the day that was
 * chosen no matter where the render happens. */
export function formatDateOnly(
  date: Date,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
): string {
  return date.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

/**
 * Renders an *instant* — `createdAt`, `submittedAt` — as the day it happened.
 *
 * Not the same function as `formatDateOnly`, and using that one here is a real
 * bug I shipped for about ten minutes: a paper uploaded on the evening of
 * 27 September Pacific displayed as "added Sep 28", because `formatDateOnly`
 * forces UTC and by then UTC had already rolled over. Forcing UTC is right for
 * a value that *is* a day and was stored at UTC midnight; it is wrong for a
 * timestamp, which names a moment and has to be read in somebody's zone.
 *
 * That somebody is the user, so this uses the same zone the streak does. A bare
 * `toLocaleDateString()` would use the *server's* zone, which is UTC on Vercel
 * and reintroduces the same off-by-one for anyone west of Greenwich.
 */
export function formatInstantDay(
  at: Date,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
): string {
  return at.toLocaleDateString("en-US", { ...opts, timeZone: STREAK_TIME_ZONE });
}

/** Whether a deadline stored as a day has passed.
 *
 * A due date is a whole day, not the instant it begins: work due on the 20th is
 * on time at 11pm on the 20th. So the deadline is the *end* of the stored day —
 * comparing against UTC midnight directly would mark everything overdue for the
 * entire day it was due. */
export function isDayPast(day: Date, now: number = Date.now()): boolean {
  return now >= day.getTime() + 86_400_000;
}
