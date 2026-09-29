import "server-only";
import * as z from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAiClient } from "@/lib/ai";
import type { PaperQuestion } from "@/lib/papers";

/**
 * Marks a sat paper and explains what went wrong.
 *
 * This replaces solving every question up front. Two reasons it is better that
 * way round, and the second is the point of the feature:
 *
 *   - Nothing is spent on a paper the student never sits, and the scan itself
 *     is only a transcription, so uploading is fast.
 *   - The explanation is written with the student's actual answer in hand. A
 *     key produced in advance can only ever say "the answer is 7"; here it can
 *     say which step turned their 9 into a 7. That is the difference between
 *     being marked and being taught, and it is the whole reason a student sits
 *     a past paper rather than reading the solutions.
 *
 * Correct answers cost nothing to explain, because they are not sent. Only
 * questions the student got wrong — or, on a paper with no printed key, the
 * ones that still need an answer at all — go to the model.
 */

const MARK_MODEL = process.env.ANTHROPIC_MARK_MODEL || "claude-opus-5";
const MAX_TOKENS = 32_000;

/** Questions per concurrent request. Explanations are long, so these batches
 * are smaller than the old solve batches. */
const BATCH_SIZE = 5;

const MarkedQuestion = z.object({
  number: z.number().describe("The question number being marked."),
  correctAnswer: z
    .string()
    .describe(
      "The correct answer alone — a single capital letter for multiple choice, otherwise the value in simplest form. Empty string only if the question cannot be answered from what you were given."
    ),
  studentWasRight: z
    .boolean()
    .describe(
      "True when the student's answer means the same as the correct answer, even if written differently (1/2 and 0.5, x<2 or x>3 and (-inf,2)U(3,inf))."
    ),
  explanation: z
    .string()
    .describe(
      "Empty string when the student was right. Otherwise: what their answer suggests they did, then how to do the question, in a few short sentences. Address the student as 'you'. Plain text, no LaTeX."
    ),
});

const MarkedPaper = z.object({ marks: z.array(MarkedQuestion) });

const SYSTEM = `You are marking a student's attempt at a maths paper and explaining the questions they got wrong.

What matters most: the explanation should teach this student this question. They have already attempted it, so they do not need encouragement or a restatement of the problem — they need to know where their reasoning went wrong and how the question is actually done.

For each question you are given:
- Work out the correct answer yourself, carefully, before looking at what the student wrote.
- Decide whether the student's answer means the same thing as the correct one. Different notation for the same value is correct: 1/2 and 0.5, 0.25 and 1/4, "x < 2 or x > 3" and "(-inf, 2) U (3, inf)", "x = 2, -2" and "±2". Do not mark a student wrong for formatting.
- If they were right, set studentWasRight true and leave the explanation empty. Do not explain a correct answer.
- If they were wrong, diagnose their specific mistake where you can see one. A student who answered 7 when the answer is 9 usually did something identifiable — dropped a sign, forgot a case, solved for the wrong variable, inverted an inequality when multiplying by a negative. Name that, then show the correct route in a few short steps.
- If you cannot tell what they did — the answer is blank, or too far off to diagnose — skip the diagnosis and just teach the question directly. Do not invent a mistake they might not have made.
- If the student left it blank, explain how to do the question from the start.

Style: a few short sentences, or short numbered steps for a multi-step method. Address the student as "you". Plain readable maths, not LaTeX: x^2, sqrt(5), 3/4, pi. No preamble, no praise, no sign-off.

If a question cannot be answered from the text you were given — it depended on a figure that was not transcribed, or it was cut off — return an empty correctAnswer, set studentWasRight false, and say in the explanation that the question needs the original paper to answer. Never guess a correct answer in order to have one.`;

export type Mark = {
  /** The answer NumberSmith worked out; `""` when it could not. */
  correctAnswer: string;
  correct: boolean;
  /** Worked explanation, or `""` when there is nothing to explain. */
  explanation: string;
};

export type MarkResult = { ok: true; marks: Mark[] } | { ok: false; error: string };

/** One question paired with what the student put, and the printed answer if
 * the paper had one. */
export type ToMark = {
  index: number;
  question: PaperQuestion;
  studentAnswer: string;
  /** From the paper's own key, when it printed one. Ground truth — the model
   * is told it rather than asked to rediscover it. */
  printedAnswer?: string;
};

/**
 * Marks the given questions, returning one `Mark` per input in the same order.
 *
 * The array is always exactly as long as the input. Callers splice these back
 * into a full-paper array by `index`, so a short or reordered result would
 * misalign a student's score against the wrong questions.
 */
export async function markQuestions(items: ToMark[]): Promise<MarkResult> {
  if (items.length === 0) return { ok: true, marks: [] };
  if (items.length <= BATCH_SIZE) return markBatch(items);

  const batches: ToMark[][] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(batches.map(markBatch));

  // A failed batch loses its explanations, not the whole paper's marking.
  const marks: Mark[] = [];
  let anyOk = false;
  results.forEach((r, i) => {
    if (r.ok) {
      anyOk = true;
      marks.push(...r.marks);
    } else {
      marks.push(...batches[i].map(() => unmarkable()));
    }
  });

  if (!anyOk) return { ok: false, error: "Couldn't mark that paper." };
  return { ok: true, marks };
}

function unmarkable(): Mark {
  return {
    correctAnswer: "",
    correct: false,
    explanation: "This one couldn't be marked automatically — check it against the original paper.",
  };
}

async function markBatch(items: ToMark[]): Promise<MarkResult> {
  const prompt = items
    .map((it) => {
      const q = it.question;
      const choices = q.choices.length
        ? "\n" + q.choices.map((c, i) => `(${String.fromCharCode(65 + i)}) ${c}`).join("  ")
        : "";
      const given = it.studentAnswer.trim();
      const printed = it.printedAnswer?.trim()
        ? `\nThe paper's own answer key gives: ${it.printedAnswer.trim()} — this is correct, use it.`
        : "";
      return `Question ${it.index + 1}. ${q.text}${choices}${printed}\nThe student answered: ${given === "" ? "(left blank)" : given}`;
    })
    .join("\n\n");

  try {
    const stream = getAiClient().messages.stream({
      model: MARK_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      output_config: { format: zodOutputFormat(MarkedPaper) },
      messages: [
        {
          role: "user",
          content: `Mark these ${items.length} questions and explain the ones the student got wrong.\n\n${prompt}`,
        },
      ],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return { ok: false, error: "These questions couldn't be marked automatically." };
    }
    if (message.stop_reason === "max_tokens") {
      return { ok: false, error: "That paper is too long to mark in one go." };
    }

    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return { ok: false, error: "Nothing came back from marking." };
    }

    const parsed = MarkedPaper.safeParse(JSON.parse(text.text));
    if (!parsed.success) return { ok: false, error: "Marking came back in an unexpected shape." };

    return { ok: true, marks: align(items, parsed.data.marks) };
  } catch (err) {
    console.error("markQuestions failed:", err);
    return { ok: false, error: "Couldn't mark that paper." };
  }
}

/**
 * Puts the model's marks back in the order they were asked for.
 *
 * Matched on the question number we sent rather than on array position: a
 * dropped or reordered entry would otherwise shift every mark after it onto
 * the wrong question, which is the one failure a student cannot detect —
 * they would see a confident explanation of a question they did not answer.
 */
function align(items: ToMark[], marks: z.infer<typeof MarkedQuestion>[]): Mark[] {
  const byNumber = new Map(marks.map((m) => [m.number, m]));
  return items.map((it) => {
    const m = byNumber.get(it.index + 1);
    if (!m) return unmarkable();
    return {
      correctAnswer: m.correctAnswer.trim(),
      correct: m.studentWasRight,
      explanation: m.explanation.trim(),
    };
  });
}
