"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { MathText } from "@/components/math-text";
import type { Scene } from "@/lib/video-lessons/types";
import { DiagramRenderer } from "@/components/video-lessons/diagrams";
import { LessonQuiz, type QuizProblem } from "@/components/video-lessons/lesson-quiz";
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

function IconExpand({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  );
}
function IconCollapse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" />
    </svg>
  );
}

export function ScenePlayer({
  videoLessonId,
  scenes,
  alreadyCompleted,
  quizProblems,
}: {
  videoLessonId: string;
  scenes: Scene[];
  alreadyCompleted: boolean;
  quizProblems: QuizProblem[];
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
  const [fullscreen, setFullscreen] = useState(false);
  const markedRef = useRef(alreadyCompleted);
  const shellRef = useRef<HTMLDivElement>(null);

  const scene = scenes[index];
  const isLast = index === scenes.length - 1;
  const badge = TONE_BADGE[scene.type];
  // Body copy scales up in fullscreen — at arm's length from a projector or a
  // laptop across a desk, 14px is unreadable.
  const bodyText = fullscreen ? "text-lg sm:text-xl" : "text-sm";

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

  // The browser can leave fullscreen without going through our button (Esc,
  // the system control, a tab switch), so the flag is driven by the event
  // rather than by whichever handler last ran.
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
    } catch {
      // Fullscreen can be refused (permissions policy, iOS Safari on non-video
      // elements). Staying inline is a fine outcome; nothing to report.
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        void toggleFullscreen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      <div
        ref={shellRef}
        className={cn(
          "overflow-hidden border border-white/10 bg-slate-950 shadow-xl shadow-black/30",
          fullscreen ? "flex h-full flex-col rounded-none" : "rounded-2xl"
        )}
      >
        <div className={cn("px-5 pt-5 sm:px-8 sm:pt-8", fullscreen && "flex-1 overflow-y-auto px-8 pt-10 sm:px-16")}>
          <div
            key={index}
            className={cn(
              "animate-[scene-in_0.35s_ease-out]",
              fullscreen ? "mx-auto max-w-4xl" : "min-h-[280px] sm:min-h-[320px]"
            )}
          >
            <Badge tone={badge.tone}>{badge.label}</Badge>
            <h2 className={cn("mt-3 font-bold text-slate-50", fullscreen ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl")}>
              <MathText>{scene.heading}</MathText>
            </h2>

            {scene.type === "title" && (
              <p className={cn("mt-3 leading-relaxed text-slate-300", fullscreen ? "text-xl" : "text-base")}>
                <MathText>{scene.sub}</MathText>
              </p>
            )}

            {scene.type === "example" && (
              <p className={cn("mt-3 rounded-lg bg-white/10 px-3 py-2 font-medium text-slate-100", bodyText)}>
                <MathText>{scene.prompt}</MathText>
              </p>
            )}

            {scene.type === "practice" && (
              <div className="mt-3 space-y-3">
                <p className={cn("rounded-lg bg-white/10 px-3 py-2 font-medium text-slate-100", bodyText)}>
                  <MathText>{scene.prompt}</MathText>
                </p>
                {answerRevealed ? (
                  <p
                    className={cn(
                      "animate-[fade-up_0.4s_ease-out] rounded-lg border border-success-500/30 bg-success-500/10 px-3 py-2 leading-relaxed text-slate-100",
                      bodyText
                    )}
                  >
                    <span className="font-semibold text-success-500">Answer: </span>
                    <MathText>{scene.answer}</MathText>
                  </p>
                ) : (
                  <p className="text-xs font-medium text-slate-400">
                    Try it yourself — the answer reveals in a few seconds.
                  </p>
                )}
              </div>
            )}

            {"bullets" in scene && (
              <ul className={cn("space-y-2", fullscreen ? "mt-6 space-y-4" : "mt-4")}>
                {scene.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{ animationDelay: `${i * 220}ms` }}
                    className={cn(
                      "flex gap-2.5 leading-relaxed text-slate-200 opacity-0 animate-[fade-up_0.4s_ease-out_forwards]",
                      bodyText
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-full bg-brand-400",
                        fullscreen ? "mt-2.5 h-2 w-2" : "mt-1.5 h-1.5 w-1.5"
                      )}
                    />
                    <MathText>{b}</MathText>
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
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400">
                {pending ? "Saving…" : completed ? "Lesson complete ✓" : `Scene ${index + 1} of ${scenes.length}`}
              </span>
              <button
                onClick={toggleFullscreen}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
              >
                {fullscreen ? <IconCollapse className="h-4 w-4" /> : <IconExpand className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The quiz lives outside the player shell so that entering fullscreen
          shows the lesson alone, and so it stays on the page once revealed. */}
      {!fullscreen && (finished || completed) && quizProblems.length > 0 && (
        <LessonQuiz problems={quizProblems} />
      )}
    </div>
  );
}
