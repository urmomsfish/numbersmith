import "server-only";
import { prisma } from "@/lib/prisma";

/** Topic mastery uses an exponential moving average so recent performance
 * matters more than stale history, while still being smooth (no wild swings
 * from a single lucky or unlucky problem). */
const EMA_ALPHA = 0.25;

export async function updateTopicMastery(userId: string, topicId: string, correct: boolean) {
  const existing = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId } },
  });

  const outcome = correct ? 100 : 0;
  const newMastery = existing
    ? Math.round(existing.masteryPercent * (1 - EMA_ALPHA) + outcome * EMA_ALPHA)
    : Math.round(50 * (1 - EMA_ALPHA) + outcome * EMA_ALPHA);

  return prisma.topicMastery.upsert({
    where: { userId_topicId: { userId, topicId } },
    update: {
      masteryPercent: Math.max(0, Math.min(100, newMastery)),
      problemsAttempted: { increment: 1 },
      problemsCorrect: correct ? { increment: 1 } : undefined,
      lastPracticedAt: new Date(),
    },
    create: {
      userId,
      topicId,
      masteryPercent: Math.max(0, Math.min(100, newMastery)),
      problemsAttempted: 1,
      problemsCorrect: correct ? 1 : 0,
      lastPracticedAt: new Date(),
    },
  });
}

/** Also nudges the parent domain's mastery a smaller amount, so the top-level
 * skill breakdown (Arithmetic, Algebra, ...) reflects subtopic practice. */
export async function updateTopicAndDomainMastery(userId: string, topicId: string, correct: boolean) {
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) return;

  await updateTopicMastery(userId, topicId, correct);

  if (topic.parentId) {
    const existing = await prisma.topicMastery.findUnique({
      where: { userId_topicId: { userId, topicId: topic.parentId } },
    });
    const outcome = correct ? 100 : 0;
    const alpha = 0.15;
    const newMastery = existing
      ? Math.round(existing.masteryPercent * (1 - alpha) + outcome * alpha)
      : Math.round(50 * (1 - alpha) + outcome * alpha);

    await prisma.topicMastery.upsert({
      where: { userId_topicId: { userId, topicId: topic.parentId } },
      update: {
        masteryPercent: Math.max(0, Math.min(100, newMastery)),
        problemsAttempted: { increment: 1 },
        problemsCorrect: correct ? { increment: 1 } : undefined,
        lastPracticedAt: new Date(),
      },
      create: {
        userId,
        topicId: topic.parentId,
        masteryPercent: Math.max(0, Math.min(100, newMastery)),
        problemsAttempted: 1,
        problemsCorrect: correct ? 1 : 0,
        lastPracticedAt: new Date(),
      },
    });
  }
}
