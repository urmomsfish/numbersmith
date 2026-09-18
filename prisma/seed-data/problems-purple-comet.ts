import type { ProblemSeed } from "./problems";

/**
 * Hand-written problems styled after the Purple Comet Math Meet.
 *
 * Purple Comet problems are clean, self-contained, integer-answer
 * problems — closer in flavor to AMC/AIME phrasing than to verbose word
 * problems, with no multiple choice. Every problem below is an original
 * NumberSmith problem written to match that format, phrasing, and
 * increasing difficulty ramp; none are transcribed from any real Purple
 * Comet contest. Difficulty rises roughly from 3 (problem 1) to 8
 * (problem 24), mirroring how the real contest ramps across its 20
 * questions in a 120-minute team round.
 *
 * Seeded as practice (isPlacement: false), same as the other
 * competition-tagged problem sets.
 */
export const PURPLE_COMET_PROBLEMS: ProblemSeed[] = [
  {
    slug: "purple-comet-01",
    question:
      "A jacket's price is increased by 25%, and then the new price is decreased by 20%. If the original price was $80, what is the final price, in dollars?",
    format: "INTEGER",
    answer: "80",
    solution:
      "Increasing $80 by 25% gives 80 × 1.25 = 100. Decreasing $100 by 20% gives 100 × 0.8 = 80. The final price equals the original price.",
    hints: [
      "Apply the two percent changes one at a time to the original price.",
      "Increasing by 25% multiplies the price by 1.25; decreasing by 20% multiplies it by 0.8.",
    ],
    difficulty: 3,
    topicSlug: "percentages",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-02",
    question: "What is the sum of all positive divisors of 60?",
    format: "INTEGER",
    answer: "168",
    solution:
      "60 = 2^2 × 3 × 5, so the sum of its divisors is (1+2+4)(1+3)(1+5) = 7 × 4 × 6 = 168.",
    hints: [
      "Factor 60 into primes first.",
      "Use the divisor-sum formula for each prime power, then multiply the results together.",
    ],
    difficulty: 3,
    topicSlug: "divisibility",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-03",
    question: "The sum of three consecutive odd integers is 87. What is the largest of the three integers?",
    format: "INTEGER",
    answer: "31",
    solution:
      "Let the middle integer be n, so the three integers are n-2, n, and n+2. Their sum is 3n = 87, so n = 29, and the largest integer is 29 + 2 = 31.",
    hints: [
      "Let the middle integer be n and write the other two in terms of it.",
      "Three times the middle integer equals the total sum.",
    ],
    difficulty: 3,
    topicSlug: "linear-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-04",
    question:
      "In triangle ABC, angle A measures 24 degrees, and angle B is 12 degrees more than twice angle C. What is the measure, in degrees, of angle B?",
    format: "INTEGER",
    answer: "108",
    solution:
      "Let angle C = x, so angle B = 2x + 12. Since the angles sum to 180: 24 + (2x + 12) + x = 180, so 3x = 144 and x = 48. Then angle B = 2(48) + 12 = 108.",
    hints: [
      "Write angle B in terms of angle C, then use that the three angles of a triangle sum to 180°.",
      "Substitute and solve for angle C first, then plug it back in to find angle B.",
    ],
    difficulty: 4,
    topicSlug: "angles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-05",
    question:
      "A 3-digit code is formed using the digits 1 through 9, with no digit repeated. How many such codes are even?",
    format: "INTEGER",
    answer: "224",
    solution:
      "The last digit must be even, giving 4 choices (2, 4, 6, or 8). The remaining two positions are filled from the 8 leftover digits in order, giving 8 × 7 = 56 ways. Total: 4 × 56 = 224.",
    hints: [
      "The last digit determines whether the code is even — count its choices first.",
      "After fixing the last digit, count the ordered ways to fill the remaining two positions without repeats.",
    ],
    difficulty: 4,
    topicSlug: "counting-principles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-06",
    question:
      "The ratio of boys to girls in a class is 5:7. If there are 8 more girls than boys, how many students are in the class?",
    format: "INTEGER",
    answer: "48",
    solution:
      "Let boys = 5x and girls = 7x. Then 7x - 5x = 8, so 2x = 8 and x = 4. There are 20 boys and 28 girls, for a total of 48 students.",
    hints: [
      "Let the common ratio unit be x, so boys = 5x and girls = 7x.",
      "The difference between girls and boys equals 2x — use that to find x.",
    ],
    difficulty: 4,
    topicSlug: "ratios-proportions",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-07",
    question: "An arithmetic sequence has first term 7 and thirteenth term 79. What is the 25th term of the sequence?",
    format: "INTEGER",
    answer: "151",
    solution:
      "The 13th term is 12 steps from the first term, so 7 + 12d = 79, giving d = 6. The 25th term is 24 steps from the first term: 7 + 24 × 6 = 7 + 144 = 151.",
    hints: [
      "Use the difference between the 1st and 13th terms to find the common difference.",
      "The 25th term is 24 steps (not 25) from the first term.",
    ],
    difficulty: 4,
    topicSlug: "sequences",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-08",
    question:
      "A bag contains 5 red, 4 blue, and 3 green marbles. Two marbles are drawn at random without replacement. The probability that both are red can be written as a/b in lowest terms, where a and b are relatively prime positive integers. What is a + b?",
    format: "INTEGER",
    answer: "38",
    solution:
      "There are 12 marbles total, so the total ways to draw 2 is C(12,2) = 66. The favorable ways are C(5,2) = 10. The probability is 10/66 = 5/33 in lowest terms, so a + b = 5 + 33 = 38.",
    hints: [
      "The total number of ways to draw 2 marbles from 12 is C(12,2).",
      "The favorable outcomes come from choosing 2 of the 5 red marbles — reduce the resulting fraction fully.",
    ],
    difficulty: 5,
    topicSlug: "basic-probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-09",
    question:
      "A right triangle has integer leg lengths and a hypotenuse of 25. What is the sum of all possible values of its longer leg?",
    format: "INTEGER",
    answer: "44",
    solution:
      "We need a^2 + b^2 = 625 with positive integers a < b. Checking values gives exactly two triples: 7-24-25 and 15-20-25. Their longer legs are 24 and 20, which sum to 44.",
    hints: [
      "Look for Pythagorean triples with hypotenuse 25, including scaled-up versions of smaller triples.",
      "There are exactly two such right triangles — find both before adding their longer legs.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-10",
    question:
      "The expression x^2 - 14x + k factors as (x - a)(x - b), where a and b are positive integers with a < b. What is the largest possible value of k?",
    format: "INTEGER",
    answer: "48",
    solution:
      "Since a + b = 14 and k = ab, we want to maximize ab subject to a < b and a + b = 14. The product is maximized when a and b are as close together as possible while distinct: a = 6, b = 8, giving k = 48.",
    hints: [
      "Since a + b = 14, write k = ab in terms of a single variable.",
      "To maximize a product with a fixed sum, choose the two numbers as close together as possible.",
    ],
    difficulty: 5,
    topicSlug: "factoring",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-11",
    question: "What is the remainder when 7^100 is divided by 11?",
    format: "INTEGER",
    answer: "1",
    solution:
      "By Fermat's Little Theorem, since 11 is prime, 7^10 ≡ 1 (mod 11). Since 100 = 10 × 10, 7^100 = (7^10)^10 ≡ 1^10 ≡ 1 (mod 11).",
    hints: [
      "Use Fermat's Little Theorem, since 11 is prime.",
      "7^10 ≡ 1 (mod 11) — write 100 as a multiple of 10 to use this fact.",
    ],
    difficulty: 5,
    topicSlug: "modular-arithmetic",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-12",
    question: "In how many ways can the letters of the word PURPLE be arranged so that the two P's are not adjacent?",
    format: "INTEGER",
    answer: "240",
    solution:
      "PURPLE has 6 letters with one repeated pair (P, P), so there are 6!/2! = 360 total arrangements. Treating the two P's as a single block gives 5! = 120 arrangements where they are adjacent. Arrangements with the P's not adjacent: 360 - 120 = 240.",
    hints: [
      "First count all distinct arrangements of the letters, accounting for the repeated P.",
      "Then subtract the arrangements where the two P's are stuck together as a single block.",
    ],
    difficulty: 5,
    topicSlug: "permutations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-13",
    question: "A trapezoid has parallel sides of length 12 and 20, and its area is 176. What is the height of the trapezoid?",
    format: "INTEGER",
    answer: "11",
    solution:
      "The trapezoid area formula gives 176 = (1/2)(12 + 20)h = 16h, so h = 176/16 = 11.",
    hints: [
      "Use the trapezoid area formula with the two parallel side lengths.",
      "Solve for h after substituting the known area and the sum of the parallel sides.",
    ],
    difficulty: 6,
    topicSlug: "quadrilaterals",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-14",
    question: "Positive integers x and y satisfy 3x + 5y = 92 and x - y = 4. What is the value of x + y?",
    format: "INTEGER",
    answer: "24",
    solution:
      "From x - y = 4, x = y + 4. Substituting: 3(y + 4) + 5y = 92, so 8y + 12 = 92, giving y = 10 and x = 14. Thus x + y = 24.",
    hints: [
      "Use the second equation to express x in terms of y.",
      "Substitute into the first equation and solve for y before finding x.",
    ],
    difficulty: 6,
    topicSlug: "systems-of-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-15",
    question: "How many two-digit primes have digits that sum to 10?",
    format: "INTEGER",
    answer: "3",
    solution:
      "Two-digit numbers with digit sum 10: 19, 28, 37, 46, 55, 64, 73, 82, 91. Checking each for primality: 19 and 37 and 73 are prime; 28, 46, 55, 64, 82, and 91 (= 7×13) are not. That gives 3 such primes.",
    hints: [
      "List all two-digit numbers whose digits add to 10.",
      "Check each candidate in your list for primality.",
    ],
    difficulty: 6,
    topicSlug: "primes",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-16",
    question:
      "A committee of 4 people is chosen from a group of 6 men and 5 women. How many such committees include at least 2 women?",
    format: "INTEGER",
    answer: "215",
    solution:
      "The total number of committees is C(11,4) = 330. Committees with 0 women: C(6,4) = 15. Committees with exactly 1 woman: C(5,1)×C(6,3) = 5×20 = 100. At least 2 women: 330 - 15 - 100 = 215.",
    hints: [
      "It's easier to subtract the cases with fewer than 2 women from the total number of committees.",
      "Compute the committees with exactly 0 women and exactly 1 woman separately, then subtract both.",
    ],
    difficulty: 6,
    topicSlug: "combinations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-17",
    question: "A circle has area 169π. A chord of the circle is drawn at a distance of 5 from the center. What is the length of the chord?",
    format: "INTEGER",
    answer: "24",
    solution:
      "Area 169π gives radius r = 13. The distance from the center to the chord, half the chord, and the radius form a right triangle: half-chord = √(13² - 5²) = √144 = 12. The full chord length is 24.",
    hints: [
      "Find the radius from the given area first.",
      "The distance from the center to the chord, the radius, and half the chord form a right triangle.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-18",
    question: "The equation 9^x = 27^(x-2) is satisfied by a unique value of x. What is the value of 10x?",
    format: "INTEGER",
    answer: "60",
    solution:
      "Rewrite both sides with base 3: 9^x = 3^(2x) and 27^(x-2) = 3^(3x-6). Setting exponents equal: 2x = 3x - 6, so x = 6. Then 10x = 60.",
    hints: [
      "Rewrite both sides of the equation using the same base, 3.",
      "Once the bases match, set the exponents equal and solve for x.",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-19",
    question:
      "A fair six-sided die is rolled twice. The expected value of the product of the two rolls can be written as a/b in lowest terms, where a and b are relatively prime positive integers. What is a + b?",
    format: "INTEGER",
    answer: "53",
    solution:
      "Since the rolls are independent, E[XY] = E[X]·E[Y] = (7/2)(7/2) = 49/4, which is already in lowest terms. So a + b = 49 + 4 = 53.",
    hints: [
      "For independent rolls, the expected value of the product equals the product of the expected values.",
      "The expected value of one die roll is 7/2 — multiply that fraction by itself.",
    ],
    difficulty: 7,
    topicSlug: "expected-value",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-20",
    question:
      "Triangle ABC is similar to triangle DEF, with vertices corresponding in order. The perimeter of triangle ABC is 20 and the perimeter of triangle DEF is 50. If BC = 8, what is the length of EF?",
    format: "INTEGER",
    answer: "20",
    solution:
      "The ratio of perimeters equals the similarity ratio: 50/20 = 2.5. Since EF corresponds to BC, EF = 8 × 2.5 = 20.",
    hints: [
      "The ratio of the perimeters of similar triangles equals the ratio of any pair of corresponding sides.",
      "Multiply BC by that same scale factor to find EF.",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-21",
    question: "How many ordered pairs of positive integers (x, y) satisfy 3x + 7y = 100?",
    format: "INTEGER",
    answer: "5",
    solution:
      "Solving for x: x = (100 - 7y)/3, which requires 100 - 7y ≡ 0 (mod 3), i.e. y ≡ 1 (mod 3). Positive y with 7y < 100 gives y ∈ {1, 4, 7, 10, 13}, all of which yield positive integer x (31, 24, 17, 10, 3). That's 5 ordered pairs.",
    hints: [
      "Solve for x in terms of y, and determine when the result is a positive integer.",
      "Find which residue of y modulo 3 keeps 100 − 7y divisible by 3, then count valid y in range.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-22",
    question:
      "The equation x^2 - 16x + k = 0 has two (not necessarily distinct) positive integer roots. What is the largest possible value of k?",
    format: "INTEGER",
    answer: "64",
    solution:
      "By Vieta's formulas, the two roots sum to 16 and their product is k. To maximize the product of two positive integers with a fixed sum, make them as equal as possible: 8 and 8, giving k = 64.",
    hints: [
      "By Vieta's formulas, the two roots of the equation sum to 16.",
      "To maximize the product of two positive numbers with a fixed sum, make them as close to equal as possible.",
    ],
    difficulty: 8,
    topicSlug: "quadratics",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-23",
    question: "A rectangular box has integer edge lengths and a total surface area of 148 square units. What is the largest possible volume of the box?",
    format: "INTEGER",
    answer: "120",
    solution:
      "Surface area 148 means lw + lh + wh = 74. Searching integer triples satisfying this equation, the dimensions 4, 5, and 6 work (4×5 + 4×6 + 5×6 = 20 + 24 + 30 = 74) and give the largest product among all valid triples: volume = 4 × 5 × 6 = 120.",
    hints: [
      "Surface area 148 means lw + lh + wh = 74 — search for integer triples satisfying this.",
      "Among the valid triples, the dimensions 4, 5, and 6 give the largest volume.",
    ],
    difficulty: 8,
    topicSlug: "area-volume",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-24",
    question:
      "The numbers 1 through 9 are arranged in a 3×3 grid, one per cell. A move consists of swapping the contents of any two cells. Over all possible starting arrangements, what is the largest number of moves that could ever be required to sort the grid into increasing order (reading left to right, top to bottom)?",
    format: "INTEGER",
    answer: "8",
    solution:
      "The minimum number of swaps needed to sort a permutation of n elements equals n minus the number of cycles in that permutation (including fixed points as 1-cycles). To force the maximum number of required swaps, minimize the number of cycles — the fewest possible is 1, achieved by a single 9-cycle. This gives a maximum requirement of 9 - 1 = 8 swaps.",
    hints: [
      "The minimum number of swaps needed to sort a permutation equals n minus the number of cycles it contains.",
      "To force as many swaps as possible, arrange the numbers into a single 9-cycle, which minimizes the cycle count.",
    ],
    difficulty: 8,
    topicSlug: "invariants",
    competitionSlug: "purple-comet",
  },
];
