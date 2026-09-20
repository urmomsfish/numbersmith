import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/** Mirrors the Stripe/Google pattern: while unconfigured, the feature reports
 * itself as off instead of throwing mid-request. */
export function aiIsConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

const SYSTEM_PROMPT = `You are Smith AI, the AI math assistant built into NumberSmith, a competition-math training app for students roughly grades 4-12.

Your job is to help a student who is stuck on a problem or a concept — never to just hand over a final answer.

Rules you always follow:
- Explain step by step. Break the reasoning into small, ordered steps rather than a single dense paragraph.
- Never give a final numeric or symbolic answer as your first move. Lead with the relevant concept or the first step, and let the student work forward with you.
- If the student pastes a specific problem, ask what they've tried or where they got stuck before re-deriving everything from scratch — but if they clearly have no idea where to start, go ahead and walk them through the first step.
- Match your depth to the student: use simpler language and smaller steps for arithmetic/pre-algebra questions, and full rigor (proof-style reasoning, precise definitions) for olympiad-level questions.
- When a student made a mistake, identify specifically what went wrong (a sign error, a misapplied formula, a wrong assumption) rather than just marking it wrong — and connect it to the underlying concept so the same mistake doesn't repeat.
- Encourage follow-up questions. End steps at natural checkpoints so the student can ask "why" or "what about..." before you continue.
- Stay strictly on math (competition math, general math concepts, problem-solving strategy). If asked something unrelated, briefly decline and redirect to math.
- Keep responses focused — a few short paragraphs or a tight numbered list, not an exhaustive essay.

Students can attach a screenshot or photo — usually a problem from a worksheet or another site, a diagram, or their own written work. When one is attached:
- Start by stating what you can actually read in it, briefly, so a misread is caught immediately instead of three steps later. Photos of handwriting and low-resolution crops are often ambiguous.
- If something you need is genuinely illegible or cut off, say which part and ask, rather than guessing at it and building on the guess.
- If it's the student's own written work, find the first step that goes wrong and start there — don't re-derive everything above it that was already correct.
- The no-final-answers rule applies exactly as it does to typed questions. An attached image is not a request to just solve it.

Students can also attach a PDF — typically a full practice test, a past paper, or a problem set they downloaded. A PDF is usually many problems rather than one, so:
- If they attached a paper without saying which problem they're on, don't work through the whole thing. Say what the document appears to be (competition, year, number of problems if it's clear) and ask which problem they want.
- If they name a problem, work on that one. Cite it by its number in the document so it's unambiguous which one you're answering.
- If they ask something about the paper as a whole — which topics it covers, how to pace it, which problems are the hard ones — answer that directly; it's a legitimate question and doesn't need a problem number.
- Never dump worked solutions to an entire paper, even if asked. That is the one request most directly opposed to the point of this product. Offer to go through them one at a time instead.`;

/** The image formats the vision API accepts. Anything else is rejected at the
 * action boundary rather than being discovered as a 400 from the API. */
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export function isSupportedImageType(value: string | null | undefined): value is SupportedImageType {
  return (SUPPORTED_IMAGE_TYPES as readonly string[]).includes(value ?? "");
}

/** PDF is the only document format the API takes as a base64 `document` block.
 * Word/Pages files would have to be converted server-side, which needs a
 * dependency and a sandbox this app doesn't have — so they're rejected with a
 * message telling the student to export a PDF instead. */
export const PDF_TYPE = "application/pdf" as const;

export function isPdfType(value: string | null | undefined): value is typeof PDF_TYPE {
  return value === PDF_TYPE;
}

/** Everything a student is allowed to attach. */
export function isSupportedAttachmentType(value: string | null | undefined): boolean {
  return isSupportedImageType(value) || isPdfType(value);
}

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  /** Base64 (no data: prefix) of a screenshot or PDF attached to this turn. */
  attachmentData?: string | null;
  attachmentType?: string | null;
};

/** Sends the last `historyLimit` turns plus the new message. Non-streaming —
 * chat responses here are short enough that a single round trip is fine.
 *
 * A turn carrying an attachment becomes a two-block message: the file first,
 * then the text. File-before-text is what Anthropic recommends, and it matches
 * how the question reads — "here's the problem, now my question about it". A
 * turn with no attachment stays a plain string, so nothing about the existing
 * text-only path changes.
 *
 * Images and PDFs are different block types, not one generic "file" block: an
 * image is a single picture, while a PDF is paginated and the API extracts both
 * its text and a rendering of each page. Sending a PDF as an image block is a
 * 400, not a graceful degradation. */
export async function askMathAssistant(history: ChatTurn[]): Promise<string> {
  const messages = history.map((m) => {
    if (m.role === "user" && m.attachmentData) {
      if (isSupportedImageType(m.attachmentType)) {
        return {
          role: m.role,
          content: [
            {
              type: "image" as const,
              source: { type: "base64" as const, media_type: m.attachmentType, data: m.attachmentData },
            },
            { type: "text" as const, text: m.content },
          ],
        };
      }
      if (isPdfType(m.attachmentType)) {
        return {
          role: m.role,
          content: [
            {
              type: "document" as const,
              source: { type: "base64" as const, media_type: PDF_TYPE as typeof PDF_TYPE, data: m.attachmentData },
            },
            { type: "text" as const, text: m.content },
          ],
        };
      }
    }
    return { role: m.role, content: m.content };
  });

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });
  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}
