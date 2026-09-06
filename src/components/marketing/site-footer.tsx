import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <Logo href="/" />
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The adaptive training platform for competition mathematics — from Math Kangaroo and
              MathCounts to AMC, AIME, HMMT, and olympiad mathematics.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50">Product</p>
              <ul className="mt-2 space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>
                  <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Free assessment
                  </Link>
                </li>
                <li>
                  <Link href="/#competitions" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Competitions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-100">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50">Account</p>
              <ul className="mt-2 space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50">Legal</p>
              <ul className="mt-2 space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>
                  <Link href="/legal/terms" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refunds" className="hover:text-slate-900 dark:hover:text-slate-100">
                    Refunds &amp; Cancellation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-xs leading-relaxed text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p>
            All problems on NumberSmith are original content, and every answer key is checked by an
            automated verifier that re-solves each problem independently —{" "}
            <Link href="/about#verification" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              how that works
            </Link>
            . NumberSmith provides independent practice tracks modeled on published competition formats and
            is not affiliated with, endorsed by, or sponsored by MAA, MATHCOUNTS, Math Kangaroo, MOEMS,
            HMMT, PUMaC, ARML, or any other competition organization.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} NumberSmith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
