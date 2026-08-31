import { type Generator, int, intExcept, pick, sgn, frac } from "./framework";

export const ALGEBRA: Generator[] = [
  {
    id: "gen-linear-two-step",
    topicSlug: "linear-equations",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 150,
    params: (r) => {
      const a = intExcept(r, 2, 12, [0]);
      const x = intExcept(r, -9, 12, [0]);
      const b = intExcept(r, -20, 20, [0]);
      return { a, x, b };
    },
    build: ({ a, x, b }) => ({
      question: `Solve for x: ${a}x ${sgn(b)} = ${a * x + b}`,
      format: "SHORT_ANSWER",
      answer: String(x),
      solution: `Subtract ${b} from both sides to get ${a}x = ${a * x}. Dividing by ${a} gives x = ${x}.`,
      hints: [`Move the constant ${b} to the right-hand side.`, `Then divide both sides by ${a}.`],
    }),
    // Independent route: scan integers for the root.
    check: ({ a, x, b }) => {
      const rhs = a * x + b;
      for (let t = -200; t <= 200; t++) if (a * t + b === rhs) return String(t);
      throw new Error("no root");
    },
  },

  {
    id: "gen-linear-both-sides",
    topicSlug: "linear-equations",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 150,
    params: (r) => {
      const a = intExcept(r, 2, 12, [0]);
      const c = intExcept(r, 1, 11, [0, a]);
      const x = intExcept(r, -9, 12, [0]);
      const b = intExcept(r, -18, 18, [0]);
      return { a, b, c, x };
    },
    build: ({ a, b, c, x }) => {
      const d = (a - c) * x + b;
      return {
        question: `Solve for x: ${a}x ${sgn(b)} = ${c}x ${sgn(d)}`,
        format: "SHORT_ANSWER",
        answer: String(x),
        solution: `Collecting x-terms: ${a - c}x = ${d - b}, so x = ${x}.`,
        hints: ["Move all x-terms to one side and constants to the other.", `You should reach ${a - c}x = ${d - b}.`],
      };
    },
    check: ({ a, b, c, x }) => {
      const d = (a - c) * x + b;
      for (let t = -200; t <= 200; t++) if (a * t + b === c * t + d) return String(t);
      throw new Error("no root");
    },
  },

  {
    id: "gen-linear-distribute",
    topicSlug: "linear-equations",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 110,
    params: (r) => {
      const k = intExcept(r, 2, 9, [0]);
      const b = intExcept(r, -9, 9, [0]);
      const x = intExcept(r, -8, 10, [0]);
      return { k, b, x };
    },
    build: ({ k, b, x }) => ({
      question: `Solve for x: ${k}(x ${sgn(b)}) = ${k * (x + b)}`,
      format: "SHORT_ANSWER",
      answer: String(x),
      solution: `Divide both sides by ${k} to get x ${sgn(b)} = ${x + b}, so x = ${x}.`,
      hints: [`You can divide both sides by ${k} straight away.`, `Then subtract ${b}.`],
    }),
    check: ({ k, b, x }) => {
      const rhs = k * (x + b);
      for (let t = -200; t <= 200; t++) if (k * (t + b) === rhs) return String(t);
      throw new Error("no root");
    },
  },

  {
    id: "gen-system-elimination",
    topicSlug: "systems-of-equations",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 140,
    params: (r) => {
      const x = intExcept(r, -8, 10, []);
      const y = intExcept(r, -8, 10, []);
      const a = intExcept(r, 1, 6, [0]);
      const b = intExcept(r, 1, 6, [0]);
      const c = intExcept(r, 1, 6, [0]);
      const d = intExcept(r, 1, 6, [0]);
      if (a * d - b * c === 0) throw new Error("reject");
      return { x, y, a, b, c, d };
    },
    build: ({ x, y, a, b, c, d }) => {
      const e = a * x + b * y;
      const f = c * x + d * y;
      return {
        question: `Solve the system: ${a}x + ${b}y = ${e} and ${c}x + ${d}y = ${f}. What is x + y?`,
        format: "SHORT_ANSWER",
        answer: String(x + y),
        solution: `Eliminating gives x = ${x} and y = ${y}, so x + y = ${x + y}.`,
        hints: ["Multiply one equation so a variable cancels when you add or subtract.", "Solve for one variable, then back-substitute."],
      };
    },
    // Independent route: exhaustive search over the integer grid.
    check: ({ x, y, a, b, c, d }) => {
      const e = a * x + b * y;
      const f = c * x + d * y;
      for (let u = -60; u <= 60; u++)
        for (let v = -60; v <= 60; v++)
          if (a * u + b * v === e && c * u + d * v === f) return String(u + v);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-system-substitution",
    topicSlug: "systems-of-equations",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 110,
    params: (r) => {
      const x = intExcept(r, -6, 12, []);
      const y = intExcept(r, -6, 12, []);
      const a = intExcept(r, 2, 7, [0]);
      return { x, y, a };
    },
    build: ({ x, y, a }) => {
      const sum = x + y;
      const combo = a * x + y;
      return {
        question: `If x + y = ${sum} and ${a}x + y = ${combo}, what is the value of x?`,
        format: "SHORT_ANSWER",
        answer: String(x),
        solution: `Subtracting the first equation from the second gives ${a - 1}x = ${combo - sum}, so x = ${x}.`,
        hints: ["Subtract one equation from the other to eliminate y.", `That leaves ${a - 1}x = ${combo - sum}.`],
      };
    },
    check: ({ x, y, a }) => {
      const sum = x + y, combo = a * x + y;
      for (let u = -80; u <= 80; u++)
        for (let v = -80; v <= 80; v++)
          if (u + v === sum && a * u + v === combo) return String(u);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-inequality-count",
    topicSlug: "inequalities",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 100,
    params: (r) => {
      const a = int(r, 2, 9);
      const b = intExcept(r, -15, 15, []);
      const limit = int(r, 10, 70);
      return { a, b, limit };
    },
    build: ({ a, b, limit }) => {
      let count = 0;
      for (let x = 1; x <= 10000; x++) if (a * x + b < limit) count++;
      if (count === 0) throw new Error("reject");
      return {
        question: `How many positive integers x satisfy ${a}x ${sgn(b)} < ${limit}?`,
        format: "SHORT_ANSWER",
        answer: String(count),
        solution: `Rearranging, ${a}x < ${limit - b}, so x < ${frac(limit - b, a)}. The positive integers below that bound number ${count}.`,
        hints: [`Isolate x to get x < ${frac(limit - b, a)}.`, "Count the positive integers strictly below that value."],
      };
    },
    // Independent route: solve for the bound, then count by formula.
    check: ({ a, b, limit }) => {
      const bound = (limit - b) / a;
      const n = Math.ceil(bound) - 1;
      return String(Math.max(0, n));
    },
  },

  {
    id: "gen-inequality-largest",
    topicSlug: "inequalities",
    difficulty: 3,
    competitionSlug: "math-league-high-school",
    variants: 90,
    params: (r) => {
      const a = int(r, 2, 9);
      const b = intExcept(r, -12, 12, []);
      const x = int(r, 2, 25);
      return { a, b, x };
    },
    build: ({ a, b, x }) => {
      const limit = a * x + b;
      const distractors = [x + 1, x - 1, x + 2, a * x].filter((d) => d !== x && d > 0).map(String);
      return {
        question: `What is the largest integer x satisfying ${a}x ${sgn(b)} ≤ ${limit}?`,
        format: "MULTIPLE_CHOICE",
        answer: String(x),
        distractors,
        solution: `Rearranging, ${a}x ≤ ${limit - b}, so x ≤ ${x}. The largest such integer is ${x}.`,
        hints: [`Subtract ${b} from both sides.`, `Then divide by ${a}.`],
      };
    },
    check: ({ a, b, x }) => {
      const limit = a * x + b;
      let best = -Infinity;
      for (let t = -300; t <= 300; t++) if (a * t + b <= limit) best = t;
      return String(best);
    },
  },

  {
    id: "gen-quadratic-roots",
    topicSlug: "quadratics",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 120,
    params: (r) => {
      const p = intExcept(r, -9, 9, [0]);
      const q = intExcept(r, -9, 9, [0]);
      if (p === q) throw new Error("reject");
      return { p, q, want: int(r, 0, 1) };
    },
    build: ({ p, q, want }) => {
      // (x - p)(x - q) = x^2 - (p+q)x + pq
      const b = -(p + q);
      const c = p * q;
      const answer = want === 1 ? p * q : p + q;
      const label = want === 1 ? "product" : "sum";
      return {
        question: `What is the ${label} of the roots of x² ${sgn(b)}x ${sgn(c)} = 0?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution:
          want === 1
            ? `By Vieta's formulas the product of the roots is the constant term, ${c}. (The roots are ${p} and ${q}.)`
            : `By Vieta's formulas the sum of the roots is −(${b}) = ${p + q}. (The roots are ${p} and ${q}.)`,
        hints: [
          want === 1 ? "For x² + bx + c, the product of the roots is c." : "For x² + bx + c, the sum of the roots is −b.",
          "You can also factor the quadratic and read the roots directly.",
        ],
      };
    },
    // Independent route: find the roots by search, then combine them.
    check: ({ p, q, want }) => {
      const b = -(p + q), c = p * q;
      const roots: number[] = [];
      for (let t = -300; t <= 300; t++) if (t * t + b * t + c === 0) roots.push(t);
      if (roots.length !== 2) throw new Error("expected two roots");
      return String(want === 1 ? roots[0] * roots[1] : roots[0] + roots[1]);
    },
  },

  {
    id: "gen-quadratic-larger-root",
    topicSlug: "quadratics",
    difficulty: 4,
    competitionSlug: "math-league-high-school",
    variants: 110,
    params: (r) => {
      const p = intExcept(r, -10, 10, []);
      const q = intExcept(r, -10, 10, [p]);
      return { p, q };
    },
    build: ({ p, q }) => {
      const b = -(p + q), c = p * q;
      const answer = Math.max(p, q);
      // Extra candidates because p+q, p·q and −max collide with the answer for
      // some root pairs; finalize() needs at least three that survive.
      const distractors = [
        Math.min(p, q), p + q, p * q, -Math.max(p, q),
        Math.max(p, q) + 1, Math.max(p, q) - 1, Math.min(p, q) - 1,
      ]
        .filter((d) => d !== answer)
        .map(String);
      return {
        question: `What is the larger root of x² ${sgn(b)}x ${sgn(c)} = 0?`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution: `The quadratic factors as (x − ${p})(x − ${q}) = 0, giving roots ${p} and ${q}. The larger is ${answer}.`,
        hints: ["Look for two numbers whose product is the constant term and whose sum is −b.", "Factor into two binomials."],
      };
    },
    check: ({ p, q }) => {
      const b = -(p + q), c = p * q;
      const roots: number[] = [];
      for (let t = -400; t <= 400; t++) if (t * t + b * t + c === 0) roots.push(t);
      return String(Math.max(...roots));
    },
  },

  {
    id: "gen-quadratic-vertex",
    topicSlug: "quadratics",
    difficulty: 5,
    competitionSlug: "amc12",
    variants: 80,
    params: (r) => {
      const a = pick(r, [1, 2, 3, 4]);
      const h = intExcept(r, -8, 8, []);
      const k = intExcept(r, -20, 20, []);
      return { a, h, k };
    },
    build: ({ a, h, k }) => {
      // a(x-h)^2 + k = a x^2 - 2ah x + (a h^2 + k)
      const b = -2 * a * h;
      const c = a * h * h + k;
      return {
        question: `The parabola y = ${a === 1 ? "" : a}x² ${sgn(b)}x ${sgn(c)} has its vertex at (h, k). What is h?`,
        format: "SHORT_ANSWER",
        answer: String(h),
        solution: `The vertex x-coordinate is −b/(2a) = −(${b})/(2·${a}) = ${h}.`,
        hints: ["The vertex of y = ax² + bx + c sits at x = −b/(2a).", `Here a = ${a} and b = ${b}.`],
      };
    },
    // Independent route: scan for the x minimizing/maximizing the quadratic.
    check: ({ a, h, k }) => {
      const b = -2 * a * h, c = a * h * h + k;
      let bestX = -1000, bestY = Infinity;
      for (let t = -500; t <= 500; t++) {
        const y = a * t * t + b * t + c;
        if (y < bestY) { bestY = y; bestX = t; }
      }
      return String(bestX);
    },
  },

  {
    id: "gen-exponent-product",
    topicSlug: "exponents-radicals",
    difficulty: 2,
    competitionSlug: "amc8",
    variants: 60,
    params: (r) => {
      const base = pick(r, [2, 3, 5]);
      const m = int(r, 1, 6);
      const n = int(r, 1, 6);
      if (Math.pow(base, m + n) > 100000) throw new Error("reject");
      return { base, m, n };
    },
    build: ({ base, m, n }) => {
      const answer = Math.pow(base, m + n);
      const distractors = [
        Math.pow(base, m * n),
        Math.pow(base, m + n + 1),
        Math.pow(base, Math.abs(m - n)),
        base * (m + n),
        Math.pow(base, m + n - 1),
        answer + base,
      ].filter((d) => d !== answer && d > 0 && d < 1e7).map(String);
      return {
        question: `Simplify ${base}^${m} × ${base}^${n}.`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution: `Multiplying powers of the same base adds exponents: ${base}^${m} × ${base}^${n} = ${base}^${m + n} = ${answer}.`,
        hints: ["Same base — add the exponents.", `You need ${base} to the power ${m + n}.`],
      };
    },
    // Independent route: repeated multiplication, never touching exponent rules.
    check: ({ base, m, n }) => {
      let a = 1, b = 1;
      for (let i = 0; i < m; i++) a *= base;
      for (let i = 0; i < n; i++) b *= base;
      return String(a * b);
    },
  },

  {
    id: "gen-exponent-power",
    topicSlug: "exponents-radicals",
    difficulty: 3,
    competitionSlug: "mathcounts",
    // 4 bases × 3 exponents × 2 exponents, minus draws that overflow the cap.
    variants: 20,
    params: (r) => {
      const base = pick(r, [2, 3, 5, 10]);
      const m = int(r, 2, 4);
      const n = int(r, 2, 3);
      if (Math.pow(base, m * n) > 1e7) throw new Error("reject");
      return { base, m, n };
    },
    build: ({ base, m, n }) => {
      const answer = Math.pow(base, m * n);
      return {
        question: `Simplify (${base}^${m})^${n}.`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `A power raised to a power multiplies exponents: (${base}^${m})^${n} = ${base}^${m * n} = ${answer}.`,
        hints: ["A power of a power multiplies the exponents.", `Compute ${base} to the power ${m * n}.`],
      };
    },
    check: ({ base, m, n }) => {
      let inner = 1;
      for (let i = 0; i < m; i++) inner *= base;
      let out = 1;
      for (let i = 0; i < n; i++) out *= inner;
      return String(out);
    },
  },

  {
    id: "gen-sequence-arithmetic",
    topicSlug: "sequences",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 140,
    params: (r) => {
      const a1 = intExcept(r, -10, 20, []);
      const d = intExcept(r, 2, 12, [0]);
      const n = int(r, 8, 40);
      return { a1, d, n };
    },
    build: ({ a1, d, n }) => {
      const answer = a1 + (n - 1) * d;
      return {
        question: `An arithmetic sequence begins ${a1}, ${a1 + d}, ${a1 + 2 * d}, ${a1 + 3 * d}, … What is its ${n}th term?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The common difference is ${d}, so aₙ = ${a1} + (n − 1)(${d}). For n = ${n}: ${a1} + ${(n - 1) * d} = ${answer}.`,
        hints: [`The common difference is ${d}.`, "Use aₙ = a₁ + (n − 1)d."],
      };
    },
    // Independent route: step the sequence forward one term at a time.
    check: ({ a1, d, n }) => {
      let v = a1;
      for (let i = 1; i < n; i++) v += d;
      return String(v);
    },
  },

  {
    id: "gen-sequence-geometric",
    topicSlug: "sequences",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 45,
    params: (r) => {
      const a1 = int(r, 1, 8);
      const ratio = pick(r, [2, 3]);
      const n = int(r, 4, 9);
      if (a1 * Math.pow(ratio, n - 1) > 1e6) throw new Error("reject");
      return { a1, ratio, n };
    },
    build: ({ a1, ratio, n }) => {
      const answer = a1 * Math.pow(ratio, n - 1);
      return {
        question: `A geometric sequence begins ${a1}, ${a1 * ratio}, ${a1 * ratio * ratio}, … What is its ${n}th term?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The common ratio is ${ratio}, so aₙ = ${a1} × ${ratio}^(n−1). For n = ${n}: ${a1} × ${Math.pow(ratio, n - 1)} = ${answer}.`,
        hints: [`Each term is ${ratio} times the one before it.`, "Use aₙ = a₁ · r^(n−1) — note the exponent is n − 1."],
      };
    },
    check: ({ a1, ratio, n }) => {
      let v = a1;
      for (let i = 1; i < n; i++) v *= ratio;
      return String(v);
    },
  },

  {
    id: "gen-sequence-sum",
    topicSlug: "sequences",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 52,
    params: (r) => ({ n: int(r, 8, 60) }),
    build: ({ n }) => {
      const answer = (n * (n + 1)) / 2;
      return {
        question: `What is the sum of the integers from 1 to ${n}, inclusive?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The sum of the first n positive integers is n(n+1)/2 = ${n}·${n + 1}/2 = ${answer}.`,
        hints: ["Pair the first and last terms, the second and second-last, and so on.", "The closed form is n(n+1)/2."],
      };
    },
    // Independent route: straight accumulation.
    check: ({ n }) => {
      let s = 0;
      for (let i = 1; i <= n; i++) s += i;
      return String(s);
    },
  },

  {
    id: "gen-function-evaluate",
    topicSlug: "functions",
    difficulty: 2,
    competitionSlug: "math-league-elementary-middle",
    variants: 140,
    params: (r) => {
      const a = intExcept(r, -6, 8, [0]);
      const b = intExcept(r, -12, 12, []);
      const x = intExcept(r, -8, 10, []);
      return { a, b, x };
    },
    build: ({ a, b, x }) => {
      const answer = a * x + b;
      return {
        question: `If f(x) = ${a}x ${sgn(b)}, what is f(${x})?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Substituting x = ${x}: ${a}(${x}) ${sgn(b)} = ${a * x} ${sgn(b)} = ${answer}.`,
        hints: [`Replace every x with ${x}.`, `Compute ${a} × ${x} first.`],
      };
    },
    check: ({ a, b, x }) => {
      let acc = b;
      const step = x >= 0 ? a : -a;
      for (let i = 0; i < Math.abs(x); i++) acc += step;
      return String(acc);
    },
  },

  {
    id: "gen-function-composite",
    topicSlug: "functions",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 110,
    params: (r) => {
      const a = intExcept(r, -5, 6, [0]);
      const b = intExcept(r, -9, 9, []);
      const x = intExcept(r, -6, 8, []);
      return { a, b, x };
    },
    build: ({ a, b, x }) => {
      const inner = a * x + b;
      const answer = a * inner + b;
      return {
        question: `If f(x) = ${a}x ${sgn(b)}, what is f(f(${x}))?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `First f(${x}) = ${inner}. Then f(${inner}) = ${a}(${inner}) ${sgn(b)} = ${answer}.`,
        hints: ["Work from the inside out.", `Find f(${x}) first, then feed that result back into f.`],
      };
    },
    // Independent route: expand the composition symbolically first.
    check: ({ a, b, x }) => String(a * a * x + a * b + b),
  },

  {
    id: "gen-poly-evaluate",
    topicSlug: "polynomials",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 140,
    params: (r) => {
      const a = intExcept(r, 1, 5, [0]);
      const b = intExcept(r, -8, 8, []);
      const c = intExcept(r, -12, 12, []);
      const x = intExcept(r, -6, 8, []);
      return { a, b, c, x };
    },
    build: ({ a, b, c, x }) => {
      const answer = a * x * x + b * x + c;
      return {
        question: `If f(x) = ${a === 1 ? "" : a}x² ${sgn(b)}x ${sgn(c)}, what is f(${x})?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `f(${x}) = ${a}(${x * x}) ${sgn(b * x)} ${sgn(c)} = ${answer}.`,
        hints: [`Compute ${x}² = ${x * x} first.`, "Then combine the three terms."],
      };
    },
    // Independent route: Horner's method.
    check: ({ a, b, c, x }) => String((a * x + b) * x + c),
  },

  {
    id: "gen-poly-remainder",
    topicSlug: "polynomials",
    difficulty: 5,
    competitionSlug: "amc12",
    variants: 110,
    params: (r) => {
      const a = intExcept(r, 1, 4, [0]);
      const b = intExcept(r, -7, 7, []);
      const c = intExcept(r, -10, 10, []);
      const k = intExcept(r, -5, 6, []);
      return { a, b, c, k };
    },
    build: ({ a, b, c, k }) => {
      const answer = a * k * k + b * k + c;
      return {
        question: `What is the remainder when ${a === 1 ? "" : a}x² ${sgn(b)}x ${sgn(c)} is divided by (x ${sgn(-k)})?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `By the Remainder Theorem the remainder is the polynomial evaluated at x = ${k}: ${a}(${k * k}) ${sgn(b * k)} ${sgn(c)} = ${answer}.`,
        hints: ["The Remainder Theorem says dividing by (x − k) leaves f(k).", `Evaluate the polynomial at x = ${k}.`],
      };
    },
    // Independent route: actual synthetic division.
    check: ({ a, b, c, k }) => {
      let acc = a;
      acc = acc * k + b;
      acc = acc * k + c;
      return String(acc);
    },
  },

  {
    id: "gen-factor-difference-squares",
    topicSlug: "factoring",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => {
      const a = int(r, 11, 99);
      const d = int(r, 1, 9);
      return { a, b: a - d };
    },
    build: ({ a, b }) => {
      const answer = a * a - b * b;
      return {
        question: `Compute ${a}² − ${b}².`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Factor as a difference of squares: (${a} − ${b})(${a} + ${b}) = ${a - b} × ${a + b} = ${answer}.`,
        hints: ["a² − b² = (a − b)(a + b).", `Here a − b = ${a - b} and a + b = ${a + b}.`],
      };
    },
    // Independent route: square each number directly.
    check: ({ a, b }) => String(a * a - b * b),
  },

  {
    id: "gen-factor-sum-product",
    topicSlug: "factoring",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 66,
    params: (r) => {
      const p = int(r, 1, 12);
      const q = intExcept(r, 1, 12, [p]);
      return { p, q };
    },
    build: ({ p, q }) => {
      const s = p + q, prod = p * q;
      const answer = Math.max(p, q);
      return {
        question: `Two positive integers have sum ${s} and product ${prod}. What is the larger of the two?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `They are the roots of x² − ${s}x + ${prod} = 0, which factors as (x − ${p})(x − ${q}). The larger is ${answer}.`,
        hints: ["The two numbers are roots of x² − (sum)x + (product) = 0.", "Try factoring that quadratic."],
      };
    },
    // Independent route: exhaustive pair search.
    check: ({ p, q }) => {
      const s = p + q, prod = p * q;
      for (let u = 1; u <= s; u++) {
        const v = s - u;
        if (u * v === prod && u >= v) return String(u);
      }
      throw new Error("no pair");
    },
  },
];
