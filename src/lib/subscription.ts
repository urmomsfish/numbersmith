import "server-only";
import { prisma } from "@/lib/prisma";
import { paymentsAreLive } from "@/lib/stripe";
import type { SubscriptionStatus } from "@/lib/types";
import type { Subscription } from "@/generated/prisma";

/** The date the current entitlement is paid through, or null when it has no
 * end date at all (a manually granted comp account, which never lapses). */
function accessValidThrough(sub: Subscription): Date | null {
  switch (sub.status as SubscriptionStatus) {
    // Free trials were removed, and nothing in the product can write TRIAL any
    // more — but the value is still in the database enum, so this stays as the
    // correct reading of any row that predates the removal or is set by hand.
    // Dropping it would silently fall through to `default` and hand that row
    // permanent Free, which is a worse failure than a branch that never runs.
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

/** Whether the user can reach Pro-gated features.
 *
 * While payments are not live, this is true for everyone. Withholding features
 * behind a plan nobody is able to buy would just be a broken product — so the
 * paywall lifts entirely until live Stripe keys are configured, and restores
 * itself automatically once they are. Every gate in the app routes through
 * here, so there is one switch rather than fourteen.
 *
 * Note this is deliberately separate from the *subscription status* shown in
 * Settings, which keeps reporting the real stored plan. */
/**
 * Whether free-tier limits and Pro gates actually bite.
 *
 * This used to be `paymentsAreLive()` — one switch meaning both "you can buy
 * Pro" and "the free tier is capped". Tying them together was reasonable while
 * neither was wanted, but it made enforcing a limit impossible without also
 * opening checkout, which is a different decision entirely.
 *
 * They are separate now. Enforcement is on by default; set
 * `ENFORCE_FREE_LIMITS=false` to lift every cap again (useful for a demo, or
 * to go back to open early access). Live Stripe keys force it on regardless,
 * so a launched product can never accidentally be running with no limits.
 *
 * With payments in test mode and enforcement on, a capped student cannot buy
 * their way out — the pricing page says so plainly, and an admin can grant Pro
 * from /admin/users in the meantime. That is a deliberate state, not an
 * oversight: see PaymentsNotice, whose wording tracks this switch.
 */
export function limitsAreEnforced(): boolean {
  if (paymentsAreLive()) return true;
  return process.env.ENFORCE_FREE_LIMITS !== "false";
}

export async function isProUser(userId: string): Promise<boolean> {
  if (!limitsAreEnforced()) return true;
  return grantsProAccess(await getSubscription(userId));
}

/** True when the user cancelled but is still inside the period they paid for. */
export function isCancelPending(sub: Subscription): boolean {
  return sub.status === "CANCELED" && grantsProAccess(sub);
}

// Free-tier limits. Pro is unlimited on all of these.
//
// Simulations are absent deliberately: they are Pro-only, so there is no free
// allowance to cap. A constant here would imply one exists.
export const FREE_DAILY_PROBLEM_LIMIT = 15;
export const FREE_MISTAKE_REVIEWS_PER_WEEK = 10;
