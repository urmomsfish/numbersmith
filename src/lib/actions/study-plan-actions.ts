"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudyPlan } from "@/lib/engine/study-plan";

export async function regenerateStudyPlanAction() {
  const user = await requireUser();
  await generateStudyPlan(user.id);
  revalidatePath("/study-plan");
}

const goalSchema = z.object({
  competitionSlug: z.string().optional(),
  competitionDate: z.string().optional(),
  targetRating: z.coerce.number().int().min(800).max(2400).optional(),
  minutesPerDay: z.coerce.number().int().min(10).max(180),
});

export async function saveGoalAction(formData: FormData) {
  const user = await requireUser();

  const parsed = goalSchema.safeParse({
    competitionSlug: formData.get("competitionSlug") || undefined,
    competitionDate: formData.get("competitionDate") || undefined,
    targetRating: formData.get("targetRating") || undefined,
    minutesPerDay: formData.get("minutesPerDay"),
  });
  if (!parsed.success) return;

  const { competitionSlug, competitionDate, targetRating, minutesPerDay } = parsed.data;

  await prisma.profile.update({
    where: { userId: user.id },
    data: { dailyPracticeMinutes: minutesPerDay },
  });

  if (competitionSlug) {
    const competition = await prisma.competition.findUnique({ where: { slug: competitionSlug } });
    if (competition) {
      await prisma.userCompetition.updateMany({
        where: { userId: user.id },
        data: { isPrimary: false },
      });
      await prisma.userCompetition.upsert({
        where: { userId_competitionId: { userId: user.id, competitionId: competition.id } },
        update: { isPrimary: true },
        create: { userId: user.id, competitionId: competition.id, isPrimary: true },
      });
    }
  }

  const plan = await generateStudyPlan(user.id);

  await prisma.studyPlan.update({
    where: { id: plan.id },
    data: {
      competitionDate: competitionDate ? new Date(competitionDate) : null,
      targetRating: targetRating ?? plan.targetRating,
    },
  });

  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}
