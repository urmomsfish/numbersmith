/**
 * Equation Escape — rooms, mechanisms and the puzzles that drive them.
 *
 * Content and rules only: no React, no DOM. A room is a list of mechanisms,
 * each guarded by one puzzle; solve every mechanism and the door opens.
 *
 * The puzzles are authored rather than drawn from the problem bank. That is
 * a deliberate break from the rest of NumberSmith. An escape room needs each
 * question to belong to the object it is attached to — a basin asks about
 * water, an orrery asks about circles — and a random bank problem about
 * trains would break the fiction the room is working to build. Difficulty is
 * controlled by hand for the same reason: the ramp across five rooms is part
 * of the level design, not an accident of what the bank happened to return.
 *
 * Every answer here has been worked by hand and is re-checked by
 * scripts/check-games.ts.
 */

export type MechanismKind = "basin" | "dial" | "lever" | "rune" | "orrery";

export type Puzzle = {
  id: string;
  /** What the player is turning, pressing or filling. */
  mechanism: MechanismKind;
  /** The label etched on the mechanism itself. */
  label: string;
  prompt: string;
  /** Canonical answer. Compared after normalisation. */
  answer: string;
  /** Extra spellings that should also pass. */
  accept?: string[];
  /** Shown after a wrong answer — a nudge, never the answer. */
  hint: string;
  /** Shown once it is solved, so the player learns something. */
  insight: string;
  /** Rough 1-10, for the HUD and the XP payout. */
  difficulty: number;
};

export type Room = {
  key: string;
  name: string;
  subtitle: string;
  /** Flavour shown on entry. */
  intro: string;
  palette: { wall: string; floor: string; glow: string; accent: string };
  /** The maze grid for this room. Grows as the rooms get harder. */
  grid: { rows: number; cols: number };
  /**
   * Seconds on the clock.
   *
   * Generous on purpose. The clock exists to make the room feel like a place
   * you are trying to get out of, not to punish a slow thinker — and running
   * it out costs only your position, never a solved gate. See TIMEOUT_RULE.
   */
  timeLimit: number;
  puzzles: Puzzle[];
};

/**
 * What happens when the clock reaches zero, stated once so the UI and the
 * rules text can never drift apart: you are returned to the entrance and the
 * clock resets. Gates you have already opened stay open.
 */
export const TIMEOUT_RULE =
  "You are walked back to the entrance and the clock restarts. Every gate you have already opened stays open.";

// ---------------------------------------------------------------------------
// Answer checking
// ---------------------------------------------------------------------------

/**
 * Normalises an answer for comparison.
 *
 * Forgiving about presentation, strict about value: spaces, capitals,
 * trailing full stops, thousands separators and a leading "+" all vanish,
 * and a bare ".5" becomes "0.5". It deliberately does *not* evaluate
 * fractions into decimals — "11/24" and "0.458" are different answers, and
 * silently accepting the rounded one teaches the wrong habit.
 */
export function normalise(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s,]/g, "")
    .replace(/\.$/, "")
    .replace(/^\+/, "")
    .replace(/^\./, "0.")
    .replace(/^(-?\d+)\.0+$/, "$1");
}

export function isCorrect(puzzle: Puzzle, given: string): boolean {
  const g = normalise(given);
  if (!g) return false;
  if (g === normalise(puzzle.answer)) return true;
  return (puzzle.accept ?? []).some((a) => normalise(a) === g);
}

// ---------------------------------------------------------------------------
// The rooms
// ---------------------------------------------------------------------------

export const ROOMS: Room[] = [
  {
    key: "temple",
    name: "The Sunken Temple",
    subtitle: "Arithmetic · Order of operations",
    intro:
      "Flooded passages wind away into the dark. The way out is somewhere north-east, and three sealed gates stand in the corridor between here and there.",
    palette: { wall: "#2b3a36", floor: "#1b2522", glow: "#4ade80", accent: "#86efac" },
    grid: { rows: 5, cols: 7 },
    timeLimit: 150,
    puzzles: [
      {
        id: "temple-1",
        mechanism: "basin",
        label: "The Three Basins",
        prompt:
          "Three stone basins hold 48, 27 and 15 drops of water. The lock wants the total.",
        answer: "90",
        hint: "Add all three. Nothing is hidden here — this one is a warm-up.",
        insight: "48 + 27 + 15 = 90.",
        difficulty: 1,
      },
      {
        id: "temple-2",
        mechanism: "dial",
        label: "The Priest's Dial",
        prompt: "Carved around the dial: 6 + 4 × 5 − 8 ÷ 2",
        answer: "22",
        hint: "Multiplication and division happen before addition and subtraction.",
        insight: "4 × 5 = 20 and 8 ÷ 2 = 4, so it reads 6 + 20 − 4 = 22.",
        difficulty: 2,
      },
      {
        id: "temple-3",
        mechanism: "rune",
        label: "The Tide Marks",
        prompt: "Water marks climb the wall: 2, 6, 12, 20, 30, …  What is the next mark?",
        answer: "42",
        hint: "Look at the gaps between the marks, then at the gaps between those.",
        insight: "The gaps are 4, 6, 8, 10 — each two more than the last. The next gap is 12, so 30 + 12 = 42.",
        difficulty: 3,
      },
    ],
  },

  {
    key: "lab",
    name: "The Glass Laboratory",
    subtitle: "Fractions · Ratios",
    intro:
      "Glass partitions divide the floor into narrow aisles. Pressure shutters have come down across three of them, and each wants a measurement before it will lift.",
    palette: { wall: "#1f3347", floor: "#15222f", glow: "#38bdf8", accent: "#7dd3fc" },
    grid: { rows: 5, cols: 7 },
    timeLimit: 165,
    puzzles: [
      {
        id: "lab-1",
        mechanism: "basin",
        label: "The Measuring Vial",
        prompt: "A vial holds 60 ml when full. It is three quarters full. How many millilitres are in it?",
        answer: "45",
        hint: "Three quarters of sixty.",
        insight: "¾ × 60 = 45 ml.",
        difficulty: 2,
      },
      {
        id: "lab-2",
        mechanism: "dial",
        label: "The Mixing Valve",
        prompt:
          "The seal needs 210 ml of solution mixed 2 parts reagent to 5 parts water. How many millilitres of reagent?",
        answer: "60",
        hint: "Two parts plus five parts makes seven parts in total. How big is one part?",
        insight: "Seven parts make 210 ml, so one part is 30 ml. The reagent is 2 parts = 60 ml.",
        difficulty: 4,
      },
      {
        id: "lab-3",
        mechanism: "rune",
        label: "The Etched Plate",
        prompt: "Etched into the door plate: ⁵⁄₆ − ³⁄₈. Give it as a fraction in lowest terms.",
        answer: "11/24",
        hint: "Find a common denominator first. Twenty-four works for both.",
        insight: "⁵⁄₆ = ²⁰⁄₂₄ and ³⁄₈ = ⁹⁄₂₄, so the difference is ¹¹⁄₂₄ — already in lowest terms.",
        difficulty: 5,
      },
    ],
  },

  {
    key: "bunker",
    name: "The Iron Bunker",
    subtitle: "Algebra · Equations",
    intro:
      "A warren of concrete corridors under low light. Blast gates cut the warren into sections, and each keypad has an equation chalked beside it.",
    palette: { wall: "#3a3028", floor: "#241d18", glow: "#fb923c", accent: "#fdba74" },
    grid: { rows: 6, cols: 9 },
    timeLimit: 180,
    puzzles: [
      {
        id: "bunker-1",
        mechanism: "lever",
        label: "The First Keypad",
        prompt: "Chalked above the lever: 3x + 7 = 31. Enter x.",
        answer: "8",
        hint: "Take the 7 off both sides before you divide.",
        insight: "3x = 24, so x = 8.",
        difficulty: 3,
      },
      {
        id: "bunker-2",
        mechanism: "dial",
        label: "The Split Gauge",
        prompt:
          "Two numbers add to 54. One is exactly twice the other. Enter the larger number.",
        answer: "36",
        hint: "Call the smaller one n. Then the pair is n and 2n, and together they make 3n.",
        insight: "3n = 54, so n = 18 and the larger is 36.",
        difficulty: 4,
      },
      {
        id: "bunker-3",
        mechanism: "rune",
        label: "The Blast Door",
        prompt: "Stencilled on the door: 5(y − 3) = 2y + 9. Enter y.",
        answer: "8",
        hint: "Expand the bracket first, then gather the y terms on one side.",
        insight: "5y − 15 = 2y + 9 → 3y = 24 → y = 8.",
        difficulty: 5,
      },
    ],
  },

  {
    key: "library",
    name: "The Whispering Library",
    subtitle: "Patterns · Logic",
    intro:
      "The shelves are tall enough to make corridors, and they run further than the lamplight reaches. Three grilles have been pulled across the aisles.",
    palette: { wall: "#33264a", floor: "#1f1830", glow: "#a78bfa", accent: "#c4b5fd" },
    grid: { rows: 7, cols: 9 },
    timeLimit: 195,
    puzzles: [
      {
        id: "library-1",
        mechanism: "rune",
        label: "The Spine Numbers",
        prompt: "Numbers down the spines: 1, 1, 2, 3, 5, 8, 13, …  What comes next?",
        answer: "21",
        hint: "Each number is built from the two before it.",
        insight: "8 + 13 = 21 — the Fibonacci sequence.",
        difficulty: 3,
      },
      {
        id: "library-2",
        mechanism: "lever",
        label: "The Reading Stand",
        prompt:
          "Three books stand in a row: red, blue and green. The red book is somewhere left of the blue one. The green book is not in the middle. The red book is not first. Counting from the left, which position holds the blue book?",
        answer: "3",
        hint: "Green is first or last. Try each and see which survives the other two clues.",
        insight:
          "If green were last, red and blue would take the first two places and red would be first — not allowed. So green is first, red second, blue third.",
        difficulty: 6,
      },
      {
        id: "library-3",
        mechanism: "dial",
        label: "The Catalogue Wheel",
        prompt: "How many three-digit numbers have all three digits the same?",
        answer: "9",
        hint: "The first digit cannot be zero. Once you pick it, the rest are forced.",
        insight: "111 through 999 — one for each digit 1–9, so nine.",
        difficulty: 5,
      },
    ],
  },

  {
    key: "observatory",
    name: "The Hollow Observatory",
    subtitle: "Geometry",
    intro:
      "Walkways ring the floor beneath a sky that is not quite right. Brass gates bar three of them, and the mechanisms that drive them have not been set.",
    palette: { wall: "#2a2338", floor: "#191426", glow: "#f472b6", accent: "#f9a8d4" },
    grid: { rows: 7, cols: 11 },
    timeLimit: 210,
    puzzles: [
      {
        id: "obs-1",
        mechanism: "orrery",
        label: "The Floor Plate",
        prompt: "A rectangular floor plate has perimeter 34 and width 6. What is its area?",
        answer: "66",
        hint: "Perimeter is twice the length plus twice the width. Find the length first.",
        insight: "2(l + 6) = 34 → l = 11, so the area is 11 × 6 = 66.",
        difficulty: 5,
      },
      {
        id: "obs-2",
        mechanism: "dial",
        label: "The Great Ring",
        prompt:
          "The ring overhead encloses an area of 49π. Divide its circumference by π and enter the result.",
        answer: "14",
        hint: "Area is πr². Work the radius out, then remember circumference is 2πr.",
        insight: "πr² = 49π → r = 7, so the circumference is 14π, and 14π ÷ π = 14.",
        difficulty: 6,
      },
      {
        id: "obs-3",
        mechanism: "orrery",
        label: "The Final Alignment",
        prompt: "Three brass arms measure 9, 12 and 15. What is the area of the triangle they form?",
        answer: "54",
        hint: "Check whether those three lengths make a right angle before reaching for anything harder.",
        insight: "9² + 12² = 81 + 144 = 225 = 15², so it is right-angled: area = ½ × 9 × 12 = 54.",
        difficulty: 7,
      },
    ],
  },
];

export const roomByKey = (key: string) => ROOMS.find((r) => r.key === key);
export const TOTAL_PUZZLES = ROOMS.reduce((n, r) => n + r.puzzles.length, 0);

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export type EscapeProgress = {
  /** Puzzle ids already solved, across every room. */
  solved: string[];
  /** Rooms fully cleared, in order. */
  cleared: string[];
};

export function roomSolvedCount(room: Room, solved: readonly string[]): number {
  return room.puzzles.filter((p) => solved.includes(p.id)).length;
}

export function isRoomClear(room: Room, solved: readonly string[]): boolean {
  return roomSolvedCount(room, solved) === room.puzzles.length;
}

/** A room is reachable once every earlier room is clear. The first always is. */
export function isRoomUnlocked(index: number, solved: readonly string[]): boolean {
  if (index <= 0) return true;
  return ROOMS.slice(0, index).every((r) => isRoomClear(r, solved));
}

/** The room the player should be in — the first one not yet finished. */
export function currentRoomIndex(solved: readonly string[]): number {
  const i = ROOMS.findIndex((r) => !isRoomClear(r, solved));
  return i === -1 ? ROOMS.length - 1 : i;
}

export function hasEscaped(solved: readonly string[]): boolean {
  return ROOMS.every((r) => isRoomClear(r, solved));
}

/** XP for solving one puzzle, scaled by how hard it is. */
export function xpForPuzzle(puzzle: Puzzle): number {
  return 6 + puzzle.difficulty * 3;
}

/** A bonus for clearing a whole room, so finishing beats dabbling. */
export function xpForRoom(room: Room): number {
  return 25 + room.puzzles.reduce((n, p) => n + p.difficulty, 0) * 2;
}
