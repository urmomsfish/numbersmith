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

type NavItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  pro?: boolean;
};

/** Twelve destinations is too many to scan as one list, so they are grouped by
 * what the student is trying to do. The groups are the single source of truth
 * for both the sidebar and the mobile drawer — a flat NAV_ITEMS export used to
 * sit alongside them, which is how the drawer ended up ungrouped and missing
 * Settings while the sidebar had both. */
export const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Train",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: IconHome },
      { href: "/practice", label: "Practice", icon: IconTarget },
      { href: "/lessons", label: "Lessons", icon: IconBook },
      { href: "/video-lessons", label: "Video Lessons", icon: IconVideo, pro: true },
      { href: "/ai-assistant", label: "Smith AI", icon: IconSparkles, pro: true },
    ],
  },
  {
    label: "Compete",
    items: [
      { href: "/competitions", label: "Competitions", icon: IconTrophy },
      { href: "/simulations", label: "Simulations", icon: IconTimer },
      { href: "/daily-challenge", label: "Daily Challenge", icon: IconCalendar },
      { href: "/schedule", label: "Schedule", icon: IconCalendar },
    ],
  },
  {
    label: "Review",
    items: [
      { href: "/mistakes", label: "Mistakes", icon: IconRefresh },
      { href: "/stats", label: "Statistics", icon: IconChart },
      { href: "/study-plan", label: "Study Plan", icon: IconMap },
    ],
  },
];

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

/** One active treatment, used by both the sidebar and the drawer. The previous
 * version stacked four simultaneous signals on the active row — left border,
 * tinted background, brand icon and brand text. Background plus text colour is
 * already unambiguous; the rest was noise. */
export function navItemClass(active: boolean): string {
  return cn(
    "flex items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
    active
      ? "bg-brand-50 font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200"
      : "font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  );
}

export function NavRow({
  item,
  active,
  isPro,
  onNavigate,
  className,
}: {
  item: NavItem;
  active: boolean;
  isPro?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(navItemClass(active), className)}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.pro && !isPro && (
        <span className="shrink-0 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          Pro
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ isAdmin, isPro }: { isAdmin?: boolean; isPro?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-surface dark:border-slate-800 lg:flex">
      <div className="flex min-h-14 items-center px-5">
        <Logo href="/dashboard" />
      </div>

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
                  className="py-2"
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
          className="py-2"
        />
        {isAdmin && (
          <NavRow
            item={{ href: "/admin", label: "Admin", icon: IconShield }}
            active={isActivePath(pathname, "/admin")}
            className="py-2"
          />
        )}
      </div>
    </aside>
  );
}
