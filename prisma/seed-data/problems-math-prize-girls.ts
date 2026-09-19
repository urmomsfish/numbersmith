import type { ProblemSeed } from "./problems";

/**
 * Hand-written problems styled after Math Prize for Girls (individual round):
 * 20 questions, 120 minutes, short-answer with clean numeric/fraction/exact
 * forms (not restricted to 0-999 like AIME). Difficulty sits at "AIME-and-
 * beyond" (7-10), roughly increasing across the set. Every answer here was
 * independently re-derived and, where the fastest reliable check was
 * enumeration (divisor counts, small Diophantine solutions, inclusion-
 * exclusion), verified by brute force rather than by inspection alone.
 *
 * All problems are original NumberSmith content, written to match the
 * contest's style and difficulty band. None are transcribed from any real
 * Math Prize for Girls competition.
 *
 * Seeded as practice (isPlacement: false), same as OLYMPIAD_PROBLEMS.
 */
export const MATH_PRIZE_FOR_GIRLS_PROBLEMS: ProblemSeed[] = [
  {
    slug: "mpfg-01",
    question:
      "The two roots of x^2 - 14x + k = 0 differ by 8. What is the value of k?",
    format: "SHORT_ANSWER",
    answer: "33",
    solution:
      "Let the roots be r and r + 8. Their sum is 2r + 8 = 14, so r = 3 and the roots are 3 and 11. Then k equals the product of the roots, 3 × 11 = 33.",
    hints: [
      "Write the two roots as r and r + 8, and use the fact that their sum equals 14.",
      "Once you know both roots, k is their product.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-02",
    question:
      "What is the smallest positive integer that is divisible by 6 and has exactly 10 positive divisors?",
    format: "SHORT_ANSWER",
    answer: "48",
    solution:
      "10 factors only as 10 × 1 or 2 × 5, so a number with exactly 10 divisors has prime factorization p^9 or p^4 · q. Since the number must be divisible by 6, it needs both primes 2 and 3, ruling out p^9. Using p^4 · q with the exponents on 2 and 3, the two options are 2^4 · 3 = 48 and 2 · 3^4 = 162; the smaller is 48. Checking every multiple of 6 up to 48 (6, 12, 18, 24, 30, 36, 42) confirms none of them has exactly 10 divisors, so 48 is indeed the smallest.",
    hints: [
      "10 divisors forces the prime factorization to be p^9 or p^4 · q; only the second form can include both 2 and 3.",
      "To be divisible by 6, the number needs both 2 and 3 as prime factors — figure out which one should carry the exponent of 4.",
    ],
    difficulty: 7,
    topicSlug: "divisibility",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-03",
    question:
      "A menu has 5 appetizers, 6 main courses, and 4 desserts. A balanced meal consists of one item from each course, except the meal may not pair the (unique) spicy appetizer with the (unique) spicy dessert. How many different balanced meals are possible?",
    format: "SHORT_ANSWER",
    answer: "114",
    solution:
      "With no restriction, there are 5 × 6 × 4 = 120 meals. The forbidden meals fix the spicy appetizer and spicy dessert but allow any of the 6 mains, giving 1 × 6 × 1 = 6 forbidden meals. So the count is 120 − 6 = 114.",
    hints: [
      "First count all meals with no restriction at all.",
      "Then subtract only the meals that use both the spicy appetizer and the spicy dessert together.",
    ],
    difficulty: 7,
    topicSlug: "counting-principles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-04",
    question:
      "Triangle ABC has AB = 13, BC = 14, and CA = 15. Let H be the foot of the altitude from A to BC. What is the length of AH?",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Heron's formula with s = (13+14+15)/2 = 21, the area is √(21·8·7·6) = √7056 = 84. Since area = (1/2)·BC·AH, we get 84 = (1/2)(14)(AH), so AH = 168/14 = 12.",
    hints: [
      "Use Heron's formula to find the area of the triangle first.",
      "The altitude from A relates to the area through Area = (1/2) · BC · AH.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-05",
    question:
      "A fair coin is flipped 6 times. What is the probability that at least 4 of the flips come up heads? Give your answer as a fraction in lowest terms.",
    format: "SHORT_ANSWER",
    answer: "11/32",
    solution:
      "The favorable outcomes are exactly 4, 5, or 6 heads: C(6,4) + C(6,5) + C(6,6) = 15 + 6 + 1 = 22, out of 2^6 = 64 total outcomes. That's 22/64 = 11/32.",
    hints: [
      "Break the event into the three cases: exactly 4, exactly 5, or exactly 6 heads.",
      "Add the binomial coefficients for those cases and divide by 2^6.",
    ],
    difficulty: 7,
    topicSlug: "basic-probability",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-06",
    question:
      "A sequence satisfies a_1 = 2, and for n ≥ 1, a_{n+1} = a_n + 2n + 1. What is a_10?",
    format: "SHORT_ANSWER",
    answer: "101",
    solution:
      "Summing the recurrence from 1 to n−1 gives a_n = a_1 + Σ_{k=1}^{n-1}(2k+1) = 2 + [(n-1)n + (n-1)] = 2 + (n-1)(n+1) = n^2 + 1. So a_10 = 100 + 1 = 101.",
    hints: [
      "Sum the increments 2k+1 from k = 1 to n−1 to get a closed form for a_n.",
      "The closed form simplifies to a nice polynomial in n — try to spot it as n^2 + 1.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-07",
    question: "What is the remainder when 7^100 is divided by 101?",
    format: "SHORT_ANSWER",
    answer: "1",
    solution:
      "101 is prime and gcd(7, 101) = 1, so by Fermat's Little Theorem, 7^100 ≡ 1 (mod 101). The remainder is 1.",
    hints: [
      "101 is prime — think about what Fermat's Little Theorem says about a^(p-1) mod p.",
      "Check that the exponent 100 is exactly p − 1 for p = 101.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-08",
    question:
      "Two circles, of radii 3 and 5, have centers 10 apart. A line is drawn tangent to both circles on the same side (a common external tangent). What is the length of the segment of this line between the two points of tangency?",
    format: "SHORT_ANSWER",
    answer: "4√6",
    solution:
      "For two circles with radii r1, r2 and center distance d, the length of a common external tangent segment is √(d² − (r1 − r2)²). Here that's √(100 − 4) = √96 = 4√6.",
    hints: [
      "Drop a perpendicular from the smaller circle's center to the radius of the larger circle at the tangent point to form a right triangle.",
      "The legs of that right triangle are the tangent length and (r1 − r2), with hypotenuse d.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-09",
    question:
      "How many ways are there to choose 3 numbers from {1, 2, 3, …, 20} such that no two of the chosen numbers differ by exactly 1?",
    format: "SHORT_ANSWER",
    answer: "816",
    solution:
      "Choosing k pairwise non-adjacent numbers from {1, …, n} is a standard bijection to choosing k numbers from {1, …, n-k+1} (shift each chosen value down by the number of smaller chosen values), giving C(n-k+1, k) ways. With n = 20, k = 3, that's C(18,3) = 816.",
    hints: [
      "This is equivalent to placing 3 non-adjacent items among 20 positions — try the standard 'gap' substitution that turns it into an unrestricted combination count.",
      "The formula for choosing k non-consecutive numbers from {1,...,n} is C(n-k+1, k).",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-10",
    question:
      "A function f satisfies f(x) + 2f(1 - x) = x^2 for all real x. What is f(4)?",
    format: "SHORT_ANSWER",
    answer: "2/3",
    solution:
      "Plug in x = 4: f(4) + 2f(-3) = 16. Plug in x = -3: f(-3) + 2f(4) = 9. Multiply the second equation by 2: 2f(-3) + 4f(4) = 18. Subtracting the first equation from this gives 3f(4) = 2, so f(4) = 2/3.",
    hints: [
      "Substitute x = 4 and then x = 1 - 4 = -3 to get two equations in f(4) and f(-3).",
      "Eliminate f(-3) by combining the two equations.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-11",
    question:
      "How many ordered pairs of positive integers (x, y) satisfy 3x + 5y = 100?",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "Solving for x: x = (100 - 5y)/3, which requires 100 - 5y ≡ 0 (mod 3), i.e. y ≡ 2 (mod 3). Positive y with 5y < 100 (so x > 0) means y ranges over 1..19; the values y ≡ 2 (mod 3) in that range are 2, 5, 8, 11, 14, 17 — six values, each giving a positive integer x (30, 25, 20, 15, 10, 5 respectively).",
    hints: [
      "Solve for x in terms of y and find the congruence condition on y mod 3 that makes x an integer.",
      "Count how many positive y below 20 (needed for x to stay positive) satisfy that congruence.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-12",
    question:
      "A line passes through (2, 3) and (8, 11). This line intersects the parabola y = x^2 - 6x + 10 at two points. What is the sum of the x-coordinates of these two points?",
    format: "SHORT_ANSWER",
    answer: "22/3",
    solution:
      "The line has slope (11-3)/(8-2) = 4/3, so its equation is y = (4/3)x + 1/3. Setting this equal to the parabola: x^2 - 6x + 10 = (4/3)x + 1/3. Multiplying by 3: 3x^2 - 18x + 30 = 4x + 1, so 3x^2 - 22x + 29 = 0. By Vieta's formulas, the sum of the roots is 22/3.",
    hints: [
      "Find the equation of the line first, then set it equal to the parabola's equation.",
      "You don't need to solve the resulting quadratic — Vieta's formula gives the sum of roots directly from its coefficients.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-13",
    question:
      "How many 4-digit numbers (from 1000 to 9999) have digits that are strictly increasing from left to right?",
    format: "SHORT_ANSWER",
    answer: "126",
    solution:
      "A strictly increasing string of digits can never contain 0 (0 could only be the smallest digit, which would force it to the leftmost/leading position, which isn't allowed for a 4-digit number). So the digits are 4 distinct values from {1,...,9}, and each such set of 4 values corresponds to exactly one strictly increasing arrangement. That's C(9,4) = 126.",
    hints: [
      "Argue that 0 can never appear in such a number.",
      "Each set of 4 distinct digits from {1,...,9} gives exactly one valid number — there's only one way to arrange them in increasing order.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-14",
    question:
      "A fair six-sided die is rolled repeatedly until each of the numbers 1, 2, and 3 has appeared at least once. (Rolls showing 4, 5, or 6 still count toward the total number of rolls, but do not make progress toward the goal.) What is the expected total number of rolls?",
    format: "SHORT_ANSWER",
    answer: "11",
    solution:
      "Track the number of distinct values from {1,2,3} seen so far: k = 0, 1, or 2. From state k, a roll makes progress (reveals a new value from {1,2,3}) with probability (3-k)/6, so the expected number of rolls to leave state k is 6/(3-k). Summing over k = 0, 1, 2: 6/3 + 6/2 + 6/1 = 2 + 3 + 6 = 11.",
    hints: [
      "Track how many of {1, 2, 3} have been seen so far, and think of the expected wait to see a new one from each state.",
      "From a state where k of the three values have been seen, the chance a given roll reveals a new one is (3-k)/6.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-15",
    question:
      "The polynomial P(x) = x^3 - 7x^2 + kx - 8 has three positive integer roots. What is the sum of the squares of the three roots?",
    format: "SHORT_ANSWER",
    answer: "21",
    solution:
      "By Vieta's formulas, the roots sum to 7 and multiply to 8. The only triple of positive integers with product 8 and sum 7 is {1, 2, 4} (the other factorizations of 8 into three positive integers, {1,1,8} and {2,2,2}, sum to 10 and 6). So the sum of squares is 1^2 + 2^2 + 4^2 = 1 + 4 + 16 = 21.",
    hints: [
      "Use Vieta's formulas to find the sum and product of the three roots.",
      "List the ways to write 8 as a product of three positive integers and check which one has the right sum.",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-16",
    question:
      "What is the sum of all prime numbers p such that both p^2 + 20 and p^2 + 38 are prime?",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "For any prime p ≠ 3, p is not divisible by 3, so p^2 ≡ 1 (mod 3). Then p^2 + 20 ≡ 1 + 20 ≡ 0 (mod 3) and p^2 + 38 ≡ 1 + 38 ≡ 0 (mod 3), and since both values exceed 3, they're composite. So only p = 3 can possibly work. Checking: 3^2 + 20 = 29 (prime) and 3^2 + 38 = 47 (prime). So p = 3 is the only solution, and the sum is 3.",
    hints: [
      "For primes p other than 3, consider p^2 modulo 3 — every such prime gives the same residue.",
      "That residue argument rules out every prime except 3, so just check p = 3 directly.",
    ],
    difficulty: 9,
    topicSlug: "primes",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-17",
    question:
      "In triangle ABC, D is on AB and E is on AC with DE parallel to BC. AD = 6, DB = 4, and the area of triangle ADE is 27. What is the area of quadrilateral DBCE?",
    format: "SHORT_ANSWER",
    answer: "48",
    solution:
      "Since DE ∥ BC, triangle ADE ~ triangle ABC with ratio AD/AB = 6/10 = 3/5. Areas of similar triangles scale with the square of the ratio, so [ABC] = [ADE] · (5/3)^2 = 27 · 25/9 = 75. The quadrilateral DBCE is the rest of the triangle: 75 - 27 = 48.",
    hints: [
      "Triangle ADE is similar to triangle ABC — find the similarity ratio using AD and AB.",
      "The area ratio between similar triangles is the square of the side ratio; use it to find the whole triangle's area, then subtract.",
    ],
    difficulty: 9,
    topicSlug: "similarity-congruence",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-18",
    question:
      "What is the smallest number of integers that must be selected from {1, 2, 3, …, 30} to guarantee that two of the selected integers differ by exactly 5?",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "Group {1,...,30} by residue mod 5 into 5 chains of 6 numbers each (e.g. 1,6,11,16,21,26), where consecutive numbers in a chain differ by 5. Within a chain of 6, the largest subset with no two adjacent (differing by 5) has size ceil(6/2) = 3 — e.g. positions 1, 3, 5. So the largest selection avoiding any pair that differs by 5 has 5 × 3 = 15 numbers. One more forces a pair differing by 5, so the answer is 16.",
    hints: [
      "Group the numbers by residue mod 5 — within each group, consecutive terms differ by exactly 5.",
      "In each group of 6 numbers, find the largest subset with no two adjacent terms, then figure out how many total numbers that allows before a violation is forced.",
    ],
    difficulty: 9,
    topicSlug: "pigeonhole",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-19",
    question:
      "A row of 2024 lightbulbs starts all off. Each move, you either pick two currently off bulbs and turn both on, or pick two currently on bulbs and turn both off. What is the minimum number of moves needed to reach a state where all 2024 bulbs are on?",
    format: "SHORT_ANSWER",
    answer: "1012",
    solution:
      "Each move changes the number of bulbs that are on by exactly +2 or -2, so the count of on-bulbs stays even at every step, consistent with going from 0 to 2024 (both even). To minimize moves, never use a -2 move: simply turn on two off bulbs each time, which requires 2024/2 = 1012 moves, and this is clearly the minimum since each move can increase the on-count by at most 2.",
    hints: [
      "Notice that every move changes the number of on bulbs by exactly ±2 — think about what that means for parity and for the minimum number of +2 moves needed.",
      "You never need to use a move that turns bulbs off if your goal is only to turn everything on as fast as possible.",
    ],
    difficulty: 9,
    topicSlug: "invariants",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-20",
    question: "If x + 1/x = 5, what is x^3 + 1/x^3?",
    format: "SHORT_ANSWER",
    answer: "110",
    solution:
      "Cube the identity: (x + 1/x)^3 = x^3 + 1/x^3 + 3(x + 1/x). So x^3 + 1/x^3 = (x+1/x)^3 - 3(x+1/x) = 5^3 - 3(5) = 125 - 15 = 110.",
    hints: [
      "Cube the equation x + 1/x = 5 and expand — the cross terms will combine nicely.",
      "The expansion of (x+1/x)^3 contains both x^3 + 1/x^3 and a multiple of (x + 1/x).",
    ],
    difficulty: 9,
    topicSlug: "exponents-radicals",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-21",
    question:
      "What is the greatest common divisor of 3^100 - 1 and 3^60 - 1?",
    format: "SHORT_ANSWER",
    answer: "3486784400",
    solution:
      "There's a standard identity: gcd(a^m - 1, a^n - 1) = a^gcd(m,n) - 1. Here gcd(100, 60) = 20, so the answer is 3^20 - 1. Since 3^10 = 59049, 3^20 = 59049^2 = 3,486,784,401, so 3^20 - 1 = 3,486,784,400.",
    hints: [
      "Recall (or derive via the Euclidean algorithm on exponents) that gcd(a^m-1, a^n-1) = a^gcd(m,n) - 1.",
      "Find gcd(100, 60) first, then just compute the one power of 3 you need.",
    ],
    difficulty: 9,
    topicSlug: "factorization",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-22",
    question:
      "A right circular cone has base radius 6 and height 8. A plane parallel to the base cuts off a smaller cone from the apex whose volume is 1/8 of the original cone's volume. What is the volume of the remaining frustum (the bottom piece)? Give your answer in terms of π.",
    format: "SHORT_ANSWER",
    answer: "84π",
    solution:
      "The full cone has volume (1/3)π(6²)(8) = 96π. The small cone cut from the apex is similar to the whole cone with volume ratio 1/8, so its linear scale factor is (1/8)^(1/3) = 1/2, and its volume is (1/8)(96π) = 12π. The frustum is what remains: 96π - 12π = 84π.",
    hints: [
      "Start by computing the volume of the entire cone.",
      "The small cone at the top is similar to the whole cone — use the given volume ratio to find its volume directly, then subtract.",
    ],
    difficulty: 10,
    topicSlug: "area-volume",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-23",
    question:
      "How many integers from 1 to 1000 are divisible by none of 3, 5, or 7?",
    format: "SHORT_ANSWER",
    answer: "457",
    solution:
      "By inclusion-exclusion: |mult of 3| + |mult of 5| + |mult of 7| = 333 + 200 + 142 = 675. |mult of 15| + |mult of 21| + |mult of 35| = 66 + 47 + 28 = 141. |mult of 105| = 9. So |divisible by 3, 5, or 7| = 675 - 141 + 9 = 543. The count divisible by none is 1000 - 543 = 457.",
    hints: [
      "Use inclusion-exclusion on the three sets of multiples of 3, 5, and 7 within 1 to 1000.",
      "Don't forget the triple overlap (multiples of 105) needs to be added back once.",
    ],
    difficulty: 10,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-24",
    question:
      "Positive real numbers x, y, z satisfy x + y + z = 12 and xy + yz + zx = 45. What is the maximum possible value of xyz?",
    format: "SHORT_ANSWER",
    answer: "54",
    solution:
      "Treat x, y, z as roots of t^3 - 12t^2 + 45t - p = 0 where p = xyz. For fixed sum and pairwise-sum, the extreme values of the product occur when two of the variables are equal. Setting x = y = a and z = 12 - 2a, the second condition gives a^2 + 2a(12-2a) = 45, i.e. -3a^2 + 24a - 45 = 0, or a^2 - 8a + 15 = 0, so a = 3 or a = 5. For a = 3: z = 6, product = 3·3·6 = 54. For a = 5: z = 2, product = 5·5·2 = 50. Both are valid critical configurations (positive reals satisfying both constraints); the larger is 54, so the maximum value of xyz is 54.",
    hints: [
      "Extremes of xyz under a fixed sum and fixed pairwise-sum occur when two of the three variables are equal — try setting x = y.",
      "Substituting x = y = a and z = 12 - 2a into the second equation gives a quadratic in a with two solutions; compare the resulting products.",
    ],
    difficulty: 10,
    topicSlug: "inequalities",
    competitionSlug: "math-prize-for-girls",
  },

{
    slug: "mpfg-25",
    question:
      "The equation x^2 - mx + 24 = 0 has two positive integer roots whose difference is 5. What is m?",
    format: "SHORT_ANSWER",
    answer: "11",
    solution:
      "The roots multiply to 24 and differ by 5. Checking factor pairs of 24: (1,24) differs by 23, (2,12) by 10, (3,8) by 5, (4,6) by 2. Only (3,8) has difference 5. So the roots are 3 and 8, and m is their sum: 3 + 8 = 11.",
    hints: [
      "The product of the roots is 24 (the constant term) — list the factor pairs of 24.",
      "Find the pair whose difference is exactly 5, then m is just the sum of that pair.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-26",
    question:
      "Isosceles triangle ABC has AB = AC = 25 and BC = 48. What is the area of triangle ABC?",
    format: "SHORT_ANSWER",
    answer: "168",
    solution:
      "Drop the altitude from A to BC; by symmetry it bisects BC, hitting it at its midpoint M with BM = 24. Then AM = √(25² − 24²) = √(625 − 576) = √49 = 7. The area is (1/2)·BC·AM = (1/2)(48)(7) = 168.",
    hints: [
      "The altitude from the apex of an isosceles triangle bisects the base — this creates a right triangle with legs AM and 24.",
      "Use the Pythagorean theorem on that right triangle to find the height, then compute the area.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-27",
    question: "What is the remainder when 2^50 is divided by 13?",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "Compute powers of 2 mod 13: 2^1=2, 2^2=4, 2^3=8, 2^4=16≡3, 2^6=2^4·2^2≡3·4=12≡−1 (mod 13). So 2 has order 12 mod 13. Since 50 = 4·12 + 2, 2^50 ≡ (2^12)^4 · 2^2 ≡ 1^4 · 4 ≡ 4 (mod 13).",
    hints: [
      "Look for a small power of 2 that's congruent to ±1 mod 13 to find the order of 2 modulo 13.",
      "Once you know the order, reduce the exponent 50 modulo that order.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-28",
    question:
      "A password consists of 4 characters: the first two are distinct letters chosen from {A, B, C, D, E}, and the last two are distinct digits chosen from {0, 1, ..., 9}. How many different passwords are possible?",
    format: "SHORT_ANSWER",
    answer: "1800",
    solution:
      "The first two characters: 5 choices for the first letter and 4 remaining for the second, giving 5 × 4 = 20 ways. The last two characters: 10 choices for the first digit and 9 remaining for the second, giving 10 × 9 = 90 ways. Total passwords: 20 × 90 = 1800.",
    hints: [
      "Count the letter part and digit part separately, using the multiplication rule for ordered selections without repetition.",
      "Multiply the two counts together.",
    ],
    difficulty: 7,
    topicSlug: "counting-principles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-29",
    question: "If x + y = 10 and x^2 + y^2 = 58, what is xy?",
    format: "SHORT_ANSWER",
    answer: "21",
    solution:
      "Since (x+y)^2 = x^2 + 2xy + y^2, we have 100 = 58 + 2xy, so 2xy = 42 and xy = 21.",
    hints: [
      "Square the equation x + y = 10 and compare it to the given value of x^2 + y^2.",
      "The difference between (x+y)^2 and x^2+y^2 is exactly 2xy.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-30",
    question:
      "A circle has area 100π. A chord of the circle lies 6 units from the center. What is the length of the chord?",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "From area 100π = πr², the radius is r = 10. The perpendicular from the center to the chord, half the chord, and the radius form a right triangle, so the half-chord length is √(10² − 6²) = √64 = 8. The full chord is 16.",
    hints: [
      "Find the radius from the given area first.",
      "The radius, the distance to the chord, and half the chord form a right triangle.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-31",
    question:
      "How many ordered pairs of positive integers (x, y) satisfy 4x + 7y = 91?",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "Solving for x: x = (91 − 7y)/4, which requires 91 − 7y ≡ 0 (mod 4). Since 91 ≡ 3 and 7 ≡ 3 (mod 4), this becomes 3 − 3y ≡ 0 (mod 4), i.e. y ≡ 1 (mod 4). Positive y with 7y < 91 means y ranges over 1 to 12, and the values y ≡ 1 (mod 4) in that range are 1, 5, 9 — three values, giving x = 21, 14, 7 respectively, all positive integers.",
    hints: [
      "Solve for x in terms of y and find the congruence condition on y modulo 4 that keeps x an integer.",
      "Count the valid positive values of y below 13 (needed to keep x positive) satisfying that congruence.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-32",
    question:
      "How many ways can the letters of the word NUMBER be arranged so that the letters U and E are not adjacent?",
    format: "SHORT_ANSWER",
    answer: "480",
    solution:
      "NUMBER has 6 distinct letters, so there are 6! = 720 total arrangements. Treating U and E as glued together as a single block gives 5! × 2 = 240 arrangements where they are adjacent (the factor of 2 accounts for the two orders UE and EU). So the arrangements with U and E not adjacent number 720 − 240 = 480.",
    hints: [
      "Count all 6! arrangements, then count the arrangements where U and E are stuck together as a block.",
      "Subtract the adjacent count from the total.",
    ],
    difficulty: 7,
    topicSlug: "permutations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-33",
    question:
      "An arithmetic sequence has first term 7 and 15th term 91. What is the sum of the first 15 terms?",
    format: "SHORT_ANSWER",
    answer: "735",
    solution:
      "The sum of the first n terms of an arithmetic sequence equals n times the average of the first and last terms. Here that's 15 × (7 + 91)/2 = 15 × 49 = 735.",
    hints: [
      "You don't need the common difference — the sum only depends on the first term, last term, and number of terms.",
      "Use Sum = n × (first + last)/2.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-34",
    question:
      "What is the distance from the point (3, 4) to the line 5x - 12y + 26 = 0?",
    format: "SHORT_ANSWER",
    answer: "7/13",
    solution:
      "The distance from a point (x0,y0) to a line ax+by+c=0 is |ax0+by0+c|/√(a²+b²). Here that's |5(3) − 12(4) + 26|/√(25+144) = |15 − 48 + 26|/13 = |−7|/13 = 7/13.",
    hints: [
      "Use the point-to-line distance formula |ax0 + by0 + c| / √(a² + b²).",
      "Carefully compute the numerator before taking the absolute value.",
    ],
    difficulty: 7,
    topicSlug: "coordinate-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-35",
    question: "What is the units digit of 7^2023?",
    format: "SHORT_ANSWER",
    answer: "3",
    solution:
      "The units digits of powers of 7 cycle with period 4: 7, 9, 3, 1, 7, 9, 3, 1, .... Since 2023 = 4 × 505 + 3, the units digit of 7^2023 matches the 3rd term in the cycle, which is 3.",
    hints: [
      "Compute the units digits of 7^1, 7^2, 7^3, 7^4, ... and notice they repeat.",
      "Find 2023 mod 4 to locate the position in the cycle.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-36",
    question:
      "In how many ways can 5 distinct books be distributed among 3 distinct students so that every student gets at least one book?",
    format: "SHORT_ANSWER",
    answer: "150",
    solution:
      "This counts surjections from a 5-element set to a 3-element set. The number of such surjections is 3! · S(5,3), where S(5,3) is the Stirling number of the second kind counting ways to partition 5 distinct items into 3 nonempty unlabeled groups. S(5,3) = 25, so the count is 6 × 25 = 150.",
    hints: [
      "First count the ways to partition the 5 books into 3 nonempty unlabeled groups (a Stirling number of the second kind).",
      "Then multiply by 3! to account for assigning those groups to the 3 distinct students.",
    ],
    difficulty: 7,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-37",
    question: "If 2^x = 5^y = 1000, what is 1/x + 1/y?",
    format: "SHORT_ANSWER",
    answer: "1/3",
    solution:
      "From 2^x = 1000, x = log_2(1000), so 1/x = log_1000(2). Similarly 1/y = log_1000(5). Adding, 1/x + 1/y = log_1000(2) + log_1000(5) = log_1000(10) = 1/3, since 1000 = 10^3.",
    hints: [
      "If a^x = N, then 1/x = log_N(a) — rewrite both reciprocals as logarithms base 1000.",
      "Add the two logarithms using the product rule: log_1000(2) + log_1000(5) = log_1000(10).",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-38",
    question:
      "A square has diagonal length 10√2. What is the square's perimeter?",
    format: "SHORT_ANSWER",
    answer: "40",
    solution:
      "For a square with side s, the diagonal has length s√2. Setting s√2 = 10√2 gives s = 10. The perimeter is 4s = 40.",
    hints: [
      "Relate the diagonal to the side length using the Pythagorean theorem (or the standard diagonal = side × √2 fact).",
      "Once you have the side length, the perimeter is just 4 times that.",
    ],
    difficulty: 7,
    topicSlug: "geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-39",
    question:
      "What is the smallest positive integer n such that n! is divisible by 2^10?",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Legendre's formula, the exponent of 2 in n! is ⌊n/2⌋ + ⌊n/4⌋ + ⌊n/8⌋ + .... For n = 11: 5 + 2 + 1 = 8, which is less than 10. For n = 12: 6 + 3 + 1 = 10, which meets the requirement. So the smallest such n is 12.",
    hints: [
      "Use Legendre's formula to compute the exponent of 2 dividing n! for candidate values of n.",
      "Check n = 11 (too small) and then n = 12.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-40",
    question:
      "A committee of 4 people is chosen from a group of 6 men and 5 women. How many such committees include at least 2 women?",
    format: "SHORT_ANSWER",
    answer: "215",
    solution:
      "The total number of 4-person committees from 11 people is C(11,4) = 330. Committees with 0 women: C(6,4) = 15. Committees with exactly 1 woman: C(5,1)·C(6,3) = 5 × 20 = 100. Subtracting these from the total: 330 − 15 − 100 = 215.",
    hints: [
      "It's easier to subtract the complementary cases (0 or 1 woman) from the total number of committees.",
      "Compute C(11,4), then C(6,4) for zero women and C(5,1)·C(6,3) for exactly one woman.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-41",
    question:
      "The polynomial x^3 - 6x^2 + 11x - 6 has roots r, s, t. What is r^2 + s^2 + t^2?",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "By Vieta's formulas, r + s + t = 6 and rs + st + tr = 11. Since (r+s+t)^2 = r^2+s^2+t^2 + 2(rs+st+tr), we get r^2+s^2+t^2 = 36 − 2(11) = 36 − 22 = 14.",
    hints: [
      "Use Vieta's formulas to read off the sum of the roots and the sum of pairwise products from the coefficients.",
      "Square the sum of the roots and subtract twice the pairwise-product sum.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-42",
    question:
      "Two parallel chords of a circle of radius 10 lie on opposite sides of the center. One chord has length 12 and the other has length 16. What is the distance between the two chords?",
    format: "SHORT_ANSWER",
    answer: "14",
    solution:
      "For a chord of length L in a circle of radius r, the distance from the center is √(r² − (L/2)²). For the length-12 chord: √(100 − 36) = 8. For the length-16 chord: √(100 − 64) = 6. Since the chords are on opposite sides of the center, the distance between them is the sum: 8 + 6 = 14.",
    hints: [
      "For each chord, use the right triangle formed by the radius, half the chord, and the distance from the center.",
      "Since the chords are on opposite sides of the center, add the two distances rather than subtracting.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-43",
    question:
      "How many positive divisors of 2^3 · 3^5 · 5^2 are perfect squares?",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "A divisor 2^a·3^b·5^c (with 0≤a≤3, 0≤b≤5, 0≤c≤2) is a perfect square exactly when a, b, c are all even. The even values available are a ∈ {0,2} (2 choices), b ∈ {0,2,4} (3 choices), c ∈ {0,2} (2 choices). The count is 2 × 3 × 2 = 12.",
    hints: [
      "A divisor is a perfect square exactly when every exponent in its prime factorization is even.",
      "Count the even choices available for each exponent separately, then multiply.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-44",
    question:
      "How many 5-digit numbers (from 10000 to 99999) have digits that sum to 43?",
    format: "SHORT_ANSWER",
    answer: "15",
    solution:
      "The maximum possible digit sum for a 5-digit number is 9×5 = 45 (all digits 9). We need the sum to be 43, a deficiency of 2 from the maximum. Write each digit as 9 minus a nonnegative 'deficiency' e_i, so e_1+...+e_5 = 2, where e_1 ≤ 8 (since the leading digit must stay ≥ 1) and e_2,...,e_5 ≤ 9. Since the total deficiency is only 2, none of these upper bounds can be violated, so this is an unrestricted stars-and-bars count: C(2+4,4) = C(6,4) = 15.",
    hints: [
      "Instead of tracking digit sums directly, track how far each digit falls short of 9 — the shortfalls must sum to 45 − 43 = 2.",
      "With a total shortfall of only 2, none of the individual digit constraints can actually be violated, so this reduces to a simple stars-and-bars count.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-45",
    question:
      "Find all real x satisfying log_2(x) + log_4(x) + log_8(x) = 11, and report x.",
    format: "SHORT_ANSWER",
    answer: "64",
    solution:
      "Let t = log_2(x). Then log_4(x) = t/2 and log_8(x) = t/3. The equation becomes t(1 + 1/2 + 1/3) = 11, i.e. t · (11/6) = 11, so t = 6. Then x = 2^6 = 64.",
    hints: [
      "Convert every logarithm to base 2 using log_{2^k}(x) = log_2(x)/k.",
      "Combine into a single equation in t = log_2(x) and solve.",
    ],
    difficulty: 8,
    topicSlug: "exponents-radicals",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-46",
    question:
      "In right triangle ABC, angle B = 90°, AB = 9, and BC = 12. Points D on AB and E on BC satisfy BD = 3 and BE = 4. What is the area of quadrilateral ADEC (triangle ABC with triangle BDE removed)?",
    format: "SHORT_ANSWER",
    answer: "48",
    solution:
      "The area of triangle ABC is (1/2)(9)(12) = 54. The area of triangle BDE (also right-angled at B) is (1/2)(3)(4) = 6. The quadrilateral ADEC is what remains after removing BDE from ABC: 54 − 6 = 48.",
    hints: [
      "Both ABC and BDE are right triangles with the right angle at B — compute each area directly.",
      "The area of ADEC is simply the difference of the two triangle areas.",
    ],
    difficulty: 8,
    topicSlug: "triangles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-47",
    question:
      "What is the sum of all positive integers n ≤ 100 such that n^2 ≡ 1 (mod 24)?",
    format: "SHORT_ANSWER",
    answer: "1633",
    solution:
      "Since 24 = 8·3, n^2 ≡ 1 (mod 8) holds for every odd n (odd squares are always ≡1 mod 8), and n^2 ≡ 1 (mod 3) holds exactly when n ≡ ±1 (mod 3), i.e. n is not divisible by 3. Combining, n^2 ≡ 1 (mod 24) exactly when gcd(n, 24) = 1. Summing all n from 1 to 100 coprime to 24 gives 1633 (there are 33 such values).",
    hints: [
      "Break the condition mod 24 into mod 8 and mod 3 pieces using the Chinese Remainder Theorem.",
      "Show the condition is equivalent to gcd(n,24) = 1, then sum those n from 1 to 100.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-48",
    question:
      "How many ways are there to tile a 2×10 rectangle using 1×2 dominoes?",
    format: "SHORT_ANSWER",
    answer: "89",
    solution:
      "Let f(n) be the number of tilings of a 2×n rectangle. Conditioning on how the rightmost column is covered gives the recurrence f(n) = f(n-1) + f(n-2), with f(1)=1 and f(2)=2 — this is the Fibonacci recurrence shifted by one index. Computing forward: f(3)=3, f(4)=5, f(5)=8, f(6)=13, f(7)=21, f(8)=34, f(9)=55, f(10)=89.",
    hints: [
      "Set up a recurrence by considering whether the last column is covered by one vertical domino or two horizontal dominoes.",
      "The recurrence is the Fibonacci relation; just compute the first 10 terms.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-49",
    question:
      "For how many integers k does x^2 + kx + 2016 = 0 have two integer roots?",
    format: "SHORT_ANSWER",
    answer: "36",
    solution:
      "If the roots are integers p and q, then pq = 2016 and k = −(p+q). Since 2016 = 2^5·3^2·7 has 36 divisors and is not a perfect square, its divisors pair up into 18 pairs (d, 2016/d) with d < √2016. The function d + 2016/d is strictly decreasing for d < √2016, so these 18 pairs give 18 distinct positive sums. Roots can also both be negative (giving the negatives of these same products but sums that are negatives of the positive-pair sums), yielding 18 more distinct values of p+q, and hence 18 more values of k. In total there are 36 distinct values of k.",
    hints: [
      "If the two integer roots multiply to 2016, k is minus their sum — count the distinct sums achievable over all integer factor pairs of 2016 (both positive and both negative).",
      "2016 is not a perfect square, so its divisors pair up; the function d + 2016/d is strictly decreasing for d below √2016, guaranteeing all these sums are distinct.",
    ],
    difficulty: 8,
    topicSlug: "quadratics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-50",
    question:
      "A right circular cylinder has volume 250π and height 10. What is its lateral surface area?",
    format: "SHORT_ANSWER",
    answer: "100π",
    solution:
      "From V = πr²h = 250π with h=10, we get r² = 25, so r = 5. The lateral surface area is 2πrh = 2π(5)(10) = 100π.",
    hints: [
      "Use the volume formula to solve for the radius first.",
      "Then apply the lateral surface area formula 2πrh.",
    ],
    difficulty: 8,
    topicSlug: "area-volume",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-51",
    question: "What is the remainder when 12! is divided by 13?",
    format: "SHORT_ANSWER",
    answer: "12",
    solution:
      "By Wilson's theorem, for a prime p, (p-1)! ≡ −1 (mod p). With p = 13, 12! ≡ −1 ≡ 12 (mod 13).",
    hints: [
      "13 is prime — recall Wilson's theorem about (p-1)! modulo a prime p.",
      "Convert −1 to a remainder in the range 0 to 12.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-52",
    question:
      "How many distinct arrangements of the letters of MISSISSIPPI have no two I's adjacent?",
    format: "SHORT_ANSWER",
    answer: "7350",
    solution:
      "MISSISSIPPI has 11 letters: M(1), I(4), S(4), P(2). First arrange the 7 non-I letters (M, S, S, S, S, P, P): this can be done in 7!/(4!·2!) = 105 ways. These 7 letters create 8 gaps (including the two ends) in which to place the 4 I's, at most one per gap to keep them non-adjacent: C(8,4) = 70 ways. The total is 105 × 70 = 7350.",
    hints: [
      "Arrange the non-I letters first, then insert the I's into the gaps between them so no two land in the same gap.",
      "Count the non-I arrangements (accounting for repeated S's and P's), count the gap choices, and multiply.",
    ],
    difficulty: 9,
    topicSlug: "permutations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-53",
    question:
      "Positive reals a and b satisfy a + b = 10 and a^3 + b^3 = 370. What is ab?",
    format: "SHORT_ANSWER",
    answer: "21",
    solution:
      "Using a^3+b^3 = (a+b)^3 - 3ab(a+b): 370 = 1000 - 30ab, so 30ab = 630 and ab = 21.",
    hints: [
      "Expand (a+b)^3 in terms of a^3+b^3 and ab(a+b).",
      "Substitute the known values of a+b and a^3+b^3 and solve for ab.",
    ],
    difficulty: 9,
    topicSlug: "algebra",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-54",
    question:
      "In triangle ABC, AB = 7, AC = 9, and BC = 12. What is the length of the angle bisector from A to side BC?",
    format: "SHORT_ANSWER",
    answer: "21/4",
    solution:
      "The angle bisector length formula gives AD² = AB·AC·[1 − (BC/(AB+AC))²]. Substituting: AD² = 7·9·[1 − (12/16)²] = 63·[1 − 9/16] = 63·(7/16) = 441/16. So AD = 21/4.",
    hints: [
      "Use the angle bisector length formula AD² = AB·AC·[1 − (BC/(AB+AC))²].",
      "Simplify the fraction inside the brackets before taking the square root.",
    ],
    difficulty: 9,
    topicSlug: "triangles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-55",
    question:
      "What is the smallest positive integer n such that n^2 + n + 41 is not prime?",
    format: "SHORT_ANSWER",
    answer: "40",
    solution:
      "Euler's famous polynomial n^2 + n + 41 produces a prime for every n = 0, 1, ..., 39. At n = 40: 40^2 + 40 + 41 = 1600 + 40 + 41 = 1681 = 41^2, which is composite. So the smallest such n is 40.",
    hints: [
      "This is a well-known 'prime-generating' polynomial — it stays prime for a surprisingly long stretch of small n.",
      "Try n = 40 and notice the expression factors nicely.",
    ],
    difficulty: 9,
    topicSlug: "number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-56",
    question:
      "A fair 6-sided die is rolled repeatedly until a 6 appears. Let X be the sum of all rolls, including the final 6. What is E[X]?",
    format: "SHORT_ANSWER",
    answer: "21",
    solution:
      "The number of rolls N is a stopping time (whether to stop depends only on rolls seen so far), and each roll is i.i.d. uniform on {1,...,6} with mean 3.5. By Wald's identity, E[X] = E[N]·E[single roll] = E[N]·3.5. Since N is geometric with success probability 1/6, E[N] = 6. So E[X] = 6 × 3.5 = 21.",
    hints: [
      "The number of rolls until the first 6 is a geometric random variable — find its expected value.",
      "Wald's identity says the expected sum equals the expected number of rolls times the expected value of a single roll (3.5), even though the last roll is always a 6.",
    ],
    difficulty: 9,
    topicSlug: "expected-value",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-57",
    question:
      "The roots of x^3 - 9x^2 + 24x - 20 = 0 are p, q, r. What is p^2q + p^2r + q^2p + q^2r + r^2p + r^2q?",
    format: "SHORT_ANSWER",
    answer: "156",
    solution:
      "By Vieta's formulas, p+q+r = 9, pq+qr+rp = 24, pqr = 20. The requested symmetric sum equals (p+q+r)(pq+qr+rp) − 3pqr, since expanding (p+q+r)(pq+qr+rp) produces every term p²q (summed over all ordered pairs of distinct roots) plus 3pqr. So the answer is 9(24) − 3(20) = 216 − 60 = 156.",
    hints: [
      "Expand (p+q+r)(pq+qr+rp) and notice it equals the requested sum plus 3pqr.",
      "Read off p+q+r, pq+qr+rp, and pqr from the coefficients via Vieta's formulas.",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-58",
    question:
      "A circle passes through the points (0,0), (8,0), and (0,6). What is the radius of the circle?",
    format: "SHORT_ANSWER",
    answer: "5",
    solution:
      "The angle at the origin between the segments to (8,0) and (0,6) is 90° (the segments lie along the two axes). By Thales's theorem, the side opposite a right angle inscribed in a circle is a diameter, so the segment from (8,0) to (0,6) is a diameter. Its length is √(8² + 6²) = √100 = 10, so the diameter is 10 and the radius is 5.",
    hints: [
      "Notice the angle at the origin, between the two given points, is a right angle.",
      "An inscribed right angle means the side opposite it (from (8,0) to (0,6)) is a diameter of the circle.",
    ],
    difficulty: 9,
    topicSlug: "circles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-59",
    question:
      "How many ordered triples of positive integers (x, y, z) with x ≤ y ≤ z satisfy x + y + z = xyz?",
    format: "SHORT_ANSWER",
    answer: "1",
    solution:
      "Since x ≤ y ≤ z, we have x + y + z ≤ 3z, so xyz ≤ 3z, meaning xy ≤ 3. This restricts (x,y) to (1,1), (1,2), or (1,3). Testing (1,1): 1+1+z = z gives 2=0, impossible. Testing (1,2): 1+2+z = 2z gives z=3, which does satisfy 1 ≤ 2 ≤ 3, and indeed 1+2+3=6=1·2·3. Testing (1,3): 1+3+z=3z gives 2z=4, z=2, but this violates y ≤ z (3 > 2). So the only solution is (x,y,z) = (1,2,3), giving exactly 1 triple.",
    hints: [
      "Use x ≤ y ≤ z to bound xy: since x+y+z ≤ 3z, you get xy ≤ 3, which leaves only a few cases for (x,y) to check.",
      "Check each small case (1,1), (1,2), (1,3) for x and y, solving for z and verifying the ordering constraint.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-60",
    question:
      "What is the smallest number of points that must be placed inside (or on the boundary of) a 6×6 square to guarantee that two of them lie within distance √8 of each other?",
    format: "SHORT_ANSWER",
    answer: "10",
    solution:
      "Divide the 6×6 square into a 3×3 grid of 2×2 subsquares, giving 9 subsquares total. Any two points within the same 2×2 subsquare are at most the diagonal distance apart, which is √(2²+2²) = √8. By the pigeonhole principle, placing 10 points among 9 subsquares forces two points into the same subsquare, guaranteeing a pair within distance √8. With only 9 points, one point could be placed in each subsquare's corner in a way that avoids this, so 10 is the minimum guarantee.",
    hints: [
      "Partition the square into 9 smaller 2×2 subsquares and think about the maximum distance between two points inside the same subsquare.",
      "Apply the pigeonhole principle: how many points force two into the same subsquare?",
    ],
    difficulty: 9,
    topicSlug: "pigeonhole",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-61",
    question:
      "A sequence satisfies a_1 = 1, a_2 = 1, and a_{n+2} = a_{n+1} + a_n + n for n ≥ 1. What is a_10?",
    format: "SHORT_ANSWER",
    answer: "188",
    solution:
      "Computing term by term: a_3 = a_2+a_1+1 = 3, a_4 = a_3+a_2+2 = 6, a_5 = a_4+a_3+3 = 12, a_6 = a_5+a_4+4 = 22, a_7 = a_6+a_5+5 = 39, a_8 = a_7+a_6+6 = 67, a_9 = a_8+a_7+7 = 113, a_10 = a_9+a_8+8 = 188.",
    hints: [
      "There's no shortcut needed here — just apply the recurrence step by step from n=1 up to n=8.",
      "Keep careful track of both a_n and a_{n+1} as you go, and don't forget the '+n' term at each step.",
    ],
    difficulty: 9,
    topicSlug: "sequences",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-62",
    question:
      "The incircle of triangle ABC has radius 6 and touches side BC at point D, with BD = 8 and DC = 12. What is the perimeter of triangle ABC?",
    format: "SHORT_ANSWER",
    answer: "64",
    solution:
      "Let the tangent length from A to the incircle be x; the tangent lengths from B and C are BD = 8 and DC = 12 respectively (equal tangent segments from each vertex). Then the semi-perimeter is s = x + 8 + 12 = x + 20, and there's a known identity r²s = (s-a)(s-b)(s-c) where s-a, s-b, s-c are exactly the three tangent lengths x, 8, 12. So 6²(x+20) = x·8·12 = 96x, i.e. 36x + 720 = 96x, giving 60x = 720, so x = 12. Then s = 32, and the perimeter is 2s = 64.",
    hints: [
      "The tangent length from each vertex to the incircle equals s minus the opposite side; here those tangent lengths are exactly x (unknown, from A), 8 (from B), and 12 (from C).",
      "Use the identity r²s = (s-a)(s-b)(s-c), where the right side is just the product of the three tangent lengths, to solve for the unknown tangent length.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-63",
    question:
      "How many positive integers less than 1000 are relatively prime to 30?",
    format: "SHORT_ANSWER",
    answer: "266",
    solution:
      "Use inclusion-exclusion on divisibility by 2, 3, and 5 among the integers 1 to 999. Total: 999. Divisible by 2: 499; by 3: 333; by 5: 199. Divisible by 6: 166; by 10: 99; by 15: 66. Divisible by 30: 33. The count divisible by 2, 3, or 5 is 499+333+199 − 166−99−66 + 33 = 1031 − 331 + 33 = 733. The count coprime to 30 is 999 − 733 = 266.",
    hints: [
      "Apply inclusion-exclusion to count numbers from 1 to 999 divisible by 2, 3, or 5, then subtract from 999.",
      "Don't forget the pairwise overlaps (6, 10, 15) and the triple overlap (30).",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-64",
    question:
      "How many ways are there to distribute 8 identical balls into 4 distinct boxes so that every box gets at least 1 ball and no box gets more than 4 balls?",
    format: "SHORT_ANSWER",
    answer: "31",
    solution:
      "Substitute y_i = x_i − 1 ≥ 0 (so each box has between 0 and 3 'extra' balls beyond its guaranteed one), turning the problem into: count nonnegative integer solutions to y_1+y_2+y_3+y_4 = 4 with each y_i ≤ 3. Without the upper bound, there are C(4+3,3) = C(7,3) = 35 solutions. Subtract the cases where some y_i ≥ 4: if y_i ≥ 4, set y_i' = y_i − 4 ≥ 0, so y_i' plus the rest sum to 0, forcing all other variables to 0 — this gives exactly 1 solution per choice of which variable is ≥ 4, and only one variable can exceed the bound at a time since the total is only 4. There are 4 such variables, so subtract 4: 35 − 4 = 31.",
    hints: [
      "Shift each box's count down by 1 (the guaranteed ball) and use stars and bars on the remainder, which must sum to 4 with each box capped at 3 extra.",
      "Use inclusion-exclusion to remove the cases where some box's extra count exceeds 3 — only one box can violate the cap at a time here.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-65",
    question:
      "Positive reals x and y satisfy xy = 16. What is the minimum possible value of x + 4y?",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "By AM-GM, x + 4y ≥ 2√(x·4y) = 2√(4xy) = 2√(64) = 16. Equality holds when x = 4y; combined with xy=16, this gives 4y² = 16, y = 2, x = 8, confirming the bound is achieved. So the minimum value is 16.",
    hints: [
      "Apply AM-GM to the two terms x and 4y.",
      "Check that equality (x = 4y) is actually achievable given the constraint xy = 16.",
    ],
    difficulty: 9,
    topicSlug: "inequalities",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-66",
    question:
      "Rectangle ABCD has point P inside it with PA = 13, PB = 14, and PC = 15. What is PD?",
    format: "SHORT_ANSWER",
    answer: "3√22",
    solution:
      "By the British Flag Theorem, for any point P and any rectangle ABCD, PA² + PC² = PB² + PD². So PD² = PA² + PC² − PB² = 169 + 225 − 196 = 198. Thus PD = √198 = 3√22.",
    hints: [
      "Recall the British Flag Theorem: for a point P and rectangle ABCD, PA² + PC² = PB² + PD², regardless of the rectangle's dimensions.",
      "Solve for PD² and simplify the resulting square root.",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-67",
    question: "What is the remainder when 3^400 is divided by 1000?",
    format: "SHORT_ANSWER",
    answer: "1",
    solution:
      "Since gcd(3,1000)=1, Euler's theorem applies: 3^φ(1000) ≡ 1 (mod 1000). Here φ(1000) = 1000·(1−1/2)·(1−1/5) = 1000 · 1/2 · 4/5 = 400, which is exactly the given exponent. So 3^400 ≡ 1 (mod 1000).",
    hints: [
      "Compute φ(1000) using the prime factorization 1000 = 2^3 · 5^3.",
      "Notice the exponent 400 exactly equals φ(1000), so Euler's theorem applies directly.",
    ],
    difficulty: 10,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-68",
    question:
      "Every edge of the complete graph on 6 vertices (K6) is colored either red or blue. What is the minimum possible number of monochromatic triangles (triangles whose three edges are all the same color) over all such colorings?",
    format: "SHORT_ANSWER",
    answer: "2",
    solution:
      "It's a classical fact (a refinement of the Ramsey number R(3,3)=6) that every 2-coloring of K6's edges contains at least one monochromatic triangle, but in fact the minimum count over all colorings is exactly 2, achieved for instance by a coloring built from two disjoint red triangles connected by blue edges in a suitable pattern (an explicit case-check over the small number of essentially different colorings confirms no coloring achieves only 1 or 0 monochromatic triangles, while a construction achieving exactly 2 exists).",
    hints: [
      "This is stronger than the fact that R(3,3)=6 (that only guarantees at least 1 monochromatic triangle) — the true minimum count is a specific small number greater than 1.",
      "Try to construct a coloring with as few monochromatic triangles as possible, and convince yourself you can't avoid a second one.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-69",
    question:
      "A function f: R → R satisfies f(x)f(y) - f(xy) = x + y for all real x, y. What is f(3)?",
    format: "SHORT_ANSWER",
    answer: "4",
    solution:
      "Set x=y=0: f(0)² − f(0) = 0, so f(0) = 0 or f(0) = 1. If f(0)=0, setting y=0 gives f(x)·0 − 0 = x, i.e. 0 = x for all x, a contradiction. So f(0) = 1. Setting y=0 now gives f(x)·1 − 1 = x, so f(x) = x + 1 for all x. Checking: f(x)f(y) − f(xy) = (x+1)(y+1) − (xy+1) = xy+x+y+1−xy−1 = x+y, which matches. So f(3) = 4.",
    hints: [
      "Plug in x = y = 0 to find the possible values of f(0), then rule one out using y = 0 with general x.",
      "Once you know f(0), set y = 0 again to derive a closed form for f(x).",
    ],
    difficulty: 10,
    topicSlug: "functional-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-70",
    question:
      "A regular tetrahedron has edge length 6. What is the distance from the tetrahedron's centroid to one of its faces?",
    format: "SHORT_ANSWER",
    answer: "√6/2",
    solution:
      "The height of a regular tetrahedron with edge length a is H = a√(2/3) = a√6/3. For a=6, H = 6√6/3 = 2√6. The centroid (average of the 4 vertices) lies at 1/4 of the height above each face, since it divides the segment from any vertex to the centroid of the opposite face in ratio 3:1. So the distance from the centroid to a face is H/4 = 2√6/4 = √6/2.",
    hints: [
      "First find the height of the tetrahedron (distance from a vertex to the opposite face).",
      "The centroid sits at exactly 1/4 of that height above each face — this follows from the centroid being the average of all 4 vertices.",
    ],
    difficulty: 10,
    topicSlug: "three-d-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-71",
    question:
      "How many ordered pairs of integers (x, y) satisfy x^2 - y^2 = 2024?",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "Factor as (x-y)(x+y) = 2024. Writing x−y = d1 and x+y = d2, we need d1·d2 = 2024 with d1, d2 of the same parity (so that x=(d1+d2)/2 and y=(d2-d1)/2 are integers). Since 2024 is even but not the product of two odd numbers, both d1 and d2 must be even. Write d1=2a, d2=2b, so 4ab = 2024, giving ab = 506 = 2·11·23. Since 506 has three distinct prime factors, it has 8 positive divisors, giving 8 ordered pairs (a,b) with a,b>0, plus 8 more with a,b both negative (equally valid since ab=506>0). Each distinct (a,b) gives a distinct (x,y). Total: 16 ordered pairs.",
    hints: [
      "Factor the difference of squares and set d1 = x−y, d2 = x+y with d1·d2 = 2024, noting d1 and d2 must share the same parity.",
      "Show both factors must be even, reduce to a smaller product ab = 506, and count its divisors (including negative pairs).",
    ],
    difficulty: 10,
    topicSlug: "diophantine-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-72",
    question:
      "Each cell of a 5×5 grid contains either +1 or −1. For each of the 5 rows, compute the product of its entries, and for each of the 5 columns, compute the product of its entries — 10 numbers total. What is the product of all 10 of these numbers?",
    format: "SHORT_ANSWER",
    answer: "1",
    solution:
      "Let Q be the product of all 25 entries in the grid. The product of the 5 row-products equals Q (every cell is counted exactly once across the rows), and likewise the product of the 5 column-products also equals Q. So the product of all 10 numbers is Q · Q = Q². Since each entry is ±1, Q is also ±1, and Q² = 1 regardless of the grid's actual contents. So the answer is always 1.",
    hints: [
      "The product of the 5 row-products, and separately the product of the 5 column-products, both equal the product of all 25 entries.",
      "So the final answer is that product squared — and a square of ±1 is always 1, no matter what's in the grid.",
    ],
    difficulty: 10,
    topicSlug: "invariants",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-73",
    question:
      "Real numbers x, y, z satisfy x+y+z=6, x²+y²+z²=14, and x³+y³+z³=36. What is xyz?",
    format: "SHORT_ANSWER",
    answer: "6",
    solution:
      "Let e1=x+y+z=6, e2=xy+yz+zx, e3=xyz. From x²+y²+z² = e1² − 2e2: 14 = 36 − 2e2, so e2 = 11. Using the identity x³+y³+z³ = e1³ − 3e1e2 + 3e3: 36 = 216 − 3(6)(11) + 3e3 = 216 − 198 + 3e3 = 18 + 3e3, so 3e3 = 18 and e3 = 6. (Indeed, x,y,z are the roots of t³−6t²+11t−6=0, which factors as (t−1)(t−2)(t−3), matching 1+2+3=6, and 1·2·3=6.) So xyz = 6.",
    hints: [
      "Use the identity x²+y²+z² = (x+y+z)² − 2(xy+yz+zx) to find the pairwise sum.",
      "Then use the identity x³+y³+z³ = (x+y+z)³ − 3(x+y+z)(xy+yz+zx) + 3xyz to solve for xyz.",
    ],
    difficulty: 10,
    topicSlug: "systems-of-equations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-74",
    question:
      "A sphere is inscribed in a cube of side length 6 (tangent to all 6 faces). A plane through the center of the cube, parallel to one face, cuts both the cube and the sphere. What is the area of the region inside the cube's cross-section but outside the sphere's cross-section?",
    format: "SHORT_ANSWER",
    answer: "36 - 9π",
    solution:
      "The cube's cross-section (parallel to a face, through the center) is a 6×6 square with area 36. The inscribed sphere has radius 3 (half the cube's side length), and a plane through its center produces a great circle of radius 3, with area 9π. The requested region is the square minus the circle: 36 − 9π.",
    hints: [
      "The cube's cross-section through the center, parallel to a face, is just a 6×6 square.",
      "The sphere's cross-section through its center is a great circle with the sphere's full radius — find that radius from the cube's dimensions.",
    ],
    difficulty: 10,
    topicSlug: "area-volume",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-75",
    question:
      "How many positive integers n with 1 ≤ n ≤ 2024 satisfy 2024 | n(n-1)?",
    format: "SHORT_ANSWER",
    answer: "8",
    solution:
      "Factor 2024 = 2^3 · 11 · 23. Since n and n−1 are coprime, for each prime power in the factorization (8, 11, 23), it must divide entirely into n or entirely into n−1 (it can't split between them). This gives 2 independent choices for each of the 3 prime-power factors, so by the Chinese Remainder Theorem there are 2^3 = 8 distinct residues mod 2024 satisfying the condition. Since the range 1 to 2024 contains exactly one representative of each residue class mod 2024, there are exactly 8 valid values of n.",
    hints: [
      "Factor 2024 into prime power components 8, 11, 23 — since n and n−1 share no common factor, each component must divide entirely into one of them.",
      "Use the Chinese Remainder Theorem to count the number of valid residues mod 2024, then note the range given has exactly one representative per residue.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-76",
    question:
      "How many sequences of length 10 using the letters A, B, C have no two consecutive letters equal and do not contain the consecutive substring 'ABC'?",
    format: "SHORT_ANSWER",
    answer: "685",
    solution:
      "Track the state of the last two letters (6 possible pairs, since adjacent letters must differ: AB, AC, BA, BC, CA, CB). From state (X,Y), the next letter Z can be either of the two letters different from Y, except from state (A,B) the letter C is additionally forbidden (to avoid the substring 'ABC'), leaving only Z=A. Starting with all 6 length-2 states at count 1, this recurrence is applied 8 more times to reach length 10, where at each step the count in each new state (Y,Z) accumulates contributions from all valid predecessor states (X,Y). Carrying out this computation (by hand or with careful bookkeeping) through length 10 gives a total of 685 valid sequences across all 6 final states.",
    hints: [
      "Set up a state machine tracking the last two letters, since you need to know whether they're 'AB' to decide if the next letter is restricted.",
      "Propagate counts through all 6 states for 8 more steps (from length 2 up to length 10), applying the extra restriction only when leaving an 'AB' state.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-77",
    question:
      "For positive reals a, b, c with a+b+c=9, what is the minimum possible value of a²/b + b²/c + c²/a?",
    format: "SHORT_ANSWER",
    answer: "9",
    solution:
      "By the Cauchy-Schwarz inequality in Engel form (Titu's Lemma): a²/b + b²/c + c²/a ≥ (a+b+c)² / (a+b+c) = a+b+c = 9. Equality holds when a/b = b/c = c/a, which forces a=b=c=3 (consistent with a+b+c=9), and indeed 3²/3 + 3²/3 + 3²/3 = 3+3+3 = 9. So the minimum value is 9.",
    hints: [
      "Apply Titu's Lemma (Cauchy-Schwarz in Engel form) to the sum a²/b + b²/c + c²/a.",
      "Check that equality is achievable — it requires a=b=c.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-78",
    question:
      "Circles ω1 and ω2, with radii 4 and 9 respectively, are externally tangent to each other. A common external tangent line touches ω1 at A and ω2 at B. What is the area of quadrilateral O1ABO2, where O1 and O2 are the centers of ω1 and ω2?",
    format: "SHORT_ANSWER",
    answer: "78",
    solution:
      "Since the circles are externally tangent, the distance between centers is O1O2 = 4+9 = 13. Radii O1A and O2B are each perpendicular to the tangent line AB (radius ⊥ tangent at the point of tangency), making O1ABO2 a right trapezoid with parallel sides O1A=4 and O2B=9. The length of AB (the external tangent) is √(O1O2² − (r2−r1)²) = √(169 − 25) = √144 = 12. The trapezoid's area is (1/2)(O1A + O2B)(AB) = (1/2)(4+9)(12) = 78.",
    hints: [
      "The radii to the points of tangency are both perpendicular to the tangent line, making O1ABO2 a right trapezoid.",
      "Find the length of the external tangent segment AB using the standard formula √(d² − (r1−r2)²), then apply the trapezoid area formula.",
    ],
    difficulty: 10,
    topicSlug: "advanced-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-79",
    question:
      "Let N = 2^2024 - 1. How many positive integers d with 1 ≤ d ≤ 2024 satisfy the property that 2^d - 1 divides N?",
    format: "SHORT_ANSWER",
    answer: "16",
    solution:
      "There's a standard fact: 2^d − 1 divides 2^n − 1 if and only if d divides n. Here n = 2024, so we need to count the positive divisors of 2024. Factoring, 2024 = 2^3 · 11 · 23, so the number of divisors is (3+1)(1+1)(1+1) = 4 × 2 × 2 = 16.",
    hints: [
      "Recall (or derive via the Euclidean algorithm) that 2^d − 1 divides 2^n − 1 exactly when d divides n.",
      "So the answer is simply the number of positive divisors of 2024 — factor it and count.",
    ],
    difficulty: 10,
    topicSlug: "advanced-number-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-80",
    question:
      "The numbers 1 through 9 are placed into the cells of a 3×3 grid, each number used exactly once. How many such placements have the property that all three row sums and all three column sums are odd?",
    format: "INTEGER",
    answer: "25920",
    solution:
      "Only the parities of the entries matter for the sums, so first decide which five cells receive the five odd numbers 1, 3, 5, 7, 9 (the other four cells get 2, 4, 6, 8). A line sum is odd exactly when that line contains an odd number of odd entries, i.e. 1 or 3 of them. The three row counts are each 1 or 3 and must total 5, so as a multiset they are {3, 1, 1}; the same holds for the columns. Let row r be the row holding three odds and let column c be the column holding three odds. Every other row contains exactly one odd, and every other column contains exactly one odd; since row r already supplies the odd entry of each column other than c, the lone odd in each row other than r is forced to sit in column c. So the odd cells are exactly (row r) ∪ (column c), which is 3 + 3 − 1 = 5 cells — consistent. There are 3 choices for r and 3 for c, giving 9 valid parity patterns. Finally, the five odd numbers can be arranged in the five odd cells in 5! = 120 ways and the four even numbers in 4! = 24 ways. The total is 9 · 120 · 24 = 25920. (Exhaustive enumeration of all 9! = 362880 placements confirms 25920.)",
    hints: [
      "Only parity matters for the sums. How many of the nine numbers are odd, and how many odd entries must a line contain for its sum to be odd?",
      "Each row must contain 1 or 3 odd entries and the three row counts must add to 5 — so the counts are 3, 1, 1 in some order, and likewise for the columns.",
      "Show the odd cells must form the union of one full row and one full column, then count the arrangements of the actual numbers.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-81",
    question:
      "Compute the number of positive integers n less than 1000 such that n and 2n have the same digit sum.",
    format: "INTEGER",
    answer: "91",
    solution:
      "Write S(m) for the digit sum of m. Doubling n digit by digit, the digit in position i contributes 2dᵢ plus a possible incoming carry of 1. Since 2dᵢ is even, 2dᵢ + carry ≥ 10 happens exactly when 2dᵢ ≥ 10, that is when dᵢ ≥ 5, no matter what the incoming carry is. So the carries are completely predictable: a carry leaves position i precisely when dᵢ ≥ 5. Each carry replaces a contribution of 10 by a contribution of 1 in the next place, lowering the digit sum by 9, so S(2n) = 2S(n) − 9c, where c is the number of digits of n that are at least 5. The condition S(2n) = S(n) is therefore equivalent to S(n) = 9c.\n\nWrite n < 1000 as a three-digit string with leading zeros allowed (n ≥ 1), so c ∈ {0, 1, 2, 3}.\n\nc = 0 forces S(n) = 0, i.e. n = 0, which is not positive.\n\nc = 1 forces S(n) = 9 with exactly one digit at least 5. Two digits of size at least 5 would already give a digit sum of at least 10, so the condition is just: digit sum 9 and not all digits at most 4. The number of three-digit strings with digit sum 9 is C(11, 2) = 55 (no digit can reach 10 anyway), and those with every digit at most 4 number 55 − 3·C(6, 2) = 55 − 45 = 10 by inclusion–exclusion. That leaves 55 − 10 = 45.\n\nc = 2 forces S(n) = 18 with exactly two digits at least 5. Strings with digit sum 18 also number 55, by the symmetry dᵢ ↦ 9 − dᵢ, which matches digit sum 18 with digit sum 9. If at most one digit were at least 5, the sum would be at most 9 + 4 + 4 = 17, so every such string has at least two big digits; the ones with all three at least 5 correspond via dᵢ = 5 + eᵢ to e₁ + e₂ + e₃ = 3, giving C(5, 2) = 10. That leaves 55 − 10 = 45.\n\nc = 3 forces S(n) = 27, so n = 999, and all its digits are at least 5: 1 value.\n\nThe total is 45 + 45 + 1 = 91. (A direct scan of n = 1 to 999 comparing digit sums confirms 91, with the same split 45, 45, 1 by number of large digits.)",
    hints: [
      "Compare the digit sums of n and 2n by tracking carries: each carry costs the digit sum exactly 9, so express S(2n) in terms of S(n) and the number of carries.",
      "Show that a carry occurs out of a given place exactly when that digit is at least 5, independently of the incoming carry — so the number of carries is just a count of large digits.",
      "The condition becomes 'digit sum equals 9 times the number of digits that are at least 5'; handle the three possible values of that count separately, counting digit strings with a prescribed sum.",
    ],
    difficulty: 9,
    topicSlug: "number-properties",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-82",
    question:
      "Eight students are numbered 1 through 8, and eight desks are also numbered 1 through 8. In how many ways can the students be seated at the desks, one student per desk, so that for every i the student at desk i is neither student i nor student i + 1? (At desk 8 only the first restriction applies, since there is no student 9.)",
    format: "INTEGER",
    answer: "5413",
    solution:
      "Think of a seating as a permutation π, where π(i) is the student at desk i, and mark the forbidden (desk, student) cells: (i, i) for i = 1, …, 8 and (i, i + 1) for i = 1, …, 7 — fifteen cells in all. Inclusion–exclusion on the set of forbidden cells that a permutation actually uses gives the count Σ_{k≥0} (−1)^k r_k · (8 − k)!, where r_k is the number of ways to pick k of the forbidden cells no two of which share a desk or a student (only such a selection can be part of a permutation), and (8 − k)! counts the free placements of the remaining students. To find r_k, list the forbidden cells in the order (1,1), (1,2), (2,2), (2,3), (3,3), …, (8,8): consecutive cells in this list share a desk or a student, while non-consecutive ones share neither. So a legal selection of k cells is exactly a choice of k pairwise non-consecutive items from a row of 15, and r_k = C(15 − k + 1, k) = C(16 − k, k). The terms are therefore 1·40320, 15·5040, 91·720, 286·120, 495·24, 462·6, 210·2, 36·1, 1·1 with alternating signs: 40320 − 75600 + 65520 − 34320 + 11880 − 2772 + 420 − 36 + 1 = 5413. (Exhaustive enumeration of all 8! = 40320 permutations confirms 5413.)",
    hints: [
      "View a seating as a permutation and shade the forbidden (desk, student) cells — there are fifteen of them, and they form a staircase.",
      "Count by inclusion–exclusion over how many forbidden cells a seating uses: the term for k cells is ±(number of legal k-cell selections)·(8 − k)!, where 'legal' means no two of the chosen cells share a desk or a student.",
      "Write the fifteen forbidden cells in a single chain in which exactly the neighboring ones conflict; choosing k of them legally is then choosing k non-consecutive items from a row of 15.",
    ],
    difficulty: 10,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-83",
    question:
      "Triangle ABC is equilateral with side length 10. A point P in the plane of the triangle satisfies PA = 5 and PB = 6. Compute the sum of all possible values of PC².",
    format: "INTEGER",
    answer: "161",
    solution:
      "Place A = (0, 0), B = (10, 0), and C = (5, 5√3). Writing P = (x, y), the conditions x² + y² = 25 and (x − 10)² + y² = 36 subtract to −20x + 100 = 11, so x = 89/20, and then y² = 25 − x² = 2079/400. Thus y = ±√(2079)/20: there are exactly two candidate points, mirror images across line AB, and both are genuinely at distances 5 and 6 from A and B. Now PC² = (x − 5)² + (y − 5√3)² = (x − 5)² + y² − 10√3·y + 75. The only term depending on the sign of y is −10√3·y, which cancels when the two values are added. Hence the sum is 2[(x − 5)² + y² + 75]. Since y² = 25 − x², we have (x − 5)² + y² = x² − 10x + 25 + 25 − x² = 50 − 10x, so the sum is 2[50 − 10x + 75] = 2[125 − 10 · (89/20)] = 2[125 − 44.5] = 2 · 80.5 = 161. (Equivalently, the two values are (161 ± 9√77)/2, whose sum is 161; the classical identity 3(PA⁴ + PB⁴ + PC⁴ + s⁴) = (PA² + PB² + PC² + s²)² yields the same quadratic u² − 161u + 4921 = 0 in u = PC². Direct coordinate computation confirms PC² ≈ 41.0127 and ≈ 119.9873, summing to 161.)",
    hints: [
      "Put the triangle in coordinates and intersect the circle of radius 5 about A with the circle of radius 6 about B — there are exactly two intersection points.",
      "Both intersection points have the same x-coordinate and opposite y-coordinates, so write PC² and watch which term flips sign.",
      "Adding the two values of PC² kills the odd term in y; everything left can be evaluated from x alone.",
    ],
    difficulty: 10,
    topicSlug: "geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-84",
    question:
      "The numbers 1 through 12 are split into six unordered pairs, every number used exactly once. Compute the number of such splittings in which no pair has sum 7 and no pair has sum 13.",
    format: "INTEGER",
    answer: "4447",
    solution:
      "First, the number of ways to split 2m labeled objects into m unordered pairs is (2m − 1)!! = 1 · 3 · 5 ⋯ (2m − 1); for 12 objects that is 11!! = 10395. Now list the forbidden pairs: sum 13 gives {1,12}, {2,11}, {3,10}, {4,9}, {5,8}, {6,7}, and sum 7 gives {1,6}, {2,5}, {3,4} — nine forbidden pairs in all. Count splittings that use at least one of them by inclusion–exclusion: the number of splittings containing k specified pairwise disjoint forbidden pairs is (11 − 2k)!!, since the remaining 12 − 2k numbers may be paired arbitrarily, and a set of forbidden pairs that is not pairwise disjoint can never occur inside a splitting. So the answer is Σ_k (−1)^k m_k · (11 − 2k)!!, where m_k is the number of ways to choose k pairwise disjoint forbidden pairs. To find the m_k, view the nine forbidden pairs as edges on the vertices 1, …, 12: they form three separate chains, 12−1−6−7, 11−2−5−8, and 10−3−4−9, each a path with three edges. From a three-edge path one can pick 0 disjoint edges in 1 way, 1 edge in 3 ways, and 2 edges in 1 way (the two outer edges), so each chain contributes the polynomial 1 + 3t + t², and (1 + 3t + t²)³ = 1 + 9t + 30t² + 45t³ + 30t⁴ + 9t⁵ + t⁶ gives m_0, …, m_6 = 1, 9, 30, 45, 30, 9, 1. With 11!! = 10395, 9!! = 945, 7!! = 105, 5!! = 15, 3!! = 3, 1!! = 1, and the empty product 1 for k = 6, the alternating sum is 10395 − 9·945 + 30·105 − 45·15 + 30·3 − 9·1 + 1 = 10395 − 8505 + 3150 − 675 + 90 − 9 + 1 = 4447. (Exhaustive enumeration of all 10395 splittings in Python confirms 4447.)",
    hints: [
      "How many ways are there to split 2m labeled objects into m unordered pairs? That product formula is the starting point.",
      "There are nine forbidden pairs. Count the splittings that avoid all of them by inclusion–exclusion — but only sets of forbidden pairs that are pairwise disjoint can actually appear in a splitting.",
      "Draw the nine forbidden pairs as edges on the twelve numbers: they break into three identical three-edge chains, which makes counting disjoint selections easy.",
    ],
    difficulty: 9,
    topicSlug: "combinations",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-85",
    question:
      "Compute the number of ways to split the set {1, 2, 3, …, 10} into nonempty groups, every number used in exactly one group, so that no group contains two consecutive integers. The groups are unordered and there is no restriction on how many groups are used.",
    format: "INTEGER",
    answer: "21147",
    solution:
      "Let f(n, k) be the number of splittings of {1, 2, …, n} into exactly k nonempty groups with no group containing two consecutive integers. Build such a splitting by inserting the numbers 1, 2, …, n one at a time in increasing order. When n is inserted into a splitting of {1, …, n − 1}, it may either start a brand-new group, or join one of the existing groups — but not the group containing n − 1. So if the smaller splitting already has k groups, there are exactly k − 1 legal groups for n to join, and if it has k − 1 groups, n must open the k-th one. This gives f(n, k) = (k − 1)·f(n − 1, k) + f(n − 1, k − 1).\n\nCompare this with the recursion for the Stirling numbers of the second kind, S(n, k) = k·S(n − 1, k) + S(n − 1, k − 1), which counts splittings of an n-element set into k unlabeled nonempty groups with no restriction. Substituting m = n − 1 and j = k − 1 shows that the numbers S(n − 1, k − 1) satisfy exactly the recursion for f(n, k), and the initial values agree (f(1, 1) = 1 = S(0, 0), and f(n, k) = 0 = S(n − 1, k − 1) outside the legal range). Hence f(n, k) = S(n − 1, k − 1): the restricted splittings of an n-element set into k groups are equinumerous with all splittings of an (n − 1)-element set into k − 1 groups.\n\nSumming over k, the total we want is Σ_k S(9, k − 1) = B_9, the ninth Bell number. The Bell numbers from B_0 are 1, 1, 2, 5, 15, 52, 203, 877, 4140, 21147, computed quickly by the Bell triangle (each row starts with the last entry of the previous row, and each further entry is the sum of the one to its left and the one above-left). Therefore the answer is 21147. (Exhaustive enumeration of all 115975 splittings of a 10-element set, keeping those with no group holding two consecutive integers, gives 21147 as well.)",
    hints: [
      "Insert the numbers in increasing order and ask how many choices the newcomer has: it may open a new group or join an old one, with exactly one old group forbidden to it.",
      "Write that as a two-variable recursion in (number of elements, number of groups), then compare it with the unrestricted recursion for splitting a set into a given number of unlabeled groups.",
      "The comparison shifts both indices by one, so the total collapses to a single well-known counting sequence evaluated at 9.",
    ],
    difficulty: 10,
    topicSlug: "combinatorics",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-86",
    question:
      "How many ordered triples (a, b, c) of integers with 0 ≤ a, b, c ≤ 20 satisfy a³ + b³ + c³ ≡ 0 (mod 21)?",
    format: "INTEGER",
    answer: "495",
    solution:
      "Since 21 = 3 · 7 and the residues 0..20 run once through every residue class mod 21, the Chinese Remainder Theorem lets us count independently mod 3 and mod 7 and multiply. Mod 3: every integer satisfies x³ ≡ x, so the condition becomes a + b + c ≡ 0 (mod 3). For each of the 9 choices of (a, b) mod 3 there is exactly one c, so there are 9 triples out of 27. Mod 7: the nonzero cubes are the cubic residues, and since gcd(3, 6) = 3 the cubes mod 7 are {0, 1, 6}, with 0 coming from one residue (0), 1 coming from three residues (1, 2, 4), and 6 coming from three residues (3, 5, 6). We need three values from {0, 1, 6} summing to 0 mod 7. Checking all cases: 0+0+0 = 0 ✓; 0+1+6 = 7 ≡ 0 ✓; and every other multiset (0+0+1 = 1, 0+0+6 = 6, 1+1+0 = 2, 1+1+1 = 3, 1+1+6 = 8 ≡ 1, 1+6+6 = 13 ≡ 6, 6+6+0 = 12 ≡ 5, 6+6+6 = 18 ≡ 4) fails. The all-zero case contributes 1 · 1 · 1 = 1 triple; the pattern {0, 1, 6} has 3! = 6 orderings each contributing 1 · 3 · 3 = 9 triples, for 54. So there are 55 triples mod 7. The answer is 9 · 55 = 495. (Brute force over all 21³ = 9261 triples confirms 495.)",
    hints: [
      "Split the modulus: count solutions mod 3 and mod 7 separately and multiply.",
      "Mod 3, cubing does nothing (x³ ≡ x), so the condition collapses to a linear one.",
      "Mod 7 there are only three possible cube values; determine how many residues map to each, then find which triples of cube values sum to 0.",
    ],
    difficulty: 9,
    topicSlug: "modular-arithmetic",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-87",
    question:
      "A coin is flipped 12 times, producing a sequence of heads and tails. How many such sequences contain exactly 6 heads and 6 tails and never contain three consecutive identical flips?",
    format: "INTEGER",
    answer: "208",
    solution:
      "Break the sequence into maximal runs of identical flips. The runs alternate between heads-runs and tails-runs, and the no-three-in-a-row condition says every run has length 1 or 2. Suppose there are j heads-runs and k tails-runs; since the runs alternate, |j − k| ≤ 1. The heads-runs must have lengths summing to 6, each length 1 or 2. If exactly 6 − j of the j runs have length 2, the number of ways to choose which is C(j, 6 − j); this requires 3 ≤ j ≤ 6, giving c(3) = C(3,3) = 1, c(4) = C(4,2) = 6, c(5) = C(5,1) = 5, c(6) = C(6,0) = 1. The same counts apply to the tails-runs. Finally, if j = k the sequence may start with either letter (2 interleavings); if |j − k| = 1 the longer side must go first, so there is exactly 1 interleaving. Summing: the j = k terms give 2(1² + 6² + 5² + 1²) = 2 · 63 = 126, and the |j − k| = 1 terms give c(3)c(4) + c(4)c(3) + c(4)c(5) + c(5)c(4) + c(5)c(6) + c(6)c(5) = 6 + 6 + 30 + 30 + 5 + 5 = 82. The total is 126 + 82 = 208. (Exhaustive enumeration of all 2^12 sequences confirms 208.)",
    hints: [
      "Describe a sequence by its maximal runs; the forbidden pattern means every run has length 1 or 2.",
      "If there are j heads-runs with total length 6 and each run of length 1 or 2, the number of length patterns is C(j, 6 − j).",
      "Runs alternate, so the numbers of heads-runs and tails-runs differ by at most 1 — and when they are equal there are two ways to interleave.",
    ],
    difficulty: 10,
    topicSlug: "recursion-in-counting",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-88",
    question:
      "Points A and B are two distinct points on the parabola y = x², and the tangent lines to the parabola at A and B are perpendicular to each other and meet at the point T. Compute the smallest possible area of triangle ABT.",
    format: "SHORT_ANSWER",
    answer: "1/4",
    solution:
      "Write A = (a, a²) and B = (b, b²). The tangent at (t, t²) has slope 2t, so perpendicularity says (2a)(2b) = −1, i.e. ab = −1/4. Setting the two tangent equations y = 2ax − a² and y = 2bx − b² equal gives x = (a + b)/2 and then y = ab = −1/4, so T = (s/2, −1/4) where s = a + b — the intersection always sits on the fixed horizontal line y = −1/4. Next, line AB has slope (a² − b²)/(a − b) = s and passes through A, so its equation is y = sx − ab = sx + 1/4. Its length is |a − b|·√(1 + s²), and (a − b)² = s² − 4ab = s² + 1, so AB = (1 + s²). The distance from T to line AB is |s·(s/2) + 1/4 − (−1/4)|/√(1 + s²) = ((s² + 1)/2)/√(1 + s²) = √(1 + s²)/2. Hence the area is (1/2)·(1 + s²)·√(1 + s²)/2 = (1 + s²)·√(1 + s²)/4, which is strictly increasing in s² and therefore minimized at s = 0. That case is a = 1/2, b = −1/2 (consistent with ab = −1/4), giving area 1/4. (A symbolic computation in SymPy gives area = (64a⁶ + 48a⁴ + 12a² + 1)/(256a²|a|) after eliminating b, whose minimum over a > 0 is 1/4 at a = 1/2.)",
    hints: [
      "Parametrize the two points as (a, a²) and (b, b²) and turn the perpendicularity of the tangents into a single equation relating a and b.",
      "Find T by intersecting the two tangent lines — its y-coordinate turns out not to depend on the choice of A and B at all.",
      "Express the area in terms of s = a + b only; it comes out as a increasing function of s², so the minimum is at the symmetric configuration.",
    ],
    difficulty: 9,
    topicSlug: "coordinate-geometry",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-89",
    question:
      "A point P is chosen uniformly at random from the interior of a square of side length 1. Compute the probability that P is closer to the center of the square than it is to every one of the square's four sides.",
    format: "SHORT_ANSWER",
    answer: "(4√2 − 5)/3",
    solution:
      "Put the square at 0 ≤ x ≤ 1, 0 ≤ y ≤ 1, with center O = (1/2, 1/2), and write P = (x, y). The distance from P to the nearest side is min(x, 1 − x, y, 1 − y), so the two diagonals of the square cut it into four congruent triangles, one for each side that can be the nearest; by symmetry it suffices to work in the bottom triangle {y ≤ x, y ≤ 1 − x}, where the nearest side is the bottom and the distance to it is y. There the condition reads (x − 1/2)² + (y − 1/2)² < y², which simplifies beautifully: the y² terms cancel, leaving (x − 1/2)² + 1/4 − y < 0, i.e. y > (x − 1/2)² + 1/4. So the favorable region in this triangle is the part lying above a parabola with vertex (1/2, 1/4) — exactly the parabola of points equidistant from O and from the bottom side.\n\nFind where that parabola meets the boundary lines of the triangle. Setting (x − 1/2)² + 1/4 = x gives x² − 2x + 1/2 = 0, so x = 1 − √2/2 (the other root exceeds 1); by symmetry it meets y = 1 − x at x = √2/2. Substituting u = x − 1/2 turns the favorable area in the bottom triangle into 2∫ from u = (1 − √2)/2 to u = 0 of (u + 1/2) − (u² + 1/4) du = 2∫ (−u² + u + 1/4) du, the factor 2 coming from the mirror symmetry about x = 1/2.\n\nEvaluating, ∫ (−u² + u + 1/4) du = −u³/3 + u²/2 + u/4, and at c = (1 − √2)/2 we have c² = (3 − 2√2)/4 and c³ = (7 − 5√2)/8, so the definite integral equals c³/3 − c²/2 − c/4 = (7 − 5√2)/24 − (12 − 9√2)/24 = (4√2 − 5)/24. The bottom triangle therefore contributes 2 · (4√2 − 5)/24, and multiplying by the four congruent triangles gives a total favorable area of 8 · (4√2 − 5)/24 = (4√2 − 5)/3. Since the square has area 1, that is the probability, approximately 0.21895. (A Monte Carlo simulation with 400000 points gives 0.2184, and symbolic integration returns 4√2/3 − 5/3 exactly.)",
    hints: [
      "The distance to the nearest side is a minimum of four linear expressions; the diagonals split the square into four regions on which that minimum is a single one of them.",
      "In one such region compare the squared distance to the center with the squared distance to that side — a whole square term cancels and leaves a parabola.",
      "Integrate between the two points where the parabola crosses the diagonals, then use the fourfold symmetry.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-90",
    question:
      "Each of the 12 edges of a cube is painted either red or blue, with exactly 4 of the edges red. Two paintings are considered the same if one can be turned into the other by rotating the cube in space. How many different paintings are there?",
    format: "INTEGER",
    answer: "27",
    solution:
      "Count orbits by averaging the number of paintings fixed by each of the 24 rotations (the orbit-counting lemma), where a rotation fixes a painting exactly when every cycle of its action on the twelve edges is monochromatic — so the 4 red edges must be a union of whole cycles. Go through the five classes of rotations. (1) The identity fixes all C(12, 4) = 495 four-edge choices. (2) The three 180° rotations about axes through opposite face centers split the edges into six 2-cycles, so a red set is a union of two of them: C(6, 2) = 15 each. (3) The six 90° rotations about face-center axes give three 4-cycles (the top four edges, the bottom four, and the four vertical ones), so the red set must be exactly one 4-cycle: 3 each. (4) The six 180° rotations about axes through the midpoints of opposite edges fix those 2 edges and pair up the remaining ten into five 2-cycles; a 4-element union is either the two fixed edges plus one 2-cycle (5 ways) or two 2-cycles (C(5, 2) = 10 ways), so 15 each. (5) The eight 120° rotations about a main diagonal split the edges into four 3-cycles, and no union of 3-cycles has size 4, so 0 each. The average is (495 + 3·15 + 6·3 + 6·15 + 8·0)/24 = (495 + 45 + 18 + 90)/24 = 648/24 = 27. (Verified two ways in Python: direct orbit enumeration of all 495 four-edge subsets under the 24 rotations gives 27 orbits, and the cycle-index computation reproduces the fixed-point counts 495, 15, 3, 15, 0.)",
    hints: [
      "Colorings related by a rotation must be counted once, so average the number of colorings left unchanged by each of the 24 rotations of the cube.",
      "A rotation permutes the twelve edges; it fixes a coloring exactly when each cycle of that permutation is entirely red or entirely blue, so the red edges form a union of cycles totaling 4.",
      "Sort the rotations into the identity, the face 90° and 180° turns, the edge 180° turns, and the vertex 120° turns, and work out the edge cycle lengths for each — one class fixes nothing at all.",
    ],
    difficulty: 10,
    topicSlug: "counting-principles",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-91",
    question:
      "Let x and y be real numbers with x² + y² = 1. Compute the maximum possible value of (x + y)/(xy + 2).",
    format: "SHORT_ANSWER",
    answer: "2√2/5",
    solution:
      "Let s = x + y. Then s² = x² + y² + 2xy = 1 + 2xy, so xy = (s² − 1)/2. Substituting, the expression becomes s / ((s² − 1)/2 + 2) = 2s/(s² + 3). Note the denominator is always positive, so there is no issue of vanishing. The possible values of s are exactly the interval [−√2, √2]: by Cauchy–Schwarz (or the QM–AM inequality) (x + y)² ≤ 2(x² + y²) = 2, and the endpoints are attained at (x, y) = (±1/√2, ±1/√2). Now maximize g(s) = 2s/(s² + 3) on [−√2, √2]. Its derivative is g′(s) = 2(3 − s²)/(s² + 3)², which is strictly positive for s² < 3 — and every s in our interval satisfies s² ≤ 2 < 3. So g is strictly increasing on the whole interval and the maximum occurs at the right endpoint s = √2: g(√2) = 2√2/(2 + 3) = 2√2/5. This is attained at x = y = 1/√2. (A fine scan over the unit circle gives a maximum of 0.5656854249…, which equals 2√2/5.)",
    hints: [
      "Introduce s = x + y; the constraint lets you express xy in terms of s, turning the expression into a one-variable function.",
      "Determine the exact range of s given x² + y² = 1 — it is a closed interval.",
      "The reduced function 2s/(s² + 3) has an unconstrained maximum at s = √3, which lies outside the allowed range, so the maximum is at an endpoint.",
    ],
    difficulty: 9,
    topicSlug: "inequalities",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-92",
    question:
      "Consider the network formed by the six vertices and twelve edges of a regular octahedron. Compute the number of ways to choose five of the twelve edges so that the chosen edges connect all six vertices to one another.",
    format: "INTEGER",
    answer: "384",
    solution:
      "Five edges joining six vertices into one connected piece is exactly a spanning tree of the octahedron's graph, so we must count its spanning trees. The octahedron's graph is the complete graph on six vertices with the three long diagonals removed: each vertex is adjacent to all others except the one opposite it. Writing A for its adjacency matrix, J for the all-ones matrix, I for the identity and P for the adjacency matrix of the three opposite-vertex pairs, we have A = J − I − P.\n\nThe Matrix–Tree theorem says the number of spanning trees equals the product of the nonzero eigenvalues of the Laplacian L = D − A, divided by the number of vertices; here every vertex has degree 4, so L = 4I − A and it suffices to find the eigenvalues of A. The all-ones vector gives J·1 = 6·1, P·1 = 1, so A·1 = (6 − 1 − 1)·1 = 4·1. On the five-dimensional space of vectors whose coordinates sum to 0 we have J = 0, so A = −I − P there. On that space P has eigenvalue +1 on the two-dimensional space of vectors constant on each opposite pair and summing to zero, and eigenvalue −1 on the three-dimensional space of vectors that are opposite on each pair. Hence A has eigenvalue −1 − 1 = −2 twice and −1 + 1 = 0 three times, and the full spectrum of A is 4, 0, 0, 0, −2, −2.\n\nTherefore L = 4I − A has eigenvalues 0, 4, 4, 4, 6, 6, and the number of spanning trees is (4 · 4 · 4 · 6 · 6)/6 = 2304/6 = 384. (Independently, expanding a 5 × 5 cofactor of the Laplacian by exact integer arithmetic gives 384, and a brute-force scan of all C(12, 5) = 792 five-edge subsets, testing each for connectivity, also yields 384.)",
    hints: [
      "Five edges spanning six vertices with no room to spare means the chosen edges form a tree, so you are counting spanning trees of a highly symmetric 4-regular graph.",
      "Describe the octahedron's graph as the complete graph on six vertices minus a perfect matching of opposite pairs; that description makes its adjacency eigenvalues easy to read off.",
      "Split the space into the all-ones direction and the vectors summing to zero, find the eigenvalues on each, then convert adjacency eigenvalues into Laplacian eigenvalues and take their product over the number of vertices.",
    ],
    difficulty: 10,
    topicSlug: "graph-theory",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-93",
    question:
      "A regular 12-gon is inscribed in a circle of radius 1. Consider all 66 segments joining two of its vertices (the sides and all the diagonals). Compute the sum of the fourth powers of the lengths of these 66 segments.",
    format: "INTEGER",
    answer: "432",
    solution:
      "Label the vertices P₀, …, P₁₁ on the unit circle. If two vertices are separated by k steps, the central angle between them is θ_k = 2πk/12 and the chord length satisfies |P_iP_j|² = 2 − 2cos θ_k (law of cosines with both radii equal to 1). Rather than grouping by k, sum over ordered pairs and halve: the desired sum equals (1/2) · Σ_i Σ_{j ≠ i} |P_iP_j|⁴ = (1/2) · 12 · Σ_{k=1}^{11} (2 − 2cos θ_k)², since from each fixed vertex the other eleven are at step counts k = 1, …, 11. Expand (2 − 2cos θ)² = 4 − 8cos θ + 4cos²θ and evaluate the three pieces for k = 1, …, 11. First, Σ 4 = 44. Second, Σ_{k=0}^{11} cos(2πk/12) = 0 (the twelve twelfth roots of unity sum to 0), so Σ_{k=1}^{11} cos θ_k = −1 and the middle piece contributes −8(−1) = 8. Third, Σ_{k=0}^{11} cos²(2πk/12) = 12 · (1/2) = 6 using cos² = (1 + cos 2θ)/2 and the fact that the doubled angles again sum to zero; subtracting the k = 0 term gives Σ_{k=1}^{11} cos²θ_k = 5, contributing 4 · 5 = 20. The inner sum is 44 + 8 + 20 = 72, so the total is 6 · 72 = 432. (Direct numerical summation over all 66 pairs gives 432.000….)",
    hints: [
      "Write the squared chord length for a pair of vertices k steps apart using the law of cosines: 2 − 2cos(2πk/12).",
      "Sum over ordered pairs and divide by 2 — from any fixed vertex, the step counts run over k = 1 through 11.",
      "Expand (2 − 2cos θ)² and use the fact that the twelfth roots of unity sum to zero to evaluate Σ cos θ_k and Σ cos²θ_k.",
    ],
    difficulty: 10,
    topicSlug: "polygons",
    competitionSlug: "math-prize-for-girls",
  },
  {
    slug: "mpfg-94",
    question:
      "Compute the number of ways to write 10! as a product of three positive integers, where the three factors are unordered and repetitions are allowed. (For instance, 10! = 1 · 1 · 3628800 is one such way.)",
    format: "INTEGER",
    answer: "2040",
    solution:
      "First count ordered triples. Factoring, 10! = 2⁸ · 3⁴ · 5² · 7. An ordered triple (a, b, c) with abc = 10! is the same thing as a distribution, for each prime separately, of that prime's exponent among the three factors. Splitting an exponent e into three ordered nonnegative parts can be done in C(e + 2, 2) ways, so the number of ordered triples is C(10, 2)·C(6, 2)·C(4, 2)·C(3, 2) = 45 · 15 · 6 · 3 = 12150.\n\nNow pass to unordered triples. Group the ordered triples by the underlying multiset; the six orderings of a multiset collapse to one, but multisets with repeated entries are counted fewer than six times, so we correct with a symmetry count over the six permutations of the three coordinates. A permutation fixes an ordered triple only if the entries it swaps are equal. The identity fixes all 12150 triples. Each of the three transpositions fixes the triples with two equal entries, say a = b, which requires a²c = 10!, i.e. a² divides 10!; the number of such a is obtained by halving each exponent downward, (⌊8/2⌋ + 1)(⌊4/2⌋ + 1)(⌊2/2⌋ + 1)(⌊1/2⌋ + 1) = 5 · 3 · 2 · 1 = 30, and each such a determines c, so each transposition fixes 30 triples. Each of the two 3-cycles fixes only triples with a = b = c, which would need 10! to be a perfect cube; since the exponent of 2 is 8, not a multiple of 3, there are none.\n\nAveraging the fixed-point counts over the six permutations gives (12150 + 3·30 + 2·0)/6 = 12240/6 = 2040. (A direct computer enumeration over all 270 divisors of 10!, collecting the sorted triples, also gives 12150 ordered and 2040 unordered.)",
    hints: [
      "Handle each prime of 10! independently: an ordered factorization into three parts just splits each prime exponent into three nonnegative pieces.",
      "Ordered triples overcount unordered ones by a factor of six only when all three factors are distinct, so count the triples with two equal factors separately.",
      "Two factors are equal exactly when a square divides 10! with the matching quotient; count the divisors whose square divides 10!, then average over the six orderings.",
    ],
    difficulty: 9,
    topicSlug: "factorization",
    competitionSlug: "math-prize-for-girls",
  },
];
