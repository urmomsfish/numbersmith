/**
 * The mazes of Equation Escape.
 *
 * Pure and deterministic: the same seed always builds the same maze, so a
 * room looks identical on every reload and a player who learns its shape
 * keeps that knowledge. No React, no DOM — scripts/check-games.ts builds
 * thousands of these and proves every one is solvable.
 *
 * WHY A PERFECT MAZE. The generator produces a *perfect* maze: every cell is
 * reachable and there are no loops, which means there is exactly one route
 * between any two cells. That single property is what makes the game's goal
 * honest. Drop the locked gates onto the one route from the entrance to the
 * exit and the player cannot stumble past them, cannot find a back way round,
 * and never has to wonder whether they have missed a corridor. "Get to the
 * door; three gates are in the way" is then literally true rather than a
 * rule the game has to enforce with extra machinery.
 */

export type Dir = "n" | "e" | "s" | "w";

/** True means there is a wall on that side. */
export type Walls = Record<Dir, boolean>;

export type Gate = {
  /** The two cells the gate sits between. */
  a: number;
  b: number;
  /** The puzzle that opens it. */
  puzzleId: string;
};

export type Maze = {
  rows: number;
  cols: number;
  /** Row-major, indexed `r * cols + c`. */
  cells: Walls[];
  start: number;
  exit: number;
  gates: Gate[];
  /** The one route from start to exit, as cell indices. */
  path: number[];
};

export const DIRS: Dir[] = ["n", "e", "s", "w"];

const OPPOSITE: Record<Dir, Dir> = { n: "s", s: "n", e: "w", w: "e" };
const DELTA: Record<Dir, [number, number]> = { n: [-1, 0], s: [1, 0], e: [0, 1], w: [0, -1] };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const idx = (cols: number, r: number, c: number) => r * cols + c;
export const rowOf = (cols: number, i: number) => Math.floor(i / cols);
export const colOf = (cols: number, i: number) => i % cols;

/** The cell one step in `dir`, or null if that would leave the grid. */
export function neighbour(rows: number, cols: number, i: number, dir: Dir): number | null {
  const [dr, dc] = DELTA[dir];
  const r = rowOf(cols, i) + dr;
  const c = colOf(cols, i) + dc;
  if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
  return idx(cols, r, c);
}

// ---------------------------------------------------------------------------
// Building
// ---------------------------------------------------------------------------

/**
 * Carves a perfect maze with a randomised depth-first search.
 *
 * Depth-first rather than Prim's or Kruskal's because it produces long
 * winding corridors with few junctions, which is what makes a small grid feel
 * like somewhere to explore. Prim's tends to produce a bushy maze full of
 * short dead ends, where the exit is usually a few steps away.
 */
function carve(rows: number, cols: number, rand: () => number): Walls[] {
  const cells: Walls[] = Array.from({ length: rows * cols }, () => ({
    n: true,
    e: true,
    s: true,
    w: true,
  }));
  const seen = new Array(rows * cols).fill(false);
  const stack: number[] = [0];
  seen[0] = true;

  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    const options: Dir[] = [];
    for (const d of DIRS) {
      const n = neighbour(rows, cols, cur, d);
      if (n !== null && !seen[n]) options.push(d);
    }
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const d = options[Math.floor(rand() * options.length) % options.length];
    const n = neighbour(rows, cols, cur, d)!;
    cells[cur][d] = false;
    cells[n][OPPOSITE[d]] = false;
    seen[n] = true;
    stack.push(n);
  }
  return cells;
}

/** Can you step from `i` in `dir` at all, ignoring gates? */
export function isOpen(maze: Maze, i: number, dir: Dir): boolean {
  if (maze.cells[i][dir]) return false;
  return neighbour(maze.rows, maze.cols, i, dir) !== null;
}

/** The unique route between two cells of a perfect maze. */
export function routeBetween(
  cells: Walls[],
  rows: number,
  cols: number,
  from: number,
  to: number,
): number[] {
  const prev = new Map<number, number>();
  const queue = [from];
  const seen = new Set([from]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === to) break;
    for (const d of DIRS) {
      if (cells[cur][d]) continue;
      const n = neighbour(rows, cols, cur, d);
      if (n === null || seen.has(n)) continue;
      seen.add(n);
      prev.set(n, cur);
      queue.push(n);
    }
  }

  if (to !== from && !prev.has(to)) return [];
  const out = [to];
  let cur = to;
  while (cur !== from) {
    cur = prev.get(cur)!;
    out.push(cur);
  }
  return out.reverse();
}

/**
 * Builds a room's maze and puts one gate on the route per puzzle.
 *
 * The gates are spread evenly along the route rather than bunched, so the
 * player walks a stretch of maze between each one instead of meeting all
 * three in the first corridor.
 */
export function buildMaze(opts: {
  rows: number;
  cols: number;
  seed: number;
  puzzleIds: string[];
}): Maze {
  const { rows, cols, puzzleIds } = opts;
  const rand = mulberry32(opts.seed || 1);
  const cells = carve(rows, cols, rand);

  // Opposite corners, so the route is as long as the grid allows.
  const start = idx(cols, rows - 1, 0);
  const exit = idx(cols, 0, cols - 1);
  const path = routeBetween(cells, rows, cols, start, exit);

  const edges = path.length - 1;
  const gates: Gate[] = [];
  const used = new Set<number>();
  puzzleIds.forEach((puzzleId, i) => {
    let at = Math.floor((edges * (i + 1)) / (puzzleIds.length + 1));
    // Two gates on the same edge would make one of them unreachable, so nudge
    // along until a free edge is found.
    while (used.has(at) && at < edges) at++;
    while (used.has(at) && at > 0) at--;
    used.add(at);
    gates.push({ a: path[at], b: path[at + 1], puzzleId });
  });

  return { rows, cols, cells, start, exit, gates, path };
}

// ---------------------------------------------------------------------------
// Moving
// ---------------------------------------------------------------------------

/** The gate between two adjacent cells, if there is one. */
export function gateBetween(maze: Maze, a: number, b: number): Gate | null {
  return maze.gates.find((g) => (g.a === a && g.b === b) || (g.a === b && g.b === a)) ?? null;
}

export type Step =
  | { ok: true; to: number }
  | { ok: false; reason: "wall" }
  | { ok: false; reason: "gate"; gate: Gate };

/**
 * Tries to step one cell.
 *
 * A blocked step says *why* it is blocked, because the two reasons mean
 * completely different things to a player: a wall is "not this way", a gate
 * is "this way, once you have solved something".
 */
export function step(maze: Maze, from: number, dir: Dir, solved: readonly string[]): Step {
  if (!isOpen(maze, from, dir)) return { ok: false, reason: "wall" };
  const to = neighbour(maze.rows, maze.cols, from, dir)!;
  const gate = gateBetween(maze, from, to);
  if (gate && !solved.includes(gate.puzzleId)) return { ok: false, reason: "gate", gate };
  return { ok: true, to };
}

/** Every cell reachable from the start given what has been solved so far. */
export function reachable(maze: Maze, solved: readonly string[]): Set<number> {
  const seen = new Set([maze.start]);
  const queue = [maze.start];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const d of DIRS) {
      const res = step(maze, cur, d, solved);
      if (!res.ok || seen.has(res.to)) continue;
      seen.add(res.to);
      queue.push(res.to);
    }
  }
  return seen;
}

/** True once the player could actually walk out. */
export function exitReachable(maze: Maze, solved: readonly string[]): boolean {
  return reachable(maze, solved).has(maze.exit);
}

/**
 * The gate standing between the player and the exit right now.
 *
 * Drives the "what do I do next" line in the HUD. Being told which gate is
 * next is the difference between a maze and a guessing game, and costs
 * nothing: the route is unique, so there is no choice to spoil.
 */
export function nextGate(maze: Maze, solved: readonly string[]): Gate | null {
  for (let i = 0; i < maze.path.length - 1; i++) {
    const gate = gateBetween(maze, maze.path[i], maze.path[i + 1]);
    if (gate && !solved.includes(gate.puzzleId)) return gate;
  }
  return null;
}
