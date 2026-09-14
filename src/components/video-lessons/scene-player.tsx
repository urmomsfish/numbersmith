"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { Scene } from "@/lib/video-lessons/types";
import { DiagramRenderer } from "@/components/video-lessons/diagrams";
import { markVideoLessonCompleteAction } from "@/lib/actions/video-lesson-actions";

const TONE_BADGE: Record<Scene["type"], { label: string; tone: "brand" | "success" | "warning" | "slate" }> = {
  title: { label: "Intro", tone: "slate" },
  text: { label: "Concept", tone: "brand" },
  example: { label: "Worked Example", tone: "success" },
  strategy: { label: "Competition Strategy", tone: "brand" },
  pitfall: { label: "Common Pitfall", tone: "warning" },
  practice: { label: "Practice Problem", tone: "success" },
  summary: { label: "Recap", tone: "slate" },
};

const TICK_MS = 50;
// How long the answer stays hidden on a practice scene, giving the learner
// a real chance to solve it before it's shown.
const ANSWER_REVEAL_MS = 5000;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sceneWords(scene: Scene): number {
  let text = scene.heading;
  if (scene.type === "title") text += " " + scene.sub;
  if (scene.type === "example" || scene.type === "practice") text += " " + scene.prompt;
  if (scene.type === "practice") text += " " + scene.answer;
  if ("bullets" in scene) text += " " + scene.bullets.join(" ");
  return wordCount(text);
}

// Generous, reading-paced durations (~150 words/min) rather than a brisk
// slideshow-advance rate — the goal is time to actually read, not just see.
function sceneDurationMs(scene: Scene): number {
  const hasDiagram = "diagram" in scene && !!scene.diagram;
  const readingMs = sceneWords(scene) * 420;
  if (scene.type === "practice") {
    const raw = 1800 + wordCount(scene.prompt) * 420 + ANSWER_REVEAL_MS + wordCount(scene.answer) * 420 + 2000;
    return Math.min(20000, Math.max(ANSWER_REVEAL_MS + 4000, raw));
  }
  const raw = 2200 + readingMs + (hasDiagram ? 2200 : 0);
  return Math.min(16000, Math.max(4200, raw));
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}
function IconPause({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function IconReplay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function ScenePlayer({
  videoLessonId,
  scenes,
  alreadyCompleted,
}: {
  videoLessonId: string;
  scenes: Scene[];
  alreadyCompleted: boolean;
}) {
  const router = useRouter();
  const durations = useMemo(() => scenes.map(sceneDurationMs), [scenes]);
  const sceneStarts = useMemo(
    () =>
      durations.reduce<{ starts: number[]; sum: number }>(
        (acc, d) => ({ starts: [...acc.starts, acc.sum], sum: acc.sum + d }),
        { starts: [], sum: 0 }
      ).starts,
    [durations]
  );
  const total = useMemo(() => durations.reduce((a, b) => a + b, 0), [durations]);

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [pending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const markedRef = useRef(alreadyCompleted);

  const scene = scenes[index];
  const isLast = index === scenes.length - 1;
  const badge = TONE_BADGE[scene.type];

  function markCompleteOnce() {
    if (markedRef.current) return;
    markedRef.current = true;
    startTransition(async () => {
      await markVideoLessonCompleteAction({ videoLessonId });
      setCompleted(true);
      router.refresh();
    });
  }

  useEffect(() => {
    if (isLast) markCompleteOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast]);

  useEffect(() => {
    if (!playing || finished || scrubbing) return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + TICK_MS;
        if (next >= durations[index]) {
          if (index === scenes.length - 1) {
            setPlaying(false);
            setFinished(true);
            return durations[index];
          }
          setIndex((i) => i + 1);
          setAnswerRevealed(false);
          return 0;
        }
        // On a practice scene, reveal the answer after ANSWER_REVEAL_MS and
        // pause right there — the learner gets the answer, then unlimited
        // time to sit with it instead of getting swept into the next scene.
        if (scene.type === "practice" && !answerRevealed && next >= ANSWER_REVEAL_MS) {
          setAnswerRevealed(true);
          setPlaying(false);
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, finished, scrubbing, index, durations, scenes.length, scene.type, answerRevealed]);

  function seekTo(ms: number) {
    const clamped = Math.max(0, Math.min(total - 1, ms));
    let i = sceneStarts.length - 1;
    for (let s = 0; s < sceneStarts.length; s++) {
      if (sceneStarts[s] <= clamped) i = s;
    }
    setFinished(false);
    setIndex(i);
    setElapsed(clamped - sceneStarts[i]);
    setAnswerRevealed(false);
  }

  function togglePlay() {
    if (finished) {
      setFinished(false);
      setIndex(0);
      setElapsed(0);
      setAnswerRevealed(false);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }

  const elapsedTotal = sceneStarts[index] + elapsed;

  return (
    <div className="dark">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-xl shadow-black/30">
        <div className="px-5 pt-5 sm:px-8 sm:pt-8">
          <div
            key={index}
            className="min-h-[280px] animate-[scene-in_0.35s_ease-out] sm:min-h-[320px]"
          >
            <Badge tone={badge.tone}>{badge.label}</Badge>
            <h2 className="mt-3 text-xl font-bold text-slate-50 sm:text-2xl">{scene.heading}</h2>

            {scene.type === "title" && <p className="mt-3 text-base leading-relaxed text-slate-300">{scene.sub}</p>}

            {scene.type === "example" && (
              <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">{scene.prompt}</p>
            )}

            {scene.type === "practice" && (
              <div className="mt-3 space-y-3">
                <p className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">{scene.prompt}</p>
                {answerRevealed ? (
                  <p className="animate-[fade-up_0.4s_ease-out] rounded-lg border border-success-500/30 bg-success-500/10 px-3 py-2 text-sm leading-relaxed text-slate-100">
                    <span className="font-semibold text-success-500">Answer: </span>
                    {scene.answer}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-slate-400">
                    Try it yourself — the answer reveals in a few seconds.
                  </p>
                )}
              </div>
            )}

            {"bullets" in scene && (
              <ul className="mt-4 space-y-2">
                {scene.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{ animationDelay: `${i * 220}ms` }}
                    className="flex gap-2.5 text-sm leading-relaxed text-slate-200 opacity-0 animate-[fade-up_0.4s_ease-out_forwards]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {"diagram" in scene && scene.diagram && <DiagramRenderer diagram={scene.diagram} />}
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 bg-black/20">
          <button
            aria-label="Seek"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setScrubbing(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - rect.left) / rect.width;
              seekTo(frac * total);
            }}
            onPointerMove={(e) => {
              if (!scrubbing) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - rect.left) / rect.width;
              seekTo(frac * total);
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              setScrubbing(false);
            }}
            className="group relative block h-3 w-full cursor-pointer touch-none bg-transparent py-[5px]"
          >
            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-white/15" />
            {sceneStarts.slice(1).map((s, i) => (
              <span
                key={i}
                className="pointer-events-none absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-slate-950/60"
                style={{ left: `${(s / total) * 100}%` }}
              />
            ))}
            <span
              className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 bg-brand-500"
              style={{ width: `${(elapsedTotal / total) * 100}%` }}
            />
            <span
              className={cn(
                "pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-brand-400 opacity-0 transition-opacity group-hover:opacity-100",
                scrubbing && "opacity-100"
              )}
              style={{ left: `${(elapsedTotal / total) * 100}%` }}
            />
          </button>

          <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-slate-200"
              >
                {finished ? <IconReplay className="h-4.5 w-4.5" /> : playing ? <IconPause className="h-4.5 w-4.5" /> : <IconPlay className="h-4.5 w-4.5 translate-x-px" />}
              </button>
              <span className="text-xs font-medium tabular-nums text-slate-400">
                {formatTime(elapsedTotal)} / {formatTime(total)}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {pending ? "Saving…" : completed ? "Lesson complete ✓" : `Scene ${index + 1} of ${scenes.length}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
