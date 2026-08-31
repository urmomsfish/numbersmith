import { type Generator, int, intExcept, pick, gcd, frac } from "./framework";

/**
 * Difficulty 6-9 generators.
 *
 * These lean on identities a strong student is expected to know — Fermat,
 * Legendre, Vieta, Pick, stars and bars — and every `check` deliberately
 * ignores that identity and grinds the answer out by enumeration instead. When
 * the shortcut and the brute force agree, the identity was applied correctly.
 *
 * AIME-tagged generators are constrained to integer answers in 0-999 to match
 * the real answer format.
 */

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const nCr = (n: number, k: number) => {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
};
/** Square-and-multiply. */
function modpow(base: number, exp: number, m: number): number {
  let r = 1, b = base % m, e = exp;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1;
  }
  return r;
}
function factorize(n: number): Map<number, number> {
  const f = new Map<number, number>();
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) { f.set(p, (f.get(p) ?? 0) + 1); m /= p; }
  }
  if (m > 1) f.set(m, (f.get(m) ?? 0) + 1);
  return f;
}

/** Heronian triangles (integer sides, integer area). */
const HERONIAN: [number, number, number][] = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [5, 5, 6], [5, 5, 8], [13, 14, 15],
  [10, 13, 13], [9, 12, 15], [8, 15, 17], [4, 13, 15], [7, 15, 20],
  [6, 25, 29], [11, 13, 20], [12, 17, 25], [7, 24, 25], [9, 10, 17],
  [3, 25, 26], [15, 20, 25], [10, 17, 21], [13, 20, 21],
];

export const ADVANCED: Generator[] = [
  // ----------------------------- number theory -----------------------------
  {
    id: "gen-adv-fermat",
    topicSlug: "modular-arithmetic",
    difficulty: 7,
    competitionSlug: "hmmt",
    variants: 120,
    params: (r) => {
      const p = pick(r, [7, 11, 13, 17, 19, 23, 29, 31]);
      const a = int(r, 2, p - 1);
      const e = int(r, 40, 600);
      return { p, a, e };
    },
    build: ({ p, a, e }) => {
      // Fermat: a^(p-1) ≡ 1, so reduce the exponent first.
      const reduced = e % (p - 1) === 0 ? p - 1 : e % (p - 1);
      const answer = modpow(a, reduced, p);
      return {
        question: `What is the remainder when ${a}^${e} is divided by ${p}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Since ${p} is prime and ${p} ∤ ${a}, Fermat's Little Theorem gives ${a}^${p - 1} ≡ 1 (mod ${p}). As ${e} ≡ ${e % (p - 1)} (mod ${p - 1}), we get ${a}^${e} ≡ ${a}^${reduced} ≡ ${answer} (mod ${p}).`,
        hints: [
          `${p} is prime, so Fermat's Little Theorem applies: a^${p - 1} ≡ 1 (mod ${p}).`,
          `Reduce the exponent ${e} modulo ${p - 1} first, then compute the small power.`,
        ],
      };
    },
    // Independent route: naive repeated multiplication, no exponent reduction.
    check: ({ p, a, e }) => {
      let r = 1;
      for (let i = 0; i < e; i++) r = (r * a) % p;
      return String(r);
    },
  },

  {
    id: "gen-adv-trailing-zeros",
    topicSlug: "advanced-number-theory",
    difficulty: 6,
    competitionSlug: "aime",
    variants: 130,
    params: (r) => ({ n: int(r, 30, 2000) }),
    build: ({ n }) => {
      let answer = 0;
      for (let p = 5; p <= n; p *= 5) answer += Math.floor(n / p);
      if (answer > 999) throw new Error("reject");
      const terms: string[] = [];
      for (let p = 5; p <= n; p *= 5) terms.push(`⌊${n}/${p}⌋ = ${Math.floor(n / p)}`);
      return {
        question: `How many trailing zeros does ${n}! have?`,
        format: "INTEGER",
        answer: String(answer),
        solution: `Trailing zeros come from factors of 10 = 2 × 5, and factors of 5 are scarcer. By Legendre's formula the exponent of 5 in ${n}! is ${terms.join(" + ")} = ${answer}.`,
        hints: [
          "Each trailing zero needs a factor of 2 and a factor of 5 — fives are the bottleneck.",
          "Count multiples of 5, then of 25, then of 125, and so on, and add them.",
        ],
      };
    },
    // Independent route: count the factors of 5 inside each integer up to n.
    check: ({ n }) => {
      let total = 0;
      for (let i = 5; i <= n; i += 5) {
        let v = i;
        while (v % 5 === 0) { total++; v /= 5; }
      }
      return String(total);
    },
  },

  {
    id: "gen-adv-unit-fraction-pairs",
    topicSlug: "advanced-number-theory",
    difficulty: 8,
    competitionSlug: "aime",
    variants: 55,
    params: (r) => ({ n: int(r, 2, 60) }),
    build: ({ n }) => {
      // 1/x + 1/y = 1/n  <=>  (x-n)(y-n) = n^2, so the count is d(n^2).
      const f = factorize(n);
      let answer = 1;
      for (const e of f.values()) answer *= 2 * e + 1;
      if (answer > 999) throw new Error("reject");
      const fstr = [...f.entries()].map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(" × ");
      return {
        question: `How many ordered pairs of positive integers (x, y) satisfy 1/x + 1/y = 1/${n}?`,
        format: "INTEGER",
        answer: String(answer),
        solution: `Clearing denominators and rearranging gives (x − ${n})(y − ${n}) = ${n}² = ${n * n}. Each positive divisor of ${n * n} gives one ordered pair. Since ${n} = ${fstr}, ${n}² has ${answer} divisors.`,
        hints: [
          `Multiply through by ${n}xy and move everything to one side.`,
          `You should reach (x − ${n})(y − ${n}) = ${n}². Now count the divisors of ${n}².`,
        ],
      };
    },
    // Independent route: scan x directly and test whether y comes out a positive integer.
    check: ({ n }) => {
      let count = 0;
      const limit = n * n + n;
      for (let x = n + 1; x <= limit; x++) {
        const denom = x - n;
        if ((n * n) % denom === 0) count++;
      }
      return String(count);
    },
  },

  {
    id: "gen-adv-crt",
    topicSlug: "modular-arithmetic",
    difficulty: 6,
    competitionSlug: "arml",
    variants: 120,
    params: (r) => {
      const m = pick(r, [3, 4, 5, 7, 8, 9, 11]);
      const k = pick(r, [3, 4, 5, 7, 8, 9, 11, 13]);
      if (gcd(m, k) !== 1) throw new Error("reject");
      return { m, k, a: int(r, 0, m - 1), b: int(r, 0, k - 1) };
    },
    build: ({ m, k, a, b }) => {
      // Construct by stepping through the residue class of the larger modulus.
      let answer = -1;
      for (let t = 0; t < m; t++) {
        const cand = b + k * t;
        if (cand % m === a && cand > 0) { answer = cand; break; }
      }
      if (answer < 0) throw new Error("reject");
      return {
        question: `What is the smallest positive integer that leaves remainder ${a} when divided by ${m} and remainder ${b} when divided by ${k}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Numbers leaving remainder ${b} mod ${k} are ${b}, ${b + k}, ${b + 2 * k}, … Testing these against the condition mod ${m}, the first that works is ${answer}. (Since gcd(${m}, ${k}) = 1, solutions repeat every ${m * k}.)`,
        hints: [
          `List numbers congruent to ${b} mod ${k} and test each against the other condition.`,
          `Because ${m} and ${k} are coprime, a solution exists and is unique mod ${m * k}.`,
        ],
      };
    },
    // Independent route: exhaustive scan from 1.
    check: ({ m, k, a, b }) => {
      for (let n = 1; n <= m * k * 2; n++) if (n % m === a && n % k === b) return String(n);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-adv-modular-inverse",
    topicSlug: "modular-arithmetic",
    difficulty: 6,
    competitionSlug: "stanford-math-tournament",
    variants: 110,
    params: (r) => {
      const m = int(r, 7, 60);
      const a = int(r, 2, m - 1);
      if (gcd(a, m) !== 1) throw new Error("reject");
      return { a, m };
    },
    build: ({ a, m }) => {
      // Extended Euclid.
      let [oldR, r] = [a, m];
      let [oldS, s] = [1, 0];
      while (r !== 0) {
        const q = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - q * r];
        [oldS, s] = [s, oldS - q * s];
      }
      const answer = ((oldS % m) + m) % m;
      return {
        question: `Find the multiplicative inverse of ${a} modulo ${m}. Give the answer as an integer from 0 to ${m - 1}.`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `We need x with ${a}x ≡ 1 (mod ${m}). The extended Euclidean algorithm gives x = ${answer}, and indeed ${a} × ${answer} = ${a * answer} ≡ 1 (mod ${m}).`,
        hints: [
          `An inverse exists because gcd(${a}, ${m}) = 1.`,
          `Look for x with ${a}x − 1 divisible by ${m}.`,
        ],
      };
    },
    // Independent route: brute-force scan of residues.
    check: ({ a, m }) => {
      for (let x = 0; x < m; x++) if ((a * x) % m === 1) return String(x);
      throw new Error("no inverse");
    },
  },

  // ----------------------------- combinatorics -----------------------------
  {
    id: "gen-adv-stars-bars",
    topicSlug: "advanced-combinatorics",
    difficulty: 7,
    competitionSlug: "purple-comet",
    variants: 60,
    params: (r) => {
      const k = int(r, 3, 6);
      const n = int(r, 4, 18);
      return { k, n };
    },
    build: ({ k, n }) => {
      const answer = nCr(n + k - 1, k - 1);
      if (answer > 100000) throw new Error("reject");
      return {
        question: `How many solutions in nonnegative integers does x₁ + x₂ + … + x_${k} = ${n} have?`,
        format: "INTEGER",
        answer: String(answer),
        solution: `This is stars and bars: ${n} identical units distributed into ${k} labelled boxes, giving C(${n} + ${k} − 1, ${k} − 1) = C(${n + k - 1}, ${k - 1}) = ${answer}.`,
        hints: [
          `Picture ${n} stars and ${k - 1} dividing bars in a row.`,
          `The count is C(n + k − 1, k − 1).`,
        ],
      };
    },
    // Independent route: dynamic programming over the variables.
    check: ({ k, n }) => {
      let dp = new Array(n + 1).fill(0);
      dp[0] = 1;
      for (let v = 0; v < k; v++) {
        const next = new Array(n + 1).fill(0);
        for (let total = 0; total <= n; total++)
          for (let take = 0; take <= total; take++) next[total] += dp[total - take];
        dp = next;
      }
      return String(dp[n]);
    },
  },

  {
    id: "gen-adv-grid-paths",
    topicSlug: "advanced-combinatorics",
    difficulty: 6,
    competitionSlug: "amc12",
    variants: 60,
    params: (r) => ({ m: int(r, 2, 9), n: int(r, 2, 9) }),
    build: ({ m, n }) => {
      const answer = nCr(m + n, m);
      return {
        question: `How many lattice paths go from (0, 0) to (${m}, ${n}) using only unit steps right and up?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Every path is a sequence of ${m} right-steps and ${n} up-steps, so the count is C(${m + n}, ${m}) = ${answer}.`,
        hints: [
          `Each path uses exactly ${m} right-steps and ${n} up-steps in some order.`,
          "Choose which positions in the sequence are the right-steps.",
        ],
      };
    },
    // Independent route: fill the grid cell by cell.
    check: ({ m, n }) => {
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          dp[i][j] = i === 0 && j === 0 ? 1 : (i > 0 ? dp[i - 1][j] : 0) + (j > 0 ? dp[i][j - 1] : 0);
      return String(dp[m][n]);
    },
  },

  {
    id: "gen-adv-derangement",
    topicSlug: "advanced-combinatorics",
    difficulty: 8,
    competitionSlug: "hmmt",
    variants: 7,
    params: (r) => ({ n: int(r, 3, 9) }),
    build: ({ n }) => {
      const d = [1, 0];
      for (let i = 2; i <= n; i++) d[i] = (i - 1) * (d[i - 1] + d[i - 2]);
      return {
        question: `In how many ways can ${n} letters be placed into ${n} addressed envelopes so that no letter goes into its own envelope?`,
        format: "SHORT_ANSWER",
        answer: String(d[n]),
        solution: `These are derangements, satisfying D(n) = (n − 1)(D(n−1) + D(n−2)) with D(1) = 0 and D(2) = 1. Iterating gives D(${n}) = ${d[n]}.`,
        hints: [
          "No item may occupy its own position — these are derangements.",
          "Either use the recursion D(n) = (n−1)(D(n−1) + D(n−2)) or inclusion-exclusion.",
        ],
      };
    },
    // Independent route: inclusion-exclusion sum.
    check: ({ n }) => {
      let total = 0;
      for (let k = 0; k <= n; k++) total += (k % 2 === 0 ? 1 : -1) * nCr(n, k) * fact(n - k);
      return String(total);
    },
  },

  {
    id: "gen-adv-no-adjacent",
    topicSlug: "recursion-in-counting",
    difficulty: 7,
    competitionSlug: "arml",
    variants: 18,
    params: (r) => ({ n: int(r, 4, 21) }),
    build: ({ n }) => {
      // Count = Fibonacci(n+2) with F(1)=F(2)=1.
      let a = 1, b = 1;
      for (let i = 3; i <= n + 2; i++) { const t = a + b; a = b; b = t; }
      return {
        question: `How many binary strings of length ${n} contain no two consecutive 1s?`,
        format: "SHORT_ANSWER",
        answer: String(b),
        solution: `Let f(n) count such strings. A string ending in 0 extends any valid string of length n−1; one ending in 1 must have 0 before it, extending a valid string of length n−2. So f(n) = f(n−1) + f(n−2), a Fibonacci pattern, giving f(${n}) = ${b}.`,
        hints: [
          "Split by whether the last character is 0 or 1.",
          "A trailing 1 forces the character before it to be 0.",
        ],
      };
    },
    // Independent route: enumerate every bit pattern (n <= 21 keeps this cheap).
    check: ({ n }) => {
      let count = 0;
      const total = 1 << n;
      for (let mask = 0; mask < total; mask++) if ((mask & (mask >> 1)) === 0) count++;
      return String(count);
    },
  },

  // -------------------------------- algebra --------------------------------
  {
    id: "gen-adv-vieta-cubic",
    topicSlug: "polynomials",
    difficulty: 7,
    competitionSlug: "amc12",
    variants: 110,
    params: (r) => {
      const p = intExcept(r, -7, 7, [0]);
      const q = intExcept(r, -7, 7, [0, p]);
      const s = intExcept(r, -7, 7, [0, p, q]);
      return { p, q, s };
    },
    build: ({ p, q, s }) => {
      // (x-p)(x-q)(x-s) = x^3 - e1 x^2 + e2 x - e3
      const e1 = p + q + s;
      const e2 = p * q + q * s + p * s;
      const e3 = p * q * s;
      const answer = e1 * e1 - 2 * e2; // sum of squares of roots
      const sgn = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
      return {
        question: `The cubic x³ ${sgn(-e1)}x² ${sgn(e2)}x ${sgn(-e3)} = 0 has three real roots. What is the sum of the squares of its roots?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `By Vieta, the roots sum to ${e1} and their pairwise products sum to ${e2}. Then Σr² = (Σr)² − 2Σrs = ${e1}² − 2(${e2}) = ${answer}.`,
        hints: [
          "Vieta gives the sum of the roots and the sum of their pairwise products directly.",
          "Use the identity Σr² = (Σr)² − 2Σrs — you never need the roots themselves.",
        ],
      };
    },
    // Independent route: find the roots by search and square them.
    check: ({ p, q, s }) => {
      const e1 = p + q + s, e2 = p * q + q * s + p * s, e3 = p * q * s;
      const roots: number[] = [];
      for (let t = -60; t <= 60; t++)
        if (t * t * t - e1 * t * t + e2 * t - e3 === 0) roots.push(t);
      const uniq = [...new Set(roots)];
      let total = 0;
      for (const root of [p, q, s]) {
        if (!uniq.includes(root)) throw new Error("root mismatch");
        total += root * root;
      }
      return String(total);
    },
  },

  {
    id: "gen-adv-symmetric-sums",
    topicSlug: "factoring",
    difficulty: 6,
    competitionSlug: "amc12",
    variants: 110,
    params: (r) => {
      const x = intExcept(r, -9, 12, []);
      const y = intExcept(r, -9, 12, [x]);
      return { x, y, want: int(r, 0, 1) };
    },
    build: ({ x, y, want }) => {
      const s = x + y, p = x * y;
      const answer = want === 1 ? s * s * s - 3 * p * s : s * s - 2 * p;
      const label = want === 1 ? "x³ + y³" : "x² + y²";
      const identity = want === 1 ? "(x+y)³ − 3xy(x+y)" : "(x+y)² − 2xy";
      return {
        question: `If x + y = ${s} and xy = ${p}, what is ${label}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `${label} = ${identity} = ${want === 1 ? `${s}³ − 3(${p})(${s})` : `${s}² − 2(${p})`} = ${answer}.`,
        hints: [
          `Express ${label} in terms of x + y and xy.`,
          `The identity you need is ${label} = ${identity}.`,
        ],
      };
    },
    // Independent route: use the actual values of x and y.
    check: ({ x, y, want }) => String(want === 1 ? x * x * x + y * y * y : x * x + y * y),
  },

  {
    id: "gen-adv-infinite-geometric",
    topicSlug: "sequences",
    difficulty: 6,
    competitionSlug: "amc12",
    variants: 90,
    params: (r) => {
      const a = int(r, 1, 20);
      const num = int(r, 1, 6);
      const den = int(r, num + 1, 9);
      if (gcd(num, den) !== 1) throw new Error("reject");
      return { a, num, den };
    },
    build: ({ a, num, den }) => {
      // Sum = a / (1 - num/den) = a*den/(den-num)
      const answer = frac(a * den, den - num);
      return {
        question: `An infinite geometric series has first term ${a} and common ratio ${num}/${den}. What is its sum?`,
        format: "SHORT_ANSWER",
        answer,
        solution: `Since |r| < 1 the series converges to a/(1 − r) = ${a} / (1 − ${num}/${den}) = ${a} × ${den}/${den - num} = ${answer}.`,
        hints: [
          "A geometric series with |r| < 1 sums to a/(1 − r).",
          `Here 1 − r = ${den - num}/${den}.`,
        ],
      };
    },
    // Independent route: accumulate partial sums until they stop moving.
    check: ({ a, num, den }) => {
      const r = num / den;
      let sum = 0, term = a;
      for (let i = 0; i < 4000; i++) { sum += term; term *= r; }
      const exactNum = a * den, exactDen = den - num;
      const g = gcd(exactNum, exactDen) || 1;
      const approx = exactNum / exactDen;
      if (Math.abs(sum - approx) > 1e-6) throw new Error("series mismatch");
      return exactDen / g === 1 ? String(exactNum / g) : `${exactNum / g}/${exactDen / g}`;
    },
  },

  {
    id: "gen-adv-telescoping",
    topicSlug: "sequences",
    difficulty: 7,
    competitionSlug: "stanford-math-tournament",
    variants: 90,
    params: (r) => ({ n: int(r, 4, 120) }),
    build: ({ n }) => {
      const answer = frac(n, n + 1);
      return {
        question: `Evaluate the sum 1/(1·2) + 1/(2·3) + 1/(3·4) + … + 1/(${n}·${n + 1}).`,
        format: "SHORT_ANSWER",
        answer,
        solution: `Each term splits as 1/(k(k+1)) = 1/k − 1/(k+1). The sum telescopes to 1 − 1/${n + 1} = ${answer}.`,
        hints: [
          "Write 1/(k(k+1)) as a difference of two simpler fractions.",
          "Almost every term cancels against its neighbour.",
        ],
      };
    },
    // Independent route: exact rational accumulation, no telescoping.
    check: ({ n }) => {
      let num = 0, den = 1;
      for (let k = 1; k <= n; k++) {
        const tn = 1, td = k * (k + 1);
        num = num * td + tn * den;
        den = den * td;
        const g = gcd(num, den) || 1;
        num /= g; den /= g;
      }
      return den === 1 ? String(num) : `${num}/${den}`;
    },
  },

  // ------------------------------- geometry --------------------------------
  {
    id: "gen-adv-heron",
    topicSlug: "advanced-geometry",
    difficulty: 7,
    competitionSlug: "math-prize-for-girls",
    variants: 57,
    params: (r) => ({ i: int(r, 0, HERONIAN.length - 1), k: int(r, 1, 3) }),
    build: ({ i, k }) => {
      const [a, b, c] = HERONIAN[i].map((x) => x * k);
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      if (!Number.isInteger(area)) throw new Error("reject");
      return {
        question: `A triangle has side lengths ${a}, ${b}, and ${c}. What is its area?`,
        format: "SHORT_ANSWER",
        answer: String(area),
        solution: `The semiperimeter is s = ${s}. By Heron's formula the area is √(${s}·${s - a}·${s - b}·${s - c}) = √${s * (s - a) * (s - b) * (s - c)} = ${area}.`,
        hints: [
          "Use Heron's formula with the semiperimeter s = (a + b + c)/2.",
          `Here s = ${s}.`,
        ],
      };
    },
    // Independent route: 16K² = 4a²b² − (a² + b² − c²)², which never forms s.
    check: ({ i, k }) => {
      const [a, b, c] = HERONIAN[i].map((x) => x * k);
      const sixteenKsq = 4 * a * a * b * b - Math.pow(a * a + b * b - c * c, 2);
      return String(Math.round(Math.sqrt(sixteenKsq / 16)));
    },
  },

  {
    id: "gen-adv-pick-theorem",
    topicSlug: "advanced-geometry",
    difficulty: 7,
    competitionSlug: "arml",
    variants: 90,
    params: (r) => ({ a: int(r, 2, 30), b: int(r, 2, 30) }),
    build: ({ a, b }) => {
      // Right triangle with vertices (0,0), (a,0), (0,b).
      const boundary = a + b + gcd(a, b);
      const area = (a * b) / 2;
      const interior = area - boundary / 2 + 1;
      if (!Number.isInteger(interior)) throw new Error("reject");
      return {
        question: `A triangle has vertices at (0, 0), (${a}, 0), and (0, ${b}). How many lattice points lie strictly inside it?`,
        format: "SHORT_ANSWER",
        answer: String(interior),
        solution: `The area is ${area}. Boundary lattice points number ${a} + ${b} + gcd(${a}, ${b}) = ${boundary}. Pick's theorem, A = I + B/2 − 1, rearranges to I = ${area} − ${boundary}/2 + 1 = ${interior}.`,
        hints: [
          "Pick's theorem relates area, interior points, and boundary points: A = I + B/2 − 1.",
          `The hypotenuse passes through gcd(${a}, ${b}) − 1 lattice points strictly between its endpoints.`,
        ],
      };
    },
    // Independent route: count the interior lattice points one by one.
    check: ({ a, b }) => {
      let count = 0;
      for (let x = 1; x < a; x++)
        for (let y = 1; y < b; y++)
          if (y * a + x * b < a * b) count++;
      return String(count);
    },
  },

  {
    id: "gen-adv-power-of-point",
    topicSlug: "advanced-geometry",
    difficulty: 7,
    competitionSlug: "hmmt",
    variants: 80,
    params: (r) => {
      const pa = int(r, 2, 15);
      const k = int(r, 2, 12);
      const pc = int(r, 2, 20);
      const prod = pa * (pa + k);
      if (prod % pc !== 0 || prod / pc <= pc) throw new Error("reject");
      return { pa, k, pc };
    },
    build: ({ pa, k, pc }) => {
      const pb = pa + k;
      const prod = pa * pb;
      const answer = prod / pc;
      return {
        question: `From an external point P, one secant meets a circle at A and B with PA = ${pa} and PB = ${pb}. A second secant through P meets the circle at C and D with PC = ${pc}. What is PD?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The power of the point gives PA · PB = PC · PD, so ${pa} × ${pb} = ${pc} × PD, hence PD = ${prod}/${pc} = ${answer}.`,
        hints: [
          "The power of a point is the same along every secant through it.",
          `Set PA · PB equal to PC · PD.`,
        ],
      };
    },
    // Independent route: solve the proportion by integer search.
    check: ({ pa, k, pc }) => {
      const prod = pa * (pa + k);
      for (let x = 1; x <= prod; x++) if (pc * x === prod) return String(x);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-adv-inradius",
    topicSlug: "advanced-geometry",
    difficulty: 6,
    competitionSlug: "amc12",
    variants: 55,
    params: (r) => ({ i: int(r, 0, HERONIAN.length - 1), k: int(r, 1, 4) }),
    build: ({ i, k }) => {
      const [a, b, c] = HERONIAN[i].map((x) => x * k);
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      if (!Number.isInteger(area)) throw new Error("reject");
      const rIn = area / s;
      if (!Number.isInteger(rIn)) throw new Error("reject");
      return {
        question: `A triangle has sides ${a}, ${b}, and ${c}. What is the radius of its inscribed circle?`,
        format: "SHORT_ANSWER",
        answer: String(rIn),
        solution: `The semiperimeter is ${s} and the area is ${area}. Since Area = r·s, the inradius is ${area}/${s} = ${rIn}.`,
        hints: [
          "Split the triangle into three triangles from the incenter.",
          "That gives Area = r · s, where s is the semiperimeter.",
        ],
      };
    },
    // Independent route: r = (a + b − c)/2 for right triangles, else via tangent lengths.
    check: ({ i, k }) => {
      const [a, b, c] = HERONIAN[i].map((x) => x * k);
      const s = (a + b + c) / 2;
      // Tangent lengths from each vertex are s−a, s−b, s−c; r² = (s−a)(s−b)(s−c)/s.
      const rsq = ((s - a) * (s - b) * (s - c)) / s;
      return String(Math.round(Math.sqrt(rsq)));
    },
  },

  // ------------------------------ probability ------------------------------
  {
    id: "gen-adv-binomial-prob",
    topicSlug: "counting-probability",
    difficulty: 7,
    competitionSlug: "amc12",
    variants: 55,
    params: (r) => {
      const n = int(r, 4, 12);
      const k = int(r, 1, n - 1);
      return { n, k };
    },
    build: ({ n, k }) => {
      const favorable = nCr(n, k);
      const total = Math.pow(2, n);
      const answer = frac(favorable, total);
      return {
        question: `A fair coin is flipped ${n} times. What is the probability of getting exactly ${k} heads? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `There are C(${n}, ${k}) = ${favorable} favorable sequences out of 2^${n} = ${total} equally likely ones, giving ${favorable}/${total} = ${answer}.`,
        hints: [
          "Every sequence of flips is equally likely.",
          `Count the sequences with exactly ${k} heads using a binomial coefficient.`,
        ],
      };
    },
    // Independent route: enumerate every flip sequence as a bitmask.
    check: ({ n, k }) => {
      const total = 1 << n;
      let favorable = 0;
      for (let mask = 0; mask < total; mask++) {
        let bits = 0;
        for (let i = 0; i < n; i++) if (mask & (1 << i)) bits++;
        if (bits === k) favorable++;
      }
      const g = gcd(favorable, total) || 1;
      return total / g === 1 ? String(favorable / g) : `${favorable / g}/${total / g}`;
    },
  },

  {
    id: "gen-adv-expected-max-dice",
    topicSlug: "expected-value",
    difficulty: 8,
    competitionSlug: "pumac",
    variants: 12,
    params: (r) => ({ sides: pick(r, [4, 6, 8, 10, 12, 20]), rolls: int(r, 2, 3) }),
    build: ({ sides, rolls }) => {
      // E[max] = sum_{v} v * (v^rolls - (v-1)^rolls) / sides^rolls
      let num = 0;
      const den = Math.pow(sides, rolls);
      for (let v = 1; v <= sides; v++) num += v * (Math.pow(v, rolls) - Math.pow(v - 1, rolls));
      const answer = frac(num, den);
      return {
        question: `A fair ${sides}-sided die is rolled ${rolls} times. What is the expected value of the largest roll? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `P(max = v) = (v^${rolls} − (v−1)^${rolls}) / ${sides}^${rolls}, since max ≤ v in v^${rolls} outcomes. Summing v · P(max = v) over v = 1 to ${sides} gives ${num}/${den} = ${answer}.`,
        hints: [
          "Count outcomes where the maximum is at most v — that is v^n out of s^n.",
          "Subtract consecutive counts to get P(max = v) exactly.",
        ],
      };
    },
    // Independent route: enumerate every outcome tuple and average the maxima.
    check: ({ sides, rolls }) => {
      const total = Math.pow(sides, rolls);
      let sum = 0;
      for (let code = 0; code < total; code++) {
        let v = code, best = 0;
        for (let i = 0; i < rolls; i++) { best = Math.max(best, (v % sides) + 1); v = Math.floor(v / sides); }
        sum += best;
      }
      const g = gcd(sum, total) || 1;
      return total / g === 1 ? String(sum / g) : `${sum / g}/${total / g}`;
    },
  },
];
