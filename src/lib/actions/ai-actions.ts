"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/subscription";
import { aiIsConfigured, askMathAssistant, isSupportedImageType } from "@/lib/ai";

const HISTORY_LIMIT = 20; // turns of context sent to the model per request

/** Ceiling on a single attached image, in base64 characters.
 *
 * The composer already downscales to 1568px on the long edge (the size above
 * which the vision API resizes anyway) and steps JPEG quality down until it
 * fits, so a normal screenshot lands far below this. It's a backstop against a
 * hand-crafted request, not the thing shaping ordinary uploads. 4 MB of base64
 * is ~3 MB of image; the Server Action body limit in next.config.ts is set
 * above it so an oversized post fails here, with a readable message, rather
 * than as an opaque framework-level rejection. */
const MAX_IMAGE_BASE64 = 4 * 1024 * 1024;

/** What a message says when a screenshot was sent with no typed question. The
 * API rejects an empty text block, and "" would also render as a blank bubble
 * in the thread, so the attachment needs to carry a sentence of its own. */
const IMAGE_ONLY_FALLBACK = "Here's the problem I'm stuck on.";

/** How many of the most recent images are re-sent to the model as context. */
const IMAGE_CONTEXT_LIMIT = 3;

async function requireProAccess() {
  const user = await requireUser();
  if (!(await isProUser(user.id))) throw new Error("Smith AI is a Pro feature.");
  return user;
}

export async function sendAiMessageAction(input: {
  content: string;
  image?: { data: string; type: string } | null;
}) {
  const user = await requireProAccess();
  const image = input.image ?? null;
  // An image on its own is a complete question, so text is only required when
  // nothing is attached.
  const typed = input.content.trim();
  const content = typed || (image ? IMAGE_ONLY_FALLBACK : "");
  if (!content) throw new Error("Message can't be empty.");
  if (content.length > 4000) throw new Error("That message is too long.");

  if (image) {
    if (!isSupportedImageType(image.type)) {
      throw new Error("That image format isn't supported — use a PNG, JPEG, GIF, or WebP.");
    }
    if (!image.data) throw new Error("That image didn't upload correctly — try attaching it again.");
    if (image.data.length > MAX_IMAGE_BASE64) {
      throw new Error("That image is too large — try a smaller screenshot or crop it first.");
    }
  }

  if (!aiIsConfigured()) {
    throw new Error(
      "Smith AI isn't configured yet — ask your NumberSmith admin to set ANTHROPIC_API_KEY."
    );
  }

  await prisma.aiChatMessage.create({
    data: {
      userId: user.id,
      role: "user",
      content,
      imageData: image?.data ?? null,
      imageType: image?.type ?? null,
    },
  });

  const recent = await prisma.aiChatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });
  // Replay only the newest few images. Every turn in the window is re-sent on
  // every request, so without this a student who attaches a screenshot to ten
  // questions in a row pays to upload and re-analyse all ten on the eleventh —
  // roughly 1.5k tokens per image, plus the request size. Older images drop
  // back to their text, which is what the conversation was referring to by
  // then anyway. They stay in the database and still render in the thread;
  // this only bounds what goes to the model.
  let imagesLeft = IMAGE_CONTEXT_LIMIT;
  const history = recent
    .map((m) => {
      const keep = m.imageData && imagesLeft > 0;
      if (keep) imagesLeft--;
      return {
        role: m.role as "user" | "assistant",
        content: m.content,
        imageData: keep ? m.imageData : null,
        imageType: keep ? m.imageType : null,
      };
    })
    // `recent` is newest-first so the cap above keeps the *latest* images;
    // reverse only now, to hand the model chronological order.
    .reverse();

  let reply: string;
  try {
    reply = await askMathAssistant(history);
  } catch (err) {
    console.error("askMathAssistant failed:", err);
    throw new Error("Smith AI couldn't respond just now — try again in a moment.");
  }

  await prisma.aiChatMessage.create({ data: { userId: user.id, role: "assistant", content: reply } });
  // `content` goes back too: when an image was sent with no typed text the
  // stored message is the fallback sentence, and the optimistic bubble the
  // client already rendered would otherwise stay blank until a reload.
  return { reply, content };
}

export async function clearAiChatAction() {
  const user = await requireProAccess();
  await prisma.aiChatMessage.deleteMany({ where: { userId: user.id } });
}
