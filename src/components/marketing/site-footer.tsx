import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <Logo href="/" />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              The adaptive training platform for competition mathematics — from Math Kangaroo and
              MathCounts to AMC, AIME, HMMT, and olympiad mathematics.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-slate-900">Product</p>
              <ul className="mt-2 space-y-1.5 text-slate-500">
                <li>
                  <Link href="/pricing" className="hover:text-slate-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-slate-900">
                    Free assessment
                  </Link>
                </li>
                <li>
                  <Link href="/#competitions" className="hover:text-slate-900">
                    Competitions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Account</p>
              <ul className="mt-2 space-y-1.5 text-slate-500">
                <li>
                  <Link href="/login" className="hover:text-slate-900">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-slate-900">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-xs leading-relaxed text-slate-400">
          <p>
            All problems on NumberSmith are original content written and verified by the NumberSmith team.
            NumberSmith provides independent practice tracks modeled on published competition formats and
            is not affiliated with, endorsed by, or sponsored by MAA, MATHCOUNTS, Math Kangaroo, MOEMS,
            HMMT, PUMaC, ARML, or any other competition organization.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} NumberSmith. Demo educational project.</p>
        </div>
      </div>
    </footer>
  );
}
