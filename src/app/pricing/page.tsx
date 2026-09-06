import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSubscription } from "@/lib/subscription";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { activateProAction } from "@/lib/actions/subscription-actions";
import { PRO_PRICING, yearlySavingsPercent } from "@/lib/pricing";
import { paymentsAreLive } from "@/lib/stripe";
import { PaymentsNotice } from "@/components/marketing/payments-notice";

const COMPARISON: { feature: string; free: string; pro: string }[] = [
  { feature: "Placement Test", free: "✓", pro: "✓" },
  { feature: "Personalized Level & Rating", free: "✓", pro: "✓" },
  { feature: "Choose Competitions", free: "✓", pro: "✓" },
  { feature: "Topic Mastery Tracking", free: "✓", pro: "✓" },
  { feature: "XP, Streaks & Achievements", free: "✓", pro: "✓" },
  { feature: "Daily Challenge", free: "✓", pro: "✓" },
  { feature: "Personalized Plan", free: "Basic", pro: "Advanced" },
  { feature: "Daily Problems", free: "15 / day", pro: "Unlimited" },
  { feature: "Problem Database", free: "Limited", pro: "Full" },
  { feature: "Lessons", free: "Intro lessons", pro: "All lessons" },
  { feature: "Competition Simulations", free: "2 / week", pro: "Unlimited" },
  { feature: "Adaptive Training", free: "Basic", pro: "Advanced" },
  { feature: "Mistake Review", free: "10 most urgent", pro: "Full + spaced repetition" },
  { feature: "Statistics", free: "Basic", pro: "Advanced" },
  { feature: "Custom Practice Sets", free: "—", pro: "✓" },
  { feature: "Advanced Problems (Expert+)", free: "—", pro: "✓" },
  { feature: "Premium Courses", free: "—", pro: "✓" },
  { feature: "AI Features", free: "—", pro: "Future Pro Feature" },
];

const FREE_FEATURES = [
  "Full adaptive placement test",
  "Your NumberSmith level, rating & skill breakdown",
  "Choose from 20 competitions",
  "Personalized weekly training plan",
  "15 problems per day",
  "Daily challenge with bonus XP",
  "Introductory lesson library",
  "2 competition simulations per week",
  "XP, levels, streaks & achievements",
  "Topic mastery tracking",
  "Basic mistake review & statistics",
];

const PRO_FEATURES = [
  "Everything in Free, plus:",
  "Unlimited daily problems",
  "Full problem database — all difficulty levels",
  "Complete lesson library including olympiad technique",
  "Unlimited competition simulations",
  "Advanced adaptive training engine",
  "Full mistake review with spaced repetition",
  "Advanced statistics & rating analytics",
  "Competition-specific roadmaps",
  "Custom practice sets",
  "Detailed performance reports",
  "Premium courses",
  "Future AI tutoring features",
];

const FAQ = [
  {
    q: "How does the placement test work?",
    a: "It's an adaptive assessment of roughly 20–30 questions that starts at a difficulty matched to your grade and prior experience. Answer correctly and the next question gets harder; miss one and it eases back. It measures accuracy, speed, difficulty solved, topic mastery, and consistency to produce your NumberSmith rating and skill breakdown. It's always free and you can retake it anytime.",
  },
  {
    q: "Which competitions are supported?",
    a: "Twenty competitions across three tiers: Math Kangaroo, MOEMS, MathCounts, AMC 8, Purple Comet, and Math League for elementary and middle school; AMC 10, AMC 12, AIME, ARML, HMMT, PUMaC, Stanford Math Tournament, and Math Prize for Girls for high school; and USAMTS, USAMO, IMO, IMO Shortlist, and EGMO for olympiad training.",
  },
  {
    q: "Can I change my competitions later?",
    a: "Yes, anytime from Settings. Changing your competitions immediately rebuilds your training plan, dashboard recommendations, and topic priorities around your new goals.",
  },
  {
    q: "What does Pro include?",
    a: "Unlimited daily problems and simulations, the full problem database and lesson library, advanced adaptive training, full mistake review with spaced repetition, advanced statistics, competition-specific roadmaps, custom practice sets, and premium courses.",
  },
  {
    q: "How do ratings work?",
    a: "Your NumberSmith rating runs from roughly 1000 (Beginner) to 2200+ (Elite). It rises when you solve problems that are hard relative to your current level and falls slightly when you miss problems well below it. You have an overall rating plus competition-specific ratings (AMC, MathCounts, Olympiad) and per-topic ratings.",
  },
  {
    q: "Is the free version actually useful?",
    a: "Yes. Free includes the complete placement test, your full skill breakdown, competition selection, a personalized training plan, 15 problems a day, the daily challenge, introductory lessons, two weekly simulations, and full XP, streak, and achievement systems. A dedicated student can train on the free plan for months.",
  },
  {
    q: "How do subscriptions work?",
    a: "Pro will be $7.99/month or $59.99/year (about 37% off), billed through Stripe and cancellable anytime. Payments aren't open yet while we finish setting them up, so Pro can't be purchased today — the free plan is fully available in the meantime. Cancelling always keeps your access through the period you already paid for.",
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const subscription = user ? await getSubscription(user.id) : null;
  const isPro = subscription?.status === "PRO" || subscription?.status === "TRIAL";
  // False while only a test key is configured, so we never present checkout
  // buttons that would decline a real card.
  const canBuy = paymentsAreLive();

  const contextMessage =
    params.from === "simulation-limit"
      ? "You've used your free simulations for this week."
      : params.from === "lesson"
        ? "That lesson is part of the Pro library."
        : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Choose Your Training Level
            </h1>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              Start for free. Upgrade when you&apos;re ready to train without limits.
            </p>
            {contextMessage && (
              <p className="mx-auto mt-4 max-w-md rounded-lg bg-amber-50 dark:bg-amber-950 px-4 py-2 text-sm text-amber-800 dark:text-amber-400">
                {contextMessage}
              </p>
            )}
          </div>

          {!canBuy && (
            <div className="mx-auto mt-8 max-w-2xl">
              <PaymentsNotice />
            </div>
          )}

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">🆓 NumberSmith Free</h2>
                {!isPro && user && <Badge tone="slate">Current plan</Badge>}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Everything you need to find your level and start training.
              </p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">$0</span>
                <span className="ml-1 text-sm text-slate-400 dark:text-slate-500">forever</span>
              </p>

              {/* flex-1 pushes the CTA to the card's bottom edge so both plan
                  columns land their buttons on the same line. */}
              <ul className="mt-6 flex-1 space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="mt-0.5 text-success-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <LinkButton
                href={user ? "/dashboard" : "/signup"}
                variant="outline"
                size="lg"
                className="mt-7 w-full"
              >
                {user ? "Go to Dashboard" : "Start Free"}
              </LinkButton>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-brand-600 bg-white dark:bg-slate-900 p-7">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Best Value
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">⭐ NumberSmith Pro</h2>
                {isPro && <Badge tone="brand">Current plan</Badge>}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                For students serious about competition results.
              </p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">
                  ${PRO_PRICING.YEARLY}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">/year</span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-xs font-bold text-success-600 dark:text-emerald-400">
                  Save {yearlySavingsPercent()}%
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                or ${PRO_PRICING.MONTHLY}/month billed monthly
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {PRO_FEATURES.map((f, i) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 text-sm ${
                      i === 0 ? "font-semibold text-slate-800" : "text-slate-600"
                    }`}
                  >
                    {i !== 0 && <span className="mt-0.5 text-brand-600 dark:text-brand-400">✓</span>}
                    {f}
                  </li>
                ))}
              </ul>

              {isPro ? (
                <LinkButton href="/settings" variant="outline" size="lg" className="mt-7 w-full">
                  Manage Subscription
                </LinkButton>
              ) : !canBuy ? (
                <div className="mt-7 space-y-2">
                  <Button size="lg" className="w-full" disabled>
                    Coming soon
                  </Button>
                  <p className="pt-1 text-center text-xs text-slate-400 dark:text-slate-500">
                    Payments aren&apos;t open yet. The free plan is fully available in the meantime.
                  </p>
                </div>
              ) : user ? (
                <div className="mt-7 space-y-2">
                  <form action={activateProAction}>
                    <input type="hidden" name="plan" value="YEARLY" />
                    <Button type="submit" size="lg" className="w-full">
                      Get Pro Yearly — ${PRO_PRICING.YEARLY}
                    </Button>
                  </form>
                  <form action={activateProAction}>
                    <input type="hidden" name="plan" value="MONTHLY" />
                    <Button type="submit" variant="outline" size="lg" className="w-full">
                      Get Pro Monthly — ${PRO_PRICING.MONTHLY}/mo
                    </Button>
                  </form>
                  <p className="pt-1 text-center text-xs text-slate-400 dark:text-slate-500">
                    Secure checkout by Stripe. Cancel anytime — see our{" "}
                    <Link href="/legal/refunds" className="underline">
                      refund policy
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <LinkButton href="/signup" size="lg" className="mt-7 w-full">
                  Start Free, Upgrade Anytime
                </LinkButton>
              )}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">Free vs Pro</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Feature</th>
                    <th className="px-3 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">Free</th>
                    <th className="px-3 py-3 text-center font-semibold text-brand-700 dark:text-brand-300">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-2.5 text-slate-700 dark:text-slate-200">{row.feature}</td>
                      <td className="px-3 py-2.5 text-center text-slate-500 dark:text-slate-400">{row.free}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-brand-700 dark:text-brand-300">
                        {row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-50 marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-slate-300 dark:text-slate-600 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The placement test is always free. You never pay to find out where you stand.
            </p>
            <LinkButton href={user ? "/dashboard" : "/signup"} size="lg" className="mt-4">
              {user ? "Back to Training" : "Take the Free Assessment"}
            </LinkButton>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Questions?{" "}
              <Link href="/" className="underline">
                Learn more about NumberSmith
              </Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
