import "server-only";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/engine/xp";

type Criteria = { type: string; threshold?: number; topicSlug?: string };

async function meetsCriteria(userId: string, criteria: Criteria): Promise<boolean> {
  const threshold = criteria.threshold ?? 0;

  switch (criteria.type) {
    case "PROBLEMS_SOLVED": {
      const stats = await prisma.userStats.findUnique({ where: { userId } });
      return (stats?.problemsSolved ?? 0) >= threshold;
    }
    case "STREAK": {
      const stats = await prisma.userStats.findUnique({ where: { userId } });
      return (stats?.longestStreak ?? 0) >= threshold;
    }
    case "ROLLING_ACCURACY": {
      const recent = await prisma.attempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      if (recent.length < 20) return false;
      const correct = recent.filter((a) => a.correct).length;
      return (correct / recent.length) * 100 >= threshold;
    }
    case "FAST_CORRECT": {
      const count = await prisma.attempt.count({
        where: { userId, correct: true, timeSeconds: { lt: 120 } },
      });
      return count >= threshold;
    }
    case "TOPIC_MASTERY": {
      if (!criteria.topicSlug) return false;
      const topic = await prisma.topic.findUnique({ where: { slug: criteria.topicSlug } });
      if (!topic) return false;
      const mastery = await prisma.topicMastery.findUnique({
        where: { userId_topicId: { userId, topicId: topic.id } },
      });
      return (mastery?.masteryPercent ?? 0) >= threshold;
    }
    case "SIMULATIONS_COMPLETED": {
      const count = await prisma.competitionAttempt.count({
        where: { userId, status: "SUBMITTED" },
      });
      return count >= threshold;
    }
    case "PERFECT_SIMULATION": {
      const perfect = await prisma.competitionAttempt.findFirst({
        where: { userId, status: "SUBMITTED" },
      });
      if (!perfect) return false;
      const all = await prisma.competitionAttempt.findMany({ where: { userId, status: "SUBMITTED" } });
      return all.some((a) => a.totalQuestions > 0 && a.correctCount === a.totalQuestions);
    }
    case "PLACEMENT_COMPLETED": {
      const count = await prisma.placementTest.count({ where: { userId, status: "COMPLETED" } });
      return count >= threshold;
    }
    case "DAILY_CHALLENGES": {
      const count = await prisma.dailyChallengeAttempt.count({ where: { userId } });
      return count >= threshold;
    }
    default:
      return false;
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  const [allAchievements, unlocked] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ]);
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
  const newlyUnlocked: typeof allAchievements = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;
    let criteria: Criteria;
    try {
      criteria = JSON.parse(achievement.criteria) as Criteria;
    } catch {
      continue;
    }
    if (await meetsCriteria(userId, criteria)) {
      await prisma.userAchievement.create({ data: { userId, achievementId: achievement.id } });
      await awardXp(userId, achievement.xpReward);
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
