"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/engine/xp";
import { isProUser } from "@/lib/subscription";

export async function markVideoLessonCompleteAction(input: { videoLessonId: string }) {
  const user = await requireUser();
  if (!(await isProUser(user.id))) throw new Error("Video lessons are a Pro feature.");

  const existing = await prisma.videoLessonProgress.findUnique({
    where: { userId_videoLessonId: { userId: user.id, videoLessonId: input.videoLessonId } },
  });

  await prisma.videoLessonProgress.upsert({
    where: { userId_videoLessonId: { userId: user.id, videoLessonId: input.videoLessonId } },
    update: {
      completed: true,
      completedAt: existing?.completedAt ?? new Date(),
    },
    create: {
      userId: user.id,
      videoLessonId: input.videoLessonId,
      completed: true,
      completedAt: new Date(),
    },
  });

  if (!existing?.completed) {
    await awardXp(user.id, 30);
  }
}
