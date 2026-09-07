"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/app/logout-button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  submitPlacementAnswerAction,
  type PlacementQuestionPayload,
} from "@/lib/actions/placement-actions";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function PlacementRunner({
  testId,
  initialQuestion,
}: {
  testId: string;
  initialQuestion: PlacementQuestionPayload;
}) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialQuestion);
  const [pending, startTransition] = useTransition();

  function handleSubmit(given: string, timeSeconds: number, onGraded: (correct: boolean) => void) {
    startTransition(async () => {
      const result = await submitPlacementAnswerAction({
        testId,
        problemId: question.id,
        answerGiven: given,
        timeSeconds,
      });
      onGraded(result.correct);
      setTimeout(() => {
        if (result.done) {
          router.push(`/placement-test/results?test=${testId}`);
        } else {
          setQuestion(result.next);
        }
      }, 550);
    });
  }

  const progressPct = Math.min(100, (question.questionNumber / question.minQuestions) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Keying on question.id remounts the card for each question, so its
          per-question state (answer, timer, feedback) resets on its own
          instead of being cleared from an effect. */}
      <QuestionCard
        key={question.id}
        question={question}
        pending={pending}
        progressPct={progressPct}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function QuestionCard({
  question,
  pending,
  progressPct,
  onSubmit,
}: {
  question: PlacementQuestionPayload;
  pending: boolean;
  progressPct: number;
  onSubmit: (given: string, timeSeconds: number, onGraded: (correct: boolean) => void) => void;
}) {
  const [selected, setSelected] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const interval = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  const answerGiven = question.format === "MULTIPLE_CHOICE" ? selected : textAnswer.trim();
  const canSubmit = answerGiven.length > 0 && !pending && !feedback;

  function submit(given: string) {
    const startedAt = startedAtRef.current || Date.now();
    const timeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    onSubmit(given, timeSeconds, (correct) => setFeedback(correct ? "correct" : "incorrect"));
  }

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo href="/" />
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="tabular-nums">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(elapsed % 60).padStart(2, "0")}
            </span>
            {/* Safe to leave mid-test: every answer is written to
                placementAttempt as it's submitted, so the test resumes here. */}
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Question {question.questionNumber}</span>
            <span>Adaptive test — usually 20-30 questions</span>
          </div>
          <ProgressBar value={progressPct} tone="brand" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <Badge tone="brand">{question.topicName}</Badge>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <p className="text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-50 sm:text-xl">
            {question.question}
          </p>

          <div className="mt-8">
            {question.format === "MULTIPLE_CHOICE" ? (
              <div className="space-y-2.5">
                {question.choices.map((choice, i) => {
                  const letter = CHOICE_LETTERS[i];
                  const isSelected = selected === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={pending || !!feedback}
                      onClick={() => setSelected(letter)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          isSelected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
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
                <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {question.format === "INTEGER" ? "Enter an integer answer" : "Enter your answer"}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={textAnswer}
                  disabled={pending || !!feedback}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit) submit(answerGiven);
                  }}
                  placeholder="Your answer"
                  className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
                />
              </div>
            )}
          </div>

          {feedback && (
            <div
              className={cn(
                "mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold",
                feedback === "correct"
                  ? "bg-emerald-50 text-success-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              )}
            >
              {feedback === "correct" ? "Correct." : "Noted — moving on."}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={pending || !!feedback}
              onClick={() => submit("")}
              className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
            >
              Skip question
            </button>
            <Button disabled={!canSubmit} onClick={() => submit(answerGiven)}>
              {pending ? "Checking…" : "Submit Answer"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
