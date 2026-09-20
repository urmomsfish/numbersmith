// Lesson and problem text is authored as plain ASCII-ish math ("a^m · a^n =
// a^(m+n)", "S_n", "3/4", "x >= 2"). That is easy to write and diff, but it is
// not what a student should have to read. This module turns that source text
// into a small node tree the renderer can typeset with real superscripts,
// subscripts, fractions and operator glyphs.
//
// The guiding constraint is that this runs over *prose*, not over isolated
// formulas: every lesson bullet is a sentence with math embedded in it. So each
// rule below is deliberately narrow and refuses to fire when it cannot tell
// math from ordinary words. Rendering "and/or" as a fraction or "the sum of"
// with a sigma would be far worse than leaving the original text alone.

export type MathNode =
  | { t: "text"; v: string }
  | { t: "sup"; v: MathNode[] }
  | { t: "sub"; v: MathNode[] }
  | { t: "frac"; num: string; den: string }
  | { t: "sqrt"; v: MathNode[] };

/** Literal substitutions that are unambiguous wherever they appear.
 *
 * Order matters: longer LaTeX names must precede any shorter name they start
 * with, or "\rightarrow" would be eaten by the "\right" sizing hint. */
const SYMBOLS: Array<[RegExp, string]> = [
  // LaTeX fragments that leaked into hand-authored content.
  [/\\div\b/g, "÷"],
  [/\\times\b/g, "×"],
  [/\\cdot\b/g, "·"],
  [/\\pm\b/g, "±"],
  [/\\mp\b/g, "∓"],
  [/\\leq?\b/g, "≤"],
  [/\\geq?\b/g, "≥"],
  [/\\neq?\b/g, "≠"],
  [/\\approx\b/g, "≈"],
  [/\\equiv\b/g, "≡"],
  [/\\pi\b/g, "π"],
  [/\\infty\b/g, "∞"],
  [/\\sqrt\b/g, "sqrt"],
  // Arrows. The long names come first so the sizing hints below cannot
  // truncate them.
  [/\\Rightarrow\b/g, "⇒"],
  [/\\Leftrightarrow\b/g, "⇔"],
  [/\\Leftarrow\b/g, "⇐"],
  [/\\rightarrow\b/g, "→"],
  [/\\leftarrow\b/g, "←"],
  [/\\implies\b/g, "⇒"],
  [/\\iff\b/g, "⇔"],
  [/\\to\b/g, "→"],
  // Set and sequence notation.
  [/\\in\b/g, "∈"],
  [/\\notin\b/g, "∉"],
  [/\\subseteq\b/g, "⊆"],
  [/\\subset\b/g, "⊂"],
  [/\\cup\b/g, "∪"],
  [/\\cap\b/g, "∩"],
  [/\\emptyset\b/g, "∅"],
  [/\\(ldots|dots|cdots)\b/g, "…"],
  [/\\sum\b/g, "∑"],
  [/\\prod\b/g, "∏"],
  [/\\angle\b/g, "∠"],
  [/\\triangle\b/g, "△"],
  [/\\degree\b/g, "°"],
  // Greek letters that appear in competition write-ups.
  [/\\alpha\b/g, "α"],
  [/\\beta\b/g, "β"],
  [/\\gamma\b/g, "γ"],
  [/\\delta\b/g, "δ"],
  [/\\Delta\b/g, "Δ"],
  [/\\theta\b/g, "θ"],
  [/\\lambda\b/g, "λ"],
  [/\\mu\b/g, "μ"],
  [/\\sigma\b/g, "σ"],
  [/\\phi\b/g, "φ"],
  [/\\omega\b/g, "ω"],
  [/\\Omega\b/g, "Ω"],
  // Sizing hints and spacing carry no meaning once we are not in TeX.
  [/\\(left|right|big|Big|bigg|Bigg)\b/g, ""],
  [/\\[,;:!]/g, " "],
  [/\\quad\b/g, "  "],
  // ASCII comparison operators.
  [/<=>/g, "⇔"],
  [/<=/g, "≤"],
  [/>=/g, "≥"],
  [/!=/g, "≠"],
  [/~=/g, "≈"],
  [/=>/g, "⇒"],
  [/->/g, "→"],
  // Multiplication: only between two operands, so "*" used as a footnote
  // marker or bullet is left alone.
  [/(?<=[0-9A-Za-z)\]])\s*\*\s*(?=[0-9A-Za-z(\[])/g, " × "],
  // A hyphen flanked by spaces inside math reads as a minus sign. Restricted
  // to digit-space-hyphen-space-digit so ordinary dashes in prose survive.
  [/(?<=[0-9A-Za-z)\]]) - (?=[0-9A-Za-z(\[])/g, " − "],
  // "pi" only as a standalone word.
  [/\bpi\b/g, "π"],
  // "30 degrees" -> "30°", but "degrees of freedom" is untouched.
  [/(\d)\s*degrees\b/g, "$1°"],
  [/(\d)\s*degree\b/g, "$1°"],
];

export function applySymbols(text: string): string {
  let out = text;
  for (const [re, to] of SYMBOLS) out = out.replace(re, to);
  return out;
}

/** Characters that may form the body of an un-parenthesised sup/subscript. */
function isScriptChar(c: string): boolean {
  return /[0-9A-Za-z]/.test(c);
}

/** Reads a balanced (...) or {...} group starting at `i`, which must point at
 * the opening delimiter. Braces matter because hand-authored content mixes
 * TeX habits into the ASCII style — "a^{p-1}" and "S_{15}" are as common as
 * "a^(m+n)" — and a brace group that isn't understood leaks the raw "^{"
 * straight onto the slide. The delimiters themselves are dropped. */
function readGroup(src: string, i: number): { body: string; next: number } | null {
  const open = src[i];
  const close = open === "(" ? ")" : open === "{" ? "}" : null;
  if (!close) return null;
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === open) depth++;
    else if (src[j] === close) {
      depth--;
      if (depth === 0) return { body: src.slice(i + 1, j), next: j + 1 };
    }
  }
  return null; // unbalanced — treat as ordinary text
}

/** Reads the operand following a ^ or _ marker. */
function readScript(src: string, i: number): { body: string; next: number } | null {
  const group = readGroup(src, i);
  if (group) return group;
  let j = i;
  // An optional leading sign, e.g. a^-1.
  if (src[j] === "-" || src[j] === "−" || src[j] === "+") j++;
  const start = j;
  while (j < src.length && isScriptChar(src[j])) j++;
  if (j === start) return null; // bare "^" with nothing after it
  return { body: src.slice(i, j), next: j };
}

// A fraction only when both sides are a small integer or a single variable:
// "3/4", "n/2", "a/b". Anything longer ("and/or", "km/h", paths) stays text.
//
// Sticky rather than global: it is tested at each scan position against the
// whole string, so the lookaround still sees the real neighbours. Matching on
// isolated buffers instead would read "1/a^n" as (1/a)^n, because the "^"
// that disqualifies the match would have already been split off.
const FRACTION = /(\d{1,3}|[a-zA-Z])\/(\d{1,3}|[a-zA-Z])(?![\w.^_/])/y;
const FRACTION_LEFT = /[\w.^_/]/;

function pushText(nodes: MathNode[], text: string) {
  if (!text) return;
  const last = nodes[nodes.length - 1];
  if (last && last.t === "text") last.v += text;
  else nodes.push({ t: "text", v: text });
}

/** Parses source text (after symbol substitution) into renderable nodes. */
function parseInner(src: string): MathNode[] {
  const nodes: MathNode[] = [];
  let buf = "";
  let i = 0;

  const flush = () => {
    pushText(nodes, buf);
    buf = "";
  };

  while (i < src.length) {
    const c = src[i];

    if (c === "^" || c === "_") {
      const script = readScript(src, i + 1);
      if (script) {
        flush();
        nodes.push({ t: c === "^" ? "sup" : "sub", v: parseInner(script.body) });
        i = script.next;
        continue;
      }
    }

    // \frac{a}{b} and its sizing variants. Only a genuinely short pair becomes
    // a raised/lowered fraction; a bulky numerator like n(n+1) is illegible at
    // 0.72em, so it degrades to an inline "a/b" that still reads correctly.
    const fracCmd = /^\\[dt]?frac\s*(?=\{)/.exec(src.slice(i));
    if (fracCmd) {
      const num = readGroup(src, i + fracCmd[0].length);
      const den = num && readGroup(src, num.next);
      if (num && den) {
        flush();
        if (num.body.length <= 3 && den.body.length <= 3) {
          nodes.push({ t: "frac", num: num.body, den: den.body });
        } else {
          nodes.push(...parseInner(`${num.body}/${den.body}`));
        }
        i = den.next;
        continue;
      }
    }

    // \text{...} and \mathrm{...} exist only to switch font in TeX; the words
    // inside are ordinary prose and should render as such.
    const textCmd = /^\\(text|textrm|mathrm|mbox|operatorname)\s*(?=\{)/.exec(src.slice(i));
    if (textCmd) {
      const group = readGroup(src, i + textCmd[0].length);
      if (group) {
        flush();
        pushText(nodes, group.body);
        i = group.next;
        continue;
      }
    }

    if (src.startsWith("sqrt", i)) {
      const group = readGroup(src, i + 4);
      if (group) {
        flush();
        nodes.push({ t: "sqrt", v: parseInner(group.body) });
        i = group.next;
        continue;
      }
    }

    if (i === 0 || !FRACTION_LEFT.test(src[i - 1])) {
      FRACTION.lastIndex = i;
      const m = FRACTION.exec(src);
      if (m) {
        flush();
        nodes.push({ t: "frac", num: m[1], den: m[2] });
        i = FRACTION.lastIndex;
        continue;
      }
    }

    buf += c;
    i++;
  }

  flush();
  return nodes;
}

/** Parses authored math-in-prose into a renderable node tree. */
export function parseMath(text: string): MathNode[] {
  return parseInner(applySymbols(text));
}

/** Re-parenthesises a multi-character script so the flattened form is
 * unambiguous: a^(m+n) must not round-trip to the different formula a^m+n. */
function wrapScript(body: string): string {
  return body.length > 1 ? `(${body})` : body;
}

/** Flattens nodes back to a plain string — for alt text, titles, and tests. */
export function mathToPlainText(nodes: MathNode[]): string {
  return nodes
    .map((n) => {
      switch (n.t) {
        case "text":
          return n.v;
        case "sup":
          return "^" + wrapScript(mathToPlainText(n.v));
        case "sub":
          return "_" + wrapScript(mathToPlainText(n.v));
        case "frac":
          return `${n.num}/${n.den}`;
        case "sqrt":
          return `√(${mathToPlainText(n.v)})`;
      }
    })
    .join("");
}
