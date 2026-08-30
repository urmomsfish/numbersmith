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
    concept: "Adding, subtracting, and simplifying fractions using common denominators.",
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
    concept: "Combining rates by adding 'work per unit time', not times directly.",
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
    concept: "Factoring x² + bx + c by finding two numbers that multiply to c and add to b.",
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
    concept: "Choosing between elimination and substitution to solve systems efficiently.",
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
    concept: "Using root sum and product shortcuts without solving the quadratic explicitly.",
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
    concept: "The angles of a triangle always sum to 180°, with special rules for isosceles triangles.",
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
    concept: "Corresponding sides of similar figures scale by the same ratio; areas scale by the square of that ratio.",
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
    concept: "Quick tests for whether a number is divisible by small integers without doing long division.",
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
    concept: "Breaking a number into its prime building blocks to find GCD, LCM, and divisor counts.",
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
    concept: "Working with remainders, and how they behave under addition, multiplication, and exponentiation.",
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
    concept: "If a task has independent stages, multiply the number of choices at each stage.",
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
    concept: "Knowing when order matters (permutations) versus when it doesn't (combinations).",
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
    concept: "Splitting a problem into clean cases, and using pigeonhole to guarantee outcomes without full enumeration.",
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
    concept: "Counting the union of overlapping sets without double-counting their intersection.",
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
    concept: "Probability as favorable outcomes divided by total equally likely outcomes.",
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
    concept: "Updating probability once you know an event has already occurred.",
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
    concept: "The long-run average outcome of a random process, weighted by probability.",
    explanation:
      "Expected value = Σ(outcome × probability of that outcome). For repeated independent trials with success probability p, the expected number of successes in n trials is simply n × p.",
    workedExample:
      "4 fair coin flips: expected number of heads = 4 × 0.5 = 2.",
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
    concept: "Finding a quantity that never changes (or changes predictably) to solve process and game problems.",
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
    concept: "Deducing properties of an unknown function from a defining equation.",
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
    concept: "Using the Arithmetic Mean–Geometric Mean inequality to find extrema without calculus.",
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
    concept: "Assuming the opposite of what you want to prove, then deriving an impossible consequence.",
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
];
