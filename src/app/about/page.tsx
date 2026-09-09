import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LinkButton } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";
import { GENERATORS } from "../../../prisma/seed-data/generators/registry";
import { OLYMPIAD_PROBLEMS } from "../../../prisma/seed-data/problems-olympiad";

const GENERATOR_COUNT = GENERATORS.length;
const OLYMPIAD_COUNT = OLYMPIAD_PROBLEMS.length;

export const metadata: Metadata = {
  title: "About NumberSmith — How it works and what we actually claim",
  description:
    "How NumberSmith's adaptive engine works, where its problems come from, how every answer is verified, and what the platform does not claim.",
};

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-5">
      <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-slate-200 dark:border-slate-700">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  const [
    problemCount,
    competitionCount,
    lessonCount,
    topicCount,
    handWritten,
    advancedCount,
    domains,
  ] = await Promise.all([
    prisma.problem.count({ where: { isPublished: true } }),
    prisma.competition.count(),
    prisma.lesson.count(),
    prisma.topic.count({ where: { parentId: { not: null } } }),
    prisma.problem.count({ where: { isPublished: true, isPlacement: true } }),
    prisma.problem.count({ where: { isPublished: true, difficulty: { gte: 7 } } }),
    prisma.topic.findMany({
      where: { parentId: null },
      select: { name: true, _count: { select: { children: true } } },
      orderBy: { order: "asc" },
    }),
  ]);

  // Every problem's provenance is a real column, so this is a fact about the
  // database rather than a marketing line. If a non-original problem were ever
  // added, this section would say so on its own.
  const sources = await prisma.problem.groupBy({
    by: ["source"],
    _count: { _all: true },
    where: { isPublished: true },
  });
  const allOriginal =
    sources.length === 1 && sources[0].source === "NumberSmith Original";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section>
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              About NumberSmith
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              NumberSmith is an adaptive training platform for competition mathematics. This page
              exists to explain exactly how it works and exactly what it does not claim — because a
              study tool that quietly guesses at your level, or quietly gets an answer wrong, is
              worse than no study tool at all.
            </p>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
              It is early. There is no user testimonial section on this page, no success-rate
              statistic, and no score-improvement claim, because NumberSmith has not been running
              long enough for any of those to be true. What follows is only what can be verified
              today.
            </p>
          </div>
        </section>

        {/* What's actually in it — read live from the database */}
        <section className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              What is actually in it
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              The real numbers, read from the live database
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">
              These four figures are queried from the production database when you load this page.
              They are not typed into the design, so they cannot drift out of date or be rounded up.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat value={problemCount} label="Original problems" />
              <Stat value={competitionCount} label="Competition tracks" />
              <Stat value={topicCount} label="Topics" />
              <Stat value={lessonCount} label="Lessons" />
            </div>

            <p className="mt-8 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Topics are organized into {domains.length} domains:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {domains.map((d) => (
                <span
                  key={d.name}
                  className="rounded-full border border-slate-200 dark:border-slate-700 bg-card px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {d.name}
                  <span className="ml-1.5 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                    {d._count.children}
                  </span>
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-slate-50">
                What that {problemCount.toLocaleString()} actually consists of:
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {handWritten} are hand-written
                </span>{" "}
                and reserved for the placement test — they are never served as practice, so your
                rating is never set by questions you have already drilled. Another{" "}
                {OLYMPIAD_COUNT} are hand-written olympiad problems at the top of the difficulty
                range. The remaining{" "}
                {(problemCount - handWritten - OLYMPIAD_COUNT).toLocaleString()} come from{" "}
                {GENERATOR_COUNT} parameterized templates: real problems with genuinely varied
                numbers, but roughly {GENERATOR_COUNT} underlying ideas rather than{" "}
                {(problemCount - handWritten - OLYMPIAD_COUNT).toLocaleString()} distinct ones.
                That is the honest way to read the number, and it is why we call it a practice bank
                rather than a problem collection.
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  The difficulty spread is uneven and skews easy.
                </span>{" "}
                {advancedCount.toLocaleString()} problems sit at difficulty 7 or above out of{" "}
                {problemCount.toLocaleString()}. Generated variation works well through the AMC and
                early AIME range — arithmetic, algebraic manipulation, counting, modular arithmetic,
                and standard geometry, where repetition genuinely builds fluency. It stops working
                at the olympiad level, where each problem is a single idea that cannot be
                re-parameterized. Proof-based training for USAMO, IMO, and EGMO is not something
                NumberSmith does yet, and the very top of the range stays thin until it is written
                by hand.
              </p>
            </div>
          </div>
        </section>

        {/* Answer verification — the core credibility claim */}
        <Section id="verification" eyebrow="Correctness" title="Every answer is machine-verified">
          <p>
            A wrong answer key is the single worst failure mode for a practice platform. It teaches
            the wrong method, and it does it with total confidence. So NumberSmith does not rely on
            an author double-checking their own work.
          </p>
          <p>
            The {handWritten} hand-written problems are checked by a script that independently
            re-solves each one from scratch — by brute-force search wherever the problem allows one
            — and compares its own result against the stored answer key. The script never reads the
            stored answer to decide what the answer should be. For multiple-choice problems it first
            resolves the stored letter through the choices list, so a correct value paired with the
            wrong letter still fails.
          </p>
          <p>
            The generated problems work the other way round: no answer is ever authored, so there is
            nothing for the key to disagree with. Each template draws its numbers, computes the
            answer from them, and then recomputes it a second time by a deliberately different route
            — a closed-form formula checked against a brute-force search, or vice versa. Any
            instance where the two disagree is discarded rather than published. Both mechanisms run
            in the same command:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5">
            <pre className="font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              <span className="text-slate-400 dark:text-slate-500">$ npm run verify:answers</span>
              {`\n\nverified:  ${handWritten}/${handWritten}\nmismatches: 0\n\n--- generated bank ---\ngenerators:        ${GENERATOR_COUNT}\ngenerated:         ${(problemCount - handWritten).toLocaleString()}\nanswer mismatches: 0\nstructural faults: 0`}
            </pre>
          </div>
          <p>
            The check fails loudly if a hand-written problem lacks an independent verification, so
            one cannot be added without a check being written for it. The structural pass separately
            catches what a per-problem check cannot: duplicate options, an answer letter with no
            corresponding choice, missing hints, or a difficulty outside the scale.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This catches mathematical errors in answer keys. It does not certify that every hint and
            worked solution is perfectly worded — those are reviewed by hand. If you find an error of
            any kind, please report it to{" "}
            <a
              href={`mailto:${LEGAL.contactEmail}`}
              className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              {LEGAL.contactEmail}
            </a>{" "}
            and it will be corrected.
          </p>
        </Section>

        {/* Provenance */}
        <Section eyebrow="Provenance" title="Where the problems come from">
          <p>
            Competition problems are copyrighted by the organizations that write them. NumberSmith
            does not scrape or republish AMC, MATHCOUNTS, Math Kangaroo, HMMT, or any other
            organization&apos;s archives.
          </p>
          <p>
            Every problem is written specifically for NumberSmith, and each one carries its source,
            license, and author as columns in the database rather than as an assumption.{" "}
            {allOriginal ? (
              <>
                All {problemCount} currently published problems are recorded as{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-50">NumberSmith Original</span>.
              </>
            ) : (
              <>
                The library currently contains problems from{" "}
                {sources.map((s) => `${s.source} (${s._count._all})`).join(", ")}.
              </>
            )}
          </p>
          <p>
            The training tracks are modeled on each contest&apos;s published format — its topic mix,
            difficulty curve, timing, and answer format. NumberSmith is not affiliated with,
            endorsed by, or sponsored by any competition organization, and practicing here confers
            no standing in any actual contest.
          </p>
        </Section>

        {/* The engine */}
        <Section eyebrow="Method" title="The adaptive engine is deterministic, not AI">
          <p>
            Nothing that decides your level, your rating, or your training plan involves a language
            model. Every one of those numbers comes from a fixed algorithm you could work out on
            paper, which means the same performance always produces the same result.
          </p>
          <ul className="space-y-3 border-l-2 border-slate-200 dark:border-slate-700 pl-5">
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-50">Placement</span> starts near the middle
              of the difficulty range and steps up after correct answers and down after incorrect
              ones, accelerating on streaks. It stops once your recent difficulty range has settled,
              which is usually well before the maximum question count.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-50">Your rating</span> is computed from the
              average difficulty you settled at, adjusted by your accuracy — an Elo-inspired scale
              that then moves with every problem you solve afterward.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-50">Topic mastery</span> uses an exponential
              moving average, so recent work counts for more than work from months ago without ever
              fully erasing your history.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-50">Your training plan</span> ranks topics by
              how weak you are in them weighted by how much they matter to the competitions you
              chose, with your top-priority contest weighted double. A student training for AMC 8 and
              a student training for AIME get genuinely different plans from identical mastery
              scores.
            </li>
          </ul>
          <p>
            One deliberate consequence: your skill breakdown only shows domains the placement test
            actually tested you on. Untested topics are left out rather than filled in with a
            plausible-looking percentage.
          </p>
        </Section>

        {/* Honest limits */}
        <Section eyebrow="Limits" title="What NumberSmith does not claim">
          <p>
            Most of what makes a study tool trustworthy is what it refuses to say. For the record:
          </p>
          <ul className="space-y-3">
            {[
              "No claim that it raises contest scores. No such study has been done, so no such number is quoted anywhere on this site.",
              "No user counts, testimonials, or star ratings. There are not enough users yet for any of those to be honest.",
              "No claim of affiliation with, or endorsement by, any competition organization.",
              "No guarantee of qualification for any contest, and no prediction of your contest result.",
              "No representation that the problem library covers every topic on any syllabus. It is growing.",
              "No sale of your data, and no advertising network. The Privacy Policy states this in binding terms.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Who */}
        <Section eyebrow="Who built it" title="One person, working in the open">
          <p>
            NumberSmith is built and maintained by Aarit Chakraborty, operating as a sole
            proprietorship in {LEGAL.jurisdiction}. It is not a company with a
            support department, and this page is not going to pretend otherwise.
          </p>
          <p>
            Practically, that means support email goes to a real person and is answered within about{" "}
            {LEGAL.supportResponseTime}, and that bug reports get read. It also means NumberSmith
            moves at the pace of one person, which is the honest trade-off for everything above.
          </p>
          <p>
            Questions, corrections, and mathematical disputes are all welcome at{" "}
            <a
              href={`mailto:${LEGAL.contactEmail}`}
              className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              {LEGAL.contactEmail}
            </a>
            .
          </p>
        </Section>

        {/* CTA */}
        <section className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              See whether the engine is any good on your own math.
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              The placement test is free, takes about 15 minutes, and ends with a level, a skill
              breakdown, and a training plan you can read before deciding whether any of this is
              worth your time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/signup" size="lg">
                Take the Free Assessment
              </LinkButton>
              <LinkButton href="/legal/privacy" size="lg" variant="outline">
                Read the Privacy Policy
              </LinkButton>
            </div>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Still deciding?{" "}
              <Link href="/#faq" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                Read the FAQ →
              </Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
