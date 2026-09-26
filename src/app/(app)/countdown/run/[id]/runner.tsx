"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button, LinkButton } from "@/components/ui/button";
import { ProblemStatement } from "@/components/practice/problem-figure";
import {
  answerCountdownItemAction,
  finishCountdownAction,
} from "@/lib/actions/countdown-actions";
import type { CountdownQuestion } from "@/lib/engine/countdown";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** How long the key stays on screen before the next question. Long enough to
 * read which answer was right, short enough that the round keeps its pace. */
const REVEAL_MS = 1600;

type Outcome = { correct: boolean; correctAnswer: string; timedOut: boolean };

export function CountdownRunner({
  attemptId,
  questions,
  secondsPerQuestion,
}: {
  attemptId: string;
  questions: CountdownQuestion[];
  secondsPerQuestion: number;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(secondsPerQuestion);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [results, setResults] = useState<Outcome[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = questions[index];
  // Guards the whole submit path: the timer and a click can both fire for the
  // same question, and without this the later one starts a second request.
  const settled = useRef(false);
  // Seeded in an effect, never during render: reading the clock while
  // rendering is impure and drifts if the component happens to re-render.
  // Same reason the daily-challenge runner defers its own start time.
  const startedAt = useRef(0);

  const submit = useCallback(
    async (answer: string) => {
      if (settled.current || !question) return;
      settled.current = true;
      // Falls back to now if the seeding effect has not run yet, which would
      // otherwise report an elapsed time measured from the epoch.
      const started = startedAt.current || Date.now();
      const elapsed = (Date.now() - started) / 1000;

      const res = await answerCountdownItemAction({
        attemptId,
        itemId: question.itemId,
        answerGiven: answer,
        timeSeconds: elapsed,
      });

      if (!res.ok) {
        setError(res.error);
        settled.current = false;
        return;
      }

      const o: Outcome = {
        correct: res.result.correct,
        correctAnswer: res.result.correctAnswer,
        timedOut: res.result.timedOut,
      };
      setOutcome(o);
      setResults((prev) => [...prev, o]);

      setTimeout(() => {
        if (res.result.finished || index + 1 >= questions.length) {
          setDone(true);
          router.refresh();
        } else {
          setIndex((i) => i + 1);
          setOutcome(null);
          setRemaining(secondsPerQuestion);
          startedAt.current = Date.now();
          settled.current = false;
        }
      }, REVEAL_MS);
    },
    [attemptId, index, question, questions.length, router, secondsPerQuestion]
  );

  // Start the clock for each question here rather than at render time.
  useEffect(() => {
    startedAt.current = Date.now();
  }, [index]);

  // One interval per question. Submitting an empty answer at zero is what makes
  // a timeout count as missed rather than leaving the round stuck.
  useEffect(() => {
    if (done || outcome) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          void submit("");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [index, done, outcome, submit]);

  // Keyboard first: a countdown round is about speed, and reaching for a mouse
  // between questions is most of the time a student has.
  useEffect(() => {
    if (done || outcome || !question) return;
    const onKey = (e: KeyboardEvent) => {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && i < question.choices.length) void submit(LETTERS[i]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, outcome, question, submit]);

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-card p-8 text-center dark:border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Round complete
          </p>
          <p className="mt-2 text-5xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
            {correct}/{questions.length}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {results.map((r, i) => (
              <span
                key={i}
                title={r.timedOut ? "Ran out of time" : r.correct ? "Correct" : "Incorrect"}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold",
                  r.correct
                    ? "bg-success-600 text-white"
                    : r.timedOut
                      ? "bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      : "bg-danger-600 text-white"
                )}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-2">
            <LinkButton href="/countdown" size="lg">
              Another round
            </LinkButton>
            <LinkButton href="/dashboard" variant="outline" size="lg">
              Back to dashboard
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const urgent = remaining <= 10;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Question {index + 1} of {questions.length}
        </span>
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            urgent ? "text-danger-600 dark:text-danger-500" : "text-slate-900 dark:text-slate-50"
          )}
          aria-live="off"
        >
          {remaining}s
        </span>
      </div>

      {/* Width, not a spinner: a bar draining left to right is readable at a
          glance without pulling attention off the problem. */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            urgent ? "bg-danger-600" : "bg-ember-600"
          )}
          style={{ width: `${(remaining / secondsPerQuestion) * 100}%` }}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-card p-6 dark:border-slate-700">
        <ProblemStatement question={question.question} diagram={question.diagram} />

        <div className="mt-5 grid gap-2">
          {question.choices.map((choice, i) => {
            const letter = LETTERS[i];
            const isKey = outcome?.correctAnswer === letter;
            return (
              <button
                key={letter}
                disabled={!!outcome}
                onClick={() => void submit(letter)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  outcome
                    ? isKey
                      ? "border-success-600 bg-success-600/10"
                      : "border-slate-200 opacity-60 dark:border-slate-700"
                    : "border-slate-200 hover:border-foreground hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {letter}
                </span>
                <span className="text-slate-900 dark:text-slate-50">{choice}</span>
              </button>
            );
          })}
        </div>

        {outcome && (
          <p
            className={cn(
              "mt-4 text-sm font-semibold",
              outcome.correct
                ? "text-success-600 dark:text-success-500"
                : "text-danger-600 dark:text-danger-500"
            )}
          >
            {outcome.correct
              ? "Correct"
              : outcome.timedOut
                ? `Out of time — the answer was ${outcome.correctAnswer}`
                : `Not quite — the answer was ${outcome.correctAnswer}`}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-xs font-medium text-danger-600 dark:text-danger-400">
            {error}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-1">
        <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-500">
          Press <kbd className="font-sans font-medium">A</kbd>–
          <kbd className="font-sans font-medium">{LETTERS[question.choices.length - 1]}</kbd> to answer
        </p>
        <Button
          variant="ghost"
          onClick={async () => {
            const res = await finishCountdownAction({ attemptId });
            if (res.ok) setDone(true);
            else setError(res.error);
          }}
        >
          End round
        </Button>
      </div>
    </div>
  );
}
