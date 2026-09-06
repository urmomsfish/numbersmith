import { logoutAction } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/cn";

/** Plain form + server action, so this works inside both server and client
 * components. Used in the onboarding and placement-test headers, which sit
 * outside the (app) layout and therefore have no user menu to log out from.
 *
 * Without this a half-onboarded user is trapped: the (app) layout redirects
 * anyone whose onboardingStep is not DONE back into onboarding, so they can
 * never reach a page that has the avatar menu. */
export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={cn(
          "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
          className
        )}
      >
        Log out
      </button>
    </form>
  );
}
