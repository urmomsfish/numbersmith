import type { SubscriptionStatus } from "@/lib/types";

/**
 * When a subscription's entitlement actually runs out.
 *
 * Split out of `src/lib/subscription.ts` — which is `server-only` and so
 * cannot be imported by a client component or by anything a client component
 * pulls in — because more than one place needs to answer "how far does this
 * row reach?" and the answer is not obvious: it is a different column per
 * status, and `null` means *forever* rather than *expired*.
 *
 * That subtlety is exactly why this is shared rather than reimplemented.
 * `decideFreeAccess` originally checked `renewalDate` alone, which is right
 * for a PRO row and wrong for the other three: it read a cancelled account
 * paid up into 2027 as expired, and would have shortened it.
 */

/** The fields the rules read. Structural, so a Prisma row satisfies it. */
export type EntitlementFacts = {
  status: string;
  renewalDate?: Date | null;
  trialEndsAt?: Date | null;
  canceledAt?: Date | null;
};

/**
 * The date the entitlement is valid through, or null when it has no end at
 * all (a manually granted comp account, which never lapses).
 */
export function accessValidThrough(sub: EntitlementFacts): Date | null {
  switch (sub.status as SubscriptionStatus) {
    // Free trials were removed, and nothing in the product can write TRIAL any
    // more — but the value is still in the database enum, so this stays as the
    // correct reading of any row that predates the removal or is set by hand.
    // Dropping it would silently fall through to `default` and hand that row
    // permanent Free, which is a worse failure than a branch that never runs.
    case "TRIAL":
      return sub.trialEndsAt ?? null;
    case "PRO":
      return sub.renewalDate ?? null;
    // CANCELED still carries access: the user paid for the period they are in
    // and keeps Pro until it ends. Falling back to canceledAt means cancelling
    // an open-ended comp account (no renewalDate) takes effect immediately,
    // since there was no paid period to honour.
    case "CANCELED":
      return sub.renewalDate ?? sub.canceledAt ?? null;
    default:
      return null;
  }
}

/** True while the subscription still grants Pro features. */
export function grantsProAccess(sub: EntitlementFacts, now: Date = new Date()): boolean {
  if ((sub.status as SubscriptionStatus) === "FREE") return false;
  const validThrough = accessValidThrough(sub);
  // No end date means an open-ended grant (seeded/admin comp account).
  return validThrough === null || validThrough > now;
}
