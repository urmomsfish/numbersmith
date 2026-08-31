import type { Generator } from "./framework";
import { ARITHMETIC } from "./arithmetic";
import { ALGEBRA } from "./algebra";
import { GEOMETRY } from "./geometry";
import { NUMBER_THEORY, COMBINATORICS, PROBABILITY } from "./discrete";
import { ADVANCED } from "./advanced";

/** The generator list on its own. Kept separate from `index.ts` so that code
 * needing only the registry — the About page, which shows how many templates
 * exist — does not trigger the full expansion and per-instance verification
 * that `index.ts` runs at module load. */
export const GENERATORS: Generator[] = [
  ...ARITHMETIC,
  ...ALGEBRA,
  ...GEOMETRY,
  ...NUMBER_THEORY,
  ...COMBINATORICS,
  ...PROBABILITY,
  ...ADVANCED,
];
