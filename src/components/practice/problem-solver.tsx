"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { submitPracticeAnswerAction } from "@/lib/actions/practice-actions";
import { difficultyLabel, type AttemptMode } from "@/lib/types";
import { LEGAL } from "@/lib/legal";
import { AnswerInput } from "@/components/practice/answer-input";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

export type SolverProblem = {
  id: string;
  question: string;
  format: string;
  choices: string[];
  hints: string[];
  difficulty: number;
  topicName: string;
};

type SubmitResult = Awaited<ReturnType<typeof submitPracticeAnswerAction>>;

/** Prefills a mailto so a report includes the specifics without the student
 * having to retype them — the question, what they answered, and what the key
 * currently says. */
function reportMailto(question: string, theirAnswer: string, correctAnswer: string): string {
  const subject = "Problem report";
  const body = [
    `Question: ${question}`,
    `My answer: ${theirAnswer}`,
    `Key says: ${correctAnswer}`,
    "",
    "What I think is wrong:",
  ].join("\n");
  return `mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ProblemSolver({
  problem,
  mode = "PRACTICE",
  onContinue,
  continueLabel = "Next Problem →",
}: {
  problem: SolverProblem;
  mode?: AttemptMode;
  onContinue?: (result: SubmitResult) => void;
  continueLabel?: string;
}) {
  const [selected, setSelected] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  // Seeded in the effect rather than during render — reading the clock while
  // rendering is impure and can drift across re-renders.
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const interval = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  const answerGiven = problem.format === "MULTIPLE_CHOICE" ? selected : textAnswer.trim();
  const canSubmit = answerGiven.length > 0 && !pending && !result;

  async function submit() {
    setPending(true);
    const startedAt = startedAtRef.current || Date.now();
    const timeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const res = await submitPracticeAnswerAction({
      problemId: problem.id,
      answerGiven,
      timeSeconds,
      hintsUsed: hintsShown,
      mode,
    });
    setResult(res);
    setPending(false);
  }

  if (result?.capped) {
    return <DailyCapUpsell />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{problem.topicName}</Badge>
          <Badge tone="slate">{difficultyLabel(problem.difficulty)}</Badge>
        </div>
        <span className="tabular-nums text-xs text-slate-400 dark:text-slate-500">
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>

      <p className="text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-50 sm:text-xl">{problem.question}</p>

      <div className="mt-7">
        {problem.format === "MULTIPLE_CHOICE" ? (
          <div className="space-y-2.5">
            {problem.choices.map((choice, i) => {
              const letter = CHOICE_LETTERS[i];
              const isSelected = selected === letter;
              const isCorrectChoice = result && letter === result.correctAnswer;
              const isWrongPick = result && isSelected && !result.correct;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={pending || !!result}
                  onClick={() => setSelected(letter)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    result
                      ? isCorrectChoice
                        ? "border-success-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300"
                        : isWrongPick
                          ? "border-danger-500 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-950 dark:text-red-300"
                          : "border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-600"
                      : isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300"
                        : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isSelected && !result ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
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
            <AnswerInput
              value={textAnswer}
              onChange={setTextAnswer}
              onEnter={() => canSubmit && submit()}
              disabled={pending || !!result}
              integerOnly={problem.format === "INTEGER"}
            />
            {result && !result.capped && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Correct answer: <span className="font-semibold text-slate-800 dark:text-slate-100">{result.correctAnswer}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {!result && problem.hints.length > 0 && (
        <div className="mt-5">
          {hintsShown < problem.hints.length ? (
            <button
              type="button"
              onClick={() => setHintsShown((h) => h + 1)}
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              Show hint ({hintsShown + 1}/{problem.hints.length})
            </button>
          ) : null}
          {hintsShown > 0 && (
            <ul className="mt-2 space-y-1.5">
              {problem.hints.slice(0, hintsShown).map((hint, i) => (
                <li key={i} className="rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-800 dark:text-amber-400">
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {result && !result.capped && (
        <div className="mt-6 space-y-3">
          <div
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold",
              result.correct ? "bg-emerald-50 text-success-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-danger-600 dark:bg-red-950 dark:text-red-400"
            )}
          >
            {result.correct ? "Correct! " : "Not quite. "}
            <span className="font-normal text-slate-500 dark:text-slate-400">
              {result.rewardSkipped ? (
                // These paths deliberately pay nothing, so "+0 rating · +0 XP"
                // would read as a bug rather than as the rule.
                result.rewardSkipped === "review"
                  ? "Review — no XP or rating"
                  : "Already attempted — no XP or rating"
              ) : (
                <>
                  {result.ratingDelta >= 0 ? "+" : ""}
                  {result.ratingDelta} rating · +{result.xpAwarded} XP
                </>
              )}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Solution</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{result.solution}</p>
          </div>
          {result.newlyUnlocked.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-4">
              {result.newlyUnlocked.map((a, i) => (
                <p key={i} className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  {a.icon} Achievement unlocked: {a.name} (+{a.xpReward} XP)
                </p>
              ))}
            </div>
          )}

          <div className="pt-1">
            <a
              href={reportMailto(problem.question, answerGiven, result.correctAnswer)}
              className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Something wrong with this problem? Email {LEGAL.contactEmail}
            </a>
          </div>
        </div>
      )}

      <div className="mt-7 flex justify-end">
        {!result ? (
          <Button disabled={!canSubmit} onClick={submit}>
            {pending ? "Checking…" : "Submit Answer"}
          </Button>
        ) : (
          <Button onClick={() => onContinue?.(result)}>{continueLabel}</Button>
        )}
      </div>
    </div>
  );
}

export function DailyCapUpsell() {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white dark:bg-slate-900 p-8 text-center">
      <p className="text-3xl">🎉</p>
      <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-50">You&apos;ve completed today&apos;s training!</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Come back tomorrow, or unlock unlimited practice right now with NumberSmith Pro.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <LinkButton href="/dashboard" variant="outline">
          Continue Tomorrow
        </LinkButton>
        <LinkButton href="/pricing">Try NumberSmith Pro</LinkButton>
      </div>
    </div>
  );
}

export function ProblemSolverLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
      {children}
    </Link>
  );
}
