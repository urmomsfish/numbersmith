import { prisma } from "@/lib/prisma";
import { isProUser, FREE_MISTAKE_REVIEWS_PER_WEEK } from "@/lib/subscription";

export async function countMistakeReviewsThisWeek(userId: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return prisma.attempt.count({
    where: { userId, mode: "MISTAKE_REVIEW", createdAt: { gte: weekAgo } },
  });
}

export async function canReviewMistakes(userId: string) {
  if (await isProUser(userId)) return { allowed: true as const };
  const used = await countMistakeReviewsThisWeek(userId);
  return used < FREE_MISTAKE_REVIEWS_PER_WEEK
    ? { allowed: true as const, remaining: FREE_MISTAKE_REVIEWS_PER_WEEK - used }
    : { allowed: false as const, remaining: 0 };
}
