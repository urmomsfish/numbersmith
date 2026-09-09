import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/90 backdrop-blur dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo href="/" />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/#competitions" className="hover:text-slate-900 dark:hover:text-slate-50">
            Competitions
          </Link>
          <Link href="/#how-it-works" className="hover:text-slate-900 dark:hover:text-slate-50">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-50">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-50">
            About
          </Link>
          <Link href="/#faq" className="hover:text-slate-900 dark:hover:text-slate-50">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <LinkButton href="/dashboard" size="sm">
              Go to Dashboard
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm">
                Log in
              </LinkButton>
              <LinkButton href="/signup" size="sm">
                Start Free
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
