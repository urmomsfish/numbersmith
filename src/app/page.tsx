import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRO_PRICING } from "@/lib/pricing";
import { RATING_TIERS, difficultyLabel } from "@/lib/types";
import { parseChoices } from "@/lib/engine/scoring";

const HOW_IT_WORKS = [
  {
    step: "1.",
    title: "Find Your Level",
    body: "Take a short adaptive assessment that measures competition mathematics ability rather than grade level.",
  },
  {
    step: "2.",
    title: "Choose Your Competition",
    body: "Pick every contest you're training for, from Math Kangaroo to the IMO, and set your #1 priority.",
  },
  {
    step: "3.",
    title: "Get Your Training Plan",
    body: "Your practice adapts to you — not the other way around. A week-by-week plan built from your weakest topics and your goals.",
  },
  {
    step: "4.",
    title: "Practice & Improve",
    body: "Solve real competition mathematics with hints, full solutions, and a rating that moves as you get better.",
  },
];

const FAQ = [
  {
    q: "Is the placement test really free?",
    a: "Yes, always. Creating an account, taking the full adaptive placement test, seeing your NumberSmith level and skill breakdown, choosing competitions, and getting a personalized training plan are all free forever.",
  },
  {
    q: "How is this different from just doing past papers?",
    a: "Past papers tell you your score. NumberSmith tells you what to do next. Every problem you solve updates your topic mastery, rating, and training plan — so the platform always has an answer to 'what should I practice today?'",
  },
  {
    q: "Do I need AI for this to work?",
    a: "No. The placement test, scoring, rating, adaptive training engine, statistics, problem database, simulations, and study planner are all fully deterministic. AI tutoring is planned as an optional future Pro add-on, never a requirement.",
  },
  {
    q: "Where do the problems come from?",
    a: "Every problem is written specifically for NumberSmith, with its source and license recorded as data rather than assumed. We do not scrape copyrighted competition archives. Every answer key is also checked by an automated verifier that re-solves each problem from scratch and never reads the stored answer — see the About page for how that works.",
  },
  {
    q: "What ages is this for?",
    a: "Elementary through high school. Tracks span Math Kangaroo and MOEMS for younger students, MathCounts and AMC 8 for middle school, AMC 10/12 and AIME for high school, and USAMO/IMO-level material for olympiad students.",
  },
];

export default async function LandingPage() {
  const competitions = await prisma.competition.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, shortName: true, category: true },
  });

  const problemCount = await prisma.problem.count({ where: { isPublished: true } });

  // Shown verbatim in the practice section so the preview is real product
  // content rather than a mockup.
  const sampleProblem = await prisma.problem.findUnique({
    where: { slug: "combo-pigeonhole-02" },
    include: { topic: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Know what to practice next.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Take a placement test, add the contests you&apos;re actually sitting, and NumberSmith
              builds the practice backwards from those dates — {problemCount.toLocaleString()}{" "}
              problems across {competitions.length} competitions, from Math Kangaroo to the IMO.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <LinkButton href="/signup" size="lg">
                Take the Free Assessment
              </LinkButton>
              <Link
                href="#competitions"
                className="text-sm font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
              >
                See the competitions
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Getting started</h2>
          {/* A real ordered list rather than four cards with decorative "01"
              numerals — the steps are sequential, so the markup should say so
              and the browser can number them. */}
          <ol className="mt-8 max-w-2xl space-y-6">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 w-5 shrink-0 text-sm font-semibold tabular-nums text-slate-400 dark:text-slate-500">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Competitions */}
        <section id="competitions" className="border-y border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Choose Your Competition</h2>
              <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
                Dedicated training tracks across every level of competition mathematics.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {(
                [
                  ["ELEMENTARY_MIDDLE", "Elementary / Middle School"],
                  ["HIGH_SCHOOL", "High School"],
                  ["OLYMPIAD", "Olympiad / Advanced"],
                ] as const
              ).map(([category, label]) => (
                <div key={category}>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {competitions
                      .filter((c) => c.category === category)
                      .map((c) => (
                        <span
                          key={c.slug}
                          className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                          {c.shortName}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product preview: practice + progress */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Practice Real Competition Mathematics
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                Every problem comes with progressive hints, a full worked solution, difficulty and
                topic tagging, and an estimated solve time. Miss one and it goes straight into your
                mistake queue for spaced review.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Adaptive difficulty that responds to your accuracy and speed",
                  "Progressive hints that guide without giving the answer away",
                  "Full solutions written for understanding, not just checking",
                  "Automatic mistake tracking and spaced review",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-success-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* A real problem from the database, rendered by the same markup the
                practice interface uses. Not a mockup. */}
            {sampleProblem && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-6">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{sampleProblem.topic.name}</Badge>
                  <Badge tone="slate">{difficultyLabel(sampleProblem.difficulty)}</Badge>
                </div>
                <p className="mt-4 text-base font-medium leading-relaxed text-slate-900 dark:text-slate-50">
                  {sampleProblem.question}
                </p>
                <div className="mt-5 space-y-2">
                  {parseChoices(sampleProblem.choices).map((choice, i) => (
                    <div
                      key={choice}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {["A", "B", "C", "D", "E"][i]}
                      </span>
                      {choice}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">
                  One of {problemCount} original problems. Hints and a full solution are available
                  once you attempt it.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Track improvement */}
        <section className="border-y border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              {/* The real rating scale the product uses, not a sample student's
                  numbers. */}
              <div className="order-2 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:order-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">The NumberSmith rating scale</p>
                <dl className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {RATING_TIERS.filter((t) => t.min >= 1000).map((tier) => (
                    <div key={tier.label} className="flex items-baseline justify-between py-2">
                      <dt className="text-sm text-slate-600 dark:text-slate-300">{tier.label}</dt>
                      <dd className="font-mono text-sm tabular-nums text-slate-900 dark:text-slate-50">
                        {tier.max === Infinity ? `${tier.min}+` : `${tier.min}–${tier.max}`}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                  Your placement test sets the starting number. Every problem after that moves it.
                </p>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Track Your Improvement</h2>
                <p className="mt-3 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                  A NumberSmith rating from Beginner to Elite, per-topic mastery, per-competition
                  readiness, and a full rating history going back to your first placement test.
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  {[
                    "Overall, competition-specific, and per-topic ratings",
                    "Topic mastery that updates with every problem",
                    "Performance breakdowns by difficulty tier",
                    "XP, levels, streaks, and 15 earnable achievements",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-success-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Free vs Pro */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Free vs Pro</h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              The free plan is built for students who may never pay for it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-7">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">NumberSmith Free</h3>
              <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                $0 <span className="text-sm font-normal text-slate-400 dark:text-slate-500">forever</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Full adaptive placement test",
                  "Your level, rating & skill breakdown",
                  "Personalized training plan",
                  "15 problems per day",
                  "Daily challenge & intro lessons",
                  "2 simulations per week",
                  "XP, streaks & achievements",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-success-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <LinkButton href="/signup" variant="outline" size="lg" className="mt-6 w-full">
                Start Free
              </LinkButton>
            </div>

            {/* Emphasised with a ring rather than a thicker border: border-2
                shrinks the content box by a pixel each side, which made the two
                columns' buttons render at different heights side by side. */}
            <div className="relative flex flex-col rounded-2xl border border-brand-600 ring-1 ring-brand-600 bg-card p-7">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">NumberSmith Pro</h3>
              <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                ${PRO_PRICING.YEARLY} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/year</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">or ${PRO_PRICING.MONTHLY}/month</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Unlimited daily problems",
                  "Full problem database & all difficulties",
                  "Complete lesson library",
                  "Unlimited simulations",
                  "Advanced adaptive training",
                  "Full mistake review + spaced repetition",
                  "Advanced statistics & custom practice",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-600 dark:text-brand-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <LinkButton href="/pricing" size="lg" className="mt-6 w-full">
                Upgrade to Pro
              </LinkButton>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">
            <Link href="/pricing" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              See the full feature comparison →
            </Link>
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-5"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-50">
                    <span className="flex items-center justify-between gap-3">
                      {item.q}
                      <span className="text-slate-300 dark:text-slate-600 transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-slate-200 dark:border-slate-700">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Find out where you actually stand.</h2>
            <p className="mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              The placement test is free, takes about 15 minutes, and tells you exactly what to train
              next.
            </p>
            <LinkButton href="/signup" size="lg" className="mt-7">
              Take the Free Assessment
            </LinkButton>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
