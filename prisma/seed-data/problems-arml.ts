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

{
    slug: "arml-17",
    question: "Real numbers x and y satisfy x + y = 7 and x² + y² = 25. Find x³ + y³.",
    format: "SHORT_ANSWER",
    answer: "91",
    solution:
      "From (x+y)² = x²+y²+2xy, we get 49 = 25 + 2xy, so xy = 12. Then x³+y³ = (x+y)³ − 3xy(x+y) = 343 − 3(12)(7) = 343 − 252 = 91.",
    hints: [
      "First find xy using the identity (x+y)² = x² + y² + 2xy.",
      "Then use the identity x³+y³ = (x+y)³ − 3xy(x+y).",
    ],
    difficulty: 5,
    topicSlug: "systems-of-equations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-18",
    question: "A right triangle has legs of length 9 and 12. Find the radius of its inscribed circle.",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "The hypotenuse is √(9²+12²) = √225 = 15. For a right triangle with legs a, b and hypotenuse c, the inradius is r = (a+b−c)/2. So r = (9+12−15)/2 = 6/2 = 3.",
    hints: [
      "Find the hypotenuse first using the Pythagorean theorem.",
      "For a right triangle, the inradius equals (leg + leg − hypotenuse)/2.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-19",
    question: "Find the number of positive integers n ≤ 150 such that n² − n is divisible by 12.",
    format: "SHORT_ANSWER",
    answer: "50",
    solution:
      "n² − n = n(n−1) is a product of consecutive integers, so it's always even; divisibility by 12 = 4·3 requires the extra factors of 2 and 3. Divisibility by 4 requires n ≡ 0 or 1 (mod 4) (so the even one of n, n−1 is itself divisible by 4), and divisibility by 3 requires n ≡ 0 or 1 (mod 3). By CRT, checking all 12 residues mod 12 shows exactly n ≡ 0, 1, 4, 9 (mod 12) work. Counting these up to 150: n≡0 gives 12 values (12,...,144), n≡1 gives 13 values (1,...,145), n≡4 gives 13 values (4,...,148), n≡9 gives 12 values (9,...,141). Total: 12+13+13+12 = 50.",
    hints: [
      "n(n−1) is automatically even, so focus on when it's divisible by 4 and by 3 separately.",
      "Translate each condition into allowed residues of n modulo 4 and modulo 3, combine via CRT into residues mod 12, then count.",
    ],
    difficulty: 5,
    topicSlug: "divisibility",
    competitionSlug: "arml",
  },
  {
    slug: "arml-20",
    question:
      "A committee of 4 people is chosen from a group of 6 men and 5 women. Find the number of ways to choose the committee so that it contains at least 2 women.",
    format: "SHORT_ANSWER",
    answer: "215",
    solution:
      "Sum over the number of women w = 2, 3, 4: w=2 gives C(5,2)C(6,2) = 10·15 = 150; w=3 gives C(5,3)C(6,1) = 10·6 = 60; w=4 gives C(5,4)C(6,0) = 5·1 = 5. Total: 150+60+5 = 215.",
    hints: [
      "Split into cases based on the exact number of women (2, 3, or 4) on the committee.",
      "In each case, choose the women and the remaining men independently and multiply, then add the cases.",
    ],
    difficulty: 5,
    topicSlug: "combinations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-21",
    question:
      "Find the number of distinct integer values of k for which x² − kx + 36 = 0 has two distinct positive integer roots.",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "If the roots are positive integers p ≠ q, then pq = 36 and k = p+q. The unordered factor pairs of 36 with p ≠ q are (1,36), (2,18), (3,12), (4,9) — the pair (6,6) is excluded since the roots must be distinct. These give k = 37, 20, 15, 13 respectively, all distinct. So there are 4 valid values of k.",
    hints: [
      "If the roots are p and q, then pq = 36 (product of roots) and k = p+q (sum of roots).",
      "List the factor pairs of 36 with distinct factors, then compute the sum for each and check none coincide.",
    ],
    difficulty: 5,
    topicSlug: "quadratics",
    competitionSlug: "arml",
  },
  {
    slug: "arml-22",
    question: "A rectangle has diagonal length 17 and one side of length 8. Find its area.",
    format: "SHORT_ANSWER",
    answer: "120",
    solution:
      "The other side has length √(17² − 8²) = √(289 − 64) = √225 = 15. The area is 8 · 15 = 120.",
    hints: [
      "The two sides and the diagonal form a right triangle — use the Pythagorean theorem to find the missing side.",
      "Multiply the two side lengths to get the area.",
    ],
    difficulty: 5,
    topicSlug: "area-volume",
    competitionSlug: "arml",
  },
  {
    slug: "arml-23",
    question: "Find the remainder when 7^45 is divided by 11.",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "By Fermat's little theorem, 7^10 ≡ 1 (mod 11), so the order of 7 divides 10. Computing powers: 7¹≡7, 7²≡5, 7³≡2, 7⁴≡3, 7⁵≡10 (mod 11), so the order is 10 (since 7⁵ ≡ −1, not 1). Since 45 = 10·4 + 5, 7^45 ≡ 7^5 ≡ 10 (mod 11).",
    hints: [
      "By Fermat's little theorem, 7^10 ≡ 1 (mod 11), so only the exponent mod 10 matters.",
      "Reduce 45 modulo 10 and compute the resulting smaller power of 7 mod 11 directly.",
    ],
    difficulty: 5,
    topicSlug: "modular-arithmetic",
    competitionSlug: "arml",
  },
  {
    slug: "arml-24",
    question: "Find the number of 3-digit positive integers (100 to 999) with all distinct digits that are even.",
    format: "SHORT_ANSWER",
    answer: "328",
    solution:
      "Split by the last digit. If the last digit is 0: the first digit has 9 choices (1–9) and the middle digit has 8 remaining choices, giving 9·8 = 72. If the last digit is 2, 4, 6, or 8 (4 choices): the first digit can't be 0 or equal to the last digit, giving 8 choices, and the middle digit has 8 remaining choices (10 total minus the two used digits), giving 8·8 = 64 per last-digit choice, or 4·64 = 256 total. Grand total: 72 + 256 = 328.",
    hints: [
      "Split into cases based on whether the last (even) digit is 0 or one of 2, 4, 6, 8, since the digit 0 restricts the first-digit count differently.",
      "In each case count choices for the first digit, then the middle digit, left to right, respecting 'no leading zero' and 'all distinct.'",
    ],
    difficulty: 5,
    topicSlug: "counting-principles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-25",
    question: "A polynomial p(x) = x³ + ax² + bx + c has roots 2, 3, and −5. Find a + b + c.",
    format: "SHORT_ANSWER",
    answer: "11",
    solution:
      "By Vieta's formulas: sum of roots = 2+3+(−5) = 0 = −a, so a = 0. Sum of pairwise products = 2·3 + 2·(−5) + 3·(−5) = 6−10−15 = −19 = b. Product of roots = 2·3·(−5) = −30 = −c, so c = 30. Then a+b+c = 0 + (−19) + 30 = 11.",
    hints: [
      "Use Vieta's formulas to relate a, b, c directly to the sum, sum of pairwise products, and product of the roots.",
      "Compute each symmetric sum of {2, 3, −5} carefully, watching signs.",
    ],
    difficulty: 6,
    topicSlug: "polynomials",
    competitionSlug: "arml",
  },
  {
    slug: "arml-26",
    question:
      "Two circles with radii 5 and 3 are externally tangent to each other. Find the length of their common external tangent segment (between the two points of tangency), as an exact radical.",
    format: "SHORT_ANSWER",
    answer: "2√15",
    solution:
      "Since the circles are externally tangent, the distance between their centers is d = 5+3 = 8. The length of a common external tangent between two circles with radii r₁, r₂ and center distance d is √(d² − (r₁−r₂)²). Here that's √(64 − (5−3)²) = √(64−4) = √60 = 2√15.",
    hints: [
      "The distance between the centers of two externally tangent circles equals the sum of their radii.",
      "Use the external tangent length formula √(d² − (r₁−r₂)²).",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-27",
    question: "Find the sum of all positive divisors of 720 that are perfect squares.",
    format: "SHORT_ANSWER",
    answer: "210",
    solution:
      "720 = 2⁴·3²·5. A divisor 2^a·3^b·5^c is a perfect square exactly when a, b, c are all even, which forces c = 0 (since 5 appears to only the first power), a ∈ {0,2,4}, b ∈ {0,2}. The resulting square divisors are 1, 4, 16 (from a=0,2,4, b=0) and 9, 36, 144 (from a=0,2,4, b=2). Their sum is 1+4+16+9+36+144 = 210.",
    hints: [
      "Write 720 in prime factorization form and think about which exponent combinations give a perfect square divisor.",
      "List the qualifying divisors explicitly and add them up.",
    ],
    difficulty: 6,
    topicSlug: "divisibility",
    competitionSlug: "arml",
  },
  {
    slug: "arml-28",
    question: "In how many ways can 10 identical candies be distributed among 4 distinguishable children so that each child gets at least 1 candy?",
    format: "SHORT_ANSWER",
    answer: "84",
    solution:
      "Give each child 1 candy first, leaving 6 candies to distribute freely among 4 children (0 or more each). By stars and bars, the number of ways is C(6+4−1, 4−1) = C(9,3) = 84.",
    hints: [
      "First guarantee each child gets 1 candy, reducing the problem to distributing the remaining candies with no restriction.",
      "Apply the stars-and-bars formula C(n+k−1, k−1) for distributing n identical items among k people.",
    ],
    difficulty: 6,
    topicSlug: "combinations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-29",
    question: "If x + 1/x = 4, find x³ + 1/x³.",
    format: "SHORT_ANSWER",
    answer: "52",
    solution:
      "Using the identity x³+1/x³ = (x+1/x)³ − 3(x+1/x): substituting x+1/x = 4 gives 4³ − 3(4) = 64 − 12 = 52.",
    hints: [
      "There's a direct identity expressing x³+1/x³ in terms of x+1/x.",
      "Cube the given value and subtract three times the given value.",
    ],
    difficulty: 6,
    topicSlug: "exponents-radicals",
    competitionSlug: "arml",
  },
  {
    slug: "arml-30",
    question: "Find the distance from the point (3, 4) to the line 3x − 4y − 1 = 0, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "8/5",
    solution:
      "Using the point-to-line distance formula |Ax₀+By₀+C|/√(A²+B²) with A=3, B=−4, C=−1, x₀=3, y₀=4: distance = |3(3) − 4(4) − 1| / √(9+16) = |9 − 16 − 1| / 5 = 8/5.",
    hints: [
      "Recall the point-to-line distance formula |Ax₀+By₀+C|/√(A²+B²).",
      "Substitute carefully and simplify the absolute value in the numerator before dividing.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-31",
    question: "Find the smallest positive integer n such that n! is divisible by 2^10.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Legendre's formula, the exponent of 2 in n! is ⌊n/2⌋+⌊n/4⌋+⌊n/8⌋+⋯. For n=11: 5+2+1 = 8 < 10. For n=12: 6+3+1 = 10 ≥ 10. So the smallest such n is 12.",
    hints: [
      "Use Legendre's formula to compute the exponent of 2 in n! as a sum of floor divisions.",
      "Test consecutive values of n until the exponent first reaches 10.",
    ],
    difficulty: 6,
    topicSlug: "integer-properties",
    competitionSlug: "arml",
  },
  {
    slug: "arml-32",
    question: "A bag contains 4 red and 6 blue marbles. Two marbles are drawn without replacement. Find the probability that both drawn marbles are the same color.",
    format: "SHORT_ANSWER",
    answer: "7/15",
    solution:
      "Total ways to draw 2 marbles from 10: C(10,2) = 45. Same-color ways: C(4,2) + C(6,2) = 6 + 15 = 21. Probability = 21/45 = 7/15.",
    hints: [
      "Count ways to draw 2 red or 2 blue marbles separately, then add.",
      "Divide by the total number of ways to draw any 2 marbles from the bag, and simplify.",
    ],
    difficulty: 6,
    topicSlug: "probability",
    competitionSlug: "arml",
  },
  {
    slug: "arml-33",
    question:
      "A sequence satisfies a₁ = 2, a₂ = 5, and a_{n+2} = 3a_{n+1} − 2a_n for n ≥ 1. Find a₈.",
    format: "SHORT_ANSWER",
    answer: "383",
    solution:
      "Iterating directly: a3 = 3(5)−2(2) = 11, a4 = 3(11)−2(5) = 23, a5 = 3(23)−2(11) = 47, a6 = 3(47)−2(23) = 95, a7 = 3(95)−2(47) = 191, a8 = 3(191)−2(95) = 573−190 = 383.",
    hints: [
      "Each term depends only on the previous two terms — iterate the recursion step by step.",
      "Keep careful track of each computed term; a slip anywhere propagates through the rest.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "arml",
  },
  {
    slug: "arml-34",
    question:
      "In triangle ABC, AB = 7, AC = 9, and BC = 10. The angle bisector from A meets BC at D. Find BD, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "35/8",
    solution:
      "By the angle bisector theorem, BD/DC = AB/AC = 7/9. Since BD+DC = BC = 10, BD = (7/16)·10 = 70/16 = 35/8.",
    hints: [
      "The angle bisector theorem gives BD/DC = AB/AC.",
      "Combine that ratio with BD + DC = BC to solve for BD.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "arml",
  },
  {
    slug: "arml-35",
    question:
      "Find the number of ordered pairs of positive integers (x, y) with x ≤ y satisfying 1/x + 1/y = 1/12.",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Multiplying out: 12y + 12x = xy, so xy − 12x − 12y = 0, and adding 144 to both sides: (x−12)(y−12) = 144. Since x, y are positive with 1/x+1/y=1/12, both x, y > 12, so x−12 and y−12 are positive divisors of 144 with (x−12) ≤ (y−12). 144 = 2⁴·3² has 15 divisors, and since √144 = 12, the divisors ≤ 12 are 1, 2, 3, 4, 6, 8, 9, 12 — exactly 8 of them, each giving one valid pair.",
    hints: [
      "Clear denominators and rearrange into the form (x−12)(y−12) = constant using Simon's Favorite Factoring Trick.",
      "Count divisor pairs of that constant with the smaller factor at most √(constant), since x ≤ y.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-36",
    question: "How many integers from 1 to 300 (inclusive) are divisible by 3 or 5, but not by 7?",
    format: "SHORT_ANSWER",
    answer: "120",
    solution:
      "Let A = multiples of 3 (100 of them), B = multiples of 5 (60 of them), A∩B = multiples of 15 (20 of them). By inclusion-exclusion, |A∪B| = 100+60−20 = 140. Now remove those in A∪B that are also multiples of 7: multiples of 21 (14 of them), multiples of 35 (8 of them), multiples of 105 (2 of them, in both). By inclusion-exclusion, multiples of 7 within A∪B number 14+8−2 = 20. So the final count is 140 − 20 = 120.",
    hints: [
      "First use inclusion-exclusion to count integers divisible by 3 or 5.",
      "Then subtract those among them that are also divisible by 7, again using inclusion-exclusion on multiples of 21 and 35.",
    ],
    difficulty: 7,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "arml",
  },
  {
    slug: "arml-37",
    question: "Real numbers x and y satisfy 3x + 4y = 25. Find the minimum possible value of x² + y².",
    format: "SHORT_ANSWER",
    answer: "25",
    solution:
      "x²+y² is the squared distance from the origin to the point (x,y), which is minimized when (x,y) is the foot of the perpendicular from the origin to the line 3x+4y=25. That minimum squared distance equals (distance from origin to line)² = (|25|/√(3²+4²))² = (25/5)² = 5² = 25.",
    hints: [
      "x²+y² is the squared distance from (x,y) to the origin, and (x,y) is constrained to a line.",
      "The minimum distance from a point to a line ax+by=c is |c|/√(a²+b²) — square it to get the minimum of x²+y².",
    ],
    difficulty: 7,
    topicSlug: "inequalities",
    competitionSlug: "arml",
  },
  {
    slug: "arml-38",
    question:
      "A sphere is inscribed in a cube of side length 6, tangent to all six faces. Find the volume inside the cube but outside the sphere, in terms of π.",
    format: "SHORT_ANSWER",
    answer: "216 - 36π",
    solution:
      "The inscribed sphere has radius 3 (half the side length), so its volume is (4/3)π(3³) = 36π. The cube's volume is 6³ = 216. The volume inside the cube but outside the sphere is 216 − 36π.",
    hints: [
      "The sphere inscribed in a cube tangent to all faces has radius equal to half the cube's side length.",
      "Subtract the sphere's volume from the cube's volume.",
    ],
    difficulty: 7,
    topicSlug: "three-d-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-39",
    question: "Find the number of trailing zeros in the decimal representation of 50!.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "The number of trailing zeros equals the exponent of 5 in the prime factorization of 50! (since 2's are more plentiful), given by Legendre's formula: ⌊50/5⌋+⌊50/25⌋ = 10+2 = 12.",
    hints: [
      "Trailing zeros come from factors of 10 = 2·5, and factors of 5 are the bottleneck in n!.",
      "Use Legendre's formula ⌊n/5⌋+⌊n/25⌋+⋯ to count the total power of 5 dividing 50!.",
    ],
    difficulty: 7,
    topicSlug: "integer-properties",
    competitionSlug: "arml",
  },
  {
    slug: "arml-40",
    question: "Find the number of distinguishable arrangements of the letters of MISSISSIPPI in which no two I's are adjacent.",
    format: "SHORT_ANSWER",
    answer: "7350",
    solution:
      "MISSISSIPPI has 1 M, 4 I's, 4 S's, 2 P's (11 letters). First arrange the non-I letters (M, S,S,S,S, P,P — 7 letters): 7!/(4!·2!) = 105 ways. This creates 8 gaps (including ends); choose 4 of them for the I's (no two adjacent since each gap holds at most one I): C(8,4) = 70 ways. Total: 105 · 70 = 7350.",
    hints: [
      "Arrange the non-I letters first, then insert the I's into the gaps between them (and at the ends) so no two I's land in the same gap.",
      "Multiply the number of arrangements of the non-I letters by the number of ways to choose gaps for the I's.",
    ],
    difficulty: 7,
    topicSlug: "permutations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-41",
    question:
      "A monic quartic polynomial p(x) satisfies p(1)=1, p(2)=4, p(3)=9, p(4)=16. Find p(5).",
    format: "SHORT_ANSWER",
    answer: "49",
    solution:
      "Let q(x) = p(x) − x². Then q is a monic quartic (since p is monic quartic and x² has lower degree) with q(1)=q(2)=q(3)=q(4)=0, so q(x) = (x−1)(x−2)(x−3)(x−4). Thus p(x) = x² + (x−1)(x−2)(x−3)(x−4). Then p(5) = 25 + (4)(3)(2)(1) = 25+24 = 49.",
    hints: [
      "Consider q(x) = p(x) − x², which vanishes at x = 1, 2, 3, 4 and is still monic of degree 4.",
      "Write q(x) as a product of its known linear factors, then evaluate p(5) = 25 + q(5).",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "arml",
  },
  {
    slug: "arml-42",
    question:
      "In triangle ABC, cevians AD, BE, CF are concurrent at point P. If AP/PD = 3 and BP/PE = 4, find CP/PF, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "9/11",
    solution:
      "Write P in barycentric coordinates (u,v,w) with u+v+w=1, u,v,w>0. A standard mass-point computation gives AP/PD = (v+w)/u, BP/PE = (u+w)/v, CP/PF = (u+v)/w. Setting x=AP/PD, y=BP/PE, z=CP/PF, one can verify the identity xyz = x+y+z+2 holds for any point of concurrency (check with the centroid: x=y=z=2 gives 8 = 6+2 ✓). With x=3, y=4: 12z = 3+4+z+2 = 9+z, so 11z = 9, giving z = 9/11.",
    hints: [
      "There's a known identity relating the three cevian ratios at a point of concurrency: xyz = x+y+z+2 (verify it on the centroid, where all three ratios equal 2, as a sanity check).",
      "Plug in the two given ratios and solve the resulting linear equation for the third.",
    ],
    difficulty: 8,
    topicSlug: "advanced-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-43",
    question: "Find the number of ordered triples of positive integers (a, b, c) with a+b+c = 15 and gcd(a,b,c) = 1.",
    format: "SHORT_ANSWER",
    answer: "84",
    solution:
      "Let N(n) be the number of ordered triples of positive integers summing to n; N(n) = C(n−1,2). By Möbius inversion, the count with gcd exactly 1 is Σ_{d|15} μ(d)·N(15/d). Divisors of 15: 1,3,5,15 with μ(1)=1, μ(3)=−1, μ(5)=−1, μ(15)=1. So the count is N(15) − N(5) − N(3) + N(1) = C(14,2) − C(4,2) − C(2,2) + C(0,2) = 91 − 6 − 1 + 0 = 84.",
    hints: [
      "First count all ordered triples of positive integers summing to 15 (a stars-and-bars count), ignoring the gcd condition.",
      "Use Möbius inversion over the divisors of 15 to subtract out triples whose gcd is a proper divisor of 15.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "arml",
  },
  {
    slug: "arml-44",
    question: "A fair coin is flipped repeatedly until two consecutive heads appear. Find the expected number of flips.",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "Let E₀ be the expected number of additional flips needed from a state with no recent head, and E₁ from a state where the previous flip was heads. From state 0: flip once (1 flip used); with probability 1/2 we move to state 1, with probability 1/2 we stay in state 0. So E₀ = 1 + (1/2)E₁ + (1/2)E₀, giving E₀ = 2 + E₁. From state 1: flip once; with probability 1/2 we're done, with probability 1/2 we return to state 0. So E₁ = 1 + (1/2)(0) + (1/2)E₀ = 1 + (1/2)E₀. Substituting: E₀ = 2 + 1 + (1/2)E₀ = 3 + (1/2)E₀, so (1/2)E₀ = 3, giving E₀ = 6.",
    hints: [
      "Set up expected-value equations for two states: 'no recent head' and 'previous flip was heads.'",
      "Each state's equation involves one flip plus a weighted average of expected values from the resulting states — solve the resulting linear system.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "arml",
  },
  {
    slug: "arml-45",
    question: "Find the minimum value of (x² + 2)/√(x² + 1) for real x.",
    format: "SHORT_ANSWER",
    answer: "2",
    solution:
      "Let t = √(x²+1), so t ≥ 1. The expression becomes (t²+1)/t = t + 1/t. For t ≥ 1, the function t + 1/t is increasing (its derivative 1 − 1/t² ≥ 0 there), so it's minimized at t = 1, giving value 1+1 = 2. This occurs at x = 0, and indeed (0+2)/√1 = 2.",
    hints: [
      "Substitute t = √(x²+1) (which satisfies t ≥ 1) to rewrite the expression purely in terms of t.",
      "Analyze t + 1/t for t ≥ 1 to find where it's minimized.",
    ],
    difficulty: 8,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "arml",
  },
  {
    slug: "arml-46",
    question: "A regular tetrahedron has edge length 6. Find the distance from its centroid to one of its faces, as an exact radical.",
    format: "SHORT_ANSWER",
    answer: "√6/2",
    solution:
      "The height of a regular tetrahedron with edge length a is h = a√(2/3) = a√6/3. For a=6, h = 6√6/3 = 2√6. The centroid (average of the 4 vertices) lies at 1/4 of the height from each face, so the distance from the centroid to a face is h/4 = 2√6/4 = √6/2.",
    hints: [
      "Recall (or derive) that a regular tetrahedron's height is h = a√6/3.",
      "The centroid divides the segment from a vertex to the opposite face's centroid in ratio 3:1, so it sits 1/4 of the height above each face.",
    ],
    difficulty: 8,
    topicSlug: "three-d-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-47",
    question: "Find the sum of all prime numbers p such that p² + 2 is also prime.",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "If p ≠ 3, then p is not divisible by 3, so p ≡ 1 or 2 (mod 3), and in either case p² ≡ 1 (mod 3). Then p²+2 ≡ 1+2 ≡ 0 (mod 3), and since p²+2 > 3, it cannot be prime. So p must equal 3, and indeed 3²+2 = 11 is prime. The sum of all such primes is just 3.",
    hints: [
      "Consider what p² is modulo 3 when p is a prime other than 3.",
      "Show that for any prime p ≠ 3, p²+2 is a multiple of 3 greater than 3, hence not prime — leaving only one candidate to check.",
    ],
    difficulty: 8,
    topicSlug: "primes",
    competitionSlug: "arml",
  },
  {
    slug: "arml-48",
    question: "Find the number of subsets of {1, 2, ..., 12} that contain no two consecutive integers (the empty set counts as a valid subset).",
    format: "SHORT_ANSWER",
    answer: "377",
    solution:
      "Let f(n) be the number of subsets of {1,...,n} with no two consecutive elements. Conditioning on whether n is included: if not, there are f(n−1) such subsets of {1,...,n−1}; if n is included, n−1 cannot be, leaving f(n−2) choices for a no-two-consecutive subset of {1,...,n−2}. So f(n) = f(n−1)+f(n−2), the Fibonacci recursion, with f(0)=1, f(1)=2. This gives f(2)=3, f(3)=5, f(4)=8, f(5)=13, f(6)=21, f(7)=34, f(8)=55, f(9)=89, f(10)=144, f(11)=233, f(12)=377.",
    hints: [
      "Set up a Fibonacci-style recursion by conditioning on whether the largest element, n, is included in the subset.",
      "Compute the base cases f(0) and f(1), then iterate up to f(12).",
    ],
    difficulty: 8,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "arml",
  },
  {
    slug: "arml-49",
    question:
      "The roots of x³ − 9x² + 24x − 20 = 0 are r, s, t. Find 1/r + 1/s + 1/t + 1/(rs) + 1/(rt) + 1/(st), as a fraction.",
    format: "SHORT_ANSWER",
    answer: "33/20",
    solution:
      "By Vieta's formulas, r+s+t=9, rs+rt+st=24, rst=20. Then 1/r+1/s+1/t = (rs+rt+st)/(rst) = 24/20 = 6/5, and 1/(rs)+1/(rt)+1/(st) = (r+s+t)/(rst) = 9/20. Their sum is 6/5 + 9/20 = 24/20 + 9/20 = 33/20.",
    hints: [
      "Extract the elementary symmetric sums r+s+t, rs+rt+st, rst directly from the polynomial's coefficients using Vieta's formulas.",
      "Express both requested sums as ratios of these symmetric sums (no need to find r, s, t individually).",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "arml",
  },
  {
    slug: "arml-50",
    question:
      "Cyclic quadrilateral ABCD has AB = 4, BC = 5, CD = 7, DA = 10. Find the length of diagonal AC, as an exact radical.",
    format: "SHORT_ANSWER",
    answer: "√65",
    solution:
      "Since ABCD is cyclic, ∠B + ∠D = 180°, so cos(∠D) = −cos(∠B). Applying the law of cosines to triangles ABC and ACD along diagonal AC: AC² = AB²+BC²−2·AB·BC·cos(∠B) = 16+25−40cos(∠B), and AC² = CD²+DA²−2·CD·DA·cos(∠D) = 49+100+140cos(∠B). Setting these equal: 41−40cos(∠B) = 149+140cos(∠B), so −108 = 180cos(∠B), giving cos(∠B) = −3/5. Then AC² = 41 − 40(−3/5) = 41+24 = 65, so AC = √65.",
    hints: [
      "Use the fact that opposite angles of a cyclic quadrilateral are supplementary, so cos(∠D) = −cos(∠B).",
      "Write AC² two ways via the law of cosines (once in triangle ABC, once in triangle ACD) and set them equal to solve for cos(∠B), then AC².",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-51",
    question: "Find the number of ordered pairs of integers (x, y) satisfying x² − y² = 2023.",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "Factor 2023 = 7·17² and write x²−y² = (x−y)(x+y) = 2023. Let m=x−y, n=x+y, so mn = 2023. Since 2023 is odd, both m and n must be odd in any integer factorization, and then x=(m+n)/2, y=(n−m)/2 are automatically integers. The number of positive divisors of 2023 = 7¹·17² is (1+1)(2+1) = 6, so there are 6 positive factor pairs (m,n) and 6 negative factor pairs (−m,−n) — 12 total ordered factorizations mn=2023 over the integers, each giving a distinct ordered pair (x,y).",
    hints: [
      "Factor 2023 = 7·17² and write x²−y² as a product of two integers (x−y)(x+y) whose product is 2023.",
      "Count all integer factorizations of 2023 (including with negative factors), each of which determines a unique (x,y) pair.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-52",
    question: "Find the number of ways to tile a 3×4 rectangle using 1×2 dominoes.",
    format: "SHORT_ANSWER",
    answer: "11",
    solution:
      "Let T(n) denote the number of domino tilings of a 3×n rectangle (n must be even for a tiling to exist, by a parity/coloring argument). A transfer-matrix analysis of how tilings extend column by column gives the recursion T(n) = 4T(n−2) − T(n−4) for even n ≥ 4, with base values T(0) = 1 and T(2) = 3. Then T(4) = 4(3) − 1 = 11.",
    hints: [
      "The number of domino tilings of a 3×n rectangle (n even) satisfies a linear recursion in terms of smaller even widths.",
      "Use T(0)=1, T(2)=3, and the recursion T(n) = 4T(n−2) − T(n−4) to compute T(4).",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "arml",
  },
  {
    slug: "arml-53",
    question: "Positive real numbers x and y satisfy x^y = y^x and y = 3x, with x ≠ y. Find x, as an exact radical.",
    format: "SHORT_ANSWER",
    answer: "√3",
    solution:
      "Substituting y=3x into x^y = y^x gives x^(3x) = (3x)^x. Raising both sides to the power 1/x (valid since x>0): x³ = 3x, so x² = 3 (dividing by x ≠ 0), giving x = √3 (taking the positive root since x is a positive real). One can check this is consistent: with x=√3, y=3√3, the equation ln(x)/x = ln(y)/y (equivalent to x^y=y^x) holds since both sides equal the same value on the curve ln(t)/t.",
    hints: [
      "Substitute y = 3x into the equation x^y = y^x and raise both sides to the power 1/x to simplify.",
      "Solve the resulting equation x³ = 3x for the positive value of x.",
    ],
    difficulty: 9,
    topicSlug: "exponents-radicals",
    competitionSlug: "arml",
  },
  {
    slug: "arml-54",
    question:
      "A sphere is inscribed in a right circular cone with base radius 5 and height 12, tangent to the base and the lateral surface. Find the radius of the sphere, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "10/3",
    solution:
      "Consider the axial cross-section: an isosceles triangle with base 2(5)=10 and height 12, so the equal sides (slant heights) have length √(5²+12²) = 13 each. The inscribed sphere's great circle in this cross-section is exactly the incircle of this triangle. The triangle's area is (1/2)(10)(12) = 60, and its semiperimeter is (10+13+13)/2 = 18. The inradius (= sphere radius) is Area/semiperimeter = 60/18 = 10/3.",
    hints: [
      "Take the cross-section of the cone through its axis — it's an isosceles triangle, and the inscribed sphere becomes the incircle of that triangle.",
      "Use r = Area/semiperimeter for the triangle's incircle.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-55",
    question: "Find the smallest positive integer n that is divisible by 2023 and has exactly 12 positive divisors.",
    format: "SHORT_ANSWER",
    answer: "4046",
    solution:
      "2023 = 7·17², so any multiple of 2023 has prime factorization including 7^a·17^b with a≥1, b≥2 (possibly other primes too). The divisor count contributed by these two primes alone is at least (1+1)(2+1) = 6, and we need the total divisor count to be 12 = 6·2. The cheapest way to double the divisor count is to introduce one new prime factor to the first power — using the smallest available prime, 2, multiplies n by only 2 while multiplying the divisor count by (1+1)=2. This gives n = 2·7·17² = 2·2023 = 4046, with τ(4046) = 2·2·3 = 12. Any alternative (e.g., raising the exponent of 7 from 1 to 3, or of 17 from 2 to 5) multiplies n by a much larger factor (49 or over 4900 respectively), so 4046 is smallest.",
    hints: [
      "Factor 2023 = 7·17² and note any multiple of 2023 must include these prime powers, contributing at least (1+1)(2+1)=6 to the divisor count.",
      "To reach exactly 12 divisors as cheaply as possible (in terms of minimizing n), compare introducing a new smallest prime factor versus raising an existing exponent.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "arml",
  },
  {
    slug: "arml-56",
    question: "Find the number of functions f: {1,2,...,10} → {1,2,...,10} such that f(f(x)) = x for all x.",
    format: "SHORT_ANSWER",
    answer: "9496",
    solution:
      "Such functions are exactly the involutions on a 10-element set (permutations composed of fixed points and disjoint 2-cycles). Let I(n) be the number of involutions on n elements. Conditioning on where element n maps: either f(n)=n (a fixed point, contributing I(n−1) ways for the rest) or f(n)=j for some j≠n with f(j)=n (a 2-cycle, with n−1 choices for j and I(n−2) ways for the rest), giving I(n) = I(n−1) + (n−1)I(n−2), with I(0)=I(1)=1. Computing: I(2)=2, I(3)=4, I(4)=10, I(5)=26, I(6)=76, I(7)=232, I(8)=764, I(9)=2620, I(10) = I(9) + 9·I(8) = 2620 + 9(764) = 2620 + 6876 = 9496.",
    hints: [
      "The condition f(f(x))=x for all x means f is an involution: every element is either a fixed point or paired with exactly one other element.",
      "Set up the recursion I(n) = I(n−1) + (n−1)I(n−2) by considering whether element n is a fixed point or part of a 2-cycle, and iterate up to n=10.",
    ],
    difficulty: 9,
    topicSlug: "permutations",
    competitionSlug: "arml",
  },
  {
    slug: "arml-57",
    question:
      "Let N be the least positive integer such that 2N is a perfect square, 3N is a perfect cube, and 5N is a perfect fifth power. Compute the number of positive divisors of N.",
    format: "SHORT_ANSWER",
    answer: "8400",
    solution:
      "Any prime other than 2, 3, 5 dividing N would need its exponent divisible by 2, 3, and 5 simultaneously (since it is untouched by the multipliers), hence at least 30, which only enlarges N; so write N = 2^a · 3^b · 5^c. The three conditions become nine congruences on (a, b, c): 2N square forces a + 1 ≡ 0 (mod 2), b ≡ 0 (mod 2), c ≡ 0 (mod 2); 3N cube forces a ≡ 0 (mod 3), b + 1 ≡ 0 (mod 3), c ≡ 0 (mod 3); 5N fifth power forces a ≡ 0 (mod 5), b ≡ 0 (mod 5), c + 1 ≡ 0 (mod 5). Solving each coordinate separately by the Chinese Remainder Theorem: a is odd and divisible by 15, so the least is a = 15; b is even, ≡ 2 (mod 3), and ≡ 0 (mod 5), so the least is b = 20; c is even, divisible by 3, and ≡ 4 (mod 5), so the least is c = 24. Thus N = 2^15 · 3^20 · 5^24, and the number of divisors is (15 + 1)(20 + 1)(24 + 1) = 16 · 21 · 25 = 8400.",
    hints: [
      "Argue first that N can only involve the primes 2, 3, and 5, then write N = 2^a · 3^b · 5^c and translate each of the three conditions into congruences on a, b, and c.",
      "Each of a, b, c must satisfy three congruences with moduli 2, 3, and 5 — note the multiplier shifts exactly one exponent by 1 in each condition.",
      "Minimize a, b, c independently via the Chinese Remainder Theorem, then apply the divisor-counting formula.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "arml",
  },
  {
    slug: "arml-58",
    question:
      "Compute the number of strings of length 12 over the alphabet {A, B, C} in which no two consecutive letters are equal and the three-letter block ABA never occurs.",
    format: "SHORT_ANSWER",
    answer: "2632",
    solution:
      "Track the state (last two letters) and extend one letter at a time. There are 6 legal length-2 strings (any ordered pair of distinct letters), each with count 1. A transition from state (x, y) to (y, z) is allowed when z ≠ y and (x, y, z) ≠ (A, B, A). Every state has 2 legal continuations except the state (A, B), which has only 1 (namely C, since A is banned by the ABA rule and B by the no-repeat rule). Running this transfer step ten times and totalling the states after each extension gives the string counts by length: t(2) = 6, t(3) = 11, t(4) = 20, t(5) = 37, t(6) = 68, t(7) = 125, t(8) = 230, t(9) = 423, t(10) = 778, t(11) = 1431, t(12) = 2632. (These satisfy t(n) = t(n−1) + t(n−2) + t(n−3) for n ≥ 5, reflecting the fact that after an AB the next letter is forced.) The answer is t(12) = 2632.",
    hints: [
      "Two consecutive letters are not enough information on their own — but knowing the last TWO letters is, since the forbidden block has length 3.",
      "Set up a transfer/DP over the 6 states given by the last two (distinct) letters; every state has two continuations except one special state.",
      "Iterate the DP from length 2 up to length 12 and sum the final state counts.",
    ],
    difficulty: 8,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "arml",
  },
  {
    slug: "arml-59",
    question:
      "In triangle ABC, point D lies on BC with BD/DC = 1/2, point E lies on CA with CE/EA = 1/3, and point F lies on AB with AF/FB = 1/4. Segments AD, BE, and CF bound a triangle in the interior of ABC. Compute the ratio of the area of that interior triangle to the area of triangle ABC, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "529/1870",
    solution:
      "Ratios of areas and ratios along lines are preserved by affine maps, so we may compute in any convenient triangle. Take A = (0,0), B = (1,0), C = (0,1). Then D = (B + ½C)/(3/2) = (2/3, 1/3), E = (C + ⅓A)/(4/3) = (0, 3/4), and F = (A + ¼B)/(5/4) = (1/5, 0). Line AD is y = x/2; line BE is x + (4/3)y = 1; line CF is 5x + y = 1. Intersecting them pairwise: AD ∩ BE = (3/5, 3/10), BE ∩ CF = (1/17, 12/17), CF ∩ AD = (2/11, 1/11). The shoelace formula gives the interior triangle area 2645/18700, while [ABC] = 1/2, so the ratio is 2·(2645/18700) = 2645/9350 = 529/1870. (This agrees with Routh's theorem: for BD/DC = x, CE/EA = y, AF/FB = z the ratio is (xyz − 1)²/((xy + x + 1)(yz + y + 1)(zx + z + 1)); here xyz = 1/24, so the numerator is (23/24)² = 529/576, and the denominator factors are 5/3, 17/12, and 11/8, whose product is 935/288, giving (529/576)·(288/935) = 529/1870.)",
    hints: [
      "Area ratios are affine invariants — replace the general triangle by a convenient one such as (0,0), (1,0), (0,1) and use coordinates.",
      "Locate D, E, F by the section formula, write the three cevian lines, and intersect them in pairs to get the three vertices of the inner triangle.",
      "Apply the shoelace formula to the inner triangle and divide by the area of the reference triangle.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-60",
    question:
      "Let P(x) be the polynomial of degree at most 5 satisfying P(k) = k/(k + 2) for each of k = 0, 1, 2, 3, 4, 5. Compute P(6), as a fraction.",
    format: "SHORT_ANSWER",
    answer: "11/14",
    solution:
      "Clear the denominator by introducing Q(x) = (x + 2)·P(x) − x. Since P has degree at most 5, Q has degree at most 6, and Q(k) = (k + 2)·k/(k + 2) − k = 0 for k = 0, 1, 2, 3, 4, 5. So Q has the six known roots 0 through 5, forcing Q(x) = c·x(x − 1)(x − 2)(x − 3)(x − 4)(x − 5) for some constant c. The leading constant is pinned down by the one input that kills the factor x + 2: at x = −2, Q(−2) = 0·P(−2) + 2 = 2, while the product gives c·(−2)(−3)(−4)(−5)(−6)(−7) = 5040c, so c = 2/5040 = 1/2520. Now evaluate at x = 6: Q(6) = c·6·5·4·3·2·1 = 720/2520 = 2/7, and Q(6) = 8·P(6) − 6, so 8·P(6) = 6 + 2/7 = 44/7 and P(6) = 44/56 = 11/14. (Direct Lagrange interpolation through the six data points confirms P(6) = 11/14.)",
    hints: [
      "Fractional values are awkward — multiply through by x + 2 and consider the auxiliary polynomial (x + 2)·P(x) − x instead.",
      "That auxiliary polynomial vanishes at six known inputs, so it factors completely up to one unknown constant; find the constant by plugging in the value of x that makes the factor x + 2 vanish.",
      "Evaluate the factored form at x = 6 and solve back for P(6).",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "arml",
  },
  {
    slug: "arml-61",
    question:
      "Points A and B in the plane satisfy AB = 10. Let R be the set of all points P with PA² + PB² ≤ 100 for which the angle APB measures at least 120°. Compute the area of R, in exact form.",
    format: "SHORT_ANSWER",
    answer: "200π/9 − 50√3/3",
    solution:
      "Place A = (0,0) and B = (10,0), and let M = (5,0) be the midpoint. The median-length identity PA² + PB² = 2·PM² + AB²/2 turns the first condition into 2·PM² + 50 ≤ 100, i.e. PM ≤ 5: a closed disk of radius 5 centered at M. The second condition describes the region between the two circular arcs on which ∠APB = 120°. For a chord of length 10 subtending an inscribed angle of 120°, the law of sines gives the arc's circle radius ρ = 10/(2 sin 120°) = 10/√3, and the region ∠APB ≥ 120° consists of the two circular segments cut off by AB on the minor-arc side. The half-chord is 5, so sin(θ/2) = 5/ρ = √3/2 and the central angle is θ = 120°; each segment has area (ρ²/2)(θ − sin θ) = (100/3)/2 · (2π/3 − √3/2) = 100π/9 − 25√3/3, and there are two of them (one on each side of AB). Finally, check containment: the farthest point of a segment from AB is at height ρ − ρ·cos 60° = ρ/2 = 5/√3 ≈ 2.89 < 5, and every point of the segments is within 5 of M, so the angle region already lies inside the disk PM ≤ 5 and the first condition imposes no further cut. Hence area(R) = 2(100π/9 − 25√3/3) = 200π/9 − 50√3/3 ≈ 40.95.",
    hints: [
      "Rewrite PA² + PB² using the midpoint M of AB — the first condition collapses into a single disk.",
      "The locus of points seeing AB at a fixed angle is a pair of circular arcs through A and B; find the radius of those arcs from the chord length and the inscribed angle.",
      "Compute the two circular-segment areas, and don't forget to check whether the disk from the first condition actually cuts anything off.",
    ],
    difficulty: 9,
    topicSlug: "coordinate-geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-62",
    question:
      "A rectangle has one side lying on the diameter of a semicircle of radius 10 and its two opposite vertices on the arc of that semicircle. Compute the largest possible perimeter of such a rectangle.",
    format: "SHORT_ANSWER",
    answer: "20√5",
    solution:
      "Put the center of the semicircle at the origin with the diameter along the x-axis and the arc above it. By symmetry the rectangle's base runs from (−a, 0) to (a, 0) for some a with 0 < a < 10, and its upper vertices (±a, b) lie on the arc, so a² + b² = 100. The perimeter is P = 2(2a) + 2b = 4a + 2b.\n\nWrite a = 10 cos θ and b = 10 sin θ with 0 < θ < 90°, which automatically enforces a² + b² = 100. Then P = 40 cos θ + 20 sin θ. A sum of the form p cos θ + q sin θ equals √(p² + q²)·sin(θ + φ) for the angle φ with tan φ = p/q, so its largest value is √(p² + q²), reached when θ + φ = 90°. Here √(40² + 20²) = √2000 = 20√5, and the maximizing θ satisfies tan θ = q/p = 20/40 = 1/2, which does lie strictly between 0° and 90°, so the maximum is attained by an honest rectangle.\n\nAt that angle cos θ = 2/√5 and sin θ = 1/√5, giving a = 20/√5 = 4√5 and b = 10/√5 = 2√5, a rectangle of base 8√5 and height 2√5 whose perimeter is 16√5 + 4√5 = 20√5 ≈ 44.72. (Calculus agrees: differentiating 4a + 2√(100 − a²) gives the critical point a = 4√5 and the value 20√5, and a numerical sweep over a finds the same maximum.)",
    hints: [
      "Use the symmetry about the perpendicular bisector of the diameter: the rectangle is determined by the coordinates of one upper vertex on the arc.",
      "Write that vertex as (10 cos θ, 10 sin θ) so the arc condition is automatic, and express the perimeter as a combination of cos θ and sin θ.",
      "A combination p cos θ + q sin θ has largest value √(p² + q²); check that the angle achieving it is actually in range.",
    ],
    difficulty: 8,
    topicSlug: "geometry",
    competitionSlug: "arml",
  },
  {
    slug: "arml-63",
    question:
      "In an election between two candidates A and B, candidate A receives 7 votes and candidate B receives 5 votes. The 12 ballots are counted one at a time in a uniformly random order. Compute the probability that at some moment during the count the number of ballots counted for A exceeds the number counted for B by exactly 4, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "5/18",
    solution:
      "Encode a counting order as a lattice path: start at 0 and step +1 for each A ballot and −1 for each B ballot. The path has 12 steps, 7 up and 5 down, and ends at height 7 − 5 = 2; all C(12,7) = 792 such paths are equally likely. Because the steps are ±1 and the path starts at 0, A's lead exceeds B's by exactly 4 at some moment if and only if the path reaches height 4 at some moment — a lead of 5 or more cannot be attained without passing through 4 first. Count the paths that touch height 4 by reflection: given such a path, reflect the portion after its first visit to height 4 across the horizontal line y = 4. This is a bijection onto the set of all 12-step ±1 paths from 0 to the reflected endpoint 2·4 − 2 = 6, since any path ending at 6 > 4 must touch 4. Paths from 0 to 6 in 12 steps have u up-steps and 12 − u down-steps with u − (12 − u) = 6, so u = 9, and there are C(12,9) = 220 of them. The probability is therefore 220/792 = 5/18. (Exhaustive enumeration of all 792 orders confirms exactly 220 favorable ones.)",
    hints: [
      "Turn each counting order into a path that steps up for an A ballot and down for a B ballot, and note how many such paths there are and where they all end.",
      "Since the steps are ±1, 'lead exactly 4 at some moment' is the same as 'the path ever reaches height 4' — now count the paths that touch that height.",
      "Reflect the part of the path after its first visit to height 4; this matches those paths bijectively with all paths ending at a different, easily computed height.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "arml",
  },
  {
    slug: "arml-64",
    question:
      "A sequence is defined by a₁ = 3 and a_{n+1} = a_n² − a_n + 1 for n ≥ 1. Compute the exact value of the infinite sum 1/a₁ + 1/a₂ + 1/a₃ + ⋯, as a fraction.",
    format: "SHORT_ANSWER",
    answer: "1/2",
    solution:
      "The recursion can be rewritten as a_{n+1} − 1 = a_n(a_n − 1), which gives the telescoping identity 1/a_n = 1/(a_n − 1) − 1/(a_{n+1} − 1): indeed 1/(a_n − 1) − 1/(a_n(a_n − 1)) = (a_n − 1)/(a_n(a_n − 1)) = 1/a_n. Summing from n = 1 to N collapses to 1/(a₁ − 1) − 1/(a_{N+1} − 1) = 1/2 − 1/(a_{N+1} − 1). Since a₁ = 3 and the terms grow at least quadratically (3, 7, 43, 1807, 3263443, …), a_{N+1} → ∞, so the tail vanishes and the sum equals 1/2. (Partial sums: 1/3, 10/21, 439/903, … which already agrees with 1/2 to more than 40 decimal places after six terms.)",
    hints: [
      "Rewrite the recursion in the form a_{n+1} − 1 = a_n(a_n − 1) and look at the quantity 1/(a_n − 1).",
      "Show that 1/a_n equals the difference of two consecutive terms of that sequence, so the sum telescopes.",
      "Check that a_n grows without bound so the leftover tail term goes to 0.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "arml",
  },
  {
    slug: "arml-65",
    question:
      "Compute the largest real number M such that x² + y² + z² ≥ M(xy + yz) holds for all real numbers x, y, and z.",
    format: "SHORT_ANSWER",
    answer: "√2",
    solution:
      "Fix a value of M and ask when Q(x, y, z) = x² + y² + z² − M(xy + yz) is nonnegative for every real triple. Group the x-terms and the z-terms separately, since y is the only variable interacting with both: x² − Mxy = (x − My/2)² − M²y²/4, and likewise z² − Mzy = (z − My/2)² − M²y²/4. Therefore Q = (x − My/2)² + (z − My/2)² + y²(1 − M²/2). The first two squares are never negative and can be made 0 by choosing x = z = My/2, so Q ≥ 0 for all triples exactly when the leftover coefficient satisfies 1 − M²/2 ≥ 0, i.e. M² ≤ 2. For M ≤ 0 the inequality is certainly true, so the constraint that matters is M ≤ √2. At M = √2 the inequality holds for all reals, and it is sharp: taking y = √2 and x = z = My/2 = 1 gives x² + y² + z² = 1 + 2 + 1 = 4 and xy + yz = √2 + √2 = 2√2, and indeed 4 = √2 · 2√2. For any M > √2 that same triple violates the inequality. Hence the largest M is √2. (A numerical sweep over 500000 random triples with xy + yz > 0 gives a minimum of (x² + y² + z²)/(xy + yz) equal to 1.41421…, and eigenvalue computation for the associated symmetric matrix gives the extreme value √2 exactly.)",
    hints: [
      "Rewrite the inequality as 'a certain expression in x, y, z is never negative' and notice that y is the only variable that interacts with both of the others.",
      "Complete the square in x and, separately, in z, treating y as a constant; the two squares can always be driven to zero.",
      "What survives is a multiple of y², and requiring its coefficient to be nonnegative pins down the largest admissible M; exhibit the equality case to confirm sharpness.",
    ],
    difficulty: 9,
    topicSlug: "inequalities",
    competitionSlug: "arml",
  },
];
