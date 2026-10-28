import { streakDayStart } from "@/lib/streak";

/**
 * The launch offer: have an account before Halloween 2026 and Pro is free for
 * good — unlimited everything, permanently, for every user.
 *
 * Worth being clear-eyed that this is a one-way door. A lifetime grant can be
 * revoked in the database in seconds, but not in good faith: the signup form
 * and the pricing page both promise it in those words, so taking it back later
 * is a broken promise rather than a config change.
 *
 * It lives in one module because it is a promise made to a user, and a promise
 * that two code paths disagree about is worse than no promise. Both signup
 * routes — the email form and the Google callback — read `signupSubscription`
 * rather than each writing their own `{ status: "FREE" }`, which is how they
 * sat before and exactly how one of them would have been missed.
 */

/**
 * The instant the offer closes: midnight US Pacific as October becomes
 * November.
 *
 * Built on `streakDayStart` rather than a hand-written UTC constant for two
 * reasons. The product already decides what day it is in US Pacific — streaks,
 * the daily challenge, the practice cap — so a deadline on any other clock
 * would be a second, conflicting notion of "today". And November 1st 2026 is
 * the day US clocks go back, so the offset at the boundary is not the offset
 * an hour either side of it; `streakDayStart` resolves that in two passes and
 * `verify:streak` checks it against every DST transition to 2030.
 *
 * Midday UTC is passed in only as a safely-inside-November-1st instant to take
 * the day from. The returned value is the start of that Pacific day.
 */
export const LAUNCH_PROMO_ENDS: Date = streakDayStart(new Date(Date.UTC(2026, 10, 1, 12)));

/** How the deadline is written in UI copy. */
export const LAUNCH_PROMO_DEADLINE_LABEL = "Halloween";

/** The deadline spelled out, where the copy needs to be unambiguous. */
export const LAUNCH_PROMO_DEADLINE_EXACT = "31 October 2026";

export function launchPromoIsOpen(now: Date = new Date()): boolean {
  return now.getTime() < LAUNCH_PROMO_ENDS.getTime();
}

/** Days left, floored, for a countdown. Never negative. */
export function launchPromoDaysLeft(now: Date = new Date()): number {
  const ms = LAUNCH_PROMO_ENDS.getTime() - now.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * The subscription row granted by the offer: Pro, for good.
 *
 * `renewalDate: null` is the whole mechanism. `grantsProAccess` reads a null
 * valid-through as an open-ended grant and `getSubscription` never lapses it,
 * which is how seeded and admin-comped accounts have always worked — so a
 * lifetime grant needed no new code path, only the absence of an end date.
 *
 * `plan` stays null on purpose. MONTHLY and YEARLY describe something that was
 * bought and recurs; this is neither, and labelling it YEARLY would make the
 * settings page tell a user their free lifetime access renews annually.
 *
 * No Stripe ids are attached, so nothing renews and nothing charges.
 */
export const LAUNCH_PROMO_GRANT = {
  status: "PRO",
  plan: null,
  renewalDate: null,
} as const;

export function signupSubscription(now: Date = new Date()): {
  status: "PRO" | "FREE";
  plan?: null;
  startDate?: Date;
  renewalDate?: null;
} {
  if (!launchPromoIsOpen(now)) return { status: "FREE" };
  return { ...LAUNCH_PROMO_GRANT, startDate: now };
}
