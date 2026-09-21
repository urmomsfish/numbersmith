"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/subscription";
import { aiIsConfigured, askMathAssistant, isPdfType, isSupportedAttachmentType } from "@/lib/ai";

const HISTORY_LIMIT = 20; // turns of context sent to the model per request

/** Ceiling on a single attachment, in base64 characters.
 *
 * The composer already downscales images to 1568px on the long edge (the size
 * above which the vision API resizes anyway) and steps JPEG quality down until
 * they fit, and refuses PDFs over 3 MB, so a normal upload lands below this.
 * It's a backstop against a hand-crafted request, not the thing shaping
 * ordinary uploads. 4 MB of base64 is ~3 MB of file; the Server Action body
 * limit in next.config.ts is set above it so an oversized post fails here,
 * with a readable message, rather than as an opaque framework-level
 * rejection. */
const MAX_ATTACHMENT_BASE64 = 4 * 1024 * 1024;

/** What a message says when a file was sent with no typed question. The API
 * rejects an empty text block, and "" would also render as a blank bubble in
 * the thread, so the attachment needs to carry a sentence of its own.
 *
 * A PDF gets a different sentence because it is usually a whole paper rather
 * than one problem — "the problem I'm stuck on" would be a lie that pushes the
 * model to pick one arbitrarily instead of asking which. */
const IMAGE_ONLY_FALLBACK = "Here's the problem I'm stuck on.";
const PDF_ONLY_FALLBACK = "Here's the paper I'm working from.";

/** How many of the most recent attachments are re-sent to the model as
 * context. PDFs count for more because they cost far more: an image is ~1.5k
 * tokens, while a PDF is charged per page and a full past paper runs to tens
 * of thousands. Replaying two of those on every turn would quietly dominate
 * the bill and crowd out the conversation itself. */
const IMAGE_CONTEXT_LIMIT = 3;
const PDF_CONTEXT_LIMIT = 1;

/** A message that is safe — and meant — to be shown to the student.
 *
 * Next strips thrown error messages in production builds and replaces them with
 * a digest, which is why every message below used to reach the client as
 * "Minified React error #441" instead of the sentence it actually says. So
 * these aren't thrown past the action boundary: they're caught here and
 * returned as a value. Anything *not* a ChatError is a bug rather than a
 * message for a student, and is logged and replaced with a generic line. */
class ChatError extends Error {}

/** Next signals redirect() and notFound() by throwing, so a catch-all must let
 * those through instead of reporting them as chat failures. */
function isFrameworkError(err: unknown): boolean {
  const digest = (err as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && digest.startsWith("NEXT_");
}

export type SendAiMessageResult =
  | { ok: true; reply: string; content: string }
  | { ok: false; error: string };

async function requireProAccess() {
  // requireUser throws a bare "UNAUTHENTICATED" — a sentinel for the caller,
  // not a sentence for a student. A session can expire with the page still
  // open, so it needs its own message rather than the generic fallback.
  const user = await requireUser().catch(() => {
    throw new ChatError("You've been signed out — reload the page and sign in again.");
  });
  if (!(await isProUser(user.id))) throw new ChatError("Smith AI is a Pro feature.");
  return user;
}

export async function sendAiMessageAction(input: {
  content: string;
  attachment?: { data: string; type: string } | null;
  /** The name this argument had before PDFs were supported. A student with the
   * page already open keeps running the client bundle they loaded, and that one
   * posts `image`. Without this, their next send reaches a server that sees no
   * attachment at all — an image-only message becomes an empty one and fails,
   * which is exactly what happened on the deploy that introduced the rename.
   * Reading both shapes means a warm tab keeps working instead of breaking
   * until its owner happens to hard-refresh. */
  image?: { data: string; type: string } | null;
}): Promise<SendAiMessageResult> {
  try {
    return await sendAiMessage(input);
  } catch (err) {
    if (isFrameworkError(err)) throw err;
    if (err instanceof ChatError) return { ok: false, error: err.message };
    console.error("sendAiMessageAction failed:", err);
    return { ok: false, error: "Something went wrong sending that — try again in a moment." };
  }
}

async function sendAiMessage(input: {
  content: string;
  attachment?: { data: string; type: string } | null;
  image?: { data: string; type: string } | null;
}): Promise<SendAiMessageResult> {
  const user = await requireProAccess();
  const attachment = input.attachment ?? input.image ?? null;
  // An attachment on its own is a complete question, so text is only required
  // when nothing is attached.
  const typed = (input.content ?? "").trim();
  const fallback = isPdfType(attachment?.type) ? PDF_ONLY_FALLBACK : IMAGE_ONLY_FALLBACK;
  const content = typed || (attachment ? fallback : "");
  if (!content) throw new ChatError("Message can't be empty.");
  if (content.length > 4000) throw new ChatError("That message is too long.");

  if (attachment) {
    if (!isSupportedAttachmentType(attachment.type)) {
      throw new ChatError("You can attach a PNG, JPEG, GIF, WebP, or PDF.");
    }
    if (!attachment.data) {
      throw new ChatError("That file didn't upload correctly — try attaching it again.");
    }
    if (attachment.data.length > MAX_ATTACHMENT_BASE64) {
      throw new ChatError(
        isPdfType(attachment.type)
          ? "That PDF is too large — try attaching just the pages you need."
          : "That image is too large — try a smaller screenshot or crop it first."
      );
    }
  }

  if (!aiIsConfigured()) {
    throw new ChatError(
      "Smith AI isn't configured yet — ask your NumberSmith admin to set ANTHROPIC_API_KEY."
    );
  }

  await prisma.aiChatMessage.create({
    data: {
      userId: user.id,
      role: "user",
      content,
      attachmentData: attachment?.data ?? null,
      attachmentType: attachment?.type ?? null,
    },
  });

  const recent = await prisma.aiChatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });
  // Replay only the newest few attachments. Every turn in the window is re-sent
  // on every request, so without this a student who attaches a screenshot to
  // ten questions in a row pays to upload and re-analyse all ten on the
  // eleventh. Older attachments drop back to their text, which is what the
  // conversation was referring to by then anyway. They stay in the database and
  // still render in the thread; this only bounds what goes to the model.
  //
  // Images and PDFs get separate budgets rather than sharing one, so a single
  // expensive PDF can't evict the screenshots — and three cheap screenshots
  // can't pull a second paper along with them.
  let imagesLeft = IMAGE_CONTEXT_LIMIT;
  let pdfsLeft = PDF_CONTEXT_LIMIT;
  const history = recent
    .map((m) => {
      let keep = false;
      if (m.attachmentData) {
        if (isPdfType(m.attachmentType)) {
          keep = pdfsLeft > 0;
          if (keep) pdfsLeft--;
        } else {
          keep = imagesLeft > 0;
          if (keep) imagesLeft--;
        }
      }
      return {
        role: m.role as "user" | "assistant",
        content: m.content,
        attachmentData: keep ? m.attachmentData : null,
        attachmentType: keep ? m.attachmentType : null,
      };
    })
    // `recent` is newest-first so the caps above keep the *latest* attachments;
    // reverse only now, to hand the model chronological order.
    .reverse();

  let reply: string;
  try {
    reply = await askMathAssistant(history);
  } catch (err) {
    console.error("askMathAssistant failed:", err);
    throw new ChatError("Smith AI couldn't respond just now — try again in a moment.");
  }

  await prisma.aiChatMessage.create({ data: { userId: user.id, role: "assistant", content: reply } });
  // `content` goes back too: when an image was sent with no typed text the
  // stored message is the fallback sentence, and the optimistic bubble the
  // client already rendered would otherwise stay blank until a reload.
  //
  // `reply` and `content` stay at the top level, beside `ok`, so a client
  // running the previous bundle — which destructures them directly — still
  // renders a successful answer.
  return { ok: true, reply, content };
}

export async function clearAiChatAction(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireProAccess();
    await prisma.aiChatMessage.deleteMany({ where: { userId: user.id } });
    return { ok: true };
  } catch (err) {
    if (isFrameworkError(err)) throw err;
    if (err instanceof ChatError) return { ok: false, error: err.message };
    console.error("clearAiChatAction failed:", err);
    return { ok: false, error: "Couldn't clear the thread — try again in a moment." };
  }
}
