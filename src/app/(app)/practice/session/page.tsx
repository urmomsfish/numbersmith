import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { pickNextPracticeProblems } from "@/lib/engine/practice";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { hasReachedFreeDailyLimit, getTodayAttemptCount } from "@/lib/actions/practice-actions";
import { isProUser, FREE_DAILY_PROBLEM_LIMIT } from "@/lib/subscription";
import { DailyCapUpsell } from "@/components/practice/problem-solver";
import { SessionRunner } from "./session-runner";

const FOCUS_COPY: Record<string, string> = {
  CHALLENGE: "You've been acing this level — we're stepping the difficulty up.",
  MEDIUM: "Recent hard problems gave you trouble, so we're rebuilding at a medium level.",
  TIMED: "You're accurate but slow here — this set focuses on speed.",
  ACCURACY: "You're fast but missing details — this set focuses on accuracy.",
  STANDARD: "Balanced set targeting your current level.",
};

export default async function PracticeSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; competition?: string; count?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  if (await hasReachedFreeDailyLimit(user.id)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <DailyCapUpsell />
      </div>
    );
  }

  const isPro = await isProUser(user.id);
  const attemptsToday = await getTodayAttemptCount(user.id);
  const remaining = isPro ? Infinity : Math.max(0, FREE_DAILY_PROBLEM_LIMIT - attemptsToday);
  const requested = Number(params.count) || 5;
  const count = isPro ? requested : Math.min(requested, remaining);

  const { problems, topic, focus } = await pickNextPracticeProblems(user.id, {
    topicSlug: params.topic,
    competitionSlug: params.competition,
    count,
  });

  if (problems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg font-semibold text-slate-900">No problems available for this filter.</p>
        <p className="mt-2 text-sm text-slate-500">Try a different topic from the problem database.</p>
      </div>
    );
  }

  return (
    <SessionRunner
      topicName={topic?.name ?? "Mixed"}
      focusMessage={FOCUS_COPY[focus] ?? FOCUS_COPY.STANDARD}
      isPro={isPro}
      problems={problems.map((p) => ({
        id: p.id,
        question: p.question,
        format: p.format,
        choices: parseChoices(p.choices),
        hints: parseHints(p.hints),
        difficulty: p.difficulty,
        topicName: topic?.name ?? "Mixed",
      }))}
    />
  );
}
