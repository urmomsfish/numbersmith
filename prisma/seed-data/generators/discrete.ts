import { type Generator, int, intExcept, pick, gcd, frac } from "./framework";

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const nCr = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

export const NUMBER_THEORY: Generator[] = [
  {
    id: "gen-nt-modular",
    topicSlug: "modular-arithmetic",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 150,
    params: (r) => ({ n: int(r, 20, 900), m: int(r, 3, 19) }),
    build: ({ n, m }) => {
      const answer = n % m;
      return {
        question: `What is the remainder when ${n} is divided by ${m}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `${m} × ${Math.floor(n / m)} = ${m * Math.floor(n / m)}, and ${n} − ${m * Math.floor(n / m)} = ${answer}.`,
        hints: [`Find the largest multiple of ${m} that is at most ${n}.`, "Subtract it from the original number."],
      };
    },
    // Independent route: repeated subtraction rather than the % operator.
    check: ({ n, m }) => {
      let v = n;
      while (v >= m) v -= m;
      return String(v);
    },
  },

  {
    id: "gen-nt-units-digit",
    topicSlug: "modular-arithmetic",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 110,
    params: (r) => ({ base: intExcept(r, 2, 9, [1]), exp: int(r, 10, 200) }),
    build: ({ base, exp }) => {
      // Cycle-based derivation.
      const cycle: number[] = [];
      let u = 1;
      for (let i = 0; i < 4; i++) { u = (u * base) % 10; cycle.push(u); }
      const answer = cycle[(exp - 1) % 4];
      return {
        question: `What is the units digit of ${base}^${exp}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The units digits of powers of ${base} cycle through ${cycle.join(", ")} with period 4. Since ${exp} ≡ ${exp % 4 === 0 ? 4 : exp % 4} (mod 4), the units digit is ${answer}.`,
        hints: [`List the units digits of ${base}¹, ${base}², ${base}³, ${base}⁴ and look for the cycle.`, `Reduce ${exp} modulo the cycle length.`],
      };
    },
    // Independent route: multiply out mod 10, no cycle reasoning at all.
    check: ({ base, exp }) => {
      let u = 1;
      for (let i = 0; i < exp; i++) u = (u * base) % 10;
      return String(u);
    },
  },

  {
    id: "gen-nt-primes-between",
    topicSlug: "primes",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 110,
    params: (r) => {
      const lo = int(r, 2, 160);
      const hi = lo + int(r, 10, 60);
      return { lo, hi };
    },
    build: ({ lo, hi }) => {
      const primes: number[] = [];
      for (let n = lo; n <= hi; n++) if (isPrime(n)) primes.push(n);
      if (primes.length === 0) throw new Error("reject");
      return {
        question: `How many prime numbers are there between ${lo} and ${hi}, inclusive?`,
        format: "SHORT_ANSWER",
        answer: String(primes.length),
        solution: `The primes in this range are ${primes.join(", ")} — that is ${primes.length} of them.`,
        hints: ["Test each candidate for divisibility by small primes.", "You only need to test divisors up to the square root."],
      };
    },
    // Independent route: sieve of Eratosthenes.
    check: ({ lo, hi }) => {
      const sieve = new Array(hi + 1).fill(true);
      sieve[0] = sieve[1] = false;
      for (let p = 2; p * p <= hi; p++)
        if (sieve[p]) for (let m = p * p; m <= hi; m += p) sieve[m] = false;
      let c = 0;
      for (let n = lo; n <= hi; n++) if (sieve[n]) c++;
      return String(c);
    },
  },

  {
    id: "gen-nt-divisible-count",
    topicSlug: "divisibility",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 130,
    params: (r) => ({ limit: int(r, 40, 600), d: int(r, 3, 19) }),
    build: ({ limit, d }) => {
      const answer = Math.floor(limit / d);
      return {
        question: `How many positive integers less than or equal to ${limit} are divisible by ${d}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The multiples are ${d}, ${2 * d}, …, up to ${answer * d}. There are ⌊${limit}/${d}⌋ = ${answer} of them.`,
        hints: [`Divide ${limit} by ${d} and discard the remainder.`, "Count multiples, not the numbers themselves."],
      };
    },
    // Independent route: count them one at a time.
    check: ({ limit, d }) => {
      let c = 0;
      for (let n = 1; n <= limit; n++) if (n % d === 0) c++;
      return String(c);
    },
  },

  {
    id: "gen-nt-digit-sum",
    topicSlug: "number-patterns",
    difficulty: 2,
    competitionSlug: "moems",
    variants: 140,
    params: (r) => ({ n: int(r, 100, 99999) }),
    build: ({ n }) => {
      const answer = String(n).split("").reduce((a, d) => a + Number(d), 0);
      return {
        question: `What is the sum of the digits of ${n}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `${String(n).split("").join(" + ")} = ${answer}.`,
        hints: ["Add the digits one at a time.", "Work left to right and keep a running total."],
      };
    },
    // Independent route: repeated division rather than string handling.
    check: ({ n }) => {
      let v = n, s = 0;
      while (v > 0) { s += v % 10; v = Math.floor(v / 10); }
      return String(s);
    },
  },

  {
    id: "gen-nt-diophantine",
    topicSlug: "diophantine-equations",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const a = pick(r, [2, 3, 4, 5, 7]);
      const b = pick(r, [3, 5, 7, 8, 11]);
      if (gcd(a, b) !== 1) throw new Error("reject");
      const x = int(r, 1, 12);
      const y = int(r, 1, 12);
      return { a, b, x, y };
    },
    build: ({ a, b, x, y }) => {
      const n = a * x + b * y;
      let count = 0;
      for (let u = 1; u * a < n; u++) if ((n - a * u) % b === 0 && (n - a * u) / b >= 1) count++;
      if (count === 0) throw new Error("reject");
      return {
        question: `How many ordered pairs of positive integers (x, y) satisfy ${a}x + ${b}y = ${n}?`,
        format: "SHORT_ANSWER",
        answer: String(count),
        solution: `For each x with ${a}x < ${n}, check whether ${n} − ${a}x is a positive multiple of ${b}. Exactly ${count} value(s) of x work.`,
        hints: [`Solve for y: y = (${n} − ${a}x)/${b}.`, `Find the x values making that an integer, then keep only those with y ≥ 1.`],
      };
    },
    // Independent route: scan y instead of x.
    check: ({ a, b, x, y }) => {
      const n = a * x + b * y;
      let c = 0;
      for (let v = 1; v * b < n; v++) if ((n - b * v) % a === 0 && (n - b * v) / a >= 1) c++;
      return String(c);
    },
  },

  {
    id: "gen-nt-factorization-sum",
    topicSlug: "factorization",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 110,
    params: (r) => ({ n: int(r, 12, 300) }),
    build: ({ n }) => {
      let s = 0;
      for (let d = 1; d <= n; d++) if (n % d === 0) s += d;
      return {
        question: `What is the sum of all positive divisors of ${n}?`,
        format: "SHORT_ANSWER",
        answer: String(s),
        solution: `The divisors of ${n} add to ${s}.`,
        hints: ["List the divisors in pairs that multiply to the number.", "Remember to include 1 and the number itself."],
      };
    },
    // Independent route: pair divisors d and n/d rather than scanning all.
    check: ({ n }) => {
      let s = 0;
      for (let d = 1; d * d <= n; d++) {
        if (n % d === 0) {
          s += d;
          if (d !== n / d) s += n / d;
        }
      }
      return String(s);
    },
  },

  {
    id: "gen-nt-perfect-squares",
    topicSlug: "integer-properties",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 80,
    params: (r) => ({ limit: int(r, 30, 900) }),
    build: ({ limit }) => {
      const answer = Math.floor(Math.sqrt(limit));
      return {
        question: `How many perfect squares are there between 1 and ${limit}, inclusive?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The squares are 1², 2², …, ${answer}², since ${answer}² = ${answer * answer} ≤ ${limit} < ${(answer + 1) * (answer + 1)}. That is ${answer} of them.`,
        hints: ["Find the largest integer whose square does not exceed the limit.", "That integer is the count."],
      };
    },
    // Independent route: test each integer for squareness.
    check: ({ limit }) => {
      let c = 0;
      for (let n = 1; n <= limit; n++) {
        const r = Math.round(Math.sqrt(n));
        if (r * r === n) c++;
      }
      return String(c);
    },
  },
];

export const COMBINATORICS: Generator[] = [
  {
    id: "gen-combo-multiply",
    topicSlug: "counting-principles",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 90,
    params: (r) => ({ a: int(r, 2, 9), b: int(r, 2, 9), c: int(r, 1, 6) }),
    build: ({ a, b, c }) => {
      const answer = c > 1 ? a * b * c : a * b;
      const q =
        c > 1
          ? `A cafe offers ${a} sandwiches, ${b} drinks, and ${c} desserts. How many different meals of one sandwich, one drink, and one dessert are possible?`
          : `A cafe offers ${a} sandwiches and ${b} drinks. How many different meals of one sandwich and one drink are possible?`;
      return {
        question: q,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `By the multiplication principle: ${c > 1 ? `${a} × ${b} × ${c}` : `${a} × ${b}`} = ${answer}.`,
        hints: ["Multiply the number of independent choices at each stage.", "Each choice is made independently of the others."],
      };
    },
    // Independent route: enumerate the tuples.
    check: ({ a, b, c }) => {
      let n = 0;
      for (let i = 0; i < a; i++)
        for (let j = 0; j < b; j++)
          for (let k = 0; k < Math.max(1, c > 1 ? c : 1); k++) n++;
      return String(n);
    },
  },

  {
    id: "gen-combo-permutation",
    topicSlug: "permutations",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 21,
    params: (r) => {
      const n = int(r, 4, 10);
      const k = int(r, 2, Math.min(4, n));
      return { n, k };
    },
    build: ({ n, k }) => {
      let answer = 1;
      for (let i = 0; i < k; i++) answer *= n - i;
      return {
        question: `In how many ways can ${k} of ${n} distinct books be arranged in a row on a shelf?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `There are ${n} choices for the first position, ${n - 1} for the second, and so on: ${Array.from({ length: k }, (_, i) => n - i).join(" × ")} = ${answer}.`,
        hints: ["Order matters here, so this is a permutation.", `Each placement reduces the remaining pool by one.`],
      };
    },
    // Independent route: factorial quotient.
    check: ({ n, k }) => String(fact(n) / fact(n - k)),
  },

  {
    id: "gen-combo-combination",
    topicSlug: "combinations",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 39,
    params: (r) => {
      const n = int(r, 5, 14);
      const k = int(r, 2, Math.min(5, n - 1));
      return { n, k };
    },
    build: ({ n, k }) => {
      const answer = nCr(n, k);
      return {
        question: `A club has ${n} members. In how many ways can a committee of ${k} be chosen?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Order does not matter, so this is C(${n}, ${k}) = ${n}!/(${k}!·${n - k}!) = ${answer}.`,
        hints: ["A committee has no internal order, so use combinations.", `Compute C(${n}, ${k}).`],
      };
    },
    // Independent route: Pascal's triangle recurrence.
    check: ({ n, k }) => {
      const row: number[][] = [];
      for (let i = 0; i <= n; i++) {
        row[i] = [1];
        for (let j = 1; j <= i; j++) row[i][j] = (row[i - 1][j - 1] ?? 0) + (row[i - 1][j] ?? 0);
      }
      return String(row[n][k]);
    },
  },

  {
    id: "gen-combo-inclusion-exclusion",
    topicSlug: "inclusion-exclusion",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 110,
    params: (r) => {
      const total = int(r, 20, 60);
      const a = int(r, 5, total - 5);
      const b = int(r, 5, total - 5);
      const both = int(r, 1, Math.min(a, b) - 1);
      if (a + b - both > total) throw new Error("reject");
      return { total, a, b, both };
    },
    build: ({ total, a, b, both }) => {
      const answer = total - (a + b - both);
      return {
        question: `In a class of ${total} students, ${a} study French, ${b} study German, and ${both} study both. How many study neither language?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Students studying at least one: ${a} + ${b} − ${both} = ${a + b - both}. So ${total} − ${a + b - both} = ${answer} study neither.`,
        hints: ["Use inclusion-exclusion to count those studying at least one language.", "Subtract that from the class size."],
      };
    },
    // Independent route: partition into the four disjoint regions.
    check: ({ total, a, b, both }) => {
      const onlyA = a - both;
      const onlyB = b - both;
      return String(total - onlyA - onlyB - both);
    },
  },

  {
    id: "gen-combo-pigeonhole",
    topicSlug: "pigeonhole",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 56,
    params: (r) => ({ boxes: int(r, 3, 30), want: int(r, 0, 1) }),
    build: ({ boxes, want }) => {
      const answer = want === 1 ? boxes + 1 : boxes * 2 + 1;
      const q =
        want === 1
          ? `A drawer contains socks in ${boxes} different colors. What is the fewest socks you must draw to guarantee two of the same color?`
          : `A drawer contains socks in ${boxes} different colors. What is the fewest socks you must draw to guarantee three of the same color?`;
      return {
        question: q,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution:
          want === 1
            ? `In the worst case you draw one of each color (${boxes} socks) before repeating, so ${boxes} + 1 = ${answer} guarantees a pair.`
            : `In the worst case you draw two of each color (${boxes * 2} socks) before a third appears, so ${boxes * 2} + 1 = ${answer}.`,
        hints: ["Think about the worst possible order of draws.", "You need one more than the largest count that avoids the goal."],
      };
    },
    // Independent route: build the worst case explicitly.
    check: ({ boxes, want }) => {
      const perColor = want === 1 ? 1 : 2;
      let worst = 0;
      for (let i = 0; i < boxes; i++) worst += perColor;
      return String(worst + 1);
    },
  },

  {
    id: "gen-combo-arrangements-repeats",
    topicSlug: "permutations",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 40,
    params: (r) => {
      const a = int(r, 1, 4);
      const b = int(r, 1, 4);
      const c = int(r, 0, 3);
      if (a + b + c < 3 || a + b + c > 9) throw new Error("reject");
      return { a, b, c };
    },
    build: ({ a, b, c }) => {
      const n = a + b + c;
      const answer = fact(n) / (fact(a) * fact(b) * (c > 0 ? fact(c) : 1));
      const word = "A".repeat(a) + "B".repeat(b) + "C".repeat(c);
      return {
        question: `How many distinct arrangements are there of the letters in "${word}"?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `There are ${n} letters with repeats, so the count is ${n}!/(${a}!·${b}!${c > 0 ? `·${c}!` : ""}) = ${answer}.`,
        hints: ["Start with the factorial of the total number of letters.", "Divide by the factorial of each repeated letter's count."],
      };
    },
    // Independent route: multiply successive binomial placements.
    check: ({ a, b, c }) => {
      const n = a + b + c;
      return String(nCr(n, a) * nCr(n - a, b));
    },
  },

  {
    id: "gen-combo-handshake",
    topicSlug: "graph-theory",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 39,
    params: (r) => ({ n: int(r, 4, 42) }),
    build: ({ n }) => {
      const answer = (n * (n - 1)) / 2;
      return {
        question: `At a party, ${n} people each shake hands exactly once with every other person. How many handshakes occur?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each of the ${n} people shakes ${n - 1} hands, which double-counts every handshake: ${n} × ${n - 1} ÷ 2 = ${answer}.`,
        hints: ["Each handshake involves exactly two people.", "Count ordered pairs, then divide by 2."],
      };
    },
    // Independent route: sum 1 + 2 + ... + (n-1).
    check: ({ n }) => {
      let s = 0;
      for (let i = 1; i < n; i++) s += i;
      return String(s);
    },
  },

  {
    id: "gen-combo-staircase",
    topicSlug: "recursion-in-counting",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 25,
    params: (r) => ({ n: int(r, 4, 28) }),
    build: ({ n }) => {
      const f = [1, 1];
      for (let i = 2; i <= n; i++) f[i] = f[i - 1] + f[i - 2];
      return {
        question: `A staircase has ${n} steps. Climbing either 1 or 2 steps at a time, in how many different ways can it be climbed?`,
        format: "SHORT_ANSWER",
        answer: String(f[n]),
        solution: `Let f(n) be the number of ways. Then f(n) = f(n−1) + f(n−2), a Fibonacci recursion, giving f(${n}) = ${f[n]}.`,
        hints: ["The last move is either 1 step or 2 steps.", "That gives f(n) = f(n−1) + f(n−2)."],
      };
    },
    // Independent route: iterative two-variable rolling sum.
    check: ({ n }) => {
      let a = 1, b = 1;
      for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
      return String(b);
    },
  },
];

export const PROBABILITY: Generator[] = [
  {
    id: "gen-prob-marbles",
    topicSlug: "basic-probability",
    difficulty: 2,
    competitionSlug: "amc8",
    variants: 110,
    params: (r) => ({ a: int(r, 1, 12), b: int(r, 1, 12) }),
    build: ({ a, b }) => {
      const answer = frac(a, a + b);
      return {
        question: `A bag holds ${a} red marbles and ${b} blue marbles. One marble is drawn at random. What is the probability it is red? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `There are ${a + b} marbles in total, of which ${a} are red, so the probability is ${a}/${a + b} = ${answer}.`,
        hints: ["Probability is favorable outcomes over total outcomes.", `The total number of marbles is ${a + b}.`],
      };
    },
    // Independent route: reduce by searching denominators.
    check: ({ a, b }) => {
      const n = a, d = a + b;
      for (let den = 1; den <= 5000; den++) {
        if ((n * den) % d === 0) {
          const num = (n * den) / d;
          return den === 1 ? String(num) : `${num}/${den}`;
        }
      }
      throw new Error("reduce failed");
    },
  },

  {
    id: "gen-prob-two-dice",
    topicSlug: "counting-probability",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 11,
    params: (r) => ({ target: int(r, 2, 12) }),
    build: ({ target }) => {
      let favorable = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === target) favorable++;
      const answer = frac(favorable, 36);
      return {
        question: `Two fair six-sided dice are rolled. What is the probability their sum is ${target}? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `There are ${favorable} of the 36 equally likely outcomes with sum ${target}, giving ${favorable}/36 = ${answer}.`,
        hints: [`List the ordered pairs summing to ${target}.`, "There are 36 equally likely outcomes in total."],
      };
    },
    // Independent route: count via the closed form for two dice.
    check: ({ target }) => {
      const favorable = target <= 7 ? target - 1 : 13 - target;
      const g = gcd(favorable, 36) || 1;
      return favorable / g === 36 / g ? "1" : 36 / g === 1 ? String(favorable / g) : `${favorable / g}/${36 / g}`;
    },
  },

  {
    id: "gen-prob-complement",
    topicSlug: "counting-probability",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 12,
    params: (r) => ({ sides: pick(r, [4, 6, 8, 10]), rolls: int(r, 2, 4) }),
    build: ({ sides, rolls }) => {
      const totalOutcomes = Math.pow(sides, rolls);
      const noSix = Math.pow(sides - 1, rolls);
      const answer = frac(totalOutcomes - noSix, totalOutcomes);
      return {
        question: `A fair ${sides}-sided die is rolled ${rolls} times. What is the probability of rolling at least one ${sides}? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `P(never rolling ${sides}) = (${sides - 1}/${sides})^${rolls} = ${noSix}/${totalOutcomes}. So P(at least one) = 1 − ${noSix}/${totalOutcomes} = ${answer}.`,
        hints: ["It is easier to count the outcomes with no success at all.", "Subtract that probability from 1."],
      };
    },
    // Independent route: enumerate every outcome tuple.
    check: ({ sides, rolls }) => {
      const total = Math.pow(sides, rolls);
      let hit = 0;
      for (let code = 0; code < total; code++) {
        let v = code, found = false;
        for (let i = 0; i < rolls; i++) { if ((v % sides) + 1 === sides) found = true; v = Math.floor(v / sides); }
        if (found) hit++;
      }
      const g = gcd(hit, total) || 1;
      return total / g === 1 ? String(hit / g) : `${hit / g}/${total / g}`;
    },
  },

  {
    id: "gen-prob-expected-value",
    topicSlug: "expected-value",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 21,
    params: (r) => ({ n: int(r, 2, 20), p: pick(r, [2, 4, 5, 10]) }),
    build: ({ n, p }) => {
      const answer = n / p;
      if (!Number.isInteger(answer)) throw new Error("reject");
      return {
        question: `An experiment is repeated ${n} times. Each trial succeeds independently with probability 1/${p}. What is the expected number of successes?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Expected value = n × p = ${n} × 1/${p} = ${answer}.`,
        hints: ["Expectation adds across trials, even when they are dependent.", `Multiply ${n} by 1/${p}.`],
      };
    },
    // Independent route: sum the per-trial contribution.
    check: ({ n, p }) => {
      let e = 0;
      for (let i = 0; i < n; i++) e += 1 / p;
      return String(Math.round(e));
    },
  },

  {
    id: "gen-prob-conditional",
    topicSlug: "conditional-probability",
    difficulty: 5,
    competitionSlug: "amc12",
    variants: 64,
    params: (r) => {
      const red = int(r, 2, 9);
      const blue = int(r, 2, 9);
      return { red, blue };
    },
    build: ({ red, blue }) => {
      const total = red + blue;
      const answer = frac(red * (red - 1), total * (total - 1));
      return {
        question: `A bag holds ${red} red and ${blue} blue balls. Two are drawn without replacement. What is the probability both are red? Express your answer as a fraction.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `P(first red) = ${red}/${total}. Given that, P(second red) = ${red - 1}/${total - 1}. Multiplying gives ${answer}.`,
        hints: ["Multiply the first probability by the conditional second one.", "After one red is removed, both counts drop by one."],
      };
    },
    // Independent route: count unordered pairs instead of sequential draws.
    check: ({ red, blue }) => {
      const total = red + blue;
      const favorable = nCr(red, 2);
      const all = nCr(total, 2);
      const g = gcd(favorable, all) || 1;
      return all / g === 1 ? String(favorable / g) : `${favorable / g}/${all / g}`;
    },
  },
];
