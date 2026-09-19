import type { ProblemSeed } from "./problems";

/**
 * Hand-written problems styled after the AIME (American Invitational
 * Mathematics Examination).
 *
 * AIME problems are integer-answer only (0-999), no calculator, and ramp
 * steeply in difficulty: problems 1-5 are hard-AMC12 level, 6-10 require
 * a clean multi-step insight, and 11-15 (mapped here to problems 16-20)
 * are olympiad-adjacent, often hinging on a single non-obvious trick or
 * substitution that forces an irrational or fractional intermediate
 * result down to a clean three-digit integer. Every problem below is
 * original NumberSmith content, independently re-derived and numerically
 * verified; none are transcribed from any real AIME.
 *
 * Seeded as practice (isPlacement: false), same as the other
 * competition-tagged problem sets. Difficulty ramps from 7 (problem 1)
 * to 10 (problem 20).
 */
export const AIME_PROBLEMS: ProblemSeed[] = [
  {
    slug: "aime-01",
    question:
      "Let a and b be real numbers such that a + b = 6 and a^3 + b^3 = 100. The value of a^2 + b^2 can be written as p/q, where p and q are relatively prime positive integers. Find p + q.",
    format: "INTEGER",
    answer: "217",
    solution:
      "Expand (a+b)^3 = a^3 + b^3 + 3ab(a+b): 216 = 100 + 3ab(6) = 100 + 18ab, so 18ab = 116 and ab = 58/9. " +
      "Then a^2 + b^2 = (a+b)^2 - 2ab = 36 - 116/9 = (324 - 116)/9 = 208/9. Since 208 = 16·13 shares no factor with 9, " +
      "this fraction is already in lowest terms, so p + q = 208 + 9 = 217.",
    hints: [
      "You don't need a and b individually — express a^3+b^3 in terms of the symmetric sums a+b and ab using the identity (a+b)^3 = a^3+b^3+3ab(a+b).",
      "Once you know ab, use a^2+b^2 = (a+b)^2 - 2ab.",
    ],
    difficulty: 7,
    topicSlug: "quadratics",
    competitionSlug: "aime",
  },
  {
    slug: "aime-02",
    question:
      "Find the number of ordered pairs of positive integers (a, b) with a > b such that a^2 - b^2 = 2024.",
    format: "INTEGER",
    answer: "4",
    solution:
      "Factor a^2 - b^2 = (a-b)(a+b) = 2024. Since a-b and a+b have the same parity and their product 2024 is even, " +
      "both must be even. Write a - b = 2m and a + b = 2n with m < n, so 4mn = 2024, i.e. mn = 506 = 2·11·23. " +
      "The divisors of 506 are 1, 2, 11, 22, 23, 46, 253, 506, giving exactly 4 factor pairs (m,n) with m < n: " +
      "(1,506), (2,253), (11,46), (22,23). Each yields a valid positive integer pair (a,b) = (m+n, n-m). So there are 4 ordered pairs.",
    hints: [
      "Factor the difference of squares and note a-b and a+b must share the same parity.",
      "Since 2024 is even, both factors must be even — substitute a-b=2m, a+b=2n and count divisor pairs of 2024/4.",
    ],
    difficulty: 7,
    topicSlug: "factoring",
    competitionSlug: "aime",
  },
  {
    slug: "aime-03",
    question: "Find the remainder when 7^2024 is divided by 1000.",
    format: "INTEGER",
    answer: "401",
    solution:
      "Work modulo 8 and modulo 125 and combine with CRT. Modulo 8: 7 ≡ -1, so 7^2024 ≡ (-1)^2024 ≡ 1 (mod 8). " +
      "Modulo 125: the order of 7 divides φ(125)=100, and 2024 ≡ 24 (mod 100), so we need 7^24 mod 125. " +
      "Compute successive squares: 7^2=49, 7^4=2401≡26, 7^8≡26^2=676≡51, 7^16≡51^2=2601≡101 (all mod 125). " +
      "Then 7^24 = 7^16·7^8 ≡ 101·51 = 5151 ≡ 26 (mod 125). Now solve x ≡ 26 (mod 125), x ≡ 1 (mod 8). " +
      "Writing x = 26 + 125k, note 125 ≡ 5 (mod 8) and 26 ≡ 2 (mod 8), so 2 + 5k ≡ 1 (mod 8), giving 5k ≡ 7 (mod 8); " +
      "since 5·5≡1 (mod 8), k ≡ 35 ≡ 3 (mod 8). Taking k=3 gives x = 26 + 375 = 401.",
    hints: [
      "Split modulo 1000 into modulo 8 and modulo 125 (since 1000 = 8·125) and use the Chinese Remainder Theorem.",
      "Reduce the exponent 2024 using the order of 7 modulo 125, which divides φ(125) = 100.",
    ],
    difficulty: 7,
    topicSlug: "modular-arithmetic",
    competitionSlug: "aime",
  },
  {
    slug: "aime-04",
    question:
      "Ten people sit around a round table. In how many ways can 4 of them be chosen to form a subcommittee such that no two chosen people are sitting next to each other?",
    format: "INTEGER",
    answer: "25",
    solution:
      "The number of ways to choose k non-adjacent seats from n arranged in a circle is (n/(n-k))·C(n-k, k). " +
      "Here n=10, k=4, so the count is (10/6)·C(6,4) = (10/6)·15 = 25. " +
      "(Equivalently: place the 6 unchosen people around the circle, creating 6 gaps between consecutive unchosen people, " +
      "and choose 4 of those 6 gaps to insert one of the chosen people each — C(6,4) = 15 — then account for the circular " +
      "rotation-overcounting factor 10/6, which correctly gives 25 distinct subcommittees.)",
    hints: [
      "First seat the 6 people who are NOT chosen around the table — this creates gaps between them.",
      "Use the circular non-adjacent-selection formula (n/(n-k))·C(n-k,k), or verify directly by casework on gap placement.",
    ],
    difficulty: 7,
    topicSlug: "counting-principles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-05",
    question:
      "In triangle ABC, AB = 13, BC = 14, CA = 15. The angle bisector from A meets BC at D. AD^2 can be written as p/q where p and q are relatively prime positive integers. Find p + q.",
    format: "INTEGER",
    answer: "589",
    solution:
      "By the angle bisector length formula, t_a^2 = bc[1 - (a/(b+c))^2], where a=BC=14, b=CA=15, c=AB=13. " +
      "So AD^2 = 15·13·[1 - (14/28)^2] = 195·[1 - 1/4] = 195·(3/4) = 585/4. " +
      "Since 585 = 3^2·5·13 is odd, gcd(585,4)=1, so this fraction is already in lowest terms and p+q = 585+4 = 589.",
    hints: [
      "Use the angle bisector length formula t_a^2 = bc[1-(a/(b+c))^2], or equivalently AD^2 = AB·AC - BD·DC via Stewart's theorem.",
      "Find BD and DC first using the angle bisector ratio BD/DC = AB/AC = 13/15 together with BD+DC=14.",
    ],
    difficulty: 7,
    topicSlug: "triangles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-06",
    question:
      "Cyclic quadrilateral ABCD has AB=3, BC=4, CD=5, DA=6. AC^2 can be written as m/n where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "254",
    solution:
      "Apply the Law of Cosines to triangles ABC and ACD along diagonal AC, using that angle B and angle D are " +
      "supplementary in a cyclic quadrilateral (so cos D = -cos B): AC^2 = AB^2+BC^2-2·AB·BC·cos B = 9+16-24cos B, " +
      "and AC^2 = CD^2+DA^2+2·CD·DA·cos B = 25+36+60cos B. Setting these equal: 25 - 24cos B = 61 + 60cos B, " +
      "so -36 = 84cos B, giving cos B = -3/7. Then AC^2 = 25 - 24(-3/7) = 25 + 72/7 = (175+72)/7 = 247/7. " +
      "Since 247 = 13·19 shares no factor with 7, m+n = 247+7 = 254.",
    hints: [
      "Write AC^2 two ways using the Law of Cosines in triangles ABC and ACD, sharing diagonal AC.",
      "In a cyclic quadrilateral, opposite angles are supplementary, so cos D = -cos B — set the two expressions for AC^2 equal and solve for cos B.",
    ],
    difficulty: 8,
    topicSlug: "circles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-07",
    question:
      "A sequence satisfies a_1 = 1, a_2 = 1, and a_{n+2} = a_{n+1} + a_n + 1 for all n ≥ 1. Find the remainder when a_20 is divided by 1000.",
    format: "INTEGER",
    answer: "529",
    solution:
      "Let c_n = a_n + 1. Then c_{n+2} - 1 = (c_{n+1}-1) + (c_n-1) + 1, which simplifies to c_{n+2} = c_{n+1} + c_n — " +
      "c_n satisfies the Fibonacci recurrence. Since c_1 = a_1+1 = 2 and c_2 = a_2+1 = 2, we get c_n = 2F(n), " +
      "where F is the standard Fibonacci sequence (F(1)=F(2)=1). Since F(20) = 6765, c_20 = 13530, so " +
      "a_20 = c_20 - 1 = 13529. The remainder when 13529 is divided by 1000 is 529.",
    hints: [
      "The '+1' in the recurrence suggests a substitution — try c_n = a_n + k for a constant k that eliminates the extra term.",
      "With the right shift, c_n satisfies the plain Fibonacci recurrence c_{n+2}=c_{n+1}+c_n; find its initial terms and use F(20)=6765.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "aime",
  },
  {
    slug: "aime-08",
    question:
      "Four fair six-sided dice are rolled. Given that their sum is 20, the probability that at least one die shows a 6 can be written as m/n where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "69",
    solution:
      "Count ordered quadruples (d1,d2,d3,d4) with each 1≤di≤6 and sum 20. Substitute ei=6-di, so each ei∈[0,5] and " +
      "e1+e2+e3+e4 = 24-20 = 4. Since the ei's sum to only 4, no individual ei can exceed 5 anyway, so the upper bound " +
      "is automatically satisfied and the count is just the number of nonnegative integer solutions to a sum of 4: " +
      "C(4+3,3) = C(7,3) = 35 quadruples total. Now count quadruples with sum 20 using only faces 1 through 5 (no 6's): " +
      "since the maximum possible sum using four values from 1-5 is 5+5+5+5=20, the only way to reach exactly 20 is " +
      "for every die to show 5 — exactly 1 quadruple. So 35-1 = 34 quadruples contain at least one 6, giving probability " +
      "34/35, already in lowest terms since 35=5·7 shares no factor with 34=2·17. Thus m+n = 34+35 = 69.",
    hints: [
      "First find the total number of ways for four dice to sum to 20 — it may be easier to count the 'shortfall' from the maximum sum of 24.",
      "Then subtract the ways to sum to 20 using only faces 1 through 5 (no sixes) — check how tightly constrained that is.",
    ],
    difficulty: 8,
    topicSlug: "conditional-probability",
    competitionSlug: "aime",
  },
  {
    slug: "aime-09",
    question: "Find the sum of all positive integers n such that n^2 - 19n + 99 is a perfect square.",
    format: "INTEGER",
    answer: "38",
    solution:
      "Set n^2-19n+99 = k^2 and multiply by 4: (2n-19)^2 + 35 = 4k^2, so 4k^2 - (2n-19)^2 = 35, which factors as " +
      "(2k-(2n-19))(2k+(2n-19)) = 35. Let u=2k-2n+19 and w=2k+2n-19, so uw=35 and n=(w-u+38)/4. Checking all 8 integer " +
      "factorizations of 35 (both positive and both negative, since 35 is odd all factors are odd, keeping parity consistent): " +
      "(u,w) = (1,35),(5,7),(7,5),(35,1),(-1,-35),(-5,-7),(-7,-5),(-35,-1) give n = 18, 10, 9, 1, 1, 9, 10, 18 respectively. " +
      "The distinct positive integer values are n ∈ {1, 9, 10, 18}, and their sum is 1+9+10+18 = 38.",
    hints: [
      "Complete the square and multiply by 4 to turn the equation into a difference of squares: 4k^2 - (2n-19)^2 = 35.",
      "Factor the difference of squares and check all integer factor pairs of 35, including negative ones.",
    ],
    difficulty: 8,
    topicSlug: "number-patterns",
    competitionSlug: "aime",
  },
  {
    slug: "aime-10",
    question:
      "A lattice hexagon has vertices (0,0), (12,0), (12,8), (8,8), (8,12), (0,12), in order. Find the number of lattice points strictly inside the hexagon.",
    format: "INTEGER",
    answer: "105",
    solution:
      "Use Pick's theorem: Area = I + B/2 - 1, so I = Area - B/2 + 1. Compute the area with the shoelace formula: " +
      "listing the vertices in order and applying the shoelace sum gives an area of 128. Compute the boundary lattice " +
      "point count B by summing gcd(|Δx|,|Δy|) over each edge: the six edges have lengths (12,0),(0,8),(4,0),(0,4),(8,0),(0,12), " +
      "contributing gcd's 12+8+4+4+8+12 = 48 boundary points. Then I = 128 - 48/2 + 1 = 128 - 24 + 1 = 105.",
    hints: [
      "Compute the area with the shoelace formula, then count boundary lattice points by summing gcd(|Δx|,|Δy|) along each edge.",
      "Apply Pick's Theorem, Area = I + B/2 - 1, and solve for the interior count I.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-11",
    question:
      "Find the number of ways to distribute 10 identical balls into 4 distinguishable boxes so that each box contains at least 1 ball and at most 4 balls.",
    format: "INTEGER",
    answer: "44",
    solution:
      "We need ordered 4-tuples (a,b,c,d) with 1≤a,b,c,d≤4 and a+b+c+d=10. Substitute a'=a-1, etc., so 0≤a',b',c',d'≤3 " +
      "and a'+b'+c'+d'=6. By inclusion-exclusion on the generating function (1+x+x^2+x^3)^4, the coefficient of x^6 is: " +
      "unrestricted solutions to a'+b'+c'+d'=6 in nonnegative integers is C(9,3)=84; subtract cases where some variable exceeds 3 " +
      "(i.e. ≥4): for each of the 4 variables, substituting a''=a'-4 gives C(5,3)=10 solutions, times 4 variables = 40; " +
      "no two variables can simultaneously exceed 3 since that would need sum ≥8>6, so no further correction. " +
      "Total: 84 - 40 = 44.",
    hints: [
      "Shift variables so each box's count ranges from 0 to 3, turning it into counting solutions of a bounded stars-and-bars equation.",
      "Use inclusion-exclusion: count all nonnegative solutions, then subtract the cases where some box's shifted count is 4 or more.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-12",
    question:
      "A function f: Z → Z satisfies f(x+y) = f(x) + f(y) + xy for all integers x, y, and f(1) = 1. Find f(20).",
    format: "INTEGER",
    answer: "210",
    solution:
      "Setting y=1: f(x+1) = f(x) + f(1) + x = f(x) + x + 1. So f telescopes: f(n) = f(1) + sum_{k=1}^{n-1}(k+1) " +
      "= 1 + [sum_{k=1}^{n-1} k + (n-1)] = 1 + (n-1)n/2 + (n-1). For n=20: (n-1)n/2 = 19·20/2 = 190 and n-1=19, " +
      "so f(20) = 1 + 190 + 19 = 210.",
    hints: [
      "Plug in y=1 to get a recurrence relating f(x+1) to f(x).",
      "Telescope the recurrence from f(1) up to f(20), summing the resulting arithmetic terms.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-13",
    question:
      "Find the smallest positive integer n such that 3^n ≡ 1 (mod 1000).",
    format: "INTEGER",
    answer: "100",
    solution:
      "By CRT, the order of 3 mod 1000 is the lcm of the orders of 3 mod 8 and mod 125. Modulo 8: 3^2=9≡1, so the " +
      "order is 2. Modulo 125: 3 is a primitive root mod 5 (3^1=3, 3^2=4, 3^3=2, 3^4=1, order 4 = φ(5)), and since " +
      "3^4 = 81 ≡ 6 (mod 25) is not ≡ 1 (mod 25), the order does not collapse at higher powers of 5 (by the standard " +
      "lifting-the-exponent behavior for orders), so the order of 3 modulo 5^k equals 4·5^{k-1}. For k=3 (i.e. mod 125), " +
      "the order is 4·25 = 100. So the overall order mod 1000 is lcm(2,100) = 100.",
    hints: [
      "Split into the order modulo 8 and modulo 125 separately, then combine with lcm (via the Chinese Remainder Theorem).",
      "3 is a primitive root modulo 5; check whether that order survives (or grows by a factor of 5) at each higher power of 5.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-14",
    question:
      "A cone has height 12. A plane parallel to the base divides the cone into two pieces (a smaller cone on top and a frustum below) of equal volume. Let h be the height of the smaller cone, measured from the apex. Find h^3.",
    format: "INTEGER",
    answer: "864",
    solution:
      "The small cone at the top is similar to the full cone with linear scale factor k = h/12, so its volume is k^3 " +
      "times the full cone's volume V. The condition that the top piece and the frustum have equal volume means the top " +
      "cone's volume is V/2, so k^3 = 1/2. Then h^3 = 12^3 · k^3 = 1728 · (1/2) = 864. (Note h itself is irrational — " +
      "h = 12/2^(1/3) — but the problem is engineered so that h^3 is a clean integer.)",
    hints: [
      "The small cone at the top is similar to the whole cone — its volume scales as the cube of the height ratio.",
      "Set the small cone's volume equal to half the total volume and solve for (h/12)^3, then scale up by 12^3.",
    ],
    difficulty: 9,
    topicSlug: "area-volume",
    competitionSlug: "aime",
  },
  {
    slug: "aime-15",
    question:
      "Find the number of ways to color the vertices of a hexagon (6 vertices arranged in a cycle) using 3 colors so that no two adjacent vertices share the same color.",
    format: "INTEGER",
    answer: "66",
    solution:
      "The chromatic polynomial of a cycle graph C_n with k colors is (k-1)^n + (-1)^n(k-1). For n=6, k=3: " +
      "(3-1)^6 + (-1)^6(3-1) = 2^6 + 2 = 64 + 2 = 66. " +
      "(This can also be derived directly: color vertex 1 in 3 ways, then each subsequent vertex around the cycle in 2 ways " +
      "avoiding its predecessor — giving 3·2^5 = 96 for a path — then correct via inclusion-exclusion for the wraparound " +
      "constraint that vertex 6 must also differ from vertex 1, yielding the same recurrence that produces 66.)",
    hints: [
      "First count colorings of a path of 6 vertices (no wraparound constraint) — that's straightforward.",
      "Use the cycle chromatic polynomial (k-1)^n + (-1)^n(k-1), or correct the path count for the extra adjacency between the first and last vertex.",
    ],
    difficulty: 9,
    topicSlug: "graph-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-16",
    question:
      "Find the number of positive integers n ≤ 1000 that are not divisible by any of 2, 3, 5, or 7.",
    format: "INTEGER",
    answer: "228",
    solution:
      "By inclusion-exclusion on divisibility by 2, 3, 5, 7 among 1..1000: single terms sum to " +
      "⌊1000/2⌋+⌊1000/3⌋+⌊1000/5⌋+⌊1000/7⌋ = 500+333+200+142 = 1175. Pairwise terms: ⌊1000/6⌋+⌊1000/10⌋+⌊1000/14⌋+⌊1000/15⌋+⌊1000/21⌋+⌊1000/35⌋ " +
      "= 166+100+71+66+47+28 = 478. Triple terms: ⌊1000/30⌋+⌊1000/42⌋+⌊1000/70⌋+⌊1000/105⌋ = 33+23+14+9 = 79. " +
      "Quadruple term: ⌊1000/210⌋ = 4. By inclusion-exclusion, the count divisible by at least one of 2,3,5,7 is " +
      "1175 - 478 + 79 - 4 = 772. So the count divisible by none is 1000 - 772 = 228.",
    hints: [
      "Use inclusion-exclusion over the four divisibility conditions, counting multiples of each number and each pairwise/triple/quadruple LCM up to 1000.",
      "Subtract the inclusion-exclusion total (divisible by at least one) from 1000.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "aime",
  },
  {
    slug: "aime-17",
    question: "Find the number of ordered pairs of positive integers (x, y) satisfying 1/x + 1/y = 1/12.",
    format: "INTEGER",
    answer: "15",
    solution:
      "Multiply through by 12xy: 12y + 12x = xy, so xy - 12x - 12y = 0, and adding 144 to both sides: " +
      "(x-12)(y-12) = 144. Since x,y are positive integers with 1/x < 1/12 forcing x>12 (similarly y>12), " +
      "x-12 and y-12 must be positive divisors of 144. Since 144 = 2^4·3^2 has (4+1)(2+1) = 15 positive divisors, " +
      "there are exactly 15 ways to choose x-12 (which then determines y-12 = 144/(x-12)), giving 15 ordered pairs (x,y).",
    hints: [
      "Clear denominators and rearrange into a form that factors — try adding a constant to both sides to complete a product.",
      "Once you have (x-12)(y-12)=144, count the divisors of 144.",
    ],
    difficulty: 9,
    topicSlug: "diophantine-equations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-18",
    question:
      "Find the number of lattice paths from (0,0) to (10,10), using unit steps right and up, that touch the line y=x only at the endpoints (0,0) and (10,10). Find the remainder when this number is divided by 1000.",
    format: "INTEGER",
    answer: "724",
    solution:
      "By symmetry, count paths that stay strictly below the diagonal (except at the endpoints) and double. The number " +
      "of such paths from (0,0) to (n,n) is the Catalan number C_{n-1} (a standard reflection/cycle-lemma result), so " +
      "the total (both above and below) is 2·C_9. Since C_9 = 4862 (Catalan numbers: 1,1,2,5,14,42,132,429,1430,4862,...), " +
      "the total is 2·4862 = 9724. The remainder when 9724 is divided by 1000 is 724.",
    hints: [
      "Split into paths that stay strictly below the diagonal and paths that stay strictly above — by symmetry these counts are equal.",
      "The number of paths from (0,0) to (n,n) touching y=x only at the endpoints, on one side, is a Catalan number C_{n-1}; use C_9=4862.",
    ],
    difficulty: 10,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "aime",
  },
  {
    slug: "aime-19",
    question:
      "Tetrahedron ABCD has AB=CD=13, AC=BD=14, AD=BC=15. The volume of the tetrahedron can be written as m√n, where n is not divisible by the square of any prime. Find m+n.",
    format: "INTEGER",
    answer: "97",
    solution:
      "This is an isosceles (orthocentric) tetrahedron, which can be inscribed in a rectangular box of dimensions p×q×r " +
      "so that AB,CD correspond to one face-diagonal pair, etc.: p^2+q^2=13^2=169, p^2+r^2=14^2=196, q^2+r^2=15^2=225. " +
      "Adding all three: 2(p^2+q^2+r^2)=590, so p^2+q^2+r^2=295, giving p^2=70, q^2=99, r^2=126. " +
      "The tetrahedron's volume equals 1/3 of the box's volume (the box minus four corner tetrahedra each of volume (1/6)pqr " +
      "leaves (1/3)pqr). Now (pqr)^2 = 70·99·126 = 873180 = 2^2·3^4·5·7^2·11, so pqr = 2·9·7·√(5·11) = 126√55. " +
      "Thus the volume is (1/3)(126√55) = 42√55. Since 55=5·11 is squarefree, m+n = 42+55 = 97.",
    hints: [
      "A tetrahedron with each pair of opposite edges equal (an isosceles tetrahedron) can always be inscribed in a rectangular box, with each edge a face diagonal.",
      "Set up three equations for the box's squared dimensions from the three edge lengths, solve for p^2, q^2, r^2, and use that the tetrahedron's volume is exactly 1/3 of the box's volume.",
    ],
    difficulty: 10,
    topicSlug: "three-d-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-20",
    question:
      "Let x, y, z be positive real numbers with x+y+z=10 and xy+yz+zx=25. The maximum possible value of xyz can be written as m/n, where m and n are relatively prime positive integers. Find m+n.",
    format: "INTEGER",
    answer: "527",
    solution:
      "For fixed p=x+y+z and q=xy+yz+zx, the extreme values of xyz over real x,y,z occur exactly when two of the " +
      "variables are equal (the boundary of the region where x,y,z are all real, given by the cubic t^3-pt^2+qt-r=0 having " +
      "a repeated root). Set x=y=t, z=10-2t. Then q = t^2+2t(10-2t) = 20t-3t^2 = 25, giving 3t^2-20t+25=0, so " +
      "t = (20±√(400-300))/6 = (20±10)/6, i.e. t=5 or t=5/3. For t=5: z=0 (not positive — this is the infimum, approached " +
      "but not attained with z>0). For t=5/3: z=10-10/3=20/3>0, and xyz = t^2·z = (25/9)(20/3) = 500/27, which is attained " +
      "at a genuine interior point and is therefore the maximum. Since gcd(500,27)=1 (500=2^2·5^3, 27=3^3), m+n = 500+27 = 527.",
    hints: [
      "With x+y+z and xy+yz+zx both fixed, the extreme values of xyz over positive reals occur when two of the variables are equal — reduce to one variable.",
      "Set x=y=t, express z and the constraint xy+yz+zx=25 in terms of t, solve the resulting quadratic, and check which root gives a valid positive z.",
    ],
    difficulty: 10,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "aime",
  },

// ---------------------------------------------------------------------
  // Difficulty 6 (aime-21..aime-31)
  // ---------------------------------------------------------------------
  {
    slug: "aime-21",
    question:
      "Let x and y be positive real numbers such that x + y = 8 and x^2 + y^2 = 40. Find x^3 + y^3.",
    format: "INTEGER",
    answer: "224",
    solution:
      "From (x+y)^2 = x^2+y^2+2xy: 64 = 40 + 2xy, so xy = 12. " +
      "Then x^3+y^3 = (x+y)^3 - 3xy(x+y) = 512 - 3(12)(8) = 512 - 288 = 224.",
    hints: [
      "Find xy first using (x+y)^2 = x^2+y^2+2xy.",
      "Use the identity x^3+y^3 = (x+y)^3 - 3xy(x+y).",
    ],
    difficulty: 6,
    topicSlug: "quadratics",
    competitionSlug: "aime",
  },
  {
    slug: "aime-22",
    question: "Find the remainder when 13^41 is divided by 1000.",
    format: "INTEGER",
    answer: "813",
    solution:
      "Split modulo 1000 = 8·125 and combine with CRT. Modulo 8: 13≡5, and 5^2=25≡1 (mod 8), so " +
      "since 41 is odd, 13^41 ≡ 5^41 ≡ 5 (mod 8). Modulo 125: compute by repeated squaring — " +
      "13^2=169≡44, 13^4≡44^2=1936≡61, 13^8≡61^2=3721≡96, 13^16≡96^2=9216≡91, 13^32≡91^2=8281≡31 (all mod 125). " +
      "Since 41=32+8+1, 13^41 ≡ 31·96·13 (mod 125). First 31·96=2976≡101, then 101·13=1313≡63 (mod 125). " +
      "Now solve x≡5 (mod 8), x≡63 (mod 125): write x=63+125k; since 125≡5 and 63≡7 (mod 8), " +
      "7+5k≡5 (mod 8) gives 5k≡6 (mod 8); as 5·5≡1 (mod 8), k≡5·6=30≡6 (mod 8). Taking k=6: x=63+750=813.",
    hints: [
      "Split modulo 1000 into modulo 8 and modulo 125 using the Chinese Remainder Theorem.",
      "Compute 13^41 mod 125 by repeated squaring, writing 41 = 32+8+1 in binary.",
    ],
    difficulty: 6,
    topicSlug: "modular-arithmetic",
    competitionSlug: "aime",
  },
  {
    slug: "aime-23",
    question: "Triangle ABC has side lengths AB = 9, BC = 10, CA = 17. Find the area of triangle ABC.",
    format: "INTEGER",
    answer: "36",
    solution:
      "By Heron's formula, s = (9+10+17)/2 = 18, and Area = √(18·9·8·1) = √1296 = 36.",
    hints: [
      "Compute the semiperimeter s = (a+b+c)/2.",
      "Apply Heron's formula: Area = √(s(s-a)(s-b)(s-c)).",
    ],
    difficulty: 6,
    topicSlug: "triangles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-24",
    question:
      "In how many ways can 3 books be selected from 8 distinct books and then arranged in a row on a shelf?",
    format: "INTEGER",
    answer: "336",
    solution:
      "This is a direct permutation count: there are 8 choices for the first book, 7 remaining for the " +
      "second, and 6 for the third, giving 8·7·6 = 336. (Equivalently, P(8,3) = 8!/5! = 336.)",
    hints: [
      "Selecting and arranging simultaneously is just counting ordered selections — a permutation.",
      "Multiply the number of choices for each of the 3 positions: 8 × 7 × 6.",
    ],
    difficulty: 6,
    topicSlug: "permutations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-25",
    question: "An arithmetic sequence has first term 5 and common difference 3. Find the sum of its first 20 terms.",
    format: "INTEGER",
    answer: "670",
    solution:
      "The sum of the first n terms of an arithmetic sequence is S_n = n/2·(2a_1+(n-1)d). " +
      "With a_1=5, d=3, n=20: S_20 = 10·(10+19·3) = 10·(10+57) = 10·67 = 670.",
    hints: [
      "Use the arithmetic series sum formula S_n = n/2·(2a_1 + (n-1)d).",
      "Plug in a_1=5, d=3, n=20 and simplify carefully.",
    ],
    difficulty: 6,
    topicSlug: "sequences",
    competitionSlug: "aime",
  },
  {
    slug: "aime-26",
    question: "A circle has radius 13. A chord of the circle has length 24. Find the distance from the center of the circle to the chord.",
    format: "INTEGER",
    answer: "5",
    solution:
      "The perpendicular from the center to a chord bisects it, forming a right triangle with hypotenuse " +
      "equal to the radius (13) and one leg equal to half the chord (12). The distance is the other leg: " +
      "√(13^2-12^2) = √(169-144) = √25 = 5.",
    hints: [
      "The perpendicular from the center to a chord bisects the chord, forming a right triangle.",
      "Use the Pythagorean theorem with hypotenuse = radius and one leg = half the chord length.",
    ],
    difficulty: 6,
    topicSlug: "circles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-27",
    question:
      "A bag contains 5 red balls and 3 blue balls. Two balls are drawn at random without replacement. The probability that both balls are the same color can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "41",
    solution:
      "Total ways to draw 2 balls from 8: C(8,2) = 28. Same-color ways: C(5,2) + C(3,2) = 10 + 3 = 13. " +
      "The probability is 13/28, and since 13 is prime and does not divide 28, this is already in lowest " +
      "terms. So m+n = 13+28 = 41.",
    hints: [
      "Count total ways to choose 2 balls from 8, then count the same-color ways separately for red and blue.",
      "Add the two same-color counts, form the probability, and check it's already in lowest terms.",
    ],
    difficulty: 6,
    topicSlug: "basic-probability",
    competitionSlug: "aime",
  },
  {
    slug: "aime-28",
    question: "Find the number of positive divisors of 2^5 · 3^3 · 5^2 that are perfect squares.",
    format: "INTEGER",
    answer: "12",
    solution:
      "A divisor 2^a·3^b·5^c (with 0≤a≤5, 0≤b≤3, 0≤c≤2) is a perfect square exactly when a, b, c are all " +
      "even. The even choices are a∈{0,2,4} (3 options), b∈{0,2} (2 options), c∈{0,2} (2 options). " +
      "Total: 3·2·2 = 12.",
    hints: [
      "A divisor is a perfect square exactly when every prime's exponent in it is even.",
      "Count the even choices independently for each prime's exponent range, then multiply.",
    ],
    difficulty: 6,
    topicSlug: "divisibility",
    competitionSlug: "aime",
  },
  {
    slug: "aime-29",
    question: "Find the area of the triangle with vertices (0,0), (12,0), and (5,9).",
    format: "INTEGER",
    answer: "54",
    solution:
      "The segment from (0,0) to (12,0) lies on the x-axis and has length 12, serving as the base. " +
      "The height is the perpendicular (vertical) distance from (5,9) to this base, which is 9. " +
      "Area = (1/2)·base·height = (1/2)·12·9 = 54.",
    hints: [
      "Use the segment from (0,0) to (12,0) as the base — it lies conveniently on the x-axis.",
      "The height is just the y-coordinate of the third vertex.",
    ],
    difficulty: 6,
    topicSlug: "coordinate-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-30",
    question:
      "The letters of the word NUMBER (6 distinct letters) are arranged in a row. Find the number of arrangements in which N and U are not adjacent.",
    format: "INTEGER",
    answer: "480",
    solution:
      "Total arrangements of 6 distinct letters: 6! = 720. Arrangements with N and U adjacent: glue them " +
      "into one block (which can be NU or UN, 2 internal orders), leaving 5 units to arrange: 5!·2 = 240. " +
      "Non-adjacent arrangements: 720 - 240 = 480.",
    hints: [
      "Count the complementary event first: arrangements where N and U ARE adjacent, by treating them as a single glued block.",
      "Subtract the adjacent count from the total number of arrangements, 6!.",
    ],
    difficulty: 6,
    topicSlug: "counting-principles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-31",
    question: "Find the sum of all positive integers n satisfying n^2 - 16n + 60 < 0.",
    format: "INTEGER",
    answer: "24",
    solution:
      "Factor: n^2-16n+60 = (n-6)(n-10). This product is negative exactly when 6 < n < 10, i.e. for the " +
      "integers n = 7, 8, 9. Their sum is 7+8+9 = 24.",
    hints: [
      "Factor the quadratic into two linear factors.",
      "A product of two factors is negative exactly when they have opposite signs — find that interval and list the integers in it.",
    ],
    difficulty: 6,
    topicSlug: "inequalities",
    competitionSlug: "aime",
  },

  // ---------------------------------------------------------------------
  // Difficulty 7 (aime-32..aime-42)
  // ---------------------------------------------------------------------
  {
    slug: "aime-32",
    question: "Positive real numbers x and y satisfy x + y = 14 and xy = 45. Find x^2 + y^2.",
    format: "INTEGER",
    answer: "106",
    solution: "x^2+y^2 = (x+y)^2 - 2xy = 196 - 90 = 106.",
    hints: [
      "You don't need x and y individually.",
      "Use x^2+y^2 = (x+y)^2 - 2xy directly.",
    ],
    difficulty: 7,
    topicSlug: "systems-of-equations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-33",
    question: "Find the sum of all prime numbers p such that p^2 + 2 is also prime.",
    format: "INTEGER",
    answer: "3",
    solution:
      "Check p=2: 2^2+2=6, not prime. Check p=3: 3^2+2=11, prime — so p=3 works. For any prime p>3, " +
      "p is not divisible by 3, so p^2 ≡ 1 (mod 3) (since the square of any integer not divisible by 3 is " +
      "≡1 mod 3). Then p^2+2 ≡ 1+2 ≡ 0 (mod 3), and since p^2+2 > 3, it is divisible by 3 and greater than " +
      "3, hence composite. So p=3 is the only prime that works, and the sum is 3.",
    hints: [
      "Test small primes directly first: p=2 and p=3.",
      "For any prime p>3, consider p^2 modulo 3 — every integer not divisible by 3 squares to 1 mod 3.",
    ],
    difficulty: 7,
    topicSlug: "primes",
    competitionSlug: "aime",
  },
  {
    slug: "aime-34",
    question: "Find the number of integers from 1 to 500, inclusive, that are divisible by 3 or 4, but not by 5.",
    format: "INTEGER",
    answer: "200",
    solution:
      "Count (divisible by 3, not 5) plus (divisible by 4, not 5) minus (divisible by 12, not 5), since " +
      "an integer divisible by both 3 and 4 is divisible by 12. Divisible by 3: ⌊500/3⌋=166; divisible by " +
      "15: ⌊500/15⌋=33; so divisible by 3 but not 5: 166-33=133. Divisible by 4: ⌊500/4⌋=125; divisible by " +
      "20: ⌊500/20⌋=25; so divisible by 4 but not 5: 125-25=100. Divisible by 12: ⌊500/12⌋=41; divisible by " +
      "60: ⌊500/60⌋=8; so divisible by 12 but not 5: 41-8=33. Total: 133+100-33 = 200.",
    hints: [
      "First remove multiples of 5 from each divisibility count separately: (divisible by 3, not 5) and (divisible by 4, not 5).",
      "Use inclusion-exclusion: add those two counts, then subtract (divisible by 12, not 5), since 12=lcm(3,4).",
    ],
    difficulty: 7,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "aime",
  },
  {
    slug: "aime-35",
    question:
      "Two circles with radii 25 and 5 have centers 29 apart. Find the length of their common external tangent.",
    format: "INTEGER",
    answer: "21",
    solution:
      "The length of a common external tangent between circles of radii R, r with centers distance d apart " +
      "is √(d^2-(R-r)^2). Here R=25, r=5, d=29: √(29^2-20^2) = √(841-400) = √441 = 21.",
    hints: [
      "Use the common external tangent length formula √(d^2 - (R-r)^2).",
      "Recognize 20 and 29 as part of a Pythagorean-style relationship with 21.",
    ],
    difficulty: 7,
    topicSlug: "circles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-36",
    question: "A geometric sequence has first term 2 and common ratio 3. Find the sum of its first 6 terms.",
    format: "INTEGER",
    answer: "728",
    solution:
      "The sum of the first n terms of a geometric sequence is a_1·(r^n-1)/(r-1). " +
      "Here a_1=2, r=3, n=6: 2·(3^6-1)/(3-1) = 2·(729-1)/2 = 729-1 = 728.",
    hints: [
      "Use the geometric series sum formula S_n = a_1(r^n-1)/(r-1).",
      "Compute 3^6=729 first, then finish the arithmetic.",
    ],
    difficulty: 7,
    topicSlug: "sequences",
    competitionSlug: "aime",
  },
  {
    slug: "aime-37",
    question:
      "A function f: Z → Z satisfies f(x+y) = f(x)·f(y) for all integers x, y, and f(1) = 2. Find f(9).",
    format: "INTEGER",
    answer: "512",
    solution:
      "Setting y=1 repeatedly: f(n+1) = f(n)·f(1) = 2f(n), so f(n) = f(1)^n = 2^n for positive integers n " +
      "(by induction, starting from f(1)=2). So f(9) = 2^9 = 512.",
    hints: [
      "Set y=1 to get a recurrence f(n+1) = f(n)·f(1).",
      "Iterate the recurrence (or recognize f(n)=f(1)^n by induction) up to n=9.",
    ],
    difficulty: 7,
    topicSlug: "functions",
    competitionSlug: "aime",
  },
  {
    slug: "aime-38",
    question: "The polynomial x^3 - 6x^2 + 11x - 6 has roots r, s, t. Find r^2 + s^2 + t^2.",
    format: "INTEGER",
    answer: "14",
    solution:
      "By Vieta's formulas, r+s+t = 6 and rs+rt+st = 11. Then r^2+s^2+t^2 = (r+s+t)^2 - 2(rs+rt+st) = " +
      "36 - 22 = 14.",
    hints: [
      "You don't need to find the individual roots — use Vieta's formulas for the sum and pairwise sum of products.",
      "Apply r^2+s^2+t^2 = (r+s+t)^2 - 2(rs+rt+st).",
    ],
    difficulty: 7,
    topicSlug: "polynomials",
    competitionSlug: "aime",
  },
  {
    slug: "aime-39",
    question: "A right circular cylinder has radius 6 and height 10. Find the value of (volume of the cylinder)/π.",
    format: "INTEGER",
    answer: "360",
    solution: "Volume = πr^2h, so volume/π = r^2h = 36·10 = 360.",
    hints: [
      "Recall the cylinder volume formula V = πr^2h.",
      "Divide out the π and compute r^2·h directly.",
    ],
    difficulty: 7,
    topicSlug: "area-volume",
    competitionSlug: "aime",
  },
  {
    slug: "aime-40",
    question:
      "In a right triangle with legs 9 and 12, let h be the length of the altitude drawn to the hypotenuse. Find the value of 25h.",
    format: "INTEGER",
    answer: "180",
    solution:
      "The hypotenuse has length √(9^2+12^2)=15. The altitude to the hypotenuse of a right triangle " +
      "satisfies h = (leg1·leg2)/hypotenuse, since the triangle's area (1/2)(9)(12) also equals " +
      "(1/2)(15)(h). So h = 108/15 = 36/5. Then 25h = 25·36/5 = 5·36 = 180.",
    hints: [
      "The altitude to the hypotenuse can be found two ways from the triangle's area — set (1/2)(leg1)(leg2) equal to (1/2)(hypotenuse)(h).",
      "Once you have h as a fraction, multiply by 25 and simplify — the 5 in the denominator should cancel cleanly.",
    ],
    difficulty: 7,
    topicSlug: "similarity-congruence",
    competitionSlug: "aime",
  },
  {
    slug: "aime-41",
    question: "Find the number of positive integers n ≤ 220 that are not divisible by 2, 3, or 5.",
    format: "INTEGER",
    answer: "58",
    solution:
      "By inclusion-exclusion on divisibility by 2, 3, 5 among 1..220: single terms: ⌊220/2⌋+⌊220/3⌋+⌊220/5⌋ " +
      "= 110+73+44 = 227. Pairwise terms: ⌊220/6⌋+⌊220/10⌋+⌊220/15⌋ = 36+22+14 = 72. Triple term: ⌊220/30⌋=7. " +
      "Divisible by at least one: 227-72+7 = 162. Not divisible by any: 220-162 = 58.",
    hints: [
      "Use inclusion-exclusion over the three divisibility conditions, counting multiples of 2, 3, 5 and their pairwise/triple LCMs up to 220.",
      "Subtract the inclusion-exclusion total (divisible by at least one) from 220.",
    ],
    difficulty: 7,
    topicSlug: "number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-42",
    question: "Find the number of ordered pairs of positive integers (x, y) satisfying 3x + 5y = 100.",
    format: "INTEGER",
    answer: "6",
    solution:
      "Solving for y: y = (100-3x)/5, which requires 100-3x ≡ 0 (mod 5), i.e. 3x ≡ 0 (mod 5), i.e. x ≡ 0 " +
      "(mod 5) (since 3 is invertible mod 5). Write x=5k for positive integer k. Then y = 20-3k, which is " +
      "positive exactly when k < 20/3, i.e. k ≤ 6. Combined with k ≥ 1 (so x is positive), k ranges over " +
      "1,2,3,4,5,6 — 6 solutions.",
    hints: [
      "Solve for y in terms of x and determine which residue class of x (mod 5) makes y an integer.",
      "Substitute x=5k and find the range of k that keeps both x and y positive.",
    ],
    difficulty: 7,
    topicSlug: "diophantine-equations",
    competitionSlug: "aime",
  },

  // ---------------------------------------------------------------------
  // Difficulty 8 (aime-43..aime-53)
  // ---------------------------------------------------------------------
  {
    slug: "aime-43",
    question:
      "A bag contains 4 white balls, 5 black balls, and 4 red balls. Three balls are drawn at random without replacement. The probability that all three balls are different colors can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "183",
    solution:
      "Total ways to draw 3 balls from 13: C(13,3) = 286. Ways to get one of each color: 4·5·4 = 80. " +
      "The probability is 80/286 = 40/143 (dividing by gcd 2). Since 143=11·13 and 40=2^3·5 share no " +
      "common factor, this is in lowest terms. So m+n = 40+143 = 183.",
    hints: [
      "Count the total ways to choose 3 balls from all 13, then count the favorable ways as a product of independent choices (one ball of each color).",
      "Reduce the resulting fraction to lowest terms before adding numerator and denominator.",
    ],
    difficulty: 8,
    topicSlug: "counting-probability",
    competitionSlug: "aime",
  },
  {
    slug: "aime-44",
    question: "Find the number of positive integers n ≤ 1000 such that n(n+1) is divisible by 6.",
    format: "INTEGER",
    answer: "666",
    solution:
      "n(n+1) is a product of consecutive integers, so it's always divisible by 2. It's divisible by 6 " +
      "exactly when it's also divisible by 3, which fails only when neither n nor n+1 is divisible by 3, " +
      "i.e. exactly when n ≡ 1 (mod 3). Among 1..1000, the integers ≡1 (mod 3) are 1,4,...,1000 " +
      "(since 1000 ≡ 1 mod 3), giving (1000-1)/3+1 = 334 such integers. So the count divisible by 6 is " +
      "1000 - 334 = 666.",
    hints: [
      "n(n+1) is always even — the only question is whether it's divisible by 3.",
      "n(n+1) fails to be divisible by 3 exactly when n ≡ 1 (mod 3); count and subtract those from 1000.",
    ],
    difficulty: 8,
    topicSlug: "divisibility",
    competitionSlug: "aime",
  },
  {
    slug: "aime-45",
    question:
      "A sequence satisfies a_1 = 1, a_2 = 2, and a_{n+2} = a_{n+1} + 2a_n for all n ≥ 1. Find the remainder when a_15 is divided by 1000.",
    format: "INTEGER",
    answer: "384",
    solution:
      "The characteristic equation of the recurrence is x^2 = x + 2, i.e. x^2-x-2 = (x-2)(x+1) = 0, with " +
      "roots x=2, x=-1. So a_n = A·2^n + B·(-1)^n for constants A, B. Using a_1=1: 2A-B=1. Using a_2=2: " +
      "4A+B=2. Adding: 6A=3, so A=1/2, and then B=2A-1=0. So a_n = 2^n/2 = 2^{n-1} exactly (one can check " +
      "a_3 = a_2+2a_1 = 2+2 = 4 = 2^2, consistent). Then a_15 = 2^14 = 16384, and 16384 mod 1000 = 384.",
    hints: [
      "This is a linear recurrence — find its characteristic equation and solve for the roots.",
      "Fit the general solution to the two given initial terms; you should find the closed form simplifies to a clean power of 2.",
    ],
    difficulty: 8,
    topicSlug: "sequences",
    competitionSlug: "aime",
  },
  {
    slug: "aime-46",
    question:
      "A sphere is inscribed in a right circular cone with base radius 9 and height 12, tangent to the base and to the lateral surface. The radius of the sphere can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "11",
    solution:
      "Take the axial cross-section: an isosceles triangle with base 18 (twice the radius), height 12, and " +
      "slant sides of length √(9^2+12^2)=15 each (since 9-12-15 is a Pythagorean triple). The inscribed " +
      "sphere's radius equals the inradius of this cross-section triangle. Its area is (1/2)(18)(12)=108, " +
      "and its semiperimeter is (18+15+15)/2=24, so the inradius is 108/24 = 9/2. Since gcd(9,2)=1, " +
      "m+n = 9+2 = 11.",
    hints: [
      "Take the cross-section of the cone through its axis — it's an isosceles triangle, and the inscribed sphere's radius equals this triangle's inradius.",
      "Find the triangle's base, height, and slant side length (a Pythagorean triple), then use inradius = Area/semiperimeter.",
    ],
    difficulty: 8,
    topicSlug: "three-d-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-47",
    question:
      "Find the number of ways to arrange 10 identical red balls and 5 identical blue balls in a row so that no two blue balls are adjacent.",
    format: "INTEGER",
    answer: "462",
    solution:
      "Place the 10 identical red balls in a row first; they create 11 gaps (before, between, and after " +
      "them) where blue balls can be inserted, at most one per gap to keep blue balls non-adjacent. " +
      "Choose 5 of these 11 gaps for the blue balls: C(11,5) = 462.",
    hints: [
      "Place the red balls first — they create gaps where blue balls can be inserted.",
      "Since blue balls can't share a gap (or they'd be adjacent), count the ways to choose gaps for them.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-48",
    question: "The parabola y = x^2 intersects the line y = x + 12 at points A and B. Find AB^2.",
    format: "INTEGER",
    answer: "98",
    solution:
      "Setting x^2 = x+12 gives x^2-x-12=0, which factors as (x-4)(x+3)=0, so x=4 or x=-3. The points are " +
      "A=(4,16) and B=(-3,9). Then AB^2 = (4-(-3))^2 + (16-9)^2 = 49+49 = 98.",
    hints: [
      "Substitute the line equation into the parabola equation to find the x-coordinates of the intersection points.",
      "Use the distance formula (or note both coordinate differences equal 7) to compute AB^2.",
    ],
    difficulty: 8,
    topicSlug: "coordinate-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-49",
    question: "Find the number of integers x with 0 ≤ x < 1000 such that x^2 ≡ 1 (mod 1000).",
    format: "INTEGER",
    answer: "8",
    solution:
      "Split via CRT into modulo 8 and modulo 125 (since 1000=8·125). Modulo 8: x^2≡1 has exactly 4 " +
      "solutions, x≡1,3,5,7 (mod 8), since (Z/8Z)* is not cyclic. Modulo 125 (an odd prime power): x^2≡1 " +
      "has exactly 2 solutions, x≡±1 (mod 125), since (Z/125Z)* is cyclic. By CRT, each of the 4 choices " +
      "mod 8 combines with each of the 2 choices mod 125 to give a unique solution mod 1000, for a total " +
      "of 4·2 = 8 solutions.",
    hints: [
      "Split the congruence modulo 8 and modulo 125 using CRT, since 1000 = 8·125.",
      "Count solutions to x^2≡1 in each modulus separately (4 mod 8, 2 mod 125) and multiply.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-50",
    question:
      "Find the number of ordered pairs of positive integers (a, b) such that gcd(a, b) = 2 and lcm(a, b) = 420.",
    format: "INTEGER",
    answer: "16",
    solution:
      "Write a=2a', b=2b' with gcd(a',b')=1. Since gcd(a,b)·lcm(a,b)=ab, and gcd(a',b')=1 means " +
      "lcm(a',b')=a'b', we get lcm(a,b) = 2·a'b' = 420, so a'b' = 210 = 2·3·5·7. Since a' and b' must be " +
      "coprime and their product is 210 (which has 4 distinct prime factors), each prime power factor " +
      "(2, 3, 5, and 7) must go entirely to a' or entirely to b' — 2 choices per prime, independently. " +
      "This gives 2^4 = 16 ordered pairs (a', b'), hence 16 ordered pairs (a, b).",
    hints: [
      "Write a=2a', b=2b' with gcd(a',b')=1, and use gcd(a,b)·lcm(a,b)=ab to find a'b'.",
      "Since a' and b' are coprime with product 210, each of 210's distinct prime factors must go entirely to one side or the other — count the assignments.",
    ],
    difficulty: 8,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-51",
    question:
      "A fair coin is flipped 5 times. Let X be the number of heads. E[X^2] can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    format: "INTEGER",
    answer: "17",
    solution:
      "X follows a Binomial(5, 1/2) distribution. E[X] = np = 5/2, and Var(X) = np(1-p) = 5/4. Since " +
      "Var(X) = E[X^2]-E[X]^2, E[X^2] = 5/4 + (5/2)^2 = 5/4 + 25/4 = 30/4 = 15/2. Since gcd(15,2)=1, " +
      "m+n = 15+2 = 17.",
    hints: [
      "X is a binomial random variable — recall the formulas for its mean and variance.",
      "Use Var(X) = E[X^2] - E[X]^2 to solve for E[X^2].",
    ],
    difficulty: 8,
    topicSlug: "expected-value",
    competitionSlug: "aime",
  },
  {
    slug: "aime-52",
    question: "Triangle ABC has side lengths AB = 10, BC = 17, CA = 21. Find the area of triangle ABC.",
    format: "INTEGER",
    answer: "84",
    solution:
      "By Heron's formula, s = (10+17+21)/2 = 24, and Area = √(24·14·7·3) = √7056 = 84 " +
      "(since 24·14=336, 336·7=2352, 2352·3=7056, and 84^2=7056).",
    hints: [
      "Compute the semiperimeter s = (a+b+c)/2.",
      "Apply Heron's formula and simplify the product under the square root carefully.",
    ],
    difficulty: 8,
    topicSlug: "triangles",
    competitionSlug: "aime",
  },
  {
    slug: "aime-53",
    question:
      "Find the number of 5-digit positive integers whose digits are strictly increasing from left to right (each digit is greater than the one before it).",
    format: "INTEGER",
    answer: "126",
    solution:
      "A strictly increasing sequence of digits is entirely determined by the set of digits used (there's " +
      "only one way to arrange any set of distinct digits in increasing order). The digit 0 cannot appear, " +
      "since in a strictly increasing sequence the smallest digit is leftmost, and a leading 0 is not " +
      "allowed. So we choose any 5 distinct digits from {1,2,...,9}: C(9,5) = 126.",
    hints: [
      "A set of 5 distinct digits corresponds to exactly one strictly increasing arrangement — so this is really a counting-of-sets problem.",
      "Digit 0 can never appear (it would have to be the leading digit). Choose 5 digits from {1,...,9}.",
    ],
    difficulty: 8,
    topicSlug: "combinations",
    competitionSlug: "aime",
  },

  // ---------------------------------------------------------------------
  // Difficulty 9 (aime-54..aime-65)
  // ---------------------------------------------------------------------
  {
    slug: "aime-54",
    question:
      "Cyclic quadrilateral ABCD has AB=3, BC=5, CD=4, DA=6. AC^2 can be written as p/q, where p and q are relatively prime positive integers. Find p + q.",
    format: "INTEGER",
    answer: "545",
    solution:
      "Apply the Law of Cosines to triangles ABC and ACD along diagonal AC, using that angles B and D are " +
      "supplementary (so cos D = -cos B): AC^2 = AB^2+BC^2-2·AB·BC·cos B = 9+25-30cos B = 34-30cos B, and " +
      "AC^2 = CD^2+DA^2+2·CD·DA·cos B = 16+36+48cos B = 52+48cos B. Setting these equal: 34-30cos B = " +
      "52+48cos B, so -18 = 78cos B, giving cos B = -3/13. Then AC^2 = 34-30(-3/13) = 34+90/13 = " +
      "(442+90)/13 = 532/13. Checking gcd(532,13): 13·40=520, remainder 12, so the fraction is already " +
      "reduced. Thus p+q = 532+13 = 545.",
    hints: [
      "Write AC^2 two ways using the Law of Cosines in triangles ABC and ACD, which share diagonal AC.",
      "In a cyclic quadrilateral, opposite angles B and D are supplementary, so cos D = -cos B — set the two expressions for AC^2 equal and solve for cos B.",
    ],
    difficulty: 9,
    topicSlug: "advanced-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-55",
    question:
      "Tetrahedron ABCD has AB=CD=7, AC=BD=8, AD=BC=9. The volume of the tetrahedron can be written as m√n, where n is not divisible by the square of any prime. Find m+n.",
    format: "INTEGER",
    answer: "27",
    solution:
      "This isosceles (orthocentric) tetrahedron can be inscribed in a rectangular box of dimensions p×q×r " +
      "so that each pair of opposite edges corresponds to a face diagonal: p^2+q^2=7^2=49, p^2+r^2=8^2=64, " +
      "q^2+r^2=9^2=81. Adding all three equations: 2(p^2+q^2+r^2)=194, so p^2+q^2+r^2=97, giving p^2=16, " +
      "q^2=33, r^2=48. The tetrahedron's volume equals exactly 1/3 of the box's volume (the box minus four " +
      "corner tetrahedra, each 1/6 of the box, leaves 1/3). Now (pqr)^2 = p^2q^2r^2 = 16·33·48 = 25344 = " +
      "2^8·3^2·11, so pqr = 2^4·3·√11 = 48√11. The volume is (1/3)(48√11) = 16√11. Since 11 is squarefree, " +
      "m+n = 16+11 = 27.",
    hints: [
      "A tetrahedron with each pair of opposite edges equal (an isosceles tetrahedron) can always be inscribed in a rectangular box, with each edge a face diagonal.",
      "Set up three equations for the box's squared dimensions, solve for p^2, q^2, r^2, and use that the tetrahedron's volume is exactly 1/3 of the box's volume.",
    ],
    difficulty: 9,
    topicSlug: "three-d-geometry",
    competitionSlug: "aime",
  },
  {
    slug: "aime-56",
    question:
      "Find the number of lattice paths from (0,0) to (7,7), using unit steps right and up, that never go above the line y=x.",
    format: "INTEGER",
    answer: "429",
    solution:
      "The number of monotonic lattice paths from (0,0) to (n,n) that never rise above the diagonal y=x is " +
      "the nth Catalan number, C_n = C(2n,n)/(n+1). For n=7: C(14,7)=3432, and C_7 = 3432/8 = 429.",
    hints: [
      "Paths from (0,0) to (n,n) staying weakly below the diagonal are counted by a very well-known combinatorial sequence.",
      "Use the Catalan number formula C_n = C(2n,n)/(n+1) with n=7.",
    ],
    difficulty: 9,
    topicSlug: "advanced-combinatorics",
    competitionSlug: "aime",
  },
  {
    slug: "aime-57",
    question:
      "A function f: Z → Z satisfies f(x+y) = f(x) + f(y) + 2xy + 1 for all integers x, y, and f(1) = 2. Find f(15).",
    format: "INTEGER",
    answer: "254",
    solution:
      "Setting y=1: f(x+1) = f(x) + f(1) + 2x + 1 = f(x) + 2x + 3. Setting x=y=0 in the original equation: " +
      "f(0) = 2f(0) + 1, so f(0) = -1. Telescoping the recurrence from f(0): f(n) = f(0) + Σ_{k=0}^{n-1}(2k+3) " +
      "= -1 + [2·(n-1)n/2 + 3n] = -1 + n(n-1) + 3n = n^2+2n-1. (Checking f(1) = 1+2-1 = 2, consistent with " +
      "the given value.) So f(15) = 225+30-1 = 254.",
    hints: [
      "Plug in y=1 to get a recurrence relating f(x+1) to f(x); also plug in x=y=0 to find f(0).",
      "Telescope the recurrence from f(0) up to f(15), and check your closed form against the given f(1)=2.",
    ],
    difficulty: 9,
    topicSlug: "functional-equations",
    competitionSlug: "aime",
  },
  {
    slug: "aime-58",
    question:
      "Positive real numbers a, b, c satisfy a+b+c=6 and a^2+b^2+c^2=18. Find the maximum possible value of a^3+b^3+c^3.",
    format: "INTEGER",
    answer: "66",
    solution:
      "Let e1=a+b+c=6, e2=ab+bc+ca=(e1^2-(a^2+b^2+c^2))/2=(36-18)/2=9. By Newton's identity, " +
      "a^3+b^3+c^3 = e1^3-3e1e2+3e3, where e3=abc. Since e1, e2 are fixed, maximizing a^3+b^3+c^3 is " +
      "equivalent to maximizing e3=abc. For fixed e1, e2, the extreme values of abc over positive reals " +
      "occur when two variables are equal. Set a=b=t, c=6-2t; the constraint ab+bc+ca=9 becomes " +
      "t^2+2t(6-2t)=9, i.e. -3t^2+12t=9, i.e. 3t^2-12t+9=0, i.e. t^2-4t+3=0, so t=1 or t=3. For t=3: " +
      "c=6-6=0, not a positive real (this is the degenerate boundary, giving the minimum e3=0). For t=1: " +
      "c=6-2=4>0, a valid interior point, giving e3 = 1^2·4 = 4 — this is the maximum. Then " +
      "a^3+b^3+c^3 = 6^3-3(6)(9)+3(4) = 216-162+12 = 66.",
    hints: [
      "Use Newton's identity a^3+b^3+c^3 = e1^3-3e1e2+3e3 to reduce the problem to maximizing e3=abc.",
      "With a+b+c and ab+bc+ca fixed, the extreme values of abc occur when two of the variables are equal — set a=b=t and solve for the valid positive critical point.",
    ],
    difficulty: 9,
    topicSlug: "inequalities-olympiad",
    competitionSlug: "aime",
  },
  {
    slug: "aime-59",
    question:
      "Find the number of ordered triples of positive integers (a, b, c) such that abc = 1000 and a, b, c are pairwise relatively prime.",
    format: "INTEGER",
    answer: "9",
    solution:
      "Factor 1000 = 2^3·5^3. Since a, b, c are pairwise coprime, no prime can divide two of them — so the " +
      "entire power of 2 (namely 2^3) must belong to exactly one of a, b, c (3 choices), and independently " +
      "the entire power of 5 (namely 5^3) must belong to exactly one of a, b, c (3 choices). These two " +
      "assignments are independent, giving 3·3 = 9 ordered triples.",
    hints: [
      "Factor 1000 into its prime power components: 2^3 and 5^3.",
      "Pairwise coprimality forces each entire prime power to be assigned to exactly one of a, b, c — count the independent assignments.",
    ],
    difficulty: 9,
    topicSlug: "advanced-number-theory",
    competitionSlug: "aime",
  },
  {
    slug: "aime-60",
    question:
      "A fair six-sided die is rolled repeatedly until it shows a 1 or a 2. Let N be the number of rolls needed. Find E[N^2].",
    format: "INTEGER",
    answer: "15",
    solution:
      "Each roll independently shows a 1 or 2 with probability p=1/3. N follows a geometric distribution " +
      "with this success probability, so E[N] = 1/p = 3, and Var(N) = (1-p)/p^2 = (2/3)/(1/9) = 6. Since " +
      "Var(N) = E[N^2]-E[N]^2, E[N^2] = 6+3^2 = 6+9 = 15.",
    hints: [
      "N follows a geometric distribution with success probability p = 2/6 = 1/3 (rolling a 1 or 2).",
      "Use the known mean and variance formulas for a geometric distribution, then Var(N)=E[N^2]-E[N]^2.",
    ],
    difficulty: 9,
    topicSlug: "expected-value",
    competitionSlug: "aime",
  },
  {
    slug: "aime-61",
    question:
      "The equation x^4 - 10x^3 + 35x^2 - 50x + 24 = 0 has four real roots. Find the sum of the squares of the roots.",
    format: "INTEGER",
    answer: "30",
    solution:
      "By Vieta's formulas, the sum of the roots is e1=10 and the sum of pairwise products is e2=35. " +
      "The sum of squares of the roots is e1^2-2e2 = 100-70 = 30. (One can check directly that the " +
      "quartic factors as (x-1)(x-2)(x-3)(x-4), whose roots 1,2,3,4 indeed satisfy 1+4+9+16=30.)",
    hints: [
      "You don't need to find the roots individually — use Vieta's formulas to get the sum and pairwise sum of products directly from the coefficients.",
      "Apply sum of squares = (sum of roots)^2 - 2(sum of pairwise products).",
    ],
    difficulty: 9,
    topicSlug: "polynomials",
    competitionSlug: "aime",
  },
  {
    slug: "aime-62",
    question:
      "In how many ways can 5 distinct books be arranged in a row on a shelf so that neither of two specific books, A and B, is in its original position (while the other 3 books may be anywhere)?",
    format: "INTEGER",
    answer: "78",
    solution:
      "Use inclusion-exclusion on the two \"bad\" events (A in its original spot, B in its original spot) " +
      "among all 5! = 120 arrangements. Arrangements with A fixed in its original spot: 4! = 24 (the other " +
      "4 books arranged freely). Likewise for B fixed: 4! = 24. Arrangements with both A and B fixed: " +
      "3! = 6. By inclusion-exclusion, arrangements with at least one of A, B in its original spot: " +
      "24+24-6 = 42. So arrangements with neither in its original spot: 120-42 = 78.",
    hints: [
      "This is a partial derangement — use inclusion-exclusion on the two 'bad' events (A fixed, B fixed).",
      "Count arrangements with A fixed, with B fixed, and with both fixed, then combine via inclusion-exclusion and subtract from 5!.",
    ],
    difficulty: 9,
    topicSlug: "inclusion-exclusion",
    competitionSlug: "aime",
  },
  {
    slug: "aime-63",
    question:
      "In triangle ABC, points D and E lie on AB and AC respectively, with DE parallel to BC. AD=8, DB=4, and the area of triangle ABC is 135. Find the area of trapezoid DBCE.",
    format: "INTEGER",
    answer: "75",
    solution:
      "Since DE ∥ BC, triangle ADE is similar to triangle ABC with ratio AD/AB = 8/(8+4) = 8/12 = 2/3. " +
      "The area of a similar triangle scales as the square of the ratio, so Area(ADE) = (2/3)^2·135 = " +
      "(4/9)·135 = 60. The trapezoid DBCE is the rest of the triangle: 135-60 = 75.",
    hints: [
      "DE ∥ BC makes triangle ADE similar to triangle ABC — find the similarity ratio AD/AB.",
      "Area scales as the square of the similarity ratio; subtract the small triangle's area from the whole to get the trapezoid.",
    ],
    difficulty: 9,
    topicSlug: "similarity-congruence",
    competitionSlug: "aime",
  },
  {
    slug: "aime-64",
    question:
      "Find the number of ways to write 10 as a sum of positive integers, where the order of the summands does not matter (that is, find the number of partitions of 10).",
    format: "INTEGER",
    answer: "42",
    solution:
      "Listing partitions of 10 by largest part (or building up via the recursive partition-counting method, " +
      "p(n,k) = number of partitions of n using parts of size at most k, with p(n,k)=p(n,k-1)+p(n-k,k)) " +
      "gives a total of 42 partitions of 10. This matches the well-known value p(10)=42.",
    hints: [
      "Organize the count systematically by the largest part used, or by the number of parts, to avoid missing or double-counting partitions.",
      "Consider building the count recursively: partitions of n using parts ≤ k either avoid a part of size k entirely, or use at least one k (leaving n-k to partition with parts ≤ k).",
    ],
    difficulty: 9,
    topicSlug: "combinatorics",
    competitionSlug: "aime",
  },
  {
    slug: "aime-65",
    question: "Find the smallest positive integer n such that n! is divisible by 10^24.",
    format: "INTEGER",
    answer: "100",
    solution:
      "The power of 10 dividing n! is determined by the power of 5 (since powers of 2 are always more " +
      "abundant), given by Legendre's formula: ⌊n/5⌋+⌊n/25⌋+⌊n/125⌋+.... We need this sum to reach at " +
      "least 24. At n=99: ⌊99/5⌋+⌊99/25⌋ = 19+3 = 22, not yet enough. At n=100: ⌊100/5⌋+⌊100/25⌋ = 20+4 = " +
      "24, which meets the requirement (note the count jumps from 22 at n=99 straight to 24 at n=100, " +
      "since 100 is divisible by both 5 and 25). So the smallest such n is 100.",
    hints: [
      "The number of trailing zeros (powers of 10) in n! is governed by the power of 5 in n!, via Legendre's formula ⌊n/5⌋+⌊n/25⌋+⌊n/125⌋+....",
      "Since this count only increases at multiples of 5, check nearby multiples of 5 (and especially 25) to find where the running total first reaches 24.",
    ],
    difficulty: 9,
    topicSlug: "integer-properties",
    competitionSlug: "aime",
  },
];
