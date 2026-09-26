"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { saveScratchAction, clearScratchAction } from "@/lib/actions/scratch-actions";

/**
 * A place to do the working, beside the problem.
 *
 * Deliberately a raster canvas rather than a stroke model: the only consumers
 * are redisplay and Smith AI, both of which want a picture, and a PNG avoids a
 * row per stroke.
 *
 * Saving is debounced rather than on every stroke — a student sketching draws
 * dozens of segments a second, and a request per segment would be both useless
 * and expensive. It saves on a pause and on unmount, which is when the working
 * is actually worth keeping.
 */

const SAVE_DEBOUNCE_MS = 1200;
const STROKE_WIDTH = 2;

export function ScratchCanvas({
  problemId,
  initialData,
  className,
}: {
  problemId: string;
  initialData?: string | null;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  /** Sizes the bitmap to its rendered box, accounting for device pixel ratio —
   * without this a retina screen draws at half resolution and the saved image
   * comes back blurry. Restores any existing drawing afterwards, since resizing
   * a canvas clears it. */
  const fit = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const prev = c.width > 0 ? c.toDataURL() : null;
    c.width = Math.round(rect.width * dpr);
    c.height = Math.round(rect.height * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = STROKE_WIDTH;
    // currentColor would not survive into the PNG, so read the resolved value.
    ctx.strokeStyle = getComputedStyle(c).color;
    if (prev) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = prev;
    }
  }, []);

  useEffect(() => {
    fit();
    const c = canvasRef.current;
    if (!c) return;
    if (initialData) {
      const ctx = c.getContext("2d");
      const rect = c.getBoundingClientRect();
      const img = new Image();
      img.onload = () => ctx?.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = initialData;
    }
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit, initialData]);

  const save = useCallback(async () => {
    const c = canvasRef.current;
    if (!c || !dirty.current) return;
    dirty.current = false;
    setStatus("saving");
    const res = await saveScratchAction({ problemId, data: c.toDataURL("image/png") });
    if (res.ok) {
      setStatus("saved");
      setErrorText(null);
    } else {
      setStatus("error");
      setErrorText(res.error);
    }
  }, [problemId]);

  // Save whatever is on the canvas when the component goes away — navigating
  // to the next problem is exactly when a student stops drawing.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      void save();
    };
  }, [save]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    // Capture so a stroke that leaves the canvas still ends cleanly rather
    // than leaving the pen stuck down.
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    dirty.current = true;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(), SAVE_DEBOUNCE_MS);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Scratch work</span>
        <span className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-500">
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "" : ""}
          </span>
          <button
            type="button"
            onClick={async () => {
              const c = canvasRef.current;
              const ctx = c?.getContext("2d");
              if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
              dirty.current = false;
              const res = await clearScratchAction({ problemId });
              if (!res.ok) {
                setStatus("error");
                setErrorText(res.error);
              } else {
                setStatus("idle");
                setErrorText(null);
              }
            }}
            className="text-[11px] font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Clear
          </button>
        </span>
      </div>

      {/* The canvas is absolutely positioned inside a sized box rather than
          being `w-full` directly.
          
          Setting `canvas.width` sets the element's *intrinsic* width, so a
          percentage width plus a measured resize is a feedback loop: intrinsic
          width decides the parent's width, the parent decides the measured
          rect, and the rect is written back as the new intrinsic width. In any
          shrink-to-fit container that spirals to zero — measured here going
          128px, then 2px, on successive layouts. Taking the canvas out of flow
          means its box comes from this wrapper and its attributes never feed
          layout back. */}
      <div
        className={cn(
          "relative mt-1.5 h-56 w-full overflow-hidden rounded-xl border border-slate-200 bg-background",
          "dark:border-slate-700"
        )}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          // touch-none stops a finger drag scrolling the page instead of drawing.
          className="absolute inset-0 h-full w-full touch-none text-slate-900 dark:text-slate-100"
        />
      </div>

      {errorText && (
        <p className="mt-1.5 text-[11px] font-medium text-danger-600 dark:text-danger-400">
          {errorText}
        </p>
      )}
    </div>
  );
}
