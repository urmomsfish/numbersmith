/**
 * Reduces a question to its mathematical skeleton, so that two problems
 * differing only in their numbers, their variable letters and their cover
 * story collapse to the same string.
 *
 * This is what catches a reskin. "Real numbers x and y satisfy x+y=7 and
 * x³+y³=133, what is xy?" and "Positive reals a and b satisfy a+b=10 and
 * a³+b³=370, what is ab?" are one problem filed under two competitions, and
 * nothing short of structural normalisation sees that — the texts share almost
 * no words, and the answers differ.
 *
 * Exponents survive normalisation on purpose. x²+y² and x³+y³ are genuinely
 * different questions, and blanking the exponent along with every other number
 * would collapse them into one, burying real pairs under false ones. They are
 * carried through as superscript characters precisely because those are
 * outside both \d and [a-z], so neither later pass can touch them.
 */

const MATH_WORDS = new Set([
  "sin", "cos", "tan", "log", "ln", "gcd", "lcm", "mod", "max", "min", "sum",
  "lim", "det", "deg", "exp", "arg", "floor", "ceil", "sqrt", "det",
]);

/** Two-letter English words, so "is" does not read as a product of variables. */
const SHORT_PROSE = new Set([
  "is", "to", "of", "in", "on", "at", "by", "if", "or", "it", "be", "as", "so",
  "no", "do", "we", "an", "he", "up", "us", "my", "me", "go", "am", "its",
]);

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const toSup = (d: string) => [...d].map((c) => SUP[Number(c)] ?? c).join("");

export function skeleton(question: string): string {
  let s = question.toLowerCase();

  // Exponents first, into characters that the number and letter passes below
  // cannot see. "x^{12}" and "x^12" both become x¹².
  s = s.replace(/\^\s*\{?\s*(\d+)\s*\}?/g, (_m, d: string) => toSup(d));
  // Unicode superscripts already in the text are the same thing.
  s = s.replace(/[²³⁴⁵⁶⁷⁸⁹]/g, (c) => c);

  // Drop narration. Three or more letters is prose unless it is a function name.
  s = s.replace(/[a-z]{3,}/g, (w) => (MATH_WORDS.has(w) ? ` ${w} ` : " "));
  s = s.replace(/[a-z]{2}/g, (w) => (SHORT_PROSE.has(w) ? " " : w));

  // Whatever numbers remain are incidental magnitudes.
  s = s.replace(/\d+(?:\.\d+)?/g, "N");
  // Any surviving letter run is a variable or a product of variables.
  s = s.replace(/[a-z]+/g, (w) => (MATH_WORDS.has(w) ? w : "V".repeat(w.length)));

  // Keep only structural characters, and drop whitespace entirely so that
  // "a + b" and "a+b" are the same skeleton.
  s = s.replace(/[^a-zNV⁰¹²³⁴⁵⁶⁷⁸⁹+\-*/=^(),.|<>]/g, "");
  return s;
}

/** How much actual structure a skeleton carries. A bare "N" collides with half
 * the bank and means nothing, so short skeletons are not worth comparing. */
export function skeletonWeight(s: string): number {
  return s.replace(/[^NV⁰¹²³⁴⁵⁶⁷⁸⁹+\-*/=]/g, "").length;
}

/** Normalised question text, for spotting problems that are simply the same
 * sentence twice (the bank has several, across different competitions). */
export function normalisedText(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
