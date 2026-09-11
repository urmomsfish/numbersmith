"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/subscription";
import { aiIsConfigured, askMathAssistant } from "@/lib/ai";

const HISTORY_LIMIT = 20; // turns of context sent to the model per request

async function requireProAccess() {
  const user = await requireUser();
  if (!(await isProUser(user.id))) throw new Error("The AI Math Assistant is a Pro feature.");
  return user;
}

export async function sendAiMessageAction(input: { content: string }) {
  const user = await requireProAccess();
  const content = input.content.trim();
  if (!content) throw new Error("Message can't be empty.");
  if (content.length > 4000) throw new Error("That message is too long.");

  if (!aiIsConfigured()) {
    throw new Error(
      "The AI Math Assistant isn't configured yet — ask your NumberSmith admin to set OPENROUTER_API_KEY."
    );
  }

  await prisma.aiChatMessage.create({ data: { userId: user.id, role: "user", content } });

  const recent = await prisma.aiChatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });
  const history = recent.reverse().map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  let reply: string;
  try {
    reply = await askMathAssistant(history);
  } catch {
    throw new Error("The AI Math Assistant couldn't respond just now — try again in a moment.");
  }

  await prisma.aiChatMessage.create({ data: { userId: user.id, role: "assistant", content: reply } });
  return { reply };
}

export async function clearAiChatAction() {
  const user = await requireProAccess();
  await prisma.aiChatMessage.deleteMany({ where: { userId: user.id } });
}
