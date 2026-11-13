/**
 * Codebreaker — the engine.
 *
 * You are shown a target number and have to find the hidden *calculation*
 * that produces it. Six characters, say, drawn from the digits and
 * + − × ÷ ; every guess comes back marked per character the way a word
 * puzzle marks letters.
 *
 * WHAT MAKES IT MATHEMATICS RATHER THAN A GUESSING GAME is the submission
 * rule: a guess is only accepted if it is itself a valid calculation that
 * equals the target. You cannot probe with "11111+" to learn where the digits
 * live. Every single attempt costs you a real piece of arithmetic — find some
 * expression of exactly the right length that hits the number — and the
 * feedback is the reward for having done it. That one constraint is the whole
 * design; without it this is a digit-hunt with an equals sign drawn on.
 *
 * ARITHMETIC IS EXACT AND INTEGER. Division must divide evenly and nothing
 * may be divided by zero. Floating point never enters: a puzzle whose answer
 * depends on whether 1/3*3 lands on 1.0 would be unfair in a way the player
 * cannot see. scripts/check-games.ts evaluates every generated puzzle and
 * every expression it can build to prove this holds.
 */

export const DIFFICULTIES = ["easy", "medium", "hard", "expert"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type DifficultySpec = {
  key: Difficulty;
  name: string;
  /** Characters in the hidden calculation. */
  length: number;
  attempts: number;
  /** The largest number the target may be. The smallest is always 1. */
  targetMax: number;
  /**
   * Whether a right-character-wrong-place mark is shown.
   *
   * Expert turns this off, and it is the single thing that makes Expert
   * Expert. With it off a character is either in the right place or it is
   * grey — the grey no longer distinguishes "not in the calculation" from
   * "in the calculation, but not there". You lose the yellow that normally
   * does most of the deductive work, so the arithmetic has to carry it.
   */
  positionHints: boolean;
  blurb: string;
};

/**
 * The four levels, pulled deliberately far apart.
 *
 * Length alone was not enough of a difference — five characters against six
 * is barely felt, and the target was free to be anything up to 999 at every
 * level, which is what made Medium so much harder than its name. The target
 * ceiling is now the main dial: a number you can hold in your head is a
 * different puzzle from one you cannot, regardless of how many characters it
 * takes to write.
 *
 * Hard is the only level that goes big. Expert goes back down to 100 and
 * takes the yellow marks away instead — eight characters that have to land
 * on a small number is a tight constraint, and solving it blind is a
 * different kind of hard from Hard's arithmetic.
 */
export const DIFFICULTY_SPECS: Record<Difficulty, DifficultySpec> = {
  easy: {
    key: "easy",
    name: "Easy",
    length: 5,
    attempts: 7,
    targetMax: 30,
    positionHints: true,
    blurb: "Five characters, target under 30. Seven tries.",
  },
  medium: {
    key: "medium",
    name: "Medium",
    length: 6,
    attempts: 6,
    targetMax: 100,
    positionHints: true,
    blurb: "Six characters, target under 100.",
  },
  hard: {
    key: "hard",
    name: "Hard",
    length: 7,
    attempts: 6,
    targetMax: 500,
    positionHints: true,
    blurb: "Seven characters, target up to 500.",
  },
  expert: {
    key: "expert",
    name: "Expert",
    length: 8,
    attempts: 6,
    targetMax: 100,
    positionHints: false,
    blurb: "Eight characters, target under 100 — and no yellow marks.",
  },
};

export type Mode = "daily" | "endless" | "timed";

export const OPERATORS = ["+", "-", "*", "/"] as const;
export const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
/** Every character that may appear in a calculation. */
export const ALPHABET: string[] = [...DIGITS, ...OPERATORS];

export const isOperator = (c: string) => (OPERATORS as readonly string[]).includes(c);
export const isDigit = (c: string) => c >= "0" && c <= "9";

/** How an operator is written for the player. Never how it is typed. */
export const OPERATOR_LABEL: Record<string, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

export function pretty(expression: string): string {
  return [...expression].map((c) => OPERATOR_LABEL[c] ?? c).join("");
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

export type EvalResult =
  | { ok: true; value: number }
  | { ok: false; reason: string };

/**
 * Evaluates a calculation with normal precedence, in exact integers.
 *
 * Two passes: × and ÷ collapse first, then + and −. Written out rather than
 * pulled from a parser library because the failure modes are the product
 * here — the player needs to be told *which* rule their guess broke, and
 * "unexpected token" is not that.
 */
export function evaluate(expression: string): EvalResult {
  if (expression.length === 0) return { ok: false, reason: "Nothing to work out yet." };

  for (const c of expression) {
    if (!isDigit(c) && !isOperator(c)) return { ok: false, reason: `"${c}" isn't allowed here.` };
  }
  if (isOperator(expression[0])) {
    return { ok: false, reason: "It can't start with an operator." };
  }
  if (isOperator(expression[expression.length - 1])) {
    return { ok: false, reason: "It can't end with an operator." };
  }

  // Split into numbers and operators.
  const numbers: number[] = [];
  const ops: string[] = [];
  let current = "";
  for (const c of expression) {
    if (isDigit(c)) {
      current += c;
      continue;
    }
    if (current === "") return { ok: false, reason: "Two operators can't sit together." };
    if (current.length > 1 && current[0] === "0") {
      return { ok: false, reason: `"${current}" has a leading zero.` };
    }
    numbers.push(Number(current));
    ops.push(c);
    current = "";
  }
  if (current.length > 1 && current[0] === "0") {
    return { ok: false, reason: `"${current}" has a leading zero.` };
  }
  numbers.push(Number(current));

  // Pass one: × and ÷, left to right.
  const terms: number[] = [numbers[0]];
  const adds: string[] = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const rhs = numbers[i + 1];
    if (op === "*") {
      terms[terms.length - 1] *= rhs;
    } else if (op === "/") {
      if (rhs === 0) return { ok: false, reason: "You can't divide by zero." };
      const lhs = terms[terms.length - 1];
      if (lhs % rhs !== 0) {
        return { ok: false, reason: `${lhs} ÷ ${rhs} doesn't divide evenly.` };
      }
      terms[terms.length - 1] = lhs / rhs;
    } else {
      adds.push(op);
      terms.push(rhs);
    }
  }

  // Pass two: + and −.
  let total = terms[0];
  for (let i = 0; i < adds.length; i++) {
    total = adds[i] === "+" ? total + terms[i + 1] : total - terms[i + 1];
  }
  return { ok: true, value: total };
}

export type GuessCheck =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Whether a guess may be submitted.
 *
 * The length rule and the equals-the-target rule are what make every attempt
 * a piece of arithmetic rather than a probe.
 */
export function checkGuess(guess: string, length: number, target: number): GuessCheck {
  if (guess.length !== length) {
    return { ok: false, reason: `Use all ${length} characters.` };
  }
  const result = evaluate(guess);
  if (!result.ok) return { ok: false, reason: result.reason };
  if (result.value !== target) {
    return { ok: false, reason: `That comes to ${result.value}, not ${target}.` };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Building a puzzle
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A deterministic hash, so a daily puzzle is the same for everyone. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** The ways a calculation of `length` characters can be shaped. */
function shapesFor(length: number): number[][] {
  // Each shape is the digit-count of each operand; operators fill the gaps,
  // so sum(shape) + (shape.length - 1) === length.
  const out: number[][] = [];
  const walk = (acc: number[], used: number) => {
    if (acc.length >= 2) {
      const total = used + acc.length - 1;
      if (total === length) out.push([...acc]);
      if (total >= length) return;
    }
    if (acc.length >= 4) return;
    for (const d of [1, 2, 3]) {
      if (used + d + acc.length > length) continue;
      walk([...acc, d], used + d);
    }
  };
  walk([], 0);
  return out;
}

function randomOperand(digits: number, rand: () => number): number {
  if (digits === 1) return Math.floor(rand() * 10);
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return min + Math.floor(rand() * (max - min + 1));
}

export type Puzzle = { expression: string; target: number };

/**
 * Generates a hidden calculation of exactly `length` characters.
 *
 * Rejection sampling: build a candidate from a random shape, evaluate it, and
 * keep it only if it is well formed, divides evenly, and lands on a target
 * worth showing. Generating *forwards* from an expression rather than
 * searching backwards from a target is what keeps this simple — the target is
 * whatever the expression happens to make, so it is always achievable by
 * construction.
 *
 * The attempt cap is generous and the fallback is a hand-written calculation
 * of the right length, so this can never hang or return something invalid.
 * scripts/check-games.ts generates thousands and asserts the fallback is
 * never needed.
 */
export function makePuzzle(length: number, targetMax: number, rand: () => number): Puzzle {
  const shapes = shapesFor(length);

  // Generous, because the small ceilings are genuinely selective: eight
  // characters that land under 100 need real cancellation, so most random
  // candidates are thrown away. scripts/check-games.ts asserts the fallback
  // below is never actually reached at any level.
  for (let attempt = 0; attempt < 60000; attempt++) {
    const shape = shapes[Math.floor(rand() * shapes.length) % shapes.length];
    const parts: string[] = [];
    for (let i = 0; i < shape.length; i++) {
      if (i > 0) parts.push(OPERATORS[Math.floor(rand() * OPERATORS.length) % OPERATORS.length]);
      parts.push(String(randomOperand(shape[i], rand)));
    }
    const expression = parts.join("");
    if (expression.length !== length) continue;

    const result = evaluate(expression);
    if (!result.ok) continue;
    // A target has to be worth aiming at: positive, and inside the ceiling
    // this level promises. The ceiling is the main thing separating the four
    // levels — see DIFFICULTY_SPECS.
    if (result.value <= 0 || result.value > targetMax) continue;
    // A calculation that is only "n + 0" teaches nothing.
    if (/(^|[+\-*/])0([+\-*/]|$)/.test(expression) && length > 5) continue;

    return { expression, target: result.value };
  }

  const fallback = FALLBACKS[length] ?? FALLBACKS[6];
  return { expression: fallback, target: (evaluate(fallback) as { ok: true; value: number }).value };
}

/**
 * Last-resort calculations, one per supported length.
 *
 * Never reached in practice; present so the generator has no failure mode at
 * all. Each one is inside its level's target ceiling — a fallback that broke
 * the promise the UI makes about the range would be worse than no fallback.
 */
const FALLBACKS: Record<number, string> = {
  5: "9*3-5", // 22, under Easy's 30
  6: "12*8-6", // 90, under Medium's 100
  7: "12*34-8", // 400, under Hard's 500
  8: "12*9-8*1", // 100, Expert's ceiling exactly
};

export function dailyKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dailyPuzzle(difficulty: Difficulty, key = dailyKey()): Puzzle {
  const spec = DIFFICULTY_SPECS[difficulty];
  return makePuzzle(
    spec.length,
    spec.targetMax,
    mulberry32(hashString(`numbersmith:mathler:${key}:${difficulty}`)),
  );
}

// ---------------------------------------------------------------------------
// Marking a guess
// ---------------------------------------------------------------------------

export type Mark = "exact" | "misplaced" | "absent";

export type Feedback = {
  exact: number;
  misplaced: number;
  absent: number;
  marks: Mark[];
};

/**
 * Marks a guess against the hidden calculation, character by character.
 *
 * THE PART THAT IS EASY TO GET WRONG is repeated characters, and a
 * calculation repeats far more than a word does — digits recur and every
 * expression is mostly digits. The naive version marks a character "present"
 * once for every copy in the answer, so guessing 11+111 against 2*1234 claims
 * four misplaced 1s that are not there and the player's deductions quietly
 * stop working.
 *
 * Two passes fix it. Exact matches are taken out of play first; only then are
 * the leftovers checked against a tally of what actually remains.
 * scripts/check-games.ts brute-forces this against an independent reference.
 */
export function score(guess: string, secret: string, positionHints = true): Feedback {
  const n = secret.length;
  const marks: Mark[] = new Array(n).fill("absent");
  const remaining = new Map<string, number>();

  let exact = 0;
  for (let i = 0; i < n; i++) {
    if (guess[i] === secret[i]) {
      exact++;
      marks[i] = "exact";
    } else {
      remaining.set(secret[i], (remaining.get(secret[i]) ?? 0) + 1);
    }
  }

  // Expert stops here. Without the second pass every non-exact character
  // stays grey, so the row says only "this one is in the right place" and
  // nothing at all about the rest.
  if (!positionHints) {
    return { exact, misplaced: 0, absent: n - exact, marks };
  }

  let misplaced = 0;
  for (let i = 0; i < n; i++) {
    if (marks[i] === "exact") continue;
    const left = remaining.get(guess[i]) ?? 0;
    if (left > 0) {
      misplaced++;
      marks[i] = "misplaced";
      remaining.set(guess[i], left - 1);
    }
  }

  return { exact, misplaced, absent: n - exact - misplaced, marks };
}

/**
 * The best thing known about each character so far, for colouring the keypad.
 *
 * "Best" because a character can be marked absent in one row and exact in
 * another — guess 1+1 against 2+1 and the first 1 is absent while the second
 * is exact. Taking the strongest mark is the only reading that does not
 * contradict itself on screen.
 */
export function keypadState(guesses: Guess[]): Record<string, Mark> {
  const rank: Record<Mark, number> = { absent: 0, misplaced: 1, exact: 2 };
  const out: Record<string, Mark> = {};
  for (const g of guesses) {
    [...g.text].forEach((c, i) => {
      const mark = g.feedback.marks[i];
      if (!out[c] || rank[mark] > rank[out[c]]) out[c] = mark;
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// A game
// ---------------------------------------------------------------------------

export type Guess = { text: string; feedback: Feedback };

export type Game = {
  difficulty: Difficulty;
  mode: Mode;
  secret: string;
  target: number;
  guesses: Guess[];
  status: "playing" | "won" | "lost";
  hintsUsed: number;
  /** Positions revealed by a hint. */
  revealed: number[];
};

export const MAX_HINTS = 2;

export function newGame(opts: {
  difficulty: Difficulty;
  mode: Mode;
  seed?: number;
  dayKey?: string;
}): Game {
  const spec = DIFFICULTY_SPECS[opts.difficulty];
  const puzzle =
    opts.mode === "daily"
      ? dailyPuzzle(opts.difficulty, opts.dayKey ?? dailyKey())
      : makePuzzle(spec.length, spec.targetMax, mulberry32(opts.seed ?? (Date.now() | 0)));

  return {
    difficulty: opts.difficulty,
    mode: opts.mode,
    secret: puzzle.expression,
    target: puzzle.target,
    guesses: [],
    status: "playing",
    hintsUsed: 0,
    revealed: [],
  };
}

export function submit(game: Game, text: string): Game {
  if (game.status !== "playing") return game;
  const spec = DIFFICULTY_SPECS[game.difficulty];
  if (!checkGuess(text, spec.length, game.target).ok) return game;

  const feedback = score(text, game.secret, spec.positionHints);
  const guesses = [...game.guesses, { text, feedback }];
  const won = feedback.exact === spec.length;
  const lost = !won && guesses.length >= spec.attempts;

  return { ...game, guesses, status: won ? "won" : lost ? "lost" : "playing" };
}

export function attemptsLeft(game: Game): number {
  return Math.max(0, DIFFICULTY_SPECS[game.difficulty].attempts - game.guesses.length);
}

/** Reveals one position the player has not already pinned down. */
export function takeHint(game: Game, rand: () => number = Math.random): Game {
  if (game.status !== "playing" || game.hintsUsed >= MAX_HINTS) return game;

  const known = new Set(game.revealed);
  for (const g of game.guesses) {
    g.feedback.marks.forEach((m, i) => {
      if (m === "exact") known.add(i);
    });
  }
  const candidates = [...game.secret].map((_, i) => i).filter((i) => !known.has(i));
  if (candidates.length === 0) return { ...game, hintsUsed: game.hintsUsed + 1 };

  const pick = candidates[Math.floor(rand() * candidates.length) % candidates.length];
  return { ...game, hintsUsed: game.hintsUsed + 1, revealed: [...game.revealed, pick] };
}

// ---------------------------------------------------------------------------
// Rewards
// ---------------------------------------------------------------------------

export function scoreGame(game: Game): number {
  if (game.status !== "won") return 0;
  const spec = DIFFICULTY_SPECS[game.difficulty];
  const base = spec.length * 100;
  const spare = spec.attempts - game.guesses.length;
  const efficiency = spare * spec.length * 40;
  const hintPenalty = game.hintsUsed * 80;
  return Math.max(10, base + efficiency - hintPenalty);
}

export function xpForGame(game: Game): number {
  if (game.status !== "won") return 3;
  const byDifficulty: Record<Difficulty, number> = { easy: 12, medium: 20, hard: 30, expert: 42 };
  const spare = DIFFICULTY_SPECS[game.difficulty].attempts - game.guesses.length;
  return byDifficulty[game.difficulty] + Math.min(20, spare * 4);
}
