"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadPaperAction } from "@/lib/actions/paper-actions";
import { MAX_PAPER_BASE64, MAX_QUESTIONS, MAX_TIME_LIMIT_MINUTES } from "@/lib/papers";

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

export function UploadPaperForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(25);
  const [key, setKey] = useState<string[]>(() => Array(25).fill(""));

  /** Resizing preserves what has already been typed. A student who enters
   * twenty answers and then corrects the count from 25 to 30 should not lose
   * the twenty. */
  function resize(next: number) {
    const n = Math.min(MAX_QUESTIONS, Math.max(1, Math.round(next) || 1));
    setCount(n);
    setKey((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ""));
  }

  const filled = key.filter((a) => a.trim()).length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setError(null);
        start(async () => {
          if (!file) return setError("Choose a PDF to upload.");
          if (file.type !== "application/pdf") return setError("That needs to be a PDF.");

          let fileData: string;
          try {
            fileData = await readAsBase64(file);
          } catch {
            return setError("Couldn't read that file.");
          }
          // Checked here as well as on the server so the student finds out
          // before waiting on a multi-megabyte upload that will be refused.
          if (fileData.length > MAX_PAPER_BASE64) {
            return setError("That PDF is too large — 3 MB is the limit.");
          }

          const data = new FormData(form);
          const result = await uploadPaperAction({
            title: String(data.get("title") ?? ""),
            fileData,
            questionCount: count,
            timeLimitMinutes: Number(data.get("timeLimitMinutes")),
            answerKey: key,
          });
          if (result.ok) router.push(`/papers/${result.paperId}`);
          else setError(result.error);
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            What is it?
          </span>
          <input name="title" required className={inputClass} placeholder="AMC 10A 2019" />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            The PDF
          </span>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-100"
          />
          <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
            Stays private to your account. We never read it — you supply the key
            below.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Questions
          </span>
          <input
            type="number"
            min={1}
            max={MAX_QUESTIONS}
            value={count}
            onChange={(e) => resize(Number(e.target.value))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Time limit (minutes)
          </span>
          <input
            name="timeLimitMinutes"
            type="number"
            min={1}
            max={MAX_TIME_LIMIT_MINUTES}
            defaultValue={75}
            required
            className={inputClass}
          />
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Answer key
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {filled}/{count} filled
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
          {key.map((value, i) => (
            <label key={i} className="flex items-center gap-1.5">
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {i + 1}
              </span>
              <input
                value={value}
                onChange={(e) =>
                  setKey((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                }
                aria-label={`Answer to question ${i + 1}`}
                className="w-full rounded-md border border-slate-300 bg-background px-2 py-1 text-center text-sm uppercase text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
              />
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Letters for multiple choice, numbers otherwise. Marked by value, so{" "}
          <code>1/2</code> and <code>0.5</code> both count.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : "Save paper"}
      </Button>
      {error && (
        <p
          role="status"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600 dark:bg-red-950 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </form>
  );
}
