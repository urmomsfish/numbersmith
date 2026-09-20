"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { generateStudyPlan } from "@/lib/engine/study-plan";

export type OnboardingFormState = { error?: string } | undefined;

/* Only the three fields the product actually reads.
 *
 * This form used to ask seven questions. `ageRange`, `approxLevel` and
 * `priorCompetitions` were written to the profile and then read by nothing —
 * three mandatory questions that changed no behaviour anywhere. `targetScore`
 * is real but belongs in Settings, where it already lives and can be set once
 * someone has a reason to care about it.
 *
 * What survives is what has a consumer: `grade` and `priorExperience` feed
 * computeStartingDifficulty(), and `dailyPracticeMinutes` sizes the study
 * plan. The columns for the dropped fields keep their Prisma defaults, so
 * nothing needs a migration and existing profiles are untouched. */
const profileSchema = z.object({
  grade: z.coerce.number().int().min(0).max(12),
  priorExperience: z.enum(["NONE", "SOME", "EXPERIENCED", "ADVANCED"]),
  dailyPracticeMinutes: z.coerce.number().int().min(10).max(180),
});

export async function saveOnboardingProfileAction(
  _prevState: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    grade: formData.get("grade"),
    priorExperience: formData.get("priorExperience"),
    dailyPracticeMinutes: formData.get("dailyPracticeMinutes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please fill out every field." };
  }
  const data = parsed.data;

  // Both buttons on the form submit it, so the answers are saved either way and
  // the only difference is where the user lands.
  const takingTest = formData.get("intent") !== "skip";
  const step = takingTest ? "PLACEMENT" : "COMPETITIONS";

  const fields = {
    grade: data.grade,
    priorExperience: data.priorExperience,
    dailyPracticeMinutes: data.dailyPracticeMinutes,
    onboardingStep: step,
  };

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: fields,
    create: { userId: user.id, ...fields },
  });

  redirect(takingTest ? "/placement-test" : "/onboarding/competitions");
}

/** Leaves the placement test without finishing it.
 *
 * Nothing downstream requires a completed test: every account is created with
 * an OVERALL rating of 1000, and applyRatingDelta() moves it from there on the
 * first practice problems. The cost of skipping is a skill breakdown that
 * starts empty, not a broken account. */
export async function skipPlacementAction() {
  const user = await requireUser();
  await prisma.profile.update({
    where: { userId: user.id },
    data: { onboardingStep: "COMPETITIONS" },
  });
  redirect("/onboarding/competitions");
}

/** Finishes onboarding without picking a competition.
 *
 * generateStudyPlan() handles an empty schedule — it falls back to the generic
 * week progression — and the dashboard renders a "pick a competition" empty
 * state, so this lands on a working product rather than a half-built one. */
export async function skipCompetitionsAction() {
  const user = await requireUser();
  await prisma.profile.update({
    where: { userId: user.id },
    data: { onboardingStep: "DONE", onboardingCompletedAt: new Date() },
  });
  await generateStudyPlan(user.id);
  redirect("/dashboard");
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
