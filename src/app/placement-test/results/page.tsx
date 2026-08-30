import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Logo } from "@/components/logo";
import { DOMAIN_TOPIC_SLUGS, ratingTier } from "@/lib/types";
import { recommendCompetitionSlug } from "@/lib/engine/recommend";

const DOMAIN_LABELS: Record<string, string> = {
  arithmetic: "Arithmetic",
  algebra: "Algebra",
  geometry: "Geometry",
  "number-theory": "Number Theory",
  combinatorics: "Combinatorics",
  probability: "Probability",
  logic: "Logic",
};

export default async function PlacementResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { test: testId } = await searchParams;

  const test = testId
    ? await prisma.placementTest.findUnique({ where: { id: testId } })
    : await prisma.placementTest.findFirst({
        where: { userId: user.id, status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
      });

  if (!test || test.userId !== user.id || test.status !== "COMPLETED") {
    redirect("/placement-test");
  }

  const skillBreakdown: Record<string, number> = test.skillBreakdown
    ? JSON.parse(test.skillBreakdown)
    : {};

  // Only domains actually assessed appear in the breakdown — the engine omits
  // untested topics rather than inventing a score for them.
  const entries = DOMAIN_TOPIC_SLUGS.filter(
    (s) => s !== "advanced-olympiad" && skillBreakdown[s] !== undefined
  ).map((slug) => ({
    slug,
    label: DOMAIN_LABELS[slug],
    percent: skillBreakdown[slug],
  }));

  const strength = entries.reduce((best, e) => (e.percent > best.percent ? e : best), entries[0]);
  const opportunity = entries.reduce((worst, e) => (e.percent < worst.percent ? e : worst), entries[0]);

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const rating = test.resultRating ?? 1000;
  const tier = ratingTier(rating);
  const recommendation = recommendCompetitionSlug(profile?.grade ?? 7, rating);

  const inOnboarding = user.onboardingStep === "RESULTS";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Logo href="/" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <Badge tone="brand" className="mb-3">
            Placement Complete
          </Badge>
          <h1 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Your NumberSmith Level
          </h1>
          <p className="mt-1 text-4xl font-extrabold text-slate-900 sm:text-5xl">{tier.label}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              NumberSmith Rating
            </p>
            <p className="mt-2 text-4xl font-extrabold text-brand-700">{rating}</p>
            <p className="mt-1 text-xs text-slate-400">Tier: {tier.label}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recommended Starting Point
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{recommendation.label}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Skill Breakdown</h2>
          <div className="mt-5 space-y-4">
            {entries.map((e) => (
              <div key={e.slug}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{e.label}</span>
                  <span className="font-semibold text-slate-500">{e.percent}%</span>
                </div>
                <ProgressBar
                  value={e.percent}
                  tone={e.slug === strength.slug ? "success" : e.slug === opportunity.slug ? "ember" : "brand"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-success-600">
              Your Strength
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{strength.label}</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ember-600">
              Biggest Opportunity
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{opportunity.label}</p>
          </div>
        </div>

        <p className="mt-6 rounded-2xl bg-brand-950 p-6 text-center text-sm leading-relaxed text-brand-100 sm:text-base">
          You&apos;re performing at a {tier.label.toLowerCase()} level overall. Your strongest area is{" "}
          <span className="font-semibold text-white">{strength.label}</span>, while{" "}
          <span className="font-semibold text-white">{opportunity.label}</span> is currently your
          biggest opportunity for improvement. We&apos;ll build your training plan around that.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          {inOnboarding ? (
            <LinkButton href="/onboarding/competitions" size="lg">
              Choose Your Competitions →
            </LinkButton>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <LinkButton href="/dashboard" size="lg">
                Back to Dashboard
              </LinkButton>
              <LinkButton href="/placement-test" variant="outline" size="lg">
                Retake Placement Test
              </LinkButton>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
