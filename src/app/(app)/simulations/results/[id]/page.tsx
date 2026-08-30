import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { parseChoices } from "@/lib/engine/scoring";
import { difficultyLabel } from "@/lib/types";
import { pickPriorityTopic } from "@/lib/engine/practice";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default async function SimulationResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const attempt = await prisma.competitionAttempt.findUnique({
    where: { id },
    include: {
      competition: true,
      items: {
        include: { problem: { include: { topic: { include: { parent: true } } } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!attempt || attempt.userId !== user.id) redirect("/simulations");
  if (attempt.status !== "SUBMITTED") redirect(`/simulations/run/${attempt.id}`);

  const previous = await prisma.competitionAttempt.findFirst({
    where: {
      userId: user.id,
      competitionId: attempt.competitionId,
      status: "SUBMITTED",
      submittedAt: { lt: attempt.submittedAt ?? new Date() },
    },
    orderBy: { submittedAt: "desc" },
  });

  const timeUsedSeconds = attempt.submittedAt
    ? Math.min(
        attempt.timeLimitSeconds,
        Math.floor((attempt.submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
      )
    : attempt.timeLimitSeconds;

  const accuracy = Math.round((attempt.correctCount / Math.max(1, attempt.totalQuestions)) * 100);

  const topicStats = new Map<string, { correct: number; total: number }>();
  const difficultyStats = new Map<string, { correct: number; total: number }>();
  for (const item of attempt.items) {
    const domain = item.problem.topic.parent?.name ?? item.problem.topic.name;
    const t = topicStats.get(domain) ?? { correct: 0, total: 0 };
    t.total += 1;
    if (item.correct) t.correct += 1;
    topicStats.set(domain, t);

    const bucket = difficultyLabel(item.problem.difficulty);
    const d = difficultyStats.get(bucket) ?? { correct: 0, total: 0 };
    d.total += 1;
    if (item.correct) d.correct += 1;
    difficultyStats.set(bucket, d);
  }

  const missed = attempt.items.filter((i) => !i.correct);
  const priorityTopic = await pickPriorityTopic(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/simulations" className="text-sm font-medium text-slate-400 hover:text-slate-600">
        ← Simulations
      </Link>

      <div className="mt-4 text-center">
        <Badge tone="brand" className="mb-2">
          {attempt.mode === "CUSTOM" ? "Custom Competition" : attempt.competition.shortName}
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Simulation Results</h1>
        <p className="mt-1 text-sm text-slate-500">{attempt.submittedAt?.toLocaleString()}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Score" value={`${attempt.correctCount}/${attempt.totalQuestions}`} />
        <StatTile label="Accuracy" value={`${accuracy}%`} />
        <StatTile
          label="Time Used"
          value={`${Math.floor(timeUsedSeconds / 60)}m ${timeUsedSeconds % 60}s`}
        />
        <StatTile
          label="vs. Previous"
          value={
            previous
              ? `${attempt.correctCount - previous.correctCount >= 0 ? "+" : ""}${
                  attempt.correctCount - previous.correctCount
                }`
              : "First attempt"
          }
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Topic Breakdown
            </h2>
            <div className="mt-4 space-y-3">
              {Array.from(topicStats.entries()).map(([topic, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={topic}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{topic}</span>
                      <span className="text-slate-500">
                        {s.correct}/{s.total}
                      </span>
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
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Difficulty Breakdown
            </h2>
            <div className="mt-4 space-y-3">
              {Array.from(difficultyStats.entries()).map(([bucket, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={bucket}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{bucket}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} tone={pct >= 70 ? "success" : pct >= 40 ? "brand" : "ember"} />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardBody>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Recommended Training
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Based on this simulation, the topic most worth practicing next is{" "}
            <span className="font-semibold text-slate-900">{priorityTopic.name}</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href={`/practice/session?topic=${priorityTopic.slug}`}>
              Practice {priorityTopic.name} →
            </LinkButton>
            <LinkButton href="/mistakes" variant="outline">
              Review Missed Problems
            </LinkButton>
          </div>
        </CardBody>
      </Card>

      {missed.length > 0 && (
        <Card className="mt-5">
          <CardBody>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Questions Missed ({missed.length})
            </h2>
            <div className="mt-3 divide-y divide-slate-100">
              {missed.map((item) => {
                const choices = parseChoices(item.problem.choices);
                const correctIndex = CHOICE_LETTERS.indexOf(item.problem.answer);
                return (
                  <div key={item.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-700">
                        <span className="font-bold text-slate-400">Q{item.order + 1}.</span>{" "}
                        {item.problem.question}
                      </p>
                      <Badge tone="slate">{difficultyLabel(item.problem.difficulty)}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <span className="text-danger-600">
                        Your answer: {item.answerGiven || "(blank)"}
                      </span>
                      <span className="text-success-600">
                        Correct: {item.problem.answer}
                        {choices[correctIndex] ? ` — ${choices[correctIndex]}` : ""}
                      </span>
                    </div>
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
                      {item.problem.solution}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
