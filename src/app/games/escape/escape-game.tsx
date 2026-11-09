"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell, Panel, Stat } from "../game-shell";
import { MazeScene, bearingTo } from "./maze-scene";
import { resetEscapeAction, saveEscapeSolveAction } from "@/lib/actions/arcade-actions";
import {
  ROOMS,
  TIMEOUT_RULE,
  TOTAL_PUZZLES,
  currentRoomIndex,
  hasEscaped,
  isCorrect,
  isRoomClear,
  isRoomUnlocked,
  roomSolvedCount,
  xpForPuzzle,
  xpForRoom,
  type Room,
} from "@/lib/games/escape";
import { buildMaze, idx, nextGate, step, type Dir, type Gate } from "@/lib/games/maze";

/**
 * Equation Escape — a timed maze.
 *
 * THE GAME IN ONE SENTENCE, which the HUD also says out loud: walk to the
 * door marked OUT before the clock runs down, opening the locked gates in
 * your way by answering the maths on them.
 *
 * Two rules keep it from being punishing, and both are stated on screen
 * rather than left to be discovered:
 *
 *   A wrong answer costs nothing. No attempt limit, no penalty — the gate
 *   hands back a hint about the method and you try again. A maths game that
 *   punishes a wrong answer teaches players not to answer.
 *
 *   Running out of time costs only your position. You are walked back to the
 *   entrance and the clock restarts, but every gate you opened stays open, so
 *   each attempt starts further along than the last.
 *
 * The maze is a perfect maze (see src/lib/games/maze.ts), so there is exactly
 * one route from the entrance to the exit and the gates sit on it. That means
 * there is never a hidden way round and never a corridor worth searching —
 * the only thing between the player and the door is the arithmetic.
 */

const MOVE_KEYS: Record<string, Dir> = {
  ArrowUp: "n",
  ArrowDown: "s",
  ArrowLeft: "w",
  ArrowRight: "e",
  w: "n",
  a: "w",
  s: "s",
  d: "e",
  W: "n",
  A: "w",
  S: "s",
  D: "e",
};

type Flash =
  | null
  | { kind: "wall"; text: string }
  | { kind: "gate"; text: string }
  | { kind: "time"; text: string }
  | { kind: "clear"; text: string };

export function EscapeGame({
  initialSolved,
  xpSoFar,
  bestTimes,
}: {
  initialSolved: string[];
  xpSoFar: number;
  bestTimes: Record<string, number>;
}) {
  const [solved, setSolved] = useState<string[]>(initialSolved);
  const [roomIndex, setRoomIndex] = useState(() => currentRoomIndex(initialSolved));
  const room: Room = ROOMS[roomIndex];

  // The maze is seeded from the room's position, never from a clock, so a
  // room is the same maze every time anyone opens it.
  const maze = useMemo(
    () =>
      buildMaze({
        rows: room.grid.rows,
        cols: room.grid.cols,
        seed: 1000 + roomIndex * 7919,
        puzzleIds: room.puzzles.map((p) => p.id),
      }),
    [room, roomIndex],
  );

  /**
   * Where the player is standing, tagged with the room it belongs to.
   *
   * Carrying the room index inside the position is what lets `at` be derived
   * rather than synchronised: changing room makes the stored position stale,
   * and a stale position simply reads as the new maze's entrance. The
   * alternative — an effect that resets the position whenever the maze
   * changes — is a cascading render, and React's lint rule rightly objects.
   */
  const [pos, setPos] = useState<{ room: number; cell: number }>(() => ({
    room: roomIndex,
    cell: maze.start,
  }));
  const at = pos.room === roomIndex ? pos.cell : maze.start;

  const [secondsLeft, setSecondsLeft] = useState(room.timeLimit);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [entry, setEntry] = useState("");
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [result, setResult] = useState<
    null | { kind: "wrong"; text: string } | { kind: "right"; text: string; insight: string }
  >(null);
  const [flash, setFlash] = useState<Flash>(null);
  const [shaking, setShaking] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [times, setTimes] = useState(bestTimes);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [showRules, setShowRules] = useState(initialSolved.length === 0);
  const [outOfTime, setOutOfTime] = useState(false);

  const active = room.puzzles.find((p) => p.id === activeId) ?? null;
  const roomDone = isRoomClear(room, solved);
  const atExit = at === maze.exit;
  const escaped = hasEscaped(solved);
  const upcoming = nextGate(maze, solved);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeId) inputRef.current?.focus();
  }, [activeId]);

  const say = useCallback((f: Exclude<Flash, null>, ms = 2200) => {
    setFlash(f);
    window.setTimeout(() => setFlash((cur) => (cur === f ? null : cur)), ms);
  }, []);

  /**
   * Opens a gate's puzzle — but only from the cell beside it.
   *
   * Without the distance check the maze is decoration: every gate is listed
   * in the side panel and drawn on the map, so a player could answer all
   * three from where they stand and then take an unobstructed walk to the
   * door. Requiring you to be at the gate is what makes the walking part of
   * the game rather than a formality.
   *
   * A gate already open is readable from anywhere, since all that shows is
   * the answer and the explanation — worth being able to look back at.
   */
  const openGate = useCallback(
    (puzzleId: string) => {
      const gate = maze.gates.find((g) => g.puzzleId === puzzleId);
      const adjacent = gate ? at === gate.a || at === gate.b : false;
      if (!adjacent && !solved.includes(puzzleId)) {
        const n = maze.gates.findIndex((g) => g.puzzleId === puzzleId) + 1;
        say({ kind: "gate", text: `Gate ${n} is further in — walk to it first.` });
        return;
      }
      setActiveId(puzzleId);
      setEntry("");
      setResult(null);
    },
    [at, maze.gates, say, solved],
  );

  // ---------------------------------------------------------------------------
  // Walking
  // ---------------------------------------------------------------------------

  // The position is mirrored in a ref so a held-down key composes: each
  // repeat steps from where the previous one landed rather than from the
  // cell of the last committed render. Writing a ref from an effect is fine;
  // it is only setState that must not happen there.
  const atRef = useRef(at);
  useEffect(() => {
    atRef.current = at;
  }, [at]);

  const walk = useCallback(
    (dir: Dir) => {
      // Only two things stop you walking: a puzzle panel in front of you, and
      // already standing at the door.
      //
      // This used to also stop on `roomDone`, which was exactly backwards —
      // opening the last gate froze the player in place one corridor short of
      // the exit they had just unlocked, with no way to finish the room.
      if (activeId || (roomDone && atExit)) return;
      const res = step(maze, atRef.current, dir, solved);
      if (res.ok) {
        atRef.current = res.to;
        setPos({ room: roomIndex, cell: res.to });
        return;
      }
      if (res.reason === "wall") {
        setShaking(true);
        window.setTimeout(() => setShaking(false), 300);
        return;
      }
      // Bumping a gate is how you meet its puzzle — no separate "interact"
      // key to learn.
      setActiveId(res.gate.puzzleId);
      setEntry("");
      setResult(null);
    },
    [activeId, atExit, maze, roomDone, roomIndex, solved],
  );

  const walkRef = useRef(walk);
  useEffect(() => {
    walkRef.current = walk;
  }, [walk]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // While the answer box is focused, letters belong to the answer.
      if (document.activeElement === inputRef.current && e.key.length === 1) return;
      const dir = MOVE_KEYS[e.key];
      if (!dir) return;
      e.preventDefault();
      walkRef.current(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------------------------------------------------------------------------
  // The clock
  // ---------------------------------------------------------------------------

  /** Seconds spent in this room so far — what the best-time record stores. */
  const elapsed = room.timeLimit - secondsLeft;

  const secondsRef = useRef(room.timeLimit);
  const timeoutRef = useRef<() => void>(() => {});
  useEffect(() => {
    timeoutRef.current = () => {
      // Position only. Everything opened stays opened.
      atRef.current = maze.start;
      setPos({ room: roomIndex, cell: maze.start });
      setSecondsLeft(room.timeLimit);
      secondsRef.current = room.timeLimit;
      setActiveId(null);
      setOutOfTime(true);
      say({ kind: "time", text: `Out of time — back to the entrance. ${TIMEOUT_RULE}` }, 4200);
    };
  }, [maze.start, room.timeLimit, roomIndex, say]);

  useEffect(() => {
    if (roomDone && atExit) return;
    const t = window.setInterval(() => {
      secondsRef.current = Math.max(0, secondsRef.current - 1);
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current === 0) timeoutRef.current();
    }, 1000);
    return () => window.clearInterval(t);
  }, [roomDone, atExit, roomIndex]);

  // ---------------------------------------------------------------------------
  // Answering
  // ---------------------------------------------------------------------------

  const answer = useCallback(() => {
    if (!active || entry.trim() === "") return;

    if (!isCorrect(active, entry)) {
      const n = (misses[active.id] ?? 0) + 1;
      setMisses((m) => ({ ...m, [active.id]: n }));
      setShaking(true);
      window.setTimeout(() => setShaking(false), 420);
      setResult({
        kind: "wrong",
        // The first miss gets a gentle "think again"; after that the hint is
        // handed over outright. Nobody should be stuck at a gate.
        text: n === 1 ? `Not that one. ${active.hint}` : active.hint,
      });
      setEntry("");
      return;
    }

    if (solved.includes(active.id)) {
      setResult({ kind: "right", text: "Already open.", insight: active.insight });
      return;
    }

    const nextSolved = [...solved, active.id];
    const clearsRoom = isRoomClear(room, nextSolved);
    const xp = xpForPuzzle(active) + (clearsRoom ? xpForRoom(room) : 0);
    const seconds = clearsRoom ? Math.max(1, elapsed) : undefined;

    setSolved(nextSolved);
    setMisses((m) => ({ ...m, [active.id]: 0 }));
    setSessionXp((n) => n + xp);
    setResult({ kind: "right", text: `The gate swings open. +${xp} XP`, insight: active.insight });
    setEntry("");
    if (clearsRoom && seconds) {
      setTimes((t) => ({ ...t, [room.key]: Math.min(t[room.key] ?? Infinity, seconds) }));
      say({ kind: "clear", text: "Every gate is open. Walk to the door marked OUT." }, 4000);
    }

    // Fire and forget: the gate has already opened on screen, and a network
    // hiccup must not undo it in front of the player.
    saveEscapeSolveAction({ puzzleId: active.id, roomSeconds: seconds })
      .then((res) => {
        if (!res.ok) {
          setSaveNote(res.error);
          return;
        }
        const delta = res.result.xpAwarded - xp;
        if (delta !== 0) setSessionXp((n) => n + delta);
        if (res.result.wasDaily) setSaveNote("Daily challenge — XP boosted.");
      })
      .catch(() => setSaveNote("Couldn't save that solve — it may not stick."));
  }, [active, elapsed, entry, misses, room, say, solved]);

  // ---------------------------------------------------------------------------
  // Rooms
  // ---------------------------------------------------------------------------

  const enterRoom = useCallback(
    (i: number) => {
      const next = ROOMS[i];
      setRoomIndex(i);
      setActiveId(null);
      setEntry("");
      setResult(null);
      setFlash(null);
      setOutOfTime(false);
      setSecondsLeft(next.timeLimit);
      secondsRef.current = next.timeLimit;
      // Put the player at the new room's entrance explicitly.
      //
      // Leaving the stale room tag to do this was almost right and quietly
      // wrong: it works going *forward*, but walking back into a room you
      // have already been in matched the tag again and dropped you wherever
      // you last stood — mid-maze, with a freshly reset clock. Entering a
      // room always means entering it at the door.
      const startCell = idx(next.grid.cols, next.grid.rows - 1, 0);
      setPos({ room: i, cell: startCell });
      atRef.current = startCell;
    },
    [],
  );

  const runAgain = useCallback(() => {
    setResetting(true);
    resetEscapeAction()
      .then(() => {
        setSolved([]);
        setMisses({});
        enterRoom(0);
      })
      .catch(() => setSaveNote("Couldn't reset the run."))
      .finally(() => setResetting(false));
  }, [enterRoom]);

  const totalSolved = solved.length;
  const danger = secondsLeft <= 30;

  // What to do next, in one line. Recomputed rather than stored so it can
  // never fall out of step with the maze.
  const objective = roomDone
    ? atExit
      ? "You are at the door."
      : `Every gate is open — head for the door marked OUT, ${bearingTo(maze, at, maze.exit)} of you.`
    : upcoming
      ? `Walk to gate ${maze.gates.findIndex((g) => g.puzzleId === upcoming.puzzleId) + 1} (ringed in red) and answer what it asks.`
      : "Find the gates blocking the corridor.";

  return (
    <GameShell
      title="Equation Escape"
      eyebrow={`${room.name} · ${room.subtitle}`}
      accent={{ from: "#22d3ee", to: "#6366f1" }}
      aside={
        <div className="flex items-center gap-2">
          <Stat label="Gates" value={`${totalSolved}/${TOTAL_PUZZLES}`} />
          <Stat label="XP" value={(xpSoFar + sessionXp).toLocaleString()} tone="hot" />
        </div>
      }
    >
      {/* ------------------------------------------------------------------- */}
      {/* The goal, stated before anything else on the page */}
      {/* ------------------------------------------------------------------- */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.07] px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300">
            Your goal
          </div>
          <p className="text-sm leading-relaxed text-slate-100">
            Reach the door marked <b className="text-cyan-200">OUT</b> before the clock runs down.
            Three locked gates stand in the only corridor that gets you there — answer the maths on
            a gate to open it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRules(true)}
          className="shrink-0 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-100 transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          How to play
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Time left"
              value={`${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
              tone={danger ? "hot" : "plain"}
            />
            <Stat label="This room" value={`${roomSolvedCount(room, solved)}/${room.puzzles.length}`} />
            <Stat
              label="Best time"
              value={
                times[room.key]
                  ? `${Math.floor(times[room.key] / 60)}:${String(times[room.key] % 60).padStart(2, "0")}`
                  : "—"
              }
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* The maze */}
          {/* --------------------------------------------------------------- */}
          <Panel className="overflow-hidden p-0">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-extrabold">{room.name}</h2>
                <span className="font-mono text-xs text-slate-400">
                  Room {roomIndex + 1} of {ROOMS.length}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{room.intro}</p>
            </div>

            <div className={shaking ? "arcade-shake" : undefined}>
              <div className="p-3">
                <MazeScene
                  room={room}
                  maze={maze}
                  at={at}
                  solved={solved}
                  activeGate={activeId}
                  nextGateId={upcoming?.puzzleId ?? null}
                  onGateClick={(g: Gate) => openGate(g.puzzleId)}
                />
              </div>
            </div>

            {/* The running instruction. */}
            <div
              className="border-t border-white/10 px-4 py-3 text-sm"
              role="status"
              aria-live="polite"
            >
              {flash ? (
                <span
                  className={
                    flash.kind === "time"
                      ? "font-semibold text-rose-300"
                      : flash.kind === "clear"
                        ? "font-semibold text-emerald-300"
                        : "text-amber-200"
                  }
                >
                  {flash.text}
                </span>
              ) : (
                <span className="text-slate-300">{objective}</span>
              )}
            </div>

            {/* Movement. Keys for desktop, a pad for touch — labelled, so it
                is obvious the game is something you walk around in. */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
              <p className="text-xs text-slate-400">
                Move with the <b className="text-slate-200">arrow keys</b> or{" "}
                <b className="text-slate-200">WASD</b>.
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <span />
                <PadButton dir="n" onWalk={walk} />
                <span />
                <PadButton dir="w" onWalk={walk} />
                <PadButton dir="s" onWalk={walk} />
                <PadButton dir="e" onWalk={walk} />
              </div>
            </div>
          </Panel>

          {/* --------------------------------------------------------------- */}
          {/* At the door */}
          {/* --------------------------------------------------------------- */}
          {roomDone && atExit ? (
            <Panel className="text-center">
              <p className="text-sm font-bold text-emerald-300">
                {roomIndex < ROOMS.length - 1
                  ? "You are through."
                  : "That was the last door. You are out."}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {room.name} cleared in {Math.floor(elapsed / 60)}:
                {String(elapsed % 60).padStart(2, "0")}.
              </p>
              {roomIndex < ROOMS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => enterRoom(roomIndex + 1)}
                  className="mt-3 rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-bold text-cyan-950 transition-colors hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Enter {ROOMS[roomIndex + 1].name} →
                </button>
              ) : null}
            </Panel>
          ) : null}

          {/* --------------------------------------------------------------- */}
          {/* The gate's puzzle */}
          {/* --------------------------------------------------------------- */}
          {active ? (
            <Panel>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold text-slate-100">
                  Gate {maze.gates.findIndex((g) => g.puzzleId === active.id) + 1} — {active.label}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                  Difficulty {active.difficulty}/10 · {xpForPuzzle(active)} XP
                </span>
              </div>

              <p className="mt-2 text-[15px] leading-relaxed text-slate-200">{active.prompt}</p>

              {solved.includes(active.id) ? (
                <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
                  <p className="text-sm font-bold text-emerald-200">Open — {active.answer}</p>
                  <p className="mt-1 text-sm text-emerald-100/80">{active.insight}</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    answer();
                  }}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  <input
                    ref={inputRef}
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    // Not type="number": several answers are fractions, and a
                    // number input silently rejects "11/24".
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    placeholder="Your answer"
                    aria-label={`Answer for ${active.label}`}
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 font-mono text-base text-slate-50 placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  />
                  <button
                    type="submit"
                    disabled={entry.trim() === ""}
                    className="rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-bold text-cyan-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Open it
                  </button>
                </form>
              )}

              {result ? (
                <div
                  className={[
                    "mt-3 rounded-xl border p-3 text-sm",
                    result.kind === "right"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-100",
                  ].join(" ")}
                  role="status"
                  aria-live="polite"
                >
                  {result.kind === "right" ? (
                    <>
                      <p className="font-bold">{result.text}</p>
                      <p className="mt-1 text-emerald-100/85">{result.insight}</p>
                    </>
                  ) : (
                    <p>{result.text}</p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  A wrong answer costs you nothing but the seconds — the gate will tell you how to
                  think about it.
                </p>
              )}

              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="mt-3 text-xs font-semibold text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Step back from the gate
              </button>
            </Panel>
          ) : null}

          {escaped ? (
            <Panel className="text-center">
              <h3 className="text-xl font-extrabold text-emerald-300">You got out.</h3>
              <p className="mt-1 text-sm text-slate-300">
                All {TOTAL_PUZZLES} gates, all five mazes — arithmetic through geometry.
              </p>
              <button
                type="button"
                onClick={runAgain}
                disabled={resetting}
                className="mt-3 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-bold text-slate-100 transition-colors hover:bg-white/[0.12] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {resetting ? "Resetting…" : "Run it again"}
              </button>
              <p className="mt-2 text-xs text-slate-500">
                Your XP and best times are kept. Only the gates are relocked.
              </p>
            </Panel>
          ) : null}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Side column */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Gates in this room
            </h2>
            <ol className="mt-2 space-y-1.5">
              {room.puzzles.map((p, i) => {
                const done = solved.includes(p.id);
                const isNext = upcoming?.puzzleId === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openGate(p.id)}
                      className={[
                        "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        done
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                          : isNext
                            ? "border-rose-400/50 bg-rose-400/10 text-rose-100"
                            : "border-white/12 bg-white/[0.05] text-slate-200 hover:bg-white/[0.1]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black",
                          done ? "bg-emerald-400 text-emerald-950" : "bg-white/15 text-slate-100",
                        ].join(" ")}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{p.label}</span>
                      {isNext && !done ? (
                        <span className="shrink-0 text-[10px] font-bold uppercase">next</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              The way out
            </h2>
            <ol className="mt-2 space-y-1.5">
              {ROOMS.map((r, i) => {
                const unlocked = isRoomUnlocked(i, solved);
                const here = i === roomIndex;
                const done = isRoomClear(r, solved);
                return (
                  <li key={r.key}>
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => enterRoom(i)}
                      className={[
                        "w-full rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        here
                          ? "border-cyan-300/50 bg-cyan-300/10"
                          : unlocked
                            ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.09]"
                            : "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-45",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-bold text-slate-100">{r.name}</span>
                        <span className="shrink-0 font-mono text-[11px] text-slate-400">
                          {done
                            ? "✓"
                            : unlocked
                              ? `${roomSolvedCount(r, solved)}/${r.puzzles.length}`
                              : "locked"}
                        </span>
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {r.subtitle} · {Math.round(r.timeLimit / 60)} min
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Progress</h2>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400 transition-[width] duration-500"
                style={{ width: `${(totalSolved / TOTAL_PUZZLES) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {totalSolved} of {TOTAL_PUZZLES} gates open.
            </p>
            {saveNote ? <p className="mt-2 text-xs text-amber-300">{saveNote}</p> : null}
          </Panel>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Rules */}
      {/* ------------------------------------------------------------------- */}
      {showRules ? <RulesCard onClose={() => setShowRules(false)} /> : null}

      {/* Shown once after a timeout, because a silent teleport back to the
          entrance would read as a bug rather than a rule. */}
      {outOfTime && !showRules ? (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-[min(32rem,92vw)] rounded-2xl border border-rose-400/40 bg-[#1b0f16]/95 p-4 text-center shadow-2xl backdrop-blur">
          <p className="text-sm font-bold text-rose-200">The clock ran out.</p>
          <p className="mt-1 text-sm text-slate-300">{TIMEOUT_RULE}</p>
          <button
            type="button"
            onClick={() => setOutOfTime(false)}
            className="mt-3 rounded-xl bg-rose-300 px-4 py-2 text-sm font-bold text-rose-950 transition-colors hover:bg-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Keep going
          </button>
        </div>
      ) : null}
    </GameShell>
  );
}

// ---------------------------------------------------------------------------

function PadButton({ dir, onWalk }: { dir: Dir; onWalk: (d: Dir) => void }) {
  const rotate = { n: 0, e: 90, s: 180, w: 270 }[dir];
  const name = { n: "north", e: "east", s: "south", w: "west" }[dir];
  return (
    <button
      type="button"
      onClick={() => onWalk(dir)}
      aria-label={`Walk ${name}`}
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

/**
 * The rules, in full, before the first move.
 *
 * Shown automatically only to a player with nothing solved — someone
 * returning to room four does not need to be told what a gate is — and
 * reachable afterwards from the "How to play" button.
 */
function RulesCard({ onClose }: { onClose: () => void }) {
  const rules: [string, string][] = [
    ["Where you are", "The glowing dot is you. Move with the arrow keys, WASD, or the on-screen pad."],
    ["Where you are going", "The tile marked OUT. It is visible from the start — there is nothing to hunt for."],
    [
      "What stops you",
      "Three numbered gates sit in the corridor. There is only one route to the door, so every gate has to be opened.",
    ],
    [
      "How to open one",
      "Walk into it. It asks a maths question; type the answer and the gate swings aside. You have to be standing at a gate to work on it, so the walking matters. The next one to deal with is always ringed in red.",
    ],
    [
      "Getting it wrong",
      "Costs nothing. No attempt limit and no penalty — the gate tells you how to think about the question and you try again.",
    ],
    ["The clock", TIMEOUT_RULE],
    [
      "Five rooms",
      "Arithmetic, then fractions, algebra, logic and geometry. Each one is a bigger maze with more time on it.",
    ],
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How to play Equation Escape"
        className="max-h-[88vh] w-[min(34rem,100%)] overflow-y-auto rounded-2xl border border-white/15 bg-[#0c1322] p-6 shadow-2xl"
      >
        <h2 className="text-xl font-extrabold text-slate-50">How to play</h2>
        <p className="mt-1 text-sm text-slate-300">
          Get out of five mazes. The locks are maths questions.
        </p>

        <dl className="mt-4 space-y-3">
          {rules.map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm font-bold text-cyan-200">{k}</dt>
              <dd className="text-sm leading-relaxed text-slate-300">{v}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-5 w-full rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-cyan-950 transition-colors hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Got it — let me in
        </button>
      </div>
    </div>
  );
}
