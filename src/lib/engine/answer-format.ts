/**
 * Canonicalisation of typed math answers.
 *
 * The problem this solves: the bank stores answers like "7√11" and "(36/5)π".
 * Grading used to be an exact string comparison, so a student had to produce
 * the literal characters "√" and "π" — and every other correct spelling of the
 * same answer ("7 sqrt 11", "36π/5") was marked wrong.
 *
 * What is deliberately accepted:
 *   - Notation. "sqrt", "√", "root"; "pi", "π", "PI". Spaces, "*", "×", and
 *     parentheses around the coefficient are all optional.
 *   - Placement. "(36/5)π", "36π/5" and "36/5 π" are the same answer.
 *   - Equal values written differently. "7.2π" and "36/5 π" both pass, as do
 *     "1/2" and "0.5".
 *
 * What is deliberately NOT accepted:
 *   - An unsimplified radical. "√539" does not match "7√11". Those questions
 *     ask the student to simplify, so the radicand is compared as written and
 *     never reduced. This is the one place where being lenient would defeat
 *     the question.
 */

export type CanonicalAnswer =
  | { kind: "rational"; numerator: number; denominator: number }
  | { kind: "pi"; numerator: number; denominator: number }
  | { kind: "radical"; numerator: number; denominator: number; radicand: number }
  | { kind: "text"; value: string };

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** Lowercases, strips currency/commas, and rewrites every accepted spelling of
 * π and √ into the single character form. */
function normalizeNotation(raw: string): string {
  let s = raw.trim().toLowerCase();
  // Superscript digits occasionally arrive from copy-paste.
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => String(SUPERSCRIPT.indexOf(c)));
  s = s.replace(/[$,]/g, "");
  s = s.replace(/\s+/g, " ");
  // Unicode variants and word spellings. No \b anchors: a student typing
  // "7sqrt11" or "1pi" leaves no word boundary between the digit and the word,
  // and those are exactly the inputs this is meant to accept.
  s = s.replace(/π|Π|pi/g, "π");
  s = s.replace(/√|sqrt|root/g, "√");
  // Explicit multiplication signs are noise once the symbols are canonical.
  s = s.replace(/[*·×]/g, " ");
  // A radical binds to the number right after it: "√ 11" -> "√11".
  s = s.replace(/√\s*\(?\s*/g, "√");
  s = s.replace(/(√\d+)\s*\)/g, "$1");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, Math.abs(a % b)) : Math.abs(a));

/** Parses a decimal or fraction into an exact numerator/denominator pair.
 * Returns null if the text is not a plain number. */
function parseRational(text: string): { numerator: number; denominator: number } | null {
  const s = text.trim().replace(/^\((.*)\)$/, "$1").trim();
  if (s === "" || s === "+") return { numerator: 1, denominator: 1 };
  if (s === "-" || s === "−") return { numerator: -1, denominator: 1 };

  // The hyphen is escaped deliberately: in [+-−] it would be read as the range
  // from "+" (U+002B) to "−" (U+2212), which swallows every digit, so "77"
  // would parse its first 7 as a sign and come out as 7.
  const fraction = /^([+\-−]?\d+(?:\.\d+)?)\s*\/\s*([+\-−]?\d+(?:\.\d+)?)$/.exec(s);
  if (fraction) {
    const top = parseRational(fraction[1]);
    const bottom = parseRational(fraction[2]);
    if (!top || !bottom || bottom.numerator === 0) return null;
    return reduce(top.numerator * bottom.denominator, top.denominator * bottom.numerator);
  }

  const decimal = /^([+\-−]?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!decimal) return null;
  const sign = decimal[1] === "-" || decimal[1] === "−" ? -1 : 1;
  const whole = Number(decimal[2]);
  const frac = decimal[3] ?? "";
  const scale = Math.pow(10, frac.length);
  const numerator = sign * (whole * scale + (frac ? Number(frac) : 0));
  return reduce(numerator, scale);
}

function reduce(n: number, d: number): { numerator: number; denominator: number } {
  if (d === 0) return { numerator: n, denominator: 0 };
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d) || 1;
  return { numerator: (sign * n) / g, denominator: (sign * d) / g };
}

/** Reduces "<coefficient> <symbol> <coefficient>" into a single rational.
 * Handles "36π/5" (coefficient before, divisor after) as well as "(36/5)π". */
function splitAroundSymbol(s: string, symbol: string): { before: string; after: string } | null {
  const at = s.indexOf(symbol);
  if (at === -1) return null;
  if (s.indexOf(symbol, at + 1) !== -1) return null; // more than one symbol: not a form we model
  return { before: s.slice(0, at), after: s.slice(at + symbol.length) };
}

/** Turns a submitted or stored answer into a comparable canonical form.
 * Anything that is not a recognised numeric shape falls through to `text`,
 * which restores the old exact-match behaviour for e.g. "(3, 2)" or "2:3". */
export function canonicalizeAnswer(raw: string): CanonicalAnswer {
  const s = normalizeNotation(raw);
  if (s === "") return { kind: "text", value: "" };

  // --- radical: [coefficient] √radicand [/ divisor] ---
  const radicalSplit = splitAroundSymbol(s, "√");
  if (radicalSplit) {
    const radicandMatch = /^(\d+)/.exec(radicalSplit.after.trim());
    if (radicandMatch) {
      const radicand = Number(radicandMatch[1]);
      const trailing = radicalSplit.after.trim().slice(radicandMatch[1].length).trim();
      const coefficient = parseRational(radicalSplit.before);
      if (coefficient && radicand > 0) {
        // A trailing "/5" divides the coefficient: "3√2/5".
        let { numerator, denominator } = coefficient;
        if (trailing !== "") {
          const divisorMatch = /^\/\s*(\d+(?:\.\d+)?)$/.exec(trailing);
          if (!divisorMatch) return { kind: "text", value: s };
          const divisor = parseRational(divisorMatch[1]);
          if (!divisor || divisor.numerator === 0) return { kind: "text", value: s };
          ({ numerator, denominator } = reduce(
            numerator * divisor.denominator,
            denominator * divisor.numerator
          ));
        }
        // Radicand is compared as written — never simplified. See the file
        // comment: these questions are asking for the simplification.
        return { kind: "radical", numerator, denominator, radicand };
      }
    }
    return { kind: "text", value: s };
  }

  // --- pi: [coefficient] π [/ divisor] ---
  const piSplit = splitAroundSymbol(s, "π");
  if (piSplit) {
    const coefficient = parseRational(piSplit.before);
    if (coefficient) {
      let { numerator, denominator } = coefficient;
      const trailing = piSplit.after.trim();
      if (trailing !== "") {
        const divisorMatch = /^\/\s*(\d+(?:\.\d+)?)$/.exec(trailing);
        if (!divisorMatch) return { kind: "text", value: s };
        const divisor = parseRational(divisorMatch[1]);
        if (!divisor || divisor.numerator === 0) return { kind: "text", value: s };
        ({ numerator, denominator } = reduce(
          numerator * divisor.denominator,
          denominator * divisor.numerator
        ));
      }
      return { kind: "pi", numerator, denominator };
    }
    return { kind: "text", value: s };
  }

  // --- plain number or fraction ---
  const rational = parseRational(s);
  if (rational && rational.denominator !== 0) {
    return { kind: "rational", numerator: rational.numerator, denominator: rational.denominator };
  }

  return { kind: "text", value: s };
}

/** True when two answers denote the same value in the same simplified form. */
export function answersMatch(given: string, expected: string): boolean {
  const a = canonicalizeAnswer(given);
  const b = canonicalizeAnswer(expected);
  if (a.kind !== b.kind) return false;
  if (a.kind === "text" || b.kind === "text") {
    return a.kind === "text" && b.kind === "text" && a.value === b.value;
  }
  if (a.kind === "radical" && b.kind === "radical" && a.radicand !== b.radicand) return false;
  return (
    a.numerator === (b as typeof a).numerator && a.denominator === (b as typeof a).denominator
  );
}
