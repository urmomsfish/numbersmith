import type { ProblemSeed } from "./problems";

/**
 * Hand-written ARML-styled problems (difficulty 5-9).
 *
 * ARML (American Regions Mathematics League) is a team-oriented high school
 * competition mixing advanced algebra, geometry, number theory, combinatorics,
 * and probability, typically with clean numeric, fractional, or short
 * algebraic answers. These are original problems, not transcribed from any
 * real ARML contest, written to give the "Start Simulation" feature genuine
 * competition-tagged content instead of falling back to generic filler.
 *
 * Every answer below was independently derived and checked (by hand and by
 * brute-force computation) before being written into the `solution` field.
 */
export const ARML_PROBLEMS: ProblemSeed[] = [
  {
    slug: "arml-01",
    question: "Find the sum of all real numbers x satisfying x² − 7x + 12 = |x − 3|.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Note x² − 7x + 12 = (x − 3)(x − 4). Case x ≥ 3: |x − 3| = x − 3, so (x − 3)(x − 4) = x − 3, giving (x − 3)(x − 5) = 0, so x = 3 or x = 5 (both satisfy x ≥ 3). Case x < 3: |x − 3| = 3 − x, so (x − 3)(x − 4) = 3 − x = −(x − 3), giving (x − 3)² = 0, so x = 3, which does not satisfy x < 3 and is already counted. The full solution set is {3, 5}, with sum 3 + 5 = 8.",
    hints: [
      "Split into cases based on the sign of x − 3, since the left side factors as (x − 3)(x − 4).",
      "In each case you get a quadratic (or a perfect square) in x — solve it and check the case restriction holds.",
    ],
    difficulty: 5,
    topicSlug: "quadratics",
    competitionSlug: "arml",
  },
  {
    slug: "arml-02",
    question: "Find the number of positive integers n ≤ 100 for which n² + n is divisible by 6.",
    format: "SHORT_ANSWER",
    answer: "66",
    solution:
      "n² + n = n(n + 1) is always even, so divisibility by 6 depends only on divisibility by 3, which requires n ≡ 0 or n ≡ 2 (mod 3). Among 1 through 100 there are 33 multiples of 3 (3, 6, …, 99) and 33 integers congruent to 2 mod 3 (2, 5, …, 98). These sets are disjoint, giving 33 + 33 = 66.",
    hints: [
      "n(n+1) is automatically divisible by 2, so only the divisibility by 3 condition matters.",
      "Check which residues of n modulo 3 make n(n+1) ≡ 0 (mod 3), then count how many integers from 1 to 100 fall in those residue classes.",
    ],
    difficulty: 5,
    topicSlug: "divisibility",
    competitionSlug: "arml",
  },
  {
    slug: "arml-03",
    question: "In triangle ABC, AB = 13, BC = 14, and CA = 15. Find the length of the altitude from A to BC.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Heron's formula with s = (13+14+15)/2 = 21, the area is √(21·8·7·6) = √7056 = 84. Since area = (1/2)·BC·h, we get 84 = (1/2)(14)h, so h = 168/14 = 12.",
    hints: [
      "Use Heron's formula to find the area of the 13-14-15 triangle first.",
      "The altitude to BC satisfies area = (1/2)·BC·(altitude).",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-04",
    question:
      "A four-digit palindrome has the form ABBA, where A and B are digits and A ≠ 0. How many such palindromes are divisible by 3?",
    format: "SHORT_ANSWER",
    answer: "30",
    solution:
      "ABBA = 1000A + 100B + 10B + A = 1001A + 110B, whose digit sum is 2A + 2B. Divisibility by 3 requires 2(A+B) ≡ 0 (mod 3), i.e. A + B ≡ 0 (mod 3) since 2 is invertible mod 3. For each A from 1 to 9, exactly one third of the ten values of B (0–9) — either 3 or 4 of them depending on A mod 3 — satisfy this; summing over all A gives exactly 30 valid pairs (A,B), confirmed by direct enumeration.",
    hints: [
      "Write ABBA algebraically and reduce the divisibility-by-3 condition to a statement about A + B mod 3.",
      "For each choice of A (1–9), count how many of the ten digits B (0–9) make A + B a multiple of 3.",
    ],
    difficulty: 6,
    topicSlug: "counting-principles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-05",
    question:
      "Real numbers x, y, z satisfy x + y + z = 6, xy + yz + zx = 11, and xyz = 6. Find x² + y² + z².",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "x, y, z are the roots of t³ − 6t² + 11t − 6 = 0, which factors as (t−1)(t−2)(t−3) = 0, so {x,y,z} = {1,2,3} in some order. Alternatively, without finding the roots: x² + y² + z² = (x+y+z)² − 2(xy+yz+zx) = 36 − 22 = 14.",
    hints: [
      "You don't need to solve for x, y, z individually — use the identity (x+y+z)² = x²+y²+z² + 2(xy+yz+zx).",
      "Plug the two given sums directly into that identity.",
    ],
    difficulty: 6,
    topicSlug: "systems-of-equations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-06",
    question: "Find the remainder when 3^100 is divided by 13.",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "3¹ ≡ 3, 3² ≡ 9, 3³ ≡ 27 ≡ 1 (mod 13), so 3 has order 3 modulo 13. Since 100 = 3·33 + 1, 3^100 ≡ 3^1 ≡ 3 (mod 13).",
    hints: [
      "Compute successive powers of 3 mod 13 until they cycle back to 1.",
      "Once you know the order of 3 mod 13, reduce the exponent 100 modulo that order.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "arml",
  },
  {
    slug: "arml-07",
    question:
      "Chords AB and CD of a circle intersect at point P inside the circle. AP = 5, BP = 12, CP = x, and DP = x + 7. Find x.",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "By the intersecting chords theorem, AP·BP = CP·DP, so 5·12 = x(x+7), i.e. x² + 7x − 60 = 0. The discriminant is 49 + 240 = 289 = 17², so x = (−7+17)/2 = 5 (the negative root is rejected since x is a length).",
    hints: [
      "Recall the intersecting chords theorem: AP·BP = CP·DP.",
      "Set up and solve the resulting quadratic in x, discarding any negative root.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-08",
    question: "A fair six-sided die is rolled three times. Find the probability that the sum of the three rolls is exactly 10.",
    format: "SHORT_ANSWER",
    answer: "1/8",
    solution:
      "There are 6³ = 216 equally likely outcomes. Counting ordered triples (a,b,c) with each in {1,...,6} and a+b+c=10 gives 27 outcomes. The probability is 27/216 = 1/8.",
    hints: [
      "Count ordered triples (a,b,c) with 1 ≤ a,b,c ≤ 6 and a+b+c = 10, either by casework on the smallest value or careful enumeration.",
      "Divide the count of favorable outcomes by the total 6³ = 216 outcomes and simplify.",
    ],
    difficulty: 6,
    topicSlug: "basic-probability",
    competitionSlug: "arml",
  },
  {
    slug: "arml-09",
    question: "A sequence satisfies a₁ = 3 and a_{n+1} = 2a_n − n for all n ≥ 1. Find a₁₀.",
    format: "SHORT_ANSWER",
    answer: "523",
    solution:
      "Computing directly: a1=3, a2=2(3)-1=5, a3=2(5)-2=8, a4=2(8)-3=13, a5=2(13)-4=22, a6=2(22)-5=39, a7=2(39)-6=72, a8=2(72)-7=137, a9=2(137)-8=266, a10=2(266)-9=523.",
    hints: [
      "The recursion only requires knowing the previous term and the current index n — just iterate it out carefully.",
      "Track each term as you go; a small arithmetic slip anywhere compounds through all ten steps.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "arml",
  },
  {
    slug: "arml-10",
    question:
      "A circle is tangent to both coordinate axes and lies in the first quadrant. It passes through the point (4,2). Find the sum of all possible radii of such a circle.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "A circle tangent to both axes in the first quadrant has center (r,r) for radius r. Passing through (4,2) gives (4−r)² + (2−r)² = r². Expanding: 16 − 8r + r² + 4 − 4r + r² = r², so r² − 12r + 20 = 0. The discriminant is 144 − 80 = 64, so r = (12 ± 8)/2, giving r = 10 or r = 2. By Vieta's formulas (or direct addition), the sum of the two radii is 12.",
    hints: [
      "A circle tangent to both positive axes has center (r, r) and radius r — use this to set up an equation in r.",
      "Substitute the point (4,2) into the circle's equation and solve the resulting quadratic in r; both roots are valid radii.",
    ],
    difficulty: 7,
    topicSlug: "coordinate-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-11",
    question:
      "Find the number of distinguishable arrangements of the letters in AABBCC such that no two adjacent letters are the same.",
    format: "SHORT_ANSWER",
    answer: "30",
    solution:
      "The total number of distinguishable arrangements is 6!/(2!2!2!) = 90. Use inclusion-exclusion on the 'bad' events A = 'the two A's are adjacent', B = 'the two B's are adjacent', C = 'the two C's are adjacent'. Gluing a pair into one block: |A| = |B| = |C| = 5!/(2!2!) = 30 (arranging one AA-block with B,B,C,C). For two glued pairs, e.g. |A∩B| = 4!/2! = 12 (arranging AA, BB, C, C); similarly |A∩C| = |B∩C| = 12. Gluing all three pairs: |A∩B∩C| = 3! = 6. So |A∪B∪C| = 3(30) − 3(12) + 6 = 90 − 36 + 6 = 60, and the number of arrangements with no two adjacent letters equal is 90 − 60 = 30.",
    hints: [
      "The total number of distinguishable arrangements of AABBCC (ignoring the restriction) is 6!/(2!·2!·2!) = 90.",
      "Inclusion-exclusion on 'the two A's are together', 'the two B's are together', 'the two C's are together' will get you to the answer, but the arithmetic is easy to mess up — double-check with careful casework.",
    ],
    difficulty: 7,
    topicSlug: "casework",
    competitionSlug: "arml",
  },
  {
    slug: "arml-12",
    question: "Find the number of ordered pairs of positive integers (x,y) satisfying 3x + 5y = 100.",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "From 3x + 5y = 100, solving for x gives x = (100 − 5y)/3, which requires 100 − 5y ≡ 0 (mod 3), i.e. y ≡ 2 (mod 3) (since 100 ≡ 1 and 5 ≡ 2 mod 3, need 2y ≡ 1 mod 3, so y ≡ 2 mod 3). With y positive and x = (100−5y)/3 positive, y must satisfy 0 < y < 20. The valid values are y = 2, 5, 8, 11, 14, 17 — six values, each giving a positive integer x (namely x = 30, 25, 20, 15, 10, 5).",
    hints: [
      "Solve for x in terms of y and figure out which residue of y mod 3 makes x an integer.",
      "Combine the mod-3 condition with the requirement that both x and y stay positive to bound and count the valid y values.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-13",
    question: "Let f(x) = x/(x+1). Find f(f(f(⋯f(1)⋯))), where f is applied 100 times, expressed as a fraction.",
    format: "SHORT_ANSWER",
    answer: "1/101",
    solution:
      "Claim: the n-th iterate satisfies f^(n)(x) = x/(1+nx). This holds for n=1. If f^(n)(x) = x/(1+nx), then f^(n+1)(x) = f(x/(1+nx)) = [x/(1+nx)] / [1 + x/(1+nx)] = x/(1+nx+x) = x/(1+(n+1)x), completing the induction. With x=1 and n=100, f^(100)(1) = 1/(1+100) = 1/101.",
    hints: [
      "Compute the first few iterates f(1), f(f(1)), f(f(f(1))) and look for a pattern in terms of the number of applications.",
      "Once you spot the pattern f^(n)(x) = x/(1+nx), verify it by induction and plug in n=100, x=1.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "arml",
  },
  {
    slug: "arml-14",
    question:
      "In triangle ABC, points D and E lie on AB and AC respectively so that DE ∥ BC. If AD = 4, DB = 6, and the area of triangle ADE is 8, find the area of trapezoid DBCE.",
    format: "SHORT_ANSWER",
    answer: "42",
    solution:
      "Since DE ∥ BC, triangle ADE is similar to triangle ABC with ratio AD/AB = 4/10 = 2/5. Areas of similar triangles scale with the square of the ratio, so [ABC] = [ADE]/(2/5)² = 8/(4/25) = 50. The trapezoid DBCE is the region of ABC outside ADE, so its area is 50 − 8 = 42.",
    hints: [
      "Triangle ADE is similar to triangle ABC — find the similarity ratio using AD and AB = AD + DB.",
      "Use the fact that areas of similar triangles scale as the square of the side ratio to find [ABC], then subtract [ADE].",
    ],
    difficulty: 8,
    topicSlug: "similarity-congruence",
    competitionSlug: "arml",
  },
  {
    slug: "arml-15",
    question: "Find the number of ways to tile a 2×12 rectangle using 1×2 dominoes.",
    format: "SHORT_ANSWER",
    answer: "233",
    solution:
      "Let T(n) be the number of domino tilings of a 2×n rectangle. Conditioning on the leftmost column: either it's covered by one vertical domino (leaving a 2×(n−1) rectangle), or by two horizontal dominoes stacked (leaving a 2×(n−2) rectangle), giving T(n) = T(n−1) + T(n−2), with T(1)=1 and T(2)=2. This is the Fibonacci recursion, so T(3)=3, T(4)=5, T(5)=8, T(6)=13, T(7)=21, T(8)=34, T(9)=55, T(10)=89, T(11)=144, T(12)=233.",
    hints: [
      "Set up a recursion T(n) = T(n−1) + T(n−2) by considering how the leftmost column of the 2×n rectangle can be covered.",
      "Compute the base cases T(1) and T(2), then iterate the recursion up to n = 12.",
    ],
    difficulty: 8,
    topicSlug: "recursion-in-counting",
    competitionSlug: "arml",
  },
  {
    slug: "arml-16",
    question: "Let N be the number of digits in the decimal representation of 2^2025. Find the remainder when N is divided by 100.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "The number of digits of a positive integer m is ⌊log₁₀ m⌋ + 1. Here log₁₀(2^2025) = 2025·log₁₀2 ≈ 2025 × 0.3010299957 ≈ 609.586, so N = ⌊609.586⌋ + 1 = 610. Then 610 mod 100 = 10.",
    hints: [
      "The digit count of a positive integer m equals ⌊log₁₀ m⌋ + 1 — apply this with m = 2^2025.",
      "Use log₁₀2 ≈ 0.30103 to estimate 2025·log₁₀2 precisely enough to pin down the floor, then reduce mod 100.",
    ],
    difficulty: 9,
    topicSlug: "number-patterns",
    competitionSlug: "arml",
  },
];
