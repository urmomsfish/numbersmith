// Asserts the contest-score predictor agrees with the rating engine it claims
// to reuse, and that its output is ordered the way a student would expect.
//
//   npm run verify:predictor
//
// The risk this guards against is a second scale drifting from the first. The
// predictor converts a rating into "about 18/25 on AMC 8"; the rating engine
// converts the same rating into how much you gain for solving a problem. Both
// model a difficulty-d problem as an opponent rated 900 + 120d. If one is
// edited and the other is not, the product tells a student two different
// stories about the same number — which is worse than telling them neither.
//
// So the first check re-derives the solve probability from the rating engine's
// OWN expectation term rather than from a copy of the formula.

import { solveProbability, expectedCorrect, SCORING } from "../src/lib/score-model";
import { ratingDelta } from "../src/lib/rating-model";

let failures = 0;
const ok = (label: string, pass: boolean, detail = "") => {
  if (!pass) failures++;
  console.log(`  ${pass ? "✓" : "✗"} ${label}${detail ? " — " + detail : ""}`);
};
const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

console.log("\nAgreement with the rating engine");
{
  // ratingDelta is K * (actual - expected) with K = 24. Solving a problem when
  // the expectation is p yields round(24 * (1 - p)); missing it yields
  // round(24 * (0 - p)). Recovering p from those two values must match
  // solveProbability, or the two models have diverged.
  let worst = 0;
  for (const rating of [700, 1000, 1300, 1600, 1900, 2200]) {
    for (let d = 1; d <= 10; d++) {
      // Missing a problem costs round(24 * (0 - p)), so p = -loss / 24 up to
      // rounding — recovering the expectation from the engine's own output
      // rather than from a second copy of the formula.
      const loss = ratingDelta(rating, d, false);
      const recovered = -loss / 24;
      const direct = solveProbability(rating, d);
      worst = Math.max(worst, Math.abs(recovered - direct));
      // Rounding to whole rating points costs at most 0.5/24 of probability.
      if (Math.abs(recovered - direct) > 0.5 / 24 + 1e-9) {
        ok(`rating ${rating}, difficulty ${d}`, false, `recovered ${recovered.toFixed(4)} vs ${direct.toFixed(4)}`);
      }
    }
  }
  ok("solve probability matches the rating engine's expectation", worst <= 0.5 / 24 + 1e-9,
     `largest gap ${worst.toFixed(5)}, within rounding`);
}

console.log("\nProbability behaves like a probability");
{
  ok("a problem rated exactly at the student is a coin flip",
     close(solveProbability(900 + 120 * 5, 5), 0.5, 1e-12));
  let monotonicInRating = true;
  for (let r = 600; r < 2400; r += 25) {
    if (solveProbability(r + 25, 5) <= solveProbability(r, 5)) monotonicInRating = false;
  }
  ok("higher rating always means a better chance", monotonicInRating);
  let monotonicInDifficulty = true;
  for (let d = 1; d < 10; d++) {
    if (solveProbability(1500, d + 1) >= solveProbability(1500, d)) monotonicInDifficulty = false;
  }
  ok("harder problems are always less likely", monotonicInDifficulty);
  ok("stays inside (0, 1) at both extremes",
     solveProbability(600, 10) > 0 && solveProbability(2400, 1) < 1);
}

console.log("\nExpected score is bounded and ordered");
{
  const ramp = (f: number, c: number, n: number) =>
    Array.from({ length: n }, (_, i) => Math.round(f + (i / (n - 1)) * (c - f)));
  const amc8 = ramp(2, 8, 25);

  ok("never exceeds the number of questions", expectedCorrect(2400, amc8) < 25);
  ok("never goes below zero", expectedCorrect(600, amc8) > 0);

  let rising = true;
  let prev = -1;
  for (let r = 600; r <= 2400; r += 100) {
    const e = expectedCorrect(r, amc8);
    if (e <= prev) rising = false;
    prev = e;
  }
  ok("a stronger student always scores higher on the same paper", rising);

  // A student rated at the middle of the paper should land near half marks.
  const midRating = 900 + 120 * 5;
  const mid = expectedCorrect(midRating, amc8);
  ok("mid-difficulty rating scores near half", mid > 10 && mid < 15,
     `${mid.toFixed(1)}/25`);

  // The same rating must do worse on a harder contest than an easier one.
  const amc12 = ramp(3, 10, 25);
  ok("the same student scores lower on AMC 12 than AMC 8",
     expectedCorrect(1600, amc12) < expectedCorrect(1600, amc8),
     `${expectedCorrect(1600, amc12).toFixed(1)} vs ${expectedCorrect(1600, amc8).toFixed(1)}`);
}

console.log("\nScoring table is self-consistent");
{
  for (const [slug, model] of Object.entries(SCORING)) {
    ok(`${slug}: benchmarks are reachable`,
       model.benchmarks.every((b) => b.raw > 0 && b.raw <= model.questions),
       model.benchmarks.map((b) => `${b.label} ${b.raw}/${model.questions}`).join(", "));
    ok(`${slug}: benchmarks ascend`,
       model.benchmarks.every((b, i) => i === 0 || b.raw > model.benchmarks[i - 1].raw));
    ok(`${slug}: display renders`, typeof model.display(10) === "string" && model.display(10).length > 0);
  }
}

console.log(
  failures === 0
    ? "\n✓ predictor agrees with the rating engine and behaves sensibly\n"
    : `\n✗ ${failures} check(s) failed\n`
);
process.exitCode = failures === 0 ? 0 : 1;
