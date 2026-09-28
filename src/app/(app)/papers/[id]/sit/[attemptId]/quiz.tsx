"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitPaperAction, abandonAttemptAction } from "@/lib/actions/paper-actions";
import type { PaperResult, PaperQuestion, AnswerSource } from "@/lib/papers";
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
 * Sitting a scanned paper: one question at a time, with a clock.
 *
 * The clock belongs to the whole paper, not the question — this is a past paper
 * sat under contest conditions, so budgeting time across questions is part of
 * the exercise. That also means free navigation: skip ahead, come back, change
 * an answer, exactly as you could with the paper on a desk.
 *
 * Questions the scanner was unsure about keep their flag here. A student who
 * meets a garbled question mid-sitting should be able to see immediately that
 * the transcription is suspect rather than assume they misread it — and the
 * original PDF is one click away for exactly that case.
 */
export function PaperQuiz({
  attemptId,
  paperId,
  title,
  fileUrl,
  questions,
  answerSource,
  initialSeconds,
  initialResult,
}: {
  attemptId: string;
  paperId: string;
  title: string;
  fileUrl: string;
  questions: PaperQuestion[];
  answerSource: AnswerSource;
  initialSeconds: number;
  initialResult: PaperResult | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(() => Array(questions.length).fill(""));
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [result, setResult] = useState<PaperResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPaper, setShowPaper] = useState(false);

  const settled = useRef(initialResult !== null);

  // Latest answers, readable from the timer's auto-submit without rebuilding
  // `submit` on every keystroke — that dependency would restart the interval
  // and the clock would never tick while the student was typing.
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

  if (result) {
    return (
      <PaperResults
        result={result}
        title={title}
        paperId={paperId}
        questions={questions}
        answerSource={answerSource}
        onBack={() => router.push(`/papers/${paperId}`)}
        onAll={() => router.push("/papers")}
      />
    );
  }

  const q = questions[index];
  const answered = answers.filter((a) => a.trim()).length;
  const low = seconds <= 300;
  const setAnswer = (value: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {answered}/{questions.length} answered
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

      {/* Question navigator. Answered questions are filled, the current one is
          ringed, and a flagged one keeps its amber edge — so a student can see
          at a glance what is left and what needs a second look. */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {questions.map((item, i) => {
          const done = answers[i].trim().length > 0;
          const here = i === index;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Question ${i + 1}${done ? ", answered" : ""}`}
              aria-current={here ? "true" : undefined}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                done
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                here ? "ring-2 ring-foreground" : "",
                item.confidence === "low" ? "border border-amber-400 dark:border-amber-600" : "",
              ].join(" ")}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
            Question {index + 1} of {questions.length}
          </span>
          {q.confidence === "low" && <Badge tone="warning">Scan was unsure</Badge>}
        </div>

        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900 dark:text-slate-50">
          {q.text}
        </p>

        {q.note && q.confidence === "low" && (
          <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
            {q.note} — open the original if this looks wrong.
          </p>
        )}

        {q.choices.length > 0 ? (
          <div className="mt-4 space-y-2">
            {q.choices.map((choice, k) => {
              const letter = String.fromCharCode(65 + k);
              const picked = answers[index].trim().toUpperCase() === letter;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAnswer(picked ? "" : letter)}
                  aria-pressed={picked}
                  className={
                    picked
                      ? "flex w-full items-start gap-3 rounded-lg border-2 border-foreground bg-slate-50 px-3 py-2 text-left text-sm dark:bg-slate-800"
                      : "flex w-full items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-slate-700 dark:hover:bg-slate-800"
                  }
                >
                  <span className="font-semibold text-slate-900 dark:text-slate-50">{letter}</span>
                  <span className="text-slate-800 dark:text-slate-200">{choice}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your answer
            </span>
            <input
              value={answers[index]}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label={`Answer to question ${index + 1}`}
              className="w-full max-w-xs rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
            />
          </label>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={index === questions.length - 1}
          >
            Next
          </Button>
          <button
            type="button"
            onClick={() => setShowPaper((v) => !v)}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {showPaper ? "Hide the original" : "Show the original"}
          </button>
        </div>
      </div>

      {/* The PDF, on demand. Always reachable rather than always on screen: a
          question that needs its figure, or a transcription that reads wrong,
          has to be checkable against the source — but showing the paper by
          default would make the quiz pointless. */}
      {showPaper && (
        <object
          data={fileUrl}
          type="application/pdf"
          className="mt-4 h-[70vh] w-full rounded-xl border border-slate-200 dark:border-slate-700"
          aria-label={`${title} (PDF)`}
        >
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
      )}

      <button
        type="button"
        onClick={async () => {
          if (!confirm("Discard this sitting? Nothing is scored and the clock resets.")) return;
          const res = await abandonAttemptAction({ attemptId });
          if (res.ok) router.push(`/papers/${paperId}`);
          else setError(res.error);
        }}
        className="mt-3 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:bg-slate-800"
      >
        Discard this sitting
      </button>

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
