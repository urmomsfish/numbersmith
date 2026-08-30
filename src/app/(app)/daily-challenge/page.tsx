import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTodaysChallengeForUser } from "@/lib/engine/daily-challenge";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { Badge } from "@/components/ui/badge";
import { IconFlame } from "@/components/app/icons";
import { DailyChallengeRunner } from "./runner";

const TRACK_LABEL: Record<string, string> = {
  ELEMENTARY: "Elementary",
  MIDDLE_SCHOOL: "Middle School",
  AMC8: "AMC 8",
  AMC10: "AMC 10",
  AMC12: "AMC 12",
  AIME: "AIME",
  OLYMPIAD: "Olympiad",
};

export default async function DailyChallengePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [data, stats, totalCompleted] = await Promise.all([
    getTodaysChallengeForUser(user.id),
    prisma.userStats.findUnique({ where: { userId: user.id } }),
    prisma.dailyChallengeAttempt.count({ where: { userId: user.id } }),
  ]);

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-slate-500">No daily challenge is available right now.</p>
      </div>
    );
  }

  const { challenge, track, attempt } = data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Challenge</h1>
          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="brand">{TRACK_LABEL[track]} track</Badge>
          <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-ember-600">
            <IconFlame className="h-4 w-4" />
            {stats?.currentStreak ?? 0}
          </span>
        </div>
      </div>

      <DailyChallengeRunner
        dailyChallengeId={challenge.id}
        alreadyCompleted={
          attempt
            ? {
                correct: attempt.correct,
                solution: challenge.problem.solution,
                correctAnswer: challenge.problem.answer,
                xpAwarded: attempt.xpAwarded,
              }
            : null
        }
        problem={{
          id: challenge.problem.id,
          question: challenge.problem.question,
          format: challenge.problem.format,
          choices: parseChoices(challenge.problem.choices),
          hints: parseHints(challenge.problem.hints),
          difficulty: challenge.problem.difficulty,
          topicName: challenge.problem.topic.name,
        }}
      />

      <p className="mt-6 text-center text-xs text-slate-400">
        You&apos;ve completed {totalCompleted} daily challenge{totalCompleted === 1 ? "" : "s"}. A new
        one unlocks every day at midnight UTC.
      </p>
    </div>
  );
}
