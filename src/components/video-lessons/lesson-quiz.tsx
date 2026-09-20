"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MathText } from "@/components/math-text";
import { AnswerInput } from "@/components/practice/answer-input";
import { ProblemFigure } from "@/components/practice/problem-figure";
import { submitPracticeAnswerAction } from "@/lib/actions/practice-actions";

// A five-question check at the end of every video lesson. The questions come
// from the same verified problem bank the rest of the app uses, picked
// server-side to match the lesson's topic and difficulty — so they are already
// answer-checked, and they carry solutions we can show on a miss.
//
// Submission goes through submitPracticeAnswerAction in LESSON mode, which
// means quiz work counts toward mastery and XP on exactly the same terms as
// practice, including the "paid once per problem" rule.

export type QuizProblem = {
  id: string;
  question: string;
  diagram: string | null;
  format: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "INTEGER";
  choices: string[];
  difficulty: number;
};

type Result = {
  correct: boolean;
  correctAnswer: string;
  solution: string;
  answerGiven: string;
};

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function LessonQuiz({ problems }: { problems: QuizProblem[] }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState<(Result | null)[]>(() => problems.map(() => null));
  const [capped, setCapped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Per-question stopwatch. Kept in a ref and reset from an effect rather than
  // read during render, so the clock starts when a question actually appears.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, [index, started]);

  const problem = problems[index];
  const result = results[index];
  const answered = result !== null;
  const allAnswered = results.every((r) => r !== null);
  const score = results.filter((r) => r?.correct).length;

  function submit() {
    const answer = draft.trim();
    if (!answer || pending || answered) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitPracticeAnswerAction({
          problemId: problem.id,
          answerGiven: answer,
          timeSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
          hintsUsed: 0,
          mode: "LESSON",
        });
        if (res.capped) {
          setCapped(true);
          return;
        }
        setResults((prev) => {
          const next = [...prev];
          next[index] = {
            correct: res.correct,
            correctAnswer: res.correctAnswer,
            solution: res.solution,
            answerGiven: answer,
          };
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not submit that answer.");
      }
    });
  }

  function goTo(next: number) {
    setIndex(next);
    setDraft("");
    setError(null);
  }

  if (!started) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-card p-6 text-center dark:border-slate-700">
        <Badge tone="brand">Check your understanding</Badge>
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-50">
          {problems.length}-question quiz
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-300">
          Practice what this lesson covered. These count toward your mastery and XP just like
          regular practice.
        </p>
        <Button className="mt-4" onClick={() => setStarted(true)}>
          Start quiz
        </Button>
      </div>
    );
  }

  if (capped) {
    return (
      <div className="mt-6 rounded-2xl border border-warning-500/40 bg-warning-500/5 p-6 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          You&apos;ve hit today&apos;s free problem limit.
        </p>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          The quiz will be here tomorrow, or upgrade for unlimited practice.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-card dark:border-slate-700">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Badge tone="brand">Quiz</Badge>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Question {index + 1} of {problems.length}
          </span>
        </div>
        <div className="flex gap-1.5">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to question ${i + 1}`}
              className={cn(
                "h-2 w-6 rounded-full transition",
                i === index && "ring-2 ring-brand-400 ring-offset-1 ring-offset-card",
                r === null
                  ? "bg-slate-200 dark:bg-slate-700"
                  : r.correct
                    ? "bg-success-500"
                    : "bg-danger-500"
              )}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="text-base leading-relaxed text-slate-900 dark:text-slate-100">
          <MathText>{problem.question}</MathText>
        </p>

        {problem.diagram && <ProblemFigure svg={problem.diagram} />}

        {problem.format === "MULTIPLE_CHOICE" ? (
          <div className="mt-4 space-y-2">
            {problem.choices.map((choice, i) => {
              const letter = CHOICE_LETTERS[i];
              const chosen = answered ? result.answerGiven === letter : draft === letter;
              const isRight = answered && result.correctAnswer === letter;
              return (
                <button
                  key={letter}
                  disabled={answered || pending}
                  onClick={() => setDraft(letter)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    "disabled:cursor-default",
                    isRight
                      ? "border-success-500 bg-success-500/10"
                      : chosen && answered
                        ? "border-danger-500 bg-danger-500/10"
                        : chosen
                          ? "border-brand-500 bg-brand-500/10"
                          : "border-slate-200 hover:border-brand-300 dark:border-slate-700 dark:hover:border-brand-700"
                  )}
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{letter}.</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    <MathText>{choice}</MathText>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4">
            <AnswerInput
              value={answered ? result.answerGiven : draft}
              onChange={setDraft}
              onEnter={submit}
              disabled={answered || pending}
              integerOnly={problem.format === "INTEGER"}
            />
          </div>
        )}

        {error && <p className="mt-3 text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>}

        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl border px-4 py-3",
              result.correct
                ? "border-success-500/40 bg-success-500/10"
                : "border-danger-500/40 bg-danger-500/10"
            )}
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {result.correct ? "Correct" : "Not quite"}
              {!result.correct && (
                <span className="font-normal text-slate-700 dark:text-slate-300">
                  {" "}— the answer is <MathText>{result.correctAnswer}</MathText>
                </span>
              )}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <MathText>{result.solution}</MathText>
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          {!answered ? (
            <Button onClick={submit} disabled={pending || !draft.trim()}>
              {pending ? "Checking…" : "Submit"}
            </Button>
          ) : index < problems.length - 1 ? (
            <Button onClick={() => goTo(index + 1)}>Next question</Button>
          ) : (
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {allAnswered ? `Quiz complete — ${score} of ${problems.length} correct` : "Answer the skipped questions above"}
            </span>
          )}
          {index > 0 && (
            <Button variant="ghost" onClick={() => goTo(index - 1)}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
