import "server-only";
import { prisma } from "@/lib/prisma";

const XP_PER_LEVEL = 250;

export function levelForXp(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(totalXp: number): { current: number; needed: number } {
  const current = totalXp % XP_PER_LEVEL;
  return { current, needed: XP_PER_LEVEL };
}

/** Awards XP and recomputes level. Returns the updated stats row and whether the user leveled up. */
export async function awardXp(userId: string, amount: number) {
  const stats = await prisma.userStats.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const newTotal = stats.totalXp + amount;
  const newLevel = levelForXp(newTotal);
  const leveledUp = newLevel > stats.level;

  const updated = await prisma.userStats.update({
    where: { userId },
    data: { totalXp: newTotal, level: newLevel },
  });

  return { stats: updated, leveledUp, xpAwarded: amount };
}

/** Updates streak + last-active-date bookkeeping. Safe to call multiple times per day (idempotent per day). */
export async function touchDailyActivity(userId: string) {
  const stats = await prisma.userStats.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last = stats.lastActiveDate
    ? new Date(
        stats.lastActiveDate.getFullYear(),
        stats.lastActiveDate.getMonth(),
        stats.lastActiveDate.getDate()
      )
    : null;

  if (last && last.getTime() === today.getTime()) {
    return stats; // already recorded today
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const isConsecutive = last && today.getTime() - last.getTime() === oneDayMs;
  const newStreak = isConsecutive ? stats.currentStreak + 1 : 1;

  return prisma.userStats.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastActiveDate: now,
    },
  });
}

export async function recordProblemOutcome(userId: string, correct: boolean) {
  await prisma.userStats.upsert({
    where: { userId },
    update: {
      problemsSolved: { increment: 1 },
      problemsCorrect: correct ? { increment: 1 } : undefined,
    },
    create: {
      userId,
      problemsSolved: 1,
      problemsCorrect: correct ? 1 : 0,
    },
  });
}
