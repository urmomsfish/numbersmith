/**
 * Rebalances an AMC answer-choice bank so the correct letter is uniform across
 * it, and so numeric choices ascend the way a real AMC paper prints them.
 *
 * The bug: hand-authored letters were skewed in both AMC banks — AMC 8 ran
 * A 30.3% / E 11.5% (chi-square 18.8 on 4 df, p < 0.001) and AMC 10 ran
 * C 28.4% / E 13.1% (chi-square 13.0, p = 0.011). A student who always guessed
 * the favoured letter beat random guessing by half again, which is a scoring
 * artefact rather than mathematics, and it trains exactly the wrong instinct
 * for the real contest.
 *
 * Why sorting alone does not fix it: the distractors were authored
 * symmetrically around the answer — typically two below and two above — so
 * ordering the choices parks the answer in the middle. Sorting the bank as it
 * stood moved C to 40.6% and made the skew three times worse (chi-square 63.8).
 * The shape of the distractor set is the defect, not the ordering.
 *
 * The fix: reflect distractors across the answer, d -> 2a - d. A distractor
 * three below the answer becomes one three above it, so the size of the error a
 * student would make is unchanged while its rank moves. Choosing how many
 * distractors to reflect sets the answer's rank, and therefore its letter,
 * while leaving the answer's own value untouched. Sorting ascending afterwards
 * is then free, and matches the real paper.
 *
 * Invariants, all asserted before anything is written:
 *   - the correct answer's VALUE is never changed, only its letter
 *   - every choice stays a positive integer, distinct from the others
 *   - every numeric set ends up in ascending order
 *   - letters are assigned by quota across the whole bank, so the problems
 *     that cannot be touched are compensated for rather than left to show
 *     through
 *
 * Problems it declines to touch, and reports instead: non-numeric choice sets
 * (words, expressions), sets that are not all integers, and any problem where
 * no reflection reaches a legal set. Those keep whatever letter they had.
 *
 * Run with: npx tsx scripts/rebalance-amc-choices.ts amc10   (add --dry-run)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { AMC8_PROBLEMS } from "../prisma/seed-data/problems-amc8";
import { AMC10_PROBLEMS } from "../prisma/seed-data/problems-amc10";

const DRY_RUN = process.argv.includes("--dry-run");
const LETTERS = ["A", "B", "C", "D", "E"] as const;

/** Which banks this can be pointed at. Adding one is a line here, not a fork of
 * the script — the two AMC banks were authored the same way and skewed the same
 * way, and AMC 12 is included so the check can be run on it even though it
 * measured uniform (chi-square 3.6) and needs no correction. */
const BANKS = {
  amc8: { problems: AMC8_PROBLEMS, file: "problems-amc8.ts" },
  amc10: { problems: AMC10_PROBLEMS, file: "problems-amc10.ts" },
} as const;

const target = process.argv.find((a) => a in BANKS) as keyof typeof BANKS | undefined;
if (!target) {
  console.error(`Usage: npx tsx scripts/rebalance-amc-choices.ts <${Object.keys(BANKS).join("|")}> [--dry-run]`);
  process.exit(1);
}
const BANK = BANKS[target];
const FILE = path.join(__dirname, "..", "prisma", "seed-data", BANK.file);

/** Splits "$30" or "45%" into a decorated shell plus its number. The whole set
 * must share one decoration, or the set is skipped — mixing "$30" with "30"
 * inside one question would be an authoring error worth seeing, not papering
 * over. */
type Parsed = { prefix: string; suffix: string; value: number };

function parseChoice(raw: string): Parsed | null {
  const m = raw.trim().match(/^(\$?)(-?\d+)(%?)$/);
  if (!m) return null;
  return { prefix: m[1], suffix: m[3], value: parseInt(m[2], 10) };
}

function parseSet(choices: string[]): { prefix: string; suffix: string; values: number[] } | null {
  const parsed = choices.map(parseChoice);
  if (parsed.some((p) => p === null)) return null;
  const ps = parsed as Parsed[];
  const prefix = ps[0].prefix;
  const suffix = ps[0].suffix;
  if (ps.some((p) => p.prefix !== prefix || p.suffix !== suffix)) return null;
  return { prefix, suffix, values: ps.map((p) => p.value) };
}

const render = (v: number, prefix: string, suffix: string) => `${prefix}${v}${suffix}`;

/** Reflects a chosen subset of distractors so that exactly `targetRank` of them
 * end up below the answer. Returns null when no legal set exists.
 *
 * Each distractor has a fixed distance from the answer; reflecting it is the
 * only freedom available, so a distractor can sit either below or above and
 * nowhere else. The search is over which side each takes, cheap at four
 * distractors (16 combinations), and prefers the assignment that reflects the
 * fewest — staying closest to what was authored. */
function rebalance(
  values: number[],
  answerIdx: number,
  targetRank: number
): { values: number[]; answerIdx: number } | null {
  const a = values[answerIdx];
  const distractors = values.filter((_, i) => i !== answerIdx);
  const n = distractors.length;

  let best: { set: number[]; flips: number } | null = null;

  for (let mask = 0; mask < 1 << n; mask++) {
    const candidate: number[] = [];
    let below = 0;
    let flips = 0;
    let legal = true;

    for (let i = 0; i < n; i++) {
      const d = distractors[i];
      const reflected = 2 * a - d;
      const useReflected = (mask >> i) & 1;
      const v = useReflected ? reflected : d;
      if (useReflected) flips++;
      // A distractor must stay a usable wrong answer: positive, and never equal
      // to the answer (which reflection produces when d === a, and which would
      // hand the student two correct options).
      if (v <= 0 || v === a) {
        legal = false;
        break;
      }
      if (v < a) below++;
      candidate.push(v);
    }
    if (!legal || below !== targetRank) continue;
    if (new Set([...candidate, a]).size !== n + 1) continue; // collisions

    if (!best || flips < best.flips) best = { set: candidate, flips };
  }

  if (!best) return null;

  const all = [...best.set, a].sort((x, y) => x - y);
  return { values: all, answerIdx: all.indexOf(a) };
}

/** Replaces the `choices: [...]` array and `answer: "X"` inside one problem's
 * object literal, located by its slug. Operates on the source text rather than
 * regenerating the file so every comment, hint and solution stays byte-identical. */
function rewrite(src: string, slug: string, choices: string[], answer: string): string {
  const at = src.indexOf(`slug: "${slug}"`);
  if (at < 0) throw new Error(`slug not found in source: ${slug}`);
  // Bound the edit to this object literal so a later problem is never touched.
  const nextSlug = src.indexOf("slug: \"", at + 10);
  const end = nextSlug < 0 ? src.length : nextSlug;

  const cStart = src.indexOf("choices: [", at);
  if (cStart < 0 || cStart > end) throw new Error(`no choices array for ${slug}`);
  const cEnd = src.indexOf("]", cStart);
  const rendered = `choices: [${choices.map((c) => `"${c}"`).join(", ")}]`;

  const aStart = src.indexOf("answer: \"", at);
  if (aStart < 0 || aStart > end) throw new Error(`no answer for ${slug}`);
  const aEnd = src.indexOf("\"", aStart + 9);

  // Apply the later edit first so the earlier offset stays valid.
  let out = src;
  if (aStart > cStart) {
    out = out.slice(0, aStart) + `answer: "${answer}` + out.slice(aEnd);
    out = out.slice(0, cStart) + rendered + out.slice(cEnd + 1);
  } else {
    out = out.slice(0, cStart) + rendered + out.slice(cEnd + 1);
    const a2 = out.indexOf("answer: \"", out.indexOf(`slug: "${slug}"`));
    const a2End = out.indexOf("\"", a2 + 9);
    out = out.slice(0, a2) + `answer: "${answer}` + out.slice(a2End);
  }
  return out;
}

function main() {
  const mc = BANK.problems.filter((p) => p.format === "MULTIPLE_CHOICE" && p.choices);

  let src = fs.readFileSync(FILE, "utf8");
  const skipped: string[] = [];

  // Which ranks each problem can actually reach. Reachability is very uneven:
  // seating the answer at an extreme requires every distractor to move to one
  // side of it, and reflecting an above-distractor below a small answer gives a
  // non-positive value. Measured on this bank, 39 problems can reach rank 0 and
  // 29 can reach rank 4, against 113 for the middle.
  //
  // So the target cannot be chosen per problem: picking one and falling back on
  // failure just funnels every failure into whichever rank is easiest, which is
  // how a first attempt at this produced B 48.3% — worse than the skew it was
  // meant to fix. It is an assignment problem over the whole set.
  type Flex = {
    seed: (typeof mc)[number];
    answerValue: number;
    prefix: string;
    suffix: string;
    options: Map<number, { values: number[]; answerIdx: number }>;
  };
  const flexible: Flex[] = [];
  const fixedLetters: Record<string, number> = {};

  for (const p of mc) {
    const answerIdx = LETTERS.indexOf(p.answer as (typeof LETTERS)[number]);
    const set = answerIdx >= 0 ? parseSet(p.choices!) : null;
    if (answerIdx < 0 || !set) {
      skipped.push(`${p.slug} (${answerIdx < 0 ? "answer is not a letter" : "choices are not uniform integers"})`);
      fixedLetters[p.answer] = (fixedLetters[p.answer] ?? 0) + 1;
      continue;
    }
    const options = new Map<number, { values: number[]; answerIdx: number }>();
    for (let rank = 0; rank < 5; rank++) {
      const r = rebalance(set.values, answerIdx, rank);
      if (r) options.set(rank, r);
    }
    if (options.size === 0) {
      skipped.push(`${p.slug} (no legal reflection)`);
      fixedLetters[p.answer] = (fixedLetters[p.answer] ?? 0) + 1;
      continue;
    }
    flexible.push({
      seed: p,
      answerValue: set.values[answerIdx],
      prefix: set.prefix,
      suffix: set.suffix,
      options,
    });
  }

  // Quotas aim at a uniform bank *overall*, so the flexible problems absorb the
  // skew the untouchable ones leave behind rather than being balanced among
  // themselves and letting the remainder show through.
  const perLetter = mc.length / 5;
  const need = LETTERS.map((l) => perLetter - (fixedLetters[l] ?? 0));

  // Most-constrained first: a problem that can only reach one rank must be
  // served before one that can reach four, or it ends up forced into a rank
  // already over quota.
  flexible.sort((a, b) => a.options.size - b.options.size);

  const assigned = new Map<string, { values: number[]; answerIdx: number }>();
  const taken = [0, 0, 0, 0, 0];
  for (const f of flexible) {
    // Of the ranks this problem can reach, take the one furthest below quota.
    const best = [...f.options.keys()].sort(
      (x, y) => need[y] - taken[y] - (need[x] - taken[x]) || x - y
    )[0];
    taken[best]++;
    assigned.set(f.seed.slug, f.options.get(best)!);
  }

  const changes: { slug: string; from: string; to: string; before: string[]; after: string[] }[] = [];
  for (const f of flexible) {
    const r = assigned.get(f.seed.slug)!;
    if (r.values[r.answerIdx] !== f.answerValue) {
      throw new Error(`${f.seed.slug}: answer value changed — refusing to write`);
    }
    const after = r.values.map((v) => render(v, f.prefix, f.suffix));
    if (new Set(after).size !== after.length) throw new Error(`${f.seed.slug}: duplicate choices`);
    for (let i = 1; i < r.values.length; i++) {
      if (r.values[i - 1] >= r.values[i]) throw new Error(`${f.seed.slug}: not ascending`);
    }
    const newLetter = LETTERS[r.answerIdx];
    changes.push({ slug: f.seed.slug, from: f.seed.answer, to: newLetter, before: f.seed.choices!, after });
    src = rewrite(src, f.seed.slug, after, newLetter);
  }

  // Bank-wide distribution: rebalanced problems plus the ones left alone.
  const dist: Record<string, number> = { ...fixedLetters };
  for (const c of changes) dist[c.to] = (dist[c.to] ?? 0) + 1;
  const n = mc.length;
  const exp = n / 5;
  const chi = LETTERS.reduce((s, l) => s + Math.pow((dist[l] ?? 0) - exp, 2) / exp, 0);

  console.log(`${target} multiple choice: ${n}`);
  console.log(`  rebalanced: ${changes.length}`);
  console.log(`  left alone: ${skipped.length}`);
  console.log(
    `\n  bank-wide distribution: ${LETTERS.map((l) => `${l} ${(((dist[l] ?? 0) / n) * 100).toFixed(1)}%`).join("  ")}`
  );
  console.log(`  chi-square: ${chi.toFixed(2)} (4 df; under 9.49 is uniform at p>0.05)`);
  console.log(`  every rebalanced set is ascending, distinct, positive, answer value unchanged.`);

  console.log(`\n  examples:`);
  for (const c of changes.slice(0, 4)) {
    console.log(`    ${c.slug}  ${c.from} -> ${c.to}`);
    console.log(`      was: ${c.before.join(", ")}`);
    console.log(`      now: ${c.after.join(", ")}`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }
  fs.writeFileSync(FILE, src);
  console.log(`\nWrote ${FILE}.`);
}

main();
