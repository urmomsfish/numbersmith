"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  startCountdown,
  answerCountdownItem,
  finishCountdown,
  type CountdownAnswerResult,
} from "@/lib/engine/countdown";
import { isProUser } from "@/lib/subscription";

/** Countdown is gated the same way simulations are, so the two timed formats
 * tell a student one consistent story about what Pro buys. */
export async function canStartCountdown(userId: string) {
  return (await isProUser(userId))
    ? { allowed: true as const }
    : { allowed: false as const };
}

export async function startCountdownAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "") || null;

  const gate = await canStartCountdown(user.id);
  if (!gate.allowed) redirect("/pricing?from=countdown");

  const attempt = await startCountdown(user.id, slug);
  redirect(`/countdown/run/${attempt.id}`);
}

/**
 * Records one answer and returns the key.
 *
 * The ownership check is load-bearing rather than defensive: this hands back
 * the correct answer, so without it any signed-in student could read the key
 * to any problem by posting someone else's attempt id. Errors come back as
 * values because Next replaces thrown Server Action messages with a digest in
 * production.
 */
export async function answerCountdownItemAction(input: {
  attemptId: string;
  itemId: string;
  answerGiven: string;
  timeSeconds: number;
}): Promise<{ ok: true; result: CountdownAnswerResult } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
      where: { id: input.attemptId },
    });
    if (attempt.userId !== user.id) return { ok: false, error: "Not your countdown round." };
    if (attempt.status === "SUBMITTED") return { ok: false, error: "This round is already over." };

    const result = await answerCountdownItem(
      input.attemptId,
      input.itemId,
      input.answerGiven,
      input.timeSeconds
    );
    if (result.finished) await finishCountdown(input.attemptId);
    return { ok: true, result };
  } catch (err) {
    const digest = (err as { digest?: unknown } | null)?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    console.error("answerCountdownItemAction failed:", err);
    return { ok: false, error: "Couldn't record that answer — try again." };
  }
}

/** Ends a round early. A student who walks away keeps whatever they scored,
 * which is the whole point of a format you can stop. */
export async function finishCountdownAction(input: {
  attemptId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
      where: { id: input.attemptId },
    });
    if (attempt.userId !== user.id) return { ok: false, error: "Not your countdown round." };
    await finishCountdown(input.attemptId);
    return { ok: true };
  } catch (err) {
    const digest = (err as { digest?: unknown } | null)?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    console.error("finishCountdownAction failed:", err);
    return { ok: false, error: "Couldn't end the round." };
  }
}
