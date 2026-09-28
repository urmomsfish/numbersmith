"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { describeAnswerSource, type PaperResult, type PaperQuestion, type AnswerSource } from "@/lib/papers";

/**
 * What you got, and what you missed.
 *
 * Shared by both sitting modes so a paper scores and reads the same whether it
 * was quizzed question-by-question or sat with the PDF on screen.
 *
 * When question text is available it is shown beside each wrong answer. The
 * point of a past paper is finding out which questions you can't do, and a grid
 * of "Q14 ✗ key: C" does not tell you that — you would have to go back to the
 * PDF and count. A flagged question keeps its flag here too, because "the scan
 * misread it" is a real explanation for a wrong mark and the student deserves
 * to see it rather than conclude they got it wrong.
 */
export function PaperResults({
  result,
  title,
  questions,
  answerSource,
  onBack,
  onAll,
}: {
  result: PaperResult;
  title: string;
  /** Empty for a hand-entered paper; the compact grid is used then. */
  questions: PaperQuestion[];
  answerSource: AnswerSource;
  paperId: string;
  onBack: () => void;
  onAll: () => void;
}) {
  const pct = Math.round((result.correctCount / result.questionCount) * 100);
  const hasText = questions.length === result.questionCount && questions.length > 0;
  const missedFlagged = hasText
    ? result.correct.filter((ok, i) => !ok && questions[i].confidence === "low").length
    : 0;
  // Questions marked wrong against an answer NumberSmith worked out and was
  // itself unsure of. These are the marks most likely to be the app's fault
  // rather than the student's, and saying so is the difference between a
  // student fixing a real gap and a student losing faith in the scoring.
  const missedUncertain =
    hasText && answerSource === "SOLVED"
      ? result.correct.filter((ok, i) => !ok && questions[i].answerConfidence === "low").length
      : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Badge tone="brand" className="mb-3">
        {title}
      </Badge>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        {result.correctCount}/{result.questionCount}
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {pct}% · {describeAnswerSource(answerSource)}
        {result.timedOut && " · submitted after the clock ran out"}
      </p>

      {missedUncertain > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-400">
          {missedUncertain} of the ones marked wrong {missedUncertain === 1 ? "was" : "were"} graded
          against an answer NumberSmith wasn&rsquo;t sure of. If you worked{" "}
          {missedUncertain === 1 ? "it" : "them"} out and disagree, you may well be right — check
          against the original before treating {missedUncertain === 1 ? "it" : "them"} as a gap.
        </p>
      )}

      {missedFlagged > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-400">
          {missedFlagged} of the ones you missed {missedFlagged === 1 ? "was" : "were"} flagged when
          the paper was scanned. Check {missedFlagged === 1 ? "it" : "them"} against the original
          before assuming the mark is right.
        </p>
      )}

      {hasText ? (
        <ul className="mt-6 space-y-2">
          {result.correct.map((ok, i) => (
            <li
              key={i}
              className={
                ok
                  ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950"
                  : "rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950"
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-400">
                  Q{i + 1}
                </span>
                {questions[i].confidence === "low" && <Badge tone="warning">Scan was unsure</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-800 dark:text-slate-200">
                {questions[i].text}
              </p>
              <p className="mt-1 text-sm">
                <span
                  className={
                    ok
                      ? "font-semibold text-success-600 dark:text-emerald-400"
                      : "font-semibold text-danger-600 dark:text-red-400"
                  }
                >
                  {result.answers[i] || "—"}
                </span>
                {!ok && (
                  <span className="text-slate-700 dark:text-slate-400"> · key: {result.key[i]}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
          {result.correct.map((ok, i) => (
            <div
              key={i}
              className={
                ok
                  ? "rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 dark:border-emerald-900 dark:bg-emerald-950"
                  : "rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 dark:border-red-900 dark:bg-red-950"
              }
            >
              <p className="text-[11px] text-slate-700 dark:text-slate-400">Q{i + 1}</p>
              <p
                className={
                  ok
                    ? "truncate text-sm font-semibold text-success-600 dark:text-emerald-400"
                    : "truncate text-sm font-semibold text-danger-600 dark:text-red-400"
                }
              >
                {result.answers[i] || "—"}
              </p>
              {!ok && (
                <p className="truncate text-[11px] text-slate-700 dark:text-slate-400">
                  key: {result.key[i]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Button onClick={onBack}>Back to the paper</Button>
        <Button variant="ghost" onClick={onAll}>
          All papers
        </Button>
      </div>
    </div>
  );
}
