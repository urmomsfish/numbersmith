"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/logo";
import {
  IconHome,
  IconTarget,
  IconBook,
  IconTrophy,
  IconTimer,
  IconCalendar,
  IconRefresh,
  IconChart,
  IconMap,
  IconSettings,
  IconShield,
  IconVideo,
  IconSparkles,
} from "@/components/app/icons";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/practice", label: "Practice", icon: IconTarget },
  { href: "/lessons", label: "Lessons", icon: IconBook },
  { href: "/video-lessons", label: "Video Lessons", icon: IconVideo, pro: true },
  { href: "/ai-assistant", label: "Smith AI", icon: IconSparkles, pro: true },
  { href: "/competitions", label: "Competitions", icon: IconTrophy },
  { href: "/simulations", label: "Simulations", icon: IconTimer },
  { href: "/daily-challenge", label: "Daily Challenge", icon: IconCalendar },
  { href: "/mistakes", label: "Mistakes", icon: IconRefresh },
  { href: "/stats", label: "Statistics", icon: IconChart },
  { href: "/study-plan", label: "Study Plan", icon: IconMap },
  { href: "/schedule", label: "Schedule", icon: IconTrophy },
];

export function Sidebar({ isAdmin, isPro }: { isAdmin?: boolean; isPro?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-surface dark:border-slate-800 lg:flex">
      <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
                active
                  ? "border-brand-600 bg-brand-50/70 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                  : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  active ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-500"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.pro && !isPro && <span className="text-[11px]">⭐</span>}
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
            pathname.startsWith("/settings")
              ? "border-brand-600 bg-brand-50/70 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
              : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          <IconSettings
            className={cn(
              "h-[18px] w-[18px]",
              pathname.startsWith("/settings") ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-500"
            )}
          />
          Settings
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
              pathname.startsWith("/admin")
                ? "border-brand-600 bg-brand-50/70 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <IconShield
              className={cn(
                "h-[18px] w-[18px]",
                pathname.startsWith("/admin") ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-500"
              )}
            />
            Admin
          </Link>
        )}
      </nav>
      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <div className="bg-slate-50 px-3 py-2 text-[11px] text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          NumberSmith v0.1 — MVP
        </div>
      </div>
    </aside>
  );
}
