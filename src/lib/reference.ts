/**
 * The reference sheet: the results a competitor is expected to know cold.
 *
 * Plain data, no database. Nothing here is per-student, nothing changes
 * between accounts, and nothing needs syncing — so a table, a migration and a
 * sync script would all be machinery around a constant. It is also why this is
 * importable from a client component: the browser does the filtering.
 *
 * Written in the same ASCII-ish math the lessons use (`a^(m+n)`, `S_n`,
 * `sqrt(5)`, `>=`) and rendered through `MathText`, so superscripts and roots
 * typeset properly instead of arriving as Unicode lookalikes.
 *
 * Two editorial rules, both about being useful under time pressure:
 *
 *   - Every entry states its conditions. "AM-GM" without "for non-negative
 *     reals" is a trap, and a student reaching for a cheat sheet mid-problem
 *     is exactly the person who will not supply the caveat themselves.
 *   - `when` says what the result is *for*. Recognising which theorem applies
 *     is the hard part of a contest problem; recalling its statement is not.
 */

export type ReferenceEntry = {
  name: string;
  /** The result itself, as authored math. */
  statement: string;
  /** Conditions under which it holds. Omitted only when genuinely universal. */
  conditions?: string;
  /** What it is for — the recognition cue. */
  when?: string;
};

export type ReferenceSection = {
  slug: string;
  title: string;
  blurb: string;
  entries: ReferenceEntry[];
};

export const REFERENCE: ReferenceSection[] = [
  {
    slug: "algebra",
    title: "Algebra",
    blurb: "Factorisations, roots, series and the inequalities that come up most.",
    entries: [
      {
        name: "Quadratic formula",
        statement: "x = (-b ± sqrt(b^2 - 4ac)) / (2a)",
        conditions: "For ax^2 + bx + c = 0 with a ≠ 0.",
      },
      {
        name: "Discriminant",
        statement: "Δ = b^2 - 4ac",
        when: "Δ > 0 gives two real roots, Δ = 0 one repeated root, Δ < 0 none. Δ a perfect square means the roots are rational.",
      },
      {
        name: "Vieta's formulas (quadratic)",
        statement: "r + s = -b/a,  rs = c/a",
        conditions: "r and s the roots of ax^2 + bx + c = 0.",
        when: "The problem asks for the sum or product of roots but not the roots themselves.",
      },
      {
        name: "Vieta's formulas (cubic)",
        statement: "r + s + t = -b/a,  rs + rt + st = c/a,  rst = -d/a",
        conditions: "For ax^3 + bx^2 + cx + d = 0.",
      },
      {
        name: "Difference of squares",
        statement: "a^2 - b^2 = (a - b)(a + b)",
      },
      {
        name: "Sum and difference of cubes",
        statement: "a^3 + b^3 = (a + b)(a^2 - ab + b^2),  a^3 - b^3 = (a - b)(a^2 + ab + b^2)",
      },
      {
        name: "Square of a sum",
        statement: "(a + b)^2 = a^2 + 2ab + b^2,  (a - b)^2 = a^2 - 2ab + b^2",
      },
      {
        name: "Useful rearrangement",
        statement: "a^2 + b^2 = (a + b)^2 - 2ab",
        when: "You know a + b and ab (often from Vieta) and need a^2 + b^2.",
      },
      {
        name: "Exponent rules",
        statement: "a^m · a^n = a^(m+n),  (a^m)^n = a^(mn),  a^(-n) = 1/a^n,  a^0 = 1",
        conditions: "a ≠ 0 for the last two.",
      },
      {
        name: "Logarithm rules",
        statement: "log(xy) = log x + log y,  log(x/y) = log x - log y,  log(x^n) = n log x",
        conditions: "x, y > 0.",
      },
      {
        name: "Change of base",
        statement: "log_b(x) = log_c(x) / log_c(b)",
        conditions: "b, c > 0 and both ≠ 1.",
      },
      {
        name: "Arithmetic series",
        statement: "S_n = n(a_1 + a_n)/2 = (n/2)(2a_1 + (n-1)d)",
        when: "Adding a run of evenly spaced terms.",
      },
      {
        name: "Geometric series (finite)",
        statement: "S_n = a_1 (1 - r^n)/(1 - r)",
        conditions: "r ≠ 1.",
      },
      {
        name: "Geometric series (infinite)",
        statement: "S = a_1 / (1 - r)",
        conditions: "Converges only for |r| < 1.",
      },
      {
        name: "Sum of the first n integers",
        statement: "1 + 2 + … + n = n(n+1)/2",
      },
      {
        name: "Sum of the first n squares",
        statement: "1^2 + 2^2 + … + n^2 = n(n+1)(2n+1)/6",
      },
      {
        name: "AM-GM inequality",
        statement: "(a + b)/2 >= sqrt(ab)",
        conditions: "a, b >= 0. Equality exactly when a = b.",
        when: "Minimising a sum given a fixed product, or the reverse. The equality case is usually where the answer is.",
      },
      {
        name: "Cauchy-Schwarz",
        statement: "(a^2 + b^2)(x^2 + y^2) >= (ax + by)^2",
        when: "Bounding a sum of products by sums of squares.",
      },
      {
        name: "Triangle inequality (absolute value)",
        statement: "|a + b| <= |a| + |b|",
      },
    ],
  },
  {
    slug: "geometry",
    title: "Geometry",
    blurb: "Triangles, circles, polygons, solids and coordinates.",
    entries: [
      {
        name: "Pythagorean theorem",
        statement: "a^2 + b^2 = c^2",
        conditions: "Right triangle only, c the hypotenuse.",
      },
      {
        name: "Common Pythagorean triples",
        statement: "3-4-5,  5-12-13,  8-15-17,  7-24-25,  9-40-41",
        when: "Recognising one saves the whole computation. Multiples count: 6-8-10, 9-12-15.",
      },
      {
        name: "45-45-90 triangle",
        statement: "sides in ratio 1 : 1 : sqrt(2)",
      },
      {
        name: "30-60-90 triangle",
        statement: "sides in ratio 1 : sqrt(3) : 2",
        conditions: "1 opposite the 30°, sqrt(3) opposite the 60°, 2 the hypotenuse.",
      },
      {
        name: "Triangle area",
        statement: "A = (1/2) b h = (1/2) ab sin C",
        when: "The sine form when you have two sides and the angle between them.",
      },
      {
        name: "Heron's formula",
        statement: "A = sqrt(s(s-a)(s-b)(s-c)),  where s = (a+b+c)/2",
        when: "All three sides known, no height given.",
      },
      {
        name: "Triangle inequality",
        statement: "a + b > c for every choice of the third side",
        when: "Deciding whether a triangle with given sides can exist.",
      },
      {
        name: "Law of Sines",
        statement: "a/sin A = b/sin B = c/sin C = 2R",
        conditions: "R the circumradius.",
        when: "Two angles and a side, or two sides and a non-included angle.",
      },
      {
        name: "Law of Cosines",
        statement: "c^2 = a^2 + b^2 - 2ab cos C",
        when: "Two sides and the included angle, or all three sides and you want an angle.",
      },
      {
        name: "Circle area and circumference",
        statement: "A = π r^2,  C = 2π r",
      },
      {
        name: "Arc length and sector area",
        statement: "arc = (θ/360) · 2π r,  sector = (θ/360) · π r^2",
        conditions: "θ in degrees.",
      },
      {
        name: "Inscribed angle theorem",
        statement: "inscribed angle = (1/2) × central angle on the same arc",
      },
      {
        name: "Angle in a semicircle",
        statement: "an angle inscribed in a semicircle is 90°",
        when: "A diameter appears in a circle problem.",
      },
      {
        name: "Power of a point",
        statement: "for two chords through P: PA · PB = PC · PD",
        when: "Two lines through one point meeting a circle.",
      },
      {
        name: "Polygon angle sums",
        statement: "interior sum = (n - 2) · 180°,  each interior angle (regular) = (n-2)·180°/n",
        when: "Exterior angles of any convex polygon always sum to 360°.",
      },
      {
        name: "Similar figures",
        statement: "lengths scale by k, areas by k^2, volumes by k^3",
        when: "The single most common source of dropped factors in geometry.",
      },
      {
        name: "Centroid",
        statement: "divides each median in a 2 : 1 ratio, measured from the vertex",
      },
      {
        name: "Distance and midpoint",
        statement: "d = sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2),  M = ((x_1+x_2)/2, (y_1+y_2)/2)",
      },
      {
        name: "Equation of a circle",
        statement: "(x - h)^2 + (y - k)^2 = r^2",
        conditions: "Centre (h, k), radius r.",
      },
      {
        name: "Slope relationships",
        statement: "parallel: m_1 = m_2.  perpendicular: m_1 · m_2 = -1",
      },
      {
        name: "Volumes",
        statement: "sphere = (4/3)π r^3,  cylinder = π r^2 h,  cone = (1/3)π r^2 h,  pyramid = (1/3) B h",
      },
      {
        name: "Surface areas",
        statement: "sphere = 4π r^2,  cylinder = 2π r^2 + 2π r h,  cone = π r^2 + π r l",
        conditions: "l the slant height of the cone.",
      },
    ],
  },
  {
    slug: "number-theory",
    title: "Number Theory",
    blurb: "Divisibility, primes, modular arithmetic.",
    entries: [
      {
        name: "Divisibility rules",
        statement:
          "2: even.  3: digit sum divisible by 3.  4: last two digits.  5: ends 0 or 5.  6: by 2 and 3.  8: last three digits.  9: digit sum divisible by 9.  11: alternating digit sum divisible by 11.",
      },
      {
        name: "GCD and LCM",
        statement: "gcd(a, b) · lcm(a, b) = a · b",
        conditions: "Positive integers.",
      },
      {
        name: "Prime factorisation",
        statement: "n = p_1^(a_1) · p_2^(a_2) · … · p_k^(a_k)",
        when: "Unique for every n > 1. Almost every divisor question starts here.",
      },
      {
        name: "Number of divisors",
        statement: "d(n) = (a_1 + 1)(a_2 + 1) … (a_k + 1)",
        conditions: "From the prime factorisation above.",
      },
      {
        name: "Sum of divisors",
        statement: "σ(n) = ∏ (p_i^(a_i + 1) - 1)/(p_i - 1)",
      },
      {
        name: "Modular arithmetic",
        statement: "a ≡ b (mod m) means m divides a - b",
        when: "Addition and multiplication carry through congruences; division does not, in general.",
      },
      {
        name: "Fermat's little theorem",
        statement: "a^(p-1) ≡ 1 (mod p)",
        conditions: "p prime and p does not divide a.",
        when: "Reducing a huge exponent modulo a prime.",
      },
      {
        name: "Euler's theorem",
        statement: "a^φ(n) ≡ 1 (mod n)",
        conditions: "gcd(a, n) = 1.",
      },
      {
        name: "Euler's totient",
        statement: "φ(n) = n ∏ (1 - 1/p) over distinct primes p dividing n",
      },
      {
        name: "Units digit cycles",
        statement: "powers of a digit repeat with period 1, 2 or 4",
        when: "2: 2,4,8,6.  3: 3,9,7,1.  7: 7,9,3,1.  8: 8,4,2,6.  4 and 9 have period 2; 0,1,5,6 are fixed.",
      },
    ],
  },
  {
    slug: "combinatorics",
    title: "Counting",
    blurb: "Permutations, combinations and the counting principles.",
    entries: [
      {
        name: "Permutations",
        statement: "P(n, r) = n! / (n - r)!",
        when: "Order matters.",
      },
      {
        name: "Combinations",
        statement: "C(n, r) = n! / (r! (n - r)!)",
        when: "Order does not matter.",
      },
      {
        name: "Binomial theorem",
        statement: "(x + y)^n = ∑ C(n, k) x^(n-k) y^k",
        when: "The term in x^k has coefficient C(n, k).",
      },
      {
        name: "Pascal's identity",
        statement: "C(n, r) = C(n-1, r-1) + C(n-1, r)",
      },
      {
        name: "Permutations with repeats",
        statement: "n! / (n_1! n_2! … n_k!)",
        when: "Arranging letters of a word with repeated letters.",
      },
      {
        name: "Circular permutations",
        statement: "(n - 1)!",
        conditions: "Rotations counted as the same arrangement.",
      },
      {
        name: "Stars and bars",
        statement: "C(n + k - 1, k - 1)",
        conditions: "n identical items into k distinct boxes, empty boxes allowed.",
      },
      {
        name: "Inclusion-exclusion",
        statement: "|A ∪ B| = |A| + |B| - |A ∩ B|",
        when: "Three sets: add singles, subtract pairs, add the triple back.",
      },
      {
        name: "Pigeonhole principle",
        statement: "n items in k boxes with n > k forces some box to hold at least two",
        when: "General form: some box holds at least ⌈n/k⌉.",
      },
      {
        name: "Complementary counting",
        statement: "count(what you want) = total - count(what you don't)",
        when: '"At least one" is almost always easier counted this way.',
      },
    ],
  },
  {
    slug: "probability",
    title: "Probability",
    blurb: "Basic, conditional and expected value.",
    entries: [
      {
        name: "Basic probability",
        statement: "P(A) = favourable outcomes / total outcomes",
        conditions: "Outcomes equally likely.",
      },
      {
        name: "Complement",
        statement: "P(not A) = 1 - P(A)",
      },
      {
        name: "Union",
        statement: "P(A or B) = P(A) + P(B) - P(A and B)",
      },
      {
        name: "Independent events",
        statement: "P(A and B) = P(A) · P(B)",
        conditions: "Only when A and B are independent.",
      },
      {
        name: "Conditional probability",
        statement: "P(A | B) = P(A and B) / P(B)",
        conditions: "P(B) > 0.",
      },
      {
        name: "Expected value",
        statement: "E = ∑ (value × probability)",
        when: "Expectation adds even when events are not independent — often the fastest route.",
      },
    ],
  },
  {
    slug: "trigonometry",
    title: "Trigonometry",
    blurb: "Identities and values worth knowing by heart.",
    entries: [
      {
        name: "Definitions",
        statement: "sin = opposite/hypotenuse,  cos = adjacent/hypotenuse,  tan = opposite/adjacent",
        conditions: "Right triangle.",
      },
      {
        name: "Pythagorean identity",
        statement: "sin^2 θ + cos^2 θ = 1",
      },
      {
        name: "Tangent",
        statement: "tan θ = sin θ / cos θ",
      },
      {
        name: "Double angle",
        statement: "sin 2θ = 2 sin θ cos θ,  cos 2θ = cos^2 θ - sin^2 θ",
      },
      {
        name: "Common values",
        statement:
          "sin 0 = 0, sin 30° = 1/2, sin 45° = sqrt(2)/2, sin 60° = sqrt(3)/2, sin 90° = 1",
        when: "cos runs the same values backwards: cos 0 = 1 down to cos 90° = 0.",
      },
    ],
  },
];

/** Every entry flattened, with its section — what the search filters over. */
export function allEntries(): Array<ReferenceEntry & { section: string; sectionSlug: string }> {
  return REFERENCE.flatMap((s) =>
    s.entries.map((e) => ({ ...e, section: s.title, sectionSlug: s.slug }))
  );
}

export function referenceEntryCount(): number {
  return REFERENCE.reduce((n, s) => n + s.entries.length, 0);
}

/** Case-insensitive match over everything an entry says, so searching
 * "asymptote", "roots" or "mod" all land somewhere useful. */
export function matchesQuery(
  entry: ReferenceEntry & { section: string },
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return [entry.name, entry.statement, entry.conditions, entry.when, entry.section]
    .filter(Boolean)
    .some((field) => (field as string).toLowerCase().includes(q));
}
