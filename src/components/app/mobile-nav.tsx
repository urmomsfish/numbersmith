"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/components/app/sidebar";
import { IconSettings } from "@/components/app/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-64 flex-col bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-50">Menu</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 dark:text-slate-500">
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 px-3">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "text-slate-600 dark:text-slate-300"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                <IconSettings className="h-[18px] w-[18px]" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
