import "server-only";
import { prisma } from "@/lib/prisma";
import type { SubscriptionStatus } from "@/lib/types";
import type { Subscription } from "@/generated/prisma";

/** The date the current entitlement is paid through, or null when it has no
 * end date at all (a manually granted comp account, which never lapses). */
function accessValidThrough(sub: Subscription): Date | null {
  switch (sub.status as SubscriptionStatus) {
    case "TRIAL":
      return sub.trialEndsAt;
    case "PRO":
      return sub.renewalDate;
    // CANCELED still carries access: the user paid for the period they are in
    // and keeps Pro until it ends. Falling back to canceledAt means cancelling
    // an open-ended comp account (no renewalDate) takes effect immediately,
    // since there was no paid period to honour.
    case "CANCELED":
      return sub.renewalDate ?? sub.canceledAt;
    default:
      return null;
  }
}

/** True while the subscription still grants Pro features. */
export function grantsProAccess(sub: Subscription): boolean {
  const status = sub.status as SubscriptionStatus;
  if (status === "FREE") return false;
  const validThrough = accessValidThrough(sub);
  // No end date means an open-ended grant (seeded/admin comp account).
  return validThrough === null || validThrough > new Date();
}

/** Reads the subscription, lapsing it to Free first if its paid-through date
 * has passed. Normalizing on read (rather than in a scheduled job) keeps
 * access correct without a background worker running. */
export async function getSubscription(userId: string) {
  const sub = await prisma.subscription.upsert({
    where: { userId },
    update: {},
    create: { userId, status: "FREE" },
  });

  if (sub.status !== "FREE" && !grantsProAccess(sub)) {
    return prisma.subscription.update({
      where: { userId },
      data: { status: "FREE", plan: null },
    });
  }

  return sub;
}

export async function isProUser(userId: string): Promise<boolean> {
  return grantsProAccess(await getSubscription(userId));
}

/** True when the user cancelled but is still inside the period they paid for. */
export function isCancelPending(sub: Subscription): boolean {
  return sub.status === "CANCELED" && grantsProAccess(sub);
}

// Free-tier limits. Pro is unlimited on all of these.
export const FREE_DAILY_PROBLEM_LIMIT = 15;
export const FREE_SIMULATIONS_PER_WEEK = 2;
export const FREE_MISTAKE_LIMIT = 10;
