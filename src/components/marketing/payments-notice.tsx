/** Shown while NumberSmith Pro cannot actually be purchased — i.e. whenever a
 * live Stripe key is not configured. Rendering this is preferable to showing
 * working-looking checkout buttons that would decline a real card.
 *
 * Nothing here needs removing at launch: `paymentsAreLive()` reads the Stripe
 * key, so this disappears on its own once live keys are set. */
export function PaymentsNotice({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className ?? ""}`}
    >
      <p className="font-semibold">NumberSmith Pro isn&apos;t available to buy yet.</p>
      <p className="mt-1 leading-relaxed text-amber-800">
        We&apos;re still setting up payments. Everything on the free plan works today — the full
        placement test, your rating and training plan, daily practice, and simulations. Pro will open
        up soon.
      </p>
    </div>
  );
}

/** Compact single-line variant for use inside the app shell. */
export function PaymentsNoticeInline({ className }: { className?: string }) {
  return (
    <p
      className={`rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ${className ?? ""}`}
    >
      Pro isn&apos;t purchasable yet — payments are still being set up. The free plan is fully
      working in the meantime.
    </p>
  );
}
