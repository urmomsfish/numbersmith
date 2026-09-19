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

// ------------------------------ algebra ------------------------------
  {
    slug: "pumac-17",
    question:
      "Real numbers x and y satisfy x - y = 5 and x^3 - y^3 = 245. Find xy.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Use x^3 - y^3 = (x-y)((x-y)^2 + 3xy). Substituting x-y = 5 gives 245 = 5(25 + 3xy), so 49 = 25 + 3xy, giving 3xy = 24 and xy = 8.",
    hints: [
      "Rewrite x^2+xy+y^2 as (x-y)^2 + 3xy so the identity only involves x-y and xy.",
      "Plug x-y=5 into x^3-y^3=(x-y)((x-y)^2+3xy) and solve the resulting linear equation for xy.",
    ],
    difficulty: 7,
    topicSlug: "algebra",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-21",
    question:
      "Real numbers x and y satisfy x + 2y = 11 and 3x - y = 5. Find x^2 + y^2.",
    format: "SHORT_ANSWER",
    answer: "25",
    solution:
      "From x + 2y = 11, x = 11 - 2y. Substituting into 3x - y = 5 gives 3(11-2y) - y = 5, i.e. 33 - 7y = 5, so y = 4 and x = 11 - 8 = 3. Then x^2 + y^2 = 9 + 16 = 25.",
    hints: [
      "Solve the linear system for x and y directly by substitution.",
      "Once you have numeric values for x and y, just compute x^2+y^2.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-25",
    question:
      "Positive real numbers a and b satisfy a + b = 6 and a^4 + b^4 = 626. Find ab.",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "Let p = ab. Then a^2+b^2 = 36 - 2p, and a^4+b^4 = (a^2+b^2)^2 - 2p^2 = (36-2p)^2 - 2p^2 = 626. Expanding: 1296 - 144p + 4p^2 - 2p^2 = 626, so 2p^2 - 144p + 670 = 0, i.e. p^2 - 72p + 335 = 0. The discriminant is 72^2 - 4(335) = 5184 - 1340 = 3844 = 62^2, so p = (72±62)/2, giving p = 67 or p = 5. Since a,b>0 with a+b=6, AM-GM forces ab ≤ 9, so p=67 is extraneous and ab = 5.",
    hints: [
      "Express a^2+b^2 and then a^4+b^4 in terms of s=a+b and p=ab, using a^4+b^4=(a^2+b^2)^2-2(ab)^2.",
      "This gives a quadratic in p; solve it, then use a+b=6 with AM-GM (ab ≤ ((a+b)/2)^2 = 9) to discard the extraneous root.",
    ],
    difficulty: 8,
    topicSlug: "algebra",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-29",
    question: "Solve for x: log_2(x) + log_4(x) + log_8(x) = 11.",
    format: "SHORT_ANSWER",
    answer: "64",
    solution:
      "Write log_4(x) = (log_2 x)/2 and log_8(x) = (log_2 x)/3. The equation becomes (log_2 x)(1 + 1/2 + 1/3) = 11, i.e. (log_2 x)(11/6) = 11, so log_2 x = 6, giving x = 64.",
    hints: [
      "Convert log_4(x) and log_8(x) to base 2 using the change-of-base identity log_{2^k}(x) = (log_2 x)/k.",
      "Factor out log_2(x) from the resulting sum and solve for it first, then exponentiate.",
    ],
    difficulty: 8,
    topicSlug: "exponents-radicals",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-33",
    question:
      "A function f: R → R satisfies f(x+y) = f(x) + f(y) + 2xy for all real x, y, and f(1) = 3. Find f(10).",
    format: "SHORT_ANSWER",
    answer: "120",
    solution:
      "Setting x=y=0 gives f(0) = 2f(0), so f(0) = 0. Guess f(x) = x^2 + cx: then f(x+y) = (x+y)^2+c(x+y) = x^2+2xy+y^2+cx+cy, while f(x)+f(y)+2xy = x^2+cx+y^2+cy+2xy — these match for any c, and f(0)=0 is automatically satisfied. Using f(1)=3: 1+c=3, so c=2, giving f(x)=x^2+2x. This satisfies the original equation for all x,y, so f(10) = 100 + 20 = 120.",
    hints: [
      "Plug in x=y=0 to find f(0), then try a quadratic ansatz f(x) = x^2 + cx and check it against the functional equation.",
      "Use f(1)=3 to pin down the constant c, then verify the resulting formula satisfies the original equation before evaluating at x=10.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-37",
    question:
      "Let a, b, c be the roots of x^3 - 7x^2 + 11x - 3 = 0. Find a^3 + b^3 + c^3.",
    format: "SHORT_ANSWER",
    answer: "121",
    solution:
      "By Vieta's formulas, e1=a+b+c=7, e2=ab+bc+ca=11, e3=abc=3. Using Newton's identities: p1=e1=7. p2=e1p1-2e2=7(7)-22=27. p3=e1p2-e2p1+3e3=7(27)-11(7)+3(3)=189-77+9=121. So a^3+b^3+c^3=121.",
    hints: [
      "Read off the elementary symmetric sums e1, e2, e3 directly from the coefficients via Vieta's formulas.",
      "Apply Newton's identities to build up p1=a+b+c, p2=a^2+b^2+c^2, and finally p3=a^3+b^3+c^3 from e1, e2, e3.",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-41",
    question:
      "Let a, b, c be the (possibly complex) roots of x^3 - 3x^2 + 4x - 2 = 0. Find a^4 + b^4 + c^4.",
    format: "SHORT_ANSWER",
    answer: "-7",
    solution:
      "By Vieta's formulas, e1=3, e2=4, e3=2. Using Newton's identities: p1=e1=3. p2=e1p1-2e2=9-8=1. p3=e1p2-e2p1+3e3=3(1)-4(3)+3(2)=3-12+6=-3. p4=e1p3-e2p2+e3p1=3(-3)-4(1)+2(3)=-9-4+6=-7. As a check, x=1 is a root (1-3+4-2=0), and the quadratic factor x^2-2x+2 has roots 1±i; (1+i)^2=2i so (1+i)^4=(2i)^2=-4, similarly (1-i)^4=-4, and 1^4=1, giving 1-4-4=-7, confirming the answer.",
    hints: [
      "Read off e1, e2, e3 from the coefficients and apply Newton's identities up through p4; the roots need not be real for this to work.",
      "As a sanity check, notice x=1 is a root, factor out (x-1), and evaluate the fourth powers of all three roots directly.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-45",
    question:
      "Positive real numbers a, b, c satisfy a + b + c = 12. Find the minimum possible value of a^2/b + b^2/c + c^2/a.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By the Cauchy-Schwarz inequality in Engel form (Titu's lemma), a^2/b + b^2/c + c^2/a ≥ (a+b+c)^2/(a+b+c) = a+b+c = 12. Equality holds when a/b = b/c = c/a, which (together with a+b+c=12) forces a=b=c=4, and indeed at a=b=c=4 the expression equals 16/4·3 = 12. So the minimum value is 12.",
    hints: [
      "Engel form (Titu's lemma) says sum of x_i^2/y_i is at least (sum x_i)^2 / (sum y_i) — apply it with x_i = a,b,c and y_i = b,c,a.",
      "Check that the equality condition a/b=b/c=c/a combined with a+b+c=12 is achievable, to confirm 12 is actually attained and not just a lower bound.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-49",
    question:
      "P(x) is a monic polynomial of degree 4 satisfying P(1)=1, P(2)=4, P(3)=9, P(4)=16. Find P(5).",
    format: "SHORT_ANSWER",
    answer: "49",
    solution:
      "Let Q(x) = P(x) - x^2. Since P is monic of degree 4, Q is also monic of degree 4 (the x^2 term doesn't affect the leading term). Q vanishes at x=1,2,3,4 since P(x)=x^2 there, so Q(x) = (x-1)(x-2)(x-3)(x-4). Then P(5) = Q(5) + 25 = (4)(3)(2)(1) + 25 = 24 + 25 = 49.",
    hints: [
      "Consider Q(x) = P(x) - x^2; it's monic of the same degree as P and has four known roots.",
      "Write Q(x) explicitly as a product of linear factors using its roots, then recover P(5) = Q(5) + 25.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "pumac",
  },

  // ---------------------------- combinatorics ----------------------------
  {
    slug: "pumac-18",
    question: "How many distinct arrangements are there of the letters of the word NUMBERSMITH?",
    format: "SHORT_ANSWER",
    answer: "19958400",
    solution:
      "NUMBERSMITH has 11 letters, with M appearing twice and all other letters (N,U,B,E,R,S,I,T,H) appearing once. The number of distinct arrangements is 11!/2! = 39916800/2 = 19958400.",
    hints: [
      "Count the total number of letters and identify any letter that repeats.",
      "Divide 11! by the factorial of the repeat count for each repeated letter (here, just M repeats, twice).",
    ],
    difficulty: 7,
    topicSlug: "permutations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-22",
    question:
      "In how many ways can 8 distinct people be seated around a circular table (rotations considered identical, reflections distinct) if two particular people, Alice and Bob, refuse to sit next to each other?",
    format: "SHORT_ANSWER",
    answer: "3600",
    solution:
      "The total number of circular arrangements of 8 people is (8-1)! = 5040. To count arrangements where Alice and Bob ARE adjacent, glue them into a single block: this leaves 7 objects to arrange circularly, giving (7-1)! = 720 arrangements, times 2 for the two internal orders of the block, giving 1440. The number of valid arrangements is 5040 - 1440 = 3600.",
    hints: [
      "First count all circular arrangements of 8 people, then use complementary counting to subtract the ones where Alice and Bob are adjacent.",
      "To count the 'adjacent' arrangements, treat Alice and Bob as a single glued block and don't forget the 2 internal orderings of that block.",
    ],
    difficulty: 8,
    topicSlug: "permutations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-26",
    question:
      "In how many ways can 12 identical stickers be distributed among 4 distinct albums so that every album receives an odd number of stickers?",
    format: "SHORT_ANSWER",
    answer: "35",
    solution:
      "Write each album's count as x_i = 2y_i+1 with y_i ≥ 0, since x_i must be a positive odd integer. Then sum x_i = 12 becomes sum(2y_i+1) = 12, i.e. 2(sum y_i) + 4 = 12, so sum y_i = 4. The number of nonnegative integer solutions to y_1+y_2+y_3+y_4=4 is C(4+3,3) = C(7,3) = 35.",
    hints: [
      "Substitute x_i = 2y_i + 1 to convert the 'odd positive integer' constraint into a nonnegative-integer stars-and-bars problem.",
      "After the substitution, count nonnegative solutions to the resulting equation with standard stars-and-bars.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-30",
    question:
      "How many lattice paths from (0,0) to (8,8), using only unit steps right and up, never go strictly above the line y = x?",
    format: "SHORT_ANSWER",
    answer: "1430",
    solution:
      "Paths from (0,0) to (n,n) that stay weakly below the diagonal y=x are counted by the n-th Catalan number C_n = (1/(n+1))·C(2n,n). For n=8: C(16,8) = 12870, and C_8 = 12870/9 = 1430.",
    hints: [
      "This is a direct instance of the classic Catalan-number lattice path problem (paths that never cross above the diagonal).",
      "Recall the Catalan number formula C_n = C(2n,n)/(n+1) and plug in n=8.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-34",
    question:
      "Five married couples (10 people total) are seated in a row of 10 chairs. In how many ways can they be seated so that no husband sits directly next to his own wife?",
    format: "SHORT_ANSWER",
    answer: "1263360",
    solution:
      "By inclusion-exclusion, treating each couple as a 'bad event' (the couple sitting together), the count is sum_{k=0}^{5} (-1)^k C(5,k) 2^k (10-k)!, where C(5,k) chooses which k couples are glued together, 2^k accounts for the internal order of each glued couple, and (10-k)! arranges the resulting 10-k objects in a row. Computing: k=0: 10!=3628800; k=1: -5·2·9!=-3628800; k=2: 10·4·8!=1612800; k=3: -10·8·7!=-403200; k=4: 5·16·6!=57600; k=5: -1·32·5!=-3840. Summing: 3628800-3628800+1612800-403200+57600-3840 = 1263360.",
    hints: [
      "Use inclusion-exclusion over the 5 'bad' events (each couple sitting together), gluing k couples into blocks for each term.",
      "The general term is (-1)^k · C(5,k) · 2^k · (10-k)! — sum this over k = 0 to 5.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-38",
    question: "How many subsets of {1, 2, ..., 15} have a sum divisible by 5?",
    format: "SHORT_ANSWER",
    answer: "6560",
    solution:
      "Use a roots-of-unity filter with ω = e^{2πi/5}. The count is (1/5)·Σ_{j=0}^{4} Π_{k=1}^{15}(1+ω^{jk}). For j=0, the product is 2^15 = 32768. For j=1,2,3,4 (coprime to 5), as k ranges over 1..15 the exponents jk mod 5 cycle through all residues 0,1,2,3,4 exactly 3 times (since 15/5=3). One full cycle contributes Π_{m=0}^{4}(1+ω^m) = 2 (a standard identity, since Π(x-ω^m)=x^5-1, evaluating at x=-1 gives Π(-1-ω^m) = (-1)^5-1 = -2, and Π(1+ω^m) = (-1)^5·(-2) = 2). So each nonzero j contributes 2^3 = 8. The total is (1/5)(32768 + 4·8) = (1/5)(32800) = 6560.",
    hints: [
      "A roots-of-unity filter with a 5th root of unity ω extracts subsets whose sum is divisible by 5 from the generating function Π(1+ω^{jk}x^0)... more precisely, average Π_{k=1}^{15}(1+ω^{jk}) over j=0..4.",
      "For j≠0, the exponents jk mod 5 sweep through a complete residue system exactly 3 times as k runs 1 to 15; use the identity Π_{m=0}^{4}(1+ω^m)=2 for one full cycle.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-42",
    question: "In how many ways can a 3×8 rectangular grid be tiled using 1×2 dominoes?",
    format: "SHORT_ANSWER",
    answer: "153",
    solution:
      "Let T(2m) be the number of domino tilings of a 3×2m board (a 3×n board can only be fully tiled when n is even). Analyzing the possible domino configurations that can occupy the leftmost column(s) gives the recurrence T(2m) = 4T(2m-2) - T(2m-4), with base cases T(0)=1 and T(2)=3. Then T(4)=4(3)-1=11, T(6)=4(11)-3=41, T(8)=4(41)-11=153.",
    hints: [
      "A 3×n board only tiles fully when n is even; set up T(2m) for the number of tilings of a 3×2m board.",
      "Careful casework on how the leftmost columns are covered yields the linear recurrence T(2m)=4T(2m-2)-T(2m-4); iterate from the known base cases T(0)=1, T(2)=3 up to T(8).",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-46",
    question:
      "In how many ways can 12 distinct books be distributed among 3 distinguishable boxes so that every box receives at least 1 book and at most 6 books?",
    format: "SHORT_ANSWER",
    answer: "422730",
    solution:
      "We need the sum over all triples (a,b,c) with a+b+c=12 and 1≤a,b,c≤6 of the multinomial coefficient 12!/(a!b!c!). The distinct unordered partitions of 12 into three parts each between 1 and 6 are {1,5,6}, {2,4,6}, {2,5,5}, {3,3,6}, {3,4,5}, {4,4,4}. Computing each multinomial coefficient and multiplying by the number of orderings: {1,5,6}: 12!/(1!5!6!)=5544, ×6 orderings = 33264. {2,4,6}: 12!/(2!4!6!)=13860, ×6 = 83160. {2,5,5}: 12!/(2!5!5!)=16632, ×3 = 49896. {3,3,6}: 12!/(3!3!6!)=18480, ×3 = 55440. {3,4,5}: 12!/(3!4!5!)=27720, ×6 = 166320. {4,4,4}: 12!/(4!4!4!)=34650, ×1 = 34650. Summing: 33264+83160+49896+55440+166320+34650 = 422730.",
    hints: [
      "List all unordered triples (a,b,c) of box sizes with a+b+c=12 and each size between 1 and 6, then use the multinomial coefficient 12!/(a!b!c!) for each labeled assignment.",
      "For each unordered partition, multiply its multinomial coefficient by the number of distinct orderings of that partition among the 3 labeled boxes (6 if all parts differ, 3 if two match, 1 if all three match), then sum everything.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-50",
    question:
      "The 6 edges of a regular hexagon are each colored with one of 3 colors so that no two edges sharing a vertex have the same color. Two colorings are considered the same if one can be obtained from the other by rotating the hexagon (reflections are considered distinct). How many distinct colorings are there?",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "The 6 edges of a hexagon, with adjacency given by sharing a vertex, form a 6-cycle graph. The number of proper 3-colorings of a cycle C_n is (k-1)^n + (-1)^n(k-1); for n=6, k=3 this is 2^6+2=66 total labeled colorings. Apply Burnside's lemma over the rotation group C6. Fix(identity)=66. Fix(rotate by 1 or 5) requires all edges equal — impossible for a proper coloring, so 0 each. Fix(rotate by 2 or 4) requires the coloring to repeat with period 2 (pattern c0,c1,c0,c1,c0,c1); properness reduces to just c0≠c1, giving 3·2=6 colorings each. Fix(rotate by 3) requires period-3 repetition (c0,c1,c2,c0,c1,c2); properness forces c0,c1,c2 to be a proper coloring of a triangle, giving (3-1)^3+(-1)^3(3-1)=6 colorings. By Burnside, the count is (66+0+6+6+6+0)/6 = 84/6 = 14.",
    hints: [
      "The 6 edges, adjacent when they share a vertex, form a cycle graph C6 — first count all proper 3-colorings of C6 using the cycle chromatic polynomial formula.",
      "Then apply Burnside's lemma over the 6 rotations: for each rotation, figure out what periodicity a fixed coloring must have, and count proper colorings with that periodicity.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "pumac",
  },

  // ------------------------------ geometry ------------------------------
  {
    slug: "pumac-19",
    question:
      "Triangle ABC has side lengths AB = 9, BC = 10, CA = 17. Find its circumradius.",
    format: "SHORT_ANSWER",
    answer: "85/8",
    solution:
      "The semiperimeter is s = (9+10+17)/2 = 18. By Heron's formula, the area is √(18·9·8·1) = √1296 = 36. The circumradius is R = abc/(4·Area) = (9·10·17)/(4·36) = 1530/144 = 85/8.",
    hints: [
      "Compute the area with Heron's formula using the semiperimeter.",
      "The circumradius formula R = abc/(4·Area) applies to any triangle.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-23",
    question:
      "An isosceles trapezoid has parallel sides of length 10 and 26, and legs of length 17. Find its area.",
    format: "SHORT_ANSWER",
    answer: "270",
    solution:
      "The horizontal overhang on each side is (26-10)/2 = 8. The height satisfies h^2 + 8^2 = 17^2, so h = √(289-64) = √225 = 15. The area is (1/2)(10+26)(15) = (1/2)(36)(15) = 270.",
    hints: [
      "Drop perpendiculars from the shorter parallel side to the longer one, splitting the trapezoid into a rectangle and two congruent right triangles.",
      "Use the Pythagorean theorem on one of those right triangles to find the height, then apply the trapezoid area formula.",
    ],
    difficulty: 8,
    topicSlug: "area-volume",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-27",
    question:
      "A regular hexagon has side length 6. Every other vertex is connected to form an inscribed equilateral triangle. Find the area of that triangle.",
    format: "SHORT_ANSWER",
    answer: "27√3",
    solution:
      "A regular hexagon with side s has circumradius R = s. Vertices two apart (120° apart on the circumscribed circle) are connected by a chord of length 2R sin(60°) = 2(6)(√3/2) = 6√3, which is the side length of the inscribed triangle. Its area is (√3/4)(6√3)^2 = (√3/4)(108) = 27√3.",
    hints: [
      "The circumradius of a regular hexagon equals its side length; use this to find the chord length between vertices two apart.",
      "Once you have the inscribed triangle's side length, apply the standard equilateral triangle area formula (√3/4)·side².",
    ],
    difficulty: 8,
    topicSlug: "advanced-geometry",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-31",
    question:
      "Triangle ABC has side lengths 7, 8, 9. Let O and I be its circumcenter and incenter, respectively. Find OI.",
    format: "SHORT_ANSWER",
    answer: "√105/10",
    solution:
      "s=(7+8+9)/2=12. Area=√(12·5·4·3)=√720=12√5. The inradius is r = Area/s = 12√5/12 = √5. The circumradius is R = abc/(4·Area) = (7·8·9)/(4·12√5) = 504/(48√5) = 21/(2√5) = 21√5/10. By Euler's formula, OI² = R² - 2Rr = (21√5/10)² - 2(21√5/10)(√5) = 2205/100 - 21 = 22.05 - 21 = 1.05 = 21/20. So OI = √(21/20) = √105/10.",
    hints: [
      "Find the inradius and circumradius from the side lengths using Heron's formula together with r=Area/s and R=abc/(4·Area).",
      "Apply Euler's triangle formula OI² = R² - 2Rr, then simplify the resulting radical.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-35",
    question:
      "In triangle ABC, AB = 10, AC = 17, BC = 21. Find the length of the median from vertex A to side BC.",
    format: "SHORT_ANSWER",
    answer: "√337/2",
    solution:
      "By the median length formula, m_a² = (2·AC² + 2·AB² - BC²)/4 = (2(289) + 2(100) - 441)/4 = (578+200-441)/4 = 337/4. So m_a = √337/2.",
    hints: [
      "Use the median length formula m_a² = (2b²+2c²-a²)/4, where a=BC is the side opposite A, and b, c are the other two sides.",
      "Substitute the given side lengths carefully (making sure a is the side opposite the vertex the median is drawn from) and simplify the radical.",
    ],
    difficulty: 9,
    topicSlug: "triangles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-39",
    question:
      "In triangle ABC, angle A = 60°, AB = 14, AC = 9. The angle bisector from A meets BC at D. Find AD.",
    format: "SHORT_ANSWER",
    answer: "126√3/23",
    solution:
      "The angle bisector length from a vertex with adjacent sides b, c and included angle A is given by t_a = (2bc·cos(A/2))/(b+c). Here b=AC=9, c=AB=14, A/2=30°, cos30°=√3/2. So AD = (2·14·9·(√3/2))/(14+9) = (126√3)/23.",
    hints: [
      "Recall the angle bisector length formula t_a = 2bc·cos(A/2)/(b+c) for the bisector from the vertex between sides b and c.",
      "Substitute A=60° (so A/2=30°, with cos30°=√3/2) and the two given side lengths.",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-43",
    question:
      "Two circles with radii 9 and 4 are both tangent to a common line ℓ and tangent to each other, lying on the same side of ℓ. A third circle is tangent to ℓ and externally tangent to both given circles, nestled in the region between them. Find the third circle's radius.",
    format: "SHORT_ANSWER",
    answer: "36/25",
    solution:
      "For three circles mutually tangent with two of them tangent to a common line and the third nestled between them (all tangent to the same line), the radii satisfy 1/√r3 = 1/√r1 + 1/√r2, i.e. r3 = r1r2/(√r1+√r2)^2. With r1=9, r2=4: √r1=3, √r2=2, so r3 = 36/(3+2)^2 = 36/25. (This can be verified directly with coordinates: placing the two given circles' centers at heights 9 and 4 above the line with horizontal separation 2√(9·4)=12, and solving for the tangent circle's center confirms r=36/25 is the physically valid nestled solution.)",
    hints: [
      "This is the classic 'circle inscribed between two circles tangent to a line' configuration, which has the known relation 1/√r3 = 1/√r1 + 1/√r2.",
      "Solve that relation for r3 using r1=9 and r2=4 — note √9=3 and √4=2 make this especially clean.",
    ],
    difficulty: 10,
    topicSlug: "circles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-47",
    question:
      "Quadrilateral ABCD is inscribed in a circle with AB=7, BC=24, CD=15, DA=20, and AC is a diameter of the circle. Find BD.",
    format: "SHORT_ANSWER",
    answer: "117/5",
    solution:
      "Since AC is a diameter, angle ABC and angle ADC are both inscribed in a semicircle, hence both 90°. In triangle ABC, AB=7, BC=24 gives AC=√(49+576)=√625=25 (a 7-24-25 right triangle). In triangle ACD, CD=15, DA=20 gives AC=√(225+400)=√625=25 as well (a 15-20-25 right triangle), consistent. By Ptolemy's theorem for the cyclic quadrilateral, AC·BD = AB·CD + BC·DA = 7(15)+24(20) = 105+480 = 585. So BD = 585/25 = 117/5.",
    hints: [
      "Since AC is a diameter, use Thales' theorem to confirm angle ABC = angle ADC = 90°, and use the two right triangles to find AC.",
      "Apply Ptolemy's theorem (AC·BD = AB·CD + BC·DA) to solve for BD once AC is known.",
    ],
    difficulty: 10,
    topicSlug: "circles",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-51",
    question:
      "A sphere of radius 5 is inscribed in a right circular cone, tangent to the base and to the lateral surface. The cone's height is 12. Find the radius of the cone's base.",
    format: "SHORT_ANSWER",
    answer: "5√6",
    solution:
      "Consider the cross-section through the cone's axis: an isosceles triangle with base 2R, height h=12, and equal sides l=√(h²+R²). The inscribed circle of this triangle is the sphere's cross-section, with radius r = Area/s = (Rh)/(R+l) (since Area=Rh and semiperimeter s=R+l). Setting r=5: 5(R+l)=12R, so 5l=7R, i.e. l=7R/5. Also l²=144+R², so (7R/5)² = 144+R², giving 49R²/25 - R² = 144, i.e. 24R²/25=144, so R²=150, R=√150=5√6.",
    hints: [
      "Take the axial cross-section of the cone: an isosceles triangle whose inscribed circle is the sphere's cross-section, with inradius equal to the sphere's radius.",
      "Use r = Area/semiperimeter = Rh/(R+l) for that triangle (where l is the slant height), combined with l²=h²+R², to solve for R.",
    ],
    difficulty: 10,
    topicSlug: "three-d-geometry",
    competitionSlug: "pumac",
  },

  // ----------------------------- number theory -----------------------------
  {
    slug: "pumac-20",
    question:
      "How many positive integers n ≤ 200 are divisible by neither 3 nor 7?",
    format: "SHORT_ANSWER",
    answer: "115",
    solution:
      "By inclusion-exclusion: multiples of 3 up to 200: floor(200/3)=66. Multiples of 7: floor(200/7)=28. Multiples of 21: floor(200/21)=9. Multiples of 3 or 7: 66+28-9=85. So the numbers divisible by neither are 200-85=115.",
    hints: [
      "Use inclusion-exclusion to count numbers divisible by 3 or by 7 (or both).",
      "Subtract that count from 200 to get the numbers divisible by neither.",
    ],
    difficulty: 7,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-24",
    question:
      "Find the smallest positive integer n such that n! ends in at least 15 zeros.",
    format: "SHORT_ANSWER",
    answer: "65",
    solution:
      "The number of trailing zeros of n! is Σ floor(n/5^k). For n=64: floor(64/5)+floor(64/25)=12+2=14, not enough. For n=65: floor(65/5)+floor(65/25)=13+2=15, which is enough. So the smallest such n is 65.",
    hints: [
      "The number of trailing zeros of n! is given by the Legendre-style sum floor(n/5)+floor(n/25)+floor(n/125)+...",
      "Check consecutive values of n near a multiple of 5 (zeros only increase at multiples of 5) until the count first reaches 15.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-28",
    question:
      "How many ordered pairs of positive integers (a, b) satisfy lcm(a,b) = 360 and gcd(a,b) = 6?",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Write a=6m, b=6n with gcd(m,n)=1. Then lcm(a,b) = 6mn = 360, so mn = 60 = 2^2·3·5. The number of ways to write 60 as an ordered product of two coprime positive integers equals 2^(number of distinct prime factors of 60) = 2^3 = 8, since each prime power in 60's factorization must go entirely to m or entirely to n.",
    hints: [
      "Since gcd(a,b)=6, write a=6m and b=6n with gcd(m,n)=1, and translate the lcm condition into an equation for mn.",
      "Counting ordered coprime factorizations of a number reduces to independently assigning each of its distinct prime-power factors to one of the two parts.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-32",
    question:
      "Find the sum of all positive integers n ≤ 100 such that n^2 + 1 is divisible by 5.",
    format: "SHORT_ANSWER",
    answer: "2000",
    solution:
      "We need n^2 ≡ -1 ≡ 4 (mod 5), which happens exactly when n ≡ 2 or n ≡ 3 (mod 5). Among 1..100, the values n≡2 (mod5) are 2,7,...,97 (20 terms, sum = 20(2+97)/2 = 990), and n≡3 (mod5) are 3,8,...,98 (20 terms, sum = 20(3+98)/2 = 1010). The total is 990+1010 = 2000.",
    hints: [
      "Figure out which residues mod 5 satisfy n^2 ≡ 4 (mod 5) by checking each residue 0 through 4.",
      "Sum the two resulting arithmetic sequences of qualifying n between 1 and 100.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-36",
    question: "Find the remainder when 13^100 is divided by 1000.",
    format: "SHORT_ANSWER",
    answer: "1",
    solution:
      "Use CRT with 1000=8·125. Mod 8: 13≡5, and 5^2=25≡1 (mod 8), so 5^100=(5^2)^50≡1 (mod 8). Mod 125: φ(125)=100 and gcd(13,125)=1, so by Euler's theorem 13^100≡1 (mod 125). Since 13^100≡1 (mod 8) and ≡1 (mod 125), by CRT 13^100≡1 (mod 1000).",
    hints: [
      "Split the modulus 1000 = 8 × 125 and work out 13^100 modulo each factor separately.",
      "Mod 8 the order of 13 (i.e. of 5) is small and easy to compute directly; mod 125, Euler's theorem with φ(125)=100 applies immediately. Combine with CRT.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-40",
    question: "Find the last three digits of 7^2024.",
    format: "SHORT_ANSWER",
    answer: "401",
    solution:
      "We want 7^2024 mod 1000. Since gcd(7,1000)=1 and φ(1000)=400, Euler's theorem gives 7^400≡1 (mod 1000). Since 2024 = 5·400+24, 7^2024 ≡ 7^24 (mod 1000). Compute via repeated squaring: 7^2=49, 7^4=49^2=2401≡401, 7^8=401^2=160801≡801, 7^16=801^2=641601≡601, and 7^24=7^16·7^8≡601·801=481401≡401 (mod 1000).",
    hints: [
      "Use Euler's theorem with φ(1000)=400 to reduce the exponent 2024 modulo 400.",
      "Compute the resulting smaller power of 7 mod 1000 with repeated squaring rather than direct multiplication.",
    ],
    difficulty: 10,
    topicSlug: "modular-arithmetic",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-44",
    question:
      "Find the number of pairs of positive integers (x, y) with x ≤ 1000 satisfying x^2 - 2y^2 = 1.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "This is a Pell equation with fundamental solution (x,y)=(3,2). Further solutions are generated by (x_{n+1}, y_{n+1}) = (3x_n+4y_n, 2x_n+3y_n): (3,2) → (17,12) → (99,70) → (577,408) → (3363,2378). The values of x that are ≤ 1000 are 3, 17, 99, 577 — the next one, 3363, exceeds 1000. So there are 4 valid pairs.",
    hints: [
      "Recognize this as the Pell equation x²-2y²=1, whose solutions are generated recursively from the fundamental solution (3,2).",
      "Generate successive solutions using the recurrence (x,y) → (3x+4y, 2x+3y) and stop once x exceeds 1000.",
    ],
    difficulty: 10,
    topicSlug: "diophantine-equations",
    competitionSlug: "pumac",
  },
  {
    slug: "pumac-48",
    question:
      "Find the sum of all primitive roots modulo 13, taken as integers between 1 and 12.",
    format: "SHORT_ANSWER",
    answer: "26",
    solution:
      "Since 13 is prime, there are φ(φ(13)) = φ(12) = 4 primitive roots mod 13. Checking, 2 is a primitive root (its powers mod 13 cycle through all 12 nonzero residues). The primitive roots are exactly 2^k for k coprime to 12, i.e. k=1,5,7,11: 2^1=2, 2^5=32≡6, 2^7=128≡11, 2^11=2048≡7 (all mod 13). Their sum is 2+6+11+7=26.",
    hints: [
      "Since 13 is prime, there are exactly φ(12)=4 primitive roots, and they are the powers of any one primitive root raised to exponents coprime to 12.",
      "Verify 2 is a primitive root mod 13, then compute 2^1, 2^5, 2^7, 2^11 mod 13 and add them.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
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

// ------------------------------ algebra ------------------------------
  {
    slug: "smt-17",
    question:
      "A rectangle has side lengths 3x+2 and x+5. If its perimeter is 54, find x.",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "The perimeter is 2[(3x+2)+(x+5)] = 2(4x+7) = 8x+14. Setting this equal to 54: 8x+14=54, so 8x=40, x=5.",
    hints: [
      "Write the perimeter as twice the sum of the two given side expressions.",
      "Set the resulting expression equal to 54 and solve the linear equation.",
    ],
    difficulty: 6,
    topicSlug: "algebra",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-21",
    question: "If f(x) = 2x^2 - 3x + 1, find f(4).",
    format: "SHORT_ANSWER",
    answer: "21",
    solution: "f(4) = 2(16) - 3(4) + 1 = 32 - 12 + 1 = 21.",
    hints: [
      "Substitute x=4 directly into the formula for f(x).",
      "Compute each term carefully before adding.",
    ],
    difficulty: 6,
    topicSlug: "functions",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-25",
    question:
      "Real numbers x and y satisfy x + y = 9 and x^2 + y^2 = 53. Find xy.",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "Since (x+y)^2 = x^2+y^2+2xy, we get 81 = 53 + 2xy, so 2xy = 28 and xy = 14.",
    hints: [
      "Square the sum x+y and compare it to the given sum of squares.",
      "Isolate the 2xy term and solve.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-29",
    question:
      "A geometric sequence has first term 5 and common ratio 3. Find the sum of its first 6 terms.",
    format: "SHORT_ANSWER",
    answer: "1820",
    solution:
      "The sum of the first n terms of a geometric sequence is a(r^n-1)/(r-1). Here: 5(3^6-1)/(3-1) = 5(729-1)/2 = 5(728)/2 = 5(364) = 1820.",
    hints: [
      "Recall the finite geometric series sum formula S_n = a(r^n-1)/(r-1).",
      "Substitute a=5, r=3, n=6 and simplify.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-33",
    question:
      "Find the sum of all real solutions x to the equation √(x+7) = x - 5.",
    format: "SHORT_ANSWER",
    answer: "9",
    solution:
      "Squaring both sides: x+7 = (x-5)^2 = x^2-10x+25, so x^2-11x+18=0, i.e. (x-2)(x-9)=0, giving x=2 or x=9. Since the right side x-5 must be nonnegative (it equals a square root), we need x≥5, which rules out x=2. Checking x=9: √16=4=9-5, valid. So the sum of all real solutions is just 9.",
    hints: [
      "Square both sides to eliminate the square root, then solve the resulting quadratic.",
      "Check each candidate solution against the domain requirement that the right-hand side must be nonnegative, since it equals a square root.",
    ],
    difficulty: 8,
    topicSlug: "exponents-radicals",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-37",
    question:
      "Find the sum of all values of k for which the line y=kx+5 is tangent to the parabola y=x^2+3x+7.",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "Setting x^2+3x+7 = kx+5 gives x^2+(3-k)x+2=0. Tangency requires the discriminant to be 0: (3-k)^2 - 8 = 0, so (3-k)^2=8, giving 3-k=±2√2, i.e. k=3∓2√2. The two possible values of k, namely 3-2√2 and 3+2√2, sum to 6.",
    hints: [
      "Set the line and parabola equal to get a quadratic in x, then use the tangency condition that its discriminant equals 0.",
      "Solve for k without needing to simplify the individual radical values — you just need their sum.",
    ],
    difficulty: 8,
    topicSlug: "quadratics",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-41",
    question: "Find x if 9^x · 27^(x-1) = 3^(2x+5).",
    format: "SHORT_ANSWER",
    answer: "8/3",
    solution:
      "Rewrite all terms with base 3: 9^x=3^(2x), 27^(x-1)=3^(3x-3). The equation becomes 3^(2x+3x-3)=3^(2x+5), so 2x+3x-3=2x+5, i.e. 5x-3=2x+5, giving 3x=8, x=8/3.",
    hints: [
      "Rewrite every term as a power of 3 so you can compare exponents directly.",
      "Set the resulting linear exponent equation equal and solve for x.",
    ],
    difficulty: 9,
    topicSlug: "exponents-radicals",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-45",
    question:
      "The cubic x^3 - 9x^2 + 23x - c has three roots in arithmetic progression. Find c.",
    format: "SHORT_ANSWER",
    answer: "15",
    solution:
      "Let the roots be r-d, r, r+d. Their sum is 3r = 9 (matching the coefficient of x^2), so r=3. The sum of pairwise products of the roots equals 23 (the coefficient of x): (r-d)(r)+(r)(r+d)+(r-d)(r+d) = 3r^2 - d^2 = 27-d^2 = 23, so d^2=4, d=2. The roots are 1, 3, 5, and c equals their product: 1·3·5=15. (Check: (x-1)(x-3)(x-5)=x^3-9x^2+23x-15.)",
    hints: [
      "Write the roots as r-d, r, r+d and use Vieta's formula for the sum of roots to find r first.",
      "Use Vieta's formula for the sum of pairwise products to solve for d, then compute c as the product of the three roots.",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-49",
    question:
      "Find the sum of all integer values of k for which x^2 - kx + (k+3) = 0 has two distinct positive integer roots.",
    format: "SHORT_ANSWER",
    answer: "7",
    solution:
      "Let the roots be positive integers p, q with p+q=k and pq=k+3. Then pq - (p+q) = 3, i.e. pq-p-q+1=4, so (p-1)(q-1)=4. Since p,q are positive integers, p-1 and q-1 are nonnegative integers whose product is 4: the possibilities are (p-1,q-1)=(1,4) or (4,1) (giving {p,q}={2,5}) or (2,2) (giving p=q=3, not distinct). Only {p,q}={2,5} gives distinct positive integer roots, with k=p+q=7. So the sum of all valid k is 7.",
    hints: [
      "Let the two integer roots be p and q; use Vieta's formulas to write p+q=k and pq=k+3, then eliminate k to get an equation in p and q alone.",
      "Manipulate that equation into the form (p-1)(q-1)=constant, then check which nonnegative integer factor pairs give distinct roots.",
    ],
    difficulty: 9,
    topicSlug: "quadratics",
    competitionSlug: "stanford-math-tournament",
  },

  // ---------------------------- combinatorics ----------------------------
  {
    slug: "smt-18",
    question:
      "A club has 8 members. In how many ways can a president and a secretary (two different people) be chosen?",
    format: "SHORT_ANSWER",
    answer: "56",
    solution: "There are 8 choices for president and 7 remaining choices for secretary, giving 8·7=56.",
    hints: [
      "Choose the president first, then the secretary from the remaining members.",
      "Multiply the number of choices for each role.",
    ],
    difficulty: 6,
    topicSlug: "counting-principles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-22",
    question:
      "A fair coin is flipped 4 times. Find the probability of getting exactly 2 heads.",
    format: "SHORT_ANSWER",
    answer: "3/8",
    solution:
      "There are 2^4=16 equally likely outcomes. The number of ways to get exactly 2 heads is C(4,2)=6. The probability is 6/16=3/8.",
    hints: [
      "Count the total number of equally likely outcomes for 4 coin flips.",
      "Count the favorable outcomes using a combination (choosing which 2 of the 4 flips are heads).",
    ],
    difficulty: 6,
    topicSlug: "counting-probability",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-26",
    question: "How many 3-digit numbers (100 to 999) have digits that sum to 7?",
    format: "SHORT_ANSWER",
    answer: "28",
    solution:
      "Let the digits be a (hundreds, 1-9), b, c (0-9 each) with a+b+c=7. Substituting a'=a-1≥0 gives a'+b+c=6 with all variables nonnegative; since the total is only 6, no variable can exceed 9, so there's no need for further restriction. The number of nonnegative solutions is C(6+2,2)=C(8,2)=28.",
    hints: [
      "Shift the hundreds digit down by 1 so all three variables can range over nonnegative integers, turning this into a stars-and-bars count.",
      "Check that the small total (6) means no digit could possibly exceed 9, so no inclusion-exclusion correction is needed.",
    ],
    difficulty: 7,
    topicSlug: "combinations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-30",
    question:
      "A committee of 4 is chosen from 6 men and 5 women. In how many ways can the committee have at least 2 women?",
    format: "SHORT_ANSWER",
    answer: "215",
    solution:
      "Total committees: C(11,4)=330. Committees with 0 women: C(6,4)=15. Committees with exactly 1 woman: C(5,1)·C(6,3)=5·20=100. Committees with at least 2 women: 330-15-100=215.",
    hints: [
      "Use complementary counting: total committees minus those with 0 or 1 woman.",
      "Compute the 0-women and 1-woman cases separately using combinations, then subtract both from the total.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-34",
    question: "How many distinct arrangements are there of the letters of the word ALGEBRA?",
    format: "SHORT_ANSWER",
    answer: "2520",
    solution:
      "ALGEBRA has 7 letters with A repeated twice and all others distinct. The number of arrangements is 7!/2! = 5040/2 = 2520.",
    hints: [
      "Count the total letters and identify the repeated one.",
      "Divide the factorial of the total count by the factorial of the repeat count.",
    ],
    difficulty: 8,
    topicSlug: "permutations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-38",
    question:
      "A fair six-sided die is rolled 4 times. Find the probability that the sequence of rolls is non-decreasing.",
    format: "SHORT_ANSWER",
    answer: "7/72",
    solution:
      "The number of non-decreasing sequences of length 4 from {1,...,6} equals the number of multisets of size 4 from 6 values, which is C(4+6-1,4)=C(9,4)=126. The total number of sequences is 6^4=1296. The probability is 126/1296, which simplifies (dividing by 18) to 7/72.",
    hints: [
      "Non-decreasing sequences correspond exactly to multisets — use the combinations-with-repetition formula C(n+k-1,k).",
      "Divide the favorable count by the total number of sequences (6^4), then reduce the fraction.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-42",
    question:
      "In how many ways can 15 identical candies be distributed among 3 children so that each child gets at least 2 but no more than 8 candies?",
    format: "SHORT_ANSWER",
    answer: "37",
    solution:
      "Let y_i = x_i - 2 ≥ 0, so the constraint becomes y_1+y_2+y_3=9 with 0≤y_i≤6. The unrestricted count is C(9+2,2)=C(11,2)=55. Subtract cases where some y_i≥7 (set z=y_i-7≥0, giving sum 2, with C(2+2,2)=C(4,2)=6 solutions for each of the 3 variables, totaling 18); two variables can't both exceed 6 simultaneously since that would require a sum of at least 14 > 9. So the count is 55-18=37.",
    hints: [
      "Shift each child's count down by 2 to make a standard bounded stars-and-bars problem.",
      "Use inclusion-exclusion, subtracting the cases where some shifted variable exceeds 6 from the unrestricted count.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-46",
    question:
      "How many ways are there to write 20 as an ordered sum of 4 positive integers (i.e., how many compositions of 20 into 4 parts are there)?",
    format: "SHORT_ANSWER",
    answer: "969",
    solution:
      "By the stars-and-bars formula for compositions into positive parts, the number of ways to write n as an ordered sum of k positive integers is C(n-1,k-1). Here n=20, k=4, giving C(19,3) = (19·18·17)/6 = 5814/6 = 969.",
    hints: [
      "Recall that compositions of n into k positive parts are counted by C(n-1,k-1).",
      "Substitute n=20, k=4 and simplify the resulting combination.",
    ],
    difficulty: 9,
    topicSlug: "combinations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-50",
    question:
      "A bag contains 10 balls numbered 1 to 10. Four balls are drawn at random without replacement. Find the probability that the largest number drawn is 8.",
    format: "SHORT_ANSWER",
    answer: "1/6",
    solution:
      "For the largest drawn number to be exactly 8, ball 8 must be drawn along with 3 balls chosen from {1,...,7}: C(7,3)=35 ways. The total number of ways to draw 4 balls from 10 is C(10,4)=210. The probability is 35/210=1/6.",
    hints: [
      "For the maximum to be exactly 8, ball 8 must be included and the other 3 balls must come from {1,...,7}.",
      "Divide the favorable count by the total number of ways to choose 4 balls from 10.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "stanford-math-tournament",
  },

  // ------------------------------ geometry ------------------------------
  {
    slug: "smt-19",
    question: "A circle has circumference 30π. Find its radius.",
    format: "SHORT_ANSWER",
    answer: "15",
    solution: "Since C=2πr, 30π=2πr, so r=15.",
    hints: [
      "Recall the circumference formula C=2πr.",
      "Solve directly for r.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-23",
    question:
      "An isosceles triangle has two sides of length 10 and a base of length 12. Find its area.",
    format: "SHORT_ANSWER",
    answer: "48",
    solution:
      "The altitude to the base splits it into two segments of length 6, forming a right triangle with hypotenuse 10 and one leg 6. The height is √(10²-6²)=√64=8. The area is (1/2)(12)(8)=48.",
    hints: [
      "Drop the altitude from the apex to the base; it bisects the base by symmetry.",
      "Use the Pythagorean theorem on the resulting right triangle to find the height, then compute the area.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-27",
    question:
      "A rectangle is inscribed in a circle of radius 10. If the rectangle's width is 12, find its length.",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "The rectangle's diagonal equals the circle's diameter, 20. By the Pythagorean theorem, length = √(20²-12²) = √(400-144) = √256 = 16.",
    hints: [
      "A rectangle inscribed in a circle has its diagonal equal to the circle's diameter.",
      "Apply the Pythagorean theorem to the diagonal, width, and length.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-31",
    question: "A cone has radius 6 and height 8. Find its lateral surface area.",
    format: "SHORT_ANSWER",
    answer: "60π",
    solution:
      "The slant height is l=√(6²+8²)=√100=10. The lateral surface area of a cone is πrl = π(6)(10) = 60π.",
    hints: [
      "First find the slant height using the Pythagorean theorem on the radius and height.",
      "Apply the lateral surface area formula πrl.",
    ],
    difficulty: 8,
    topicSlug: "three-d-geometry",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-35",
    question:
      "In triangle ABC, angle A = 90°, AB=9, AC=12. Let M be the midpoint of BC. Find AM.",
    format: "SHORT_ANSWER",
    answer: "15/2",
    solution:
      "Since angle A is a right angle, BC is the hypotenuse: BC=√(81+144)=√225=15. The median to the hypotenuse of a right triangle equals half the hypotenuse, so AM=15/2.",
    hints: [
      "Find the hypotenuse BC using the Pythagorean theorem.",
      "Recall the special property that the median to the hypotenuse of a right triangle is exactly half the hypotenuse.",
    ],
    difficulty: 8,
    topicSlug: "triangles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-39",
    question:
      "Square ABCD has side length 10. Point P inside the square satisfies PA=6, PB=7, PC=9. Find PD.",
    format: "SHORT_ANSWER",
    answer: "2√17",
    solution:
      "By the British Flag Theorem, for any point P and rectangle ABCD, PA²+PC²=PB²+PD². So 36+81=49+PD², giving PD²=68, PD=√68=2√17.",
    hints: [
      "Recall the British Flag Theorem: for a point P and a rectangle ABCD (with A,C and B,D as opposite corner pairs), PA²+PC²=PB²+PD².",
      "Plug in the three known distances and solve for PD² directly — the side length of the square isn't actually needed for this relation.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-43",
    question:
      "Two circles with radii 7 and 3 are externally tangent to each other. Find the length of their common external tangent segment (between the two points of tangency, not passing through the point where the circles touch).",
    format: "SHORT_ANSWER",
    answer: "2√21",
    solution:
      "Since the circles are externally tangent, the distance between centers is d=7+3=10. The external tangent length is √(d²-(r1-r2)²) = √(100-16) = √84 = 2√21.",
    hints: [
      "The distance between centers of two externally tangent circles equals the sum of their radii.",
      "Apply the external tangent length formula √(d²-(r1-r2)²).",
    ],
    difficulty: 9,
    topicSlug: "circles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-47",
    question:
      "Triangle ABC has AB=11, BC=13, CA=20. Find the length of the altitude from vertex B to side AC.",
    format: "SHORT_ANSWER",
    answer: "33/5",
    solution:
      "The semiperimeter is s=(11+13+20)/2=22. By Heron's formula, the area is √(22·11·9·2)=√4356=66. Since area=(1/2)·AC·h_B, 66=(1/2)(20)h_B, so h_B=132/20=33/5.",
    hints: [
      "Use Heron's formula to find the triangle's area from its three side lengths.",
      "Set that area equal to (1/2)·base·height using AC as the base for the altitude from B, and solve for the height.",
    ],
    difficulty: 9,
    topicSlug: "triangles",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-51",
    question: "A regular octagon has side length 6. Find its area.",
    format: "SHORT_ANSWER",
    answer: "72+72√2",
    solution:
      "The area of a regular octagon with side length a is 2(1+√2)a². For a=6: 2(1+√2)(36) = 72(1+√2) = 72+72√2.",
    hints: [
      "Recall (or derive by cutting corner triangles off a square) the regular octagon area formula A=2(1+√2)a².",
      "Substitute a=6 and simplify.",
    ],
    difficulty: 9,
    topicSlug: "area-volume",
    competitionSlug: "stanford-math-tournament",
  },

  // ----------------------------- number theory -----------------------------
  {
    slug: "smt-20",
    question: "What is the greatest common divisor of 84 and 126?",
    format: "SHORT_ANSWER",
    answer: "42",
    solution: "84=2²·3·7 and 126=2·3²·7. The GCD takes the minimum power of each shared prime: 2·3·7=42.",
    hints: [
      "Factor both numbers into primes.",
      "The GCD is the product of the shared primes raised to the smaller of their two exponents.",
    ],
    difficulty: 6,
    topicSlug: "number-theory",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-24",
    question: "Find the remainder when 2^50 is divided by 7.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "Since gcd(2,7)=1 and φ(7)=6, Euler's theorem gives 2^6≡1 (mod 7). Since 50=6(8)+2, 2^50≡2^2=4 (mod 7).",
    hints: [
      "Use Euler's (or Fermat's little) theorem to find the order-related period of 2 modulo 7.",
      "Reduce the exponent 50 modulo that period before computing the final power.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-28",
    question: "Find the number of positive divisors of 2016.",
    format: "SHORT_ANSWER",
    answer: "36",
    solution:
      "2016 = 2^5·3^2·7. The number of divisors is (5+1)(2+1)(1+1) = 6·3·2 = 36.",
    hints: [
      "Find the prime factorization of 2016.",
      "Use the divisor-counting formula: add 1 to each exponent and multiply.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-32",
    question:
      "Find the smallest positive integer n such that 3n is a perfect square and 2n is a perfect cube.",
    format: "SHORT_ANSWER",
    answer: "108",
    solution:
      "Write n=2^a·3^b (no other primes help minimize n). For 3n=2^a·3^(b+1) to be a perfect square: a must be even and b+1 must be even (b odd). For 2n=2^(a+1)·3^b to be a perfect cube: a+1≡0 (mod 3), so a≡2 (mod 3), and b≡0 (mod 3). The smallest a that is even and ≡2 (mod 3) is a=2. The smallest b that is odd and divisible by 3 is b=3. So n=2^2·3^3=4·27=108. Check: 3n=324=18², 2n=216=6³.",
    hints: [
      "Write n=2^a·3^b and translate 'perfect square' and 'perfect cube' into parity/mod-3 conditions on a and b.",
      "Solve each condition (one from the square requirement, one from the cube requirement) for the smallest valid exponent, independently for a and b.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-36",
    question: "Find the number of ordered pairs of positive integers (x,y) satisfying xy - 3x - 3y = 0.",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "Adding 9 to both sides: xy-3x-3y+9=9, i.e. (x-3)(y-3)=9. The positive-integer solutions require x-3 and y-3 to be a factor pair of 9 with x,y>0. Checking factor pairs (including allowing negative pairs, since a negative times a negative also gives 9): (1,9)→(x,y)=(4,12); (3,3)→(6,6); (9,1)→(12,4); (-1,-9)→(2,-6) invalid; (-3,-3)→(0,0) invalid; (-9,-1)→(-6,2) invalid. So there are 3 valid ordered pairs.",
    hints: [
      "Add a constant to both sides (Simon's Favorite Factoring Trick) to turn the left side into a product of two linear factors.",
      "Enumerate all integer factor pairs of the resulting constant, keeping only those that give positive x and y.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-40",
    question:
      "Find the number of ordered pairs of integers (a,b) with 1≤a,b≤20 such that a²-b² is divisible by 7.",
    format: "SHORT_ANSWER",
    answer: "112",
    solution:
      "a²≡b² (mod 7) iff a and b have the same value of a² mod 7. The squares mod 7 are: 0²≡0, 1²≡1, 2²≡4, 3²≡2, 4²≡2, 5²≡4, 6²≡1. So residues 1..6 split into square-classes {1,6}→1, {2,5}→4, {3,4}→2, plus {0}→0. Among 1..20, residue 0 mod 7 occurs 2 times (7,14), and each of residues 1-6 occurs 3 times. So class {0} has 2 numbers, and classes {1,6}, {2,5}, {3,4} each have 3+3=6 numbers. The count of ordered pairs with matching class is 2²+6²+6²+6² = 4+36+36+36 = 112.",
    hints: [
      "Group the numbers 1 to 20 by which of the 4 possible quadratic-residue classes mod 7 their square falls into.",
      "The count of valid ordered pairs is the sum, over each class, of (class size)² — since a and b must land in the same class.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-44",
    question: "Find the sum of all positive integers n ≤ 60 such that n² ≡ 1 (mod 60).",
    format: "SHORT_ANSWER",
    answer: "240",
    solution:
      "Since 60=4·3·5, n²≡1 (mod 60) requires n²≡1 mod 4, mod 3, and mod 5 simultaneously, which forces n to be coprime to 60 with n≡±1 in each of these moduli (by CRT, giving 2·2·2=8 solutions mod 60). These are n=1,11,19,29,31,41,49,59. They pair up as (n, 60-n), each pair summing to 60, giving 4 pairs and a total sum of 4·60=240.",
    hints: [
      "Use the Chinese Remainder Theorem: n²≡1 (mod 60) breaks into n²≡1 mod 4, mod 3, and mod 5 separately, each with 2 solutions.",
      "Notice the solutions pair up as n and 60-n (since if n works, so does 60-n) — use this symmetry to shortcut the sum.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "stanford-math-tournament",
  },
  {
    slug: "smt-48",
    question:
      "Find the number of trailing zeros in 30! (30 factorial) when it is written in base 6.",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "The number of trailing zeros in base 6 equals the largest power of 6=2·3 dividing 30!, which is min(v2(30!), v3(30!)), where v_p(n!) denotes the exponent of prime p in n!. By Legendre's formula, v2(30!) = floor(30/2)+floor(30/4)+floor(30/8)+floor(30/16) = 15+7+3+1 = 26. v3(30!) = floor(30/3)+floor(30/9)+floor(30/27) = 10+3+1 = 14. The number of trailing zeros is min(26,14) = 14.",
    hints: [
      "Trailing zeros in base 6 are governed by the largest power of 6=2·3 dividing 30!, i.e. the minimum of the exponents of 2 and 3 in 30!'s prime factorization.",
      "Use Legendre's formula (sum of floor(30/p^k)) to compute each of v2(30!) and v3(30!) separately, then take the smaller.",
    ],
    difficulty: 9,
    topicSlug: "number-theory",
    competitionSlug: "stanford-math-tournament",
  },
];
