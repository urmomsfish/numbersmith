/** Shown while NumberSmith Pro cannot actually be purchased — i.e. whenever a
 * live Stripe key is not configured. Rendering this is preferable to showing
 * working-looking checkout buttons that would decline a real card.
 *
 * Nothing here needs removing at launch: `paymentsAreLive()` reads the Stripe
 * key, so this disappears on its own once live keys are set. */
export function PaymentsNotice({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-3 text-sm text-amber-900 dark:text-amber-200 ${className ?? ""}`}
    >
      <p className="font-semibold">Everything is free while we&apos;re in early access.</p>
      <p className="mt-1 leading-relaxed text-amber-800 dark:text-amber-400">
        We haven&apos;t opened payments yet, so every Pro feature below is unlocked for everyone —
        unlimited problems and simulations, the full lesson library, and complete mistake review. No
        card needed. The pricing here is what Pro will cost once it launches.
      </p>
    </div>
  );
}

/** Compact single-line variant for use inside the app shell. */
export function PaymentsNoticeInline({ className }: { className?: string }) {
  return (
    <p
      className={`rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-xs text-amber-800 dark:text-amber-400 ${className ?? ""}`}
    >
      Early access — every Pro feature is unlocked for free while we finish setting up payments.
    </p>
  );
}
