import { type Generator, int, intExcept, pick, gcd, frac } from "./framework";

/** Reduce n/d by *searching* for the smallest denominator that works, rather
 * than dividing by the gcd. Used in `check` so it never shares code with the
 * gcd-based `frac` used in `build`. */
function reduceBySearch(n: number, d: number): string {
  if (d < 0) { n = -n; d = -d; }
  for (let den = 1; den <= 5000; den++) {
    if ((n * den) % d === 0) {
      const num = (n * den) / d;
      return den === 1 ? String(num) : `${num}/${den}`;
    }
  }
  throw new Error("reduceBySearch failed");
}

export const ARITHMETIC: Generator[] = [
  {
    id: "gen-frac-add",
    topicSlug: "fractions",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 110,
    params: (r) => {
      const b = pick(r, [2, 3, 4, 5, 6, 8, 10, 12]);
      const d = pick(r, [2, 3, 4, 5, 6, 8, 10, 12]);
      const a = int(r, 1, b - 1);
      const c = int(r, 1, d - 1);
      if (a / b + c / d >= 2) throw new Error("reject");
      return { a, b, c, d };
    },
    build: ({ a, b, c, d }) => {
      const n = a * d + c * b;
      const den = b * d;
      const answer = frac(n, den);
      return {
        question: `What is ${a}/${b} + ${c}/${d}?`,
        format: "SHORT_ANSWER",
        answer,
        solution: `A common denominator is ${den}. ${a}/${b} = ${a * d}/${den} and ${c}/${d} = ${c * b}/${den}, so the sum is ${n}/${den} = ${answer}.`,
        hints: [
          `Use ${den} as a common denominator.`,
          `Rewrite both fractions over ${den}, then add the numerators.`,
        ],
      };
    },
    check: ({ a, b, c, d }) => reduceBySearch(a * d + c * b, b * d),
  },

  {
    id: "gen-frac-sub",
    topicSlug: "fractions",
    difficulty: 2,
    competitionSlug: "moems",
    variants: 100,
    params: (r) => {
      const b = pick(r, [3, 4, 5, 6, 8, 10, 12]);
      const d = pick(r, [3, 4, 5, 6, 8, 10, 12]);
      const a = int(r, 1, b - 1);
      const c = int(r, 1, d - 1);
      if (a / b <= c / d) throw new Error("reject");
      return { a, b, c, d };
    },
    build: ({ a, b, c, d }) => {
      const n = a * d - c * b;
      const den = b * d;
      const answer = frac(n, den);
      return {
        question: `What is ${a}/${b} − ${c}/${d}?`,
        format: "SHORT_ANSWER",
        answer,
        solution: `Over the common denominator ${den}: ${a * d}/${den} − ${c * b}/${den} = ${n}/${den} = ${answer}.`,
        hints: [`Rewrite both fractions with denominator ${den}.`, "Subtract the numerators, then reduce."],
      };
    },
    check: ({ a, b, c, d }) => reduceBySearch(a * d - c * b, b * d),
  },

  {
    id: "gen-frac-of",
    topicSlug: "fractions",
    difficulty: 2,
    competitionSlug: "math-league-elementary-middle",
    variants: 80,
    params: (r) => {
      const b = pick(r, [2, 3, 4, 5, 6, 8]);
      const a = int(r, 1, b - 1);
      const k = int(r, 2, 30);
      return { a, b, whole: b * k };
    },
    build: ({ a, b, whole }) => {
      const answer = (whole / b) * a;
      return {
        question: `What is ${a}/${b} of ${whole}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `${whole} ÷ ${b} = ${whole / b}, and ${whole / b} × ${a} = ${answer}.`,
        hints: [`Divide ${whole} by ${b} first.`, `Then multiply that result by ${a}.`],
      };
    },
    // Independent route: repeated addition of one b-th part.
    check: ({ a, b, whole }) => {
      const part = whole / b;
      let total = 0;
      for (let i = 0; i < a; i++) total += part;
      return String(total);
    },
  },

  {
    id: "gen-frac-simplify",
    topicSlug: "fractions",
    difficulty: 1,
    competitionSlug: "math-kangaroo",
    variants: 70,
    params: (r) => {
      const k = int(r, 2, 12);
      const n = int(r, 2, 15);
      const d = intExcept(r, 2, 15, [n]);
      if (gcd(n, d) !== 1) throw new Error("reject");
      return { n: n * k, d: d * k };
    },
    build: ({ n, d }) => {
      const answer = frac(n, d);
      return {
        question: `Write ${n}/${d} in lowest terms.`,
        format: "SHORT_ANSWER",
        answer,
        solution: `The greatest common divisor of ${n} and ${d} is ${gcd(n, d)}. Dividing both by it gives ${answer}.`,
        hints: [`Find the greatest common divisor of ${n} and ${d}.`, "Divide numerator and denominator by it."],
      };
    },
    check: ({ n, d }) => reduceBySearch(n, d),
  },

  {
    id: "gen-percent-of",
    topicSlug: "percentages",
    difficulty: 2,
    competitionSlug: "amc8",
    variants: 80,
    params: (r) => {
      const p = pick(r, [5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
      const base = int(r, 2, 40) * 20;
      if ((base * p) % 100 !== 0) throw new Error("reject");
      return { p, base };
    },
    build: ({ p, base }) => {
      const answer = (base * p) / 100;
      const distractors = [answer + base / 10, answer / 2, answer * 2, base - answer]
        .filter((x) => x !== answer && Number.isInteger(x) && x > 0)
        .map(String);
      return {
        question: `What is ${p}% of ${base}?`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution: `${p}% = ${p / 100}. Then ${p / 100} × ${base} = ${answer}.`,
        hints: [`Convert ${p}% to the decimal ${p / 100}.`, `Multiply by ${base}.`],
      };
    },
    // Independent route: 1% of base, taken p times.
    check: ({ p, base }) => {
      const onePercent = base / 100;
      let total = 0;
      for (let i = 0; i < p; i++) total += onePercent;
      return String(Math.round(total));
    },
  },

  {
    id: "gen-percent-reverse",
    topicSlug: "percentages",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 70,
    params: (r) => {
      const p = pick(r, [10, 20, 25, 40, 50, 60, 75, 80]);
      const answer = int(r, 2, 50) * 5;
      if ((answer * p) % 100 !== 0) throw new Error("reject");
      return { p, answer };
    },
    build: ({ p, answer }) => {
      const result = (answer * p) / 100;
      return {
        question: `${p}% of a number is ${result}. What is the number?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Let the number be x. Then ${p / 100}x = ${result}, so x = ${result} ÷ ${p / 100} = ${answer}.`,
        hints: [`Set up the equation ${p / 100}x = ${result}.`, `Divide ${result} by ${p / 100}.`],
      };
    },
    // Independent route: scan for the integer whose p% equals the stated result.
    check: ({ p, answer }) => {
      const result = (answer * p) / 100;
      for (let x = 1; x <= 5000; x++) if ((x * p) / 100 === result) return String(x);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-percent-change",
    topicSlug: "percentages",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 80,
    params: (r) => {
      const from = int(r, 2, 40) * 5;
      const pct = pick(r, [10, 20, 25, 50, 75]);
      if ((from * pct) % 100 !== 0) throw new Error("reject");
      return { from, pct, dir: int(r, 0, 1) };
    },
    build: ({ from, pct, dir }) => {
      const delta = (from * pct) / 100;
      const to = dir === 1 ? from + delta : from - delta;
      const word = dir === 1 ? "increased" : "decreased";
      return {
        question: `A price of $${from} is ${word} by ${pct}%. What is the new price, in dollars?`,
        format: "SHORT_ANSWER",
        answer: String(to),
        solution: `${pct}% of ${from} is ${delta}. ${dir === 1 ? "Adding" : "Subtracting"} gives ${to}.`,
        hints: [`First find ${pct}% of ${from}.`, `Then ${dir === 1 ? "add it to" : "subtract it from"} the original price.`],
      };
    },
    // Independent route: multiply by the combined factor instead of adding a delta.
    check: ({ from, pct, dir }) => {
      const factor = dir === 1 ? (100 + pct) / 100 : (100 - pct) / 100;
      return String(Math.round(from * factor));
    },
  },

  {
    id: "gen-ratio-share",
    topicSlug: "ratios-proportions",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => {
      const a = int(r, 1, 7);
      const b = intExcept(r, 1, 7, [a]);
      const unit = int(r, 2, 20);
      return { a, b, unit };
    },
    build: ({ a, b, unit }) => {
      const total = (a + b) * unit;
      const answer = b * unit;
      return {
        question: `Two people share $${total} in the ratio ${a}:${b}. How many dollars does the second person receive?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `There are ${a} + ${b} = ${a + b} equal parts, so each part is ${total} ÷ ${a + b} = ${unit}. The second person gets ${b} × ${unit} = ${answer}.`,
        hints: [`Add the ratio parts to get ${a + b} total parts.`, `Divide the total by ${a + b}, then multiply by ${b}.`],
      };
    },
    // Independent route: hand out one unit at a time in ratio order. The first
    // person's share is irrelevant to the question, so `a` is unused here.
    check: ({ b, unit }) => {
      let second = 0;
      for (let round = 0; round < unit; round++) second += b;
      return String(second);
    },
  },

  {
    id: "gen-ratio-proportion",
    topicSlug: "ratios-proportions",
    difficulty: 2,
    competitionSlug: "math-league-elementary-middle",
    variants: 80,
    params: (r) => {
      const perUnit = int(r, 2, 12);
      const n1 = int(r, 2, 9);
      const n2 = int(r, 2, 15);
      if (n1 === n2) throw new Error("reject");
      return { perUnit, n1, n2 };
    },
    build: ({ perUnit, n1, n2 }) => {
      const cost1 = perUnit * n1;
      const answer = perUnit * n2;
      return {
        question: `If ${n1} notebooks cost $${cost1}, how many dollars do ${n2} notebooks cost at the same rate?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `One notebook costs ${cost1} ÷ ${n1} = ${perUnit}. So ${n2} notebooks cost ${n2} × ${perUnit} = ${answer}.`,
        hints: ["Find the cost of a single notebook first.", `Multiply the unit cost by ${n2}.`],
      };
    },
    // Independent route: cross-multiplication solved by search.
    check: ({ perUnit, n1, n2 }) => {
      const cost1 = perUnit * n1;
      for (let x = 1; x <= 20000; x++) if (x * n1 === cost1 * n2) return String(x);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-rate-distance",
    topicSlug: "rates",
    difficulty: 2,
    competitionSlug: "amc8",
    variants: 80,
    params: (r) => {
      const speed = pick(r, [15, 20, 25, 30, 40, 45, 50, 55, 60, 65, 70]);
      const hours = int(r, 2, 9);
      return { speed, hours };
    },
    build: ({ speed, hours }) => {
      const answer = speed * hours;
      const distractors = [speed + hours, answer + speed, answer - speed, speed * (hours + 1)]
        .filter((x) => x !== answer && x > 0)
        .map(String);
      return {
        question: `A car travels at a constant ${speed} miles per hour for ${hours} hours. How many miles does it travel?`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution: `Distance = rate × time = ${speed} × ${hours} = ${answer} miles.`,
        hints: ["Distance equals rate times time.", `Multiply ${speed} by ${hours}.`],
      };
    },
    check: ({ speed, hours }) => {
      let d = 0;
      for (let h = 0; h < hours; h++) d += speed;
      return String(d);
    },
  },

  {
    id: "gen-rate-time",
    topicSlug: "rates",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 80,
    params: (r) => {
      const speed = pick(r, [12, 15, 20, 24, 25, 30, 40, 50, 60]);
      const hours = int(r, 2, 12);
      return { speed, hours };
    },
    build: ({ speed, hours }) => {
      const dist = speed * hours;
      return {
        question: `A cyclist covers ${dist} miles at a steady ${speed} miles per hour. How many hours does the trip take?`,
        format: "SHORT_ANSWER",
        answer: String(hours),
        solution: `Time = distance ÷ rate = ${dist} ÷ ${speed} = ${hours} hours.`,
        hints: ["Time equals distance divided by rate.", `Divide ${dist} by ${speed}.`],
      };
    },
    // Independent route: count how many whole hours of travel accumulate the distance.
    check: ({ speed, hours }) => {
      const dist = speed * hours;
      let t = 0, covered = 0;
      while (covered < dist) { covered += speed; t++; }
      return String(t);
    },
  },

  {
    id: "gen-rate-work",
    topicSlug: "rates",
    difficulty: 5,
    competitionSlug: "amc10",
    // Only 6 (a,b) pairs from the clean-number pool give an integer joint time.
    variants: 6,
    params: (r) => {
      const a = pick(r, [2, 3, 4, 6, 12]);
      const b = pick(r, [2, 3, 4, 6, 12]);
      const combined = (a * b) / (a + b);
      if (a === b || !Number.isInteger(combined)) throw new Error("reject");
      return { a, b };
    },
    build: ({ a, b }) => {
      const answer = (a * b) / (a + b);
      return {
        question: `One pipe fills a tank in ${a} hours and another fills it in ${b} hours. Working together, how many hours do they take to fill the tank?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Their rates add: 1/${a} + 1/${b} = ${frac(a + b, a * b)} of the tank per hour. The time is the reciprocal, ${answer} hours.`,
        hints: ["Add the rates in tanks per hour, not the times.", "The total time is the reciprocal of the combined rate."],
      };
    },
    // Independent route: simulate filling in small time steps.
    check: ({ a, b }) => {
      const step = 1 / 10000;
      let filled = 0, t = 0;
      while (filled < 1 - 1e-9) { filled += step * (1 / a + 1 / b); t += step; }
      return String(Math.round(t));
    },
  },

  {
    id: "gen-average-basic",
    topicSlug: "averages",
    difficulty: 2,
    competitionSlug: "math-league-elementary-middle",
    variants: 110,
    params: (r) => {
      const n = int(r, 3, 6);
      const mean = int(r, 5, 40);
      const vals: Record<string, number> = { n, mean };
      let running = 0;
      for (let i = 0; i < n - 1; i++) {
        const v = int(r, Math.max(1, mean - 12), mean + 12);
        vals[`v${i}`] = v;
        running += v;
      }
      const last = n * mean - running;
      if (last < 1 || last > 99) throw new Error("reject");
      vals[`v${n - 1}`] = last;
      return vals;
    },
    build: (p) => {
      const n = p.n;
      const list = Array.from({ length: n }, (_, i) => p[`v${i}`]);
      const sum = list.reduce((a, b) => a + b, 0);
      const answer = sum / n;
      return {
        question: `What is the average of ${list.slice(0, -1).join(", ")}, and ${list[n - 1]}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The sum is ${sum}, and there are ${n} numbers, so the average is ${sum} ÷ ${n} = ${answer}.`,
        hints: ["Add all the numbers first.", `Divide the total by ${n}.`],
      };
    },
    check: (p) => String(p.mean),
  },

  {
    id: "gen-average-missing",
    topicSlug: "averages",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 100,
    params: (r) => {
      const n = int(r, 4, 6);
      const target = int(r, 60, 95);
      const vals: Record<string, number> = { n, target };
      let running = 0;
      for (let i = 0; i < n - 1; i++) {
        const v = int(r, target - 15, target + 10);
        vals[`v${i}`] = v;
        running += v;
      }
      const need = n * target - running;
      if (need < 50 || need > 100) throw new Error("reject");
      return vals;
    },
    build: (p) => {
      const n = p.n;
      const known = Array.from({ length: n - 1 }, (_, i) => p[`v${i}`]);
      const sumKnown = known.reduce((a, b) => a + b, 0);
      const answer = n * p.target - sumKnown;
      return {
        question: `A student has scored ${known.join(", ")} on ${n - 1} tests. What score is needed on the ${n}th test for the average of all ${n} tests to be exactly ${p.target}?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The ${n} tests must total ${n} × ${p.target} = ${n * p.target}. The first ${n - 1} total ${sumKnown}, so the last must be ${n * p.target} − ${sumKnown} = ${answer}.`,
        hints: [`Multiply the target average by ${n} to get the required total.`, "Subtract the sum of the known scores."],
      };
    },
    // Independent route: search for the score that makes the mean exact.
    check: (p) => {
      const n = p.n;
      const known = Array.from({ length: n - 1 }, (_, i) => p[`v${i}`]);
      const sumKnown = known.reduce((a, b) => a + b, 0);
      for (let x = 0; x <= 200; x++) if ((sumKnown + x) / n === p.target) return String(x);
      throw new Error("no solution");
    },
  },

  {
    id: "gen-numprop-divisorcount",
    topicSlug: "number-properties",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => ({ n: int(r, 12, 400) }),
    build: ({ n }) => {
      // Divisor count from the prime factorization.
      let m = n;
      const exps: number[] = [];
      const primes: number[] = [];
      for (let p = 2; p * p <= m; p++) {
        if (m % p === 0) {
          let e = 0;
          while (m % p === 0) { m /= p; e++; }
          primes.push(p); exps.push(e);
        }
      }
      if (m > 1) { primes.push(m); exps.push(1); }
      const answer = exps.reduce((acc, e) => acc * (e + 1), 1);
      const factorization = primes.map((p, i) => (exps[i] === 1 ? `${p}` : `${p}^${exps[i]}`)).join(" × ");
      return {
        question: `How many positive divisors does ${n} have?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `${n} = ${factorization}. Adding one to each exponent and multiplying gives ${exps.map((e) => e + 1).join(" × ")} = ${answer}.`,
        hints: [`Write ${n} as a product of prime powers.`, "Add 1 to each exponent, then multiply those results."],
      };
    },
    // Independent route: trial division over the whole range.
    check: ({ n }) => {
      let c = 0;
      for (let d = 1; d <= n; d++) if (n % d === 0) c++;
      return String(c);
    },
  },

  {
    id: "gen-numprop-gcdlcm",
    topicSlug: "number-properties",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 90,
    params: (r) => {
      const a = int(r, 6, 90);
      const b = intExcept(r, 6, 90, [a]);
      return { a, b, want: int(r, 0, 1) };
    },
    build: ({ a, b, want }) => {
      const g = gcd(a, b);
      const l = (a * b) / g;
      const answer = want === 1 ? l : g;
      const label = want === 1 ? "least common multiple" : "greatest common divisor";
      const distractors = [want === 1 ? g : l, a, b, Math.abs(a - b), a + b, answer * 2, answer + 1]
        .filter((x) => x !== answer && x > 0)
        .map(String);
      return {
        question: `What is the ${label} of ${a} and ${b}?`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution:
          want === 1
            ? `gcd(${a}, ${b}) = ${g}, and lcm = (${a} × ${b}) ÷ ${g} = ${l}.`
            : `The largest number dividing both ${a} and ${b} is ${g}.`,
        hints: [
          want === 1 ? "Use lcm(a,b) × gcd(a,b) = a × b." : "List the common divisors and take the largest.",
          `Start by finding gcd(${a}, ${b}).`,
        ],
      };
    },
    // Independent route: brute-force scan rather than the Euclidean algorithm.
    check: ({ a, b, want }) => {
      if (want === 1) {
        for (let m = Math.max(a, b); m <= a * b; m++) if (m % a === 0 && m % b === 0) return String(m);
        throw new Error("no lcm");
      }
      let best = 1;
      for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) best = d;
      return String(best);
    },
  },
];
