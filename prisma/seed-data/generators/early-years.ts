import { type Generator, int, pick } from "./framework";

/**
 * Grades 1-2 — the bottom of Math Kangaroo's Levels 1-2 paper.
 *
 * Kindergarten is deliberately out of scope: the product's floor is grade 1,
 * matching Math Kangaroo's own, so nothing here targets grade 0.
 *
 * Everything else in the bank assumes a fluent reader. A six-year-old is often
 * not one yet, so these questions are deliberately built differently:
 *
 *  - **The picture carries the question, not the prose.** Counting problems
 *    draw the objects. The sentence is short enough to be read aloud by an
 *    adult in one breath, and the figure is what the child actually works
 *    from — the opposite of the rule for the rest of the bank, where a figure
 *    only clarifies text that already stands alone.
 *  - **Answers are single digits or small numbers**, always multiple choice,
 *    so a child still forming numerals can answer by pointing.
 *  - **No multi-step reasoning.** One idea per question.
 *
 * These carry an explicit `gradeMin`/`gradeMax` because the difficulty→grade
 * mapping bottoms out at grade 2 and would otherwise file a counting-to-five
 * question alongside two-digit arithmetic — leaving Kangaroo Levels 1-2 with
 * no grade 1 material at all.
 */

/** A row of simple shapes to count. Uses `currentColor` so the figure follows
 * light/dark theme, matching every other diagram in the bank. */
function countingRow(n: number, shape: "circle" | "square" | "triangle"): string {
  const size = 34;
  const gap = 12;
  const perRow = 5;
  const rows = Math.ceil(n / perRow);
  const w = perRow * size + (perRow - 1) * gap;
  const h = rows * size + (rows - 1) * gap;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const cx = (i % perRow) * (size + gap);
    const cy = Math.floor(i / perRow) * (size + gap);
    if (shape === "circle") {
      parts.push(`<circle cx="${cx + size / 2}" cy="${cy + size / 2}" r="${size / 2 - 2}" fill="currentColor" />`);
    } else if (shape === "square") {
      parts.push(`<rect x="${cx + 2}" y="${cy + 2}" width="${size - 4}" height="${size - 4}" rx="3" fill="currentColor" />`);
    } else {
      parts.push(
        `<polygon points="${cx + size / 2},${cy + 2} ${cx + size - 2},${cy + size - 2} ${cx + 2},${cy + size - 2}" fill="currentColor" />`
      );
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${n} shapes to count">${parts.join("")}</svg>`;
}

const SHAPES = ["circle", "square", "triangle"] as const;
const SHAPE_WORD = { circle: "circles", square: "squares", triangle: "triangles" } as const;

/** Nearby wrong numbers, distinct from the answer. A five-year-old's mistakes
 * are off-by-one, so the distractors are too.
 *
 * Zero is excluded rather than merely kept non-negative: every question using
 * this either shows the objects or describes some remaining, so "0" is not a
 * miscount anyone makes — it just burns one of five options and makes the
 * guess easier. Candidates widen outward until enough plausible ones exist. */
function nearby(answer: number, count: number): string[] {
  const out: string[] = [];
  for (const d of [1, -1, 2, -2, 3, -3, 4, 5]) {
    const v = answer + d;
    if (v >= 1 && !out.includes(String(v))) out.push(String(v));
    if (out.length === count) break;
  }
  return out;
}

export const EARLY_YEARS: Generator[] = [
  {
    id: "gen-k-count-shapes",
    topicSlug: "number-properties",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    // 9 counts x 3 shapes.
    variants: 27,
    params: (r) => ({ n: int(r, 2, 10), shape: int(r, 0, 2) }),
    build: ({ n, shape }) => {
      const s = SHAPES[shape];
      return {
        question: `How many ${SHAPE_WORD[s]} are there?`,
        diagram: countingRow(n, s),
        format: "MULTIPLE_CHOICE",
        answer: String(n),
        distractors: nearby(n, 4),
        solution: `Count them one at a time: there are ${n}.`,
        hints: ["Touch each shape as you count it.", "Say the numbers out loud: 1, 2, 3..."],
      };
    },
    check: ({ n }) => String(n),
  },
  {
    id: "gen-k-add-within-ten",
    topicSlug: "number-properties",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    // Every (a, b) with a, b >= 1 and a + b <= 9.
    variants: 36,
    params: (r) => {
      const a = int(r, 1, 8);
      const b = int(r, 1, 9 - a);
      return { a, b };
    },
    build: ({ a, b }) => ({
      question: `You have ${a} apples. A friend gives you ${b} more. How many apples do you have now?`,
      format: "MULTIPLE_CHOICE",
      answer: String(a + b),
      distractors: nearby(a + b, 4),
      solution: `Start at ${a} and count on ${b} more: ${a} + ${b} = ${a + b}.`,
      hints: [`Start at ${a} and count up.`, "You can use your fingers."],
    }),
    // Repeated increment rather than the + operator used in build.
    check: ({ a, b }) => {
      let t = a;
      for (let i = 0; i < b; i++) t += 1;
      return String(t);
    },
  },
  {
    id: "gen-k-take-away",
    topicSlug: "number-properties",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    variants: 40,
    params: (r) => {
      const a = int(r, 3, 10);
      const b = int(r, 1, a - 1);
      return { a, b };
    },
    build: ({ a, b }) => ({
      question: `There are ${a} birds on a fence. ${b} of them fly away. How many birds are left?`,
      format: "MULTIPLE_CHOICE",
      answer: String(a - b),
      distractors: nearby(a - b, 4),
      solution: `Start at ${a} and count back ${b}: ${a} - ${b} = ${a - b}.`,
      hints: [`Start at ${a} and count backwards.`, "Take away one at a time."],
    }),
    check: ({ a, b }) => {
      let t = a;
      for (let i = 0; i < b; i++) t -= 1;
      return String(t);
    },
  },
  {
    id: "gen-k-which-is-more",
    topicSlug: "number-properties",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    variants: 25,
    params: (r) => {
      const a = int(r, 1, 10);
      let b = int(r, 1, 10);
      if (b === a) b = a === 10 ? a - 1 : a + 1;
      return { a, b };
    },
    build: ({ a, b }) => {
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      return {
        question: `Which number is bigger, ${a} or ${b}?`,
        format: "MULTIPLE_CHOICE",
        answer: String(big),
        distractors: [String(small), "They are the same", `${small} and ${big} both`, "Neither"],
        solution: `${big} comes after ${small} when you count, so ${big} is bigger.`,
        hints: ["Count up and see which one you say later.", "The later number is the bigger one."],
      };
    },
    check: ({ a, b }) => String(a > b ? a : b),
  },
  {
    id: "gen-k-count-sides",
    topicSlug: "polygons",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    // Three shapes, so three instances — asking for more would only report a
    // shortfall every run.
    variants: 3,
    params: (r) => ({ kind: int(r, 0, 2) }),
    build: ({ kind }) => {
      const shapes = [
        { name: "triangle", sides: 3, svg: '<polygon points="50,6 94,86 6,86" fill="none" stroke="currentColor" stroke-width="4" />' },
        { name: "square", sides: 4, svg: '<rect x="8" y="8" width="80" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="4" />' },
        { name: "pentagon", sides: 5, svg: '<polygon points="50,6 93,37 77,88 23,88 7,37" fill="none" stroke="currentColor" stroke-width="4" />' },
      ];
      const s = shapes[kind];
      return {
        question: `How many sides does this ${s.name} have?`,
        diagram: `<svg viewBox="0 0 100 96" width="100" height="96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="a ${s.name}">${s.svg}</svg>`,
        format: "MULTIPLE_CHOICE",
        answer: String(s.sides),
        distractors: nearby(s.sides, 4),
        solution: `A ${s.name} has ${s.sides} straight sides. Count each edge once.`,
        hints: ["Trace around the edge with your finger.", "Count each straight line once."],
      };
    },
    check: ({ kind }) => String([3, 4, 5][kind]),
  },
  {
    id: "gen-k-next-in-pattern",
    topicSlug: "number-patterns",
    difficulty: 1,
    gradeMin: 1,
    gradeMax: 2,
    // 6 starts x 2 steps.
    variants: 12,
    params: (r) => ({ start: int(r, 1, 6), step: pick(r, [1, 2]) }),
    build: ({ start, step }) => {
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      const next = start + 4 * step;
      return {
        question: `What number comes next? ${seq.join(", ")}, ___`,
        format: "MULTIPLE_CHOICE",
        answer: String(next),
        distractors: nearby(next, 4),
        solution: `Each number goes up by ${step}, so after ${seq[3]} comes ${next}.`,
        hints: ["Look at how much the numbers go up each time.", `Try adding ${step} to the last one.`],
      };
    },
    check: ({ start, step }) => {
      let v = start;
      for (let i = 0; i < 4; i++) v += step;
      return String(v);
    },
  },
];
