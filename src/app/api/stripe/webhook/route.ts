import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, mapStripeStatus, planFromPriceId } from "@/lib/stripe";

// Stripe signs the raw request body, so it must not be parsed or transformed
// before verification. Reading with req.text() preserves it byte-for-byte.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function periodEnd(subscription: Stripe.Subscription): Date | null {
  // current_period_end lives on the subscription item in recent API versions
  // and on the subscription itself in older ones; accept either.
  const sub = subscription as unknown as Record<string, unknown>;
  const top = typeof sub.current_period_end === "number" ? sub.current_period_end : null;
  const item = subscription.items?.data?.[0] as unknown as Record<string, unknown> | undefined;
  const nested = item && typeof item.current_period_end === "number" ? item.current_period_end : null;
  const seconds = top ?? nested;
  return seconds ? new Date(seconds * 1000) : null;
}

/** Writes a Stripe subscription onto the local row. Used by every event type so
 * the mapping lives in exactly one place. */
async function syncSubscription(subscription: Stripe.Subscription) {
  const userId =
    subscription.metadata?.userId ??
    (
      await prisma.subscription.findFirst({
        where: { externalSubscriptionId: subscription.id },
        select: { userId: true },
      })
    )?.userId;

  if (!userId) {
    console.error(`[stripe] no user for subscription ${subscription.id}`);
    return;
  }

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = planFromPriceId(priceId);
  const status = mapStripeStatus(subscription.status, subscription.cancel_at_period_end);
  const renewalDate = periodEnd(subscription);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status,
      plan,
      renewalDate,
      paymentProvider: "STRIPE",
      externalCustomerId: String(subscription.customer),
      externalSubscriptionId: subscription.id,
      canceledAt: subscription.cancel_at_period_end ? new Date() : null,
    },
    create: {
      userId,
      status,
      plan,
      startDate: new Date(subscription.start_date * 1000),
      renewalDate,
      paymentProvider: "STRIPE",
      externalCustomerId: String(subscription.customer),
      externalSubscriptionId: subscription.id,
    },
  });
}

export async function POST(req: Request) {
  if (!stripe) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("STRIPE_WEBHOOK_SECRET is not set", { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing stripe-signature header", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    // An unverified body is either a misconfiguration or a forgery; never act on it.
    console.error("[stripe] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Stripe retries deliveries. Recording the event id first means a redelivery
  // is skipped rather than applied twice.
  try {
    await prisma.webhookEvent.create({ data: { id: event.id, type: event.type } });
  } catch {
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        // Checkout knows the user; the subscription object may not yet.
        const userId = session.client_reference_id ?? session.metadata?.userId;
        if (userId && !subscription.metadata?.userId) {
          subscription.metadata = { ...subscription.metadata, userId };
        }
        await syncSubscription(subscription);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as unknown as Record<string, unknown>;
        console.warn(`[stripe] payment failed for invoice ${String(invoice.id)}`);
        // Access is intentionally left intact here. Stripe retries on its own
        // dunning schedule and sends subscription.deleted if it gives up.
        break;
      }

      default:
        break;
    }
  } catch (err) {
    // Roll back the idempotency record so Stripe's retry can try again.
    await prisma.webhookEvent.delete({ where: { id: event.id } }).catch(() => {});
    console.error(`[stripe] handler failed for ${event.type}:`, err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
