"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudyPlan } from "@/lib/engine/study-plan";

const profileSchema = z.object({
  grade: z.coerce.number().int().min(0).max(12),
  dailyPracticeMinutes: z.coerce.number().int().min(10).max(180),
  targetScore: z.string().max(120).optional(),
});

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    grade: formData.get("grade"),
    dailyPracticeMinutes: formData.get("dailyPracticeMinutes"),
    targetScore: formData.get("targetScore") || undefined,
  });
  if (!parsed.success) return;

  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      grade: parsed.data.grade,
      dailyPracticeMinutes: parsed.data.dailyPracticeMinutes,
      targetScore: parsed.data.targetScore || null,
    },
  });

  await generateStudyPlan(user.id);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

const competitionsSchema = z.object({
  competitionSlugs: z.array(z.string()).min(1),
  primarySlug: z.string().min(1),
});

export async function updateCompetitionsAction(formData: FormData) {
  const user = await requireUser();

  const parsed = competitionsSchema.safeParse({
    competitionSlugs: formData.getAll("competitionSlugs"),
    primarySlug: formData.get("primarySlug"),
  });
  if (!parsed.success) return;

  const competitions = await prisma.competition.findMany({
    where: { slug: { in: parsed.data.competitionSlugs } },
  });

  await prisma.userCompetition.deleteMany({ where: { userId: user.id } });
  await prisma.userCompetition.createMany({
    data: competitions.map((c) => ({
      userId: user.id,
      competitionId: c.id,
      isPrimary: c.slug === parsed.data.primarySlug,
    })),
  });

  await generateStudyPlan(user.id);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/competitions");
}
