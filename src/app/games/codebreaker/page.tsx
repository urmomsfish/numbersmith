import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { codeBestStreak, freshSeed, loadStandings, standingsFor } from "@/lib/engine/arcade";
import { dailyKey } from "@/lib/games/mathler";
import { CodebreakerGame } from "./codebreaker-game";

export const metadata = { title: "Codebreaker" };

export default async function CodebreakerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [standings, seed] = await Promise.all([loadStandings(user.id), freshSeed()]);
  const rows = standingsFor(standings, "CODEBREAKER");

  const bests: Record<string, number> = {};
  for (const s of rows) bests[s.variant] = s.bestScore;

  // The current streak is the one from whichever row was played most recently
  // — a streak is a property of the player, not of a difficulty, and
  // loadStandings already returns rows newest first.
  const current = rows[0]?.state.streak ?? 0;

  return (
    <CodebreakerGame
      seed={seed}
      dayKey={dailyKey()}
      bests={bests}
      stats={{
        plays: rows.reduce((n, r) => n + r.plays, 0),
        wins: rows.reduce((n, r) => n + r.wins, 0),
        bestStreak: codeBestStreak(standings),
        streak: current,
        winAttempts: rows.reduce((n, r) => n + (r.state.winAttempts ?? 0), 0),
      }}
    />
  );
}
