import type { ProblemSeed } from "./problems";

/**
 * Hand-written competition-tagged problems for PUMaC (Princeton University
 * Mathematics Competition) and SMT (Stanford Math Tournament).
 *
 * These exist because "Start Simulation" for both competitions was falling
 * back to generic algebra-generator filler — neither had enough real,
 * hand-authored, competition-tagged content to pull from. All problems below
 * are original to NumberSmith, written in the subject-round / general-round
 * style of each tournament, and every answer was independently re-derived
 * (by hand and by brute-force / symbolic script) before being written down.
 *
 * PUMAC_PROBLEMS: 16 problems, difficulty 7-10, SHORT_ANSWER, one HMMT-tier
 * subject round each of Algebra, Combinatorics, Geometry, Number Theory.
 *
 * SMT_PROBLEMS: 16 problems, difficulty 6-9, SHORT_ANSWER, a broader mix of
 * general-round and subject-round material, one notch gentler than PUMaC.
 */

export const PUMAC_PROBLEMS: ProblemSeed[] = [
  // ------------------------------ algebra ------------------------------
  {
    slug: "pumac-01",
    question:
      "Real numbers x and y satisfy x + y = 7 and x^3 + y^3 = 133. Find xy.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "Use x^3 + y^3 = (x+y)^3 - 3xy(x+y). Substituting x+y = 7 gives 133 = 343 - 21xy, so 21xy = 210 and xy = 10.",
    hints: [
      "Expand (x+y)^3 to relate it to x^3+y^3 and xy.",
      "You only need the identity x^3+y^3 = (x+y)^3 - 3xy(x+y); plug in the known values and solve for xy.",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-02",
    question:
      "Find the sum of all real solutions to x^4 - 4x^3 + 6x^2 - 4x - 2015 = 0.",
    format: "SHORT_ANSWER",
    answer: "2",
    solution:
      "Note x^4 - 4x^3 + 6x^2 - 4x + 1 = (x-1)^4, so the equation is (x-1)^4 - 1 - 2015 = 0, i.e. (x-1)^4 = 2016. This has exactly two real solutions, x - 1 = ±2016^(1/4), which are symmetric about x = 1. Their sum is 2·1 = 2.",
    hints: [
      "The first five terms x^4-4x^3+6x^2-4x+1 are the binomial expansion of (x-1)^4 — rewrite the equation in that form.",
      "A quartic of the form (x-1)^4 = k has two real roots that are symmetric about x = 1; you don't need their exact values to find their sum.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-03",
    question:
      "The function f: R → R satisfies f(x)f(y) - f(xy) = x + y for all real x, y. Find f(2024).",
    format: "SHORT_ANSWER",
    answer: "2025",
    solution:
      "Set x = y = 0: f(0)^2 - f(0) = 0, so f(0) = 0 or f(0) = 1. Set y = 0 in the original equation: f(0)f(x) - f(0) = x, i.e. f(0)(f(x)-1) = x. If f(0) = 0 this forces 0 = x for all x, a contradiction, so f(0) = 1. Then f(x) - 1 = x, so f(x) = x + 1. Checking: (x+1)(y+1) - (xy+1) = x+y, which holds for all x, y. Hence f(2024) = 2025.",
    hints: [
      "Plug in x = y = 0 first to pin down f(0), then plug in y = 0 to get an equation relating f(x) and f(0).",
      "Once you have a candidate formula for f, verify it satisfies the original equation for all x and y before trusting it.",
    ],
    difficulty: 9,
    topicSlug: "functions",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-04",
    question:
      "Positive real numbers a, b, c satisfy a + b + c = 3 and a^2 + b^2 + c^2 = 5. Find the maximum possible value of abc.",
    format: "SHORT_ANSWER",
    answer: "2√3/9",
    solution:
      "With e1 = a+b+c = 3 and sum of squares 5, e2 = ab+bc+ca = (e1^2 - 5)/2 = 2. For fixed e1 and e2, the elementary symmetric function e3 = abc is extremized (over reals satisfying the constraints) exactly when two of the variables are equal. Set a = b = t, c = 3-2t. The sum-of-squares constraint gives 2t^2 + (3-2t)^2 = 5, i.e. 6t^2 - 12t + 4 = 0, so t = 1 ± √3/3. Positivity of a, b, c requires t = 1 - √3/3 (the other root makes c negative), giving c = 1 + 2√3/3 and abc = t^2·c = 2√3/9. Checking the boundary of the feasible region (any variable → 0) gives abc → 0, so this interior critical value is the maximum.",
    hints: [
      "Compute ab+bc+ca first from the two given sums using (a+b+c)^2 = a^2+b^2+c^2+2(ab+bc+ca).",
      "With a+b+c and a^2+b^2+c^2 both fixed, the extreme values of abc occur when two of the three variables are equal — reduce to one variable.",
    ],
    difficulty: 10,
    topicSlug: "inequalities",
    competitionSlug: "pumac",
  },

  // ---------------------------- combinatorics ----------------------------
  {
    slug: "pumac-05",
    question:
      "In how many ways can a 2×12 rectangular board be tiled using 1×2 dominoes?",
    format: "SHORT_ANSWER",
    answer: "233",
    solution:
      "Let T(n) be the number of tilings of a 2×n board. The rightmost column is covered either by one vertical domino (leaving a 2×(n-1) board, T(n-1) ways) or by two horizontal dominoes spanning the last two columns (leaving a 2×(n-2) board, T(n-2) ways). So T(n) = T(n-1) + T(n-2), with T(1) = 1, T(2) = 2. Computing: T(3)=3, T(4)=5, T(5)=8, T(6)=13, T(7)=21, T(8)=34, T(9)=55, T(10)=89, T(11)=144, T(12)=233.",
    hints: [
      "Condition on how the rightmost column(s) of the board are covered to get a recurrence relating T(n) to smaller boards.",
      "The recurrence is the Fibonacci recurrence; compute the base cases T(1) and T(2) and iterate up to n = 12.",
    ],
    difficulty: 7,
    topicSlug: "recursion-in-counting",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-06",
    question:
      "How many 4-element subsets of {1, 2, ..., 12} contain no two consecutive integers?",
    format: "SHORT_ANSWER",
    answer: "126",
    solution:
      "Choosing k non-consecutive elements from {1,...,n} is equivalent to choosing k elements from a set of size n-k+1 (via the bijection that subtracts one less than the element's rank from each chosen value, which removes the required gaps). Here n=12, k=4, so the count is C(12-4+1, 4) = C(9,4) = 126.",
    hints: [
      "There is a standard bijection turning non-consecutive selections from {1,...,n} into ordinary combinations from a smaller set — try subtracting (position in sorted order − 1) from each chosen element.",
      "After the bijection you just need C(9,4).",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-07",
    question:
      "In how many ways can 10 identical stickers be distributed among 4 distinct albums so that every album receives at least 1 and at most 4 stickers?",
    format: "SHORT_ANSWER",
    answer: "44",
    solution:
      "Let each album get x_i with 1 ≤ x_i ≤ 4 and x1+x2+x3+x4 = 10. Substitute y_i = x_i - 1, so 0 ≤ y_i ≤ 3 and y1+y2+y3+y4 = 6. By inclusion-exclusion on the upper bound y_i ≤ 3: the unrestricted count is C(6+3,3) = C(9,3) = 84. Subtract cases where some y_i ≥ 4 (set z_i = y_i - 4, sum = 2, giving C(2+3,3) = C(5,3) = 10 for each of the 4 variables, so 4·10 = 40 to subtract); no two variables can simultaneously exceed 3 since that would require sum ≥ 8 > 6. Total: 84 - 40 = 44.",
    hints: [
      "Shift variables so each album's count ranges from 0 to 3, turning this into a bounded stars-and-bars problem.",
      "Use inclusion-exclusion: count all nonnegative solutions to the shifted equation, then subtract the solutions where some album's shifted count is at least 4.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-08",
    question:
      "How many permutations σ of {1, 2, ..., 7} satisfy |σ(i) - i| ≤ 2 for every i from 1 to 7?",
    format: "SHORT_ANSWER",
    answer: "172",
    solution:
      "Build the permutation position by position, tracking which nearby values remain available; each position i can only receive a value from {i-2,...,i+2} that hasn't been used yet. Carrying out this constrained count exhaustively (equivalently, brute-force checking all 5040 permutations of 7 elements against |σ(i)-i| ≤ 2) yields exactly 172 valid permutations.",
    hints: [
      "Each position i can only be assigned one of at most 5 values (i-2 through i+2, intersected with {1,...,7}), so build the permutation position by position and track which nearby values are still unused.",
      "The first and last couple of positions are the most restrictive (only 3 candidate values); handle the boundary cases carefully before the middle of the permutation opens up.",
    ],
    difficulty: 10,
    topicSlug: "permutations",
    competitionSlug: "pumac",
  },

  // ------------------------------ geometry ------------------------------
  {
    slug: "pumac-09",
    question:
      "Triangle ABC has side lengths AB = 13, BC = 14, CA = 15. Find the radius of its inscribed circle.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "The semiperimeter is s = (13+14+15)/2 = 21. By Heron's formula, the area is √(21·8·7·6) = √7056 = 84. The inradius is r = Area/s = 84/21 = 4.",
    hints: [
      "Compute the semiperimeter and use Heron's formula to find the area.",
      "The inradius of any triangle equals its area divided by its semiperimeter.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-10",
    question:
      "Two circles have radii 5 and 3. The distance between their centers is 6, and they intersect at two points. Find the length of their common chord.",
    format: "SHORT_ANSWER",
    answer: "4√14/3",
    solution:
      "Place the centers on a line 6 apart. If a is the distance from the radius-5 center to the chord's midpoint, the radical-axis relation gives a = (d^2 + r1^2 - r2^2)/(2d) = (36+25-9)/12 = 52/12 = 13/3. The half-chord length is √(r1^2 - a^2) = √(25 - 169/9) = √(56/9) = (2√14)/3, so the full chord is 4√14/3.",
    hints: [
      "Set up the distance from one circle's center to the common chord using the standard radical-axis formula a = (d^2+r1^2-r2^2)/(2d).",
      "Once you have that distance, the Pythagorean theorem on the right triangle formed by the radius, the distance to the chord, and half the chord gives the half-chord length.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-11",
    question:
      "A cube has side length 6. A plane passes through the midpoints of the three edges meeting at one vertex of the cube. Find the area of the triangular cross-section this plane creates.",
    format: "SHORT_ANSWER",
    answer: "9√3/2",
    solution:
      "Place the vertex at the origin with the three edges along the axes. The three midpoints are at (3,0,0), (0,3,0), (0,0,3). Each pair of these points is distance √(3^2+3^2) = 3√2 apart, so the cross-section is an equilateral triangle with side length 3√2. Its area is (√3/4)(3√2)^2 = (√3/4)(18) = 9√3/2.",
    hints: [
      "Set up coordinates with the shared vertex at the origin and the three edges along the coordinate axes; find the coordinates of the three midpoints.",
      "Compute the distance between two of the midpoints to get the side length of the (equilateral) cross-section, then apply the equilateral triangle area formula.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-12",
    question:
      "In triangle ABC, cevians AD, BE, CF meet at a common point P, with D on BC, E on CA, F on AB. Given AP/PD = 3 and BP/PE = 4, find CP/PF.",
    format: "SHORT_ANSWER",
    answer: "9/11",
    solution:
      "Assign masses m_A, m_B, m_C to the vertices so P is the balance point. Since D lies on BC, mass point theory gives AP/PD = (m_B+m_C)/m_A, and similarly BP/PE = (m_A+m_C)/m_B, CP/PF = (m_A+m_B)/m_C. Set m_A = 1. From AP/PD = 3: m_B+m_C = 3. From BP/PE = 4: 1+m_C = 4m_B. Solving simultaneously gives m_B = 4/5, m_C = 11/5. Then CP/PF = (m_A+m_B)/m_C = (1+4/5)/(11/5) = (9/5)/(11/5) = 9/11.",
    hints: [
      "Assign a mass to each vertex so that P becomes the balance point of the whole system (mass point geometry); a cevian ratio like AP/PD then equals a ratio of vertex masses.",
      "Translate the two given ratios into two linear equations in the masses (with m_A normalized to 1), solve for m_B and m_C, then read off CP/PF from m_C.",
    ],
    difficulty: 10,
    topicSlug: "triangles",
    competitionSlug: "pumac",
  },

  // ----------------------------- number theory -----------------------------
  {
    slug: "pumac-13",
    question:
      "How many ordered pairs of positive integers (x, y) satisfy x^2 - y^2 = 2024?",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "Factor as (x-y)(x+y) = 2024 = 2^3·11·23. Since x-y and x+y have the same parity and their product is even, both must be even. Write x-y=2a, x+y=2b with ab = 506 = 2·11·23. The number of divisors of 506 is 8, giving 4 factorizations with a<b (each gives a unique positive x=a+b, y=b-a). So there are 4 ordered pairs: (45,1), (57,35), (255,251), (507,505).",
    hints: [
      "Factor the difference of squares as (x-y)(x+y) = 2024, and note both factors must share the same parity.",
      "Since 2024 is divisible by 4, both factors must be even; write x-y=2a, x+y=2b and count factorizations of the resulting smaller product.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-14",
    question:
      "Find the sum of all positive integers n such that n^2 + 19n + 48 is a perfect square.",
    format: "SHORT_ANSWER",
    answer: "33",
    solution:
      "Set n^2+19n+48 = k^2. Multiply by 4 and complete the square: (2n+19)^2 - 361 + 192 = 4k^2, so (2n+19)^2 - (2k)^2 = 169. Factor: (2n+19-2k)(2n+19+2k) = 169 = 13^2. Since 2n+19+2k > 0, both factors are positive; the factor pairs of 169 with first ≤ second are (1,169) and (13,13). The pair (13,13) forces k=0 and n=-3, not a positive integer. The pair (1,169) gives 2n+19=85, so n=33 (and k=42). Checking: 33^2+19(33)+48 = 1089+627+48 = 1764 = 42^2. This is the only positive solution, so the sum is 33.",
    hints: [
      "Multiply through by 4 and complete the square on the left side to turn this into a difference of squares equation.",
      "Factor 169 into two positive factors of matching parity-adjusted form, and check which factorization gives a positive integer n.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-15",
    question:
      "How many ordered pairs of integers (a, b) with 1 ≤ a ≤ 100 and 1 ≤ b ≤ 100 satisfy a^2 ≡ b^2 (mod 101)?",
    format: "SHORT_ANSWER",
    answer: "200",
    solution:
      "Since 101 is prime, a^2 ≡ b^2 (mod 101) iff 101 | (a-b)(a+b), iff a ≡ b or a ≡ -b (mod 101). For each fixed a in {1,...,100}, b ≡ a (mod 101) gives exactly one value of b in that range (b=a), and b ≡ -a ≡ 101-a (mod 101) gives exactly one other value (b=101-a), and these are distinct since a ≠ 101-a would require 2a=101, impossible for an integer a. So each of the 100 values of a contributes exactly 2 valid b's, for 100·2 = 200 total ordered pairs.",
    hints: [
      "Since 101 is prime, a^2 ≡ b^2 (mod 101) factors as 101 | (a-b)(a+b), which means a ≡ b or a ≡ -b modulo 101.",
      "For each a in the range, find exactly which values of b in {1,...,100} satisfy each of the two congruences, and check they're always distinct.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-16",
    question: "What are the last two digits of 3^(3^(3^3))?",
    format: "SHORT_ANSWER",
    answer: "87",
    solution:
      "We need 3^(3^27) mod 100. Since gcd(3,100)=1 and φ(100)=40, it suffices to know 3^27 mod 40. Since gcd(3,40)=1 and φ(40)=16, 3^27 ≡ 3^(27 mod 16) = 3^11 (mod 40). Computing, 3^11 = 177147 ≡ 27 (mod 40). So we need 3^27 mod 100. Using repeated squaring: 3^1=3, 3^2=9, 3^4=81, 3^5=243≡43, 3^10≡43^2=1849≡49, 3^20≡49^2=2401≡1, 3^27=3^20·3^5·3^2 ≡ 1·43·9 = 387 ≡ 87 (mod 100). So the last two digits are 87.",
    hints: [
      "Reduce the huge tower step by step using Euler's theorem: first reduce the top exponent modulo φ(100)=40, which itself requires reducing modulo φ(40)=16.",
      "Once you have the effective exponent (a number less than 40) for the outer power of 3 mod 100, compute it efficiently with repeated squaring rather than direct multiplication.",
    ],
    difficulty: 10,
    topicSlug: "modular-arithmetic",
    competitionSlug: "pumac",
  },
];

export const SMT_PROBLEMS: ProblemSeed[] = [
  {
    slug: "smt-01",
    question:
      "The average of five numbers is 24. After one of the numbers is removed, the average of the remaining four numbers is 21. What was the removed number?",
    format: "SHORT_ANSWER",
    answer: "36",
    solution:
      "The original sum is 5·24 = 120. The remaining sum is 4·21 = 84. The removed number is 120 - 84 = 36.",
    hints: [
      "Convert both averages into total sums first.",
      "The removed number is the difference between the original total and the remaining total.",
    ],
    difficulty: 6,
    topicSlug: "averages",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-02",
    question: "Find the sum of all values of x satisfying x^2 - 8x + 7 = 2x - 9.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "Rearranging gives x^2 - 10x + 16 = 0. By Vieta's formulas, the sum of the roots is 10 (and indeed the discriminant 100-64=36 is positive, giving distinct real roots 8 and 2, which sum to 10).",
    hints: [
      "Move all terms to one side to get a standard quadratic equation.",
      "You don't need to solve for the individual roots — Vieta's formulas give the sum directly from the coefficients.",
    ],
    difficulty: 6,
    topicSlug: "quadratics",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-03",
    question:
      "A right triangle has legs of length 9 and 12. Find the length of the altitude drawn to the hypotenuse.",
    format: "SHORT_ANSWER",
    answer: "36/5",
    solution:
      "The hypotenuse has length √(9^2+12^2) = 15. The area of the triangle is (1/2)(9)(12) = 54, computed two ways: also (1/2)(15)(h) where h is the altitude to the hypotenuse. So (1/2)(15)h = 54, giving h = 108/15 = 36/5.",
    hints: [
      "Find the hypotenuse with the Pythagorean theorem, then compute the triangle's area using the two legs.",
      "Set that same area equal to (1/2)·hypotenuse·altitude and solve for the altitude.",
    ],
    difficulty: 6,
    topicSlug: "triangles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-04",
    question:
      "Find the smallest positive integer that leaves a remainder of 2 when divided by 5, and a remainder of 3 when divided by 7.",
    format: "SHORT_ANSWER",
    answer: "17",
    solution:
      "Write n = 5k+2. We need 5k+2 ≡ 3 (mod 7), i.e. 5k ≡ 1 (mod 7). Since 5·3=15≡1 (mod 7), k ≡ 3 (mod 7). The smallest nonnegative such k is 3, giving n = 5(3)+2 = 17. Checking: 17 = 5(3)+2 and 17 = 7(2)+3, both conditions hold.",
    hints: [
      "Express the first condition as n = 5k+2 for some integer k, then substitute into the second congruence.",
      "Find the multiplicative inverse of 5 modulo 7 to solve for k.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-05",
    question:
      "A bag contains 4 red, 5 blue, and 3 green marbles. Three marbles are drawn at random without replacement. What is the probability that all three drawn marbles are different colors?",
    format: "SHORT_ANSWER",
    answer: "3/11",
    solution:
      "The total number of ways to draw 3 marbles from 12 is C(12,3) = 220. The number of ways to get one of each color is 4·5·3 = 60. The probability is 60/220 = 3/11.",
    hints: [
      "Compute the total number of ways to choose 3 marbles from all 12, ignoring color.",
      "Count the favorable outcomes by choosing one marble of each color separately, then multiply.",
    ],
    difficulty: 7,
    topicSlug: "counting-probability",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-06",
    question:
      "How many 4-digit positive integers (from 1000 to 9999) have all distinct digits and are divisible by 5?",
    format: "SHORT_ANSWER",
    answer: "952",
    solution:
      "The units digit must be 0 or 5. Case units=0: the remaining three digits (thousands, hundreds, tens) are chosen from the 9 nonzero digits {1,...,9} with no repeats and no further restriction, giving 9·8·7 = 504 numbers. Case units=5: the thousands digit can't be 0 or 5, leaving 8 choices; the hundreds digit has 8 remaining choices (any digit except the thousands digit and 5); the tens digit has 7 remaining choices; giving 8·8·7 = 448 numbers. Total: 504 + 448 = 952.",
    hints: [
      "Split into two cases based on whether the units digit is 0 or 5, since the count of choices for the leading digit differs between the cases.",
      "In each case, count the choices for the remaining digits one position at a time, making sure no digit (including 0) repeats and the leading digit isn't 0.",
    ],
    difficulty: 7,
    topicSlug: "counting-principles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-07",
    question:
      "The first term of an arithmetic sequence is 7, and the 15th term is 63. Find the 30th term.",
    format: "SHORT_ANSWER",
    answer: "123",
    solution:
      "Let d be the common difference. The 15th term is a1 + 14d = 63, so 7 + 14d = 63, giving d = 4. The 30th term is a1 + 29d = 7 + 29(4) = 7 + 116 = 123.",
    hints: [
      "Use the given first and 15th terms to solve for the common difference.",
      "Apply the general term formula a_n = a_1 + (n-1)d with n=30.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-08",
    question:
      "Find the area of the triangle with vertices (1,2), (5,7), and (9,1).",
    format: "SHORT_ANSWER",
    answer: "22",
    solution:
      "By the shoelace formula, Area = (1/2)|x1(y2-y3) + x2(y3-y1) + x3(y1-y2)| = (1/2)|1(7-1) + 5(1-2) + 9(2-7)| = (1/2)|6 - 5 - 45| = (1/2)(44) = 22.",
    hints: [
      "The shoelace formula gives the area of a triangle directly from its three vertex coordinates.",
      "Be careful with signs when substituting the coordinates — take the absolute value only at the end.",
    ],
    difficulty: 7,
    topicSlug: "coordinate-geometry",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-09",
    question:
      "How many positive divisors of 2^4 · 3^3 · 5^2 · 7 are divisible by 6 but not by 4?",
    format: "SHORT_ANSWER",
    answer: "18",
    solution:
      "A divisor has the form 2^a·3^b·5^c·7^d with 0≤a≤4, 0≤b≤3, 0≤c≤2, 0≤d≤1. Divisibility by 6 requires a≥1 and b≥1. Not divisible by 4 requires a<2, so combined with a≥1 we get a=1 exactly. Then b has 3 choices (1,2,3), c has 3 choices (0,1,2), d has 2 choices (0,1). Total: 1·3·3·2 = 18.",
    hints: [
      "Write a general divisor in terms of the exponents of each prime, then translate 'divisible by 6' and 'not divisible by 4' into constraints on those exponents.",
      "The two constraints on the exponent of 2 (at least 1, but less than 2) pin that exponent to a single value — count the remaining exponents independently.",
    ],
    difficulty: 8,
    topicSlug: "divisibility",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-10",
    question:
      "What is the minimum number of people needed to guarantee that at least 5 of them were born in the same month?",
    format: "SHORT_ANSWER",
    answer: "49",
    solution:
      "By the pigeonhole principle, to guarantee 5 people share a month across 12 months, the worst case has 4 people in each of the 12 months (4·12=48) without any month reaching 5. One more person, the 49th, must push some month to 5. So the answer is 49.",
    hints: [
      "Think about the worst-case arrangement that avoids having 5 people in any single month — how many people can that arrangement hold?",
      "The generalized pigeonhole principle says the answer is one more than the maximum size of a 'bad' arrangement.",
    ],
    difficulty: 8,
    topicSlug: "pigeonhole",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-11",
    question:
      "Two fair six-sided dice are rolled. Find the expected value of the maximum of the two rolls.",
    format: "SHORT_ANSWER",
    answer: "161/36",
    solution:
      "There are 36 equally likely outcomes. For each value m from 1 to 6, the number of ordered pairs (i,j) with max(i,j) = m is 2m-1 (namely (m,1),...,(m,m),(1,m),...,(m-1,m)). So the sum of max(i,j) over all 36 outcomes is Σ m(2m-1) for m=1..6 = 1(1)+2(3)+3(5)+4(7)+5(9)+6(11) = 1+6+15+28+45+66 = 161. Dividing by 36 gives E[max] = 161/36.",
    hints: [
      "For each possible maximum value m from 1 to 6, count how many of the 36 ordered pairs (i,j) have max(i,j) = m.",
      "The expected value is the sum, over all 36 outcomes, of the maximum, divided by 36 — organizing by the value of the maximum makes the sum manageable.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-12",
    question:
      "A 3×3 grid of cells starts with exactly one black cell and the rest white. In one move, you may choose a row or a column and flip every cell in it (black becomes white and white becomes black). Including the starting grid itself, how many of the 512 possible colorings of the grid can ever be reached using such moves?",
    format: "SHORT_ANSWER",
    answer: "32",
    solution:
      "Represent a coloring as a vector in (Z/2Z)^9 (one coordinate per cell). Each of the 6 possible moves (3 row-flips, 3 column-flips) is itself a fixed vector, and applying a sequence of moves adds (mod 2) the corresponding sum of move-vectors to the starting coloring. So the set of reachable colorings is exactly the coset (starting coloring) + span{6 move vectors} inside (Z/2Z)^9. Computing the rank of the 6 move vectors (three all-ones rows, three all-ones columns, as vectors over GF(2)) gives rank 5 — the row-sum and column-sum vectors satisfy one linear dependency (the sum of all three row-flips equals the sum of all three column-flips, since both equal the all-ones vector). A subspace of rank 5 has 2^5 = 32 elements, so exactly 32 colorings are reachable.",
    hints: [
      "Model each coloring as a 9-bit vector and each move as adding a fixed vector modulo 2; the reachable set is a coset of the subspace spanned by the 6 possible moves.",
      "The three row-flip vectors and three column-flip vectors are not all independent — find the linear dependency among them to determine the dimension of the spanned subspace, then the coset size is 2 raised to that dimension.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-13",
    question:
      "The function f, defined on nonzero reals, satisfies f(x) + 2f(1/x) = 3x for all x ≠ 0. Find f(2).",
    format: "SHORT_ANSWER",
    answer: "-1",
    solution:
      "Substituting x → 1/x gives f(1/x) + 2f(x) = 3/x. From the original equation, f(1/x) = (3x - f(x))/2. Substituting into the second equation: (3x-f(x))/2 + 2f(x) = 3/x. Multiplying by 2: 3x - f(x) + 4f(x) = 6/x, so 3f(x) = 6/x - 3x, giving f(x) = 2/x - x. Checking: f(x)+2f(1/x) = (2/x - x) + 2(2x - 1/x) = 2/x - x + 4x - 2/x = 3x. Correct. So f(2) = 2/2 - 2 = -1.",
    hints: [
      "Substitute x with 1/x in the given equation to get a second equation relating f(x) and f(1/x); combine the two to eliminate f(1/x).",
      "Once you have a closed-form expression for f(x), verify it against the original functional equation before evaluating at x=2.",
    ],
    difficulty: 9,
    topicSlug: "functions",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-14",
    question:
      "Circles ω1 and ω2, with radii 6 and 10 respectively, intersect at two points whose common chord has length 8. The two circles' centers lie on opposite sides of this chord. Find the distance between the centers of ω1 and ω2.",
    format: "SHORT_ANSWER",
    answer: "2√5+2√21",
    solution:
      "The chord has half-length 4. The perpendicular distance from the center of ω1 to the chord is √(6^2-4^2) = √20 = 2√5. The perpendicular distance from the center of ω2 to the chord is √(10^2-4^2) = √84 = 2√21. Since the centers lie on opposite sides of the chord, the total distance between them is the sum: 2√5 + 2√21.",
    hints: [
      "Drop a perpendicular from each circle's center to the common chord; each perpendicular, together with the radius and half the chord, forms a right triangle.",
      "Since the centers are on opposite sides of the chord, the distance between the centers is the sum of the two perpendicular distances you find.",
    ],
    difficulty: 9,
    topicSlug: "circles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-15",
    question:
      "Find the number of ordered pairs of positive integers (a, b) with a ≤ b satisfying 1/a + 1/b = 1/12.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Multiplying through by 12ab gives 12b + 12a = ab, i.e. ab - 12a - 12b = 0, i.e. (a-12)(b-12) = 144. Since a ≤ b and both a,b must exceed 12 (otherwise 1/a ≥ 1/12 leaves no room for a positive 1/b), let m=a-12>0 and n=b-12>0 with mn=144 and m≤n. This is equivalent to counting divisors of 144=2^4·3^2 that are at most √144=12. The divisors of 144 up to 12 are 1,2,3,4,6,8,9,12 — 8 of them. So there are 8 ordered pairs.",
    hints: [
      "Clear denominators and rearrange the equation so that you can factor the left side as a product of two shifted variables — try completing the pattern (a-12)(b-12).",
      "Once you have (a-12)(b-12) = 144, counting solutions with a ≤ b becomes counting divisors of 144 that don't exceed its square root.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-16",
    question:
      "How many ways are there to color the 6 vertices of a regular hexagon with 3 colors so that no two adjacent vertices share the same color?",
    format: "SHORT_ANSWER",
    answer: "66",
    solution:
      "This counts proper 3-colorings of the cycle graph C6. The chromatic polynomial of a cycle C_n with k colors is (k-1)^n + (-1)^n(k-1). For n=6, k=3: (2)^6 + (1)(2) = 64 + 2 = 66.",
    hints: [
      "This is equivalent to properly coloring the vertices of a 6-cycle graph — there's a known formula for the number of proper k-colorings of a cycle with n vertices.",
      "The formula is (k-1)^n + (-1)^n(k-1); substitute n=6 and k=3.",
    ],
    difficulty: 9,
    topicSlug: "graph-theory",
    competitionSlug: "stanford-math-tournament",
  },
];
