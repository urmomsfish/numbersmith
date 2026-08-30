import "server-only";
import { prisma } from "@/lib/prisma";

const MIN_RATING = 600;
const MAX_RATING = 2400;

export function clampRating(value: number): number {
  return Math.max(MIN_RATING, Math.min(MAX_RATING, Math.round(value)));
}

/** Elo-inspired delta: harder problems solved correctly earn more, and
 * missing an easy problem (relative to current rating) costs more. This
 * keeps the rating anchored to "difficulty the student can reliably solve"
 * without requiring an opponent model. */
export function ratingDelta(currentRating: number, problemDifficulty: number, correct: boolean): number {
  const problemRating = 900 + problemDifficulty * 120; // difficulty 1 -> 1020, 10 -> 2100
  const expected = 1 / (1 + Math.pow(10, (problemRating - currentRating) / 400));
  const K = 24;
  const actual = correct ? 1 : 0;
  return Math.round(K * (actual - expected));
}

export async function setRating(userId: string, category: string, value: number, reason: string) {
  const clamped = clampRating(value);
  const prev = await prisma.rating.findUnique({ where: { userId_category: { userId, category } } });
  const delta = clamped - (prev?.value ?? 1000);

  await prisma.rating.upsert({
    where: { userId_category: { userId, category } },
    update: { value: clamped },
    create: { userId, category, value: clamped },
  });

  await prisma.ratingHistory.create({
    data: { userId, category, value: clamped, delta, reason },
  });

  return clamped;
}

export async function applyRatingDelta(
  userId: string,
  category: string,
  problemDifficulty: number,
  correct: boolean,
  reason: string
) {
  const existing = await prisma.rating.upsert({
    where: { userId_category: { userId, category } },
    update: {},
    create: { userId, category, value: 1000 },
  });

  const delta = ratingDelta(existing.value, problemDifficulty, correct);
  const newValue = clampRating(existing.value + delta);

  await prisma.rating.update({ where: { userId_category: { userId, category } }, data: { value: newValue } });
  await prisma.ratingHistory.create({
    data: { userId, category, value: newValue, delta: newValue - existing.value, reason },
  });

  return { value: newValue, delta: newValue - existing.value };
}
