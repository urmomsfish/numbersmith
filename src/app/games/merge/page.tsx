import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { freshSeed, loadStandings, mergePeak, standingsFor } from "@/lib/engine/arcade";
import { MergeGame } from "./merge-game";

export const metadata = { title: "Factor Forge" };

/**
 * The seed comes from here rather than from the browser.
 *
 * The client needs a different board every game, which means a clock — and
 * calling `Date.now()` during a client render is impure and lints as such.
 * Taking it on the server sidesteps that: the page is dynamic anyway (it is
 * behind auth), so each visit brings a fresh seed, and the client varies it
 * per game from a counter.
 */
export default async function MergePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [standings, seed] = await Promise.all([loadStandings(user.id), freshSeed()]);
  const bests: Record<string, number> = {};
  for (const s of standingsFor(standings, "MERGE")) bests[s.variant] = s.bestScore;

  return <MergeGame seed={seed} bests={bests} peak={mergePeak(standings)} />;
}
