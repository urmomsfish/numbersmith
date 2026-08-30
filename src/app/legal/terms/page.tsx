import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Placeholder } from "../legal-page";
import { PRO_PRICING, TRIAL_DAYS } from "@/lib/pricing";
import {
  FREE_DAILY_PROBLEM_LIMIT,
  FREE_SIMULATIONS_PER_WEEK,
  FREE_MISTAKE_LIMIT,
} from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Terms of Service — NumberSmith",
  description: "The terms governing use of the NumberSmith math competition training platform.",
};

const LAST_UPDATED = "August 30, 2026";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="These terms govern your use of NumberSmith. By creating an account you agree to them. Please read the sections on eligibility and subscriptions carefully."
    >
      <Section heading="1. Who we are">
        <p>
          NumberSmith is an online platform for practising competition mathematics, operated by{" "}
          <Placeholder>[LEGAL ENTITY NAME]</Placeholder> of{" "}
          <Placeholder>[BUSINESS ADDRESS]</Placeholder>. You can reach us at{" "}
          <Placeholder>[SUPPORT EMAIL]</Placeholder>.
        </p>
      </Section>

      <Section heading="2. Eligibility and accounts for children">
        <p>
          NumberSmith is intended for students in elementary through high school, which means many
          of our users are minors.
        </p>
        <Bullets
          items={[
            <>
              If you are <strong>under 18</strong>, you may use NumberSmith only with the involvement
              and permission of a parent or legal guardian.
            </>,
            <>
              If you are <strong>under 13</strong>, a parent or guardian must create and consent to
              the account. See our <Link href="/legal/privacy" className="text-brand-600 underline">Privacy Policy</Link> for how we handle children&apos;s information.
            </>,
            <>
              Only a parent, guardian, or other adult may purchase a subscription. By subscribing you
              confirm you are at least 18 and authorised to use the payment method.
            </>,
            <>
              You are responsible for keeping your password confidential and for activity under your
              account.
            </>,
          ]}
        />
      </Section>

      <Section heading="3. Free and Pro plans">
        <p>NumberSmith offers a free plan and a paid plan called NumberSmith Pro.</p>
        <Bullets
          items={[
            <>
              <strong>Free</strong> includes the full placement test, your rating and skill
              breakdown, competition selection, a personalised training plan,{" "}
              {FREE_DAILY_PROBLEM_LIMIT} problems per day, the daily challenge, introductory lessons,{" "}
              {FREE_SIMULATIONS_PER_WEEK} competition simulations per week, and review of your{" "}
              {FREE_MISTAKE_LIMIT} most urgent mistakes.
            </>,
            <>
              <strong>Pro</strong> costs ${PRO_PRICING.MONTHLY} per month or ${PRO_PRICING.YEARLY}{" "}
              per year and removes those limits, adding the full problem database, complete lesson
              library, unlimited simulations, and advanced statistics.
            </>,
            <>
              We may offer a {TRIAL_DAYS}-day Pro trial. A trial ends automatically and does not
              convert into a paid subscription unless you choose to subscribe. We will not charge you
              when a trial ends.
            </>,
          ]}
        />
        <p>
          We may change plan features or pricing. If we raise the price of a subscription you already
          hold, we will tell you before it applies to your renewal, and you may cancel instead.
        </p>
      </Section>

      <Section heading="4. Billing, renewal and cancellation">
        <p>
          Subscriptions renew automatically at the end of each billing period until cancelled.
          Payments are processed by Stripe; we do not receive or store your full card details.
        </p>
        <p>
          You may cancel at any time from your account settings. Cancelling stops the next renewal
          and <strong>keeps your Pro access until the end of the period you have already paid
          for</strong>. Refunds are covered in our{" "}
          <Link href="/legal/refunds" className="text-brand-600 underline">
            Refund and Cancellation Policy
          </Link>
          .
        </p>
      </Section>

      <Section heading="5. Acceptable use">
        <p>You agree not to:</p>
        <Bullets
          items={[
            "Share, resell, or publicly redistribute our problems, solutions, or lessons.",
            "Share your account credentials, or use one account for multiple students.",
            "Scrape, bulk-download, or automatically extract content from the platform.",
            "Attempt to bypass plan limits, access controls, or other users' accounts.",
            "Interfere with or disrupt the service or its infrastructure.",
          ]}
        />
        <p>We may suspend or terminate accounts that violate these terms.</p>
      </Section>

      <Section heading="6. Our content and your work">
        <p>
          All problems, solutions, lessons, and other material on NumberSmith are original works
          created by us or properly licensed, and remain our property. Your subscription grants you a
          personal, non-transferable licence to use them for your own study.
        </p>
        <p>
          Anything you write on the platform — such as scratch notes during a simulation — remains
          yours. We use it only to operate the service.
        </p>
      </Section>

      <Section heading="7. Competition names and independence">
        <p>
          NumberSmith provides independent practice modelled on the published formats of various
          mathematics competitions. Competition names are used only to describe what our material
          prepares you for. <strong>We are not affiliated with, endorsed by, or sponsored by</strong>{" "}
          MAA, MATHCOUNTS, Math Kangaroo, MOEMS, HMMT, PUMaC, ARML, or any other competition
          organisation. We do not administer any official competition, and practising here does not
          register you for one.
        </p>
      </Section>

      <Section heading="8. No guarantee of results">
        <p>
          NumberSmith is a study tool. Ratings, skill breakdowns, and readiness percentages are our
          own internal estimates based on your activity here. They are not official scores and do not
          predict or guarantee performance in any real competition, admission, or examination.
        </p>
      </Section>

      <Section heading="9. Availability and changes">
        <p>
          We aim to keep NumberSmith available but do not guarantee uninterrupted service. We may
          modify, suspend, or discontinue features. If we discontinue the service entirely while you
          hold a paid subscription, we will refund the unused portion.
        </p>
      </Section>

      <Section heading="10. Disclaimers and limitation of liability">
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of any kind, to the fullest
          extent permitted by law. To the extent permitted by law, our total liability arising from
          your use of NumberSmith is limited to the amount you paid us in the twelve months before
          the claim.
        </p>
        <p>Nothing in these terms limits liability that cannot be limited by law.</p>
      </Section>

      <Section heading="11. Termination">
        <p>
          You may stop using NumberSmith and delete your account at any time. We may terminate or
          suspend access for violations of these terms. On termination your licence to our content
          ends.
        </p>
      </Section>

      <Section heading="12. Governing law">
        <p>
          These terms are governed by the laws of{" "}
          <Placeholder>[STATE/JURISDICTION]</Placeholder>, without regard to conflict-of-law rules.
        </p>
      </Section>

      <Section heading="13. Changes to these terms">
        <p>
          We may update these terms. If we make material changes we will notify account holders and
          update the date at the top of this page. Continuing to use NumberSmith after a change means
          you accept the updated terms.
        </p>
      </Section>

      <Section heading="14. Contact">
        <p>
          Questions about these terms: <Placeholder>[SUPPORT EMAIL]</Placeholder>.
        </p>
      </Section>
    </LegalPage>
  );
}
