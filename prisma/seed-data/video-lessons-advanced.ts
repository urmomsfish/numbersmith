import type { VideoLessonSeed } from "@/lib/video-lessons/types";

/**
 * Second-pass lessons for topics whose introduction stops short of where the
 * problems actually are.
 *
 * Every leaf topic already had a lesson, so this is not coverage — it is
 * depth. Each of these nine topics carries fifteen or more difficulty-6+
 * problems behind a lesson that ended at d6 or lower; modular arithmetic had
 * 407 of them behind a lesson that ended at d5. They assume the first lesson
 * and teach the move a competitor needs at AMC 10 / AIME level.
 *
 * Every worked value and every practice answer was checked independently —
 * by brute force where the search space allowed — before these were merged.
 */
export const ADVANCED_VIDEO_LESSONS: VideoLessonSeed[] = [
  {
    slug: "modular-arithmetic-advanced",
    title: "Modular Arithmetic II: Orders and Theorems",
    topicSlug: "modular-arithmetic",
    difficulty: 8,
    durationMinutes: 10,
    summary:
      "Uses Fermat, Euler, and multiplicative order to reduce huge exponents, then splits mod 1000 into mod 8 and mod 125 with CRT to extract last digits.",
    scenes: [
      {
        type: "title",
        heading: "Modular Arithmetic II: Orders and Theorems",
        sub: "Fermat, Euler, order, and CRT splitting for last-digit problems",
      },
      {
        type: "text",
        heading: "The exponent-shrinking toolkit",
        bullets: [
          "Fermat: if p is prime and p does not divide a, then a^(p-1) = 1 mod p.",
          "Euler: if gcd(a,m) = 1, then a^phi(m) = 1 mod m.",
          "phi is multiplicative: phi(1000) = phi(8)*phi(125) = 4*100 = 400.",
          "For a prime power, phi(p^k) = p^k - p^(k-1), so phi(125) = 125 - 25 = 100.",
          "These let you replace the exponent n by n mod phi(m) whenever gcd(a,m) = 1.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "a^n mod m, with gcd(a,m) = 1",
            },
            {
              expr: "n = q*phi(m) + r",
              note: "r = n mod phi(m)",
            },
            {
              expr: "a^n = (a^phi(m))^q * a^r = 1^q * a^r",
            },
            {
              expr: "a^n = a^r mod m",
              note: "only the small exponent survives",
            },
          ],
        },
      },
      {
        type: "text",
        heading: "Order: the exact cycle length",
        bullets: [
          "ord_m(a) is the least positive d with a^d = 1 mod m.",
          "Key lemma: a^n = 1 mod m if and only if ord_m(a) divides n.",
          "Hence ord_m(a) always divides phi(m), which gives a short list of candidates.",
          "Euler gives an exponent that works; the order gives the smallest one.",
          "Powers of 2 mod 7 cycle 2, 4, 1, so ord_7(2) = 3, a proper divisor of phi(7) = 6.",
        ],
        diagram: {
          kind: "modularClock",
          modulus: 7,
          highlight: [1, 2, 4],
          note: "Residues hit by powers of 2 mod 7: cycle length 3",
        },
      },
      {
        type: "example",
        heading: "Finding an order by divisor hunt",
        prompt: "Find ord_25(2).",
        bullets: [
          "phi(25) = 25 - 5 = 20, so the order divides 20: candidates 1, 2, 4, 5, 10, 20.",
          "Test the maximal proper divisors first: 2^10 = 1024 = 24 = -1 mod 25, not 1.",
          "2^4 = 16, not 1, so 4 fails and every divisor of 4 fails too.",
          "Since 10 and 4 both fail, no proper divisor of 20 works, so ord_25(2) = 20.",
          "Checking only the maximal proper divisors 20/2 = 10 and 20/5 = 4 is enough.",
        ],
      },
      {
        type: "strategy",
        heading: "Recipe for last k digits of a^n",
        bullets: [
          "Last three digits means working mod 1000 = 8 * 125, two coprime prime powers.",
          "Compute a^n mod 8 and a^n mod 125 separately, each with its own phi.",
          "Mod 125 use phi(125) = 100, so reduce the exponent to n mod 100 when gcd(a,5) = 1.",
          "Mod 8 the powers collapse fast: odd a satisfies a^2 = 1 mod 8.",
          "Recombine with CRT by writing x = 125k + r and solving one congruence mod 8.",
        ],
      },
      {
        type: "example",
        heading: "Last three digits of 7^2024",
        prompt: "Compute 7^2024 mod 1000.",
        bullets: [
          "Mod 8: 7 = -1, and 2024 is even, so 7^2024 = 1 mod 8.",
          "Mod 125: gcd(7,125) = 1 and 2024 = 24 mod 100, so 7^2024 = 7^24 mod 125.",
          "Square up: 7^2 = 49, 7^4 = 2401 = 26, 7^8 = 676 = 51, 7^16 = 2601 = 101 mod 125.",
          "7^24 = 7^16 * 7^8 = 101 * 51 = 5151 = 26 mod 125.",
          "Solve x = 125k + 26 = 1 mod 8: 5k + 2 = 1, so 5k = 7, k = 3, giving x = 401.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "7^2024 = 1 mod 8",
            },
            {
              expr: "7^2024 = 7^24 = 26 mod 125",
            },
            {
              expr: "x = 125k + 26, 5k + 2 = 1 mod 8",
            },
            {
              expr: "k = 3, x = 401",
              note: "401 = 1 mod 8 and 401 = 26 mod 125",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where these theorems break",
        bullets: [
          "Euler needs gcd(a,m) = 1: you cannot reduce the exponent of 2^n mod 8 this way.",
          "Reduce the exponent mod phi(m), never mod m itself.",
          "If n < phi(m), there is nothing to reduce; just compute by repeated squaring.",
          "The order divides phi(m) but often is strictly smaller, so never assume equality.",
          "CRT recombination needs coprime moduli: 1000 = 8 * 125 works, 1000 = 10 * 100 does not.",
        ],
      },
      {
        type: "example",
        heading: "When the base shares a factor",
        prompt: "Compute 2^2024 mod 1000.",
        bullets: [
          "Mod 8: 2^2024 = 0 since the exponent is at least 3; Euler is irrelevant here.",
          "Mod 125: gcd(2,125) = 1, and 2024 = 24 mod 100, so we need 2^24 mod 125.",
          "2^7 = 128 = 3, so 2^21 = 3^3 = 27 and 2^24 = 27 * 8 = 216 = 91 mod 125.",
          "Solve x = 125k + 91 = 0 mod 8: 5k + 3 = 0, so 5k = 5, k = 1, and x = 216.",
          "Last three digits are 216; the CRT split handled the non-coprime half cleanly.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt: "Find the last three digits of 3^1234.",
        answer: "569",
      },
      {
        type: "summary",
        heading: "What to carry away",
        bullets: [
          "Reduce exponents mod phi(m) only when gcd(a,m) = 1.",
          "The order divides phi(m); test maximal proper divisors to pin it down.",
          "Split mod 1000 into mod 8 and mod 125, solve each, then recombine with CRT.",
          "Handle a base sharing a factor with the modulus directly, not with Euler.",
          "Repeated squaring keeps the mod 125 arithmetic to four or five lines.",
        ],
      },
    ],
  },
  {
    slug: "sequences-advanced",
    title: "Sequences II: Recursions and Telescoping",
    topicSlug: "sequences",
    difficulty: 8,
    durationMinutes: 9,
    summary:
      "Shows how to convert a_(n+1) = r*a_n + d into a geometric sequence by shifting to the fixed point, how to solve second-order linear recurrences with characteristic roots, and how to collapse sums and products by writing terms as f(n) - f(n+1) or f(n)/f(n-1).",
    scenes: [
      {
        type: "title",
        heading: "Sequences II: Recursions and Telescoping",
        sub: "Closed forms from shifts, characteristic roots, and collapsing sums",
      },
      {
        type: "text",
        heading: "The shift trick: a_(n+1) = r*a_n + d",
        bullets: [
          "A constant added each step blocks the geometric pattern, so subtract it away.",
          "Find the fixed point L solving L = r*L + d, valid whenever r is not 1.",
          "The shifted sequence b_n = a_n - L satisfies b_(n+1) = r*b_n exactly.",
          "So every such recurrence is a geometric sequence in disguise, displaced by L.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "a_(n+1) = r*a_n + d",
              note: "given, r not equal to 1",
            },
            {
              expr: "L = r*L + d  =>  L = d/(1 - r)",
              note: "fixed point",
            },
            {
              expr: "b_n = a_n - L",
              note: "shift the whole sequence",
            },
            {
              expr: "b_(n+1) = r*b_n",
              note: "pure geometric",
            },
            {
              expr: "a_n = L + (a_1 - L)*r^(n-1)",
              note: "closed form",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Shift trick in action",
        prompt: "a_1 = 3 and a_(n+1) = 2*a_n - 5. Find a closed form for a_n.",
        bullets: [
          "Fixed point: L = 2L - 5 gives L = 5.",
          "Set b_n = a_n - 5, so b_1 = -2 and b_(n+1) = 2*b_n.",
          "Then b_n = -2*2^(n-1) = -2^n, hence a_n = 5 - 2^n.",
          "Check: a_2 = 2*3 - 5 = 1 and 5 - 2^2 = 1; a_3 = 2*1 - 5 = -3 and 5 - 2^3 = -3.",
        ],
      },
      {
        type: "text",
        heading: "Two-term recurrences: characteristic roots",
        bullets: [
          "For a_(n+2) = p*a_(n+1) + q*a_n, solve x^2 = p*x + q for roots r and s.",
          "With distinct roots the closed form is a_n = A*r^n + B*s^n, fitted to two known terms.",
          "Example: a_1 = 1, a_2 = 5, a_(n+2) = 5*a_(n+1) - 6*a_n gives x^2 - 5x + 6 = 0, roots 2 and 3.",
          "Solving 2A + 3B = 1 and 4A + 9B = 5 gives A = -1, B = 1, so a_n = 3^n - 2^n.",
          "Check: a_3 = 5*5 - 6*1 = 19 and 27 - 8 = 19.",
        ],
      },
      {
        type: "example",
        heading: "Telescoping a sum",
        prompt: "Evaluate the sum of 1/(sqrt(n) + sqrt(n+1)) for n = 1 to 40.",
        bullets: [
          "Rationalise: multiply top and bottom by sqrt(n+1) - sqrt(n).",
          "The denominator becomes (n+1) - n = 1, so the term equals sqrt(n+1) - sqrt(n).",
          "The sum is a chain of differences f(n+1) - f(n) with f(n) = sqrt(n).",
          "Everything cancels except the ends: sqrt(41) - sqrt(1) = sqrt(41) - 1.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "1/(sqrt(n) + sqrt(n+1)) = sqrt(n+1) - sqrt(n)",
              note: "rationalised",
            },
            {
              expr: "(sqrt(2)-sqrt(1)) + (sqrt(3)-sqrt(2)) + ... + (sqrt(41)-sqrt(40))",
            },
            {
              expr: "= sqrt(41) - 1",
              note: "only the outer terms survive",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Telescoping a product",
        prompt: "a_1 = 1 and a_n = ((n-1)/(n+1))*a_(n-1) for n >= 2. Find a_n.",
        bullets: [
          "Multiply the ratios: a_n = product of (k-1)/(k+1) for k = 2 to n.",
          "Numerators give 1*2*...*(n-1) = (n-1)!; denominators give 3*4*...*(n+1) = (n+1)!/2.",
          "Therefore a_n = 2*(n-1)!/(n+1)! = 2/(n*(n+1)).",
          "Check: a_2 = (1/3)*1 = 1/3 and 2/(2*3) = 1/3; a_3 = (2/4)*(1/3) = 1/6 and 2/(3*4) = 1/6.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "a_n / a_(n-1) = (n-1)/(n+1)",
            },
            {
              expr: "a_n = (1/3)*(2/4)*(3/5)*...*((n-1)/(n+1))",
              note: "stack the ratios",
            },
            {
              expr: "a_n = 2*(n-1)!/(n+1)! = 2/(n*(n+1))",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where these problems go wrong",
        bullets: [
          "If r = 1 the equation L = L + d has no solution: that sequence is arithmetic, not geometric.",
          "Telescoping 1/n - 1/(n+2) leaves two terms at each end, not one.",
          "Shifting starts at b_1, so b_n = b_1*r^(n-1); writing b_1*r^n is the classic off-by-one.",
          "A repeated characteristic root r forces a_n = (A + B*n)*r^n, not two separate powers.",
          "Always test your closed form on n = 1, 2, 3 against the recurrence before using it.",
        ],
      },
      {
        type: "strategy",
        heading: "How to decide which move to make",
        bullets: [
          "Write out four or five terms before anything else; patterns are cheaper than algebra.",
          "Test differences a_(n+1) - a_n and ratios a_(n+1)/a_n; if neither is constant, try a_n - c.",
          "A sum of rational terms usually wants partial fractions; a sum with square roots wants rationalising.",
          "For products, form a_n/a_(n-1) and hunt for the shape f(n)/f(n-1).",
          "Recurrences mixing a_n and a_(n-1) with no constant are often geometric after dividing by a_(n-1).",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt: "a_1 = 5 and a_(n+1) = 4*a_n - 9. Find a_5.",
        answer: "515",
      },
      {
        type: "summary",
        heading: "What to carry away",
        bullets: [
          "a_(n+1) = r*a_n + d becomes geometric after subtracting the fixed point L = d/(1-r).",
          "Second-order linear recurrences reduce to the characteristic equation x^2 = p*x + q.",
          "A sum collapses when each term is written as f(n+1) - f(n); only the endpoints remain.",
          "A product collapses when each ratio is written as f(n)/f(n-1).",
          "Verify every closed form on the first three terms before committing to an answer.",
        ],
      },
    ],
  },
  {
    slug: "factoring-advanced",
    title: "Factoring II: Clever Manipulations",
    topicSlug: "factoring",
    difficulty: 8,
    durationMinutes: 10,
    summary:
      "Second pass on factoring: Simon's Favourite Factoring Trick, hidden differences of squares (including the Sophie Germain identity), turning Diophantine equations into divisor counts, and s-p symmetric substitutions.",
    scenes: [
      {
        type: "title",
        heading: "Factoring II: Clever Manipulations",
        sub: "Add the missing corner, count the divisors, then win",
      },
      {
        type: "text",
        heading: "The SFFT Move",
        bullets: [
          "Any expression xy + ax + by is one constant away from a product.",
          "Add ab to both sides: the left side becomes (x + b)(y + a).",
          "The point is to trade an equation with two unknowns for a divisor list.",
          "If the x and y terms carry a common coefficient k, factor k out first.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "xy + ax + by = c",
            },
            {
              expr: "xy + ax + by + ab = c + ab",
              note: "add the missing corner ab",
            },
            {
              expr: "(x + b)(y + a) = c + ab",
              note: "now read off divisor pairs",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "SFFT in Action",
        prompt: "Find all positive integers x, y with xy + 5x + 3y = 51.",
        bullets: [
          "Add 15 to both sides: xy + 5x + 3y + 15 = 66, so (x + 3)(y + 5) = 66.",
          "Positivity forces x + 3 >= 4 and y + 5 >= 6, so x + 3 <= 66/6 = 11.",
          "Divisors of 66 in [4, 11] are 6 and 11, giving (x, y) = (3, 6) and (8, 1).",
          "Check: 3*6 + 15 + 18 = 51 and 8*1 + 40 + 3 = 51.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "xy + 5x + 3y = 51",
            },
            {
              expr: "(x + 3)(y + 5) = 66",
              note: "66 = 2 * 3 * 11",
            },
            {
              expr: "(x+3, y+5) = (6, 11) or (11, 6)",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where SFFT Goes Wrong",
        bullets: [
          "Sign slips: xy - 4x + 7y needs -28, since (x + 7)(y - 4) = xy - 4x + 7y - 28.",
          "If the problem allows all integers, negative divisor pairs are solutions too.",
          "Forgetting the range restriction (like x + 3 >= 4) invents solutions with x <= 0.",
          "Ordered versus unordered pairs: (3, 6) and (6, 3) are different answers unless the problem says otherwise.",
        ],
      },
      {
        type: "text",
        heading: "Difference of Squares in Disguise",
        bullets: [
          "Add and subtract a term to force the shape A^2 - B^2.",
          "x^4 + x^2 + 1 = (x^2 + 1)^2 - x^2 = (x^2 + x + 1)(x^2 - x + 1).",
          "Sophie Germain: a^4 + 4b^4 = (a^2 + 2b^2)^2 - (2ab)^2 = (a^2 - 2ab + 2b^2)(a^2 + 2ab + 2b^2).",
          "Sanity check with a = 4, b = 1: 256 + 4 = 260 and (16 - 8 + 2)(16 + 8 + 2) = 10 * 26 = 260.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "a^4 + 4b^4",
            },
            {
              expr: "a^4 + 4a^2b^2 + 4b^4 - 4a^2b^2",
              note: "complete the square",
            },
            {
              expr: "(a^2 + 2b^2)^2 - (2ab)^2",
            },
            {
              expr: "(a^2 - 2ab + 2b^2)(a^2 + 2ab + 2b^2)",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Factoring Solves Diophantines",
        prompt:
          "How many ordered pairs of positive integers (x, y) satisfy x^2 - y^2 = 2024?",
        bullets: [
          "Write (x - y)(x + y) = 2024 = 2^3 * 11 * 23; both factors share the parity of x + y and x - y.",
          "Both odd is impossible (product is even), so both are even: x - y = 2a, x + y = 2b with ab = 506.",
          "506 = 2 * 11 * 23 has 8 divisors, giving 4 pairs with a < b: (1,506), (2,253), (11,46), (22,23).",
          "Each pair gives x = a + b, y = b - a > 0, so there are 4 solutions.",
          "Smallest one: a = 22, b = 23 gives (x, y) = (45, 1), and 45^2 - 1 = 2024.",
        ],
      },
      {
        type: "example",
        heading: "Symmetric Substitutions",
        prompt:
          "If x + y + z = 6, xy + yz + zx = 11, xyz = 6, compute (x + y)(y + z)(z + x).",
        bullets: [
          "Name the elementary symmetric sums e1 = 6, e2 = 11, e3 = 6 instead of hunting for x, y, z.",
          "Identity: (x + y)(y + z)(z + x) = e1*e2 - e3 = 6*11 - 6 = 60.",
          "Verification: the numbers are 1, 2, 3, and 3 * 5 * 4 = 60.",
          "Two-variable versions to memorise: x^2 + y^2 = s^2 - 2p and x^3 + y^3 = s^3 - 3ps with s = x + y, p = xy.",
        ],
      },
      {
        type: "strategy",
        heading: "Recognition Checklist",
        bullets: [
          "See xy plus linear terms in x and y? Complete the rectangle with SFFT.",
          "See a quartic or a stubborn even-degree expression? Try adding and subtracting a square.",
          "See an integer equation? Isolate a product equal to a constant, then enumerate divisors.",
          "See an expression unchanged by swapping variables? Rewrite it in s and p (or e1, e2, e3).",
          "After factoring, always re-impose the original constraints before counting.",
        ],
      },
      {
        type: "practice",
        heading: "Your Turn",
        prompt:
          "Find the number of ordered pairs of positive integers (x, y) with xy - 4x + 7y = 100.",
        answer: "7",
      },
      {
        type: "summary",
        heading: "Takeaways",
        bullets: [
          "SFFT: xy + ax + by = c becomes (x + b)(y + a) = c + ab.",
          "Adding and subtracting a square turns quartics into differences of squares, including a^4 + 4b^4.",
          "Factoring converts a Diophantine equation into a finite divisor count, with parity and positivity as filters.",
          "Symmetric expressions collapse fast once rewritten in s, p or e1, e2, e3.",
          "Always check the factored solutions against the original domain restrictions.",
        ],
      },
    ],
  },
  {
    slug: "counting-probability-advanced",
    title: "Probability II: Complements and Symmetry",
    topicSlug: "counting-probability",
    difficulty: 8,
    durationMinutes: 9,
    summary:
      "Trains three high-leverage probability moves at AMC 10/AIME level: converting 'at least one' into 1 minus P(none), using bijective symmetry to force a probability to 1/2, and recounting inside a conditioned sample space.",
    scenes: [
      {
        type: "title",
        heading: "Probability II: Complements and Symmetry",
        sub: "Three moves: subtract from 1, pair outcomes off, shrink the universe",
      },
      {
        type: "text",
        heading: "The 'at least one' reflex",
        bullets: [
          "Counting 'at least one' directly forces inclusion-exclusion over many overlapping cases.",
          "Counting 'none' is usually one clean product or one binomial coefficient.",
          "P(at least one) = 1 - P(none) is always valid; independence is never needed for this step.",
          "Roll 4 fair dice: P(at least one 6) = 1 - (5/6)^4 = 1 - 625/1296 = 671/1296.",
          "Independence matters only when you evaluate P(none) as a product of factors.",
        ],
        diagram: {
          kind: "bars",
          total: 1296,
          segments: [
            {
              label: "no 6 at all",
              value: 625,
              tone: "slate",
            },
            {
              label: "at least one 6",
              value: 671,
              tone: "success",
            },
          ],
          note: "4 dice: 6^4 = 1296 equally likely outcomes",
        },
      },
      {
        type: "example",
        heading: "Complement on a counting problem",
        prompt:
          "Two distinct integers are chosen at random from {1, 2, ..., 20}. Find the probability that their difference is at least 3.",
        bullets: [
          "Total pairs: C(20,2) = 190.",
          "The complement is 'difference is 1 or 2', only two thin families to count.",
          "Difference 1: pairs (k, k+1) for k = 1..19, so 19 pairs.",
          "Difference 2: pairs (k, k+2) for k = 1..18, so 18 pairs.",
          "Answer: 1 - 37/190 = 153/190.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "P(diff <= 2) = (19 + 18)/190",
              note: "disjoint families",
            },
            {
              expr: "P(diff <= 2) = 37/190",
            },
            {
              expr: "P(diff >= 3) = 1 - 37/190 = 153/190",
            },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Symmetry: find the bijection",
        bullets: [
          "If a relabeling of outcomes carries event A exactly onto event B, then P(A) = P(B).",
          "Standard relabelings: swap heads and tails, swap two players, reverse an ordering.",
          "In a random permutation of distinct items, P(x appears before y) = 1/2 by the swap bijection.",
          "If A, B, and 'tie' partition the sample space with P(A) = P(B), then P(A) = (1 - P(tie))/2.",
          "Symmetry plus complement is the strongest combination: show two events are complementary AND equiprobable to get 1/2 instantly.",
        ],
      },
      {
        type: "example",
        heading: "The extra-coin problem",
        prompt:
          "Player A flips n+1 fair coins and player B flips n fair coins. What is the probability that A gets strictly more heads than B?",
        bullets: [
          "Let H_A, T_A, H_B, T_B be the head and tail counts, so H_A + T_A = n+1 and H_B + T_B = n.",
          "H_A <= H_B is equivalent to (n+1 - T_A) <= (n - T_B), i.e. T_A > T_B.",
          "So exactly one of 'A has more heads' and 'A has more tails' occurs: they are complementary.",
          "Relabeling every coin flip H <-> T is a bijection swapping these two events, so they are equally likely.",
          "Each has probability 1/2; check n = 1: 3/8 + 1/8 = 1/2.",
        ],
      },
      {
        type: "text",
        heading: "Conditioning = recount in a smaller universe",
        bullets: [
          "P(A | B) = P(A and B)/P(B); with equally likely outcomes just count favorable outcomes inside B.",
          "The denominator changes, so recount it deliberately instead of reusing the old total.",
          "'At least one die shows 5' has 11 outcomes out of 36, not 6 and not 12.",
          "Complementing still works inside the conditioned space: P(at least one | B) = 1 - P(none | B).",
          "Information that does not change the count of B leaves P(A | B) equal to P(A).",
        ],
      },
      {
        type: "example",
        heading: "Conditional count on two dice",
        prompt:
          "Two fair dice are rolled. Given that at least one die shows a 5, what is the probability that the sum is at least 9?",
        bullets: [
          "Condition event B: 6 outcomes with first die 5, 6 with second die 5, minus (5,5) counted twice, so 11.",
          "Inside B, list sums of at least 9: (5,4), (5,5), (5,6), (4,5), (6,5).",
          "That is 5 outcomes, and (5,5) is counted only once.",
          "Answer: 5/11.",
          "Note 5/11 is not 5/36 divided by anything familiar; the universe really did shrink to 11.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "P(B) = 11/36",
            },
            {
              expr: "P(A and B) = 5/36",
            },
            {
              expr: "P(A | B) = (5/36)/(11/36) = 5/11",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where these arguments break",
        bullets: [
          "The complement of 'at least one' is 'none', never 'exactly one'.",
          "1 - P(A) is only the answer when A is the exact complement; overlapping cases need inclusion-exclusion, not subtraction.",
          "Symmetry gives 1/2 only when ties are impossible or removed first: with equal numbers of coins, P(A more heads) = (1 - P(tie))/2 < 1/2.",
          "When conditioning, forgetting to shrink the denominator turns 5/11 into a wrong 5/36 or 5/12.",
          "Double counting the overlap, like (5,5), inflates the conditioned sample space.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt:
          "Four distinct numbers are chosen at random from {1, 2, ..., 10}. What is the probability that at least two of the chosen numbers are consecutive?",
        answer: "5/6",
      },
      {
        type: "summary",
        heading: "What to carry forward",
        bullets: [
          "See 'at least one' and immediately write 1 - P(none).",
          "Before computing, ask whether a relabeling swaps two complementary events, forcing each to be 1/2.",
          "Handle ties separately: P(win) = (1 - P(tie))/2 when the two players are interchangeable.",
          "Conditioning means recounting both numerator and denominator in the restricted set.",
          "Complement, symmetry, and conditioning stack; the hardest AIME counts usually need two of the three.",
        ],
      },
    ],
  },
  {
    slug: "games-and-strategies-advanced",
    title: "Games II: Invariants and Winning Positions",
    topicSlug: "games-and-strategies",
    difficulty: 8,
    durationMinutes: 10,
    summary:
      "Label game positions P or N by working backwards from terminal states, then compress the table into a maintainable invariant: a mod pattern, a parity count, Nim XOR, or a mirroring strategy.",
    scenes: [
      {
        type: "title",
        heading: "Games II: Invariants and Winning Positions",
        sub: "From backward induction tables to the one quantity you defend",
      },
      {
        type: "text",
        heading: "The labeling rule, used in reverse",
        bullets: [
          "A position is P (previous player wins) if every legal move leads to an N-position.",
          "A position is N if at least one move leads to a P-position.",
          "Under normal play, a position with no moves available is P, and you must label it first.",
          "Compute labels in increasing order of size, but the answer is the pattern, not the table.",
          "Your job as the mover is always to hand your opponent a P-position.",
        ],
      },
      {
        type: "example",
        heading: "Subtraction game S = {1, 3, 4}",
        prompt:
          "From a pile of n stones a player removes 1, 3, or 4 stones; the player taking the last stone wins. Which n lose for the mover?",
        bullets: [
          "n = 0 is P; n = 1, 3, 4 are N because one move empties the pile.",
          "n = 2 can only reach n = 1 (an N-position), so n = 2 is P.",
          "n = 5 reaches 2 and n = 6 reaches 2, so both are N.",
          "n = 7 reaches 6, 4, and 3, all N, so n = 7 is P.",
          "The labels repeat with period 7: P exactly when n mod 7 is 0 or 2.",
        ],
        diagram: {
          kind: "numberline",
          min: 0,
          max: 14,
          points: [
            {
              value: 0,
              label: "0",
              tone: "success",
            },
            {
              value: 2,
              label: "2",
              tone: "success",
            },
            {
              value: 7,
              label: "7",
              tone: "success",
            },
            {
              value: 9,
              label: "9",
              tone: "success",
            },
            {
              value: 14,
              label: "14",
              tone: "success",
            },
          ],
          note: "P-positions: n mod 7 in {0, 2}.",
        },
      },
      {
        type: "text",
        heading: "Invariants and monovariants",
        bullets: [
          "An invariant is a quantity unchanged by every move, or restorable by your answering move.",
          "A monovariant only ever moves one direction, which proves the game terminates.",
          "The winning template: find f with f = 0 exactly on P-positions, show every move from f = 0 makes f nonzero, and every f nonzero has a move back to 0.",
          "Both 'n mod 7 in {0,2}' and Nim's XOR are invariants of exactly this type.",
          "Parity is the cheapest invariant available: count something mod 2 and watch what flips.",
        ],
      },
      {
        type: "example",
        heading: "A pure invariant: erase and replace",
        prompt:
          "The numbers 1 through 25 are on a board. Repeatedly erase two numbers a and b and write |a - b|. Can the final remaining number be 0?",
        bullets: [
          "One step changes the sum by a + b - |a - b| = 2*min(a, b), always an even amount.",
          "So the parity of the total sum never changes.",
          "The starting sum is 25*26/2 = 325, which is odd.",
          "Each move reduces the count of numbers by exactly 1, so after 24 moves one number remains.",
          "That final number is odd, hence at least 1, so 0 is impossible.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "sum = 1 + 2 + ... + 25 = 325",
              note: "odd",
            },
            {
              expr: "a, b -> |a - b| changes sum by 2*min(a,b)",
              note: "even change",
            },
            {
              expr: "final number is odd, so it is not 0",
              note: "invariant finishes it",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Nim: XOR is the invariant",
        prompt:
          "Piles of 5, 9, and 12 stones; a move removes any positive number from one pile and the player taking the last stone wins. Who should win?",
        bullets: [
          "In binary: 5 = 0101, 9 = 1001, 12 = 1100, and their XOR is 0000.",
          "XOR 0 means a P-position, so the second player wins with correct play.",
          "Say the first player takes 3 from the pile of 12, leaving 5, 9, 9 with XOR 5.",
          "The second player empties the pile of 5, returning to 0, 9, 9 with XOR 0.",
          "Any move breaks XOR = 0 and any nonzero XOR can be reset, which is the whole proof.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "0101 XOR 1001 = 1100",
            },
            {
              expr: "1100 XOR 1100 = 0000",
              note: "P-position",
            },
            {
              expr: "5, 9, 9 -> XOR = 5, so remove the 5-pile",
              note: "restore 0",
            },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Mirroring is an invariant in disguise",
        bullets: [
          "If you can keep the position symmetric, you always have a legal reply, so you never lose first.",
          "With two equal piles and symmetric rules, copy every opponent move in the other pile.",
          "On a board, look for a perfect pairing of cells or moves; if one exists, the second player wins.",
          "If the symmetry has one unpaired fixed point, the first player takes it and mirrors from then on.",
          "The proof is always the same check: the mirrored move must still be legal.",
        ],
      },
      {
        type: "pitfall",
        heading: "Where these arguments break",
        bullets: [
          "Misere play (last mover loses) can flip the answer; in Nim it differs only when every pile has at most 1 stone.",
          "Do not guess a period from four computed terms; confirm a repeating block at least as long as the largest legal move.",
          "An invariant shows a target is unreachable, but a winning strategy also needs an explicit reply to every opponent move.",
          "Mislabeling the terminal position inverts your entire P/N table, so fix it before computing anything.",
          "A clean mod-k pattern often has exceptional small cases; test n = 0, 1, 2 against the rule by hand.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt:
          "A pile has 2024 stones. Players alternately remove 1, 2, or 4 stones, and the player taking the last stone wins. Who has a winning strategy?",
        answer: "First player (take 2, leaving 2022).",
      },
      {
        type: "summary",
        heading: "What to carry away",
        bullets: [
          "Build the P/N table from the terminal position upward, then look for the period or formula.",
          "Convert the pattern into an invariant you can restore on every turn.",
          "Parity and mod arguments settle reachability questions instantly; XOR settles Nim-type sums.",
          "Monovariants prove the game ends, which legitimizes the backward induction.",
          "Before answering, confirm the win condition is normal play and check the small cases.",
        ],
      },
    ],
  },
  {
    slug: "expected-value-advanced",
    title: "Expected Value II: Linearity and Recursion",
    topicSlug: "expected-value",
    difficulty: 8,
    durationMinutes: 10,
    summary:
      "Builds expected-value technique past the definition: indicator variables and linearity on dependent events, splitting a wait into geometric stages, and solving state recursions such as the expected number of flips to see HH.",
    scenes: [
      {
        type: "title",
        heading: "Expected Value II: Linearity and Recursion",
        sub: "Indicators for counting problems, state equations for repeating processes",
      },
      {
        type: "strategy",
        heading: "The indicator playbook",
        bullets: [
          "If the quantity is 'the number of things that happen', write it as a sum of 0/1 indicators X = X_1 + ... + X_n.",
          "Linearity gives E[X] = E[X_1] + ... + E[X_n] with no independence assumption whatsoever.",
          "E[X_i] is just P(event i happens), so you only ever compute one simple probability.",
          "Dependence between the X_i only matters if you need the variance, not the mean.",
          "Choose the indicators so that each one fires exactly once per object counted, or you will double count.",
        ],
      },
      {
        type: "example",
        heading: "Dependent indicators: couples at a round table",
        prompt:
          "Five couples are seated at random in 10 chairs around a circular table. Find the expected number of couples that end up seated next to each other.",
        bullets: [
          "Let X_i = 1 if couple i is adjacent, and let X = X_1 + X_2 + X_3 + X_4 + X_5.",
          "Seat one member of couple i; the partner is equally likely to take any of the 9 remaining chairs, and 2 of them are neighbors.",
          "So E[X_i] = P(couple i adjacent) = 2/9, even though the five adjacency events clearly influence each other.",
          "Linearity ignores that dependence: E[X] = 5 * (2/9) = 10/9.",
          "Computing the joint distribution of the five events would be painful and is completely unnecessary.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "X = X_1 + X_2 + X_3 + X_4 + X_5",
              note: "indicator per couple",
            },
            {
              expr: "E[X_i] = 2/9",
              note: "2 good chairs out of 9",
            },
            {
              expr: "E[X] = 5 * 2/9 = 10/9",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Indicator on 'at least once'",
        prompt:
          "Six fair six-sided dice are rolled. What is the expected number of distinct faces that appear?",
        bullets: [
          "For each face f, let Y_f = 1 if face f shows up at least once among the six dice.",
          "P(face f never appears) = (5/6)^6 = 15625/46656, so E[Y_f] = 31031/46656.",
          "By linearity the answer is 6 * 31031/46656 = 31031/7776, about 3.99.",
          "Indexing by face (6 indicators) beats indexing by die, which would count repeats.",
          "Whenever 'distinct' or 'at least one' appears, put the indicator on the value, not on the trial.",
        ],
      },
      {
        type: "text",
        heading: "Split a long wait into stages",
        bullets: [
          "To collect all six faces, write T = T_1 + ... + T_6 where T_k is the extra rolls needed for the k-th new face.",
          "With k-1 faces already seen, each roll is new with probability (7-k)/6, so E[T_k] = 6/(7-k).",
          "Summing: E[T] = 6(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 6 * 147/60 = 147/10 = 14.7.",
          "Each stage is a geometric wait with mean 1/p, which is the one formula worth memorizing here.",
          "Linearity adds the stages even though their lengths are random and the stage boundaries are random.",
        ],
        diagram: {
          kind: "bars",
          total: 14.7,
          segments: [
            {
              label: "1st new face: 1",
              value: 1,
              tone: "brand",
            },
            {
              label: "2nd: 6/5 = 1.2",
              value: 1.2,
              tone: "brand",
            },
            {
              label: "3rd: 6/4 = 1.5",
              value: 1.5,
              tone: "slate",
            },
            {
              label: "4th: 6/3 = 2",
              value: 2,
              tone: "slate",
            },
            {
              label: "5th: 6/2 = 3",
              value: 3,
              tone: "warning",
            },
            {
              label: "6th: 6/1 = 6",
              value: 6,
              tone: "success",
            },
          ],
          note: "Total expected rolls = 14.7",
        },
      },
      {
        type: "strategy",
        heading: "Setting up an expectation recursion",
        bullets: [
          "Define states by how much usable progress you currently have, never by how many steps have elapsed.",
          "Each state gives E_s = 1 + sum of p(s to t) * E_t, where the 1 pays for the step you just took.",
          "The finished state has expectation 0; that absorbing value anchors the whole system.",
          "A transition back into the same state is legal and simply contributes p * E_s to its own equation.",
          "Solve by back-substitution starting from the state nearest completion, then check the answer is at least the trivial lower bound.",
        ],
      },
      {
        type: "example",
        heading: "Expected flips until HH",
        prompt:
          "A fair coin is flipped until two heads appear in a row. What is the expected number of flips?",
        bullets: [
          "States: 0 = no usable progress, 1 = last flip was a head, done = HH seen.",
          "From state 0, a head moves to state 1 and a tail stays at state 0.",
          "From state 1, a head finishes and a tail destroys all progress, returning to state 0.",
          "Solving the two equations gives E1 = 4 and E0 = 6, so the answer is 6 flips.",
          "Compare: waiting for the first head takes 2 flips, so 6 is plausible since each failure wipes progress.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "E0 = 1 + (1/2)E1 + (1/2)E0",
              note: "tail keeps you at zero progress",
            },
            {
              expr: "E1 = 1 + (1/2)(0) + (1/2)E0",
              note: "head finishes, tail resets",
            },
            {
              expr: "E0 = 2 + E1",
              note: "from the first equation",
            },
            {
              expr: "E1 = 1 + (1/2)(2 + E1) = 2 + (1/2)E1, so E1 = 4",
            },
            {
              expr: "E0 = 2 + 4 = 6",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where these solutions break",
        bullets: [
          "Linearity never needs independence, but E[XY] = E[X]E[Y] does, so do not use it casually.",
          "Expectation does not pass through nonlinear functions: E[1/X] is not 1/E[X] and E[X^2] is not E[X]^2.",
          "Merging two states is only valid when their futures are identical; for the pattern HTH, the suffix after HTT is worth nothing but after HTH-fail you still hold an H.",
          "Forgetting the +1 for the current step turns every recursion into the equation E = 0.",
          "Indicators indexed by the wrong object (dice instead of faces, ordered instead of unordered pairs) silently double count.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt:
          "A fair coin is flipped repeatedly until the pattern HTH appears for the first time. What is the expected number of flips? (Hint: states are 'nothing usable', 'H', and 'HT', and note that a tail from state HT sends you all the way back.)",
        answer: "10",
      },
      {
        type: "summary",
        heading: "What to carry away",
        bullets: [
          "Count-type expectations: write X as a sum of indicators and add the single-event probabilities, dependence and all.",
          "Wait-type expectations with changing success rates: split into geometric stages, each with mean 1/p.",
          "Repeating processes with memory: define progress states and write E_s = 1 + sum p * E_t with E_done = 0.",
          "Set up the state graph before any algebra; overlapping patterns decide where a failure sends you.",
          "Finish by sanity checking the number against an obvious bound such as the simpler single-event wait.",
        ],
      },
    ],
  },
  {
    slug: "diophantine-equations-advanced",
    title: "Diophantine Equations II: Bounding and Descent",
    topicSlug: "diophantine-equations",
    difficulty: 8,
    durationMinutes: 9,
    summary:
      "Shows how to finish a Diophantine problem with three concrete moves: bounding a variable into a finite case list, killing solutions with a modular obstruction plus descent, and rewriting the equation as a product of integers.",
    scenes: [
      {
        type: "title",
        heading: "Diophantine Equations II: Bounding and Descent",
        sub: "Turning an infinite search into a finite one",
      },
      {
        type: "text",
        heading: "The three finishing moves",
        bullets: [
          "Bound: use an inequality or a size argument to force a variable into a short list.",
          "Obstruct: find a modulus where the two sides can never agree, which kills all solutions at once.",
          "Factor: move everything to one side and write it as (something)(something) = constant.",
          "Most contest problems need exactly one of these, and the hard part is choosing fast.",
        ],
      },
      {
        type: "example",
        heading: "Bounding: a unit-fraction equation",
        prompt:
          "Find all positive integer solutions of 1/x + 1/y + 1/z = 1 with x <= y <= z.",
        bullets: [
          "Since x is smallest, 1 = 1/x + 1/y + 1/z <= 3/x, so x <= 3; also x >= 2 because 1/x < 1.",
          "If x = 2 then 1/y + 1/z = 1/2 <= 2/y gives y <= 4, and 1/y < 1/2 gives y >= 3.",
          "y = 3 forces 1/z = 1/6 so z = 6; y = 4 forces 1/z = 1/4 so z = 4.",
          "If x = 3 then 1/y + 1/z = 2/3 <= 2/y gives y <= 3, so y = 3 and z = 3.",
          "The complete list is (2,3,6), (2,4,4), (3,3,3).",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "1 = 1/x + 1/y + 1/z <= 3/x",
              note: "ordering gives the bound",
            },
            {
              expr: "2 <= x <= 3",
              note: "only two cases survive",
            },
            {
              expr: "x = 2:  1/y + 1/z = 1/2,  3 <= y <= 4",
            },
            {
              expr: "x = 3:  1/y + 1/z = 2/3,  y = 3",
            },
          ],
        },
      },
      {
        type: "text",
        heading: "Modular obstruction toolkit",
        bullets: [
          "Squares are 0 or 1 mod 4, and 0, 1 or 4 mod 8.",
          "Cubes are 0, 1 or 8 mod 9; fourth powers are 0 or 1 mod 16.",
          "A sum of two squares is never 3 mod 4, so x^2 + y^2 = 4k + 3 has no solutions.",
          "Pick the modulus from the coefficients: a 15 and a 7 scream mod 3 or mod 5.",
        ],
        diagram: {
          kind: "modularClock",
          modulus: 8,
          highlight: [0, 1, 4],
          note: "Residues a perfect square can occupy mod 8",
        },
      },
      {
        type: "example",
        heading: "Obstruction plus descent",
        prompt: "Show 15x^2 - 7y^2 = 9 has no integer solutions.",
        bullets: [
          "Mod 3: 15x^2 is 0 and 9 is 0, so 7y^2 = 0 mod 3, hence 3 divides y.",
          "Write y = 3b: 15x^2 - 63b^2 = 9, and dividing by 3 gives 5x^2 - 21b^2 = 3.",
          "Mod 3 again: 5x^2 = 0 mod 3, so 3 divides x; write x = 3a to get 15a^2 - 7b^2 = 1.",
          "Mod 3 one last time: -7b^2 = 1 means 2b^2 = 1, so b^2 = 2 mod 3, which is impossible.",
          "The forced divisibility shrank the equation until it died — that is descent.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "15x^2 - 7y^2 = 9",
              note: "mod 3 forces 3 | y",
            },
            {
              expr: "5x^2 - 21b^2 = 3",
              note: "y = 3b, divided by 3; forces 3 | x",
            },
            {
              expr: "15a^2 - 7b^2 = 1",
              note: "x = 3a, divided by 3",
            },
            {
              expr: "b^2 = 2 (mod 3)",
              note: "contradiction: squares are 0 or 1",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Factoring: Simon's trick",
        prompt:
          "How many ordered pairs of positive integers (x, y) satisfy xy = 2x + 3y + 6?",
        bullets: [
          "Rearrange to xy - 2x - 3y = 6, then add 6 to both sides: (x - 3)(y - 2) = 12.",
          "Since x >= 1, the factor x - 3 is at least -2, so a negative pair would need y - 2 <= -6, i.e. y <= -4.",
          "Negative factors are impossible, so x - 3 is a positive divisor of 12: 1, 2, 3, 4, 6, 12.",
          "Each choice fixes y - 2 = 12/(x - 3), giving 6 ordered pairs.",
          "Check x = 4, y = 14: xy = 56 and 2x + 3y + 6 = 8 + 42 + 6 = 56.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "xy - 2x - 3y = 6",
            },
            {
              expr: "xy - 2x - 3y + 6 = 12",
              note: "add the product of the shifts",
            },
            {
              expr: "(x - 3)(y - 2) = 12",
            },
            {
              expr: "x - 3 in {1,2,3,4,6,12}",
              note: "6 ordered pairs",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where these arguments leak",
        bullets: [
          "After factoring, negative divisor pairs are legal unless you prove they violate the positivity constraints.",
          "If you assumed x <= y <= z to bound, remember to permute at the end when the problem counts ordered triples.",
          "A modular argument can only disprove solutions; passing every modulus is not a proof that one exists.",
          "Never divide by a variable expression without checking the case where it equals zero.",
          "Always substitute one candidate back into the original equation — the shift in Simon's trick is easy to misremember.",
        ],
      },
      {
        type: "strategy",
        heading: "Choosing the move in 20 seconds",
        bullets: [
          "If every term is positive and the equation involves reciprocals or a fixed sum, bound the smallest variable first.",
          "If the degrees match on both sides but coefficients are lopsided, test mod 3, 4, 8, and 9 before anything else.",
          "If the equation is linear in each variable separately, like axy + bx + cy = d, it factors after a shift.",
          "If a mod argument proves p divides every variable, substitute and divide to set up a descent.",
          "A difference of squares x^2 - y^2 = N means (x - y)(x + y) = N, with both factors the same parity.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt:
          "How many ordered pairs of positive integers (x, y) satisfy 1/x + 1/y = 1/20?",
        answer: "15",
      },
      {
        type: "summary",
        heading: "What to carry forward",
        bullets: [
          "Ordering variables converts a sum into an inequality and the inequality into a finite case list.",
          "Choose the modulus from the coefficients and the known residue sets of squares and cubes.",
          "Forced divisibility by p lets you substitute and shrink the equation until it contradicts itself.",
          "Equations linear in each variable become (x + a)(y + b) = N, then you enumerate divisors.",
          "Finish by checking sign constraints and by plugging one solution back in.",
        ],
      },
    ],
  },
  {
    slug: "counting-principles-advanced",
    title: "Counting II: Stars, Bars and Overcounting",
    topicSlug: "counting-principles",
    difficulty: 8,
    durationMinutes: 9,
    summary:
      "Applies stars and bars to lower-bounded and capped equations via substitution and inclusion-exclusion, then drills the decision of whether objects, slots, and order are distinguishable before any formula is used.",
    scenes: [
      {
        type: "title",
        heading: "Counting II: Stars, Bars and Overcounting",
        sub: "Integer solutions, caps, and knowing what you are counting",
      },
      {
        type: "text",
        heading: "The template, and the shift that feeds it",
        bullets: [
          "Nonnegative solutions of x1 + ... + xk = n number C(n + k - 1, k - 1).",
          "Positive solutions number C(n - 1, k - 1), which is the same formula after xi = yi + 1.",
          "Any lower bounds xi >= Li are removed first: subtract the Li, then count freely.",
          "The formula assumes the boxes (the variables) are labelled and the units are identical.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "x1 + x2 + x3 = 7, all xi >= 0",
              note: "7 stars, 2 bars",
            },
            {
              expr: "**|***|**",
              note: "this arrangement means (2, 3, 2)",
            },
            {
              expr: "C(7 + 2, 2) = C(9, 2) = 36",
              note: "choose bar positions",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Lower bounds: subtract them away",
        prompt:
          "How many integer solutions does x1 + x2 + x3 + x4 = 20 have with every xi >= 2?",
        bullets: [
          "Set yi = xi - 2, so each yi >= 0 and the equation becomes y1 + y2 + y3 + y4 = 12.",
          "The substitution is a bijection: every valid x-tuple gives exactly one y-tuple.",
          "Count: C(12 + 3, 3) = C(15, 3) = 455.",
          "Never try to 'reserve' the 2s by choosing which variable gets them; that double counts.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "x1 + x2 + x3 + x4 = 20, xi >= 2",
            },
            {
              expr: "y1 + y2 + y3 + y4 = 12, yi >= 0",
              note: "20 - 4*2 = 12",
            },
            {
              expr: "C(15, 3) = 455",
            },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Upper bounds need inclusion-exclusion",
        bullets: [
          "A cap xi <= c has no substitution fix, so count everything and remove the violators.",
          "Force a violation with xi = c + 1 + zi: that eats c + 1 units, then stars and bars again.",
          "Alternate signs: subtract single violations, add back double violations, and so on.",
          "Before expanding, check whether two violations can even fit; usually 2(c + 1) > n and the series stops early.",
        ],
      },
      {
        type: "example",
        heading: "A capped equation",
        prompt:
          "How many ordered triples (x, y, z) of integers satisfy x + y + z = 15 with 0 <= x, y, z <= 6?",
        bullets: [
          "Ignore the caps: C(15 + 2, 2) = C(17, 2) = 136.",
          "One variable >= 7: fix 7 units, leaving sum 8, giving C(10, 2) = 45 each, so 3 * 45 = 135.",
          "Two variables >= 7: fix 14 units, leaving sum 1, giving C(3, 2) = 3 each, and 3 pairs, so 9.",
          "Answer: 136 - 135 + 9 = 10, confirmed by the complement x' = 6 - x, where x' + y' + z' = 3 gives C(5, 2) = 10.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "total = C(17, 2) = 136",
            },
            {
              expr: "- 3 * C(10, 2) = -135",
              note: "one cap broken",
            },
            {
              expr: "+ 3 * C(3, 2) = +9",
              note: "two caps broken",
            },
            {
              expr: "= 10",
            },
          ],
        },
      },
      {
        type: "pitfall",
        heading: "Where stars and bars is the wrong tool",
        bullets: [
          "Distinct objects into distinct boxes is k^n, not C(n + k - 1, k - 1); stars are identical by assumption.",
          "Identical boxes needs partitions: 3 identical balls into 3 identical boxes gives only 3 ways (3+0+0, 2+1+0, 1+1+1), not 10.",
          "Dividing by k! is legal only when every outcome is produced exactly k! times, which fails whenever entries repeat.",
          "If a problem says 'at least one in each box' you want positive solutions, C(n - 1, k - 1), not the nonnegative count.",
        ],
      },
      {
        type: "text",
        heading: "Decide what an arrangement is first",
        bullets: [
          "Answer three questions: are the objects distinguishable, are the slots distinguishable, does order matter?",
          "Write one concrete outcome on paper and ask how many times your counting procedure generates it.",
          "If the answer is the same number d for every outcome, divide by d; if it varies, split into cases instead.",
          "Repetition allowed with order ignored is a multiset, which is exactly the stars and bars setting.",
        ],
      },
      {
        type: "example",
        heading: "Same objects, two different counts",
        prompt:
          "A sundae uses 4 scoops chosen from 6 flavors, repeats allowed. Count it (a) as an unordered pile, (b) as an ordered stack.",
        bullets: [
          "(a) Unordered means a multiset: solutions of n1 + ... + n6 = 4 with ni >= 0, so C(4 + 5, 5) = C(9, 5) = 126.",
          "(b) Ordered means each of 4 positions picks a flavor independently: 6^4 = 1296.",
          "The two differ by no fixed factor: the all-same pile is counted once in (b), while four distinct flavors are counted 4! = 24 times.",
          "That is exactly why you cannot get (a) from (b) by dividing by 4!.",
        ],
      },
      {
        type: "practice",
        heading: "Your turn",
        prompt:
          "How many ordered triples (a, b, c) of positive integers satisfy a + b + c = 20 with a <= 9, b <= 9, and c <= 9?",
        answer: "36",
      },
      {
        type: "summary",
        heading: "What to carry away",
        bullets: [
          "Nonnegative solutions: C(n + k - 1, k - 1); positive solutions: C(n - 1, k - 1).",
          "Lower bounds are handled by substitution; upper bounds by inclusion-exclusion on forced violations.",
          "Check the parity of the correction terms and stop as soon as more violations cannot fit in n.",
          "Classify objects, slots, and order before writing a formula, and divide only by a uniform overcount.",
        ],
      },
    ],
  },
  {
    slug: "inclusion-exclusion-advanced",
    title: "Inclusion-Exclusion II: Three Sets and Beyond",
    topicSlug: "inclusion-exclusion",
    difficulty: 8,
    durationMinutes: 9,
    summary:
      "Extends inclusion-exclusion to three or more sets, applies it to counting surjections and derangements, and shows when counting the complement is the faster route.",
    scenes: [
      {
        type: "title",
        heading: "Inclusion-Exclusion II: Three Sets and Beyond",
        sub: "Alternating signs, surjections, derangements, and the complement shortcut",
      },
      {
        type: "text",
        heading: "The Signed-Sum Pattern",
        bullets: [
          "Add all singles, subtract all pairs, add the triple: signs alternate by the number of sets in the term.",
          "For n sets there are C(n,1) + C(n,2) + ... + C(n,n) terms, and the sign of a k-set term is (-1)^(k+1).",
          "Every element in exactly m of the sets is counted m - C(m,2) + C(m,3) - ... = 1 time, which is why the formula works.",
          "In practice you only need the intersections you can actually compute, so set up the six pieces before touching arithmetic.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "|A u B u C| = |A| + |B| + |C|",
              note: "singles: plus",
            },
            {
              expr: "   - |A n B| - |A n C| - |B n C|",
              note: "pairs: minus",
            },
            {
              expr: "   + |A n B n C|",
              note: "triple: plus",
            },
          ],
        },
      },
      {
        type: "example",
        heading: "Divisibility with Three Sets",
        prompt:
          "How many integers from 1 to 1000 are divisible by none of 2, 3, 5?",
        bullets: [
          "Singles: floor(1000/2) = 500, floor(1000/3) = 333, floor(1000/5) = 200.",
          "Pairs use lcm: floor(1000/6) = 166, floor(1000/10) = 100, floor(1000/15) = 66.",
          "Triple: floor(1000/30) = 33, so the union is 1033 - 332 + 33 = 734.",
          "Answer: 1000 - 734 = 266 integers are divisible by none of them.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "500 + 333 + 200 = 1033",
            },
            {
              expr: "166 + 100 + 66 = 332",
            },
            {
              expr: "|union| = 1033 - 332 + 33 = 734",
            },
            {
              expr: "1000 - 734 = 266",
              note: "the final count",
            },
          ],
        },
      },
      {
        type: "strategy",
        heading: "When to Flip to the Complement",
        bullets: [
          "If the condition reads 'at least one', the complement reads 'none', which is usually one clean product.",
          "Flip when the total is a friendly number like 10^n, n!, or C(n,k) and the bad set is structured.",
          "Stay direct when the complement itself breaks into overlapping cases of the same difficulty.",
          "A hybrid is common at AIME level: take the complement first, then run inclusion-exclusion inside it.",
        ],
      },
      {
        type: "example",
        heading: "Surjections by Inclusion-Exclusion",
        prompt:
          "How many functions from a 6-element set onto a 3-element set are there (every box nonempty)?",
        bullets: [
          "Let A_i be the functions that miss target i; we want 3^6 - |A_1 u A_2 u A_3|.",
          "Each |A_i| = 2^6 = 64, each |A_i n A_j| = 1^6 = 1, and the triple intersection is empty.",
          "Count = 3^6 - 3(2^6) + 3(1^6) = 729 - 192 + 3 = 540.",
          "General form: surjections from n onto k equal sum over i of (-1)^i C(k,i) (k-i)^n.",
          "Check: 540 = 3! * S(6,3) = 6 * 90, matching the Stirling-number route.",
        ],
      },
      {
        type: "text",
        heading: "Derangements Are the Same Formula",
        bullets: [
          "Let A_i be the permutations fixing position i; then D_n = n! - |A_1 u ... u A_n| = n! * sum (-1)^k / k!.",
          "Memorize D_1 = 0, D_2 = 1, D_3 = 2, D_4 = 9, D_5 = 44, D_6 = 265, D_7 = 1854.",
          "Recurrence D_n = (n-1)(D_(n-1) + D_(n-2)) rebuilds the table fast under time pressure.",
          "Permutations of n with exactly k fixed points number C(n,k) * D_(n-k): choose the fixed set, derange the rest.",
        ],
      },
      {
        type: "example",
        heading: "Exactly k Fixed Points",
        prompt:
          "Of the 720 permutations of 1..6, how many have exactly 2 fixed points?",
        bullets: [
          "Choose which 2 elements stay put: C(6,2) = 15 ways.",
          "The other 4 must have no fixed point: D_4 = 9 ways.",
          "Answer: 15 * 9 = 135 permutations.",
          "Summing C(6,k) * D_(6-k) over k = 0..6 gives 265 + 264 + 135 + 40 + 15 + 0 + 1 = 720, a built-in check.",
        ],
        diagram: {
          kind: "bars",
          total: 720,
          segments: [
            {
              label: "0 fixed",
              value: 265,
              tone: "brand",
            },
            {
              label: "1 fixed",
              value: 264,
              tone: "slate",
            },
            {
              label: "2 fixed",
              value: 135,
              tone: "success",
            },
            {
              label: "3 fixed",
              value: 40,
              tone: "slate",
            },
            {
              label: "4 fixed",
              value: 15,
              tone: "warning",
            },
            {
              label: "6 fixed",
              value: 1,
              tone: "slate",
            },
          ],
          note: "5 fixed points is impossible, so that bar is 0.",
        },
      },
      {
        type: "pitfall",
        heading: "Where Points Get Lost",
        bullets: [
          "Pair intersections for divisibility use the lcm, not the product: with 4 and 6 the overlap is multiples of 12, not 24.",
          "'At least one' is the union; 'exactly one' is sum|A_i| - 2*sum|A_i n A_j| + 3|A n B n C|, a different formula.",
          "In the surjection formula the exponent stays n: it is C(k,i)(k-i)^n, never n^(k-i).",
          "D_n is the nearest integer to n!/e, so n!/e alone is not an exact answer.",
          "After computing a union, re-read the question: often the wanted value is total minus union.",
        ],
      },
      {
        type: "practice",
        heading: "Your Turn",
        prompt:
          "In how many ways can 7 distinct toys be placed into 3 distinct bins so that no bin is empty?",
        answer: "1806",
      },
      {
        type: "summary",
        heading: "Takeaways",
        bullets: [
          "Three-set PIE: add singles, subtract the three pairs, add the triple.",
          "Surjections from n onto k: sum over i of (-1)^i C(k,i) (k-i)^n, a direct PIE on missed targets.",
          "Derangements: D_n = n!*sum(-1)^k/k!, with exactly k fixed points given by C(n,k)*D_(n-k).",
          "When the condition says 'at least one' or 'none', count the complement before expanding anything.",
          "Always sanity-check by summing all cases back to the known total.",
        ],
      },
    ],
  },
];
