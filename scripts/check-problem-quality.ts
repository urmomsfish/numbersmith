/**
 * Quality gate for the competition problem bank.
 *
 * Two defects this catches, both found by hand in an audit and both invisible
 * to `verify:answers` — a problem can have a perfectly correct answer and
 * still be the wrong problem to ask:
 *
 *   1. A difficulty label the problem does not earn. Simulations build a paper
 *      by drawing one problem per target difficulty, so a formula lookup
 *      labelled 9 is what a student meets at question 23 of a mock AMC.
 *   2. The same problem asked twice. "x+y=7, x³+y³=133, find xy" and
 *      "a+b=10, a³+b³=370, find ab" are one problem wearing two competitions'
 *      badges; reskinning numbers does not make a new question.
 *
 * Run with: npm run verify:quality
 */
import { ALL_PROBLEMS } from "../prisma/seed-data/all-problems";
import {
  MIN_SOLUTION_CHARS,
  STOCK_SETUPS,
  DIFFICULTY_RUBRIC,
} from "./problem-rubric";
import { skeleton, skeletonWeight, normalisedText } from "./problem-skeleton";

/** Content words, for spotting two problems that share a cover story. */
function rareWords(text: string): Set<string> {
  const STOP = new Set([
    "the","a","an","of","and","or","is","are","to","in","on","for","with","that",
    "what","how","many","which","be","by","from","at","as","it","its","each","all",
    "if","then","so","can","must","has","have","does","do","this","these","those",
    "there","when","where","not","no","one","two","three","four","five","six",
    "seven","eight","nine","ten","first","second","third","find","value","number",
    "numbers","possible","total","exactly","least","most","such","given","let",
  ]);
  return new Set(
    (text.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => !STOP.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

type Row = {
  slug: string;
  question: string;
  diagram?: string;
  solution: string;
  difficulty: number;
  competitionSlug?: string;
  set: string;
};

function main() {
  const rows: Row[] = ALL_PROBLEMS.map(({ seed, set }) => ({
    slug: seed.slug,
    question: seed.question,
    diagram: seed.diagram,
    solution: seed.solution,
    difficulty: seed.difficulty,
    competitionSlug: seed.competitionSlug,
    set,
  }));

  const competition = rows.filter((r) => r.competitionSlug);
  console.log(
    `Checking ${rows.length} problems (${competition.length} competition-tagged).\n`
  );

  let failures = 0;

  // ---- 1. Difficulty labels the solution does not support -----------------
  const underweight = competition
    .filter((r) => r.solution.length < (MIN_SOLUTION_CHARS[r.difficulty] ?? 0))
    .sort((a, b) => b.difficulty - a.difficulty || a.solution.length - b.solution.length);

  if (underweight.length) {
    failures += underweight.length;
    console.log(`FAIL — ${underweight.length} problems whose solution is too thin for their label:`);
    for (const r of underweight.slice(0, 30)) {
      console.log(
        `  [d${r.difficulty} needs ${MIN_SOLUTION_CHARS[r.difficulty]}ch, has ${r.solution.length}] ${r.slug}`
      );
      console.log(`      ${r.question.replace(/\s+/g, " ").slice(0, 100)}`);
    }
    if (underweight.length > 30) console.log(`  …and ${underweight.length - 30} more.`);
  } else {
    console.log("OK — every competition problem's solution matches its difficulty band.");
  }

  // ---- 2a. The same sentence twice ----------------------------------------
  // Checked over the WHOLE bank, not just competition problems: several
  // competition problems turn out to restate a core-bank question verbatim,
  // which the skeleton pass cannot see when the question carries no equations.
  const byText = new Map<string, Row[]>();
  for (const r of rows) {
    // The figure is part of the question. "How many triangles are there?"
    // appears nine times in the generated Kangaroo set and is nine different
    // problems, because each one ships a different picture — keying on text
    // alone reported every one of them as a duplicate of the others.
    const k = `${normalisedText(r.question)}##${r.diagram ?? ""}`;
    if (normalisedText(r.question).length < 25) continue;
    byText.set(k, [...(byText.get(k) ?? []), r]);
  }
  const verbatim = [...byText.values()].filter((v) => v.length > 1);
  if (verbatim.length) {
    failures += verbatim.length;
    console.log(`\nFAIL — ${verbatim.length} questions appear verbatim more than once:`);
    for (const group of verbatim.slice(0, 20)) {
      console.log(`  ${group.map((r) => `${r.slug}[d${r.difficulty}]`).join("  ")}`);
      console.log(`      ${group[0].question.replace(/\s+/g, " ").slice(0, 95)}`);
    }
  } else {
    console.log("\nOK — no question text is repeated verbatim.");
  }

  // ---- 2b. Structural duplicates (reskins) --------------------------------
  const bySkeleton = new Map<string, Row[]>();
  for (const r of competition) {
    const k = skeleton(r.question);
    // Short skeletons carry no structure — a bare "N" would collide with half
    // the bank and say nothing about either problem.
    if (skeletonWeight(k) < 10) continue;
    bySkeleton.set(k, [...(bySkeleton.get(k) ?? []), r]);
  }
  const twins = [...bySkeleton.entries()].filter(([, v]) => v.length > 1);

  if (twins.length) {
    failures += twins.length;
    console.log(`\nFAIL — ${twins.length} groups of problems share a mathematical skeleton:`);
    for (const [k, group] of twins.slice(0, 20)) {
      console.log(`  skeleton: ${k.slice(0, 80)}`);
      for (const r of group) {
        console.log(`    ${r.slug} [d${r.difficulty}] ${r.question.replace(/\s+/g, " ").slice(0, 85)}`);
      }
    }
  } else {
    console.log("\nOK — no two competition problems share a mathematical skeleton.");
  }

  // ---- 3. Shared cover stories (reported, not failed) ---------------------
  // Only problems with enough content words to be distinctive. Below that, two
  // one-line questions about divisors inevitably share "divisors" and
  // "positive" and score 100% while being unrelated — which is what made the
  // first run of this report 1,814 pairs of noise.
  const words = competition
    .map((r) => ({ r, w: rareWords(r.question) }))
    .filter((x) => x.w.size >= 6);
  const storyPairs: Array<[Row, Row, number]> = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const s = jaccard(words[i].w, words[j].w);
      if (s >= 0.6) storyPairs.push([words[i].r, words[j].r, s]);
    }
  }
  console.log(`\n${storyPairs.length} pairs share most of their wording (review, not a failure):`);
  for (const [a, b, s] of storyPairs.sort((x, y) => y[2] - x[2]).slice(0, 12)) {
    console.log(`  ${(s * 100).toFixed(0)}%  ${a.slug} / ${b.slug}`);
    console.log(`      ${a.question.replace(/\s+/g, " ").slice(0, 95)}`);
    console.log(`      ${b.question.replace(/\s+/g, " ").slice(0, 95)}`);
  }

  // ---- 4. Stock setups (reported) -----------------------------------------
  const stock: Array<[Row, string]> = [];
  for (const r of competition) {
    for (const s of STOCK_SETUPS) {
      if (s.pattern.test(r.question)) stock.push([r, s.name]);
    }
  }
  console.log(`\n${stock.length} problems match a known stock setup (review):`);
  const byKind = new Map<string, number>();
  for (const [, name] of stock) byKind.set(name, (byKind.get(name) ?? 0) + 1);
  for (const [name, n] of [...byKind].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}×  ${name}`);
  }

  // ---- 5. Pool depth -------------------------------------------------------
  // A simulation draws one problem per target difficulty and the back of the
  // paper comes from the hard tail, so a thin tail means every mock contest
  // ends with the same handful of problems. This reports the tail, which is
  // the number that actually governs how repetitive simulations feel.
  console.log(`\nPool depth per competition (tail = difficulty 9+):`);
  const bySlug = new Map<string, Row[]>();
  for (const r of competition) {
    bySlug.set(r.competitionSlug!, [...(bySlug.get(r.competitionSlug!) ?? []), r]);
  }
  for (const [slug, group] of [...bySlug].sort()) {
    const max = Math.max(...group.map((r) => r.difficulty));
    const tail = group.filter((r) => r.difficulty >= 9).length;
    console.log(
      `  ${slug.padEnd(30)} n=${String(group.length).padStart(4)}  max=${String(max).padStart(2)}  tail=${String(tail).padStart(3)}`
    );
  }

  console.log(
    `\nRubric in use: ${Object.keys(DIFFICULTY_RUBRIC).length} difficulty levels defined in scripts/problem-rubric.ts`
  );

  if (failures) {
    console.log(`\n${failures} issues must be fixed (relabel or rewrite).`);
    process.exitCode = 1;
  }
}

main();
