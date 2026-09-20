import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { difficultyLabel } from "@/lib/types";
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
    body: "Your practice adapts to you and builds a week-by-week plan from your weakest topics and your goals.",
  },
  {
    step: "4.",
    title: "Practice & Improve",
    body: "Solve real competition mathematics with hints, full solutions, and a rating that moves as you get better.",
  },
];

export default async function LandingPage() {
  const competitions = await prisma.competition.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, shortName: true, category: true },
  });

  const problemCount = await prisma.problem.count({ where: { isPublished: true } });
  const sampleProblem = await prisma.problem.findUnique({
    where: { slug: "combo-pigeonhole-02" },
    include: { topic: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-slate-200 bg-surface">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.055em] text-slate-900 sm:text-6xl">
                Train Smarter. Compete Better.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-8 text-slate-700">
                Take a placement test, add the contests you&apos;re actually sitting, and NumberSmith
                builds the practice around those dates. {problemCount.toLocaleString()} problems
                across {competitions.length} competitions, from Math Kangaroo to the IMO.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LinkButton href="/signup" size="lg">
                  Take the Free Assessment
                </LinkButton>
                <Link href="#how-it-works" className="text-sm font-semibold text-slate-900 underline underline-offset-4">
                  See how it works
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 border-l border-slate-300 pl-6">
              <div>
                <p className="font-mono text-3xl font-semibold tabular-nums text-slate-900">{problemCount.toLocaleString()}</p>
                <p className="mt-1 text-sm text-slate-700">original problems</p>
              </div>
              <div className="border-l border-slate-200 pl-5">
                <p className="font-mono text-3xl font-semibold tabular-nums text-slate-900">{competitions.length}</p>
                <p className="mt-1 text-sm text-slate-700">competition tracks</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Getting started</h2>
          <ol className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.title} className="flex gap-4 border-t border-slate-200 pt-4">
                <span className="w-6 shrink-0 font-mono text-sm font-semibold tabular-nums text-brand-700">{item.step}</span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="competitions" className="border-y border-slate-200 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="text-3xl font-semibold text-slate-900">Choose your competition</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Dedicated training tracks across every level of competition mathematics.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {(
                [
                  ["ELEMENTARY_MIDDLE", "Elementary / Middle School"],
                  ["HIGH_SCHOOL", "High School"],
                  ["OLYMPIAD", "Olympiad / Advanced"],
                ] as const
              ).map(([category, label]) => (
                <div key={category}>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <div className="mt-3 space-y-2">
                    {competitions
                      .filter((competition) => competition.category === category)
                      .map((competition) => (
                        <div key={competition.slug} className="border-b border-slate-200 py-2 text-sm text-slate-900">
                          {competition.shortName}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">Practice real competition mathematics</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Every problem comes with progressive hints, a full worked solution, difficulty and
                topic tagging, and an estimated solve time. Miss one and it goes into your mistake queue for review.
              </p>
              <LinkButton href="/practice" variant="outline" className="mt-6">
                Browse the problem database
              </LinkButton>
            </div>

            {sampleProblem && (
              <div className="border border-slate-300 bg-card p-6">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{sampleProblem.topic.name}</Badge>
                  <Badge tone="slate">{difficultyLabel(sampleProblem.difficulty)}</Badge>
                </div>
                <p className="mt-4 text-base font-medium leading-7 text-slate-900">{sampleProblem.question}</p>
                <div className="mt-5 space-y-2">
                  {parseChoices(sampleProblem.choices).map((choice, i) => (
                    <div key={choice} className="flex items-center gap-3 border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-900">
                        {["A", "B", "C", "D", "E"][i]}
                      </span>
                      {choice}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Find out where you actually stand.</h2>
              <p className="mt-2 max-w-xl text-base leading-7 text-slate-700">
                The placement test is free, takes about 15 minutes, and tells you exactly what to train next.
              </p>
            </div>
            <LinkButton href="/signup">Take the Free Assessment</LinkButton>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
