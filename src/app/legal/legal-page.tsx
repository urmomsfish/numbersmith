import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

/** Shared shell for the three policy pages so they stay visually consistent
 * with the rest of the marketing site and with each other. */
export function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Last updated: {lastUpdated}</p>
          {intro && (
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{intro}</p>
          )}
          <div className="mt-10 space-y-8">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-slate-300 dark:text-slate-600">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
