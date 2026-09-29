import "server-only";
import * as z from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAiClient } from "@/lib/ai";
import type { ExtractedQuestion } from "@/lib/engine/paper-extract";

/**
 * Works out the answers to a paper that does not print its own key.
 *
 * Most official papers are published question-only, and making the student type
 * 25 answers they do not have defeats the point of uploading the paper at all.
 * So when the PDF carries no key, NumberSmith produces one.
 *
 * This is a *separate API call* from extraction, and that separation is the
 * whole design. Transcription's one rule is "copy what is on the page, never
 * what you think should be on it" — a rule proved out against a paper whose
 * printed key contradicted its own arithmetic, where the transcriber correctly
 * copied the wrong answer. Asking the same call to also solve would put those
 * two instincts in direct conflict on every question. Here the job is solving
 * and nothing else, and it never sees the PDF — only the already-transcribed
 * text, so it cannot quietly revise a question into one it prefers.
 *
 * A solved key is weaker evidence than a printed one, and the app says so
 * everywhere it is used. `confidence` here is the student's handle on that: a
 * disagreement on a `low` answer is far more likely to be NumberSmith's fault
 * than theirs, and the results screen tells them so rather than leaving them to
 * conclude they were wrong.
 */

/** Opus, and not overridable down: this is the one call whose errors are
 * invisible. A misread question at least looks garbled on screen — a wrongly
 * solved one looks perfectly reasonable and quietly marks a correct student
 * wrong. */
const SOLVE_MODEL = process.env.ANTHROPIC_SOLVE_MODEL || "claude-opus-5";

/** Room to actually work. Solving 25 contest problems needs far more thinking
 * than transcribing them, and a truncated solve is indistinguishable from a
 * paper that ends early. */
const MAX_TOKENS = 64_000;

/** How hard to think per question. Left at the model's own default.
 *
 * Measured: dropping to `low` saves about 15% of solve time on a 25-question
 * paper. That is not worth anything at all here — these answers become the key
 * every student attempt is marked against, and a wrong one is invisible to the
 * person it penalises. Splitting the work up (below) bought 3x with no such
 * tradeoff. Tunable by env for experiments, unset in normal use. */
const SOLVE_EFFORT = process.env.ANTHROPIC_SOLVE_EFFORT as
  | "low" | "medium" | "high" | "xhigh" | "max" | undefined;

const SolvedAnswer = z.object({
  number: z.number().describe("The question number being answered."),
  answer: z
    .string()
    .describe(
      "The answer alone. A single capital letter for multiple choice; otherwise the value in simplest form, as a student would write it on the answer line. No working, no units unless the question asks for them. Empty string if the question cannot be answered from what you were given — never a sentence saying so, since this field is used verbatim as the marking key."
    ),
  confidence: z
    .enum(["high", "low"])
    .describe(
      "high only when you are confident this is right. low when the question was ambiguous, depended on a figure you could not see, was cut off, or when you could not fully verify the result."
    ),
  note: z
    .string()
    .describe("When confidence is low, one short sentence on the doubt. Empty string otherwise."),
});

const SolvedPaper = z.object({ answers: z.array(SolvedAnswer) });

const SYSTEM = `You are solving a competition mathematics paper so a student's own attempt can be marked against your answers.

Your answers become the marking key. A wrong answer here tells a student they got a question wrong when they got it right, and they have no way to tell the difference. That is the failure to avoid above all others — far worse than admitting doubt.

- Work each question out properly before answering. Check the result against the question as actually written, not as you first read it.
- For multiple choice, give the single capital letter of the correct option. If your computed value does not match any option, re-check your work; if it still does not match, pick the closest option and set confidence "low" with a note saying so.
- For anything else, give the value alone, in the form the paper asks for: lowest terms for fractions, exact form where the question implies it, and the integer alone for AIME-style answers.
- Some questions cannot be solved from the text alone — most often ones depending on a figure that was not transcribed, or text that was cut off. When that happens, return an EMPTY answer string, set confidence "low", and say in the note what was missing. Do not write "cannot be determined", "unknown", or any other sentence into the answer field: that field is used verbatim as the marking key, so prose there marks every student wrong. An empty answer is understood and handled; a sentence is not.
- Where you can make a genuine best attempt despite missing information, give the actual answer value and set confidence "low" with a note. Reserve the empty answer for questions where any value would be pure invention.
- A question that is garbled or cut off gets confidence "low" and a note. Do not invent the missing half.
- Set confidence "high" only where you would stake the student's score on it. Over-reporting doubt costs a student one glance at a flagged answer; under-reporting it costs them trust in every mark on the paper.
- Answer every question you are given, in order, exactly once.`;

export type SolveResult =
  | { ok: true; answers: SolvedAnswerOut[] }
  | { ok: false; error: string };

export type SolvedAnswerOut = {
  answer: string;
  confidence: "high" | "low";
  note: string;
};

/**
 * Solves the transcribed questions, returning one answer per question in the
 * order given.
 *
 * The returned array is always exactly `questions.length` long. Downstream code
 * — marking, the answer key, the score breakdown — indexes answers by position,
 * so a short or reordered array would silently misalign the whole key and mark
 * a paper against the wrong answers. Anything the model fails to return becomes
 * an explicit blank flagged `low` rather than a shifted neighbour.
 */
export async function solvePaper(
  questions: ExtractedQuestion[],
  opts: { effort?: "low" | "medium" | "high" | "xhigh" | "max" } = {}
): Promise<SolveResult> {
  if (questions.length === 0) return { ok: true, answers: [] };
  if (questions.length <= BATCH_SIZE) return solveBatch(questions, opts);

  // Split and solve concurrently. Questions on a paper are independent, so
  // there is nothing to gain from making the model hold all 25 at once — and
  // measured on a 25-question paper this took the wait from 17s to 9s at the
  // same effort. Chunks stay in order and are concatenated in order, so the
  // positional alignment the whole key depends on is preserved.
  const batches: ExtractedQuestion[][] = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(batches.map((b) => solveBatch(b, opts)));

  // One failed batch must not discard the rest: a paper with 18 good answers
  // and 7 blanks flagged for the student beats an error and nothing.
  const answers: SolvedAnswerOut[] = [];
  let anyOk = false;
  results.forEach((r, i) => {
    if (r.ok) {
      anyOk = true;
      answers.push(...r.answers);
    } else {
      answers.push(
        ...batches[i].map(() => ({
          answer: "",
          confidence: "low" as const,
          note: "This part of the paper couldn't be worked out — fill it in yourself.",
        }))
      );
    }
  });

  if (!anyOk) return { ok: false, error: "Couldn't work out the answers for that paper." };
  return { ok: true, answers };
}

/** Questions per concurrent request. Small enough that a 25-question paper
 * fans out to four, large enough that per-call overhead does not dominate. */
const BATCH_SIZE = 7;

async function solveBatch(
  questions: ExtractedQuestion[],
  opts: { effort?: "low" | "medium" | "high" | "xhigh" | "max" }
): Promise<SolveResult> {
  const effort = opts.effort ?? SOLVE_EFFORT;

  const prompt = questions
    .map((q) => {
      const choices = q.choices.length
        ? "\n" + q.choices.map((c, i) => `(${String.fromCharCode(65 + i)}) ${c}`).join("  ")
        : "";
      return `${q.number}. ${q.question}${choices}`;
    })
    .join("\n\n");

  try {
    const stream = getAiClient().messages.stream({
      model: SOLVE_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      output_config: { ...(effort ? { effort } : {}), format: zodOutputFormat(SolvedPaper) },
      messages: [
        {
          role: "user",
          content: `Solve every question on this paper. There are ${questions.length}.\n\n${prompt}`,
        },
      ],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return { ok: false, error: "These questions couldn't be worked out automatically." };
    }
    if (message.stop_reason === "max_tokens") {
      return {
        ok: false,
        error: "That paper is too long to work out in one go. Try splitting it.",
      };
    }

    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return { ok: false, error: "Nothing came back from working out the answers." };
    }

    const parsed = SolvedPaper.safeParse(JSON.parse(text.text));
    if (!parsed.success) {
      return { ok: false, error: "The answers came back in an unexpected shape." };
    }

    return { ok: true, answers: align(parsed.data.answers, questions) };
  } catch (err) {
    console.error("solvePaper failed:", err);
    return { ok: false, error: "Couldn't work out the answers for that paper." };
  }
}

/**
 * Forces the model's answers into one-per-question, positionally.
 *
 * Matches on the printed question number where possible and falls back to
 * position, because the two only disagree when something has already gone
 * wrong. A question with no answer returned becomes a flagged blank — visible
 * to the student on the review screen, and impossible to mistake for a
 * confident answer, which is what a silently shifted array would produce.
 */
function align(
  answers: z.infer<typeof SolvedAnswer>[],
  questions: ExtractedQuestion[]
): SolvedAnswerOut[] {
  const byNumber = new Map<number, z.infer<typeof SolvedAnswer>>();
  for (const a of answers) if (!byNumber.has(a.number)) byNumber.set(a.number, a);

  return questions.map((q, i) => {
    const hit = byNumber.get(q.number) ?? answers[i];
    if (!hit) {
      return {
        answer: "",
        confidence: "low" as const,
        note: "No answer came back for this question — fill it in yourself.",
      };
    }
    const answer = asKeyEntry(hit.answer, q.choices.length);
    return {
      answer,
      confidence: hit.confidence === "low" || answer === "" ? ("low" as const) : ("high" as const),
      // When prose was dropped, keep the explanation visible — the student
      // still needs to know why the slot is blank.
      note: hit.note.trim() || (hit.answer.trim() && !answer ? hit.answer.trim() : ""),
    };
  });
}

/** Longest a real answer-line entry runs. A letter, an integer, a fraction, a
 * short exact form like `3*sqrt(2)/4` all fit comfortably; a sentence does
 * not. */
const MAX_KEY_ENTRY = 32;

/**
 * Keeps prose out of the marking key.
 *
 * The answer field is used verbatim to mark every student attempt, so
 * "Cannot be determined from the given information" as a key entry marks
 * everyone wrong against a sentence — worse than an empty slot, which the
 * review screen renders as something to fill in. The prompt asks for an empty
 * string in that case and complies in testing, but the cost of it slipping is
 * a silently broken paper, so the guarantee is enforced here rather than
 * merely requested.
 *
 * Deliberately a length check and not a phrase blocklist: "None of these" is a
 * legitimate answer on plenty of papers, and guessing at which sentences are
 * really answers is how you start rejecting real ones. That does mean a short
 * refusal like "Cannot be determined" can slip through the free-response path
 * — it is flagged `low` and shown on the review screen before anything is
 * saved, which is the real backstop here.
 *
 * Multiple choice gets a stronger guarantee, because there the set of valid
 * answers is known exactly: anything that is not a letter naming one of the
 * printed options cannot be a key, whatever it says.
 */
function asKeyEntry(raw: string, choiceCount: number): string {
  const trimmed = raw.trim();

  if (choiceCount > 0) {
    const letter = trimmed.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return "";
    const index = letter.charCodeAt(0) - 65;
    // A letter past the last printed option marks every student wrong against
    // a choice the paper never offered.
    return index < choiceCount ? letter : "";
  }

  if (trimmed.length > MAX_KEY_ENTRY) return "";
  // A trailing sentence is prose even when it is short.
  if (/[.!?]\s*$/.test(trimmed) && /\s/.test(trimmed)) return "";
  return trimmed;
}
