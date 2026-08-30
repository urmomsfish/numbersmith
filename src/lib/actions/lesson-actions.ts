"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/engine/xp";

export async function markLessonCompleteAction(input: {
  lessonId: string;
  masteryPercent: number;
}) {
  const user = await requireUser();

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: input.lessonId } },
  });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: input.lessonId } },
    update: {
      completed: true,
      masteryPct: Math.max(existing?.masteryPct ?? 0, input.masteryPercent),
      completedAt: existing?.completedAt ?? new Date(),
    },
    create: {
      userId: user.id,
      lessonId: input.lessonId,
      completed: true,
      masteryPct: input.masteryPercent,
      completedAt: new Date(),
    },
  });

  if (!existing?.completed) {
    await awardXp(user.id, 30);
  }
}
