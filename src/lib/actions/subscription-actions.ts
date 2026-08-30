"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_DURATION_DAYS, TRIAL_DAYS } from "@/lib/pricing";
import { stripe, isStripeConfigured, priceIdForPlan, appBaseUrl } from "@/lib/stripe";

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

const activateSchema = z.object({ plan: z.enum(["MONTHLY", "YEARLY"]) });

/** Sends the user to Stripe Checkout. The subscription is NOT activated here —
 * the webhook does that once Stripe confirms payment, because a user can close
 * the tab mid-flow or reach the success URL without having paid. */
export async function activateProAction(formData: FormData) {
  const user = await requireUser();

  const parsed = activateSchema.safeParse({ plan: formData.get("plan") });
  if (!parsed.success) redirect("/pricing");
  const { plan } = parsed.data;

  // Without Stripe keys the app falls back to granting Pro directly so local
  // development still works. This must never happen in production, where an
  // unconfigured checkout would hand out Pro for free.
  if (!isStripeConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Stripe is not configured; refusing to grant Pro without payment.");
    }
    const now = new Date();
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: "PRO",
        plan,
        startDate: now,
        renewalDate: addDays(now, PLAN_DURATION_DAYS[plan]),
        canceledAt: null,
      },
      create: {
        userId: user.id,
        status: "PRO",
        plan,
        startDate: now,
        renewalDate: addDays(now, PLAN_DURATION_DAYS[plan]),
      },
    });
    revalidatePath("/settings");
    revalidatePath("/pricing");
    redirect("/dashboard?upgraded=1");
  }

  const existing = await prisma.subscription.findUnique({ where: { userId: user.id } });

  const session = await stripe!.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
    // Reuse the Stripe customer if we have one so a returning subscriber does
    // not accumulate duplicate customer records.
    ...(existing?.externalCustomerId
      ? { customer: existing.externalCustomerId }
      : { customer_email: user.email }),
    // Correlates the completed session back to this account in the webhook.
    client_reference_id: user.id,
    metadata: { userId: user.id, plan },
    subscription_data: { metadata: { userId: user.id, plan } },
    success_url: `${appBaseUrl()}/dashboard?upgraded=1`,
    cancel_url: `${appBaseUrl()}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Stripe did not return a Checkout URL");
  redirect(session.url);
}

/** The trial never charges, so it needs no payment provider involvement. */
export async function startProTrialAction() {
  const user = await requireUser();

  const existing = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (existing?.trialEndsAt) redirect("/pricing");

  const now = new Date();
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      status: "TRIAL",
      startDate: now,
      trialEndsAt: addDays(now, TRIAL_DAYS),
      canceledAt: null,
    },
    create: {
      userId: user.id,
      status: "TRIAL",
      startDate: now,
      trialEndsAt: addDays(now, TRIAL_DAYS),
    },
  });

  revalidatePath("/settings");
  redirect("/dashboard?trial=1");
}

/** Cancelling stops the next renewal; it does not revoke the period already
 * paid for. `plan` and `renewalDate` are preserved so grantsProAccess keeps Pro
 * live until renewalDate passes, then getSubscription lapses the row to FREE. */
export async function cancelSubscriptionAction() {
  const user = await requireUser();

  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });

  if (isStripeConfigured() && sub?.externalSubscriptionId) {
    // Stripe is the source of truth: flag it there and let the resulting
    // customer.subscription.updated webhook write the local row.
    await stripe!.subscriptions.update(sub.externalSubscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { status: "CANCELED", canceledAt: new Date() },
    });
  }

  revalidatePath("/settings");
  revalidatePath("/pricing");
  redirect("/settings");
}
