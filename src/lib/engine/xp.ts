import "server-only";
import { prisma } from "@/lib/prisma";
import { streakDayIndex } from "@/lib/streak";

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
  // Day boundaries come from streakDayIndex (00:00 UTC-7) rather than the
  // server's local calendar, so the rollover is the same for every user and
  // doesn't move with the deploy environment's timezone.
  const today = streakDayIndex(now);
  const last = stats.lastActiveDate ? streakDayIndex(stats.lastActiveDate) : null;

  if (last === today) {
    return stats; // already recorded today
  }

  const isConsecutive = last !== null && today - last === 1;
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
