import type { ProblemSeed } from "./problems";

/**
 * Hand-written problems styled after the AMC 10 (American Mathematics
 * Competitions, 10th-grade level).
 *
 * AMC 10 problems are terse, technique-driven, multiple-choice questions
 * spanning algebra, geometry, number theory, combinatorics, and
 * probability, with a sharp difficulty ramp across the 25-question set —
 * noticeably harder and more technique-heavy than AMC 8, with
 * olympiad-adjacent ideas (casework, pigeonhole, modular arithmetic,
 * clever algebraic identities) appearing in the back third. Every
 * problem below is an original NumberSmith problem, written to match
 * that format, phrasing, and difficulty ramp; none are transcribed,
 * paraphrased, or numerically reskinned from any real AMC contest.
 *
 * Difficulty rises from about 4 (problem 1) to about 9 (problem 32).
 */
export const AMC10_PROBLEMS: ProblemSeed[] = [
  {
    slug: "amc10-01",
    question: "What is the value of (2/3 + 3/4) ÷ (5/6 − 1/12)?",
    format: "MULTIPLE_CHOICE",
    choices: ["17/9", "16/9", "3/2", "2", "19/9"],
    answer: "A",
    solution:
      "2/3 + 3/4 = 8/12 + 9/12 = 17/12. Also 5/6 − 1/12 = 10/12 − 1/12 = 9/12 = 3/4. Dividing, (17/12) ÷ (3/4) = 17/12 × 4/3 = 68/36 = 17/9.",
    hints: [
      "Convert each side to a common denominator of 12 before combining.",
      "Dividing by 3/4 is the same as multiplying by 4/3.",
    ],
    difficulty: 4,
    topicSlug: "fractions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-02",
    question:
      "The sum of three consecutive even integers is 42 more than the smallest of the three. What is the largest of the three integers?",
    format: "MULTIPLE_CHOICE",
    choices: ["18", "20", "22", "24", "26"],
    answer: "C",
    solution:
      "Let the integers be n, n+2, n+4. Their sum is 3n+6, which equals n+42. Solving, 3n+6 = n+42 gives 2n = 36, so n = 18. The largest integer is n+4 = 22.",
    hints: [
      "Write the three consecutive even integers as n, n+2, n+4.",
      "Set 3n + 6 equal to n + 42 and solve for n.",
    ],
    difficulty: 4,
    topicSlug: "linear-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-03",
    question:
      "A shirt's price is discounted 20%, and then the sale price is discounted an additional 15%. What single percent discount, applied to the original price, gives the same final price?",
    format: "MULTIPLE_CHOICE",
    choices: ["32%", "35%", "30%", "34%", "28%"],
    answer: "A",
    solution:
      "Applying both discounts multiplies the original price by 0.80 × 0.85 = 0.68, so the final price is 68% of the original — a 32% discount overall.",
    hints: [
      "Successive percent discounts multiply, they don't add.",
      "Multiply the two 'keep' factors (0.80 and 0.85) to find the combined price factor.",
    ],
    difficulty: 4,
    topicSlug: "percentages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-04",
    question:
      "Train A travels 240 miles at a constant speed and takes 4 hours. Train B travels the same 240-mile route at a speed 20 mph faster than Train A. How many minutes less does Train B take?",
    format: "MULTIPLE_CHOICE",
    choices: ["45", "50", "60", "70", "75"],
    answer: "C",
    solution:
      "Train A's speed is 240/4 = 60 mph, so Train B's speed is 80 mph. Train B's time is 240/80 = 3 hours, which is 1 hour, or 60 minutes, less than Train A's 4 hours.",
    hints: [
      "First find Train A's speed from its distance and time.",
      "Compute Train B's travel time at its (faster) speed, then compare.",
    ],
    difficulty: 4,
    topicSlug: "rates",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-05",
    question:
      "The average of five numbers is 24. When one number is removed, the average of the remaining four numbers is 21. What number was removed?",
    format: "MULTIPLE_CHOICE",
    choices: ["30", "33", "36", "39", "42"],
    answer: "C",
    solution:
      "The sum of all five numbers is 5 × 24 = 120. The sum of the remaining four is 4 × 21 = 84. The removed number is 120 − 84 = 36.",
    hints: [
      "Turn each average into a total sum by multiplying by the count.",
      "The removed number is the difference between the two sums.",
    ],
    difficulty: 4,
    topicSlug: "averages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-06",
    question: "How many positive integers less than 100 are divisible by neither 2 nor 3?",
    format: "MULTIPLE_CHOICE",
    choices: ["30", "32", "33", "34", "36"],
    answer: "C",
    solution:
      "Among 1 to 99, there are 49 multiples of 2, 33 multiples of 3, and 16 multiples of 6. By inclusion-exclusion, 49 + 33 − 16 = 66 integers are divisible by 2 or 3, leaving 99 − 66 = 33 divisible by neither.",
    hints: [
      "Use inclusion-exclusion to count integers divisible by 2 or by 3.",
      "Subtract that count from 99 to get integers divisible by neither.",
    ],
    difficulty: 4,
    topicSlug: "number-properties",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-07",
    question:
      "A mixture of nuts consists of almonds, cashews, and walnuts in the ratio 3:4:5. After 6 more pounds of cashews are added, the ratio of almonds to cashews becomes 3:5. How many pounds of the mixture were there originally?",
    format: "MULTIPLE_CHOICE",
    choices: ["60", "66", "72", "78", "84"],
    answer: "C",
    solution:
      "Let the original amounts be 3k, 4k, 5k pounds. After adding 6 pounds of cashews, 3k/(4k+6) = 3/5, so 15k = 12k + 18, giving k = 6. The original total is 3k+4k+5k = 12k = 72 pounds.",
    hints: [
      "Write the original amounts as 3k, 4k, 5k pounds.",
      "Set up the new ratio equation 3k/(4k+6) = 3/5 and solve for k.",
    ],
    difficulty: 5,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-08",
    question:
      "In triangle ABC, the measure of angle A is 20° more than angle B, and angle C is three times angle B. What is the measure of angle A, in degrees?",
    format: "MULTIPLE_CHOICE",
    choices: ["44", "48", "52", "56", "60"],
    answer: "C",
    solution:
      "Let angle B = x. Then angle A = x + 20 and angle C = 3x. Since the angles sum to 180°: (x+20) + x + 3x = 180, so 5x = 160 and x = 32. Angle A = 32 + 20 = 52°.",
    hints: [
      "Express all three angles in terms of angle B.",
      "The three angles of a triangle always sum to 180°.",
    ],
    difficulty: 5,
    topicSlug: "angles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-09",
    question:
      "The lengths of two sides of a triangle are 11 and 17. How many integer values are possible for the length of the third side?",
    format: "MULTIPLE_CHOICE",
    choices: ["19", "20", "21", "22", "23"],
    answer: "C",
    solution:
      "By the triangle inequality, the third side x satisfies 17−11 < x < 17+11, i.e. 6 < x < 28. The integers from 7 to 27 inclusive number 27−7+1 = 21.",
    hints: [
      "Apply the triangle inequality to bound the third side strictly between the difference and sum of the given sides.",
      "Count the integers strictly between those two bounds.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-10",
    question:
      "A parallelogram has sides of length 7 and 9 and one diagonal of length 8. What is the length of the other diagonal?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "12", "13", "14", "15"],
    answer: "D",
    solution:
      "By the parallelogram law, the sum of the squares of the diagonals equals twice the sum of the squares of the sides: d1² + d2² = 2(7² + 9²) = 2(130) = 260. With d1 = 8, d2² = 260 − 64 = 196, so d2 = 14.",
    hints: [
      "Recall the parallelogram law: the sum of the squares of the two diagonals equals twice the sum of the squares of the two sides.",
      "Solve for the unknown diagonal after substituting the known diagonal and side lengths.",
    ],
    difficulty: 5,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-11",
    question: "If 2^(x+3) = 4^(x−1), what is the value of x?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "5", "6", "7"],
    answer: "C",
    solution:
      "Rewrite 4^(x−1) as 2^(2x−2). Setting exponents equal (same base): x + 3 = 2x − 2, so x = 5.",
    hints: [
      "Rewrite both sides of the equation with the same base, 2.",
      "Once the bases match, set the exponents equal to each other.",
    ],
    difficulty: 5,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-12",
    question:
      "The expression x² + bx + 36 factors as (x+p)(x+q), where p and q are positive integers. What is the largest possible value of b?",
    format: "MULTIPLE_CHOICE",
    choices: ["15", "20", "25", "37", "36"],
    answer: "D",
    solution:
      "Since b = p+q and pq = 36, b is maximized when p and q are as far apart as possible: p=1, q=36, giving b = 37.",
    hints: [
      "Write b as the sum of two positive integers whose product is 36.",
      "To maximize a sum with a fixed product, make the two factors as unequal as possible.",
    ],
    difficulty: 5,
    topicSlug: "factoring",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-13",
    question: "Positive integers x and y satisfy 2x + 3y = 47 and x − y = 6. What is the value of xy?",
    format: "MULTIPLE_CHOICE",
    choices: ["77", "84", "91", "98", "105"],
    answer: "C",
    solution:
      "From x − y = 6, x = y + 6. Substituting: 2(y+6) + 3y = 47, so 5y + 12 = 47, giving y = 7 and x = 13. Thus xy = 91.",
    hints: [
      "Use the second equation to write x in terms of y.",
      "Substitute into the first equation and solve for y before finding xy.",
    ],
    difficulty: 5,
    topicSlug: "systems-of-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-14",
    question:
      "A password consists of 4 characters: the first two are distinct letters chosen from {A, B, C, D, E}, and the last two are distinct digits chosen from {1, 2, 3, 4, 5, 6}. How many such passwords are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["400", "480", "540", "600", "720"],
    answer: "D",
    solution:
      "The two distinct letters can be arranged in 5 × 4 = 20 ways, and the two distinct digits in 6 × 5 = 30 ways. By the multiplication principle, the total is 20 × 30 = 600.",
    hints: [
      "Count the ordered choices for the letter positions and the digit positions separately.",
      "Multiply the two counts together.",
    ],
    difficulty: 5,
    topicSlug: "counting-principles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-15",
    question:
      "Two circles have radii 9 and 4, and the distance between their centers is 13 (so the circles are externally tangent). What is the length of their common external tangent segment, measured between the two points of tangency?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "11", "12", "13", "6√5"],
    answer: "C",
    solution:
      "The length of a common external tangent between two circles with centers distance d apart and radii r1, r2 is √(d² − (r1−r2)²). Here that's √(13² − 5²) = √(169−25) = √144 = 12.",
    hints: [
      "Use the common external tangent length formula involving the center distance and the difference of the radii.",
      "Compute d² − (r1−r2)² before taking the square root.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-16",
    question:
      "The measure of each interior angle of a regular polygon exceeds the measure of each interior angle of a regular hexagon by 15°. How many sides does the polygon have?",
    format: "MULTIPLE_CHOICE",
    choices: ["7", "8", "9", "10", "12"],
    answer: "B",
    solution:
      "A regular hexagon's interior angle is 120°, so the polygon's interior angle is 135°. Using (n−2)·180/n = 135: 180n − 360 = 135n, so 45n = 360, giving n = 8.",
    hints: [
      "Find the hexagon's interior angle first, then add 15° to get the target polygon's interior angle.",
      "Set the regular-polygon interior angle formula equal to that value and solve for n.",
    ],
    difficulty: 6,
    topicSlug: "polygons",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-17",
    question:
      "A line passes through the points (2, 5) and (8, 17). At what x-coordinate does this line cross the x-axis?",
    format: "MULTIPLE_CHOICE",
    choices: ["−1", "−1/2", "0", "1/2", "1"],
    answer: "B",
    solution:
      "The slope is (17−5)/(8−2) = 12/6 = 2. Using point-slope form: y − 5 = 2(x−2), so y = 2x + 1. Setting y = 0 gives x = −1/2.",
    hints: [
      "Find the slope from the two given points, then write the line's equation.",
      "Set y = 0 in the line's equation and solve for x.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-18",
    question: "How many positive integers less than 500 are divisible by both 6 and 8, but not by 5?",
    format: "MULTIPLE_CHOICE",
    choices: ["14", "15", "16", "17", "18"],
    answer: "C",
    solution:
      "A number divisible by both 6 and 8 is divisible by lcm(6,8) = 24. There are ⌊499/24⌋ = 20 such multiples below 500. Among those, the multiples also divisible by 5 are multiples of lcm(24,5) = 120, of which there are ⌊499/120⌋ = 4. So 20 − 4 = 16 multiples of 24 are not divisible by 5.",
    hints: [
      "First find how many positive integers below 500 are divisible by lcm(6,8) = 24.",
      "Subtract those that are also divisible by 5, i.e. divisible by lcm(24,5) = 120.",
    ],
    difficulty: 6,
    topicSlug: "divisibility",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-19",
    question:
      "What is the sum of all prime numbers p less than 20 such that p, p+2, and p+6 are all prime?",
    format: "MULTIPLE_CHOICE",
    choices: ["28", "33", "36", "39", "41"],
    answer: "B",
    solution:
      "Checking primes p < 20: p=5 gives 5,7,11 (all prime); p=11 gives 11,13,17 (all prime); p=17 gives 17,19,23 (all prime). Other primes below 20 (2,3,7,13,19) fail since one of p+2 or p+6 is composite. The sum is 5+11+17 = 33.",
    hints: [
      "Test each prime below 20 by checking whether p+2 and p+6 are both also prime.",
      "Exactly three primes below 20 satisfy the condition — add them together.",
    ],
    difficulty: 6,
    topicSlug: "primes",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-20",
    question: "What is the remainder when 3^100 is divided by 13?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "3", "9", "10", "12"],
    answer: "B",
    solution:
      "Since 3³ = 27 ≡ 1 (mod 13), the powers of 3 mod 13 cycle with period 3. Since 100 = 3(33) + 1, 3^100 ≡ 3^1 ≡ 3 (mod 13).",
    hints: [
      "Compute small powers of 3 modulo 13 to find the cycle length.",
      "Reduce the exponent 100 modulo that cycle length.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-21",
    question: "How many ways can the letters of the word ALGEBRA be arranged so that the two A's are adjacent to each other?",
    format: "MULTIPLE_CHOICE",
    choices: ["360", "480", "600", "720", "840"],
    answer: "D",
    solution:
      "ALGEBRA has 7 letters: A, L, G, E, B, R, A, with the two A's identical and the other five letters distinct. Gluing the two A's into a single block leaves 6 distinct units (the block plus L, G, E, B, R), which can be arranged in 6! = 720 ways.",
    hints: [
      "Treat the two adjacent A's as a single glued block.",
      "Count the arrangements of the resulting 6 distinct units.",
    ],
    difficulty: 6,
    topicSlug: "permutations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-22",
    question:
      "A committee of 5 people is chosen from 6 men and 5 women. How many such committees include at least 3 women?",
    format: "MULTIPLE_CHOICE",
    choices: ["171", "176", "181", "186", "191"],
    answer: "C",
    solution:
      "Count by cases on the number of women: exactly 3 women gives C(5,3)C(6,2) = 10×15 = 150; exactly 4 women gives C(5,4)C(6,1) = 5×6 = 30; exactly 5 women gives C(5,5)C(6,0) = 1. The total is 150+30+1 = 181.",
    hints: [
      "Split into cases: exactly 3, exactly 4, and exactly 5 women on the committee.",
      "Use combinations to count each case, then add the cases together.",
    ],
    difficulty: 6,
    topicSlug: "combinations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-23",
    question:
      "Two fair six-sided dice are rolled. What is the probability that the product of the two numbers rolled is a multiple of 4?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/3", "3/8", "5/12", "4/9", "7/12"],
    answer: "C",
    solution:
      "Classify each face by its power of 2: {1,3,5} contribute 0, {2,6} contribute 1, {4} contributes 2. The product is a multiple of 4 exactly when the total power of 2 from both dice is at least 2. Counting ordered pairs by combined power: total 2 occurs 6+4=10 ways (one die contributes 0 & other 2, or both contribute 1), total 3 occurs 4 ways, total 4 occurs 1 way, giving 10+4+1 = 15 favorable outcomes out of 36. The probability is 15/36 = 5/12.",
    hints: [
      "Track how many factors of 2 each die face contributes: 0 for odd faces, 1 for 2 or 6, 2 for the face 4.",
      "The product is divisible by 4 exactly when the two dice's factor-of-2 counts sum to at least 2 — count those ordered pairs out of 36.",
    ],
    difficulty: 7,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-24",
    question:
      "The sum of the squares of the roots of x² − 8x + k = 0 is 34. What is the value of k?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "12", "15", "17", "20"],
    answer: "C",
    solution:
      "By Vieta's formulas, the roots sum to 8 and multiply to k. The sum of squares is (sum)² − 2(product) = 64 − 2k = 34, so 2k = 30 and k = 15.",
    hints: [
      "Use Vieta's formulas to relate the sum and product of the roots to the coefficients.",
      "The sum of squares of the roots equals (sum of roots)² minus twice the product of roots.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-25",
    question: "A sequence is defined by a1 = 3 and a(n+1) = 2·a(n) + 1 for n ≥ 1. What is a5?",
    format: "MULTIPLE_CHOICE",
    choices: ["47", "55", "63", "71", "79"],
    answer: "C",
    solution:
      "Computing term by term: a1=3, a2=2(3)+1=7, a3=2(7)+1=15, a4=2(15)+1=31, a5=2(31)+1=63.",
    hints: [
      "Apply the recursive rule one step at a time starting from a1 = 3.",
      "Each new term is double the previous term, plus 1.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-26",
    question:
      "In triangle ABC, D is on AB and E is on AC such that DE is parallel to BC. If AD = 4, DB = 6, and the area of triangle ADE is 8, what is the area of trapezoid DBCE?",
    format: "MULTIPLE_CHOICE",
    choices: ["32", "36", "40", "42", "45"],
    answer: "D",
    solution:
      "Since DE ∥ BC, triangle ADE is similar to triangle ABC with ratio AD/AB = 4/10 = 2/5. Areas scale with the square of the ratio, so [ABC] = [ADE]/(2/5)² = 8/(4/25) = 50. The trapezoid's area is 50 − 8 = 42.",
    hints: [
      "Triangle ADE is similar to triangle ABC — find the similarity ratio using AD and AB.",
      "Areas of similar triangles scale with the square of the similarity ratio; subtract to get the trapezoid.",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-27",
    question:
      "A cylindrical tank with radius 6 and height 10 is filled with water to a height of 4. A solid sphere of radius 3 is then fully submerged in the tank. What is the new height of the water?",
    format: "MULTIPLE_CHOICE",
    choices: ["4.5", "5", "5.5", "6", "6.5"],
    answer: "B",
    solution:
      "The sphere's volume is (4/3)π(3³) = 36π. The tank's cross-sectional area is π(6²) = 36π. The water rises by (volume displaced)/(base area) = 36π/36π = 1, so the new height is 4 + 1 = 5.",
    hints: [
      "Find the volume of water displaced by the submerged sphere.",
      "Divide the displaced volume by the tank's cross-sectional area to find the rise in water level.",
    ],
    difficulty: 7,
    topicSlug: "area-volume",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-28",
    question: "How many integers n satisfy the inequality n² − 7n − 30 ≤ 0?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "13", "14", "15", "16"],
    answer: "C",
    solution:
      "Factor: n² − 7n − 30 = (n−10)(n+3). This is ≤ 0 exactly when −3 ≤ n ≤ 10. The integers in this range are −3, −2, ..., 10, which number 10−(−3)+1 = 14.",
    hints: [
      "Factor the quadratic to find where it changes sign.",
      "A product of two factors is ≤ 0 exactly between its roots (inclusive).",
    ],
    difficulty: 7,
    topicSlug: "inequalities",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-29",
    question:
      "How many ordered triples (a, b, c) of positive integers satisfy a + b + c = 12 with a, b, c each at most 6?",
    format: "MULTIPLE_CHOICE",
    choices: ["19", "22", "25", "28", "31"],
    answer: "C",
    solution:
      "Without the upper bound, the number of positive-integer solutions to a+b+c=12 is C(11,2) = 55. If a ≥ 7, set a′ = a−6 ≥ 1, so a′+b+c = 6 has C(5,2) = 10 positive solutions; the same holds for b ≥ 7 or c ≥ 7. Two variables can't both exceed 6 simultaneously (their sum alone would exceed 12), so by inclusion-exclusion the invalid count is 3×10 = 30. The valid count is 55 − 30 = 25.",
    hints: [
      "First count all positive-integer solutions to a+b+c=12 using stars and bars, ignoring the upper bound.",
      "Subtract the cases where some variable is at least 7, using a substitution to count each such case; check whether two variables can exceed the bound at once.",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-30",
    question:
      "What is the minimum number of integers that must be selected from {1, 2, 3, ..., 30} to guarantee that at least two of the selected integers differ by exactly 5?",
    format: "MULTIPLE_CHOICE",
    choices: ["11", "13", "15", "16", "18"],
    answer: "D",
    solution:
      "Group the numbers by residue mod 5 into 5 classes of 6 elements each, e.g. {1,6,11,16,21,26}. Within a class, consecutive elements differ by exactly 5, forming a path of 6 nodes; the largest subset with no two differing by 5 is an independent set in this path, of size ⌈6/2⌉ = 3 (e.g. 1, 11, 21). So at most 3 per class, or 15 total, can be chosen while avoiding any difference of 5. Selecting one more (16 total) forces two numbers differing by 5.",
    hints: [
      "Group the numbers into 5 classes by residue mod 5; within each class, consecutive numbers differ by exactly 5.",
      "Find the largest subset of a 6-element chain with no two consecutive elements chosen, then add 1 to guarantee a violation.",
    ],
    difficulty: 8,
    topicSlug: "pigeonhole",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-31",
    question: "How many ordered pairs of positive integers (x, y) satisfy 5x + 8y = 200?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "5", "6", "7"],
    answer: "B",
    solution:
      "Solving for x: x = (200 − 8y)/5, which requires 200 − 8y ≡ 0 (mod 5), i.e. 3y ≡ 0 (mod 5), so y must be a multiple of 5. With y < 25 (so that x > 0), the possible values are y = 5, 10, 15, 20, giving x = 32, 24, 16, 8 respectively — all positive integers. That's 4 ordered pairs.",
    hints: [
      "Solve for x in terms of y and find the modular condition on y that makes x an integer.",
      "Determine the range of y that keeps x a positive integer, then count the valid multiples of 5 in that range.",
    ],
    difficulty: 8,
    topicSlug: "diophantine-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-32",
    question:
      "A fair coin is flipped repeatedly until either two consecutive heads or two consecutive tails have appeared. What is the expected number of flips?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/2", "3", "7/2", "4", "9/2"],
    answer: "B",
    solution:
      "After the first flip, define E as the expected number of additional flips needed. From this state, the next flip matches the previous one with probability 1/2 (stopping immediately) or doesn't match with probability 1/2 (staying in the same type of state, needing E more flips). So E = 1 + (1/2)(0) + (1/2)(E), giving (1/2)E = 1, so E = 2. Including the first flip, the total expected number of flips is 1 + 2 = 3.",
    hints: [
      "Set up a recursive equation for the expected number of additional flips needed once the process has started.",
      "After the first flip, each subsequent flip either ends the process or leaves you in an equivalent waiting state — use this self-similarity to solve for the expectation.",
    ],
    difficulty: 9,
    topicSlug: "expected-value",
    competitionSlug: "amc10",
  },

{
    slug: "amc10-33",
    question: "What is the value of (5/6 − 1/4) × (2/3 + 1/2)?",
    format: "MULTIPLE_CHOICE",
    choices: ["7/12", "49/72", "1", "7/6", "49/36"],
    answer: "B",
    solution:
      "5/6 − 1/4 = 10/12 − 3/12 = 7/12. Also 2/3 + 1/2 = 4/6 + 3/6 = 7/6. Multiplying, (7/12)(7/6) = 49/72.",
    hints: [
      "Combine each parenthesis over a common denominator first.",
      "Multiply the two resulting fractions and simplify if possible.",
    ],
    difficulty: 4,
    topicSlug: "fractions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-34",
    question:
      "A number increased by 12 equals three times the number decreased by 8. What is the number?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "11", "12", "14", "20"],
    answer: "A",
    solution:
      "Let the number be x. Then x + 12 = 3x − 8, so 20 = 2x, giving x = 10.",
    hints: [
      "Translate the sentence into the equation x + 12 = 3x − 8.",
      "Collect the x-terms on one side and the constants on the other.",
    ],
    difficulty: 4,
    topicSlug: "linear-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-35",
    question:
      "A jacket originally costs $80. It is marked up 25%, and then the marked-up price is discounted 20% during a sale. What is the final sale price?",
    format: "MULTIPLE_CHOICE",
    choices: ["$80", "$84", "$88", "$92", "$96"],
    answer: "A",
    solution:
      "The markup multiplies the price by 1.25, giving 80 × 1.25 = $100. The discount then multiplies by 0.80, giving 100 × 0.80 = $80. (In general, a 25% increase followed by a 20% decrease multiplies the price by 1.25 × 0.80 = 1, returning to the original price.)",
    hints: [
      "Apply the 25% markup first to find the sale's starting price.",
      "Notice that multiplying by 1.25 and then by 0.80 has a special combined effect.",
    ],
    difficulty: 4,
    topicSlug: "percentages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-36",
    question:
      "The ratio of boys to girls in a class is 5:7. There are 8 more girls than boys. How many students are in the class in total?",
    format: "MULTIPLE_CHOICE",
    choices: ["36", "40", "44", "48", "52"],
    answer: "D",
    solution:
      "Let the numbers of boys and girls be 5k and 7k. Then 7k − 5k = 8, so 2k = 8 and k = 4. The total number of students is 5k + 7k = 12k = 48.",
    hints: [
      "Write the numbers of boys and girls as 5k and 7k for some k.",
      "The difference 7k − 5k equals 8 — solve for k, then find 12k.",
    ],
    difficulty: 4,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-37",
    question:
      "The test scores of 5 students average 82. A sixth student joins the class, and the average of all six scores becomes 84. What score did the sixth student receive?",
    format: "MULTIPLE_CHOICE",
    choices: ["88", "90", "92", "94", "96"],
    answer: "D",
    solution:
      "The five original scores sum to 5 × 82 = 410. The six scores sum to 6 × 84 = 504. The sixth student's score is 504 − 410 = 94.",
    hints: [
      "Convert each average into a total sum by multiplying by the number of students.",
      "The new student's score is the difference between the six-person sum and the five-person sum.",
    ],
    difficulty: 4,
    topicSlug: "averages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-38",
    question:
      "One printer prints 15 pages per minute, and a second printer prints 10 pages per minute. Working together, how many minutes do the two printers take to print 150 pages?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "6", "7", "8", "9"],
    answer: "B",
    solution:
      "Working together, the printers print 15 + 10 = 25 pages per minute. To print 150 pages takes 150/25 = 6 minutes.",
    hints: [
      "Add the two printing rates to get a combined rate.",
      "Divide the total number of pages by the combined rate.",
    ],
    difficulty: 4,
    topicSlug: "rates",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-39",
    question: "How many positive integers less than 50 are multiples of 3 or 4 (or both)?",
    format: "MULTIPLE_CHOICE",
    choices: ["24", "25", "26", "27", "28"],
    answer: "A",
    solution:
      "Among 1 to 49, there are ⌊49/3⌋ = 16 multiples of 3 and ⌊49/4⌋ = 12 multiples of 4. Multiples of both 3 and 4 are multiples of 12, of which there are ⌊49/12⌋ = 4. By inclusion-exclusion, the count is 16 + 12 − 4 = 24.",
    hints: [
      "Count multiples of 3 and multiples of 4 separately using the floor function.",
      "Use inclusion-exclusion: add the two counts and subtract the multiples of 12.",
    ],
    difficulty: 4,
    topicSlug: "number-properties",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-40",
    question:
      "In triangle PQR, angle P is 20° less than angle Q, and angle R = 70°. What is the measure of angle Q?",
    format: "MULTIPLE_CHOICE",
    choices: ["55", "60", "65", "70", "75"],
    answer: "C",
    solution:
      "Since angle R = 70°, angles P and Q sum to 110°. Let angle Q = x; then angle P = x − 20. So (x − 20) + x = 110, giving 2x = 130 and x = 65.",
    hints: [
      "The three angles of a triangle sum to 180°, so P and Q together sum to 110°.",
      "Write P in terms of Q and solve the resulting equation.",
    ],
    difficulty: 4,
    topicSlug: "triangles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-41",
    question:
      "A rectangle has a perimeter of 64 and a length that is 8 more than its width. What is the area of the rectangle?",
    format: "MULTIPLE_CHOICE",
    choices: ["190", "210", "220", "230", "240"],
    answer: "E",
    solution:
      "Let the width be w, so the length is w + 8. The perimeter is 2(w + w + 8) = 64, so 2w + 8 = 32, giving w = 12 and length = 20. The area is 12 × 20 = 240.",
    hints: [
      "Write the perimeter equation in terms of the width w.",
      "Once you know w, find the length and multiply to get the area.",
    ],
    difficulty: 4,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-42",
    question: "A circle has area 64π. What is its circumference?",
    format: "MULTIPLE_CHOICE",
    choices: ["4π", "8π", "12π", "14π", "16π"],
    answer: "E",
    solution: "From area πr² = 64π, r² = 64, so r = 8. The circumference is 2πr = 16π.",
    hints: [
      "Use the area formula to find the radius first.",
      "Then apply the circumference formula 2πr.",
    ],
    difficulty: 4,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-43",
    question: "What is the distance between the points (1, 2) and (7, 10)?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "11", "12", "13", "14"],
    answer: "A",
    solution:
      "The horizontal distance is 7 − 1 = 6 and the vertical distance is 10 − 2 = 8. By the distance formula (the 6-8-10 right triangle), the distance is √(6² + 8²) = √100 = 10.",
    hints: [
      "Find the horizontal and vertical differences between the two points.",
      "Apply the distance formula √(Δx² + Δy²).",
    ],
    difficulty: 4,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-44",
    question: "How many prime numbers are there between 40 and 60?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "5", "6", "7", "8"],
    answer: "B",
    solution:
      "Checking each integer from 41 to 59: the primes in this range are 41, 43, 47, 53, and 59 — five primes in total.",
    hints: [
      "Check each integer from 41 to 59 for divisibility by small primes.",
      "There are exactly five primes in this range.",
    ],
    difficulty: 4,
    topicSlug: "primes",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-45",
    question: "What is the smallest positive integer divisible by both 12 and 18?",
    format: "MULTIPLE_CHOICE",
    choices: ["24", "28", "30", "33", "36"],
    answer: "E",
    solution:
      "12 = 2²·3 and 18 = 2·3². The least common multiple takes the highest power of each prime: 2²·3² = 36.",
    hints: [
      "Find the prime factorizations of 12 and 18.",
      "The LCM uses the highest power of each prime appearing in either factorization.",
    ],
    difficulty: 4,
    topicSlug: "divisibility",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-46",
    question:
      "A restaurant offers 4 appetizers, 6 main courses, and 3 desserts. How many different 3-course meals (one of each course) can be ordered?",
    format: "MULTIPLE_CHOICE",
    choices: ["72", "78", "84", "90", "96"],
    answer: "A",
    solution: "By the multiplication principle, the number of meals is 4 × 6 × 3 = 72.",
    hints: [
      "Each course is chosen independently of the others.",
      "Multiply the number of choices for each course together.",
    ],
    difficulty: 4,
    topicSlug: "counting-principles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-47",
    question:
      "A bag contains 4 red marbles and 6 blue marbles. One marble is drawn at random. What is the probability that it is red?",
    format: "MULTIPLE_CHOICE",
    choices: ["3/10", "2/5", "1/2", "3/5", "7/10"],
    answer: "B",
    solution:
      "There are 10 marbles total, 4 of which are red, so the probability of drawing red is 4/10 = 2/5.",
    hints: [
      "Divide the number of red marbles by the total number of marbles.",
      "Simplify the resulting fraction.",
    ],
    difficulty: 4,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-48",
    question: "In the arithmetic sequence 5, 11, 17, 23, ..., what is the 15th term?",
    format: "MULTIPLE_CHOICE",
    choices: ["83", "85", "87", "89", "91"],
    answer: "D",
    solution:
      "The sequence has first term 5 and common difference 6. The nth term is 5 + 6(n−1). For n = 15: 5 + 6(14) = 5 + 84 = 89.",
    hints: [
      "Identify the first term and the common difference.",
      "Use the formula aₙ = a₁ + d(n − 1).",
    ],
    difficulty: 4,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-49",
    question: "What is the value of √50 + √18?",
    format: "MULTIPLE_CHOICE",
    choices: ["8√2", "9√2", "10√2", "11√2", "12√2"],
    answer: "A",
    solution: "√50 = √(25·2) = 5√2, and √18 = √(9·2) = 3√2. Adding, 5√2 + 3√2 = 8√2.",
    hints: [
      "Simplify each radical by pulling out the largest perfect-square factor.",
      "Both terms become multiples of √2, which can then be combined.",
    ],
    difficulty: 4,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-50",
    question:
      "The equation x² − 5x − 24 = 0 has two roots. What is the sum of the absolute values of the two roots?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "11", "13", "16", "19"],
    answer: "B",
    solution:
      "Factoring, x² − 5x − 24 = (x − 8)(x + 3) = 0, so the roots are 8 and −3. The sum of their absolute values is 8 + 3 = 11.",
    hints: [
      "Factor the quadratic to find both roots.",
      "Take the absolute value of each root before adding.",
    ],
    difficulty: 4,
    topicSlug: "factoring",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-51",
    question: "If 3x + 2y = 16 and x − y = 2, what is the value of x + y?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "5", "6", "7", "8"],
    answer: "C",
    solution:
      "From x − y = 2, x = y + 2. Substituting: 3(y+2) + 2y = 16, so 5y + 6 = 16, giving y = 2 and x = 4. Thus x + y = 6.",
    hints: [
      "Solve the simpler equation for x in terms of y.",
      "Substitute into the first equation and solve for y before computing x + y.",
    ],
    difficulty: 4,
    topicSlug: "systems-of-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-52",
    question:
      "Two angles are supplementary. One angle is 30° more than twice the other. What is the measure of the smaller angle?",
    format: "MULTIPLE_CHOICE",
    choices: ["50", "55", "60", "65", "70"],
    answer: "A",
    solution:
      "Let the smaller angle be x. The other angle is 2x + 30. Since they are supplementary, x + (2x + 30) = 180, so 3x = 150 and x = 50.",
    hints: [
      "Supplementary angles sum to 180°.",
      "Write the larger angle in terms of x and set up the sum equation.",
    ],
    difficulty: 4,
    topicSlug: "angles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-53",
    question:
      "A recipe requires flour, sugar, and butter in the ratio 5:2:3 by weight. If the baker uses 6 more cups of flour than butter, how many cups of sugar does he use?",
    format: "MULTIPLE_CHOICE",
    choices: ["6", "7", "8", "9", "10"],
    answer: "A",
    solution:
      "Let the amounts be 5k, 2k, 3k cups. Since flour exceeds butter by 6 cups, 5k − 3k = 6, so 2k = 6 and k = 3. The sugar amount is 2k = 6 cups.",
    hints: [
      "Write the three amounts as 5k, 2k, and 3k.",
      "Use the given difference between flour and butter to solve for k.",
    ],
    difficulty: 5,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-54",
    question:
      "In triangle ABC, angle A = 2x, angle B = 3x + 10, and angle C = 4x − 10 (all in degrees). What is the measure of angle C?",
    format: "MULTIPLE_CHOICE",
    choices: ["50", "55", "60", "65", "70"],
    answer: "E",
    solution:
      "The three angles sum to 180°: 2x + (3x+10) + (4x−10) = 180, so 9x = 180 and x = 20. Angle C = 4(20) − 10 = 70°.",
    hints: [
      "Add all three angle expressions and set the sum equal to 180°.",
      "Solve for x, then substitute into the expression for angle C.",
    ],
    difficulty: 5,
    topicSlug: "triangles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-55",
    question:
      "A parallelogram has diagonals of length 20 and 10, and one side has length 9. What is the length of the other side?",
    format: "MULTIPLE_CHOICE",
    choices: ["10", "11", "12", "13", "14"],
    answer: "D",
    solution:
      "By the parallelogram law, the sum of the squares of the diagonals equals twice the sum of the squares of the sides: 20² + 10² = 2(9² + b²). So 500 = 2(81 + b²), giving 250 = 81 + b², so b² = 169 and b = 13.",
    hints: [
      "Recall the parallelogram law relating the diagonals and the sides.",
      "Substitute the known diagonal lengths and one side, then solve for the other side.",
    ],
    difficulty: 5,
    topicSlug: "quadrilaterals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-56",
    question: "If 3^(2x−1) = 27^(x−2), what is the value of x?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "6", "7", "8", "9"],
    answer: "A",
    solution:
      "Since 27 = 3³, rewrite the right side as 3^(3x−6). Setting exponents equal (matching bases): 2x − 1 = 3x − 6, so x = 5.",
    hints: [
      "Rewrite 27 as a power of 3 so both sides share the same base.",
      "Once the bases match, set the exponents equal and solve.",
    ],
    difficulty: 5,
    topicSlug: "exponents-radicals",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-57",
    question:
      "The sum of a number and its square is 42. What is the largest possible value of the number?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "6", "7", "8", "9"],
    answer: "B",
    solution:
      "Let the number be x. Then x² + x = 42, so x² + x − 42 = 0, which factors as (x−6)(x+7) = 0. The solutions are x = 6 and x = −7, and the largest is 6.",
    hints: [
      "Translate the sentence into the equation x² + x = 42.",
      "Factor the resulting quadratic to find both possible values of x.",
    ],
    difficulty: 5,
    topicSlug: "quadratics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-58",
    question:
      "Two numbers have a sum of 25 and a product of 126. What is the positive difference between the two numbers?",
    format: "MULTIPLE_CHOICE",
    choices: ["11", "13", "15", "17", "19"],
    answer: "A",
    solution:
      "The two numbers are roots of t² − 25t + 126 = 0. The discriminant is 25² − 4(126) = 625 − 504 = 121, so √121 = 11. The roots are (25 ± 11)/2 = 18 and 7, and their difference is 11.",
    hints: [
      "Set up a quadratic whose roots are the two numbers, using the sum and product.",
      "Use the quadratic formula; the difference of the roots equals √(discriminant) divided by the leading coefficient.",
    ],
    difficulty: 5,
    topicSlug: "systems-of-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-59",
    question:
      "A code consists of 3 distinct letters chosen from {A, B, C, D, E, F}, followed by 2 distinct digits chosen from {1, 2, 3, 4, 5}. How many such codes are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["1800", "2000", "2200", "2400", "2600"],
    answer: "D",
    solution:
      "The three distinct letters can be arranged in 6 × 5 × 4 = 120 ways, and the two distinct digits in 5 × 4 = 20 ways. By the multiplication principle, the total number of codes is 120 × 20 = 2400.",
    hints: [
      "Count the ordered arrangements of letters and of digits separately.",
      "Multiply the two counts together.",
    ],
    difficulty: 5,
    topicSlug: "counting-principles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-60",
    question:
      "How many ways can 4 different books be arranged on a shelf so that two specific books are not adjacent to each other?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "14", "16", "18", "20"],
    answer: "A",
    solution:
      "There are 4! = 24 total arrangements. Treating the two specific books as a single glued block gives 3! × 2 = 12 arrangements where they are adjacent. So the number of arrangements where they are not adjacent is 24 − 12 = 12.",
    hints: [
      "First count all arrangements, then count the arrangements where the two books are adjacent by gluing them together.",
      "Subtract the adjacent count from the total.",
    ],
    difficulty: 5,
    topicSlug: "permutations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-61",
    question:
      "A standard six-sided die is rolled twice. What is the probability that the sum of the two rolls is 8?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/36", "1/6", "7/36", "2/9", "1/4"],
    answer: "A",
    solution:
      "The pairs (a,b) with a+b = 8 are (2,6), (3,5), (4,4), (5,3), (6,2) — five outcomes out of 36 total. The probability is 5/36.",
    hints: [
      "List the ordered pairs of die rolls that sum to 8.",
      "Divide the count of favorable outcomes by 36.",
    ],
    difficulty: 5,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-62",
    question: "A geometric sequence has first term 4 and common ratio 3. What is the sum of its first 5 terms?",
    format: "MULTIPLE_CHOICE",
    choices: ["400", "444", "464", "484", "500"],
    answer: "D",
    solution:
      "The terms are 4, 12, 36, 108, 324. Their sum is 4 + 12 + 36 + 108 + 324 = 484. (Alternatively, the sum formula gives 4(3⁵−1)/(3−1) = 4(242)/2 = 484.)",
    hints: [
      "List out the first five terms of the geometric sequence.",
      "Add them directly, or use the geometric series sum formula.",
    ],
    difficulty: 5,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-63",
    question:
      "A line has slope −3/4 and passes through the point (4, 1). What is the y-intercept of this line?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "5", "6", "7", "8"],
    answer: "A",
    solution:
      "Using point-slope form: y − 1 = −(3/4)(x − 4), so y = −(3/4)x + 3 + 1 = −(3/4)x + 4. The y-intercept is 4.",
    hints: [
      "Write the line's equation in point-slope form using the given slope and point.",
      "Set x = 0 to find the y-intercept.",
    ],
    difficulty: 5,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-64",
    question: "A circle is inscribed in a square with side length 10. What is the area of the circle?",
    format: "MULTIPLE_CHOICE",
    choices: ["25π", "30π", "35π", "40π", "50π"],
    answer: "A",
    solution:
      "The circle's diameter equals the square's side length, so the radius is 5. The area is π(5)² = 25π.",
    hints: [
      "The diameter of an inscribed circle equals the side length of the square.",
      "Use the area formula πr² with the radius you find.",
    ],
    difficulty: 5,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-65",
    question:
      "A price increases by 10%, and then the new price increases by another 10%. If the final price is $968, what was the original price?",
    format: "MULTIPLE_CHOICE",
    choices: ["$800", "$820", "$840", "$860", "$880"],
    answer: "A",
    solution:
      "Two successive 10% increases multiply the original price by 1.1 × 1.1 = 1.21. So the original price is 968/1.21 = $800.",
    hints: [
      "Successive percent increases multiply rather than add.",
      "Divide the final price by the combined growth factor 1.21.",
    ],
    difficulty: 5,
    topicSlug: "percentages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-66",
    question:
      "Working alone, Alice can paint a room in 6 hours, and Bob can paint the same room in 4 hours. If they work together, how many hours does it take them to paint the room?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "12/5", "5/2", "3", "10/3"],
    answer: "B",
    solution:
      "Alice's rate is 1/6 room per hour and Bob's is 1/4 room per hour. Together their rate is 1/6 + 1/4 = 2/12 + 3/12 = 5/12 room per hour. The time needed is 1 ÷ (5/12) = 12/5 hours.",
    hints: [
      "Add the individual rates (rooms per hour) to find the combined rate.",
      "Take the reciprocal of the combined rate to find the time.",
    ],
    difficulty: 5,
    topicSlug: "rates",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-67",
    question:
      "The average of six numbers is 20. The average of the first four of them is 18. What is the average of the last two numbers?",
    format: "MULTIPLE_CHOICE",
    choices: ["24", "25", "26", "27", "28"],
    answer: "A",
    solution:
      "The six numbers sum to 6 × 20 = 120. The first four sum to 4 × 18 = 72. The last two sum to 120 − 72 = 48, so their average is 48/2 = 24.",
    hints: [
      "Convert both averages into total sums.",
      "The sum of the last two numbers is the difference of the two totals.",
    ],
    difficulty: 5,
    topicSlug: "averages",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-68",
    question: "What is the sum of all positive divisors of 60?",
    format: "MULTIPLE_CHOICE",
    choices: ["168", "175", "182", "189", "196"],
    answer: "A",
    solution:
      "Since 60 = 2²·3·5, the sum of divisors is (1+2+4)(1+3)(1+5) = 7 × 4 × 6 = 168.",
    hints: [
      "Factor 60 into primes first.",
      "Use the divisor-sum formula: the product of (1 + p + p² + ...) over each prime power.",
    ],
    difficulty: 5,
    topicSlug: "number-properties",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-69",
    question: "What is the sum of all distinct prime factors of 630?",
    format: "MULTIPLE_CHOICE",
    choices: ["14", "17", "19", "21", "23"],
    answer: "B",
    solution:
      "Factoring, 630 = 2 × 3² × 5 × 7. The distinct prime factors are 2, 3, 5, and 7, which sum to 2+3+5+7 = 17.",
    hints: [
      "Find the complete prime factorization of 630.",
      "Add each distinct prime once, ignoring repeated factors.",
    ],
    difficulty: 5,
    topicSlug: "primes",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-70",
    question: "How many three-digit multiples of 7 are there?",
    format: "MULTIPLE_CHOICE",
    choices: ["120", "124", "126", "128", "130"],
    answer: "D",
    solution:
      "The smallest three-digit multiple of 7 is 105 = 7×15, and the largest is 994 = 7×142. The count is 142 − 15 + 1 = 128.",
    hints: [
      "Find the smallest and largest three-digit multiples of 7 by dividing 100 and 999 by 7.",
      "Count the integers between those two multipliers, inclusive.",
    ],
    difficulty: 5,
    topicSlug: "divisibility",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-71",
    question: "If x² − y² = 45 and x − y = 5, what is the value of x + y?",
    format: "MULTIPLE_CHOICE",
    choices: ["7", "9", "10", "11", "12"],
    answer: "B",
    solution: "Since x² − y² = (x−y)(x+y), we have 5(x+y) = 45, so x + y = 9.",
    hints: [
      "Factor x² − y² as a difference of squares.",
      "Divide both sides by the known value of x − y.",
    ],
    difficulty: 5,
    topicSlug: "factoring",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-72",
    question:
      "The sum of the interior angles of a convex polygon is 1440°. How many sides does the polygon have?",
    format: "MULTIPLE_CHOICE",
    choices: ["6", "7", "8", "9", "10"],
    answer: "E",
    solution: "Using (n−2)·180° = 1440°, we get n − 2 = 8, so n = 10.",
    hints: [
      "Recall that the interior angle sum of an n-gon is (n−2)×180°.",
      "Solve for n.",
    ],
    difficulty: 5,
    topicSlug: "polygons",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-73",
    question:
      "Two circles have radii 9 and 3, and the distance between their centers is 20. What is the length of their common internal tangent segment (the tangent line that crosses between the two circles)?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "14", "15", "16", "18"],
    answer: "D",
    solution:
      "The length of a common internal tangent between two circles with centers distance d apart and radii r1, r2 is √(d² − (r1+r2)²). Here that's √(20² − 12²) = √(400 − 144) = √256 = 16.",
    hints: [
      "Use the common internal tangent length formula, which involves the sum of the radii (not the difference).",
      "Compute d² − (r1+r2)² before taking the square root.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-74",
    question:
      "The measure of each interior angle of a regular polygon is 20° more than 3 times the measure of each exterior angle of the same polygon. How many sides does the polygon have?",
    format: "MULTIPLE_CHOICE",
    choices: ["6", "7", "8", "9", "10"],
    answer: "D",
    solution:
      "Let e be the exterior angle; the interior angle is 3e + 20. Since interior and exterior angles are supplementary, (3e+20) + e = 180, so 4e = 160 and e = 40. The number of sides is 360/e = 360/40 = 9.",
    hints: [
      "An interior angle and its corresponding exterior angle sum to 180°.",
      "Once you find the exterior angle, the number of sides is 360° divided by it.",
    ],
    difficulty: 6,
    topicSlug: "polygons",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-75",
    question: "Lines y = 2x − 3 and y = −x + 9 intersect at point P. What is the sum of the coordinates of P?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "6", "7", "8", "9"],
    answer: "E",
    solution:
      "Setting the expressions equal: 2x − 3 = −x + 9, so 3x = 12 and x = 4. Then y = 2(4) − 3 = 5. The sum of the coordinates is 4 + 5 = 9.",
    hints: [
      "Set the two expressions for y equal to each other and solve for x.",
      "Substitute back to find y, then add the two coordinates.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-76",
    question: "How many positive integers less than 300 are divisible by 9 but not by 15?",
    format: "MULTIPLE_CHOICE",
    choices: ["24", "25", "26", "27", "28"],
    answer: "D",
    solution:
      "The multiples of 9 below 300 number ⌊299/9⌋ = 33. Multiples of 9 that are also divisible by 15 are multiples of lcm(9,15) = 45, of which there are ⌊299/45⌋ = 6. So 33 − 6 = 27 multiples of 9 are not divisible by 15.",
    hints: [
      "Count multiples of 9 below 300 first.",
      "Subtract the multiples of lcm(9,15) = 45, which are divisible by both 9 and 15.",
    ],
    difficulty: 6,
    topicSlug: "divisibility",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-77",
    question: "What is the sum of all primes p less than 30 such that p + 4 and p + 6 are both also prime?",
    format: "MULTIPLE_CHOICE",
    choices: ["8", "12", "16", "18", "20"],
    answer: "E",
    solution:
      "Checking primes p < 30: p=7 gives 11 and 13, both prime. p=13 gives 17 and 19, both prime. No other prime below 30 works (for example, p=2 gives 6, not prime; p=3 gives 9, not prime; p=5 gives 9, not prime; p=11 gives 15, not prime; p=17 gives 21, not prime; p=19 gives 25, not prime; p=23 gives 27, not prime; p=29 gives 33, not prime). The sum is 7 + 13 = 20.",
    hints: [
      "Test each prime below 30 by checking whether both p+4 and p+6 are prime.",
      "Exactly two primes satisfy the condition — add them together.",
    ],
    difficulty: 6,
    topicSlug: "primes",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-78",
    question: "What is the remainder when 7^45 is divided by 11?",
    format: "MULTIPLE_CHOICE",
    choices: ["0", "1", "3", "7", "10"],
    answer: "E",
    solution:
      "By Fermat's little theorem, 7^10 ≡ 1 (mod 11), so the powers of 7 cycle with period dividing 10. Computing directly: 7¹≡7, 7²≡5, 7³≡2, 7⁴≡3, 7⁵≡10 (mod 11), and this cycle of length 10 repeats. Since 45 = 4(10) + 5, 7^45 ≡ 7^5 ≡ 10 (mod 11).",
    hints: [
      "Fermat's little theorem says 7^10 ≡ 1 (mod 11); reduce the exponent 45 modulo 10.",
      "Compute the powers of 7 mod 11 up to the reduced exponent.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-79",
    question: "How many distinct arrangements are there of the letters in the word BANANA?",
    format: "MULTIPLE_CHOICE",
    choices: ["30", "60", "90", "120", "150"],
    answer: "B",
    solution:
      "BANANA has 6 letters with A repeated 3 times and N repeated 2 times. The number of distinct arrangements is 6!/(3!·2!) = 720/12 = 60.",
    hints: [
      "Use the formula for permutations of a multiset: divide the factorial of the total count by the factorials of each repeated letter's count.",
      "B appears once, A appears 3 times, N appears 2 times.",
    ],
    difficulty: 6,
    topicSlug: "permutations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-80",
    question:
      "A committee of 4 people is chosen from 5 juniors and 4 seniors and must include at least 2 seniors. How many such committees are possible?",
    format: "MULTIPLE_CHOICE",
    choices: ["69", "72", "75", "78", "81"],
    answer: "E",
    solution:
      "Count by cases on the number of seniors: 2 seniors and 2 juniors gives C(4,2)·C(5,2) = 6×10 = 60; 3 seniors and 1 junior gives C(4,3)·C(5,1) = 4×5 = 20; 4 seniors and 0 juniors gives C(4,4)·C(5,0) = 1. The total is 60 + 20 + 1 = 81.",
    hints: [
      "Split into cases based on exactly how many seniors are on the committee.",
      "Use combinations for each case, then add the cases together.",
    ],
    difficulty: 6,
    topicSlug: "combinations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-81",
    question: "A fair coin is flipped 5 times. What is the probability of getting exactly 3 heads?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/32", "3/16", "1/4", "5/16", "15/32"],
    answer: "D",
    solution:
      "The number of ways to choose which 3 of the 5 flips are heads is C(5,3) = 10, out of 2⁵ = 32 equally likely outcomes. The probability is 10/32 = 5/16.",
    hints: [
      "Use combinations to count the number of ways to place 3 heads among 5 flips.",
      "Divide by the total number of possible outcomes, 2⁵.",
    ],
    difficulty: 6,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-82",
    question: "The roots of x² − 6x + c = 0 differ by 4. What is the value of c?",
    format: "MULTIPLE_CHOICE",
    choices: ["1", "2", "3", "4", "5"],
    answer: "E",
    solution:
      "Let the roots be r and r+4. Their sum is 2r + 4 = 6, so r = 1 and the other root is 5. Their product is c = 1×5 = 5.",
    hints: [
      "Write the two roots as r and r+4, then use the sum of roots (= 6) to solve for r.",
      "The product of the roots equals c.",
    ],
    difficulty: 6,
    topicSlug: "quadratics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-83",
    question:
      "Triangle ABC has base BC = 14 and area 84. Point D lies on BC with BD = 6. What is the area of triangle ABD?",
    format: "MULTIPLE_CHOICE",
    choices: ["12", "18", "24", "30", "36"],
    answer: "E",
    solution:
      "The height from A to BC satisfies (1/2)(14)(h) = 84, so h = 12. Triangle ABD has the same height h = 12 and base BD = 6, so its area is (1/2)(6)(12) = 36.",
    hints: [
      "Find the height from A to line BC using the area of the whole triangle.",
      "Triangles ABD and ABC share the same height — use that with base BD to find the smaller area.",
    ],
    difficulty: 6,
    topicSlug: "triangles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-84",
    question:
      "Two similar triangles have areas 50 and 128. If the smaller triangle's perimeter is 25, what is the perimeter of the larger triangle?",
    format: "MULTIPLE_CHOICE",
    choices: ["32", "35", "38", "40", "42"],
    answer: "D",
    solution:
      "The ratio of areas is 50/128 = 25/64, so the ratio of corresponding side lengths (and perimeters) is √(25/64) = 5/8. The larger triangle's perimeter is 25 × (8/5) = 40.",
    hints: [
      "The ratio of side lengths of similar figures is the square root of the ratio of their areas.",
      "Scale the smaller triangle's perimeter by the reciprocal of that side ratio.",
    ],
    difficulty: 6,
    topicSlug: "similarity-congruence",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-85",
    question:
      "A rectangular box has dimensions 4, 6, and x. If its total surface area is 208, what is the value of x?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "5", "6", "7", "8"],
    answer: "E",
    solution:
      "The surface area is 2(4·6 + 4x + 6x) = 2(24 + 10x) = 48 + 20x. Setting this equal to 208: 20x = 160, so x = 8.",
    hints: [
      "Write the surface area formula for a rectangular box with the given dimensions.",
      "Solve the resulting linear equation for x.",
    ],
    difficulty: 6,
    topicSlug: "area-volume",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-86",
    question: "A sequence satisfies a₁ = 2, a₂ = 5, and aₙ = a(n−1) + a(n−2) + 1 for n ≥ 3. What is a₅?",
    format: "MULTIPLE_CHOICE",
    choices: ["15", "17", "19", "21", "23"],
    answer: "E",
    solution: "a₃ = 5 + 2 + 1 = 8. a₄ = 8 + 5 + 1 = 14. a₅ = 14 + 8 + 1 = 23.",
    hints: [
      "Apply the recursive rule one step at a time, starting from a₁ and a₂.",
      "Each new term is the sum of the two previous terms, plus 1.",
    ],
    difficulty: 6,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-87",
    question: "If f(x) = 2x − 3 and g(x) = x² + 1, what is the value of f(g(3))?",
    format: "MULTIPLE_CHOICE",
    choices: ["13", "15", "17", "19", "21"],
    answer: "C",
    solution: "First, g(3) = 3² + 1 = 10. Then f(10) = 2(10) − 3 = 17.",
    hints: [
      "Evaluate the inner function g(3) first.",
      "Plug that result into f to get the final answer.",
    ],
    difficulty: 6,
    topicSlug: "functions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-88",
    question: "The ratio of a to b is 3:5, and the ratio of b to c is 10:7. What is the ratio of a to c?",
    format: "MULTIPLE_CHOICE",
    choices: ["3:7", "3:5", "5:7", "6:7", "6:5"],
    answer: "D",
    solution: "a/b = 3/5 and b/c = 10/7. Multiplying, a/c = (3/5)(10/7) = 30/35 = 6/7. So a:c = 6:7.",
    hints: [
      "Multiply the two given ratios (as fractions) to eliminate b.",
      "Simplify the resulting fraction to lowest terms.",
    ],
    difficulty: 6,
    topicSlug: "ratios-proportions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-89",
    question: "If x + y + z = 21, x − y = 2, and z − y = 4, what is the value of z?",
    format: "MULTIPLE_CHOICE",
    choices: ["6", "7", "8", "9", "10"],
    answer: "D",
    solution:
      "From the given equations, x = y + 2 and z = y + 4. Substituting into the first equation: (y+2) + y + (y+4) = 21, so 3y + 6 = 21, giving y = 5. Then z = y + 4 = 9.",
    hints: [
      "Express x and z in terms of y using the last two equations.",
      "Substitute both into the first equation and solve for y, then find z.",
    ],
    difficulty: 6,
    topicSlug: "systems-of-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-90",
    question:
      "A pizza shop offers 5 toppings, and each topping is either included or not (no topping is used twice). How many different pizzas can be made using at least 1 but at most 3 toppings?",
    format: "MULTIPLE_CHOICE",
    choices: ["20", "22", "25", "28", "31"],
    answer: "C",
    solution:
      "The number of pizzas with exactly k toppings is C(5,k). Summing for k = 1, 2, 3: C(5,1) + C(5,2) + C(5,3) = 5 + 10 + 10 = 25.",
    hints: [
      "Break the count into cases based on the exact number of toppings used.",
      "Add the combinations C(5,1), C(5,2), and C(5,3).",
    ],
    difficulty: 6,
    topicSlug: "counting-principles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-91",
    question:
      "In a class of 40 students, 22 take Spanish, 18 take French, and 8 take both languages. How many students take neither language?",
    format: "MULTIPLE_CHOICE",
    choices: ["6", "7", "8", "9", "10"],
    answer: "C",
    solution:
      "By inclusion-exclusion, the number taking at least one language is 22 + 18 − 8 = 32. The number taking neither is 40 − 32 = 8.",
    hints: [
      "Use inclusion-exclusion to find how many students take at least one of the two languages.",
      "Subtract that count from the total class size.",
    ],
    difficulty: 6,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-92",
    question: "A cube has a total surface area of 150. What is its volume?",
    format: "MULTIPLE_CHOICE",
    choices: ["100", "110", "120", "125", "130"],
    answer: "D",
    solution:
      "The surface area of a cube with side s is 6s². Setting 6s² = 150 gives s² = 25, so s = 5. The volume is s³ = 125.",
    hints: [
      "Use the surface area formula to find the side length of the cube.",
      "Cube the side length to find the volume.",
    ],
    difficulty: 6,
    topicSlug: "three-d-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-93",
    question:
      "Two fair six-sided dice are rolled. What is the probability that the sum of the two numbers rolled is a multiple of 3?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/4", "7/24", "1/3", "3/8", "5/12"],
    answer: "C",
    solution:
      "The possible sums that are multiples of 3 are 3, 6, 9, and 12. Counting ordered pairs: sum 3 has 2 ways, sum 6 has 5 ways, sum 9 has 4 ways, and sum 12 has 1 way, totaling 12 ways out of 36. The probability is 12/36 = 1/3.",
    hints: [
      "List the sums between 2 and 12 that are multiples of 3.",
      "Count the ordered pairs of dice giving each of those sums, then divide by 36.",
    ],
    difficulty: 7,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-94",
    question:
      "If a and b are the roots of x² − 9x + 20 = 0 with a > b, what is the value of a² − b²?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "7", "9", "11", "13"],
    answer: "C",
    solution:
      "Factoring, x² − 9x + 20 = (x−4)(x−5) = 0, so the roots are 5 and 4, with a = 5 and b = 4. Then a² − b² = (a−b)(a+b) = (1)(9) = 9.",
    hints: [
      "Factor the quadratic to find the two roots directly.",
      "Use the identity a² − b² = (a−b)(a+b) rather than squaring each root separately.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-95",
    question: "A sequence is defined by b₁ = 1 and b(n+1) = bₙ + 2n for n ≥ 1. What is b₁₀?",
    format: "MULTIPLE_CHOICE",
    choices: ["81", "85", "89", "91", "95"],
    answer: "D",
    solution:
      "Computing term by term: b₁=1, b₂=3, b₃=7, b₄=13, b₅=21, b₆=31, b₇=43, b₈=57, b₉=73, b₁₀=91. (In closed form, bₙ = 1 + n(n−1), and 1 + 10·9 = 91.)",
    hints: [
      "Apply the recursive rule step by step, adding 2n each time to get the next term.",
      "Alternatively, notice bₙ = 1 + n(n−1) and substitute n = 10 directly.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-96",
    question:
      "In triangle ABC, points D and E lie on sides AB and AC respectively, with AD/AB = 2/3 and AE/AC = 3/4. What is the ratio of the area of triangle ADE to the area of triangle ABC?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/3", "5/12", "1/2", "7/12", "2/3"],
    answer: "C",
    solution:
      "Triangles ADE and ABC share angle A, so [ADE]/[ABC] = (AD/AB)(AE/AC) = (2/3)(3/4) = 1/2.",
    hints: [
      "When two triangles share an angle, the ratio of their areas equals the product of the ratios of the sides forming that angle.",
      "Multiply AD/AB by AE/AC.",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-97",
    question: "A cone has height 12 and base radius 5. What is its volume, in terms of π?",
    format: "MULTIPLE_CHOICE",
    choices: ["60π", "80π", "100π", "120π", "150π"],
    answer: "C",
    solution: "The volume of a cone is (1/3)πr²h = (1/3)π(5²)(12) = (1/3)π(25)(12) = 100π.",
    hints: [
      "Use the cone volume formula (1/3)πr²h.",
      "Substitute r = 5 and h = 12 and simplify.",
    ],
    difficulty: 7,
    topicSlug: "area-volume",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-98",
    question: "How many integers n satisfy 2n² − 9n − 18 < 0?",
    format: "MULTIPLE_CHOICE",
    choices: ["5", "6", "7", "8", "9"],
    answer: "C",
    solution:
      "The roots of 2n² − 9n − 18 = 0 are found from the discriminant 81 + 144 = 225, so n = (9 ± 15)/4, giving n = 6 or n = −3/2. The quadratic (opening upward) is negative strictly between its roots, so −3/2 < n < 6. The integers in this range are −1, 0, 1, 2, 3, 4, 5 — seven integers.",
    hints: [
      "Find the roots of the corresponding equation using the quadratic formula.",
      "Since the parabola opens upward, the expression is negative strictly between its two roots.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-99",
    question: "How many ordered pairs of positive integers (x, y) satisfy 7x + 4y = 100?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "3", "4", "5", "6"],
    answer: "B",
    solution:
      "Solving for y: y = (100 − 7x)/4, which must be a positive integer. This requires 100 − 7x to be a positive multiple of 4, which happens exactly when x is a multiple of 4. Testing x = 4, 8, 12 gives y = 18, 11, 4 respectively (all positive); x = 16 gives a negative y. So there are 3 valid pairs.",
    hints: [
      "Solve for y in terms of x and determine which values of x make y a positive integer.",
      "Check the divisibility condition on x, then find the valid range.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-100",
    question: "What is the units digit of 7^2023?",
    format: "MULTIPLE_CHOICE",
    choices: ["0", "1", "3", "7", "9"],
    answer: "C",
    solution:
      "The units digits of powers of 7 cycle with period 4: 7, 9, 3, 1, repeating. Since 2023 = 4(505) + 3, the units digit matches the 3rd term of the cycle, which is 3.",
    hints: [
      "Find the repeating cycle of units digits for powers of 7.",
      "Reduce the exponent 2023 modulo the cycle length (4).",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-101",
    question: "How many 4-digit numbers (from 1000 to 9999) have all distinct digits and are even?",
    format: "MULTIPLE_CHOICE",
    choices: ["2240", "2260", "2280", "2296", "2320"],
    answer: "D",
    solution:
      "Case 1: the units digit is 0. The remaining three digits (thousands, hundreds, tens) are chosen from the other 9 digits with no repeats, and the thousands digit is automatically nonzero: 9×8×7 = 504. Case 2: the units digit is 2, 4, 6, or 8 (4 choices). The thousands digit then has 8 choices (excluding 0 and the units digit), the hundreds digit has 8 remaining choices, and the tens digit has 7 remaining choices, giving 8×8×7 = 448 per units digit, or 4×448 = 1792 total. Adding both cases: 504 + 1792 = 2296.",
    hints: [
      "Split into cases based on whether the last digit is 0 or one of {2,4,6,8}.",
      "In the second case, remember the first digit can't be 0 or match the last digit.",
    ],
    difficulty: 7,
    topicSlug: "casework",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-102",
    question: "A fair six-sided die is rolled repeatedly until a 6 appears. What is the expected number of rolls needed?",
    format: "MULTIPLE_CHOICE",
    choices: ["4", "5", "6", "7", "8"],
    answer: "C",
    solution:
      "The number of rolls follows a geometric distribution with success probability p = 1/6. The expected number of trials until the first success is 1/p = 6.",
    hints: [
      "This is a geometric distribution: rolls repeat until the first success.",
      "The expected number of trials for a geometric distribution is 1 divided by the success probability.",
    ],
    difficulty: 7,
    topicSlug: "expected-value",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-103",
    question: "Let f(x) = x² − 2x. For how many real values of x does f(f(x)) = 0?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "3", "4", "5", "6"],
    answer: "C",
    solution:
      "f(y) = 0 when y(y−2) = 0, i.e. y = 0 or y = 2. So f(f(x)) = 0 exactly when f(x) = 0 or f(x) = 2. Solving f(x) = 0: x² − 2x = 0 gives x = 0 or x = 2 (2 solutions). Solving f(x) = 2: x² − 2x − 2 = 0 has discriminant 4 + 8 = 12 > 0, giving 2 more real solutions (1 ± √3), which are distinct from 0 and 2. In total there are 4 real solutions.",
    hints: [
      "First find the values y for which f(y) = 0.",
      "For each such y, solve f(x) = y separately, and check whether the solution sets overlap.",
    ],
    difficulty: 7,
    topicSlug: "functions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-104",
    question:
      "Two positive integers have a sum of 42 and a least common multiple of 72. What is their greatest common divisor?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "3", "4", "6", "9"],
    answer: "D",
    solution:
      "Let the gcd be g, so the numbers are gm and gn with gcd(m,n) = 1. Then g(m+n) = 42 and g·m·n = 72. Testing g = 6: m+n = 7 and mn = 12, giving m = 3, n = 4 (since 3+4=7, 3×4=12), which are coprime — consistent. This corresponds to the numbers 18 and 24, which indeed sum to 42 and have lcm(18,24) = 72. So the greatest common divisor is 6.",
    hints: [
      "Write the numbers as gm and gn where g is the gcd and m, n are coprime.",
      "Use g(m+n) = 42 and g·m·n = 72 together to find g.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-105",
    question:
      "If x³ − 6x² + 11x − 6 = (x−a)(x−b)(x−c) for real numbers a, b, c, what is a + b + c?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "5", "6", "7"],
    answer: "D",
    solution:
      "By Vieta's formulas, the sum of the roots of x³ − 6x² + 11x − 6 = 0 equals the negative of the x² coefficient, which is 6. (Indeed, the polynomial factors as (x−1)(x−2)(x−3), confirming a+b+c = 1+2+3 = 6.)",
    hints: [
      "Use Vieta's formulas: the sum of the roots equals the negative of the coefficient of x², since the leading coefficient is 1.",
      "You can also try to factor the cubic directly by testing small integer roots.",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-106",
    question: "A circle has equation x² + y² − 6x + 4y − 12 = 0. What is the radius of the circle?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "5", "6", "7"],
    answer: "C",
    solution:
      "Completing the square: (x² − 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4, so (x−3)² + (y+2)² = 25. This is a circle of radius √25 = 5.",
    hints: [
      "Complete the square separately in x and in y.",
      "Once in standard form (x−h)² + (y−k)² = r², the radius is the square root of the right side.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-107",
    question:
      "A box contains 3 red balls and 5 blue balls. Two balls are drawn without replacement. Given that the first ball drawn is red, what is the probability that the second ball drawn is also red?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/4", "2/7", "3/8", "1/3", "3/7"],
    answer: "B",
    solution:
      "After removing one red ball, 2 red and 5 blue balls remain, for 7 balls total. The probability the second ball is red is 2/7.",
    hints: [
      "Update the counts of red and total balls after the first (red) ball is removed.",
      "Divide the remaining red count by the remaining total.",
    ],
    difficulty: 7,
    topicSlug: "conditional-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-108",
    question:
      "How many ways can 8 identical candies be distributed among 3 children so that each child receives at least 1 candy?",
    format: "MULTIPLE_CHOICE",
    choices: ["15", "18", "21", "24", "27"],
    answer: "C",
    solution:
      "By stars and bars, first give each child 1 candy, leaving 5 candies to distribute freely among 3 children: this is C(5+3−1, 3−1) = C(7,2) = 21.",
    hints: [
      "Give each child one candy first to satisfy the 'at least 1' condition.",
      "Distribute the remaining candies freely using stars and bars: C(n+k−1, k−1).",
    ],
    difficulty: 7,
    topicSlug: "combinatorics",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-109",
    question:
      "What is the minimum number of people needed in a room to guarantee that at least 4 people share the same birth month?",
    format: "MULTIPLE_CHOICE",
    choices: ["25", "30", "33", "36", "37"],
    answer: "E",
    solution:
      "In the worst case, each of the 12 months could have exactly 3 people without any month reaching 4, using 12 × 3 = 36 people. One more person, 37 total, forces some month to have at least 4 people.",
    hints: [
      "Consider the worst case where every month has as many people as possible without reaching 4.",
      "Add one more person to that worst-case total to force the fourth match.",
    ],
    difficulty: 7,
    topicSlug: "pigeonhole",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-110",
    question:
      "Of five friends A, B, C, D, and E, exactly one always tells the truth and the other four always lie. A says, 'B is the truth-teller.' B says, 'C is the truth-teller.' C says, 'D is the truth-teller.' D says, 'I am the truth-teller.' E says nothing. Who is the truth-teller?",
    format: "MULTIPLE_CHOICE",
    choices: ["A", "B", "C", "D", "E"],
    answer: "E",
    solution:
      "If A were the truth-teller, A's true statement would make B the truth-teller too — a contradiction, since only one person is truthful. So A lies, meaning B is not the truth-teller (since A's false statement claims B is). Since B is a liar, B's statement 'C is the truth-teller' is false, so C is not the truth-teller. Since C is a liar, C's statement 'D is the truth-teller' is false, so D is not the truth-teller — which is consistent with D's own statement being a lie. With A, B, C, and D all ruled out as liars, E must be the truth-teller.",
    hints: [
      "Test each person as the truth-teller and look for a contradiction in the chain of statements.",
      "Once A, B, C, and D are all shown to be liars, the truth-teller must be E by elimination.",
    ],
    difficulty: 7,
    topicSlug: "deduction",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-111",
    question:
      "A standard 52-card deck is shuffled, and 2 cards are drawn without replacement. What is the probability that both cards are aces?",
    format: "MULTIPLE_CHOICE",
    choices: ["1/221", "1/169", "4/221", "1/52", "1/13"],
    answer: "A",
    solution:
      "The probability the first card is an ace is 4/52, and given that, the probability the second is also an ace is 3/51. Multiplying, (4/52)(3/51) = 12/2652 = 1/221.",
    hints: [
      "Multiply the probability the first card is an ace by the (conditional) probability the second card is also an ace.",
      "Simplify the resulting fraction fully.",
    ],
    difficulty: 7,
    topicSlug: "basic-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-112",
    question:
      "Points A(0,0), B(6,0), and C(6,8) form a right triangle. What is the length of the median from A to the midpoint of BC?",
    format: "MULTIPLE_CHOICE",
    choices: ["2√10", "2√11", "2√12", "2√13", "2√14"],
    answer: "D",
    solution:
      "The midpoint of BC is ((6+6)/2, (0+8)/2) = (6, 4). The distance from A(0,0) to (6,4) is √(6² + 4²) = √52 = 2√13.",
    hints: [
      "Find the midpoint of segment BC first.",
      "Apply the distance formula between A and that midpoint.",
    ],
    difficulty: 7,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-113",
    question:
      "Three fair six-sided dice are rolled. What is the probability that at least one pair among the three dice shows values that differ by exactly 1?",
    format: "MULTIPLE_CHOICE",
    choices: ["5/12", "7/12", "1/2", "2/3", "11/18"],
    answer: "B",
    solution:
      "Complementary counting is cleaner: count the ordered triples in which no two of the three values differ by exactly 1. Work with the underlying multiset of values first. If all three values are equal (6 multisets), no two differ by 1, giving 6 ordered triples. If exactly two are equal, say value a twice and b once with b ≠ a, we need |a − b| ≠ 1; for each a there are 6 − 1 (itself) − (number of neighbors of a) choices of b, which is 4 when a ∈ {1,6} and 3 otherwise, for 2(4) + 4(3) = 20 multisets, each giving 3 ordered triples, so 60. If all three are distinct, we need a 3-element subset of {1,…,6} with no two elements consecutive; the standard gap count gives C(6 − 3 + 1, 3) = C(4,3) = 4 such subsets, each giving 3! = 6 ordered triples, so 24. The total with no pair differing by 1 is 6 + 60 + 24 = 90, so the count with at least one such pair is 216 − 90 = 126, and the probability is 126/216 = 7/12.",
    hints: [
      "Counting the arrangements that avoid the condition entirely is far easier than counting the ones that satisfy it.",
      "Split the 'no two differ by 1' count by how many of the three dice are equal: all three equal, exactly two equal, or all distinct.",
      "For the all-distinct case you are choosing a 3-element subset of {1,…,6} containing no two consecutive integers — there are C(4,3) = 4 of them.",
    ],
    difficulty: 8,
    topicSlug: "counting-probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-114",
    question:
      "Two circles of radii 1 and 4 are externally tangent to each other, and both are tangent to the same line ℓ, on the same side of ℓ. A third circle lies in the region bounded by ℓ and the two given circles, tangent to ℓ and externally tangent to both circles. What is the radius of the third circle?",
    format: "MULTIPLE_CHOICE",
    choices: ["2/3", "4/9", "1/2", "4/5", "2/5"],
    answer: "B",
    solution:
      "First establish the key lemma. If two circles of radii r and R are externally tangent to each other and both tangent to a common line, the distance between their points of tangency with that line is 2√(rR): dropping a horizontal segment between the centers gives a right triangle with hypotenuse r + R (the distance between centers) and vertical leg |R − r|, so the horizontal leg is √((R+r)² − (R−r)²) = 2√(rR). Now let the small circle have radius r and place the three tangency points on ℓ. The tangency point of the new circle lies between the other two, so the two short distances add to the long one: 2√(1·r) + 2√(4·r) = 2√(1·4). That gives 2√r + 4√r = 4, so 6√r = 4, √r = 2/3, and r = 4/9. (Equivalently, 1/√r = 1/√1 + 1/√4.)",
    hints: [
      "Everything happens along ℓ — work with the three points where the circles touch ℓ rather than with the centers directly.",
      "For two mutually tangent circles that both touch a line, find the distance between their two tangency points on that line by building a right triangle from the two centers.",
      "The three tangency points are collinear, so the two smaller gaps sum to the largest; this is the tangent-line case of Descartes' circle relation, 1/√r = 1/√r₁ + 1/√r₂.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-115",
    question:
      "Let f(x) = x² − 4x + 1. What is the sum of all real numbers x that satisfy f(f(x)) = x but do not satisfy f(x) = x?",
    format: "MULTIPLE_CHOICE",
    choices: ["8", "5", "3", "−2", "2"],
    answer: "C",
    solution:
      "Any solution of f(x) = x is automatically a solution of f(f(x)) = x, so the polynomial f(x) − x must divide f(f(x)) − x. Here f(x) − x = x² − 5x + 1. Expanding, f(f(x)) − x = (x² − 4x + 1)² − 4(x² − 4x + 1) + 1 − x, a quartic with leading coefficient 1, and dividing by x² − 5x + 1 gives the factorization f(f(x)) − x = (x² − 5x + 1)(x² − 3x − 2). The solutions we want are the roots of the second factor. Its discriminant is 9 + 8 = 17 > 0, so both of its roots are real, and neither is a root of x² − 5x + 1 (the factors share no root since 17 ≠ 21). By Vieta's formulas the sum of the roots of x² − 3x − 2 is 3.",
    hints: [
      "Every fixed point of f is also a fixed point of f∘f — what does that tell you about how the quartic f(f(x)) − x factors?",
      "Divide f(f(x)) − x by f(x) − x = x² − 5x + 1; the quotient is another monic quadratic.",
      "Check the quotient's discriminant to confirm both of its roots are real, then read off the sum of its roots from its coefficients.",
    ],
    difficulty: 8,
    topicSlug: "functions",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-116",
    question:
      "What is the smallest positive integer n such that n! is divisible by 2025⁵?",
    format: "MULTIPLE_CHOICE",
    choices: ["40", "45", "30", "50", "25"],
    answer: "B",
    solution:
      "First factor: 2025 = 81 · 25 = 3⁴ · 5², so 2025⁵ = 3²⁰ · 5¹⁰. We need the exponent of 3 in n! to be at least 20 and the exponent of 5 to be at least 10; the exponent of a prime p in n! is ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + ⋯ (Legendre's formula). The 5 condition is the binding one. For n = 44 the exponent of 5 is ⌊44/5⌋ + ⌊44/25⌋ = 8 + 1 = 9, which is too small; for n = 45 it is ⌊45/5⌋ + ⌊45/25⌋ = 9 + 1 = 10, which is exactly enough. Since the exponent is nondecreasing in n, we need n ≥ 45. We must still confirm the 3 condition holds there: for n = 45 the exponent of 3 is ⌊45/3⌋ + ⌊45/9⌋ + ⌊45/27⌋ = 15 + 5 + 1 = 21 ≥ 20. Both conditions hold at n = 45, so the answer is 45. (Note n = 40 fails: its exponent of 5 is only 8 + 1 = 9.)",
    hints: [
      "Factor 2025 into primes before doing anything else, then raise that factorization to the fifth power.",
      "Count how many times each prime divides n! by summing ⌊n/p⌋ + ⌊n/p²⌋ + ⋯ — do this for both primes, since only one of the two conditions will actually be binding.",
      "The jump past the needed power of 5 happens at a multiple of 5; find the first n that clears it, then verify the power of 3 is already large enough there.",
    ],
    difficulty: 8,
    topicSlug: "divisibility",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-117",
    question:
      "Let P = (4, 1). Point A lies somewhere on the x-axis and point B lies somewhere on the line y = x. What is the smallest possible value of PA + AB + BP?",
    format: "MULTIPLE_CHOICE",
    choices: ["√17", "√34", "2√17", "√29", "6"],
    answer: "B",
    solution:
      "Reflect P across each of the two lines. Reflecting across the x-axis gives P₁ = (4, −1); reflecting across y = x gives P₂ = (1, 4). For any choice of A on the x-axis, PA = P₁A, and for any B on y = x, BP = BP₂. So the perimeter equals P₁A + AB + BP₂, which is the length of a path from P₁ to P₂ through A and then B, and is therefore at least the straight-line distance P₁P₂. That distance is √((4−1)² + (−1−4)²) = √(9 + 25) = √34. The bound is attained: since P = (4,1) lies strictly inside the 45° wedge between the two lines (0 < 1 < 4), the segment P₁P₂ really does cross the x-axis and then y = x, at A = (3.4, 0) and B = (2.125, 2.125). So the minimum is √34. (A slicker check: the two reflections turn the 45° angle at the origin into a 90° angle, so P₁OP₂ is right-angled with legs OP₁ = OP₂ = √17, giving P₁P₂ = √2 · √17 = √34.)",
    hints: [
      "A path that must touch a line is shortest when you unfold it — replace a leg of the path by its mirror image.",
      "Reflect P across the x-axis and, separately, across the line y = x; the perimeter becomes the length of a path joining the two images.",
      "The minimum is the straight-line distance between the two reflected points — but confirm that segment actually meets both lines in the right order, which it does because P sits inside the wedge.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-118",
    question:
      "A frog starts at 0 on the number line. Each second it jumps forward 1 unit or forward 2 units, each with probability 1/2, independently of all previous jumps. What is the probability that the frog ever lands exactly on 10?",
    format: "MULTIPLE_CHOICE",
    choices: ["2/3", "341/512", "683/1024", "1023/1024", "341/1024"],
    answer: "C",
    solution:
      "Let pₙ be the probability the frog ever lands on n. The frog reaches n only by arriving from n − 1 (then jumping 1) or from n − 2 (then jumping 2), and these two events are disjoint given where the last jump started, so pₙ = (1/2)pₙ₋₁ + (1/2)pₙ₋₂ with p₀ = 1 and p₁ = 1/2. The characteristic equation 2x² − x − 1 = 0 factors as (2x + 1)(x − 1) = 0, with roots 1 and −1/2, so pₙ = A + B(−1/2)ⁿ. From p₀ = 1 and p₁ = 1/2 we get A + B = 1 and A − B/2 = 1/2, so A = 2/3 and B = 1/3, giving pₙ = 2/3 + (1/3)(−1/2)ⁿ. Then p₁₀ = 2/3 + (1/3)(1/1024) = (2048 + 1)/3072 = 2049/3072 = 683/1024. (Choice A is the limiting value as n → ∞, and 341/512 is p₉.)",
    hints: [
      "Condition on the frog's last jump before it would reach 10 — there are only two ways to arrive at any given point.",
      "This gives a two-term recurrence pₙ = (1/2)pₙ₋₁ + (1/2)pₙ₋₂ with p₀ = 1 and p₁ = 1/2.",
      "Solve the recurrence in closed form: the characteristic roots are 1 and −1/2, so pₙ = 2/3 + (1/3)(−1/2)ⁿ.",
    ],
    difficulty: 8,
    topicSlug: "probability",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-119",
    question:
      "A sequence of positive integers satisfies aₙ₊₂ = aₙ₊₁ + aₙ for all n ≥ 1. Given that a₇ = 200, how many possible values are there for a₁?",
    format: "MULTIPLE_CHOICE",
    choices: ["3", "4", "5", "6", "2"],
    answer: "B",
    solution:
      "Write everything in terms of a₁ and a₂: the terms are a₁, a₂, a₁ + a₂, a₁ + 2a₂, 2a₁ + 3a₂, 3a₁ + 5a₂, 5a₁ + 8a₂. So 5a₁ + 8a₂ = 200. Reducing mod 8 gives 5a₁ ≡ 0 (mod 8), and since gcd(5,8) = 1 this forces 8 | a₁. Writing a₁ = 8k gives 40k + 8a₂ = 200, so 5k + a₂ = 25 and a₂ = 25 − 5k. Both terms must be positive integers, so k ≥ 1 and 25 − 5k ≥ 1, i.e. k ≤ 4 (k = 5 would give a₂ = 0, which is not a positive integer). That yields k = 1, 2, 3, 4, i.e. (a₁, a₂) = (8, 20), (16, 15), (24, 10), (32, 5) — 4 possible values of a₁. Every such pair does produce a valid all-positive sequence, since all terms are positive sums. The answer is 4. (Choice C counts the degenerate a₂ = 0 case.)",
    hints: [
      "Express a₇ in terms of a₁ and a₂ alone by expanding the recurrence forward.",
      "You get 5a₁ + 8a₂ = 200 — a linear Diophantine equation; reduce mod 8 to see what a₁ must be a multiple of.",
      "Enumerate the solutions, and be strict about 'positive integers' — a term equal to 0 does not count.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-120",
    question:
      "In triangle ABC, AB = 10, BC = 12, and CA = 14. The segment from A that splits angle A into two equal angles meets BC at D, and the perpendicular dropped from A to line BC meets BC at E. What is DE?",
    format: "MULTIPLE_CHOICE",
    choices: ["2", "3", "5", "7/2", "4"],
    answer: "B",
    solution:
      "Put B at 0 and C at 12 on a number line along BC, and locate both points on it. For D, the angle bisector from A divides BC in the ratio of the adjacent sides: BD/DC = AB/AC = 10/14 = 5/7, so BD = 12 · 5/12 = 5. For E, use the Pythagorean theorem twice with AE as the common leg: AB² − BE² = AE² = AC² − EC², and with EC = 12 − BE this gives 100 − BE² = 196 − (12 − BE)², so 100 − BE² = 196 − 144 + 24BE − BE², hence 100 = 52 + 24BE and BE = 2. (Equivalently BE = (AB² + BC² − AC²)/(2·BC) = (100 + 144 − 196)/24 = 2.) Both D and E lie between B and C, so DE = |BD − BE| = |5 − 2| = 3.",
    hints: [
      "Set up a single coordinate along BC and find the position of each of the two points on it separately.",
      "The bisector from A cuts BC into pieces proportional to the two adjacent sides — that locates D.",
      "For the foot of the perpendicular, write AE² two ways using the two right triangles it creates, then subtract to eliminate AE.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-121",
    question:
      "How many permutations (a₁, a₂, …, a₆) of the numbers 1, 2, 3, 4, 5, 6 satisfy both aᵢ ≠ i for all i from 1 to 6 and aᵢ ≠ i + 1 for all i from 1 to 5?",
    format: "MULTIPLE_CHOICE",
    choices: ["265", "96", "144", "120", "84"],
    answer: "B",
    solution:
      "Think of it as placing 6 non-attacking rooks on a 6×6 board where the cell in row i and column j is forbidden when j = i or j = i + 1. The forbidden cells form a single 'staircase' of 11 cells: (1,1),(1,2),(2,2),(2,3),(3,3),(3,4),(4,4),(4,5),(5,5),(5,6),(6,6). Apply inclusion–exclusion on the number of chosen forbidden cells. Because the staircase is a path, the number of ways rₖ to choose k of these 11 cells with no two in the same row or column is the number of ways to choose k non-adjacent cells from a path of 11, namely C(12 − k, k). The count is Σₖ (−1)ᵏ rₖ (6 − k)! = Σₖ (−1)ᵏ C(12 − k, k)(6 − k)!. The individual terms rₖ(6 − k)! for k = 0,…,6 are 1·720 = 720, 11·120 = 1320, 45·24 = 1080, 84·6 = 504, 70·2 = 140, 21·1 = 21, and 1·1 = 1. With alternating signs, 720 − 1320 + 1080 − 504 + 140 − 21 + 1 = 96. A direct computer enumeration of all 720 permutations confirms 96. (Choice A, 265, is the count of derangements of 6 — the answer if you forget the second restriction.)",
    hints: [
      "Each index i has exactly two forbidden values, so this is a rook-placement problem on a board with a staircase of forbidden cells.",
      "Use inclusion–exclusion over the number of forbidden cells you force to be used; you need the number of ways to pick k forbidden cells no two sharing a row or column.",
      "The forbidden cells form a path, so picking k of them with no two in a shared row or column is the same as picking k non-adjacent cells from a row of 11, giving C(12 − k, k).",
    ],
    difficulty: 8,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-122",
    question: "What is the remainder when 7^(7^7) is divided by 100?",
    format: "MULTIPLE_CHOICE",
    choices: ["7", "49", "43", "1", "93"],
    answer: "C",
    solution:
      "Work out how the powers of 7 behave mod 100: 7¹ = 7, 7² = 49, 7³ = 343 ≡ 43, 7⁴ ≡ 43 · 7 = 301 ≡ 1. So the powers of 7 cycle mod 100 with period 4, and 7ᴺ mod 100 depends only on N mod 4. The second step is to reduce the tower's exponent: N = 7⁷, and 7 ≡ −1 (mod 4), so 7⁷ ≡ (−1)⁷ = −1 ≡ 3 (mod 4). Therefore 7^(7⁷) ≡ 7³ ≡ 43 (mod 100). (Choice A is what you get from the error of reducing the exponent mod 4 to 1 instead of 3; choice D comes from reducing it to 0.)",
    hints: [
      "Compute 7, 7², 7³, 7⁴ modulo 100 and look for when the powers start repeating.",
      "Once you know the cycle length, the only thing that matters about the huge exponent 7⁷ is its remainder upon division by that cycle length.",
      "Reduce 7⁷ modulo 4 using 7 ≡ −1 (mod 4) — no need to compute 7⁷ = 823543 itself.",
    ],
    difficulty: 8,
    topicSlug: "modular-arithmetic",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-123",
    question:
      "A three-digit positive integer is chosen at random, with all 900 of them equally likely. What is the probability that its digits, read from left to right, are either strictly increasing or strictly decreasing?",
    format: "MULTIPLE_CHOICE",
    choices: ["7/75", "17/75", "2/15", "17/150", "4/25"],
    answer: "B",
    solution:
      "Count the two kinds separately. If the digits strictly increase, none of them can be 0 (a 0 could only come first, and the leading digit is nonzero anyway, so 0 cannot appear at all), and any three distinct digits from 1 through 9 can be written in increasing order in exactly one way. That gives C(9, 3) = 84 numbers. If the digits strictly decrease, 0 is allowed — it can only land in the units place, and the leading digit is then automatically nonzero — so any three distinct digits from 0 through 9 arrange in decreasing order in exactly one way, giving C(10, 3) = 120 numbers. The two cases cannot overlap, since a strictly increasing triple of digits is never strictly decreasing. So 84 + 120 = 204 of the 900 three-digit numbers qualify, and the probability is 204/900 = 17/75.",
    hints: [
      "For each kind of number, notice that a set of three distinct digits determines the number completely — the order is forced.",
      "Decide separately whether the digit 0 is available in each case, thinking about where a 0 could possibly sit.",
      "Add the two counts (they cannot overlap) and divide by 900, then reduce the fraction.",
    ],
    difficulty: 7,
    topicSlug: "counting-principles",
    competitionSlug: "amc10",
  },
  {
    slug: "amc10-124",
    question:
      "Each of the nine unit squares of a 3×3 grid is colored red or blue. How many of the 512 colorings contain no 2×2 block of four squares that are all the same color?",
    format: "MULTIPLE_CHOICE",
    choices: ["417", "336", "322", "320", "256"],
    answer: "C",
    solution:
      "There are four 2×2 blocks (upper-left, upper-right, lower-left, lower-right). For each block B, let A_B be the set of colorings in which B is monochromatic; |A_B| = 2 (the block's color) × 2⁵ (the other five cells) = 64. Use inclusion–exclusion. Singles: 4 · 64 = 256. Pairs: two blocks overlap either in two cells (horizontally or vertically adjacent blocks, 4 such pairs) or in one cell (the two diagonal pairs, 2 such pairs). If both blocks are monochromatic and they share at least one cell, they must share the same color, so their union of 6 cells (adjacent pair) or 7 cells (diagonal pair) is one color: adjacent pairs give 2 · 2³ = 16 each, diagonal pairs give 2 · 2² = 8 each. Pair total: 4 · 16 + 2 · 8 = 80. Triples: any three of the four blocks overlap pairwise in a connected way, so all are forced to the same color, and their union always covers 8 of the 9 cells (it misses exactly the corner of the one omitted block). That leaves 2 · 2¹ = 4 colorings each, and there are 4 triples: 16. Quadruple: all nine cells one color, 2 colorings. Inclusion–exclusion gives |A₁ ∪ … ∪ A₄| = 256 − 80 + 16 − 2 = 190, so the answer is 512 − 190 = 322. An exhaustive check of all 512 colorings confirms 322.",
    hints: [
      "Count the colorings that DO contain a monochromatic 2×2 block and subtract from 512.",
      "There are four 2×2 blocks; overlapping blocks that are both monochromatic are forced to share the same color, which collapses many cells at once.",
      "Apply inclusion–exclusion, treating the horizontally/vertically adjacent block pairs (sharing two cells) separately from the diagonal pairs (sharing one cell).",
    ],
    difficulty: 8,
    topicSlug: "casework",
    competitionSlug: "amc10",
  },
];
