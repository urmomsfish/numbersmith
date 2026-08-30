"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { generateStudyPlan } from "@/lib/engine/study-plan";

export type OnboardingFormState = { error?: string } | undefined;

const profileSchema = z.object({
  grade: z.coerce.number().int().min(0).max(12),
  ageRange: z.string().min(1),
  priorExperience: z.enum(["NONE", "SOME", "EXPERIENCED", "ADVANCED"]),
  priorCompetitions: z.array(z.string()).default([]),
  approxLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "NOT_SURE"]),
  dailyPracticeMinutes: z.coerce.number().int().min(10).max(180),
  targetScore: z.string().optional(),
});

export async function saveOnboardingProfileAction(
  _prevState: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    grade: formData.get("grade"),
    ageRange: formData.get("ageRange"),
    priorExperience: formData.get("priorExperience"),
    priorCompetitions: formData.getAll("priorCompetitions"),
    approxLevel: formData.get("approxLevel"),
    dailyPracticeMinutes: formData.get("dailyPracticeMinutes"),
    targetScore: formData.get("targetScore") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please fill out every field." };
  }
  const data = parsed.data;

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      grade: data.grade,
      ageRange: data.ageRange,
      priorExperience: data.priorExperience,
      priorCompetitions: JSON.stringify(data.priorCompetitions),
      approxLevel: data.approxLevel,
      dailyPracticeMinutes: data.dailyPracticeMinutes,
      targetScore: data.targetScore || null,
      onboardingStep: "PLACEMENT",
    },
    create: {
      userId: user.id,
      grade: data.grade,
      ageRange: data.ageRange,
      priorExperience: data.priorExperience,
      priorCompetitions: JSON.stringify(data.priorCompetitions),
      approxLevel: data.approxLevel,
      dailyPracticeMinutes: data.dailyPracticeMinutes,
      targetScore: data.targetScore || null,
      onboardingStep: "PLACEMENT",
    },
  });

  redirect("/placement-test");
}

export async function skipPlacementAction() {
  const user = await requireUser();
  await prisma.profile.update({
    where: { userId: user.id },
    data: { onboardingStep: "COMPETITIONS" },
  });
  redirect("/onboarding/competitions");
}

const competitionsSchema = z.object({
  competitionSlugs: z.array(z.string()).min(1, "Choose at least one competition"),
  primarySlug: z.string().min(1, "Choose your #1 priority competition"),
});

export async function saveCompetitionsAction(
  _prevState: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const user = await requireUser();

  const parsed = competitionsSchema.safeParse({
    competitionSlugs: formData.getAll("competitionSlugs"),
    primarySlug: formData.get("primarySlug"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please choose your competitions." };
  }
  const { competitionSlugs, primarySlug } = parsed.data;

  const competitions = await prisma.competition.findMany({
    where: { slug: { in: competitionSlugs } },
  });

  await prisma.userCompetition.deleteMany({ where: { userId: user.id } });
  await prisma.userCompetition.createMany({
    data: competitions.map((c) => ({
      userId: user.id,
      competitionId: c.id,
      isPrimary: c.slug === primarySlug,
    })),
  });

  await prisma.profile.update({
    where: { userId: user.id },
    data: { onboardingStep: "PLAN" },
  });

  await generateStudyPlan(user.id);

  redirect("/onboarding/plan");
}

export async function completeOnboardingAction() {
  const user = await requireUser();
  await prisma.profile.update({
    where: { userId: user.id },
    data: { onboardingStep: "DONE", onboardingCompletedAt: new Date() },
  });
  redirect("/dashboard");
}
