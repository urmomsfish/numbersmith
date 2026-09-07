"use client";

import { useState } from "react";
import { ProblemSolver, type SolverProblem } from "@/components/practice/problem-solver";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AttemptMode } from "@/lib/types";

export function SessionRunner({
  problems,
  topicName,
  focusMessage,
  isPro,
  mode,
}: {
  problems: SolverProblem[];
  topicName: string;
  focusMessage: string;
  isPro: boolean;
  mode?: AttemptMode;
}) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  // Frozen on mount, never read from the prop. handleContinue calls
  // router.refresh(), which re-runs the server component — and in mistake
  // review that query returns fewer rows, because the ones just answered
  // correctly are now resolved and filtered out. Reading problems.length after
  // that produced "solved 2 of 1".
  const [total] = useState(problems.length);

  const current = problems[index];

  function handleContinue(result: { capped?: boolean; correct?: boolean }) {
    if (result.correct) setCorrectCount((c) => c + 1);
    if (index + 1 >= total) {
      // Deliberately no router.refresh() here. Refreshing re-runs the server
      // component, and in mistake review that query now returns zero due rows
      // (the ones just answered are resolved or rescheduled), which trips its
      // `redirect("/mistakes")` — throwing the user off the summary they just
      // earned. Both buttons below navigate, and those navigations fetch fresh
      // server data anyway, so nothing goes stale.
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (finished) {
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
          <p className="text-3xl">✅</p>
          <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-50">Session complete</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            You solved <span className="font-semibold text-slate-800 dark:text-slate-100">{correctCount}</span> of{" "}
            {total} correctly — {accuracy}% accuracy.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/dashboard" variant="outline">
              Back to Dashboard
            </LinkButton>
            <LinkButton href="/practice/session">Practice More</LinkButton>
          </div>
          {!isPro && (
            <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
              Free plan includes 15 problems per day.{" "}
              <a href="/pricing" className="font-semibold text-brand-600 dark:text-brand-400">
                See what Pro unlocks →
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <Badge tone="brand">Adaptive Session · {topicName}</Badge>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {index + 1} of {total}
          </span>
        </div>
        <ProgressBar value={(index / total) * 100} tone="brand" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{focusMessage}</p>
      </div>

      <ProblemSolver
        key={current.id}
        problem={current}
        onContinue={handleContinue}
        mode={mode}
        continueLabel={index + 1 >= total ? "Finish Session →" : "Next Problem →"}
      />
    </div>
  );
}
