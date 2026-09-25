/** The Elo arithmetic behind ratings, with no database and no `server-only`,
 * so both the rating engine and the contest-score predictor can build on one
 * copy — and so `npm run verify:predictor` can exercise it directly.
 *
 * This exists because the two features make claims about the same number. The
 * rating engine says how much a student gains for solving a difficulty-7
 * problem; the predictor says what a rating implies about their AMC 8 score.
 * Both rest on treating a difficulty-d problem as an opponent rated
 * PROBLEM_RATING_BASE + PROBLEM_RATING_STEP x d. Two copies of that would let
 * the product tell a student two different stories about one rating, so there
 * is one.
 */

export const MIN_RATING = 600;
export const MAX_RATING = 2400;

/** A difficulty-1 problem rates 1020 and a difficulty-10 problem 2100, which
 * spans the range a competition student moves through. */
const PROBLEM_RATING_BASE = 900;
const PROBLEM_RATING_STEP = 120;

export function problemRatingFor(difficulty: number): number {
  return PROBLEM_RATING_BASE + PROBLEM_RATING_STEP * difficulty;
}

/** Probability this rating solves a problem of this difficulty — the standard
 * logistic expectation, and the single definition both features use. */
export function solveProbability(rating: number, difficulty: number): number {
  return 1 / (1 + Math.pow(10, (problemRatingFor(difficulty) - rating) / 400));
}

export function clampRating(value: number): number {
  return Math.max(MIN_RATING, Math.min(MAX_RATING, Math.round(value)));
}

/** How much the rating moves. Solving something hard earns more; missing
 * something easy costs more. Anchors the rating to "difficulty this student
 * reliably solves" without needing an opponent model. */
export const RATING_K = 24;

export function ratingDelta(
  currentRating: number,
  problemDifficulty: number,
  correct: boolean
): number {
  const expected = solveProbability(currentRating, problemDifficulty);
  return Math.round(RATING_K * ((correct ? 1 : 0) - expected));
}
