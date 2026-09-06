"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProblemSolver, type SolverProblem } from "@/components/practice/problem-solver";
import { ProgressBar } from "@/components/ui/progress";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SessionRunner({
  problems,
  topicName,
  focusMessage,
  isPro,
}: {
  problems: SolverProblem[];
  topicName: string;
  focusMessage: string;
  isPro: boolean;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = problems[index];

  function handleContinue(result: { capped?: boolean; correct?: boolean }) {
    if (result.correct) setCorrectCount((c) => c + 1);
    if (index + 1 >= problems.length) {
      setFinished(true);
      router.refresh();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (finished) {
    const accuracy = Math.round((correctCount / problems.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
          <p className="text-3xl">✅</p>
          <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-50">Session complete</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            You solved <span className="font-semibold text-slate-800 dark:text-slate-100">{correctCount}</span> of{" "}
            {problems.length} correctly — {accuracy}% accuracy.
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
            {index + 1} of {problems.length}
          </span>
        </div>
        <ProgressBar value={((index) / problems.length) * 100} tone="brand" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{focusMessage}</p>
      </div>

      <ProblemSolver
        key={current.id}
        problem={current}
        onContinue={handleContinue}
        continueLabel={index + 1 >= problems.length ? "Finish Session →" : "Next Problem →"}
      />
    </div>
  );
}
