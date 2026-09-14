export type LessonSeed = {
  slug: string;
  title: string;
  topicSlug: string;
  concept: string;
  explanation: string;
  workedExample: string;
  strategy: string;
  commonMistakes: string;
  difficulty: number;
  isPremium: boolean;
  practiceProblemSlugs: string[];
  challengeProblemSlug: string;
};

export const LESSONS: LessonSeed[] = [
  {
    slug: "working-with-fractions",
    title: "Working with Fractions",
    topicSlug: "fractions",
    concept:
      "Adding, subtracting, and simplifying fractions using common denominators.",
    explanation:
      "To add or subtract fractions, they must share a common denominator. Find the least common multiple of the denominators, rewrite each fraction over that denominator, then combine the numerators. To simplify a fraction, divide both the numerator and denominator by their greatest common divisor.",
    workedExample:
      "Add 3/4 + 1/8. The LCD of 4 and 8 is 8. Rewrite 3/4 as 6/8. Now 6/8 + 1/8 = 7/8, which is already in lowest terms.",
    strategy:
      "On multiple-choice contests, watch for answer choices that are 'almost right' — like a common denominator error. Always double check your denominator is truly the LCD before adding numerators.",
    commonMistakes:
      "Adding numerators and denominators straight across (3/4 + 1/8 ≠ 4/12) is the single most common fraction error. Always find a common denominator first.",
    difficulty: 1,
    isPremium: false,
    practiceProblemSlugs: ["arith-fractions-01", "arith-fractions-02"],
    challengeProblemSlug: "arith-fractions-03",
  },
  {
    slug: "percent-change-problems",
    title: "Percent Change Problems",
    topicSlug: "percentages",
    concept: "Applying successive percent increases and decreases correctly.",
    explanation:
      "A percent increase or decrease multiplies the original value by (1 + rate) or (1 - rate). When multiple percent changes are applied in sequence, apply them one at a time — never add the percentages together, since each change applies to a different base value.",
    workedExample:
      "A $40 shirt is discounted 25%, then increased 10%. First: 40 × 0.75 = $30. Then: 30 × 1.10 = $33. Note this is NOT the same as a single 15% decrease (which would give $34).",
    strategy:
      "Convert every percent change to a multiplier (0.75 for a 25% decrease, 1.10 for a 10% increase) and chain the multipliers together in order.",
    commonMistakes:
      "Combining sequential percent changes by simple addition or subtraction (treating -25% then +10% as -15%) gives the wrong answer because each percentage applies to a different amount.",
    difficulty: 3,
    isPremium: false,
    practiceProblemSlugs: ["arith-percent-01", "arith-percent-02"],
    challengeProblemSlug: "arith-percent-03",
  },
  {
    slug: "rates-and-combined-work",
    title: "Rates and Combined Work",
    topicSlug: "rates",
    concept:
      "Combining rates by adding 'work per unit time', not times directly.",
    explanation:
      "When two agents work together, add their rates (jobs per hour), not their times. If Pipe A fills a tank in 6 hours, its rate is 1/6 tank per hour. Combine rates by addition, then take the reciprocal of the sum to find the combined time.",
    workedExample:
      "Pipe A: 1/6 tank/hour. Pipe B: 1/3 tank/hour. Combined: 1/6 + 2/6 = 3/6 = 1/2 tank/hour, so together they fill the tank in 2 hours.",
    strategy:
      "Always convert 'time to complete a job' into 'rate' (1/time) before combining. This trick generalizes to any combined-rate problem, including painters, workers, and even combined typing speeds.",
    commonMistakes:
      "Averaging the two times directly (like (6+3)/2 = 4.5 hours) is a common but incorrect shortcut — rates add, not times.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: ["arith-rates-01", "arith-rates-02"],
    challengeProblemSlug: "arith-rates-02",
  },
  {
    slug: "solving-linear-equations",
    title: "Solving Linear Equations",
    topicSlug: "linear-equations",
    concept: "Isolating a variable using inverse operations.",
    explanation:
      "To solve a linear equation, undo operations in reverse order of how they were applied — typically addition/subtraction first, then multiplication/division. Whatever you do to one side, you must do to the other.",
    workedExample:
      "Solve 3x + 7 = 22. Subtract 7 from both sides: 3x = 15. Divide both sides by 3: x = 5.",
    strategy:
      "When an equation has parentheses, distribute first. When variables appear on both sides, move them to one side before isolating.",
    commonMistakes:
      "Forgetting to apply an operation to every term on a side (especially after distributing) is the most frequent source of linear equation errors.",
    difficulty: 2,
    isPremium: false,
    practiceProblemSlugs: ["alg-linear-01", "alg-linear-02"],
    challengeProblemSlug: "alg-systems-02",
  },
  {
    slug: "factoring-quadratics",
    title: "Factoring Quadratics",
    topicSlug: "factoring",
    concept:
      "Factoring x² + bx + c by finding two numbers that multiply to c and add to b.",
    explanation:
      "For a quadratic x² + bx + c, look for two numbers p and q such that p × q = c and p + q = b. Then x² + bx + c factors as (x + p)(x + q). Vieta's formulas also let you find the sum (-b) and product (c) of the roots without factoring at all.",
    workedExample:
      "Factor x² - 5x + 6. We need two numbers that multiply to 6 and add to -5: those are -2 and -3. So x² - 5x + 6 = (x-2)(x-3), with roots 2 and 3.",
    strategy:
      "For quick multiple-choice checks, use Vieta's formulas directly: sum of roots = -b/a, product of roots = c/a. This is often faster than fully factoring.",
    commonMistakes:
      "Sign errors are extremely common — double check that your two numbers both multiply AND add to the correct signed values.",
    difficulty: 3,
    isPremium: false,
    practiceProblemSlugs: ["alg-factoring-01", "alg-factoring-02"],
    challengeProblemSlug: "alg-quad-02",
  },
  {
    slug: "systems-of-equations-strategies",
    title: "Systems of Equations Strategies",
    topicSlug: "systems-of-equations",
    concept:
      "Choosing between elimination and substitution to solve systems efficiently.",
    explanation:
      "Elimination works well when adding or subtracting the equations directly cancels a variable. Substitution works well when one equation is already (or easily made) solved for a single variable. Competition problems often reward spotting the faster method rather than mechanically applying one.",
    workedExample:
      "Solve x + y = 10 and x - y = 4. Adding the equations eliminates y directly: 2x = 14, so x = 7, and then y = 3.",
    strategy:
      "Before solving, scan both equations for a variable with matching or opposite coefficients — that's your signal to use elimination instead of substitution.",
    commonMistakes:
      "When subtracting equations, forgetting to distribute the negative sign across every term on that side is a frequent slip.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: ["alg-systems-01", "alg-systems-02"],
    challengeProblemSlug: "alg-systems-02",
  },
  {
    slug: "vietas-formulas",
    title: "Vieta's Formulas",
    topicSlug: "quadratics",
    concept:
      "Using root sum and product shortcuts without solving the quadratic explicitly.",
    explanation:
      "For ax² + bx + c = 0 with roots r and s: r + s = -b/a and r·s = c/a. These formulas let you answer many competition questions about roots without ever finding the roots themselves.",
    workedExample:
      "Find the sum of the roots of 2x² - 8x + 6 = 0. Sum = -b/a = -(-8)/2 = 4 — no need to factor or use the quadratic formula.",
    strategy:
      "Whenever a problem only asks about a sum, product, or symmetric combination of roots (like 1/r + 1/s), reach for Vieta's formulas before attempting to solve the quadratic directly.",
    commonMistakes:
      "Forgetting to divide by 'a' when the leading coefficient isn't 1 is a very common error on harder problems.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: ["alg-quad-01", "alg-quad-02"],
    challengeProblemSlug: "alg-quad-02",
  },
  {
    slug: "triangle-angle-relationships",
    title: "Triangle Angle Relationships",
    topicSlug: "angles",
    concept:
      "The angles of a triangle always sum to 180°, with special rules for isosceles triangles.",
    explanation:
      "Every triangle's interior angles sum to exactly 180°. In an isosceles triangle, the two base angles (opposite the equal sides) are also equal to each other, which lets you solve for unknown angles with just one piece of given information.",
    workedExample:
      "An isosceles triangle has a base angle of 70°. Both base angles are 70°, totaling 140°, so the vertex angle is 180 - 140 = 40°.",
    strategy:
      "Always identify which angles are equal (isosceles) or related (exterior angle = sum of remote interior angles) before setting up an equation.",
    commonMistakes:
      "Assuming the 'base angle' is the vertex angle, or mixing up which two angles are equal in an isosceles triangle, are frequent mistakes.",
    difficulty: 2,
    isPremium: false,
    practiceProblemSlugs: ["geo-angles-01", "geo-angles-02"],
    challengeProblemSlug: "geo-triangles-02",
  },
  {
    slug: "pythagorean-theorem",
    title: "The Pythagorean Theorem",
    topicSlug: "triangles",
    concept: "Relating the sides of a right triangle: a² + b² = c².",
    explanation:
      "In any right triangle, the square of the hypotenuse (the side opposite the right angle) equals the sum of the squares of the other two legs. This single relationship unlocks distance, diagonal, and many area problems.",
    workedExample:
      "A right triangle has legs 6 and 8. The hypotenuse is √(6² + 8²) = √(36+64) = √100 = 10.",
    strategy:
      "Memorize common Pythagorean triples (3-4-5, 6-8-10, 5-12-13, 8-15-17, 9-12-15) — recognizing them instantly saves significant time on timed contests.",
    commonMistakes:
      "Applying the formula to a triangle that isn't a right triangle, or mixing up which side is the hypotenuse, are the most common errors.",
    difficulty: 3,
    isPremium: false,
    practiceProblemSlugs: ["geo-triangles-01", "geo-coord-01"],
    challengeProblemSlug: "geo-3d-01",
  },
  {
    slug: "circles-area-and-circumference",
    title: "Circles: Area and Circumference",
    topicSlug: "circles",
    concept: "The core circle formulas: C = 2πr and A = πr².",
    explanation:
      "Circumference measures the distance around a circle; area measures the space it encloses. Both depend only on the radius. Many problems give the diameter instead of the radius — always convert first.",
    workedExample:
      "A circle has diameter 10, so its radius is 5. Its area is π(5²) = 25π.",
    strategy:
      "Leave answers in terms of π unless the problem explicitly asks for a decimal or gives you a π approximation like 22/7 to use.",
    commonMistakes:
      "Using the diameter directly in the area formula instead of converting to radius first is one of the most common circle errors.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: ["geo-circles-01", "geo-circles-02"],
    challengeProblemSlug: "geo-area-02",
  },
  {
    slug: "similar-triangles",
    title: "Similar Triangles",
    topicSlug: "similarity-congruence",
    concept:
      "Corresponding sides of similar figures scale by the same ratio; areas scale by the square of that ratio.",
    explanation:
      "Two triangles are similar if their corresponding angles are equal, which forces corresponding sides to be in a constant ratio. If the side ratio is k, then the area ratio is k², and the volume ratio (for 3D solids) is k³.",
    workedExample:
      "Two similar triangles have areas in ratio 4:9. Since area ratio = (side ratio)², the side ratio is √(4/9) = 2/3.",
    strategy:
      "When a problem gives an area or volume ratio and asks for a length ratio, take a square root (for area) or cube root (for volume) — don't just use the given ratio directly.",
    commonMistakes:
      "Applying the side ratio directly to areas (or vice versa) without squaring or square-rooting is the single most common similarity mistake.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: ["geo-similarity-01", "geo-similarity-02"],
    challengeProblemSlug: "geo-similarity-02",
  },
  {
    slug: "divisibility-rules",
    title: "Divisibility Rules",
    topicSlug: "divisibility",
    concept:
      "Quick tests for whether a number is divisible by small integers without doing long division.",
    explanation:
      "A number is divisible by 2 if its last digit is even; by 3 if its digit sum is divisible by 3; by 5 if it ends in 0 or 5; by 9 if its digit sum is divisible by 9; and by 4 if its last two digits form a number divisible by 4.",
    workedExample:
      "Is 4,317 divisible by 3? Digit sum = 4+3+1+7 = 15, which is divisible by 3, so yes.",
    strategy:
      "Combine rules to quickly test divisibility by composite numbers — e.g., a number is divisible by 6 exactly when it's divisible by both 2 and 3.",
    commonMistakes:
      "Assuming a rule for one number applies to a related number (e.g. treating the rule for 3 as also valid for 9) leads to frequent errors — the digit-sum threshold is different for each.",
    difficulty: 2,
    isPremium: false,
    practiceProblemSlugs: ["nt-divisibility-01", "nt-divisibility-02"],
    challengeProblemSlug: "nt-divisibility-03",
  },
  {
    slug: "prime-factorization",
    title: "Prime Factorization",
    topicSlug: "factorization",
    concept:
      "Breaking a number into its prime building blocks to find GCD, LCM, and divisor counts.",
    explanation:
      "Every integer greater than 1 has a unique prime factorization. Once you have it, GCD is found by taking the lowest power of each shared prime, LCM by taking the highest power of each prime appearing in either number, and the divisor count by adding 1 to each exponent and multiplying.",
    workedExample:
      "60 = 2² × 3 × 5. Its number of divisors is (2+1)(1+1)(1+1) = 12.",
    strategy:
      "Always fully factor into primes before comparing two numbers — trying to find GCD/LCM by inspection alone is error-prone for larger numbers.",
    commonMistakes:
      "Forgetting to add 1 to the exponents before multiplying when counting divisors is a very common slip.",
    difficulty: 3,
    isPremium: false,
    practiceProblemSlugs: ["nt-factorization-01", "nt-factorization-02"],
    challengeProblemSlug: "nt-divisibility-03",
  },
  {
    slug: "intro-modular-arithmetic",
    title: "Introduction to Modular Arithmetic",
    topicSlug: "modular-arithmetic",
    concept:
      "Working with remainders, and how they behave under addition, multiplication, and exponentiation.",
    explanation:
      "'a mod n' is the remainder when a is divided by n. Modular arithmetic respects addition and multiplication: (a+b) mod n = ((a mod n)+(b mod n)) mod n, and similarly for products. This makes it possible to find remainders of huge powers without ever computing the full number.",
    workedExample:
      "Find 2¹⁰ mod 7. 2¹⁰ = 1024, and 1024 = 7(146) + 2, so 2¹⁰ ≡ 2 (mod 7).",
    strategy:
      "For large exponents, look for a repeating cycle in the remainders (e.g. powers of 2 mod 7 cycle as 2, 4, 1, 2, 4, 1, ...) rather than computing the full power.",
    commonMistakes:
      "Confusing 'a mod n' with 'a divided by n' (they're different — mod gives only the remainder) trips up many students early on.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: ["nt-modular-01", "nt-modular-02"],
    challengeProblemSlug: "nt-modular-03",
  },
  {
    slug: "fundamental-counting-principle",
    title: "The Fundamental Counting Principle",
    topicSlug: "counting-principles",
    concept:
      "If a task has independent stages, multiply the number of choices at each stage.",
    explanation:
      "If one stage of a process can happen in m ways and a second, independent stage can happen in n ways, the whole process can happen in m × n ways. This principle underlies nearly all of combinatorics.",
    workedExample:
      "A restaurant offers 3 appetizers and 4 mains. Total combinations = 3 × 4 = 12.",
    strategy:
      "Break any counting problem into a sequence of independent decisions, then multiply the number of options at each step.",
    commonMistakes:
      "Adding instead of multiplying the number of choices at each stage is the most common counting-principle error.",
    difficulty: 2,
    isPremium: false,
    practiceProblemSlugs: ["combo-counting-01", "combo-counting-02"],
    challengeProblemSlug: "combo-perm-01",
  },
  {
    slug: "permutations-vs-combinations",
    title: "Permutations vs. Combinations",
    topicSlug: "permutations",
    concept:
      "Knowing when order matters (permutations) versus when it doesn't (combinations).",
    explanation:
      "A permutation counts arrangements where order matters (like a race's 1st, 2nd, 3rd place). A combination counts selections where order doesn't matter (like choosing a committee). Permutations of n items taken r at a time: n!/(n-r)!. Combinations: n!/(r!(n-r)!).",
    workedExample:
      "Choosing 3 books from 8 (order doesn't matter) uses combinations: C(8,3) = 8!/(3!5!) = 56.",
    strategy:
      "Ask yourself: if I swapped two of my selected items, would that count as a different outcome? If yes, use permutations; if no, use combinations.",
    commonMistakes:
      "Using the permutation formula when the problem actually describes an unordered selection (like a committee or a hand of cards) inflates the answer by a factor of r!.",
    difficulty: 4,
    isPremium: false,
    practiceProblemSlugs: ["combo-perm-02", "combo-comb-01"],
    challengeProblemSlug: "combo-comb-02",
  },
  {
    slug: "casework-and-pigeonhole",
    title: "Casework and the Pigeonhole Principle",
    topicSlug: "casework",
    concept:
      "Splitting a problem into clean cases, and using pigeonhole to guarantee outcomes without full enumeration.",
    explanation:
      "Casework means splitting a problem into distinct, non-overlapping scenarios and solving each separately. The pigeonhole principle says that if you place more than n items into n categories, at least one category must contain more than one item — useful for 'guarantee' problems.",
    workedExample:
      "To guarantee 2 people share a birth month, you need 12 + 1 = 13 people, since there are only 12 possible months (pigeonholes).",
    strategy:
      "For pigeonhole problems, always consider the worst-case ordering — the scenario that delays the guaranteed outcome as long as possible.",
    commonMistakes:
      "Forgetting to add the '+1' in pigeonhole problems (using n instead of n+1) undercounts the guarantee needed.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: ["combo-casework-01", "combo-pigeonhole-01"],
    challengeProblemSlug: "combo-pigeonhole-02",
  },
  {
    slug: "inclusion-exclusion",
    title: "Inclusion-Exclusion",
    topicSlug: "inclusion-exclusion",
    concept:
      "Counting the union of overlapping sets without double-counting their intersection.",
    explanation:
      "For two sets, |A ∪ B| = |A| + |B| - |A ∩ B|. Adding the two sets separately double-counts anything in both, so the overlap is subtracted back out once.",
    workedExample:
      "Of 30 students, 18 study Spanish, 15 study French, 8 study both. Studying at least one: 18+15-8=25. Studying neither: 30-25=5.",
    strategy:
      "For three or more overlapping sets, extend the pattern: add all singles, subtract all pairwise overlaps, add back the triple overlap.",
    commonMistakes:
      "Forgetting to subtract the intersection at all (just adding |A| + |B|) over-counts anyone in both groups.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: ["combo-inclexcl-01", "combo-casework-01"],
    challengeProblemSlug: "combo-inclexcl-01",
  },
  {
    slug: "basic-probability",
    title: "Basic Probability",
    topicSlug: "basic-probability",
    concept:
      "Probability as favorable outcomes divided by total equally likely outcomes.",
    explanation:
      "P(event) = (number of favorable outcomes) / (total number of equally likely outcomes). Always double-check that all outcomes in your sample space are actually equally likely before applying this formula directly.",
    workedExample:
      "Rolling a standard die, P(greater than 4) = |{5,6}| / 6 = 2/6 = 1/3.",
    strategy:
      "Write out the full sample space for small problems — it's the most reliable way to avoid missing or double-counting outcomes.",
    commonMistakes:
      "Forgetting to reduce the final fraction, or miscounting the total number of possible outcomes, are the most frequent errors.",
    difficulty: 2,
    isPremium: false,
    practiceProblemSlugs: ["prob-basic-01", "prob-basic-02"],
    challengeProblemSlug: "prob-counting-02",
  },
  {
    slug: "conditional-probability",
    title: "Conditional Probability",
    topicSlug: "conditional-probability",
    concept:
      "Updating probability once you know an event has already occurred.",
    explanation:
      "P(A|B) = P(A and B) / P(B) — the probability of A given that B has happened. This is especially important in 'without replacement' problems, where each draw changes the probabilities for the next.",
    workedExample:
      "A box has 3 red, 2 blue balls. P(both red, no replacement) = (3/5)(2/4) = 6/20 = 3/10.",
    strategy:
      "For 'without replacement' problems, update both the numerator and denominator after each draw before multiplying.",
    commonMistakes:
      "Treating draws 'without replacement' as if they were independent (reusing the same denominator each time) is the most common conditional probability mistake.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: ["prob-conditional-01", "prob-conditional-02"],
    challengeProblemSlug: "prob-conditional-02",
  },
  {
    slug: "expected-value",
    title: "Expected Value",
    topicSlug: "expected-value",
    concept:
      "The long-run average outcome of a random process, weighted by probability.",
    explanation:
      "Expected value = Σ(outcome × probability of that outcome). For repeated independent trials with success probability p, the expected number of successes in n trials is simply n × p.",
    workedExample: "4 fair coin flips: expected number of heads = 4 × 0.5 = 2.",
    strategy:
      "Break complex random processes into simpler pieces and use linearity of expectation — expected values add, even when the underlying events aren't independent.",
    commonMistakes:
      "Confusing expected value (a long-run average, which need not be a possible single outcome) with the most likely single outcome.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: ["prob-expected-01", "prob-expected-02"],
    challengeProblemSlug: "prob-counting-03",
  },
  {
    slug: "logical-deduction",
    title: "Logical Deduction",
    topicSlug: "deduction",
    concept: "Drawing guaranteed conclusions from a set of true statements.",
    explanation:
      "Deductive reasoning moves from general rules to specific, guaranteed conclusions. A classic pattern: if 'all A are B' and 'X is not B', then X cannot be A — this is the contrapositive of the original rule.",
    workedExample:
      "'All squares are rectangles' and 'this shape is not a rectangle' together guarantee the shape is not a square.",
    strategy:
      "When a problem gives several clues, look for the most restrictive one first — it usually pins down one variable, which then simplifies the rest.",
    commonMistakes:
      "Assuming a rule works in reverse (believing 'all squares are rectangles' means 'all rectangles are squares') is a very common logical error.",
    difficulty: 1,
    isPremium: false,
    practiceProblemSlugs: ["logic-deduction-01", "logic-puzzle-01"],
    challengeProblemSlug: "logic-puzzle-02",
  },
  {
    slug: "invariants-and-strategy-games",
    title: "Invariants and Strategy Games",
    topicSlug: "invariants",
    concept:
      "Finding a quantity that never changes (or changes predictably) to solve process and game problems.",
    explanation:
      "An invariant is a property that stays constant (or changes in a controlled way) no matter what moves are made. Spotting one often solves a problem instantly, without tracing every possible sequence of moves. In combinatorial games, identifying 'losing positions' (like multiples of 4 in a stone-removal game) lets you determine the winner without playing out every game.",
    workedExample:
      "Repeatedly summing the digits of 999,999,999 always lands on 9, because the digital root of any nonzero multiple of 9 is always 9 — an invariant of the process.",
    strategy:
      "For game-strategy problems, work backward from the end state to find which positions are 'losing' for the player about to move, then check whether the starting position is one of them.",
    commonMistakes:
      "Trying to brute-force every possible sequence of moves instead of searching for the underlying invariant wastes significant time on contests.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: ["logic-invariants-01", "logic-strategy-01"],
    challengeProblemSlug: "logic-strategy-01",
  },
  {
    slug: "intro-functional-equations",
    title: "Introduction to Functional Equations",
    topicSlug: "functional-equations",
    concept:
      "Deducing properties of an unknown function from a defining equation.",
    explanation:
      "A functional equation defines relationships a function must satisfy for all inputs, rather than giving an explicit formula. Common strategies include plugging in special values (like 0 or 1), looking for patterns by computing small cases, and checking whether the function must be linear.",
    workedExample:
      "If f(x+y) = f(x) + f(y) for all real x, y and f(1) = 5, then f(2) = f(1)+f(1) = 10, f(3) = 15, and in general f(n) = 5n, so f(7) = 35.",
    strategy:
      "Always try plugging in x = y = 0 or x = y first — it often reveals a base value like f(0) that unlocks the rest of the equation.",
    commonMistakes:
      "Assuming a functional equation forces a specific simple formula (like f(x) = 5x) without proving it holds for all inputs, not just integers.",
    difficulty: 8,
    isPremium: true,
    practiceProblemSlugs: ["adv-functional-01"],
    challengeProblemSlug: "adv-functional-01",
  },
  {
    slug: "am-gm-and-basic-inequalities",
    title: "AM-GM and Basic Inequalities",
    topicSlug: "inequalities-olympiad",
    concept:
      "Using the Arithmetic Mean–Geometric Mean inequality to find extrema without calculus.",
    explanation:
      "For non-negative reals a and b, (a+b)/2 ≥ √(ab), with equality exactly when a = b. This lets you find maximum products (given a fixed sum) or minimum sums (given a fixed product) instantly.",
    workedExample:
      "Minimize x + 4/x for x > 0. By AM-GM, x + 4/x ≥ 2√(x · 4/x) = 2√4 = 4, with equality at x = 2.",
    strategy:
      "Look for expressions that are a sum of terms whose product simplifies nicely — that's the signal to try AM-GM instead of calculus or brute algebra.",
    commonMistakes:
      "Forgetting to check the equality condition (that the terms can actually be equal given the problem's constraints) can lead to claiming an unreachable bound.",
    difficulty: 8,
    isPremium: true,
    practiceProblemSlugs: ["adv-inequality-01", "adv-inequality-02"],
    challengeProblemSlug: "adv-inequality-02",
  },
  {
    slug: "proof-by-contradiction",
    title: "Proof by Contradiction",
    topicSlug: "proof-techniques",
    concept:
      "Assuming the opposite of what you want to prove, then deriving an impossible consequence.",
    explanation:
      "To prove a statement P by contradiction, assume ¬P (the opposite) is true, then use valid logical steps to derive a contradiction — a statement that's impossible or self-contradictory. Since the assumption led to something false, ¬P must be false, so P must be true.",
    workedExample:
      "To prove infinitely many primes exist, assume finitely many do: p₁, ..., pₙ. The number N = p₁×p₂×...×pₙ + 1 is not divisible by any of them, so it must have a prime factor not in the list — contradicting the assumption that the list was complete.",
    strategy:
      "Proof by contradiction is especially powerful for 'there is no largest/smallest' or 'infinitely many exist' type statements, where a direct construction is hard.",
    commonMistakes:
      "Deriving something merely 'strange' rather than a true logical contradiction means the proof isn't actually complete.",
    difficulty: 8,
    isPremium: true,
    practiceProblemSlugs: ["adv-proof-01"],
    challengeProblemSlug: "adv-numtheory-01",
  },

  {
    slug: "ratios-and-proportions-explained",
    title: "Ratios & Proportions",
    topicSlug: "ratios-proportions",
    concept:
      "A ratio compares two or more quantities by division, and a proportion is a statement that two ratios are equal. Together they let you scale relationships up or down and solve for unknown quantities.",
    explanation:
      "A ratio a:b compares quantity a to quantity b, and it can be multiplied or divided by any nonzero number on both terms without changing the underlying relationship — 3:5 is the same relationship as 6:10 or 300:500. A proportion sets two ratios equal, a/b = c/d, and can always be solved by cross-multiplying: a·d = b·c. When a ratio like 3:5 describes parts of a whole, the whole splits into 3+5 = 8 equal parts, and each part has a fixed value once you know the total. This 'parts' idea is usually faster than setting up a fraction equation.",
    workedExample:
      "The ratio of boys to girls in a class is 5:6, and the class has 33 students total. Since 5+6 = 11 parts make up the whole class, each part represents 33/11 = 3 students. Girls make up 6 parts, so there are 6 × 3 = 18 girls, and boys make up the remaining 5 × 3 = 15 students. Check: 15 + 18 = 33.",
    strategy:
      "Whenever a ratio is given alongside a total, add the ratio terms to find the total number of parts, then divide the total by that sum to get the value of one part — this avoids fraction arithmetic entirely. For proportion equations with a variable, cross-multiply immediately rather than trying to simplify fractions first, since cross-multiplication works even when the fractions don't reduce nicely.",
    commonMistakes:
      "The most common error is treating a part-to-part ratio like 3:5 as if it were a fraction of the whole, computing 3/5 of the total instead of 3/8 of the total (since 3+5=8 parts make the whole). Another frequent mistake is cross-multiplying incorrectly by multiplying numerators together and denominators together instead of multiplying diagonally (a·d = b·c).",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "averages-and-weighted-averages",
    title: "Averages",
    topicSlug: "averages",
    concept:
      "The arithmetic mean of a set of numbers equals their sum divided by how many numbers there are, and this relationship can be flipped into sum = average × count to solve for missing values or weighted combinations.",
    explanation:
      "The average (arithmetic mean) of n numbers is their sum divided by n. The single most useful reformulation of this fact is sum = average × count, which turns 'find the missing value' problems into simple subtraction once you know the total sum required. When combining groups of different sizes, you cannot just average the group averages — you must compute a weighted average, where each group's average is weighted by how many members it contributes relative to the combined total. Ignoring group size and averaging the averages directly gives a biased answer that favors the smaller group.",
    workedExample:
      "A student scores 82, 91, and 76 on three tests and wants a 85 average across four tests. The total needed is 85 × 4 = 340. The sum of the first three scores is 82 + 91 + 76 = 249, so the fourth test must be 340 − 249 = 91. As a weighted-average example: Class A has 20 students averaging 80, and Class B has 30 students averaging 90. The combined average is (20 × 80 + 30 × 90) / 50 = (1600 + 2700) / 50 = 4300 / 50 = 86, which is closer to 90 than to 80 because Class B is larger — simply averaging 80 and 90 to get 85 would be wrong.",
    strategy:
      "Convert every average into a sum as your first step (sum = average × count) — this turns almost all average problems into ordinary addition and subtraction. For combined groups, always multiply each group's average by its own count before adding, then divide by the combined count; never average two averages unless the group sizes are equal.",
    commonMistakes:
      "Averaging averages directly instead of weighting by group size is the most common error, and it silently produces a wrong answer that looks reasonable. A second common mistake is forgetting to include every data point when reconstructing the sum from an average, especially in 'what score is needed' problems where students subtract the wrong number of known scores.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "number-properties-parity-divisibility",
    title: "Number Properties",
    topicSlug: "number-properties",
    concept:
      "Number properties problems test structural facts about integers — parity, divisibility rules, and prime factorization — rather than direct computation, and prime factorization is the key tool for finding GCD and LCM.",
    explanation:
      "Parity refers to whether an integer is odd or even: the sum of two even numbers is even, the sum of two odd numbers is even, the sum of an even and an odd number is odd, and any product involving at least one even number is even. Divisibility rules give shortcuts for checking factors without dividing: a number is divisible by 3 (or 9) exactly when its digit sum is divisible by 3 (or 9), and divisible by 4 exactly when its last two digits form a multiple of 4. Every integer greater than 1 factors uniquely into primes, and this factorization is the foundation for GCD and LCM: the GCD takes the minimum exponent of each shared prime, the LCM takes the maximum exponent of each prime appearing in either number, and the two are linked by GCD(a,b) × LCM(a,b) = a × b.",
    workedExample:
      "Find the GCD and LCM of 36 and 60. Factoring gives 36 = 2² × 3² and 60 = 2² × 3 × 5. The GCD takes the minimum exponent on each shared prime: 2² × 3¹ = 12. The LCM takes the maximum exponent on every prime present: 2² × 3² × 5 = 180. As a check, GCD × LCM = 12 × 180 = 2160, and 36 × 60 = 2160 as well, confirming the answer.",
    strategy:
      "For any GCD or LCM problem, factor every number into primes first — this turns the problem into simple exponent comparisons instead of guesswork. For parity problems, represent an unknown even number as 2k and an unknown odd number as 2k+1 and work through the algebra rather than trying to guess the pattern from a few examples.",
    commonMistakes:
      "A very common mistake is assuming GCD(a,b) × LCM(a,b) = a + b instead of a × b. Students also frequently misapply the divisibility rule for 4 by checking the full digit sum (that rule is for 3 and 9) instead of just the last two digits, and many forget that 1 is neither prime nor composite while 2 is the only even prime.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "exponent-and-radical-rules",
    title: "Exponents & Radicals",
    topicSlug: "exponents-radicals",
    concept:
      "Combining and simplifying expressions with integer exponents and radicals using the core exponent laws.",
    explanation:
      "The exponent rules let you rewrite products, quotients, and powers of powers without expanding anything by hand: a^m · a^n = a^(m+n), a^m ÷ a^n = a^(m−n), and (a^m)^n = a^(mn). A negative exponent flips the base into a denominator, a^(−n) = 1/a^n, and any nonzero base raised to the zero power equals 1. Radicals follow a parallel logic — √(ab) = √a · √b — so a radical can be simplified by pulling out the largest perfect square (or cube, for cube roots) hiding inside the radicand. Fractional exponents unify the two systems entirely: a^(1/n) means the nth root of a, and a^(m/n) means take the nth root, then raise to the m power (or vice versa).",
    workedExample:
      "Simplify (2^3 · 2^(−5))^2 ÷ 2^(−4). Inside the parentheses, combine the exponents: 2^3 · 2^(−5) = 2^(−2). Raising to the second power multiplies exponents: (2^(−2))^2 = 2^(−4). Dividing by 2^(−4) means subtracting exponents: 2^(−4) ÷ 2^(−4) = 2^0 = 1. For a radical example, simplify √50 + √18: 50 = 25 · 2, so √50 = 5√2, and 18 = 9 · 2, so √18 = 3√2. Since both terms are now 'like radicals,' add the coefficients: 5√2 + 3√2 = 8√2.",
    strategy:
      "On contest problems, the fastest path is almost always to rewrite every term with the same base before applying any exponent rule — mixed bases like 4^x and 2^(x+1) become easy once 4 is rewritten as 2^2. When a problem mixes radicals and exponents, convert the radicals to fractional-exponent form first so everything follows one consistent rule set. For radical simplification, always factor the radicand looking for the largest perfect square factor rather than the first one you notice, so you don't have to simplify twice.",
    commonMistakes:
      "The most common error is applying the product rule backward — writing a^m · a^n as a^(mn) instead of a^(m+n), or the reverse mistake on power-of-a-power problems. Another frequent slip is thinking a negative exponent makes the value negative; a^(−n) is always positive when a is positive, it's just a reciprocal. Finally, √a + √b is never equal to √(a+b) — radicals only combine through multiplication and division, never by adding what's inside the root.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "solving-and-graphing-inequalities",
    title: "Inequalities",
    topicSlug: "inequalities",
    concept:
      "Solving linear and compound inequalities and representing their solution sets on a number line, with careful attention to when the inequality sign must flip.",
    explanation:
      "Solving a linear inequality works almost exactly like solving an equation — add, subtract, multiply, or divide both sides by the same quantity to isolate the variable. The one critical exception is that multiplying or dividing both sides by a negative number reverses the direction of the inequality sign. A compound inequality, such as −2 < 2x − 4 ≤ 6, describes a variable trapped between two bounds at once; you solve it by performing the same operation on all three parts simultaneously (the left side, the middle expression, and the right side) until the variable is isolated in the middle. Solutions are typically shown on a number line, using an open circle for strict inequalities (< or >) and a filled circle for inequalities that include equality (≤ or ≥).",
    workedExample:
      "Solve −3x + 7 ≤ 1. Subtract 7 from both sides: −3x ≤ −6. Now divide both sides by −3, which flips the inequality: x ≥ 2. For a compound example, solve −2 < 2x − 4 ≤ 6. Add 4 to all three parts: 2 < 2x ≤ 10. Divide all three parts by 2 (positive, so no flip): 1 < x ≤ 5. The solution set is every x strictly greater than 1 and up to and including 5.",
    strategy:
      "Isolate the variable one operation at a time, exactly as you would for an equation, and pause every time you multiply or divide to ask whether the number you're using is negative. When a compound inequality looks intimidating, split it mentally into its two halves, solve each as if it were separate, and then recombine — this catches sign errors that get missed when working across the whole expression at once. Always test one point that should be in your solution set and one that shouldn't, plugging both into the original inequality to confirm your answer.",
    commonMistakes:
      "Forgetting to flip the inequality sign when multiplying or dividing by a negative number is by far the most common error, and it's easy to miss because the arithmetic still 'looks right.' Students also frequently treat a compound inequality as two disconnected statements and solve them with inconsistent operations on each side, which can silently break the compound structure. On number-line graphs, mixing up open and closed circles — using a filled dot for a strict inequality or vice versa — is a frequent point-losing mistake even when the algebra is correct.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "arithmetic-and-geometric-sequences-and-series",
    title: "Sequences & Series",
    topicSlug: "sequences",
    concept:
      "Recognizing arithmetic and geometric sequences, deriving their nth-term formulas, and computing the sums of their partial and (for geometric series) infinite series.",
    explanation:
      "An arithmetic sequence adds the same constant difference d between consecutive terms, so its nth term is a_n = a_1 + (n − 1)d, and the sum of its first n terms is S_n = n/2 · (a_1 + a_n) — essentially averaging the first and last term and multiplying by how many terms there are. A geometric sequence instead multiplies by the same constant ratio r each time, giving a_n = a_1 · r^(n−1), and the sum of its first n terms is S_n = a_1(1 − r^n)/(1 − r) for r ≠ 1. When a geometric series continues forever and |r| < 1, the terms shrink toward zero and the infinite sum converges to the elegant closed form S = a_1/(1 − r).",
    workedExample:
      "Find the sum of the first 10 terms of the arithmetic sequence 3, 7, 11, 15, ... Here a_1 = 3 and d = 4, so a_10 = 3 + 9(4) = 39. The sum is S_10 = 10/2 · (3 + 39) = 5 · 42 = 210. For a geometric example, find the sum of the infinite series 8 + 4 + 2 + 1 + ... The ratio is r = 1/2, which satisfies |r| < 1, so the sum converges to S = 8/(1 − 1/2) = 8/(1/2) = 16.",
    strategy:
      "Before doing any calculation, identify whether consecutive terms share a common difference (arithmetic) or a common ratio (geometric) — this single check determines which formula applies and prevents most setup errors. For arithmetic sums, the 'Gauss trick' of pairing the first and last term, second and second-to-last, and so on (each pair summing to the same value) is a fast way to sanity-check the S_n = n/2(a_1 + a_n) formula. For geometric series, always check whether the problem is asking for a finite sum of n terms or an infinite sum — the infinite formula only applies when |r| < 1.",
    commonMistakes:
      "Using the arithmetic sum formula on a sequence that is actually geometric (or vice versa) is the single most common mistake, since both formulas involve a_1 and n and can look interchangeable at a glance. Off-by-one errors are also frequent — mixing up a_n (the nth term itself) with a_(n−1) (the term before it), which throws off both the term formula and the sum. Finally, students sometimes apply the infinite geometric sum formula without checking |r| < 1; if |r| ≥ 1, the series diverges and has no finite sum at all.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "function-notation-domain-and-composition",
    title: "Functions",
    topicSlug: "functions",
    concept:
      "Evaluating function notation, determining the domain and range of a function, and composing two functions together.",
    explanation:
      "Function notation f(x) is simply a labeled input-output rule: to evaluate f(3), substitute 3 everywhere the variable x appears in the definition of f. The domain of a function is the full set of input values for which the function produces a valid, real output; the two most common restrictions on contests are that a denominator can never equal zero and that the expression under a square root (or any even root) can never be negative. Composition, written f(g(x)) or (f ∘ g)(x), means you evaluate the inner function first and then feed its output into the outer function as input — order matters, and f(g(x)) is generally not the same as g(f(x)).",
    workedExample:
      "Let f(x) = 2x − 1 and g(x) = x^2 + 3. Find f(g(2)): first compute the inner function, g(2) = 4 + 3 = 7, then apply the outer function, f(7) = 2(7) − 1 = 13. For a domain example, find the domain of h(x) = √(x − 4) / (x − 7). The radical requires x − 4 ≥ 0, so x ≥ 4, and the denominator requires x − 7 ≠ 0, so x ≠ 7. Combining both restrictions, the domain is all x with x ≥ 4 except x = 7, written as [4, 7) ∪ (7, ∞).",
    strategy:
      "Always work composition problems from the inside out — evaluate the innermost function call completely before touching the outer function, and never try to substitute both at once. For domain questions, handle each type of restriction (denominators, even radicals, logarithms) completely separately, write down each restricted interval on its own, and only intersect them at the very end. When a problem gives you f(g(x)) as a single combined expression rather than nested notation, it can help to substitute g(x) in for every x in f's formula and simplify carefully before evaluating.",
    commonMistakes:
      "Composing functions in the wrong order — computing g(f(x)) when the problem asked for f(g(x)) — is an extremely common and easy-to-miss error, since both expressions often use the same two functions. Another frequent mistake on domain problems is finding the restriction from the radical, treating the problem as solved, and forgetting that a denominator elsewhere in the same expression can add its own separate exclusion. Finally, f(x + h) is not the same as f(x) + h; the entire quantity (x + h) must be substituted for x, not added onto the output afterward.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "polynomial-operations-and-the-remainder-factor-theorems",
    title: "Polynomials",
    topicSlug: "polynomials",
    concept:
      "Multiplying and dividing polynomials, and using the Remainder and Factor Theorems together with synthetic division to locate roots.",
    explanation:
      "Polynomials can be divided using synthetic division whenever the divisor has the form (x − a): write down just the coefficients of the dividend (including zeros for any missing terms), bring down the leading coefficient, then repeatedly multiply by a and add to the next coefficient. The Remainder Theorem says that dividing a polynomial p(x) by (x − a) leaves a remainder equal to p(a) — no division required if you just want the remainder. The Factor Theorem is the direct consequence: (x − a) is a factor of p(x) exactly when p(a) = 0, which turns 'find the roots' problems into 'test candidate values and divide' problems, especially when paired with the Rational Root Theorem to narrow down which integers are worth testing.",
    workedExample:
      "Let p(x) = x^3 − 4x^2 + x + 6. Testing x = −1: p(−1) = −1 − 4 − 1 + 6 = 0, so by the Factor Theorem, (x + 1) is a factor. Using synthetic division with root −1 on coefficients 1, −4, 1, 6: bring down 1; multiply 1 × (−1) = −1, add to −4 to get −5; multiply −5 × (−1) = 5, add to 1 to get 6; multiply 6 × (−1) = −6, add to 6 to get a remainder of 0, confirming the factor. The quotient is x^2 − 5x + 6, which factors further as (x − 2)(x − 3). So p(x) = (x + 1)(x − 2)(x − 3), with roots x = −1, 2, and 3.",
    strategy:
      "Use the Rational Root Theorem to build a short list of candidates — every possible rational root is a factor of the constant term divided by a factor of the leading coefficient — rather than guessing randomly. Test the smallest candidates first (±1, ±2, and so on), since contest polynomials are usually built around small integer roots. Once one root is confirmed with the Factor Theorem, synthetic division reduces the polynomial's degree by one, making each subsequent root progressively easier to find.",
    commonMistakes:
      "Sign errors inside synthetic division are the most frequent mistake — remember the divisor (x − a) means you use a itself in the synthetic division row, not −a, so testing (x + 1) means using −1, not 1. Forgetting to include zero placeholders for missing-degree terms (for example, writing coefficients for x^3 + 2x + 5 as 1, 2, 5 instead of 1, 0, 2, 5) throws off every step that follows. Finally, finding one factor and stopping is a common shortcut mistake — always check whether the reduced quotient factors further, since a root can also repeat with higher multiplicity.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "area-and-perimeter-of-composite-figures",
    title: "Area & Perimeter",
    topicSlug: "area-volume",
    concept:
      "Computing area and perimeter of basic shapes and of composite figures built from them.",
    explanation:
      "Perimeter is the total distance around a shape's boundary, found by adding every side length (for curved edges, using arc length). Area is the amount of surface a shape covers, measured in square units. A rectangle has area length×width and perimeter 2(length+width); a triangle has area (1/2)×base×height; a circle has area πr² and circumference 2πr. When a figure is composite — built from several simple shapes stuck together or with pieces removed — split it into rectangles, triangles, and circular pieces, then add the areas of pieces that are present and subtract the areas of pieces that are cut out.",
    workedExample:
      "A running track's infield is a rectangle 40 m long and 20 m wide, with a semicircle of radius 10 m attached to each of the two short ends. The rectangle contributes 40×20=800 m². Each semicircle has area (1/2)π(10)²≈157.08 m², and there are two, adding about 314.16 m². Total infield area ≈800+314.16=1114.16 m². For the perimeter, the two straight 40 m sides plus the two semicircular ends — which together form one full circle of radius 10 — give perimeter ≈2(40)+2π(10)=80+62.83≈142.83 m.",
    strategy:
      "Redraw a composite figure with dashed lines splitting it into pieces you already have formulas for, and label each piece as 'add' or 'subtract' before computing anything. For perimeter, trace only the true outer boundary of the figure — any dashed lines you drew just to split the shape for area purposes are never part of the perimeter.",
    commonMistakes:
      "Confusing area and perimeter formulas — especially doubling a length-width sum when area was asked for, or multiplying when perimeter was asked for. Another frequent error is using the diameter instead of the radius inside a circle formula. When a piece is removed (a hole, a notch, a bite taken out), forgetting to subtract that piece's area is the single most common composite-figure mistake.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "volume-and-surface-area-of-solids",
    title: "Volume & Surface Area",
    topicSlug: "three-d-geometry",
    concept:
      "Computing volume and surface area of rectangular prisms, cylinders, and spheres.",
    explanation:
      "Volume measures the space a solid occupies, in cubic units; surface area measures the total area of all outer faces, in square units. A rectangular prism has volume V=lwh and surface area SA=2(lw+lh+wh). A cylinder has volume V=πr²h; its surface area is the two circular bases plus the lateral surface, which unrolls flat into a rectangle of width 2πr (the base's circumference) and height h, giving SA=2πr²+2πrh. A sphere has volume V=(4/3)πr³ and surface area SA=4πr². Compound solids are handled the same way composite areas are: find the volume (or surface area) of each simple piece and add or subtract as the figure requires.",
    workedExample:
      "A cylindrical can has radius 3 cm and height 10 cm. Its volume is π(3)²(10)=90π≈282.74 cm³. Its surface area comes from the two circular bases, 2π(3)²=18π, plus the lateral surface, 2π(3)(10)=60π, for a total of 18π+60π=78π≈244.92 cm².",
    strategy:
      "Break surface area into its named pieces — top, bottom, and lateral surface — and compute each one separately before summing; this prevents silently forgetting a face. Decide up front whether a question wants volume ('how much fits inside') or surface area ('how much material covers the outside'), since the two are easy to conflate. For compound solids, add or subtract the volumes (or surface areas) of the component simple solids one at a time.",
    commonMistakes:
      "A very common error is computing volume when the question asks for surface area, or vice versa — always reread the question before substituting into a formula. Another frequent mistake is forgetting to include both circular bases of a cylinder, or forgetting the lateral surface entirely and reporting only the bases.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "coordinate-geometry-essentials",
    title: "Coordinate Geometry",
    topicSlug: "coordinate-geometry",
    concept:
      "Using the distance formula, midpoint formula, and slope to analyze points and lines in the coordinate plane.",
    explanation:
      "The distance between two points (x1,y1) and (x2,y2) is √((x2-x1)²+(y2-y1)²), which is just the Pythagorean theorem applied to the horizontal and vertical gaps between the points. The midpoint of that same segment is the average of the coordinates: ((x1+x2)/2, (y1+y2)/2). The slope of the line through the two points is the 'rise over run,' (y2-y1)/(x2-x1). Two lines are parallel exactly when their slopes are equal, and perpendicular exactly when their slopes multiply to -1 (negative reciprocals of each other).",
    workedExample:
      "Find the distance, midpoint, and slope between (1,2) and (5,-1). The horizontal difference is 5-1=4 and the vertical difference is -1-2=-3, so the distance is √(4²+(-3)²)=√25=5. The midpoint is ((1+5)/2, (2-1)/2)=(3, 0.5). The slope is (-1-2)/(5-1)=-3/4, so a line through both points can be written in point-slope form as y-2=-3/4(x-1).",
    strategy:
      "Watch for Pythagorean triples hidden in the coordinate differences (3-4-5, 6-8-10, 5-12-13) — they let you find a distance without a calculator. When checking parallel or perpendicular lines, compute each slope as a single fraction and compare, rather than converting both lines all the way to slope-intercept form first if you don't need the intercept.",
    commonMistakes:
      "Subtracting coordinates in a different order for the numerator than for the denominator of the slope formula silently flips its sign — always use (y2-y1)/(x2-x1) with the same point order in both. Another common slip is stopping at the sum of squares in the distance formula and forgetting to take the square root.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "geometric-transformations",
    title: "Transformations",
    topicSlug: "transformations",
    concept:
      "Translations, reflections, rotations, and dilations of figures in the coordinate plane.",
    explanation:
      "A translation shifts every point of a figure by a fixed amount, (x,y)→(x+a,y+b). A reflection flips a figure across a line: across the x-axis, (x,y)→(x,-y); across the y-axis, (x,y)→(-x,y); across the line y=x, (x,y)→(y,x). A rotation about the origin turns every point through a fixed angle; 90° counterclockwise sends (x,y)→(-y,x), 180° sends (x,y)→(-x,-y), and 270° counterclockwise (equivalently 90° clockwise) sends (x,y)→(y,-x). A dilation about a center scales every distance from that center by a fixed factor k; about the origin this is (x,y)→(kx,ky), which multiplies every length in the figure by k and every area by k².",
    workedExample:
      "Start with point A=(2,3). Reflecting A across the y-axis gives A'=(-2,3). Rotating A' by 90° counterclockwise about the origin using (x,y)→(-y,x) gives A''=(-3,-2). Dilating A'' by a factor of 2 about the origin gives A'''=(-6,-4).",
    strategy:
      "Memorize the coordinate rules for the four basic rotations and the three basic reflections rather than re-deriving them from a sketch every time — it is much faster on a timed contest. For dilations, remember that lengths scale by k but area scales by k², which matters whenever a problem asks about area after a size change.",
    commonMistakes:
      "Mixing up the reflection-across-the-x-axis rule with the reflection-across-the-y-axis rule is extremely common — one negates the y-coordinate, the other negates the x-coordinate. Another frequent error is confusing the 90° counterclockwise rule (x,y)→(-y,x) with its clockwise mirror image (x,y)→(y,-x); double-check which direction the problem specifies.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "angles-and-properties-of-polygons",
    title: "Polygons",
    topicSlug: "polygons",
    concept:
      "Interior and exterior angle sums, diagonal counts, and properties of regular polygons.",
    explanation:
      "The interior angles of any convex n-gon sum to (n-2)×180°, which comes from splitting the polygon into (n-2) triangles from one vertex. For a regular n-gon, every interior angle is equal, so each one measures (n-2)×180°/n. The exterior angles of any convex polygon, taken one per vertex and traced consistently around the shape, always sum to 360° regardless of how many sides it has; for a regular n-gon each exterior angle is 360°/n. The number of diagonals in an n-gon is n(n-3)/2, since each vertex connects to n-3 other vertices by a diagonal (excluding itself and its two neighbors), and each diagonal gets counted from both of its endpoints.",
    workedExample:
      "A regular decagon has n=10 sides. Its interior angle sum is (10-2)×180°=1440°, so each interior angle measures 1440°/10=144°. Each exterior angle is 180°-144°=36°, and indeed 36°×10=360°, confirming the exterior-angle-sum rule. The number of diagonals is 10(10-3)/2=35.",
    strategy:
      "When a problem gives one interior or exterior angle of a regular polygon, use the exterior angle to find n quickly via n=360°/(exterior angle), since exterior angles avoid the extra (n-2) term that makes the interior-angle formula harder to invert.",
    commonMistakes:
      "Using n instead of (n-2) in the interior angle sum formula is the most common error. A close second is forgetting that the 360° exterior-angle-sum rule only holds for convex polygons traced consistently in one rotational direction — it does not apply directly to concave (non-convex) polygons.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "gcd-and-lcm-fundamentals",
    title: "GCD & LCM",
    topicSlug: "integer-properties",
    concept:
      "The greatest common divisor (GCD) is the largest integer dividing two numbers, and the least common multiple (LCM) is the smallest positive integer both numbers divide. They are linked by the identity gcd(a, b) · lcm(a, b) = a · b.",
    explanation:
      "The Euclidean algorithm computes gcd(a, b) efficiently without factoring: repeatedly replace the larger number with the remainder when it is divided by the smaller, until the remainder is 0. The last nonzero remainder is the gcd. Once you know the gcd, the lcm follows immediately from lcm(a, b) = (a · b) / gcd(a, b), since this identity holds for every pair of positive integers. This is almost always faster than factoring both numbers into primes, especially when the numbers are large or you don't immediately see their factorizations.",
    workedExample:
      "Find gcd(84, 126) and lcm(84, 126). Divide 126 by 84: 126 = 1(84) + 42. Divide 84 by 42: 84 = 2(42) + 0. The remainder is 0, so gcd(84, 126) = 42. Then lcm(84, 126) = (84 · 126) / 42 = 10584 / 42 = 252. Check: 252 / 84 = 3 and 252 / 126 = 2, both integers, confirming 252 is a common multiple, and it's the smallest one.",
    strategy:
      "Reach for the Euclidean algorithm whenever the numbers are large or awkward to factor by inspection — it takes only a handful of division steps regardless of size. Reach for prime factorization instead when you need the gcd or lcm of three or more numbers at once, since the a·b/gcd shortcut only applies to pairs. When a problem gives you the gcd and asks for the lcm (or vice versa) along with the product ab, the identity gcd·lcm = ab is almost always the intended shortcut.",
    commonMistakes:
      "A common error is applying gcd(a,b)·lcm(a,b) = a·b to three numbers at once — it only holds for exactly two numbers; for three numbers you must factor into primes and take the min/max exponents. Another frequent slip is stopping the Euclidean algorithm one step too early and reporting the second-to-last remainder instead of the last nonzero one. Students also sometimes compute lcm by listing multiples by hand and stop before reaching the true smallest common one, especially when the numbers share no small common multiple.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "converting-between-number-bases",
    title: "Base Representations",
    topicSlug: "number-patterns",
    concept:
      "A number written in base b is a sum of digits times decreasing powers of b, where each digit is an integer from 0 to b−1. Converting between bases means re-expressing the same quantity using a different set of place values.",
    explanation:
      "To convert a base-10 number into base b, repeatedly divide by b and record the remainders — each remainder is one digit, and the digits come out in reverse order (least significant first), so you must read them bottom to top to get the final answer. To convert a base-b number back into base 10, expand it using place values: the rightmost digit is multiplied by b^0, the next by b^1, and so on, then sum the results. Every digit in a valid base-b numeral must be strictly less than b; a '9' can never appear in a base-8 numeral, for instance.",
    workedExample:
      "Convert 347 (base 10) to base 6. Divide repeatedly: 347 ÷ 6 = 57 remainder 5; 57 ÷ 6 = 9 remainder 3; 9 ÷ 6 = 1 remainder 3; 1 ÷ 6 = 0 remainder 1. Reading the remainders from last to first gives 1335 in base 6. Check by expanding: 1(6³) + 3(6²) + 3(6¹) + 5(6⁰) = 216 + 108 + 18 + 5 = 347, which matches.",
    strategy:
      "When converting decimal to base b, set up a clean division table with a 'quotient' and 'remainder' column and don't stop until the quotient reaches 0 — then read remainders bottom to top. When converting from base b to decimal, write out the place values (…, b³, b², b¹, b⁰) above each digit before multiplying, so you don't misalign digits with the wrong power. For contest problems that ask which base makes a number divisible by something, or compare the same value across two bases, setting up the expanded polynomial form is usually the fastest path to an equation you can solve.",
    commonMistakes:
      "The single most common error is writing the remainders in the order they were computed instead of reversing them, which produces the digits backwards. Another frequent mistake is using a digit that is too large for the base — for example writing an '8' in a base-8 numeral, when valid digits only run from 0 to 7. Students also sometimes forget that b⁰ = 1, and misalign the place-value exponents by one when expanding a base-b numeral into decimal.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "linear-diophantine-equations",
    title: "Diophantine Equations",
    topicSlug: "diophantine-equations",
    concept:
      "A linear Diophantine equation ax + by = c asks for integer solutions only. It has a solution if and only if gcd(a, b) divides c, and when it does, there are infinitely many integer solutions forming a predictable family.",
    explanation:
      "First check solvability: if g = gcd(a, b) does not divide c, there are no integer solutions at all, since every value of ax + by is automatically a multiple of g. If g does divide c, divide the entire equation by g to get a reduced equation with coprime coefficients, find one particular solution (x₀, y₀) by inspection or the extended Euclidean algorithm, and then generate every other solution using x = x₀ + (b/g)t and y = y₀ − (a/g)t for any integer t. This family covers all integer solutions — no others exist.",
    workedExample:
      "Solve 15x + 24y = 39. First, gcd(15, 24) = 3, and 3 divides 39, so solutions exist. Dividing everything by 3 gives the reduced equation 5x + 8y = 13. Testing x = 1 gives 5 + 8y = 13, so y = 1, giving the particular solution (1, 1). The general solution is x = 1 + 8t, y = 1 − 5t. Checking t = 1: x = 9, y = −4, and 15(9) + 24(−4) = 135 − 96 = 39, confirming the family is correct.",
    strategy:
      "Always check the divisibility condition gcd(a,b) | c before searching for a solution — if it fails, you can immediately declare 'no solutions' and move on. To find a particular solution quickly, divide by the gcd first so the coefficients are coprime, then try small values of x (or y) until the other variable comes out as an integer; this is usually faster than running the full extended Euclidean algorithm by hand on a contest. When a problem restricts x and y to positive integers or a bounded range, plug the general solution's t-parameter into the inequality constraints to find how many valid integer values of t exist.",
    commonMistakes:
      "A very common mistake is solving the reduced equation but forgetting to divide the original coefficients by the gcd first, which leads to an inconsistent or overly restrictive search. Another is mixing up the signs or coefficients in the general solution formula — it's x = x₀ + (b/g)t and y = y₀ − (a/g)t, not the other way around, and a sign flip silently produces a family that fails to satisfy the original equation. Students also forget that t ranges over all integers, including negative ones, when a problem asks for 'all' solutions or the smallest positive one.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "divisor-and-totient-functions",
    title: "Number-Theoretic Functions",
    topicSlug: "primes",
    concept:
      "Number-theoretic functions like d(n) (number of divisors), σ(n) (sum of divisors), and φ(n) (Euler's totient, counting integers up to n coprime to n) are all multiplicative and can be computed directly from a number's prime factorization.",
    explanation:
      "If n = p₁^a₁ · p₂^a₂ · … · pₖ^aₖ, then d(n) = (a₁+1)(a₂+1)…(aₖ+1), counting every combination of exponents from 0 up to each aᵢ. The sum of divisors is σ(n) = ∏ (pᵢ^(aᵢ+1) − 1)/(pᵢ − 1), applying the geometric series formula to each prime's divisor contributions and multiplying the results together. Euler's totient is φ(n) = n · ∏ (1 − 1/pᵢ), taken over the distinct primes dividing n; all three functions are multiplicative, meaning f(mn) = f(m)f(n) whenever gcd(m, n) = 1, which is exactly why factoring first and combining prime-power pieces afterward always works.",
    workedExample:
      "Let n = 360 = 2³ · 3² · 5¹. Then d(360) = (3+1)(2+1)(1+1) = 4 · 3 · 2 = 24 divisors. For σ(360), compute each factor: (2⁴−1)/(2−1) = 15, (3³−1)/(3−1) = 13, (5²−1)/(5−1) = 6, so σ(360) = 15 · 13 · 6 = 1170. For φ(360) = 360 · (1 − 1/2) · (1 − 1/3) · (1 − 1/5) = 360 · (1/2) · (2/3) · (4/5) = 96.",
    strategy:
      "Always factor n into primes before touching any of these formulas — none of d(n), σ(n), or φ(n) can be computed reliably from n itself without its factorization. Keep the three formulas straight by remembering their shapes: d(n) uses (exponent+1) products, σ(n) uses the geometric-series formula per prime, and φ(n) uses n times (1 − 1/p) per distinct prime. When a problem gives you the value of one of these functions and asks you to find n, work backward from the factorization structure — e.g., d(n) = 24 constrains which exponent combinations are possible — rather than guessing numbers and checking.",
    commonMistakes:
      "A frequent error is applying the φ(n) = n·∏(1−1/p) formula using repeated primes instead of distinct primes — each prime factor should appear only once in the product regardless of its exponent. Another common mistake is confusing the divisor-count formula (which adds 1 to each exponent) with the divisor-sum formula (which uses a geometric series), leading students to compute σ(n) as if it were d(n) with primes multiplied in. Finally, students often forget that these functions are only multiplicative for coprime arguments, and incorrectly try to split f(n) across factors that share a common prime.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "combinations-choosing-groups",
    title: "Combinations",
    topicSlug: "combinations",
    concept:
      "Combinations count the number of ways to choose a subset of items from a larger group when the order of selection does not matter.",
    explanation:
      "A combination of k items chosen from a set of n items is written C(n, k) and computed as n! / (k!(n-k)!). This differs from a permutation because swapping the order of the chosen items does not create a new outcome — choosing Amy, Ben, and Cara for a committee is the same group regardless of the order you picked their names. One useful way to see the formula: there are n!/(n-k)! ways to pick an ordered sequence of k items (a permutation), and each unordered group of k items can be arranged in k! different orders, so dividing by k! removes the overcounting from order. The symmetry identity C(n, k) = C(n, n-k) reflects the fact that choosing which k items to include is equivalent to choosing which n-k items to leave out.",
    workedExample:
      "A club has 7 members, and a 3-person committee must be selected. Since the committee has no distinct roles, order doesn't matter, so use combinations: C(7, 3) = 7! / (3! · 4!) = (7 · 6 · 5) / (3 · 2 · 1) = 210 / 6 = 35. There are 35 possible committees.",
    strategy:
      "Before reaching for a formula, ask whether swapping two selected items would create a genuinely different outcome. If the answer is no — as with committees, teams, subsets, or unordered pairs — you need a combination, not a permutation. It often helps to compute the ordered count first (a permutation) and then divide by k! to strip out the redundant orderings, since this makes the reasoning behind the formula transparent rather than mechanical.",
    commonMistakes:
      "The most frequent error is using n!/(n-k)! (a permutation) when the problem actually has no ordering, which overcounts every group by a factor of k!. A second common mistake is misidentifying k — for example, in 'choose 5 from 8,' some students mistakenly compute C(8,3) thinking they need the complement, forgetting that C(8,5) and C(8,3) happen to be equal only because of the symmetry identity, not because either one is automatically correct without checking.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "binomial-theorem-expanding-powers",
    title: "Binomial Theorem",
    topicSlug: "combinations",
    concept:
      "The binomial theorem gives a direct formula for expanding (a + b)^n without multiplying out the product term by term.",
    explanation:
      "The binomial theorem states that (a + b)^n = Σ (from k=0 to n) C(n, k) · a^(n-k) · b^k. Each term in the expansion corresponds to choosing k of the n factors to contribute a 'b' and the remaining n-k factors to contribute an 'a'; the coefficient C(n, k) counts how many ways that choice can be made. The exponents on a and b in any single term always add up to n, and the coefficients across the full expansion match the entries of row n of Pascal's triangle. Two useful special cases follow immediately: setting a = b = 1 gives 2^n as the sum of all the coefficients, and setting a = 1, b = -1 gives an alternating sum of coefficients that equals 0 for n ≥ 1.",
    workedExample:
      "Find the coefficient of x^3 in the expansion of (x + 3)^5. Here a = x, b = 3, and n = 5. The term containing x^3 needs the exponent on a to be 3, so n - k = 3, meaning k = 2. That term is C(5, 2) · x^3 · 3^2 = 10 · x^3 · 9 = 90x^3, so the coefficient is 90.",
    strategy:
      "To find one specific term or coefficient without expanding everything, identify which value of k produces the exponent you want on the variable of interest, then plug that single k into C(n, k) · a^(n-k) · b^k. This is far faster than writing out the whole expansion, especially when n is large or when b is a more complicated expression like -2x or 3/2.",
    commonMistakes:
      "A very common slip is forgetting to raise the entire second term — including any coefficient or sign — to the power k, not just the variable; for instance, in (2x - 1)^4 the term with k = 2 contributes (2x)^2 · (-1)^2, not just x^2. Another frequent mistake is mismatching which exponent goes with which term, writing a^k · b^(n-k) instead of a^(n-k) · b^k, which silently swaps which factor gets which power and produces the wrong coefficient.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "pigeonhole-principle-guaranteed-matches",
    title: "Pigeonhole Principle",
    topicSlug: "pigeonhole",
    concept:
      "The pigeonhole principle guarantees that if more items are distributed into fewer containers than items, at least one container must hold more than one item.",
    explanation:
      "In its simplest form, the pigeonhole principle says that if n items ('pigeons') are placed into m containers ('holes') and n > m, then at least one container holds at least two items — no clever arrangement can avoid it. The generalized version states that if n items are placed into m containers, some container must hold at least ⌈n/m⌉ items (the ceiling of n divided by m). These problems are 'guarantee' problems: they ask for the smallest number of items that forces a certain outcome no matter how the items are distributed, so the right way to think about them is always through the worst possible arrangement, not a lucky one.",
    workedExample:
      "A drawer contains socks in 4 different colors, mixed together in the dark. How many socks must you pull out to guarantee you have a matching pair? Think of the 4 colors as 4 holes. If you pull out only 4 socks, it's possible (in the worst case) that you get exactly one of each color — no match yet. Pulling a 5th sock forces it to repeat one of the 4 colors already drawn, guaranteeing a pair. The answer is 5, which matches the formula: 4 holes + 1.",
    strategy:
      "Start by clearly identifying what the 'pigeons' are and what the 'holes' are — this is often the hardest and most important step. Then imagine the worst-case distribution: how many items can be spread out with no two in the same hole? The answer to the guarantee question is always one more than that worst-case count, or more generally ⌈n/m⌉ when you need a hole to contain a specific number of items rather than just two.",
    commonMistakes:
      "A frequent error is computing the average or a 'typical' distribution instead of the true worst case, which understates the number needed for a guarantee. Another common mistake is off-by-one errors — forgetting that you need one more than the maximum number of pigeons that can avoid a repeat, so the guarantee threshold is (number of holes) + 1, not just the number of holes itself.",
    difficulty: 5,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "recursive-counting-from-smaller-cases",
    title: "Recursive Counting",
    topicSlug: "recursion-in-counting",
    concept:
      "Recursive counting solves a hard counting problem by expressing the answer for size n in terms of answers for smaller sizes, then building up from known base cases.",
    explanation:
      "Some counting problems don't have a clean closed-form formula, but the count for a size-n version of the problem can be related to the counts for smaller versions of the same problem. The strategy is to define f(n) as the quantity you want to count, find one or more base cases (usually f(1) and f(2), computed directly), and then find a recurrence — an equation expressing f(n) in terms of f(n-1), f(n-2), or other earlier terms — usually by casing on what happens at the 'last step' of the structure being counted. Once the recurrence and base cases are known, you can compute f(n) for any n by working upward, without ever needing a single formula that covers all cases at once.",
    workedExample:
      "How many ways can you tile a 1×6 board using only 1×1 tiles and 1×2 tiles? Let f(n) be the number of ways to tile a 1×n board. Case on the last tile placed: if it's a 1×1 tile, the rest of the board is a 1×(n-1) board, contributing f(n-1) ways; if it's a 1×2 tile, the rest is a 1×(n-2) board, contributing f(n-2) ways. So f(n) = f(n-1) + f(n-2), with base cases f(1) = 1 and f(2) = 2. Building up: f(3) = 3, f(4) = 5, f(5) = 8, f(6) = 13. There are 13 ways to tile the 1×6 board.",
    strategy:
      "Look for recursive structure whenever a problem describes a process built up step by step (tiling a strip, climbing stairs, arranging items with a local restriction) rather than a single unordered selection. The key move is to case on the very last step or the very first step of the construction, since that split naturally reduces the problem to smaller instances of the same problem. Always verify your recurrence against the base cases by hand for the first few values before trusting it for larger n.",
    commonMistakes:
      "The most common mistake is getting the base cases wrong, especially f(1) and f(2), which then propagates an error through every later term. Another mistake is casing on the last step in a way that double-counts or misses possibilities — for example, forgetting that a 1×2 tile could be placed in more than one orientation in a two-dimensional grid problem, or failing to check that the cases considered are truly exhaustive and mutually exclusive.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "probability-distributions-fundamentals",
    title: "Probability Distributions",
    topicSlug: "counting-probability",
    concept:
      "A probability distribution lists every possible outcome of a random variable along with its probability, with all probabilities summing to 1; the binomial distribution models repeated independent trials with two outcomes each.",
    explanation:
      "A discrete random variable's probability distribution assigns a nonnegative probability to each of its possible values, and those probabilities must add up to exactly 1 — this is the single check that catches most setup mistakes. Distributions can be written as a table, a bar chart, or a formula, and all three represent the same information. The most important named distribution on competitions is the binomial distribution, which arises whenever you repeat the same independent trial n times, each trial has only two outcomes (success or failure), and each trial has the same success probability p. The probability of getting exactly k successes out of n trials is P(X=k) = C(n,k) * p^k * (1-p)^(n-k), where C(n,k) is the number of ways to choose which k of the n trials are successes. The expected number of successes in a binomial distribution has the convenient shortcut E(X) = n*p, which is much faster than summing the entire distribution by hand.",
    workedExample:
      "A fair coin is flipped 6 times. Find the probability of getting exactly 4 heads. This is binomial with n=6, p=1/2, k=4. The number of ways to choose which 4 flips are heads is C(6,4) = 15. Each specific sequence of 4 heads and 2 tails has probability (1/2)^6 = 1/64. So P(X=4) = 15 * (1/64) = 15/64.",
    strategy:
      "Before computing anything, verify a problem is truly binomial by checking three things: a fixed number of trials, exactly two outcomes per trial, and the same success probability on every trial — if trials affect each other (like drawing cards without replacement), a different distribution is needed. For 'at least' or 'at most' questions, it is almost always faster to compute the complement and subtract from 1 than to add up several binomial terms directly. Memorizing Pascal's triangle up through row 6 or 7 lets you write down C(n,k) instantly instead of recomputing factorials under time pressure.",
    commonMistakes:
      "The most common error is forgetting the counting factor C(n,k) entirely and computing only p^k*(1-p)^(n-k), which gives the probability of one specific ordering rather than the probability of any arrangement with k successes. Another frequent mistake is applying the binomial formula to dependent trials, such as drawing marbles without replacement, where the success probability changes from draw to draw. Students also sometimes forget that probabilities in any valid distribution must sum to 1, which is a fast way to catch an arithmetic slip before submitting an answer.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "geometric-probability-fundamentals",
    title: "Geometric Probability",
    topicSlug: "counting-probability",
    concept:
      "Geometric probability extends probability to situations with infinitely many equally likely outcomes, replacing counting with measuring length, area, or volume.",
    explanation:
      "When outcomes correspond to points chosen uniformly at random from a segment, a region, or a solid, there's no way to count favorable outcomes over total outcomes, since both are infinite. Instead, the probability of landing in some target region equals the measure of that target divided by the measure of the whole space: a ratio of lengths in one dimension, a ratio of areas in two dimensions, or a ratio of volumes in three dimensions. This works because uniform randomness means every subregion's probability is proportional to its size, so the fraction of space occupied by the target directly gives the probability. A frequent and powerful variation involves two independent random quantities, such as two people each arriving at a random time within some interval; plotting both quantities as coordinates turns the problem into a random point chosen uniformly inside a square, and the condition of interest (like the two people overlapping) becomes a specific region whose area can be computed with ordinary geometry.",
    workedExample:
      "A square dartboard has side length 8. A circular target of radius 2 is centered on the board, and a dart lands at a uniformly random point on the board. Find the probability the dart lands inside the circle. The area of the square is 8*8 = 64. The area of the circle is pi*2^2 = 4*pi. The probability is (area of circle)/(area of square) = 4*pi/64 = pi/16.",
    strategy:
      "Always identify the full sample space first (the entire segment, region, or solid the point comes from) and the target region second, since the final answer is always target measure divided by whole-space measure. For two-variable timing problems, sketch a square with each variable on an axis; the condition described in the problem (like 'the two arrival times differ by less than some amount') usually becomes a band or triangle whose area is straightforward to compute using basic area formulas. Since the ratio cancels units, you can work in any convenient unit as long as you're consistent between the target and the whole space.",
    commonMistakes:
      "A very common mistake is comparing linear measurements, like radius to side length, instead of areas — since area scales with the square of length, a ratio of radii is never the correct probability in a two-dimensional problem. Another mistake is miscounting the boundary of the target region, especially in 'meeting time' problems, where students forget to subtract or add the right triangular regions when the condition involves an inequality like |x - y| < k. Finally, students sometimes forget to double check that the target region lies entirely within the sample space before computing its area, which can lead to overcounting if the regions actually overlap the boundary awkwardly.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "logic-puzzle-grids-and-elimination",
    title: "Logic Puzzles",
    topicSlug: "logical-puzzles",
    concept:
      "Solving multi-clue logic puzzles by organizing statements into a grid and eliminating impossible pairings until only one consistent assignment remains.",
    explanation:
      'A logic puzzle gives you a set of categories (people, houses, pets, times, etc.) and a list of clues describing relationships between them, then asks you to match everything up correctly. The key tool is a grid with one axis per pair of categories: mark an X when a clue rules out a combination, and mark a check when a clue forces one. Every check you place lets you immediately X out that same row and column everywhere else, because each item in a category is used exactly once. Work through clues in order of how restrictive they are — clues that name a specific pair ("Amy owns the cat") should be applied before vaguer clues ("the cat owner is older than Ben"), since direct clues shrink the grid fastest and make the vague clues easier to test.',
    workedExample:
      "Three friends — Dana, Eli, and Farah — each play exactly one sport: soccer, tennis, or chess. Clue 1 (direct): Farah plays tennis. Clue 2 (negative): Dana does not play chess. Apply the direct clue first: Farah = tennis, so cross out tennis for both Dana and Eli in the grid. Now apply Clue 2: Dana does not play chess, and tennis is already taken by Farah, so the only sport left open for Dana is soccer. With Farah = tennis and Dana = soccer, the only sport remaining for Eli is chess. The completed assignment is Dana = soccer, Eli = chess, Farah = tennis, and every clue checks out.",
    strategy:
      "Build the grid before reading every clue twice — draw it, list categories on each axis, then go clue by clue placing checks and X's rather than trying to hold the whole puzzle in your head. Apply the most specific, direct clues first (ones naming an exact pair) so the grid fills in quickly, then use the remaining open cells to test vaguer relational clues like orderings or comparisons. Whenever a row or column has only one open cell left, that cell must be a check — cascade this deduction immediately, since it often unlocks several more forced cells in a chain.",
    commonMistakes:
      'A frequent error is treating a clue like "the tennis player is not Ben" as if it also tells you who does play tennis — negative clues only eliminate one possibility and never confirm another by themselves. Another common mistake is forgetting to cross-eliminate: once you mark a check for one pairing, students often forget to X out that row and column in every other category, which causes contradictions later. Finally, students sometimes apply relational clues (older than, before, more than) too early, before enough direct clues have narrowed the grid, leading to guessing rather than deduction; save comparison clues for after the direct clues have been fully applied.',
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "graph-theory-basics-degrees-and-connectivity",
    title: "Basic Graph Theory",
    topicSlug: "graph-theory",
    concept:
      "Representing relationships as vertices and edges, and using degree counting, the Handshake Lemma, and basic structural facts (paths, cycles, trees, bipartiteness) to solve counting and existence problems.",
    explanation:
      "A graph is a collection of vertices (dots) connected by edges (lines), used to model anything with pairwise relationships — friendships, roads, handshakes, games in a tournament. The degree of a vertex is the number of edges touching it. The Handshake Lemma states that the sum of all vertex degrees in a graph equals twice the number of edges, since each edge contributes exactly 1 to the degree of each of its two endpoints; a direct consequence is that the number of vertices with odd degree must always be even. A path is a sequence of distinct vertices connected in order by edges, a cycle is a path that returns to its starting vertex, and a tree is a connected graph with no cycles, which always has exactly one fewer edge than it has vertices. A graph is bipartite if its vertices can be split into two groups such that every edge connects a vertex in one group to a vertex in the other — equivalently, a graph is bipartite exactly when it contains no cycle of odd length.",
    workedExample:
      "A graph has 6 vertices, and every vertex has degree 3. How many edges does the graph have? By the Handshake Lemma, the sum of degrees equals 6 × 3 = 18, and this sum equals twice the number of edges, so the number of edges is 18 ÷ 2 = 9. As a second example: can a graph have exactly one vertex of degree 5 and the rest of even degree? No — since the number of odd-degree vertices must be even, a single odd-degree vertex is impossible; there must be at least two.",
    strategy:
      "When a problem gives you degree information and asks for the number of edges (or vice versa), reach for the Handshake Lemma first — sum the degrees and divide by 2. When a problem asks whether some configuration of handshakes, games, or connections is possible, check the odd-degree-vertices-must-be-even rule before trying to construct an example; it often rules out an answer instantly. For tree-counting problems, remember the vertices = edges + 1 relationship, which lets you find one quantity immediately from the other without drawing the tree.",
    commonMistakes:
      'A very common error is forgetting the factor of 2 in the Handshake Lemma — students sum the degrees and treat that sum as the number of edges directly, rather than dividing by 2. Another mistake is assuming a graph is bipartite just because it "looks" like it splits into two groups, without checking that no edge exists within a group; conversely, students sometimes miss that a single odd cycle anywhere in the graph is enough to break bipartiteness even if most of the graph looks two-colorable. Finally, when counting edges in a tree, students often forget the "one fewer edge than vertices" rule applies only when the graph is connected and acyclic — adding just one extra edge to a tree creates exactly one cycle and breaks this count.',
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },

  {
    slug: "vieta-newton-identities",
    title: "Olympiad Polynomials",
    topicSlug: "advanced-number-theory",
    concept:
      "Using Vieta's formulas to convert facts about the roots of a polynomial into facts about its coefficients, then using Newton's identities to compute power sums of the roots without ever solving for the roots themselves.",
    explanation:
      "For a monic polynomial x^n + c_{n-1}x^{n-1} + ... + c_1 x + c_0 with roots r_1, ..., r_n, Vieta's formulas say that the elementary symmetric functions e_k of the roots (e_1 = sum of roots, e_2 = sum of pairwise products, and so on up to e_n = product of all roots) are determined exactly by the coefficients, up to alternating signs: e_1 = -c_{n-1}, e_2 = c_{n-2}, e_3 = -c_{n-3}, and in general e_k = (-1)^k c_{n-k}. This means any symmetric expression in the roots — one that doesn't care about which root is which — can be rewritten purely in terms of the coefficients. The power sums p_k = r_1^k + r_2^k + ... + r_n^k are the most common such expressions, and Newton's identities give a recursion linking p_k to the e_k's: p_1 = e_1, p_2 = e_1 p_1 - 2e_2, p_3 = e_1 p_2 - e_2 p_1 + 3e_3, and for k > n (once you run out of elementary symmetric functions), p_k = e_1 p_{k-1} - e_2 p_{k-2} + e_3 p_{k-3} - ... up to the last available e_n term. This lets you compute high power sums of roots of a cubic or quartic in a few lines of arithmetic, entirely avoiding the actual (often irrational or complex) root values.",
    workedExample:
      "Let a, b, c be the three roots (real and complex) of x^3 - x - 1 = 0. Find a^5 + b^5 + c^5. Writing the polynomial as x^3 + 0x^2 - 1x - 1, Vieta's formulas give e_1 = a+b+c = 0, e_2 = ab+bc+ca = -1, e_3 = abc = 1. Now apply Newton's identities: p_1 = e_1 = 0. p_2 = e_1 p_1 - 2e_2 = 0 - 2(-1) = 2. p_3 = e_1 p_2 - e_2 p_1 + 3e_3 = 0 - 0 + 3(1) = 3. Since n = 3, for k > 3 the recursion becomes p_k = e_1 p_{k-1} - e_2 p_{k-2} + e_3 p_{k-3}. So p_4 = e_1 p_3 - e_2 p_2 + e_3 p_1 = 0 - (-1)(2) + 1(0) = 2, and p_5 = e_1 p_4 - e_2 p_3 + e_3 p_2 = 0 - (-1)(3) + 1(2) = 3 + 2 = 5. So a^5 + b^5 + c^5 = 5, obtained without ever finding a, b, or c individually.",
    strategy:
      "Whenever a problem asks for a symmetric expression in the roots of a polynomial (sums of powers, sums of reciprocals, sums of products of pairs), resist the urge to solve for the roots. Write down e_1 through e_n from the coefficients first, then express the target quantity in terms of those e_k's — Newton's identities are the standard bridge for power sums, but expressions like sum of 1/r_i can be handled directly as e_{n-1}/e_n. Always sanity-check small cases (p_1, p_2, p_3) by hand before trusting the recursion for larger k.",
    commonMistakes:
      "The most common error is a sign mistake in Vieta's formulas — the elementary symmetric functions alternate in sign relative to the coefficients (e_k = (-1)^k c_{n-k}), and it's easy to drop a minus sign, especially when the polynomial isn't written in the standard 'all terms subtracted' form. A second common mistake is misapplying Newton's identities once k exceeds n: the recursion for k > n only includes e_1 through e_n (no e_{n+1} term appears, since it's implicitly zero), and forgetting to truncate the sum there gives a wrong recursion entirely.",
    difficulty: 8,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "convex-hull-extremal-principle",
    title: "Combinatorial Geometry",
    topicSlug: "advanced-combinatorics",
    concept:
      "Using the extremal principle — picking the most extreme point, line, or configuration in a finite set — together with convex hull decompositions to prove structural facts about finite point sets in the plane.",
    explanation:
      "The extremal principle says: among a finite collection of objects, some object achieves a maximum or minimum of any well-defined quantity (largest distance, smallest angle, topmost point, and so on), and that extremal object often has special properties forced by its extremeness — if it didn't, you could find something even more extreme, a contradiction. In combinatorial geometry, the convex hull of a finite point set (the smallest convex polygon containing all the points) is a natural extremal object: its vertices are exactly the points that cannot be written as a combination of the others, and every other point of the set lies on or inside it. A standard proof strategy is to split into cases based on how many of the given points lie on the convex hull versus strictly inside it, since points on the hull automatically have useful convexity properties that interior points don't.",
    workedExample:
      "Prove that among any 5 points in the plane with no three collinear, some four of them form a convex quadrilateral (this is the smallest case of the Erdős–Szekeres 'Happy Ending' theorem). Consider the convex hull of the 5 points. Case 1: the hull has 4 or 5 vertices. Then those 4 (or any 4 of the 5, if the hull is a pentagon) already lie in convex position, so we're done immediately. Case 2: the hull is a triangle, so exactly 2 of the 5 points lie strictly inside it. Draw the line through these 2 interior points; it divides the plane into two half-planes. The 3 triangle vertices cannot all lie on the same side (since no three of the original points are collinear, the line doesn't pass through any vertex), so by pigeonhole at least 2 of the 3 vertices lie on the same side of this line — say vertices P and Q. Then P, Q, together with the 2 interior points, form a convex quadrilateral: the line PQ separates the two interior points from... more precisely, one checks that P, Q and the two interior points, taken in the correct cyclic order, have no point inside the triangle formed by the other three, which is exactly the condition for convex position. In both cases, some four of the five points form a convex quadrilateral.",
    strategy:
      "When a combinatorial geometry problem involves a finite point set and a claim about convex position, incidences, or extremal distances, first ask what quantity you can maximize or minimize (farthest pair of points, topmost point, point closest to a given line) and see what constraints that extremal choice forces on the rest of the configuration. For convex position problems specifically, always split by convex hull size first — the number of hull vertices versus interior points is usually the natural case split.",
    commonMistakes:
      "A frequent error is forgetting to use the 'no three collinear' (or similarly stated general position) hypothesis — without it, a dividing line can pass exactly through a vertex, breaking the pigeonhole argument that guarantees two vertices land strictly on the same side. Another common mistake is asserting a quadrilateral is convex just because its four vertices were chosen from a convex hull case split, without actually checking that none of the four points lies inside the triangle formed by the other three.",
    difficulty: 9,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "lifting-the-exponent",
    title: "Olympiad Number Theory",
    topicSlug: "advanced-number-theory",
    concept:
      "The Lifting the Exponent (LTE) lemma, which computes the exact power of a prime dividing expressions of the form a^n - b^n (or a^n + b^n), turning a hard divisibility question into simple arithmetic on exponents.",
    explanation:
      "For an odd prime p, if p divides a - b but p divides neither a nor b, then the p-adic valuation v_p(a^n - b^n) (the largest power of p dividing a^n - b^n) equals v_p(a-b) + v_p(n) — the exponent of p in a - b, plus the exponent of p in n itself. There is a matching version for a^n + b^n when p divides a + b and n is odd: v_p(a^n + b^n) = v_p(a+b) + v_p(n). The prime p = 2 needs its own separate (slightly more delicate) version of the lemma and should never be handled with the odd-prime formula. Alongside LTE, Bezout's identity — that gcd(a,b) can always be written as an integer combination ax + by — remains the standard tool for divisibility and gcd manipulation whenever exponents aren't involved, and many olympiad number theory proofs combine both: LTE to pin down exact prime powers, and elementary divisibility or modular arguments (often built on Bezout) to handle the rest.",
    workedExample:
      "Find the largest power of 3 dividing 100^100 - 1. Here a = 100, b = 1, so a - b = 99. Check the hypotheses: 3 divides 99, and 3 divides neither 100 nor 1, so LTE applies with p = 3: v_3(100^100 - 1) = v_3(99) + v_3(100). Since 99 = 3^2 · 11, v_3(99) = 2. Since 100 = 2^2 · 5^2 has no factor of 3 at all, v_3(100) = 0. So v_3(100^100 - 1) = 2 + 0 = 2, meaning 9 divides 100^100 - 1 but 27 does not.",
    strategy:
      "When a problem asks for the exact power of a prime dividing a difference (or sum) of two large powers, check first whether the prime divides the base difference a - b (or sum a + b) but not the bases themselves — that's the signal LTE is the right tool. Compute v_p(a-b) and v_p(n) as two separate, usually easy, factorizations, then just add them; resist trying to expand or factor the full expression a^n - b^n directly.",
    commonMistakes:
      "Applying the odd-prime version of LTE when p = 2 is a serious and common error — the p = 2 case has extra conditions (it matters whether n is even or odd, and whether 4 divides a-b) and the standard formula simply does not hold. Another frequent mistake is applying the a^n - b^n form of LTE to an a^n + b^n expression, or vice versa, without checking the matching hypothesis (for a^n + b^n, n must be odd and p must divide a + b, not a - b). Finally, students often forget to verify p does not divide a or b individually before invoking LTE at all — without that check, the lemma's conclusion is simply false.",
    difficulty: 8,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "substitution-strategy-functional-equations",
    title: "Olympiad Functional Equations",
    topicSlug: "functional-equations",
    concept:
      "A systematic substitution strategy for solving functional equations: plug in special values like 0, 1, x, or x = y to generate simple constraints, use those constraints to guess a closed form, and then verify the candidate satisfies the full original equation.",
    explanation:
      "Functional equation problems ask you to find every function f satisfying some identity for all inputs in a domain. The standard approach is to substitute specific, simple values for the free variables — setting x = 0, y = 0, or x = y — to strip the equation down to something solvable, usually revealing f(0), f(1), or a recursive relation. From there, look for structural properties like injectivity (f(a) = f(b) forces a = b, often provable directly by canceling identical terms in the equation) or surjectivity, since these frequently let you pin down f completely rather than just at isolated points. A special and extremely common family is the Cauchy-type additive equation f(x+y) = f(x) + f(y): over the rationals, this forces f(x) = cx with c = f(1), provable by induction on integers and then scaling to fractions, but over the reals without an extra regularity assumption (continuity, monotonicity, or boundedness on an interval), wildly non-linear pathological solutions exist. Once a candidate formula is found from special substitutions, it is essential to plug it back into the fully general original equation — a formula that only satisfies the special cases used to derive it is not yet a proof.",
    workedExample:
      "Find all functions f: R -> R such that f(x)f(y) - f(xy) = x + y for all real x, y. Set x = y = 0: f(0)^2 - f(0) = 0, so f(0)(f(0) - 1) = 0, giving f(0) = 0 or f(0) = 1. If f(0) = 0, set y = 0 in the original equation: f(x)f(0) - f(0) = x + 0, which becomes 0 - 0 = x, forcing x = 0 for every real x — impossible, so f(0) = 0 is rejected. So f(0) = 1. Now set y = 0 again: f(x)f(0) - f(0) = x, which becomes f(x)(1) - 1 = x, so f(x) = x + 1 for every x. Finally, verify this candidate in the full original equation: f(x)f(y) - f(xy) = (x+1)(y+1) - (xy+1) = xy + x + y + 1 - xy - 1 = x + y, which matches exactly. So f(x) = x + 1 is the unique solution.",
    strategy:
      "Always begin with the three cheapest substitutions — x = y = 0, y = 0 (or x = 0), and x = y — before attempting anything more elaborate; in many problems, as in the worked example, one of these substitutions alone determines f(x) explicitly once f(0) is known. When a candidate emerges, immediately test whether the functional equation forces injectivity or surjectivity, since these often shortcut what would otherwise require induction.",
    commonMistakes:
      "The single most common mistake is declaring victory once a formula satisfies the substitutions used to derive it, without plugging that formula back into the original equation for arbitrary x and y — this step is not optional, it's the actual proof of correctness. The second common mistake is silently assuming continuity or monotonicity when working with an additive Cauchy-type equation over the reals; without such a hypothesis stated in the problem, f(x) = cx is not the only solution, and claiming uniqueness without justification is a logical gap.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "properties-of-quadrilaterals",
    title: "Quadrilaterals",
    topicSlug: "quadrilaterals",
    concept:
      "Classifying quadrilaterals by their side, angle, and diagonal properties, and using those properties to solve for unknown lengths and angles.",
    explanation:
      "A quadrilateral's interior angles always sum to 360°. Parallelograms have both pairs of opposite sides parallel and equal, opposite angles equal, and diagonals that bisect each other. Rectangles are parallelograms with four right angles, so their diagonals are also equal in length. Rhombi are parallelograms with four equal sides, so their diagonals are perpendicular and bisect the vertex angles. A square is both a rectangle and a rhombus, inheriting every property of each. A trapezoid has exactly one pair of parallel sides (the bases); an isosceles trapezoid has equal legs, equal base angles, and equal diagonals.",
    workedExample:
      "In parallelogram ABCD, diagonals AC and BD intersect at E. If AE = 7 and BE = 5, find AC and BD. Since a parallelogram's diagonals bisect each other, AC = 2·AE = 14 and BD = 2·BE = 10.",
    strategy:
      "When a problem gives a quadrilateral with side or angle markings, first identify which special category it falls into (parallelogram, rectangle, rhombus, square, trapezoid) — that classification unlocks a cluster of angle, side, and diagonal facts at once, often making an otherwise slow coordinate computation unnecessary.",
    commonMistakes:
      "Assuming every quadrilateral with one pair of parallel sides has equal legs (it doesn't, unless it's specified isosceles). Another is assuming a general parallelogram's diagonals are equal — only rectangles guarantee that — or that they're always perpendicular — only rhombi (and squares) guarantee that.",
    difficulty: 4,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "expected-value-in-games-and-fair-strategies",
    title: "Games & Strategies",
    topicSlug: "games-and-strategies",
    concept:
      "Using expected value to evaluate whether a game favors a player, and reasoning about optimal decisions within a random, multi-stage process.",
    explanation:
      "A game or bet is 'fair' when its expected value is exactly zero — the average net gain across many repetitions is neither positive nor negative. To analyze a multi-stage game (like repeatedly betting a fixed amount until reaching a target or going broke), it is often more productive to compute expected value stage-by-stage, conditioning on the very next outcome, than to enumerate every possible sequence. When a decision changes the probabilities available at the next stage (such as choosing whether to stop or continue), comparing the expected value of stopping now against the expected value of continuing reveals the optimal strategy.",
    workedExample:
      "A player pays $5 to roll a fair six-sided die and wins $2 times the number rolled. Is this game fair? The expected payout is 2×(1+2+3+4+5+6)/6 = 2×21/6 = $7. The expected net gain is 7 − 5 = $2, so the game favors the player by $2 per play on average — it is not fair.",
    strategy:
      "When comparing 'stop now' versus 'continue' decisions, compute the expected value of continuing by conditioning on the very next outcome and weighting by its probability — you rarely need to trace the entire game tree, since later stages can be summarized by their own expected value.",
    commonMistakes:
      "Confusing expected value with the most likely single outcome — a game can have positive expected value even if the most probable single result is a loss, as long as the less likely large wins compensate. Another common mistake is forgetting to subtract the cost to play when judging whether a game favors a player.",
    difficulty: 6,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "recognizing-and-extending-patterns",
    title: "Patterns",
    topicSlug: "patterns",
    concept:
      "Spotting numeric, positional, or structural patterns — including repeating cycles — to predict far-away terms without brute-force computation.",
    explanation:
      "Many contest problems ask for a term or position too large to compute directly (the 100th digit, the units digit of a huge power, the color of the 500th bead). The standard approach is to compute the first several terms by hand, look for a repeating cycle (a period), and then use that period's length to reduce the far-away index to an equivalent small one via division and remainder. Not every pattern is strictly periodic — some grow by a fixed arithmetic or geometric rule, or follow a recognizable combinatorial structure — but the method is the same: generate enough terms to see the rule clearly, state the rule precisely, and verify it against at least one more term before trusting it.",
    workedExample:
      "What is the units digit of 7^100? The units digits of powers of 7 cycle: 7, 9, 3, 1, 7, 9, 3, 1, ... with period 4. Since 100 ÷ 4 = 25 remainder 0, the exponent 100 lands on the 4th (last) position in the cycle, which is 1. So the units digit is 1.",
    strategy:
      "When a problem asks for a specific far-away term, always write out the first 8-10 terms by hand before looking for shortcuts — most patterns reveal themselves within the first cycle or two, and writing enough terms protects you from locking onto a false pattern that only fits the first 2 or 3 values.",
    commonMistakes:
      "Assuming a pattern after seeing only 2 or 3 terms, when a longer list would reveal the true (possibly longer) period. Also, off-by-one errors when converting a remainder back into a cycle position — a remainder of 0 usually corresponds to the LAST position in the cycle, not position 0.",
    difficulty: 3,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "winning-strategies-in-combinatorial-games",
    title: "Strategy",
    topicSlug: "strategy",
    concept:
      "Identifying winning and losing positions in two-player combinatorial games, and using pairing and strategy-stealing arguments to prove which player wins without playing out every line.",
    explanation:
      "In an impartial two-player game where players alternate moves and the player who cannot move loses, every position can be labeled a P-position (the Previous player wins — the player about to move loses with correct play) or an N-position (the Next player wins). A position is a P-position exactly when every move from it leads to an N-position; it is an N-position if at least one move leads to a P-position. Working backward from terminal (no-moves-left) positions, which are P-positions by definition, lets you label every position in a small game. Two shortcuts avoid this labeling for many symmetric games: a pairing strategy (pair up the objects or squares so the second player can always mirror the first player's move) and the strategy-stealing argument (if the second player had a winning strategy, the first player could make an arbitrary first move and then 'steal' that strategy — a contradiction in many symmetric games, proving a winning strategy must exist for the first player, even without knowing what it is).",
    workedExample:
      "In single-pile Nim, two players alternately remove 1, 2, or 3 stones from a pile of n stones, and whoever removes the last stone wins. A pile size is a P-position (the player to move loses) exactly when it's a multiple of 4, since from any multiple of 4 every move leaves a non-multiple of 4, and from any non-multiple of 4 you can always remove enough stones to reach the next-lower multiple of 4. So with 20 stones (a multiple of 4), the player to move loses with correct opposing play.",
    strategy:
      "For a new game, compute the P/N status of the smallest few positions by hand (starting from the terminal position) and look for an arithmetic pattern (like 'multiples of 4') before trying to solve the general case directly — most contest Nim-variants reduce to a clean modular pattern.",
    commonMistakes:
      "Confusing 'the player who moves to a P-position wins' with 'being at a P-position is good' — actually, the player FACING a P-position is in trouble, since every move from there leads to an N-position for the opponent. Also, forgetting to re-derive the pattern when the terminal condition changes (e.g. taking the last object loses instead of wins, as in misère play), rather than reusing a pattern that assumed the opposite.",
    difficulty: 7,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
  {
    slug: "power-of-a-point-and-radical-axis",
    title: "Power of a Point",
    topicSlug: "advanced-geometry",
    concept:
      "Using the power of a point with respect to a circle to relate lengths of intersecting chords, secants, and tangents, and extending this to the radical axis of two circles.",
    explanation:
      "For a point P and a circle, the power of P is defined as PA·PB for any line through P that meets the circle at points A and B — remarkably, this product is the same no matter which such line through P you choose. If P is outside the circle and a line through P is tangent to the circle at T, the power of P also equals PT². This gives three interchangeable relationships: two chords crossing at P satisfy PA·PB = PC·PD; a secant and tangent from an external point P satisfy PA·PB = PT²; and algebraically, the power of P equals PO² − r², where O is the circle's center and r its radius. Given two circles, the radical axis is the line of points having equal power with respect to both circles; it is always perpendicular to the line joining the two centers, and for two intersecting circles, the radical axis is exactly the line through their two intersection points.",
    workedExample:
      "From external point P, a tangent to a circle has length 12, and a secant from P hits the circle first at near point A and then at far point B, with PA = 8. Find PB and the chord AB. By power of a point, PA·PB = PT², so 8·PB = 144, giving PB = 18. The chord AB = PB − PA = 18 − 8 = 10.",
    strategy:
      "Whenever a diagram shows two chords crossing inside a circle, or two secants/tangents from a common external point, immediately write down the power-of-a-point equation — it converts a tangled-looking configuration into a single algebraic relationship between lengths, often solving the problem in one step without any angle-chasing.",
    commonMistakes:
      "Mixing up which segment is measured from P on a secant — the product PA·PB always uses the full distances from P to each intersection point, not the chord length AB itself. Also, forgetting that for a point INSIDE the circle, both intersecting chords are split into two pieces on either side of P, and it's those two piece-products that are equal, not the full chord lengths.",
    difficulty: 9,
    isPremium: true,
    practiceProblemSlugs: [],
    challengeProblemSlug: "",
  },
];
