/**
 * Factor Forge — the engine.
 *
 * A sliding-tile puzzle built on divisibility rather than doubling.
 *
 * THE RULE, AND WHY IT IS NOT 2048. Two tiles fuse when **one of them
 * divides the other**, and what they leave behind is their **sum**. So 3 and
 * 6 make 9, 4 and 12 make 16, and 7 and 7 — the case where the rule happens
 * to coincide with 2048 — make 14. Doubling is one corner of this rule
 * rather than the whole of it.
 *
 * That single change moves the thinking from pattern-matching to arithmetic.
 * In 2048 you look for two tiles with the same picture on them; here you have
 * to ask of every adjacent pair whether one goes into the other, and then
 * work out what the sum would be and whether you want it. Tile values stop
 * being powers of two and become ordinary integers, so the board is a set of
 * numbers with factor relationships rather than a ladder of identical steps.
 *
 * The 1 tile is the joker, and it is a joker for a reason rather than by
 * decoration: 1 divides everything, so a 1 will fuse with any neighbour. No
 * separate "wild" concept is needed — the mathematics already supplies one.
 *
 * Everything here is pure functions over an immutable board: no React, no
 * DOM, no clock. `move()` takes a board and a direction and returns a new
 * board. That is what makes the rules checkable — see
 * scripts/check-games.ts, which plays thousands of random games and asserts
 * the invariants hold on every single move.
 *
 * TILES CARRY IDENTITY. The obvious way to model this is a grid of numbers,
 * and it is a trap: the UI then has no way to know that the 9 in this cell is
 * the 3 that slid three squares from the left, so every move has to be
 * redrawn from scratch and the board flickers instead of sliding. Every tile
 * here has a stable `id` and records where it came from, so the renderer can
 * animate real movement.
 */

export type Tile = {
  id: number;
  value: number;
  /** Row and column, both 0-indexed from the top left. */
  r: number;
  c: number;
  /** Where this tile started the move, for the slide animation. */
  from?: { r: number; c: number };
  /** Set on the tile produced by a merge, for the pop animation. */
  mergedThisMove?: boolean;
  /** Set on a tile that appeared this move, for the fade-in. */
  spawnedThisMove?: boolean;
};

export type Board = {
  size: number;
  tiles: Tile[];
  score: number;
  /** Consecutive moves that produced at least one merge. */
  combo: number;
  bestCombo: number;
  moves: number;
  merges: number;
  /** Highest tile value ever reached this game. */
  peak: number;
  nextId: number;
  /** Deterministic PRNG state, so a game can be replayed exactly. */
  seed: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type MoveResult = {
  board: Board;
  moved: boolean;
  /** Points scored by this move, including the combo bonus. */
  gained: number;
  /** Values produced by merges this move, biggest first. */
  mergedValues: number[];
  comboBonus: number;
  /**
   * The tiles consumed by merges, moved to their destination cell.
   *
   * They are not on the board any more — the board holds one tile per cell —
   * but the renderer needs them for one more frame. Their DOM nodes already
   * exist from the previous paint, so handing them back at their destination
   * is what makes a merge look like two tiles converging rather than one
   * blinking out. See the merge animation in the Number Merge board.
   */
  absorbed: Tile[];
};

// ---------------------------------------------------------------------------
// Randomness
// ---------------------------------------------------------------------------

/** A small deterministic PRNG. Carried on the board so a whole game is a pure
 * function of its seed — which is what lets the tests replay a failing game. */
function nextRandom(seed: number): { value: number; seed: number } {
  let s = seed | 0;
  s ^= s << 13;
  s ^= s >>> 17;
  s ^= s << 5;
  s |= 0;
  return { value: ((s >>> 0) % 100000) / 100000, seed: s };
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export const DEFAULT_SIZE = 4;
/** Undos a player gets per game. Few enough that using one is a decision. */
export const UNDO_ALLOWANCE = 3;
/** A merge streak this long or longer starts paying a bonus. */
const COMBO_MIN = 2;

/**
 * Whether two tiles may fuse: one of their values divides the other.
 *
 * Equal values satisfy this trivially (every number divides itself), so the
 * familiar same-meets-same merge still works — it is just no longer the only
 * way through. A 1 divides everything, which is what makes the 1 tile the
 * game's joker without needing a "wild" flag to say so.
 */
export function canFuse(a: number, b: number): boolean {
  if (a <= 0 || b <= 0) return false;
  return a % b === 0 || b % a === 0;
}

/** What two fusing tiles leave behind. */
export function fuseResult(a: number, b: number): number {
  return a + b;
}

/** Points a merge into `value` is worth, before any combo bonus. */
export function mergeScore(value: number): number {
  return value;
}

/** Extra points for keeping a merge streak alive. Grows with the streak but
 * is capped, so a long game cannot run away on multiplier alone. */
export function comboBonus(combo: number, mergedTotal: number): number {
  if (combo < COMBO_MIN) return 0;
  return Math.round(mergedTotal * Math.min(1.5, (combo - 1) * 0.25));
}

/**
 * What a new tile shows, and how often.
 *
 * Only 1, 2 and 3 are ever dropped, and the board is built from them by
 * addition — which is what keeps every value on screen a number with an
 * honest factorisation rather than an arbitrary one. The 1 is rare because it
 * fuses with anything: it is the rescue tile, and a board sprinkled with them
 * has no puzzle left in it.
 */
export const SPAWN_TABLE: { value: number; weight: number }[] = [
  { value: 2, weight: 0.68 },
  { value: 3, weight: 0.26 },
  { value: 1, weight: 0.06 },
];

/**
 * How many tiles drop after a move that changed something.
 *
 * Two, where a doubling game drops one, and the reason is measured rather
 * than guessed. Divisibility is a far more permissive merge rule than "same
 * number meets same number": almost any small tile goes into almost anything,
 * so with a single spawn the board drains as fast as it fills and a game runs
 * for hundreds of moves without ever getting tight. At one spawn per move the
 * verification script measured an average of 738 moves per game and scores
 * over a million — not a difficulty curve, just a long flat corridor. At two
 * it measures 207 moves, and every one of four thousand random games reaches
 * a real game over.
 *
 * The figure the check script prints is the one to tune against; see the
 * random-play block in scripts/check-games.ts.
 */
export const SPAWNS_PER_MOVE = 2;

export function spawnValue(roll: number): number {
  let acc = 0;
  for (const entry of SPAWN_TABLE) {
    acc += entry.weight;
    if (roll < acc) return entry.value;
  }
  return SPAWN_TABLE[0].value;
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

export function emptyBoard(size = DEFAULT_SIZE, seed = Date.now() | 0): Board {
  return {
    size,
    tiles: [],
    score: 0,
    combo: 0,
    bestCombo: 0,
    moves: 0,
    merges: 0,
    peak: 0,
    nextId: 1,
    seed: seed === 0 ? 1 : seed,
  };
}

export function occupied(board: Board): Set<string> {
  return new Set(board.tiles.map((t) => `${t.r},${t.c}`));
}

export function freeCells(board: Board): { r: number; c: number }[] {
  const taken = occupied(board);
  const out: { r: number; c: number }[] = [];
  for (let r = 0; r < board.size; r++) {
    for (let c = 0; c < board.size; c++) {
      if (!taken.has(`${r},${c}`)) out.push({ r, c });
    }
  }
  return out;
}

/** Drops one new tile on a free cell. Returns the board unchanged when the
 * board is full — the caller decides whether that is game over. */
export function spawn(board: Board): Board {
  const free = freeCells(board);
  if (free.length === 0) return board;

  const r1 = nextRandom(board.seed);
  let seed = r1.seed;
  const cell = free[Math.floor(r1.value * free.length) % free.length];

  const r2 = nextRandom(seed);
  seed = r2.seed;
  const value = spawnValue(r2.value);

  return {
    ...board,
    seed,
    nextId: board.nextId + 1,
    tiles: [
      ...board.tiles,
      {
        id: board.nextId,
        value,
        r: cell.r,
        c: cell.c,
        spawnedThisMove: true,
      },
    ],
  };
}

/** Drops several tiles. Stops early if the board runs out of room. */
export function spawnMany(board: Board, count: number): Board {
  let out = board;
  for (let i = 0; i < count; i++) out = spawn(out);
  return out;
}

export function newGame(size = DEFAULT_SIZE, seed = Date.now() | 0): Board {
  return spawn(spawn(emptyBoard(size, seed)));
}

// ---------------------------------------------------------------------------
// Moving
// ---------------------------------------------------------------------------

/** The order to walk a line in, for a given direction. */
function lineFor(board: Board, dir: Direction, index: number): { r: number; c: number }[] {
  const n = board.size;
  const cells: { r: number; c: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (dir === "left") cells.push({ r: index, c: i });
    else if (dir === "right") cells.push({ r: index, c: n - 1 - i });
    else if (dir === "up") cells.push({ r: i, c: index });
    else cells.push({ r: n - 1 - i, c: index });
  }
  return cells;
}

/**
 * Slides and merges the board one step.
 *
 * The classic rule set: each tile travels as far as it can, a tile may merge
 * at most once per move, and merges resolve from the leading edge backwards
 * so that 2·2·4 moving left becomes 4·4 and not 8.
 */
export function move(board: Board, dir: Direction): MoveResult {
  const n = board.size;
  const byCell = new Map<string, Tile>();
  for (const t of board.tiles) byCell.set(`${t.r},${t.c}`, t);

  const out: Tile[] = [];
  const absorbed: Tile[] = [];
  let moved = false;
  let gained = 0;
  const mergedValues: number[] = [];
  let nextId = board.nextId;

  for (let index = 0; index < n; index++) {
    const cells = lineFor(board, dir, index);
    // The tiles in this line, in travel order.
    const line = cells.map((p) => byCell.get(`${p.r},${p.c}`)).filter((t): t is Tile => !!t);

    let target = 0;
    let i = 0;
    while (i < line.length) {
      const a = line[i];
      const b = line[i + 1];
      const canMerge = !!b && canFuse(a.value, b.value);

      const dest = cells[target];

      if (canMerge && b) {
        const value = fuseResult(a.value, b.value);

        out.push({
          id: nextId++,
          value,
          r: dest.r,
          c: dest.c,
          from: { r: a.r, c: a.c },
          mergedThisMove: true,
        });
        // Both partners travel to the destination and are then dropped. They
        // are handed back as `absorbed` rather than left on the board, so the
        // board keeps its one-tile-per-cell invariant while the renderer still
        // gets to show them arriving.
        absorbed.push(
          { id: a.id, value: a.value, r: dest.r, c: dest.c, from: { r: a.r, c: a.c } },
          { id: b.id, value: b.value, r: dest.r, c: dest.c, from: { r: b.r, c: b.c } },
        );
        gained += mergeScore(value);
        mergedValues.push(value);
        // A merge always counts as a move, even when neither partner changed
        // cell — two tiles became one, so the board is not what it was.
        moved = true;
        i += 2;
      } else {
        out.push({
          id: a.id,
          value: a.value,
          r: dest.r,
          c: dest.c,
          from: { r: a.r, c: a.c },
        });
        if (a.r !== dest.r || a.c !== dest.c) moved = true;
        i += 1;
      }
      target++;
    }
  }

  if (!moved) {
    return { board, moved: false, gained: 0, mergedValues: [], comboBonus: 0, absorbed: [] };
  }

  const didMerge = mergedValues.length > 0;
  const combo = didMerge ? board.combo + 1 : 0;
  const bonus = didMerge ? comboBonus(combo, gained) : 0;

  const after: Board = {
    ...board,
    tiles: out.map((t) => ({ ...t, spawnedThisMove: false })),
    score: board.score + gained + bonus,
    combo,
    bestCombo: Math.max(board.bestCombo, combo),
    moves: board.moves + 1,
    merges: board.merges + mergedValues.length,
    // The peak is read off the board rather than off the merge list, so it
    // means "the biggest tile that has ever existed" even in a game whose
    // biggest tile arrived as a spawn.
    peak: Math.max(board.peak, ...out.map((t) => t.value), 0),
    nextId,
  };

  return {
    // `spawn` is a no-op on a full board, so asking for more than there is
    // room for is safe.
    board: spawnMany(after, SPAWNS_PER_MOVE),
    moved: true,
    gained: gained + bonus,
    mergedValues: [...mergedValues].sort((x, y) => y - x),
    comboBonus: bonus,
    absorbed,
  };
}

// ---------------------------------------------------------------------------
// Ending
// ---------------------------------------------------------------------------

/** True when no direction would change anything. */
export function isGameOver(board: Board): boolean {
  if (freeCells(board).length > 0) return false;
  const dirs: Direction[] = ["up", "down", "left", "right"];
  return dirs.every((d) => !move(board, d).moved);
}

export const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

/** Legal moves from here. Used by the UI to grey out nothing, and by the
 * tests to drive random play. */
export function legalMoves(board: Board): Direction[] {
  return DIRECTIONS.filter((d) => move(board, d).moved);
}

// ---------------------------------------------------------------------------
// Scoring the run
// ---------------------------------------------------------------------------

/** XP paid for a finished game. Tied to the peak tile rather than the raw
 * score so a long grinding game is not worth more than a sharp one. */
/**
 * Milestones worth reaching, in tile value.
 *
 * Highly composite numbers rather than powers of two — 120 is 2³·3·5 and 720
 * is 6!, and both are reachable here in a dozen different ways, which is the
 * point of a game about factors. Calibrated against the verification script:
 * four thousand games of *random* play top out around 950, so 720 is a real
 * target for someone playing well and 120 is a decent afternoon.
 */
export const MILESTONES = [60, 120, 360, 720] as const;

export function xpForGame(board: Board): number {
  const peakBonus =
    board.peak >= 720 ? 120 : board.peak >= 360 ? 70 : board.peak >= 120 ? 40 : board.peak >= 60 ? 20 : 8;
  return peakBonus + Math.min(60, Math.floor(board.score / 400));
}

/** The label shown on a tile. */
export function tileLabel(t: Tile): string {
  return String(t.value);
}
