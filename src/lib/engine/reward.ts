import type { AttemptMode } from "@/lib/types";

/** Whether an attempt should pay XP and rating.
 *
 * Rewards are per PROBLEM, not per submission. Without that, the same problem
 * can be answered repeatedly — through the mistake queue, or just by revisiting
 * /practice/[slug] — for unbounded XP and rating. Pro has no daily attempt cap,
 * so "unbounded" is literal. This shipped and was found in production.
 *
 * Both history gates are needed; either alone is farmable:
 *   - `solvedBefore` stops re-collecting the reward for a problem already
 *     solved.
 *   - `attemptedBefore` stops farming the flat participation XP by answering
 *     the same problem wrong over and over.
 *
 * Getting a problem right after previously failing it still pays in full —
 * that is the case that most deserves the reward, and the one a naive
 * "first attempt only" rule would wrongly refuse.
 *
 * Kept as a pure function so the rule can be tested exhaustively without a
 * database or a request context. */
export function earnsReward(input: {
  mode: AttemptMode;
  correct: boolean;
  /** Any prior attempt on this problem by this user. */
  attemptedBefore: boolean;
  /** Any prior *correct* attempt on this problem by this user. */
  solvedBefore: boolean;
}): boolean {
  // Redundant with the history gates (a queued mistake implies a prior
  // attempt), but stated explicitly: this is the rule users are told about, and
  // it shouldn't rely on that implication continuing to hold.
  if (input.mode === "MISTAKE_REVIEW") return false;
  return input.correct ? !input.solvedBefore : !input.attemptedBefore;
}
