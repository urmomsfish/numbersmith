import { type Generator, int, gcd } from "./framework";

/**
 * Logic generators.
 *
 * This domain had 11 problems total across five subtopics before these — the
 * only part of the taxonomy the app advertised but could not actually train.
 *
 * Puzzle answers usually have no closed form, so the `check` for those runs a
 * second search written a different way (different traversal, different
 * evaluator) rather than the formula/brute-force split used elsewhere. Where a
 * closed form does exist — the invariants, the take-away game — `check` is a
 * direct simulation of the process, which is the strongest verification
 * available here.
 */

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

/** Ordinal words for small n, used in question text. */
const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

// ---------------------------------------------------------------------------
// Take-away game: precomputed loss positions.
//
// Built once at module load rather than per instance. `check` calls the game
// solver for every emitted variant, and re-deriving the table each time turned
// generation into a visible pause.
// ---------------------------------------------------------------------------
const TAKEAWAY_LOSS: Map<number, boolean[]> = new Map();
function takeawayLosing(k: number, maxN: number): boolean[] {
  const cached = TAKEAWAY_LOSS.get(k);
  if (cached && cached.length > maxN) return cached;
  // losing[n] = the player about to move from n stones loses under best play.
  const losing: boolean[] = new Array(maxN + 1).fill(false);
  losing[0] = true; // no stones left to take: you already lost
  for (let n = 1; n <= maxN; n++) {
    let win = false;
    for (let take = 1; take <= Math.min(k, n); take++) {
      if (losing[n - take]) win = true;
    }
    losing[n] = !win;
  }
  TAKEAWAY_LOSS.set(k, losing);
  return losing;
}

// ---------------------------------------------------------------------------
// Three-pile Nim: full game tree, solved once for all piles up to NIM_MAX.
// ---------------------------------------------------------------------------
const NIM_MAX = 20;
let NIM_LOSING: boolean[] | null = null;
const nimIndex = (a: number, b: number, c: number) => (a * (NIM_MAX + 1) + b) * (NIM_MAX + 1) + c;
function nimLosing(): boolean[] {
  if (NIM_LOSING) return NIM_LOSING;
  const size = (NIM_MAX + 1) ** 3;
  const losing = new Array<boolean>(size).fill(false);
  // Ascending total order guarantees every successor is already decided —
  // every legal move strictly decreases one pile.
  for (let total = 0; total <= 3 * NIM_MAX; total++) {
    for (let a = 0; a <= Math.min(NIM_MAX, total); a++) {
      for (let b = 0; b <= Math.min(NIM_MAX, total - a); b++) {
        const c = total - a - b;
        if (c > NIM_MAX) continue;
        let win = false;
        for (let t = 1; t <= a && !win; t++) if (losing[nimIndex(a - t, b, c)]) win = true;
        for (let t = 1; t <= b && !win; t++) if (losing[nimIndex(a, b - t, c)]) win = true;
        for (let t = 1; t <= c && !win; t++) if (losing[nimIndex(a, b, c - t)]) win = true;
        losing[nimIndex(a, b, c)] = !win;
      }
    }
  }
  NIM_LOSING = losing;
  return losing;
}

export const LOGIC: Generator[] = [
  // =========================== DEDUCTION ===========================
  {
    id: "gen-logic-prize-boxes",
    topicSlug: "deduction",
    difficulty: 3,
    competitionSlug: "math-kangaroo",
    variants: 90,
    params: (r) => {
      const n = int(r, 3, 4);
      // Each box carries one label: "the prize is (not) in box t".
      const t: number[] = [];
      const pol: number[] = [];
      for (let i = 0; i < n; i++) {
        t.push(int(r, 1, n));
        pol.push(int(r, 0, 1));
      }
      return { n, t1: t[0], t2: t[1], t3: t[2], t4: t[3] ?? 0, p1: pol[0], p2: pol[1], p3: pol[2], p4: pol[3] ?? 0 };
    },
    build: (p) => {
      const { n } = p;
      const targets = [p.t1, p.t2, p.t3, p.t4].slice(0, n);
      const polarities = [p.p1, p.p2, p.p3, p.p4].slice(0, n);
      const says = (i: number, box: number) =>
        polarities[i] === 1 ? box === targets[i] : box !== targets[i];

      // Exactly one label is true. Keep only puzzles with a unique solution.
      const solutions: number[] = [];
      for (let box = 1; box <= n; box++) {
        let trueCount = 0;
        for (let i = 0; i < n; i++) if (says(i, box)) trueCount++;
        if (trueCount === 1) solutions.push(box);
      }
      if (solutions.length !== 1) throw new Error("reject");
      const answer = solutions[0];

      const labels = targets.map((t, i) =>
        polarities[i] === 1
          ? `Box ${i + 1}: "The prize is in box ${t}."`
          : `Box ${i + 1}: "The prize is not in box ${t}."`
      );
      return {
        question: `${n} boxes are labelled as follows.\n${labels.join("\n")}\nExactly one of these ${n} labels is true, and exactly one box contains a prize. Which box number contains the prize?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Test each box in turn. If the prize were in box ${answer}, then exactly one label would be true, which matches the given condition. Every other box makes the number of true labels something other than one, so the prize is in box ${answer}.`,
        hints: [
          "Assume the prize is in a particular box, then count how many labels that makes true.",
          "Only one assumption leaves exactly one true label.",
        ],
      };
    },
    // Independent route: score every box with a bitmask of label truth and
    // select the box whose mask has a single set bit.
    check: (p) => {
      const { n } = p;
      const targets = [p.t1, p.t2, p.t3, p.t4];
      const polarities = [p.p1, p.p2, p.p3, p.p4];
      let found = -1;
      for (let box = 1; box <= n; box++) {
        let mask = 0;
        for (let i = 0; i < n; i++) {
          const truth = polarities[i] === 1 ? (box === targets[i] ? 1 : 0) : box === targets[i] ? 0 : 1;
          mask |= truth << i;
        }
        let bits = 0;
        for (let m = mask; m; m >>= 1) bits += m & 1;
        if (bits === 1) found = box;
      }
      return String(found);
    },
  },

  {
    id: "gen-logic-knights-knaves",
    topicSlug: "deduction",
    difficulty: 5,
    competitionSlug: "mathcounts",
    variants: 120,
    // Statements are about *how many* knaves there are, not about who is who.
    //
    // That is forced, not stylistic. If every statement only asserted the type
    // of another person, then flipping every knight to a knave and vice versa
    // would preserve consistency — a knight's true claim becomes a knave's
    // false one — so consistent assignments would always come in mirrored
    // pairs and no such puzzle would ever have a unique answer. A count
    // statement is not symmetric under that flip, which is what makes these
    // solvable.
    params: (r) => {
      const n = int(r, 3, 5);
      const kind: number[] = [];
      const k: number[] = [];
      for (let i = 0; i < 5; i++) {
        kind.push(i < n ? int(r, 0, 1) : 0);
        k.push(i < n ? int(r, 1, n) : 0);
      }
      return {
        n,
        d1: kind[0], d2: kind[1], d3: kind[2], d4: kind[3], d5: kind[4],
        v1: k[0], v2: k[1], v3: k[2], v4: k[3], v5: k[4],
      };
    },
    build: (p) => {
      const { n } = p;
      const kind = [p.d1, p.d2, p.d3, p.d4, p.d5].slice(0, n);
      const k = [p.v1, p.v2, p.v3, p.v4, p.v5].slice(0, n);
      const names = ["Alia", "Bruno", "Cheng", "Dara", "Emeka"].slice(0, n);
      const stmtTrue = (i: number, knaves: number) =>
        kind[i] === 0 ? knaves >= k[i] : knaves <= k[i];

      // Enumerate every knight/knave assignment as a bitmask. A knight's
      // statement must come out true, a knave's false.
      const consistent: number[] = [];
      for (let mask = 0; mask < 1 << n; mask++) {
        let knights = 0;
        for (let i = 0; i < n; i++) knights += (mask >> i) & 1;
        const knaves = n - knights;
        let ok = true;
        for (let i = 0; i < n; i++) {
          const isKnight = ((mask >> i) & 1) === 1;
          if (stmtTrue(i, knaves) !== isKnight) ok = false;
        }
        if (ok) consistent.push(mask);
      }
      if (consistent.length !== 1) throw new Error("reject");
      let answer = 0;
      for (let i = 0; i < n; i++) answer += (consistent[0] >> i) & 1;

      const lines = names.map(
        (name, i) =>
          `${name} says, "${kind[i] === 0 ? "At least" : "At most"} ${k[i]} of us ${k[i] === 1 ? "is a knave" : "are knaves"}."`
      );
      return {
        question: `On an island every inhabitant is either a knight, who always tells the truth, or a knave, who always lies. ${n} inhabitants each make a statement about their own group.\n${lines.join("\n")}\nHow many of the ${n} are knights?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each statement is true or false depending only on how many knaves there are, so try each possible number of knaves from 0 to ${n}. For a given count, every inhabitant whose statement is true must be a knight and every inhabitant whose statement is false must be a knave — that fixes the whole assignment, and you keep only the counts that agree with themselves. Exactly one survives, and it has ${answer} knight${answer === 1 ? "" : "s"}.`,
        hints: [
          "Every statement's truth depends only on the total number of knaves, not on who is who.",
          `Guess that number, work out who must then be a knight, and check the guess against itself.`,
        ],
      };
    },
    // Independent route: instead of sweeping all 2^n assignments, solve the
    // fixed point directly — assume a knave count, derive the unique assignment
    // it forces, and keep the counts that reproduce themselves.
    check: (p) => {
      const { n } = p;
      const kind = [p.d1, p.d2, p.d3, p.d4, p.d5];
      const k = [p.v1, p.v2, p.v3, p.v4, p.v5];
      const results: number[] = [];
      for (let knaves = 0; knaves <= n; knaves++) {
        let impliedKnaves = 0;
        for (let i = 0; i < n; i++) {
          const truth = kind[i] === 0 ? knaves >= k[i] : knaves <= k[i];
          if (!truth) impliedKnaves++;
        }
        if (impliedKnaves === knaves) results.push(n - knaves);
      }
      if (results.length !== 1) throw new Error("not unique");
      return String(results[0]);
    },
  },

  {
    id: "gen-logic-age-multiple",
    topicSlug: "deduction",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 90,
    params: (r) => {
      const b = int(r, 2, 5);
      const a = int(r, b + 1, 9);
      const y = int(r, 1, 20);
      // Ben's present age n satisfies n(a − b) = y(b − 1).
      const numer = y * (b - 1);
      if (numer % (a - b) !== 0) throw new Error("reject");
      const n = numer / (a - b);
      if (n < 2 || n > 60) throw new Error("reject");
      return { a, b, y };
    },
    build: ({ a, b, y }) => {
      const n = (y * (b - 1)) / (a - b);
      return {
        question: `Maya is ${a} times as old as Noor. In ${y} year${y === 1 ? "" : "s"}, Maya will be ${b} times as old as Noor. How old is Noor now?`,
        format: "SHORT_ANSWER",
        answer: String(n),
        solution: `Let Noor be n, so Maya is ${a}n. In ${y} years, ${a}n + ${y} = ${b}(n + ${y}). Expanding gives ${a}n + ${y} = ${b}n + ${b * y}, so ${a - b}n = ${b * y - y}, and n = ${n}.`,
        hints: [
          "Call Noor's present age n and write Maya's age in terms of it.",
          "Add the same number of years to both ages, then set up the second relationship.",
        ],
      };
    },
    // Independent route: search the integer ages directly instead of solving.
    check: ({ a, b, y }) => {
      for (let n = 1; n <= 500; n++) {
        if (a * n + y === b * (n + y)) return String(n);
      }
      throw new Error("no age");
    },
  },

  // ============================ PATTERNS ============================
  {
    id: "gen-logic-recursive-pattern",
    topicSlug: "patterns",
    difficulty: 2,
    competitionSlug: "moems",
    variants: 110,
    params: (r) => ({
      s: int(r, 1, 9),
      m: int(r, 2, 4),
      c: int(r, -4, 9),
      k: int(r, 5, 6),
    }),
    build: ({ s, m, c, k }) => {
      const terms = [s];
      for (let i = 1; i < k; i++) terms.push(terms[i - 1] * m + c);
      const answer = terms[k - 1];
      if (answer > 200000 || terms.some((t) => t < 0)) throw new Error("reject");
      const shown = terms.slice(0, k - 1);
      const rule =
        c === 0
          ? `multiplying the previous term by ${m}`
          : c > 0
            ? `multiplying the previous term by ${m} and adding ${c}`
            : `multiplying the previous term by ${m} and subtracting ${-c}`;
      return {
        question: `A sequence begins ${shown.join(", ")}, … Each term after the first is found by ${rule}. What is the ${ORDINAL[k]} term?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Apply the rule to the last shown term: ${shown[shown.length - 1]} × ${m}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`} = ${answer}.`,
        hints: ["Check the rule against the terms you were given before using it.", "Apply it once more to the final listed term."],
      };
    },
    // Independent route: the closed form of a linear recurrence,
    // a_k = m^(k−1)·s + c·(m^(k−1) − 1)/(m − 1).
    check: ({ s, m, c, k }) => {
      const p = Math.pow(m, k - 1);
      return String(p * s + (c * (p - 1)) / (m - 1));
    },
  },

  {
    id: "gen-logic-figurate",
    topicSlug: "patterns",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 100,
    params: (r) => ({ s: int(r, 3, 8), n: int(r, 5, 40) }),
    build: ({ s, n }) => {
      const NAMES: Record<number, string> = {
        3: "triangular",
        4: "square",
        5: "pentagonal",
        6: "hexagonal",
        7: "heptagonal",
        8: "octagonal",
      };
      const answer = (n * ((s - 2) * n - (s - 4))) / 2;
      return {
        question: `The ${NAMES[s]} numbers begin 1, ${s}, ${(3 * (3 * (s - 2) - (s - 4))) / 2}, … , with the nth one counting the dots in a growing ${NAMES[s]} array. What is the ${n}th ${NAMES[s]} number?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The nth ${NAMES[s]} number is n((${s} − 2)n − (${s} − 4))/2 = ${n}(${s - 2}·${n} − ${s - 4})/2 = ${answer}.`,
        hints: [
          `Consecutive ${NAMES[s]} numbers differ by an arithmetic sequence with common difference ${s - 2}.`,
          "Sum that arithmetic sequence and add the starting dot.",
        ],
      };
    },
    // Independent route: accumulate the successive gaps rather than using the
    // closed form. The nth figurate number is 1 + Σ(1 + i(s − 2)) for i < n.
    check: ({ s, n }) => {
      let total = 0;
      for (let i = 0; i < n; i++) total += 1 + i * (s - 2);
      return String(total);
    },
  },

  // =========================== INVARIANTS ===========================
  {
    id: "gen-logic-invariant-sum",
    topicSlug: "invariants",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 60,
    params: (r) => ({ n: int(r, 5, 64) }),
    build: ({ n }) => {
      const answer = (n * (n + 1)) / 2 - (n - 1);
      return {
        question: `The numbers 1, 2, 3, …, ${n} are written on a board. Repeatedly, two numbers a and b are erased and the single number a + b − 1 is written in their place. This continues until one number remains. What is that number?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each move reduces the count of numbers by 1 and reduces their total by 1, so (sum − count) never changes. It starts at ${(n * (n + 1)) / 2} − ${n} = ${(n * (n + 1)) / 2 - n} and ends at (final − 1), giving ${answer}. The order of moves is irrelevant.`,
        hints: [
          "Look for a quantity the operation leaves unchanged.",
          "Track the sum of all numbers and how many numbers there are at the same time.",
        ],
      };
    },
    // Independent route: actually run the process, folding left to right.
    check: ({ n }) => {
      let acc = 1;
      for (let x = 2; x <= n; x++) acc = acc + x - 1;
      return String(acc);
    },
  },

  {
    id: "gen-logic-invariant-product",
    topicSlug: "invariants",
    difficulty: 6,
    competitionSlug: "amc10",
    variants: 7,
    params: (r) => ({ n: int(r, 3, 9) }),
    build: ({ n }) => {
      const answer = fact(n + 1) - 1;
      return {
        question: `The numbers 1, 2, 3, …, ${n} are written on a board. Repeatedly, two numbers a and b are erased and the single number ab + a + b is written in their place. This continues until one number remains. What is that number?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Note that ab + a + b = (a + 1)(b + 1) − 1. So if you add 1 to every number on the board, the operation becomes plain multiplication and the product of (each number + 1) is invariant. That product is 2 · 3 · … · ${n + 1} = ${n + 1}! = ${fact(n + 1)}, so the final number is ${fact(n + 1)} − 1 = ${answer}.`,
        hints: [
          "The expression ab + a + b is one less than a product of two shifted terms.",
          "Add 1 to every number on the board and see what the move does then.",
        ],
      };
    },
    // Independent route: simulate the moves directly, no factorial identity.
    check: ({ n }) => {
      let acc = 1;
      for (let x = 2; x <= n; x++) acc = acc * x + acc + x;
      return String(acc);
    },
  },

  {
    id: "gen-logic-invariant-gcd",
    topicSlug: "invariants",
    difficulty: 5,
    competitionSlug: "purple-comet",
    variants: 100,
    params: (r) => {
      const p = int(r, 6, 60);
      const q = int(r, 6, 60);
      if (p === q) throw new Error("reject");
      return { p, q };
    },
    build: ({ p, q }) => {
      const answer = gcd(p, q);
      return {
        question: `A counter starts at 0. On each move you may either add ${p} or subtract ${q}. What is the smallest positive value the counter can ever show?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Every reachable value has the form ${p}i − ${q}j, so every reachable value is a multiple of gcd(${p}, ${q}) = ${answer} — that divisibility is the invariant. And ${answer} itself is reachable, since the gcd of two numbers is always expressible in that form. So the smallest positive reachable value is ${answer}.`,
        hints: [
          "Every value you can reach is a multiple of some fixed number. Which one?",
          "Ask what both step sizes have in common.",
        ],
      };
    },
    // Independent route: breadth-first search of the reachable values in a
    // bounded window, with no reference to the gcd at all.
    check: ({ p, q }) => {
      const limit = p * q;
      const seen = new Uint8Array(2 * limit + 1);
      const shift = limit;
      const queue: number[] = [0];
      seen[shift] = 1;
      let best = Infinity;
      while (queue.length) {
        const v = queue.shift()!;
        if (v > 0 && v < best) best = v;
        for (const nv of [v + p, v - q]) {
          if (nv < -limit || nv > limit) continue;
          if (seen[nv + shift]) continue;
          seen[nv + shift] = 1;
          queue.push(nv);
        }
      }
      return String(best);
    },
  },

  // ============================ STRATEGY ============================
  {
    id: "gen-logic-takeaway-game",
    topicSlug: "strategy",
    difficulty: 5,
    competitionSlug: "mathcounts",
    variants: 110,
    params: (r) => {
      const k = int(r, 2, 7);
      const n = int(r, 10, 120);
      if (n % (k + 1) === 0) throw new Error("reject"); // first player loses; no winning move to name
      return { n, k };
    },
    build: ({ n, k }) => {
      const answer = n % (k + 1);
      return {
        question: `A pile holds ${n} stones. Two players alternate turns, and on each turn a player removes between 1 and ${k} stones. The player who takes the last stone wins. How many stones should the first player remove on the opening turn to guarantee a win?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `A player loses exactly when the pile they face is a multiple of ${k + 1}, because whatever they take, the opponent can take the rest of the block of ${k + 1}. Since ${n} = ${k + 1}·${Math.floor(n / (k + 1))} + ${answer}, the first player removes ${answer} to hand over a multiple of ${k + 1}.`,
        hints: [
          `Find the pile sizes from which the player to move is doomed.`,
          `Whatever your opponent takes, you can always bring the two turns' total to ${k + 1}.`,
        ],
      };
    },
    // Independent route: solve the game by dynamic programming over all pile
    // sizes and read off the winning move, with no modular reasoning.
    check: ({ n, k }) => {
      const losing = takeawayLosing(k, 200);
      for (let take = 1; take <= Math.min(k, n); take++) {
        if (losing[n - take]) return String(take);
      }
      throw new Error("no winning move");
    },
  },

  {
    id: "gen-logic-nim-three-piles",
    topicSlug: "strategy",
    difficulty: 8,
    competitionSlug: "arml",
    variants: 90,
    params: (r) => {
      const a = int(r, 1, NIM_MAX);
      const b = int(r, 1, NIM_MAX);
      const c = int(r, 1, NIM_MAX);
      // A winning move out of the third pile exists only when a XOR b < c.
      if ((a ^ b) >= c) throw new Error("reject");
      return { a, b, c };
    },
    build: ({ a, b, c }) => {
      const answer = c - (a ^ b);
      return {
        question: `Three piles hold ${a}, ${b}, and ${c} stones. Two players alternate turns, and on each turn a player removes any positive number of stones from a single pile of their choice. The player who takes the last stone wins. The first player can win by taking stones from the pile of ${c}. How many stones should they take?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Write the pile sizes in binary and take their XOR. A position is a loss for the player to move exactly when that XOR is 0. Here ${a} XOR ${b} = ${a ^ b}, so the third pile must be cut down to ${a ^ b}, which means removing ${c} − ${a ^ b} = ${answer} stones.`,
        hints: [
          "Write each pile size in binary and line the digits up.",
          "Aim to leave a position where every binary column has an even number of 1s.",
        ],
      };
    },
    // Independent route: the full game tree, solved by dynamic programming
    // over every reachable position, never computing an XOR.
    check: ({ a, b, c }) => {
      const losing = nimLosing();
      for (let take = 1; take <= c; take++) {
        if (losing[nimIndex(a, b, c - take)]) return String(take);
      }
      throw new Error("no winning move");
    },
  },

  // ========================= LOGICAL PUZZLES =========================
  {
    id: "gen-logic-weighings",
    topicSlug: "logical-puzzles",
    difficulty: 4,
    competitionSlug: "math-kangaroo",
    variants: 60,
    params: (r) => ({ n: int(r, 4, 400) }),
    build: ({ n }) => {
      let answer = 0;
      let covered = 1;
      while (covered < n) {
        covered *= 3;
        answer++;
      }
      return {
        question: `You have ${n} identical-looking coins. Exactly one is heavier than the rest; the others all weigh the same. Using only a balance scale that compares two groups of coins, what is the smallest number of weighings that is guaranteed to identify the heavy coin?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each weighing has three possible outcomes — left heavier, right heavier, or balanced — so w weighings can distinguish at most 3^w cases. You need 3^w ≥ ${n}, and the smallest such w is ${answer} (3^${answer} = ${3 ** answer}). Splitting into three near-equal groups each time achieves it.`,
        hints: [
          "A balance has three outcomes, not two.",
          "Ask how many coins w weighings can possibly handle, then find the smallest w that is enough.",
        ],
      };
    },
    // Independent route: divide the search space down instead of powering up.
    check: ({ n }) => {
      let remaining = n;
      let w = 0;
      while (remaining > 1) {
        remaining = Math.ceil(remaining / 3);
        w++;
      }
      return String(w);
    },
  },

  {
    id: "gen-logic-digit-reversal-sum",
    topicSlug: "logical-puzzles",
    difficulty: 4,
    competitionSlug: "amc8",
    // s = 2 has no solution — it would need two distinct nonzero digits
    // summing to 2 — so the usable range is 3..17.
    variants: 15,
    params: (r) => ({ s: int(r, 2, 17) }),
    build: ({ s }) => {
      // A and B are the digits; A + B = s with both nonzero and distinct.
      const total = 11 * s;
      const pairs: number[] = [];
      for (let A = 1; A <= 9; A++) {
        for (let B = 1; B <= 9; B++) {
          if (A !== B && 10 * A + B + (10 * B + A) === total) pairs.push(A);
        }
      }
      if (pairs.length === 0) throw new Error("reject");
      return {
        question: `A and B are distinct nonzero digits. The two-digit number "AB" plus the two-digit number "BA" equals ${total}. What is A + B?`,
        format: "SHORT_ANSWER",
        answer: String(s),
        solution: `"AB" is 10A + B and "BA" is 10B + A, so their sum is 11A + 11B = 11(A + B). Setting 11(A + B) = ${total} gives A + B = ${s}. Notice the individual digits are not determined — only their sum is.`,
        hints: [
          "Write each two-digit number in terms of its digits.",
          "Add the two expressions and factor what you get.",
        ],
      };
    },
    // Independent route: brute-force every ordered digit pair.
    check: ({ s }) => {
      const total = 11 * s;
      for (let A = 1; A <= 9; A++) {
        for (let B = 1; B <= 9; B++) {
          if (A !== B && 10 * A + B + (10 * B + A) === total) return String(A + B);
        }
      }
      throw new Error("no pair");
    },
  },

  {
    id: "gen-logic-digit-sum-multiple",
    topicSlug: "logical-puzzles",
    difficulty: 5,
    competitionSlug: "mathcounts",
    variants: 9,
    params: (r) => ({ k: int(r, 2, 10) }),
    build: ({ k }) => {
      const found: number[] = [];
      for (let x = 10; x <= 99; x++) {
        const ds = Math.floor(x / 10) + (x % 10);
        if (x === k * ds) found.push(x);
      }
      if (found.length === 0) throw new Error("reject");
      const answer = found.reduce((a, b) => a + b, 0);
      return {
        question: `Find the sum of all two-digit numbers that are exactly ${k} times the sum of their own digits.`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Write the number as 10A + B. The condition is 10A + B = ${k}(A + B), which rearranges to ${10 - k}A = ${k - 1}B. Solving over the digits gives ${found.length === 1 ? `the single number ${found[0]}` : `the numbers ${found.join(", ")}`}, with sum ${answer}.`,
        hints: [
          "Write the two-digit number as 10A + B and set up the equation.",
          "Rearranging leaves a simple proportion between A and B.",
        ],
      };
    },
    // Independent route: iterate over the digit pair rather than the number,
    // which is the search the algebra above is meant to replace.
    check: ({ k }) => {
      let total = 0;
      for (let A = 1; A <= 9; A++) {
        for (let B = 0; B <= 9; B++) {
          if (10 * A + B === k * (A + B)) total += 10 * A + B;
        }
      }
      return String(total);
    },
  },
];
