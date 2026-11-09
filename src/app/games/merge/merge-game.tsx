"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell, Panel, Stat } from "../game-shell";
import { saveGameAction } from "@/lib/actions/arcade-actions";
import {
  DEFAULT_SIZE,
  UNDO_ALLOWANCE,
  isGameOver,
  legalMoves,
  move,
  newGame,
  spawn,
  tileLabel,
  xpForGame,
  type Board,
  type Direction,
  type Tile,
} from "@/lib/games/merge";
import { sparkColor, sparkCount, tileStyle } from "@/lib/games/merge-theme";

/**
 * Factor Forge.
 *
 * All the rules are in src/lib/games/merge.ts and verified by
 * scripts/check-games.ts; this file is the hands and the eyes. Its two real
 * jobs are input (four keys, four swipes, nothing else) and making a move
 * legible — which is harder than it sounds, because one move changes most of
 * the board at once and a board that simply redraws is unreadable.
 *
 * HOW THE SLIDE IS ANIMATED. Every tile keeps a stable id across moves, and
 * is rendered as a React element keyed by that id, positioned with a
 * `translate` transform and a CSS transition. So when the engine hands back a
 * board where tile 42 has moved three cells, React updates the transform on
 * the DOM node that is already on screen and the browser animates it. No
 * animation library, no frame loop, no measuring.
 *
 * The tiles consumed by a merge come back from the engine as `absorbed`, at
 * their destination. Rendering them for one more beat is what makes a merge
 * read as two tiles converging; the new tile fades in on top slightly later
 * (see `arcade-merge` in globals.css).
 */

const MODES = {
  classic: {
    key: "classic",
    name: "Classic",
    blurb: "No clock. Play until nothing divides anything.",
  },
  timed: {
    key: "timed",
    name: "Timed",
    blurb: "Three minutes. Score as high as you can.",
  },
  surge: {
    key: "surge",
    name: "Surge",
    blurb: "The board fills faster the longer you last.",
  },
} as const;

type ModeKey = keyof typeof MODES;

const TIMED_SECONDS = 180;
/** In Surge, an extra tile drops every move once this many moves have passed. */
const SURGE_AFTER = 18;

type Spark = { id: number; r: number; c: number; dx: number; dy: number; color: string };
type Toast = { id: number; text: string; tone: "score" | "combo" | "peak" };

export function MergeGame({
  seed,
  bests,
  peak: startingPeak,
}: {
  /** Supplied by the server so the client never calls Date.now() in render. */
  seed: number;
  /** Best score so far, per mode. */
  bests: Record<string, number>;
  /** Highest tile ever reached, across every mode. */
  peak: number;
}) {
  const [mode, setMode] = useState<ModeKey>("classic");
  // Bumped on every new game so the seed changes without a clock.
  const [round, setRound] = useState(0);
  const seedFor = useCallback(
    (r: number) => ((seed ^ Math.imul(r + 1, 2654435761)) | 0) || 1,
    [seed],
  );

  const [board, setBoard] = useState<Board>(() => newGame(DEFAULT_SIZE, seedFor(0)));
  const [ghosts, setGhosts] = useState<Tile[]>([]);
  const [history, setHistory] = useState<Board[]>([]);
  const [undosLeft, setUndosLeft] = useState(UNDO_ALLOWANCE);
  const [over, setOver] = useState<null | "jammed" | "time">(null);
  const [secondsLeft, setSecondsLeft] = useState(TIMED_SECONDS);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shaking, setShaking] = useState(false);
  const [bestMap, setBestMap] = useState(bests);
  const [peak, setPeak] = useState(startingPeak);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  /**
   * The authoritative board, mirrored outside React state.
   *
   * A move has side effects — sparks, callouts, the undo stack — so it cannot
   * be computed inside a `setBoard` updater: React is allowed to call an
   * updater more than once, and in development it does, which would double
   * every spark and every undo entry. Reading the board from a ref instead
   * keeps the move a single ordinary function call, and also makes two
   * keypresses in the same frame compose correctly rather than both starting
   * from the older board.
   */
  const boardRef = useRef(board);
  /** Set the instant the game ends, so a key still in flight cannot move. */
  const finishedRef = useRef(false);
  const commit = useCallback((next: Board) => {
    boardRef.current = next;
    setBoard(next);
  }, []);

  const best = bestMap[mode] ?? 0;
  const isOver = over !== null;

  // -------------------------------------------------------------------------
  // Starting over
  // -------------------------------------------------------------------------

  const reset = useCallback(
    (nextMode: ModeKey = mode) => {
      const r = round + 1;
      setRound(r);
      setMode(nextMode);
      finishedRef.current = false;
      commit(newGame(DEFAULT_SIZE, seedFor(r)));
      setGhosts([]);
      setHistory([]);
      setUndosLeft(UNDO_ALLOWANCE);
      setOver(null);
      setSecondsLeft(TIMED_SECONDS);
      setSparks([]);
      setToasts([]);
      setXpEarned(null);
      setSaveNote(null);
    },
    [commit, mode, round, seedFor],
  );

  // -------------------------------------------------------------------------
  // Finishing
  // -------------------------------------------------------------------------

  const finish = useCallback(
    (final: Board, why: "jammed" | "time") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setOver(why);

      const xp = xpForGame(final);
      setXpEarned(xp);
      setBestMap((m) => ({ ...m, [mode]: Math.max(m[mode] ?? 0, final.score) }));
      setPeak((p) => Math.max(p, final.peak));

      // Saving must never cost the player their result: the score is already
      // on screen, and a failure here is a note beside it rather than a thrown
      // dialog over the board.
      saveGameAction({
        game: "MERGE",
        variant: mode,
        score: final.score,
        won: final.peak >= 720,
        xp,
        peak: final.peak,
        bestCombo: final.bestCombo,
      })
        .then((res) => {
          if (!res.ok) setSaveNote(res.error);
          else if (res.result.wasDaily) setSaveNote("Daily challenge — XP boosted.");
        })
        .catch(() => setSaveNote("Couldn't save your score."));
    },
    [mode],
  );

  // -------------------------------------------------------------------------
  // Moving
  // -------------------------------------------------------------------------

  const pushToast = useCallback((text: string, tone: Toast["tone"]) => {
    const id = nextId();
    // Two at a time. Divisibility merging fires far more often than doubling
    // did, and a four-deep stack of callouts sat on top of the tiles it was
    // reporting on — which is the one thing the player needs to read.
    setToasts((t) => [...t.slice(-1), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 900);
  }, []);

  const doMove = useCallback(
    (dir: Direction) => {
      if (finishedRef.current) return;

      const prev = boardRef.current;
      const res = move(prev, dir);
      if (!res.moved) {
        // A refused move is worth saying out loud — silence reads as a
        // dropped keypress.
        setShaking(true);
        window.setTimeout(() => setShaking(false), 420);
        return;
      }

      let next = res.board;

      // Surge: the board gets meaner the longer you survive it. Uses the
      // engine's own spawn, so the extra tile obeys every normal rule.
      if (mode === "surge" && next.moves > SURGE_AFTER && next.moves % 2 === 0) {
        next = spawn(next);
      }

      setHistory((h) => [...h.slice(-(UNDO_ALLOWANCE + 2)), prev]);
      setGhosts(res.absorbed);
      window.setTimeout(() => setGhosts([]), 190);

      if (res.gained > 0) pushToast(`+${res.gained}`, "score");
      if (res.comboBonus > 0) pushToast(`Combo ×${next.combo}`, "combo");
      if (next.peak > prev.peak && next.peak >= 60) pushToast(`${next.peak}!`, "peak");

      // Sparks for the merges big enough to deserve them.
      const bursts: Spark[] = [];
      for (const t of next.tiles) {
        if (!t.mergedThisMove) continue;
        const n = sparkCount(t.value);
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2 + t.value;
          const reach = 26 + (i % 4) * 11;
          bursts.push({
            id: nextId(),
            r: t.r,
            c: t.c,
            dx: Math.cos(angle) * reach,
            dy: Math.sin(angle) * reach,
            color: sparkColor(t.value),
          });
        }
      }
      if (bursts.length > 0) {
        setSparks((s) => [...s, ...bursts]);
        const ids = new Set(bursts.map((b) => b.id));
        window.setTimeout(() => setSparks((s) => s.filter((x) => !ids.has(x.id))), 620);
      }

      commit(next);
      if (isGameOver(next)) finish(next, "jammed");
    },
    [commit, finish, mode, pushToast],
  );

  const undo = useCallback(() => {
    if (undosLeft <= 0 || history.length === 0 || finishedRef.current) return;
    commit(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setUndosLeft((n) => n - 1);
    setGhosts([]);
    setSparks([]);
  }, [commit, history, undosLeft]);

  // -------------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------------

  // The listener is registered once and reads the current handler through a
  // ref, so holding a key down never races a re-registration.
  const moveRef = useRef(doMove);
  const undoRef = useRef(undo);
  useEffect(() => {
    moveRef.current = doMove;
    undoRef.current = undo;
  }, [doMove, undo]);

  useEffect(() => {
    const keys: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      a: "left",
      s: "down",
      d: "right",
      W: "up",
      A: "left",
      S: "down",
      D: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      // Never swallow a shortcut the browser owns.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const dir = keys[e.key];
      if (dir) {
        // Arrow keys scroll the page by default, which fights every move.
        e.preventDefault();
        moveRef.current(dir);
        return;
      }
      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Swipe. Pointer events rather than touch events, so a trackpad drag and a
  // finger behave the same, and so a scroll gesture inside the page still
  // works outside the board.
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = dragRef.current;
    dragRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // 24px of travel before a swipe counts — below that it is a tap, and a
    // tap must not move the board.
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
    else doMove(dy > 0 ? "down" : "up");
  };

  // -------------------------------------------------------------------------
  // The clock
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (mode !== "timed" || isOver) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [mode, isOver, round]);

  useEffect(() => {
    // The board comes from the ref, so the clock can never end the game on a
    // position several moves out of date.
    if (mode === "timed" && secondsLeft === 0 && !isOver) finish(boardRef.current, "time");
  }, [mode, secondsLeft, isOver, finish]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const size = board.size;
  const cells = useMemo(() => Array.from({ length: size * size }, (_, i) => i), [size]);
  const movesLeft = legalMoves(board).length;

  return (
    <GameShell
      title="Factor Forge"
      eyebrow={MODES[mode].blurb}
      accent={{ from: "#f59e0b", to: "#ef4444" }}
      aside={
        <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
          {(Object.keys(MODES) as ModeKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => reset(k)}
              aria-pressed={mode === k}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                mode === k
                  ? "bg-amber-400 text-amber-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {MODES[k].name}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        {/* ----------------------------------------------------------------- */}
        {/* The board */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            <Stat label="Score" value={board.score.toLocaleString()} />
            <Stat label="Best" value={best.toLocaleString()} />
            <Stat
              label="Combo"
              value={board.combo >= 2 ? `×${board.combo}` : "—"}
              tone={board.combo >= 2 ? "hot" : "plain"}
            />
            <Stat
              label={mode === "timed" ? "Time" : "Moves"}
              value={
                mode === "timed"
                  ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
                  : board.moves.toLocaleString()
              }
              tone={mode === "timed" && secondsLeft <= 20 ? "hot" : "plain"}
            />
          </div>

          <Panel className="relative">
            <div
              className={shaking ? "arcade-shake" : undefined}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (dragRef.current = null)}
            >
              <div
                className="relative mx-auto w-full max-w-[32rem] touch-none select-none rounded-2xl bg-[#111a2b] p-[0.6%]"
                // A container query, so the tile type scales with the board
                // rather than with the viewport — 1cqw is 1% of the board's
                // width at every breakpoint, which is what lets a four-digit
                // tile be sized once and fit everywhere.
                style={{ aspectRatio: "1 / 1", containerType: "inline-size" }}
                aria-label={`Factor Forge board. Score ${board.score}.`}
              >
                {/* Empty cells, drawn once. */}
                {cells.map((i) => {
                  const r = Math.floor(i / size);
                  const c = i % size;
                  return (
                    <div
                      key={`cell-${i}`}
                      aria-hidden
                      className="absolute left-0 top-0 p-[1.2%]"
                      style={{
                        width: `${100 / size}%`,
                        height: `${100 / size}%`,
                        transform: `translate(${c * 100}%, ${r * 100}%)`,
                      }}
                    >
                      <div className="h-full w-full rounded-xl bg-white/[0.045]" />
                    </div>
                  );
                })}

                {/* The absorbed partners, rendered one beat longer so a merge
                    reads as two tiles arriving. Their DOM nodes carried over
                    from the previous paint, so they slide. */}
                {ghosts.map((t) => (
                  <TileView key={t.id} tile={t} size={size} fading />
                ))}

                {/* The live tiles. */}
                {board.tiles.map((t) => (
                  <TileView key={t.id} tile={t} size={size} />
                ))}

                {/* Particle bursts. */}
                {sparks.map((s) => (
                  <div
                    key={s.id}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 flex items-center justify-center"
                    style={{
                      width: `${100 / size}%`,
                      height: `${100 / size}%`,
                      transform: `translate(${s.c * 100}%, ${s.r * 100}%)`,
                    }}
                  >
                    <span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: s.color,
                        boxShadow: `0 0 8px ${s.color}`,
                        animation: "arcade-spark 0.6s ease-out forwards",
                        ["--dx" as string]: `${s.dx}px`,
                        ["--dy" as string]: `${s.dy}px`,
                      }}
                    />
                  </div>
                ))}

                {/* Floating score and combo callouts. */}
                <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex flex-col items-center gap-0.5">
                  {toasts.map((t) => (
                    <span
                      key={t.id}
                      className={[
                        "arcade-rise font-mono text-sm font-bold drop-shadow",
                        t.tone === "combo"
                          ? "text-amber-300"
                          : t.tone === "peak"
                            ? "text-white"
                            : "text-slate-200",
                      ].join(" ")}
                    >
                      {t.text}
                    </span>
                  ))}
                </div>

                {/* Game over. Covers the board rather than replacing it, so the
                    final position stays readable underneath. */}
                {isOver ? (
                  // z-20 so it covers the tiles, which carry their own
                  // stacking order (1–3) for the merge animation.
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#070b14]/88 px-6 text-center backdrop-blur-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                      {over === "time" ? "Time" : "No moves left"}
                    </div>
                    <div className="font-mono text-5xl font-extrabold tabular-nums">
                      {board.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-300">
                      Biggest tile {board.peak.toLocaleString()} · {board.merges} merges
                      {board.bestCombo >= 2 ? ` · best combo ×${board.bestCombo}` : ""}
                    </div>
                    {xpEarned !== null ? (
                      <div className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-200">
                        +{xpEarned} XP
                      </div>
                    ) : null}
                    {board.score > (bests[mode] ?? 0) ? (
                      <div className="text-sm font-bold text-emerald-300">New personal best</div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="mt-1 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-amber-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Play again
                    </button>
                    {saveNote ? <div className="text-xs text-slate-400">{saveNote}</div> : null}
                  </div>
                ) : null}
              </div>
            </div>
          </Panel>

          {/* Controls. Buttons as well as keys, because a phone has no arrow
              keys and a swipe is not discoverable on its own. */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={undo}
                disabled={undosLeft === 0 || history.length === 0 || isOver}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-slate-100 transition-colors hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Undo
                <span className="ml-1.5 font-mono text-xs text-slate-400">{undosLeft} left</span>
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-slate-100 transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                New game
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:hidden">
              <span />
              <ArrowButton dir="up" onMove={doMove} />
              <span />
              <ArrowButton dir="left" onMove={doMove} />
              <ArrowButton dir="down" onMove={doMove} />
              <ArrowButton dir="right" onMove={doMove} />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* The side column */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              How to play
            </h2>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">
              <li>
                <b className="text-slate-100">Arrow keys</b> or <b className="text-slate-100">WASD</b>{" "}
                slide every tile at once. On a touchscreen, swipe the board.
              </li>
              <li>
                Two tiles fuse when{" "}
                <b className="text-amber-300">one of them divides the other</b>, and they leave
                behind their <b className="text-slate-100">sum</b>. So 3 and 6 make 9, and 4 and 12
                make 16.
              </li>
              <li>
                Equal tiles are just the easy case of that rule — 7 and 7 make 14 — but they are not
                the only way through. Look for factors, not matching pairs.
              </li>
              <li>
                A <b className="text-slate-100">1</b> divides everything, so it fuses with any
                neighbour. It is your way out of a jammed board; spend it carefully.
              </li>
              <li>
                Fuse on consecutive moves to build a <b className="text-amber-300">combo</b> — the
                streak adds a bonus on top.
              </li>
              <li>
                <b className="text-slate-100">Undo</b> ({UNDO_ALLOWANCE} per game, or press Z) takes
                back your last move.
              </li>
            </ul>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              This game
            </h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              {[
                ["Merges", board.merges.toLocaleString()],
                ["Biggest tile", board.peak.toLocaleString()],
                ["Best combo", board.bestCombo >= 2 ? `×${board.bestCombo}` : "—"],
                ["Directions open", isOver ? "0" : String(movesLeft)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-mono font-bold tabular-nums text-slate-100">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-slate-400">All-time biggest</span>
                <span className="font-mono font-bold tabular-nums text-amber-300">
                  {peak.toLocaleString()}
                </span>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Modes</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {(Object.keys(MODES) as ModeKey[]).map((k) => (
                <li key={k} className="flex items-baseline justify-between gap-3">
                  <span className={mode === k ? "font-bold text-amber-300" : "text-slate-300"}>
                    {MODES[k].name}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {(bestMap[k] ?? 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}

// ---------------------------------------------------------------------------

/** One tile. Positioned by transform so React can animate it between cells. */
function TileView({
  tile,
  size,
  fading = false,
}: {
  tile: Tile;
  size: number;
  fading?: boolean;
}) {
  const style = tileStyle(tile);
  const label = tileLabel(tile);
  return (
    <div
      className="arcade-slide absolute left-0 top-0 p-[1.2%]"
      style={{
        width: `${100 / size}%`,
        height: `${100 / size}%`,
        transform: `translate(${tile.c * 100}%, ${tile.r * 100}%)`,
        // The absorbed partners must sit under the tile they became.
        zIndex: fading ? 1 : tile.mergedThisMove ? 3 : 2,
        opacity: fading ? 0 : 1,
      }}
      aria-hidden={fading}
    >
      <div
        className={[
          "flex h-full w-full items-center justify-center rounded-xl border font-mono font-extrabold leading-none",
          tile.mergedThisMove ? "arcade-merge" : tile.spawnedThisMove ? "arcade-pop" : "",
        ].join(" ")}
        style={{
          background: style.background,
          color: style.ink,
          borderColor: style.edge,
          boxShadow: style.glow === "none" ? undefined : style.glow,
          fontSize: `calc(${100 / size}cqw * ${style.scale})`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ArrowButton({ dir, onMove }: { dir: Direction; onMove: (d: Direction) => void }) {
  const rotate = { up: 0, right: 90, down: 180, left: 270 }[dir];
  return (
    <button
      type="button"
      onClick={() => onMove(dir)}
      aria-label={`Slide ${dir}`}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-200 transition-colors active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
        <path
          d="M10 4.5v11M10 4.5L5.5 9M10 4.5L14.5 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
