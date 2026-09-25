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

  // Pro-only queries are skipped entirely for Free accounts rather than fetched
  // and hidden — subtopic mastery and per-category history are the two widest
  // reads on this page, and a Free student would be paying their page load for
  // data they never see.
  const [stats, ratings, history, mastery, attempts, subtopics, categoryHistory] =
    await Promise.all([
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
      include: {
        problem: { select: { difficulty: true, estimatedTimeSeconds: true, topicId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    isPro
      ? prisma.topicMastery.findMany({
          where: { userId: user.id, topic: { parentId: { not: null } } },
          include: { topic: { include: { parent: true } } },
        })
      : Promise.resolve([]),
    isPro
      ? prisma.ratingHistory.findMany({
          where: { userId: user.id, category: { not: "OVERALL" } },
          orderBy: { recordedAt: "asc" },
        })
      : Promise.resolve([]),
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

  // ---- Pro analytics -------------------------------------------------
  // Subtopics ranked by how much they are holding the student back: weakest
  // progress first, and where two are level, the one with less evidence behind
  // it — that is the one practice will actually move. Same rule the dashboard
  // uses for domains, applied a level down.
  const subtopicRows = subtopics
    .map((m) => ({
      id: m.id,
      name: m.topic.name,
      domain: m.topic.parent?.name ?? "—",
      attempted: m.problemsAttempted,
      progress: topicProgress(m.masteryPercent, m.problemsAttempted),
    }))
    .sort((a, b) => a.progress - b.progress || a.attempted - b.attempted);

  // Pace against the time each problem was authored to take. Attempts with no
  // estimate are excluded rather than counted as instant.
  const timed = attempts.filter((a) => a.problem.estimatedTimeSeconds > 0);
  const paceRatio =
    timed.length > 0
      ? timed.reduce((s, a) => s + a.timeSeconds / a.problem.estimatedTimeSeconds, 0) / timed.length
      : null;

  // Rating movement per competition category, oldest to newest in each.
  const categoryDeltas = [...new Set(categoryHistory.map((h) => h.category))]
    .map((category) => {
      const rows = categoryHistory.filter((h) => h.category === category);
      const first = rows[0]?.value ?? null;
      const last = rows[rows.length - 1]?.value ?? null;
      return {
        category,
        current: ratings.find((r) => r.category === category)?.value ?? last ?? 0,
        delta: first !== null && last !== null ? last - first : 0,
        points: rows.length,
      };
    })
    .sort((a, b) => b.current - a.current);

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
        <StatTile
          label="Streak"
          value={`${effectiveStreak(stats?.currentStreak ?? 0, stats?.lastActiveDate)}d`}
          hint={`longest ${stats?.longestStreak ?? 0}d`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
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
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Level</h2>
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
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Topic Mastery</h2>
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
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
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

      {isPro && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Subtopic breakdown — the whole point of Pro analytics. The free
              page stops at the six domains, which tells a student that
              "Geometry" is weak without telling them it is circles. */}
          <Card className="lg:col-span-2">
            <CardBody>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Subtopic breakdown
                </h2>
                <Badge tone="brand">Pro</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Weakest first. Where two are level, the one with less practice behind it comes
                first — that is the one practice will move.
              </p>
              {subtopicRows.length === 0 ? (
                <p className="mt-6 py-6 text-center text-sm text-slate-700 dark:text-slate-500">
                  Practice a few problems to build your subtopic map.
                </p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {subtopicRows.slice(0, 10).map((row) => (
                    <li key={row.id} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 truncate text-sm text-slate-800 dark:text-slate-200">
                        {row.name}
                        <span className="block text-[11px] text-slate-500">{row.domain}</span>
                      </span>
                      <ProgressBar value={row.progress} tone="brand" />
                      <span className="w-10 shrink-0 text-right text-sm tabular-nums text-slate-700 dark:text-slate-400">
                        {row.progress}%
                      </span>
                      <span className="w-20 shrink-0 text-right text-[11px] text-slate-500">
                        {evidenceLabel(row.attempted)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardBody>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Rating by competition
                  </h2>
                  <Badge tone="brand">Pro</Badge>
                </div>
                {categoryDeltas.length === 0 ? (
                  <p className="mt-5 py-4 text-center text-sm text-slate-700 dark:text-slate-500">
                    Sit a simulation to start a per-competition rating.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {categoryDeltas.map((c) => (
                      <li key={c.category} className="flex items-baseline justify-between gap-2">
                        <span className="text-sm text-slate-800 dark:text-slate-200">
                          {c.category}
                          <span className="block text-[11px] text-slate-500">
                            {ratingTier(c.current).label}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                            {c.current}
                          </span>
                          {c.points > 1 && (
                            <span
                              className={`ml-2 text-xs tabular-nums ${
                                c.delta >= 0
                                  ? "text-success-600 dark:text-success-400"
                                  : "text-danger-600 dark:text-danger-400"
                              }`}
                            >
                              {c.delta >= 0 ? "+" : ""}
                              {c.delta}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Pace</h2>
                  <Badge tone="brand">Pro</Badge>
                </div>
                {paceRatio === null ? (
                  <p className="mt-5 py-4 text-center text-sm text-slate-700 dark:text-slate-500">
                    Not enough timed attempts yet.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                      {Math.round(paceRatio * 100)}%
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      of the time each problem is written to take.
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      {paceRatio <= 0.85
                        ? "Comfortably inside the clock — you can afford to attempt harder problems."
                        : paceRatio <= 1.15
                          ? "On pace. This is where a real contest wants you."
                          : "Over the intended time. Accuracy is worth more than speed, but a timed contest will cut you off."}
                    </p>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {!isPro && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-card p-5 dark:border-slate-700">
          <div className="max-w-prose">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Advanced analytics
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              See exactly which topics are limiting your competition performance, with subtopic-level
              breakdowns, per-competition rating analytics, and pace against contest timing.
            </p>
          </div>
          <LinkButton href="/pricing" variant="secondary" size="sm">
            Explore Pro
          </LinkButton>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-card p-4 dark:border-slate-700">
      <p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{hint}</p>}
    </div>
  );
}
