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
];
