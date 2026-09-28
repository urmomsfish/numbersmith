"use client";

import { useState, useTransition } from "react";
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
  const [notice, setNotice] = useState<string | null>(null);

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
    start(async () => {
      const data = await withFileData();
      if (!data) return;

      const result = await scanPaperAction({ fileData: data });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setRows(
        result.paper.questions.map((q) => ({
          text: q.question,
          choices: q.choices,
          confidence: q.confidence,
          note: q.note,
          answer: q.answer,
        }))
      );
      setScanned(true);
      if (!title && result.paper.title) setTitle(result.paper.title);
      if (result.paper.timeLimitMinutes > 0) setTimeLimit(result.paper.timeLimitMinutes);

      const { total, withAnswers, lowConfidence, needsManualKey } = result.summary;
      setNotice(
        needsManualKey
          ? `Read ${total} questions. This paper doesn't include an answer key, so fill the answers in below.`
          : `Read ${total} questions and ${withAnswers} answers.` +
              (lowConfidence > 0 ? ` ${lowConfidence} need a look — they're marked below.` : "")
      );
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
            }))
          : [],
      });
      if (result.ok) router.push(`/papers/${result.paperId}`);
      else setError(result.error);
    });
  }

  const filled = rows?.filter((r) => r.answer.trim()).length ?? 0;
  const flagged = rows?.filter((r) => r.confidence === "low").length ?? 0;

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
            ? " Scanning reads the questions so you can be quizzed on them — you check what it read before anything is saved."
            : " You'll type the answer key and sit the paper with the PDF on screen."}
        </span>
      </label>

      {file && rows === null && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {canScan && (
              <Button onClick={scan} disabled={pending}>
                {pending ? "Reading the paper…" : "Scan this paper"}
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
                {scanned ? "Check what was read" : "Answer key"}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {filled}/{rows.length} answered
                {flagged > 0 && ` · ${flagged} flagged`}
              </span>
            </div>

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
                            rows={2}
                            aria-label={`Question ${i + 1} text`}
                            className={`${inputClass} resize-y`}
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
                      <label className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Answer</span>
                        <input
                          value={row.answer}
                          onChange={(e) =>
                            setRows((prev) =>
                              prev!.map((r, j) => (j === i ? { ...r, answer: e.target.value } : r))
                            )
                          }
                          aria-label={`Answer to question ${i + 1}`}
                          className="w-28 rounded-md border border-slate-300 bg-background px-2 py-1 text-center text-sm uppercase text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
                        />
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
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
