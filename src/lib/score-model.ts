/**
 * The scoring model behind the contest-score predictor: pure arithmetic, no
 * database and no "server-only", so `npm run verify:predictor` can exercise it
 * directly. The database half lives in engine/score-predictor.ts.
 *
 * A rating of 1480 tells a student nothing. "About 18 out of 25 on AMC 8, and
 * Honor Roll is around 19" tells them what to do this week. The rating is
 * already Elo-shaped, so this reuses that model rather than inventing a second
 * scale that could disagree with the first.
 *
 * Method: the rating engine treats a difficulty-d problem as an opponent rated
 * 900 + 120d, so the chance of solving it is the standard logistic expectation.
 * A paper is a known multiset of difficulties, so the expected number correct
 * is the sum of those probabilities — no simulation and no fitted curve.
 * Summing probabilities is exact for an expectation even though individual
 * outcomes are not independent in practice.
 *
 * The honest limits, which the UI states rather than hides:
 *   - it assumes the rating is accurate, which needs real practice behind it
 *   - it models knowledge, not exam day: no clock, no nerves, no slips
 *   - the cutoffs are historical approximations, not published constants —
 *     AMC 8 Honor Roll and AIME qualification move every year
 */

import { solveProbability } from "@/lib/rating-model";

export { solveProbability };

/** Expected number of correct answers on a paper of these difficulties. */
export function expectedCorrect(rating: number, difficulties: number[]): number {
  return difficulties.reduce((sum, d) => sum + solveProbability(rating, d), 0);
}

export type Benchmark = { label: string; raw: number; note?: string };

/** How a contest converts questions right into the score people quote, plus the
 * marks worth aiming at.
 *
 * `raw` is always in questions-correct so one comparison works everywhere; the
 * display string is what a student would recognise. AMC 10/12 award 6 points a
 * correct answer and 1.5 for a blank, so a 100 needs about 17 right if nothing
 * is left blank — the conversion below assumes no blanks, which understates a
 * careful student who skips rather than guesses. */
export type ScoringModel = {
  questions: number;
  /** Renders an expected-correct count as the score a student would quote. */
  display: (correct: number) => string;
  benchmarks: Benchmark[];
};

export const SCORING: Record<string, ScoringModel> = {
  amc8: {
    questions: 25,
    display: (c) => `${Math.round(c)}/25`,
    benchmarks: [
      { label: "Honor Roll", raw: 19, note: "roughly the top 5%; moves each year" },
      { label: "Distinguished Honor Roll", raw: 22, note: "roughly the top 1%" },
    ],
  },
  amc10: {
    questions: 25,
    display: (c) => `${Math.round(c)}/25 (about ${Math.round(c * 6)} points)`,
    benchmarks: [
      { label: "AIME qualification", raw: 17, note: "about 100 points; the real cutoff shifts yearly" },
      { label: "Distinction", raw: 20, note: "about 120 points" },
    ],
  },
  amc12: {
    questions: 25,
    display: (c) => `${Math.round(c)}/25 (about ${Math.round(c * 6)} points)`,
    benchmarks: [
      { label: "AIME qualification", raw: 15, note: "about 90 points; the real cutoff shifts yearly" },
      { label: "Distinction", raw: 19, note: "about 115 points" },
    ],
  },
  mathcounts: {
    questions: 30,
    display: (c) => `${Math.round(c)}/30 on Sprint`,
    benchmarks: [{ label: "Typical chapter qualifier", raw: 20 }],
  },
  aime: {
    questions: 15,
    display: (c) => `${Math.round(c)}/15`,
    benchmarks: [
      { label: "USAMO/USAJMO index range", raw: 8, note: "combined with an AMC score, so indicative only" },
    ],
  },
};

