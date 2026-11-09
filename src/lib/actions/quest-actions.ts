"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  startQuest,
  travel,
  strike,
  takeRelic,
  skipReward,
  closeQuest,
  questView,
  type QuestState,
  type QuestView,
  type StrikeResult,
} from "@/lib/engine/quest";

/**
 * Every action owns-checks the run first.
 *
 * Load-bearing rather than defensive: resolving an exchange hands back the
 * answer key and the worked solution, so without the check any signed-in
 * student could read the key to any problem by posting someone else's run id
 * — and could also spend a stranger's health.
 *
 * Failures come back as values because Next replaces thrown Server Action
 * messages with an opaque digest in production, and the engine's refusals
 * ("You are not on the road") are written for the player to read.
 */
async function owns(runId: string): Promise<boolean> {
  const user = await requireUser();
  const run = await prisma.gameRun.findUnique({ where: { id: runId }, select: { userId: true } });
  return !!run && run.userId === user.id;
}

function asMessage(err: unknown, fallback: string): string {
  const digest = (err as { digest?: unknown } | null)?.digest;
  if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
  const message = err instanceof Error ? err.message : "";
  if (message && message.length < 90) return message;
  console.error(`${fallback}:`, err);
  return fallback;
}

export async function startQuestAction() {
  const user = await requireUser();
  const runId = await startQuest(user.id);
  redirect(`/quest/${runId}`);
}

export async function travelAction(input: {
  runId: string;
  option: number;
}): Promise<{ ok: true; view: QuestView } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    return { ok: true, view: await travel(input.runId, input.option) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't take that road.") };
  }
}

export async function strikeAction(input: {
  runId: string;
  problemId: string;
  answerGiven: string;
}): Promise<{ ok: true; result: StrikeResult } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    return { ok: true, result: await strike(input.runId, input.problemId, input.answerGiven) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't resolve that blow — try again.") };
  }
}

export async function takeRelicAction(input: {
  runId: string;
  relic: string;
}): Promise<{ ok: true; view: QuestView } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    return { ok: true, view: await takeRelic(input.runId, input.relic) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't take that.") };
  }
}

export async function skipRewardAction(input: {
  runId: string;
}): Promise<{ ok: true; view: QuestView } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    return { ok: true, view: await skipReward(input.runId) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't leave that.") };
  }
}

/** Abandons the quest. The score stands — walking away keeps what you earned. */
export async function abandonQuestAction(input: {
  runId: string;
}): Promise<{ ok: true; state: QuestState } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    return { ok: true, state: await closeQuest(input.runId) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't end the quest.") };
  }
}

export async function refreshQuestAction(input: {
  runId: string;
}): Promise<{ ok: true; view: QuestView } | { ok: false; error: string }> {
  try {
    if (!(await owns(input.runId))) return { ok: false, error: "Not your quest." };
    const view = await questView(input.runId);
    if (!view) return { ok: false, error: "That quest is gone." };
    return { ok: true, view };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't load the quest.") };
  }
}
