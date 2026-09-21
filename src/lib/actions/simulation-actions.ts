"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  startOfficialSimulation,
  startCustomSimulation,
  submitSimulation,
  type CustomConfig,
} from "@/lib/engine/simulation";
import { isProUser } from "@/lib/subscription";

/** Simulations are Pro-only. There is no free allowance any more, so this is
 * just the Pro check — kept as its own function because three call sites and
 * two Server Actions depend on it, and one place to change is the point.
 *
 * `remaining` is retained in the shape rather than dropped: callers render it,
 * and a Pro user's allowance has always been unbounded. */
export async function canStartSimulation(userId: string) {
  return (await isProUser(userId))
    ? { allowed: true as const }
    : { allowed: false as const, remaining: 0 };
}

export async function startOfficialSimulationAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  // Empty for contests that have no levels; startOfficialSimulation resolves
  // an unknown or missing id against the student's grade.
  const levelId = String(formData.get("level") ?? "") || null;

  const gate = await canStartSimulation(user.id);
  if (!gate.allowed) redirect("/pricing?from=simulation-limit");

  const attempt = await startOfficialSimulation(user.id, slug, levelId);
  redirect(`/simulations/run/${attempt.id}`);
}

const customSchema = z.object({
  problemCount: z.coerce.number().int().min(3).max(30),
  difficultyMin: z.coerce.number().int().min(1).max(10),
  difficultyMax: z.coerce.number().int().min(1).max(10),
  timeLimitMinutes: z.coerce.number().int().min(5).max(240),
  topicSlugs: z.array(z.string()).default([]),
});

export async function startCustomSimulationAction(formData: FormData) {
  const user = await requireUser();

  const gate = await canStartSimulation(user.id);
  if (!gate.allowed) redirect("/pricing?from=simulation-limit");

  const parsed = customSchema.safeParse({
    problemCount: formData.get("problemCount"),
    difficultyMin: formData.get("difficultyMin"),
    difficultyMax: formData.get("difficultyMax"),
    timeLimitMinutes: formData.get("timeLimitMinutes"),
    topicSlugs: formData.getAll("topicSlugs"),
  });
  if (!parsed.success) redirect("/simulations?error=invalid");

  const config: CustomConfig = {
    ...parsed.data,
    difficultyMin: Math.min(parsed.data.difficultyMin, parsed.data.difficultyMax),
    difficultyMax: Math.max(parsed.data.difficultyMin, parsed.data.difficultyMax),
  };

  const attempt = await startCustomSimulation(user.id, config);
  redirect(`/simulations/run/${attempt.id}`);
}

export async function submitSimulationAction(input: {
  attemptId: string;
  answers: Record<string, string>;
  flagged: string[];
}) {
  const user = await requireUser();
  const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
    where: { id: input.attemptId },
  });
  if (attempt.userId !== user.id) throw new Error("Not your simulation");

  await submitSimulation(input.attemptId, input.answers, input.flagged);
  return { resultsUrl: `/simulations/results/${input.attemptId}` };
}
