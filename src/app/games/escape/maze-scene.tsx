"use client";

import type { Room } from "@/lib/games/escape";
import { colOf, gateBetween, reachable, rowOf, type Gate, type Maze } from "@/lib/games/maze";

/**
 * The maze, drawn.
 *
 * Top-down rather than the side-on scene this replaced, because the player
 * now has a position and needs to see where they are, where the walls are,
 * and where the exit is — none of which a perspective view of one wall can
 * show.
 *
 * READABILITY IS THE WHOLE JOB HERE. A maze that is merely accurate is not
 * enough; a player must be able to answer "where do I go" at a glance. So:
 * the exit is marked and labelled from the first frame, corridors the player
 * can currently reach are lit while the rest stays dim, gates are drawn as
 * solid barred doors in the corridor they block with their number on them,
 * and the one gate that is next is ringed. Nothing here is a surprise to be
 * discovered — the difficulty is meant to be the arithmetic.
 */

const CELL = 46;
const PAD = 14;

export function MazeScene({
  room,
  maze,
  at,
  solved,
  activeGate,
  nextGateId,
  onGateClick,
}: {
  room: Room;
  maze: Maze;
  /** The cell the player is standing in. */
  at: number;
  solved: readonly string[];
  /** The gate whose puzzle is open, if any. */
  activeGate: string | null;
  /** The next gate on the route out. */
  nextGateId: string | null;
  onGateClick: (gate: Gate) => void;
}) {
  const { rows, cols } = maze;
  const w = cols * CELL + PAD * 2;
  const h = rows * CELL + PAD * 2;
  const { floor, glow, accent } = room.palette;

  const lit = reachable(maze, solved);
  const x = (c: number) => PAD + c * CELL;
  const y = (r: number) => PAD + r * CELL;

  const atR = rowOf(cols, at);
  const atC = colOf(cols, at);
  const exitR = rowOf(cols, maze.exit);
  const exitC = colOf(cols, maze.exit);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      // Capped, not full-bleed. Left to fill the column the maze rendered
      // around 100px per cell, which pushed the player's own corner of a
      // five-row room below the fold — the one thing that must always be on
      // screen.
      className="mx-auto h-auto w-full max-w-[30rem] select-none"
      style={{ aspectRatio: `${w} / ${h}` }}
      role="img"
      aria-label={`Maze of ${room.name}. You are in row ${atR + 1}, column ${atC + 1}. The exit is row ${exitR + 1}, column ${exitC + 1}.`}
    >
      <defs>
        <radialGradient id={`torch-${room.key}`}>
          <stop offset="0%" stopColor={glow} stopOpacity="0.4" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`exitglow-${room.key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={w} height={h} fill={floor} rx="10" />

      {/* Floor tiles. Reachable corridors are lit; the rest stays dark, which
          reads instantly as "you cannot get there yet".

          The lit tint is the room's *accent* rather than its wall colour. The
          wall colour was the obvious choice and it was wrong: on a palette
          like the temple's it differs from the floor by a few per cent of
          lightness, so the distinction the whole layout depends on was
          invisible. The accent is the one colour in each palette guaranteed
          to read against its own floor. */}
      {maze.cells.map((_, i) => {
        const r = rowOf(cols, i);
        const c = colOf(cols, i);
        const open = lit.has(i);
        return (
          <rect
            key={`f${i}`}
            x={x(c) + 1.5}
            y={y(r) + 1.5}
            width={CELL - 3}
            height={CELL - 3}
            rx="4"
            fill={open ? accent : "#000"}
            opacity={open ? 0.16 : 0.5}
          />
        );
      })}

      {/* The exit, marked from the start so the goal is never a mystery. */}
      <g>
        <rect
          x={x(exitC) + 4}
          y={y(exitR) + 4}
          width={CELL - 8}
          height={CELL - 8}
          rx="5"
          fill={`url(#exitglow-${room.key})`}
          className="arcade-breathe"
        />
        <text
          x={x(exitC) + CELL / 2}
          y={y(exitR) + CELL / 2 + 5}
          textAnchor="middle"
          fontSize="15"
          fontWeight="900"
          fill="#07111f"
        >
          OUT
        </text>
      </g>

      {/* Walls. Drawn after the floor so corners stay crisp. */}
      <g stroke={accent} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.75">
        {maze.cells.map((cell, i) => {
          const r = rowOf(cols, i);
          const c = colOf(cols, i);
          const x0 = x(c);
          const y0 = y(r);
          const x1 = x0 + CELL;
          const y1 = y0 + CELL;
          return (
            <g key={`w${i}`}>
              {cell.n ? <line x1={x0} y1={y0} x2={x1} y2={y0} /> : null}
              {cell.w ? <line x1={x0} y1={y0} x2={x0} y2={y1} /> : null}
              {/* Only the last row and column need their far walls drawn;
                  every other edge is already covered by its neighbour. */}
              {cell.s && r === rows - 1 ? <line x1={x0} y1={y1} x2={x1} y2={y1} /> : null}
              {cell.e && c === cols - 1 ? <line x1={x1} y1={y0} x2={x1} y2={y1} /> : null}
            </g>
          );
        })}
      </g>

      {/* Gates, sitting across the corridor they block. */}
      {maze.gates.map((gate, n) => {
        const isOpen = solved.includes(gate.puzzleId);
        const ar = rowOf(cols, gate.a);
        const ac = colOf(cols, gate.a);
        const br = rowOf(cols, gate.b);
        const bc = colOf(cols, gate.b);
        // The midpoint of the shared edge.
        const cx = (x(ac) + x(bc)) / 2 + CELL / 2;
        const cy = (y(ar) + y(br)) / 2 + CELL / 2;
        const horizontal = ar === br;
        const isNext = nextGateId === gate.puzzleId;
        const isActive = activeGate === gate.puzzleId;
        const tint = isOpen ? "#4ade80" : isNext ? "#f87171" : "#fbbf24";

        return (
          <g
            key={gate.puzzleId}
            role="button"
            tabIndex={0}
            aria-label={`Gate ${n + 1}, ${isOpen ? "open" : "locked"}`}
            onClick={() => onGateClick(gate)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onGateClick(gate);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <circle cx={cx} cy={cy} r={CELL * 0.46} fill={tint} opacity={isOpen ? 0.12 : 0.18} />
            {/* The barrier itself: a solid bar across the opening when locked,
                swung aside into two stubs when open. */}
            {isOpen ? (
              <g stroke={tint} strokeWidth="5" strokeLinecap="round" opacity="0.9">
                {horizontal ? (
                  <>
                    <line x1={cx} y1={cy - CELL * 0.4} x2={cx} y2={cy - CELL * 0.26} />
                    <line x1={cx} y1={cy + CELL * 0.26} x2={cx} y2={cy + CELL * 0.4} />
                  </>
                ) : (
                  <>
                    <line x1={cx - CELL * 0.4} y1={cy} x2={cx - CELL * 0.26} y2={cy} />
                    <line x1={cx + CELL * 0.26} y1={cy} x2={cx + CELL * 0.4} y2={cy} />
                  </>
                )}
              </g>
            ) : (
              <g>
                <rect
                  x={horizontal ? cx - 7 : cx - CELL * 0.42}
                  y={horizontal ? cy - CELL * 0.42 : cy - 7}
                  width={horizontal ? 14 : CELL * 0.84}
                  height={horizontal ? CELL * 0.84 : 14}
                  rx="4"
                  fill={tint}
                  opacity="0.95"
                />
                {/* Bars, so it reads as a gate rather than a coloured block. */}
                {[-0.2, 0, 0.2].map((o) => (
                  <line
                    key={o}
                    x1={horizontal ? cx - 7 : cx + o * CELL}
                    y1={horizontal ? cy + o * CELL : cy - 7}
                    x2={horizontal ? cx + 7 : cx + o * CELL}
                    y2={horizontal ? cy + o * CELL : cy + 7}
                    stroke="#1c1917"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                ))}
              </g>
            )}

            <text
              x={cx}
              y={cy + 4.5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="900"
              fill={isOpen ? tint : "#1c1917"}
            >
              {isOpen ? "✓" : n + 1}
            </text>

            {/* The next gate gets a ring, so "where do I go" has one answer. */}
            {isNext && !isOpen ? (
              <circle
                cx={cx}
                cy={cy}
                r={CELL * 0.5}
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeDasharray="5 4"
                className="arcade-breathe"
              />
            ) : null}
            {isActive ? (
              <circle cx={cx} cy={cy} r={CELL * 0.58} fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
            ) : null}
          </g>
        );
      })}

      {/* The player. Transitions between cells, so a step is visibly a step. */}
      <g
        style={{
          transition: "transform 0.14s ease-out",
          transform: `translate(${x(atC)}px, ${y(atR)}px)`,
        }}
      >
        <circle cx={CELL / 2} cy={CELL / 2} r={CELL * 0.75} fill={`url(#torch-${room.key})`} />
        <circle cx={CELL / 2} cy={CELL / 2} r={CELL * 0.26} fill="#fff" />
        <circle cx={CELL / 2} cy={CELL / 2} r={CELL * 0.17} fill={glow} />
      </g>
    </svg>
  );
}

/** Where the exit lies relative to the player, in words. */
export function bearingTo(maze: Maze, from: number, to: number): string {
  const cols = maze.cols;
  const dr = rowOf(cols, to) - rowOf(cols, from);
  const dc = colOf(cols, to) - colOf(cols, from);
  if (dr === 0 && dc === 0) return "right here";
  const parts: string[] = [];
  if (dr < 0) parts.push("north");
  if (dr > 0) parts.push("south");
  if (dc > 0) parts.push("east");
  if (dc < 0) parts.push("west");
  return parts.join("-");
}

export { gateBetween };
