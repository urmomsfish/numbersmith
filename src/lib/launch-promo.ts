import { PLAN_DURATION_DAYS } from "@/lib/pricing";
import { streakDayStart } from "@/lib/streak";

/**
 * The launch offer: create an account before the end of October 2026 and the
 * first year of Pro is free.
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
export const LAUNCH_PROMO_DEADLINE_LABEL = "31 October 2026";

/** What the offer grants, for copy that needs to name it. */
export const LAUNCH_PROMO_MONTHS = 12;

export function launchPromoIsOpen(now: Date = new Date()): boolean {
  return now.getTime() < LAUNCH_PROMO_ENDS.getTime();
}

/** Days left, floored, for a countdown. Never negative. */
export function launchPromoDaysLeft(now: Date = new Date()): number {
  const ms = LAUNCH_PROMO_ENDS.getTime() - now.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * The subscription row a brand-new account starts with.
 *
 * During the offer this is a year of Pro with no Stripe ids attached, which is
 * what makes it safe: nothing renews, nothing charges, and when `renewalDate`
 * passes `getSubscription` lapses the row to Free on its own. It behaves
 * exactly like an admin comp, because that is what it is.
 */
export function signupSubscription(now: Date = new Date()): {
  status: "PRO" | "FREE";
  plan?: "YEARLY";
  startDate?: Date;
  renewalDate?: Date;
} {
  if (!launchPromoIsOpen(now)) return { status: "FREE" };
  return {
    status: "PRO",
    plan: "YEARLY",
    startDate: now,
    renewalDate: new Date(now.getTime() + PLAN_DURATION_DAYS.YEARLY * 24 * 60 * 60 * 1000),
  };
}
