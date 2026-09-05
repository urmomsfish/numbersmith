"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { submitPracticeAnswerAction } from "@/lib/actions/practice-actions";
import { submitDisputeAction } from "@/lib/actions/dispute-actions";
import { difficultyLabel } from "@/lib/types";

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

type DisputeReason = "ANSWER_WRONG" | "SOLUTION_UNCLEAR" | "AMBIGUOUS_WORDING" | "OTHER";

const DISPUTE_REASONS: { value: DisputeReason; label: string }[] = [
  { value: "ANSWER_WRONG", label: "The answer key looks wrong" },
  { value: "SOLUTION_UNCLEAR", label: "The solution doesn't make sense" },
  { value: "AMBIGUOUS_WORDING", label: "The question is ambiguous or unclear" },
  { value: "OTHER", label: "Something else" },
];

export function ProblemSolver({
  problem,
  mode = "PRACTICE",
  onContinue,
  continueLabel = "Next Problem →",
}: {
  problem: SolverProblem;
  mode?: "PRACTICE" | "DAILY_CHALLENGE";
  onContinue?: (result: SubmitResult) => void;
  continueLabel?: string;
}) {
  const [selected, setSelected] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<DisputeReason>("ANSWER_WRONG");
  const [reportMessage, setReportMessage] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "pending" | "sent" | "error">("idle");
  const [reportError, setReportError] = useState("");
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

  async function submitReport() {
    if (!result || result.capped) return;
    setReportStatus("pending");
    const res = await submitDisputeAction({
      problemId: problem.id,
      theirAnswer: answerGiven,
      storedAnswer: result.correctAnswer,
      reason: reportReason,
      message: reportMessage,
    });
    if (res?.error) {
      setReportError(res.error);
      setReportStatus("error");
    } else {
      setReportStatus("sent");
    }
  }

  if (result?.capped) {
    return <DailyCapUpsell />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{problem.topicName}</Badge>
          <Badge tone="slate">{difficultyLabel(problem.difficulty)}</Badge>
        </div>
        <span className="tabular-nums text-xs text-slate-400">
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>

      <p className="text-lg font-medium leading-relaxed text-slate-900 sm:text-xl">{problem.question}</p>

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
                        ? "border-success-500 bg-emerald-50 text-emerald-800"
                        : isWrongPick
                          ? "border-danger-500 bg-red-50 text-red-800"
                          : "border-slate-200 text-slate-400"
                      : isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isSelected && !result ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
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
            <label className="mb-2 block text-xs font-medium text-slate-500">
              {problem.format === "INTEGER" ? "Enter an integer answer" : "Enter your answer"}
            </label>
            <input
              type="text"
              value={textAnswer}
              disabled={pending || !!result}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && submit()}
              placeholder="Your answer"
              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
            />
            {result && !result.capped && (
              <p className="mt-2 text-sm text-slate-500">
                Correct answer: <span className="font-semibold text-slate-800">{result.correctAnswer}</span>
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
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              💡 Show Hint ({hintsShown + 1}/{problem.hints.length})
            </button>
          ) : null}
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

      {result && !result.capped && (
        <div className="mt-6 space-y-3">
          <div
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold",
              result.correct ? "bg-emerald-50 text-success-600" : "bg-red-50 text-danger-600"
            )}
          >
            {result.correct ? "Correct! " : "Not quite. "}
            <span className="font-normal text-slate-500">
              {result.ratingDelta >= 0 ? "+" : ""}
              {result.ratingDelta} rating · +{result.xpAwarded} XP
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solution</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{result.solution}</p>
          </div>
          {result.newlyUnlocked.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              {result.newlyUnlocked.map((a, i) => (
                <p key={i} className="text-sm font-semibold text-amber-800">
                  {a.icon} Achievement unlocked: {a.name} (+{a.xpReward} XP)
                </p>
              ))}
            </div>
          )}

          <div className="pt-1">
            {reportStatus === "sent" ? (
              <p className="text-sm text-slate-500">
                🚩 Thanks — this has been sent for review. We&apos;ll follow up by email if we need
                more detail.
              </p>
            ) : !reportOpen ? (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="text-sm font-medium text-slate-400 hover:text-slate-600"
              >
                🚩 Something wrong with this problem?
              </button>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">Report a problem</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  This goes to a real person, not another AI. Every answer on NumberSmith is meant
                  to be independently verified — if you&apos;ve found one that isn&apos;t, telling
                  us here fixes it for every future student.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {DISPUTE_REASONS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setReportReason(r.value)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        reportReason === r.value
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder="Explain what you think is wrong (optional, but it helps us fix it faster)"
                  rows={3}
                  maxLength={2000}
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />

                {reportStatus === "error" && (
                  <p className="mt-2 text-sm text-danger-600">{reportError}</p>
                )}

                <div className="mt-3 flex items-center gap-3">
                  <Button
                    onClick={submitReport}
                    disabled={reportStatus === "pending"}
                    variant="outline"
                    size="sm"
                  >
                    {reportStatus === "pending" ? "Sending…" : "Send report"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
    <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center">
      <p className="text-3xl">🎉</p>
      <h2 className="mt-3 text-xl font-bold text-slate-900">You&apos;ve completed today&apos;s training!</h2>
      <p className="mt-2 text-sm text-slate-500">
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
    <Link href={href} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
      {children}
    </Link>
  );
}
