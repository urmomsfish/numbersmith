"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProblemSolver, type SolverProblem } from "@/components/practice/problem-solver";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markLessonCompleteAction } from "@/lib/actions/lesson-actions";

export function LessonPractice({
  lessonId,
  problems,
  challenge,
}: {
  lessonId: string;
  problems: SolverProblem[];
  challenge: SolverProblem | null;
}) {
  const router = useRouter();
  const queue = challenge ? [...problems, challenge] : problems;
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const isChallenge = !!challenge && index === queue.length - 1;

  async function handleContinue(result: { correct?: boolean }) {
    const nextCorrect = correctCount + (result.correct ? 1 : 0);
    setCorrectCount(nextCorrect);

    if (index + 1 >= queue.length) {
      const masteryPct = Math.round((nextCorrect / queue.length) * 100);
      await markLessonCompleteAction({ lessonId, masteryPercent: masteryPct });
      setFinished(true);
      router.refresh();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (finished) {
    const mastery = Math.round((correctCount / queue.length) * 100);
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-8 text-center">
        <p className="text-3xl">📘</p>
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-50">Lesson complete</h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
          You solved {correctCount} of {queue.length} — {mastery}% lesson mastery.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <LinkButton href="/lessons" variant="outline">
            More Lessons
          </LinkButton>
          <LinkButton href="/practice/session">Practice This Topic</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        {isChallenge ? (
          <Badge tone="ember">Challenge Problem</Badge>
        ) : (
          <Badge tone="brand">
            Practice {index + 1} of {problems.length}
          </Badge>
        )}
      </div>
      <ProblemSolver
        key={queue[index].id}
        problem={queue[index]}
        mode="PRACTICE"
        onContinue={handleContinue}
        continueLabel={index + 1 >= queue.length ? "Finish Lesson →" : "Next →"}
      />
    </div>
  );
}
