import type { ProblemSeed } from "./problems";

/**
 * Hand-written difficulty 7-10 problems for the five most advanced
 * competitions in the app: USAMTS, USAMO, IMO, IMO Shortlist, and EGMO.
 *
 * These competitions are proof-based in real life; every problem below is an
 * ORIGINAL question (not a reskin of any real USAMTS/USAMO/IMO/IMO-Shortlist/
 * EGMO problem) that has been rephrased into a single well-defined,
 * auto-gradable question with one exact final answer, while still drawing on
 * genuine olympiad-level ideas (deep number theory, functional equations,
 * invariants, extremal combinatorics, inequalities, advanced geometry).
 *
 * Every answer here was independently re-derived and cross-checked with
 * exact/brute-force computation before being written down.
 */
export const OLYMPIAD_TIER_PROBLEMS: ProblemSeed[] = [
  // ================================ USAMTS ================================
  {
    slug: "usamts-01",
    question: "What is the remainder when 1! + 2! + 3! + ... + 100! is divided by 15?",
    format: "INTEGER",
    answer: "3",
    solution:
      "For n ≥ 5, n! contains both a factor of 3 and a factor of 5 (from 3! and 5! respectively), so n! is divisible by 15 for every n ≥ 5. Hence the sum modulo 15 is determined entirely by 1! + 2! + 3! + 4! = 1 + 2 + 6 + 24 = 33 ≡ 3 (mod 15).",
    hints: [
      "Once n is large enough, n! is automatically divisible by 15 — find the threshold.",
      "Only the first few factorials actually matter modulo 15; add just those.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-02",
    question: "In how many ways can a 3 × 4 rectangle be tiled by 1 × 2 dominoes?",
    format: "INTEGER",
    answer: "11",
    solution:
      "Scan the rectangle column by column, tracking which cells of the current column are already covered by a domino protruding from the previous column (a bitmask of the 3 rows). At each column, every uncovered cell must be filled by either a horizontal domino (reaching into the next column) or a vertical domino (paired with an adjacent uncovered cell in the same column). Carrying out this transfer-matrix recursion across all 4 columns, starting and ending with an empty mask, yields exactly 11 valid tilings.",
    hints: [
      "Process the grid column by column, tracking which cells are already filled by dominoes sticking out from the previous column.",
      "At each column a small case analysis (which cells still need covering) gives a recursion; carrying it through all 4 columns gives the count.",
    ],
    difficulty: 7,
    topicSlug: "combinatorics",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-03",
    question:
      "What is the smallest positive integer n such that n ≡ 3 (mod 11), n ≡ 5 (mod 13), and n ≡ 7 (mod 17)?",
    format: "INTEGER",
    answer: "993",
    solution:
      "By the Chinese Remainder Theorem, since 11, 13, 17 are pairwise coprime, there is a unique solution modulo 11·13·17 = 2431. Solving the three congruences step by step (first combining n ≡ 3 (mod 11) and n ≡ 5 (mod 13) into n ≡ 70 (mod 143), then combining with n ≡ 7 (mod 17)) gives n ≡ 993 (mod 2431), so the smallest positive value is 993. Checking: 993 = 11·90 + 3, 993 = 13·76 + 5, 993 = 17·58 + 7.",
    hints: [
      "Combine the congruences two at a time using the Chinese Remainder Theorem.",
      "First find all n satisfying the first two congruences (they repeat every 143), then intersect with the third.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-04",
    question:
      "A sequence satisfies a1 = 1, a2 = 1, and a(n) = a(n-1) + 2a(n-2) for n ≥ 3. What is a20?",
    format: "INTEGER",
    answer: "349525",
    solution:
      "The characteristic equation of the recurrence is x² = x + 2, which factors as (x-2)(x+1) = 0, giving roots 2 and -1. So a(n) = A·2^n + B·(-1)^n for constants A, B determined by a1 = 1, a2 = 1: solving 2A - B = 1 and 4A + B = 1 gives A = 1/3, B = -1/3, so a(n) = (2^n - (-1)^n)/3. Then a20 = (2^20 - 1)/3 = (1048576 - 1)/3 = 349525.",
    hints: [
      "This is a linear recurrence — find its characteristic equation and roots.",
      "The closed form is a(n) = (2^n − (−1)^n)/3; plug in n = 20.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-05",
    question:
      "The numbers 1, 2, 3, ..., 9 are written on a board. Repeatedly, two numbers a and b are erased and replaced by a + b + ab, until a single number remains. What is that final number?",
    format: "INTEGER",
    answer: "3628799",
    solution:
      "Define g(x) = x + 1. Then g(a + b + ab) = a + b + ab + 1 = (a+1)(b+1) = g(a)g(b), so the operation exactly multiplies g-values together, regardless of the order in which pairs are combined. Hence the final value v satisfies g(v) = g(1)g(2)···g(9) = 2·3·4···10 = 10! = 3628800. So v = 3628800 - 1 = 3628799.",
    hints: [
      "Try substituting g(x) = x + 1 into the combining rule and see what identity appears.",
      "The substitution turns the operation into ordinary multiplication of (x+1)-values, which is order-independent.",
    ],
    difficulty: 8,
    topicSlug: "invariants",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-06",
    question: "How many ordered pairs of positive integers (x, y) satisfy 1/x + 1/y = 1/12?",
    format: "INTEGER",
    answer: "15",
    solution:
      "Multiplying through by 12xy gives 12y + 12x = xy, so xy - 12x - 12y = 0, hence (x - 12)(y - 12) = 144. Since x, y are positive integers with 1/x < 1/12, both x and y must exceed 12, so x - 12 and y - 12 are positive divisors of 144 = 2^4·3^2, which has (4+1)(2+1) = 15 positive divisors. Each divisor d of 144 gives a unique pair (x,y) = (12+d, 12+144/d), so there are 15 ordered pairs.",
    hints: [
      "Clear denominators and factor — the equation becomes (x−12)(y−12) = 144.",
      "Count the positive divisors of 144; each one determines a valid pair.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-07",
    question:
      "How many distinct labeled simple graphs on 6 vertices (labeled 1 through 6) have every vertex of degree exactly 3?",
    format: "INTEGER",
    answer: "70",
    solution:
      "There are C(15,9) = 5005 ways to choose 9 edges from the 15 possible edges of K6 (since the total degree must be 6·3 = 18 = 2·9). Checking each 9-edge subset for whether every vertex has degree exactly 3 (equivalently, whether the 6 unused edges form a graph where every vertex has degree exactly 2, i.e. a disjoint union of cycles covering all 6 vertices) and counting shows exactly 70 of them are 3-regular. This matches the known enumeration of labeled cubic graphs on 6 vertices.",
    hints: [
      "The complement of a 3-regular graph on 6 vertices is 2-regular — a disjoint union of cycles covering all vertices.",
      "Count the ways to partition 6 labeled vertices into cycles (a single 6-cycle, or a 3-cycle plus a 3-cycle) and translate back to the original graph.",
    ],
    difficulty: 8,
    topicSlug: "graph-theory",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-08",
    question:
      "What is the smallest n such that any n integers must contain two whose difference is divisible by 2024?",
    format: "INTEGER",
    answer: "2025",
    solution:
      "Sort integers into 2024 classes by their residue modulo 2024. Two integers have a difference divisible by 2024 exactly when they lie in the same class. With 2024 numbers it is possible to pick one from each residue class and avoid any such pair (e.g. 0, 1, 2, ..., 2023). But with 2025 numbers, the pigeonhole principle forces two into the same class, guaranteeing a difference divisible by 2024. So the smallest such n is 2025.",
    hints: [
      "Group integers by their residue modulo 2024 — there are 2024 residue classes.",
      "Find the largest set that uses at most one integer per class, then add one.",
    ],
    difficulty: 8,
    topicSlug: "pigeonhole",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-09",
    question:
      "The polynomial P(x) = x³ - 7x² + kx - 8 has three positive integer roots (counted with multiplicity). What is k?",
    format: "INTEGER",
    answer: "14",
    solution:
      "By Vieta's formulas, the roots multiply to 8 and sum to 7. Checking factorizations of 8 into three positive integers: {1,1,8} sums to 10, {2,2,2} sums to 6, and {1,2,4} sums to 7 — a match, and it is the only one. So the roots are 1, 2, 4, and k equals the sum of pairwise products: 1·2 + 1·4 + 2·4 = 2 + 4 + 8 = 14.",
    hints: [
      "Vieta's formulas relate the roots to the sum 7 and product 8 directly.",
      "List the ways to write 8 as a product of three positive integers and check which triple sums to 7.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-10",
    question:
      "In triangle ABC, AB = 9, BC = 17, and CA = 10. The incircle touches side AB at point Z. What is AZ?",
    format: "INTEGER",
    answer: "1",
    solution:
      "The tangent lengths from each vertex to the incircle satisfy AZ = AY = s - BC, where s is the semiperimeter and Y is the touch point on CA. Here s = (9+17+10)/2 = 18, so AZ = 18 - 17 = 1. (Check: BZ = s - CA = 8, and AZ + BZ = 1 + 8 = 9 = AB, as required.)",
    hints: [
      "Tangent segments from a vertex to the incircle are equal, and each equals the semiperimeter minus the opposite side.",
      "Compute the semiperimeter first, then subtract BC from it.",
    ],
    difficulty: 8,
    topicSlug: "geometry",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-11",
    question: "The number 1009 is prime. What is the multiplicative order of 3 modulo 1009?",
    format: "INTEGER",
    answer: "168",
    solution:
      "By Fermat's little theorem, the order of 3 divides 1008 = 2^4·3^2·7. Checking 3^d mod 1009 for each divisor d of 1008 (working up through the divisor lattice, ruling out proper divisors of candidate orders) shows that 3^168 ≡ 1 (mod 1009) while 3^d ≢ 1 for every proper divisor d of 168, so the order of 3 modulo 1009 is exactly 168.",
    hints: [
      "The order of 3 must divide 1008 = φ(1009) = 2^4·3^2·7 — narrow down the divisors.",
      "Test 3 raised to each maximal proper divisor of 1008 (1008/2, 1008/3, 1008/7) to rule out order 1008 itself, then work down.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-12",
    question:
      "How many distinct arrangements of the letters in AAABBCC (3 A's, 2 B's, 2 C's) have no two identical letters adjacent?",
    format: "INTEGER",
    answer: "38",
    solution:
      "There are 7!/(3!2!2!) = 210 distinct arrangements in total. Using inclusion-exclusion on the 'bad' events of some identical pair being adjacent (treating adjacent identical letters as merged blocks and carefully accounting for overlaps within the 3 A's), the count of arrangements with no two identical letters adjacent works out to 38. This can be confirmed by direct enumeration of all 210 arrangements and checking each for adjacent repeats.",
    hints: [
      "Start from the 210 total arrangements and remove those with at least one adjacent repeated letter using inclusion-exclusion.",
      "Be careful with the three A's: 'no two A's adjacent' is not the same condition as 'no two identical letters (of any kind) adjacent' applied independently to each letter.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-13",
    question:
      "A function f satisfies f(m+n) + f(m-n) = 2f(m) + 2f(n) for all integers m, n, and f(1) = 3. What is f(10)?",
    format: "INTEGER",
    answer: "300",
    solution:
      "Setting m = n = 0 gives 2f(0) = 4f(0), so f(0) = 0. Setting m = n gives f(2n) = 4f(n). Setting n = 1 gives the recurrence f(n+1) = 2f(n) + 2f(1) - f(n-1) = 2f(n) + 6 - f(n-1). Starting from f(0) = 0, f(1) = 3, this recurrence forces f(n) = 3n² for all n (which can be verified to satisfy the original equation for all m, n, not just consecutive ones). So f(10) = 3·100 = 300.",
    hints: [
      "Plug in m = n = 0 first to pin down f(0), then use m = n and n = 1 substitutions to build a recurrence.",
      "The recurrence generates the quadratic sequence f(n) = 3n² — verify it against the original equation.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-14",
    question:
      "Positive real numbers x, y, z satisfy xyz = 1. What is the minimum possible value of x² + y² + z² + xy + yz + zx?",
    format: "INTEGER",
    answer: "6",
    solution:
      "By the standard inequality x² + y² + z² ≥ xy + yz + zx, the expression is at least 2(xy + yz + zx). By AM-GM, xy + yz + zx ≥ 3·(xy·yz·zx)^(1/3) = 3·(xyz)^(2/3) = 3. So the expression is at least 2·3 = 6, with equality exactly when x = y = z (from the first inequality) and xy = yz = zx (from AM-GM), both satisfied at x = y = z = 1 (consistent with xyz = 1). Hence the minimum is 6.",
    hints: [
      "Split the expression into (x²+y²+z²) + (xy+yz+zx) and bound each piece.",
      "The first piece is at least the second by a standard inequality, and the second is bounded below by AM-GM using xyz = 1.",
    ],
    difficulty: 9,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-15",
    question:
      "In triangle ABC, AB = 9, BC = 10, and CA = 11. The angle bisector from A meets BC at D. What is BD? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "9/2",
    solution:
      "By the angle bisector theorem, BD/DC = AB/AC = 9/11. Since BD + DC = BC = 10, we get BD = 10 · 9/(9+11) = 90/20 = 9/2.",
    hints: [
      "The angle bisector theorem relates BD/DC to the two adjacent sides AB and AC.",
      "Use BD + DC = 10 together with the ratio to solve for BD.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-16",
    question: "How many ordered pairs of integers (x, y) satisfy x² - y² = 2023?",
    format: "INTEGER",
    answer: "12",
    solution:
      "Factor as (x-y)(x+y) = 2023 = 7 · 17². Since 2023 is odd, every factorization into two integers d1·d2 = 2023 has d1 and d2 both odd, hence both x = (d1+d2)/2 and y = (d2-d1)/2 are integers automatically. The number of divisors of 2023 is (1+1)(2+1) = 6, and each of the 6 positive divisors together with its negative counterpart gives a valid choice of d1 (with d2 = 2023/d1 determined), for 12 total ordered pairs (x,y).",
    hints: [
      "Factor the difference of squares: (x-y)(x+y) = 2023.",
      "Since 2023 is odd, every divisor pair (positive or negative) gives integer x and y — count all such pairs.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-17",
    question: "What is the remainder when 3^(3^100) is divided by 100?",
    format: "INTEGER",
    answer: "3",
    solution:
      "Since gcd(3,100) = 1, the value of 3^k mod 100 depends only on k mod ord₁₀₀(3), where ord₁₀₀(3) = 20. So we need 3^100 mod 20. Since ord₂₀(3) = 4 and 100 is a multiple of 4, 3^100 ≡ 1 (mod 20). Therefore 3^(3^100) ≡ 3^1 = 3 (mod 100).",
    hints: [
      "Reduce the outer exponent modulo the order of 3 modulo 100, which is 20.",
      "To find 3^100 mod 20, note the order of 3 modulo 20 is only 4.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-18",
    question:
      "How many sequences of 6 heads and 4 tails (10 flips total) have the property that in every prefix of the sequence, the number of heads is at least the number of tails?",
    format: "INTEGER",
    answer: "90",
    solution:
      "This is the generalized ballot problem: for p heads and q tails with p ≥ q, the number of sequences where every prefix has at least as many heads as tails is (p - q + 1)/(p + 1) · C(p+q, q). With p = 6, q = 4: (6-4+1)/7 · C(10,4) = 3/7 · 210 = 90.",
    hints: [
      "This is the classical 'ballot problem' — heads staying ahead of tails throughout the count.",
      "The generalized ballot formula (p−q+1)/(p+1) · C(p+q,q) applies directly with p=6, q=4.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-19",
    question:
      "What is the maximum number of edges in a simple graph on 12 vertices that contains no triangle?",
    format: "INTEGER",
    answer: "36",
    solution:
      "By Mantel's theorem, the maximum number of edges in a triangle-free graph on n vertices is ⌊n²/4⌋. For n = 12, this is ⌊144/4⌋ = 36, achieved by the complete bipartite graph K(6,6), which has 6·6 = 36 edges and is triangle-free since it has no odd cycles at all.",
    hints: [
      "This is a case of Mantel's theorem for triangle-free graphs.",
      "The extremal graph is complete bipartite with the two parts as equal as possible.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "usamts",
  },
  {
    slug: "usamts-20",
    question:
      "A sequence is defined by a1 = 2 and a(n+1) = a(n)² - a(n) + 1. What is the remainder when a6 is divided by 1000?",
    format: "INTEGER",
    answer: "443",
    solution:
      "Computing directly: a1=2, a2=3, a3=7, a4=43, a5=1807, a6 = 1807² - 1807 + 1 = 3263449 - 1807 + 1 = 3263443. The remainder of 3263443 upon division by 1000 is 443.",
    hints: [
      "Compute the terms one at a time — they grow doubly exponentially, but only the last three digits matter at the end.",
      "You can reduce modulo 1000 at each step once you've computed a5 exactly, since 1000 | (a6 − a6 mod 1000).",
    ],
    difficulty: 10,
    topicSlug: "advanced-olympiad",
    competitionSlug: "usamts",
  },

  // ================================= USAMO =================================
  {
    slug: "usamo-01",
    question: "What is the remainder when 7^(7^7) is divided by 1000?",
    format: "INTEGER",
    answer: "343",
    solution:
      "Work modulo 8 and 125 separately. Since 7 ≡ -1 (mod 8) and 7^7 is odd, 7^(7^7) ≡ (-1)^odd ≡ -1 ≡ 7 (mod 8). Modulo 125, ord₁₂₅(7) = 20, so we first reduce the tower exponent: since ord₂₀(7) = 4, we compute 7^7 mod 20 by reducing the exponent 7 mod 4 to get 7^7 ≡ 7^3 ≡ 343 ≡ 3 (mod 20). So 7^(7^7) ≡ 7^3 ≡ 343 ≡ 93 (mod 125). Solving n ≡ 7 (mod 8) and n ≡ 93 (mod 125) via CRT gives n ≡ 343 (mod 1000).",
    hints: [
      "Split 1000 into coprime parts 8 and 125 and compute the tower modulo each.",
      "Modulo 125 the order of 7 is 20, so you need to reduce the exponent 7^7 modulo 20 first.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-02",
    question:
      "The numbers 1, 2, 3, ..., 100 are written on cards. Repeatedly, two cards showing a and b are replaced by a single card showing a + b - 1, until one card remains. What is the number on the final card?",
    format: "INTEGER",
    answer: "4951",
    solution:
      "Define g(x) = x - 1. Then g(a+b-1) = a+b-2 = g(a) + g(b), so the operation is exactly addition on g-values and is therefore order-independent: the final g-value equals the sum of all initial g-values. That sum is g(1) + g(2) + ... + g(100) = 0 + 1 + ... + 99 = 99·100/2 = 4950. So the final card shows g⁻¹(4950) = 4950 + 1 = 4951.",
    hints: [
      "Shift every number down by 1 and see what the combining operation becomes.",
      "Under that shift, the operation is ordinary addition, whose total is invariant no matter the merge order.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-03",
    question: "How many distinct labeled spanning trees does the complete graph K6 have?",
    format: "INTEGER",
    answer: "1296",
    solution:
      "By Cayley's formula, the number of labeled spanning trees of the complete graph on n vertices is n^(n-2). For n = 6, this is 6^4 = 1296.",
    hints: [
      "This is a direct application of a named formula for counting labeled trees.",
      "Cayley's formula gives n^(n-2) spanning trees for K_n.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-04",
    question:
      "A function f: Z → Z satisfies f(x+y) = f(x) + f(y) + 2xy + 1 for all integers x, y, and f(1) = 2. What is f(10)?",
    format: "INTEGER",
    answer: "119",
    solution:
      "Setting x = y = 0 gives f(0) = 2f(0) + 1, so f(0) = -1. One can check that f(n) = n² + tn - 1 satisfies the functional equation for every integer t (substitute and verify both sides expand to the same thing), with t = f(1). Since f(1) = 2, we get f(n) = n² + 2n - 1 for all integers n, so f(10) = 100 + 20 - 1 = 119.",
    hints: [
      "Setting x = y = 0 pins down f(0). Then try an ansatz f(n) = n² + tn + c and match constants.",
      "The given value f(1) = 2 fixes the remaining free parameter t in the general solution.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-05",
    question:
      "In triangle ABC, cevians AD, BE, CF are concurrent at point P, with D on BC, E on CA, and F on AB. Given BD/DC = 2 and CE/EA = 3, Ceva's theorem forces AF/FB = 1/6. What is AP/PD? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "1/2",
    solution:
      "Use mass points. Since BD/DC = 2, assign mass 1 to B and mass 2 to C (masses are inversely proportional to the adjacent segment), giving D mass 3. Since CE/EA = 3, assign mass 2 to C (already fixed) and mass 6 to A (since mass_C/mass_A = EA/CE = 1/3). This is consistent with AF/FB = mass_B/mass_A = 1/6, confirming concurrency. Along cevian AD, the masses at A and D are 6 and 3, so AP/PD = mass_D/mass_A = 3/6 = 1/2.",
    hints: [
      "Assign mass points to A, B, C consistent with the two given ratios.",
      "Once the masses are fixed, the ratio AP/PD along cevian AD equals mass(D)/mass(A).",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-06",
    question:
      "How many pairs of positive integers (x, y) with x < 1000 satisfy the Pell equation x² - 2y² = 1?",
    format: "INTEGER",
    answer: "4",
    solution:
      "The fundamental solution is (x,y) = (3,2), and further solutions are generated by (x,y) → (3x+4y, 2x+3y). This produces (3,2), (17,12), (99,70), (577,408), (3363,2378), .... Among these, x < 1000 holds for (3,2), (17,12), (99,70), (577,408) — exactly 4 pairs, since the next solution has x = 3363 > 1000.",
    hints: [
      "Find the fundamental (smallest) solution, then generate further ones with the standard Pell recursion.",
      "Stop generating once x reaches or exceeds 1000, and count how many you found below that bound.",
    ],
    difficulty: 10,
    topicSlug: "diophantine-equations",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-07",
    question:
      "Positive reals a, b, c satisfy a + b + c = 3. What is the minimum possible value of a/(b²+1) + b/(c²+1) + c/(a²+1)? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "3/2",
    solution:
      "For fixed t > 0, the function g(s) = 1/(s²+1) lies above its tangent line at s=1 throughout the relevant range (0,3): g(s) ≥ g(1) + g'(1)(s-1) = 1/2 - (1/2)(s-1) = 1 - s/2. So t/(s²+1) ≥ t(1 - s/2) for t > 0. Summing cyclically: a/(b²+1) + b/(c²+1) + c/(a²+1) ≥ a(1-b/2) + b(1-c/2) + c(1-a/2) = (a+b+c) - (ab+bc+ca)/2 = 3 - (ab+bc+ca)/2. Since (a+b+c)² = a²+b²+c² + 2(ab+bc+ca) ≥ 3(ab+bc+ca) (as a²+b²+c² ≥ ab+bc+ca), we get ab+bc+ca ≤ (a+b+c)²/3 = 3. Hence the expression is at least 3 - 3/2 = 3/2, with equality when a=b=c=1.",
    hints: [
      "Try the symmetric point a = b = c = 1 first to find the conjectured extreme value.",
      "Bound each term t/(s²+1) below by its tangent line at s=1, then bound the resulting ab+bc+ca term using a+b+c=3.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-08",
    question:
      "What is the smallest n such that any 2-coloring of the edges of the complete graph on n vertices must contain a monochromatic triangle?",
    format: "INTEGER",
    answer: "6",
    solution:
      "This is the Ramsey number R(3,3). A 2-coloring of K5's edges can avoid a monochromatic triangle (e.g., color the edges of a 5-cycle red and the remaining 5 edges, forming the complementary 5-cycle, blue), so n=5 does not force one. But for K6, any vertex has 5 edges, so by pigeonhole at least 3 go to the same color, say red, to vertices x,y,z. If any edge among x,y,z is red, that plus the two red edges from the original vertex forms a red triangle; otherwise xyz is an all-blue triangle. So n=6 always forces a monochromatic triangle, and R(3,3) = 6.",
    hints: [
      "Check that K5 can be 2-colored (e.g. via two edge-disjoint 5-cycles) with no monochromatic triangle.",
      "For K6, apply the pigeonhole principle to the 5 edges at a single vertex.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-09",
    question:
      "A monic degree-4 polynomial P satisfies P(1)=1, P(2)=4, P(3)=9, P(4)=16. What is P(5)?",
    format: "INTEGER",
    answer: "49",
    solution:
      "Consider Q(x) = P(x) - x². Since P is monic of degree 4, Q is also monic of degree 4 (the x² term doesn't affect the leading term), and Q(1)=Q(2)=Q(3)=Q(4)=0. So Q(x) = (x-1)(x-2)(x-3)(x-4). Then P(5) = 25 + Q(5) = 25 + (4)(3)(2)(1) = 25 + 24 = 49.",
    hints: [
      "Subtract x² from P(x) to get a polynomial with four known roots.",
      "That difference must be exactly (x-1)(x-2)(x-3)(x-4), since it's monic of degree 4 with those roots.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-10",
    question:
      "What is the smallest n such that any n-element subset of {1, 2, ..., 100} must contain two elements that differ by exactly 9?",
    format: "INTEGER",
    answer: "55",
    solution:
      "Partition {1,...,100} into 9 chains by residue mod 9, where each chain consists of numbers r, r+9, r+18, ... forming a path graph (consecutive chain elements differ by 9). To avoid any two elements differing by 9, a subset can include at most every other element of each chain, i.e. at most ⌈L/2⌉ elements from a chain of length L. The chain lengths for residues 1 through 9 (mod 9, using representatives 1-9) among 1..100 are: eleven chains of length 12 (residues 1-4, since 100 = 9·11+1) and... computing precisely: residues 1,2,3,4 give chains of length 12 (e.g. 1,10,...,100 has 12 terms), and residues 5,...,9 give chains of length 11. Summing ⌈L/2⌉ over all 9 chains gives a maximum independent set of size 54, so the smallest n forcing a difference of 9 is 54 + 1 = 55.",
    hints: [
      "Group the numbers into 9 chains by residue mod 9, where consecutive chain members differ by 9.",
      "Within each chain (a path graph), the largest subset avoiding adjacent picks has size ⌈length/2⌉ — sum this over all chains.",
    ],
    difficulty: 10,
    topicSlug: "pigeonhole",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-11",
    question:
      "A sequence satisfies a0 = 0, a1 = 1, and a(n+2) = 4a(n+1) - 3a(n). What is the remainder when a20 is divided by 1000?",
    format: "INTEGER",
    answer: "200",
    solution:
      "The characteristic equation x² = 4x - 3 factors as (x-1)(x-3) = 0, with roots 1 and 3. So a(n) = A + B·3^n for constants found from a0=0, a1=1: A+B=0 and A+3B=1, giving B=1/2, A=-1/2, so a(n) = (3^n - 1)/2. Then a20 = (3^20 - 1)/2 = (3486784401 - 1)/2 = 1743392200, whose last three digits are 200.",
    hints: [
      "Solve the characteristic equation of this linear recurrence to get roots 1 and 3.",
      "The closed form a(n) = (3^n − 1)/2 lets you compute a20 exactly.",
    ],
    difficulty: 10,
    topicSlug: "sequences",
    competitionSlug: "usamo",
  },
  {
    slug: "usamo-12",
    question:
      "How many positive integers n ≤ 2024 cannot be written as a sum of two squares of nonnegative integers (i.e., n ≠ a² + b² for any nonnegative integers a, b)?",
    format: "INTEGER",
    answer: "1400",
    solution:
      "By Fermat's two-square theorem, a positive integer is a sum of two squares if and only if every prime factor congruent to 3 (mod 4) appears to an even power in its factorization. Directly checking all n from 1 to 2024 for representability as a²+b² (equivalently, sieving all sums a²+b² ≤ 2024 and marking them) shows that exactly 624 of the integers from 1 to 2024 are expressible as a sum of two squares, so 2024 - 624 = 1400 are not.",
    hints: [
      "Fermat's two-square theorem characterizes which numbers are sums of two squares via their prime factorization.",
      "It's most reliable here to directly sieve: mark every value a²+b² ≤ 2024 as representable, then count the unmarked ones.",
    ],
    difficulty: 10,
    topicSlug: "advanced-olympiad",
    competitionSlug: "usamo",
  },

  // ================================== IMO ==================================
  {
    slug: "imo-01",
    question:
      "How many ordered pairs of integers (a, b) with 1 ≤ a, b ≤ 30 satisfy that a² + b² is divisible by 5?",
    format: "INTEGER",
    answer: "324",
    solution:
      "Squares modulo 5 take values 0, 1, 4, 4, 1 for residues 0,1,2,3,4. So a² ≡ 0 requires a ≡ 0 (mod 5) [6 values in 1..30], a² ≡ 1 requires a ≡ 1 or 4 (mod 5) [12 values], and a² ≡ 4 requires a ≡ 2 or 3 (mod 5) [12 values]. For a²+b² ≡ 0 (mod 5) we need (a²,b²) mod 5 to be (0,0), (1,4), or (4,1): this gives 6·6 + 12·12 + 12·12 = 36 + 144 + 144 = 324 pairs.",
    hints: [
      "Work out the possible values of a square modulo 5, and how many a in 1..30 give each value.",
      "Sum a² and b² is divisible by 5 exactly when their residues pair up as (0,0), (1,4), or (4,1).",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "imo",
  },
  {
    slug: "imo-02",
    question:
      "How many ways can the numbers 1 through 9 be placed in a 3×3 grid so that every row is increasing left to right and every column is increasing top to bottom?",
    format: "INTEGER",
    answer: "42",
    solution:
      "This counts standard Young tableaux of the 3×3 square shape. By the hook length formula, the number of such tableaux is 9! divided by the product of hook lengths. For the 3×3 square, the hook lengths are 5,4,3 / 4,3,2 / 3,2,1, with product 5·4·3·4·3·2·3·2·1 = 8640. So the count is 362880/8640 = 42.",
    hints: [
      "This is exactly the count of standard Young tableaux of a 3×3 square shape.",
      "Use the hook length formula: n! divided by the product of hook lengths of each cell.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "imo",
  },
  {
    slug: "imo-03",
    question:
      "A function f: Z → Z satisfies f(x) + f(y) = f(x+y) - xy for all integers x, y, and f(1) = 1. What is f(20)?",
    format: "INTEGER",
    answer: "210",
    solution:
      "Rearranging, f(x+y) = f(x) + f(y) + xy. Setting x=y=0 gives f(0)=0. Setting y=1 gives f(n+1) = f(n) + f(1) + n = f(n) + n + 1. Starting from f(0)=0, this gives f(n) = n + (n-1) + ... + 1 = n(n+1)/2 (the triangular numbers), which can be verified to satisfy the original equation for all integers x,y, not just consecutive ones: f(x+y) = (x+y)(x+y+1)/2, while f(x)+f(y)+xy = [x(x+1)+y(y+1)]/2 + xy = [x²+x+y²+y+2xy]/2 = (x+y)(x+y+1)/2. Both sides match. So f(20) = 20·21/2 = 210.",
    hints: [
      "Setting x = y = 0 gives f(0); setting y = 1 gives a recurrence for consecutive values.",
      "The recurrence produces the triangular numbers f(n) = n(n+1)/2 — check this satisfies the equation for all x, y.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "imo",
  },
  {
    slug: "imo-04",
    question:
      "Triangle ABC has AB = 11, BC = 20, CA = 13. Let O be the circumcenter and M the midpoint of BC. What is OM? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "25/6",
    solution:
      "The area of the triangle (by Heron's formula, s = 22) is √(22·11·2·9) = √4356 = 66. The circumradius is R = abc/(4K) = (20·13·11)/(4·66) = 2860/264 = 65/6. Since O is equidistant from B and C, OM is perpendicular to BC, and by the Pythagorean theorem OM² = R² - (BC/2)² = (65/6)² - 10² = 4225/36 - 3600/36 = 625/36. So OM = 25/6.",
    hints: [
      "Find the area and circumradius of the triangle first, using Heron's formula and R = abc/(4K).",
      "OM is perpendicular to BC (since O is equidistant from B and C), so OM² = R² − (BC/2)² by the Pythagorean theorem.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "imo",
  },
  {
    slug: "imo-05",
    question: "How many ordered triples of positive integers (x, y, z) satisfy 1/x + 1/y + 1/z = 1?",
    format: "INTEGER",
    answer: "10",
    solution:
      "Assume WLOG x ≤ y ≤ z; then 1/x ≥ 1/3, so x ∈ {1,2,3}. x=1 forces 1/y+1/z=0, impossible for positive y,z. x=2 gives 1/y+1/z=1/2 with y≥2, leading to (y,z) = (3,6) or (4,4). x=3 gives 1/y+1/z=2/3 with y≥3, leading to (y,z)=(3,3). So the unordered solutions are {2,3,6}, {2,4,4}, {3,3,3}. Counting orderings: {2,3,6} has 3!=6 orderings, {2,4,4} has 3 orderings (3!/2!), {3,3,3} has 1 ordering. Total: 6+3+1 = 10.",
    hints: [
      "Assume x ≤ y ≤ z to control the search, then count all orderings of each solution found.",
      "Since 1/x ≥ 1/3 under that assumption, x can only be 1, 2, or 3 — check each case.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "imo",
  },
  {
    slug: "imo-06",
    question: "How many integers n with 1 ≤ n ≤ 2024 satisfy n² ≡ n (mod 2024)?",
    format: "INTEGER",
    answer: "8",
    solution:
      "Factor 2024 = 2³·11·23. By the Chinese Remainder Theorem, Z/2024Z ≅ Z/8Z × Z/11Z × Z/23Z. An element is idempotent (n² ≡ n) modulo 2024 exactly when its image in each factor is idempotent in that factor. In Z/8Z, Z/11Z, and Z/23Z — each a ring with no nontrivial idempotents beyond 0 and 1 (since 11 and 23 are prime, and 8 is a prime power, both give only the trivial idempotents 0,1) — there are exactly 2 idempotents each. So the total number of idempotents mod 2024 is 2·2·2 = 8, corresponding to n = 1, 1288, 2024 (≡0), and five others obtained via CRT combination.",
    hints: [
      "Factor 2024 into prime power components and use the Chinese Remainder Theorem.",
      "In each prime-power factor, the only idempotents are 0 and 1 — count the combinations.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "imo",
  },
  {
    slug: "imo-07",
    question:
      "A polynomial P with integer coefficients satisfies P(7) = 5 and P(5) = 7. There is exactly one integer n for which the necessary divisibility conditions do not rule out P(n) = n + 3. What is n?",
    format: "INTEGER",
    answer: "6",
    solution:
      "For any integer-coefficient polynomial, a - b divides P(a) - P(b). If P(n) = n+3, then n-7 divides P(n)-P(7) = (n+3)-5 = n-2 = (n-7)+5, forcing n-7 to divide 5, so n-7 ∈ {1,-1,5,-5}, i.e. n ∈ {8,6,12,2}. Similarly n-5 divides P(n)-P(5) = (n+3)-7 = n-4 = (n-5)+1, forcing n-5 to divide 1, so n-5 ∈ {1,-1}, i.e. n ∈ {6,4}. The only common value is n=6. (Indeed, P(x) = -3x² + 35x - 93 satisfies P(7)=5, P(5)=7, P(6)=9=6+3, confirming n=6 is achievable.)",
    hints: [
      "Use the key lemma: for integer polynomials, a − b divides P(a) − P(b).",
      "Apply the lemma with both given points to get two divisibility constraints on n, then intersect them.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "imo",
  },
  {
    slug: "imo-08",
    question:
      "Positive reals x, y, z satisfy x + y + z = 1. What is the minimum possible value of 1/x + 1/y + 1/z?",
    format: "INTEGER",
    answer: "9",
    solution:
      "By the AM-HM inequality, (x+y+z)/3 ≥ 3/(1/x+1/y+1/z), so 1/3 ≥ 3/(1/x+1/y+1/z), giving 1/x+1/y+1/z ≥ 9. Equality holds when x=y=z=1/3, so the minimum is 9.",
    hints: [
      "This is a direct application of the AM-HM inequality.",
      "Equality in AM-HM occurs when all the variables are equal.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "imo",
  },
  {
    slug: "imo-09",
    question:
      "What is the maximum number of edges in a simple graph on 9 vertices that contains no 4-clique (no set of 4 mutually adjacent vertices)?",
    format: "INTEGER",
    answer: "27",
    solution:
      "By Turán's theorem, the maximum number of edges in a K(r+1)-free graph on n vertices is achieved by the complete r-partite Turán graph with parts as equal as possible. Avoiding a 4-clique means r=3, and for n=9 the parts are 3,3,3. The number of edges is C(9,2) minus the edges within each part: 36 - 3·C(3,2) = 36 - 9 = 27.",
    hints: [
      "This is an instance of Turán's theorem for graphs avoiding a clique of a given size.",
      "The extremal graph is complete tripartite with parts as equal as possible — compute its edge count directly.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "imo",
  },
  {
    slug: "imo-10",
    question:
      "A cube has side length 6. A plane through the three vertices adjacent to one corner slices off a corner tetrahedron. What is the volume of that tetrahedron?",
    format: "INTEGER",
    answer: "36",
    solution:
      "Place the cut-off corner at the origin with the cube's edges along the axes. The tetrahedron has three mutually perpendicular edges of length 6 meeting at the origin, so its volume is (1/6)·(edge)³ = (1/6)·216 = 36 (the general formula for a corner tetrahedron with three mutually perpendicular edges of length s cut from a cube of side s).",
    hints: [
      "Set up coordinates with the cut corner at the origin and the cube's edges along the axes.",
      "The tetrahedron has three mutually perpendicular edges of length 6 — its volume is (1/6) times the product of those three edge lengths.",
    ],
    difficulty: 10,
    topicSlug: "three-d-geometry",
    competitionSlug: "imo",
  },
  {
    slug: "imo-11",
    question:
      "In how many ways can 12 identical balls be distributed into 4 distinct boxes so that each box contains at least 1 and at most 5 balls?",
    format: "INTEGER",
    answer: "85",
    solution:
      "We need the number of solutions to w+x+y+z=12 with each variable in {1,...,5}. Substituting w'=w-1 etc. gives w'+x'+y'+z'=8 with each variable in {0,...,4}. By inclusion-exclusion on the upper bound violations (each variable exceeding 4), the count of nonnegative solutions to w'+x'+y'+z'=8 with each ≤4 is C(11,3) - C(4,1)C(6,3) + C(4,2)C(1,3) = 165 - 80 + 0 = 85 (the third term vanishes since C(1,3)=0).",
    hints: [
      "Shift each variable down by 1 to turn the bounds into 0 ≤ variable ≤ 4, with the total reduced to 8.",
      "Use inclusion-exclusion on the events 'some variable exceeds 4' to count the bounded solutions.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "imo",
  },
  {
    slug: "imo-12",
    question: "What is the sum of φ(d) over all positive divisors d of 360?",
    format: "INTEGER",
    answer: "360",
    solution:
      "By a classical identity, the sum of Euler's totient function φ(d) over all divisors d of n always equals n itself (this follows from partitioning {1,...,n} by the gcd of each element with n). So the sum over divisors of 360 is simply 360.",
    hints: [
      "There is a classical identity for the sum of φ(d) over all divisors d of n.",
      "Partition the integers 1 through n by their gcd with n to see why the sum equals n.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "imo",
  },

  // ============================= IMO Shortlist =============================
  {
    slug: "imoshort-01",
    question:
      "How many positive integers n with 1 ≤ n ≤ 300000 satisfy that n divides 2^n - 1?",
    format: "INTEGER",
    answer: "1",
    solution:
      "Suppose n > 1 satisfies n | 2^n - 1. Then n is odd (since 2^n - 1 is odd). Let p be the smallest prime factor of n. Since p | 2^n - 1, the order of 2 modulo p divides n. It also divides p-1 by Fermat's little theorem. So the order divides gcd(n, p-1). But every prime factor of n is at least p, while every factor of p-1 is less than p, so gcd(n,p-1) = 1, forcing the order of 2 mod p to be 1, i.e. p | 2-1 = 1 — impossible. So no n > 1 works, and only n=1 satisfies the condition (trivially, 1 | 1).",
    hints: [
      "Suppose n > 1 works and look at its smallest prime factor p.",
      "Show the order of 2 modulo p must divide both n and p−1, and that this forces a contradiction.",
    ],
    difficulty: 9,
    topicSlug: "number-theory",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-02",
    question: "How many subsets of {1, 2, ..., 15} have sum divisible by 3?",
    format: "INTEGER",
    answer: "10944",
    solution:
      "Among 1..15, five numbers are ≡0 (mod 3), five are ≡1, five are ≡2. A roots-of-unity filter (or direct generating function computation with ω a primitive cube root of unity) on f(x) = ∏(1+x^{a_i}) evaluated at x=1, ω, ω² and averaged gives the count of subsets with sum ≡ 0 (mod 3). Carrying out this computation (or equivalently a direct count via dynamic programming over residues) yields exactly 10944 such subsets out of 2^15 = 32768 total.",
    hints: [
      "Split the 15 numbers into three groups of five by their residue mod 3.",
      "A roots-of-unity filter, or a direct DP tracking the running sum mod 3 across all 15 elements, gives the exact count.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-03",
    question:
      "Starting with a single pile of 2024 stones, repeatedly split any pile of size n > 1 into two piles of sizes a and b (a+b=n), scoring a·b points for that split, until every pile has size 1. What is the total score, no matter how the splits are performed?",
    format: "INTEGER",
    answer: "2047276",
    solution:
      "Claim: the total score is always C(n,2) = n(n-1)/2, independent of the splitting order. This follows because each split of a pile of size a+b into a and b contributes a·b, which equals exactly the number of pairs of original stones that get separated at that step (one from each side); every pair of the original n stones is separated at exactly one split (the first time they end up in different piles). So summing over all splits counts every pair exactly once, giving C(n,2) total. For n=2024, this is 2024·2023/2 = 2047276.",
    hints: [
      "Think of each split's score a·b as counting pairs of original stones being separated for the first time.",
      "Every pair of the n original stones gets separated exactly once across the whole process — sum over all pairs.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-04",
    question:
      "A function f: Q → Q satisfies f(x+y) = f(x) + f(y) + 1 for all rationals x, y, and f(1) = 5. What is f(1/2)?",
    format: "INTEGER",
    answer: "2",
    solution:
      "Let g(x) = f(x) + 1. Then g(x+y) = g(x) + g(y), a Cauchy equation over Q. Since Q is generated as a group by 1 with no pathological solutions possible over the rationals (unlike over R), g(x) = x·g(1) for all rational x, where g(1) = f(1)+1 = 6. So g(1/2) = 6/2 = 3, giving f(1/2) = 3 - 1 = 2.",
    hints: [
      "Substitute g(x) = f(x) + 1 to turn this into the standard Cauchy functional equation.",
      "Over the rationals, any additive function is automatically linear: g(x) = x·g(1).",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-05",
    question:
      "Triangle ABC has AB = 10, BC = 13, CA = 13. What is its inradius? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "10/3",
    solution:
      "The semiperimeter is s = (10+13+13)/2 = 18. By Heron's formula, the area is √(18·8·5·5) = √3600 = 60. The inradius is r = Area/s = 60/18 = 10/3.",
    hints: [
      "Compute the semiperimeter and use Heron's formula for the area.",
      "The inradius is the area divided by the semiperimeter.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-06",
    question:
      "How many ordered pairs of positive integers (x, y) with x, y ≤ 1000 satisfy x² + xy - y² = 1?",
    format: "INTEGER",
    answer: "8",
    solution:
      "This is a Fibonacci identity: consecutive Fibonacci numbers F(n), F(n+1) satisfy F(n)² + F(n)F(n+1) - F(n+1)² = ±1 (specifically it equals (-1)^(n+1)... with the sign working out so that (F(n),F(n+1)) with n odd gives +1). Checking, the solutions with x,y ≤ 1000 are exactly the consecutive Fibonacci pairs (1,1), (2,3), (5,8), (13,21), (34,55), (89,144), (233,377), (610,987) — 8 pairs (the next pair, (1597,2584), exceeds the bound).",
    hints: [
      "Try small solutions and look for a pattern — they turn out to be consecutive Fibonacci numbers.",
      "Verify the Fibonacci identity F(n)² + F(n)F(n+1) − F(n+1)² = ±1 and count pairs within the bound.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-07",
    question: "What is the remainder when 11^100 is divided by 1000?",
    format: "INTEGER",
    answer: "1",
    solution:
      "Since gcd(11,1000)=1, Euler's/Carmichael's theorem applies: the Carmichael function λ(1000) = lcm(λ(8), λ(125)) = lcm(2,100) = 100. So 11^100 ≡ 1 (mod 1000) exactly, since the exponent equals λ(1000) itself.",
    hints: [
      "Compute the Carmichael function λ(1000) by combining λ(8) and λ(125).",
      "The exponent 100 turns out to equal λ(1000) exactly.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-08",
    question:
      "What is the smallest n such that any n-element subset of {1, 2, ..., 100} must contain two elements summing to 101?",
    format: "INTEGER",
    answer: "51",
    solution:
      "Partition {1,...,100} into 50 pairs that each sum to 101: (1,100), (2,99), ..., (50,51). A subset avoiding any such pair can include at most one element from each pair, so at most 50 elements — achievable by picking, say, all of 51 through 100. With 51 elements, the pigeonhole principle forces two elements from the same pair, which sum to 101. So the smallest such n is 51.",
    hints: [
      "Pair up the numbers so each pair sums to 101 — there are 50 such pairs.",
      "A subset with no such pair can use at most one number from each pair.",
    ],
    difficulty: 9,
    topicSlug: "pigeonhole",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-09",
    question: "A sequence satisfies a1 = 3 and a(n+1) = a(n)² - 2. What is the remainder when a10 is divided by 1000?",
    format: "INTEGER",
    answer: "807",
    solution:
      "Computing the sequence exactly (it grows doubly exponentially, but exact integer arithmetic handles it): a1=3, a2=7, a3=47, a4=2207, a5=4870847, and so on up through a10, which is a 215-digit integer. Its last three digits are 807.",
    hints: [
      "This sequence grows extremely fast — the safest approach is exact big-integer computation of each term in turn.",
      "Once you have the exact value of a10, only its last three digits are needed for the answer.",
    ],
    difficulty: 10,
    topicSlug: "sequences",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-10",
    question:
      "The polynomial x^5 - x - 1 has a unique real root r. What is ⌊1000r⌋?",
    format: "INTEGER",
    answer: "1167",
    solution:
      "Since f(x) = x^5-x-1 has f(1) = -1 < 0 and f(2) = 29 > 0, and f'(x)=5x^4-1>0 for x>1 (so f is strictly increasing there, and one checks it's monotonic enough to have only one real root), there is a unique real root in (1,2). Narrowing via bisection (or Newton's method) gives r ≈ 1.167303978261..., so 1000r ≈ 1167.303978..., and ⌊1000r⌋ = 1167.",
    hints: [
      "Show f(x) = x^5 − x − 1 changes sign between 1 and 2, and is monotonic enough there for a unique root.",
      "Narrow the root's location by bisection until you're confident of the third decimal digit of 1000r.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-11",
    question:
      "A regular tetrahedron has edge length 6. What is the square of the distance between the midpoints of two opposite (non-intersecting) edges?",
    format: "INTEGER",
    answer: "18",
    solution:
      "For a regular tetrahedron with edge length a, the segment joining the midpoints of two opposite edges has length a/√2 (this segment is the common perpendicular between the two skew opposite edges). So the squared distance is a²/2 = 36/2 = 18.",
    hints: [
      "The segment connecting midpoints of opposite edges is the common perpendicular between them.",
      "For edge length a, this distance is a/√2 — square it for a = 6.",
    ],
    difficulty: 10,
    topicSlug: "three-d-geometry",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-12",
    question:
      "How many permutations of {1, 2, ..., 7} have NO odd number in any odd position (positions 1, 3, 5, 7, using 1-indexing)?",
    format: "INTEGER",
    answer: "0",
    solution:
      "There are 4 odd numbers (1,3,5,7) and 4 odd positions (1,3,5,7), but only 3 even numbers (2,4,6) and 3 even positions (2,4,6). If no odd number may occupy an odd position, then all 4 odd numbers must be placed in the 4 even... but there are only 3 even positions available, so by the pigeonhole principle it is impossible to place all 4 odd numbers into positions that are not odd. Hence no valid permutation exists, and the count is 0.",
    hints: [
      "Count the odd numbers and the odd positions separately, then think about where the odd numbers would have to go.",
      "There are 4 odd numbers but only 3 non-odd (even) positions to hide them in — pigeonhole finishes it.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-13",
    question:
      "What is the minimum possible number of edges in a simple graph on 7 vertices where every vertex has degree at least 4?",
    format: "INTEGER",
    answer: "14",
    solution:
      "By the handshake lemma, the sum of all degrees is twice the number of edges. If every vertex has degree at least 4, the degree sum is at least 7·4 = 28, so the number of edges is at least 14. This bound is achieved by the circulant graph on 7 vertices where each vertex connects to its 4 nearest neighbors (2 on each side) around a cycle, which is 4-regular with exactly 7·4/2 = 14 edges.",
    hints: [
      "Use the handshake lemma to get a lower bound on the number of edges from the minimum degree.",
      "Check that a 4-regular graph on 7 vertices actually exists to confirm the bound is achieved.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-14",
    question:
      "The roots a, b, c of x³ - 3x² + 2x - 1 = 0 satisfy a³ + b³ + c³ = ? Find this value.",
    format: "INTEGER",
    answer: "12",
    solution:
      "By Vieta's formulas, e1 = a+b+c = 3, e2 = ab+bc+ca = 2, e3 = abc = 1. Newton's identities give p1 = e1 = 3, p2 = e1·p1 - 2e2 = 9 - 4 = 5, and p3 = e1·p2 - e2·p1 + 3e3 = 3·5 - 2·3 + 3·1 = 15 - 6 + 3 = 12. So a³+b³+c³ = 12.",
    hints: [
      "Use Vieta's formulas to get the elementary symmetric sums from the coefficients.",
      "Apply Newton's identities to build up power sums p1, p2, p3 from the elementary symmetric sums.",
    ],
    difficulty: 10,
    topicSlug: "algebra",
    competitionSlug: "imo-shortlist",
  },
  {
    slug: "imoshort-15",
    question:
      "Positive reals a, b, c satisfy a² + b² + c² = 3. What is the maximum possible value of ab + bc + ca?",
    format: "INTEGER",
    answer: "3",
    solution:
      "By Cauchy-Schwarz, (a+b+c)² ≤ 3(a²+b²+c²) = 9, so a+b+c ≤ 3. Also, (a+b+c)² = a²+b²+c² + 2(ab+bc+ca) = 3 + 2(ab+bc+ca), so 2(ab+bc+ca) = (a+b+c)² - 3 ≤ 9 - 3 = 6, giving ab+bc+ca ≤ 3. Equality holds when a=b=c=1, which satisfies a²+b²+c²=3. So the maximum is 3.",
    hints: [
      "Relate (a+b+c)² to a²+b²+c² and ab+bc+ca via the standard expansion.",
      "Bound a+b+c using Cauchy-Schwarz (or QM-AM) first, then substitute back.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "imo-shortlist",
  },

  // ================================= EGMO =================================
  {
    slug: "egmo-01",
    question: "What is the remainder when 5^100 is divided by 7?",
    format: "INTEGER",
    answer: "2",
    solution:
      "The order of 5 modulo 7 divides 6 (by Fermat's little theorem). Computing powers: 5,4,6,2,3,1 for exponents 1 through 6, so the order is exactly 6. Since 100 = 6·16 + 4, 5^100 ≡ 5^4 ≡ 2 (mod 7).",
    hints: [
      "By Fermat's little theorem, the order of 5 modulo 7 divides 6.",
      "Reduce the exponent 100 modulo the order you find, then compute the smaller power.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-02",
    question:
      "In how many ways can 5 distinct books be distributed to 3 distinct people so that each person receives at least one book?",
    format: "INTEGER",
    answer: "150",
    solution:
      "This counts surjections from a 5-element set to a 3-element set. By inclusion-exclusion, the count is 3^5 - C(3,1)·2^5 + C(3,2)·1^5 = 243 - 96 + 3 = 150.",
    hints: [
      "This is the number of surjective functions from a 5-element set to a 3-element set.",
      "Use inclusion-exclusion on the condition that at least one person receives no books.",
    ],
    difficulty: 8,
    topicSlug: "combinatorics",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-03",
    question:
      "Triangle ABC has AB = 7, BC = 20, CA = 15. What is the length of the altitude from A to BC? Express your answer as a fraction.",
    format: "SHORT_ANSWER",
    answer: "21/5",
    solution:
      "By Heron's formula with s = (7+20+15)/2 = 21, the area is √(21·14·1·6) = √1764 = 42. The altitude to BC has length 2·Area/BC = 84/20 = 21/5.",
    hints: [
      "Find the area of the triangle using Heron's formula.",
      "The altitude to a side equals twice the area divided by that side's length.",
    ],
    difficulty: 8,
    topicSlug: "geometry",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-04",
    question:
      "A sequence satisfies a1 = 2, a2 = 5, and a(n+1) = 3a(n) - 2a(n-1). What is a10?",
    format: "INTEGER",
    answer: "1535",
    solution:
      "The characteristic equation x² = 3x - 2 factors as (x-1)(x-2) = 0, with roots 1 and 2. So a(n) = A + B·2^n. From a1=2, a2=5: A+2B=2 and A+4B=5, giving B=3/2, A=-1, so a(n) = 3·2^(n-1) - 1. Then a10 = 3·2^9 - 1 = 3·512 - 1 = 1536 - 1 = 1535.",
    hints: [
      "Find the characteristic equation and its roots, 1 and 2.",
      "The closed form is a(n) = 3·2^(n-1) − 1 — check it against a1 and a2, then evaluate at n=10.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-05",
    question: "How many ordered pairs of positive integers (x, y) satisfy x² + y² = 650?",
    format: "INTEGER",
    answer: "6",
    solution:
      "Since 650 = 2·5²·13, and both 5 and 13 are primes congruent to 1 (mod 4), 650 is representable as a sum of two squares in multiple ways. Checking all x from 1 to 25 (since x² < 650): x=5 gives y²=625, y=25; x=11 gives y²=529, y=23; x=17 gives y²=361, y=19; and by symmetry x=19,23,25 give the mirrored pairs. This gives the 6 ordered pairs (5,25), (11,23), (17,19), (19,17), (23,11), (25,5).",
    hints: [
      "Search x from 1 up to ⌊√650⌋ and check whether 650 − x² is a perfect square.",
      "Remember that (x,y) and (y,x) are counted as different ordered pairs.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-06",
    question:
      "What is the smallest positive integer n such that n ≡ 4 (mod 9), n ≡ 7 (mod 11), and n ≡ 1 (mod 13)?",
    format: "INTEGER",
    answer: "40",
    solution:
      "By the Chinese Remainder Theorem, since 9, 11, 13 are pairwise coprime, there's a unique solution modulo 9·11·13 = 1287. Checking n=40: 40 = 9·4+4 ✓, 40 = 11·3+7 ✓, 40 = 13·3+1 ✓. Since 40 satisfies all three congruences and 0 < 40 < 1287, it is the smallest positive solution.",
    hints: [
      "The moduli 9, 11, 13 are pairwise coprime, so the Chinese Remainder Theorem guarantees a unique solution mod 1287.",
      "Try building up the solution two congruences at a time, or verify a small candidate directly.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-07",
    question:
      "A function f on positive integers satisfies f(1) = 1, f(2n) = f(n), and f(2n+1) = f(n) + 1 for all n ≥ 1. What is f(2024)?",
    format: "INTEGER",
    answer: "7",
    solution:
      "By induction, f(n) equals the number of 1's in the binary representation of n (each even step keeps the digit count the same by dropping a trailing 0, each odd step drops a trailing 1 and decreases the count by exactly 1, matching f(2n+1)=f(n)+1). Since 2024 in binary is 11111101000, which has seven 1's, f(2024) = 7.",
    hints: [
      "Track what happens to the binary representation of n under each of the two rules.",
      "The function counts the number of 1's in the binary expansion — convert 2024 to binary and count.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-08",
    question:
      "Positive reals a, b, c satisfy abc = 1. What is the minimum possible value of (a+b)(b+c)(c+a)?",
    format: "INTEGER",
    answer: "8",
    solution:
      "By AM-GM, a+b ≥ 2√(ab), b+c ≥ 2√(bc), c+a ≥ 2√(ca). Multiplying these three inequalities gives (a+b)(b+c)(c+a) ≥ 8√(ab)·√(bc)·√(ca) = 8√((abc)²) = 8·abc = 8. Equality holds when a=b=c, which combined with abc=1 gives a=b=c=1. So the minimum is 8.",
    hints: [
      "Apply AM-GM to each of the three factors a+b, b+c, c+a separately.",
      "Multiply the three resulting inequalities together and simplify using abc = 1.",
    ],
    difficulty: 9,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-09",
    question:
      "From external point P, a tangent to a circle has length 12. A secant from P meets the circle at points A and B (A closer to P) with AB = 7. What is PA?",
    format: "INTEGER",
    answer: "9",
    solution:
      "By the power of a point, PA · PB = (tangent length)², and PB = PA + AB = PA + 7. So PA(PA+7) = 144, giving PA² + 7·PA - 144 = 0. The discriminant is 49 + 576 = 625 = 25², so PA = (-7+25)/2 = 9. (Check: PB = 16, and 9·16 = 144 = 12².)",
    hints: [
      "Use the power of a point relation: PA · PB equals the square of the tangent length.",
      "Write PB in terms of PA and AB, then solve the resulting quadratic.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-10",
    question: "How many positive divisors of 12! are perfect cubes?",
    format: "INTEGER",
    answer: "8",
    solution:
      "The prime factorization of 12! is 2^10 · 3^5 · 5^2 · 7^1 · 11^1. A divisor is a perfect cube exactly when every prime's exponent in the divisor is a multiple of 3 and at most the exponent in 12!. For 2^10, the exponent can be 0,3,6,9 (4 choices); for 3^5, it can be 0,3 (2 choices); for 5^2, only 0 (1 choice); for 7^1 and 11^1, only 0 (1 choice each). Total: 4·2·1·1·1 = 8.",
    hints: [
      "Find the prime factorization of 12! first.",
      "For each prime, count how many multiples of 3 (including 0) fit within its exponent, then multiply these counts.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-11",
    question:
      "What is the maximum number of subsets of a 6-element set such that no one subset among them is contained in another?",
    format: "INTEGER",
    answer: "20",
    solution:
      "This is a direct application of Sperner's theorem, which states that the largest antichain in the subset lattice of an n-element set has size C(n, ⌊n/2⌋). For n=6, this is C(6,3) = 20, achieved by taking all 3-element subsets (no 3-element subset contains another).",
    hints: [
      "This is exactly the setting of Sperner's theorem on antichains of subsets.",
      "The extremal family is all subsets of the middle size, ⌊n/2⌋.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "egmo",
  },
  {
    slug: "egmo-12",
    question:
      "Positive integers a, b with a, b ≤ 100 satisfy a² + b² = 5ab - 3. What is the sum of all distinct possible values of a + b?",
    format: "INTEGER",
    answer: "140",
    solution:
      "Direct search over a, b ≤ 100 finds the solutions (1,1), (1,4), (4,1), (4,19), (19,4), (19,91), (91,19) — a Vieta-jumping chain where consecutive terms satisfy x_(k+1) = 5x_k - x_(k-1) (starting 1, 1, 4, 19, 91, and the next term 436 exceeds 100). The distinct values of a+b among these pairs are 2, 5, 23, and 110. Their sum is 2+5+23+110 = 140.",
    hints: [
      "Search small solutions directly; they form a chain generated by a Vieta-jumping-style recursion.",
      "List every distinct value of a+b that occurs among pairs with both coordinates at most 100, then add them once each.",
    ],
    difficulty: 10,
    topicSlug: "advanced-olympiad",
    competitionSlug: "egmo",
  },
];
