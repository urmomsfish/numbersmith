"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
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
  summary: { label: "Recap", tone: "slate" },
};

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
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [pending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(alreadyCompleted);

  const scene = scenes[index];
  const isLast = index === scenes.length - 1;
  const badge = TONE_BADGE[scene.type];

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [index]);

  function go(next: number) {
    if (next < 0 || next >= scenes.length) return;
    setIndex(next);
    if (next === scenes.length - 1 && !completed) {
      startTransition(async () => {
        await markVideoLessonCompleteAction({ videoLessonId });
        setCompleted(true);
        router.refresh();
      });
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {scenes.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to step ${i + 1}`}
            onClick={() => go(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= index ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Step {index + 1} of {scenes.length}
      </p>

      <div
        key={animKey}
        className="mt-4 animate-[scene-in_0.35s_ease-out] rounded-2xl border border-slate-200 bg-card p-6 sm:p-8 dark:border-slate-700"
      >
        <Badge tone={badge.tone}>{badge.label}</Badge>
        <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">{scene.heading}</h2>

        {scene.type === "title" && (
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">{scene.sub}</p>
        )}

        {scene.type === "example" && (
          <p className="mt-3 rounded-lg bg-background px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {scene.prompt}
          </p>
        )}

        {"bullets" in scene && (
          <ul className="mt-4 space-y-2">
            {scene.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {"diagram" in scene && scene.diagram && <DiagramRenderer diagram={scene.diagram} />}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0}>
          ← Back
        </Button>
        {!isLast ? (
          <Button onClick={() => go(index + 1)}>Next →</Button>
        ) : (
          <span className="text-sm font-semibold text-success-600 dark:text-success-400">
            {pending ? "Saving…" : completed ? "Lesson complete ✓" : "Complete"}
          </span>
        )}
      </div>

      <div className="mt-3 text-center">
        <ProgressBar value={index + 1} max={scenes.length} className="mx-auto max-w-xs" tone="brand" />
      </div>
    </div>
  );
}
