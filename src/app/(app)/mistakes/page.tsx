import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { isProUser, FREE_MISTAKE_REVIEWS_PER_WEEK } from "@/lib/subscription";
import { canReviewMistakes } from "@/lib/actions/mistake-actions";
import { difficultyLabel } from "@/lib/types";

const REASON_LABEL: Record<string, { label: string; tone: "danger" | "warning" | "slate" | "brand" }> = {
  INCORRECT: { label: "Incorrect", tone: "danger" },
  SKIPPED: { label: "Skipped", tone: "slate" },
  SLOW: { label: "Too slow", tone: "warning" },
  MULTI_HINT: { label: "Needed hints", tone: "brand" },
};

export default async function MistakesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isPro = await isProUser(user.id);

  const [allMistakes, resolvedCount, reviewGate] = await Promise.all([
    prisma.mistake.findMany({
      where: { userId: user.id, resolved: false },
      include: { problem: { include: { topic: true } } },
      orderBy: { nextReviewAt: "asc" },
    }),
    prisma.mistake.count({ where: { userId: user.id, resolved: true } }),
    canReviewMistakes(user.id),
  ]);

  const now = new Date();
  const dueNow = allMistakes.filter((m) => m.nextReviewAt <= now);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Mistake Review</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Every problem you missed, skipped, solved too slowly, or needed multiple hints on is brought
            back on a spaced schedule.
          </p>
        </div>
        {dueNow.length > 0 && reviewGate.allowed && (
          <LinkButton href="/mistakes/review">Review {dueNow.length} Due →</LinkButton>
        )}
      </div>

      {!isPro && (
        <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-400">
          {reviewGate.allowed
            ? `${reviewGate.remaining} of ${FREE_MISTAKE_REVIEWS_PER_WEEK} weekly reviews left on the free plan.`
            : `You've used all ${FREE_MISTAKE_REVIEWS_PER_WEEK} weekly reviews on the free plan.`}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatTile label="Open Mistakes" value={String(allMistakes.length)} />
        <StatTile label="Due for Review" value={String(dueNow.length)} />
        <StatTile label="Resolved" value={String(resolvedCount)} />
      </div>

      {allMistakes.length === 0 ? (
        <Card className="mt-6">
          <CardBody className="py-12 text-center">
            <p className="text-3xl">🎯</p>
            <p className="mt-3 font-semibold text-slate-900 dark:text-slate-50">No open mistakes.</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Keep practicing. Anything you miss will show up here for spaced review.
            </p>
            <LinkButton href="/practice/session" className="mt-5">
              Start Practicing
            </LinkButton>
          </CardBody>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {allMistakes.map((m) => {
            const meta = REASON_LABEL[m.reason] ?? REASON_LABEL.INCORRECT;
            const due = m.nextReviewAt <= now;
            return (
              <Link
                key={m.id}
                href={`/practice/${m.problem.slug}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <Badge tone="slate">{m.problem.topic.name}</Badge>
                  <Badge tone="slate">{difficultyLabel(m.problem.difficulty)}</Badge>
                  {due ? (
                    <Badge tone="ember">Due now</Badge>
                  ) : (
                    <span className="text-[11px] text-slate-700 dark:text-slate-500">
                      Next review {m.nextReviewAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{m.problem.question}</p>
                <p className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400">Retry this problem →</p>
              </Link>
            );
          })}

          {!isPro && !reviewGate.allowed && dueNow.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-5 text-center">
              <p className="font-semibold text-amber-900">Weekly review limit reached</p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-400">
                The free plan includes {FREE_MISTAKE_REVIEWS_PER_WEEK} mistake reviews per week. Pro unlocks
                unlimited reviews with spaced repetition scheduling.
              </p>
              <LinkButton href="/pricing" className="mt-4">
                Explore Pro
              </LinkButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
