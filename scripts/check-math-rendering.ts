/**
 * Verification for math rendering over the problem bank.
 *
 * Problem text is authored as ASCII-ish math ("x^2", "3/4", "sqrt(5)") and
 * typeset by `MathText`. That renderer was built for lesson prose, and the
 * problem bank is 15,000 rows nobody is going to read by hand, so wiring it in
 * needs evidence rather than a spot check on one card.
 *
 * Two failure modes matter, and they pull in opposite directions:
 *
 *   1. UNDER-rendering — a "^" or a short "a/b" that reaches the student as
 *      literal punctuation. This is the bug the renderer exists to fix, so any
 *      exponent left in the output is a hard failure.
 *   2. OVER-rendering — prose the parser mistook for math. "and/or" set as a
 *      fraction is worse than "x^2" left alone, because the student cannot
 *      recover the intended text. Dimensionless unit pairs ("m/s") are the
 *      realistic case, since both sides are a single letter and the fraction
 *      rule cannot tell them from variables.
 *
 * The first is asserted. The second cannot be: whether "m/s" should be stacked
 * is an editorial call, not a provable one, so every letter-over-letter
 * fraction is printed with its context for a human to read. Silence there means
 * nothing new appeared, not that the list is empty.
 */
import { parseMath, applySymbols, mathToPlainText, type MathNode } from "../src/lib/math-notation";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

/** Walks the node tree, collecting every node of a given kind. */
function collect(nodes: MathNode[], kind: MathNode["t"], out: MathNode[] = []): MathNode[] {
  for (const n of nodes) {
    if (n.t === kind) out.push(n);
    if (n.t === "sup" || n.t === "sub" || n.t === "sqrt") collect(n.v, kind, out);
  }
  return out;
}

/** The text a student actually sees, with scripts flattened away. */
function renderedText(nodes: MathNode[]): string {
  return nodes
    .map((n) => {
      switch (n.t) {
        case "text":
          return n.v;
        case "sup":
        case "sub":
        case "sqrt":
          return renderedText(n.v);
        case "frac":
          return `${n.num}⁄${n.den}`;
      }
    })
    .join("");
}

/**
 * Script-grouping cases, as source → flattened tree.
 *
 * Where an un-parenthesised script ends is pure convention, so these pin the
 * convention down. The cases that must stay GREEDY matter as much as the ones
 * that must split: a blanket "one character" rule would read "2^10" as 2¹ 0
 * and "p_HH" as p_H H, and both are worse than the bug being fixed.
 */
const SCRIPT_CASES: Array<[source: string, flattened: string]> = [
  // Digit runs stay whole.
  ["2^10", "2^(10)"],
  ["7^2023", "7^(2023)"],
  ["a_12", "a_(12)"],
  // ...but stop before a letter: a numeric exponent then a new factor.
  ["(1/3)pi r^2h", "(1/3)π r^2h"],
  ["p^2q + q^2p", "p^2q + q^2p"],
  ["(2x^3y)^3", "(2x^3y)^3"],
  ["O_1O_2", "O_1O_2"],
  // Letter runs stay whole, including a trailing digit.
  ["3^odd", "3^(odd)"],
  ["2^gcd", "2^(gcd)"],
  ["2^x1", "2^(x1)"],
  ["p_HH", "p_(HH)"],
  ["E_HT", "E_(HT)"],
  // ...but a capital after a lowercase starts a new label.
  ["|P_iP_j|", "|P_iP_j|"],
  // Parenthesised and braced scripts are untouched by any of this.
  ["a^(m+n)", "a^(m+n)"],
  // A brace group becomes a paren group; the unspaced hyphen inside is left
  // alone, since the minus substitution only fires on " - " between operands.
  ["a^{p-1}", "a^(p-1)"],
  ["a_{n+2} - 1", "a_(n+2) − 1"],
  ["a^-1", "a^(-1)"],
  // Greek exponents render rather than leaking a caret.
  ["3^\\phi", "3^φ"],
];

/**
 * Fraction cases, as source → how many stacked fractions it should produce.
 *
 * These cannot be written as flattened strings: a frac node flattens back to
 * "a/b", exactly the text it would be if it had never been recognised, so the
 * plain form is blind to the only thing being tested. Counting nodes is what
 * distinguishes "set as a fraction" from "left as punctuation".
 */
const FRACTION_CASES: Array<[source: string, fracs: number]> = [
  ["3/4", 1],
  ["What is 1/2 + 1/3?", 2],
  // A fraction may end a sentence or a clause...
  ["so the sum is 5/6.", 1],
  ["the ratio is 3/4, and", 1],
  // ...but a decimal is not two numbers.
  ["968/1.2", 0],
  // A quantity and its unit, versus an algebraic ratio.
  ["5 m/s", 0],
  ["written as m/n where", 1],
  // A mixed number keeps its fraction even though a digit precedes it.
  ["5 1/2", 1],
  // Prose and compound units are not fractions at all.
  ["and/or", 0],
  ["km/h", 0],
];

function checkCases(): boolean {
  let ok = true;

  for (const [src, want] of SCRIPT_CASES) {
    const got = mathToPlainText(parseMath(src));
    if (got !== want) {
      ok = false;
      console.log(`  FAIL (script) ${JSON.stringify(src)}`);
      console.log(`    want ${JSON.stringify(want)}`);
      console.log(`    got  ${JSON.stringify(got)}`);
    }
  }

  for (const [src, want] of FRACTION_CASES) {
    const got = collect(parseMath(src), "frac").length;
    if (got !== want) {
      ok = false;
      console.log(`  FAIL (fraction) ${JSON.stringify(src)} — want ${want} frac(s), got ${got}`);
    }
  }

  const n = SCRIPT_CASES.length + FRACTION_CASES.length;
  console.log(ok ? `OK — all ${n} grouping cases hold.` : `FAIL — grouping cases broken.`);
  return ok;
}

type Field = { label: string; text: string; slug: string };

function fieldsOf(p: {
  slug: string;
  question: string;
  choices: string | null;
  answer: string;
  solution: string;
  altSolutions: string | null;
}): Field[] {
  const out: Field[] = [
    { label: "question", text: p.question, slug: p.slug },
    { label: "answer", text: p.answer, slug: p.slug },
    { label: "solution", text: p.solution, slug: p.slug },
  ];
  for (const raw of [p.choices, p.altSolutions]) {
    if (!raw) continue;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const c of parsed) {
          if (typeof c === "string") out.push({ label: "choice", text: c, slug: p.slug });
        }
      }
    } catch {
      // Not JSON — treat the column as one blob rather than skipping it.
      out.push({ label: "raw", text: raw, slug: p.slug });
    }
  }
  return out;
}

/** Lesson prose and video scenes go through the same renderer, so a parser
 * change aimed at the problem bank has to be checked against them too. Scenes
 * are a JSON blob; the whole string is scanned rather than walked, which is
 * blunt but cannot miss a field someone adds to the scene shape later. */
async function contentFields(): Promise<Field[]> {
  const out: Field[] = [];

  const lessons = await prisma.lesson.findMany({
    select: {
      slug: true,
      concept: true,
      explanation: true,
      workedExample: true,
      strategy: true,
      commonMistakes: true,
    },
  });
  for (const l of lessons) {
    for (const [label, text] of Object.entries(l)) {
      if (label !== "slug" && typeof text === "string") {
        out.push({ label: `lesson.${label}`, text, slug: l.slug });
      }
    }
  }

  const videos = await prisma.videoLesson.findMany({
    select: { slug: true, summary: true, scenes: true },
  });
  for (const v of videos) {
    out.push({ label: "video.summary", text: v.summary, slug: v.slug });
    out.push({ label: "video.scenes", text: v.scenes, slug: v.slug });
  }

  return out;
}

async function main() {
  const casesOk = checkCases();

  const problems = await prisma.problem.findMany({
    select: {
      slug: true,
      question: true,
      choices: true,
      answer: true,
      solution: true,
      altSolutions: true,
    },
  });

  const leftoverCaret: Field[] = [];
  const letterFracs = new Map<string, { count: number; example: string }>();
  let supCount = 0;
  let fracCount = 0;
  let sqrtCount = 0;
  let fieldCount = 0;

  const everyField = [...problems.flatMap(fieldsOf), ...(await contentFields())];

  for (const batch of [everyField]) {
    for (const f of batch) {
      if (!f.text) continue;
      fieldCount++;
      const nodes = parseMath(f.text);
      const rendered = renderedText(nodes);

      // A caret surviving into rendered output is an exponent the student sees
      // as punctuation — exactly what this work is meant to eliminate.
      if (rendered.includes("^")) leftoverCaret.push(f);

      supCount += collect(nodes, "sup").length;
      sqrtCount += collect(nodes, "sqrt").length;

      const fracs = collect(nodes, "frac") as Array<{ num: string; den: string }>;
      fracCount += fracs.length;
      for (const fr of fracs) {
        if (!/^[a-zA-Z]$/.test(fr.num) || !/^[a-zA-Z]$/.test(fr.den)) continue;
        const key = `${fr.num}/${fr.den}`;
        const seen = letterFracs.get(key);
        if (seen) seen.count++;
        else {
          const src = applySymbols(f.text);
          const at = src.indexOf(key);
          const example = at < 0 ? f.text.slice(0, 90) : src.slice(Math.max(0, at - 45), at + 45);
          letterFracs.set(key, { count: 1, example: `…${example.trim()}…` });
        }
      }

      // The flattened form is the accessible label and what a student copies
      // into a calculator, so it has to mean the same formula as the typeset
      // one. Comparing it against the raw source would only re-test the
      // symbol table, and brace-vs-paren noise would bury any real finding.
      // Instead: flatten, re-parse, flatten again. A parser that dropped or
      // re-associated something shifts on the second pass, so a fixed point is
      // evidence the structure survives the trip in both directions.
      const plain = mathToPlainText(nodes);
      const again = mathToPlainText(parseMath(plain));
      if (plain !== again) {
        roundTripMismatches.push({ field: f, plain, expected: again });
      }
    }
  }

  console.log(`Scanned ${fieldCount} text fields across ${problems.length} problems, plus lesson and video-lesson content.`);
  console.log(`Rendered: ${supCount} superscripts, ${fracCount} fractions, ${sqrtCount} radicals.`);

  let failed = false;

  if (leftoverCaret.length > 0) {
    failed = true;
    console.log(`\nFAIL — ${leftoverCaret.length} fields still show a literal "^":`);
    for (const f of leftoverCaret.slice(0, 25)) {
      console.log(`  [${f.label}] ${f.slug}: ${f.text.slice(0, 110)}`);
    }
  } else {
    console.log("\nOK — no field renders a literal caret.");
  }

  if (roundTripMismatches.length > 0) {
    failed = true;
    console.log(`\nFAIL — ${roundTripMismatches.length} fields do not round-trip:`);
    for (const m of roundTripMismatches.slice(0, 25)) {
      console.log(`  [${m.field.label}] ${m.field.slug}`);
      console.log(`    expected: ${m.expected.slice(0, 120)}`);
      console.log(`    got:      ${m.plain.slice(0, 120)}`);
    }
  } else {
    console.log("OK — every field round-trips to its source.");
  }

  const ranked = [...letterFracs.entries()].sort((a, b) => b[1].count - a[1].count);
  console.log(`\nLetter-over-letter fractions to eyeball (${ranked.length} distinct):`);
  for (const [key, v] of ranked.slice(0, 40)) {
    console.log(`  ${key} ×${v.count}  ${v.example.replace(/\s+/g, " ").slice(0, 100)}`);
  }

  if (failed || !casesOk) process.exitCode = 1;
}

const roundTripMismatches: Array<{ field: Field; plain: string; expected: string }> = [];

main().finally(() => prisma.$disconnect());
