"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudyPlan } from "@/lib/engine/study-plan";

/** The student's competition schedule.
 *
 * Every mutation here regenerates the study plan, because the plan is built
 * backwards from these dates — leaving it stale would show a plan preparing for
 * a contest that has been removed or rescheduled.
 */

/** Contest dates are date-only. Parsing "2027-02-11" with `new Date()` would
 * read it as UTC midnight and then render as the previous day for anyone west
 * of Greenwich, so the parts are assembled explicitly — the same UTC-midnight
 * convention used for DailyChallenge.date. */
function parseContestDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (Number.isNaN(date.getTime())) return null;
  // Guard against "2027-02-31" silently rolling into March.
  if (date.getUTCMonth() !== Number(mo) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date;
}

const addSchema = z.object({
  competitionId: z.string().min(1),
  targetDate: z.string().optional(),
});

export async function addScheduledCompetitionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = addSchema.safeParse({
    competitionId: formData.get("competitionId"),
    targetDate: formData.get("targetDate") || undefined,
  });
  if (!parsed.success) return;

  const competition = await prisma.competition.findUnique({
    where: { id: parsed.data.competitionId },
    select: { id: true },
  });
  if (!competition) return;

  const targetDate = parsed.data.targetDate ? parseContestDate(parsed.data.targetDate) : null;
  const existingCount = await prisma.userCompetition.count({ where: { userId: user.id } });

  await prisma.userCompetition.upsert({
    where: { userId_competitionId: { userId: user.id, competitionId: competition.id } },
    update: { targetDate },
    // The first competition a student adds becomes their primary, so the plan
    // always has something to aim at.
    create: {
      userId: user.id,
      competitionId: competition.id,
      targetDate,
      isPrimary: existingCount === 0,
    },
  });

  await generateStudyPlan(user.id);
  revalidatePath("/schedule");
  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}

const dateSchema = z.object({
  userCompetitionId: z.string().min(1),
  targetDate: z.string().optional(),
});

export async function setCompetitionDateAction(formData: FormData) {
  const user = await requireUser();
  const parsed = dateSchema.safeParse({
    userCompetitionId: formData.get("userCompetitionId"),
    targetDate: formData.get("targetDate") || undefined,
  });
  if (!parsed.success) return;

  // Scoped by userId as well as id — the id alone comes from the form, so
  // without this another user's row could be edited by guessing one.
  const row = await prisma.userCompetition.findFirst({
    where: { id: parsed.data.userCompetitionId, userId: user.id },
    select: { id: true },
  });
  if (!row) return;

  const targetDate = parsed.data.targetDate ? parseContestDate(parsed.data.targetDate) : null;
  await prisma.userCompetition.update({ where: { id: row.id }, data: { targetDate } });

  await generateStudyPlan(user.id);
  revalidatePath("/schedule");
  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}

export async function removeScheduledCompetitionAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("userCompetitionId") ?? "");
  if (!id) return;

  const row = await prisma.userCompetition.findFirst({
    where: { id, userId: user.id },
    select: { id: true, isPrimary: true },
  });
  if (!row) return;

  await prisma.userCompetition.delete({ where: { id: row.id } });

  // Removing the primary would leave the plan with nothing to aim at, so the
  // next competition inherits it.
  if (row.isPrimary) {
    const next = await prisma.userCompetition.findFirst({
      where: { userId: user.id },
      orderBy: [{ targetDate: "asc" }, { addedAt: "asc" }],
      select: { id: true },
    });
    if (next) {
      await prisma.userCompetition.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  }

  await generateStudyPlan(user.id);
  revalidatePath("/schedule");
  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}

export async function setPrimaryCompetitionAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("userCompetitionId") ?? "");
  if (!id) return;

  const row = await prisma.userCompetition.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!row) return;

  await prisma.$transaction([
    prisma.userCompetition.updateMany({ where: { userId: user.id }, data: { isPrimary: false } }),
    prisma.userCompetition.update({ where: { id: row.id }, data: { isPrimary: true } }),
  ]);

  await generateStudyPlan(user.id);
  revalidatePath("/schedule");
  revalidatePath("/study-plan");
  revalidatePath("/dashboard");
}
