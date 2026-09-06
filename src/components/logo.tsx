import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 select-none", className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-brand-700 dark:text-brand-400"
      >
        <path
          d="M4 13L7 19L12 5H20"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Number<span className="text-brand-600 dark:text-brand-400">Smith</span>
      </span>
    </Link>
  );
}
