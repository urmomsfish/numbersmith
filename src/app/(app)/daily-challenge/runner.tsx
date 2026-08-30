"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { submitDailyChallengeAction } from "@/lib/actions/daily-challenge-actions";
import { difficultyLabel } from "@/lib/types";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

type Problem = {
  id: string;
  question: string;
  format: string;
  choices: string[];
  hints: string[];
  difficulty: number;
  topicName: string;
};

type Completed = {
  correct: boolean;
  solution: string;
  correctAnswer: string;
  xpAwarded: number;
};

export function DailyChallengeRunner({
  dailyChallengeId,
  problem,
  alreadyCompleted,
}: {
  dailyChallengeId: string;
  problem: Problem;
  alreadyCompleted: Completed | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Completed | null>(alreadyCompleted);
  const [unlocked, setUnlocked] = useState<{ name: string; icon: string }[]>([]);
  // Seeded in the effect rather than during render — reading the clock while
  // rendering is impure and can drift across re-renders.
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const answerGiven = problem.format === "MULTIPLE_CHOICE" ? selected : textAnswer.trim();
  const done = !!result;

  async function submit() {
    setPending(true);
    const startedAt = startedAtRef.current || Date.now();
    const res = await submitDailyChallengeAction({
      dailyChallengeId,
      answerGiven,
      timeSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
    });
    setResult({
      correct: res.correct,
      solution: res.solution,
      correctAnswer: res.correctAnswer,
      xpAwarded: res.alreadyDone ? 0 : res.xpAwarded,
    });
    if (!res.alreadyDone) setUnlocked(res.newlyUnlocked);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="brand">{problem.topicName}</Badge>
        <Badge tone="slate">{difficultyLabel(problem.difficulty)}</Badge>
        <Badge tone="ember">Bonus XP</Badge>
      </div>

      <p className="text-lg font-medium leading-relaxed text-slate-900 sm:text-xl">{problem.question}</p>

      <div className="mt-7">
        {problem.format === "MULTIPLE_CHOICE" ? (
          <div className="space-y-2.5">
            {problem.choices.map((choice, i) => {
              const letter = CHOICE_LETTERS[i];
              const isSelected = selected === letter;
              const isCorrectChoice = done && letter === result!.correctAnswer;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={done || pending}
                  onClick={() => setSelected(letter)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    done
                      ? isCorrectChoice
                        ? "border-success-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-400"
                      : isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isSelected && !done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {letter}
                  </span>
                  {choice}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">Your answer</label>
            <input
              type="text"
              value={textAnswer}
              disabled={done || pending}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && answerGiven && !done && submit()}
              placeholder="Type your answer"
              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
            />
            {done && (
              <p className="mt-2 text-sm text-slate-500">
                Correct answer: <span className="font-semibold text-slate-800">{result!.correctAnswer}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {!done && problem.hints.length > 0 && (
        <div className="mt-5">
          {hintsShown < problem.hints.length && (
            <button
              type="button"
              onClick={() => setHintsShown((h) => h + 1)}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              💡 Show Hint ({hintsShown + 1}/{problem.hints.length})
            </button>
          )}
          {hintsShown > 0 && (
            <ul className="mt-2 space-y-1.5">
              {problem.hints.slice(0, hintsShown).map((hint, i) => (
                <li key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {done && (
        <div className="mt-6 space-y-3">
          <div
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold",
              result!.correct ? "bg-emerald-50 text-success-600" : "bg-red-50 text-danger-600"
            )}
          >
            {result!.correct ? "Correct!" : "Not quite."}
            {result!.xpAwarded > 0 && (
              <span className="font-normal text-slate-500"> +{result!.xpAwarded} XP</span>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solution</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{result!.solution}</p>
          </div>
          {unlocked.map((a, i) => (
            <p key={i} className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
              {a.icon} Achievement unlocked: {a.name}
            </p>
          ))}
        </div>
      )}

      <div className="mt-7 flex justify-end gap-2">
        {done ? (
          <>
            <LinkButton href="/dashboard" variant="outline">
              Back to Dashboard
            </LinkButton>
            <LinkButton href="/practice/session">Keep Practicing →</LinkButton>
          </>
        ) : (
          <Button disabled={!answerGiven || pending} onClick={submit}>
            {pending ? "Checking…" : "Submit Answer"}
          </Button>
        )}
      </div>
    </div>
  );
}
