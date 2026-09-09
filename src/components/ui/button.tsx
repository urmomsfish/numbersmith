import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 dark:disabled:bg-brand-900",
  secondary:
    "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 disabled:text-brand-300 dark:bg-slate-900 dark:text-brand-300 dark:border-brand-800 dark:hover:bg-slate-800 dark:disabled:text-brand-800",
  outline:
    "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:text-slate-300 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800 dark:disabled:text-slate-600",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:disabled:text-slate-600",
  danger:
    "bg-danger-600 text-white hover:bg-danger-500 disabled:bg-danger-300 dark:disabled:bg-danger-900",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-xl gap-2",
};

// `border border-transparent` is on the base so every variant has the same box
// metrics. Without it, the bordered variants (outline, secondary) stand 2px
// taller than the unbordered ones, which is visible whenever two buttons sit
// side by side — the Free and Pro columns on the landing page rendered their
// calls to action at 54px and 52px.
const base =
  "inline-flex items-center justify-center border border-transparent font-semibold transition-colors disabled:cursor-not-allowed whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  target,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}
