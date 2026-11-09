"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell, Panel, Stat } from "../game-shell";
import { saveGameAction } from "@/lib/actions/arcade-actions";
import {
  DIFFICULTIES,
  DIFFICULTY_SPECS,
  DIGITS,
  MAX_HINTS,
  OPERATORS,
  OPERATOR_LABEL,
  attemptsLeft,
  checkGuess,
  evaluate,
  keypadState,
  newGame,
  pretty,
  scoreGame,
  submit,
  takeHint,
  xpForGame,
  type Difficulty,
  type Feedback,
  type Game,
  type Mark,
  type Mode,
} from "@/lib/games/mathler";

/**
 * Codebreaker.
 *
 * The rules are in src/lib/games/mathler.ts and verified by
 * scripts/check-games.ts. What this file has to get right is making the
 * submission rule feel like a feature rather than an obstruction.
 *
 * A guess is only accepted if it is a valid calculation equal to the target.
 * That is the whole game — it is what forces real arithmetic out of every
 * attempt — but a rule that silently refuses input is indistinguishable from
 * a broken text box. So the running total of whatever the player has typed is
 * shown live underneath the row, next to the target, and a refusal always
 * says exactly which rule it broke ("That comes to 37, not 42", "You can't
 * divide by zero"). The player should always know why the button is grey.
 */

const MODES: Record<Mode, { name: string; blurb: string }> = {
  daily: { name: "Daily", blurb: "Today's calculation. The same one for everybody." },
  endless: { name: "Endless", blurb: "A new calculation every time. Build a streak." },
  timed: { name: "Timed", blurb: "Three minutes on the clock." },
};

const TIMED_SECONDS = 180;

export function CodebreakerGame({
  seed,
  dayKey,
  bests,
  stats,
}: {
  seed: number;
  dayKey: string;
  bests: Record<string, number>;
  stats: {
    plays: number;
    wins: number;
    bestStreak: number;
    streak: number;
    winAttempts: number;
  };
}) {
  const [mode, setMode] = useState<Mode>("daily");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [round, setRound] = useState(0);

  const spec = DIFFICULTY_SPECS[difficulty];
  const variant = `${mode}-${difficulty}`;

  const makeGame = useCallback(
    (m: Mode, d: Difficulty, r: number): Game =>
      newGame({
        difficulty: d,
        mode: m,
        seed: ((seed ^ Math.imul(r + 1, 2246822519)) | 0) || 1,
        dayKey,
      }),
    [dayKey, seed],
  );

  const [game, setGame] = useState<Game>(() => makeGame("daily", "medium", 0));
  const [entry, setEntry] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TIMED_SECONDS);
  const [streak, setStreak] = useState(stats.streak);
  const [bestStreak, setBestStreak] = useState(stats.bestStreak);
  const [bestMap, setBestMap] = useState(bests);
  const [sessionWins, setSessionWins] = useState(0);
  const [sessionPlays, setSessionPlays] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [earned, setEarned] = useState<{ points: number; xp: number } | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  const playing = game.status === "playing";
  const savedRef = useRef(false);

  const start = useCallback(
    (next: { mode?: Mode; difficulty?: Difficulty }) => {
      const m = next.mode ?? mode;
      const d = next.difficulty ?? difficulty;
      const r = round + 1;
      setRound(r);
      setMode(m);
      setDifficulty(d);
      setGame(makeGame(m, d, r));
      setEntry("");
      setSecondsLeft(TIMED_SECONDS);
      setEarned(null);
      setSaveNote(null);
      setNudge(null);
      savedRef.current = false;
    },
    [difficulty, makeGame, mode, round],
  );

  // ---------------------------------------------------------------------------
  // Finishing
  // ---------------------------------------------------------------------------

  const settle = useCallback(
    (finished: Game) => {
      if (savedRef.current) return;
      savedRef.current = true;

      const won = finished.status === "won";
      const points = scoreGame(finished);
      const xp = xpForGame(finished);
      const nextStreak = won ? streak + 1 : 0;

      setEarned({ points, xp });
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setSessionPlays((n) => n + 1);
      if (won) {
        setSessionWins((n) => n + 1);
        setSessionAttempts((n) => n + finished.guesses.length);
      }
      setBestMap((m) => ({ ...m, [variant]: Math.max(m[variant] ?? 0, points) }));

      saveGameAction({
        game: "CODEBREAKER",
        variant,
        score: points,
        won,
        xp,
        streak: nextStreak,
        bestStreak: Math.max(bestStreak, nextStreak),
        attempts: won ? finished.guesses.length : undefined,
      })
        .then((res) => {
          if (!res.ok) setSaveNote(res.error);
          else if (res.result.wasDaily) setSaveNote("Daily challenge — XP boosted.");
        })
        .catch(() => setSaveNote("Couldn't save your result."));
    },
    [bestStreak, streak, variant],
  );

  // ---------------------------------------------------------------------------
  // Guessing
  // ---------------------------------------------------------------------------

  const refuse = useCallback((reason: string) => {
    setNudge(reason);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 420);
  }, []);

  const commitGuess = useCallback(() => {
    if (!playing) return;
    const verdict = checkGuess(entry, spec.length, game.target);
    if (!verdict.ok) {
      refuse(verdict.reason);
      return;
    }
    const next = submit(game, entry);
    if (next === game) return;
    setGame(next);
    setEntry("");
    setNudge(null);
    if (next.status !== "playing") settle(next);
  }, [entry, game, playing, refuse, settle, spec.length]);

  const pushChar = useCallback(
    (c: string) => {
      if (!playing) return;
      setNudge(null);
      setEntry((e) => (e.length >= spec.length ? e : e + c));
    },
    [playing, spec.length],
  );

  const popChar = useCallback(() => setEntry((e) => e.slice(0, -1)), []);

  const useHint = useCallback(() => {
    if (!playing || game.hintsUsed >= MAX_HINTS) return;
    setGame((g) => takeHint(g));
  }, [game.hintsUsed, playing]);

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------

  const handlers = useRef({ pushChar, popChar, commitGuess });
  useEffect(() => {
    handlers.current = { pushChar, popChar, commitGuess };
  }, [pushChar, popChar, commitGuess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // × and ÷ are shown but not typeable, so * and / are accepted as-is and
      // x is taken as a multiplication sign too — it is what people reach for.
      const typed = e.key === "x" || e.key === "X" ? "*" : e.key;
      if (/^[0-9+\-*/]$/.test(typed)) {
        e.preventDefault();
        handlers.current.pushChar(typed);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handlers.current.popChar();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handlers.current.commitGuess();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------------------------------------------------------------------------
  // The clock
  // ---------------------------------------------------------------------------

  const secondsRef = useRef(TIMED_SECONDS);
  const expiryRef = useRef<() => void>(() => {});
  useEffect(() => {
    expiryRef.current = () => {
      const lost: Game = { ...game, status: "lost" };
      setGame(lost);
      settle(lost);
    };
  }, [game, settle]);

  useEffect(() => {
    if (mode !== "timed" || !playing) return;
    secondsRef.current = secondsLeft;
    const t = window.setInterval(() => {
      secondsRef.current = Math.max(0, secondsRef.current - 1);
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current === 0) {
        window.clearInterval(t);
        expiryRef.current();
      }
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, playing, round]);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  /** What the half-typed row currently comes to, shown live. */
  const running = useMemo(() => {
    if (entry.length === 0) return null;
    const r = evaluate(entry);
    return r.ok ? r.value : null;
  }, [entry]);

  const keys = useMemo(() => keypadState(game.guesses), [game.guesses]);

  const revealed = useMemo(() => {
    const out = new Map<number, string>();
    for (const i of game.revealed) out.set(i, game.secret[i]);
    return out;
  }, [game.revealed, game.secret]);

  const plays = stats.plays + sessionPlays;
  const wins = stats.wins + sessionWins;
  const winRate = plays > 0 ? Math.round((wins / plays) * 100) : null;
  const attemptsTotal = stats.winAttempts + sessionAttempts;
  const averageAttempts = wins > 0 && attemptsTotal > 0 ? Math.round((attemptsTotal / wins) * 10) / 10 : null;
  const left = attemptsLeft(game);
  const complete = entry.length === spec.length;
  const matches = running !== null && running === game.target;

  return (
    <GameShell
      title="Codebreaker"
      eyebrow={MODES[mode].blurb}
      accent={{ from: "#a78bfa", to: "#ec4899" }}
      aside={
        <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => start({ mode: m })}
              aria-pressed={mode === m}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                mode === m
                  ? "bg-violet-400 text-violet-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {MODES[m].name}
            </button>
          ))}
        </div>
      }
    >
      {/* ------------------------------------------------------------------- */}
      {/* The goal */}
      {/* ------------------------------------------------------------------- */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-violet-300/30 bg-violet-300/[0.07] px-5 py-4 text-center">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-300">
            Find a calculation that makes
          </div>
          <div className="font-mono text-4xl font-black leading-tight text-white">{game.target}</div>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-slate-300">
          {spec.length} characters, using digits and <b className="text-slate-100">+ − × ÷</b>. Every
          guess has to equal {game.target} — that is what the marks are paid for.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2">
            <Stat label="Guesses" value={`${left}/${spec.attempts}`} tone={left <= 2 ? "hot" : "plain"} />
            <Stat label="Streak" value={streak} tone={streak >= 3 ? "hot" : "plain"} />
            <Stat label="Best" value={(bestMap[variant] ?? 0).toLocaleString()} />
            <Stat
              label={mode === "timed" ? "Time" : "Length"}
              value={
                mode === "timed"
                  ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
                  : spec.length
              }
              tone={mode === "timed" && secondsLeft <= 20 ? "hot" : "plain"}
            />
          </div>

          <Panel className="relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
              <div
                className="h-px w-1/3 bg-gradient-to-r from-transparent via-violet-300 to-transparent"
                style={{ animation: "arcade-sweep 3.4s linear infinite" }}
              />
            </div>

            {/* The guess log. */}
            <div className="flex flex-col items-center gap-1.5">
              {game.guesses.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">
                  Type a calculation and press Enter. It has to come to {game.target}.
                </p>
              ) : null}
              {game.guesses.map((g, i) => (
                <GuessRow key={i} text={g.text} feedback={g.feedback} />
              ))}
            </div>

            {/* The row being typed. */}
            <div className={["mt-4 border-t border-white/10 pt-4", shaking ? "arcade-shake" : ""].join(" ")}>
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({ length: spec.length }, (_, i) => {
                  const c = entry[i];
                  const hint = revealed.get(i);
                  return (
                    <div
                      key={i}
                      className={[
                        "flex h-13 w-11 items-center justify-center rounded-xl border-2 font-mono text-2xl font-extrabold transition-colors sm:h-14 sm:w-12",
                        c !== undefined
                          ? "border-violet-300/70 bg-violet-400/15 text-white"
                          : i === entry.length && playing
                            ? "border-violet-300/60 bg-white/[0.04]"
                            : "border-white/10 bg-white/[0.03]",
                      ].join(" ")}
                    >
                      {c !== undefined ? (
                        <span className="arcade-pop">{OPERATOR_LABEL[c] ?? c}</span>
                      ) : hint !== undefined ? (
                        // A hinted character is shown faintly in its own slot,
                        // which is where it is needed — a hint listed off to
                        // one side has to be held in the head.
                        <span className="text-lg text-amber-300/70">{OPERATOR_LABEL[hint] ?? hint}</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* The live total. This is the player's working, and showing it
                  is what turns the equals-the-target rule from an obstacle
                  into the thing they are steering by. */}
              <p className="mt-2 text-center text-sm" aria-live="polite">
                {entry.length === 0 ? (
                  <span className="text-slate-500">Needs to come to {game.target}.</span>
                ) : running === null ? (
                  <span className="text-slate-500">…</span>
                ) : (
                  <span className={matches ? "font-bold text-emerald-300" : "text-slate-400"}>
                    {pretty(entry)} = {running}
                    {matches ? " ✓" : ` · needs ${game.target}`}
                  </span>
                )}
              </p>

              {nudge ? (
                <p className="mt-1 text-center text-xs font-semibold text-amber-300">{nudge}</p>
              ) : null}

              {/* Keypad. Operators are a separate row so they read as a
                  different kind of thing from the digits. */}
              <div className="mx-auto mt-4 grid max-w-sm grid-cols-5 gap-2">
                {DIGITS.map((d) => (
                  <Key key={d} char={d} state={keys[d]} onPress={pushChar} disabled={!playing || complete} />
                ))}
              </div>
              <div className="mx-auto mt-2 grid max-w-sm grid-cols-4 gap-2">
                {OPERATORS.map((o) => (
                  <Key key={o} char={o} state={keys[o]} onPress={pushChar} disabled={!playing || complete} />
                ))}
              </div>

              <div className="mx-auto mt-2 flex max-w-sm gap-2">
                <button
                  type="button"
                  onClick={popChar}
                  disabled={!playing || entry.length === 0}
                  className="h-11 flex-1 rounded-xl border border-white/15 bg-white/[0.06] text-sm font-bold text-slate-200 transition-colors hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={useHint}
                  disabled={!playing || game.hintsUsed >= MAX_HINTS}
                  title="Reveals one character, and costs points"
                  className="h-11 flex-1 rounded-xl border border-amber-400/40 bg-amber-400/10 text-sm font-bold text-amber-200 transition-colors hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Hint
                  <span className="ml-1 font-mono text-xs">{MAX_HINTS - game.hintsUsed}</span>
                </button>
                <button
                  type="button"
                  onClick={commitGuess}
                  disabled={!playing || entry.length === 0}
                  className="h-11 flex-[1.4] rounded-xl bg-violet-400 text-sm font-bold text-violet-950 transition-colors hover:bg-violet-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* The verdict. */}
            {!playing ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1020]/80 p-5 text-center">
                <div
                  className={[
                    "text-xs font-bold uppercase tracking-[0.2em]",
                    game.status === "won" ? "text-emerald-300" : "text-rose-300",
                  ].join(" ")}
                >
                  {game.status === "won"
                    ? `Cracked in ${game.guesses.length}`
                    : secondsLeft === 0 && mode === "timed"
                      ? "Out of time"
                      : "Out of guesses"}
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {[...game.secret].map((c, i) => (
                    <span
                      key={i}
                      className="arcade-pop flex h-12 w-10 items-center justify-center rounded-xl bg-emerald-400/90 font-mono text-xl font-extrabold text-emerald-950"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {OPERATOR_LABEL[c] ?? c}
                    </span>
                  ))}
                  <span className="ml-1 font-mono text-xl font-bold text-slate-300">= {game.target}</span>
                </div>
                {earned ? (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-bold">
                      {earned.points.toLocaleString()} points
                    </span>
                    <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-bold text-amber-200">
                      +{earned.xp} XP
                    </span>
                    {game.status === "won" && streak >= 2 ? (
                      <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-bold text-emerald-200">
                        {streak} in a row
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => start({})}
                  className="mt-4 rounded-xl bg-violet-400 px-5 py-2.5 text-sm font-bold text-violet-950 transition-colors hover:bg-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {mode === "daily" ? "Try today's again" : "New calculation"}
                </button>
                {mode === "daily" ? (
                  <p className="mt-2 text-xs text-slate-400">
                    Everyone gets this same calculation today. Switch to Endless for a fresh one.
                  </p>
                ) : null}
                {saveNote ? <p className="mt-2 text-xs text-slate-400">{saveNote}</p> : null}
              </div>
            ) : null}
          </Panel>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Side column */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex flex-col gap-4">
          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Length</h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => start({ difficulty: d })}
                  aria-pressed={difficulty === d}
                  className={[
                    "rounded-xl border px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                    difficulty === d
                      ? "border-violet-300/60 bg-violet-400/15"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.09]",
                  ].join(" ")}
                >
                  <div className="text-sm font-bold text-slate-100">{DIFFICULTY_SPECS[d].name}</div>
                  <div className="font-mono text-[11px] text-slate-400">
                    {DIFFICULTY_SPECS[d].length} chars · {DIFFICULTY_SPECS[d].attempts} tries
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              How to play
            </h2>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">
              <li>
                Find the hidden calculation that makes the target. It is exactly {spec.length}{" "}
                characters long.
              </li>
              <li>
                <b className="text-slate-100">Every guess must equal the target.</b> You cannot
                fish — each attempt is a real piece of arithmetic, and that is what earns you a
                clue.
              </li>
              <li>Normal order of operations: × and ÷ before + and −.</li>
              <li>Division has to come out exactly. No remainders, no dividing by zero.</li>
            </ul>
            <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Pip kind="exact" />
                <span>Right character, right place.</span>
              </div>
              <div className="flex items-center gap-2">
                <Pip kind="misplaced" />
                <span>Right character, wrong place.</span>
              </div>
              <div className="flex items-center gap-2">
                <Pip kind="absent" />
                <span>Not in the calculation.</span>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Statistics
            </h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              {[
                ["Played", plays.toLocaleString()],
                ["Win rate", winRate === null ? "—" : `${winRate}%`],
                ["Average tries", averageAttempts === null ? "—" : String(averageAttempts)],
                ["Current streak", String(streak)],
                ["Best streak", String(bestStreak)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-mono font-bold tabular-nums text-slate-100">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}

// ---------------------------------------------------------------------------

const FACE: Record<Mark, string> = {
  exact: "border-emerald-300/70 bg-emerald-400/20 text-emerald-100",
  misplaced: "border-amber-300/70 bg-amber-400/20 text-amber-100",
  absent: "border-white/10 bg-white/[0.03] text-slate-500",
};

function Pip({ kind }: { kind: Mark }) {
  const cls = {
    exact: "bg-emerald-400 border-emerald-200",
    misplaced: "bg-amber-400 border-amber-200",
    absent: "bg-slate-600 border-slate-500",
  }[kind];
  return <span className={`h-3.5 w-3.5 shrink-0 rounded-full border ${cls}`} />;
}

function Key({
  char,
  state,
  onPress,
  disabled,
}: {
  char: string;
  state?: Mark;
  onPress: (c: string) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onPress(char)}
      disabled={disabled}
      aria-label={char === "*" ? "times" : char === "/" ? "divide" : char}
      className={[
        "h-11 rounded-xl border font-mono text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        state ? FACE[state] : "border-white/15 bg-white/[0.06] text-slate-100 hover:bg-white/[0.14]",
      ].join(" ")}
    >
      {OPERATOR_LABEL[char] ?? char}
    </button>
  );
}

function GuessRow({ text, feedback }: { text: string; feedback: Feedback }) {
  return (
    <div className="flex gap-1.5">
      {[...text].map((c, i) => (
        <span
          key={i}
          className={[
            "arcade-pop flex h-11 w-10 items-center justify-center rounded-lg border font-mono text-lg font-bold",
            FACE[feedback.marks[i]],
          ].join(" ")}
          style={{ animationDelay: `${i * 55}ms` }}
        >
          {OPERATOR_LABEL[c] ?? c}
        </span>
      ))}
    </div>
  );
}
