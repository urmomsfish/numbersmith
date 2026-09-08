/**
 * Verification for progress reporting and the study plan's shape.
 *
 * The bug this guards against shipped and was visible on the dashboard: a
 * student who had answered a twelve-question placement test and practised
 * nothing saw "86% mastered" on AMC 8, and one account with *zero* practice
 * attempts showed 100% across six domains. Accuracy was being displayed as
 * coverage.
 *
 * Run with: npm run verify:progress
 */
import {
  evidenceWeight,
  topicProgress,
  competitionProgress,
  HALF_EVIDENCE,
} from "../src/lib/engine/progress";
// From plan-schedule, not study-plan: the latter carries the `server-only`
// guard, which refuses to load outside a Next request context.
import { PLAN_WEEKS, PLAN_PHASES, phaseForWeek } from "../src/lib/engine/plan-schedule";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.log(`  ✗ ${label}: got ${String(actual)}, expected ${String(expected)}`);
    failures++;
  }
}
function expect(label: string, condition: boolean) {
  if (!condition) {
    console.log(`  ✗ ${label}`);
    failures++;
  }
}

console.log("1. no practice means no progress");
// The headline case. Perfect accuracy from a placement test alone must not read
// as mastery.
check("100% accuracy, 0 problems => 0%", topicProgress(100, 0), 0);
check("86% accuracy, 0 problems => 0%", topicProgress(86, 0), 0);
check("0 problems has zero evidence weight", evidenceWeight(0), 0);

console.log("2. progress is bounded by accuracy and rises with practice");
expect("progress never exceeds accuracy", [0, 1, 5, 25, 100, 1000].every((n) => topicProgress(80, n) <= 80));
expect(
  "progress is monotonic in practice volume",
  [0, 1, 2, 5, 10, 25, 50, 100, 250, 1000]
    .map((n) => topicProgress(80, n))
    .every((v, i, arr) => i === 0 || v >= arr[i - 1])
);
check(`half evidence at n=${HALF_EVIDENCE} halves the estimate`, topicProgress(80, HALF_EVIDENCE), 40);
expect("100 problems reads about 80% of accuracy", Math.abs(topicProgress(100, 100) - 80) <= 1);
expect("mastery is reachable with sustained work", topicProgress(95, 600) >= 90);

console.log("3. a wrong answer rate cannot be inflated by volume");
expect("50% accuracy stays below 50 however much is practised", [10, 100, 10000].every((n) => topicProgress(50, n) <= 50));

console.log("4. competition progress");
const topics = [
  { topicId: "a", weight: 5 },
  { topicId: "b", weight: 3 },
  { topicId: "c", weight: 2 },
];
check("no mastery rows at all => 0%", competitionProgress(topics, new Map()), 0);
// A topic with no row must contribute 0, not a flattering default. The previous
// implementation substituted 35, so a brand new account showed a third mastered.
// Derived, not hardcoded: evidence weight approaches 1 without reaching it, so
// even 1000 problems at 100% accuracy is 98 rather than 100.
check(
  "unseen topics contribute 0, not a default",
  competitionProgress(topics, new Map([["a", { masteryPercent: 100, problemsAttempted: 1000 }]])),
  Math.round((topicProgress(100, 1000) * 5 + 0 * 3 + 0 * 2) / 10)
);
check("empty topic list => 0%", competitionProgress([], new Map()), 0);
// The exact scenario from the screenshot: placement only, no practice.
check(
  "placement-only student reads 0% on a competition",
  competitionProgress(
    topics,
    new Map([
      ["a", { masteryPercent: 86, problemsAttempted: 0 }],
      ["b", { masteryPercent: 90, problemsAttempted: 0 }],
      ["c", { masteryPercent: 100, problemsAttempted: 0 }],
    ])
  ),
  0
);

console.log("5. study plan spans a real training arc");
expect("plan is longer than one week", PLAN_WEEKS > 1);
check("plan is 12 weeks", PLAN_WEEKS, 12);
check("first week is Foundations", phaseForWeek(1).name, "Foundations");
check("last week is Competition prep", phaseForWeek(PLAN_WEEKS).name, "Competition prep");
expect("every week maps to a phase", Array.from({ length: PLAN_WEEKS }, (_, i) => phaseForWeek(i + 1)).every(Boolean));
expect(
  "phases are ordered and start within the plan",
  PLAN_PHASES.every((p, i) => p.startWeek >= 1 && p.startWeek <= PLAN_WEEKS && (i === 0 || p.startWeek > PLAN_PHASES[i - 1].startWeek))
);
expect(
  "phase assignment never goes backwards",
  Array.from({ length: PLAN_WEEKS }, (_, i) => PLAN_PHASES.indexOf(phaseForWeek(i + 1))).every(
    (v, i, arr) => i === 0 || v >= arr[i - 1]
  )
);

console.log(failures === 0 ? "\nProgress model OK.\n" : `\n${failures} failure(s).\n`);
process.exit(failures === 0 ? 0 : 1);
