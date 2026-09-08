/** Turning a skill estimate into an honest progress number.
 *
 * `TopicMastery.masteryPercent` is an accuracy estimate — an exponential moving
 * average of whether the student got recent problems right. It answers "how
 * good are they at this?", and it can reach 100 after three questions.
 *
 * That is the wrong number to put behind the words "% mastered". Shipped as-is
 * it produced a dashboard reading "86% mastered" on AMC 8 for a student who had
 * done a twelve-question placement test, and 100% on six domains for a student
 * with *no* practice attempts at all. Accuracy is not coverage; a confident
 * estimate from a tiny sample is still a tiny sample.
 *
 * So progress here is the skill estimate discounted by how much practice
 * actually backs it. The discount is n / (n + HALF_EVIDENCE): zero problems
 * gives zero progress, and it approaches the raw estimate as real work
 * accumulates. Mastery has to be earned by doing the material, which is what
 * the placement test is explicitly *not* meant to substitute for.
 */

/** Problems in a topic at which the estimate is trusted halfway.
 *
 * At n = 25 a student sees half their accuracy as progress; ~100 problems gives
 * 80%, ~225 gives 90%. Calibrated so that genuinely mastering a competition's
 * worth of material is several hundred problems rather than an afternoon, while
 * a committed student still sees the number move every session. */
export const HALF_EVIDENCE = 25;

/** How much the accuracy estimate is trusted, from 0 (no evidence) to <1. */
export function evidenceWeight(problemsAttempted: number): number {
  const n = Math.max(0, problemsAttempted);
  return n / (n + HALF_EVIDENCE);
}

/** Displayed "% mastered" for one topic. */
export function topicProgress(masteryPercent: number, problemsAttempted: number): number {
  return Math.round(masteryPercent * evidenceWeight(problemsAttempted));
}

export type TopicWeightRow = {
  topicId: string;
  weight: number;
};

export type MasteryRow = {
  masteryPercent: number;
  problemsAttempted: number;
};

/** Weighted progress across a competition's topics.
 *
 * A topic with no mastery row contributes 0 rather than a flattering default.
 * The previous version substituted 35 for unseen topics, which meant a brand new
 * account already showed a third of the way to mastery on every competition.
 */
export function competitionProgress(
  topics: TopicWeightRow[],
  masteryByTopicId: Map<string, MasteryRow>
): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const t of topics) {
    const m = masteryByTopicId.get(t.topicId);
    const progress = m ? topicProgress(m.masteryPercent, m.problemsAttempted) : 0;
    weightedSum += progress * t.weight;
    weightTotal += t.weight;
  }
  if (weightTotal === 0) return 0;
  return Math.round(weightedSum / weightTotal);
}

/** Short label for how solid an estimate is, so the UI can say why a number is
 * low rather than leaving the student to assume they are bad at the subject. */
export function evidenceLabel(problemsAttempted: number): string {
  if (problemsAttempted === 0) return "no practice yet";
  if (problemsAttempted < 10) return "early estimate";
  if (problemsAttempted < HALF_EVIDENCE * 2) return "building confidence";
  return "well established";
}
