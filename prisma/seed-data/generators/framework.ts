import type { ProblemSeed } from "../problems";

/**
 * Parameterized problem generation.
 *
 * A generator never states an answer. It draws parameters, and the answer is
 * *computed* from those parameters — so a generated problem cannot disagree
 * with its own answer key the way a hand-authored one can.
 *
 * That moves the risk rather than removing it: a bug in one generator produces
 * every one of its instances wrong at once. So each generator also supplies
 * `check`, an independent recomputation by a different route (brute force where
 * the formula is closed-form, and vice versa). `scripts/verify-answers.ts`
 * runs `check` against every emitted instance, not a sample.
 */

/** Deterministic RNG (mulberry32). Seeded per generator so the emitted problem
 * set is byte-identical on every run — reseeding must not silently reshuffle
 * the database or invalidate students' history. */
export function rngFrom(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export const int = (rng: Rng, lo: number, hi: number) =>
  lo + Math.floor(rng() * (hi - lo + 1));

export const pick = <T>(rng: Rng, xs: readonly T[]): T => xs[int(rng, 0, xs.length - 1)];

/** Draw from lo..hi excluding a set of values. Used to keep distractors and
 * degenerate parameters (0 coefficients, equal points) out of problems. */
export function intExcept(rng: Rng, lo: number, hi: number, exclude: number[]): number {
  for (let i = 0; i < 200; i++) {
    const v = int(rng, lo, hi);
    if (!exclude.includes(v)) return v;
  }
  // Deterministic fallback so generation never hangs on an over-constrained range.
  for (let v = lo; v <= hi; v++) if (!exclude.includes(v)) return v;
  throw new Error("intExcept: empty range");
}

export const gcd = (a: number, b: number): number => (b ? gcd(b, Math.abs(a % b)) : Math.abs(a));

/** Reduced fraction as a display string; whole numbers render without a slash. */
export function frac(n: number, d: number): string {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  const rn = n / g, rd = d / g;
  return rd === 1 ? String(rn) : `${rn}/${rd}`;
}

/** Signed term for algebraic display: 3 -> "+ 3", -3 -> "- 3". */
export const sgn = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);

export type Built = {
  question: string;
  format: ProblemSeed["format"];
  /** Correct value. For MULTIPLE_CHOICE this is the value, not the letter —
   * the framework resolves the letter after shuffling. */
  answer: string;
  /** Wrong options. Must be distinct from the answer and from each other;
   * `finalize` drops duplicates and will throw rather than emit a question
   * whose distractors collide with the key. */
  distractors?: string[];
  solution: string;
  hints: string[];
};

export type Generator = {
  id: string;
  topicSlug: string;
  difficulty: number;
  competitionSlug?: string;
  /** How many distinct instances to emit. Tuned per generator to its actual
   * parameter space — a generator asked for more variants than it has distinct
   * questions emits what it has rather than padding with duplicates. */
  variants: number;
  params: (rng: Rng) => Record<string, number>;
  build: (p: Record<string, number>) => Built;
  /** Independent recomputation of the answer from the same parameters. */
  check: (p: Record<string, number>) => string;
};

const LETTERS = ["A", "B", "C", "D", "E"];

/** Turns a Built into a ProblemSeed, resolving multiple-choice letters. */
function finalize(
  g: Generator,
  built: Built,
  slug: string,
  rng: Rng
): ProblemSeed {
  const base = {
    slug,
    solution: built.solution,
    hints: built.hints,
    difficulty: g.difficulty,
    topicSlug: g.topicSlug,
    ...(g.competitionSlug ? { competitionSlug: g.competitionSlug } : {}),
  };

  if (built.format !== "MULTIPLE_CHOICE") {
    return { ...base, question: built.question, format: built.format, answer: built.answer };
  }

  const wrong = [...new Set(built.distractors ?? [])].filter((d) => d !== built.answer);
  if (wrong.length < 3) {
    throw new Error(`${g.id}: needs >=3 distinct distractors, got ${wrong.length}`);
  }
  const options = [built.answer, ...wrong.slice(0, 4)];
  // Deterministic Fisher-Yates so the key isn't always in the same slot.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const idx = options.indexOf(built.answer);
  return {
    ...base,
    question: built.question,
    format: "MULTIPLE_CHOICE",
    choices: options,
    answer: LETTERS[idx],
  };
}

export type GenerationIssue = { generator: string; problem: string; detail: string };

/** Expands every generator into concrete problems, verifying each instance
 * against the generator's independent `check` as it goes. Instances that fail
 * are dropped and reported rather than silently seeded. */
export function expand(generators: Generator[]): {
  problems: ProblemSeed[];
  issues: GenerationIssue[];
} {
  const problems: ProblemSeed[] = [];
  const issues: GenerationIssue[] = [];
  const seenSlugs = new Set<string>();

  for (const g of generators) {
    // Seed from the generator id so adding a generator cannot renumber the
    // instances of the ones before it.
    let h = 2166136261;
    for (let i = 0; i < g.id.length; i++) {
      h ^= g.id.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rng = rngFrom(h);

    const seenQuestions = new Set<string>();
    let emitted = 0;
    // Generous attempt budget: parameter collisions are common near the edge
    // of a generator's space, and stopping early would quietly shrink the bank.
    for (let attempt = 0; attempt < g.variants * 40 && emitted < g.variants; attempt++) {
      let built: Built;
      let p: Record<string, number>;
      try {
        p = g.params(rng);
        built = g.build(p);
      } catch {
        continue; // rejected parameter draw
      }

      if (seenQuestions.has(built.question)) continue;

      const expected = g.check(p);
      if (String(expected) !== String(built.answer)) {
        issues.push({
          generator: g.id,
          problem: built.question,
          detail: `build said "${built.answer}", independent check said "${expected}"`,
        });
        continue;
      }

      const slug = `${g.id}-${String(emitted + 1).padStart(3, "0")}`;
      if (seenSlugs.has(slug)) continue;

      let seed: ProblemSeed;
      try {
        seed = finalize(g, built, slug, rng);
      } catch (e) {
        issues.push({ generator: g.id, problem: built.question, detail: String(e) });
        continue;
      }

      seenQuestions.add(built.question);
      seenSlugs.add(slug);
      problems.push(seed);
      emitted++;
    }

    if (emitted < g.variants) {
      issues.push({
        generator: g.id,
        problem: "(generator)",
        detail: `asked for ${g.variants} variants, parameter space yielded ${emitted}`,
      });
    }
  }

  return { problems, issues };
}
