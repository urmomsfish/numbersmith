import type { ProblemSeed } from "./problems";

/**
 * Hand-written difficulty 8-10 problems.
 *
 * Olympiad problems are single ideas — there is nothing to re-parameterize, so
 * the generator approach cannot reach this band. These are written one at a
 * time, and every one is independently re-solved by brute force in
 * `scripts/verify-answers.ts` before it can be seeded.
 *
 * These are seeded as practice (isPlacement: false), not placement questions.
 */
export const OLYMPIAD_PROBLEMS: ProblemSeed[] = [
  // ------------------------------ number theory ------------------------------
  {
    slug: "olymp-nt-01",
    question: "What is the remainder when 2^2024 is divided by 1000?",
    format: "INTEGER",
    answer: "216",
    solution:
      "Work modulo 8 and 125 separately. Since 2^3 = 8, we have 2^2024 ≡ 0 (mod 8). Modulo 125, the order of 2 is 100, and 2024 ≡ 24 (mod 100), so 2^2024 ≡ 2^24 ≡ 91 (mod 125). Solving n ≡ 0 (mod 8) and n ≡ 91 (mod 125) gives n ≡ 216 (mod 1000).",
    hints: [
      "Split 1000 into 8 and 125 and handle each modulus separately.",
      "Modulo 125 the order of 2 is 100, so reduce the exponent 2024 modulo 100.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "olymp-nt-02",
    question: "How many positive divisors of 2016 are perfect squares?",
    format: "INTEGER",
    answer: "6",
    solution:
      "2016 = 2^5 · 3^2 · 7. A divisor is a perfect square exactly when every exponent is even, so the exponent of 2 is 0, 2, or 4 (3 ways), the exponent of 3 is 0 or 2 (2 ways), and the exponent of 7 must be 0 (1 way). That gives 3 × 2 × 1 = 6.",
    hints: [
      "Factor 2016 into prime powers first.",
      "A divisor is a perfect square precisely when each of its prime exponents is even.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "olymp-nt-03",
    question:
      "How many integers n with 1 ≤ n ≤ 1000 are such that n² + n + 1 is divisible by 7?",
    format: "INTEGER",
    answer: "286",
    solution:
      "Testing n ≡ 0, 1, …, 6 (mod 7) gives n² + n + 1 ≡ 1, 3, 0, 6, 0, 3, 1. So the condition holds exactly when n ≡ 2 or n ≡ 4 (mod 7). Each residue class contributes 143 values in [1, 1000], for 286 total.",
    hints: [
      "The condition depends only on n modulo 7 — check all seven residues.",
      "Two residue classes work; count how many integers in the range fall into each.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "olymp-nt-04",
    question: "What is the sum of the digits of 2^100?",
    format: "INTEGER",
    answer: "115",
    solution:
      "2^100 = 1267650600228229401496703205376. Adding its 31 digits gives 115.",
    hints: [
      "There is no shortcut here — the digits must actually be produced.",
      "Repeated doubling, carrying by hand, is the standard approach.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "pumac",
  },
  {
    slug: "olymp-nt-05",
    question: "What are the last three digits of 7^2024?",
    format: "INTEGER",
    answer: "401",
    solution:
      "Since λ(1000) = 100 and gcd(7, 1000) = 1, we have 7^100 ≡ 1 (mod 1000), so 7^2024 ≡ 7^24. Repeated squaring gives 7^2 = 49, 7^4 ≡ 401, 7^8 ≡ 801, 7^16 ≡ 601, and 7^24 = 7^16 · 7^8 ≡ 601 · 801 ≡ 401 (mod 1000).",
    hints: [
      "The multiplicative order of 7 modulo 1000 divides 100.",
      "Reduce the exponent, then use repeated squaring rather than multiplying out.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "olymp-nt-06",
    question:
      "What is the sum of all positive integers n ≤ 100 for which n² + 3n + 2 is divisible by 6?",
    format: "INTEGER",
    answer: "3367",
    solution:
      "n² + 3n + 2 = (n+1)(n+2), a product of two consecutive integers, so it is always even. Modulo 3 the factors are (n+1)(n+2), which is divisible by 3 when n ≡ 1 or n ≡ 2 (mod 3) but not when n ≡ 0 (mod 3), where the product is 1 · 2 ≡ 2. The excluded values 3, 6, …, 99 are 33 numbers summing to 1683, so the answer is 5050 − 1683 = 3367.",
    hints: [
      "Factor the quadratic — it is a product of two consecutive integers.",
      "Divisibility by 2 is automatic. Check all three residues of n mod 3 to see which one fails.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "stanford-math-tournament",
  },

  // ------------------------------ combinatorics ------------------------------
  {
    slug: "olymp-combo-01",
    question:
      "How many subsets of {1, 2, 3, …, 12} contain no two consecutive integers?",
    format: "INTEGER",
    answer: "377",
    solution:
      "Let f(n) be the count for {1, …, n}. A valid subset either omits n (f(n−1) ways) or contains n and therefore omits n−1 (f(n−2) ways). So f(n) = f(n−1) + f(n−2) with f(0) = 1 and f(1) = 2, giving the Fibonacci value f(12) = 377.",
    hints: [
      "Condition on whether the largest element n is in the subset.",
      "Including n forces n−1 out, which produces a Fibonacci recursion.",
    ],
    difficulty: 8,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "aime",
  },
  {
    slug: "olymp-combo-02",
    question: "In how many ways can a 2 × 10 rectangle be tiled by 1 × 2 dominoes?",
    format: "INTEGER",
    answer: "89",
    solution:
      "Let T(n) tile a 2 × n rectangle. The leftmost column is covered either by one vertical domino (leaving 2 × (n−1)) or by two horizontal dominoes (leaving 2 × (n−2)). So T(n) = T(n−1) + T(n−2) with T(1) = 1 and T(2) = 2, giving T(10) = 89.",
    hints: [
      "Look at how the leftmost column is covered — there are only two cases.",
      "That yields a Fibonacci recursion.",
    ],
    difficulty: 8,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "hmmt",
  },
  {
    slug: "olymp-combo-03",
    question:
      "How many ordered triples (a, b, c) of positive integers satisfy abc = 2016?",
    format: "INTEGER",
    answer: "378",
    solution:
      "2016 = 2^5 · 3^2 · 7. Distributing each prime's exponent among three factors is stars and bars: 2^5 gives C(7,2) = 21 ways, 3^2 gives C(4,2) = 6, and 7^1 gives C(3,2) = 3. The total is 21 × 6 × 3 = 378.",
    hints: [
      "Handle each prime independently.",
      "Distributing an exponent e among three factors is C(e+2, 2).",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "aime",
  },
  {
    slug: "olymp-combo-04",
    question: "How many four-digit palindromes are divisible by 7?",
    format: "INTEGER",
    answer: "18",
    solution:
      "A four-digit palindrome has the form abba = 1001a + 110b. Since 1001 = 7 × 143, divisibility by 7 requires 7 | 110b. As 110 ≡ 5 (mod 7), this forces b ≡ 0 (mod 7), so b ∈ {0, 7}. With a ranging over 1–9, there are 9 × 2 = 18.",
    hints: [
      "Write the palindrome as 1001a + 110b.",
      "1001 is divisible by 7, so only the 110b term matters.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "olymp-combo-05",
    question:
      "How many triples of positive integers (x, y, z) with x ≤ y ≤ z satisfy x + y + z = 20?",
    format: "INTEGER",
    answer: "33",
    solution:
      "These are the partitions of 20 into exactly three positive parts. Counting by the smallest part x from 1 to 6 and enumerating the valid (y, z) for each gives 33 in total.",
    hints: [
      "The ordering constraint means you are counting partitions, not compositions.",
      "Fix the smallest part and count the possibilities for the other two.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "arml",
  },

  // ------------------------------- probability -------------------------------
  {
    slug: "olymp-prob-01",
    question:
      "A permutation of 1, 2, 3, 4, 5, 6 is chosen uniformly at random. What is the probability it has exactly two fixed points? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "3/16",
    solution:
      "Choose the two fixed points in C(6,2) = 15 ways, then derange the remaining four in D(4) = 9 ways. That gives 15 × 9 = 135 permutations out of 720, or 135/720 = 3/16.",
    hints: [
      "Choose which elements are fixed, then forbid any further fixed points.",
      "The remaining elements must be deranged — D(4) = 9.",
    ],
    difficulty: 8,
    topicSlug: "conditional-probability",
    competitionSlug: "hmmt",
  },
  {
    slug: "olymp-prob-02",
    question:
      "A fair six-sided die is rolled six times. What is the expected number of distinct values that appear? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "31031/7776",
    solution:
      "By linearity of expectation, sum over the six faces the probability that a face appears at least once. Each face is missed with probability (5/6)^6, so the answer is 6(1 − (5/6)^6) = 6 · 31031/46656 = 31031/7776.",
    hints: [
      "Use an indicator variable for each face value, not for each roll.",
      "Linearity of expectation applies even though the indicators are dependent.",
    ],
    difficulty: 9,
    topicSlug: "expected-value",
    competitionSlug: "pumac",
  },

  // --------------------------------- geometry --------------------------------
  {
    slug: "olymp-geo-01",
    question:
      "How many lattice points (x, y) with integer coordinates satisfy x² + y² < 100?",
    format: "INTEGER",
    answer: "305",
    solution:
      "Counting for each x from −9 to 9 the integers y with y² < 100 − x² and summing gives 305 points strictly inside the circle of radius 10.",
    hints: [
      "Fix x and count the valid y values for each.",
      "Be careful to exclude the twelve points lying exactly on the circle.",
    ],
    difficulty: 8,
    topicSlug: "advanced-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "olymp-geo-02",
    question:
      "A triangle has side lengths 13, 14, and 15. What is its circumradius? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "65/8",
    solution:
      "The semiperimeter is 21, so by Heron the area is √(21·8·7·6) = 84. Then R = abc/(4K) = (13·14·15)/(4·84) = 2730/336 = 65/8.",
    hints: [
      "Find the area first — this triangle has an integer area.",
      "Use R = abc/(4K).",
    ],
    difficulty: 8,
    topicSlug: "advanced-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "olymp-geo-03",
    question:
      "A triangle has side lengths 13, 14, and 15. Let O be its circumcenter and I its incenter. What is OI²? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "65/64",
    solution:
      "The area is 84 and the semiperimeter 21, so r = 84/21 = 4 and R = (13·14·15)/(4·84) = 65/8. Euler's formula gives OI² = R(R − 2r) = (65/8)(65/8 − 8) = (65/8)(1/8) = 65/64.",
    hints: [
      "Compute the inradius and circumradius first.",
      "Euler's relation states OI² = R(R − 2r).",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "pumac",
  },

  // --------------------------- functional equations --------------------------
  {
    slug: "olymp-func-01",
    question:
      "A function f satisfies f(x + y) = f(x) + f(y) + xy for all real x and y, and f(1) = 1. What is f(10)?",
    format: "INTEGER",
    answer: "55",
    solution:
      "Setting g(x) = f(x) − x²/2 turns the equation into g(x+y) = g(x) + g(y), so g is additive with g(1) = 1/2. Hence f(x) = x²/2 + x/2 = x(x+1)/2, and f(10) = 55.",
    hints: [
      "Subtract a quadratic correction term to reduce this to Cauchy's equation.",
      "Try computing f(2), f(3), f(4) from f(1) and look for the pattern.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "olymp-func-02",
    question: "A function f satisfies f(x) + 2f(1/x) = 3x for all nonzero x. What is f(2)?",
    format: "INTEGER",
    answer: "-1",
    solution:
      "Substituting x = 2 gives f(2) + 2f(1/2) = 6. Substituting x = 1/2 gives f(1/2) + 2f(2) = 3/2. Doubling the second and subtracting the first yields 3f(2) = −3, so f(2) = −1.",
    hints: [
      "Substitute both x = 2 and x = 1/2 to get two equations.",
      "Treat f(2) and f(1/2) as two unknowns and solve the linear system.",
    ],
    difficulty: 8,
    topicSlug: "functional-equations",
    competitionSlug: "stanford-math-tournament",
  },

  // ------------------------------- inequalities ------------------------------
  {
    slug: "olymp-ineq-01",
    question:
      "For positive real numbers a and b, what is the minimum possible value of (a + b)(1/a + 1/b)?",
    format: "INTEGER",
    answer: "4",
    solution:
      "Expanding gives 2 + a/b + b/a. By AM-GM, a/b + b/a ≥ 2 with equality when a = b, so the minimum is 4.",
    hints: [
      "Expand the product first.",
      "Apply AM-GM to the pair a/b and b/a.",
    ],
    difficulty: 8,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "arml",
  },
  {
    slug: "olymp-ineq-02",
    question:
      "Positive real numbers a, b, c satisfy a + b + c = 3. What is the maximum possible value of abc?",
    format: "INTEGER",
    answer: "1",
    solution:
      "By AM-GM, (a+b+c)/3 ≥ (abc)^(1/3), so 1 ≥ (abc)^(1/3) and abc ≤ 1, with equality exactly when a = b = c = 1.",
    hints: [
      "Apply AM-GM to the three numbers.",
      "Equality in AM-GM requires all the terms to be equal.",
    ],
    difficulty: 8,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "olymp-alg-01",
    question: "A real number x satisfies x + 1/x = 5. What is x³ + 1/x³?",
    format: "INTEGER",
    answer: "110",
    solution:
      "Cubing gives (x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x), so 125 = x³ + 1/x³ + 15, hence x³ + 1/x³ = 110.",
    hints: [
      "Cube the given expression rather than solving for x.",
      "The expansion of (x + 1/x)³ contains 3(x + 1/x) as a cross term.",
    ],
    difficulty: 8,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "amc12",
  },

  // ----------------------------- logic / strategy ----------------------------
  {
    slug: "olymp-logic-01",
    question:
      "A colony has 13 red, 15 green, and 17 blue chameleons. Whenever two chameleons of different colors meet, both change to the third color. Can all 45 chameleons ever become the same color?",
    format: "MULTIPLE_CHOICE",
    choices: ["Yes, they can all become red", "Yes, but only green", "No, it is impossible", "Yes, but only blue"],
    answer: "C",
    solution:
      "Consider the counts modulo 3. A meeting changes two counts by −1 and one by +2, so all pairwise differences are preserved modulo 3. Initially the counts are 13 ≡ 1, 15 ≡ 0, 17 ≡ 2 (mod 3) — all different. A monochromatic state has two counts equal to 0, which are congruent mod 3. Since no two counts are ever congruent, that state is unreachable.",
    hints: [
      "Look for a quantity that never changes — consider the counts modulo 3.",
      "A meeting shifts two counts down by 1 and one up by 2, which preserves their differences mod 3.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "usamo",
  },
  {
    slug: "olymp-logic-02",
    question:
      "The numbers 1 through 10 are written on a board. Repeatedly, two numbers are erased and replaced by their positive difference, until one number remains. What is the smallest value that final number can be?",
    format: "INTEGER",
    answer: "1",
    solution:
      "Replacing a and b by |a − b| changes the total sum by −2·min(a,b), so the parity of the sum never changes. The initial sum 1 + 2 + … + 10 = 55 is odd, so the final number is odd and cannot be 0. A value of 1 is achievable, so the minimum is 1.",
    hints: [
      "Track the parity of the sum of all numbers on the board.",
      "Each move changes the sum by an even amount, so its parity is invariant.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "usamo",
  },
  {
    slug: "olymp-logic-03",
    question:
      "Two players alternately remove 1, 2, 3, or 4 stones from a pile of 21. The player taking the last stone wins. With optimal play, who wins?",
    format: "MULTIPLE_CHOICE",
    choices: ["The second player", "The first player", "Whoever moves second in the final round", "Neither — the game never ends"],
    answer: "B",
    solution:
      "Positions that are multiples of 5 are losing for the player to move, since any move of k stones lets the opponent take 5 − k and restore a multiple of 5. As 21 is not a multiple of 5, the first player takes 1 stone to leave 20 and wins.",
    hints: [
      "Find the pile sizes that are losing for whoever must move.",
      "Since the moves are 1 through 4, the losing positions come every 5 stones.",
    ],
    difficulty: 8,
    topicSlug: "strategy",
    competitionSlug: "arml",
  },
  {
    slug: "olymp-logic-04",
    question:
      "Two players alternately remove 1, 2, or 3 stones from a pile of 20, and the player taking the last stone wins. With optimal play, who wins?",
    format: "MULTIPLE_CHOICE",
    choices: ["The first player", "The second player", "It depends on the first move", "Neither — the game is drawn"],
    answer: "B",
    solution:
      "With moves of 1 to 3, multiples of 4 are losing for the player to move: whatever they take, the opponent completes the group of 4. Since 20 is a multiple of 4, the second player wins.",
    hints: [
      "Identify the losing positions — they are evenly spaced.",
      "With moves 1 through 3, the spacing is 4.",
    ],
    difficulty: 8,
    topicSlug: "games-and-strategies",
    competitionSlug: "hmmt",
  },
  {
    slug: "olymp-proof-01",
    question: "Which proof technique is most naturally used to show that √2 is irrational?",
    format: "MULTIPLE_CHOICE",
    choices: [
      "Direct computation of the decimal expansion",
      "Mathematical induction on the denominator",
      "Proof by contradiction using a fraction in lowest terms",
      "Exhaustive checking of all rational candidates",
    ],
    answer: "C",
    solution:
      "The standard argument assumes √2 = p/q in lowest terms, deduces that p and q are both even, and contradicts the assumption that the fraction was already reduced.",
    hints: [
      "The argument begins by assuming the opposite of what is to be proved.",
      "It reaches a contradiction with the assumption that the fraction was in lowest terms.",
    ],
    difficulty: 8,
    topicSlug: "proof-techniques",
    competitionSlug: "usamts",
  },
  {
    slug: "olymp-proof-02",
    question:
      "To prove that every integer greater than 1 has a prime factor, which technique is most natural?",
    format: "MULTIPLE_CHOICE",
    choices: [
      "Strong induction, or equivalently the well-ordering principle",
      "Proof by direct construction of the factor",
      "Counting the divisors of each integer",
      "Checking all integers up to a bound",
    ],
    answer: "A",
    solution:
      "Take the least integer greater than 1 with no prime factor. It cannot be prime, so it factors as a product of two smaller integers greater than 1, each of which has a prime factor by minimality — a contradiction. This is the well-ordering principle, equivalent to strong induction.",
    hints: [
      "Consider a smallest counterexample.",
      "Arguing from the least counterexample is the well-ordering principle.",
    ],
    difficulty: 9,
    topicSlug: "proof-techniques",
    competitionSlug: "imo",
  },
];
