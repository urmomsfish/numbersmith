import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  DAILY_XP_MULTIPLIER,
  GAME_LIST,
  arcadeAchievements,
  arcadeDayKey,
  dailyGame,
  headlineFor,
  loadStandings,
  playsFor,
  totalPlays,
  totalXp,
  xpFor,
  type GameMeta,
  type Standing,
} from "@/lib/engine/arcade";
import { TOTAL_PUZZLES } from "@/lib/games/escape";

export const metadata = { title: "Arcade" };

/**
 * The arcade's front door.
 *
 * Unlike the three games, this page keeps the app shell and the app's own
 * light/dark theme — it is a NumberSmith page that happens to be about games,
 * not a game. The playfulness lives in the card artwork and in the colour each
 * game owns, which is also what ties a card to the game it opens.
 */
export default async function GamesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const standings = await loadStandings(user.id);
  const today = dailyGame(arcadeDayKey());
  const achievements = arcadeAchievements(standings, TOTAL_PUZZLES);
  const earned = achievements.filter((a) => a.earned).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <Badge tone="ember" className="mb-2">
          Arcade
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Three games
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Short games that lean on the things competition maths actually asks of you — spotting a
          factor, holding an order of operations straight, finding a second route to the same
          number, and not panicking when the first answer is wrong. Everything you score here pays
          XP into the same account as practice.
        </p>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* Today's challenge */}
      {/* ------------------------------------------------------------------- */}
      <DailyBanner game={GAME_LIST.find((g) => g.key === today)!} />

      {/* ------------------------------------------------------------------- */}
      {/* The games */}
      {/* ------------------------------------------------------------------- */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GAME_LIST.map((game) => (
          <GameCard
            key={game.key}
            game={game}
            standings={standings}
            isDaily={game.key === today}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Totals */}
      {/* ------------------------------------------------------------------- */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Your arcade</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Games played", totalPlays(standings).toLocaleString()],
            ["XP from games", totalXp(standings).toLocaleString()],
            ["Achievements", `${earned} / ${achievements.length}`],
            ["Puzzles solved", `${headlineFor(standings, "ESCAPE")} / ${TOTAL_PUZZLES}`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl border border-slate-200 bg-card p-4 dark:border-slate-700"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {k}
              </dt>
              <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Achievements */}
      {/* ------------------------------------------------------------------- */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Achievements</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Read straight off your records, so they can never disagree with the numbers above.
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a.key}
              className={[
                "rounded-xl border p-4",
                a.earned
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                  : "border-slate-200 bg-card dark:border-slate-700",
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className={[
                    "text-sm font-bold",
                    a.earned
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-slate-900 dark:text-slate-100",
                  ].join(" ")}
                >
                  {a.name}
                </h3>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                  {a.detail}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {a.blurb}
              </p>
              {/* The bar is secondary to the "3 / 5" above it: a progress bar
                  alone cannot say how far 60% actually is. */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={a.earned ? "h-full bg-emerald-500" : "h-full bg-ember-500"}
                  style={{ width: `${Math.round(a.progress * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function DailyBanner({ game }: { game: GameMeta }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-wrap items-center gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 dark:border-amber-800 dark:from-amber-950/50 dark:to-orange-950/40"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-black"
        style={{
          background: `linear-gradient(135deg, ${game.art.from}, ${game.art.to})`,
          color: game.art.ink,
        }}
        aria-hidden
      >
        ★
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
          Today&rsquo;s challenge · {DAILY_XP_MULTIPLIER}× XP
        </div>
        <div className="text-base font-bold text-slate-900 dark:text-slate-50">{game.name}</div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{game.tagline}</p>
      </div>
      <span className="text-sm font-bold text-amber-700 group-hover:underline dark:text-amber-400">
        Play →
      </span>
    </Link>
  );
}

function GameCard({
  game,
  standings,
  isDaily,
}: {
  game: GameMeta;
  standings: Standing[];
  isDaily: boolean;
}) {
  const best = headlineFor(standings, game.key);
  const plays = playsFor(standings, game.key);
  const xp = xpFor(standings, game.key);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-card transition-shadow hover:shadow-lg dark:border-slate-700">
      <GameArt game={game} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-50">
            {game.name}
          </h2>
          {isDaily ? <Badge tone="warning">Daily</Badge> : null}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {game.tagline}
        </p>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {game.description}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Trains:</span>{" "}
          {game.trains}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <DifficultyPips level={game.difficulty} />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {game.difficulty}
          </span>
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {game.xpRange}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          {[
            [game.bestLabel, game.key === "ESCAPE" ? `${best}/${TOTAL_PUZZLES}` : best.toLocaleString()],
            ["Played", plays.toLocaleString()],
            ["XP", xp.toLocaleString()],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {k}
              </dt>
              <dd className="font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href={`/games/${game.slug}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(135deg, ${game.art.from}, ${game.art.to})`,
            color: game.art.ink,
          }}
        >
          {plays > 0 ? "Play again" : "Play"}
        </Link>
      </div>
    </article>
  );
}

function DifficultyPips({ level }: { level: GameMeta["difficulty"] }) {
  const filled = { Relaxed: 1, Moderate: 2, Sharp: 3 }[level];
  return (
    <span className="flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={[
            "h-1.5 w-5 rounded-full",
            i < filled ? "bg-ember-500" : "bg-slate-200 dark:bg-slate-700",
          ].join(" ")}
        />
      ))}
    </span>
  );
}

/**
 * Card artwork.
 *
 * Drawn per game rather than pulled from an icon set, because three cards in
 * a row with the same generic controller glyph is exactly the
 * educational-template look the brief asks to avoid. Each one is a miniature
 * of the game it opens.
 */
function GameArt({ game }: { game: GameMeta }) {
  const { from, to, ink } = game.art;
  return (
    <div
      className="relative h-32 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      <svg viewBox="0 0 320 128" className="h-full w-full">
        {game.key === "MERGE" ? <MergeArt ink={ink} /> : null}
        {game.key === "ESCAPE" ? <EscapeArt ink={ink} /> : null}
        {game.key === "CODEBREAKER" ? <CodeArt ink={ink} /> : null}
      </svg>
    </div>
  );
}

function MergeArt({ ink }: { ink: string }) {
  // 3 and 6 sitting above the 9 they make, with 12 and 20 alongside: the rule
  // in one picture, and visibly not a ladder of powers of two.
  const tiles: [number, number, string][] = [
    [96, 22, "3"],
    [150, 22, "6"],
    [204, 22, "12"],
    [123, 72, "9"],
    [177, 72, "20"],
  ];
  return (
    <g>
      {tiles.map(([x, y, label], i) => (
        <g key={label}>
          <rect
            x={x}
            y={y}
            width="46"
            height="40"
            rx="9"
            fill="#000"
            opacity={0.16 + i * 0.04}
          />
          <rect
            x={x}
            y={y}
            width="46"
            height="40"
            rx="9"
            fill="#fff"
            opacity={0.14 + i * 0.07}
            stroke="#fff"
            strokeOpacity="0.35"
          />
          <text
            x={x + 23}
            y={y + 27}
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fill={ink}
            opacity="0.95"
          >
            {label}
          </text>
        </g>
      ))}
      {/* An arrow, so the card says "these slide" without a caption. */}
      <path
        d="M 44 64 L 84 64 M 70 52 L 84 64 L 70 76"
        stroke={ink}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </g>
  );
}

function EscapeArt({ ink }: { ink: string }) {
  return (
    <g>
      {/* A door, ajar, with light behind it. */}
      <rect x="112" y="20" width="96" height="92" rx="4" fill="#fff" opacity="0.14" />
      <rect x="112" y="20" width="96" height="92" rx="4" fill="none" stroke={ink} strokeOpacity="0.5" strokeWidth="3" />
      <rect x="112" y="20" width="40" height="92" fill="#fff" opacity="0.22" />
      <circle cx="162" cy="68" r="4" fill={ink} opacity="0.8" />
      {/* The equation that opens it. */}
      <text x="160" y="128" textAnchor="middle" fontSize="0" fill={ink}>
        escape
      </text>
      <g opacity="0.75">
        <text x="48" y="54" fontSize="22" fontWeight="800" fill={ink}>
          x =
        </text>
        <text x="48" y="90" fontSize="16" fontWeight="700" fill={ink} opacity="0.7">
          ⅚ − ⅜
        </text>
        <text x="232" y="54" fontSize="22" fontWeight="800" fill={ink}>
          π r²
        </text>
        <text x="232" y="90" fontSize="16" fontWeight="700" fill={ink} opacity="0.7">
          3x + 7
        </text>
      </g>
    </g>
  );
}

function CodeArt({ ink }: { ink: string }) {
  const digits = ["4", "?", "7", "?"];
  const marks = ["#34d399", "#fbbf24", "#34d399", "#64748b"];
  return (
    <g>
      {digits.map((d, i) => {
        const x = 66 + i * 50;
        return (
          <g key={i}>
            <rect x={x} y="28" width="38" height="46" rx="8" fill="#000" opacity="0.2" />
            <rect
              x={x}
              y="28"
              width="38"
              height="46"
              rx="8"
              fill="#fff"
              opacity="0.12"
              stroke="#fff"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
            <text
              x={x + 19}
              y="60"
              textAnchor="middle"
              fontSize="22"
              fontWeight="800"
              fill={ink}
              opacity="0.95"
            >
              {d}
            </text>
            <circle cx={x + 19} cy="90" r="6" fill={marks[i]} />
          </g>
        );
      })}
    </g>
  );
}
