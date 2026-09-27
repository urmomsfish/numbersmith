/**
 * Independent verification of the Countdown problem bank.
 *
 *   npm run verify:countdown
 *
 * Two separate things are checked, because this bank has two ways to be wrong.
 *
 * 1. Answers. Every problem is re-solved here from scratch — by brute force
 *    wherever the search space allows — and compared against the stored answer.
 *    The computation below never reads `p.answer`. One wrong key in a bank this
 *    size is the realistic failure, and in a countdown round it is worse than
 *    elsewhere: the key is revealed the instant the student answers, so a wrong
 *    one teaches the wrong fact immediately with no chance to catch it.
 *
 * 2. Fitness for the format. A correct problem that takes two minutes does not
 *    belong here. So every problem must declare `estimatedTimeSeconds` within
 *    the clock, and the question text must be short enough to read inside it —
 *    reading is part of the 45 seconds, and this is the constraint that the
 *    rest of the bank silently failed.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { COUNTDOWN_PROBLEMS } from "../prisma/seed-data/problems-countdown";

/** The clock, read out of the engine rather than imported: `countdown.ts` is
 * `server-only` and throws if required from a plain script. Reading the source
 * keeps the two in step anyway — if the clock changes and this cannot find it,
 * the check fails loudly instead of validating against a stale number. */
const SECONDS_PER_QUESTION = (() => {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "src", "lib", "engine", "countdown.ts"),
    "utf8"
  );
  const m = src.match(/SECONDS_PER_QUESTION\s*=\s*(\d+)/);
  if (!m) throw new Error("could not find SECONDS_PER_QUESTION in src/lib/engine/countdown.ts");
  return Number(m[1]);
})();

const EXPECTED: Record<string, string> = {};
const E = (slug: string, v: unknown) => {
  EXPECTED[slug] = String(v);
};

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
const gcd = (a: number, b: number): number => (b ? gcd(b, Math.abs(a % b)) : Math.abs(a));
const divisors = (n: number) => range(1, n).filter((d) => n % d === 0);
const isPrime = (n: number) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every((d) => n % d !== 0);
const frac = (n: number, d: number) => {
  const g = gcd(n, d);
  const sign = (n < 0) !== (d < 0) ? "-" : "";
  return `${sign}${Math.abs(n / g)}/${Math.abs(d / g)}`;
};
/** Every permutation of a string, so anagram counts are brute-forced rather
 * than trusted to a formula — the formula is what the problem is testing. */
const perms = (s: string): Set<string> => {
  if (s.length <= 1) return new Set([s]);
  const out = new Set<string>();
  for (let i = 0; i < s.length; i++) {
    for (const rest of perms(s.slice(0, i) + s.slice(i + 1))) out.add(s[i] + rest);
  }
  return out;
};
/** All 2^n strings of H/T of length n. */
const flips = (n: number): string[] =>
  n === 0 ? [""] : flips(n - 1).flatMap((s) => [s + "H", s + "T"]);

// --- arithmetic ---
E("cd-001", 0.15 * 60);
E("cd-002", 96 / 3 / 4);
E("cd-003", range(1, 200).find((n) => 0.25 * n === 13));
E("cd-004", 80 * 1.35);
E("cd-005", (7 / 8) * 64);
// Summed over a common denominator: 1/2 + 1/3 + 1/6 in floating point comes to
// 0.9999999999999999, which is a fact about doubles and not about the problem.
E("cd-006", (1 * 3 + 1 * 2 + 1 * 1) / 6);
E("cd-007", frac(1 * 8 - 4 - 2 - 1, 8));
E("cd-008", 1.2 * 45);
E("cd-009", 0.35 * (0.35 * 400));
E("cd-010", (2 / 5) * 100);
E("cd-011", (12 + 19 + 23 + 26) / 4);
E("cd-012", 5 * 14 - 51);
{
  // 3:5 split of 64, found rather than computed.
  const part = range(1, 64).find((p) => 3 * p + 5 * p === 64)!;
  E("cd-013", 5 * part);
}
E("cd-014", (1.2 / 4) * 10);
E("cd-015", (180 / 3 / 60) * 50);
E("cd-016", 99 * 101);
E("cd-017", 43 ** 2 - 42 ** 2);
E("cd-018", range(1, 20).reduce((a, b) => a + b, 0));
E("cd-019", range(1, 15).map((n) => 2 * n - 1).reduce((a, b) => a + b, 0));
E("cd-020", range(1, 5).map(fact).reduce((a, b) => a + b, 0));

// --- number theory ---
{
  let u = 1;
  for (let i = 0; i < 2026; i++) u = (u * 3) % 10;
  E("cd-021", u);
}
{
  let u = 1;
  for (let i = 0; i < 100; i++) u = (u * 7) % 10;
  E("cd-022", u);
}
E("cd-023", 2 ** 10 % 7);
E("cd-024", range(1, 100).reduce((a, b) => a + b, 0) % 7);
E("cd-025", divisors(72).length);
E("cd-026", divisors(28).reduce((a, b) => a + b, 0));
E("cd-027", divisors(210).filter(isPrime).reduce((a, b) => a + b, 0));
E("cd-028", gcd(84, 126));
E("cd-029", range(1, 500).find((n) => n % 12 === 0 && n % 18 === 0));
E("cd-030", range(91, 200).find(isPrime));
E("cd-031", range(21, 39).filter(isPrime).length);
E("cd-032", Math.max(...range(100, 999).filter((n) => n % 7 === 0)));
{
  // Count factors of 5 in 25! directly from the product's factorisation.
  let fives = 0;
  for (let k = 1; k <= 25; k++) {
    let m = k;
    while (m % 5 === 0) {
      fives++;
      m /= 5;
    }
  }
  // Factors of 2 are plentiful, so trailing zeros are limited by the 5s.
  E("cd-033", fives);
}
E("cd-034", range(1, 500).find((n) => divisors(n).length === 6));
E("cd-035", String(2 ** 10).split("").reduce((a, d) => a + Number(d), 0));
E("cd-036", 111111 / 3);
E("cd-037", range(1, 200).find((n) => n * n === 1369));
E("cd-038", range(1, 100).filter((n) => n % 3 === 0 || n % 5 === 0).length);
{
  let r = 1;
  for (let i = 0; i < 2027; i++) r = (r * 5) % 4;
  E("cd-039", r);
}
{
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  E("cd-040", days[(days.indexOf("Tuesday") + 100) % 7]);
}

// --- algebra ---
E("cd-041", range(-100, 100).find((x) => 3 * x + 7 === 31));
E("cd-042", range(-100, 100).find((x) => 5 * (x - 3) === 2 * x + 9));
{
  // Solve the system by search, then compute the requested quantity.
  const pair = range(-50, 50)
    .flatMap((x) => range(-50, 50).map((y) => [x, y] as const))
    .find(([x, y]) => x + y === 10 && x * y === 21)!;
  E("cd-043", pair[0] ** 2 + pair[1] ** 2);
}
{
  // x + 1/x = 3 has irrational roots, so solve numerically and round.
  const x = (3 + Math.sqrt(5)) / 2;
  E("cd-044", Math.round(x ** 2 + 1 / x ** 2));
}
E("cd-045", 17 ** 2 - 13 ** 2);
E("cd-046", Math.max(...range(-50, 50).filter((x) => x * x - 9 * x + 20 === 0)));
{
  const roots = [(10 + Math.sqrt(100 - 24)) / 4, (10 - Math.sqrt(100 - 24)) / 4];
  E("cd-047", Math.round(roots[0] + roots[1]));
}
{
  const d = Math.sqrt(49 + 144);
  const roots = [(-7 + d) / 6, (-7 - d) / 6];
  E("cd-048", Math.round(roots[0] * roots[1]));
}
E("cd-049", 2 * 4 ** 2 - 3 * 4 + 1);
{
  const f = (x: number) => x * x + 1;
  E("cd-050", f(f(2)));
}
E("cd-051", range(1, 8).reduce((t) => t + 4, 5) - 4);
E("cd-052", 3 + (20 - 1) * 4);
E("cd-053", 2 + (100 - 1) * 3);
{
  let t = 2;
  let s = 0;
  for (let i = 0; i < 6; i++) {
    s += t;
    t *= 3;
  }
  E("cd-054", s);
}
E("cd-055", range(0, 20).find((x) => 2 ** x === 32));
E("cd-056", range(0, 20).find((x) => 3 ** (x + 1) === 81));
E("cd-057", 2 ** 10 - 2 ** 9);
E("cd-058", Math.sqrt(144) + Math.sqrt(81));
{
  const pair = range(-50, 50)
    .flatMap((a) => range(-50, 50).map((b) => [a, b] as const))
    .find(([a, b]) => a + b === 12 && a - b === 4)!;
  E("cd-059", pair[0] * pair[1]);
}
{
  // Expand by convolution rather than by hand.
  const p = [-2, 1];
  const q = [5, 1];
  const prod = [0, 0, 0];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) prod[i + j] += p[i] * q[j];
  E("cd-060", prod[1]);
}
E("cd-061", range(-100, 100).find((x) => 4 * x > 55));

// --- geometry ---
E("cd-062", (14 * 9) / 2);
E("cd-063", 4 * Math.sqrt(49));
E("cd-064", (8 - 2) * 180);
E("cd-065", ((6 - 2) * 180) / 6);
E("cd-066", 360 / 5);
E("cd-067", (10 * (10 - 3)) / 2);
E("cd-068", 180 - 47 - 68);
E("cd-069", Math.sqrt(9 ** 2 + 12 ** 2));
E("cd-070", Math.sqrt(25 ** 2 - 7 ** 2));
E("cd-071", `${2 * 7}pi`);
E("cd-072", `${(10 / 2) ** 2}pi`);
E("cd-073", range(1, 50).find((r) => r * r === 36));
E("cd-074", 6 ** 3);
E("cd-075", 6 * 5 ** 2);
E("cd-076", `${3 ** 2 * 7}pi`);
E("cd-077", ((6 + 14) / 2) * 5);
E("cd-078", (8 * 10) / 2);
{
  const w = range(1, 50).find((w) => 2 * (11 + w) === 34)!;
  E("cd-079", 11 * w);
}
E("cd-080", Math.sqrt((7 - 1) ** 2 + (10 - 2) ** 2));
E("cd-081", frac(1 - 5, 9 - -3));
{
  // Clock hands from their absolute positions, in degrees clockwise from 12.
  const minutes = 30;
  const hour = 3;
  const minuteHand = minutes * 6;
  const hourHand = (hour % 12) * 30 + minutes * 0.5;
  const diff = Math.abs(minuteHand - hourHand);
  E("cd-082", Math.min(diff, 360 - diff));
}

// --- counting and probability ---
E("cd-083", perms("MATH").size);
E("cd-084", perms("LEVEL").size);
E("cd-085", C(8, 2));
E("cd-086", C(10, 3));
E("cd-087", 2 ** 5);
{
  let n = 0;
  for (let a = 1; a <= 9; a++)
    for (let b = 1; b <= 9; b++)
      for (let c = 1; c <= 9; c++) if (a !== b && b !== c && a !== c) n++;
  E("cd-088", n);
}
{
  // All 5! seatings, counting those where persons 0 and 1 are adjacent.
  const ok = [...perms("01234")].filter((s) => Math.abs(s.indexOf("0") - s.indexOf("1")) === 1);
  E("cd-089", ok.length);
}
{
  const rolls = range(1, 6).flatMap((a) => range(1, 6).map((b) => [a, b] as const));
  E("cd-090", frac(rolls.filter(([a, b]) => a + b === 7).length, rolls.length));
  E("cd-091", frac(rolls.filter(([a, b]) => a % 2 === 0 && b % 2 === 0).length, rolls.length));
}
{
  const all = flips(4);
  E("cd-092", frac(all.filter((s) => [...s].filter((c) => c === "H").length === 2).length, all.length));
}
E("cd-093", frac(13, 52));
E("cd-094", frac(range(1, 6).reduce((a, b) => a + b, 0), 6));
{
  // Draw two of eight labelled marbles; the first five are red.
  const marbles = range(0, 7);
  const pairs = marbles.flatMap((a) => marbles.filter((b) => b !== a).map((b) => [a, b] as const));
  E("cd-095", frac(pairs.filter(([a, b]) => a < 5 && b < 5).length, pairs.length));
}
{
  const all = flips(3);
  E("cd-096", frac(all.filter((s) => s.includes("H")).length, all.length));
}

// --- hard tail (difficulty 6-10) ---
{
  let r = 1;
  for (let i = 0; i < 100; i++) r = (r * 3) % 5;
  E("cd-097", r);
}
E("cd-098", range(1, 100).reduce((a, n) => a + (n % 2 ? n : -n), 0));
{
  let fives = 0;
  for (let k = 1; k <= 100; k++) {
    let m = k;
    while (m % 5 === 0) {
      fives++;
      m /= 5;
    }
  }
  E("cd-099", fives);
}
E("cd-100", range(-20, 20).filter((x) => x ** 3 - 6 * x ** 2 + 11 * x - 6 === 0).reduce((a, b) => a + b, 0));
{
  // Expand (1+x)^6 by repeated convolution rather than quoting C(6,2).
  let poly = [1];
  for (let i = 0; i < 6; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] += poly[j];
      next[j + 1] += poly[j];
    }
    poly = next;
  }
  E("cd-101", poly[2]);
}
{
  let n = 0;
  for (let x = 1; x <= 36; x++) if (36 % x === 0) n++;
  E("cd-102", n);
}
E("cd-103", String(2 ** 20).length);
E("cd-104", divisors(1001).filter(isPrime).reduce((a, b) => a + b, 0));
{
  // i^2026 by repeated multiplication in the complex plane, as integer pairs.
  let re = 1;
  let im = 0;
  for (let k = 0; k < 2026; k++) {
    const nr = -im;
    im = re;
    re = nr;
  }
  E("cd-105", im === 0 ? String(re) : `${re}${im > 0 ? "+" : "-"}${Math.abs(im)}i`);
}
{
  // Sum of coefficients of (2x-1)^5, expanded coefficient by coefficient.
  let poly = [1];
  for (let i = 0; i < 5; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] += -1 * poly[j];
      next[j + 1] += 2 * poly[j];
    }
    poly = next;
  }
  E("cd-106", poly.reduce((a, b) => a + b, 0));
}
{
  let num = 0;
  let den = 1;
  for (let k = 1; k <= 9; k++) {
    num = num * (k * (k + 1)) + den;
    den = den * (k * (k + 1));
    const g = gcd(num, den);
    num /= g;
    den /= g;
  }
  E("cd-107", frac(num, den));
}
E("cd-108", range(1, 100).filter((n) => gcd(n, 100) === 1).length);
{
  // Enumerate all 2^10 subsets by bitmask and count the even-sized ones.
  let n = 0;
  for (let m = 0; m < 1024; m++) {
    let bits = 0;
    for (let b = 0; b < 10; b++) if (m & (1 << b)) bits++;
    if (bits % 2 === 0) n++;
  }
  E("cd-109", n);
}
{
  let twos = 0;
  for (let k = 1; k <= 20; k++) {
    let m = k;
    while (m % 2 === 0) {
      twos++;
      m /= 2;
    }
  }
  E("cd-110", twos);
}
{
  let n = 0;
  for (let x = 1; x <= 8; x++) for (let y = 1; y <= 8; y++) if (10 - x - y >= 1) n++;
  E("cd-111", n);
}
E("cd-112", range(1, 10).map(fact).reduce((a, b) => a + b, 0) % 10);
{
  const d = Math.sqrt(49 - 24);
  const r1 = (7 + d) / 4;
  const r2 = (7 - d) / 4;
  const v = 1 / r1 + 1 / r2;
  // Recover the exact fraction from the numeric value over small denominators.
  const den = range(1, 50).find((q) => Math.abs(v * q - Math.round(v * q)) < 1e-9)!;
  E("cd-113", frac(Math.round(v * den), den));
}
{
  const nums = range(1, 10);
  const pairs = nums.flatMap((a) => nums.filter((b) => b > a).map((b) => [a, b] as const));
  E("cd-114", frac(pairs.filter(([a, b]) => (a + b) % 2 === 0).length, pairs.length));
}
E("cd-115", range(1, 1000).filter((n) => n % 2 !== 0 && n % 3 !== 0).length);
{
  const isSq = (n: number) => Number.isInteger(Math.sqrt(n));
  const isCube = (n: number) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
  E("cd-116", range(1, 99).filter((n) => isSq(n) || isCube(n)).length);
}
E("cd-117", range(1, 10).reduce((a, n) => a + Math.floor(Math.sqrt(n)), 0));
E("cd-118", 2 ** 10 % 1000);
{
  // Both roots of x^2-5x+6 are checked, since the claim is that it does not matter.
  const roots = range(-20, 20).filter((x) => x * x - 5 * x + 6 === 0);
  const vals = new Set(roots.map((x) => x ** 3 - 5 * x ** 2 + 6 * x + 7));
  E("cd-119", vals.size === 1 ? [...vals][0] : `ambiguous: ${[...vals]}`);
}
{
  // Count tilings by explicit recursion on strip length.
  const t: number[] = [1, 1];
  for (let n = 2; n <= 10; n++) t[n] = t[n - 1] + t[n - 2];
  E("cd-120", t[10]);
}
{
  // 7^7 = 823543 is small enough to compute, so the tower is evaluated
  // directly rather than by reasoning about the exponent's parity — which is
  // the shortcut the problem is testing and so must not be assumed here.
  const exp = 7 ** 7;
  let acc = 1;
  let base = 7 % 4;
  let e = exp;
  while (e > 0) {
    if (e & 1) acc = (acc * base) % 4;
    base = (base * base) % 4;
    e >>= 1;
  }
  E("cd-121", acc);
}
E("cd-122", divisors(1000).filter((d) => Number.isInteger(Math.sqrt(d))).length);
{
  // Long division of 1 by 7, digit by digit, 2026 digits deep.
  let rem = 1;
  let digit = 0;
  for (let i = 0; i < 2026; i++) {
    rem *= 10;
    digit = Math.floor(rem / 7);
    rem %= 7;
  }
  E("cd-123", digit);
}
{
  let n = 2 ** 12 - 1;
  const primes = new Set<number>();
  for (let p = 2; p <= n; p++) while (n % p === 0) { primes.add(p); n /= p; }
  E("cd-124", primes.size);
}
{
  const all = [...perms("0123")];
  const deranged = all.filter((s) => [...s].every((c, i) => Number(c) !== i));
  E("cd-125", frac(deranged.length, all.length));
}
{
  let acc = 1;
  let base = 2;
  let e = 2026;
  while (e > 0) {
    if (e & 1) acc = (acc * base) % 9;
    base = (base * base) % 9;
    e >>= 1;
  }
  E("cd-126", acc);
}
E("cd-127", gcd(2 ** 12 - 1, 2 ** 18 - 1));
{
  let r = 1;
  let ord = 0;
  do {
    r = (r * 2) % 11;
    ord++;
  } while (r !== 1);
  E("cd-128", ord);
}
{
  let num = 0;
  let den = 1;
  for (let k = 1; k <= 10; k++) {
    const p = 2 ** k;
    num = num * p + den;
    den = den * p;
    const g = gcd(num, den);
    num /= g;
    den /= g;
  }
  E("cd-129", frac(num, den));
}
{
  // (1+w)(1+w^2) evaluated numerically at a primitive cube root of unity.
  const th = (2 * Math.PI) / 3;
  const w = { re: Math.cos(th), im: Math.sin(th) };
  const w2 = { re: Math.cos(2 * th), im: Math.sin(2 * th) };
  const a = { re: 1 + w.re, im: w.im };
  const b = { re: 1 + w2.re, im: w2.im };
  const prod = { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
  if (Math.abs(prod.im) > 1e-9) throw new Error("cd-130 came out nonreal");
  E("cd-130", Math.round(prod.re));
}
{
  const totient = (n: number) => range(1, n).filter((k) => gcd(k, n) === 1).length;
  E("cd-131", range(1, 100).filter((n) => totient(n) % 2 === 1).length);
}
{
  let n = 0;
  for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) if (x * x + y * y < 4) n++;
  E("cd-132", n);
}

/** Rough reading time. A countdown question that takes a third of the clock to
 * read is not a speed question however easy the maths. 3.5 words/second is
 * brisk-but-plausible silent reading for a numerate reader. */
const readSeconds = (q: string) => q.trim().split(/\s+/).length / 3.5;

function main() {
  let wrong = 0;
  let unchecked = 0;
  let tooSlow = 0;
  let tooLong = 0;
  const slugs = new Set<string>();

  for (const p of COUNTDOWN_PROBLEMS) {
    if (slugs.has(p.slug)) {
      console.log(`  DUPLICATE SLUG  ${p.slug}`);
      wrong++;
    }
    slugs.add(p.slug);

    const expected = EXPECTED[p.slug];
    if (expected === undefined) {
      console.log(`  NOT VERIFIED    ${p.slug}`);
      unchecked++;
    } else if (expected !== p.answer) {
      console.log(`  WRONG ANSWER    ${p.slug}: stored "${p.answer}", computed "${expected}"`);
      wrong++;
    }

    if (p.estimatedTimeSeconds === undefined) {
      console.log(`  NO TIME ESTIMATE ${p.slug} — countdown selects on this field`);
      tooSlow++;
    } else if (p.estimatedTimeSeconds > SECONDS_PER_QUESTION) {
      console.log(
        `  OVER THE CLOCK  ${p.slug}: ${p.estimatedTimeSeconds}s vs ${SECONDS_PER_QUESTION}s`
      );
      tooSlow++;
    }

    const read = readSeconds(p.question);
    if (read > p.estimatedTimeSeconds! / 3) {
      console.log(
        `  TOO WORDY       ${p.slug}: ~${read.toFixed(0)}s to read of ${p.estimatedTimeSeconds}s`
      );
      tooLong++;
    }
  }

  const est = COUNTDOWN_PROBLEMS.map((p) => p.estimatedTimeSeconds ?? 0);
  const diffs = COUNTDOWN_PROBLEMS.map((p) => p.difficulty);
  console.log(`\n${COUNTDOWN_PROBLEMS.length} countdown problems`);
  console.log(
    `  time estimates: ${Math.min(...est)}-${Math.max(...est)}s ` +
      `(mean ${(est.reduce((a, b) => a + b, 0) / est.length).toFixed(0)}s)`
  );
  console.log(`  difficulty:     ${Math.min(...diffs)}-${Math.max(...diffs)}`);
  console.log(`  independently verified: ${COUNTDOWN_PROBLEMS.length - unchecked}`);

  if (wrong || unchecked || tooSlow || tooLong) {
    console.log(
      `\n✗ ${wrong} wrong, ${unchecked} unverified, ${tooSlow} over the clock, ${tooLong} too wordy`
    );
    process.exitCode = 1;
    return;
  }
  console.log(`\n✓ every answer recomputed and every problem fits a ${SECONDS_PER_QUESTION}s clock`);
}

main();
