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

  // =========================================================================
  // Casework, graph theory, recursion and combinations.
  //
  // Casework held 4 problems and graph theory 40, against 613 for modular
  // arithmetic. These even out a domain that was advertised far wider than it
  // could actually be practised.
  // =========================================================================

  {
    id: "gen-combo-casework-coins",
    topicSlug: "casework",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 85,
    params: (r) => ({ n: int(r, 15, 99) }),
    build: ({ n }) => {
      // Case on the number of dimes, then on nickels; pennies fill the rest.
      let count = 0;
      for (let dimes = 0; dimes * 10 <= n; dimes++) {
        for (let nickels = 0; dimes * 10 + nickels * 5 <= n; nickels++) count++;
      }
      return {
        question: `Using pennies (1¢), nickels (5¢) and dimes (10¢), in how many different ways can you make exactly ${n}¢? Two ways are different if they use different numbers of any coin.`,
        format: "SHORT_ANSWER",
        answer: String(count),
        solution: `Work by cases on the number of dimes, from 0 up to ${Math.floor(n / 10)}. For each of those, the number of nickels can run from 0 up to whatever the remaining amount allows, and the pennies are then forced. Adding the cases gives ${count}.`,
        hints: [
          "Fix the number of dimes first, then count the nickel choices for that case.",
          "Once dimes and nickels are chosen, the pennies are determined — there is nothing left to count.",
        ],
      };
    },
    // Independent route: the standard coin-change dynamic program, which
    // builds the count denomination by denomination instead of by cases.
    check: ({ n }) => {
      const ways = new Array(n + 1).fill(0);
      ways[0] = 1;
      for (const coin of [1, 5, 10]) {
        for (let amount = coin; amount <= n; amount++) ways[amount] += ways[amount - coin];
      }
      return String(ways[n]);
    },
  },

  {
    id: "gen-combo-casework-digit-sum",
    topicSlug: "casework",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 70,
    params: (r) => {
      const d = int(r, 2, 4);
      const s = int(r, 1, 9 * d);
      return { d, s };
    },
    build: ({ d, s }) => {
      const lo = Math.pow(10, d - 1);
      const hi = Math.pow(10, d) - 1;
      let count = 0;
      for (let x = lo; x <= hi; x++) {
        let sum = 0;
        for (let y = x; y > 0; y = Math.floor(y / 10)) sum += y % 10;
        if (sum === s) count++;
      }
      if (count === 0) throw new Error("reject");
      return {
        question: `How many ${d}-digit numbers have digits that sum to exactly ${s}? (A ${d}-digit number cannot begin with 0.)`,
        format: "SHORT_ANSWER",
        answer: String(count),
        solution: `Case on the leading digit, which runs from 1 to 9, and count how many ways the remaining ${d - 1} digit${d - 1 === 1 ? "" : "s"} can make up the rest of the sum. Totalling the cases gives ${count}.`,
        hints: [
          "The leading digit cannot be 0, so treat it separately from the others.",
          "For each leading digit, count the ways the remaining digits can reach what is left of the sum.",
        ],
      };
    },
    // Independent route: a digit-position dynamic program over partial sums,
    // never forming the numbers themselves.
    check: ({ d, s }) => {
      // dp[t] = ways for the digits placed so far to sum to t.
      let dp = new Array(s + 1).fill(0);
      for (let first = 1; first <= 9 && first <= s; first++) dp[first] += 1;
      for (let pos = 1; pos < d; pos++) {
        const next = new Array(s + 1).fill(0);
        for (let t = 0; t <= s; t++) {
          if (dp[t] === 0) continue;
          for (let digit = 0; digit <= 9 && t + digit <= s; digit++) next[t + digit] += dp[t];
        }
        dp = next;
      }
      return String(dp[s]);
    },
  },

  {
    id: "gen-combo-casework-triangles",
    topicSlug: "casework",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 49,
    params: (r) => ({ n: int(r, 12, 60) }),
    build: ({ n }) => {
      let count = 0;
      for (let a = 1; a <= n; a++) {
        for (let b = a; b <= n; b++) {
          const c = n - a - b;
          if (c < b) continue;
          if (a + b > c) count++;
        }
      }
      if (count === 0) throw new Error("reject");
      return {
        question: `How many triangles with integer side lengths have a perimeter of exactly ${n}? Two triangles are considered the same if they are congruent.`,
        format: "SHORT_ANSWER",
        answer: String(count),
        solution: `Take the sides in non-decreasing order a ≤ b ≤ c so each triangle is counted once. Case on a, then on b; c is forced to be ${n} − a − b. Keep only the cases with a + b > c, which is the triangle inequality. That gives ${count} triangles.`,
        hints: [
          "Order the sides so that congruent triangles are not counted more than once.",
          "Once two sides are chosen the third is determined — you only need to test the triangle inequality.",
        ],
      };
    },
    // Independent route: for each smallest side, work out the range of valid
    // middle sides arithmetically and add its length, rather than testing each
    // candidate. With c = n − a − b, the constraint b ≤ c caps b at
    // ⌊(n − a)/2⌋, and a + b > c forces b > (n − 2a)/2.
    check: ({ n }) => {
      let count = 0;
      for (let a = 1; 3 * a <= n; a++) {
        const bMax = Math.floor((n - a) / 2);
        const bMin = Math.max(a, Math.floor((n - 2 * a) / 2) + 1);
        if (bMax >= bMin) count += bMax - bMin + 1;
      }
      return String(count);
    },
  },

  {
    id: "gen-combo-graph-degree-edges",
    topicSlug: "graph-theory",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => {
      const n = int(r, 4, 24);
      const d = int(r, 2, Math.min(n - 1, 9));
      if ((n * d) % 2 !== 0) throw new Error("reject");
      return { n, d };
    },
    build: ({ n, d }) => {
      const answer = (n * d) / 2;
      return {
        question: `A graph has ${n} vertices, and every vertex has degree ${d}. How many edges does the graph have?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The degrees sum to ${n} × ${d} = ${n * d}. Every edge contributes 1 to the degree of each of its two endpoints, so the degree sum is twice the number of edges. Hence there are ${n * d} ÷ 2 = ${answer} edges.`,
        hints: [
          "Add up the degrees of all the vertices.",
          "Each edge gets counted once at each of its two ends.",
        ],
      };
    },
    // Independent route: accumulate the degree sum vertex by vertex rather
    // than multiplying, then halve it.
    check: ({ n, d }) => {
      let degreeSum = 0;
      for (let v = 0; v < n; v++) degreeSum += d;
      return String(degreeSum / 2);
    },
  },

  {
    id: "gen-combo-graph-bipartite",
    topicSlug: "graph-theory",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 90,
    params: (r) => ({ m: int(r, 2, 15), n: int(r, 2, 15) }),
    build: ({ m, n }) => {
      const answer = m * n;
      return {
        question: `At a dance, every one of the ${m} leaders is paired at some point with every one of the ${n} followers, and no two leaders and no two followers ever pair with each other. How many different pairs occur in total?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each of the ${m} leaders pairs with each of the ${n} followers exactly once, so there are ${m} × ${n} = ${answer} pairs. In graph terms this is the complete bipartite graph, which has mn edges rather than the C(m + n, 2) of a complete graph.`,
        hints: [
          "Pairs only ever cross between the two groups, never within one.",
          "Count the pairs one leader at a time.",
        ],
      };
    },
    // Independent route: enumerate the pairs one at a time.
    check: ({ m, n }) => {
      let count = 0;
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) count++;
      return String(count);
    },
  },

  {
    id: "gen-combo-graph-forest-edges",
    topicSlug: "graph-theory",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 60,
    params: (r) => {
      const n = int(r, 6, 40);
      const c = int(r, 1, Math.min(6, n - 1));
      return { n, c };
    },
    build: ({ n, c }) => {
      const answer = n - c;
      return {
        question: `A network of ${n} computers is split into ${c} separate group${c === 1 ? "" : "s"}. Within each group every computer is reachable from every other, and the network contains no cycles at all. How many cables are in the network?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `A connected, cycle-free graph on k vertices is a tree and has exactly k − 1 edges. Summing over the ${c} group${c === 1 ? "" : "s"}, the total is ${n} − ${c} = ${answer}, whatever the group sizes happen to be.`,
        hints: [
          "A connected graph with no cycles is a tree.",
          "A tree on k vertices always has exactly k − 1 edges.",
        ],
      };
    },
    // Independent route: build an explicit forest — hand out the vertices to
    // the components and count the edges each component actually needs.
    check: ({ n, c }) => {
      const sizes = new Array(c).fill(1);
      for (let extra = 0; extra < n - c; extra++) sizes[extra % c]++;
      let edges = 0;
      for (const size of sizes) edges += size - 1;
      return String(edges);
    },
  },

  {
    id: "gen-combo-graph-euler-faces",
    topicSlug: "graph-theory",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const v = int(r, 4, 20);
      const e = int(r, v, 3 * v - 6); // connected, and within the planar bound
      return { v, e };
    },
    build: ({ v, e }) => {
      const answer = e - v + 2;
      return {
        question: `A connected planar graph is drawn in the plane with ${v} vertices and ${e} edges, with no edges crossing. Into how many regions does it divide the plane? (Count the unbounded outer region.)`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Euler's formula for a connected planar graph says V − E + F = 2. With V = ${v} and E = ${e}, F = ${e} − ${v} + 2 = ${answer}.`,
        hints: [
          "There is a fixed relationship between vertices, edges and regions for any connected planar drawing.",
          "Start from a spanning tree, which encloses no regions at all, and add the remaining edges one at a time.",
        ],
      };
    },
    // Independent route: build the count up incrementally rather than quoting
    // Euler's formula. A spanning tree on v vertices uses v − 1 edges and
    // leaves a single region; every further edge closes exactly one new one.
    check: ({ v, e }) => {
      let regions = 1;
      const treeEdges = v - 1;
      for (let extra = 0; extra < e - treeEdges; extra++) regions++;
      return String(regions);
    },
  },

  {
    id: "gen-combo-recursion-three-steps",
    topicSlug: "recursion-in-counting",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 23,
    params: (r) => ({ n: int(r, 3, 25) }),
    build: ({ n }) => {
      const f = [1, 1, 2];
      for (let i = 3; i <= n; i++) f[i] = f[i - 1] + f[i - 2] + f[i - 3];
      return {
        question: `A staircase has ${n} steps. Climbing 1, 2, or 3 steps at a time, in how many different orders can it be climbed?`,
        format: "SHORT_ANSWER",
        answer: String(f[n]),
        solution: `Let f(n) count the ways. The final move covers 1, 2, or 3 steps, so f(n) = f(n−1) + f(n−2) + f(n−3), starting from f(0) = 1, f(1) = 1, f(2) = 2. Iterating up to ${n} gives ${f[n]}.`,
        hints: [
          "Condition on the size of the last move.",
          "Each of the three possible last moves leaves a smaller staircase of the same kind.",
        ],
      };
    },
    // Independent route: count the compositions directly. For every choice of
    // how many 1s, 2s and 3s are used, the number of orderings is a
    // multinomial coefficient — no recursion involved.
    check: ({ n }) => {
      let total = 0;
      for (let threes = 0; 3 * threes <= n; threes++) {
        for (let twos = 0; 3 * threes + 2 * twos <= n; twos++) {
          const ones = n - 3 * threes - 2 * twos;
          const moves = ones + twos + threes;
          total += fact(moves) / (fact(ones) * fact(twos) * fact(threes));
        }
      }
      return String(total);
    },
  },

  {
    id: "gen-combo-recursion-no-three-heads",
    topicSlug: "recursion-in-counting",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 21,
    params: (r) => ({ n: int(r, 4, 24) }),
    build: ({ n }) => {
      const a = [1, 2, 4];
      for (let i = 3; i <= n; i++) a[i] = a[i - 1] + a[i - 2] + a[i - 3];
      return {
        question: `A coin is flipped ${n} times and the sequence of heads and tails is recorded. How many of the possible sequences contain no run of three or more consecutive heads?`,
        format: "SHORT_ANSWER",
        answer: String(a[n]),
        solution: `Let a(n) count the valid sequences of length n. Look at the start: a sequence begins T, HT, or HHT, followed by any valid shorter sequence. That gives a(n) = a(n−1) + a(n−2) + a(n−3) with a(0) = 1, a(1) = 2, a(2) = 4, and iterating to n = ${n} gives ${a[n]}.`,
        hints: [
          "Break the sequence at the first tail.",
          "Only three openings are possible before that first tail, since three heads in a row are banned.",
        ],
      };
    },
    // Independent route: track how many heads the run currently ends with as
    // an explicit three-state machine, rather than using the scalar
    // recurrence. The states are "ends in 0, 1, or 2 heads".
    check: ({ n }) => {
      let s0 = 1;
      let s1 = 0;
      let s2 = 0;
      for (let i = 0; i < n; i++) {
        const n0 = s0 + s1 + s2; // append a tail from any state
        const n1 = s0; // append a head to a run of 0
        const n2 = s1; // append a head to a run of 1
        s0 = n0;
        s1 = n1;
        s2 = n2;
      }
      return String(s0 + s1 + s2);
    },
  },

  {
    id: "gen-combo-committee-chair",
    topicSlug: "combinations",
    difficulty: 4,
    competitionSlug: "amc10",
    // 14 club sizes × the committee sizes each allows exhausts the space.
    variants: 67,
    params: (r) => {
      const n = int(r, 5, 18);
      const k = int(r, 2, Math.min(6, n - 1));
      return { n, k };
    },
    build: ({ n, k }) => {
      const answer = nCr(n, k) * k;
      return {
        question: `A club of ${n} members must choose a committee of ${k} people and then name one member of that committee as its chair. In how many ways can this be done?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Choose the committee in C(${n}, ${k}) = ${nCr(n, k)} ways, then pick the chair from among its ${k} members: ${nCr(n, k)} × ${k} = ${answer}.`,
        hints: [
          "Do it in two stages: form the committee, then select the chair from within it.",
          "Multiply the counts for the two stages.",
        ],
      };
    },
    // Independent route: choose the chair first from the whole club, then fill
    // the rest of the committee around them — a different decomposition that
    // must land on the same total.
    check: ({ n, k }) => String(n * nCr(n - 1, k - 1)),
  },

  {
    id: "gen-combo-at-least-one",
    topicSlug: "combinations",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const b = int(r, 3, 12);
      const g = int(r, 2, 8);
      const k = int(r, 2, Math.min(5, b));
      return { b, g, k };
    },
    build: ({ b, g, k }) => {
      const answer = nCr(b + g, k) - nCr(b, k);
      return {
        question: `A team has ${b} veterans and ${g} rookies. In how many ways can a group of ${k} be chosen so that it includes at least one rookie?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Count all groups and subtract the ones that break the condition. There are C(${b + g}, ${k}) = ${nCr(b + g, k)} groups in total and C(${b}, ${k}) = ${nCr(b, k)} made entirely of veterans, so ${nCr(b + g, k)} − ${nCr(b, k)} = ${answer} include at least one rookie.`,
        hints: [
          "It is easier to count the groups that fail the condition.",
          "A group fails only if it is made up entirely of veterans.",
        ],
      };
    },
    // Independent route: sum over the exact number of rookies included,
    // rather than subtracting the complement.
    check: ({ b, g, k }) => {
      let total = 0;
      for (let rookies = 1; rookies <= Math.min(k, g); rookies++) {
        const veterans = k - rookies;
        if (veterans > b) continue;
        total += nCr(g, rookies) * nCr(b, veterans);
      }
      return String(total);
    },
  },

  {
    id: "gen-combo-circular-arrangements",
    topicSlug: "permutations",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 16,
    params: (r) => ({ n: int(r, 4, 11), together: int(r, 0, 1) }),
    build: ({ n, together }) => {
      const answer = together === 1 ? 2 * fact(n - 2) : fact(n - 1);
      if (together === 1) {
        return {
          question: `In how many ways can ${n} people be seated around a round table if two particular people insist on sitting next to each other? Two seatings are the same if one is a rotation of the other.`,
          format: "SHORT_ANSWER",
          answer: String(answer),
          solution: `Treat the inseparable pair as a single block, leaving ${n - 1} items to arrange around the table, which can be done in ${n - 2}! = ${fact(n - 2)} ways. The pair can be ordered two ways within the block, giving 2 × ${fact(n - 2)} = ${answer}.`,
          hints: ["Glue the two people together and treat them as one unit.", "Remember they can swap places inside that unit."],
        };
      }
      return {
        question: `In how many ways can ${n} people be seated around a round table? Two seatings are the same if one is a rotation of the other.`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `There are ${n}! seatings in a row, but each circular arrangement is counted ${n} times, once per rotation. So the answer is ${n}!/${n} = ${n - 1}! = ${answer}.`,
        hints: ["Rotations of the same seating are not different.", "Fix one person's seat to remove the rotational freedom."],
      };
    },
    // Independent route: divide the linear count by the number of rotations
    // instead of fixing a seat.
    check: ({ n, together }) => {
      if (together === 1) {
        // Blocks: (n − 1) items in a circle, times 2 internal orders.
        return String((2 * fact(n - 1)) / (n - 1));
      }
      return String(fact(n) / n);
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

  // =========================================================================
  // Expected value and games.
  //
  // Expected value had 36 problems and games-and-strategies had 2, so neither
  // could carry a practice session on its own.
  // =========================================================================

  {
    id: "gen-prob-expected-dice-sum",
    topicSlug: "expected-value",
    difficulty: 4,
    competitionSlug: "mathcounts",
    // 5 dice counts × 6 die shapes exhausts the parameter space.
    variants: 30,
    params: (r) => ({ dice: int(r, 1, 5), faces: pick(r, [4, 6, 8, 10, 12, 20]) }),
    build: ({ dice, faces }) => {
      const answer = frac(dice * (faces + 1), 2);
      return {
        question: `${dice} fair ${faces}-sided ${dice === 1 ? "die is" : "dice are"} rolled, each numbered 1 through ${faces}. What is the expected value of the total shown? Express your answer as a fraction in lowest terms if it is not a whole number.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `One die averages (1 + ${faces})/2 = ${frac(faces + 1, 2)}. Expected values add regardless of whether the rolls are independent, so ${dice} ${dice === 1 ? "die gives" : "dice give"} ${dice} × ${frac(faces + 1, 2)} = ${answer}.`,
        hints: [
          "The expected value of a sum is the sum of the expected values.",
          "Start by finding the average roll of a single die.",
        ],
      };
    },
    // Independent route: build the full distribution of the total by repeated
    // convolution and take its mean, using no linearity argument at all.
    check: ({ dice, faces }) => {
      // counts[s] = number of outcomes totalling s.
      let counts = [1];
      for (let d = 0; d < dice; d++) {
        const next = new Array(counts.length + faces).fill(0);
        for (let s = 0; s < counts.length; s++) {
          if (counts[s] === 0) continue;
          for (let f = 1; f <= faces; f++) next[s + f] += counts[s];
        }
        counts = next;
      }
      let weighted = 0;
      let total = 0;
      for (let s = 0; s < counts.length; s++) {
        weighted += s * counts[s];
        total += counts[s];
      }
      return frac(weighted, total);
    },
  },

  {
    id: "gen-prob-expected-chip-value",
    topicSlug: "expected-value",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const a = int(r, 2, 15);
      const b = int(r, 2, 15);
      const x = int(r, 1, 20);
      const y = intExcept(r, 1, 20, [x]);
      return { a, b, x, y };
    },
    build: ({ a, b, x, y }) => {
      const answer = frac(a * x + b * y, a + b);
      return {
        question: `A bag holds ${a} chips worth ${x} points each and ${b} chips worth ${y} points each. One chip is drawn at random. What is the expected number of points? Express your answer as a fraction in lowest terms if it is not a whole number.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `The chance of drawing a ${x}-point chip is ${a}/${a + b} and of a ${y}-point chip is ${b}/${a + b}. The expected value is (${a} × ${x} + ${b} × ${y})/${a + b} = ${a * x + b * y}/${a + b} = ${answer}.`,
        hints: [
          "Weight each value by how likely it is.",
          "Equivalently, total the points in the bag and divide by the number of chips.",
        ],
      };
    },
    // Independent route: lay out every individual chip and average them, with
    // no probabilities involved.
    check: ({ a, b, x, y }) => {
      const chips: number[] = [];
      for (let i = 0; i < a; i++) chips.push(x);
      for (let i = 0; i < b; i++) chips.push(y);
      let sum = 0;
      for (const c of chips) sum += c;
      return frac(sum, chips.length);
    },
  },

  {
    id: "gen-prob-expected-binomial",
    topicSlug: "expected-value",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 60,
    params: (r) => {
      const n = int(r, 2, 8);
      const den = pick(r, [2, 3, 4, 5, 6]);
      const num = int(r, 1, den - 1);
      return { n, num, den };
    },
    build: ({ n, num, den }) => {
      const answer = frac(n * num, den);
      return {
        question: `A basketball player attempts ${n} free throws. Each attempt is independent and succeeds with probability ${frac(num, den)}. What is the expected number of successful free throws? Express your answer as a fraction in lowest terms if it is not a whole number.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `Count each attempt separately: attempt i contributes 1 if it succeeds and 0 otherwise, so its expected contribution is ${frac(num, den)}. Expected values add, so the total is ${n} × ${frac(num, den)} = ${answer}.`,
        hints: [
          "Write the total as a sum of one indicator per attempt.",
          "Expectation adds across the attempts even though the counts do not.",
        ],
      };
    },
    // Independent route: sum k·P(exactly k successes) over the whole binomial
    // distribution using exact integer arithmetic, rather than using
    // linearity. The denominator den^n keeps this exact.
    check: ({ n, num, den }) => {
      const fail = den - num;
      let numerator = 0;
      for (let k = 0; k <= n; k++) {
        numerator += k * nCr(n, k) * Math.pow(num, k) * Math.pow(fail, n - k);
      }
      return frac(numerator, Math.pow(den, n));
    },
  },

  {
    id: "gen-prob-fair-price",
    topicSlug: "games-and-strategies",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => {
      const faces = 6;
      const threshold = int(r, 2, 6);
      const win = int(r, 2, 30);
      const lose = int(r, 0, Math.min(win - 1, 10));
      return { faces, threshold, win, lose };
    },
    build: ({ faces, threshold, win, lose }) => {
      const winning = faces - threshold + 1;
      const losing = faces - winning;
      const answer = frac(winning * win + losing * lose, faces);
      return {
        question: `In a carnival game you roll one fair six-sided die. If you roll ${threshold} or higher you are paid ${win} tokens; otherwise you are paid ${lose} token${lose === 1 ? "" : "s"}. What entry price, in tokens, makes this game fair — that is, equal to the expected payout? Express your answer as a fraction in lowest terms if it is not a whole number.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `${winning} of the 6 faces pay ${win} and the other ${losing} pay ${lose}. The expected payout is (${winning} × ${win} + ${losing} × ${lose})/6 = ${winning * win + losing * lose}/6 = ${answer}, and a fair price equals the expected payout.`,
        hints: [
          "Count how many of the six faces win.",
          "A fair price is exactly the average payout over all six equally likely faces.",
        ],
      };
    },
    // Independent route: walk the six faces one at a time and average the
    // payouts, instead of grouping them into winning and losing counts.
    check: ({ faces, threshold, win, lose }) => {
      let total = 0;
      for (let face = 1; face <= faces; face++) total += face >= threshold ? win : lose;
      return frac(total, faces);
    },
  },

  {
    id: "gen-prob-game-alternating",
    topicSlug: "games-and-strategies",
    difficulty: 6,
    competitionSlug: "amc10",
    variants: 40,
    params: (r) => {
      const den = pick(r, [2, 3, 4, 5, 6]);
      const num = int(r, 1, den - 1);
      const rolls = int(r, 2, 7);
      return { num, den, rolls };
    },
    build: ({ num, den, rolls }) => {
      // Alternating attempts, at most `rolls` in total, first success wins.
      // Ana takes attempts 1, 3, 5, …
      const fail = den - num;
      let numerator = 0;
      for (let i = 0; i < rolls; i += 2) {
        // Ana wins on attempt i+1: i failures, then a success, and the
        // remaining attempts never happen.
        numerator += Math.pow(fail, i) * num * Math.pow(den, rolls - i - 1);
      }
      const answer = frac(numerator, Math.pow(den, rolls));
      return {
        question: `Ana and Boris take turns at a task, with Ana going first. Each attempt succeeds with probability ${frac(num, den)}, independently of the others. The first person to succeed wins, and if nobody has succeeded after ${rolls} attempts in total the game is a draw. What is the probability that Ana wins? Express your answer as a fraction in lowest terms.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `Ana wins on her 1st, 2nd, … attempt — that is, on overall attempt 1, 3, 5, … up to ${rolls}. Winning on attempt k requires k − 1 failures followed by a success, with probability ${frac(fail, den)}^(k−1) × ${frac(num, den)}. These outcomes are disjoint, so add them up to get ${answer}.`,
        hints: [
          "Ana can only win on an odd-numbered attempt.",
          "For each of those, everything before it must have failed — then add the disjoint cases.",
        ],
      };
    },
    // Independent route: enumerate the game tree state by state, carrying the
    // exact probability of still being undecided, rather than summing a
    // series of powers.
    check: ({ num, den, rolls }) => {
      const fail = den - num;
      // aliveNum/aliveDen tracks P(no success yet), kept as exact integers
      // over den^attempt.
      let aliveNum = 1;
      let winNum = 0;
      for (let attempt = 1; attempt <= rolls; attempt++) {
        const successNum = aliveNum * num; // over den^attempt
        if (attempt % 2 === 1) winNum += successNum * Math.pow(den, rolls - attempt);
        aliveNum = aliveNum * fail;
      }
      return frac(winNum, Math.pow(den, rolls));
    },
  },
];
