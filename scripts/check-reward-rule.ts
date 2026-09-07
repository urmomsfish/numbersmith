// Exhaustive check of the XP/rating payout rule.
//
//   npm run verify:reward
//
// This guards an economy bug that reached production: rewards were paid per
// submission rather than per problem, so the same problem could be answered
// repeatedly — via the mistake queue or by revisiting /practice/[slug] — for
// unbounded XP and rating. Pro has no daily attempt cap.
//
// Enumerates every combination rather than spot-checking, because the two
// history gates each close a different farming route and it is easy to drop
// one while "simplifying".

import { earnsReward } from "../src/lib/engine/reward";
import type { AttemptMode } from "../src/lib/types";

let failures = 0;
function check(label: string, actual: boolean, expected: boolean) {
  if (actual !== expected) {
    console.log(`   ✗ ${label}: got ${actual}, expected ${expected}`);
    failures++;
  }
}

const MODES: AttemptMode[] = [
  "PRACTICE",
  "DAILY_CHALLENGE",
  "LESSON",
  "SIMULATION",
  "PLACEMENT",
  "MISTAKE_REVIEW",
];

// solvedBefore implies attemptedBefore, so that pair is not a real state.
const HISTORY: Array<{ attemptedBefore: boolean; solvedBefore: boolean; label: string }> = [
  { attemptedBefore: false, solvedBefore: false, label: "never seen" },
  { attemptedBefore: true, solvedBefore: false, label: "tried, never solved" },
  { attemptedBefore: true, solvedBefore: true, label: "already solved" },
];

console.log("mode              history               correct  wrong");
for (const mode of MODES) {
  for (const h of HISTORY) {
    const onCorrect = earnsReward({ mode, correct: true, ...h });
    const onWrong = earnsReward({ mode, correct: false, ...h });

    const expectCorrect = mode === "MISTAKE_REVIEW" ? false : !h.solvedBefore;
    const expectWrong = mode === "MISTAKE_REVIEW" ? false : !h.attemptedBefore;

    check(`${mode}/${h.label}/correct`, onCorrect, expectCorrect);
    check(`${mode}/${h.label}/wrong`, onWrong, expectWrong);
    console.log(
      `  ${mode.padEnd(16)} ${h.label.padEnd(20)} ${String(onCorrect).padEnd(8)} ${onWrong}`
    );
  }
}

// The properties that actually matter, stated directly.
console.log("\nfarming routes:");
const farmSolved = earnsReward({ mode: "PRACTICE", correct: true, attemptedBefore: true, solvedBefore: true });
check("re-solving a solved problem pays nothing", farmSolved, false);
console.log(`  re-solve an already-solved problem      -> ${farmSolved ? "PAYS (exploit!)" : "pays nothing ✓"}`);

const farmWrong = earnsReward({ mode: "PRACTICE", correct: false, attemptedBefore: true, solvedBefore: false });
check("re-failing the same problem pays nothing", farmWrong, false);
console.log(`  re-fail the same problem for participation -> ${farmWrong ? "PAYS (exploit!)" : "pays nothing ✓"}`);

const review = earnsReward({ mode: "MISTAKE_REVIEW", correct: true, attemptedBefore: true, solvedBefore: false });
check("mistake review pays nothing", review, false);
console.log(`  mistake review                           -> ${review ? "PAYS (exploit!)" : "pays nothing ✓"}`);

// The case that must still pay, or struggling students are punished.
const redemption = earnsReward({ mode: "PRACTICE", correct: true, attemptedBefore: true, solvedBefore: false });
check("finally solving a previously-missed problem still pays", redemption, true);
console.log(`  finally solving one you'd missed         -> ${redemption ? "pays ✓" : "PAYS NOTHING (too strict!)"}`);

const firstTry = earnsReward({ mode: "PRACTICE", correct: true, attemptedBefore: false, solvedBefore: false });
check("first correct solve pays", firstTry, true);
console.log(`  first correct solve                      -> ${firstTry ? "pays ✓" : "PAYS NOTHING (broken!)"}`);

console.log(`\n${failures === 0 ? "✓ payout rule holds in all states" : `✗ ${failures} FAILURE(S)`}`);
if (failures > 0) process.exitCode = 1;
