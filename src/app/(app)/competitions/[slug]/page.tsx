import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Card, CardBody } from "@/components/ui/card";
import { competitionProgress, topicProgress } from "@/lib/engine/progress";
import {
  FORMAT_LABEL,
  TEAM_LABEL,
  CATEGORY_LABEL,
  gradeRangeLabel,
  difficultyRangeLabel,
} from "@/lib/competition-meta";
import { difficultyLabel } from "@/lib/types";

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { slug } = await params;
  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: { topics: { include: { topic: true }, orderBy: { weight: "desc" } } },
  });
  if (!competition) notFound();

  const [problems, lessons, mastery, userCompetition, attempts] = await Promise.all([
    prisma.problem.findMany({
      where: { competitionId: competition.id, isPublished: true },
      include: { topic: true },
      orderBy: { difficulty: "asc" },
      take: 8,
    }),
    prisma.lesson.findMany({
      where: { topicId: { in: competition.topics.map((t) => t.topicId) } },
      include: { topic: true },
      orderBy: { difficulty: "asc" },
      take: 6,
    }),
    prisma.topicMastery.findMany({
      where: { userId: user.id, topicId: { in: competition.topics.map((t) => t.topicId) } },
    }),
    prisma.userCompetition.findUnique({
      where: { userId_competitionId: { userId: user.id, competitionId: competition.id } },
    }),
    prisma.competitionAttempt.findMany({
      where: { userId: user.id, competitionId: competition.id, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
      take: 3,
    }),
  ]);

  const masteryByTopicId = new Map(
    mastery.map((m) => [
      m.topicId,
      { masteryPercent: m.masteryPercent, problemsAttempted: m.problemsAttempted },
    ])
  );
  // Discounted by evidence — see src/lib/engine/progress.ts.
  const overallMastery = competitionProgress(
    competition.topics.map((ct) => ({ topicId: ct.topicId, weight: ct.weight })),
    masteryByTopicId
  );

  const isProofBased = competition.format === "PROOF";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/competitions" className="text-sm font-medium text-slate-700 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        ← Competition Directory
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">{competition.shortName}</h1>
            {userCompetition && (
              <Badge tone={userCompetition.isPrimary ? "brand" : "success"}>
                {userCompetition.isPrimary ? "Primary Goal" : "Training"}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{competition.name}</p>
        </div>
        <div className="flex gap-2">
          {!isProofBased && (
            <LinkButton href={`/simulations/${competition.slug}`}>Start Simulation</LinkButton>
          )}
          <LinkButton href={`/practice/session?competition=${competition.slug}`} variant="outline">
            Practice Problems
          </LinkButton>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardBody>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">Overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{competition.description}</p>
              <p className="mt-3 text-xs text-slate-700 dark:text-slate-500">{competition.organization}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">Format</h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Fact label="Category" value={CATEGORY_LABEL[competition.category]} />
                <Fact label="Format" value={FORMAT_LABEL[competition.format]} />
                <Fact label="Structure" value={TEAM_LABEL[competition.individualOrTeam]} />
                <Fact label="Grades" value={gradeRangeLabel(competition.gradeMin, competition.gradeMax)} />
                <Fact label="Questions" value={String(competition.numQuestions ?? "Varies")} />
                <Fact
                  label="Time limit"
                  value={competition.timeLimitMinutes ? `${competition.timeLimitMinutes} minutes` : "Untimed"}
                />
                <Fact
                  label="Difficulty"
                  value={difficultyRangeLabel(competition.difficultyMin, competition.difficultyMax)}
                />
                <Fact label="Region" value={competition.region} />
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                Topics & Your Mastery
              </h2>
              <div className="mt-4 space-y-3">
                {competition.topics.map((ct) => {
                  const row = masteryByTopicId.get(ct.topicId);
                  const pct = row ? topicProgress(row.masteryPercent, row.problemsAttempted) : 0;
                  return (
                    <div key={ct.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                          {ct.topic.name}
                          <span className="text-[11px] text-slate-700 dark:text-slate-500">weight {ct.weight}/5</span>
                        </span>
                        <span className="text-slate-700 dark:text-slate-400">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} tone={pct >= 70 ? "success" : pct >= 40 ? "brand" : "ember"} />
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                Training Roadmap
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{competition.roadmap}</p>
            </CardBody>
          </Card>

          {problems.length > 0 && (
            <Card>
              <CardBody>
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                  Practice Problems
                </h2>
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {problems.map((p) => (
                    <Link
                      key={p.id}
                      href={`/practice/${p.slug}`}
                      className="flex items-start justify-between gap-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{p.question}</span>
                      <Badge tone="slate">{difficultyLabel(p.difficulty)}</Badge>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {lessons.length > 0 && (
            <Card>
              <CardBody>
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                  Recommended Lessons
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/lessons/${l.slug}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 hover:border-brand-300"
                    >
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.title}</p>
                      <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-500">{l.topic.name}</p>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                Your Readiness
              </p>
              <p className="mt-2 text-4xl font-extrabold text-brand-700 dark:text-brand-300">{overallMastery}%</p>
              <ProgressBar value={overallMastery} tone="success" className="mt-3" />
              <p className="mt-2 text-xs text-slate-700 dark:text-slate-500">Weighted across this competition&apos;s topics</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">
                Simulations
              </p>
              {isProofBased ? (
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                  This is a proof-based competition. Timed multiple-choice simulations don&apos;t apply
                  — train through the olympiad lesson track instead.
                </p>
              ) : attempts.length === 0 ? (
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                  You haven&apos;t run a {competition.shortName} simulation yet.
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  {attempts.map((a) => (
                    <Link
                      key={a.id}
                      href={`/simulations/results/${a.id}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span className="text-slate-700 dark:text-slate-400">
                        {a.submittedAt?.toLocaleDateString() ?? "—"}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {a.correctCount}/{a.totalQuestions}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {!isProofBased && (
                <LinkButton href={`/simulations/${competition.slug}`} className="mt-4 w-full">
                  Start Simulation
                </LinkButton>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  );
}
