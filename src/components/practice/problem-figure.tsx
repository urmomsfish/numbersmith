import { cn } from "@/lib/cn";

/**
 * Renders a problem's inline SVG figure.
 *
 * Figures live in the seed data as raw `<svg>` markup, authored by us and
 * reviewed in the repo. Nothing a student types ever reaches this component —
 * there is no path from user input into `Problem.diagram`. Even so, this is the
 * one place in the app that injects markup, so it refuses anything that does not
 * look like a plain figure rather than trusting the column blindly: a bad row
 * (a bungled migration, a hand-edited database) should render nothing at all,
 * not execute.
 *
 * The seeded SVGs use `currentColor` for strokes and labels, so a figure picks
 * up the surrounding text colour and stays legible in both themes without
 * carrying its own palette.
 */

/** Matches markup that is not a bare, inert `<svg>` figure. */
const DISALLOWED = /<\s*(script|foreignObject|iframe|object|embed|use|image)\b|\son\w+\s*=|(?:href|src)\s*=\s*["']?\s*(?!#)[a-z]*:/i;

export function isRenderableFigure(svg: string | null | undefined): svg is string {
  if (!svg) return false;
  const trimmed = svg.trim();
  return trimmed.startsWith("<svg") && trimmed.endsWith("</svg>") && !DISALLOWED.test(trimmed);
}

export function ProblemFigure({ svg, className }: { svg: string | null | undefined; className?: string }) {
  if (!isRenderableFigure(svg)) return null;
  return (
    <div
      // Figures are drawn on a light neutral card so the strokes read the same
      // way in both themes; `text-slate-700 dark:text-slate-200` is what
      // `currentColor` resolves to inside the figure.
      className={cn(
        "mt-5 flex justify-center overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700",
        "dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200",
        "[&>svg]:h-auto [&>svg]:max-w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/**
 * Question text plus its figure, in the order a contest paper would print them.
 * Used everywhere a student reads a full problem statement, so a figure cannot
 * be present in one surface and missing in another.
 */
export function ProblemStatement({
  question,
  diagram,
  className,
}: {
  question: string;
  diagram?: string | null;
  className?: string;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-50 sm:text-xl",
          className
        )}
      >
        {question}
      </p>
      <ProblemFigure svg={diagram} />
    </div>
  );
}
