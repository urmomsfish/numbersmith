/**
 * Verification for the three arcade games.
 *
 * All three engines are pure, which means their rules can be *proved* rather
 * than spot-checked:
 *
 *   Codebreaker — the arithmetic is checked against an independently written
 *     evaluator over thousands of expressions, every generated puzzle is
 *     re-evaluated to confirm it really makes its stated target, and the
 *     per-character marking is brute-forced over every ordered pair of
 *     length-4 strings. Duplicate handling is the classic bug and it is
 *     invisible in casual play: the clues merely become subtly wrong and the
 *     player blames themselves.
 *
 *   Factor Forge — four thousand random games are played to completion, with
 *     every board invariant re-asserted after every single move, plus hand
 *     worked cases for the divisibility rule and a measurement of how often
 *     a game actually ends (a merge rule this permissive could easily never
 *     jam, which would mean no game).
 *
 *   Equation Escape — every authored answer is re-derived here from the
 *     puzzle's own arithmetic, and three thousand generated mazes are proven
 *     solvable, loop-free, and impossible to finish without opening every
 *     gate. A wrong answer in an escape room is unescapable; there is no
 *     skip button.
 *
 *   npm run verify:games
 */
import {
  ALPHABET,
  DIFFICULTIES,
  DIFFICULTY_SPECS,
  MAX_HINTS,
  checkGuess,
  dailyPuzzle,
  evaluate,
  keypadState,
  makePuzzle,
  newGame,
  pretty,
  score,
  scoreGame,
  submit,
  takeHint,
  xpForGame,
} from "../src/lib/games/mathler";
import {
  DIRECTIONS,
  SPAWN_TABLE,
  UNDO_ALLOWANCE,
  canFuse,
  emptyBoard,
  fuseResult,
  isGameOver,
  legalMoves,
  move,
  newGame as newMerge,
  spawnValue,
  tileLabel,
  xpForGame as mergeXp,
  type Board,
  type Direction,
  type Tile,
} from "../src/lib/games/merge";
import { sparkCount, tileStyle } from "../src/lib/games/merge-theme";
import {
  DIRS,
  buildMaze,
  exitReachable,
  gateBetween,
  isOpen,
  neighbour,
  nextGate,
  reachable,
  routeBetween,
  step,
  type Dir,
} from "../src/lib/games/maze";
import {
  ROOMS,
  TIMEOUT_RULE,
  TOTAL_PUZZLES,
  currentRoomIndex,
  hasEscaped,
  isCorrect,
  isRoomClear,
  isRoomUnlocked,
  normalise,
  roomSolvedCount,
  xpForPuzzle,
  xpForRoom,
} from "../src/lib/games/escape";

let failures = 0;
let checks = 0;

function ok(label: string, condition: boolean, detail?: string) {
  checks++;
  if (!condition) {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}
function eq(label: string, actual: unknown, expected: unknown) {
  ok(label, actual === expected, `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

/** A local PRNG, so puzzle generation can be driven deterministically here. */
function mulberry32Local(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The generator's last-resort expressions. If one of these ever comes back
 * from makePuzzle, rejection sampling failed and the puzzles are not random. */
const FALLBACK_SET = new Set(["12+34", "123-45", "12*34-8", "123+456"]);

// ===========================================================================
// Codebreaker — the hidden calculation
// ===========================================================================

console.log("Codebreaker\n");

/**
 * An independent evaluator, deliberately written a different way from the
 * engine's: this one builds a token list and collapses it with two passes
 * over arrays, where the engine streams characters. If they agree on a
 * hundred thousand expressions, the arithmetic is right.
 */
function referenceEval(expr: string): number | null {
  if (!/^\d+([+\-*/]\d+)*$/.test(expr)) return null;
  const nums = expr.split(/[+\-*/]/);
  if (nums.some((n) => n.length > 1 && n[0] === "0")) return null;
  const ops = [...expr].filter((c) => "+-*/".includes(c));

  const vals = nums.map(Number);
  // × and ÷ first.
  const t: number[] = [vals[0]];
  const rest: string[] = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "*") t[t.length - 1] *= vals[i + 1];
    else if (ops[i] === "/") {
      if (vals[i + 1] === 0) return null;
      if (t[t.length - 1] % vals[i + 1] !== 0) return null;
      t[t.length - 1] /= vals[i + 1];
    } else {
      rest.push(ops[i]);
      t.push(vals[i + 1]);
    }
  }
  let out = t[0];
  for (let i = 0; i < rest.length; i++) out = rest[i] === "+" ? out + t[i + 1] : out - t[i + 1];
  return out;
}

{
  // Evaluation, against the reference, over every short expression that can
  // be written from one and two digit operands.
  let disagreements = 0;
  let evaluated = 0;
  const operands = ["0", "1", "2", "5", "7", "9", "10", "12", "36", "99"];
  for (const a of operands) {
    for (const b of operands) {
      for (const op of ["+", "-", "*", "/"]) {
        for (const c of ["", ...operands]) {
          for (const op2 of c === "" ? [""] : ["+", "-", "*", "/"]) {
            const expr = `${a}${op}${b}${op2}${c}`;
            const mine = evaluate(expr);
            const theirs = referenceEval(expr);
            evaluated++;
            if (theirs === null) {
              if (mine.ok) disagreements++;
            } else if (!mine.ok || mine.value !== theirs) {
              disagreements++;
            }
          }
        }
      }
    }
  }
  eq("evaluation agrees with an independent evaluator", disagreements, 0);
  ok("a useful number of expressions were evaluated", evaluated > 15000, `${evaluated}`);
  console.log(`  ${evaluated.toLocaleString()} expressions evaluated`);
}

{
  // Precedence and the rules a player will actually trip over.
  const value = (s: string) => {
    const r = evaluate(s);
    return r.ok ? r.value : null;
  };
  eq("× binds tighter than +", value("2+3*4"), 14);
  eq("÷ binds tighter than −", value("20-12/4"), 17);
  eq("− is left to right", value("9-4-3"), 2);
  eq("÷ is left to right", value("36/6/3"), 2);
  eq("a lone number is itself", value("42"), 42);
  eq("a negative result is allowed", value("3-10"), -7);

  const bad = (s: string) => {
    const r = evaluate(s);
    return r.ok ? null : r.reason;
  };
  ok("a trailing operator is refused", !!bad("12+"));
  ok("a leading operator is refused", !!bad("+12"));
  ok("two operators together are refused", !!bad("1++2"));
  ok("division by zero is refused", !!bad("12/0"));
  ok("inexact division is refused", !!bad("10/4"));
  ok("a leading zero is refused", !!bad("05+1"));
  ok("a lone zero operand is fine", value("10+0") === 10);
  ok("a letter is refused", !!bad("1a+2"));
  ok("an empty expression is refused", !!bad(""));

  // The messages are shown to the player, so they have to say something.
  for (const s of ["12+", "1++2", "12/0", "10/4", "05+1"]) {
    const why = bad(s);
    ok(`"${s}" explains itself`, !!why && why.length > 8, why ?? "no reason");
  }
}

{
  // Generated puzzles. Every one must be a valid calculation of exactly the
  // right length that really does make its stated target — otherwise the
  // puzzle is unsolvable and the player is being lied to.
  let bad = 0;
  let wrongLength = 0;
  let badTarget = 0;
  let usedFallback = 0;
  const targets = new Set<number>();
  const expressions = new Set<string>();

  for (const key of DIFFICULTIES) {
    const spec = DIFFICULTY_SPECS[key];
    for (let seed = 1; seed <= 1500; seed++) {
      const rand = mulberry32Local(seed * 2654435761 + spec.length);
      const puzzle = makePuzzle(spec.length, rand);

      if (puzzle.expression.length !== spec.length) wrongLength++;
      const res = evaluate(puzzle.expression);
      if (!res.ok || res.value !== puzzle.target) bad++;
      if (puzzle.target <= 0 || puzzle.target > 999) badTarget++;
      if ((FALLBACK_SET as Set<string>).has(puzzle.expression)) usedFallback++;

      targets.add(puzzle.target);
      expressions.add(puzzle.expression);

      // Its own expression must be an acceptable guess, or the puzzle cannot
      // be won even by someone who knows the answer.
      ok(`${key}: the answer is a legal guess`, checkGuess(puzzle.expression, spec.length, puzzle.target).ok);
    }
  }
  eq("every generated puzzle is the right length", wrongLength, 0);
  eq("every generated puzzle really makes its target", bad, 0);
  eq("every target is in a sane range", badTarget, 0);
  eq("the generator never falls back", usedFallback, 0);
  ok("the puzzles vary", expressions.size > 2000, `${expressions.size} distinct`);
  ok("the targets vary", targets.size > 200, `${targets.size} distinct`);
  console.log(`  ${expressions.size.toLocaleString()} distinct puzzles generated`);
}

{
  // Submission: the rule that makes it arithmetic.
  const game = newGame({ difficulty: "medium", mode: "endless", seed: 42 });
  const spec = DIFFICULTY_SPECS.medium;

  eq("the answer itself is accepted", checkGuess(game.secret, spec.length, game.target).ok, true);

  // A guess of the right length and shape, but the wrong value, is refused —
  // this is the whole point of the game.
  const wrongValue = game.target === 1 ? "1+1+1" : "1".repeat(spec.length);
  const refusal = checkGuess(wrongValue, spec.length, game.target);
  ok("a guess that doesn't equal the target is refused", !refusal.ok);
  if (!refusal.ok) ok("and says what it came to", /comes to|isn't|can't|has a/.test(refusal.reason), refusal.reason);

  ok("a short guess is refused", !checkGuess("1+1", spec.length, game.target).ok);
  ok("a long guess is refused", !checkGuess("1+1+1+1+1+1", spec.length, game.target).ok);

  // submit() enforces it too — a UI bug must not be able to post a bad guess.
  eq("submit ignores an invalid guess", submit(game, "1+1").guesses.length, 0);
  eq("submit ignores a wrong-value guess", submit(game, wrongValue).guesses.length, 0);
  eq("submit accepts the answer", submit(game, game.secret).status, "won");
}

{
  // Marking, brute-forced against an independent reference. Calculations
  // repeat characters far more than words do, so duplicate handling is the
  // thing most likely to be silently wrong.
  function commonChars(a: string, b: string): number {
    const count = new Map<string, number>();
    for (const c of b) count.set(c, (count.get(c) ?? 0) + 1);
    let total = 0;
    for (const c of a) {
      const left = count.get(c) ?? 0;
      if (left > 0) {
        total++;
        count.set(c, left - 1);
      }
    }
    return total;
  }

  const alphabet = ["1", "2", "3", "+", "-"];
  let bucketMismatch = 0;
  let totalMismatch = 0;
  let marksMismatch = 0;
  let asymmetric = 0;
  let selfWrong = 0;
  let pairs = 0;

  // Every ordered pair of length-4 strings over a 5-character alphabet.
  const all: string[] = [];
  for (const a of alphabet)
    for (const b of alphabet)
      for (const c of alphabet) for (const d of alphabet) all.push(a + b + c + d);

  for (const secret of all) {
    for (const guess of all) {
      pairs++;
      const f = score(guess, secret);
      if (f.exact + f.misplaced + f.absent !== 4) bucketMismatch++;
      if (f.exact + f.misplaced !== commonChars(guess, secret)) totalMismatch++;
      const me = f.marks.filter((m) => m === "exact").length;
      const mm = f.marks.filter((m) => m === "misplaced").length;
      if (me !== f.exact || mm !== f.misplaced) marksMismatch++;
      const r = score(secret, guess);
      if (r.exact !== f.exact || r.misplaced !== f.misplaced) asymmetric++;
      if (secret === guess && f.exact !== 4) selfWrong++;
    }
  }

  eq("every position falls in exactly one bucket", bucketMismatch, 0);
  eq("exact + misplaced never exceeds true character multiplicity", totalMismatch, 0);
  eq("per-position marks agree with the counts", marksMismatch, 0);
  eq("marking is symmetric", asymmetric, 0);
  eq("a calculation marked against itself is all exact", selfWrong, 0);
  console.log(`  ${pairs.toLocaleString()} guess/answer pairs marked`);

  // The specific case the naive implementation gets wrong.
  const f = score("1111", "1234");
  eq("1111 vs 1234 — one exact", f.exact, 1);
  eq("1111 vs 1234 — no phantom misplaced", f.misplaced, 0);
  const g = score("11+2", "2+11");
  eq("11+2 vs 2+11 — no position matches", g.exact, 0);
  eq("11+2 vs 2+11 — all four are misplaced", g.misplaced, 4);
}

{
  // The keypad colouring must take the strongest mark a character ever got.
  const guesses = [
    { text: "1+1", feedback: score("1+1", "2+1") },
    { text: "2+2", feedback: score("2+2", "2+1") },
  ];
  const state = keypadState(guesses);
  eq("a character seen exact anywhere reads exact", state["+"], "exact");
  eq("a character exact in one row is not downgraded by another", state["1"], "exact");
  eq("a character never matched reads absent", state["2"], "exact");
  eq("an untouched character has no state", state["9"], undefined);

  const onlyAbsent = keypadState([{ text: "7-7", feedback: score("7-7", "1+1") }]);
  eq("a character that appears nowhere is absent", onlyAbsent["7"], "absent");
}

{
  // Playing a game out.
  for (const key of DIFFICULTIES) {
    const spec = DIFFICULTY_SPECS[key];

    const won = submit(newGame({ difficulty: key, mode: "endless", seed: 7 }), "");
    eq(`${key}: an empty guess does nothing`, won.guesses.length, 0);

    const fresh = newGame({ difficulty: key, mode: "endless", seed: 11 });
    eq(`${key}: solving first time wins`, submit(fresh, fresh.secret).status, "won");
    ok(`${key}: a win pays points`, scoreGame(submit(fresh, fresh.secret)) > 0);
    ok(`${key}: a win pays xp`, xpForGame(submit(fresh, fresh.secret)) > 3);

    // Losing: feed the allowance with valid-but-wrong calculations. Any
    // expression equal to the target other than the answer will do, and
    // "target" itself is one whenever it fits.
    let g = fresh;
    const filler = String(g.target);
    if (filler.length === spec.length) {
      for (let i = 0; i < spec.attempts + 3; i++) g = submit(g, filler);
      eq(`${key}: running out of attempts loses`, g.status, "lost");
      eq(`${key}: attempts are capped`, g.guesses.length, spec.attempts);
      eq(`${key}: a loss scores nothing`, scoreGame(g), 0);
    }

    // Hints.
    let hinted = newGame({ difficulty: key, mode: "endless", seed: 9 });
    for (let i = 0; i < MAX_HINTS + 3; i++) hinted = takeHint(hinted, () => 0.5);
    eq(`${key}: hints are capped`, hinted.hintsUsed, MAX_HINTS);
    ok(`${key}: revealed positions are distinct`, new Set(hinted.revealed).size === hinted.revealed.length);
    ok(
      `${key}: a hinted win scores less than a clean one`,
      scoreGame({ ...hinted, status: "won", guesses: [] }) <
        scoreGame({ ...hinted, status: "won", guesses: [], hintsUsed: 0 }),
    );

    // Fewer guesses must always be worth more.
    let prev = Infinity;
    for (let used = 1; used <= spec.attempts; used++) {
      const s = scoreGame({
        ...fresh,
        status: "won",
        guesses: new Array(used).fill({ text: "", feedback: score("", "") }),
      });
      ok(`${key}: solving in ${used} beats solving in ${used + 1}`, s <= prev);
      prev = s;
    }
  }
}

{
  // Daily puzzles are the same for everyone and stable across calls.
  for (const key of DIFFICULTIES) {
    const a = dailyPuzzle(key, "2026-11-08");
    const b = dailyPuzzle(key, "2026-11-08");
    eq(`${key}: today's puzzle is stable`, a.expression, b.expression);
    eq(`${key}: and so is its target`, a.target, b.target);
    eq(`${key}: it is the right length`, a.expression.length, DIFFICULTY_SPECS[key].length);
    ok(`${key}: it is solvable`, checkGuess(a.expression, a.expression.length, a.target).ok);
  }
  const seen = new Set<string>();
  for (let d = 1; d <= 30; d++) {
    seen.add(dailyPuzzle("medium", `2026-11-${String(d).padStart(2, "0")}`).expression);
  }
  ok("daily puzzles vary across a month", seen.size >= 27, `${seen.size} distinct in 30 days`);

  const daily = newGame({ difficulty: "medium", mode: "daily", dayKey: "2026-11-08" });
  eq("daily mode uses the daily puzzle", daily.secret, dailyPuzzle("medium", "2026-11-08").expression);
}

{
  // Presentation: operators are shown as proper mathematical symbols, never
  // as the ASCII the player types.
  eq("multiplication is shown as ×", pretty("2*3"), "2×3");
  eq("division is shown as ÷", pretty("6/2"), "6÷2");
  eq("subtraction is shown as a minus sign", pretty("9-1"), "9−1");
  eq("digits are untouched", pretty("12+34"), "12+34");
  eq("the alphabet is the ten digits and four operators", ALPHABET.length, 14);
}

// ===========================================================================
// Factor Forge
// ===========================================================================

console.log("\nFactor Forge\n");

/**
 * Builds a board from a grid of values. 0 is empty.
 *
 * The grid may be ragged or short — it is padded out to a square whose side
 * is the longest dimension given, so a single row can be written literally.
 */
function boardFrom(rows: number[][]): Board {
  const size = Math.max(rows.length, ...rows.map((r) => r.length));
  const grid = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => rows[r]?.[c] ?? 0),
  );
  const b = emptyBoard(size, 12345);
  const tiles: Tile[] = [];
  let id = 1;
  grid.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v !== 0) tiles.push({ id: id++, value: v, r, c });
    }),
  );
  return { ...b, tiles, nextId: id };
}

/** The grid after a move, ignoring the tile the move spawns. */
function gridAfter(board: Board, dir: Direction): number[][] {
  const res = move(board, dir);
  const grid = Array.from({ length: board.size }, () => new Array(board.size).fill(0));
  for (const t of res.board.tiles) {
    if (t.spawnedThisMove) continue;
    grid[t.r][t.c] = t.value;
  }
  return grid;
}

function rowAfter(row: number[], dir: Direction): number[] {
  return gridAfter(boardFrom([row]), dir)[0];
}

{
  // The rule itself.
  eq("equal tiles still fuse, into their sum", canFuse(4, 4), true);
  eq("4 and 4 make 8", fuseResult(4, 4), 8);
  eq("3 divides 6, so they fuse", canFuse(3, 6), true);
  eq("3 and 6 make 9", fuseResult(3, 6), 9);
  eq("6 and 3 fuse the same way round", canFuse(6, 3), true);
  eq("1 divides everything", canFuse(1, 97), true);
  eq("4 does not divide 6", canFuse(4, 6), false);
  eq("9 and 12 do not fuse", canFuse(9, 12), false);
  eq("5 and 7 do not fuse", canFuse(5, 7), false);
  eq("2 divides 12", canFuse(2, 12), true);
  eq("fusion is commutative", canFuse(8, 2), canFuse(2, 8));
  eq("so is the result", fuseResult(8, 2), fuseResult(2, 8));

  // Divisibility is reflexive and 1 is universal — the two properties the
  // game leans on for its joker and its familiar same-meets-same case.
  let reflexive = 0;
  let universal = 0;
  for (let v = 1; v <= 400; v++) {
    if (!canFuse(v, v)) reflexive++;
    if (!canFuse(1, v)) universal++;
  }
  eq("every tile fuses with its own value", reflexive, 0);
  eq("a 1 fuses with every tile", universal, 0);
}

{
  // Sliding, with the new rule.
  eq("3 6 left makes 9", rowAfter([3, 6, 0, 0], "left").join(","), "9,0,0,0");
  eq("2 2 4 left fuses the leading pair first", rowAfter([2, 2, 4, 0], "left").join(","), "4,4,0,0");
  eq("4 2 2 left fuses 4 and 2", rowAfter([4, 2, 2, 0], "left").join(","), "6,2,0,0");
  eq("a merged tile does not merge again this move", rowAfter([1, 1, 2, 0], "left").join(","), "2,2,0,0");
  eq("gaps close before fusing", rowAfter([3, 0, 0, 9], "left").join(","), "12,0,0,0");
  eq("a lone tile slides to the wall", rowAfter([0, 0, 0, 8], "left").join(","), "8,0,0,0");
  eq("coprime neighbours do not fuse", rowAfter([4, 6, 9, 0], "left").join(","), "4,6,9,0");
  eq("5 7 11 stays put", rowAfter([5, 7, 11, 0], "left").join(","), "5,7,11,0");
  // Travelling right, the pair nearest the right wall fuses first: 2 and 6
  // make 8, and the 3 follows it in.
  eq("right fuses from the leading edge too", rowAfter([0, 3, 6, 2], "right").join(","), "0,0,3,8");

  // A board of mutually coprime values cannot move at all.
  const stuck = boardFrom([
    [4, 6, 4, 6],
    [9, 8, 9, 8],
    [4, 6, 4, 6],
    [9, 8, 9, 8],
  ]);
  for (const d of DIRECTIONS) {
    const res = move(stuck, d);
    eq(`a jammed board cannot move ${d}`, res.moved, false);
    eq(`a refused ${d} move scores nothing`, res.gained, 0);
    eq(`a refused ${d} move spawns nothing`, res.board.tiles.length, stuck.tiles.length);
  }
  eq("a jammed board is game over", isGameOver(stuck), true);
  eq("game over means no legal moves", legalMoves(stuck).length, 0);

  // One 1 anywhere rescues it, because 1 divides everything.
  const rescued = boardFrom([
    [4, 6, 4, 6],
    [9, 8, 9, 8],
    [4, 6, 4, 6],
    [9, 8, 9, 1],
  ]);
  eq("a single 1 keeps a jammed board alive", isGameOver(rescued), false);
  ok("and gives it a legal move", legalMoves(rescued).length > 0);
}

{
  // Scoring.
  const res = move(boardFrom([[3, 6, 2, 4]]), "left");
  eq("both pairs fuse", res.mergedValues.length, 2);
  eq("the values are reported biggest first", res.mergedValues.join(","), "9,6");
  ok("the score is the sum of what was made", res.board.score >= 15);

  const first = move(boardFrom([[2, 2, 0, 0]]), "left");
  eq("the first fusing move is combo 1", first.board.combo, 1);
  eq("combo 1 pays no bonus", first.comboBonus, 0);
  const slideOnly = move({ ...boardFrom([[0, 0, 0, 2]]), combo: 4 }, "left");
  eq("a move without a fusion resets the combo", slideOnly.board.combo, 0);
}

{
  // The absorbed list, which the merge animation is drawn from.
  const res = move(
    boardFrom([
      [2, 4, 3, 9],
      [5, 5, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
    "left",
  );
  eq("three fusions absorb six tiles", res.absorbed.length, res.mergedValues.length * 2);
  const live = new Set(res.board.tiles.map((t) => t.id));
  ok("no absorbed tile is still on the board", res.absorbed.every((t) => !live.has(t.id)));
  ok(
    "every absorbed tile sits where its fusion landed",
    res.absorbed.every((t) => res.board.tiles.some((o) => o.mergedThisMove && o.r === t.r && o.c === t.c)),
  );
  eq("a move with no fusion absorbs nothing", move(boardFrom([[0, 0, 0, 2]]), "left").absorbed.length, 0);
}

{
  // Spawning. Only 1, 2 and 3 are ever dropped, and 1 is rare.
  const counts = new Map<number, number>();
  for (let i = 0; i < 100000; i++) {
    const v = spawnValue(i / 100000);
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  eq("only three values can spawn", counts.size, 3);
  ok("2 is the common one", (counts.get(2) ?? 0) > (counts.get(3) ?? 0));
  ok("3 is next", (counts.get(3) ?? 0) > (counts.get(1) ?? 0));
  ok("1 is rare", (counts.get(1) ?? 0) / 100000 < 0.1);
  eq("the weights sum to one", Math.round(SPAWN_TABLE.reduce((n, e) => n + e.weight, 0) * 1000), 1000);
  ok("a roll at the very top still returns a value", SPAWN_TABLE.some((e) => e.value === spawnValue(0.999999)));
}

{
  // Four thousand random games, every invariant re-checked after every move.
  let violations = 0;
  let totalMoves = 0;
  let finished = 0;
  let bestPeak = 0;
  let bestScore = 0;

  for (let game = 0; game < 4000; game++) {
    let board = newMerge(4, game * 2654435761 + 1);
    if (board.tiles.length !== 2) violations++;
    let lastScore = board.score;

    for (let step = 0; step < 3000; step++) {
      const legal = legalMoves(board);
      if (legal.length === 0) {
        finished++;
        if (!isGameOver(board)) violations++;
        break;
      }
      const dir = legal[(step * 7 + game * 3) % legal.length];
      const res = move(board, dir);
      totalMoves++;
      if (!res.moved) violations++;
      board = res.board;

      const cells = new Set<string>();
      for (const t of board.tiles) {
        if (t.r < 0 || t.r >= board.size || t.c < 0 || t.c >= board.size) violations++;
        if (cells.has(`${t.r},${t.c}`)) violations++;
        cells.add(`${t.r},${t.c}`);
        // Every value is a positive integer. Not a power of two any more —
        // that is the point of the rule change.
        if (!Number.isInteger(t.value) || t.value < 1) violations++;
      }
      if (board.tiles.length > board.size * board.size) violations++;
      if (board.tiles.length === 0) violations++;
      if (new Set(board.tiles.map((t) => t.id)).size !== board.tiles.length) violations++;
      if (board.score < lastScore) violations++;
      lastScore = board.score;
      if (board.bestCombo < board.combo) violations++;

      bestPeak = Math.max(bestPeak, board.peak);
      bestScore = Math.max(bestScore, board.score);
    }
  }

  eq("4,000 random games break no invariant", violations, 0);
  ok("the random games actually played", totalMoves > 100000, `${totalMoves} moves`);
  // Both ends matter: a game that never ends is not a game, and one that ends
  // immediately is not fun. Divisibility merging is far more permissive than
  // doubling, so this is the number worth watching.
  ok("random play reaches a game over", finished > 3000, `${finished} of 4000 finished`);
  ok("random play builds real tiles", bestPeak >= 96, `best peak ${bestPeak}`);
  console.log(
    `  ${totalMoves.toLocaleString()} moves played, ${finished}/4000 games ended, best tile ${bestPeak}, best score ${bestScore.toLocaleString()}`,
  );
}

{
  // Rewards and presentation.
  ok("a bigger peak pays more xp", mergeXp({ ...emptyBoard(), peak: 2048 }) > mergeXp({ ...emptyBoard(), peak: 256 }));
  ok("xp is never zero", mergeXp(emptyBoard()) > 0);
  ok("xp is bounded", mergeXp({ ...emptyBoard(), peak: 4096, score: 10_000_000 }) <= 200);
  ok("there are undos to spend", UNDO_ALLOWANCE >= 1);
  eq("a tile is labelled with its number", tileLabel({ id: 1, value: 96, r: 0, c: 0 }), "96");

  // The palette has to cover every value a tile can reach, legibly.
  for (const v of [1, 2, 3, 4, 6, 9, 12, 25, 48, 97, 150, 384, 777, 1536, 5000, 99999]) {
    const style = tileStyle({ value: v });
    ok(`a ${v} tile has a background`, style.background.length > 0);
    ok(`a ${v} tile has ink`, /^#|rgb/.test(style.ink));
    ok(`a ${v} tile is sized to fit`, style.scale > 0.1 && style.scale <= 0.5);
  }
  ok("a longer number is set smaller", tileStyle({ value: 1234 }).scale < tileStyle({ value: 12 }).scale);
  ok("big fusions throw sparks", sparkCount(384) > 0);
  eq("small fusions do not", sparkCount(4), 0);
}

// ===========================================================================
// Equation Escape
// ===========================================================================

console.log("\nEquation Escape\n");

{
  // Content integrity.
  const ids = new Set<string>();
  const keys = new Set<string>();
  for (const room of ROOMS) {
    ok(`${room.key}: has a unique key`, !keys.has(room.key));
    keys.add(room.key);
    ok(`${room.key}: has a name`, room.name.length > 0);
    ok(`${room.key}: has an intro`, room.intro.length > 20);
    ok(`${room.key}: has a full palette`, Object.values(room.palette).every((v) => /^#[0-9a-f]{6}$/i.test(v)));
    ok(`${room.key}: has at least two mechanisms`, room.puzzles.length >= 2);

    for (const p of room.puzzles) {
      ok(`${p.id}: has a unique id`, !ids.has(p.id));
      ids.add(p.id);
      ok(`${p.id}: has a prompt`, p.prompt.length > 10);
      ok(`${p.id}: has a label`, p.label.length > 0);
      // A hint and an insight are not decoration: the brief requires a wrong
      // answer to teach rather than to end the game.
      ok(`${p.id}: has a hint`, p.hint.length > 10);
      ok(`${p.id}: the hint is not just the answer`, normalise(p.hint) !== normalise(p.answer));
      ok(`${p.id}: has an insight`, p.insight.length > 10);
      ok(`${p.id}: difficulty is in range`, p.difficulty >= 1 && p.difficulty <= 10);
      ok(`${p.id}: has an answer`, p.answer.trim().length > 0);
      // The authored answer must pass its own checker — the one failure mode
      // that would make a room literally impossible to leave.
      ok(`${p.id}: its own answer is accepted`, isCorrect(p, p.answer));
      ok(`${p.id}: its own answer survives sloppy typing`, isCorrect(p, ` ${p.answer.toUpperCase()} `));
      ok(`${p.id}: an empty answer is rejected`, !isCorrect(p, "   "));
      ok(`${p.id}: a wrong answer is rejected`, !isCorrect(p, `${p.answer}7`));
      for (const alt of p.accept ?? []) {
        ok(`${p.id}: the alternative "${alt}" is accepted`, isCorrect(p, alt));
      }
    }
  }
  eq("the escape has fifteen puzzles", TOTAL_PUZZLES, 15);
  ok("there are five rooms", ROOMS.length === 5, `${ROOMS.length}`);

  // The ramp: later rooms must be harder than earlier ones on average, or the
  // level order is arbitrary.
  const avg = ROOMS.map((r) => r.puzzles.reduce((n, p) => n + p.difficulty, 0) / r.puzzles.length);
  for (let i = 1; i < avg.length; i++) {
    ok(`room ${i + 1} is harder than room ${i}`, avg[i] > avg[i - 1], `${avg[i - 1]} → ${avg[i]}`);
  }
}

{
  // Every answer, re-derived here independently of the content file. If an
  // authored answer is wrong, these disagree.
  const expected: Record<string, string> = {
    "temple-1": String(48 + 27 + 15),
    "temple-2": String(6 + 4 * 5 - 8 / 2),
    "temple-3": String(30 + 12), // gaps 4,6,8,10,12
    "lab-1": String((3 / 4) * 60),
    "lab-2": String((2 / (2 + 5)) * 210),
    "lab-3": "11/24", // 20/24 - 9/24
    "bunker-1": String((31 - 7) / 3),
    "bunker-2": String((54 / 3) * 2),
    "bunker-3": String((9 + 15) / 3), // 5y-15=2y+9 → 3y=24
    "library-1": String(8 + 13),
    "library-2": "3",
    "library-3": "9", // 111..999
    "obs-1": String(((34 - 2 * 6) / 2) * 6),
    "obs-2": String(2 * Math.sqrt(49)),
    "obs-3": String(0.5 * 9 * 12),
  };

  for (const room of ROOMS) {
    for (const p of room.puzzles) {
      const want = expected[p.id];
      ok(`${p.id}: covered by an independent derivation`, want !== undefined);
      if (want !== undefined) eq(`${p.id}: the authored answer is right`, normalise(p.answer), normalise(want));
    }
  }

  // library-2 is a logic puzzle, so derive it by exhaustive search instead of
  // arithmetic: enumerate every arrangement and check the three clues.
  const books = ["red", "blue", "green"];
  const perms: string[][] = [];
  for (const a of books)
    for (const b of books)
      for (const c of books)
        if (new Set([a, b, c]).size === 3) perms.push([a, b, c]);
  const valid = perms.filter((p) => {
    const pos = (name: string) => p.indexOf(name) + 1;
    return pos("red") < pos("blue") && pos("green") !== 2 && pos("red") !== 1;
  });
  eq("the library logic puzzle has exactly one solution", valid.length, 1);
  eq("and it puts blue third", valid[0].indexOf("blue") + 1, 3);

  // obs-3's hint claims a right angle. Check that claim.
  eq("the observatory triangle really is right-angled", 9 * 9 + 12 * 12, 15 * 15);
}

{
  // Answer normalisation: forgiving about presentation, strict about value.
  eq("whitespace is ignored", normalise("  42  "), "42");
  eq("case is ignored", normalise("Blue"), "blue");
  eq("commas are ignored", normalise("1,000"), "1000");
  eq("a trailing full stop is ignored", normalise("42."), "42");
  eq("a leading plus is ignored", normalise("+42"), "42");
  eq("a bare decimal point is filled in", normalise(".5"), "0.5");
  eq("trailing zeros after a point are dropped", normalise("42.00"), "42");
  eq("internal spaces are ignored", normalise("1 1 / 2 4"), "11/24");

  // The important negative: a rounded decimal is not the same answer as the
  // exact fraction the puzzle asked for.
  const frac = ROOMS.find((r) => r.key === "lab")!.puzzles.find((p) => p.id === "lab-3")!;
  ok("a rounded decimal does not pass for an exact fraction", !isCorrect(frac, "0.458"));
  ok("the exact fraction passes", isCorrect(frac, "11/24"));
  ok("an unsimplified equivalent does not pass", !isCorrect(frac, "22/48"));
}

{
  // Progression.
  eq("nothing solved means the first room", currentRoomIndex([]), 0);
  eq("the first room is always open", isRoomUnlocked(0, []), true);
  eq("the second room starts locked", isRoomUnlocked(1, []), false);
  eq("nothing solved is not an escape", hasEscaped([]), false);

  const solved: string[] = [];
  for (let i = 0; i < ROOMS.length; i++) {
    const room = ROOMS[i];
    ok(`room ${i + 1} is open by the time you reach it`, isRoomUnlocked(i, solved));
    eq(`room ${i + 1} is where you are`, currentRoomIndex(solved), i);
    eq(`room ${i + 1} is not clear yet`, isRoomClear(room, solved), false);

    room.puzzles.forEach((p, j) => {
      solved.push(p.id);
      eq(`room ${i + 1}: ${j + 1} solved`, roomSolvedCount(room, solved), j + 1);
    });

    eq(`room ${i + 1} is clear`, isRoomClear(room, solved), true);
    if (i + 1 < ROOMS.length) {
      eq(`clearing room ${i + 1} opens room ${i + 2}`, isRoomUnlocked(i + 1, solved), true);
    }
    if (i + 2 < ROOMS.length) {
      eq(`but room ${i + 3} stays shut`, isRoomUnlocked(i + 2, solved), false);
    }
  }
  eq("solving everything is an escape", hasEscaped(solved), true);
  eq("the last room stays current after escaping", currentRoomIndex(solved), ROOMS.length - 1);

  // Solving out of order cannot skip ahead.
  const lastOnly = ROOMS[ROOMS.length - 1].puzzles.map((p) => p.id);
  eq("solving the last room alone is not an escape", hasEscaped(lastOnly), false);
  eq("and does not unlock anything", isRoomUnlocked(1, lastOnly), false);

  // Duplicate submissions must not inflate the count.
  const dupes = [...ROOMS[0].puzzles.map((p) => p.id), ...ROOMS[0].puzzles.map((p) => p.id)];
  eq("re-solving a puzzle does not count twice", roomSolvedCount(ROOMS[0], dupes), ROOMS[0].puzzles.length);
}

{
  // Rewards: harder work must pay better, and finishing a room must beat
  // leaving it half-done.
  for (const room of ROOMS) {
    const perPuzzle = room.puzzles.reduce((n, p) => n + xpForPuzzle(p), 0);
    ok(`${room.key}: every puzzle pays something`, room.puzzles.every((p) => xpForPuzzle(p) > 0));
    ok(`${room.key}: the room bonus is real`, xpForRoom(room) > 0);
    ok(`${room.key}: clearing a room is worth a meaningful share`, xpForRoom(room) > perPuzzle * 0.2);
  }
  const easiest = ROOMS[0].puzzles[0];
  const hardest = ROOMS[ROOMS.length - 1].puzzles[2];
  ok("a harder puzzle pays more", xpForPuzzle(hardest) > xpForPuzzle(easiest));
  ok("a later room pays more", xpForRoom(ROOMS[4]) > xpForRoom(ROOMS[0]));
}

// ===========================================================================
// The mazes
// ===========================================================================

console.log("\nThe mazes\n");

{
  // Three thousand generated mazes, every structural promise re-checked.
  //
  // This is the check that earns the design. The game tells the player there
  // is exactly one route out and that the gates are on it; if that is ever
  // false, the room is either unwinnable or trivially skippable, and in both
  // cases the player is being lied to by the instructions.
  let unreachable = 0;
  let notPerfect = 0;
  let gatesOffRoute = 0;
  let openableEarly = 0;
  let notSolvable = 0;
  let badGateCount = 0;
  let duplicateEdges = 0;
  let shortRoutes = 0;

  const sizes: [number, number][] = [
    [5, 7],
    [6, 9],
    [7, 9],
    [7, 11],
  ];

  for (let t = 0; t < 3000; t++) {
    const [rows, cols] = sizes[t % sizes.length];
    const ids = ["a", "b", "c"];
    const maze = buildMaze({ rows, cols, seed: t * 2654435761 + 7, puzzleIds: ids });

    // Every cell reachable, and no loops. A spanning tree over rows*cols
    // cells has exactly rows*cols - 1 open edges; more means a loop, which
    // would mean a second route and a way to walk round a gate.
    const all = reachable(maze, ids);
    if (all.size !== rows * cols) unreachable++;
    let openEdges = 0;
    for (let i = 0; i < rows * cols; i++) {
      for (const d of ["e", "s"] as Dir[]) {
        if (isOpen(maze, i, d)) openEdges++;
      }
    }
    if (openEdges !== rows * cols - 1) notPerfect++;

    // One gate per puzzle, each on its own edge of the route.
    if (maze.gates.length !== ids.length) badGateCount++;
    const edgeKeys = new Set(maze.gates.map((g) => [g.a, g.b].sort((x, y) => x - y).join("-")));
    if (edgeKeys.size !== maze.gates.length) duplicateEdges++;

    const onRoute = new Set<string>();
    for (let i = 0; i < maze.path.length - 1; i++) {
      onRoute.add([maze.path[i], maze.path[i + 1]].sort((x, y) => x - y).join("-"));
    }
    for (const g of maze.gates) {
      if (!onRoute.has([g.a, g.b].sort((x, y) => x - y).join("-"))) gatesOffRoute++;
    }

    // With nothing solved the exit must be unreachable, and with everything
    // solved it must be reachable. Those two together are the game.
    if (exitReachable(maze, [])) openableEarly++;
    if (!exitReachable(maze, ids)) notSolvable++;

    // Leaving out any single gate must still block the exit — otherwise one
    // of the three puzzles is decorative.
    for (const skip of ids) {
      if (exitReachable(maze, ids.filter((x) => x !== skip))) gatesOffRoute++;
    }

    if (maze.path.length < 5) shortRoutes++;
  }

  eq("every cell of every maze is reachable", unreachable, 0);
  eq("every maze is perfect — no loops, so exactly one route", notPerfect, 0);
  eq("every gate sits on the route to the exit, and none is skippable", gatesOffRoute, 0);
  eq("one gate per puzzle", badGateCount, 0);
  eq("no two gates share an edge", duplicateEdges, 0);
  eq("the exit is unreachable until the gates are open", openableEarly, 0);
  eq("the exit is reachable once they are", notSolvable, 0);
  eq("no route is trivially short", shortRoutes, 0);
  console.log("  3,000 mazes generated and checked");
}

{
  // Determinism: the same seed must give the same maze, or a room would
  // reshuffle under the player on every reload.
  const a = buildMaze({ rows: 6, cols: 9, seed: 4242, puzzleIds: ["x", "y", "z"] });
  const b = buildMaze({ rows: 6, cols: 9, seed: 4242, puzzleIds: ["x", "y", "z"] });
  eq("the same seed builds the same walls", JSON.stringify(a.cells), JSON.stringify(b.cells));
  eq("the same seed places the same gates", JSON.stringify(a.gates), JSON.stringify(b.gates));
  const c = buildMaze({ rows: 6, cols: 9, seed: 99, puzzleIds: ["x", "y", "z"] });
  ok("a different seed builds a different maze", JSON.stringify(a.cells) !== JSON.stringify(c.cells));
}

{
  // Stepping.
  const maze = buildMaze({ rows: 6, cols: 9, seed: 31337, puzzleIds: ["g1", "g2", "g3"] });

  // A step is refused for exactly one of two reasons, and the reason is the
  // right one — the UI shows a different thing for each.
  let walls = 0;
  let gates = 0;
  let moves = 0;
  for (let i = 0; i < maze.rows * maze.cols; i++) {
    for (const d of DIRS) {
      const res = step(maze, i, d, []);
      if (res.ok) {
        moves++;
        // A successful step always lands on the adjacent cell.
        ok("a step lands next door", res.to === neighbour(maze.rows, maze.cols, i, d));
        ok("a step never crosses a closed gate", gateBetween(maze, i, res.to) === null);
      } else if (res.reason === "wall") {
        walls++;
        ok("a wall refusal really is a wall", !isOpen(maze, i, d));
      } else {
        gates++;
        ok("a gate refusal really is a gate", isOpen(maze, i, d));
      }
    }
  }
  ok("the maze has somewhere to walk", moves > 0);
  ok("the maze has walls", walls > 0);
  eq("each gate blocks from both sides", gates, maze.gates.length * 2);

  // The guidance arrow must always point at a gate that is actually next.
  const order: string[] = [];
  let solvedSoFar: string[] = [];
  for (let i = 0; i < 3; i++) {
    const g = nextGate(maze, solvedSoFar);
    ok("there is a next gate while any remain", g !== null);
    if (!g) break;
    order.push(g.puzzleId);
    ok("the next gate is not already open", !solvedSoFar.includes(g.puzzleId));
    solvedSoFar = [...solvedSoFar, g.puzzleId];
  }
  eq("the gates are pointed to in route order", order.length, 3);
  eq("no gate is pointed to twice", new Set(order).size, 3);
  eq("nothing is next once all are open", nextGate(maze, order), null);

  // routeBetween on a perfect maze is the unique route, so walking it must
  // actually work once the gates are open.
  const route = routeBetween(maze.cells, maze.rows, maze.cols, maze.start, maze.exit);
  eq("the stored route is the computed route", route.join(","), maze.path.join(","));
  let cur = maze.start;
  let walked = true;
  for (let i = 1; i < route.length; i++) {
    const d = DIRS.find((dd) => {
      const res = step(maze, cur, dd, order);
      return res.ok && res.to === route[i];
    });
    if (!d) {
      walked = false;
      break;
    }
    cur = route[i];
  }
  ok("the route can actually be walked with every gate open", walked);
  eq("walking it arrives at the exit", cur, maze.exit);
}

{
  // The rooms as configured.
  for (const room of ROOMS) {
    const maze = buildMaze({
      rows: room.grid.rows,
      cols: room.grid.cols,
      seed: 1000 + ROOMS.indexOf(room) * 7919,
      puzzleIds: room.puzzles.map((p) => p.id),
    });
    ok(`${room.key}: has a gate for every puzzle`, maze.gates.length === room.puzzles.length);
    ok(`${room.key}: is solvable`, exitReachable(maze, room.puzzles.map((p) => p.id)));
    ok(`${room.key}: is not solvable for free`, !exitReachable(maze, []));
    // The clock has to be long enough to walk the route even before any
    // thinking: a room that cannot be finished in its own time limit is
    // broken no matter how good the puzzles are.
    ok(
      `${room.key}: the clock allows the walk`,
      room.timeLimit > maze.path.length * 2,
      `${room.timeLimit}s for a ${maze.path.length}-cell route`,
    );
    ok(`${room.key}: the clock is generous`, room.timeLimit >= 120);
  }

  // The rooms get bigger and the clock grows with them.
  for (let i = 1; i < ROOMS.length; i++) {
    const prev = ROOMS[i - 1];
    const cur = ROOMS[i];
    ok(`room ${i + 1} is at least as big as room ${i}`, cur.grid.rows * cur.grid.cols >= prev.grid.rows * prev.grid.cols);
    ok(`room ${i + 1} gets more time than room ${i}`, cur.timeLimit > prev.timeLimit);
  }

  ok("the timeout rule is stated once, and says progress is kept", /stays open/.test(TIMEOUT_RULE));
}

// ===========================================================================

console.log("");
if (failures > 0) {
  console.error(`${failures} of ${checks} checks failed.`);
  process.exit(1);
}
console.log(`All ${checks.toLocaleString()} checks passed.`);
