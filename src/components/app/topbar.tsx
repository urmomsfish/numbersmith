import { MobileNav } from "@/components/app/mobile-nav";
import { UserMenu } from "@/components/app/user-menu";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconFlame, IconBolt } from "@/components/app/icons";

export function Topbar({
  name,
  email,
  streak,
  xp,
  rating,
  isPro,
  canBuy,
}: {
  name: string;
  email: string;
  streak: number;
  xp: number;
  rating: number;
  isPro: boolean;
  canBuy: boolean;
}) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-ember-600 dark:bg-orange-950 dark:text-ember-400 sm:flex">
          <IconFlame className="h-4 w-4" />
          {streak}
        </div>
        <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-400 sm:flex">
          <IconBolt className="h-4 w-4" />
          {xp.toLocaleString()} XP
        </div>
        <Badge tone="brand" className="hidden sm:inline-flex">
          Rating {rating}
        </Badge>
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
