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

{
    slug: "purple-comet-25",
    question: "Three times a number, decreased by 7, equals 41. What is the number?",
    format: "INTEGER",
    answer: "16",
    solution: "Let the number be x. Then 3x - 7 = 41, so 3x = 48, giving x = 16.",
    hints: [
      "Translate the sentence into an equation: 3x - 7 = 41.",
      "Add 7 to both sides, then divide by 3.",
    ],
    difficulty: 3,
    topicSlug: "linear-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-26",
    question: "What is the sum of all positive divisors of 45?",
    format: "INTEGER",
    answer: "78",
    solution: "45 = 3^2 × 5, so the sum of its divisors is (1+3+9)(1+5) = 13 × 6 = 78.",
    hints: [
      "Factor 45 into primes first.",
      "Use the divisor-sum formula for each prime power, then multiply the results together.",
    ],
    difficulty: 3,
    topicSlug: "divisibility",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-27",
    question: "A triangle has angles measuring x, 2x, and 3x degrees. What is the value of x?",
    format: "INTEGER",
    answer: "30",
    solution: "The three angles of a triangle sum to 180 degrees, so x + 2x + 3x = 180, giving 6x = 180 and x = 30.",
    hints: [
      "The three angles of any triangle sum to 180 degrees.",
      "Combine like terms before solving for x.",
    ],
    difficulty: 3,
    topicSlug: "triangles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-28",
    question:
      "A restaurant offers 4 appetizers, 5 main courses, and 3 desserts. How many distinct three-course meals (one of each) can be ordered?",
    format: "INTEGER",
    answer: "60",
    solution: "By the multiplication principle, the number of meals is 4 × 5 × 3 = 60.",
    hints: [
      "Each course is chosen independently of the others.",
      "Multiply the number of choices for each course together.",
    ],
    difficulty: 3,
    topicSlug: "counting-principles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-29",
    question: "The product of two consecutive positive integers is 156. What is their sum?",
    format: "INTEGER",
    answer: "25",
    solution: "Let the integers be n and n+1, so n(n+1) = 156. Testing n = 12 gives 12 × 13 = 156, so the integers are 12 and 13, which sum to 25.",
    hints: [
      "Let the smaller integer be n, so the larger is n + 1.",
      "Estimate n by noting n(n+1) ≈ n^2 is close to 156.",
    ],
    difficulty: 3,
    topicSlug: "quadratics",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-30",
    question: "What is the sum of all prime numbers less than 20?",
    format: "INTEGER",
    answer: "77",
    solution: "The primes less than 20 are 2, 3, 5, 7, 11, 13, 17, and 19. Their sum is 2+3+5+7+11+13+17+19 = 77.",
    hints: [
      "List every prime number below 20.",
      "Add the list carefully, double-checking each number is actually prime.",
    ],
    difficulty: 3,
    topicSlug: "primes",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-31",
    question:
      "A rectangle's perimeter is 46, and its length is 5 more than its width. What is the area of the rectangle?",
    format: "INTEGER",
    answer: "126",
    solution:
      "Let the width be w, so the length is w + 5. The perimeter is 2(w + (w+5)) = 4w + 10 = 46, giving w = 9. The length is 14, so the area is 9 × 14 = 126.",
    hints: [
      "Write the perimeter equation in terms of the width alone.",
      "Solve for the width first, then find the length and multiply.",
    ],
    difficulty: 3,
    topicSlug: "area-volume",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-32",
    question: "The first term of an arithmetic sequence is 4, and the common difference is 5. What is the 10th term?",
    format: "INTEGER",
    answer: "49",
    solution: "The 10th term is 9 steps from the first term: 4 + 9 × 5 = 4 + 45 = 49.",
    hints: [
      "The nth term of an arithmetic sequence is the first term plus (n-1) times the common difference.",
      "Here n = 10, so you add the common difference 9 times.",
    ],
    difficulty: 3,
    topicSlug: "sequences",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-33",
    question: "In how many ways can 5 distinct books be arranged on a shelf?",
    format: "INTEGER",
    answer: "120",
    solution: "The number of arrangements of 5 distinct objects is 5! = 120.",
    hints: [
      "Each arrangement is a permutation of all 5 books.",
      "Count the choices for each position: 5, then 4, then 3, then 2, then 1.",
    ],
    difficulty: 3,
    topicSlug: "permutations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-34",
    question: "What is the remainder when 2^10 is divided by 7?",
    format: "INTEGER",
    answer: "2",
    solution: "2^3 = 8 ≡ 1 (mod 7). Since 10 = 3×3 + 1, 2^10 = (2^3)^3 × 2 ≡ 1^3 × 2 ≡ 2 (mod 7).",
    hints: [
      "Find a small power of 2 that is congruent to 1 mod 7.",
      "Write the exponent 10 in terms of that power, plus a remainder.",
    ],
    difficulty: 3,
    topicSlug: "modular-arithmetic",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-35",
    question: "A square has area 121. What is its perimeter?",
    format: "INTEGER",
    answer: "44",
    solution: "The side length is √121 = 11, so the perimeter is 4 × 11 = 44.",
    hints: [
      "Take the square root of the area to find the side length.",
      "The perimeter of a square is 4 times the side length.",
    ],
    difficulty: 3,
    topicSlug: "quadrilaterals",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-36",
    question: "Positive integers x and y satisfy x + y = 15 and x - y = 3. What is xy?",
    format: "INTEGER",
    answer: "54",
    solution: "Adding the equations gives 2x = 18, so x = 9, and then y = 6. Thus xy = 9 × 6 = 54.",
    hints: [
      "Add the two equations to eliminate y.",
      "Once you know x, substitute back to find y.",
    ],
    difficulty: 4,
    topicSlug: "systems-of-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-37",
    question: "How many positive divisors does 360 have?",
    format: "INTEGER",
    answer: "24",
    solution: "360 = 2^3 × 3^2 × 5^1, so the number of divisors is (3+1)(2+1)(1+1) = 4 × 3 × 2 = 24.",
    hints: [
      "Find the prime factorization of 360 first.",
      "Add 1 to each exponent and multiply the results.",
    ],
    difficulty: 4,
    topicSlug: "divisibility",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-38",
    question:
      "Two concentric circles have radii 5 and 13. The area of the region between them equals k times π. What is k?",
    format: "INTEGER",
    answer: "144",
    solution: "The area between the circles is π(13² - 5²) = π(169 - 25) = 144π, so k = 144.",
    hints: [
      "The area between two concentric circles is π times the difference of the squares of the radii.",
      "Compute 13² - 5² before multiplying by π.",
    ],
    difficulty: 4,
    topicSlug: "circles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-39",
    question: "How many ways can a committee of 3 be chosen from 8 people?",
    format: "INTEGER",
    answer: "56",
    solution: "The number of committees is C(8,3) = 8!/(3!5!) = 56.",
    hints: [
      "Order doesn't matter for a committee, so use combinations, not permutations.",
      "Compute C(8,3) = (8 × 7 × 6)/(3 × 2 × 1).",
    ],
    difficulty: 4,
    topicSlug: "combinations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-40",
    question: "If 2^x = 32, what is the value of x^2?",
    format: "INTEGER",
    answer: "25",
    solution: "Since 32 = 2^5, x = 5, so x^2 = 25.",
    hints: [
      "Write 32 as a power of 2.",
      "Once you know x, squaring it is straightforward.",
    ],
    difficulty: 4,
    topicSlug: "exponents-radicals",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-41",
    question: "The sum of two positive integers is 20, and their product is 91. What is the positive difference between the two integers?",
    format: "INTEGER",
    answer: "6",
    solution:
      "The integers are roots of t^2 - 20t + 91 = 0. The discriminant is 400 - 364 = 36, so t = (20 ± 6)/2, giving 13 and 7. Their difference is 13 - 7 = 6.",
    hints: [
      "The two integers are roots of t^2 - (sum)t + (product) = 0.",
      "Use the quadratic formula, or just search for factor pairs of 91 that sum to 20.",
    ],
    difficulty: 4,
    topicSlug: "integer-properties",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-42",
    question: "What is the distance between the points (-3, 4) and (5, -2)?",
    format: "INTEGER",
    answer: "10",
    solution: "The distance is √((5-(-3))² + (-2-4)²) = √(8² + (-6)²) = √(64+36) = √100 = 10.",
    hints: [
      "Use the distance formula: √((Δx)² + (Δy)²).",
      "Compute the horizontal and vertical differences first, then square and add them.",
    ],
    difficulty: 4,
    topicSlug: "coordinate-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-43",
    question:
      "A fair coin is flipped 4 times. What is the probability that exactly 2 of the flips are heads? Express your answer as a fraction in lowest terms.",
    format: "SHORT_ANSWER",
    answer: "3/8",
    solution:
      "There are 2^4 = 16 equally likely outcomes. The number with exactly 2 heads is C(4,2) = 6. The probability is 6/16 = 3/8.",
    hints: [
      "Count the total number of outcomes for 4 coin flips.",
      "Use combinations to count how many of those outcomes have exactly 2 heads, then reduce the fraction.",
    ],
    difficulty: 4,
    topicSlug: "counting-probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-44",
    question: "If f(x) = 2x + 3, what is f(f(2))?",
    format: "INTEGER",
    answer: "17",
    solution: "f(2) = 2(2) + 3 = 7. Then f(f(2)) = f(7) = 2(7) + 3 = 17.",
    hints: [
      "Evaluate the inner function first: f(2).",
      "Then plug that result back into f.",
    ],
    difficulty: 4,
    topicSlug: "functions",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-45",
    question:
      "What is the minimum number of people needed to guarantee that at least 3 of them were born in the same month?",
    format: "INTEGER",
    answer: "25",
    solution:
      "There are 12 months. By the pigeonhole principle, 2 × 12 = 24 people could have at most 2 per month with no month reaching 3. One more person, 25 total, forces some month to have at least 3.",
    hints: [
      "Think about the worst case: how many people can you have with at most 2 per month?",
      "Add one more person to that worst case to force a third match.",
    ],
    difficulty: 4,
    topicSlug: "pigeonhole",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-46",
    question:
      "Two similar triangles have a similarity ratio of 3:5. If the smaller triangle has area 18, what is the area of the larger triangle?",
    format: "INTEGER",
    answer: "50",
    solution:
      "The ratio of areas of similar figures is the square of the similarity ratio: (5/3)^2 = 25/9. The larger area is 18 × 25/9 = 50.",
    hints: [
      "The ratio of areas equals the square of the ratio of corresponding side lengths.",
      "Multiply the smaller area by that squared ratio.",
    ],
    difficulty: 4,
    topicSlug: "similarity-congruence",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-47",
    question: "The equation x^2 - 9x + 20 = 0 has roots r and s. What is r^2 + s^2?",
    format: "INTEGER",
    answer: "41",
    solution:
      "By Vieta's formulas, r + s = 9 and rs = 20. Then r^2 + s^2 = (r+s)^2 - 2rs = 81 - 40 = 41.",
    hints: [
      "Use Vieta's formulas to find r + s and rs directly from the coefficients.",
      "Recall that r^2 + s^2 = (r+s)^2 - 2rs.",
    ],
    difficulty: 5,
    topicSlug: "quadratics",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-48",
    question: "What is the remainder when 3^50 is divided by 13?",
    format: "INTEGER",
    answer: "9",
    solution:
      "3^3 = 27 ≡ 1 (mod 13). Since 50 = 3×16 + 2, 3^50 = (3^3)^16 × 3^2 ≡ 1^16 × 9 ≡ 9 (mod 13).",
    hints: [
      "Find a small power of 3 that is congruent to 1 mod 13.",
      "Write 50 as a multiple of that power's exponent plus a remainder.",
    ],
    difficulty: 5,
    topicSlug: "modular-arithmetic",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-49",
    question: "A triangle has sides 9, 12, and 15. What is its area?",
    format: "INTEGER",
    answer: "54",
    solution:
      "Since 9² + 12² = 81 + 144 = 225 = 15², the triangle is a right triangle with legs 9 and 12. Its area is (1/2)(9)(12) = 54.",
    hints: [
      "Check whether the Pythagorean theorem holds for these three side lengths.",
      "If it's a right triangle, the area is half the product of the two legs.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-50",
    question: "How many integers from 1 to 100 are divisible by 2 or by 5?",
    format: "INTEGER",
    answer: "60",
    solution:
      "There are 50 multiples of 2 and 20 multiples of 5 in that range, with 10 multiples of 10 counted twice. By inclusion-exclusion: 50 + 20 - 10 = 60.",
    hints: [
      "Count multiples of 2 and multiples of 5 separately.",
      "Subtract the overlap — numbers divisible by both, i.e. by 10 — so it isn't double-counted.",
    ],
    difficulty: 5,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-51",
    question: "In a geometric sequence, the first term is 3 and the fourth term is 192. What is the common ratio?",
    format: "INTEGER",
    answer: "4",
    solution: "The fourth term is 3r^3 = 192, so r^3 = 64, giving r = 4.",
    hints: [
      "The nth term of a geometric sequence is (first term) × r^(n-1).",
      "Set up the equation for the fourth term and solve for r.",
    ],
    difficulty: 5,
    topicSlug: "sequences",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-52",
    question: "How many ordered pairs of positive integers (x, y) satisfy 4x + 9y = 100?",
    format: "INTEGER",
    answer: "2",
    solution:
      "Solving for x: x = (100 - 9y)/4, which requires 100 - 9y ≡ 0 (mod 4), i.e. y ≡ 0 (mod 4) since 9 ≡ 1 (mod 4). Positive y with 9y < 100 gives y ∈ {4, 8}, yielding x = 16 and x = 7 respectively. That's 2 ordered pairs.",
    hints: [
      "Solve for x in terms of y and determine when the result is a positive integer.",
      "Find which residue of y modulo 4 keeps 100 − 9y divisible by 4, then count valid y in range.",
    ],
    difficulty: 5,
    topicSlug: "diophantine-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-53",
    question: "A square is inscribed in a circle of radius 6√2. What is the area of the square?",
    format: "INTEGER",
    answer: "144",
    solution:
      "The square's diagonal equals the circle's diameter: 12√2. The side length is diagonal/√2 = 12√2/√2 = 12, so the area is 12² = 144.",
    hints: [
      "The diagonal of the inscribed square equals the diameter of the circle.",
      "For a square, side length = diagonal/√2.",
    ],
    difficulty: 5,
    topicSlug: "circles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-54",
    question:
      "Two fair six-sided dice are rolled. What is the probability that their sum is prime? Express your answer as a fraction in lowest terms.",
    format: "SHORT_ANSWER",
    answer: "5/12",
    solution:
      "There are 36 equally likely outcomes. Sums that are prime (2, 3, 5, 7, 11) occur in 1+2+4+6+2 = 15 outcomes (sum 2: 1 way, sum 3: 2 ways, sum 5: 4 ways, sum 7: 6 ways, sum 11: 2 ways). The probability is 15/36 = 5/12.",
    hints: [
      "List which possible sums (2 through 12) are prime.",
      "Count the number of dice combinations giving each prime sum, add them, and reduce the fraction over 36.",
    ],
    difficulty: 5,
    topicSlug: "counting-probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-55",
    question: "How many positive integers n satisfy 3n - 7 < 2n + 8?",
    format: "INTEGER",
    answer: "14",
    solution: "3n - 7 < 2n + 8 simplifies to n < 15. The positive integers satisfying this are 1 through 14, a total of 14 values.",
    hints: [
      "Move all the n-terms to one side and constants to the other.",
      "Count the positive integers strictly less than the resulting bound.",
    ],
    difficulty: 5,
    topicSlug: "inequalities",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-56",
    question: "What is the smallest positive integer with exactly 10 positive divisors?",
    format: "INTEGER",
    answer: "48",
    solution:
      "Since 10 = 10×1 or 5×2, a number with exactly 10 divisors has the form p^9 or p^4·q for distinct primes p, q. The smallest p^9 is 2^9 = 512. The smallest p^4·q is 2^4 × 3 = 48 (using the smaller prime for the larger exponent). Comparing all cases, 48 is smallest.",
    hints: [
      "Use the divisor-count formula: if n = p^4·q, it has (4+1)(1+1) = 10 divisors.",
      "Try assigning the larger exponent to the smaller prime to minimize the product.",
    ],
    difficulty: 5,
    topicSlug: "integer-properties",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-57",
    question:
      "A cone with radius 3 and height 10 is carved out of one end of a solid cylinder with the same radius and height. The remaining solid has volume equal to k times π. What is k?",
    format: "INTEGER",
    answer: "60",
    solution:
      "The cylinder's volume is π(3²)(10) = 90π. The cone's volume is (1/3)π(3²)(10) = 30π. The remaining volume is 90π - 30π = 60π, so k = 60.",
    hints: [
      "Compute the cylinder's volume and the cone's volume separately.",
      "Subtract the cone's volume from the cylinder's volume.",
    ],
    difficulty: 5,
    topicSlug: "area-volume",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-58",
    question: "A function satisfies f(x) = 2f(x-1) + 1 for all integers x, with f(0) = 1. What is f(4)?",
    format: "INTEGER",
    answer: "31",
    solution: "f(1) = 2(1)+1 = 3, f(2) = 2(3)+1 = 7, f(3) = 2(7)+1 = 15, f(4) = 2(15)+1 = 31.",
    hints: [
      "Apply the recurrence step by step starting from f(0).",
      "Compute f(1), f(2), f(3) in order before reaching f(4).",
    ],
    difficulty: 6,
    topicSlug: "functions",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-59",
    question: "What is the units digit of 7^2023?",
    format: "INTEGER",
    answer: "3",
    solution:
      "The units digits of powers of 7 cycle with period 4: 7, 9, 3, 1. Since 2023 = 4×505 + 3, 7^2023 has the same units digit as 7^3, which is 3.",
    hints: [
      "Compute the units digits of 7^1, 7^2, 7^3, 7^4 and look for a repeating pattern.",
      "Find the remainder when 2023 is divided by the cycle length.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-60",
    question: "A rectangular box has dimensions 4, 5, and 6. What is the square of the length of its space diagonal?",
    format: "INTEGER",
    answer: "77",
    solution: "The space diagonal squared is 4² + 5² + 6² = 16 + 25 + 36 = 77.",
    hints: [
      "The space diagonal of a box satisfies d² = l² + w² + h².",
      "Add the squares of the three given dimensions.",
    ],
    difficulty: 6,
    topicSlug: "three-d-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-61",
    question:
      "In a class of 40 students, 25 take Spanish, 18 take French, and 10 take both. How many students take neither language?",
    format: "INTEGER",
    answer: "7",
    solution:
      "By inclusion-exclusion, the number taking at least one language is 25 + 18 - 10 = 33. The number taking neither is 40 - 33 = 7.",
    hints: [
      "Use inclusion-exclusion to find how many students take at least one of the two languages.",
      "Subtract that count from the total class size.",
    ],
    difficulty: 6,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-62",
    question: "If x + 1/x = 5, what is x^2 + 1/x^2?",
    format: "INTEGER",
    answer: "23",
    solution: "Squaring both sides: x^2 + 2 + 1/x^2 = 25, so x^2 + 1/x^2 = 23.",
    hints: [
      "Square the given equation.",
      "Remember that (x + 1/x)^2 expands to x^2 + 2 + 1/x^2.",
    ],
    difficulty: 6,
    topicSlug: "polynomials",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-63",
    question: "What is the largest power of 2 that divides 100! (that is, the exponent of 2 in the prime factorization of 100!)?",
    format: "INTEGER",
    answer: "97",
    solution:
      "By Legendre's formula, the exponent is ⌊100/2⌋+⌊100/4⌋+⌊100/8⌋+⌊100/16⌋+⌊100/32⌋+⌊100/64⌋ = 50+25+12+6+3+1 = 97.",
    hints: [
      "Use Legendre's formula: sum ⌊100/2^k⌋ for k = 1, 2, 3, ... until the terms become 0.",
      "Add up all the nonzero terms in that sum.",
    ],
    difficulty: 6,
    topicSlug: "integer-properties",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-64",
    question: "A line passes through (1, 4) and (4, 13). What is the y-intercept of the line?",
    format: "INTEGER",
    answer: "1",
    solution:
      "The slope is (13-4)/(4-1) = 9/3 = 3. Using point-slope form: y - 4 = 3(x - 1), so y = 3x + 1. The y-intercept is 1.",
    hints: [
      "Find the slope from the two given points.",
      "Write the line in slope-intercept form to read off the y-intercept directly.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-65",
    question: "In how many ways can 4 boys and 3 girls be arranged in a row if all 3 girls must stand together?",
    format: "INTEGER",
    answer: "720",
    solution:
      "Treat the 3 girls as a single block, giving 5 units (4 boys plus 1 block) to arrange in 5! = 120 ways. Within the block, the girls can be arranged in 3! = 6 ways. Total: 120 × 6 = 720.",
    hints: [
      "Treat the group of girls as one combined unit first.",
      "Multiply the arrangements of the units by the internal arrangements within the girls' block.",
    ],
    difficulty: 6,
    topicSlug: "permutations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-66",
    question: "The sum of the squares of two consecutive positive even integers is 340. What is the larger integer?",
    format: "INTEGER",
    answer: "14",
    solution:
      "Let the integers be n and n+2. Then n² + (n+2)² = 340, so 2n² + 4n + 4 = 340, giving n² + 2n - 168 = 0. The discriminant is 4 + 672 = 676, so n = (-2+26)/2 = 12. The larger integer is 14 (and indeed 12² + 14² = 144 + 196 = 340).",
    hints: [
      "Let the two consecutive even integers be n and n+2.",
      "Expand and solve the resulting quadratic equation for n.",
    ],
    difficulty: 6,
    topicSlug: "quadratics",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-67",
    question: "How many pairs of positive integers (a, b) with a > b satisfy a^2 - b^2 = 45?",
    format: "INTEGER",
    answer: "3",
    solution:
      "Factor as (a-b)(a+b) = 45. Since 45 is odd, both factors must be odd, and a-b < a+b. The factor pairs of 45 are (1,45), (3,15), and (5,9), giving (a,b) = (23,22), (9,6), and (7,2). That's 3 pairs.",
    hints: [
      "Factor the difference of squares as (a-b)(a+b) = 45.",
      "List the factor pairs of 45 with the smaller factor first, then solve for a and b in each case.",
    ],
    difficulty: 6,
    topicSlug: "diophantine-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-68",
    question: "A regular hexagon has area 24√3. What is its side length?",
    format: "INTEGER",
    answer: "4",
    solution:
      "The area of a regular hexagon with side s is (3√3/2)s². Setting (3√3/2)s² = 24√3 gives s² = 16, so s = 4.",
    hints: [
      "Recall the area formula for a regular hexagon in terms of its side length.",
      "Divide both sides by √3 before solving for s².",
    ],
    difficulty: 6,
    topicSlug: "area-volume",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-69",
    question: "Positive integers x, y, z satisfy x+y=10, y+z=14, and x+z=12. What is x+y+z?",
    format: "INTEGER",
    answer: "18",
    solution: "Adding all three equations gives 2(x+y+z) = 10+14+12 = 36, so x+y+z = 18.",
    hints: [
      "Add all three given equations together.",
      "Each of x, y, z is counted exactly twice in that sum.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-70",
    question: "What is the smallest prime factor of 3^8 - 2^8?",
    format: "INTEGER",
    answer: "5",
    solution:
      "3^8 - 2^8 = 6561 - 256 = 6305. This is odd and its digits sum to 14 (not divisible by 3), but it ends in 5, so it is divisible by 5: 6305 = 5 × 1261. Since 5 divides it and 2, 3 do not, the smallest prime factor is 5.",
    hints: [
      "Compute 3^8 - 2^8 directly first.",
      "Check small primes in increasing order: 2, 3, 5, ...",
    ],
    difficulty: 7,
    topicSlug: "primes",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-71",
    question:
      "From an external point P, two secant lines are drawn to a circle. One secant has external segment length 4 and total length 12. The other secant has external segment length 6. What is the total length of the second secant?",
    format: "INTEGER",
    answer: "8",
    solution:
      "By the power of a point, the product of the external segment and total length is the same for both secants: 4 × 12 = 6 × x, so 48 = 6x, giving x = 8.",
    hints: [
      "Use the power of a point theorem for two secants from the same external point.",
      "Set the products of (external segment) × (total length) equal for both secants.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-72",
    question:
      "A box contains 6 red and 4 blue balls. Three balls are drawn at random without replacement. What is the probability that at least 2 are red? Express your answer as a fraction in lowest terms.",
    format: "SHORT_ANSWER",
    answer: "2/3",
    solution:
      "There are C(10,3) = 120 total ways to draw 3 balls. Exactly 2 red: C(6,2)×C(4,1) = 15×4 = 60 ways. Exactly 3 red: C(6,3) = 20 ways. At least 2 red: (60+20)/120 = 80/120 = 2/3.",
    hints: [
      "Split into two cases: exactly 2 red and exactly 3 red.",
      "Compute each case with combinations, add them, and reduce the resulting fraction.",
    ],
    difficulty: 7,
    topicSlug: "counting-probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-73",
    question: "If 4^x + 4^x + 4^x + 4^x = 4^12, what is x?",
    format: "INTEGER",
    answer: "11",
    solution: "The left side is 4·4^x = 4^(x+1). Setting 4^(x+1) = 4^12 gives x+1 = 12, so x = 11.",
    hints: [
      "Combine the four identical terms on the left side first.",
      "Rewrite 4 × 4^x as a single power of 4.",
    ],
    difficulty: 7,
    topicSlug: "exponents-radicals",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-74",
    question: "How many positive integers less than 1000 are divisible by neither 3 nor 7?",
    format: "INTEGER",
    answer: "571",
    solution:
      "Multiples of 3 below 1000: ⌊999/3⌋=333. Multiples of 7: ⌊999/7⌋=142. Multiples of 21: ⌊999/21⌋=47. By inclusion-exclusion, divisible by 3 or 7: 333+142-47=428. Divisible by neither: 999-428=571.",
    hints: [
      "Count multiples of 3, multiples of 7, and multiples of 21 up to 999.",
      "Use inclusion-exclusion to find the count divisible by at least one, then subtract from 999.",
    ],
    difficulty: 7,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-75",
    question: "In triangle ABC, AB=13, BC=14, and CA=15. What is the length of the altitude from A to BC?",
    format: "INTEGER",
    answer: "12",
    solution:
      "By Heron's formula with s=21, the area is √(21×8×7×6) = √7056 = 84. Since area = (1/2)(BC)(altitude), 84 = (1/2)(14)h, so h = 12.",
    hints: [
      "Use Heron's formula to find the area of the 13-14-15 triangle.",
      "Set the area equal to (1/2)(base)(height) using BC as the base.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-76",
    question:
      "How many 4-digit numbers (from 1000 to 9999) have all distinct digits and are divisible by 5?",
    format: "INTEGER",
    answer: "952",
    solution:
      "Case 1, last digit 0: the other three positions are filled from the remaining 9 digits (1-9) in order: 9×8×7 = 504 ways. Case 2, last digit 5: the thousands digit can't be 0 or 5, giving 8 choices; the hundreds digit then has 8 remaining choices (0 now allowed); the tens digit has 7 remaining choices: 8×8×7 = 448 ways. Total: 504 + 448 = 952.",
    hints: [
      "Split into two cases based on whether the last digit is 0 or 5.",
      "In the case where the last digit is 5, remember the thousands digit still can't be 0.",
    ],
    difficulty: 7,
    topicSlug: "casework",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-77",
    question: "How many ordered pairs of positive integers (x, y) satisfy x + 2y ≤ 20?",
    format: "INTEGER",
    answer: "90",
    solution:
      "For each y from 1 to 9 (since 2y < 20 requires y ≤ 9, keeping x ≥ 1 possible), x can range from 1 to 20-2y, giving 20-2y choices. Summing: (18+16+14+12+10+8+6+4+2) = 90.",
    hints: [
      "Fix y and count how many values of x satisfy the inequality for that y.",
      "Sum the resulting count over all valid values of y.",
    ],
    difficulty: 7,
    topicSlug: "inequalities",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-78",
    question:
      "How many triples of positive integers (a, b, c) with a ≤ b ≤ c satisfy a+b+c=12 and form a valid triangle (a+b>c)?",
    format: "INTEGER",
    answer: "3",
    solution:
      "Checking all partitions of 12 into a ≤ b ≤ c with a+b>c: (2,5,5) works since 2+5>5; (3,4,5) works since 3+4>5; (4,4,4) works since 4+4>4. All other partitions (like (1,5,6), (2,4,6), (3,3,6), etc.) fail the triangle inequality. That gives 3 valid triples.",
    hints: [
      "List all ways to write 12 as a ≤ b ≤ c of positive integers.",
      "Check each against the triangle inequality a + b > c.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-79",
    question: "A cube has volume 216. What is the square of the length of its space diagonal?",
    format: "INTEGER",
    answer: "108",
    solution: "The side length is 216^(1/3) = 6. The space diagonal squared is 3×6² = 3×36 = 108.",
    hints: [
      "Find the side length by taking the cube root of the volume.",
      "For a cube of side s, the space diagonal squared is 3s².",
    ],
    difficulty: 7,
    topicSlug: "three-d-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-80",
    question:
      "The polynomial x^3 - 6x^2 + 11x - 6 has three roots. What is the sum of the squares of the roots?",
    format: "INTEGER",
    answer: "14",
    solution:
      "By Vieta's formulas, the sum of the roots is 6 and the sum of pairwise products is 11. So the sum of squares is 6² - 2(11) = 36 - 22 = 14. (Indeed the roots are 1, 2, 3, and 1²+2²+3² = 14.)",
    hints: [
      "Use Vieta's formulas to find the sum of the roots and the sum of pairwise products.",
      "Recall that (sum of roots)² - 2(sum of pairwise products) equals the sum of squares.",
    ],
    difficulty: 8,
    topicSlug: "polynomials",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-81",
    question: "What is the remainder when 17^17 is divided by 25?",
    format: "INTEGER",
    answer: "2",
    solution:
      "Using repeated squaring mod 25: 17²=289≡14, 17^4≡14²=196≡21, 17^8≡21²=441≡16, 17^16≡16²=256≡6. Then 17^17≡6×17=102≡2 (mod 25).",
    hints: [
      "Use repeated squaring to compute successive powers of 17 mod 25.",
      "Combine 17^16 and 17^1 to get 17^17, then reduce mod 25.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-82",
    question: "A regular hexagon is inscribed in a circle of radius 10. Its area equals k√3. What is k?",
    format: "INTEGER",
    answer: "150",
    solution:
      "A regular hexagon inscribed in a circle of radius r has area (3√3/2)r². With r=10, the area is (3√3/2)(100) = 150√3, so k = 150.",
    hints: [
      "A regular hexagon inscribed in a circle of radius r consists of 6 equilateral triangles of side r.",
      "The area of an equilateral triangle with side r is (√3/4)r² — multiply by 6.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-83",
    question:
      "A fair six-sided die is rolled repeatedly until two consecutive rolls both show a 6. What is the expected number of rolls?",
    format: "INTEGER",
    answer: "42",
    solution:
      "Let E0 be the expected additional rolls needed from a state with no progress, and E1 from a state where the last roll was a 6. Then E0 = 1 + (1/6)E1 + (5/6)E0 and E1 = 1 + (5/6)E0. Solving: from the first equation, E0 = 6 + E1. Substituting into the second: E1 = 1 + (5/6)(6+E1) = 6 + (5/6)E1, so (1/6)E1 = 6, giving E1 = 36 and E0 = 42.",
    hints: [
      "Set up two states: 'no progress' and 'last roll was a 6', with expected values E0 and E1.",
      "Write a recursive equation for each state based on the next roll, then solve the resulting system.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-84",
    question: "Real numbers x and y satisfy x+y=7 and x^3+y^3=133. What is xy?",
    format: "INTEGER",
    answer: "10",
    solution:
      "Using x^3+y^3 = (x+y)^3 - 3xy(x+y): 133 = 343 - 3xy(7) = 343 - 21xy. So 21xy = 210, giving xy = 10.",
    hints: [
      "Use the identity x^3 + y^3 = (x+y)^3 - 3xy(x+y).",
      "Substitute the known values of x+y and x^3+y^3, then solve for xy.",
    ],
    difficulty: 8,
    topicSlug: "quadratics",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-85",
    question:
      "How many ordered pairs of integers (x, y), including negative values and zero, satisfy x^2 + y^2 = 100?",
    format: "INTEGER",
    answer: "12",
    solution:
      "The representations of 100 as a sum of two squares (up to order) are 0²+10² and 6²+8². From 0²+10²: (0,±10) and (±10,0) give 4 pairs. From 6²+8²: (±6,±8) gives 4 pairs and (±8,±6) gives 4 more pairs, for 8 pairs. Total: 4 + 8 = 12.",
    hints: [
      "Find all ways to write 100 as a sum of two perfect squares (including 0).",
      "For each representation, count all sign and order combinations.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-86",
    question:
      "A square has vertices (0,0), (8,0), (8,8), and (0,8). A line segment connects (2,0) to (8,6), dividing the square into two regions. What is the area of the smaller region?",
    format: "INTEGER",
    answer: "18",
    solution:
      "The segment together with the bottom and right edges of the square forms a right triangle with vertices (2,0), (8,0), (8,6), with legs of length 6 and 6. Its area is (1/2)(6)(6) = 18. Since the full square has area 64, the other region has area 46, so the smaller region is 18.",
    hints: [
      "Identify the triangle formed by the segment and the two square edges it connects.",
      "Compute that triangle's area using its two perpendicular legs.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-87",
    question:
      "How many 5-digit numbers (10000 to 99999) have digits that strictly increase from left to right?",
    format: "INTEGER",
    answer: "126",
    solution:
      "A strictly increasing sequence of digits can never include 0 unless it were the first digit, which isn't allowed. So the 5 digits are a set of 5 distinct values chosen from {1,...,9}, and each such set has exactly one increasing arrangement: C(9,5) = 126.",
    hints: [
      "Notice that a strictly increasing digit sequence never contains a 0.",
      "Any set of 5 distinct digits from 1-9 has exactly one way to be arranged in increasing order.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-88",
    question:
      "A prime p is called a Mersenne exponent if 2^p - 1 is also prime. What is the sum of all Mersenne exponents p less than 20?",
    format: "INTEGER",
    answer: "66",
    solution:
      "Checking primes p < 20: 2^2-1=3 (prime), 2^3-1=7 (prime), 2^5-1=31 (prime), 2^7-1=127 (prime), 2^11-1=2047=23×89 (not prime), 2^13-1=8191 (prime), 2^17-1=131071 (prime), 2^19-1=524287 (prime). The valid exponents are 2, 3, 5, 7, 13, 17, 19, which sum to 66.",
    hints: [
      "Check each prime p less than 20 to see whether 2^p - 1 is prime.",
      "Watch out for p = 11: 2^11 - 1 = 2047 = 23 × 89 is not prime, so it's excluded.",
    ],
    difficulty: 8,
    topicSlug: "primes",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-89",
    question:
      "Let f(x) = x^2 - 2x. For how many integers x with -10 ≤ x ≤ 10 is f(f(x)) ≤ 0?",
    format: "INTEGER",
    answer: "2",
    solution:
      "Since f(f(x)) = f(x)^2 - 2f(x) = f(x)(f(x)-2), the condition f(f(x)) ≤ 0 is equivalent to 0 ≤ f(x) ≤ 2. First, f(x) = x^2-2x ≥ 0 means x ≤ 0 or x ≥ 2. Second, x^2-2x ≤ 2 means x^2-2x-2 ≤ 0, whose roots are 1±√3 ≈ -0.73 and 2.73, so -0.73 ≤ x ≤ 2.73. Combining both conditions gives x ∈ [-0.73, 0] ∪ [2, 2.73]. The only integers in these intervals are x = 0 and x = 2. Direct check: f(f(0)) = f(0) = 0 ≤ 0 ✓ and f(f(2)) = f(0) = 0 ≤ 0 ✓, while nearby integers like x=1, x=-1, x=3 all fail. So there are 2 such integers.",
    hints: [
      "Factor f(f(x)) as f(x)·(f(x) - 2), and figure out when this product is at most 0.",
      "That reduces to solving 0 ≤ f(x) ≤ 2, i.e. two separate inequalities in x, then intersecting their solution sets.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-90",
    question:
      "A fair six-sided die is rolled repeatedly until every one of the six faces has appeared at least once. The probability that exactly 8 rolls are needed is m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "3091",
    solution:
      "Exactly 8 rolls are needed precisely when the first 7 rolls show exactly 5 distinct faces and the 8th roll shows the one remaining face. Choose the set of 5 faces appearing in the first seven rolls in C(6,5) = 6 ways, then count the length-7 sequences that use all 5 of them: by inclusion–exclusion this surjection count is Σ_{i=0}^{5} (−1)^i C(5,i)(5 − i)^7 = 16800. So the number of favorable length-7 prefixes is 6 · 16800 = 100800, and the final roll is forced (1 of 6 outcomes). Therefore the probability is 100800/6^8 = 100800/1679616 = 175/2916. Since 2916 = 2²·3^6 and 175 = 5²·7 are relatively prime, m + n = 175 + 2916 = 3091. (A state-by-state dynamic program over the set of seen faces reproduces 175/2916 exactly.)",
    hints: [
      "Needing exactly 8 rolls means the first 7 rolls miss exactly one face, and the 8th roll is that face.",
      "Count length-7 sequences over a chosen 5-element set of faces that use all five — an inclusion–exclusion surjection count.",
      "Multiply by the number of ways to choose which 5 faces appear and by the probability the last roll is the specific missing face, then reduce the fraction.",
    ],
    difficulty: 9,
    topicSlug: "counting-probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-91",
    question:
      "Find the number of integers k with 0 ≤ k ≤ 2026 for which the decimal representation of 2^k begins with the digit 1.",
    format: "INTEGER",
    answer: "610",
    solution:
      "Key observation: for k ≥ 1, 2^k begins with the digit 1 if and only if 2^k has one more digit than 2^{k−1}. Indeed, if 2^k ∈ [10^d, 2·10^d) then 2^{k−1} ∈ [5·10^{d−1}, 10^d), which has d digits while 2^k has d + 1; conversely, if the digit count increases at step k then 2^{k−1} < 10^d ≤ 2^k < 2·10^d, so 2^k starts with 1. Since doubling never adds two digits at once, the digit count increases by exactly 1 at each such k. Now 2^0 = 1 has 1 digit and begins with 1, while 2^2026 has ⌊2026·log₁₀2⌋ + 1 = ⌊609.887…⌋ + 1 = 610 digits. So the digit count rises 610 − 1 = 609 times over k = 1, …, 2026, contributing 609 values, plus the value k = 0. The total is 609 + 1 = 610. (Equivalently, the answer equals the number of digits of 2^2026: each block of exponents sharing a digit count contains exactly one power starting with 1. Direct computation of all 2027 powers confirms 610.)",
    hints: [
      "Compare 2^k with 2^{k−1}: when exactly does doubling increase the number of decimal digits?",
      "Show that the digit count increases at step k precisely when 2^k has leading digit 1.",
      "Count the total number of digit-count increases from 2^0 up to 2^2026 using log₁₀2, and handle k = 0 separately.",
    ],
    difficulty: 9,
    topicSlug: "number-properties",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-92",
    question:
      "A token starts at position 5 on the number line. Each second the token moves one unit to the right with probability 2/3 and one unit to the left with probability 1/3, independently of all earlier moves. The token stops as soon as it reaches position 0 or position 10. The probability that it stops at position 10 rather than at position 0 is m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "65",
    solution:
      "For k = 0, 1, …, 10 let p_k be the probability of stopping at 10 when the token currently sits at k, so p_0 = 0, p_10 = 1, and conditioning on the next move gives p_k = (2/3)p_{k+1} + (1/3)p_{k−1} for 1 ≤ k ≤ 9. Rather than solving ten equations, look at the consecutive differences d_k = p_k − p_{k−1}. Rewriting the recurrence as (2/3)(p_{k+1} − p_k) = (1/3)(p_k − p_{k−1}) gives d_{k+1} = d_k/2, so the differences form a geometric progression with ratio 1/2: d_k = d_1·(1/2)^{k−1}. Summing, p_k = d_1(1 + 1/2 + ⋯ + (1/2)^{k−1}) = d_1·(1 − (1/2)^k)/(1 − 1/2) = 2d_1(1 − 2^{−k}). The boundary condition p_10 = 1 fixes 2d_1 = 1/(1 − 2^{−10}), so p_k = (1 − 2^{−k})/(1 − 2^{−10}) = (2^k − 1)·2^{10−k}/(2^{10} − 1). At k = 5 this is (2^5 − 1)·2^5/(2^{10} − 1) = 31·32/1023 = 992/1023. Since 1023 = 31·33 and 992 = 31·32, the fraction reduces to 32/33, and gcd(32, 33) = 1. Hence m + n = 32 + 33 = 65. (Iterating the recurrence numerically from p_0 = 0, p_10 = 1 converges to p_5 = 0.969696…, and 32/33 = 0.969696…; an exact linear solve of the ten equations returns 32/33.)",
    hints: [
      "Let p_k be the probability of finishing at 10 starting from k, and condition on the very next step to get one equation per interior position.",
      "Do not solve the system head-on: examine the consecutive differences p_k − p_{k−1} and show each is half the previous one.",
      "Summing a geometric progression expresses p_k in terms of a single unknown, which the condition at the far end determines.",
    ],
    difficulty: 9,
    topicSlug: "probability",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-93",
    question:
      "Find the number of six-digit positive integers whose digits sum to 21 and in which no digit is greater than 6.",
    format: "INTEGER",
    answer: "7232",
    solution:
      "First drop the leading-digit restriction and count strings d₁d₂…d₆ with each dᵢ ∈ {0, 1, …, 6} and Σdᵢ = 21. Without the upper bound, the number of nonnegative solutions is C(21 + 5, 5) = C(26,5) = 65780. Correct with inclusion–exclusion on the set of positions where dᵢ ≥ 7: choosing j such positions and subtracting 7 from each leaves a free sum of 21 − 7j, so the count is Σ_{j≥0} (−1)^j C(6,j)·C(26 − 7j, 5) = 65780 − 6·11628 + 15·792 − 20·1 = 65780 − 69768 + 11880 − 20 = 7872. Now remove the strings with d₁ = 0: those are five-digit-position strings with digits at most 6 summing to 21, counted the same way as Σ_{j≥0} (−1)^j C(5,j)·C(25 − 7j, 4) = 12650 − 5·3060 + 10·330 − 10·1 = 12650 − 15300 + 3300 − 10 = 640. Therefore the answer is 7872 − 640 = 7232. (Exhaustive enumeration of all 7^6 = 117649 digit strings confirms 7232.)",
    hints: [
      "Ignore the no-leading-zero rule at first and count all length-6 digit strings with digits at most 6 that sum to 21.",
      "Count unbounded nonnegative solutions first, then subtract the ones violating the cap of 6 using inclusion–exclusion on which positions are too large — the correction has three nonzero terms.",
      "Finally subtract the strings that begin with 0, which is the same computation one position shorter.",
    ],
    difficulty: 8,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-94",
    question:
      "Three piles of stones contain a, b, and c stones, where a, b, and c are integers with 1 ≤ a, b, c ≤ 20. Two players alternate turns; on a turn a player chooses one pile and removes any positive number of stones from that pile, and the player who removes the very last stone wins. Find the number of ordered triples (a, b, c) for which the player who moves second can force a win no matter how the first player plays.",
    format: "INTEGER",
    answer: "270",
    solution:
      "Write each pile size in binary and add the three sizes bitwise without carrying (the binary digital sum). The positions from which the player to move loses are exactly those where this bitwise sum is 0: from such a position every move changes exactly one pile and therefore breaks the balance, while from an unbalanced position one can always restore it — take the highest bit where the sum is 1, pick a pile whose size has that bit set, and replace it by the bitwise sum of the other two, which is strictly smaller. So the second player wins exactly when a XOR b XOR c = 0, i.e. c = a XOR b. Count ordered triples with all entries in [1,20]. Split by the bit of value 16: let L = {1,…,15} (that bit clear) and H = {16,…,20} (that bit set, low part in {0,…,4}). If a, b ∈ L then c = a XOR b ≤ 15 is automatically in range, and c ≥ 1 forces a ≠ b: 15·15 − 15 = 210 triples. If a, b ∈ H, say a = 16 + u and b = 16 + v with u, v ∈ {0,…,4}, then c = u XOR v ≤ 7 is in range and nonzero exactly when u ≠ v: 5·5 − 5 = 20 triples. If exactly one of a, b lies in H, say a = 16 + u and b ∈ L, then c = 16 + (u XOR b), which is at most 20 only when u XOR b ≤ 4; writing b = u XOR t with t ∈ {0,…,4} and requiring b ≠ 0 gives t ≠ u, so 4 choices of b for each of the 5 values of u, and doubling for the two orders gives 2·5·4 = 40 triples. Total: 210 + 20 + 40 = 270. (A direct retrograde analysis of the game over all 20³ starting positions also returns 270 losing-for-the-mover triples.)",
    hints: [
      "Experiment with two piles first: decide exactly which two-pile positions are losses for the player about to move, and look for the pattern in binary.",
      "Guess the family of losing positions in terms of binary digits and verify the two required properties — every move leaves the family, and from outside it some move re-enters it.",
      "Counting the triples with that binary condition is a separate job: handle the bit of value 16 separately, since only 16 through 20 use it.",
    ],
    difficulty: 9,
    topicSlug: "games-and-strategies",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-95",
    question:
      "A bag contains 4 red marbles and 7 blue marbles. The marbles are drawn one at a time, without replacement, until the bag is empty, and the colors are recorded in order. The expected number of positions in this sequence of 11 colors at which the color differs from the color immediately before it is m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "67",
    solution:
      "Use linearity of expectation with one indicator per adjacent slot. There are 10 adjacent pairs of positions. For a fixed pair of positions, the two marbles occupying them are a uniformly random ordered pair of distinct marbles, so the probability their colors differ is (number of ordered red-blue pairs)/(number of ordered pairs) = 2·4·7/(11·10) = 56/110 = 28/55. By linearity the expected number of color changes is 10 · 28/55 = 280/55 = 56/11. Since gcd(56, 11) = 1, m + n = 56 + 11 = 67. (Averaging over all 11!/(4!7!) = 330 distinct color sequences gives exactly 56/11.)",
    hints: [
      "Rather than tracking whole sequences, attach an indicator variable to each of the 10 adjacent position pairs.",
      "For one fixed adjacent pair, compute the probability that the two marbles there have different colors — by symmetry it does not depend on which pair you picked.",
      "Multiply by the number of adjacent pairs and reduce.",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-96",
    question:
      "Find the number of nonempty subsets of {1, 2, 3, …, 15} whose elements have a product that is a perfect square.",
    format: "INTEGER",
    answer: "511",
    solution:
      "Only the parities of the prime exponents matter, and the primes that occur are 2, 3, 5, 7, 11, 13. Attach to each n the length-6 vector of those exponents reduced mod 2; multiplying numbers adds vectors mod 2, and a product is a perfect square exactly when the vectors of the chosen numbers add to the zero vector. So the question counts the subsets of 15 given vectors in the 6-dimensional space over the field with two elements that sum to zero — that is, the size of the kernel of the linear map sending a subset to its vector sum. The map is onto: 2, 3, 5, 7, 11, 13 themselves give the six standard basis vectors, so the image is all of the 6-dimensional space and the rank is 6. Hence the kernel has 2^(15 − 6) = 2^9 = 512 elements, one of which is the empty subset. The answer is 512 − 1 = 511. (Exhaustive enumeration of all 2^15 = 32768 subsets confirms 511 nonempty square-product subsets, for example {1}, {2, 8}, {3, 12}, {2, 3, 6}, and {6, 10, 15}.)",
    hints: [
      "A product is a perfect square exactly when every prime appears an even number of times — record only the parity of each prime's exponent.",
      "Encode each number 1 through 15 as a vector of those parities and note that choosing a subset corresponds to adding the chosen vectors with 1 + 1 = 0.",
      "Count the solutions of a homogeneous linear system over the two-element field: find the rank of the 15 vectors, and remember to exclude the empty subset.",
    ],
    difficulty: 8,
    topicSlug: "factorization",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-97",
    question:
      "Let S be the set of 49 points (x, y) where x and y are integers with 0 ≤ x ≤ 6 and 0 ≤ y ≤ 6. Find the number of triangles of positive area whose three vertices all lie in S.",
    format: "INTEGER",
    answer: "17600",
    solution:
      "There are C(49,3) = 18424 ways to choose three of the points; subtract the collinear triples. Group collinear triples by the primitive direction vector of their line. Horizontal: 7 rows, each with C(7,3) = 35 triples, giving 245; vertical likewise 245. Slope ±1: the diagonals in each of the two directions have lengths 3, 4, 5, 6, 7, 6, 5, 4, 3 (lengths 1 and 2 contribute nothing), so each direction gives C(3,3)+C(4,3)+C(5,3)+C(6,3)+C(7,3)+C(6,3)+C(5,3)+C(4,3)+C(3,3) = 1+4+10+20+35+20+10+4+1 = 105; two directions give 210. Directions (1,±2) and (2,±1): each of these four directions contributes 23, for 92. Directions (1,±3) and (3,±1): each contributes 5, for 20. Directions (2,±3) and (3,±2): each contributes 3, for 12. No other primitive direction admits three lattice points inside the 7 × 7 array. Total collinear triples: 245 + 245 + 210 + 92 + 20 + 12 = 824. Therefore the number of triangles is 18424 − 824 = 17600. (An exhaustive check of all 18424 triples via the cross-product determinant confirms exactly 824 degenerate ones.)",
    hints: [
      "Count all triples of points first, then subtract the degenerate (collinear) ones.",
      "Organize the collinear triples by the primitive direction vector of the line they lie on — rows, columns, the two slope-±1 families, then the sparser directions like (1,2) and (2,3).",
      "For each direction, count how many lattice points of the grid lie on each line of that direction and sum the corresponding C(length, 3).",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "purple-comet",
  },
  {
    slug: "purple-comet-98",
    question:
      "The integers 1 through 14 are written in order around a circle, so that 14 and 1 are adjacent. Find the number of subsets S of {1, 2, …, 14} such that no three integers that are consecutive around this circle all belong to S.",
    format: "INTEGER",
    answer: "5071",
    solution:
      "Let c(n) be the number of valid subsets when n ≥ 3 integers are arranged in a circle, and let L(n) be the corresponding count for a path (a straight row of n integers with no three consecutive chosen), which satisfies L(n) = L(n−1) + L(n−2) + L(n−3) with L(0) = 1, L(1) = 2, L(2) = 4 — condition on whether the last element is omitted, is chosen alone after an omission, or is the second of a chosen pair after an omission. Cutting the circle between positions n and 1 and casework on how many of the elements at the seam are chosen shows that c(n) obeys the very same recursion c(n) = c(n−1) + c(n−2) + c(n−3) for n ≥ 6. Direct enumeration of the small circles gives c(3) = 7 (all 8 subsets except the full one), c(4) = 11, and c(5) = 21. Iterating: c(6) = 39, c(7) = 71, c(8) = 131, c(9) = 241, c(10) = 443, c(11) = 815, c(12) = 1499, c(13) = 2757, c(14) = 5071. (Brute-force enumeration of all 2^14 = 16384 subsets confirms 5071.)",
    hints: [
      "Start with the easier straight-line version: subsets of a row of n items with no three consecutive chosen satisfy a three-term recursion.",
      "For the circular version, cut the circle at one place and handle the wrap-around constraint by casework on the elements near the cut.",
      "Establish the same three-term recursion for the circular counts, nail down the base cases by hand for n = 3, 4, 5, and iterate up to n = 14.",
    ],
    difficulty: 9,
    topicSlug: "recursion-in-counting",
    competitionSlug: "purple-comet",
  },
];
