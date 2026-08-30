import "server-only";
import Stripe from "stripe";
import type { SubscriptionPlan } from "@/lib/types";

/** Stripe is optional at build time so the app still runs before keys exist.
 * Every call site must handle the null case. */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null;
}

/** True only when a live-mode key is configured. A test key means Checkout
 * would decline a real card, so the UI must not offer paid plans as if they
 * were purchasable. Derived from the key itself rather than a manual flag, so
 * it flips on its own the moment live keys are set — nothing to remember. */
export function paymentsAreLive(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");
}

/** Price ids come from the Stripe dashboard (Products → your product → Pricing).
 * They differ between test and live mode, so they live in env rather than code. */
export const STRIPE_PRICE_IDS: Record<SubscriptionPlan, string | undefined> = {
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY,
  YEARLY: process.env.STRIPE_PRICE_YEARLY,
};

export function priceIdForPlan(plan: SubscriptionPlan): string {
  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    throw new Error(
      `Missing price id for ${plan} plan. Set STRIPE_PRICE_${plan} in your environment.`
    );
  }
  return priceId;
}

/** Maps a Stripe subscription status onto the app's own status vocabulary.
 * `cancel_at_period_end` is reported by Stripe as still "active", but the app
 * models that as CANCELED-with-remaining-access, which grantsProAccess honours. */
export function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status,
  cancelAtPeriodEnd: boolean
): "PRO" | "CANCELED" | "FREE" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return cancelAtPeriodEnd ? "CANCELED" : "PRO";
    case "past_due":
    case "unpaid":
      // Keep access during the retry window; Stripe eventually cancels if it
      // never resolves, which arrives as customer.subscription.deleted.
      return "PRO";
    case "canceled":
    case "incomplete_expired":
      return "FREE";
    default:
      return "FREE";
  }
}

export function planFromPriceId(priceId: string | null | undefined): SubscriptionPlan | null {
  if (!priceId) return null;
  if (priceId === STRIPE_PRICE_IDS.YEARLY) return "YEARLY";
  if (priceId === STRIPE_PRICE_IDS.MONTHLY) return "MONTHLY";
  return null;
}

export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
