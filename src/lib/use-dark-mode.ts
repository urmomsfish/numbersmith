"use client";

import { useEffect, useState } from "react";

/** For the rare component that needs an actual color value rather than a
 * `dark:` class — chart libraries like Recharts take hex strings as props,
 * which Tailwind's dark variant can't reach. Watches the `dark` class on
 * <html> (toggled by ThemeChoice) via MutationObserver so switching themes
 * updates the colors live, without a reload. */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
