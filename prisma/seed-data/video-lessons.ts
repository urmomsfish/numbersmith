import type { VideoLessonSeed } from "@/lib/video-lessons/types";

// Pro-exclusive animated lessons — no audio, no video file. Each is a scripted
// sequence of scenes (concept, worked example, diagram, strategy, pitfall,
// recap) rendered client-side by ScenePlayer. Ordered roughly by difficulty
// within each topic so the lessons list reads as a real curriculum.

export const VIDEO_LESSONS: VideoLessonSeed[] = [
  {
    slug: "fractions-visual-guide",
    title: "Fractions, Visually",
    topicSlug: "fractions",
    difficulty: 1,
    durationMinutes: 5,
    summary: "See why a common denominator works, using a bar model and a number line instead of a rule to memorize.",
    scenes: [
      {
        type: "title",
        heading: "Fractions, Visually",
        sub: "Adding and comparing fractions is really about cutting the same-size pieces — this lesson makes that literal before it gets symbolic.",
      },
      {
        type: "text",
        heading: "A fraction is a piece of a whole",
        bullets: [
          "The denominator says how many equal pieces the whole is cut into.",
          "The numerator says how many of those pieces you have.",
          "3/4 and 6/8 look different but are the same size — same cut, different count.",
        ],
        diagram: {
          kind: "bars",
          total: 4,
          segments: [
            { label: "1/4", value: 1, tone: "brand" },
            { label: "1/4", value: 1, tone: "brand" },
            { label: "1/4", value: 1, tone: "brand" },
            { label: "", value: 1, tone: "slate" },
          ],
          note: "3/4 of the bar is filled — three of the four equal pieces.",
        },
      },
      {
        type: "example",
        heading: "Why you need a common denominator",
        prompt: "Add 3/4 + 1/8.",
        bullets: [
          "3/4 and 1/8 are cut into different-size pieces, so you can't add the counts directly.",
          "Recut the fourths into eighths: 3/4 = 6/8.",
          "Now both fractions use the same size piece: 6/8 + 1/8 = 7/8.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "3/4 + 1/8", note: "different piece sizes" },
            { expr: "6/8 + 1/8", note: "3/4 recut into eighths" },
            { expr: "= 7/8", note: "same pieces, add numerators" },
          ],
        },
      },
      {
        type: "text",
        heading: "Where fractions sit on a number line",
        bullets: [
          "6/8 and 7/8 both sit between 1/2 and 1 — useful for a fast sanity check on contest answers.",
          "If your sum lands outside a reasonable range, you likely forgot to convert one fraction.",
        ],
        diagram: {
          kind: "numberline",
          min: 0,
          max: 1,
          points: [
            { value: 0.75, label: "6/8" },
            { value: 0.875, label: "7/8", tone: "success" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "On contest problems",
        bullets: [
          "Watch for answer choices that match adding straight across (3/4 + 1/8 ≠ 4/12) — that's the trap choice.",
          "Simplify at the end, not the beginning — simplifying early can hide a common denominator you still needed.",
        ],
      },
      {
        type: "pitfall",
        heading: "The single most common mistake",
        bullets: [
          "Adding numerators and denominators straight across. 3/4 + 1/8 is NOT 4/12.",
          "Always find the least common denominator before combining numerators.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "A fraction is a count of equal-size pieces — the denominator sets the size, the numerator sets the count.",
          "To add or compare fractions, recut them to the same piece size first.",
          "Simplify only after combining.",
        ],
      },
    ],
  },
  {
    slug: "solving-linear-equations",
    title: "Solving Linear Equations Like a Balance",
    topicSlug: "linear-equations",
    difficulty: 2,
    durationMinutes: 6,
    summary: "Every legal move on an equation keeps both sides equal — this lesson treats the equals sign as a literal balance.",
    scenes: [
      {
        type: "title",
        heading: "The Equals Sign Is a Balance",
        sub: "Whatever you do to one side, you must do to the other — or the balance tips and the equation stops being true.",
      },
      {
        type: "text",
        heading: "Four legal moves",
        bullets: [
          "Add the same amount to both sides.",
          "Subtract the same amount from both sides.",
          "Multiply both sides by the same nonzero number.",
          "Divide both sides by the same nonzero number.",
        ],
      },
      {
        type: "example",
        heading: "Isolating x, one move at a time",
        prompt: "Solve 3x + 5 = 20.",
        bullets: [
          "Subtract 5 from both sides to undo the +5.",
          "Divide both sides by 3 to undo the ×3.",
          "x = 5 — check by substituting back: 3(5) + 5 = 20. ✓",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "3x + 5 = 20" },
            { expr: "3x = 15", note: "subtract 5 from both sides" },
            { expr: "x = 5", note: "divide both sides by 3" },
          ],
        },
      },
      {
        type: "example",
        heading: "Variables on both sides",
        prompt: "Solve 5x - 2 = 2x + 13.",
        bullets: [
          "Subtract 2x from both sides so the variable only appears once.",
          "Add 2 to both sides to isolate the term with x.",
          "Divide by 3.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "5x - 2 = 2x + 13" },
            { expr: "3x - 2 = 13", note: "subtract 2x" },
            { expr: "3x = 15", note: "add 2" },
            { expr: "x = 5", note: "divide by 3" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Contest speed tips",
        bullets: [
          "Always do the same move to both sides in the same step — don't split it across lines.",
          "Check your answer by substituting back in; it costs 10 seconds and catches most arithmetic slips.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Forgetting to apply an operation to every term on a side — e.g. only subtracting 2x from the left, not the right.",
          "Dividing by a variable that could be zero, which can silently discard a valid solution.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Treat the equation like a balance: the same operation on both sides preserves equality.",
          "Collect variable terms on one side, constants on the other, then isolate x.",
          "Always verify by substitution.",
        ],
      },
    ],
  },
  {
    slug: "factoring-quadratics",
    title: "Factoring Quadratics by Pattern",
    topicSlug: "quadratics",
    difficulty: 4,
    durationMinutes: 7,
    summary: "Turn x² + bx + c into two binomials by hunting for a factor pair — the same instinct that speeds up contest algebra.",
    scenes: [
      {
        type: "title",
        heading: "Factoring Quadratics by Pattern",
        sub: "x² + bx + c factors into (x + p)(x + q) whenever p and q multiply to c and add to b — spotting that pair is the whole skill.",
      },
      {
        type: "text",
        heading: "The pattern",
        bullets: [
          "(x + p)(x + q) expands to x² + (p+q)x + pq.",
          "So factoring x² + bx + c means finding p and q with p·q = c and p+q = b.",
          "Signs matter: if c is negative, p and q have opposite signs; if c is positive, they share the sign of b.",
        ],
      },
      {
        type: "example",
        heading: "Factor x² + 7x + 12",
        prompt: "Find two numbers that multiply to 12 and add to 7.",
        bullets: [
          "Factor pairs of 12: (1,12), (2,6), (3,4).",
          "3 + 4 = 7 — that's the pair.",
          "x² + 7x + 12 = (x + 3)(x + 4).",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "x² + 7x + 12" },
            { expr: "p·q = 12, p+q = 7", note: "hunt the factor pair" },
            { expr: "= (x + 3)(x + 4)" },
          ],
        },
      },
      {
        type: "example",
        heading: "A negative constant term",
        prompt: "Factor x² - 2x - 15.",
        bullets: [
          "Need p·q = -15 and p+q = -2, so p and q have opposite signs.",
          "-5 and 3 work: -5 × 3 = -15, and -5 + 3 = -2.",
          "x² - 2x - 15 = (x - 5)(x + 3).",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "x² - 2x - 15" },
            { expr: "p·q = -15, p+q = -2" },
            { expr: "= (x - 5)(x + 3)" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Speed strategy",
        bullets: [
          "List factor pairs of |c| from largest to smallest gap — the pair you need is usually found within the first few tries.",
          "If no integer pair works, the quadratic doesn't factor over the integers — reach for the quadratic formula instead of guessing longer.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Mixing up which factor pair to use when b is negative but c is positive — both p and q should be negative in that case.",
          "Forgetting to check the expansion — a wrong sign is easy to miss.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "x² + bx + c factors as (x+p)(x+q) when p·q = c and p+q = b.",
          "The sign of c tells you whether p and q share a sign or have opposite signs.",
          "When no integer pair exists, factoring isn't the right tool — use the quadratic formula.",
        ],
      },
    ],
  },
  {
    slug: "triangle-angle-toolkit",
    title: "The Triangle Angle Toolkit",
    topicSlug: "triangles",
    difficulty: 3,
    durationMinutes: 6,
    summary: "One fact — angles sum to 180° — unlocks exterior angles, isosceles triangles, and most triangle problems on contests.",
    scenes: [
      {
        type: "title",
        heading: "The Triangle Angle Toolkit",
        sub: "Every triangle's three interior angles add to exactly 180°. Nearly every triangle-angle problem is this fact in disguise.",
      },
      {
        type: "text",
        heading: "The core fact",
        bullets: [
          "Interior angles of any triangle sum to 180°, no matter the shape.",
          "Know two angles and you automatically know the third: 180° minus their sum.",
        ],
        diagram: {
          kind: "triangleAngles",
          angles: [60, 70, 50],
          labels: ["A", "B", "C"],
        },
      },
      {
        type: "example",
        heading: "Using it directly",
        prompt: "A triangle has angles 52° and 79°. Find the third angle.",
        bullets: ["180° - 52° - 79° = 49°."],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "180° - 52° - 79°" }, { expr: "= 49°" }],
        },
      },
      {
        type: "text",
        heading: "Isosceles triangles",
        bullets: [
          "In an isosceles triangle, the two base angles (opposite the equal sides) are equal.",
          "That turns one unknown angle into an equation you can solve with the 180° rule.",
        ],
      },
      {
        type: "example",
        heading: "Isosceles in action",
        prompt: "An isosceles triangle has a vertex angle of 40°. Find each base angle.",
        bullets: [
          "The two base angles are equal — call each one x.",
          "40° + x + x = 180°, so 2x = 140°, so x = 70°.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "40 + x + x = 180" }, { expr: "2x = 140" }, { expr: "x = 70°" }],
        },
      },
      {
        type: "strategy",
        heading: "Exterior angle shortcut",
        bullets: [
          "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles — often faster than working through 180° twice.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Assuming a triangle is isosceles or right-angled just because a figure looks that way — contest diagrams are rarely drawn to scale.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Interior angles always sum to 180°.",
          "Isosceles triangles give you an equal-base-angles equation for free.",
          "Exterior angle = sum of the two remote interior angles.",
        ],
      },
    ],
  },
  {
    slug: "circle-theorems-inscribed-angles",
    title: "Circle Theorems: Inscribed Angles",
    topicSlug: "circles",
    difficulty: 5,
    durationMinutes: 7,
    summary: "The inscribed angle theorem — half the arc — is the single most tested circle fact on geometry contests.",
    scenes: [
      {
        type: "title",
        heading: "Circle Theorems: Inscribed Angles",
        sub: "An inscribed angle is always exactly half the central angle that subtends the same arc. One fact, dozens of problems.",
      },
      {
        type: "text",
        heading: "Central vs. inscribed angles",
        bullets: [
          "A central angle has its vertex at the circle's center.",
          "An inscribed angle has its vertex on the circle itself, with both rays as chords.",
          "If both angles open onto the same arc, the inscribed angle is exactly half the central angle.",
        ],
        diagram: { kind: "circle", radius: 1, showRadius: true },
      },
      {
        type: "example",
        heading: "Reading off an arc",
        prompt: "A central angle subtends a 100° arc. Find the inscribed angle on the same arc.",
        bullets: ["Inscribed angle = 100° ÷ 2 = 50°."],
        diagram: {
          kind: "circle",
          radius: 1,
          inscribedAngle: { at: "50°", arc: "100°" },
        },
      },
      {
        type: "text",
        heading: "Two useful corollaries",
        bullets: [
          "Any angle inscribed in a semicircle is 90° — the diameter always subtends a straight 180° arc, so half of that is 90°.",
          "Inscribed angles that subtend the same arc are equal to each other, regardless of where on the circle their vertex sits.",
        ],
      },
      {
        type: "strategy",
        heading: "Spotting it fast",
        bullets: [
          "Whenever you see a triangle with all three vertices on a circle, check whether one side is a diameter — that's a free 90° angle.",
          "Redraw the arc the angle subtends; it's easy to grab the wrong arc under time pressure.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Halving the wrong arc — an inscribed angle subtends the arc it does NOT contain, not the one nearer its vertex.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Inscribed angle = half the central angle on the same arc.",
          "An angle inscribed in a semicircle is always 90°.",
          "Inscribed angles on the same arc are equal.",
        ],
      },
    ],
  },
  {
    slug: "divisibility-rules-shortcuts",
    title: "Divisibility Rules That Save Time",
    topicSlug: "divisibility",
    difficulty: 2,
    durationMinutes: 5,
    summary: "Fast tests for 2, 3, 4, 5, 6, 8, 9, and 11 — mental shortcuts that replace long division on contests.",
    scenes: [
      {
        type: "title",
        heading: "Divisibility Rules That Save Time",
        sub: "You almost never need to actually divide on a speed contest — these checks tell you the answer in seconds.",
      },
      {
        type: "text",
        heading: "The single-digit checks",
        bullets: [
          "Divisible by 2: last digit is even.",
          "Divisible by 3: digit sum is divisible by 3.",
          "Divisible by 5: last digit is 0 or 5.",
          "Divisible by 9: digit sum is divisible by 9.",
        ],
      },
      {
        type: "text",
        heading: "The ones people forget",
        bullets: [
          "Divisible by 4: last two digits form a number divisible by 4.",
          "Divisible by 8: last three digits form a number divisible by 8.",
          "Divisible by 6: passes both the 2-test and the 3-test.",
          "Divisible by 11: alternating digit sum (add, subtract, add, ...) is divisible by 11.",
        ],
      },
      {
        type: "example",
        heading: "Stacking two rules",
        prompt: "Is 4,536 divisible by 6?",
        bullets: [
          "Last digit is 6, which is even — passes the 2-test.",
          "Digit sum: 4+5+3+6 = 18, which is divisible by 3 — passes the 3-test.",
          "Both pass, so 4,536 is divisible by 6.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "4536 → even ✓", note: "divisible by 2" },
            { expr: "4+5+3+6 = 18", note: "divisible by 3" },
            { expr: "→ divisible by 6" },
          ],
        },
      },
      {
        type: "example",
        heading: "Testing 11",
        prompt: "Is 9,163 divisible by 11?",
        bullets: [
          "Alternate adding and subtracting digits from the right: 3 - 6 + 1 - 9 = -11.",
          "-11 is divisible by 11, so 9,163 is divisible by 11.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "3 - 6 + 1 - 9 = -11" }, { expr: "-11 is a multiple of 11 ✓" }],
        },
      },
      {
        type: "strategy",
        heading: "Combine rules for composite divisors",
        bullets: [
          "For 12, check both the 3-test and the 4-test. For 15, check both 3 and 5.",
          "Chaining two fast tests is almost always quicker than one long division.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Memorize the tests for 2, 3, 4, 5, 6, 8, 9, and 11.",
          "Composite divisors (6, 12, 15...) split into two simpler tests.",
          "These rules replace division entirely on most contest problems.",
        ],
      },
    ],
  },
  {
    slug: "modular-arithmetic-clock-math",
    title: "Modular Arithmetic: Clock Math",
    topicSlug: "modular-arithmetic",
    difficulty: 5,
    durationMinutes: 7,
    summary: "Remainders behave like a clock face — this lesson uses that picture to make mod arithmetic click.",
    scenes: [
      {
        type: "title",
        heading: "Modular Arithmetic: Clock Math",
        sub: "\"a mod n\" is just where a lands when you wrap the number line around a circle of n positions — exactly like a clock.",
      },
      {
        type: "text",
        heading: "What a mod n means",
        bullets: [
          "a mod n is the remainder when a is divided by n.",
          "On a mod-5 clock, the only possible remainders are 0, 1, 2, 3, 4 — then it wraps back to 0.",
          "13 mod 5 = 3, because 13 = 2×5 + 3.",
        ],
        diagram: {
          kind: "modularClock",
          modulus: 5,
          highlight: [3],
          note: "13 wraps around to land on 3",
        },
      },
      {
        type: "example",
        heading: "Adding on the clock",
        prompt: "What is (8 + 10) mod 6?",
        bullets: [
          "You can reduce first: 8 mod 6 = 2, and 10 mod 6 = 4.",
          "Add the remainders: 2 + 4 = 6, which itself wraps to 0.",
          "(8 + 10) mod 6 = 0.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "8 mod 6 = 2, 10 mod 6 = 4" },
            { expr: "2 + 4 = 6" },
            { expr: "6 mod 6 = 0" },
          ],
        },
      },
      {
        type: "text",
        heading: "Why this matters on contests",
        bullets: [
          "\"Find the last digit of N\" is really \"find N mod 10.\"",
          "\"Find the remainder when N is divided by 7\" is asking for N mod 7 directly.",
          "You can reduce at every step of a calculation — you never need the full huge number.",
        ],
      },
      {
        type: "example",
        heading: "Last-digit trick",
        prompt: "Find the last digit of 7^100.",
        bullets: [
          "Powers of 7 mod 10 cycle: 7, 9, 3, 1, then repeat every 4 steps.",
          "100 is a multiple of 4, landing on the 4th spot in the cycle: 1.",
          "The last digit of 7^100 is 1.",
        ],
        diagram: {
          kind: "modularClock",
          modulus: 4,
          highlight: [0],
          note: "100 mod 4 = 0 → the 4th (last) position in the cycle",
        },
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          "For a large power's last digit or remainder, find the cycle length first, then reduce the exponent mod that length.",
          "Reduce numbers mod n as early and as often as possible — never carry the full value through several steps.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "a mod n wraps a onto a clock of n positions.",
          "You can reduce mod n at any step of addition, subtraction, or multiplication.",
          "Powers cycle mod n — find the cycle length to handle huge exponents.",
        ],
      },
    ],
  },
  {
    slug: "counting-with-multiplication-principle",
    title: "Counting with the Multiplication Principle",
    topicSlug: "counting-principles",
    difficulty: 3,
    durationMinutes: 6,
    summary: "Break a counting problem into independent choices and multiply — the single idea behind almost every counting question.",
    scenes: [
      {
        type: "title",
        heading: "Counting with the Multiplication Principle",
        sub: "If a process has independent stages, the total number of outcomes is the product of the choices at each stage.",
      },
      {
        type: "text",
        heading: "The core idea",
        bullets: [
          "Break the process into stages that don't affect each other.",
          "Count the options at each stage separately.",
          "Multiply the stage counts together for the total.",
        ],
      },
      {
        type: "example",
        heading: "Outfits",
        prompt: "You have 4 shirts and 3 pairs of pants. How many outfits can you make?",
        bullets: ["Each shirt can be paired with any pants — 4 × 3 = 12 outfits."],
        diagram: {
          kind: "countingTree",
          root: "Outfit",
          branches: [
            { label: "Shirt A", children: [{ label: "P1" }, { label: "P2" }, { label: "P3" }] },
            { label: "Shirt B", children: [{ label: "P1" }, { label: "P2" }, { label: "P3" }] },
          ],
        },
      },
      {
        type: "text",
        heading: "When choices shrink as you go",
        bullets: [
          "If items can't repeat (like arranging people in seats), the number of options drops by one at each stage.",
          "Arranging 4 people in 4 chairs: 4 × 3 × 2 × 1 = 24 ways.",
        ],
      },
      {
        type: "example",
        heading: "License plates",
        prompt: "How many 2-letter, 3-digit plates are there (letters and digits can repeat)?",
        bullets: [
          "2 letter slots: 26 choices each.",
          "3 digit slots: 10 choices each.",
          "Total: 26 × 26 × 10 × 10 × 10 = 676,000.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "26 × 26 × 10 × 10 × 10" }, { expr: "= 676,000" }],
        },
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          "Always ask: are the stages independent, and can items repeat? Those two questions decide the whole setup.",
          "If a restriction only affects one stage (e.g. \"the first digit can't be 0\"), handle that stage's count separately before multiplying.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Adding stage counts instead of multiplying — addition is for \"either/or\" choices, multiplication is for \"and then\" sequences.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Independent stages multiply; either/or alternatives add.",
          "Watch for whether repetition is allowed — it changes every stage's count after the first.",
          "Handle special restrictions on one stage before multiplying the rest.",
        ],
      },
    ],
  },
  {
    slug: "basic-probability-foundations",
    title: "Probability Foundations",
    topicSlug: "basic-probability",
    difficulty: 3,
    durationMinutes: 6,
    summary: "Probability is just a ratio — favorable outcomes over total outcomes. This lesson builds intuition before the formulas.",
    scenes: [
      {
        type: "title",
        heading: "Probability Foundations",
        sub: "P(event) = favorable outcomes ÷ total outcomes. Nearly every basic probability question reduces to counting both sides of that ratio.",
      },
      {
        type: "text",
        heading: "The core ratio",
        bullets: [
          "Every outcome in the sample space is equally likely (unless stated otherwise).",
          "P(event) = (number of outcomes in the event) ÷ (total number of outcomes).",
          "Probabilities always sit between 0 (impossible) and 1 (certain).",
        ],
      },
      {
        type: "example",
        heading: "Rolling a die",
        prompt: "What's the probability of rolling an even number on a fair 6-sided die?",
        bullets: ["Favorable outcomes: {2, 4, 6} — 3 outcomes.", "Total outcomes: 6.", "P(even) = 3/6 = 1/2."],
        diagram: {
          kind: "bars",
          total: 6,
          segments: [
            { label: "2", value: 1, tone: "brand" },
            { label: "4", value: 1, tone: "brand" },
            { label: "6", value: 1, tone: "brand" },
            { label: "odd", value: 3, tone: "slate" },
          ],
          note: "3 of 6 equally likely outcomes are even",
        },
      },
      {
        type: "text",
        heading: "Independent events",
        bullets: [
          "Two events are independent if one doesn't affect the other's outcome.",
          "For independent events, multiply their probabilities: P(A and B) = P(A) × P(B).",
        ],
      },
      {
        type: "example",
        heading: "Two coin flips",
        prompt: "What's the probability of getting heads on both of two coin flips?",
        bullets: ["P(heads) = 1/2 for each flip, and the flips are independent.", "P(both heads) = 1/2 × 1/2 = 1/4."],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "P(H) × P(H)" }, { expr: "1/2 × 1/2 = 1/4" }],
        },
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          "It's often easier to compute the complement: P(event) = 1 - P(not event) — especially for \"at least one\" questions.",
          "Draw out or list the sample space for small cases; it prevents miscounting.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Treating dependent events as independent — once an item is removed (drawing cards without replacement), the total changes for the next draw.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "P(event) = favorable ÷ total, assuming equally likely outcomes.",
          "Independent events multiply; use the complement for \"at least one\" problems.",
          "Watch for whether outcomes are being removed from the sample space as you go.",
        ],
      },
    ],
  },
  {
    slug: "inclusion-exclusion-principle",
    title: "The Inclusion-Exclusion Principle",
    topicSlug: "inclusion-exclusion",
    difficulty: 6,
    durationMinutes: 7,
    summary: "Counting a union by adding then subtracting the overlap — a Venn diagram makes the formula obvious instead of memorized.",
    scenes: [
      {
        type: "title",
        heading: "The Inclusion-Exclusion Principle",
        sub: "|A ∪ B| = |A| + |B| - |A ∩ B|. Add both sets, then subtract the overlap you counted twice.",
      },
      {
        type: "text",
        heading: "Why you subtract the overlap",
        bullets: [
          "Adding |A| + |B| counts everything in both A and B twice.",
          "Subtracting |A ∩ B| once removes exactly that double-count.",
          "The result: every element is counted exactly once.",
        ],
      },
      {
        type: "example",
        heading: "Two-set example",
        prompt: "In a class of 30, 18 take art and 15 take music, with 8 taking both. How many take at least one?",
        bullets: ["|Art ∪ Music| = 18 + 15 - 8 = 25 students."],
        diagram: {
          kind: "vennTwo",
          left: { label: "Art", onlyCount: 10, tone: "brand" },
          right: { label: "Music", onlyCount: 7, tone: "success" },
          both: 8,
          universe: 30,
        },
      },
      {
        type: "text",
        heading: "Finding \"neither\"",
        bullets: [
          "Students taking neither = total - |Art ∪ Music| = 30 - 25 = 5.",
          "This split — union, then complement — handles most \"how many satisfy at least one condition\" contest questions.",
        ],
      },
      {
        type: "example",
        heading: "Three-set version",
        prompt: "For three overlapping sets, the formula grows by one more layer.",
        bullets: [
          "|A∪B∪C| = |A|+|B|+|C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|.",
          "Add all singles, subtract all pairs, add back the triple overlap — it was subtracted out one too many times.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "+|A| +|B| +|C|" },
            { expr: "-|A∩B| -|A∩C| -|B∩C|" },
            { expr: "+|A∩B∩C|" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          "Draw the Venn diagram and fill in from the innermost region (the deepest overlap) outward — it prevents double-subtracting.",
          "Divisibility counting problems (\"multiples of 2 or 3 up to 100\") are almost always inclusion-exclusion in disguise.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "|A ∪ B| = |A| + |B| - |A ∩ B|.",
          "For three sets: add singles, subtract pairs, add back the triple overlap.",
          "Filling a Venn diagram from the center out keeps the counts straight.",
        ],
      },
    ],
  },
  {
    slug: "deductive-reasoning-grids",
    title: "Deductive Reasoning with Grids",
    topicSlug: "deduction",
    difficulty: 4,
    durationMinutes: 6,
    summary: "Logic-grid puzzles reward one habit: eliminate everything you can before you guess anything.",
    scenes: [
      {
        type: "title",
        heading: "Deductive Reasoning with Grids",
        sub: "Most logic puzzles aren't solved by clever leaps — they're solved by ruthlessly eliminating what's impossible until one answer remains.",
      },
      {
        type: "text",
        heading: "The elimination habit",
        bullets: [
          "Never guess while an elimination is still available — a valid deduction is certain, a guess isn't.",
          "Every clue either directly places a fact or directly rules one out. Convert every clue into one of those before moving on.",
          "Track ruled-out pairings explicitly (a grid, a list) — working memory alone drops information under time pressure.",
        ],
      },
      {
        type: "example",
        heading: "A short deduction",
        prompt: "Anna, Ben, and Cara each play one sport: soccer, tennis, or chess. Anna doesn't play tennis. Ben doesn't play chess or tennis.",
        bullets: [
          "Ben doesn't play chess or tennis, so Ben plays soccer.",
          "Anna doesn't play tennis and soccer is taken, so Anna plays chess.",
          "Only tennis is left for Cara.",
        ],
      },
      {
        type: "text",
        heading: "Chaining deductions",
        bullets: [
          "Placing one fact (Ben → soccer) often immediately forces the next (Anna can't have soccer either, since it's taken).",
          "After every new placement, re-scan the remaining clues — a clue that seemed useless earlier can become decisive.",
        ],
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          "Start with the most restrictive clue (the one ruling out the most options), not the first one listed.",
          "If you're stuck, look for a clue that only makes sense given a specific earlier placement — that's usually the next domino.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Assuming a plausible-looking answer without checking it against every clue — one contradiction anywhere invalidates it.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Convert every clue into a placement or an elimination before guessing anything.",
          "Re-scan remaining clues after each new placement — they interact.",
          "Verify a candidate solution against all clues, not just the ones that suggested it.",
        ],
      },
    ],
  },
  {
    slug: "invariants-in-olympiad-problems",
    title: "Finding Invariants",
    topicSlug: "invariants",
    difficulty: 8,
    durationMinutes: 8,
    summary: "When a process repeats indefinitely, find the quantity that never changes — it's usually the key to the whole problem.",
    scenes: [
      {
        type: "title",
        heading: "Finding Invariants",
        sub: "An invariant is a quantity — a sum, a parity, a color count — that stays fixed no matter how many times an allowed move is applied.",
      },
      {
        type: "text",
        heading: "Why invariants matter",
        bullets: [
          "Many olympiad problems ask whether a process can ever reach a target state.",
          "Simulating every possible sequence of moves is usually infeasible.",
          "Instead, find a quantity the moves can never change — if the start and target disagree on that quantity, the target is unreachable, full stop.",
        ],
      },
      {
        type: "example",
        heading: "A classic invariant: parity",
        prompt: "n lightbulbs start all off. A move flips the state of any two bulbs at once. Can all n end up on, if n is odd?",
        bullets: [
          "Flipping two bulbs changes the count of ON bulbs by +2, -2, or 0 — never by an odd amount.",
          "The parity (even/odd-ness) of the ON count is therefore invariant: it starts at 0, which is even, and every move preserves that.",
          "If n is odd, \"all n bulbs on\" means an odd ON count — impossible to reach from an even one. No sequence of moves can ever do it.",
        ],
      },
      {
        type: "text",
        heading: "Common invariants to try",
        bullets: [
          "Parity (even/odd) of a count or sum.",
          "A sum or difference that a move leaves unchanged.",
          "Remainder mod a fixed number (mod 2, mod 3, mod 9 via digit sums).",
          "A coloring argument — assign colors so every move preserves the color balance.",
        ],
      },
      {
        type: "strategy",
        heading: "How to search for one",
        bullets: [
          "Apply the allowed move to a few small examples and track everything that stays the same — sums, differences, counts, colors.",
          "If a quantity seems fixed, prove it algebraically: show the move's effect on that quantity is exactly zero.",
          "Then compare that quantity's value at the start and at the proposed target.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Checking only a couple of examples and assuming a pattern is a proof — an invariant must be shown to hold for every possible move, not just the ones you tried.",
        ],
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "An invariant is a quantity no allowed move can change.",
          "If start and target disagree on an invariant's value, the target is provably unreachable.",
          "Search by testing small cases, then prove the invariant holds for the move in general.",
        ],
      },
    ],
  },
];
