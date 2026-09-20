import Link from "next/link";
import { MobileNav } from "@/components/app/mobile-nav";
import { UserMenu } from "@/components/app/user-menu";
import { LinkButton } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { IconFlame } from "@/components/app/icons";

/** The top bar carries identity and account controls, plus a single readout of
 * the three numbers that describe where the student stands.
 *
 * Those numbers used to be three separately decorated chips — an ember flame,
 * an amber bolt, and an indigo badge — which put three accent colours in the
 * same 200px of the app's most persistent surface and made ambient stats
 * compete with the page beneath them. They are now one quiet line in a single
 * colour, and the line is a link to Statistics, so the space does navigational
 * work instead of only decorative work. The flame stays because a streak is the
 * one value here whose meaning is carried by the icon rather than the label.
 */
export function Topbar({
  name,
  email,
  streak,
  xp,
  rating,
  isPro,
  isAdmin,
  canBuy,
}: {
  name: string;
  email: string;
  streak: number;
  xp: number;
  rating: number;
  isPro: boolean;
  isAdmin: boolean;
  canBuy: boolean;
}) {
  return (
    <header className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-surface px-4 dark:border-slate-800 sm:px-6">
      {/* The logo belongs to the sidebar on desktop; below lg the sidebar is
          gone, so the bar has to carry identity itself. */}
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav
          isPro={isPro}
          isAdmin={isAdmin}
          streak={streak}
          xp={xp}
          rating={rating}
        />
        <Logo href="/dashboard" className="lg:hidden" />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/stats"
          className="hidden items-center gap-3 rounded-md px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 sm:flex"
        >
          <span className="tabular-nums">
            <span className="font-semibold text-slate-900 dark:text-slate-50">{rating}</span> rating
          </span>
          <span aria-hidden className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <span className="tabular-nums">
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {xp.toLocaleString()}
            </span>{" "}
            XP
          </span>
          <span aria-hidden className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <IconFlame className="h-4 w-4 text-ember-600 dark:text-ember-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-50">{streak}</span>
            <span className="sr-only">day streak</span>
          </span>
        </Link>

        {!isPro && canBuy && (
          <LinkButton href="/pricing" size="sm" variant="secondary">
            Upgrade
          </LinkButton>
        )}
        <ThemeToggle />
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
