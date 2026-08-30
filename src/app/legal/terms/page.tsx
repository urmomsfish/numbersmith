import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "../legal-page";
import { PRO_PRICING, TRIAL_DAYS } from "@/lib/pricing";
import { LEGAL } from "@/lib/legal";
import {
  FREE_DAILY_PROBLEM_LIMIT,
  FREE_SIMULATIONS_PER_WEEK,
  FREE_MISTAKE_LIMIT,
} from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Terms of Service — NumberSmith",
  description: "The terms governing use of the NumberSmith math competition training platform.",
};

const LAST_UPDATED = LEGAL.lastUpdated;

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
          {LEGAL.entityName}. You can reach us at{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-brand-600 underline">
            {LEGAL.contactEmail}
          </a>
          , and we aim to reply within {LEGAL.supportResponseTime}.
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

      <Section heading="10. Disclaimers">
        <p>
          The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
          warranties of any kind, whether express or implied, to the fullest extent permitted by law.
          We specifically disclaim implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
        <p>
          We do not warrant that the service will be uninterrupted, error-free, or free of harmful
          components, or that any problem, solution, or explanation is free of errors. If you find a
          mistake in our material, please tell us and we will correct it.
        </p>
      </Section>

      <Section heading="11. Limitation of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for indirect, incidental,
          special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or
          lost opportunities, arising from or relating to your use of NumberSmith — even if we have
          been advised that such damages are possible.
        </p>
        <p>
          To the fullest extent permitted by law, our total aggregate liability for all claims
          relating to the service is limited to the greater of (a) the amount you paid us in the
          twelve months before the event giving rise to the claim, or (b) one hundred US dollars
          ($100).
        </p>
        <p>
          This is a deliberate allocation of risk that is reflected in our pricing, and it applies
          regardless of the legal theory on which a claim is based.
        </p>
        <p>
          <strong>Important:</strong> nothing in these terms excludes or limits liability that cannot
          lawfully be excluded or limited. This includes liability for fraud, fraudulent
          misrepresentation, wilful injury, gross negligence, or violation of law, and any rights you
          have as a consumer that cannot be waived. Some jurisdictions do not allow certain
          exclusions, so parts of this section may not apply to you.
        </p>
      </Section>

      <Section heading="12. Indemnification">
        <p>
          You agree to indemnify and hold harmless NumberSmith and its owner from claims, damages,
          and reasonable legal costs arising out of (a) your misuse of the service, (b) your breach
          of these terms, (c) your violation of any law or of another person&apos;s rights, or (d)
          your unauthorised sharing or redistribution of our content.
        </p>
        <p>
          If you are a parent or guardian whose child uses NumberSmith, this applies to their use of
          the service under your account. This obligation does not apply to claims arising from our
          own gross negligence, wilful misconduct, or violation of law.
        </p>
      </Section>

      <Section heading="13. Resolving disputes">
        <p>
          <strong>Talk to us first.</strong> Most problems are resolved quickly by email. Before
          starting any formal proceeding, please contact us at{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-brand-600 underline">
            {LEGAL.contactEmail}
          </a>{" "}
          and give us 30 days to try to resolve it. We will do the same before bringing a claim
          against you.
        </p>
        <p>
          <strong>Arbitration.</strong> If we cannot resolve a dispute informally, you and we agree
          that it will be settled by binding individual arbitration administered by a recognised
          arbitration provider under its consumer rules, rather than in court. The Federal
          Arbitration Act governs the interpretation and enforcement of this section.
        </p>
        <p>
          <strong>Exceptions.</strong> Either of us may still bring a claim in small-claims court,
          and either of us may seek an injunction in court to protect intellectual property or stop
          unauthorised access. Nothing here prevents you from reporting a concern to a government
          agency.
        </p>
        <p>
          <strong>Individual claims only.</strong> To the extent permitted by law, disputes will be
          brought only in an individual capacity, and not as a plaintiff or class member in any class
          or representative action. If this restriction is found unenforceable as to a particular
          claim, that claim proceeds in court and the rest of this section still applies to the
          others.
        </p>
        <p>
          <strong>You can opt out.</strong> You may reject this arbitration and class-waiver section
          by emailing us within 30 days of first accepting these terms, stating your name and that
          you opt out. Opting out will not affect your account or your use of NumberSmith in any way.
        </p>
        <p>
          <strong>Where accounts are held by a parent or guardian</strong>, the adult account holder
          agrees to this section on their own behalf. We do not seek to bind a minor to arbitration,
          and this section does not waive any right a minor has that cannot lawfully be waived.
        </p>
      </Section>

      <Section heading="14. Termination">
        <p>
          You may stop using NumberSmith and delete your account at any time. We may terminate or
          suspend access for violations of these terms. On termination your licence to our content
          ends. Sections that by their nature should survive — including limitation of liability,
          indemnification, and dispute resolution — continue to apply.
        </p>
      </Section>

      <Section heading="15. Governing law">
        <p>
          These terms are governed by the laws of{" "}
          {LEGAL.jurisdiction}, without regard to conflict-of-law rules. Where a dispute proceeds in
          court rather than arbitration, it will be brought in the state or federal courts located in
          California, and both of us consent to that jurisdiction. This does not deprive you of any
          protection under the mandatory laws of the place where you live.
        </p>
      </Section>

      <Section heading="16. If part of these terms is unenforceable">
        <p>
          If any provision of these terms is found invalid or unenforceable, that provision will be
          limited or removed to the minimum extent necessary, and the remaining provisions will stay
          in full force.
        </p>
      </Section>

      <Section heading="17. Changes to these terms">
        <p>
          We may update these terms. If we make material changes we will notify account holders and
          update the date at the top of this page. Continuing to use NumberSmith after a change means
          you accept the updated terms.
        </p>
      </Section>

      <Section heading="18. Contact">
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-brand-600 underline">
            {LEGAL.contactEmail}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
