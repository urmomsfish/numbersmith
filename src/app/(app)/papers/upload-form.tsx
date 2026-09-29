"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { scanPaperAction, uploadPaperAction } from "@/lib/actions/paper-actions";
import {
  MAX_PAPER_BASE64,
  MAX_QUESTIONS,
  MAX_TIME_LIMIT_MINUTES,
  type PaperQuestion,
  type AnswerSource,
} from "@/lib/papers";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50";

/** Reads the chosen file to bare base64, dropping the `data:` prefix — the
 * storage convention the schema documents. */
function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/** A question plus its answer, as the review screen edits them. */
type Row = PaperQuestion & { answer: string };

/** What the review screen says above the key, per source. The point is that a
 * student can tell at a glance whether they are confirming something the paper
 * said or something NumberSmith concluded. */
const SOURCE_HEADING: Record<AnswerSource, string> = {
  PRINTED: "Answers from the paper's key",
  SOLVED: "Answers NumberSmith worked out",
  MANUAL: "Answer key",
  // No answers to show — this is the questions-only review, which is the
  // normal case now that marking happens after the paper is sat.
  NONE: "Check the questions",
};

/**
 * The answer for one question on the review screen.
 *
 * Multiple choice and free response are genuinely different inputs and were
 * previously the same 7rem box. That box was also `uppercase`, which is right
 * for a letter and wrong for everything else: it rendered a solved answer of
 * `R(x) = x²/(x+1)` as `R(X) = X²/(X+1)`, changing what the maths says. Case is
 * meaningful in algebra, so the transform now applies only where the answer
 * really is a single letter.
 */
function AnswerField({
  row,
  index,
  source,
  onChange,
}: {
  row: Row;
  index: number;
  source: AnswerSource;
  onChange: (value: string) => void;
}) {
  const unsure = source === "SOLVED" && row.answerConfidence === "low";
  const blank = row.answer.trim() === "";

  // Multiple choice: pick the letter. Typing "C" into a box was never the
  // natural gesture when the options are right there, and it let a student
  // enter a letter the paper never offered.
  if (row.choices.length > 0) {
    const picked = row.answer.trim().toUpperCase();
    return (
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-slate-600 dark:text-slate-400">Answer</span>
          {row.choices.map((_, k) => {
            const letter = String.fromCharCode(65 + k);
            const on = picked === letter;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onChange(on ? "" : letter)}
                aria-pressed={on}
                aria-label={`Question ${index + 1}, answer ${letter}`}
                className={[
                  "h-7 w-7 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                  on
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                  unsure && on ? "ring-2 ring-amber-400" : "",
                ].join(" ")}
              >
                {letter}
              </button>
            );
          })}
          {blank && <span className="text-xs text-amber-800 dark:text-amber-300">Pick one</span>}
        </div>
        {unsure && (
          <p className="text-xs text-amber-800 dark:text-amber-300">
            {row.answerNote || "Worth checking this one."}
          </p>
        )}
      </div>
    );
  }

  // Free response: a rational function or an exact form needs room, reads
  // better monospaced, and must not be case-folded.
  return (
    <div className="space-y-1.5">
      <label className="block">
        <span className="mb-1 block text-xs text-slate-600 dark:text-slate-400">Answer</span>
        <input
          value={row.answer}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Answer to question ${index + 1}`}
          placeholder={blank ? "Type the answer" : undefined}
          className={[
            "w-full max-w-md rounded-md bg-background px-2.5 py-1.5 font-mono text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:text-slate-50",
            unsure || blank
              ? "border-2 border-amber-400 dark:border-amber-600"
              : "border border-slate-300 dark:border-slate-600",
          ].join(" ")}
        />
      </label>
      {(unsure || blank) && (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {row.answerNote || (blank ? "NumberSmith couldn't work this one out — fill it in." : "Worth checking this one.")}
        </p>
      )}
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600 dark:bg-red-950 dark:text-red-400"
    >
      {children}
    </p>
  );
}

/**
 * Upload a paper: choose a PDF, let it be scanned, then check what was read
 * before saving.
 *
 * The review step is the whole reason reading the PDF is safe to do at all.
 * Extraction is a first draft — a misread question that reaches a sitting costs
 * a student ten minutes and their trust in the paper, whereas one caught here
 * costs a few seconds of typing. So nothing is saved until the student has seen
 * it, questions the model was unsure about are flagged, and every field stays
 * editable.
 *
 * Scanning can also be skipped entirely. A paper that will not read, a student
 * who would rather not wait, or a free account drops to the original by-hand
 * path: type the count, the time limit and the key, and sit it with the PDF on
 * screen. That path is the whole feature minus the typing, which is why gating
 * only the scan costs a free account so little.
 */
export function UploadPaperForm({ canScan }: { canScan: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(75);

  // Null until a scan succeeds or the student chooses to enter by hand.
  const [rows, setRows] = useState<Row[] | null>(null);
  const [scanned, setScanned] = useState(false);
  const [answerSource, setAnswerSource] = useState<AnswerSource>("MANUAL");
  const [notice, setNotice] = useState<string | null>(null);
  const [showPaper, setShowPaper] = useState(false);
  // Seconds since the scan started. A scanned PDF can take a minute or more —
  // every page is read as an image — and a button that just says "Reading…"
  // for that long is indistinguishable from one that has hung.
  const [elapsed, setElapsed] = useState(0);
  // Ticks only; the reset lives in `scan()`, because setting state in an
  // effect body is a render-phase write and `react-hooks/set-state-in-effect`
  // rightly rejects it.
  useEffect(() => {
    if (!pending) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [pending]);

  async function withFileData(): Promise<string | null> {
    if (fileData) return fileData;
    if (!file) {
      setError("Choose a PDF to upload.");
      return null;
    }
    if (file.type !== "application/pdf") {
      setError("That needs to be a PDF.");
      return null;
    }
    let data: string;
    try {
      data = await readAsBase64(file);
    } catch {
      setError("Couldn't read that file.");
      return null;
    }
    // Checked here as well as on the server so the student finds out before
    // waiting on a multi-megabyte upload that will be refused.
    if (data.length > MAX_PAPER_BASE64) {
      setError("That PDF is too large — 3 MB is the limit.");
      return null;
    }
    setFileData(data);
    return data;
  }

  function scan() {
    setError(null);
    setNotice(null);
    setElapsed(0);
    start(async () => {
      const data = await withFileData();
      if (!data) return;

      const result = await scanPaperAction({ fileData: data });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setRows(
        result.paper.questions.map((q, i) => ({
          text: q.question,
          choices: q.choices,
          confidence: q.confidence,
          note: q.note,
          answer: result.answers[i]?.answer ?? "",
          answerConfidence: result.answers[i]?.confidence ?? "high",
          answerNote: result.answers[i]?.note ?? "",
        }))
      );
      setScanned(true);
      setAnswerSource(result.answerSource);
      if (!title && result.paper.title) setTitle(result.paper.title);
      if (result.paper.timeLimitMinutes > 0) setTimeLimit(result.paper.timeLimitMinutes);

      const { total, lowConfidence } = result.summary;
      const unsureAnswers = result.answers.filter((a) => a.confidence === "low").length;
      const blanks = result.answers.filter((a) => !a.answer.trim()).length;

      if (result.answerSource === "MANUAL") {
        setNotice(
          `Read ${total} questions, but couldn't work out the answers. Fill the key in below and everything else is ready.`
        );
      } else {
        // One sentence on what happened, then what it needs from you — the
        // counts already live in the stats line above the questions, so
        // repeating all of them here just made a paragraph nobody read.
        const headline =
          result.answerSource === "PRINTED"
            ? `Read ${total} questions and took the answers off the paper's own key.`
            : `Read ${total} questions and worked out the answers.`;
        setNotice(
          blanks > 0
            ? `${headline} ${blanks} couldn't be answered — they're marked below and need you.`
            : lowConfidence + unsureAnswers > 0
              ? `${headline} The flagged ones below are worth a look before you sit it.`
              : `${headline} Nothing flagged — you're ready to sit it.`
        );
      }
    });
  }

  /** Drops to the original by-hand flow: a key with no question text. */
  function enterByHand(count: number) {
    const n = Math.min(MAX_QUESTIONS, Math.max(1, Math.round(count) || 1));
    setRows(
      Array.from({ length: n }, () => ({
        text: "",
        choices: [],
        confidence: "high" as const,
        note: "",
        answer: "",
      }))
    );
    setScanned(false);
    setAnswerSource("MANUAL");
    setNotice(null);
  }

  function save() {
    setError(null);
    start(async () => {
      const data = await withFileData();
      if (!data || !rows) return;

      const result = await uploadPaperAction({
        title,
        fileData: data,
        questionCount: rows.length,
        timeLimitMinutes: timeLimit,
        answerKey: rows.map((r) => r.answer),
        // Only send questions for a scanned paper. A hand-entered one has no
        // question text, and sending blanks would claim it is quizzable.
        questions: scanned
          ? rows.map((r) => ({
              text: r.text,
              choices: r.choices,
              confidence: r.confidence,
              note: r.note,
              answerConfidence: r.answerConfidence,
              answerNote: r.answerNote,
            }))
          : [],
        answerSource: scanned ? answerSource : "MANUAL",
      });
      if (result.ok) router.push(`/papers/${result.paperId}`);
      else setError(result.error);
    });
  }

  const filled = rows?.filter((r) => r.answer.trim()).length ?? 0;
  const flagged = rows?.filter((r) => r.confidence === "low").length ?? 0;
  // Only meaningful for a solved key: a printed one carries the paper's own
  // authority, and a hand-typed one is the student's own.
  const uncertainAnswers =
    answerSource === "SOLVED"
      ? (rows?.filter((r) => r.answerConfidence === "low").length ?? 0)
      : 0;

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          The PDF
        </span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setFileData(null);
            setRows(null);
            setScanned(false);
            setNotice(null);
            setError(null);
          }}
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-100"
        />
        <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
          Stays private to your account.
          {canScan
            ? " NumberSmith reads the questions and works out the answers — you check both before anything is saved."
            : " You'll type the answer key and sit the paper with the PDF on screen."}
        </span>
      </label>

      {file && rows === null && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {canScan && (
              <Button onClick={scan} disabled={pending}>
                {pending ? `Reading… ${elapsed}s` : "Read this paper"}
              </Button>
            )}
            <Button
              variant={canScan ? "ghost" : "primary"}
              onClick={() => enterByHand(25)}
              disabled={pending}
            >
              {canScan ? "Enter by hand instead" : "Enter the answer key"}
            </Button>
          </div>
          {/* Says what is happening, and only once the wait is long enough to
              be worrying. A scanned paper is read page by page as an image,
              which genuinely takes about a minute — silence for that long is
              indistinguishable from a hang. */}
          {pending && elapsed >= 10 && (
            <p role="status" className="text-xs text-slate-600 dark:text-slate-400">
              {elapsed < 30
                ? "Reading the questions off the page, then working out the answers."
                : "Still going — a scanned paper is read one page at a time as an image, which takes longer than a text PDF. About a minute is normal."}
            </p>
          )}
          {!canScan && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Type the answer key and sit the paper with the PDF on screen.{" "}
              <Link href="/pricing" className="font-semibold text-brand-700 underline dark:text-brand-300">
                Pro
              </Link>{" "}
              reads the questions off the PDF and quizzes you on them one at a time.
            </p>
          )}
        </div>
      )}

      {error && <ErrorNote>{error}</ErrorNote>}

      {rows !== null && (
        <>
          {notice && (
            <p
              role="status"
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {notice}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                What is it?
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="AMC 10A 2019"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Time limit (minutes)
              </span>
              <input
                type="number"
                min={1}
                max={MAX_TIME_LIMIT_MINUTES}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {scanned ? SOURCE_HEADING[answerSource] : "Answer key"}
              </span>
              <span className="flex flex-wrap items-baseline gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>
                  {filled}/{rows.length} answered
                  {flagged > 0 && ` · ${flagged} flagged`}
                  {uncertainAnswers > 0 && ` · ${uncertainAnswers} to check`}
                </span>
                {scanned && fileData && (
                  <button
                    type="button"
                    onClick={() => setShowPaper((v) => !v)}
                    className="rounded-md px-1.5 py-0.5 font-semibold text-brand-700 underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-brand-300 dark:hover:bg-slate-800"
                  >
                    {showPaper ? "Hide the original" : "Show the original"}
                  </button>
                )}
              </span>
            </div>

            {/* The PDF, beside the questions being checked. A question flagged
                "depends on a graph" is unresolvable without it — the student
                would otherwise have to open the file separately to answer the
                exact thing the review screen is asking them about. */}
            {scanned && showPaper && fileData && (
              <object
                data={`data:application/pdf;base64,${fileData}`}
                type="application/pdf"
                className="mb-3 h-[60vh] w-full rounded-lg border border-slate-200 dark:border-slate-700"
                aria-label="The uploaded paper"
              >
                <p className="p-4 text-sm text-slate-700 dark:text-slate-300">
                  Your browser can&rsquo;t show the PDF inline.
                </p>
              </object>
            )}

            <ul className="space-y-2">
              {rows.map((row, i) => (
                <li
                  key={i}
                  className={
                    row.confidence === "low"
                      ? "rounded-lg border border-amber-300 bg-amber-50/60 p-3 dark:border-amber-800 dark:bg-amber-950/40"
                      : "rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  }
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-2 w-5 shrink-0 text-right text-xs tabular-nums text-slate-600 dark:text-slate-400">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      {scanned && (
                        <>
                          {row.confidence === "low" && (
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone="warning">Check this one</Badge>
                              {row.note && (
                                <span className="text-xs text-amber-800 dark:text-amber-300">
                                  {row.note}
                                </span>
                              )}
                            </div>
                          )}
                          <textarea
                            value={row.text}
                            onChange={(e) =>
                              setRows((prev) =>
                                prev!.map((r, j) => (j === i ? { ...r, text: e.target.value } : r))
                              )
                            }
                            // Sized to the question rather than fixed at 2. A
                            // clipped box scrolled the first line out of view,
                            // so the thing the student is being asked to check
                            // was the thing they could not see.
                            rows={Math.min(8, Math.max(2, Math.ceil(row.text.length / 72)))}
                            aria-label={`Question ${i + 1} text`}
                            className={`${inputClass} resize-y leading-relaxed`}
                          />
                          {row.choices.length > 0 && (
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {row.choices.map((c, k) => (
                                <span key={k} className="mr-3">
                                  <span className="font-semibold">
                                    {String.fromCharCode(65 + k)}
                                  </span>{" "}
                                  {c}
                                </span>
                              ))}
                            </p>
                          )}
                        </>
                      )}
                      {/* No answer input when there is nothing to confirm.
                          The whole point of marking later is that the student
                          does not see the answers to the questions they are
                          about to be tested on. */}
                      {answerSource !== "NONE" && (
                      <AnswerField
                        row={row}
                        index={i}
                        source={answerSource}
                        onChange={(value) =>
                          setRows((prev) =>
                            prev!.map((r, j) =>
                              j === i
                                ? // Editing an answer makes it the student's, so
                                  // it stops claiming a confidence that was never
                                  // about their value.
                                  {
                                    ...r,
                                    answer: value,
                                    answerConfidence: undefined,
                                    answerNote: undefined,
                                  }
                                : r
                            )
                          )
                        }
                      />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              {answerSource === "SOLVED"
                ? "Change any answer you disagree with — yours wins. "
                : ""}
              Letters for multiple choice, numbers otherwise. Marked by value, so{" "}
              <code>1/2</code> and <code>0.5</code> both count.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save paper"}
            </Button>
            {scanned && (
              <Button
                variant="ghost"
                onClick={() => enterByHand(rows.length)}
                disabled={pending}
              >
                Discard the scan
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
