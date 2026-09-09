"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { AnswerInput } from "@/components/practice/answer-input";
import { Button } from "@/components/ui/button";
import { submitSimulationAction } from "@/lib/actions/simulation-actions";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

type Item = {
  id: string;
  order: number;
  question: string;
  format: string;
  choices: string[];
};

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TestRunner({
  attemptId,
  title,
  shortName,
  remainingSeconds,
  items,
}: {
  attemptId: string;
  title: string;
  shortName: string;
  remainingSeconds: number;
  items: Item[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(remainingSeconds);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  const current = items[index];
  const answeredCount = Object.values(answers).filter(Boolean).length;

  const doSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    const { resultsUrl } = await submitSimulationAction({
      attemptId,
      answers,
      flagged: Array.from(flagged),
    });
    router.push(resultsUrl);
  }, [attemptId, answers, flagged, router]);

  useEffect(() => {
    if (remaining <= 0) {
      doSubmit();
      return;
    }
    const timer = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(timer);
  }, [remaining, doSubmit]);

  const lowTime = remaining < 300;

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 bg-card px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {answeredCount} of {items.length} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
              lowTime ? "bg-red-50 text-danger-600 dark:bg-red-950 dark:text-red-400" : "bg-slate-100 text-slate-700"
            )}
          >
            {formatTime(remaining)}
          </div>
          <Button onClick={() => setConfirmOpen(true)} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Test"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-5 px-4 py-6 sm:px-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                Question {index + 1}
                <span className="ml-1.5 font-normal text-slate-400 dark:text-slate-500">of {items.length}</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setFlagged((prev) => {
                    const next = new Set(prev);
                    if (next.has(current.id)) next.delete(current.id);
                    else next.add(current.id);
                    return next;
                  })
                }
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold",
                  flagged.has(current.id)
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {flagged.has(current.id) ? "🚩 Flagged" : "🏳️ Flag for review"}
              </button>
            </div>

            <p className="text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-50">{current.question}</p>

            <div className="mt-7">
              {current.format === "MULTIPLE_CHOICE" ? (
                <div className="space-y-2.5">
                  {current.choices.map((choice, i) => {
                    const letter = CHOICE_LETTERS[i];
                    const isSelected = answers[current.id] === letter;
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [current.id]: letter }))}
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
                <AnswerInput
                  key={current.id}
                  value={answers[current.id] ?? ""}
                  onChange={(next) => setAnswers((a) => ({ ...a, [current.id]: next }))}
                  // A simulation is a timed paper — Enter must not submit it.
                  onEnter={() => {}}
                  disabled={false}
                  integerOnly={current.format === "INTEGER"}
                />
              )}
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Scratch notes</label>
              <textarea
                value={notes[current.id] ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [current.id]: e.target.value }))}
                rows={3}
                placeholder="Work through the problem here…"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-sm outline-none focus:border-brand-400"
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                disabled={index === items.length - 1}
                onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Navigator</p>
            <div className="mt-3 grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {items.map((item, i) => {
                const answered = !!answers[item.id];
                const isFlagged = flagged.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "relative flex h-8 items-center justify-center rounded-md text-xs font-bold transition-colors",
                      i === index
                        ? "bg-brand-600 text-white"
                        : answered
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <p className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-emerald-100" /> Answered
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-slate-100 dark:bg-slate-800" /> Unanswered
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Flagged
              </p>
            </div>
          </div>
        </aside>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Submit {shortName}?</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You&apos;ve answered {answeredCount} of {items.length} questions
              {items.length - answeredCount > 0 && `, leaving ${items.length - answeredCount} blank`}.
              Answers are revealed only after you submit.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Keep Working
              </Button>
              <Button onClick={doSubmit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Test"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
