import type { ProblemSeed } from "./problems";

/**
 * Hand-written problems styled after the AMC 12 (American Mathematics
 * Competitions, grade ≤12) — the hardest of the AMC family, layering
 * logarithms, trigonometry, complex numbers, and advanced sequences on
 * top of the AMC 10 topic base. Every problem below is an original
 * NumberSmith problem, written to match the phrasing conventions and
 * difficulty ramp of a real AMC 12 exam; none are transcribed, closely
 * paraphrased, or numerically reskinned from any official AMC/AHSME
 * contest. Difficulty rises from about 5 (problem 1) to 10 (problem 32),
 * with genuinely difficult multi-step algebra, trig identities, complex
 * numbers, and advanced counting/number-theory dominating the back half.
 *
 * Seeded as practice (isPlacement: false), same as the other
 * competition-tagged problem sets.
 */
export const AMC12_PROBLEMS: ProblemSeed[] = [
  {
    slug: "amc12-01",
    question:
      "A store marks up the price of a bicycle by 40%, then later applies a 25% discount to the marked-up price during a sale. The sale price turns out to be $6 more than the bicycle's original price. What was the original price of the bicycle, in dollars?",
    format: "MULTIPLE_CHOICE",
    choices: ["120", "100", "110", "130", "150"],
    answer: "A",
    solution:
      "Let the original price be p. Marking up by 40% gives 1.4p, and then discounting that by 25% gives 1.4p × 0.75 = 1.05p. Setting the sale price $6 above the original price: 1.05p - p = 6, so 0.05p = 6, giving p = 120.",
    hints: [
      "Apply the markup and discount as successive multipliers on p.",
      "The combined effect of a 40% increase then a 25% decrease is a single multiplier of 1.05 — set 1.05p - p equal to 6.",
    ],
    difficulty: 5,
    topicSlug: "percentages",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-02",
    question:
      "The ratio of pencils to pens in a drawer is 7:4. After 6 pencils are removed and 6 pens are added, the ratio of pencils to pens becomes 1:1. How many pencils were originally in the drawer?",
    format: "MULTIPLE_CHOICE",
    choices: ["24", "28", "21", "32", "35"],
    answer: "B",
    solution:
      "Let the pencils be 7x and the pens be 4x. After the changes, (7x - 6)/(4x + 6) = 1, so 7x - 6 = 4x + 6, giving 3x = 12 and x = 4. There were originally 7(4) = 28 pencils.",
    hints: [
      "Represent the original counts as 7x and 4x for some positive x.",
      "Set up an equation from the new ratio being 1:1 and solve for x.",
    ],
    difficulty: 5,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-03",
    question: "Two real numbers have a sum of 58 and a difference of 12. What is their product?",
    format: "MULTIPLE_CHOICE",
    choices: ["780", "793", "805", "812", "840"],
    answer: "C",
    solution:
      "Let the numbers be x and y with x + y = 58 and x - y = 12. Adding gives 2x = 70, so x = 35, and then y = 23. Their product is 35 × 23 = 805.",
    hints: [
      "Add and subtract the two equations to solve for each number.",
      "Once you know both numbers exactly, multiply them directly.",
    ],
    difficulty: 5,
    topicSlug: "linear-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-04",
    question:
      "A two-digit number and the number formed by reversing its digits have a sum of 143. The tens digit of the original number is 3 more than its units digit. What is the original number?",
    format: "MULTIPLE_CHOICE",
    choices: ["58", "67", "74", "85", "96"],
    answer: "D",
    solution:
      "Let the number be 10a + b, where a is the tens digit and b the units digit. Its reverse is 10b + a, and the sum is 11(a + b) = 143, so a + b = 13. Since a = b + 3, substituting gives 2b + 3 = 13, so b = 5 and a = 8. The original number is 85.",
    hints: [
      "Write the number as 10a + b and its reverse as 10b + a; their sum simplifies nicely.",
      "Combine a + b = 13 with a = b + 3 to solve for each digit.",
    ],
    difficulty: 5,
    topicSlug: "number-properties",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-05",
    question:
      "In triangle ABC, angle A measures 20° more than angle B, and angle C is twice angle B. What is the measure of angle C, in degrees?",
    format: "MULTIPLE_CHOICE",
    choices: ["60", "65", "70", "75", "80"],
    answer: "E",
    solution:
      "Let angle B = x. Then angle A = x + 20 and angle C = 2x. Since the angles of a triangle sum to 180°: x + (x + 20) + 2x = 180, so 4x = 160 and x = 40. Then angle C = 2(40) = 80°.",
    hints: [
      "Express all three angles in terms of angle B.",
      "Use the fact that the three angles of a triangle sum to 180°.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-06",
    question: "The two roots of x² - 9x + k = 0 differ by 3. What is the value of k?",
    format: "MULTIPLE_CHOICE",
    choices: ["16", "18", "20", "14", "22"],
    answer: "B",
    solution:
      "By Vieta's formulas, the roots sum to 9. Let the roots be r and r + 3; then 2r + 3 = 9, so r = 3, and the roots are 3 and 6. Their product is k, so k = 3 × 6 = 18.",
    hints: [
      "Use Vieta's formulas to relate the sum of the roots to the coefficient of x.",
      "Write the roots as r and r + 3, then solve for r before finding their product.",
    ],
    difficulty: 6,
    topicSlug: "quadratics",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-07",
    question:
      "An arithmetic sequence has 15 terms. The sum of its first 5 terms is 50, and the sum of its last 5 terms is 200. What is the sum of all 15 terms?",
    format: "MULTIPLE_CHOICE",
    choices: ["350", "360", "390", "375", "400"],
    answer: "D",
    solution:
      "The sum of the first 5 terms equals 5 times the 3rd term (their middle term), so the 3rd term is 10. Similarly, the sum of the last 5 terms equals 5 times the 13th term, so the 13th term is 40. The common difference satisfies 10d = 40 - 10 = 30, so d = 3, and the 1st term is 10 - 2(3) = 4. The sum of all 15 terms equals 15 times the 8th (middle) term, which is 4 + 7(3) = 25, giving a total of 15 × 25 = 375.",
    hints: [
      "The sum of any 5 consecutive terms of an arithmetic sequence is 5 times their middle term.",
      "Use the 3rd and 13th terms to find the common difference, then find the 8th term to get the full sum.",
    ],
    difficulty: 6,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-08",
    question: "If 3^a = 7 and 3^b = 63, what is the value of b - a?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "1", "3", "4", "0"],
    answer: "A",
    solution:
      "Since 63 = 9 × 7 = 3² × 3^a = 3^(a+2), we have 3^b = 3^(a+2), so b = a + 2. Thus b - a = 2.",
    hints: [
      "Factor 63 as 9 times 7, and rewrite 9 as a power of 3.",
      "Compare exponents once both sides are written as powers of 3.",
    ],
    difficulty: 6,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-09",
    question: "A circle is inscribed in a square with side length 12. What is the area of the region inside the square but outside the circle?",
    format: "MULTIPLE_CHOICE",
    choices: ["108 - 36π", "72 - 36π", "144 - 36π", "36π - 144", "144 - 18π"],
    answer: "C",
    solution:
      "The square has area 12² = 144. The inscribed circle has diameter 12, so radius 6, and area 36π. The region inside the square but outside the circle has area 144 - 36π.",
    hints: [
      "The diameter of the inscribed circle equals the side length of the square.",
      "Subtract the circle's area from the square's area.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-10",
    question:
      "A password consists of 4 characters: the first two are distinct letters chosen from {A, B, C, D, E}, and the last two are distinct digits chosen from {1, 2, 3, 4, 5, 6}. How many such passwords are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["450", "500", "550", "580", "600"],
    answer: "E",
    solution:
      "There are 5 × 4 = 20 ways to choose the two distinct letters in order, and 6 × 5 = 30 ways to choose the two distinct digits in order. By the multiplication principle, the total number of passwords is 20 × 30 = 600.",
    hints: [
      "Count the ordered choices for the letter positions and digit positions separately.",
      "Multiply the two counts together.",
    ],
    difficulty: 6,
    topicSlug: "counting-principles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-11",
    question: "A line passes through the points (3, 11) and (7, 23). What is the y-intercept of this line?",
    format: "MULTIPLE_CHOICE",
    choices: ["0", "2", "1", "3", "4"],
    answer: "B",
    solution:
      "The slope is (23 - 11)/(7 - 3) = 12/4 = 3. Using point-slope form with (3, 11): 11 = 3(3) + b, so b = 11 - 9 = 2. The y-intercept is 2.",
    hints: [
      "Find the slope from the two given points first.",
      "Substitute one point into y = 3x + b to solve for b.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-12",
    question: "Let f(x) = 3x - 4. If f(f(a)) = 11, what is the value of a?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "2", "3", "4", "5"],
    answer: "C",
    solution:
      "f(a) = 3a - 4, so f(f(a)) = 3(3a - 4) - 4 = 9a - 16. Setting this equal to 11: 9a - 16 = 11, so 9a = 27 and a = 3.",
    hints: [
      "Compute f(a) first, then apply f again to that result.",
      "Simplify f(f(a)) into a single linear expression in a before solving.",
    ],
    difficulty: 6,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-13",
    question: "The polynomial x³ - 6x² + 11x - 6 has three real roots. What is the sum of the squares of the roots?",
    format: "MULTIPLE_CHOICE",
    choices: ["14", "10", "12", "16", "18"],
    answer: "A",
    solution:
      "By Vieta's formulas, the sum of the roots is 6 and the sum of the pairwise products is 11. The sum of the squares of the roots equals (sum)² - 2(sum of pairwise products) = 6² - 2(11) = 36 - 22 = 14.",
    hints: [
      "Use Vieta's formulas to find the sum of the roots and the sum of their pairwise products.",
      "The sum of squares equals the square of the sum minus twice the sum of pairwise products.",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-14",
    question: "Two fair six-sided dice are rolled. What is the probability that the sum of the two dice is a prime number?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/3", "7/18", "4/9", "5/12", "11/36"],
    answer: "D",
    solution:
      "The possible prime sums are 2, 3, 5, 7, and 11. Counting outcomes: sum 2 has 1 way, sum 3 has 2 ways, sum 5 has 4 ways, sum 7 has 6 ways, and sum 11 has 2 ways, for a total of 1 + 2 + 4 + 6 + 2 = 15 favorable outcomes out of 36. The probability is 15/36 = 5/12.",
    hints: [
      "List the prime numbers that are achievable as a sum of two dice (between 2 and 12).",
      "Count the outcomes for each prime sum separately, then add them and divide by 36.",
    ],
    difficulty: 7,
    topicSlug: "basic-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-15",
    question: "How many distinct arrangements of the letters in the word ALGEBRA have the two A's adjacent to each other?",
    format: "MULTIPLE_CHOICE",
    choices: ["600", "720", "360", "840", "5040"],
    answer: "B",
    solution:
      "ALGEBRA has 7 letters with the letter A repeated twice and all other letters distinct. Treating the two A's as a single glued block leaves 6 distinct items to arrange (the AA block, L, G, E, B, R), giving 6! = 720 arrangements.",
    hints: [
      "Glue the two A's together into a single block to force them adjacent.",
      "Count the arrangements of the resulting 6 distinct items.",
    ],
    difficulty: 7,
    topicSlug: "permutations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-16",
    question: "What is the remainder when 3^2023 is divided by 13?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "9", "10", "12", "3"],
    answer: "E",
    solution:
      "Since 3³ = 27 ≡ 1 (mod 13), the powers of 3 modulo 13 cycle with period 3. Since 2023 = 3(674) + 1, we have 3^2023 ≡ 3^1 ≡ 3 (mod 13).",
    hints: [
      "Find the smallest power of 3 that is congruent to 1 modulo 13.",
      "Reduce the exponent 2023 modulo that cycle length.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-17",
    question:
      "In triangle ABC, points D and E lie on AB and AC respectively, with DE parallel to BC. If AD = 6, DB = 9, and BC = 25, what is the length of DE?",
    format: "MULTIPLE_CHOICE",
    choices: ["8", "9", "10", "12", "15"],
    answer: "C",
    solution:
      "Since DE is parallel to BC, triangle ADE is similar to triangle ABC with ratio AD/AB = 6/(6+9) = 6/15 = 2/5. Thus DE = BC × (2/5) = 25 × 2/5 = 10.",
    hints: [
      "Parallel line DE creates a smaller triangle similar to the whole triangle.",
      "The similarity ratio equals AD divided by the full length AB.",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-18",
    question: "How many integers n satisfy the inequality n² - 7n - 30 < 0?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "10", "11", "13", "14"],
    answer: "A",
    solution:
      "Factoring (or using the quadratic formula), n² - 7n - 30 = (n - 10)(n + 3), which is negative exactly when -3 < n < 10. The integers strictly between -3 and 10 are -2, -1, 0, ..., 9, which is 12 integers.",
    hints: [
      "Find the roots of n² - 7n - 30 = 0 to determine where the expression changes sign.",
      "The quadratic is negative strictly between its two roots — count the integers in that open interval.",
    ],
    difficulty: 7,
    topicSlug: "inequalities",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-19",
    question: "A right circular cone has slant height 10 and height 8. What is the volume of the cone?",
    format: "MULTIPLE_CHOICE",
    choices: ["72π", "84π", "108π", "96π", "120π"],
    answer: "D",
    solution:
      "The radius, height, and slant height form a right triangle, so r² + 8² = 10², giving r² = 36 and r = 6. The volume is (1/3)πr²h = (1/3)π(36)(8) = 96π.",
    hints: [
      "Use the Pythagorean theorem to find the radius from the slant height and height.",
      "Substitute the radius and height into the cone volume formula V = (1/3)πr²h.",
    ],
    difficulty: 7,
    topicSlug: "area-volume",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-20",
    question:
      "An isosceles trapezoid has parallel sides of lengths 15 and 25, and each of its two legs has length 13. What is the area of the trapezoid?",
    format: "MULTIPLE_CHOICE",
    choices: ["200", "240", "220", "260", "280"],
    answer: "B",
    solution:
      "The difference between the parallel sides is 25 - 15 = 10, which splits symmetrically into overhangs of 5 on each side. Each leg, overhang, and the height form a right triangle, so the height is √(13² - 5²) = √144 = 12. The area is (1/2)(15 + 25)(12) = 20 × 12 = 240.",
    hints: [
      "Drop perpendiculars from the shorter parallel side to form two right triangles with the legs.",
      "Use the Pythagorean theorem on one of those right triangles to find the height.",
    ],
    difficulty: 7,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-21",
    question: "If sin θ + cos θ = 7/5 and 0 < θ < π/2, what is the value of sin θ · cos θ?",
    format: "MULTIPLE_CHOICE",
    choices: ["7/25", "24/25", "1/2", "13/25", "12/25"],
    answer: "E",
    solution:
      "Squaring both sides: (sin θ + cos θ)² = sin²θ + 2 sin θ cos θ + cos²θ = 1 + 2 sin θ cos θ = (7/5)² = 49/25. Solving, 2 sin θ cos θ = 49/25 - 1 = 24/25, so sin θ cos θ = 12/25.",
    hints: [
      "Square both sides of the given equation and use sin²θ + cos²θ = 1.",
      "Isolate the term 2 sin θ cos θ after squaring.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-22",
    question: "Let z = 3 + 4i. What is |z² - 2z + 5|?",
    format: "MULTIPLE_CHOICE",
    choices: ["8√5", "4√5", "16", "8√3", "10√3"],
    answer: "A",
    solution:
      "z² = (3 + 4i)² = 9 + 24i - 16 = -7 + 24i. Then 2z = 6 + 8i, so z² - 2z + 5 = (-7 + 24i) - (6 + 8i) + 5 = -8 + 16i. Its magnitude is √((-8)² + 16²) = √(64 + 256) = √320 = 8√5.",
    hints: [
      "Compute z² directly by expanding (3 + 4i)².",
      "Combine the real and imaginary parts of z² - 2z + 5 before taking the magnitude.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-23",
    question:
      "A committee of 5 people is chosen from 6 married couples (12 people total), with the restriction that no two people from the same couple can both be on the committee. How many such committees are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["132", "160", "192", "216", "252"],
    answer: "C",
    solution:
      "Since the committee has 5 people and no couple may be fully represented, it must draw exactly one person from each of 5 different couples out of the 6. There are C(6,5) = 6 ways to choose which couples contribute, and 2 choices for which member of each chosen couple joins, giving 2⁵ = 32 ways. The total is 6 × 32 = 192.",
    hints: [
      "With only 5 people and no couple doubled up, the committee must use exactly 5 of the 6 couples.",
      "Choose which couples are represented, then choose one person from each of those couples.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-24",
    question:
      "A box contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. Given that at least one of the two balls drawn is red, what is the probability that both balls are red?",
    format: "MULTIPLE_CHOICE",
    choices: ["2/9", "3/10", "1/3", "1/5", "2/5"],
    answer: "D",
    solution:
      "P(both red) = C(4,2)/C(10,2) = 6/45 = 2/15. P(no red) = C(6,2)/C(10,2) = 15/45 = 1/3, so P(at least one red) = 1 - 1/3 = 2/3. By the definition of conditional probability, P(both red | at least one red) = (2/15)/(2/3) = 1/5.",
    hints: [
      "Compute P(both red) and P(at least one red) separately using combinations.",
      "Divide the probability of both red by the probability of at least one red.",
    ],
    difficulty: 8,
    topicSlug: "conditional-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-25",
    question: "How many ordered pairs of positive integers (x, y) satisfy x² - y² = 105?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "2", "5", "6"],
    answer: "B",
    solution:
      "Factor as (x - y)(x + y) = 105. Since 105 is odd, both factors x - y and x + y must be odd, which holds automatically for any factor pair of 105. The factor pairs (d, e) with d ≤ e and de = 105 are (1,105), (3,35), (5,21), (7,15) — four pairs. Each gives x = (d+e)/2 and y = (e-d)/2 as positive integers, so there are 4 ordered pairs.",
    hints: [
      "Factor the difference of squares as (x - y)(x + y) = 105.",
      "List all factor pairs of 105 and check that each produces integer values of x and y.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-26",
    question:
      "A sequence satisfies a₁ = 2, a₂ = 5, and aₙ = 3aₙ₋₁ - 2aₙ₋₂ for n ≥ 3. What is a₆?",
    format: "MULTIPLE_CHOICE",
    choices: ["83", "89", "101", "107", "95"],
    answer: "E",
    solution:
      "Computing successive terms: a₃ = 3(5) - 2(2) = 11, a₄ = 3(11) - 2(5) = 23, a₅ = 3(23) - 2(11) = 47, a₆ = 3(47) - 2(23) = 141 - 46 = 95.",
    hints: [
      "Apply the recurrence one term at a time, starting from a₃.",
      "Keep careful track of each new term before computing the next.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-27",
    question: "A function f satisfies f(x) + 2f(1 - x) = 3x² for all real x. What is f(2)?",
    format: "MULTIPLE_CHOICE",
    choices: ["-2", "0", "2", "4", "6"],
    answer: "A",
    solution:
      "Substituting x and 1 - x gives two equations: f(x) + 2f(1-x) = 3x² and f(1-x) + 2f(x) = 3(1-x)². Multiplying the second by 2 and subtracting the first eliminates f(1-x): 3f(x) = 6(1-x)² - 3x², so f(x) = 2(1-x)² - x² = x² - 4x + 2. Then f(2) = 4 - 8 + 2 = -2.",
    hints: [
      "Substitute 1 - x for x in the original equation to get a second equation relating f(x) and f(1-x).",
      "Combine the two equations to eliminate f(1-x) and solve for f(x) explicitly.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-28",
    question: "How many ordered pairs of positive integers (m, n) satisfy lcm(m, n) = 360 and gcd(m, n) = 6?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "6", "8", "10", "12"],
    answer: "C",
    solution:
      "Write m = 6a and n = 6b with gcd(a, b) = 1. Then lcm(m, n) = 6ab, so 6ab = 360 gives ab = 60 = 2² × 3 × 5. For gcd(a, b) = 1, each prime power in 60's factorization must go entirely to a or entirely to b. With 3 distinct primes, there are 2³ = 8 ways to split them, giving 8 ordered pairs.",
    hints: [
      "Write m = 6a and n = 6b where gcd(a, b) = 1, and express lcm(m,n) in terms of a and b.",
      "Since gcd(a,b) = 1, each prime power of ab = 60 must be assigned entirely to a or to b.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-29",
    question:
      "Let S = {1, 2, ..., 8}. How many ordered pairs (A, B) of subsets of S satisfy A ⊆ B (including the possibility that A or B is empty)?",
    format: "MULTIPLE_CHOICE",
    choices: ["2187", "4096", "8192", "6561", "19683"],
    answer: "D",
    solution:
      "For each element of S independently, there are exactly 3 possibilities consistent with A ⊆ B: the element is in neither set, the element is in B but not A, or the element is in both A and B. With 8 independent elements, the total count is 3⁸ = 6561.",
    hints: [
      "Consider each element of S independently and count the ways it can relate to A and B while keeping A ⊆ B.",
      "There are exactly 3 valid placements per element — raise that to the power of |S|.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-30",
    question: "In triangle ABC, AB = 13, BC = 14, and CA = 15. The incircle of the triangle touches BC at point D. What is the length of BD?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "7", "8", "9", "6"],
    answer: "E",
    solution:
      "Using standard notation with a = BC = 14, b = CA = 15, c = AB = 13, the semiperimeter is s = (14+15+13)/2 = 21. The tangent length from vertex B to the incircle is s - b = 21 - 15 = 6, and this equals BD.",
    hints: [
      "Compute the semiperimeter of the triangle first.",
      "The tangent length from a vertex to the incircle equals the semiperimeter minus the side opposite that vertex.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-31",
    question:
      "Positive real numbers a, b, c satisfy a + b + c = 6 and ab + bc + ca = 9. What is the largest possible value of a?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "3.5", "4", "4.5", "5"],
    answer: "C",
    solution:
      "From the constraints, b + c = 6 - a and bc = 9 - a(6 - a) = 9 - 6a + a². For b and c to be real, the discriminant of t² - (6-a)t + (9-6a+a²) = 0 must be nonnegative: (6-a)² - 4(9-6a+a²) ≥ 0, which simplifies to 12a - 3a² ≥ 0, or 3a(4-a) ≥ 0. Since a > 0, this requires a ≤ 4. At a = 4, b = c = 1, which satisfies both original constraints, so the maximum is a = 4.",
    hints: [
      "Express b + c and bc in terms of a using the two given equations.",
      "For b and c to be real numbers, the discriminant of the quadratic they satisfy must be nonnegative.",
    ],
    difficulty: 9,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-32",
    question: "Let a, b, and c be the roots of x³ - 6x² + 3x + 10 = 0. What is the value of a³ + b³ + c³?",
    format: "MULTIPLE_CHOICE",
    choices: ["96", "132", "114", "150", "168"],
    answer: "B",
    solution:
      "By Vieta's formulas, e₁ = a+b+c = 6, e₂ = ab+bc+ca = 3, e₃ = abc = -10. Using the identity a³+b³+c³ = e₁³ - 3e₁e₂ + 3e₃: a³+b³+c³ = 216 - 3(6)(3) + 3(-10) = 216 - 54 - 30 = 132. (Check: the polynomial factors as (x+1)(x-2)(x-5), with roots -1, 2, 5, and (-1)³+2³+5³ = -1+8+125 = 132.)",
    hints: [
      "Extract the elementary symmetric sums e₁, e₂, e₃ from the polynomial's coefficients via Vieta's formulas.",
      "Use the identity a³+b³+c³ = e₁³ - 3e₁e₂ + 3e₃, or try to factor the cubic directly to find the roots.",
    ],
    difficulty: 10,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },

// ============================= DIFFICULTY 5 =============================
  {
    slug: "amc12-33",
    question:
      "Machine A can complete a printing job in 10 hours working alone, and Machine B can complete the same job in 15 hours working alone. If both machines work together the entire time, how many hours will it take them to complete the job?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "7", "4", "6", "8"],
    answer: "D",
    solution:
      "Machine A's rate is 1/10 of the job per hour and Machine B's rate is 1/15 of the job per hour. Together their rate is 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 of the job per hour, so the job takes 6 hours.",
    hints: [
      "Convert each machine's time into a rate: jobs completed per hour.",
      "Add the two rates together, then take the reciprocal of the combined rate.",
    ],
    difficulty: 5,
    topicSlug: "rates",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-34",
    question:
      "A price is increased by 20% and then the new price is decreased by 20%. The final price is what percent of the original price?",
    format: "MULTIPLE_CHOICE",
    choices: ["94%", "90%", "100%", "98%", "96%"],
    answer: "E",
    solution:
      "Increasing by 20% multiplies the price by 1.2, and decreasing the result by 20% multiplies by 0.8. The combined effect is 1.2 × 0.8 = 0.96, so the final price is 96% of the original.",
    hints: [
      "Represent each percent change as a multiplier rather than computing amounts separately.",
      "Multiply the two multipliers together to get the overall factor.",
    ],
    difficulty: 5,
    topicSlug: "percentages",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-35",
    question:
      "In isosceles triangle DEF, angle D and angle E are equal, and angle F is 24° more than angle D. What is the measure of angle F?",
    format: "MULTIPLE_CHOICE",
    choices: ["64°", "76°", "70°", "82°", "88°"],
    answer: "B",
    solution:
      "Let angle D = angle E = x, so angle F = x + 24. Since the angles sum to 180°: x + x + (x + 24) = 180, so 3x = 156 and x = 52. Then angle F = 52 + 24 = 76°.",
    hints: [
      "Express all three angles in terms of a single variable x.",
      "Use the fact that a triangle's angles sum to 180° to solve for x.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-36",
    question:
      "The two roots of x² - 13x + k = 0 are positive integers, and the larger root exceeds the smaller by 5. What is the value of k?",
    format: "MULTIPLE_CHOICE",
    choices: ["36", "30", "32", "40", "42"],
    answer: "A",
    solution:
      "By Vieta's formulas, the roots sum to 13. Writing them as r and r + 5 gives 2r + 5 = 13, so r = 4 and the roots are 4 and 9. Then k equals their product: k = 4 × 9 = 36.",
    hints: [
      "Use Vieta's formula for the sum of the roots to set up an equation.",
      "Once you know both integer roots, their product gives k directly.",
    ],
    difficulty: 5,
    topicSlug: "quadratics",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-37",
    question: "An arithmetic sequence begins 7, 12, 17, 22, .... What is the 20th term?",
    format: "MULTIPLE_CHOICE",
    choices: ["97", "107", "112", "100", "102"],
    answer: "E",
    solution:
      "The sequence has first term a₁ = 7 and common difference d = 5. The 20th term is a₂₀ = a₁ + 19d = 7 + 19(5) = 7 + 95 = 102.",
    hints: [
      "Identify the first term and common difference from the given terms.",
      "Use aₙ = a₁ + (n - 1)d with n = 20.",
    ],
    difficulty: 5,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-38",
    question: "Two fair six-sided dice are rolled. What is the probability that the sum of the two dice is 8?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/6", "5/36", "7/36", "5/18", "1/9"],
    answer: "B",
    solution:
      "There are 36 equally likely outcomes. The pairs summing to 8 are (2,6), (3,5), (4,4), (5,3), (6,2), which is 5 outcomes. The probability is 5/36.",
    hints: [
      "List the ordered pairs of dice rolls that sum to 8.",
      "Divide the number of favorable outcomes by the total of 36 outcomes.",
    ],
    difficulty: 5,
    topicSlug: "basic-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-39",
    question:
      "A chord of a circle with radius 13 lies at a perpendicular distance of 5 from the center. What is the length of the chord?",
    format: "MULTIPLE_CHOICE",
    choices: ["22", "28", "26", "20", "24"],
    answer: "E",
    solution:
      "The perpendicular from the center bisects the chord, forming a right triangle with hypotenuse 13 and one leg 5. The half-chord is √(13² - 5²) = √(169 - 25) = √144 = 12, so the full chord is 24.",
    hints: [
      "Draw the perpendicular from the center to the chord — it bisects the chord.",
      "Use the Pythagorean theorem with the radius as the hypotenuse.",
    ],
    difficulty: 5,
    topicSlug: "circles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-40",
    question: "How many two-digit positive integers have digits that sum to 12?",
    format: "MULTIPLE_CHOICE",
    choices: ["7", "8", "5", "6", "9"],
    answer: "A",
    solution:
      "Let the number be 10a + b with tens digit a (1-9) and units digit b (0-9), where a + b = 12. Since b = 12 - a must satisfy 0 ≤ b ≤ 9, a must satisfy 3 ≤ a ≤ 9, giving 7 values: 39, 48, 57, 66, 75, 84, 93.",
    hints: [
      "Write the constraint as a + b = 12 with a from 1-9 and b from 0-9.",
      "Find the range of valid values for the tens digit a.",
    ],
    difficulty: 5,
    topicSlug: "number-properties",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-41",
    question:
      "A solution is 30% acid by volume. How many liters of pure acid must be added to 10 liters of this solution to make a solution that is 50% acid?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "2", "3", "6", "5"],
    answer: "A",
    solution:
      "The original solution has 0.3(10) = 3 liters of acid. Adding x liters of pure acid gives (3 + x) liters of acid in (10 + x) liters total. Setting (3 + x)/(10 + x) = 0.5 gives 3 + x = 5 + 0.5x, so 0.5x = 2 and x = 4.",
    hints: [
      "Track the amount of pure acid separately from the total volume.",
      "Set up the equation (acid amount)/(total volume) = 0.5 and solve for x.",
    ],
    difficulty: 5,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-42",
    question: "Solve for x: 3^(2x - 1) = 27^(x - 2).",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "7", "6", "5", "3"],
    answer: "D",
    solution:
      "Since 27 = 3³, the right side becomes 3^(3(x-2)) = 3^(3x - 6). Setting the exponents equal: 2x - 1 = 3x - 6, so x = 5.",
    hints: [
      "Rewrite 27 as a power of 3 so both sides share the same base.",
      "Once the bases match, set the exponents equal to each other.",
    ],
    difficulty: 5,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-43",
    question: "If sin θ = 3/5 and θ is an angle in the first quadrant, what is cos(2θ)?",
    format: "MULTIPLE_CHOICE",
    choices: ["-7/25", "9/25", "24/25", "7/25", "1/5"],
    answer: "D",
    solution:
      "Using the double-angle identity cos(2θ) = 1 - 2sin²θ: cos(2θ) = 1 - 2(3/5)² = 1 - 2(9/25) = 1 - 18/25 = 7/25.",
    hints: [
      "Recall the double-angle identity cos(2θ) = 1 - 2sin²θ.",
      "Substitute sin θ = 3/5 directly — you don't need cos θ for this identity.",
    ],
    difficulty: 5,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-44",
    question:
      "Let M be the midpoint of the segment from (1, 2) to (7, 10). What is the distance from M to the point (5, 5)?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "2√2", "√2", "√3", "2"],
    answer: "C",
    solution:
      "The midpoint M = ((1+7)/2, (2+10)/2) = (4, 6). The distance from (4, 6) to (5, 5) is √((5-4)² + (5-6)²) = √(1 + 1) = √2.",
    hints: [
      "First find the midpoint using the midpoint formula.",
      "Then apply the distance formula between the midpoint and (5, 5).",
    ],
    difficulty: 5,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-45",
    question: "A committee of 3 people is chosen from a group of 8 people. How many different committees are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["70", "64", "42", "48", "56"],
    answer: "E",
    solution:
      "The order of selection does not matter, so this is a combination: C(8,3) = 8!/(3!5!) = (8 × 7 × 6)/(3 × 2 × 1) = 336/6 = 56.",
    hints: [
      "Since the committee has no distinct roles, order doesn't matter — use combinations.",
      "Compute C(8,3) = (8 × 7 × 6)/3!.",
    ],
    difficulty: 5,
    topicSlug: "combinations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-46",
    question: "If x + y = 15 and x - y = 3, what is the value of xy?",
    format: "MULTIPLE_CHOICE",
    choices: ["50", "60", "45", "48", "54"],
    answer: "E",
    solution:
      "Adding the equations: 2x = 18, so x = 9. Then y = 15 - 9 = 6. The product xy = 9 × 6 = 54.",
    hints: [
      "Add and subtract the two given equations to solve for x and y individually.",
      "Once both values are known, multiply them directly.",
    ],
    difficulty: 5,
    topicSlug: "systems-of-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-47",
    question: "A rectangle has perimeter 36 and area 80. What is the positive difference between its length and width?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "8", "2", "6", "4"],
    answer: "C",
    solution:
      "Let l and w be the length and width, so l + w = 18 and lw = 80. Then (l - w)² = (l + w)² - 4lw = 324 - 320 = 4, so l - w = 2.",
    hints: [
      "Use the perimeter to find l + w, and the area gives lw.",
      "Compute (l - w)² using the identity (l - w)² = (l + w)² - 4lw.",
    ],
    difficulty: 5,
    topicSlug: "area-volume",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-48",
    question: "What is the sum of all prime numbers strictly between 40 and 60?",
    format: "MULTIPLE_CHOICE",
    choices: ["247", "243", "241", "245", "239"],
    answer: "B",
    solution: "The primes between 40 and 60 are 41, 43, 47, 53, and 59. Their sum is 41 + 43 + 47 + 53 + 59 = 243.",
    hints: [
      "List every integer from 41 to 59 and test each for primality.",
      "Watch out for 49 = 7² and 51 = 3 × 17, which are not prime.",
    ],
    difficulty: 5,
    topicSlug: "primes",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-49",
    question:
      "A car travels 60 miles at a constant speed of v miles per hour, then returns along the same route at a speed of v + 10 miles per hour. If the total travel time is 3.5 hours, what is v?",
    format: "MULTIPLE_CHOICE",
    choices: ["35", "40", "25", "20", "30"],
    answer: "E",
    solution:
      "The total time is 60/v + 60/(v+10) = 3.5. Multiplying through by 2v(v+10): 120(v+10) + 120v = 7v(v+10), which simplifies to 7v² - 170v - 1200 = 0. The discriminant is 170² + 4(7)(1200) = 28900 + 33600 = 62500 = 250², so v = (170 + 250)/14 = 30.",
    hints: [
      "Write the total time as the sum of two separate time-equals-distance-over-speed expressions.",
      "Clear denominators to get a quadratic in v, then solve — only the positive root makes sense.",
    ],
    difficulty: 5,
    topicSlug: "rates",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-50",
    question:
      "In parallelogram ABCD, consecutive angles A and B satisfy angle A = (3x - 10)° and angle B = (2x + 30)°. What is the measure of angle A?",
    format: "MULTIPLE_CHOICE",
    choices: ["84°", "86°", "82°", "88°", "90°"],
    answer: "B",
    solution:
      "Consecutive angles in a parallelogram are supplementary: (3x - 10) + (2x + 30) = 180, so 5x + 20 = 180, giving x = 32. Then angle A = 3(32) - 10 = 86°.",
    hints: [
      "Recall that consecutive angles of a parallelogram sum to 180°.",
      "Solve the resulting linear equation for x, then substitute back into angle A's expression.",
    ],
    difficulty: 5,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-51",
    question: "If (x - 3) is a factor of x³ - 5x² + kx - 6, what is the value of k?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "9", "7", "6", "8"],
    answer: "E",
    solution:
      "By the factor theorem, substituting x = 3 must give 0: 27 - 45 + 3k - 6 = 0, so 3k - 24 = 0, giving k = 8.",
    hints: [
      "Use the factor theorem: if (x - 3) is a factor, then plugging in x = 3 gives 0.",
      "Substitute x = 3 into the polynomial and solve the resulting linear equation for k.",
    ],
    difficulty: 5,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-52",
    question:
      "The average of 5 numbers is 20. When one number is removed, the average of the remaining 4 numbers is 18. What is the value of the number that was removed?",
    format: "MULTIPLE_CHOICE",
    choices: ["28", "26", "24", "30", "32"],
    answer: "A",
    solution:
      "The sum of all 5 numbers is 5 × 20 = 100. The sum of the remaining 4 numbers is 4 × 18 = 72. The removed number is 100 - 72 = 28.",
    hints: [
      "Convert both averages into total sums using (average) × (count).",
      "Subtract the smaller sum from the larger sum to find the removed number.",
    ],
    difficulty: 5,
    topicSlug: "averages",
    competitionSlug: "amc12",
  },

  // ============================= DIFFICULTY 6 =============================
  {
    slug: "amc12-53",
    question: "Solve for x: log₂(x) + log₂(x - 6) = 4.",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "6", "10", "12", "8"],
    answer: "E",
    solution:
      "Combine the logs: log₂(x(x-6)) = 4, so x(x-6) = 16, giving x² - 6x - 16 = 0, which factors as (x-8)(x+2) = 0. Since x > 6 is required for x - 6 > 0, x = 8 is the only valid solution.",
    hints: [
      "Combine the two logarithms using log(a) + log(b) = log(ab).",
      "Solve the resulting quadratic, then discard any root outside the domain of the original logs.",
    ],
    difficulty: 6,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-54",
    question: "In triangle ABC, AB = 5, AC = 8, and angle A = 60°. What is the length of BC?",
    format: "MULTIPLE_CHOICE",
    choices: ["8", "6", "7", "9", "10"],
    answer: "C",
    solution:
      "By the Law of Cosines: BC² = 5² + 8² - 2(5)(8)cos(60°) = 25 + 64 - 80(0.5) = 89 - 40 = 49, so BC = 7.",
    hints: [
      "Use the Law of Cosines with the given angle between the two known sides.",
      "cos(60°) = 1/2, which simplifies the arithmetic significantly.",
    ],
    difficulty: 6,
    topicSlug: "triangles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-55",
    question: "If log₃(x) = 2.5, what is log₃(x²)?",
    format: "MULTIPLE_CHOICE",
    choices: ["2.5", "6.25", "4", "10", "5"],
    answer: "E",
    solution: "Using the power rule, log₃(x²) = 2·log₃(x) = 2(2.5) = 5.",
    hints: [
      "Recall the logarithm power rule: log(x²) = 2·log(x).",
      "Multiply the given value of log₃(x) by 2.",
    ],
    difficulty: 6,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-56",
    question: "A geometric sequence has first term 3 and common ratio 2. What is the sum of its first 6 terms?",
    format: "MULTIPLE_CHOICE",
    choices: ["183", "186", "189", "192", "195"],
    answer: "C",
    solution:
      "The sum of the first n terms of a geometric sequence is S = a(rⁿ - 1)/(r - 1). Here S = 3(2⁶ - 1)/(2 - 1) = 3(63) = 189.",
    hints: [
      "Use the geometric series sum formula S = a(rⁿ - 1)/(r - 1).",
      "Compute 2⁶ = 64 first, then subtract 1.",
    ],
    difficulty: 6,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-57",
    question:
      "In how many ways can 5 distinct books be arranged on a shelf so that two particular books are never adjacent?",
    format: "MULTIPLE_CHOICE",
    choices: ["84", "96", "48", "60", "72"],
    answer: "E",
    solution:
      "There are 5! = 120 total arrangements. Treating the two particular books as a single glued block gives 4! × 2 = 48 arrangements where they are adjacent. The number of arrangements where they are not adjacent is 120 - 48 = 72.",
    hints: [
      "First count all arrangements, then count the ones where the two books ARE adjacent (treat them as a block).",
      "Subtract the adjacent count from the total using complementary counting.",
    ],
    difficulty: 6,
    topicSlug: "permutations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-58",
    question:
      "Two cards are drawn without replacement from a standard 52-card deck. What is the probability that both cards are aces?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/221", "1/169", "1/13", "1/26", "4/221"],
    answer: "A",
    solution:
      "The probability the first card is an ace is 4/52. Given that, the probability the second is also an ace is 3/51. The combined probability is (4/52)(3/51) = 12/2652 = 1/221.",
    hints: [
      "Multiply the probability of the first ace by the conditional probability of the second ace.",
      "Remember the deck has one fewer card (and one fewer ace) for the second draw.",
    ],
    difficulty: 6,
    topicSlug: "conditional-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-59",
    question:
      "A circle has area 49π. A chord subtends a central angle of 120°. What is the length of the chord?",
    format: "MULTIPLE_CHOICE",
    choices: ["7√3", "7", "14", "7√5", "7√2"],
    answer: "A",
    solution:
      "Since πr² = 49π, the radius is r = 7. The chord length for a central angle θ is 2r·sin(θ/2), so the chord is 2(7)sin(60°) = 14(√3/2) = 7√3.",
    hints: [
      "First find the radius from the given area.",
      "Use the chord-length formula 2r·sin(θ/2) with θ = 120°.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-60",
    question: "What is the remainder when 7¹⁰⁰ is divided by 13?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "9", "4", "3", "10"],
    answer: "B",
    solution:
      "By Fermat's Little Theorem, 7¹² ≡ 1 (mod 13), so 7 has order dividing 12 modulo 13. Since 100 = 12(8) + 4, 7¹⁰⁰ ≡ 7⁴ (mod 13). Computing: 7² = 49 ≡ 10, and 7⁴ ≡ 10² = 100 ≡ 9 (mod 13).",
    hints: [
      "Use Fermat's Little Theorem: 7¹² ≡ 1 (mod 13).",
      "Reduce the exponent 100 modulo 12, then compute the smaller power directly.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-61",
    question: "Compute the product (2 + 3i)(4 - i), where i is the imaginary unit.",
    format: "MULTIPLE_CHOICE",
    choices: ["8 + 10i", "11 - 10i", "8 - 2i", "11 + 10i", "5 + 10i"],
    answer: "D",
    solution:
      "Expand using distribution: (2 + 3i)(4 - i) = 8 - 2i + 12i - 3i² = 8 + 10i - 3(-1) = 8 + 10i + 3 = 11 + 10i.",
    hints: [
      "Distribute (FOIL) the two binomials just as with real numbers.",
      "Replace i² with -1 and combine real and imaginary parts separately.",
    ],
    difficulty: 6,
    topicSlug: "algebra",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-62",
    question: "How many positive integers n satisfy 3n - 7 < 2n + 8?",
    format: "MULTIPLE_CHOICE",
    choices: ["15", "14", "13", "12", "16"],
    answer: "B",
    solution: "Solving: 3n - 7 < 2n + 8 gives n < 15. The positive integers satisfying this are 1 through 14, so there are 14.",
    hints: [
      "Isolate n on one side of the inequality.",
      "Count the positive integers strictly less than the resulting bound.",
    ],
    difficulty: 6,
    topicSlug: "inequalities",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-63",
    question: "A regular hexagon has side length 4. What is its area?",
    format: "MULTIPLE_CHOICE",
    choices: ["18√3", "32√3", "12√3", "16√3", "24√3"],
    answer: "E",
    solution:
      "The area of a regular hexagon with side length s is (3√3/2)s². With s = 4: Area = (3√3/2)(16) = 24√3.",
    hints: [
      "Recall the formula for a regular hexagon's area in terms of its side length.",
      "Substitute s = 4 and simplify carefully.",
    ],
    difficulty: 6,
    topicSlug: "polygons",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-64",
    question: "If f(x) = 2x - 5 and g(x) = x² + 1, what is f(g(3))?",
    format: "MULTIPLE_CHOICE",
    choices: ["17", "15", "19", "10", "13"],
    answer: "B",
    solution: "First compute g(3) = 3² + 1 = 10. Then f(10) = 2(10) - 5 = 15.",
    hints: [
      "Work from the inside out: evaluate g(3) first.",
      "Plug the result of g(3) into f.",
    ],
    difficulty: 6,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-65",
    question: "How many positive divisors does 360 have?",
    format: "MULTIPLE_CHOICE",
    choices: ["20", "28", "24", "18", "16"],
    answer: "C",
    solution:
      "Factor 360 = 2³ × 3² × 5¹. The number of divisors is (3+1)(2+1)(1+1) = 4 × 3 × 2 = 24.",
    hints: [
      "Find the prime factorization of 360 first.",
      "Add 1 to each exponent and multiply the results together.",
    ],
    difficulty: 6,
    topicSlug: "divisibility",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-66",
    question: "What is the area of the triangle with vertices (0,0), (6,0), and (3,8)?",
    format: "MULTIPLE_CHOICE",
    choices: ["18", "20", "24", "30", "28"],
    answer: "C",
    solution:
      "The base along the x-axis from (0,0) to (6,0) has length 6, and the height (perpendicular distance from (3,8) to that base) is 8. Area = (1/2)(6)(8) = 24.",
    hints: [
      "Use the side along the x-axis as the base — its length is easy to read off.",
      "The height is simply the y-coordinate of the third vertex.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-67",
    question:
      "A game costs $5 to play. A player wins $20 with probability 1/5, and wins nothing otherwise. What is the expected net gain (or loss) from playing the game once?",
    format: "MULTIPLE_CHOICE",
    choices: ["-$2", "$4", "$0", "-$1", "$1"],
    answer: "D",
    solution:
      "The expected winnings are 20(1/5) + 0(4/5) = 4. Subtracting the $5 cost to play gives an expected net gain of 4 - 5 = -1, i.e., an expected loss of $1.",
    hints: [
      "First compute the expected winnings alone, ignoring the cost.",
      "Subtract the fixed cost to play from the expected winnings.",
    ],
    difficulty: 6,
    topicSlug: "expected-value",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-68",
    question: "A trapezoid has parallel sides of length 6 and 14, and height 8. What is its area?",
    format: "MULTIPLE_CHOICE",
    choices: ["70", "75", "85", "90", "80"],
    answer: "E",
    solution: "The area of a trapezoid is (1/2)(b₁ + b₂)(h) = (1/2)(6 + 14)(8) = (1/2)(20)(8) = 80.",
    hints: [
      "Recall the trapezoid area formula: half the sum of the parallel sides, times the height.",
      "Add the two parallel side lengths before multiplying by the height.",
    ],
    difficulty: 6,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-69",
    question: "What is the units digit of 7²⁰²³?",
    format: "MULTIPLE_CHOICE",
    choices: ["9", "5", "3", "7", "1"],
    answer: "C",
    solution:
      "The units digits of powers of 7 cycle with period 4: 7, 9, 3, 1, 7, 9, 3, 1, .... Since 2023 = 4(505) + 3, the units digit matches the 3rd term in the cycle, which is 3.",
    hints: [
      "Compute the units digits of the first several powers of 7 to find the repeating cycle.",
      "Find 2023 mod 4 to determine the position within that cycle.",
    ],
    difficulty: 6,
    topicSlug: "number-patterns",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-70",
    question: "How many three-digit positive integers have all distinct digits and are even?",
    format: "MULTIPLE_CHOICE",
    choices: ["328", "324", "312", "336", "320"],
    answer: "A",
    solution:
      "Case units digit = 0: the hundreds digit has 9 choices (1-9) and the tens digit has 8 remaining choices, giving 72. Case units digit ∈ {2,4,6,8} (4 choices): the hundreds digit can't be 0 or the units digit (8 choices), and the tens digit has 8 remaining choices, giving 4 × 8 × 8 = 256. Total: 72 + 256 = 328.",
    hints: [
      "Split into cases based on whether the units digit is 0 or one of 2, 4, 6, 8.",
      "In each case, carefully count the choices for the hundreds and tens digits, avoiding repeats.",
    ],
    difficulty: 6,
    topicSlug: "casework",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-71",
    question: "How many ordered pairs of positive integers (x, y) satisfy 3x + 5y = 50?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "6", "5", "4", "2"],
    answer: "A",
    solution:
      "Solving for x: x = (50 - 5y)/3, which requires 50 - 5y to be a positive multiple of 3. Testing y = 1, 4, 7 (the values making 50 - 5y divisible by 3 and positive) gives x = 15, 10, 5 respectively — all valid. So there are 3 solutions: (15,1), (10,4), (5,7).",
    hints: [
      "Solve for x in terms of y, then determine which values of y make x a positive integer.",
      "Since 5y must leave the right remainder mod 3, y must be congruent to 1 mod 3.",
    ],
    difficulty: 6,
    topicSlug: "diophantine-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-72",
    question:
      "In a group of 30 people, what is the minimum number of people who are guaranteed to share the same birth month?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "4", "3", "6", "5"],
    answer: "C",
    solution:
      "There are 12 months. By the Pigeonhole Principle, distributing 30 people among 12 months as evenly as possible gives some month at least ⌈30/12⌉ = 3 people.",
    hints: [
      "This is a Pigeonhole Principle problem with 12 'holes' (months).",
      "Compute ⌈30/12⌉ to find the guaranteed minimum in the fullest month.",
    ],
    difficulty: 6,
    topicSlug: "pigeonhole",
    competitionSlug: "amc12",
  },

  // ============================= DIFFICULTY 7 =============================
  {
    slug: "amc12-73",
    question: "Solve for x: log₂(x) + log₄(x) = 6.",
    format: "MULTIPLE_CHOICE",
    choices: ["32", "12", "8", "16", "24"],
    answer: "D",
    solution:
      "Using the change of base formula, log₄(x) = log₂(x)/log₂(4) = log₂(x)/2. So the equation becomes log₂(x) + log₂(x)/2 = 6, i.e., (3/2)log₂(x) = 6, giving log₂(x) = 4, so x = 16.",
    hints: [
      "Convert log₄(x) into base 2 using the change of base formula.",
      "Combine like terms to get a single multiple of log₂(x).",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-74",
    question:
      "If tan θ = 2 and 180° < θ < 270° (θ is in the third quadrant), what is sin θ + cos θ?",
    format: "MULTIPLE_CHOICE",
    choices: ["-3/5", "√5/5", "-√5/5", "3√5/5", "-3√5/5"],
    answer: "E",
    solution:
      "Since tan θ = 2, a reference right triangle has opposite 2, adjacent 1, hypotenuse √5, so sin θ = 2/√5 and cos θ = 1/√5 in magnitude. In the third quadrant both sine and cosine are negative: sin θ = -2/√5, cos θ = -1/√5. Their sum is -3/√5 = -3√5/5.",
    hints: [
      "Use tan θ = 2 to build a reference triangle with hypotenuse √5.",
      "Assign the correct signs to sine and cosine based on the third quadrant.",
    ],
    difficulty: 7,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-75",
    question: "What is the value of (1 + i)⁸, where i is the imaginary unit?",
    format: "MULTIPLE_CHOICE",
    choices: ["16i", "-16i", "16", "-16", "8"],
    answer: "C",
    solution:
      "(1 + i)² = 1 + 2i + i² = 2i. Then (1+i)⁴ = (2i)² = 4i² = -4. Finally (1+i)⁸ = (-4)² = 16.",
    hints: [
      "Square (1 + i) first to simplify, rather than expanding the eighth power directly.",
      "Square the result twice more to build up from the square to the eighth power.",
    ],
    difficulty: 7,
    topicSlug: "algebra",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-76",
    question:
      "Two circles have radii 5 and 3, and their centers are 10 units apart. What is the length of their common external tangent?",
    format: "MULTIPLE_CHOICE",
    choices: ["4√5", "4√6", "4√7", "6√3", "2√21"],
    answer: "B",
    solution:
      "The length of a common external tangent between two circles with radii r₁, r₂ and center distance d is √(d² - (r₁ - r₂)²). Here: √(10² - (5-3)²) = √(100 - 4) = √96 = 4√6.",
    hints: [
      "Recall the formula √(d² - (r₁ - r₂)²) for the external tangent length.",
      "Simplify √96 by factoring out the largest perfect square.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-77",
    question:
      "The sum of the first n terms of a sequence is Sₙ = 3n² + 2n. What is the 10th term of the sequence?",
    format: "MULTIPLE_CHOICE",
    choices: ["56", "59", "62", "60", "53"],
    answer: "B",
    solution:
      "The nth term is aₙ = Sₙ - Sₙ₋₁ = (3n² + 2n) - (3(n-1)² + 2(n-1)) = 6n - 1. So a₁₀ = 6(10) - 1 = 59.",
    hints: [
      "Use the identity aₙ = Sₙ - Sₙ₋₁ to extract the individual term formula.",
      "Simplify the difference algebraically before plugging in n = 10.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-78",
    question:
      "How many integers from 1 to 200 (inclusive) are divisible by 3 or by 5, but not by 15?",
    format: "MULTIPLE_CHOICE",
    choices: ["93", "80", "66", "53", "73"],
    answer: "B",
    solution:
      "From 1 to 200: multiples of 3 = 66, multiples of 5 = 40, multiples of 15 = 13. By inclusion-exclusion, multiples of 3 or 5 total 66 + 40 - 13 = 93. Removing those also divisible by 15 (already double-counted, now fully excluded) leaves 93 - 13 = 80.",
    hints: [
      "Use inclusion-exclusion to count numbers divisible by 3 or 5 first.",
      "Then subtract off the numbers divisible by 15, since those belong to both groups and must be excluded entirely.",
    ],
    difficulty: 7,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-79",
    question: "What is the smallest positive integer n such that n! is divisible by 1000?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "10", "15", "20", "25"],
    answer: "C",
    solution:
      "Since 1000 = 2³ × 5³, and factorials always accumulate factors of 2 much faster than factors of 5, we need the exponent of 5 in n! to reach at least 3. For n = 15: ⌊15/5⌋ + ⌊15/25⌋ = 3 + 0 = 3, which is enough. For n = 14: ⌊14/5⌋ = 2, which is insufficient. So n = 15.",
    hints: [
      "Since factors of 2 are abundant in factorials, the bottleneck is the power of 5.",
      "Use Legendre's formula ⌊n/5⌋ + ⌊n/25⌋ + ... to count factors of 5 in n!.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-80",
    question: "A fair coin is flipped 6 times. What is the probability of getting exactly 4 heads?",
    format: "MULTIPLE_CHOICE",
    choices: ["21/64", "3/16", "5/16", "15/64", "15/32"],
    answer: "D",
    solution:
      "The probability is C(6,4)(1/2)⁴(1/2)² = C(6,4)/2⁶ = 15/64.",
    hints: [
      "Use the binomial probability formula with n = 6, k = 4, p = 1/2.",
      "Compute C(6,4) = 15 and divide by 2⁶ = 64.",
    ],
    difficulty: 7,
    topicSlug: "counting-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-81",
    question: "A cube has volume 216. What is its surface area?",
    format: "MULTIPLE_CHOICE",
    choices: ["196", "216", "240", "200", "180"],
    answer: "B",
    solution:
      "Since the volume is s³ = 216, the side length is s = 6. The surface area is 6s² = 6(36) = 216.",
    hints: [
      "Take the cube root of the volume to find the side length.",
      "Use the surface area formula 6s² for a cube.",
    ],
    difficulty: 7,
    topicSlug: "three-d-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-82",
    question:
      "The polynomial x³ - 6x² + 11x - 6 has three roots. What is the sum of the squares of the roots?",
    format: "MULTIPLE_CHOICE",
    choices: ["16", "12", "10", "18", "14"],
    answer: "E",
    solution:
      "By Vieta's formulas, the sum of the roots is 6 and the sum of products of pairs is 11. The sum of squares is (sum)² - 2(sum of pairwise products) = 6² - 2(11) = 36 - 22 = 14.",
    hints: [
      "Use Vieta's formulas to find the sum of the roots and the sum of products of pairs.",
      "Apply the identity Σr² = (Σr)² - 2Σ(rᵢrⱼ).",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-83",
    question: "What is the remainder when 2⁵⁰ is divided by 7?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "6", "4", "3", "2"],
    answer: "C",
    solution:
      "The powers of 2 modulo 7 cycle with period 3: 2, 4, 1, 2, 4, 1, .... Since 50 = 3(16) + 2, 2⁵⁰ ≡ 2² = 4 (mod 7).",
    hints: [
      "Compute the first several powers of 2 modulo 7 to find the repeating cycle.",
      "Reduce the exponent 50 modulo the cycle length (3).",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-84",
    question:
      "Triangle ABC is similar to triangle DEF with a similarity ratio of 3:5. If the area of triangle ABC is 27, what is the area of triangle DEF?",
    format: "MULTIPLE_CHOICE",
    choices: ["60", "75", "90", "45", "81"],
    answer: "B",
    solution:
      "The ratio of areas of similar figures is the square of the ratio of corresponding lengths: (5/3)² = 25/9. So the area of DEF is 27 × 25/9 = 75.",
    hints: [
      "Remember that area ratios equal the square of the linear (side) ratio.",
      "Multiply the given area by (5/3)².",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-85",
    question: "How many distinct arrangements are there of the letters in the word BANANA?",
    format: "MULTIPLE_CHOICE",
    choices: ["72", "90", "60", "120", "30"],
    answer: "C",
    solution:
      "BANANA has 6 letters with A repeated 3 times and N repeated 2 times. The number of distinct arrangements is 6!/(3!2!) = 720/12 = 60.",
    hints: [
      "Count the total letters and identify which letters repeat, and how often.",
      "Divide the total permutations 6! by the factorial of each repeated letter's count.",
    ],
    difficulty: 7,
    topicSlug: "permutations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-86",
    question: "How many integers n satisfy n² - 5n - 14 ≤ 0?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "9", "8", "12", "11"],
    answer: "A",
    solution:
      "Factor: n² - 5n - 14 = (n - 7)(n + 2) ≤ 0, which holds for -2 ≤ n ≤ 7. The integers in this range are -2, -1, 0, ..., 7, which is 10 integers.",
    hints: [
      "Factor the quadratic to find its roots, which bound the solution interval.",
      "Count every integer in the closed interval between the two roots.",
    ],
    difficulty: 7,
    topicSlug: "inequalities",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-87",
    question: "If 2^x = 5 and 2^y = 3, what is 2^(x - y)?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/3", "2/3", "8/3", "3/5", "15"],
    answer: "A",
    solution: "2^(x-y) = 2^x / 2^y = 5/3.",
    hints: [
      "Use the exponent rule 2^(x-y) = 2^x / 2^y.",
      "Substitute the given values for 2^x and 2^y directly.",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-88",
    question: "A line passes through (2, 3) and (6, 11). What is the y-intercept of this line?",
    format: "MULTIPLE_CHOICE",
    choices: ["-1", "0", "-2", "-3", "1"],
    answer: "A",
    solution:
      "The slope is (11-3)/(6-2) = 8/4 = 2. Using point-slope form: y - 3 = 2(x - 2), so y = 2x - 1. The y-intercept occurs at x = 0, giving y = -1.",
    hints: [
      "Find the slope from the two given points first.",
      "Write the line's equation and substitute x = 0 to find the y-intercept.",
    ],
    difficulty: 7,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-89",
    question: "Three fair six-sided dice are rolled. What is the probability that the sum of the three dice is 10?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/36", "1/8", "1/6", "1/9", "7/72"],
    answer: "B",
    solution:
      "There are 6³ = 216 equally likely outcomes. Careful enumeration (or the standard coefficient count) shows exactly 27 ordered triples from {1,...,6} sum to 10. The probability is 27/216 = 1/8.",
    hints: [
      "Total outcomes are 6³ = 216 since each die is independent.",
      "Count ordered triples (a,b,c) with each value 1-6 summing to 10 — there are 27 of them.",
    ],
    difficulty: 7,
    topicSlug: "counting-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-90",
    question: "How many ordered pairs of positive integers (x, y) satisfy 1/x + 1/y = 1/6?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "10", "9", "8", "6"],
    answer: "C",
    solution:
      "Multiplying both sides by 6xy: 6y + 6x = xy, which rearranges to xy - 6x - 6y = 0, and adding 36 to both sides gives (x-6)(y-6) = 36. Since 36 has 9 positive divisors, there are 9 ways to write 36 as an ordered product of two positive integers, giving 9 valid pairs (x,y).",
    hints: [
      "Clear denominators and rearrange into the form (x - a)(y - a) = constant.",
      "Count the number of positive divisors of 36 — each corresponds to one solution pair.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-91",
    question: "A regular polygon has an interior angle of 150°. How many sides does it have?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "18", "10", "9", "15"],
    answer: "A",
    solution:
      "Each exterior angle is 180° - 150° = 30°. Since exterior angles of a regular polygon sum to 360°, the number of sides is 360°/30° = 12.",
    hints: [
      "Find the exterior angle by subtracting the interior angle from 180°.",
      "Divide 360° by the exterior angle to get the number of sides.",
    ],
    difficulty: 7,
    topicSlug: "polygons",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-92",
    question:
      "A bag contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. What is the expected number of red balls drawn?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "3/5", "1/2", "2/5", "4/5"],
    answer: "E",
    solution:
      "By linearity of expectation, each individual draw has probability 4/10 of being red, regardless of order or dependence between draws. With 2 draws, the expected number of red balls is 2 × 4/10 = 4/5.",
    hints: [
      "Linearity of expectation applies even without replacement — no need for complicated casework.",
      "Each single draw has the same marginal probability 4/10 of being red.",
    ],
    difficulty: 7,
    topicSlug: "expected-value",
    competitionSlug: "amc12",
  },

  // ============================= DIFFICULTY 8 =============================
  {
    slug: "amc12-93",
    question: "Let ω be a primitive 7th root of unity. What is the value of ω + ω² + ω³ + ω⁴ + ω⁵ + ω⁶?",
    format: "MULTIPLE_CHOICE",
    choices: ["-7", "1", "-1", "7", "0"],
    answer: "C",
    solution:
      "The seven 7th roots of unity (1, ω, ω², ..., ω⁶) sum to 0, since they are the roots of x⁷ - 1 = 0 and the coefficient of x⁶ is 0. Removing the root 1 from this sum gives ω + ω² + ... + ω⁶ = 0 - 1 = -1.",
    hints: [
      "All seven 7th roots of unity sum to 0 — this follows from Vieta's formulas on x⁷ - 1 = 0.",
      "Subtract the root equal to 1 from the total sum of all seven roots.",
    ],
    difficulty: 8,
    topicSlug: "algebra",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-94",
    question: "If sin x + cos x = 7/5, what is sin x · cos x?",
    format: "MULTIPLE_CHOICE",
    choices: ["7/25", "1/2", "49/50", "24/25", "12/25"],
    answer: "E",
    solution:
      "Squaring both sides: (sin x + cos x)² = sin²x + 2 sin x cos x + cos²x = 1 + 2 sin x cos x = 49/25. So 2 sin x cos x = 49/25 - 1 = 24/25, giving sin x cos x = 12/25.",
    hints: [
      "Square the given equation and use sin²x + cos²x = 1.",
      "Isolate the cross term 2 sin x cos x, then divide by 2.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-95",
    question: "A triangle has sides 13, 14, and 15. What is its area?",
    format: "MULTIPLE_CHOICE",
    choices: ["90", "84", "76", "80", "88"],
    answer: "B",
    solution:
      "Using Heron's formula with s = (13+14+15)/2 = 21: Area = √(21 × 8 × 7 × 6) = √7056 = 84.",
    hints: [
      "Compute the semi-perimeter s first.",
      "Apply Heron's formula: √(s(s-a)(s-b)(s-c)).",
    ],
    difficulty: 8,
    topicSlug: "triangles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-96",
    question: "Solve for x: log₄(x) + log₂(x) = 9.",
    format: "MULTIPLE_CHOICE",
    choices: ["256", "32", "128", "16", "64"],
    answer: "E",
    solution:
      "Since log₄(x) = log₂(x)/2, the equation becomes log₂(x)/2 + log₂(x) = 9, i.e., (3/2)log₂(x) = 9, so log₂(x) = 6, giving x = 64.",
    hints: [
      "Convert log₄(x) to base 2 so both terms share the same logarithm.",
      "Combine like terms before solving for log₂(x).",
    ],
    difficulty: 8,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-97",
    question:
      "In how many ways can 8 people be seated around a circular table if two particular people must NOT sit next to each other? (Rotations are considered identical, reflections are not.)",
    format: "MULTIPLE_CHOICE",
    choices: ["3600", "4320", "3960", "4200", "2880"],
    answer: "A",
    solution:
      "The total number of circular arrangements of 8 people is (8-1)! = 5040. Treating the two particular people as a glued block gives (7-1)! × 2 = 720 × 2 = 1440 arrangements where they are adjacent. The count where they are not adjacent is 5040 - 1440 = 3600.",
    hints: [
      "Recall that circular arrangements of n people number (n-1)!.",
      "Use complementary counting: subtract the adjacent arrangements (treating the pair as one unit) from the total.",
    ],
    difficulty: 8,
    topicSlug: "permutations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-98",
    question: "How many positive integers less than 1000 are divisible by neither 2 nor 3?",
    format: "MULTIPLE_CHOICE",
    choices: ["336", "333", "332", "334", "330"],
    answer: "B",
    solution:
      "Among 1 to 999: multiples of 2 number 499, multiples of 3 number 333, and multiples of 6 number 166. By inclusion-exclusion, multiples of 2 or 3 total 499 + 333 - 166 = 666. The numbers divisible by neither are 999 - 666 = 333.",
    hints: [
      "Use inclusion-exclusion to count numbers divisible by 2 or 3.",
      "Subtract that count from the total number of integers from 1 to 999.",
    ],
    difficulty: 8,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-99",
    question: "What is the sum of the infinite geometric series 8 - 4 + 2 - 1 + ...?",
    format: "MULTIPLE_CHOICE",
    choices: ["32/3", "4", "8/3", "16/3", "6"],
    answer: "D",
    solution:
      "This is a geometric series with a = 8 and r = -1/2. Since |r| < 1, the sum is a/(1-r) = 8/(1 - (-1/2)) = 8/(3/2) = 16/3.",
    hints: [
      "Identify the first term and common ratio of this geometric series.",
      "Apply the infinite geometric series sum formula a/(1-r).",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-100",
    question:
      "A box contains 3 red, 4 green, and 5 blue marbles. Two marbles are drawn without replacement. Given that the first marble drawn is red, what is the probability that the second marble is also red?",
    format: "MULTIPLE_CHOICE",
    choices: ["3/11", "2/11", "1/4", "2/9", "1/6"],
    answer: "B",
    solution:
      "After removing one red marble, 2 red marbles remain out of 11 total marbles. The conditional probability is 2/11.",
    hints: [
      "Update both the count of red marbles and the total count after the first draw.",
      "The conditional probability is simply (remaining red)/(remaining total).",
    ],
    difficulty: 8,
    topicSlug: "conditional-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-101",
    question: "What is the length of the arc of the circle x² + y² = 36 that lies in the first quadrant?",
    format: "MULTIPLE_CHOICE",
    choices: ["6π", "12π", "4π", "2π", "3π"],
    answer: "E",
    solution:
      "The circle has radius 6, so its full circumference is 2π(6) = 12π. The portion in the first quadrant is exactly a quarter of the circle, so the arc length is 12π/4 = 3π.",
    hints: [
      "Find the radius from the equation of the circle.",
      "The first-quadrant portion of a circle centered at the origin is exactly a quarter of the full circle.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-102",
    question: "How many distinct real roots does the equation x⁴ - 5x² + 4 = 0 have?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "1", "4", "3", "0"],
    answer: "C",
    solution:
      "Let u = x². The equation becomes u² - 5u + 4 = 0, which factors as (u-1)(u-4) = 0, so u = 1 or u = 4. Each gives two real values of x: x = ±1 and x = ±2, for 4 distinct real roots.",
    hints: [
      "Substitute u = x² to reduce this to a quadratic equation.",
      "Each positive value of u gives two real values of x.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-103",
    question: "What are the last two digits of 3¹⁰⁰ (i.e., the remainder when 3¹⁰⁰ is divided by 100)?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "49", "61", "21", "81"],
    answer: "A",
    solution:
      "By Euler's theorem, since gcd(3,100)=1 and φ(100) = 40, we have 3⁴⁰ ≡ 1 (mod 100). Since 100 = 40(2) + 20, 3¹⁰⁰ ≡ 3²⁰ (mod 100). Computing: 3¹⁰ = 59049 ≡ 49 (mod 100), so 3²⁰ ≡ 49² = 2401 ≡ 1 (mod 100). Thus the last two digits are 01.",
    hints: [
      "Use Euler's theorem with φ(100) = 40 to reduce the exponent.",
      "Compute 3¹⁰ mod 100 first, then square that result mod 100 to get 3²⁰ mod 100.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-104",
    question: "How many permutations of {1, 2, 3, 4, 5, 6} have no number in its original position (derangements)?",
    format: "MULTIPLE_CHOICE",
    choices: ["266", "120", "265", "720", "264"],
    answer: "C",
    solution:
      "The number of derangements of n objects is D(n) = n!·Σ_{k=0}^{n}(-1)^k/k!. For n = 6: D(6) = 720(1 - 1 + 1/2 - 1/6 + 1/24 - 1/120 + 1/720) = 265.",
    hints: [
      "Use the derangement formula D(n) = n!·Σ(-1)^k/k! for k = 0 to n.",
      "Alternatively, use the recurrence D(n) = (n-1)[D(n-1) + D(n-2)] with D(1)=0, D(2)=1.",
    ],
    difficulty: 8,
    topicSlug: "permutations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-105",
    question: "A regular tetrahedron has edge length 6. What is its volume?",
    format: "MULTIPLE_CHOICE",
    choices: ["12√2", "36√2", "18√2", "9√2", "24√2"],
    answer: "C",
    solution:
      "The volume of a regular tetrahedron with edge length a is V = a³/(6√2). With a = 6: V = 216/(6√2) = 36/√2 = 18√2.",
    hints: [
      "Recall the volume formula for a regular tetrahedron in terms of its edge length.",
      "Rationalize the denominator to simplify 36/√2.",
    ],
    difficulty: 8,
    topicSlug: "three-d-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-106",
    question: "For positive reals a and b with a + b = 10, what is the minimum possible value of 1/a + 1/b?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "1/5", "1/2", "4/5", "2/5"],
    answer: "E",
    solution:
      "Write 1/a + 1/b = (a+b)/(ab) = 10/(ab). This is minimized when ab is maximized, which (for fixed sum) occurs when a = b = 5, giving ab = 25. The minimum value is 10/25 = 2/5.",
    hints: [
      "Combine the fractions using the common denominator ab, and use a + b = 10.",
      "For a fixed sum, the product ab is maximized when a = b.",
    ],
    difficulty: 8,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-107",
    question: "What is the sum of all positive divisors of 360?",
    format: "MULTIPLE_CHOICE",
    choices: ["1080", "1140", "1200", "1260", "1170"],
    answer: "E",
    solution:
      "Factor 360 = 2³ × 3² × 5. The sum-of-divisors function is multiplicative: σ(360) = (1+2+4+8)(1+3+9)(1+5) = 15 × 13 × 6 = 1170.",
    hints: [
      "Find the prime factorization of 360.",
      "Use σ(n) = product over each prime power p^k of (1 + p + p² + ... + p^k).",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-108",
    question:
      "Five people, including Alice and Bob, are seated randomly in a row of 5 chairs. What is the probability that Alice and Bob end up in the two end seats (in either order)?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/5", "1/10", "2/5", "1/4", "1/20"],
    answer: "B",
    solution:
      "There are 5! = 120 total seatings. For Alice and Bob to occupy the two end seats, there are 2 ways to arrange them in those seats, times 3! ways to seat the remaining 3 people in the middle seats, giving 2 × 6 = 12 favorable seatings. The probability is 12/120 = 1/10.",
    hints: [
      "Count the favorable arrangements: place Alice and Bob in the two ends, then arrange everyone else.",
      "Divide by the total number of seatings, 5!.",
    ],
    difficulty: 8,
    topicSlug: "counting-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-109",
    question: "A circle passes through the points (0,0), (4,0), and (0,6). What is the radius of this circle?",
    format: "MULTIPLE_CHOICE",
    choices: ["7", "√13", "5", "√12", "13"],
    answer: "B",
    solution:
      "Using the general circle equation x² + y² + Dx + Ey + F = 0: plugging in (0,0) gives F = 0; plugging in (4,0) gives 16 + 4D = 0, so D = -4; plugging in (0,6) gives 36 + 6E = 0, so E = -6. The circle is x² + y² - 4x - 6y = 0, i.e., (x-2)² + (y-3)² = 13, giving radius √13.",
    hints: [
      "Set up the general circle equation and use each point to find D, E, F.",
      "Complete the square to find the center and radius from x² + y² - 4x - 6y = 0.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-110",
    question: "A sequence satisfies a₁ = 3 and a_{n+1} = 3aₙ - 4 for n ≥ 1. What is a₅?",
    format: "MULTIPLE_CHOICE",
    choices: ["75", "79", "83", "91", "87"],
    answer: "C",
    solution:
      "Compute step by step: a₁ = 3, a₂ = 3(3) - 4 = 5, a₃ = 3(5) - 4 = 11, a₄ = 3(11) - 4 = 29, a₅ = 3(29) - 4 = 83.",
    hints: [
      "Apply the recurrence relation one step at a time, starting from a₁ = 3.",
      "Double-check each arithmetic step before moving to the next term.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-111",
    question: "In triangle ABC, a = 8, b = 15, and c = 17 (where a, b, c are opposite angles A, B, C respectively). What is the measure of angle C?",
    format: "MULTIPLE_CHOICE",
    choices: ["80°", "90°", "85°", "75°", "95°"],
    answer: "B",
    solution:
      "Since 8² + 15² = 64 + 225 = 289 = 17², the triangle satisfies the Pythagorean theorem with c = 17 as the hypotenuse. This means the angle opposite side c, angle C, is a right angle: 90°.",
    hints: [
      "Check whether the three side lengths satisfy the Pythagorean theorem.",
      "The angle opposite the longest side is the one that could be the right angle.",
    ],
    difficulty: 8,
    topicSlug: "triangles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-112",
    question: "A fair six-sided die is rolled 4 times. What is the probability that the sequence of rolls is strictly increasing?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/54", "1/216", "5/216", "5/432", "5/108"],
    answer: "D",
    solution:
      "For a strictly increasing sequence, the 4 rolled values must all be distinct, and there is exactly one increasing order for any chosen set of 4 distinct values from {1,...,6}. The number of favorable outcomes is C(6,4) = 15. The total number of outcomes is 6⁴ = 1296. The probability is 15/1296 = 5/432.",
    hints: [
      "A strictly increasing sequence corresponds to choosing a set of 4 distinct values — order is then forced.",
      "Divide C(6,4) by the total number of possible roll sequences, 6⁴.",
    ],
    difficulty: 8,
    topicSlug: "counting-probability",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-113",
    question:
      "What is the sum of all real numbers x with 0 ≤ x < 2π that satisfy sin 3x = cos 2x?",
    format: "MULTIPLE_CHOICE",
    choices: ["5π", "9π/2", "4π", "7π/2", "13π/2"],
    answer: "B",
    solution:
      "Rewrite the right side as a sine: cos 2x = sin(π/2 − 2x). The equation sin u = sin v holds exactly when u = v + 2kπ or u = π − v + 2kπ. First family: 3x = π/2 − 2x + 2kπ gives 5x = π/2 + 2kπ, so x = π/10 + 2kπ/5. Taking k = 0,1,2,3,4 gives the five values π/10, π/2, 9π/10, 13π/10, 17π/10, all in [0, 2π). Second family: 3x = π − (π/2 − 2x) + 2kπ gives 3x = π/2 + 2x + 2kπ, so x = π/2 + 2kπ, whose only value in [0, 2π) is π/2 — already on the first list. So there are exactly five solutions, and their sum is (1 + 5 + 9 + 13 + 17)π/10 = 45π/10 = 9π/2. As a shortcut, the five values form an arithmetic progression with middle term 9π/10, so their sum is 5 · 9π/10 = 9π/2. Symbolic solution over the interval confirms exactly these five roots.",
    hints: [
      "Turn both sides into the same trigonometric function so you can compare arguments directly.",
      "sin u = sin v has two families of solutions: u = v + 2kπ and u = π − v + 2kπ. Generate both, then discard duplicates.",
      "The surviving solutions form an arithmetic progression, so the sum is the number of them times the middle one.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-114",
    question:
      "How many positive integers n ≤ 1000 have an odd number of positive divisors and are divisible by exactly two distinct primes?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "12", "14", "15", "31"],
    answer: "B",
    solution:
      "Two separate ideas combine here. First, a positive integer has an odd number of divisors exactly when it is a perfect square: divisors pair up as d ↔ n/d, and the only unpaired case is d = √n. So n = m² with m² ≤ 1000, i.e. 1 ≤ m ≤ 31. Second, n = m² has exactly two distinct prime factors precisely when m does (squaring does not change which primes divide a number). So we need to count m in [1, 31] divisible by exactly two distinct primes. Listing them: 6, 10, 12, 14, 15, 18, 20, 21, 22, 24, 26, 28 — that is 12 values (note 30 = 2·3·5 has three distinct primes and is excluded, and prime powers like 8, 16, 27 have only one). The corresponding n are 36, 100, 144, 196, 225, 324, 400, 441, 484, 576, 676, 784. The answer is 12. (Choice E is simply the count of all squares up to 1000.)",
    hints: [
      "First translate 'odd number of divisors' into a much more familiar condition on n.",
      "That reduces the problem to n = m² with m ≤ 31; now note that m² and m have the exact same set of prime divisors.",
      "Count integers m from 1 to 31 with exactly two distinct prime factors — be careful to exclude 30, which has three.",
    ],
    difficulty: 8,
    topicSlug: "number-theory",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-115",
    question:
      "Quadrilateral ABCD is inscribed in a circle, with AB = 2, BC = 6, CD = 4, and DA = 4. What is the length of diagonal AC?",
    format: "MULTIPLE_CHOICE",
    choices: ["16/7", "8√7/7", "16√7/7", "2√7", "4√7/7"],
    answer: "C",
    solution:
      "Because ABCD is cyclic, angles B and D are supplementary, so cos D = −cos B. Compute AC² from each of the two triangles that the diagonal creates. In triangle ABC: AC² = AB² + BC² − 2·AB·BC·cos B = 4 + 36 − 24 cos B = 40 − 24 cos B. In triangle ACD: AC² = CD² + DA² − 2·CD·DA·cos D = 16 + 16 + 32 cos B = 32 + 32 cos B. Setting these equal: 40 − 24 cos B = 32 + 32 cos B, so 8 = 56 cos B and cos B = 1/7. Then AC² = 40 − 24/7 = (280 − 24)/7 = 256/7, so AC = 16/√7 = 16√7/7. (Choice A is AC², forgetting the square root's effect; choice D is √28.)",
    hints: [
      "Draw the diagonal AC to split the quadrilateral into two triangles, and write AC² using each triangle.",
      "The inscribed quadrilateral forces the two angles at B and D to be supplementary, so their cosines are negatives of each other.",
      "Apply the law of cosines twice, set the two expressions for AC² equal, solve for cos B, then back-substitute.",
    ],
    difficulty: 8,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-116",
    question:
      "How many functions f from the set {1, 2, 3, 4, 5} to itself satisfy f(f(x)) = f(x) for every x in {1, 2, 3, 4, 5}?",
    format: "MULTIPLE_CHOICE",
    choices: ["26", "120", "195", "196", "3125"],
    answer: "D",
    solution:
      "The condition says precisely that f fixes every value it takes: if y = f(x) is in the image, then f(y) = f(f(x)) = f(x) = y. Conversely, if every element of the image is a fixed point then f(f(x)) = f(x) automatically, since f(x) always lies in the image. So the functions being counted are exactly those obtained by choosing a nonempty set S ⊆ {1,…,5}, declaring f(s) = s for every s ∈ S, and sending each of the remaining 5 − |S| elements to an arbitrary element of S. Different pairs (S, assignment) give different functions, because S is recovered from f as its image (equivalently, its fixed-point set). If |S| = k there are C(5, k) choices of S and k^(5−k) ways to map the other elements into it, so the total is Σ from k = 1 to 5 of C(5,k)·k^(5−k) = 5·1 + 10·8 + 10·9 + 5·4 + 1·1 = 5 + 80 + 90 + 20 + 1 = 196. A brute-force check over all 5⁵ = 3125 functions confirms 196. (Choice A, 26, counts the functions with f(f(x)) = x instead — a misreading of the condition; choice B assumes f must be one-to-one and counts all 5! permutations, when in fact the identity is the only permutation that works; choice C drops the k = 5 term, i.e. forgets the identity map; choice E is the number of functions with no condition imposed at all.)",
    hints: [
      "Feed a value of f back into f: what does the condition force about the numbers that actually occur as outputs?",
      "Every element of the image must be a fixed point, and conversely any f that fixes each element of its image works — so f is determined by its image S together with where the elements outside S go.",
      "Group by k = |S|: choose S in C(5,k) ways, then send each of the other 5 − k elements to any of the k elements of S, and sum over k from 1 to 5 (do not skip k = 5).",
    ],
    difficulty: 9,
    topicSlug: "counting-principles",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-117",
    question:
      "How many subsets of {1, 2, 3, …, 12} contain no three consecutive integers?",
    format: "MULTIPLE_CHOICE",
    choices: ["1364", "1597", "1705", "1920", "2048"],
    answer: "C",
    solution:
      "Let aₙ be the number of valid subsets of {1, …, n}. Classify by the longest run of consecutive integers at the very end, i.e. by whether n is excluded, or n is included but n − 1 is not, or both n and n − 1 are included (in which case n − 2 must be excluded). Those three cases contribute aₙ₋₁, aₙ₋₂, and aₙ₋₃ respectively, so aₙ = aₙ₋₁ + aₙ₋₂ + aₙ₋₃. The base cases are a₀ = 1, a₁ = 2, a₂ = 4. Iterating: a₃ = 7, a₄ = 13, a₅ = 24, a₆ = 44, a₇ = 81, a₈ = 149, a₉ = 274, a₁₀ = 504, a₁₁ = 927, a₁₂ = 1705. An exhaustive check over all 4096 subsets confirms 1705. (Choice A, 1364, is what the two-term 'no two consecutive' style recursion would drift toward, and 1597 is a Fibonacci number — both are the answers to different, easier problems.)",
    hints: [
      "Build the subsets up one element at a time and set up a recursion on n, the size of the ground set.",
      "Condition on the tail: either n is left out, or n is in and n − 1 is out, or both n and n − 1 are in — in which case n − 2 is forced out.",
      "This gives a three-term recursion aₙ = aₙ₋₁ + aₙ₋₂ + aₙ₋₃ (a tribonacci sequence); start from a₀ = 1, a₁ = 2, a₂ = 4 and iterate up to n = 12.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-118",
    question:
      "A function f, defined for all real x other than 0 and 1, satisfies f(x) + f(1 − 1/x) = x for every such x. What is f(3)?",
    format: "MULTIPLE_CHOICE",
    choices: ["3/2", "11/12", "19/12", "25/12", "17/12"],
    answer: "B",
    solution:
      "Let g(x) = 1 − 1/x. Starting from x = 3 and applying g repeatedly: g(3) = 1 − 1/3 = 2/3, g(2/3) = 1 − 3/2 = −1/2, and g(−1/2) = 1 − (−2) = 3. So g has order 3 and {3, 2/3, −1/2} is a three-element cycle. Write a = f(3), b = f(2/3), c = f(−1/2). Substituting x = 3, x = 2/3, and x = −1/2 into the functional equation gives three linear equations: a + b = 3, b + c = 2/3, c + a = −1/2. Adding all three gives 2(a + b + c) = 3 + 2/3 − 1/2 = 19/6, so a + b + c = 19/12. Then a = (a + b + c) − (b + c) = 19/12 − 2/3 = 19/12 − 8/12 = 11/12. So f(3) = 11/12. (Choice C is the sum a + b + c, the value you get if you stop one step early.)",
    hints: [
      "Apply the substitution x ↦ 1 − 1/x repeatedly starting at x = 3 and see what happens.",
      "The substitution has order 3, so you land back at 3 after three steps — that gives you three equations in three unknowns.",
      "Add all three equations to get the total of the three unknowns, then subtract off the pair you already know.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-119",
    question:
      "Real numbers x and y satisfy x > 1, y > 1, xy = 144, and log_x y + log_y x = 10/3. What is (x + y)/2?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "13√3", "26√3", "13", "14√3"],
    answer: "B",
    solution:
      "Let t = log_x y. Then log_y x = 1/t, so t + 1/t = 10/3, giving 3t² − 10t + 3 = 0, which factors as (3t − 1)(t − 3) = 0, so t = 3 or t = 1/3. The two cases just swap x and y, so assume t = 3, meaning y = x³. Then xy = x · x³ = x⁴ = 144, so x = 144^(1/4) = √12 = 2√3 (positive root, and indeed 2√3 ≈ 3.46 > 1). Then y = 144/x = 144/(2√3) = 72/√3 = 24√3 (equivalently y = x³ = (2√3)³ = 8 · 3√3 = 24√3). So (x + y)/2 = (2√3 + 24√3)/2 = 26√3/2 = 13√3. (Choice C is x + y rather than its average; choice A is √144, the geometric mean rather than the arithmetic mean.)",
    hints: [
      "The two logarithms are reciprocals of each other — introduce a single variable for one of them.",
      "That turns the second condition into a quadratic whose roots are 3 and 1/3; either root gives the same unordered pair {x, y}.",
      "Combine y = x³ with xy = 144 to get x⁴ = 144, then remember the question asks for the average, not the sum.",
    ],
    difficulty: 9,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-120",
    question:
      "A pyramid has a square base of side length 6 and four congruent lateral edges of length 3√3. A cube rests on the base of the pyramid with its bottom face centered on the base and its edges parallel to the base edges, and all four of its top vertices lie on the lateral surface of the pyramid. What is the edge length of the cube?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/2", "12/5", "2", "18/7", "3"],
    answer: "C",
    solution:
      "First find the pyramid's height. The base square of side 6 has half-diagonal 3√2, so the apex is directly above the center at height h with h² + (3√2)² = (3√3)², i.e. h² + 18 = 27, giving h = 3. Second, slice the pyramid horizontally. At height y the cross-section is a square whose side shrinks linearly from 6 at y = 0 to 0 at y = h = 3, so its side is 6(1 − y/3). The cube of edge s has its top face at height s, centered, with half-side s/2, and its top vertices lie on the boundary of the cross-section square exactly when s/2 equals the cross-section's half-side, 3(1 − s/3). Solving s/2 = 3 − s gives (3/2)s = 3, so s = 2. Check: with apex (0,0,3) and base corners (±3, ±3, 0), one lateral face lies in the plane x + z = 3, and the cube's top vertex (1, 1, 2) satisfies 1 + 2 = 3, confirming it lies on that face. (Choice E is h itself, the answer if you conflate the cube's edge with the pyramid's height.)",
    hints: [
      "The lateral edge length is not the height — get the height first using the half-diagonal of the square base.",
      "Take horizontal cross-sections: at height y the cross-section is a square whose side length shrinks linearly with y.",
      "The cube's top face sits at height s and must exactly match the cross-section square there; set the two half-side lengths equal and solve.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-121",
    question:
      "A monic polynomial P of degree 4 satisfies P(1) = 3, P(2) = 6, P(3) = 11, and P(4) = 18. What is P(6)?",
    format: "MULTIPLE_CHOICE",
    choices: ["38", "128", "146", "158", "278"],
    answer: "D",
    solution:
      "The given values 3, 6, 11, 18 are exactly k² + 2 for k = 1, 2, 3, 4. So define Q(x) = P(x) − (x² + 2). Since P is monic of degree 4 and x² + 2 has degree 2, Q is also monic of degree 4. But Q(1) = Q(2) = Q(3) = Q(4) = 0, so Q has the four roots 1, 2, 3, 4 — and being monic of degree 4, it is exactly Q(x) = (x − 1)(x − 2)(x − 3)(x − 4) with no extra factor. Therefore P(x) = (x − 1)(x − 2)(x − 3)(x − 4) + x² + 2. Evaluating at x = 6: (5)(4)(3)(2) + 36 + 2 = 120 + 38 = 158. (Direct solution of the 4×4 linear system for the coefficients gives P(x) = x⁴ − 10x³ + 36x² − 50x + 26, and P(6) = 158 as well. Choice A is 6² + 2, the answer if you forget the product term entirely.)",
    hints: [
      "Look hard at the four output values 3, 6, 11, 18 — they follow a simple quadratic pattern in the input.",
      "Subtract that quadratic from P to build a new polynomial with four known roots, and note that subtracting a degree-2 polynomial keeps P monic of degree 4.",
      "A monic degree-4 polynomial with four known roots is completely determined — write it down and evaluate at 6.",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-122",
    question:
      "How many ordered pairs (a, b) of integers with 1 ≤ a ≤ 150 and 1 ≤ b ≤ 150 satisfy the condition that a² + b² is divisible by 21?",
    format: "MULTIPLE_CHOICE",
    choices: ["49", "100", "196", "900", "441"],
    answer: "A",
    solution:
      "Since 21 = 3 · 7, handle the two primes separately. Modulo 3, the squares are 0 and 1, so a² + b² ≡ 0 (mod 3) requires a² ≡ b² ≡ 0, i.e. 3 | a and 3 | b (1 + 1 = 2 and 0 + 1 = 1 are both nonzero mod 3). Modulo 7, the nonzero squares are 1, 2, and 4, and no two of {0,1,2,4} sum to 0 mod 7 except 0 + 0 — check: 1+1=2, 1+2=3, 1+4=5, 2+2=4, 2+4=6, 4+4=1, none ≡ 0 — so a² + b² ≡ 0 (mod 7) requires 7 | a and 7 | b. (This is the general fact that for a prime p ≡ 3 (mod 4), p | a² + b² forces p | a and p | b; here 3 ≡ 3 and 7 ≡ 3 mod 4.) Combining, 21 | a and 21 | b. In [1, 150] there are ⌊150/21⌋ = 7 multiples of 21 for each of a and b, giving 7 · 7 = 49 ordered pairs. Exhaustive verification over all 22500 pairs confirms 49. (Choice D, 900, is the answer to the same question with 15 in place of 21 — a tempting analogy that fails, because 5 ≡ 1 mod 4 and 2² ≡ −1 mod 5, so a² + b² can be divisible by 5 without either a or b being.)",
    hints: [
      "Factor 21 and analyze the two prime conditions independently before recombining them.",
      "List the possible values of a square modulo 3 and modulo 7, then see which pairs of them can sum to 0.",
      "For both of these primes the only way is a ≡ b ≡ 0, which forces 21 | a and 21 | b — this is special to primes that are 3 mod 4, and would fail for a prime like 5.",
    ],
    difficulty: 9,
    topicSlug: "integer-properties",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-123",
    question:
      "A point P lies inside equilateral triangle ABC with PA = 3, PB = 4, and PC = 5. What is the side length of the triangle?",
    format: "MULTIPLE_CHOICE",
    choices: ["√41", "√(25 − 12√3)", "√(25 + 12√3)", "√(50 + 12√3)", "7"],
    answer: "C",
    solution:
      "Rotate the plane 60° about vertex A, sending B to C, and let P map to P′. Then AP′ = AP = 3 and angle PAP′ = 60°, so triangle APP′ is equilateral and PP′ = 3. Also CP′ = BP = 4 because rotation preserves the distance and B ↦ C. So triangle PP′C has sides PP′ = 3, P′C = 4, PC = 5 — a right triangle with the right angle at P′. Now compute angle AP′C = angle AP′P + angle PP′C = 60° + 90° = 150°. Applying the law of cosines in triangle AP′C, whose side AC is the triangle's side s: s² = AP′² + P′C² − 2·AP′·P′C·cos 150° = 9 + 16 − 2(3)(4)(−√3/2) = 25 + 12√3. So s = √(25 + 12√3) ≈ 6.766. Solving the three circle equations directly with a computer algebra system returns exactly two positive roots, √(25 + 12√3) and √(25 − 12√3) ≈ 2.05; the latter is too small to contain a point at distance 5 from a vertex and corresponds to P lying outside the triangle, so the answer is √(25 + 12√3). (Choice B is that extraneous root; choice A, √41, comes from mistakenly using cos 90° = 0.)",
    hints: [
      "Three distances from an interior point to three vertices are hard to use directly — look for a rigid motion that carries one vertex to another.",
      "Rotate 60° about one vertex. The image of P together with P and the original vertex forms an equilateral triangle, and the three given lengths get gathered into a single triangle.",
      "That gathered triangle has sides 3, 4, 5, so it is right-angled; add its right angle to the rotation's 60° to get the 150° angle you need for the law of cosines.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "amc12",
  },
  {
    slug: "amc12-124",
    question:
      "A bug starts at one vertex of a regular octahedron. Each move, it walks along an edge to one of the adjacent vertices, chosen uniformly at random and independently of previous moves. What is the probability that after 4 moves the bug is back at its starting vertex?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/4", "5/32", "1/16", "3/16", "21/128"],
    answer: "D",
    solution:
      "A regular octahedron has 6 vertices in 3 opposite pairs, and each vertex is adjacent to the 4 vertices other than itself and its opposite. Group the vertices relative to the start S: the start itself, its opposite O, and the four 'equatorial' vertices. Let sₙ, oₙ, eₙ be the probabilities of being at S, at O, and at any one specific equatorial vertex after n moves. From S or from O the bug must go to an equatorial vertex; from an equatorial vertex it goes to S, to O, or to one of the two equatorial vertices adjacent to it, each with probability 1/4. Start with s₀ = 1, o₀ = 0, e₀ = 0. After 1 move: s₁ = 0, o₁ = 0, e₁ = 1/4 each. After 2: s₂ = 4 · (1/4)(1/4) = 1/4, o₂ = 1/4, and each equatorial vertex has e₂ = 2 · (1/4)(1/4) = 1/8. After 3: s₃ = 4 · (1/8)(1/4) = 1/8, o₃ = 1/8, and e₃ = (s₂ + o₂)(1/4) + 2·e₂·(1/4) = (1/2)(1/4) + 2(1/8)(1/4) = 1/8 + 1/16 = 3/16. After 4: s₄ = 4 · e₃ · (1/4) = 3/16. So the probability is 3/16. A direct transition-matrix computation over the 6 vertices confirms s₄ = 3/16 (and o₄ = 3/16, with each equatorial vertex at 5/32).",
    hints: [
      "Six vertices is too many to track individually — use the symmetry to collapse them into just three classes relative to the starting vertex.",
      "The key structural fact is that each vertex is adjacent to every vertex except its own opposite, so the bug can never move to the antipode in one step.",
      "Set up a recursion on the three class probabilities and iterate it four times; note that after an even number of moves the start and its opposite are equally likely.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "amc12",
  },
];
