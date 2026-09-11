import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/app/logout-button";
import { cn } from "@/lib/cn";

const STEPS = [
  { key: "PROFILE", label: "About You" },
  { key: "PLACEMENT", label: "Placement Test" },
  { key: "RESULTS", label: "Your Level" },
  { key: "COMPETITIONS", label: "Competitions" },
  { key: "PLAN", label: "Training Plan" },
] as const;

export function OnboardingShell({
  activeStep,
  children,
}: {
  activeStep: (typeof STEPS)[number]["key"];
  children: ReactNode;
}) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo href="/" />
          <div className="flex items-center gap-3">
          {/* Only from lg: below that the logo, five steps, and the logout
              button do not fit on one line without wrapping. */}
          <ol className="hidden items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-500 lg:flex">
            {STEPS.map((step, i) => (
              <li key={step.key} className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1",
                    i === activeIndex
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : i < activeIndex
                        ? "text-success-600 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                      i === activeIndex
                        ? "bg-brand-600 text-white"
                        : i < activeIndex
                          ? "bg-success-500 text-white"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    )}
                  >
                    {i < activeIndex ? "✓" : i + 1}
                  </span>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && <span className="mx-0.5 h-px w-4 bg-slate-200 dark:bg-slate-700" />}
              </li>
            ))}
          </ol>
          <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
