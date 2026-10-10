import type { ProblemSeed } from "./problems";
import { PROBLEMS } from "./problems";
import { OLYMPIAD_PROBLEMS } from "./problems-olympiad";
import { MOEMS_PROBLEMS } from "./problems-moems";
import { PURPLE_COMET_PROBLEMS } from "./problems-purple-comet";
import { MATH_LEAGUE_EM_PROBLEMS, MATH_LEAGUE_HS_PROBLEMS } from "./problems-math-league";
import { ARML_PROBLEMS } from "./problems-arml";
import { PUMAC_PROBLEMS, SMT_PROBLEMS } from "./problems-pumac-smt";
import { MATH_PRIZE_FOR_GIRLS_PROBLEMS } from "./problems-math-prize-girls";
import { AMC8_PROBLEMS } from "./problems-amc8";
import { AMC10_PROBLEMS } from "./problems-amc10";
import { AMC12_PROBLEMS } from "./problems-amc12";
import { MATHCOUNTS_PROBLEMS } from "./problems-mathcounts";
import { AIME_PROBLEMS } from "./problems-aime";
import { HMMT_PROBLEMS } from "./problems-hmmt";
import { MATH_KANGAROO_PROBLEMS } from "./problems-kangaroo";
import { OLYMPIAD_TIER_PROBLEMS } from "./problems-olympiad-tier";
import { COUNTDOWN_PROBLEMS } from "./problems-countdown";
import { GENERATED_PROBLEMS } from "./generators";

/**
 * Every authored problem set, in one list.
 *
 * The seed and the sync script each held their own copy of this list, and a
 * quality checker would have made a third. That is the same drift hazard
 * `problem-rows.ts` was extracted to close: a set added to one copy and
 * forgotten in another is invisible until a whole competition quietly stops
 * being verified.
 *
 * `isPlacement` rides along because it is a property of the set, not of the
 * problem — only the original hand-written bank is eligible for the placement
 * test, and that distinction lived in the duplicated lists too.
 */
export type ProblemSet = {
  name: string;
  problems: ProblemSeed[];
  isPlacement: boolean;
};

export const PROBLEM_SETS: ProblemSet[] = [
  { name: "core", problems: PROBLEMS, isPlacement: true },
  { name: "generated", problems: GENERATED_PROBLEMS, isPlacement: false },
  { name: "olympiad", problems: OLYMPIAD_PROBLEMS, isPlacement: false },
  { name: "moems", problems: MOEMS_PROBLEMS, isPlacement: false },
  { name: "purple-comet", problems: PURPLE_COMET_PROBLEMS, isPlacement: false },
  { name: "math-league-em", problems: MATH_LEAGUE_EM_PROBLEMS, isPlacement: false },
  { name: "math-league-hs", problems: MATH_LEAGUE_HS_PROBLEMS, isPlacement: false },
  { name: "arml", problems: ARML_PROBLEMS, isPlacement: false },
  { name: "pumac", problems: PUMAC_PROBLEMS, isPlacement: false },
  { name: "smt", problems: SMT_PROBLEMS, isPlacement: false },
  { name: "math-prize-girls", problems: MATH_PRIZE_FOR_GIRLS_PROBLEMS, isPlacement: false },
  { name: "amc8", problems: AMC8_PROBLEMS, isPlacement: false },
  { name: "amc10", problems: AMC10_PROBLEMS, isPlacement: false },
  { name: "amc12", problems: AMC12_PROBLEMS, isPlacement: false },
  { name: "mathcounts", problems: MATHCOUNTS_PROBLEMS, isPlacement: false },
  { name: "aime", problems: AIME_PROBLEMS, isPlacement: false },
  { name: "hmmt", problems: HMMT_PROBLEMS, isPlacement: false },
  { name: "kangaroo", problems: MATH_KANGAROO_PROBLEMS, isPlacement: false },
  { name: "olympiad-tier", problems: OLYMPIAD_TIER_PROBLEMS, isPlacement: false },
  { name: "countdown", problems: COUNTDOWN_PROBLEMS, isPlacement: false },
];

/** Flattened, in the order the sets are declared above. */
export const ALL_PROBLEMS: Array<{ seed: ProblemSeed; isPlacement: boolean; set: string }> =
  PROBLEM_SETS.flatMap((s) =>
    s.problems.map((seed) => ({ seed, isPlacement: s.isPlacement, set: s.name }))
  );
