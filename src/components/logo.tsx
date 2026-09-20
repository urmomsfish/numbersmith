import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="NumberSmith home" className={cn("inline-flex items-center select-none", className)}>
      <span className="font-[var(--font-geist-sans)] text-[17px] font-semibold tracking-[-0.04em] text-slate-900">
        Number<span className="text-brand-600 dark:text-brand-400">Smith</span>
      </span>
    </Link>
  );
}
