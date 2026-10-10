/**
 * What a difficulty number means, and what makes a problem worth asking.
 *
 * This file exists because the bank drifted badly without it. An audit of the
 * competition problems found 123 carrying a difficulty of 8-10 whose whole
 * solution was a single formula: "a regular octagon has side 6, find its area"
 * was labelled 9; "a + b = 10, maximise ab" was labelled 8 and filed under an
 * olympiad proof contest. Those labels are not a cosmetic problem. Simulations
 * build a paper by drawing one problem per target difficulty, so a mislabelled
 * problem is not merely mis-sorted — it is what a student meets at question 23
 * of a mock AMC, where the real contest would be asking something that takes
 * ten minutes.
 *
 * The single rule that would have prevented all of it:
 *
 *   ADVANCED IS NOT THE SAME AS HARD.
 *
 * Recognising that 12! mod 13 is Wilson's theorem is worth a point of
 * difficulty, not five. A problem is hard when the solver has to *find*
 * something, not when the solver has to *know* something. A named theorem
 * applied to the textbook setup that the theorem was stated for is never above
 * difficulty 4, however advanced the theorem.
 */

/** Difficulty, defined by how much has to be discovered rather than recalled. */
export const DIFFICULTY_RUBRIC: Record<number, string> = {
  1: "One recall or one arithmetic step. The setup is the standard one for the fact being used.",
  2: "Two routine steps with no choice about which to take. Still entirely recall.",
  3: "A named formula applied to its own textbook setup, including advanced ones (Wilson, Heron, the angle bisector theorem, a regular polygon area). Recognition is the only work.",
  4: "Two or three routine steps where the solver picks the method, but every candidate method is standard and the first one tried works.",
  5: "Three or more steps, or a standard method applied to a setup that has been lightly disguised. A solver who knows the topic finishes without a false start.",
  6: "The method is standard but the setup hides it; the solver must reframe before any formula applies. One plausible wrong route exists.",
  7: "At least one genuinely non-obvious move — a substitution, an invariant, a complementary count, a well-chosen auxiliary construction — chained with routine work.",
  8: "Two non-obvious moves, or one plus substantial casework that must be organised correctly. Most solvers need a false start before the entry point appears.",
  9: "Several non-obvious moves that must be found in order, with no signposting in the statement. Finding where to begin is itself most of the difficulty.",
  10: "Olympiad finals standard. The key idea is one a strong solver might not find in an hour, and the write-up needs care even once it is found.",
};

/**
 * Minimum solution length, in characters, before a difficulty label is
 * suspect.
 *
 * Length is a proxy and a crude one: a hard problem can have a slick short
 * solution, and padding defeats it entirely. It is used anyway because it is
 * the only signal available over 1,600 problems that correlates with step
 * count at all, and because it was calibrated against the part of the bank
 * that is already right — the olympiad tier, whose difficulty 8-10 solutions
 * run 525-630 characters, against the 57-110 characters of the flagged ones.
 * The gap is wide enough that the threshold does not need to be precise.
 *
 * A problem tripping this is a candidate for review, not a proven defect.
 */
export const MIN_SOLUTION_CHARS: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 140,
  6: 190,
  7: 240,
  8: 300,
  9: 380,
  10: 440,
};

/**
 * Stock problems. These are the standard exercises of competition training —
 * every one of them appears in the bank at an inflated difficulty, and every
 * one is something a prepared competitor has already met, so asking it tests
 * recall of a specific problem rather than any ability.
 *
 * Matched loosely, as a review aid rather than a hard rule.
 */
export const STOCK_SETUPS: Array<{ name: string; pattern: RegExp }> = [
  { name: "sum and sum-of-cubes, recover the product", pattern: /\^?3\s*\+.*\^?3\s*=/ },
  { name: "1/x + 1/y = 1/n divisor count", pattern: /1\s*\/\s*[a-z]\s*\+\s*1\s*\/\s*[a-z]\s*=\s*1\s*\/\s*\d+/i },
  { name: "the 13-14-15 triangle", pattern: /\b13\b[^.]{0,40}\b14\b[^.]{0,40}\b15\b/ },
  { name: "Wilson's theorem stated directly", pattern: /remainder when (\d+)!\s*is divided by/i },
  { name: "Fermat's little theorem stated directly", pattern: /remainder when \d+\^?\{?\d+\}? is divided by (?:101|97|89|83|79|73|71|67|61|59|53|47|43|41|37|31|29|23|19|17|13|11)\b/i },
  { name: "Cauchy functional equation with a handed-over value", pattern: /f\s*\(\s*x\s*\+\s*y\s*\)\s*=\s*f\s*\(\s*x\s*\)\s*\+\s*f\s*\(\s*y\s*\)/i },
  { name: "cycle graph proper colourings", pattern: /no two adjacent[^.]{0,60}same colou?r/i },
  { name: "lateral surface area from two given dimensions", pattern: /lateral surface area/i },
  { name: "maximise a product under a fixed sum", pattern: /(maximum|largest) (possible )?value of [a-z]{1,2}\s*[·*]?\s*[a-z]{1,2}\b/i },
];

/** What "a unique situation" has to mean, for the authoring pass. */
export const UNIQUENESS_RULES = [
  "The scenario must be concrete and specific. Not 'a shop', 'a machine', 'a game' — a named, visualisable situation with a reason the quantities relate the way they do.",
  "The mathematical skeleton must not already exist in the bank. Reskinning 'x+y=7, x³+y³=133' as 'a+b=10, a³+b³=370' is the same problem twice; both are currently in the bank, under two different competitions.",
  "It must not be a famous exercise. If the problem has a canonical name or appears in every training handbook, a prepared competitor is recalling, not solving.",
  "The narrative must carry the mathematics, not decorate it. If deleting the story leaves the identical bare computation, the story was wrapping paper.",
  "The answer must not be guessable from the structure alone — no 'nice' answer that falls out of the only sensible reading of the setup.",
];

/** The difficulty window each competition's hard tail should actually occupy. */
export const COMPETITION_TIERS: Record<string, { tail: [number, number]; note: string }> = {
  "MOEMS (Elementary)": { tail: [2, 3], note: "Grades 4-6; arithmetic insight, no algebra." },
  "MOEMS (Middle)": { tail: [3, 4], note: "Pre-algebra reasoning." },
  Kangaroo: { tail: [3, 5], note: "Visual and logical, deliberately not computational." },
  "Math League": { tail: [4, 6], note: "Short-answer speed round." },
  "AMC 8": { tail: [6, 7], note: "Questions 21-25: multi-step but pre-algebra-friendly." },
  MATHCOUNTS: { tail: [6, 7], note: "Sprint/target; speed matters more than depth." },
  "Purple Comet": { tail: [7, 8], note: "Team contest, integer answers, heavy computation allowed." },
  "AMC 10": { tail: [8, 9], note: "Questions 21-25 only; a 10 here would be out of band." },
  "AMC 12": { tail: [8, 10], note: "Questions 23-25 reach genuine olympiad entry level." },
  AIME: { tail: [8, 10], note: "Integer 0-999; problems 13-15 are the tail." },
  ARML: { tail: [7, 9], note: "Relay and team rounds." },
  SMT: { tail: [8, 10], note: "Stanford; subject rounds go deep." },
  HMMT: { tail: [9, 10], note: "Harvard-MIT; the hardest non-olympiad tier here." },
  PUMaC: { tail: [9, 10], note: "Princeton; comparable to HMMT." },
  "Math Prize for Girls": { tail: [8, 10], note: "Roughly AIME-to-olympiad." },
  USAMTS: { tail: [8, 10], note: "Proof contest, month-long; depth over speed." },
  USAMO: { tail: [9, 10], note: "Proof olympiad. Nothing below 9 belongs." },
  EGMO: { tail: [9, 10], note: "Proof olympiad." },
  IMO: { tail: [10, 10], note: "Nothing below 10 belongs." },
  "IMO Shortlist": { tail: [9, 10], note: "Shortlisted olympiad problems." },
};
