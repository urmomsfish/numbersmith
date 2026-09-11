import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel, ratingTier } from "@/lib/types";
import { levelForXp, xpIntoLevel } from "@/lib/engine/xp";
import { topicProgress, evidenceLabel } from "@/lib/engine/progress";
import { RatingChart } from "./rating-chart";
import { effectiveStreak } from "@/lib/streak";

export default async function StatsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isPro = await isProUser(user.id);

  const [stats, ratings, history, mastery, attempts] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId: user.id } }),
    prisma.rating.findMany({ where: { userId: user.id } }),
    prisma.ratingHistory.findMany({
      where: { userId: user.id, category: "OVERALL" },
      orderBy: { recordedAt: "asc" },
      take: 60,
    }),
    prisma.topicMastery.findMany({
      where: { userId: user.id, topic: { parentId: null } },
      include: { topic: true },
      orderBy: { masteryPercent: "desc" },
    }),
    prisma.attempt.findMany({
      where: { userId: user.id },
      include: { problem: { select: { difficulty: true } } },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  const overall = ratings.find((r) => r.category === "OVERALL")?.value ?? 1000;
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const avgTime =
    totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.timeSeconds, 0) / totalAttempts)
      : 0;

  const difficultyBuckets = new Map<string, { correct: number; total: number }>();
  for (const a of attempts) {
    const bucket = difficultyLabel(a.problem.difficulty);
    const d = difficultyBuckets.get(bucket) ?? { correct: 0, total: 0 };
    d.total += 1;
    if (a.correct) d.correct += 1;
    difficultyBuckets.set(bucket, d);
  }
  const orderedBuckets = ["Beginner", "Intermediate", "Advanced", "Expert", "Olympiad"].filter((b) =>
    difficultyBuckets.has(b)
  );

  const xp = stats?.totalXp ?? 0;
  const level = levelForXp(xp);
  const { current, needed } = xpIntoLevel(xp);

  const chartData = history.map((h) => ({
    date: h.recordedAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    rating: h.value,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Statistics</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your complete training record.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Problems" value={String(stats?.problemsSolved ?? 0)} />
        <StatTile label="Accuracy" value={`${accuracy}%`} />
        <StatTile label="Avg. Time" value={`${avgTime}s`} />
        <StatTile label="Rating" value={String(overall)} />
        <StatTile label="XP" value={xp.toLocaleString()} />
        <StatTile label="Streak" value={`${effectiveStreak(stats?.currentStreak ?? 0, stats?.lastActiveDate)}d`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
              Rating Over Time
            </h2>
            {chartData.length >= 2 ? (
              <div className="mt-4">
                <RatingChart data={chartData} />
              </div>
            ) : (
              <p className="mt-6 py-10 text-center text-sm text-slate-700 dark:text-slate-500">
                Complete a few more sessions to build your rating history chart.
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">Level</h2>
            <p className="mt-2 text-4xl font-extrabold text-brand-700 dark:text-brand-300">{level}</p>
            <ProgressBar value={current} max={needed} tone="ember" className="mt-3" />
            <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-500">
              {current} / {needed} XP to level {level + 1}
            </p>
            <div className="mt-5 space-y-2">
              {ratings
                .filter((r) => r.category !== "OVERALL")
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-400">{r.category} Rating</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{r.value}</span>
                  </div>
                ))}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-sm">
                <span className="text-slate-700 dark:text-slate-400">Tier</span>
                <Badge tone="brand">{ratingTier(overall).label}</Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">Topic Mastery</h2>
            <div className="mt-4 space-y-3">
              {mastery.length === 0 && (
                <p className="text-sm text-slate-700 dark:text-slate-500">Practice a few problems to build your mastery map.</p>
              )}
              {mastery.map((m) => {
                // The bar is progress (accuracy discounted by evidence); the
                // caption shows the accuracy and the sample behind it, so a low
                // bar reads as "not enough practice yet" rather than "you are
                // bad at this".
                const progress = topicProgress(m.masteryPercent, m.problemsAttempted);
                return (
                  <div key={m.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{m.topic.name}</span>
                      <span className="text-slate-700 dark:text-slate-400">{progress}%</span>
                    </div>
                    <ProgressBar
                      value={progress}
                      tone={progress >= 70 ? "success" : progress >= 40 ? "brand" : "ember"}
                    />
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-500">
                      {m.masteryPercent}% accuracy over {m.problemsAttempted}{" "}
                      {m.problemsAttempted === 1 ? "problem" : "problems"} · {evidenceLabel(m.problemsAttempted)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
              Performance by Difficulty
            </h2>
            <div className="mt-4 space-y-3">
              {orderedBuckets.length === 0 && (
                <p className="text-sm text-slate-700 dark:text-slate-500">No attempts recorded yet.</p>
              )}
              {orderedBuckets.map((bucket) => {
                const s = difficultyBuckets.get(bucket)!;
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={bucket}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{bucket}</span>
                      <span className="text-slate-700 dark:text-slate-400">
                        {pct}% <span className="text-slate-300 dark:text-slate-600">({s.total})</span>
                      </span>
                    </div>
                    <ProgressBar value={pct} tone={pct >= 70 ? "success" : pct >= 40 ? "brand" : "ember"} />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {!isPro && (
        <div className="mt-6 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Unlock Advanced Analytics</h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            See exactly which topics are limiting your competition performance, with subtopic-level
            breakdowns, per-competition rating analytics, and detailed performance reports.
          </p>
          <LinkButton href="/pricing" className="mt-4">
            Explore Pro
          </LinkButton>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}
