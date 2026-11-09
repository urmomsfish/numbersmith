import { streakDayStart } from "@/lib/streak";
import { accessValidThrough, type EntitlementFacts } from "@/lib/subscription-rules";

/**
 * NumberSmith is free until 2027.
 *
 * Every account — new or existing — holds Pro at no cost until midnight US
 * Pacific on 1 January 2027: unlimited problems and simulations, the full
 * lesson library, Smith AI, complete mistake review. No card, nothing to
 * cancel. On that date the grant lapses to Free by itself and Pro becomes
 * something you buy.
 *
 * This replaces the Halloween launch offer, which gave *lifetime* Pro to every
 * account that existed by 31 October 2026. That promise is not withdrawn and
 * cannot be: it was made in those words on the signup form and the pricing
 * page, so `decideFreeAccess` refuses to put an end date on a row that already
 * has none. Shortening someone's access is the one thing this module will not
 * do — see the rules there.
 *
 * It lives in one module because it is a promise made to a user, and a promise
 * that two code paths disagree about is worse than no promise. Both signup
 * routes — the email form and the Google callback — read `signupSubscription`
 * rather than each writing their own `{ status: "FREE" }`, which is how they
 * sat before the launch offer and exactly how one of them would be missed now.
 */

/**
 * The instant free access ends: midnight US Pacific as 2026 becomes 2027.
 *
 * Built on `streakDayStart` rather than a hand-written UTC constant because
 * the product already decides what day it is in US Pacific — streaks, the
 * daily challenge, the practice cap — and a deadline on any other clock would
 * be a second, conflicting notion of "today". Midday UTC on 1 January is
 * passed in only as a safely-inside-that-day instant to take the date from;
 * the value returned is the start of that Pacific day.
 */
export const FREE_UNTIL: Date = streakDayStart(new Date(Date.UTC(2027, 0, 1, 12)));

/** How the deadline is written in UI copy. */
export const FREE_UNTIL_LABEL = "2027";

/** The deadline spelled out, where the copy needs to be unambiguous. */
export const FREE_UNTIL_EXACT = "1 January 2027";

export function freeAccessIsOpen(now: Date = new Date()): boolean {
  return now.getTime() < FREE_UNTIL.getTime();
}

/** Days left, rounded up, for a countdown. Never negative. */
export function freeAccessDaysLeft(now: Date = new Date()): number {
  const ms = FREE_UNTIL.getTime() - now.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * The subscription row granted by the offer: Pro, paid through 2026.
 *
 * `renewalDate` is the whole mechanism. `grantsProAccess` treats it as the
 * valid-through date and `getSubscription` lapses the row to Free on the first
 * read after it passes — so free-until-a-date needed no new code path and no
 * scheduled job, only a date where the lifetime grant had null.
 *
 * `plan` stays null on purpose. MONTHLY and YEARLY describe something that was
 * bought and recurs; this is neither, and labelling it YEARLY would make the
 * settings page tell a user their free access renews annually.
 *
 * No Stripe ids are attached, so nothing renews and nothing charges.
 */
export const FREE_ACCESS_GRANT = {
  status: "PRO",
  plan: null,
  renewalDate: FREE_UNTIL,
} as const;

export function signupSubscription(now: Date = new Date()): {
  status: "PRO" | "FREE";
  plan?: null;
  startDate?: Date;
  renewalDate?: Date;
} {
  if (!freeAccessIsOpen(now)) return { status: "FREE" };
  return { ...FREE_ACCESS_GRANT, startDate: now };
}

// ---------------------------------------------------------------------------
// Granting it to accounts that already exist
// ---------------------------------------------------------------------------

/** The parts of a stored subscription the decision depends on. */
export type SubscriptionFacts =
  | (EntitlementFacts & { externalSubscriptionId?: string | null })
  | null;

export type GrantDecision =
  /** Give this account the free-until-2027 grant. */
  | "grant"
  /** Real Stripe subscriber — never touch a row attached to a payment. */
  | "paying"
  /** Already holds open-ended Pro (the Halloween lifetime grant, or an admin comp). */
  | "lifetime"
  /** Already has Pro valid past 1 January 2027. */
  | "longer";

/**
 * Whether an existing account should be given the grant.
 *
 * The rule the other three cases all serve: **never shorten anyone's access.**
 * Writing `renewalDate: FREE_UNTIL` across the table unconditionally is the
 * obvious implementation and it is destructive — it would put an expiry date
 * on the lifetime grants promised at Halloween, cut short anyone paid up into
 * 2027, and detach real subscribers from their own billing record. A grant
 * that takes something away from the people who trusted the last one is worse
 * than no grant.
 *
 * How far an existing row reaches comes from `accessValidThrough`, the same
 * reading `getSubscription` uses, rather than from `renewalDate` directly.
 * That distinction is load-bearing: `renewalDate` is the right column only
 * for a PRO row. A CANCELED account keeps access to the end of the period it
 * paid for, and a legacy TRIAL row is governed by `trialEndsAt` — both would
 * have been misread as expired, and both would have been shortened.
 *
 * Pure, so scripts/check-free-access.ts can enumerate the cases rather than
 * the grant script being spot-checked against a live database.
 */
export function decideFreeAccess(
  sub: SubscriptionFacts,
  until: Date = FREE_UNTIL,
): GrantDecision {
  if (!sub) return "grant";
  if (sub.externalSubscriptionId) return "paying";
  // Free is the one status with nothing to protect.
  if (sub.status === "FREE") return "grant";

  const reach = accessValidThrough(sub);
  // An open-ended grant outranks a dated one however far out the date is.
  if (reach === null) return "lifetime";
  if (reach.getTime() >= until.getTime()) return "longer";
  return "grant";
}
