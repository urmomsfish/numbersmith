/**
 * Verification for typed-answer grading.
 *
 * `checkAnswer` decides whether a student was right. A bug here is worse than a
 * wrong problem: it silently marks correct work incorrect, costs XP and rating,
 * and looks to the student like the app is broken rather than the question.
 *
 * Three independent checks run here:
 *
 *   1. An equivalence table — pairs that MUST grade as equal, and pairs that
 *      MUST NOT. The negative cases are the important half: they pin down that
 *      leniency about notation never became leniency about the answer.
 *   2. Round-trip over the whole bank — every stored typed answer must grade
 *      itself correct. This catches any answer shape the canonicaliser mangles.
 *   3. Perturbation over the whole bank — a deliberately wrong answer must
 *      never grade correct.
 *
 * Run with: npm run verify:grading
 */
import { canonicalizeAnswer, answersMatch } from "../src/lib/engine/answer-format";
import { PROBLEMS } from "../prisma/seed-data/problems";
import { OLYMPIAD_PROBLEMS } from "../prisma/seed-data/problems-olympiad";
import { GENERATED_PROBLEMS } from "../prisma/seed-data/generators";

let failures = 0;
const fail = (msg: string) => {
  console.error(`  FAIL  ${msg}`);
  failures++;
};

// ---------------------------------------------------------------------------
// 1. Equivalence table
// ---------------------------------------------------------------------------
const SAME: [string, string][] = [
  // Radicals: every spelling a student might type.
  ["7√11", "7√11"],
  ["7 sqrt 11", "7√11"],
  ["7sqrt11", "7√11"],
  ["7*sqrt(11)", "7√11"],
  ["7 × √11", "7√11"],
  ["7root11", "7√11"],
  ["√161", "√161"],
  ["sqrt(161)", "√161"],
  ["sqrt 161", "√161"],
  ["1√161", "√161"],
  // Pi: coefficient placement should not matter.
  ["(36/5)π", "(36/5)π"],
  ["36π/5", "(36/5)π"],
  ["36/5 π", "(36/5)π"],
  ["36/5pi", "(36/5)π"],
  ["7.2π", "(36/5)π"],
  ["7.2 pi", "(36/5)π"],
  ["12π", "12π"],
  ["12 pi", "12π"],
  ["π", "π"],
  ["1pi", "π"],
  // Plain numbers and fractions.
  ["21/32", "21/32"],
  ["42/64", "21/32"],
  ["0.5", "1/2"],
  ["1/2", "0.5"],
  ["  9 ", "9"],
  ["1,024", "1024"],
  ["$25", "25"],
  ["-3", "−3"],
  // Non-numeric answers keep the old case-insensitive text behaviour.
  ["(3, 2)", "(3, 2)"],
  ["2:3", "2:3"],
  ["2:3 ", "2:3"],
];

const DIFFERENT: [string, string][] = [
  // The whole point of "simplify completely": an unsimplified radical is wrong.
  ["√539", "7√11"],
  ["√44", "2√11"],
  ["11√7", "7√11"],
  ["7√12", "7√11"],
  ["77", "7√11"],
  ["7", "7√11"],
  // Pi must not be dropped or confused with a bare number.
  ["36/5", "(36/5)π"],
  ["12", "12π"],
  ["12π", "12"],
  ["5/36 π", "(36/5)π"],
  ["13π", "12π"],
  // A radical is not a pi.
  ["7π", "7√11"],
  // Ordinary wrong answers.
  ["22/32", "21/32"],
  ["9", "8"],
  ["(2, 3)", "(3, 2)"],
  ["3:2", "2:3"],
  ["", "5"],
];

console.log("1. equivalence table");
for (const [given, expected] of SAME) {
  if (!answersMatch(given, expected)) {
    fail(`"${given}" should match "${expected}" but did not (${JSON.stringify(canonicalizeAnswer(given))} vs ${JSON.stringify(canonicalizeAnswer(expected))})`);
  }
}
for (const [given, expected] of DIFFERENT) {
  if (answersMatch(given, expected)) {
    fail(`"${given}" must NOT match "${expected}" but did`);
  }
}
console.log(`   ${SAME.length} equivalent pairs, ${DIFFERENT.length} non-equivalent pairs`);

// ---------------------------------------------------------------------------
// 2 & 3. Round-trip and perturbation over the real bank
// ---------------------------------------------------------------------------
const typed = [...PROBLEMS, ...GENERATED_PROBLEMS, ...OLYMPIAD_PROBLEMS].filter(
  (p) => p.format !== "MULTIPLE_CHOICE"
);

console.log(`\n2. round-trip over ${typed.length} typed answers`);
let roundTripFails = 0;
for (const p of typed) {
  if (!answersMatch(p.answer, p.answer)) {
    if (roundTripFails < 10) fail(`${p.slug}: stored answer "${p.answer}" does not grade itself correct`);
    roundTripFails++;
  }
}
if (roundTripFails > 10) console.error(`  … and ${roundTripFails - 10} more`);
if (roundTripFails === 0) console.log("   all stored answers grade themselves correct");

console.log(`\n3. perturbation over ${typed.length} typed answers`);
let perturbFails = 0;
for (const p of typed) {
  // Append a digit — changes the value for every shape we model, and for a
  // text answer changes the string.
  const wrong = `${p.answer}7`;
  if (wrong !== p.answer && answersMatch(wrong, p.answer)) {
    if (perturbFails < 10) fail(`${p.slug}: wrong answer "${wrong}" graded correct against "${p.answer}"`);
    perturbFails++;
  }
}
if (perturbFails > 10) console.error(`  … and ${perturbFails - 10} more`);
if (perturbFails === 0) console.log("   no perturbed answer graded correct");

// ---------------------------------------------------------------------------
// 4. Every typed answer must be enterable from the palette + keyboard
// ---------------------------------------------------------------------------
import { PALETTE_CHARS } from "../src/lib/answer-palette";

console.log("\n4. every typed answer is enterable");
const KEYBOARD = new Set("0123456789./-+*(), :abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
const enterable = new Set([...KEYBOARD, ...PALETTE_CHARS]);
const unenterable = new Map<string, string>();
for (const p of typed) {
  for (const ch of p.answer) {
    if (!enterable.has(ch)) unenterable.set(ch, p.slug);
  }
}
if (unenterable.size > 0) {
  for (const [ch, slug] of unenterable) {
    fail(`character "${ch}" (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}) appears in ${slug} but is on neither the keyboard nor the palette`);
  }
} else {
  console.log("   every character is typeable or on the palette");
}

console.log(
  failures === 0
    ? "\nAnswer grading OK."
    : `\n${failures} grading failure(s).`
);
process.exit(failures === 0 ? 0 : 1);
