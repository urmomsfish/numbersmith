import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The frame the three games sit in.
 *
 * These routes are deliberately outside `(app)`, for the same reason the quest
 * is: under the app shell a game becomes a panel in a dashboard, with a
 * sidebar competing for attention. Here it gets the viewport, and the only
 * chrome is one way back to the arcade.
 *
 * The background is fixed rather than scrolling so the glow behind the board
 * stays put when a long statistics panel pushes the page down.
 */
export function GameShell({
  title,
  eyebrow,
  accent,
  children,
  aside,
}: {
  title: string;
  eyebrow: string;
  /** Two hex stops for the ambient glow behind the content. */
  accent: { from: string; to: string };
  children: ReactNode;
  /** Controls that belong beside the title — a mode picker, usually. */
  aside?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b14] text-slate-100">
      {/* Two soft lights, one per accent stop. Pointer-events-none so they
          never eat a tap meant for the board underneath.

          The sizes are capped in viewport units as well as rem. At a fixed
          46rem a single glow covers a phone screen entirely, which turned the
          whole page orange rather than lighting one corner of it. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="arcade-breathe absolute -top-40 left-1/2 h-[min(46rem,85vw)] w-[min(46rem,85vw)] -translate-x-1/2 rounded-full blur-[110px] sm:blur-[130px]"
          style={{ background: accent.from, opacity: 0.18 }}
        />
        <div
          className="arcade-breathe absolute -bottom-52 right-[-10rem] h-[min(38rem,80vw)] w-[min(38rem,80vw)] rounded-full blur-[110px] sm:blur-[130px]"
          style={{ background: accent.to, opacity: 0.15, animationDelay: "1.6s" }}
        />
        {/* A faint grid, to stop the large dark areas reading as empty. */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-10 pt-5 sm:px-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
                <path
                  d="M11.5 5L6.5 10l5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Arcade
            </Link>
            <h1 className="mt-1 truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm text-slate-400">{eyebrow}</p>
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </header>

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}

/** A labelled number. Used for every scoreboard in the arcade. */
export function Stat({
  label,
  value,
  tone = "plain",
  className,
}: {
  label: string;
  value: ReactNode;
  tone?: "plain" | "hot";
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl border px-3 py-2 text-center",
        tone === "hot"
          ? "border-amber-400/40 bg-amber-400/10"
          : "border-white/10 bg-white/[0.04]",
        className ?? "",
      ].join(" ")}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="font-mono text-lg font-bold tabular-nums leading-tight text-slate-50">
        {value}
      </div>
    </div>
  );
}

/** The glassy panel every game uses for its board and its side columns. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
