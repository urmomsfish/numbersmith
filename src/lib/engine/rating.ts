import "server-only";
import { prisma } from "@/lib/prisma";
import { clampRating, ratingDelta } from "@/lib/rating-model";

// The Elo arithmetic lives in src/lib/rating-model.ts so the contest-score
// predictor builds on the same definition rather than a second copy of it.
// Re-exported here because every existing caller imports it from this module.
export { clampRating, ratingDelta };

/** The admin account shows a fixed rating instead of one earned through
 * practice. Its numbers are demo and support surface, where a value that
 * drifts every time someone tests a problem is noise rather than signal.
 *
 * Pinned by role rather than by user id so it survives the account being
 * recreated — note that consequently *any* ADMIN account is pinned, not just
 * admin@numbersmith.app. Nothing else in the app reads another user's
 * rating, so this only ever affects what the admin sees about themselves. */
const PINNED_ADMIN_RATING = 2200;

/** Resolves to the pinned value when this user's rating is fixed, else null.
 *
 * Callers must write this value to the row rather than just returning it:
 * dashboard, stats, study plan and the daily challenge all read
 * prisma.rating directly, so a pin that lived only in a return value would
 * show up in some places and not others. */
async function pinnedRatingFor(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "ADMIN" ? PINNED_ADMIN_RATING : null;
}

/** Writes the pinned value to the row, leaving rating history untouched —
 * a pinned rating has no deltas worth charting. */
async function writePinned(userId: string, category: string, value: number) {
  await prisma.rating.upsert({
    where: { userId_category: { userId, category } },
    update: { value },
    create: { userId, category, value },
  });
}

export async function setRating(userId: string, category: string, value: number, reason: string) {
  const pinned = await pinnedRatingFor(userId);
  if (pinned !== null) {
    await writePinned(userId, category, pinned);
    return pinned;
  }

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
  const pinned = await pinnedRatingFor(userId);
  if (pinned !== null) {
    await writePinned(userId, category, pinned);
    return { value: pinned, delta: 0 };
  }

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
