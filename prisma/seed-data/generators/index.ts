import { expand } from "./framework";
import { GENERATORS } from "./registry";

export { GENERATORS };

const result = expand(GENERATORS);

/** Every generated problem, verified against its generator's independent
 * recomputation at module load. */
export const GENERATED_PROBLEMS = result.problems;

/** Instances dropped during generation, plus generators whose parameter space
 * could not supply the requested variant count. Surfaced by
 * `scripts/verify-answers.ts` rather than swallowed. */
export const GENERATION_ISSUES = result.issues;
