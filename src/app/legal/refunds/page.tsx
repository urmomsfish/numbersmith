import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "../legal-page";
import { PRO_PRICING, TRIAL_DAYS } from "@/lib/pricing";
import { FREE_DAILY_PROBLEM_LIMIT } from "@/lib/subscription";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — NumberSmith",
  description: "How to cancel a NumberSmith Pro subscription and when refunds are available.",
};

const LAST_UPDATED = LEGAL.lastUpdated;

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      lastUpdated={LAST_UPDATED}
      intro="You can cancel at any time in two clicks, and you keep everything you already paid for. This page explains exactly what happens."
    >
      <Section heading="Try it free first">
        <p>
          You do not need to pay to find out whether NumberSmith works for you. The free plan
          includes the complete placement test, your rating and skill breakdown, a personalised
          training plan, and {FREE_DAILY_PROBLEM_LIMIT} problems a day — indefinitely. We also offer
          an optional {TRIAL_DAYS}-day Pro trial that ends on its own and never converts into a
          charge.
        </p>
      </Section>

      <Section heading="How to cancel">
        <p>
          Go to <strong>Settings → Subscription → Cancel Subscription</strong>. Cancellation is
          immediate and takes effect at the end of your current billing period. You do not need to
          contact us or explain why.
        </p>
      </Section>

      <Section heading="What happens when you cancel">
        <Bullets
          items={[
            <>
              <strong>You keep Pro until the end of the period you already paid for.</strong>{" "}
              Cancelling in month two of an annual plan leaves you with Pro for the remaining ten
              months.
            </>,
            "Your subscription does not renew after that date.",
            "When the period ends your account returns to the free plan. It is not deleted.",
            "Your problem history, ratings, mastery, streaks, and achievements are all preserved. If you resubscribe later, everything is still there.",
          ]}
        />
      </Section>

      <Section heading="Refunds">
        <p>
          Because cancelling already lets you keep the time you paid for, most people do not need a
          refund. That said:
        </p>
        <Bullets
          items={[
            <>
              <strong>Within {LEGAL.refundWindowDays} days of your first payment</strong> —
              contact us and we will refund it in full, no questions asked.
            </>,
            <>
              <strong>Accidental or duplicate charges</strong> — refunded in full whenever they
              happen. This includes a renewal you did not intend, if you contact us promptly and have
              not substantially used the new period.
            </>,
            <>
              <strong>If we discontinue the service</strong> while you hold a paid subscription, we
              refund the unused portion automatically.
            </>,
            <>
              <strong>A child subscribed without permission</strong> — subscriptions are meant to be
              purchased by adults. If a minor subscribed using your payment method without your
              authorisation, contact us and we will cancel and refund it.
            </>,
          ]}
        />
        <p>
          Outside those cases, payments for a completed billing period are generally not refundable,
          since you retained full access for that period. We look at genuine exceptions
          individually — if something went wrong, tell us.
        </p>
      </Section>

      <Section heading="Current pricing">
        <Bullets
          items={[
            <>Monthly — ${PRO_PRICING.MONTHLY}, renews every month.</>,
            <>Yearly — ${PRO_PRICING.YEARLY}, renews every twelve months.</>,
          ]}
        />
        <p>
          Prices are in US dollars. Applicable sales tax or VAT is calculated at checkout and shown
          before you pay.
        </p>
      </Section>

      <Section heading="How to request a refund">
        <p>
          Email{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-brand-600 underline">
            {LEGAL.contactEmail}
          </a>{" "}
          from the address on the account, and tell us roughly when you were charged. We aim to
          respond within {LEGAL.supportResponseTime}. Approved refunds go back to the original
          payment method and typically take 5–10 business days to appear, depending on your bank.
        </p>
      </Section>

      <Section heading="Related">
        <p>
          See our{" "}
          <Link href="/legal/terms" className="text-brand-600 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-brand-600 underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
