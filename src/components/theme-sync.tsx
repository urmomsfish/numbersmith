"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTintId, DEFAULT_TINT } from "@/lib/tints";

/** Re-runs the same logic as the no-flash inline script in layout.tsx, but on
 * every client-side navigation. Login/logout redirect via a server action's
 * `redirect()`, which swaps the route without reloading the document, so the
 * inline <head> script (which only runs once, on a real page load) never sees
 * the new auth cookie. This effect is what actually resets the theme/tint to
 * light+default right after logout, and restores it right after login. */
function applyTheme() {
  try {
    const loggedIn = document.cookie.includes("numbersmith_auth=");
    const storedTheme = loggedIn ? localStorage.getItem("theme") : null;
    const dark =
      storedTheme === "dark" ||
      (!storedTheme && loggedIn && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);

    const storedTint = loggedIn ? localStorage.getItem("tint") : null;
    document.documentElement.setAttribute(
      "data-tint",
      loggedIn && isTintId(storedTint) ? storedTint : DEFAULT_TINT
    );
  } catch {
    // localStorage/matchMedia can throw in locked-down environments; leave whatever's already applied.
  }
}

export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    applyTheme();
  }, [pathname]);

  return null;
}
