"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_GROUPS, NavRow, isActivePath } from "@/components/app/sidebar";
import { IconSettings, IconShield, IconFlame } from "@/components/app/icons";
import { Logo } from "@/components/logo";

/** The drawer is built from the same NAV_GROUPS as the sidebar, so the two can
 * no longer disagree — this list used to be flat and ungrouped, marked Pro items
 * with a star where the sidebar wrote "Pro", and had no Admin link at all.
 *
 * It is not a narrowed copy of the sidebar, though. Rows are taller because
 * they are touch targets, the panel is full-height and scrollable, and it
 * carries the rating/XP/streak readout that the top bar drops below the `sm`
 * breakpoint — on a phone this drawer is the only place those numbers appear.
 */
export function MobileNav({
  isPro,
  isAdmin,
  streak,
  xp,
  rating,
}: {
  isPro?: boolean;
  isAdmin?: boolean;
  streak: number;
  xp: number;
  rating: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and stop the page behind the overlay from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={close}
            aria-hidden
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="relative flex h-full w-[17rem] max-w-[85vw] flex-col border-r border-slate-200 bg-surface focus:outline-none dark:border-slate-800"
          >
            <div className="flex min-h-14 items-center justify-between gap-2 px-3">
              <Logo href="/dashboard" onClick={close} className="pl-2" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Stacked value-over-label, not the bar's inline "1486 rating ·
                8,420 XP" run — at 272px that inline form wraps mid-pair. */}
            <Link
              href="/stats"
              onClick={close}
              className="mx-3 mb-3 grid grid-cols-3 gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-center transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <span className="block">
                <span className="block text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {rating}
                </span>
                <span className="block text-xs text-slate-600 dark:text-slate-400">rating</span>
              </span>
              <span className="block">
                <span className="block text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {xp.toLocaleString()}
                </span>
                <span className="block text-xs text-slate-600 dark:text-slate-400">XP</span>
              </span>
              <span className="block">
                <span className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  <IconFlame className="h-4 w-4 text-ember-600 dark:text-ember-400" />
                  {streak}
                </span>
                <span className="block text-xs text-slate-600 dark:text-slate-400">streak</span>
              </span>
            </Link>

            <nav className="flex-1 overflow-y-auto px-3 pb-4">
              {NAV_GROUPS.map((group, i) => (
                <div key={group.label} className={i === 0 ? "" : "mt-5"}>
                  <p className="px-3 pb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavRow
                        key={item.href}
                        item={item}
                        active={isActivePath(pathname, item.href)}
                        isPro={isPro}
                        onNavigate={close}
                        className="py-2.5"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="space-y-0.5 border-t border-slate-200 px-3 py-3 dark:border-slate-800">
              <NavRow
                item={{ href: "/settings", label: "Settings", icon: IconSettings }}
                active={isActivePath(pathname, "/settings")}
                onNavigate={close}
                className="py-2.5"
              />
              {isAdmin && (
                <NavRow
                  item={{ href: "/admin", label: "Admin", icon: IconShield }}
                  active={isActivePath(pathname, "/admin")}
                  onNavigate={close}
                  className="py-2.5"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
