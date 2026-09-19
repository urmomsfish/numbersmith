import type { ProblemSeed } from "./problems";

/**
 * Hand-written competition-tagged problems for HMMT (Harvard-MIT Math
 * Tournament), modeled on the Individual Round: terse, technique-dense,
 * short-answer problems spanning Algebra/Number Theory, Combinatorics, and
 * Geometry, uniformly hard (roughly AIME-to-olympiad level) rather than
 * ramping gently the way AMC does.
 *
 * HMMT_PROBLEMS: 16 problems, difficulty 7-10, SHORT_ANSWER, split roughly
 * evenly across the three HMMT subject areas. All problems are original to
 * NumberSmith and every answer was independently re-derived (by hand, and
 * cross-checked with a second method or small-case sanity check) before
 * being written down.
 */

export const HMMT_PROBLEMS: ProblemSeed[] = [
  // ========================= algebra & number theory =========================
  {
    slug: "hmmt-01",
    question: "Real numbers a and b satisfy a + b = 6 and a^3 + b^3 = 126. Find a^2 + b^2.",
    format: "SHORT_ANSWER",
    answer: "26",
    solution:
      "Using a^3+b^3 = (a+b)^3 - 3ab(a+b): 126 = 216 - 18ab, so ab = 5. Then a^2+b^2 = (a+b)^2 - 2ab = 36 - 10 = 26. (Indeed a, b are the roots of t^2-6t+5=0, namely 1 and 5, which are real.)",
    hints: [
      "Expand (a+b)^3 to relate a^3+b^3 to ab and a+b.",
      "Once you know ab, use (a+b)^2 = a^2+b^2+2ab.",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-02",
    question:
      "Let r and s be the two real roots of x^2 - 7x + c = 0. Given that r^3 + s^3 = 91, find c.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Vieta, r+s=7 and rs=c. Then r^3+s^3=(r+s)^3-3rs(r+s)=343-21c. Setting this equal to 91 gives 21c=252, so c=12. Check: x^2-7x+12=0 factors as (x-3)(x-4)=0, with roots 3,4, and 3^3+4^3=27+64=91. ✓",
    hints: [
      "Write r^3+s^3 in terms of the elementary symmetric quantities r+s and rs using the identity r^3+s^3=(r+s)^3-3rs(r+s).",
      "You already know r+s=7 from the linear coefficient; solve the resulting linear equation for c=rs.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-03",
    question:
      "A function f: R → R satisfies f(x+y) = f(x) + f(y) + 2xy for all real x, y, and f(1) = 5. Find f(10).",
    format: "SHORT_ANSWER",
    answer: "140",
    solution:
      "Let g(x) = f(x) - x^2. Then g(x+y) = f(x+y) - (x+y)^2 = [f(x)+f(y)+2xy] - (x^2+2xy+y^2) = (f(x)-x^2) + (f(y)-y^2) = g(x)+g(y), so g is additive as an identity (no extra assumptions needed). In particular, for any positive integer n, induction gives g(n) = n·g(1). Here g(1) = f(1) - 1 = 4, so g(10) = 40, and f(10) = g(10) + 10^2 = 40 + 100 = 140.",
    hints: [
      "Try subtracting a well-chosen quadratic, like x^2, from f(x) to turn the equation into a plain additive one.",
      "An additive function g satisfies g(n) = n·g(1) for positive integers n by straightforward induction — you don't need g to be linear on all reals.",
    ],
    difficulty: 8,
    topicSlug: "functional-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-04",
    question:
      "Find the number of ordered pairs of positive integers (x, y) satisfying xy + x + y = 71.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "Adding 1 to both sides: xy + x + y + 1 = 72, which factors as (x+1)(y+1) = 72. Since x, y ≥ 1, we need x+1 ≥ 2 and y+1 ≥ 2, i.e. x+1 ranges over divisors d of 72 with 2 ≤ d ≤ 36 (so that 72/d ≥ 2 too). The divisors of 72 = 2^3·3^2 are 1,2,3,4,6,8,9,12,18,24,36,72 (12 total); excluding 1 and 72 leaves 2,3,4,6,8,9,12,18,24,36 — 10 divisors, each giving one ordered pair (x,y).",
    hints: [
      "Add 1 to both sides so the left side factors as (x+1)(y+1).",
      "Count divisors d of 72 with 2 ≤ d ≤ 36, since both x+1 and y+1 must be at least 2.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-05",
    question: "Find the last three digits of 2^100.",
    format: "SHORT_ANSWER",
    answer: "376",
    solution:
      "Compute 2^100 mod 1000 by repeated squaring: 2^10=1024≡24, 2^20≡24^2=576, 2^40≡576^2=331776≡776, 2^80≡776^2=602176≡176 (all mod 1000). Then 2^100 = 2^80·2^20 ≡ 176·576 = 101376 ≡ 376 (mod 1000). So the last three digits are 376.",
    hints: [
      "Since 2 shares a factor with 1000, Euler's theorem doesn't directly apply to the modulus 1000 — instead compute 2^100 mod 1000 directly via repeated squaring.",
      "Build up 2^10, 2^20, 2^40, 2^80 mod 1000 by repeated squaring, then combine 2^80·2^20 to get 2^100.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-06",
    question:
      "Find the number of positive integers n ≤ 1000 such that n^2 - n is divisible by 1000.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "We need 1000 = 8·125 | n(n-1). Since n and n-1 are consecutive, they are coprime, so all the factors of 2 must come from whichever of n, n-1 is even, and (since 5 can't divide both consecutive integers) all the factors of 5 must come from a single one of n, n-1 as well. So we need one of {n, n-1} ≡ 0 (mod 8) and one of {n, n-1} ≡ 0 (mod 125), independently — 4 combinations. Each combination pins down n mod 1000 via CRT: (n≡0 mod8, n≡0 mod125) gives n≡0; (n≡1 mod8, n≡1 mod125) gives n≡1; (n≡0 mod8, n≡1 mod125) gives n≡376; (n≡1 mod8, n≡0 mod125) gives n≡625 (solving each pair with CRT). Within 1 ≤ n ≤ 1000 these give n = 1000, 1, 376, 625 — check: 376·375=141000 and 625·624=390000, both divisible by 1000. So there are 4 such n.",
    hints: [
      "Factor 1000 = 8·125 and use that n and n-1 are coprime: all factors of 2 must come from one of them, and (separately) all factors of 5 must come from one of them.",
      "This gives 4 independent combinations of 'which one is divisible by 8' and 'which one is divisible by 125' — solve each with the Chinese Remainder Theorem to get a residue mod 1000, then count valid n in range.",
    ],
    difficulty: 10,
    topicSlug: "divisibility",
    competitionSlug: "hmmt",
  },

  // ============================= combinatorics =============================
  {
    slug: "hmmt-07",
    question:
      "In how many ways can a 1×10 strip be tiled using pieces of length 1, 2, and 3 (pieces of the same length are interchangeable, but the order of piece lengths along the strip matters)?",
    format: "SHORT_ANSWER",
    answer: "274",
    solution:
      "This counts compositions of 10 into parts of size 1, 2, 3. Let T(n) be this count; conditioning on the length of the first piece gives T(n) = T(n-1)+T(n-2)+T(n-3), with T(0)=1, T(1)=1, T(2)=2. Then T(3)=4, T(4)=7, T(5)=13, T(6)=24, T(7)=44, T(8)=81, T(9)=149, T(10)=274.",
    hints: [
      "Condition on the length of the first piece placed to get a recurrence relating T(n) to smaller strip lengths.",
      "The recurrence is T(n)=T(n-1)+T(n-2)+T(n-3) (a 'tribonacci' recursion); compute the base cases and iterate up to n=10.",
    ],
    difficulty: 7,
    topicSlug: "recursion-in-counting",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-08",
    question:
      "In how many distinct ways can the letters of MISSISSIPPI be arranged so that no two S's are adjacent?",
    format: "SHORT_ANSWER",
    answer: "7350",
    solution:
      "MISSISSIPPI has 11 letters: M(1), I(4), S(4), P(2). First arrange the 7 non-S letters (M, I×4, P×2): there are 7!/(4!2!) = 105 ways. This creates 8 gaps (including both ends) into which the 4 identical S's are placed, at most one per gap to keep them non-adjacent: C(8,4) = 70 ways. Total: 105 · 70 = 7350.",
    hints: [
      "First arrange all the letters except the S's, then insert the S's into the gaps between them so no two S's land in the same gap.",
      "With 7 non-S letters placed in a row there are 8 gaps (including the two ends); choose 4 of them for the S's.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-09",
    question:
      "A permutation σ of {1, 2, ..., 7} is chosen uniformly at random. Find the expected number of indices i such that σ(i) ≥ i + 3.",
    format: "SHORT_ANSWER",
    answer: "10/7",
    solution:
      "By linearity of expectation, E = Σ_{i=1}^{7} P(σ(i) ≥ i+3). Since σ(i) is uniform over {1,...,7}, P(σ(i)≥i+3) = (number of valid values)/7. For i=1,2,3,4 the counts of j∈{1,...,7} with j≥i+3 are 4,3,2,1 respectively; for i=5,6,7 the count is 0. Summing: (4+3+2+1)/7 = 10/7.",
    hints: [
      "Use linearity of expectation: write the count as a sum of indicator random variables, one per index i, and find each one's probability separately.",
      "Since σ(i) is uniform over {1,...,7}, P(σ(i)≥i+3) is just (how many values in {1,...,7} are ≥ i+3) divided by 7.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-10",
    question:
      "How many permutations of {1, 2, 3, 4, 5, 6} have no k (1 ≤ k ≤ 5) immediately followed by k+1?",
    format: "SHORT_ANSWER",
    answer: "309",
    solution:
      "Use inclusion-exclusion on the 5 possible 'successions' (k, k+1) appearing as adjacent entries. If we force a specific set of j successions to occur (gluing each into a fixed-order block), the number of remaining objects to permute is 6-j, giving (6-j)! arrangements, and there are C(5,j) ways to choose which j successions to force. So the count avoiding all successions is Σ_{j=0}^{5} (-1)^j C(5,j)(6-j)! = 720 - 5·120 + 10·24 - 10·6 + 5·2 - 1·1 = 720-600+240-60+10-1 = 309.",
    hints: [
      "Use inclusion-exclusion over the 5 possible 'successions' (k immediately followed by k+1); forcing a set of j of them to occur glues those numbers into fixed-order blocks, leaving (6-j) objects to arrange.",
      "Sum (-1)^j C(5,j)(6-j)! over j=0 to 5.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-11",
    question:
      "In how many ways can 8 non-attacking rooks be placed on an 8×8 chessboard so that no rook lies on the main diagonal?",
    format: "SHORT_ANSWER",
    answer: "14833",
    solution:
      "A placement of 8 non-attacking rooks corresponds to a permutation σ of {1,...,8} (rook in row i is in column σ(i)). Avoiding the main diagonal means σ(i) ≠ i for all i, i.e. σ is a derangement. The number of derangements of 8 elements is D_8, computed via D_n = (n-1)(D_{n-1}+D_{n-2}) with D_1=0, D_2=1: D_3=2, D_4=9, D_5=44, D_6=265, D_7=1854, D_8 = 7·(1854+265) = 7·2119 = 14833.",
    hints: [
      "A non-attacking rook placement is exactly a permutation of the columns (one rook per row and per column); 'not on the main diagonal' means no fixed points.",
      "You need the number of derangements of 8 elements; use the recurrence D_n=(n-1)(D_{n-1}+D_{n-2}) starting from D_1=0, D_2=1.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "hmmt",
  },

  // ================================ geometry ================================
  {
    slug: "hmmt-12",
    question: "Triangle ABC has side lengths AB = 10, BC = 17, CA = 21. Find its circumradius.",
    format: "SHORT_ANSWER",
    answer: "85/8",
    solution:
      "By Heron's formula with s = (10+17+21)/2 = 24: Area = √(24·14·7·3) = √7056 = 84. The circumradius is R = (abc)/(4·Area) = (10·17·21)/(4·84) = 3570/336 = 85/8.",
    hints: [
      "Find the triangle's area with Heron's formula using the semiperimeter.",
      "The circumradius formula R = abc/(4·Area) turns the area you just found into R directly.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-13",
    question:
      "Two circles with radii 7 and 9 have centers 12 apart and intersect at two points. Find the length of their common chord.",
    format: "SHORT_ANSWER",
    answer: "14√5/3",
    solution:
      "Place the centers 12 apart. The distance from the radius-7 center to the common chord is a = (d^2+r1^2-r2^2)/(2d) = (144+49-81)/24 = 112/24 = 14/3. The half-chord length is √(r1^2-a^2) = √(49 - 196/9) = √(245/9) = (7√5)/3, so the full chord is 14√5/3. (Check from the other side: the distance from the radius-9 center is 12-14/3 = 22/3, and √(81-(22/3)^2) = √(245/9) = 7√5/3 as well — consistent.)",
    hints: [
      "Use the radical-axis distance formula a=(d^2+r1^2-r2^2)/(2d) to find how far one circle's center is from the common chord.",
      "The Pythagorean theorem on the triangle formed by that radius, the distance to the chord, and half the chord gives the half-chord length; double it.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-14",
    question:
      "Circle ω is tangent to both the positive x-axis and the positive y-axis, and passes through the point (8, 4). Find the sum of all possible radii of ω.",
    format: "SHORT_ANSWER",
    answer: "24",
    solution:
      "Tangency to both positive axes forces the center to be at (r, r) for radius r > 0. Passing through (8,4) gives (8-r)^2 + (4-r)^2 = r^2, i.e. 64-16r+r^2+16-8r+r^2=r^2, so r^2-24r+80=0. By Vieta's formulas the sum of the two roots is 24 (and indeed both roots, r=20 and r=4, are positive, so both are valid).",
    hints: [
      "Tangency to both positive coordinate axes forces the circle's center to be at (r, r).",
      "Substitute the point (8,4) into the circle's equation to get a quadratic in r — you can get the sum of its roots straight from Vieta's formulas without solving for them individually.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-15",
    question:
      "A regular tetrahedron has edge length 6. A plane parallel to a pair of opposite edges, and equidistant from both, slices the tetrahedron. Find the area of the resulting cross-section.",
    format: "SHORT_ANSWER",
    answer: "9",
    solution:
      "Place the tetrahedron's vertices at A(1,1,1), B(1,-1,-1), C(-1,1,-1), D(-1,-1,1) (edge length 2√2). Opposite edges AB and CD lie in the planes x=1 and x=-1 respectively, so the plane equidistant from both and parallel to both is x=0. This plane meets edges AC, AD, BC, BD at their midpoints (0,1,0), (0,0,1), (0,-1,0), (0,0,-1) — a square (in the yz-plane) with diagonal 2, hence side √2. Since this reference tetrahedron has edge length 2√2, the cross-section side is exactly half the edge length in general; for edge length 6 the cross-section is a square of side 3, with area 9.",
    hints: [
      "Set up coordinates for a regular tetrahedron (e.g. alternating vertices of a cube) so that a pair of opposite edges each lie in a constant-coordinate plane — the equidistant parallel plane is then easy to locate.",
      "The cross-section through the midpoints of the four other edges is a square whose side length is exactly half the tetrahedron's edge length.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-16",
    question:
      "In triangle ABC, points D, E, F lie on sides BC, CA, AB respectively, with BD/DC = CE/EA = AF/FB = 1/2. Cevians AD, BE, CF bound a smaller triangle inside ABC. Find the ratio of the area of this inner triangle to the area of ABC.",
    format: "SHORT_ANSWER",
    answer: "1/7",
    solution:
      "Take A=(0,0), B=(1,0), C=(0,1) (area 1/2). Then D = B+(1/3)(C-B) = (2/3,1/3), E = C+(1/3)(A-C) = (0,2/3), F = A+(1/3)(B-A) = (1/3,0). Line AD: y=x/2. Line BE: y=-2x/3+2/3. Line CF: y=1-3x. Solving pairwise: AD∩BE = (4/7,2/7), BE∩CF = (1/7,4/7), CF∩AD = (2/7,1/7). The shoelace formula gives this inner triangle's area as 1/14. Since ABC has area 1/2, the ratio is (1/14)/(1/2) = 1/7. (This matches the general result — a special case of Routh's theorem — that dividing every side in ratio 1:2 by cevians from the opposite vertices always produces an inner triangle of exactly 1/7 the area.)",
    hints: [
      "Coordinates make this concrete: place A, B, C at convenient points, find D, E, F from the given ratios, then write the equation of each cevian.",
      "Solve the three cevians pairwise to get the inner triangle's three vertices, then use the shoelace formula on both triangles and take the ratio.",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "hmmt",
  },

// ============================ block 1 (difficulty 7) ============================
  {
    slug: "hmmt-17",
    question:
      "Positive real numbers x and y satisfy x^2 + xy = 40 and xy + y^2 = 24. Find x + y.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Adding the two equations gives x^2 + 2xy + y^2 = 64, i.e. (x+y)^2 = 64. Since x, y > 0, x + y = 8. (Indeed x=5, y=3 solves both original equations: 25+15=40 and 15+9=24.)",
    hints: [
      "Add the two given equations and look for a perfect square on the left.",
      "(x+y)^2 = x^2+2xy+y^2 — the sum of the two equations is exactly this.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-18",
    question: "Triangle ABC has AB = 13, BC = 14, AC = 15. Find the length of the altitude from B to AC.",
    format: "SHORT_ANSWER",
    answer: "56/5",
    solution:
      "By Heron's formula with s = (13+14+15)/2 = 21: Area = √(21·8·7·6) = √7056 = 84. The altitude from B to side AC (length 15) satisfies (1/2)·15·h = 84, so h = 168/15 = 56/5.",
    hints: [
      "Find the triangle's area first, using Heron's formula.",
      "Area = (1/2)·base·height, with AC as the base for the altitude from B.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-19",
    question: "Find the sum of the positive divisors of 360.",
    format: "SHORT_ANSWER",
    answer: "1170",
    solution:
      "360 = 2^3 · 3^2 · 5. The sum-of-divisors function is multiplicative: σ(360) = (1+2+4+8)(1+3+9)(1+5) = 15 · 13 · 6 = 1170.",
    hints: [
      "Factor 360 into prime powers first.",
      "The sum of divisors of p^a·q^b·... is the product of (1+p+...+p^a) over each prime.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-20",
    question:
      "A committee of 4 people is chosen from a group of 6 men and 5 women. In how many ways can the committee be chosen so that it includes at least 2 women?",
    format: "SHORT_ANSWER",
    answer: "215",
    solution:
      "Count by number of women w = 2, 3, or 4: w=2 gives C(5,2)·C(6,2)=10·15=150; w=3 gives C(5,3)·C(6,1)=10·6=60; w=4 gives C(5,4)·C(6,0)=5·1=5. Total: 150+60+5=215.",
    hints: [
      "Split into cases based on the number of women on the committee (2, 3, or 4).",
      "For each case multiply the number of ways to choose the women by the number of ways to choose the remaining men, then add the cases.",
    ],
    difficulty: 7,
    topicSlug: "combinations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-21",
    question: "A sequence satisfies a_1 = 3 and a_{n+1} = 2a_n + 1 for n ≥ 1. Find a_6.",
    format: "SHORT_ANSWER",
    answer: "127",
    solution:
      "Let b_n = a_n + 1, so b_{n+1} = 2b_n with b_1 = 4. Then b_n = 4·2^{n-1} = 2^{n+1}, so a_n = 2^{n+1} - 1. Thus a_6 = 2^7 - 1 = 127. (Direct iteration confirms: 3, 7, 15, 31, 63, 127.)",
    hints: [
      "Add 1 to both sides of the recurrence to turn it into a pure doubling relation.",
      "Once b_n = a_n + 1 satisfies b_{n+1} = 2b_n, it's geometric: b_n = b_1 · 2^{n-1}.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-22",
    question: "A circle has area 100π. A chord of the circle is at distance 6 from the center. Find the length of the chord.",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "The radius satisfies πr^2=100π, so r=10. Half the chord has length √(r^2-6^2)=√(100-36)=√64=8, so the full chord has length 16.",
    hints: [
      "Find the radius from the area first.",
      "The perpendicular from the center to a chord, half the chord, and the radius form a right triangle.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-23",
    question: "Find the remainder when 7^100 is divided by 13.",
    format: "SHORT_ANSWER",
    answer: "9",
    solution:
      "By Fermat's little theorem, 7^12 ≡ 1 (mod 13). Since 100 = 12·8+4, 7^100 ≡ 7^4 (mod 13). Now 7^2=49≡10 (mod 13), so 7^4≡10^2=100≡9 (mod 13).",
    hints: [
      "Fermat's little theorem tells you 7^12 ≡ 1 (mod 13); reduce the exponent 100 mod 12.",
      "Compute 7^4 mod 13 by squaring 7^2 mod 13.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-24",
    question: "A fair six-sided die is rolled 3 times. Find the probability that the sum of the three rolls is exactly 10.",
    format: "SHORT_ANSWER",
    answer: "1/8",
    solution:
      "We need the number of solutions to a+b+c=10 with 1≤a,b,c≤6. Substituting a'=a-1 etc., a'+b'+c'=7 with 0≤a',b',c'≤5. Unrestricted nonnegative solutions: C(9,2)=36. Subtract cases where some variable exceeds 5 (i.e. ≥6): if a'≥6, set a''=a'-6, giving a''+b'+c'=1 with C(3,2)=3 solutions; by symmetry this happens for 3 variables, and no two can exceed 5 simultaneously since 2·6>7. So valid solutions: 36-3·3=27. Probability = 27/216 = 1/8.",
    hints: [
      "Count solutions to a+b+c=10 with each of a,b,c between 1 and 6 using stars and bars with inclusion-exclusion.",
      "Divide the count of valid outcomes by 6^3=216 total outcomes.",
    ],
    difficulty: 7,
    topicSlug: "counting-probability",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-25",
    question: "If 3^x = 5 and 3^y = 20, find 3^{2x-y}.",
    format: "SHORT_ANSWER",
    answer: "5/4",
    solution:
      "3^{2x-y} = (3^x)^2 / 3^y = 5^2/20 = 25/20 = 5/4.",
    hints: [
      "Rewrite 3^{2x-y} as (3^x)^2 divided by 3^y.",
      "Substitute the given values directly.",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-26",
    question: "A right circular cone has volume 100π and height 12. Find its radius.",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "V = (1/3)πr^2h, so 100π = (1/3)πr^2·12 = 4πr^2, giving r^2=25, so r=5.",
    hints: [
      "Plug the given volume and height into the cone volume formula.",
      "Solve the resulting equation for r^2, then take the positive square root.",
    ],
    difficulty: 7,
    topicSlug: "area-volume",
    competitionSlug: "hmmt",
  },

  // ============================ block 2 (difficulty 8) ============================
  {
    slug: "hmmt-27",
    question: "Find the smallest positive integer n such that n! is divisible by 10^6.",
    format: "SHORT_ANSWER",
    answer: "25",
    solution:
      "Since 10^6=2^6·5^6 and factors of 5 are scarcer than factors of 2 in n!, we need the exponent of 5 in n!, v_5(n!) = floor(n/5)+floor(n/25)+..., to reach at least 6 (the exponent of 2 will then automatically exceed 6). For n=21,...,24, v_5(n!)=floor(n/5)=4, too small. At n=25: v_5(25!)=floor(25/5)+floor(25/25)=5+1=6, which suffices. So the smallest such n is 25.",
    hints: [
      "The bottleneck is the number of factors of 5 in n!, since factors of 2 are far more abundant.",
      "Use Legendre's formula v_5(n!) = floor(n/5)+floor(n/25)+... and find where it first reaches 6.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-28",
    question:
      "In how many ways can 10 identical candies be distributed among 4 distinguishable children so that each child receives at least 1 and at most 4 candies?",
    format: "SHORT_ANSWER",
    answer: "44",
    solution:
      "Let a_i be the number of candies for child i, so a_1+a_2+a_3+a_4=10 with 1≤a_i≤4. Substitute b_i=a_i-1, so b_1+...+b_4=6 with 0≤b_i≤3. Unrestricted nonnegative solutions: C(9,3)=84. Subtract cases where some b_i≥4: set b_i'=b_i-4, giving sum 2 among 4 nonnegative variables, C(5,3)=10 solutions, times 4 choices of which variable is large = 40 (no double-subtraction needed since two variables can't simultaneously exceed 3 when the total is only 6, as 2·4=8>6). Total: 84-40=44.",
    hints: [
      "Shift variables so the constraint becomes 0 ≤ b_i ≤ 3 with a fixed sum, then use stars and bars.",
      "Apply inclusion-exclusion to remove solutions where some b_i is 4 or more.",
    ],
    difficulty: 8,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-29",
    question:
      "The polynomial P(x) = x^3 - 7x + c has three real roots, one of which is 2. Find the sum of the squares of the other two roots.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "Since P(2)=0: 8-14+c=0, so c=6, giving P(x)=x^3-7x+6. Dividing by (x-2): x^3-7x+6=(x-2)(x^2+2x-3)=(x-2)(x+3)(x-1). The other two roots are -3 and 1, and (-3)^2+1^2=9+1=10.",
    hints: [
      "Use P(2)=0 to solve for c first.",
      "Factor out (x-2) from the resulting cubic to find the other two roots directly.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-30",
    question:
      "In triangle ABC, AB = 9 and AC = 12. The angle bisector from A meets BC at D, with BD = 6. Find DC.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "By the angle bisector theorem, BD/DC = AB/AC = 9/12 = 3/4. Since BD=6, DC = 6·(4/3) = 8.",
    hints: [
      "The angle bisector theorem relates BD/DC to the two adjacent sides AB and AC.",
      "Set up the ratio 6/DC = 9/12 and solve.",
    ],
    difficulty: 8,
    topicSlug: "similarity-congruence",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-31",
    question:
      "Find the number of ordered pairs of positive integers (a, b) with a ≤ b, ab = 1260, and gcd(a, b) = 1.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "1260 = 2^2·3^2·5·7 has 4 distinct prime factors. For ab=1260 with gcd(a,b)=1, each prime's full power must go entirely to a or entirely to b, giving 2^4=16 ways to split the primes into two groups, hence 16 ordered pairs (a,b) with ab=1260, gcd(a,b)=1 (order matters). Since 1260 is not a perfect square, a≠b always, so exactly half, 8, have a≤b (in fact a<b).",
    hints: [
      "Coprimality forces each prime power factor of 1260 to go entirely into a or entirely into b.",
      "With 4 distinct primes there are 2^4 ways to assign them, giving ordered pairs; halve for a ≤ b since a=b is impossible.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-32",
    question:
      "A box contains 5 red balls and 7 blue balls. Balls are drawn one at a time without replacement until a red ball is drawn. Find the expected number of balls drawn.",
    format: "SHORT_ANSWER",
    answer: "13/6",
    solution:
      "For N total items with K of a special color placed in a uniformly random order, the expected position of the first special item is (N+1)/(K+1). Here N=12, K=5, giving E = 13/6. (Sanity check with N=2,K=1: formula gives 3/2, matching the direct computation of 1·(1/2)+2·(1/2)=3/2.)",
    hints: [
      "Think of all 12 balls as being placed in a uniformly random order in advance.",
      "There's a clean formula for the expected position of the first 'special' item among N items with K special ones: (N+1)/(K+1).",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-33",
    question: "Let f(x) = x/(x+1). Compute f applied 100 times to the input 1, i.e. f(f(f(...f(1)...))) with 100 applications of f.",
    format: "SHORT_ANSWER",
    answer: "1/101",
    solution:
      "Claim: f^n(x) = x/(1+nx). This holds for n=1. If f^n(x)=x/(1+nx), then f^{n+1}(x) = f^n(x)/(f^n(x)+1) = [x/(1+nx)]/[(1+nx+x)/(1+nx)] = x/(1+(n+1)x), completing the induction. So f^100(1) = 1/(1+100·1) = 1/101.",
    hints: [
      "Compute f(1), f(f(1)), f(f(f(1))) and look for a pattern in terms of n.",
      "Guess f^n(x) = x/(1+nx) and confirm it by induction on n.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-34",
    question: "A cube has surface area 96. A sphere is inscribed in the cube (tangent to all six faces). Find the volume of the sphere.",
    format: "SHORT_ANSWER",
    answer: "32π/3",
    solution:
      "Surface area 6s^2=96 gives s^2=16, so s=4. The inscribed sphere has radius s/2=2, so its volume is (4/3)π(2)^3 = 32π/3.",
    hints: [
      "Find the cube's side length from its surface area.",
      "The inscribed sphere's radius is half the cube's side length.",
    ],
    difficulty: 8,
    topicSlug: "three-d-geometry",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-35",
    question: "Find the number of integers n with 1 ≤ n ≤ 2025 such that n^2 ≡ 1 (mod 24).",
    format: "SHORT_ANSWER",
    answer: "675",
    solution:
      "Mod 8: every odd n satisfies n^2≡1 (mod 8), and even n never does, so we need n odd. Mod 3: n^2≡1 (mod 3) exactly when n is not divisible by 3. So the condition n^2≡1 (mod 24) is equivalent to gcd(n,6)=1, i.e. n≡1 or 5 (mod 6). Among 1,...,2025 = 6·337+3, each complete block of 6 contributes 2 such values, giving 337·2=674 from the first 2022 integers; among the remaining 2023,2024,2025 (residues 1,2,3 mod 6), only 2023 (≡1 mod 6) qualifies. Total: 674+1=675.",
    hints: [
      "Break the modulus 24 into 8 and 3, and find the condition on n mod 8 and mod 3 separately for n^2≡1.",
      "The combined condition is equivalent to gcd(n,6)=1; count integers in the range with that property in blocks of 6.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-36",
    question: "How many permutations of the digits 1, 2, 3, 4, 5, 6 (each used once) form a 6-digit number divisible by 4?",
    format: "SHORT_ANSWER",
    answer: "192",
    solution:
      "A number is divisible by 4 exactly when its last two digits (as a 2-digit number) are divisible by 4. Checking all ordered pairs (x,y) of distinct digits from {1,...,6} with 10x+y ≡ 0 (mod 4), i.e. 2x+y≡0 (mod 4): there are 8 such pairs — (1,2),(1,6),(2,4),(3,2),(3,6),(5,2),(5,6),(6,4). For each choice of last two digits, the remaining 4 digits can be arranged freely in the front in 4!=24 ways. Total: 8·24=192.",
    hints: [
      "Divisibility by 4 depends only on the last two digits of the number.",
      "Count the valid ordered last-two-digit pairs first, then multiply by the 4! arrangements of the remaining digits.",
    ],
    difficulty: 8,
    topicSlug: "permutations",
    competitionSlug: "hmmt",
  },

  // ============================ block 3 (difficulty 9) ============================
  {
    slug: "hmmt-37",
    question:
      "A function f: R → R satisfies f(x+y) + f(x-y) = 2f(x) + 2f(y) for all real x, y, and f(1) = 1. Find f(12).",
    format: "SHORT_ANSWER",
    answer: "144",
    solution:
      "Setting x=y=0 gives 2f(0)=4f(0), so f(0)=0. Setting y=1 gives f(x+1)+f(x-1) = 2f(x)+2f(1) = 2f(x)+2. Restricting to integer x, this is a linear recurrence for a_n=f(n): a_{n+1}=2a_n-a_{n-1}+2, with a_0=0, a_1=1. Since the sequence n^2 also satisfies this exact recurrence (as (n+1)^2+(n-1)^2=2n^2+2) with the same initial values a_0=0, a_1=1, and a linear recurrence with given initial conditions has a unique solution, a_n=n^2 for all integers n≥0. So f(12)=144.",
    hints: [
      "Plug in x=y=0 to find f(0), then set y=1 to get a recurrence connecting f(x+1), f(x), f(x-1).",
      "This turns f restricted to integers into a linear recurrence sequence with the same recurrence and initial values as n^2 — so it must equal n^2 there, by uniqueness of solutions to a linear recurrence with fixed initial terms.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-38",
    question:
      "Two circles of radii 5 and 8 are externally tangent to each other. A common external tangent line touches the two circles at points P and Q. Find PQ.",
    format: "SHORT_ANSWER",
    answer: "4√10",
    solution:
      "Since the circles are externally tangent, the distance between centers is d=5+8=13. For two circles with radii r1, r2 and center distance d, the length of a common external tangent segment is √(d^2-(r1-r2)^2). Here that's √(169-9)=√160=4√10.",
    hints: [
      "First find the distance between the two centers, using the fact that the circles are externally tangent.",
      "Use the standard external tangent length formula √(d^2-(r1-r2)^2).",
    ],
    difficulty: 9,
    topicSlug: "circles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-39",
    question: "Find the number of ordered pairs of positive integers (x, y) satisfying x^2 - y^2 = 2024.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "Factor as (x-y)(x+y)=2024. Since x-y and x+y have the same parity and their product 2024 is even, both must be even (both odd is impossible since the product would be odd). Write x-y=2m, x+y=2n with mn=2024/4=506=2·11·23, m<n (since x-y<x+y for positive y), m,n>0. The number of divisors of 506 is (1+1)(1+1)(1+1)=8, giving 4 factor pairs (m,n) with m<n: (1,506),(2,253),(11,46),(22,23). Each gives a valid solution x=m+n, y=n-m. So there are 4 ordered pairs.",
    hints: [
      "Factor the difference of squares as (x-y)(x+y)=2024, and note both factors must share the same parity.",
      "Since 2024 is divisible by 4, both factors must be even; write them as 2m, 2n and count factorizations of 2024/4.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-40",
    question: "Find the number of surjective (onto) functions from a 6-element set to a 4-element set.",
    format: "SHORT_ANSWER",
    answer: "1560",
    solution:
      "By inclusion-exclusion, the number of surjections from an n-set to a k-set is Σ_{i=0}^{k} (-1)^i C(k,i)(k-i)^n. With n=6, k=4: 4^6 - C(4,1)·3^6 + C(4,2)·2^6 - C(4,3)·1^6 = 4096 - 4·729 + 6·64 - 4·1 = 4096-2916+384-4 = 1560.",
    hints: [
      "Start from all 4^6 functions and use inclusion-exclusion to remove those that miss at least one element of the codomain.",
      "The formula is Σ (-1)^i C(4,i)(4-i)^6 summed over i=0 to 4.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-41",
    question:
      "Let x, y, z be positive real numbers with xyz = 1. Find the minimum value of x^2 + y^2 + z^2 + xy + yz + zx.",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "First, x^2+y^2+z^2 ≥ xy+yz+zx always (equivalent to (1/2)[(x-y)^2+(y-z)^2+(z-x)^2]≥0). Second, by AM-GM on xy, yz, zx (whose product is (xyz)^2=1): xy+yz+zx ≥ 3·((xy)(yz)(zx))^{1/3} = 3·(xyz)^{2/3} = 3. Combining, x^2+y^2+z^2+xy+yz+zx ≥ (xy+yz+zx) + (xy+yz+zx) ≥ 3+3=6, using the first inequality on the first three terms. At x=y=z=1 (which satisfies xyz=1), the expression equals 3+3=6, so the minimum is 6.",
    hints: [
      "Show x^2+y^2+z^2 ≥ xy+yz+zx always holds (it's equivalent to a sum of squares being nonnegative), so the whole expression is at least 2(xy+yz+zx).",
      "Then bound xy+yz+zx from below using AM-GM, since (xy)(yz)(zx)=(xyz)^2=1.",
    ],
    difficulty: 9,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-42",
    question:
      "In triangle ABC, angle A = 60°, AB = 7, AC = 8. Find the length of the angle bisector from A to side BC.",
    format: "SHORT_ANSWER",
    answer: "56√3/15",
    solution:
      "The length of the angle bisector from A in a triangle with adjacent sides b=AC, c=AB and angle A is t_a = 2bc·cos(A/2)/(b+c). Here b=8, c=7, A/2=30°, cos30°=√3/2, so t_a = 2·8·7·(√3/2)/(15) = 56√3/15.",
    hints: [
      "Use the angle bisector length formula t_a = 2bc·cos(A/2)/(b+c), where b and c are the two sides meeting at A.",
      "cos(30°)=√3/2 simplifies the expression directly.",
    ],
    difficulty: 9,
    topicSlug: "triangles",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-43",
    question: "How many integers a with 1 ≤ a ≤ 16 are primitive roots modulo 17?",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "The number of primitive roots modulo a prime p is φ(p-1). Here p=17, p-1=16=2^4, and φ(16)=16·(1-1/2)=8.",
    hints: [
      "The count of primitive roots mod a prime p is given by Euler's totient function applied to p-1.",
      "Compute φ(16).",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-44",
    question:
      "A graph on 10 vertices has 15 edges, and every vertex has degree either 2 or 4. Find the number of vertices with degree 4.",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "Let x be the number of degree-4 vertices and y the number of degree-2 vertices, so x+y=10. By the handshake lemma, the sum of degrees equals twice the number of edges: 4x+2y=30. Substituting y=10-x: 4x+2(10-x)=30, so 2x+20=30, x=5.",
    hints: [
      "Set up two equations: one for the total number of vertices, and one from the handshake lemma (sum of degrees = 2·edges).",
      "Solve the resulting linear system for the number of degree-4 vertices.",
    ],
    difficulty: 9,
    topicSlug: "graph-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-45",
    question:
      "Let r and s be the roots of x^2 - kx + (k+3) = 0, where k is a real number chosen so that the roots are real. Find the minimum possible value of r^2 + s^2.",
    format: "SHORT_ANSWER",
    answer: "2",
    solution:
      "By Vieta, r+s=k, rs=k+3, so r^2+s^2=k^2-2(k+3)=k^2-2k-6. Real roots require discriminant k^2-4(k+3)≥0, i.e. k^2-4k-12≥0, i.e. (k-6)(k+2)≥0, so k≤-2 or k≥6. The function f(k)=k^2-2k-6=(k-1)^2-7 is a upward parabola with vertex at k=1 (outside the allowed region), decreasing for k<1 and increasing for k>1. On k≥6, f is increasing, so its minimum there is at k=6: f(6)=18. On k≤-2, f is decreasing as k increases toward 1, so its minimum on this branch is at k=-2 (closest to the vertex): f(-2)=4+4-6=2. The overall minimum is 2, attained at k=-2 (giving a double root r=s=-1, and indeed r^2+s^2=2).",
    hints: [
      "Express r^2+s^2 in terms of k using Vieta's formulas, then find the discriminant condition restricting k.",
      "The allowed k-values form two disjoint rays; minimize the resulting quadratic in k separately on each ray, paying attention to which endpoint is closest to the vertex.",
    ],
    difficulty: 9,
    topicSlug: "quadratics",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-46",
    question: "A regular octahedron has edge length 4. Find its volume.",
    format: "SHORT_ANSWER",
    answer: "64√2/3",
    solution:
      "Place the octahedron with vertices at (±a,0,0), (0,±a,0), (0,0,±a); its edge length is a√2. Setting a√2=4 gives a=4/√2=2√2, so a^2=8. The octahedron splits into two square pyramids joined at their base: the base is the square with vertices (±a,0,0),(0,±a,0), which has diagonal 2a, so side a√2=4 and area (a√2)^2=(2a)^2/2=2a^2=16; the apex height above the base plane is a. Volume of each pyramid: (1/3)·16·a = (1/3)·16·2√2 = 32√2/3. Doubling for both pyramids: 64√2/3.",
    hints: [
      "Split the regular octahedron into two square pyramids glued at a common square base.",
      "Find the base's side length and the pyramids' height in terms of the edge length, then use the pyramid volume formula and double it.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "hmmt",
  },

  // ============================ block 4 (difficulty 10) ============================
  {
    slug: "hmmt-47",
    question: "Find the smallest positive integer n such that 2^n ≡ 1 (mod 1001).",
    format: "SHORT_ANSWER",
    answer: "60",
    solution:
      "1001 = 7·11·13. Find the order of 2 modulo each prime factor. Mod 7: 2^3=8≡1, so the order is 3. Mod 11: 2^10≡1 by Fermat; checking divisors of 10, 2^5=32≡10≡-1 (mod 11), so the order is 10 (not 5, since 2^5≠1). Mod 13: 2^12≡1 by Fermat; checking divisors of 12, 2^6=64≡12≡-1 (mod 13), so the order is 12 (not 6). The order of 2 mod 1001 is the least common multiple of these three orders (by CRT, since 2^n≡1 mod 1001 iff it holds mod 7, 11, and 13 simultaneously): lcm(3,10,12) = 60.",
    hints: [
      "Factor 1001 = 7·11·13 and find the multiplicative order of 2 modulo each prime factor separately.",
      "The order mod 1001 is the least common multiple of the three individual orders, by the Chinese Remainder Theorem.",
    ],
    difficulty: 10,
    topicSlug: "modular-arithmetic",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-48",
    question:
      "Twelve chairs are arranged around a circle. Find the number of ways to choose 4 of the chairs so that no two chosen chairs are adjacent.",
    format: "SHORT_ANSWER",
    answer: "105",
    solution:
      "The number of ways to choose k non-adjacent positions from n arranged in a circle is (n/(n-k))·C(n-k,k). (Sketch: cut the circle by conditioning on whether a fixed chair is chosen. If it is not chosen, the remaining problem is choosing k non-adjacent positions from the remaining n-1 in a line, C(n-k-1,k) ways [after removing the chair, its two neighbors' adjacency is broken into a line]; if it is chosen, its two neighbors are forbidden, leaving a line of n-3 chairs to choose k-1 non-adjacent from, C(n-k-1,k-1) ways. Summing and simplifying these standard 'gap method' counts yields the closed form n/(n-k)·C(n-k,k).) With n=12, k=4: 12/8 · C(8,4) = (3/2)·70 = 105.",
    hints: [
      "This is the classic 'non-adjacent selections around a circle' problem — condition on whether a fixed chair is chosen or not to reduce it to a line case.",
      "The closed-form answer is (n/(n-k))·C(n-k,k); plug in n=12, k=4.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-49",
    question: "Let a_1 = 3 and a_{n+1} = a_n^2 - 2 for n ≥ 1. Find the remainder when a_5 is divided by 1000.",
    format: "SHORT_ANSWER",
    answer: "847",
    solution:
      "Since we only need a_5 mod 1000, compute mod 1000 at each step: a_1=3, a_2=3^2-2=7, a_3=7^2-2=47, a_4=47^2-2=2207≡207 (mod 1000), a_5=207^2-2=42849-2=42847≡847 (mod 1000).",
    hints: [
      "You don't need the actual (huge) value of a_5 — only its remainder mod 1000, so reduce mod 1000 after every squaring step.",
      "Compute a_2, a_3, a_4, a_5 mod 1000 in sequence.",
    ],
    difficulty: 10,
    topicSlug: "sequences",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-50",
    question:
      "In triangle ABC with AB = 13, AC = 15, BC = 14, the incircle touches BC at point D. Find AD.",
    format: "SHORT_ANSWER",
    answer: "√145",
    solution:
      "With s=(13+14+15)/2=21, the tangent lengths give BD=s-AC=21-15=6 and DC=s-AB=21-13=8 (check: 6+8=14 ✓). Apply Stewart's Theorem to cevian AD in triangle ABC with BD=m=6, DC=n=8, BC=a=14, AB=c=13, AC=b=15: c^2·n + b^2·m - AD^2·a = a·m·n, i.e. 169·8 + 225·6 - 14·AD^2 = 14·6·8. That's 1352+1350-14·AD^2=672, so 14·AD^2=2702-672=2030, AD^2=145, AD=√145.",
    hints: [
      "First find BD and DC using the standard tangent-length formulas for where the incircle touches a side (BD = s - AC, DC = s - AB).",
      "Then apply Stewart's Theorem to the cevian AD with the known BD, DC, and the triangle's three side lengths.",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-51",
    question:
      "Find the number of ordered pairs of positive integers (x, y) with x < y satisfying 1/x + 1/y = 1/60.",
    format: "SHORT_ANSWER",
    answer: "22",
    solution:
      "Multiplying through: 60y+60x=xy, so xy-60x-60y=0, i.e. (x-60)(y-60)=3600. Since x,y>0 and 1/x<1/60 is required for y to be positive and finite in a valid sense... more directly: for x<y both positive with the equation to hold we need x>60 (so that 1/x<1/60), meaning x-60 and y-60 are positive integers whose product is 3600=2^4·3^2·5^2, which has (4+1)(2+1)(2+1)=45 divisors. Since 3600=60^2 is a perfect square, one divisor equals 60 (giving x=y=120, excluded since we need x<y), and the remaining 44 divisors pair up as (d, 3600/d) with d<60 corresponding to x<y. So there are 44/2=22 valid pairs.",
    hints: [
      "Clear denominators and rearrange into the form (x-60)(y-60)=3600.",
      "Since 3600 is a perfect square, count its divisors and carefully handle the divisor equal to 60 (which would force x=y) before pairing up the rest for x<y.",
    ],
    difficulty: 10,
    topicSlug: "diophantine-equations",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-52",
    question:
      "A fair coin is flipped 10 times. Let H_k and T_k denote the number of heads and tails among the first k flips. Find the probability that H_k - T_k never reaches 3 for any k from 1 to 10.",
    format: "SHORT_ANSWER",
    answer: "21/32",
    solution:
      "Model each flip as a step of +1 (heads) or -1 (tails) on the integers, starting at 0; we want the probability that the walk stays below +3 for all of the first 10 steps. Let f(k, p) be the number of length-k walks from 0 to position p that never reach 3. Computing this via dynamic programming (only tracking positions below 3) for k=0,...,10 gives a total of 672 valid walks out of 2^10=1024 total walks. Simplifying, 672/1024 = 21/32.",
    hints: [
      "Translate the problem into a random walk on the integers with steps ±1, and track which walks stay strictly below the barrier at +3.",
      "Build up the count of valid walks step by step (dynamic programming on position), rather than trying a direct combinatorial formula.",
    ],
    difficulty: 10,
    topicSlug: "probability",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-53",
    question:
      "Let P(x) be a monic polynomial of degree 4 such that P(1)=1, P(2)=4, P(3)=9, and P(4)=16. Find P(5).",
    format: "SHORT_ANSWER",
    answer: "49",
    solution:
      "Let Q(x) = P(x) - x^2. Since P is monic of degree 4 and x^2 has lower degree, Q is also monic of degree 4. Also Q(1)=Q(2)=Q(3)=Q(4)=0, so Q has roots 1,2,3,4; since Q is monic of degree exactly 4 with these 4 roots, Q(x)=(x-1)(x-2)(x-3)(x-4). Then P(5)=Q(5)+5^2=(4)(3)(2)(1)+25=24+25=49.",
    hints: [
      "Consider Q(x) = P(x) - x^2, which is still monic of degree 4.",
      "Q vanishes at x=1,2,3,4, so it must equal (x-1)(x-2)(x-3)(x-4) exactly.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-54",
    question:
      "Let ABCD be a square, and let P be a point in the plane of the square (not necessarily inside it) with PA=2, PB=4, PD=5. Find PC.",
    format: "SHORT_ANSWER",
    answer: "√37",
    solution:
      "Place the square with A=(0,0), B=(s,0), C=(s,s), D=(0,s) for some side length s, and P=(x,y). Then PA^2+PC^2 = (x^2+y^2) + ((x-s)^2+(y-s)^2), while PB^2+PD^2 = ((x-s)^2+y^2)+(x^2+(y-s)^2). Expanding both shows they are equal (this is the British Flag Theorem, and it holds regardless of s or where P is). So PA^2+PC^2=PB^2+PD^2: 4+PC^2 = 16+25=41, giving PC^2=37, PC=√37.",
    hints: [
      "Set up coordinates for the square with A, B, C, D at the corners and P at an arbitrary point; expand PA^2+PC^2 and PB^2+PD^2 and compare.",
      "You'll find PA^2+PC^2=PB^2+PD^2 always (this holds for any point relative to a rectangle) — use it to solve for PC directly, without needing the square's side length.",
    ],
    difficulty: 10,
    topicSlug: "coordinate-geometry",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-55",
    question: "Find the number of ordered pairs of integers (a, b) with 1 ≤ a, b ≤ 50 such that a^2 + b^2 is divisible by 5.",
    format: "SHORT_ANSWER",
    answer: "900",
    solution:
      "Modulo 5, squares take values 0 (when a≡0), 1 (when a≡1 or 4), or 4 (when a≡2 or 3). Among 1,...,50, exactly 10 values fall in each residue class mod 5, so: 10 values of a give a^2≡0, 20 values give a^2≡1, 20 values give a^2≡4. We need a^2+b^2≡0 (mod 5): the pairs of residues (0,0), (1,4), (4,1) work (since 0+0=0, 1+4=5≡0, 4+1≡0), while (1,1)=2, (4,4)=8≡3, and any combination with only one term 0 (0+1=1, 0+4=4) fail. Counting: (0,0): 10·10=100; (1,4): 20·20=400; (4,1): 20·20=400. Total: 100+400+400=900.",
    hints: [
      "Work out which residues mod 5 are squares, and how many of the 50 values of a (or b) fall into each square-residue class.",
      "Then find which pairs of residue classes for a^2 and b^2 sum to 0 mod 5, and count accordingly.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "hmmt",
  },
  {
    slug: "hmmt-56",
    question: "Find the number of ordered triples (a, b, c) of positive integers with a+b+c=20 and a, b, c pairwise distinct.",
    format: "SHORT_ANSWER",
    answer: "144",
    solution:
      "The total number of ordered triples of positive integers summing to 20 is C(19,2)=171 (stars and bars). Now count triples with at least two equal. If a=b=t, then c=20-2t must be a positive integer, requiring 1≤t≤9 (t=9 gives c=2, t=10 would give c=0), so 9 triples with a=b; by the same argument there are 9 with b=c and 9 with a=c. No triple can satisfy two of these simultaneously without satisfying all three (a=b=c would need 3a=20, impossible), so by inclusion-exclusion there's no overlap to subtract, and the total with at least two equal is 9+9+9=27. Triples with all distinct: 171-27=144.",
    hints: [
      "First count all ordered positive-integer triples summing to 20 with stars and bars.",
      "Then subtract triples with at least two equal entries, using inclusion-exclusion (and note a=b=c is impossible here, simplifying the overlap term).",
    ],
    difficulty: 10,
    topicSlug: "casework",
    competitionSlug: "hmmt",
  },
];
