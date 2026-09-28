"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { submitPaperAction, abandonAttemptAction } from "@/lib/actions/paper-actions";
import type { PaperResult } from "@/lib/papers";
import { PaperResults } from "./results";

function clock(seconds: number): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Sitting a past paper: the PDF on the left, the answer sheet on the right, and
 * a clock.
 *
 * The countdown here is a display. `initialSeconds` is computed on the server
 * from the attempt's `startedAt`, and the server marks lateness again on
 * submit — so pausing the tab, editing the clock in devtools, or reloading
 * cannot buy time. Reloading mid-paper resumes the same attempt rather than
 * starting a new one.
 */
export function PaperSitting({
  attemptId,
  paperId,
  title,
  fileUrl,
  questionCount,
  initialSeconds,
  initialResult,
}: {
  attemptId: string;
  paperId: string;
  title: string;
  fileUrl: string;
  questionCount: number;
  initialSeconds: number;
  /** Non-null when this attempt is already marked, so the result survives a
   * reload and has a URL of its own. */
  initialResult: PaperResult | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(() => Array(questionCount).fill(""));
  const [seconds, setSeconds] = useState(initialSeconds);
  const [result, setResult] = useState<PaperResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Guards against a double submit: the auto-submit at zero and a student
  // hitting the button in the same moment would otherwise both fire. The
  // server is idempotent too, but this keeps the UI honest.
  const settled = useRef(initialResult !== null);

  // The latest answers, readable from the timer's auto-submit without making
  // `submit` depend on `answers` — that dependency would rebuild the callback
  // on every keystroke and restart the one-second interval with it, so the
  // clock would never actually tick down while a student was typing. Synced in
  // an effect rather than assigned during render, which React forbids.
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submit = useCallback(async () => {
    if (settled.current) return;
    settled.current = true;
    setBusy(true);
    const res = await submitPaperAction({ attemptId, answers: answersRef.current });
    setBusy(false);
    if (res.ok) setResult(res.result);
    else {
      // Let them try again rather than stranding a finished paper.
      settled.current = false;
      setError(res.error);
    }
  }, [attemptId]);

  useEffect(() => {
    if (result) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          void submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [result, submit]);

  const answered = answers.filter((a) => a.trim()).length;
  const low = seconds <= 300;

  if (result) {
    // Hand-entered papers have no question text, so the shared view falls back
    // to its compact grid — same marks, same layout rules, one component.
    return (
      <PaperResults
        result={result}
        title={title}
        paperId={paperId}
        questions={[]}
        answerSource="MANUAL"
        onBack={() => router.push(`/papers/${paperId}`)}
        onAll={() => router.push("/papers")}
      />
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {answered}/{questionCount} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-live="polite"
            className={
              low
                ? "font-mono text-2xl font-bold tabular-nums text-danger-600 dark:text-red-400"
                : "font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50"
            }
          >
            {clock(seconds)}
          </span>
          <Button onClick={() => void submit()} disabled={busy}>
            {busy ? "Marking…" : "Submit"}
          </Button>
        </div>
      </div>

      {/* Underscore, not a comma: `grid-template-columns` is a space-separated
          list, so `[1fr,20rem]` emits invalid CSS, the rule is dropped, and the
          answer sheet silently falls below the paper instead of beside it. It
          builds and lints clean either way. */}
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        {/* The paper. Served from a route handler rather than inlined, so the
            browser's own PDF viewer handles paging and zoom. */}
        <object
          data={fileUrl}
          type="application/pdf"
          className="h-[75vh] w-full rounded-xl border border-slate-200 dark:border-slate-700"
          aria-label={`${title} (PDF)`}
        >
          {/* Shown when the browser has no inline PDF viewer, which is the
              norm on mobile. The paper is still sittable — open it in another
              tab and keep this one for the answers. */}
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Your browser can&rsquo;t show the PDF inline.
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-700 underline dark:text-brand-300"
            >
              Open the paper in a new tab
            </a>
          </div>
        </object>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Answer sheet
          </p>
          <div className="grid max-h-[65vh] grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 overflow-y-auto">
            {answers.map((value, i) => (
              <label key={i} className="flex items-center gap-1.5">
                <span className="w-5 shrink-0 text-right text-xs tabular-nums text-slate-600 dark:text-slate-400">
                  {i + 1}
                </span>
                <input
                  value={value}
                  onChange={(e) =>
                    setAnswers((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  aria-label={`Answer to question ${i + 1}`}
                  className="w-full rounded-md border border-slate-300 bg-background px-2 py-1 text-center text-sm uppercase text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Discard this sitting? Nothing is scored and the clock resets.")) return;
              const res = await abandonAttemptAction({ attemptId });
              if (res.ok) router.push(`/papers/${paperId}`);
              else setError(res.error);
            }}
            className="mt-3 w-full rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Discard this sitting
          </button>
        </div>
      </div>

      {error && (
        <p
          role="status"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600 dark:bg-red-950 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
