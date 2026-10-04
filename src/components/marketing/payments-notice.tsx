import { FREE_DAILY_PROBLEM_LIMIT, FREE_MISTAKE_REVIEWS_PER_WEEK } from "@/lib/subscription";

/**
 * Shown while NumberSmith Pro cannot actually be purchased — i.e. whenever a
 * live Stripe key is not configured. Rendering this is preferable to showing
 * working-looking checkout buttons that would decline a real card.
 *
 * What it says depends on a second, independent switch. "Payments are off" and
 * "the free tier is uncapped" used to be the same condition, and the copy here
 * promised unlimited access on that basis. They are separate now, so this
 * component has to tell the truth about both — a page that says "every Pro
 * feature is unlocked" to a student who just hit the daily limit is worse than
 * no notice at all.
 *
 * Nothing here needs removing at launch: both switches read their own config,
 * so this disappears on its own once live keys are set.
 */
export function PaymentsNotice({
  limited,
  className,
}: {
  /** True when free-tier limits are being enforced. */
  limited: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-3 text-sm text-amber-900 dark:text-amber-200 ${className ?? ""}`}
    >
      {limited ? (
        <>
          <p className="font-semibold">Pro isn&apos;t on sale yet.</p>
          <p className="mt-1 leading-relaxed text-amber-800 dark:text-amber-400">
            We haven&apos;t opened payments, so there&apos;s nothing to buy here today — the pricing
            below is what Pro will cost when it launches. Free accounts get{" "}
            {FREE_DAILY_PROBLEM_LIMIT} problems a day, {FREE_MISTAKE_REVIEWS_PER_WEEK} mistake
            reviews a week, the daily challenge, and the introductory lessons. If you need more
            before launch, get in touch and we&apos;ll open your account up.
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold">Everything is free while we&apos;re in early access.</p>
          <p className="mt-1 leading-relaxed text-amber-800 dark:text-amber-400">
            We haven&apos;t opened payments yet, so every Pro feature below is unlocked for everyone
            — unlimited problems and simulations, the full lesson library, and complete mistake
            review. No card needed. The pricing here is what Pro will cost once it launches.
          </p>
        </>
      )}
    </div>
  );
}
