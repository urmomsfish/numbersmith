import "server-only";
import { prisma } from "@/lib/prisma";
import type { DailyChallengeTrack } from "@/lib/types";

const TRACK_DIFFICULTY: Record<DailyChallengeTrack, [number, number]> = {
  ELEMENTARY: [1, 2],
  MIDDLE_SCHOOL: [2, 4],
  AMC8: [3, 5],
  AMC10: [4, 6],
  AMC12: [5, 7],
  AIME: [6, 9],
  OLYMPIAD: [8, 10],
};

/** Chooses the daily-challenge track that matches the student's grade and rating,
 * so an elementary student and an AIME student get appropriately scaled problems. */
export function trackForStudent(grade: number, rating: number): DailyChallengeTrack {
  if (rating >= 1900) return "OLYMPIAD";
  if (rating >= 1750) return "AIME";
  if (grade >= 11 || rating >= 1650) return "AMC12";
  if (grade >= 9 || rating >= 1500) return "AMC10";
  if (grade >= 6 || rating >= 1300) return "AMC8";
  if (grade >= 4) return "MIDDLE_SCHOOL";
  return "ELEMENTARY";
}

function utcMidnight(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Deterministically picks a problem for a track/date pair so every student on
 * the same track sees the same daily challenge, with no AI or randomness. */
export async function getOrCreateDailyChallenge(track: DailyChallengeTrack, date = new Date()) {
  const day = utcMidnight(date);

  const existing = await prisma.dailyChallenge.findUnique({
    where: { date_track: { date: day, track } },
    include: { problem: { include: { topic: true } } },
  });
  if (existing) return existing;

  const [min, max] = TRACK_DIFFICULTY[track];
  const candidates = await prisma.problem.findMany({
    where: { isPublished: true, difficulty: { gte: min, lte: max } },
    orderBy: { slug: "asc" },
    select: { id: true },
  });

  if (candidates.length === 0) {
    const anyProblem = await prisma.problem.findFirst({ where: { isPublished: true } });
    if (!anyProblem) return null;
    return prisma.dailyChallenge.create({
      data: { date: day, track, problemId: anyProblem.id },
      include: { problem: { include: { topic: true } } },
    });
  }

  const daysSinceEpoch = Math.floor(day.getTime() / (24 * 60 * 60 * 1000));
  const chosen = candidates[daysSinceEpoch % candidates.length];

  return prisma.dailyChallenge.create({
    data: { date: day, track, problemId: chosen.id },
    include: { problem: { include: { topic: true } } },
  });
}

export async function getTodaysChallengeForUser(userId: string) {
  const [profile, rating] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.rating.findUnique({ where: { userId_category: { userId, category: "OVERALL" } } }),
  ]);

  const track = trackForStudent(profile?.grade ?? 7, rating?.value ?? 1000);
  const challenge = await getOrCreateDailyChallenge(track);
  if (!challenge) return null;

  const attempt = await prisma.dailyChallengeAttempt.findUnique({
    where: { userId_dailyChallengeId: { userId, dailyChallengeId: challenge.id } },
  });

  return { challenge, track, attempt };
}
