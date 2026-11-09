import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { escapeSolved, loadStandings, standingsFor, xpFor } from "@/lib/engine/arcade";
import { EscapeGame } from "./escape-game";

export const metadata = { title: "Equation Escape" };

export default async function EscapePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const standings = await loadStandings(user.id);

  // Best times are merged across every stored escape row, so the record
  // survives a reset.
  const bestTimes: Record<string, number> = {};
  for (const s of standingsFor(standings, "ESCAPE")) {
    for (const [room, secs] of Object.entries(s.state.bestTimes ?? {})) {
      if (bestTimes[room] === undefined || secs < bestTimes[room]) bestTimes[room] = secs;
    }
  }

  return (
    <EscapeGame
      initialSolved={escapeSolved(standings)}
      xpSoFar={xpFor(standings, "ESCAPE")}
      bestTimes={bestTimes}
    />
  );
}
