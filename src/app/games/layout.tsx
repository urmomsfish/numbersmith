import type { ReactNode } from "react";

/**
 * Paints the document background for the three games.
 *
 * Each game already fills the viewport with its own dark shell, but the
 * `body` underneath keeps the app's light parchment, and an elastic scroll
 * past the top or bottom of the page rubber-bands it into view as a cream
 * band above a black game. Setting it here fixes that at the only level that
 * can: fixed-position backdrops rubber-band along with everything else.
 *
 * The style is hoisted by React and scoped to this route subtree, so it is
 * dropped again on the way back to the rest of the app.
 */
export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style href="arcade-backdrop" precedence="high">{`
        body { background-color: #070b14; }
      `}</style>
      {children}
    </>
  );
}
