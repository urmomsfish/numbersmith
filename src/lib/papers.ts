import { answersMatch } from "@/lib/engine/answer-format";

/**
 * The rules of a past paper: what counts as a valid one, how answers are
 * marked, and when the clock has run out.
 *
 * Pure, and deliberately *not* behind `server-only`. The upload form needs the
 * size and count limits to warn before a student waits on a multi-megabyte
 * upload that will be refused, and the sitting screen needs the result type —
 * so a client component imports this. When these lived in
 * `src/lib/engine/papers.ts` next to the Prisma calls, that import dragged the
 * entire Prisma client into the browser bundle and the build failed. The
 * database half stays in the engine module; the rules live here, where both
 * sides can reach them.
 *
 * A paper can be sat two ways, and both are supported:
 *
 *   - **Scanned** — the PDF is read on upload (see `engine/paper-extract.ts`),
 *     and the student is quizzed one question at a time.
 *   - **By hand** — the student types a key and sits the paper with the PDF on
 *     screen. This was the original and only mode; it remains the fallback for
 *     a file that cannot be read, and the normal path for a question-only paper
 *     whose answers the student has to supply anyway.
 *
 * Reading the PDF was deliberately avoided at first: a misread question is
 * worse than no question, because a student who loses ten minutes to a mangled
 * problem learns nothing and stops trusting the rest of the paper. That risk is
 * now managed rather than dodged — nothing extracted reaches a sitting until
 * the student has reviewed it, and low-confidence questions are flagged all the
 * way through to the answer screen.
 *
 * Marking is identical either way, so a paper sat as a quiz and the same paper
 * sat with the PDF on screen produce comparable scores.
 */

/** Ceiling on the stored PDF, in base64 characters.
 *
 * Matches the Smith AI attachment limit for the same reason: `bodySizeLimit`
 * is 6 MB, and leaving headroom under it means this check fires with a readable
 * message rather than the framework rejecting the request with no error text.
 * 4 MB of base64 is about 3 MB of file, which comfortably holds a scanned
 * 25-question paper. */
export const MAX_PAPER_BASE64 = 4 * 1024 * 1024;

export const MAX_QUESTIONS = 60;
export const MAX_TIME_LIMIT_MINUTES = 300;
export const MAX_PAPER_TITLE = 100;

/** Scans one account may run per day.
 *
 * This is an abuse backstop, not a product tier. A scan sends a whole PDF to
 * Opus, so it costs orders of magnitude more than anything else a student can
 * click, and `scanPaperAction` stores nothing — without a cap the same file can
 * be re-scanned forever. Ten is well clear of real use (a student works through
 * one or two papers in a sitting) while bounding what a single account can
 * spend in a day.
 *
 * It applies to every account, Pro included, deliberately: the Pro gate is
 * inert while payments are off (`isProUser` short-circuits to true), so a cap
 * keyed to Pro status would be inert too — and this is the control that has to
 * work today. */
export const MAX_SCANS_PER_DAY = 10;

/** Whether today's scans have used the cap up. Takes the count rather than a
 * user id so the rule stays testable without a database. */
export function hasHitScanCap(scansToday: number): boolean {
  return scansToday >= MAX_SCANS_PER_DAY;
}

/** Base64 only — no `data:` prefix, matching how AiChatMessage stores
 * attachments. Validated rather than trusted because this string is later
 * served back with a PDF content type. */
const BASE64_ONLY = /^[A-Za-z0-9+/]+=*$/;

export type PaperInput = {
  title: string;
  fileData: string;
  questionCount: number;
  timeLimitMinutes: number;
  answerKey: string[];
};

export type PaperValidation = { ok: true; value: PaperInput } | { ok: false; error: string };

/**
 * One question read out of the PDF.
 *
 * `confidence` and `note` survive into storage rather than being dropped after
 * the review screen: a student who accepted a flagged question in a hurry
 * should still see the flag when they meet it in a sitting, and when the mark
 * looks wrong afterwards the flag is the explanation.
 */
export type PaperQuestion = {
  text: string;
  choices: string[];
  confidence: "high" | "low";
  note: string;
};

export function parseQuestions(json: string): PaperQuestion[] {
  try {
    const v = JSON.parse(json);
    if (!Array.isArray(v)) return [];
    return v
      .filter((q): q is Record<string, unknown> => !!q && typeof q === "object")
      .map((q) => ({
        text: typeof q.text === "string" ? q.text : "",
        choices: Array.isArray(q.choices)
          ? q.choices.filter((c): c is string => typeof c === "string")
          : [],
        confidence: q.confidence === "low" ? ("low" as const) : ("high" as const),
        note: typeof q.note === "string" ? q.note : "",
      }))
      .filter((q) => q.text.length > 0);
  } catch {
    return [];
  }
}

/** Whether this paper can be sat as a quiz rather than with the PDF on screen.
 * A paper is quizzable only when there is a question for every slot in the key
 * — a partial scan would silently ask fewer questions than it marks. */
export function isQuizzable(questions: PaperQuestion[], questionCount: number): boolean {
  return questions.length > 0 && questions.length === questionCount;
}

export type PaperResult = {
  correctCount: number;
  questionCount: number;
  correct: boolean[];
  key: string[];
  answers: string[];
  timedOut: boolean;
};

/**
 * Checks everything about a submitted paper before it reaches the database.
 *
 * Separated from the action so it can be driven directly by `verify:papers`
 * with the malformed inputs a form does not easily produce. The form's
 * `required`, `min` and `max` attributes are a convenience for the person
 * typing and not a check at all — the action behind them is a public endpoint.
 */
export function validatePaper(input: {
  title: string;
  fileData: string;
  questionCount: number;
  timeLimitMinutes: number;
  answerKey: string[];
}): PaperValidation {
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Give the paper a name." };
  if (title.length > MAX_PAPER_TITLE) {
    return { ok: false, error: `Keep the name under ${MAX_PAPER_TITLE} characters.` };
  }

  if (!input.fileData) return { ok: false, error: "Choose a PDF to upload." };
  if (!BASE64_ONLY.test(input.fileData)) {
    return { ok: false, error: "That file didn't upload correctly." };
  }
  if (input.fileData.length > MAX_PAPER_BASE64) {
    return { ok: false, error: "That PDF is too large — 3 MB is the limit." };
  }

  const count = Math.round(input.questionCount);
  if (!Number.isFinite(count) || count < 1 || count > MAX_QUESTIONS) {
    return { ok: false, error: `Pick a question count between 1 and ${MAX_QUESTIONS}.` };
  }

  const minutes = Math.round(input.timeLimitMinutes);
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > MAX_TIME_LIMIT_MINUTES) {
    return { ok: false, error: `Pick a time limit between 1 and ${MAX_TIME_LIMIT_MINUTES} minutes.` };
  }

  // The key must line up with the count, or every answer after the mismatch is
  // scored against the wrong question — silently, and the total still looks
  // like a plausible mark.
  const key = input.answerKey.map((a) => a.trim());
  if (key.length !== count) {
    return {
      ok: false,
      error: `The key has ${key.length} answers but the paper has ${count} questions.`,
    };
  }
  if (key.some((a) => !a)) {
    const missing = key.map((a, i) => (a ? null : i + 1)).filter(Boolean);
    return {
      ok: false,
      error: `Fill in the answer for question ${missing.slice(0, 3).join(", ")}${
        missing.length > 3 ? "…" : ""
      }.`,
    };
  }

  return {
    ok: true,
    value: {
      title,
      fileData: input.fileData,
      questionCount: count,
      timeLimitMinutes: minutes,
      answerKey: key,
    },
  };
}

export function parseJsonArray(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : "")) : [];
  } catch {
    return [];
  }
}

/**
 * Marks a set of answers against a key.
 *
 * Uses the same `answersMatch` as the problem bank, so a student who writes
 * `1/2` where the key says `0.5`, or `7 sqrt 11` for `7√11`, is marked right.
 * They got the question right, and a past paper is for finding out whether you
 * can do the maths, not whether you can guess the transcription. Blank answers
 * are wrong, and a short or missing answers array never crashes.
 */
export function scoreAnswers(
  key: string[],
  answers: string[]
): { correct: boolean[]; correctCount: number } {
  const correct = key.map((expected, i) => {
    const given = (answers[i] ?? "").trim();
    return given.length > 0 && answersMatch(given, expected);
  });
  return { correct, correctCount: correct.filter(Boolean).length };
}

/** Seconds left on an attempt, floored at zero.
 *
 * The clock is authoritative on the server: the countdown a student watches is
 * a convenience, and this — recomputed from the attempt's `startedAt` — is the
 * only thing stopping a paper being "finished" an hour late. */
export function secondsRemaining(
  startedAt: Date,
  timeLimitMinutes: number,
  now: number = Date.now()
): number {
  const elapsed = (now - startedAt.getTime()) / 1000;
  return Math.max(0, Math.round(timeLimitMinutes * 60 - elapsed));
}

/** A little slack so a student who submitted in time is not marked late by a
 * slow round trip. Same reasoning as the countdown round's grace. */
const LATENESS_GRACE_SECONDS = 10;

export function isPastDeadline(
  startedAt: Date,
  timeLimitMinutes: number,
  now: number = Date.now()
): boolean {
  const elapsed = (now - startedAt.getTime()) / 1000;
  return elapsed > timeLimitMinutes * 60 + LATENESS_GRACE_SECONDS;
}
