"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * A student's working for one problem, kept as a PNG data URL.
 *
 * Competition maths is done with scribbles and the product had nowhere to put
 * them, so the reasoning behind a wrong answer was never captured. Saving it
 * means a mistake can later be reviewed alongside the working that produced
 * it — and Smith AI can read it, since it already accepts images.
 */

/** Ceiling on one canvas, in base64 characters.
 *
 * A 900x500 sketch is tens of kilobytes; this is a backstop against a
 * hand-crafted request rather than a limit ordinary drawing will meet. It sits
 * well under the Server Action body limit in next.config.ts so an oversized
 * save fails here with a readable message rather than as an opaque
 * framework-level rejection. */
const MAX_SCRATCH_BASE64 = 700_000;

const DATA_URL = /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/;

export async function saveScratchAction(input: {
  problemId: string;
  data: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser();

    // Only ever this user's own row for this problem: the upsert is keyed on
    // the composite unique, so a forged problemId can still only write to the
    // caller's own scratch work.
    if (!DATA_URL.test(input.data)) {
      return { ok: false, error: "That doesn't look like a drawing." };
    }
    if (input.data.length > MAX_SCRATCH_BASE64) {
      return { ok: false, error: "That sketch is too large to save." };
    }

    // A problem that does not exist would otherwise fail on the foreign key
    // with an opaque Prisma error.
    const problem = await prisma.problem.findUnique({
      where: { id: input.problemId },
      select: { id: true },
    });
    if (!problem) return { ok: false, error: "Unknown problem." };

    await prisma.scratchWork.upsert({
      where: { userId_problemId: { userId: user.id, problemId: input.problemId } },
      update: { data: input.data },
      create: { userId: user.id, problemId: input.problemId, data: input.data },
    });
    return { ok: true };
  } catch (err) {
    const digest = (err as { digest?: unknown } | null)?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    console.error("saveScratchAction failed:", err);
    return { ok: false, error: "Couldn't save your working." };
  }
}

/** Clears the canvas for a problem. Scoped to the caller by the same key. */
export async function clearScratchAction(input: {
  problemId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    await prisma.scratchWork.deleteMany({
      where: { userId: user.id, problemId: input.problemId },
    });
    return { ok: true };
  } catch (err) {
    const digest = (err as { digest?: unknown } | null)?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    console.error("clearScratchAction failed:", err);
    return { ok: false, error: "Couldn't clear your working." };
  }
}
