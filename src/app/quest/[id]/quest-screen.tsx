"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ProblemStatement } from "@/components/practice/problem-figure";
import { MathText } from "@/components/math-text";
import {
  strikeAction,
  travelAction,
  takeRelicAction,
  skipRewardAction,
  abandonQuestAction,
} from "@/lib/actions/quest-actions";
import {
  NODE_SPECS,
  RELIC_SPECS,
  REGION_SPECS,
  RELIC_SKIP_GOLD,
  type NodeType,
  type Region,
} from "@/lib/quest-rules";
import { SceneCanvas, type SceneHandle, type Scene } from "./scene-canvas";
import type { QuestView } from "@/lib/engine/quest";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
/** How long a resolved exchange stays up before the next one. */
const BEAT_MS = 1500;

const NODE_GLYPH: Record<NodeType, string> = {
  BATTLE: "⚔",
  ELITE: "☠",
  TREASURE: "◈",
  FORGE: "⚒",
  BOSS: "♛",
};

/**
 * A health bar drawn over the scene.
 *
 * Deliberately heavy — thick, outlined, and sat on a dark plate. A thin
 * Tailwind bar that looked right on a white card disappears entirely against
 * a lit sky, and these two numbers are the whole state of the fight.
 */
function HealthBar({
  value,
  max,
  tone,
  label,
  align = "left",
}: {
  value: number;
  max: number;
  tone: "hero" | "foe";
  label: string;
  align?: "left" | "right";
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          "mb-1 flex items-baseline gap-2",
          align === "right" ? "flex-row-reverse" : "flex-row"
        )}
      >
        <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 drop-shadow">
          {label}
        </span>
        <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/70 drop-shadow">
          {value}/{max}
        </span>
      </div>
      <div
        className={cn(
          "h-3 overflow-hidden rounded-full border border-black/50 bg-black/55 shadow-inner",
          align === "right" && "flex justify-end"
        )}
      >
        <div
          className={cn(
            "h-full transition-[width] duration-500",
            tone === "hero"
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-rose-500 to-red-600"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** A dark glass plate. Every piece of UI floating over the world uses it, so
 * the overlay reads as one layer rather than as scattered boxes. */
const PLATE =
  "rounded-2xl border border-white/15 bg-slate-950/70 shadow-2xl backdrop-blur-md";

export function QuestScreen({ initial }: { initial: QuestView }) {
  const [view, setView] = useState(initial);
  const [verdict, setVerdict] = useState<{
    correct: boolean;
    timedOut: boolean;
    answer: string;
    chosen: string;
  } | null>(null);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    initial.question ? Math.ceil((initial.question.clockMs - initial.question.elapsedMs) / 1000) : 0
  );

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fx = useRef<SceneHandle | null>(null);
  const region = view.state.region as Region;
  const scene = useRef<Scene>({
    mode: view.state.phase === "BATTLE" ? "BATTLE" : "SCENE",
    region,
    palette: REGION_SPECS[region].palette,
    startedAt: 0,
    clockMs: view.question?.clockMs ?? 40000,
    elapsedAtServe: view.question?.elapsedMs ?? 0,
    paused: false,
    art: view.enemy?.art ?? "IMP",
    tier: view.enemy?.tier ?? "COMMON",
    enemyHp: view.enemy?.hp ?? 0,
    enemyMaxHp: view.enemy?.maxHp ?? 1,
    heroHp: view.state.hp,
    heroMaxHp: view.state.maxHp,
    combo: view.state.combo,
  });

  const settled = useRef(false);

  const apply = useCallback((next: QuestView) => {
    setView(next);
    const s = scene.current;
    const r = next.state.region as Region;
    s.mode = next.state.phase === "BATTLE" ? "BATTLE" : "SCENE";
    s.region = r;
    s.palette = REGION_SPECS[r].palette;
    s.enemyHp = next.enemy?.hp ?? 0;
    s.enemyMaxHp = next.enemy?.maxHp ?? 1;
    if (next.enemy) {
      s.art = next.enemy.art;
      s.tier = next.enemy.tier;
    }
    s.heroHp = next.state.hp;
    s.heroMaxHp = next.state.maxHp;
    s.combo = next.state.combo;
    if (next.question) {
      s.clockMs = next.question.clockMs;
      s.elapsedAtServe = next.question.elapsedMs;
      s.startedAt = Date.now();
      s.paused = false;
      setSecondsLeft(Math.ceil((next.question.clockMs - next.question.elapsedMs) / 1000));
    }
  }, []);

  // Seeded in an effect, never during render: reading the clock while
  // rendering is impure and drifts on any re-render.
  useEffect(() => {
    scene.current.startedAt = Date.now();
  }, []);

  const question = view.question;

  const submit = useCallback(
    async (answer: string) => {
      if (settled.current || !question) return;
      settled.current = true;
      scene.current.paused = true;

      const res = await strikeAction({
        runId: view.state.runId,
        problemId: question.problemId,
        answerGiven: answer,
      });
      if (!res.ok) {
        setError(res.error);
        settled.current = false;
        scene.current.paused = false;
        return;
      }

      const r = res.result;
      if (r.correct) fx.current?.heroStrike(r.dealt);
      else fx.current?.enemyStrike(r.taken, r.blocked);
      if (r.enemyDown) setTimeout(() => fx.current?.enemyDown(), 280);

      setVerdict({ correct: r.correct, timedOut: r.timedOut, answer: r.correctAnswer, chosen: answer });
      scene.current.enemyHp = r.view.enemy?.hp ?? 0;
      scene.current.heroHp = r.view.state.hp;

      setTimeout(() => {
        setVerdict(null);
        setTyped("");
        apply(r.view);
        settled.current = false;
      }, BEAT_MS);
    },
    [question, view.state.runId, apply]
  );

  useEffect(() => {
    if (!question || verdict || view.state.phase !== "BATTLE") return;
    const t = setInterval(() => {
      const s = scene.current;
      if (!s.startedAt) return;
      const left = s.clockMs - (s.elapsedAtServe + (Date.now() - s.startedAt));
      if (left <= 0) {
        clearInterval(t);
        setSecondsLeft(0);
        void submit("");
      } else setSecondsLeft(Math.ceil(left / 1000));
    }, 100);
    return () => clearInterval(t);
  }, [question, verdict, view.state.phase, submit]);

  useEffect(() => {
    if (!question || verdict || question.choices.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && i < question.choices.length && !question.struck.includes(LETTERS[i])) {
        void submit(LETTERS[i]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, verdict, submit]);

  const act = useCallback(
    async (fn: () => Promise<{ ok: true; view: QuestView } | { ok: false; error: string }>) => {
      setBusy(true);
      const res = await fn();
      setBusy(false);
      if (!res.ok) setError(res.error);
      else {
        setError(null);
        apply(res.view);
      }
    },
    [apply]
  );

  const { state, enemy } = view;
  const over = state.phase === "WON" || state.phase === "OVER";

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      {reducedMotion ? (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${REGION_SPECS[region].palette.skyTop}, ${REGION_SPECS[region].palette.skyBottom})`,
          }}
        />
      ) : (
        <SceneCanvas scene={scene} handle={fx} className="absolute inset-0 h-full w-full" />
      )}

      {/* ---- top banner ---------------------------------------------- */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start gap-3 p-3 sm:p-4">
        <div className={cn(PLATE, "px-3 py-2")}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
            {state.regionName}
          </p>
          <p className="text-[11px] text-white/70">
            Step {Math.min(state.stepIndex + 1, state.roadLength)} of {state.roadLength}
          </p>
        </div>

        <div className={cn(PLATE, "ml-auto flex items-center gap-3 px-3 py-2")}>
          <span className="text-lg font-extrabold tabular-nums">{state.score.toLocaleString()}</span>
          <span className="text-sm font-bold tabular-nums text-amber-400">{state.gold}g</span>
          {state.combo > 1 && (
            <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[11px] font-extrabold text-slate-950">
              {state.combo}×
            </span>
          )}
          <Link
            href="/arcade"
            className="rounded-md px-1.5 text-white/55 transition hover:text-white"
            title="Leave"
            aria-label="Leave the quest"
          >
            ✕
          </Link>
        </div>
      </div>

      {/* relics, down the left edge */}
      {state.relics.length > 0 && (
        <div className="absolute left-3 top-20 z-10 flex flex-col gap-1.5 sm:left-4 sm:top-24">
          {state.relics.map((r) => {
            const spec = RELIC_SPECS[r as keyof typeof RELIC_SPECS];
            if (!spec) return null;
            return (
              <span
                key={r}
                title={`${spec.name} — ${spec.blurb}`}
                className={cn(PLATE, "flex h-9 w-9 items-center justify-center text-base text-amber-300")}
              >
                {spec.glyph}
              </span>
            );
          })}
        </div>
      )}

      {/* ---- combatant bars ------------------------------------------- */}
      {state.phase === "BATTLE" && enemy && (
        <div className="absolute inset-x-0 top-[4.75rem] z-10 flex items-end gap-3 px-3 sm:top-24 sm:px-6">
          <div className={cn(PLATE, "flex max-w-[16rem] flex-1 px-3 py-2")}>
            <HealthBar value={state.hp} max={state.maxHp} tone="hero" label="You" />
          </div>
          <div
            className={cn(
              PLATE,
              "px-3 py-1.5 text-xl font-extrabold tabular-nums",
              secondsLeft <= Math.max(5, question!.clockMs / 4000) ? "text-rose-400" : "text-white"
            )}
          >
            {secondsLeft}s
          </div>
          <div className={cn(PLATE, "flex max-w-[16rem] flex-1 px-3 py-2")}>
            <HealthBar value={enemy.hp} max={enemy.maxHp} tone="foe" label={enemy.name} align="right" />
          </div>
        </div>
      )}

      {state.phase === "BATTLE" && enemy && enemy.tier !== "COMMON" && (
        <div className="pointer-events-none absolute inset-x-0 top-36 z-10 text-center sm:top-40">
          <span className="rounded-full bg-rose-600 px-4 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-lg">
            {enemy.tier === "BOSS" ? "Warden" : "Champion"}
          </span>
        </div>
      )}

      {/* ---- the question, along the bottom --------------------------- */}
      {state.phase === "BATTLE" && question && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
          <div
            className={cn(
              PLATE,
              "mx-auto max-w-3xl p-4 transition-colors sm:p-5",
              verdict && (verdict.correct ? "border-emerald-400/70" : "border-rose-500/70")
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
              <span>{question.topicName}</span>
              <span aria-hidden>·</span>
              <span>Difficulty {question.difficulty}</span>
            </div>

            {/* The one place the design gives up on the canvas: the problem is
                real text, because MathText has to render it and a screen
                reader has to reach it. */}
            <div className="[&_*]:!text-white">
              <ProblemStatement
                question={question.question}
                diagram={question.diagram}
                className="!text-base sm:!text-lg"
              />
            </div>

            {question.choices.length === 0 ? (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typed.trim()) void submit(typed.trim());
                }}
              >
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  disabled={!!verdict}
                  autoFocus
                  inputMode="numeric"
                  placeholder="Your answer"
                  aria-label="Your answer"
                  className="flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
                <button
                  type="submit"
                  disabled={!!verdict || !typed.trim()}
                  className="rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-slate-950 transition hover:bg-amber-400 disabled:opacity-40"
                >
                  Strike
                </button>
              </form>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice, i) => {
                  const letter = LETTERS[i];
                  const struck = question.struck.includes(letter);
                  const isKey = verdict?.answer === letter;
                  const chosen = verdict?.chosen === letter;
                  return (
                    <button
                      key={letter}
                      disabled={!!verdict || struck}
                      onClick={() => void submit(letter)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                        struck
                          ? "border-white/10 opacity-25 line-through"
                          : verdict
                            ? isKey
                              ? "border-emerald-400 bg-emerald-400/15"
                              : chosen
                                ? "border-rose-500 bg-rose-500/15"
                                : "border-white/10 opacity-45"
                            : "border-white/20 bg-white/5 hover:border-amber-400 hover:bg-amber-400/10"
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-xs font-extrabold">
                        {letter}
                      </span>
                      <MathText>{choice}</MathText>
                    </button>
                  );
                })}
              </div>
            )}

            {verdict && (
              <p
                className={cn(
                  "mt-3 text-sm font-bold",
                  verdict.correct ? "text-emerald-400" : "text-rose-400"
                )}
                aria-live="polite"
              >
                {verdict.correct ? (
                  "A clean hit."
                ) : (
                  <>
                    {verdict.timedOut ? "It strikes first" : "Your blow goes wide"} — the answer was{" "}
                    <MathText>{verdict.answer}</MathText>.
                  </>
                )}
              </p>
            )}
            {error && <p className="mt-3 text-sm font-semibold text-rose-400">{error}</p>}
          </div>
        </div>
      )}

      {/* ---- the road -------------------------------------------------- */}
      {state.phase === "MAP" && (
        <Overlay>
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: state.roadLength }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm",
                  i < state.stepIndex
                    ? "bg-white/10 text-white/35"
                    : i === state.stepIndex
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                      : "bg-black/40 text-white/40"
                )}
              >
                {i === state.roadLength - 1 ? NODE_GLYPH.BOSS : i < state.stepIndex ? "•" : "○"}
              </span>
            ))}
          </div>
          <div className={cn(PLATE, "p-5 sm:p-6")}>
            <div className="mb-4 flex">
              <HealthBar value={state.hp} max={state.maxHp} tone="hero" label="Your health" />
            </div>
            <h2 className="text-xl font-extrabold">Which way?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {view.choices.map((c, i) => (
                <button
                  key={i}
                  disabled={busy}
                  onClick={() => void act(() => travelAction({ runId: state.runId, option: i }))}
                  className={cn(
                    "rounded-xl border p-4 text-left transition disabled:opacity-50",
                    c.type === "BOSS" || c.type === "ELITE"
                      ? "border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20"
                      : "border-white/20 bg-white/5 hover:border-amber-400 hover:bg-amber-400/10"
                  )}
                >
                  <span className="text-3xl" aria-hidden>
                    {NODE_GLYPH[c.type]}
                  </span>
                  <span className="mt-2 block font-extrabold">{NODE_SPECS[c.type].label}</span>
                  <span className="mt-0.5 block text-xs text-white/60">
                    {c.monsterName ?? NODE_SPECS[c.type].blurb}
                  </span>
                </button>
              ))}
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-rose-400">{error}</p>}
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const res = await abandonQuestAction({ runId: state.runId });
                setBusy(false);
                if (res.ok) setView((v) => ({ ...v, state: { ...res.state, phase: "OVER" } }));
              }}
              className="mt-5 text-xs text-white/40 underline transition hover:text-white/70"
            >
              Abandon the quest
            </button>
          </div>
        </Overlay>
      )}

      {/* ---- spoils ---------------------------------------------------- */}
      {state.phase === "REWARD" && (
        <Overlay>
          <div className={cn(PLATE, "p-5 sm:p-6")}>
            <h2 className="text-xl font-extrabold">Spoils</h2>
            <p className="mt-1 text-sm text-white/65">
              Take one. You can carry six, and what you leave does not come back.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {view.offered.map((r) => {
                const spec = RELIC_SPECS[r];
                return (
                  <button
                    key={r}
                    disabled={busy}
                    onClick={() => void act(() => takeRelicAction({ runId: state.runId, relic: r }))}
                    className="rounded-xl border border-white/20 bg-white/5 p-4 text-left transition hover:border-amber-400 hover:bg-amber-400/10 disabled:opacity-50"
                  >
                    <span className="text-3xl text-amber-300" aria-hidden>
                      {spec.glyph}
                    </span>
                    <span className="mt-2 block font-extrabold">{spec.name}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-white/60">
                      {spec.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
            {view.offered.length === 0 && (
              <p className="mt-4 text-sm text-white/65">
                Your pack is full. Nothing here will fit — take the coin instead.
              </p>
            )}
            {/* Always present, so a reward can never be a screen whose only
                button does nothing. */}
            <button
              disabled={busy}
              onClick={() => void act(() => skipRewardAction({ runId: state.runId }))}
              className="mt-5 w-full rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
            >
              Leave it — take {RELIC_SKIP_GOLD} gold
            </button>
            {error && <p className="mt-4 text-sm font-semibold text-rose-400">{error}</p>}
          </div>
        </Overlay>
      )}

      {/* ---- the end --------------------------------------------------- */}
      {over && (
        <Overlay>
          <div className={cn(PLATE, "p-8 text-center")}>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
              {state.phase === "WON" ? "The Forgelands are behind you" : `You fall in ${state.regionName}`}
            </p>
            <p className="mt-3 text-6xl font-extrabold tabular-nums">{state.score.toLocaleString()}</p>
            <dl className="mt-7 grid grid-cols-3 gap-3">
              {[
                ["Reached", `${state.regionIndex}-${Math.min(state.stepIndex + 1, state.roadLength)}`],
                ["Accuracy", `${state.answered ? Math.round((state.correct / state.answered) * 100) : 0}%`],
                ["Gold", String(state.gold)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 p-3">
                  <dt className="text-[10px] uppercase tracking-wide text-white/50">{k}</dt>
                  <dd className="text-lg font-extrabold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-col gap-2">
              <Link
                href="/arcade"
                className="rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-slate-950 transition hover:bg-amber-400"
              >
                New quest
              </Link>
              {state.correct < state.answered && (
                <Link
                  href="/mistakes"
                  className="rounded-xl border border-white/25 px-6 py-3 font-semibold transition hover:bg-white/10"
                >
                  Review what I missed
                </Link>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

/** Centres a panel over the world, with room for the top banner. */
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto p-4 pt-28">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
}
