import "server-only";
import * as z from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAiClient, PDF_TYPE } from "@/lib/ai";

/**
 * Reads an uploaded past paper: pulls out the questions, and the answer key if
 * the PDF contains one.
 *
 * This reverses the original design, which never read the PDF at all. The
 * reason for that decision hasn't gone away — a misread question is worse than
 * no question, because a student who loses ten minutes to a mangled problem
 * learns nothing and stops trusting the rest of the paper. So the risk is
 * handled rather than avoided: nothing extracted here reaches a sitting until
 * the student has seen it on a review screen and had the chance to fix it.
 * Extraction is a first draft, not an authority.
 *
 * Two things follow from that, and both are load-bearing:
 *
 *   - `confidence` is per question, and the review screen sorts the doubtful
 *     ones to the top. A flat list of 25 extracted questions invites a student
 *     to skim and accept; a list that says "I'm unsure about #14" gets #14
 *     looked at.
 *   - A paper with no answer key in it is the normal case, not a failure.
 *     Official papers are usually published question-only. When no answers are
 *     found the student is told so and types the key themselves — the same
 *     manual path that existed before this feature.
 */

/** Opus for extraction, not the chat model.
 *
 * Reading a scanned contest paper — multi-column layouts, diagrams, answer
 * keys printed sideways on the last page — is materially harder than answering
 * a chat question, and an error here is silent: it becomes a wrong question a
 * student sits in good faith. Overridable so the model can be changed without
 * a deploy. */
const EXTRACT_MODEL = process.env.ANTHROPIC_EXTRACT_MODEL || "claude-opus-5";

/** Generous because a 40-question paper with choices is a lot of JSON, and a
 * truncated extraction is indistinguishable from a paper that ends early.
 * Paired with streaming below, so the request cannot hit an HTTP timeout. */
const MAX_TOKENS = 32_000;

/** Left at the model's own default. Measured across low/medium/high on a real
 * paper, transcription time barely moved (5.7s / 7.0s / 6.1s) and all three
 * read every question correctly — so there is nothing to win here and a
 * misread question to lose. On an image-based PDF the cost is reading the
 * pages, which effort does not reduce. Tunable by env for experiments. */
const EXTRACT_EFFORT = process.env.ANTHROPIC_EXTRACT_EFFORT as
  | "low" | "medium" | "high" | "xhigh" | "max" | undefined;

const ExtractedQuestion = z.object({
  number: z.number().describe("The question number as printed on the paper."),
  question: z.string().describe("The full question text, verbatim."),
  choices: z
    .array(z.string())
    .describe(
      "Multiple-choice options in order, without their letters. Empty array for a short-answer question."
    ),
  answer: z
    .string()
    .describe(
      "The answer, if the paper states it anywhere. A letter for multiple choice, otherwise the value. Empty string if the paper does not give it."
    ),
  confidence: z
    .enum(["high", "low"])
    .describe(
      "low when the text was unclear, a diagram carried information words cannot, or the answer was inferred rather than read."
    ),
  note: z
    .string()
    .describe(
      "When confidence is low, one short sentence on what is uncertain. Empty string otherwise."
    ),
});

const ExtractedPaper = z.object({
  title: z.string().describe("The paper's name as printed, e.g. '2019 AMC 10A'. Empty if unclear."),
  timeLimitMinutes: z
    .number()
    .describe("The time limit printed on the paper, in minutes. 0 if not stated."),
  questions: z.array(ExtractedQuestion),
});

export type ExtractedPaper = z.infer<typeof ExtractedPaper>;
export type ExtractedQuestion = z.infer<typeof ExtractedQuestion>;

const SYSTEM = `You transcribe competition maths papers into structured data. You are a transcriber, not a solver.

The single rule that matters: transcribe what is on the page, never what you think should be on it.

- Copy question text verbatim. Do not paraphrase, shorten, correct spelling, or fix what looks like a typo — a "mistake" is often the actual question.
- Never solve a question. The answer field is only for an answer the paper itself states, in an answer key, a solutions section, or alongside the question. If the paper does not give the answer, leave it empty. A confident guess is the worst possible output here, because it will be marked as correct or incorrect against a student's real work.
- Many papers have no answer key at all. That is normal and expected. Return the questions with empty answers rather than inventing any.
- Mark confidence "low" whenever you are unsure: text you could not read cleanly, a question that depends on a diagram or figure you cannot convey in words, an answer key whose alignment to question numbers was ambiguous, or anything you had to infer. Under-reporting confidence is far more damaging than over-reporting it — a student can dismiss a flagged question in a second, but cannot detect a silently wrong one.
- For a question that needs a figure you cannot reproduce, still transcribe the text, set confidence "low", and say in the note that it depends on a diagram.
- Transcribe maths as readable plain text: x^2, sqrt(5), 3/4, pi. No LaTeX.
- Include every question on the paper, in printed order. Do not skip, merge, or renumber.
- If the file is not a maths paper at all, return an empty questions array.`;

export type ExtractionResult =
  | { ok: true; paper: ExtractedPaper }
  | { ok: false; error: string };

/**
 * Sends the PDF to Claude and gets back structured questions.
 *
 * Streamed because a long paper produces a lot of JSON and a non-streaming
 * request at this `max_tokens` risks an HTTP timeout — the failure would look
 * like a broken upload rather than a slow one.
 */
export async function extractPaper(
  fileDataBase64: string,
  opts: { effort?: "low" | "medium" | "high" | "xhigh" | "max" } = {}
): Promise<ExtractionResult> {
  try {
    const stream = getAiClient().messages.stream({
      model: EXTRACT_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      output_config: {
        ...(opts.effort ?? EXTRACT_EFFORT ? { effort: opts.effort ?? EXTRACT_EFFORT } : {}),
        format: zodOutputFormat(ExtractedPaper),
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: PDF_TYPE, data: fileDataBase64 },
            },
            {
              type: "text",
              text: "Transcribe every question on this paper. Include the answers only if the paper states them.",
            },
          ],
        },
      ],
    });

    const message = await stream.finalMessage();

    // A refusal or a token cap both produce a message with no usable JSON, and
    // they need different things said to the student.
    if (message.stop_reason === "refusal") {
      return { ok: false, error: "That file couldn't be read. Enter the paper by hand instead." };
    }
    if (message.stop_reason === "max_tokens") {
      return {
        ok: false,
        error: "That paper is longer than the scanner can handle. Try splitting it, or enter it by hand.",
      };
    }

    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return { ok: false, error: "Nothing came back from the scan. Try again, or enter it by hand." };
    }

    const parsed = ExtractedPaper.safeParse(JSON.parse(text.text));
    if (!parsed.success) {
      return { ok: false, error: "The scan came back in an unexpected shape. Enter it by hand instead." };
    }

    return { ok: true, paper: normalise(parsed.data) };
  } catch (err) {
    console.error("extractPaper failed:", err);
    return { ok: false, error: "Couldn't scan that paper. You can still enter it by hand." };
  }
}

/**
 * Tidies the model's output into something the rest of the app can rely on.
 *
 * Renumbering to 1..n is deliberate: the paper's own numbering may start at 0,
 * skip, or restart per section, and every downstream index — the answer key,
 * the answer sheet, the score breakdown — assumes position equals question.
 * The printed number is preserved in the question text by the transcription
 * itself, so nothing is lost to the student.
 */
function normalise(paper: ExtractedPaper): ExtractedPaper {
  return {
    title: paper.title.trim(),
    timeLimitMinutes:
      Number.isFinite(paper.timeLimitMinutes) && paper.timeLimitMinutes > 0
        ? Math.min(300, Math.round(paper.timeLimitMinutes))
        : 0,
    questions: paper.questions
      .filter((q) => q.question.trim().length > 0)
      .map((q, i) => ({
        number: i + 1,
        question: q.question.trim(),
        choices: q.choices.map((c) => c.trim()).filter(Boolean),
        answer: q.answer.trim(),
        confidence: q.confidence === "low" ? ("low" as const) : ("high" as const),
        note: q.note.trim(),
      })),
  };
}

/** How much of the extraction a student should look at before trusting it. */
export function extractionSummary(paper: ExtractedPaper) {
  const withAnswers = paper.questions.filter((q) => q.answer.length > 0).length;
  const lowConfidence = paper.questions.filter((q) => q.confidence === "low").length;
  return {
    total: paper.questions.length,
    withAnswers,
    lowConfidence,
    /** True when the paper is question-only — the common case for official
     * papers, and the point at which the student supplies the key themselves. */
    needsManualKey: paper.questions.length > 0 && withAnswers === 0,
  };
}
