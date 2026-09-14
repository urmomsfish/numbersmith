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
    summary:
      "See why a common denominator works, using a bar model and a number line instead of a rule to memorize.",
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "Add 5/6 + 1/4.",
        answer: "5/6 + 1/4 = 10/12 + 3/12 = 13/12.",
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
    summary:
      "Every legal move on an equation keeps both sides equal — this lesson treats the equals sign as a literal balance.",
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "Solve 4x - 7 = 2x + 9.",
        answer: "x = 8.",
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
    summary:
      "Turn x² + bx + c into two binomials by hunting for a factor pair — the same instinct that speeds up contest algebra.",
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "Factor x^2 + x - 6.",
        answer: "(x + 3)(x - 2).",
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
    summary:
      "One fact — angles sum to 180° — unlocks exterior angles, isosceles triangles, and most triangle problems on contests.",
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
        prompt:
          "An isosceles triangle has a vertex angle of 40°. Find each base angle.",
        bullets: [
          "The two base angles are equal — call each one x.",
          "40° + x + x = 180°, so 2x = 140°, so x = 70°.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "40 + x + x = 180" },
            { expr: "2x = 140" },
            { expr: "x = 70°" },
          ],
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
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A triangle has angles 35 degrees and 85 degrees. Find the third angle.",
        answer: "60 degrees.",
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
    summary:
      "The inscribed angle theorem — half the arc — is the single most tested circle fact on geometry contests.",
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
        prompt:
          "A central angle subtends a 100° arc. Find the inscribed angle on the same arc.",
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
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A central angle subtends a 140 degree arc. Find the inscribed angle on the same arc.",
        answer: "70 degrees.",
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
    summary:
      "Fast tests for 2, 3, 4, 5, 6, 8, 9, and 11 — mental shortcuts that replace long division on contests.",
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
          lines: [
            { expr: "3 - 6 + 1 - 9 = -11" },
            { expr: "-11 is a multiple of 11 ✓" },
          ],
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "Is 5,346 divisible by 9?",
        answer: "Yes -- digit sum is 5+3+4+6 = 18, which is divisible by 9.",
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
    summary:
      "Remainders behave like a clock face — this lesson uses that picture to make mod arithmetic click.",
    scenes: [
      {
        type: "title",
        heading: "Modular Arithmetic: Clock Math",
        sub: '"a mod n" is just where a lands when you wrap the number line around a circle of n positions — exactly like a clock.',
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
          '"Find the last digit of N" is really "find N mod 10."',
          '"Find the remainder when N is divided by 7" is asking for N mod 7 directly.',
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "What is (17 + 9) mod 7?",
        answer: "5, since 17 + 9 = 26 and 26 = 3x7 + 5.",
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
    summary:
      "Break a counting problem into independent choices and multiply — the single idea behind almost every counting question.",
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
        prompt:
          "You have 4 shirts and 3 pairs of pants. How many outfits can you make?",
        bullets: [
          "Each shirt can be paired with any pants — 4 × 3 = 12 outfits.",
        ],
        diagram: {
          kind: "countingTree",
          root: "Outfit",
          branches: [
            {
              label: "Shirt A",
              children: [{ label: "P1" }, { label: "P2" }, { label: "P3" }],
            },
            {
              label: "Shirt B",
              children: [{ label: "P1" }, { label: "P2" }, { label: "P3" }],
            },
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
        prompt:
          "How many 2-letter, 3-digit plates are there (letters and digits can repeat)?",
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
          'Adding stage counts instead of multiplying — addition is for "either/or" choices, multiplication is for "and then" sequences.',
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A password has 3 letters followed by 2 digits (repeats allowed). How many passwords are possible?",
        answer: "26 x 26 x 26 x 10 x 10 = 1,757,600.",
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
    summary:
      "Probability is just a ratio — favorable outcomes over total outcomes. This lesson builds intuition before the formulas.",
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
        prompt:
          "What's the probability of rolling an even number on a fair 6-sided die?",
        bullets: [
          "Favorable outcomes: {2, 4, 6} — 3 outcomes.",
          "Total outcomes: 6.",
          "P(even) = 3/6 = 1/2.",
        ],
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
        prompt:
          "What's the probability of getting heads on both of two coin flips?",
        bullets: [
          "P(heads) = 1/2 for each flip, and the flips are independent.",
          "P(both heads) = 1/2 × 1/2 = 1/4.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [{ expr: "P(H) × P(H)" }, { expr: "1/2 × 1/2 = 1/4" }],
        },
      },
      {
        type: "strategy",
        heading: "Contest strategy",
        bullets: [
          'It\'s often easier to compute the complement: P(event) = 1 - P(not event) — especially for "at least one" questions.',
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
        type: "practice",
        heading: "Practice Problem",
        prompt: "What's the probability of rolling a sum of 7 with two dice?",
        answer: "1/6 (6 favorable outcomes out of 36).",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "P(event) = favorable ÷ total, assuming equally likely outcomes.",
          'Independent events multiply; use the complement for "at least one" problems.',
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
    summary:
      "Counting a union by adding then subtracting the overlap — a Venn diagram makes the formula obvious instead of memorized.",
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
        prompt:
          "In a class of 30, 18 take art and 15 take music, with 8 taking both. How many take at least one?",
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
        heading: 'Finding "neither"',
        bullets: [
          "Students taking neither = total - |Art ∪ Music| = 30 - 25 = 5.",
          'This split — union, then complement — handles most "how many satisfy at least one condition" contest questions.',
        ],
      },
      {
        type: "example",
        heading: "Three-set version",
        prompt:
          "For three overlapping sets, the formula grows by one more layer.",
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
          'Divisibility counting problems ("multiples of 2 or 3 up to 100") are almost always inclusion-exclusion in disguise.',
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Out of 50 students, 28 play soccer, 20 play basketball, and 10 play both. How many play at least one sport?",
        answer: "28 + 20 - 10 = 38.",
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
    summary:
      "Logic-grid puzzles reward one habit: eliminate everything you can before you guess anything.",
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
        prompt:
          "Anna, Ben, and Cara each play one sport: soccer, tennis, or chess. Anna doesn't play tennis. Ben doesn't play chess or tennis.",
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
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Dana, Eli, and Fox each play one instrument: piano, drums, or violin. Dana doesn't play drums. Eli doesn't play piano or violin. Fox doesn't play piano. Who plays what?",
        answer:
          "Eli doesn't play piano or violin, so Eli plays drums. Fox doesn't play piano and drums is taken, so Fox plays violin. That leaves piano for Dana.",
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
    summary:
      "When a process repeats indefinitely, find the quantity that never changes — it's usually the key to the whole problem.",
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
        prompt:
          "n lightbulbs start all off. A move flips the state of any two bulbs at once. Can all n end up on, if n is odd?",
        bullets: [
          "Flipping two bulbs changes the count of ON bulbs by +2, -2, or 0 — never by an odd amount.",
          "The parity (even/odd-ness) of the ON count is therefore invariant: it starts at 0, which is even, and every move preserves that.",
          'If n is odd, "all n bulbs on" means an odd ON count — impossible to reach from an even one. No sequence of moves can ever do it.',
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
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "7 coins start heads-up. A move flips exactly 2 coins. Can all coins end up tails-up?",
        answer:
          "No -- flipping two coins changes the heads-count by an even amount, so its parity is invariant. It starts odd (7), and 0 is even, so the target is unreachable.",
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

  {
    slug: "percent-change-and-growth-rate",
    title: "Percent Change and Growth",
    topicSlug: "percentages",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "Successive percent changes multiply instead of adding — the single fact that trips up more contest problems than any other percent rule.",
    scenes: [
      {
        type: "title",
        heading: "Percent Change and Growth",
        sub: "A 20% increase followed by a 20% decrease does NOT bring you back to where you started. Here's why.",
      },
      {
        type: "text",
        heading: "Percent change as a multiplier",
        bullets: [
          "Percent change = (new value − old value) / old value × 100.",
          "An increase of p% multiplies the original value by (1 + p/100).",
          "A decrease of p% multiplies the original value by (1 − p/100).",
          "Thinking in multipliers turns percent problems into ordinary multiplication.",
        ],
      },
      {
        type: "text",
        heading: "Successive changes multiply, not add",
        bullets: [
          "Two percent changes applied one after another combine by multiplying their factors together.",
          "A 20% increase then a 10% decrease is ×1.20 × ×0.90 = ×1.08, a net 8% increase — not the 10% you'd get by just adding +20 and −10.",
          "The order the changes are applied in doesn't affect the final multiplier, since multiplication is commutative.",
        ],
      },
      {
        type: "example",
        heading: "A shirt's price after two changes",
        prompt:
          "A shirt costs $40. Its price increases by 25%, and then the new price decreases by 20%. What is the final price?",
        bullets: [
          "After the 25% increase: $40 × 1.25 = $50.",
          "After the 20% decrease: $50 × 0.80 = $40.",
          "The final price is exactly $40 — back to the original, because 1.25 × 0.80 = 1.00 exactly.",
        ],
      },
      {
        type: "strategy",
        heading: "Work in multipliers",
        bullets: [
          "Convert every percent change to a decimal multiplier before combining anything.",
          "Chain multipliers left to right for as many successive changes as the problem describes.",
          "To find the overall percent change, subtract 1 from the final combined multiplier and convert back to a percent.",
        ],
      },
      {
        type: "pitfall",
        heading: "Don't add percentages directly",
        bullets: [
          "Adding or subtracting percent changes directly (treating +25% then −20% as a net +5%) is wrong whenever the changes apply to different base values.",
          "The two percentages only cancel to exactly 0% in special cases — always multiply the factors to check.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A stock price rises 50% one year, then falls 50% the next year. What is the net percent change from the original price?",
        answer:
          "A net decrease of 25%. The multiplier is 1.50 × 0.50 = 0.75, meaning the final price is 75% of the original — a 25% loss, not 0%.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Convert percent changes to multipliers: increase by p% is ×(1 + p/100), decrease is ×(1 − p/100).",
          "Chain successive percent changes by multiplying their factors, never by adding the percentages.",
          "Rising then falling by the same percent always leaves you below where you started.",
        ],
      },
    ],
  },
  {
    slug: "combined-rates-and-work-problems",
    title: "Rates",
    topicSlug: "rates",
    difficulty: 4,
    durationMinutes: 7,
    summary:
      "When two workers or pipes act together, their rates add — but the times themselves never average directly.",
    scenes: [
      {
        type: "title",
        heading: "Combined Rates and Work Problems",
        sub: "Rate = quantity ÷ time. When two rates work at once, it's the rates that add, not the times.",
      },
      {
        type: "text",
        heading: "Rate as work per unit time",
        bullets: [
          "A rate measures how much work, distance, or quantity happens per unit of time: rate = amount / time.",
          "If a job takes t hours to finish alone, the worker's rate is 1/t of the job per hour.",
          "Rates from different workers or machines combine by addition when they act at the same time.",
        ],
      },
      {
        type: "text",
        heading: "The work-rate equation",
        bullets: [
          "If Worker A finishes a job in tA hours and Worker B finishes it in tB hours, their combined rate is 1/tA + 1/tB jobs per hour.",
          "The time to finish together is the reciprocal of that combined rate: 1 / (1/tA + 1/tB).",
          "This is the same idea used for pipes filling a tank, or for combined typing/production rates.",
        ],
      },
      {
        type: "example",
        heading: "Two pipes filling a pool",
        prompt:
          "Pipe A fills a pool in 6 hours by itself. Pipe B fills the same pool in 3 hours by itself. Working together, how long do they take?",
        bullets: [
          "Pipe A's rate: 1/6 pool per hour. Pipe B's rate: 1/3 = 2/6 pool per hour.",
          "Combined rate: 1/6 + 2/6 = 3/6 = 1/2 pool per hour.",
          "Time together = 1 / (1/2) = 2 hours.",
        ],
        diagram: {
          kind: "bars",
          total: 6,
          segments: [
            { label: "Pipe A rate (1/6)", value: 1, tone: "brand" },
            { label: "Pipe B rate (2/6)", value: 2, tone: "success" },
            { label: "Remaining", value: 3, tone: "slate" },
          ],
          note: "Combined: 3/6 pool per hour → 2 hours to fill.",
        },
      },
      {
        type: "strategy",
        heading: "Always convert to rate first",
        bullets: [
          "Turn every 'time to finish alone' into a rate (1/time) before combining anything.",
          "Find a common denominator to add the rates, then take the reciprocal of the sum to get the combined time.",
          "For problems where one worker leaves partway through, track completed fraction of the job, not elapsed time.",
        ],
      },
      {
        type: "pitfall",
        heading: "Don't average the times",
        bullets: [
          "Averaging 6 hours and 3 hours to guess '4.5 hours together' is a common but wrong shortcut — the correct answer above is 2 hours.",
          "Combined time together is always less than the faster worker's solo time, which is a quick sanity check.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Machine X completes a task in 4 hours alone. Machine Y completes the same task in 12 hours alone. Working together, how long do they take?",
        answer:
          "3 hours. Rate X = 1/4, Rate Y = 1/12, combined = 3/12 + 1/12 = 4/12 = 1/3 job per hour, so time = 3 hours.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Rate = amount / time; convert solo completion times into rates before combining.",
          "Combined rate is the sum of individual rates; combined time is the reciprocal of that sum.",
          "Never average the individual times directly — combined time is always faster than the quickest solo time.",
        ],
      },
    ],
  },
  {
    slug: "ratios-and-proportions-video-walkthrough",
    title: "Ratios & Proportions",
    topicSlug: "ratios-proportions",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "A ratio like 3:4 splits a total into 7 parts, not into a fraction of 3/4 — this walkthrough builds the parts-based approach from scratch.",
    scenes: [
      {
        type: "title",
        heading: "Ratios & Proportions",
        sub: "Ratios compare quantities; proportions set two ratios equal. Both scale by multiplying every term by the same number.",
      },
      {
        type: "text",
        heading: "Scaling ratios",
        bullets: [
          "A ratio a:b compares two quantities by division and represents the same relationship as any equivalent scaled version, like 3:5 and 6:10.",
          "Multiplying or dividing every term of a ratio by the same nonzero number never changes the relationship it describes.",
          "Ratios can have more than two terms, like 2:3:5, and the same scaling rule applies to every term at once.",
        ],
      },
      {
        type: "text",
        heading: "Proportions and parts of a whole",
        bullets: [
          "A proportion states two ratios are equal, a/b = c/d, and can be solved by cross-multiplying: a·d = b·c.",
          "When a ratio describes parts of a total, add the ratio's terms to find the total number of equal parts.",
          "Dividing the actual total by the number of parts gives the size of one part, which then scales up to any group in the ratio.",
        ],
      },
      {
        type: "example",
        heading: "Splitting a total by ratio",
        prompt:
          "A jar contains red and blue marbles in the ratio 3:4. There are 35 marbles total. How many are red?",
        bullets: [
          "Total parts: 3 + 4 = 7 parts.",
          "Value of one part: 35 / 7 = 5 marbles per part.",
          "Red marbles: 3 × 5 = 15. (Blue marbles: 4 × 5 = 20, and 15 + 20 = 35 checks out.)",
        ],
        diagram: {
          kind: "bars",
          total: 35,
          segments: [
            { label: "Red (3 parts)", value: 15, tone: "brand" },
            { label: "Blue (4 parts)", value: 20, tone: "success" },
          ],
          note: "7 total parts × 5 marbles per part = 35 marbles.",
        },
      },
      {
        type: "strategy",
        heading: "Use parts, not fractions of the whole",
        bullets: [
          "Add the ratio's terms to get total parts, divide the actual total by that number, then scale each term back up.",
          "For proportion equations with an unknown, cross-multiply directly instead of trying to simplify fractions first.",
        ],
      },
      {
        type: "pitfall",
        heading: "3:4 is not the fraction 3/4",
        bullets: [
          "A ratio of 3:4 means 3 parts out of 7 total parts, not 3/4 of the whole — that confusion produces answers that are consistently too large.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "The ratio of cats to dogs at a shelter is 2:5, and there are 12 more dogs than cats. How many cats are there?",
        answer:
          "8 cats. Let cats = 2k and dogs = 5k. Then 5k − 2k = 12, so 3k = 12 and k = 4, giving cats = 2 × 4 = 8 (and dogs = 20).",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Ratios scale by multiplying or dividing every term by the same number.",
          "For a total split by ratio, add the terms for total parts, then divide the actual total by that count.",
          "Proportions solve by cross-multiplication: a/b = c/d means a·d = b·c.",
        ],
      },
    ],
  },
  {
    slug: "averages-and-missing-value-problems",
    title: "Averages",
    topicSlug: "averages",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "The fastest way through any average problem is to stop averaging and start adding: sum = average times count.",
    scenes: [
      {
        type: "title",
        heading: "Averages and Missing Values",
        sub: "Sum = average × count. Once you see averages this way, missing-value problems turn into simple subtraction.",
      },
      {
        type: "text",
        heading: "Average as sum divided by count",
        bullets: [
          "The average of n numbers is their sum divided by n.",
          "Flipping the formula gives sum = average × count, which is the key tool for missing-value problems.",
          "If you know the average and count you want, you know the exact total sum required.",
        ],
      },
      {
        type: "text",
        heading: "Weighted averages",
        bullets: [
          "When combining groups of different sizes, weight each group's average by its own count before adding.",
          "Combined average = (sum of all group sums) / (sum of all group counts) — never just the average of the group averages.",
          "A larger group pulls the combined average closer to its own average.",
        ],
      },
      {
        type: "example",
        heading: "Finding a missing test score",
        prompt:
          "Five numbers have an average of 12. Four of them are 10, 14, 9, and 15. What is the fifth number?",
        bullets: [
          "Required total sum: 12 × 5 = 60.",
          "Sum of the four known numbers: 10 + 14 + 9 + 15 = 48.",
          "Fifth number: 60 − 48 = 12.",
        ],
      },
      {
        type: "strategy",
        heading: "Convert to sums immediately",
        bullets: [
          "As soon as you see an average problem, multiply average × count to get a concrete sum to work with.",
          "For weighted-average problems, multiply each group's average by its own count, add the results, then divide by the total count.",
        ],
      },
      {
        type: "pitfall",
        heading: "Don't average the averages",
        bullets: [
          "Averaging two group averages directly, ignoring how many members are in each group, gives a biased and incorrect combined average unless the groups happen to be the same size.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A student's average on 4 tests is 88. What score does the student need on a 5th test to raise the average to 90?",
        answer:
          "98. Required sum for 5 tests: 90 × 5 = 450. Current sum: 88 × 4 = 352. Fifth score: 450 − 352 = 98.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Average = sum / count, so sum = average × count is the tool for missing-value problems.",
          "Weighted averages must account for each group's size — never average the averages directly.",
          "Convert every average problem to a sum problem as your first move.",
        ],
      },
    ],
  },
  {
    slug: "number-properties-video-primes-and-parity",
    title: "Number Properties",
    topicSlug: "number-properties",
    difficulty: 5,
    durationMinutes: 7,
    summary:
      "Parity rules and prime factorization unlock a whole category of contest problems that never require a single long calculation.",
    scenes: [
      {
        type: "title",
        heading: "Number Properties: Parity and Primes",
        sub: "Odd, even, and prime facts let you solve problems by pure structure — no heavy computation required.",
      },
      {
        type: "text",
        heading: "Parity rules",
        bullets: [
          "Even + even = even, and odd + odd = even; even + odd = odd.",
          "Any product involving at least one even number is even; a product is odd only if every factor is odd.",
          "Representing an unknown even number as 2k and an unknown odd number as 2k+1 turns parity claims into provable algebra.",
        ],
      },
      {
        type: "text",
        heading: "Prime factorization as a toolkit",
        bullets: [
          "Every integer greater than 1 has a unique prime factorization.",
          "The number of positive divisors of n = p1^e1 × p2^e2 × ... is (e1+1)(e2+1)...(the exponents each get +1, then multiply).",
          "GCD takes the minimum exponent on each shared prime; LCM takes the maximum exponent on every prime present in either number.",
        ],
      },
      {
        type: "example",
        heading: "Counting divisors",
        prompt: "How many positive divisors does 72 have?",
        bullets: [
          "Factor 72 into primes: 72 = 2³ × 3².",
          "Add 1 to each exponent: (3+1) and (2+1).",
          "Multiply: 4 × 3 = 12 positive divisors.",
        ],
      },
      {
        type: "strategy",
        heading: "Factor first, count second",
        bullets: [
          "For any divisor-counting, GCD, or LCM problem, always start by writing the full prime factorization.",
          "For parity claims, test the algebraic form (2k or 2k+1) rather than relying on a couple of guessed examples, which can accidentally match a false pattern.",
        ],
      },
      {
        type: "pitfall",
        heading: "Off-by-one on exponents",
        bullets: [
          "Forgetting to add 1 to each exponent before multiplying is the most common divisor-counting mistake — using the exponents directly undercounts every time.",
          "Remember 1 is neither prime nor composite, and 2 is the only even prime, which trips up parity-based prime arguments.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "How many positive divisors does 100 have?",
        answer:
          "9 divisors. Factor 100 = 2² × 5². Add 1 to each exponent: (2+1)(2+1) = 3 × 3 = 9.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Even/odd combine predictably under addition and multiplication — use 2k and 2k+1 to prove it, not just guess it.",
          "Prime factorization is the master tool for divisor counts, GCD, and LCM.",
          "Divisor count = product of (exponent + 1) across every prime in the factorization.",
        ],
      },
    ],
  },

  {
    slug: "factoring-strategies-video",
    title: "Factoring Strategies",
    topicSlug: "factoring",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "A tour of the three factoring moves that solve almost every contest problem: pulling out the GCF, spotting special patterns, and reverse-FOILing trinomials.",
    scenes: [
      {
        type: "title",
        heading: "Factoring Strategies",
        sub: "Before trying anything fancy, always check for a common factor first — it's the step everyone forgets.",
      },
      {
        type: "text",
        heading: "The factoring toolkit",
        bullets: [
          "Greatest common factor (GCF): pull out whatever every term shares.",
          "Difference of squares: a² − b² = (a − b)(a + b).",
          "Perfect square trinomial: a² + 2ab + b² = (a + b)².",
          "General trinomial x² + bx + c: find two numbers multiplying to c and adding to b.",
        ],
      },
      {
        type: "text",
        heading: "Order of operations for factoring",
        bullets: [
          "Step 1: always factor out the GCF, even if it's just a number.",
          "Step 2: check if what remains matches a special pattern.",
          "Step 3: if it's a plain trinomial, find the two numbers by trial and error.",
        ],
      },
      {
        type: "example",
        heading: "Factor completely",
        prompt: "Factor completely: 3x³ − 12x.",
        bullets: [
          "Both terms share a factor of 3x — pull it out: 3x(x² − 4).",
          "x² − 4 is a difference of squares: x² − 4 = (x − 2)(x + 2).",
          "Fully factored form: 3x(x − 2)(x + 2).",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "3x^3 - 12x", note: "original expression" },
            { expr: "3x(x^2 - 4)", note: "factor out the GCF" },
            { expr: "3x(x-2)(x+2)", note: "difference of squares" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Spotting the right move fast",
        bullets: [
          "Always scan for a GCF first — skipping it leads to 'stuck' trinomials that were never fully reduced.",
          "Two terms with a minus sign between two perfect squares almost always means difference of squares.",
          "For x² + bx + c, list factor pairs of c and check which pair sums to b before guessing randomly.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting to factor out the GCF first, then trying to force-fit a pattern onto the full expression.",
          "Sign errors when the leading coefficient is negative — factor out a negative GCF carefully and flip signs inside.",
          "Stopping after one factoring step without checking if the resulting factors can be broken down further.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Factor completely: x² − 9x + 20.",
        answer: "(x − 4)(x − 5), since −4 × −5 = 20 and −4 + −5 = −9.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Always pull out the GCF before doing anything else.",
          "Recognize difference of squares and perfect square trinomial patterns on sight.",
          "For general trinomials, find the factor pair of c that sums to b.",
        ],
      },
    ],
  },
  {
    slug: "systems-of-equations-video",
    title: "Systems of Equations",
    topicSlug: "systems-of-equations",
    difficulty: 4,
    durationMinutes: 7,
    summary:
      "Substitution and elimination are two roads to the same intersection point — this lesson shows how to pick the faster one.",
    scenes: [
      {
        type: "title",
        heading: "Systems of Equations",
        sub: "Solving a system means finding the point where two equations agree — the (x, y) that satisfies both at once.",
      },
      {
        type: "text",
        heading: "Two main methods",
        bullets: [
          "Substitution: solve one equation for a variable, then plug that expression into the other equation.",
          "Elimination: add or subtract the equations (after scaling, if needed) to cancel out one variable entirely.",
          "Graphing: the solution is the point where the two lines cross — useful for checking, slow for solving exactly.",
        ],
      },
      {
        type: "example",
        heading: "Solve by elimination",
        prompt: "Solve the system: 2x + y = 11 and x − y = 1.",
        bullets: [
          "The y-terms have opposite signs, so adding the equations cancels y directly.",
          "Adding: (2x + y) + (x − y) = 11 + 1, which gives 3x = 12, so x = 4.",
          "Substitute x = 4 into x − y = 1: 4 − y = 1, so y = 3.",
          "Check in the other equation: 2(4) + 3 = 11. ✓",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "2x+y=11" },
            { expr: "x-y=1" },
            { expr: "3x=12", note: "add the equations" },
            { expr: "x=4,\\ y=3" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Choosing the faster method",
        bullets: [
          "Use elimination when a variable already has matching or opposite coefficients in both equations.",
          "Use substitution when one equation is already solved for a variable, or solving for one is a single quick step.",
          "Whichever method you use, always plug your answer back into BOTH original equations to confirm it.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting to distribute a negative sign when subtracting one full equation from another.",
          "Solving for only one variable and forgetting to substitute back in to find the second one.",
          "Multiplying only one side of an equation by a scaling factor instead of both sides.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Solve the system: x + 2y = 8 and 3x − y = 3.",
        answer:
          "x = 2, y = 3. From the first equation, x = 8 − 2y; substituting gives 3(8 − 2y) − y = 3, so 24 − 7y = 3, y = 3, and x = 8 − 6 = 2.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "A system's solution is the (x, y) pair that satisfies every equation simultaneously.",
          "Elimination cancels a variable by adding or subtracting equations; substitution replaces a variable with an equivalent expression.",
          "Always verify your final answer in both original equations.",
        ],
      },
    ],
  },
  {
    slug: "exponents-and-radicals-video",
    title: "Exponents & Radicals",
    topicSlug: "exponents-radicals",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "The exponent laws and radical simplification rules are really the same system viewed two ways — fractional exponents are the bridge between them.",
    scenes: [
      {
        type: "title",
        heading: "Exponents & Radicals",
        sub: "Same base, add or subtract the exponents. Different form, same rules — radicals are just fractional exponents in disguise.",
      },
      {
        type: "text",
        heading: "Exponent laws",
        bullets: [
          "Product rule: a^m · a^n = a^(m+n).",
          "Quotient rule: a^m ÷ a^n = a^(m−n).",
          "Power of a power: (a^m)^n = a^(mn).",
          "Negative exponent: a^(−n) = 1/a^n.",
        ],
      },
      {
        type: "text",
        heading: "Radical rules",
        bullets: [
          "√(ab) = √a · √b, so pull out the largest perfect square factor to simplify.",
          "a^(1/n) is the same thing as the nth root of a.",
          "Only 'like radicals' (same number under the root) can be added or subtracted directly.",
        ],
      },
      {
        type: "example",
        heading: "Simplify using exponent rules",
        prompt: "Simplify (2x²)³ ÷ (4x⁵).",
        bullets: [
          "(2x²)³ = 2³ · x⁶ = 8x⁶.",
          "Divide: 8x⁶ ÷ 4x⁵ = (8/4) · x^(6−5) = 2x.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "(2x^2)^3 \\div (4x^5)" },
            { expr: "8x^6 \\div 4x^5" },
            { expr: "2x" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Working smart with mixed expressions",
        bullets: [
          "Convert every radical to a fractional exponent before combining it with other exponent terms.",
          "When bases differ, look for a way to rewrite them as powers of the same smaller base (like writing 4 as 2²).",
          "For radicals, always search for the LARGEST perfect square factor so you don't have to simplify twice.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Adding exponents when the operation is actually a power of a power (which requires multiplying instead).",
          "Believing a negative exponent makes the result negative — it only creates a reciprocal.",
          "Assuming √a + √b = √(a + b), which is never true for radicals.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Simplify: √75 − √27.",
        answer:
          "2√3. Since √75 = √(25·3) = 5√3 and √27 = √(9·3) = 3√3, the difference is 5√3 − 3√3 = 2√3.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Exponent rules combine powers of the same base by adding, subtracting, or multiplying exponents.",
          "Radicals simplify by factoring out the largest perfect square, and only like radicals combine.",
          "Fractional exponents let you treat radicals with the exact same rules as integer exponents.",
        ],
      },
    ],
  },
  {
    slug: "inequalities-video",
    title: "Inequalities",
    topicSlug: "inequalities",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Solving inequalities looks just like solving equations, with one dangerous exception: dividing by a negative flips the sign.",
    scenes: [
      {
        type: "title",
        heading: "Inequalities",
        sub: "Same algebra as equations — until you multiply or divide by a negative number. Then the sign flips.",
      },
      {
        type: "text",
        heading: "Rules for solving",
        bullets: [
          "Add or subtract the same amount from both sides freely, just like an equation.",
          "Multiplying or dividing by a POSITIVE number keeps the inequality direction the same.",
          "Multiplying or dividing by a NEGATIVE number flips the inequality direction.",
          "Compound inequalities (like −2 < 2x − 4 ≤ 6) apply the same operation to all three parts at once.",
        ],
      },
      {
        type: "example",
        heading: "Solve and graph",
        prompt: "Solve: −4x + 3 > 15.",
        bullets: [
          "Subtract 3 from both sides: −4x > 12.",
          "Divide both sides by −4, and flip the inequality: x < −3.",
        ],
        diagram: {
          kind: "numberline",
          min: -6,
          max: 2,
          points: [{ value: -3, label: "x = -3", tone: "warning" }],
          note: "Open circle at -3; solution is everything to the left.",
        },
      },
      {
        type: "strategy",
        heading: "Staying safe with sign flips",
        bullets: [
          "Isolate the variable one operation at a time, and pause specifically whenever you multiply or divide.",
          "After solving, plug in one test value from your claimed solution set to confirm it satisfies the original inequality.",
          "For compound inequalities, treat all three parts as needing the identical operation every single step.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting to flip the sign when dividing or multiplying by a negative number.",
          "Using a closed (filled) circle for a strict inequality, or an open circle when equality is included.",
          "Splitting a compound inequality into two pieces and solving them with different operations by accident.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Solve: 5 − 2x ≥ −3.",
        answer:
          "x ≤ 4. Subtracting 5 gives −2x ≥ −8; dividing by −2 flips the inequality to x ≤ 4.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Solve inequalities like equations, but flip the direction whenever multiplying or dividing by a negative.",
          "Compound inequalities need the same operation applied to all three parts.",
          "Use open circles for strict inequalities and closed circles when equality is allowed.",
        ],
      },
    ],
  },
  {
    slug: "sequences-and-series-video",
    title: "Sequences & Series",
    topicSlug: "sequences",
    difficulty: 6,
    durationMinutes: 7,
    summary:
      "Arithmetic sequences add a constant amount, geometric sequences multiply by a constant ratio — and each has its own formula for summing terms quickly.",
    scenes: [
      {
        type: "title",
        heading: "Sequences & Series",
        sub: "Arithmetic sequences add the same amount each step. Geometric sequences multiply by the same ratio. Different structure, different sum formulas.",
      },
      {
        type: "text",
        heading: "Arithmetic vs. geometric",
        bullets: [
          "Arithmetic: consecutive terms differ by a constant d. Formula: a_n = a_1 + (n − 1)d.",
          "Geometric: consecutive terms share a constant ratio r. Formula: a_n = a_1 · r^(n−1).",
          "Check the pattern first — subtract consecutive terms (arithmetic) or divide them (geometric) — before picking a formula.",
        ],
      },
      {
        type: "text",
        heading: "Summing a series",
        bullets: [
          "Arithmetic sum: S_n = n/2 · (a_1 + a_n) — average the endpoints, multiply by the count.",
          "Geometric sum (finite): S_n = a_1(1 − r^n)/(1 − r), for r ≠ 1.",
          "Infinite geometric sum: S = a_1/(1 − r), but only converges when |r| < 1.",
        ],
      },
      {
        type: "example",
        heading: "Arithmetic term and sum",
        prompt:
          "An arithmetic sequence starts at 5 with common difference 3. Find the 15th term and the sum of the first 15 terms.",
        bullets: [
          "a_15 = a_1 + (n − 1)d = 5 + 14(3) = 5 + 42 = 47.",
          "S_15 = n/2 · (a_1 + a_n) = 15/2 · (5 + 47) = 15/2 · 52 = 390.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "a_{15} = 5 + 14(3) = 47" },
            { expr: "S_{15} = \\tfrac{15}{2}(5+47) = 390" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Identify before you calculate",
        bullets: [
          "Test the pattern of the first three terms — is the difference constant, or is the ratio constant?",
          "For arithmetic sums, pairing the first and last terms (Gauss's trick) is a fast way to double-check S_n.",
          "For geometric series, always confirm whether the question wants a finite sum (use n) or an infinite sum (requires |r| < 1).",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Using the arithmetic sum formula on a geometric sequence, since both involve a_1 and n.",
          "Mixing up a_n with a_(n−1), causing an off-by-one error in the term count.",
          "Applying the infinite geometric sum formula without checking that |r| < 1 first.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A geometric sequence has a_1 = 6 and r = 1/3. Find the sum of its first 4 terms.",
        answer:
          "80/9. Using S_4 = a_1(1 − r^4)/(1 − r) = 6(1 − 1/81)/(2/3) = 6(80/81)(3/2) = 80/9 (about 8.89), matching the direct sum 6 + 2 + 2/3 + 2/9.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Arithmetic sequences add a constant difference; geometric sequences multiply by a constant ratio.",
          "Sum formulas differ by type — check the pattern before choosing one.",
          "Infinite geometric sums only exist when the common ratio's absolute value is less than 1.",
        ],
      },
    ],
  },
  {
    slug: "functions-and-composition-video",
    title: "Functions",
    topicSlug: "functions",
    difficulty: 5,
    durationMinutes: 6,
    summary:
      "Function notation is just a labeled substitution rule, and composition means feeding one function's output into another — always working from the inside out.",
    scenes: [
      {
        type: "title",
        heading: "Functions",
        sub: "f(x) is a rule: substitute the input for x everywhere. Composition just chains two rules together, innermost first.",
      },
      {
        type: "text",
        heading: "Function notation and domain",
        bullets: [
          "f(a) means: replace every x in f's formula with a, then simplify.",
          "Domain restrictions to watch for: denominators can't be zero, and expressions under an even root can't be negative.",
          "The range is the set of outputs the function can actually produce.",
        ],
      },
      {
        type: "text",
        heading: "Composition",
        bullets: [
          "f(g(x)) means evaluate g(x) first, then plug that result into f.",
          "Order matters: f(g(x)) and g(f(x)) are generally different functions.",
          "Always work strictly inside-out — never substitute both functions at the same time.",
        ],
      },
      {
        type: "example",
        heading: "Evaluate and compose",
        prompt:
          "Let f(x) = x² − 2x. Find f(3) and f(−1). Then let g(x) = 2x + 1 and find f(g(1)).",
        bullets: [
          "f(3) = 9 − 6 = 3.",
          "f(−1) = 1 + 2 = 3 (same output as f(3), since the graph is symmetric).",
          "g(1) = 2(1) + 1 = 3, then f(g(1)) = f(3) = 3.",
        ],
      },
      {
        type: "strategy",
        heading: "Working composition problems",
        bullets: [
          "Evaluate the innermost function call completely before touching the outer one — never try to do both in one step.",
          "For domain problems, list each restriction (denominators, radicals, logs) separately, then intersect the intervals at the end.",
          "If asked for a combined formula like f(g(x)), substitute g(x)'s entire formula in for x in f, then simplify.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Computing g(f(x)) when the problem actually asked for f(g(x)).",
          "Finding one domain restriction and stopping, missing a second restriction elsewhere in the same expression.",
          "Writing f(x + h) as f(x) + h instead of substituting the full quantity (x + h) for x.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Let f(x) = 3x − 5 and g(x) = x² + 1. Find f(g(2)).",
        answer: "10. First g(2) = 4 + 1 = 5, then f(5) = 3(5) − 5 = 10.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Function notation is substitution: replace the variable with the given input everywhere it appears.",
          "Domain restrictions come from denominators (≠ 0) and even radicals (≥ 0), combined together.",
          "Composition works from the inside out, and order changes the result.",
        ],
      },
    ],
  },
  {
    slug: "polynomial-division-and-roots-video",
    title: "Polynomials",
    topicSlug: "polynomials",
    difficulty: 7,
    durationMinutes: 8,
    summary:
      "Synthetic division plus the Remainder and Factor Theorems turn 'find the roots of a cubic' into a fast, mechanical process.",
    scenes: [
      {
        type: "title",
        heading: "Polynomials",
        sub: "The Remainder Theorem tells you a remainder instantly. The Factor Theorem turns that into a root-finding shortcut.",
      },
      {
        type: "text",
        heading: "Two key theorems",
        bullets: [
          "Remainder Theorem: dividing p(x) by (x − a) leaves a remainder equal to p(a).",
          "Factor Theorem: (x − a) is a factor of p(x) exactly when p(a) = 0.",
          "Rational Root Theorem narrows down which values of a are worth testing: factors of the constant term over factors of the leading coefficient.",
        ],
      },
      {
        type: "text",
        heading: "Synthetic division setup",
        bullets: [
          "Write only the coefficients of p(x), including 0 for any missing degree.",
          "Bring down the leading coefficient, then repeatedly multiply by a and add to the next coefficient.",
          "The last number produced is the remainder; the rest are the coefficients of the quotient, one degree lower.",
        ],
      },
      {
        type: "example",
        heading: "Find all roots",
        prompt: "Find all roots of p(x) = x³ + 2x² − 5x − 6.",
        bullets: [
          "Test x = 2: p(2) = 8 + 8 − 10 − 6 = 0, so (x − 2) is a factor.",
          "Synthetic division with root 2 on coefficients 1, 2, −5, −6: bring down 1; 1(2)=2, 2+2=4; 4(2)=8, −5+8=3; 3(2)=6, −6+6=0.",
          "Quotient: x² + 4x + 3 = (x + 1)(x + 3).",
          "Full factorization: p(x) = (x − 2)(x + 1)(x + 3), so the roots are x = 2, −1, −3.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "p(2) = 0 \\Rightarrow (x-2)\\text{ is a factor}" },
            { expr: "x^3+2x^2-5x-6 = (x-2)(x^2+4x+3)" },
            { expr: "(x-2)(x+1)(x+3)" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Working root problems efficiently",
        bullets: [
          "Build a short candidate list with the Rational Root Theorem before testing anything by hand.",
          "Test the smallest candidates first — contest polynomials are usually built around small integer roots.",
          "After each confirmed root, synthetic division drops the degree by one, so the next root gets easier to find.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Using −a instead of a in the synthetic division row when the factor is written as (x − a).",
          "Forgetting a placeholder 0 for a missing-degree term, which shifts every coefficient afterward.",
          "Stopping after finding one factor instead of checking whether the remaining quotient factors further.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Show that (x − 3) is a factor of x³ − 7x² + 7x + 15, then find all the roots.",
        answer:
          "The roots are x = 3, 5, and −1. Since p(3) = 27 − 63 + 21 + 15 = 0, (x − 3) is a factor by the Factor Theorem; synthetic division gives the quotient x² − 4x − 5 = (x − 5)(x + 1).",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "The Remainder Theorem gives p(a) instantly; the Factor Theorem turns p(a) = 0 into a confirmed factor.",
          "Synthetic division reduces a polynomial's degree by one each time a root is confirmed.",
          "Pair the Rational Root Theorem with synthetic division to systematically hunt down every root.",
        ],
      },
    ],
  },

  {
    slug: "angle-relationships-video",
    title: "Angle Relationships",
    topicSlug: "angles",
    difficulty: 2,
    durationMinutes: 5,
    summary:
      "Complementary, supplementary, vertical, and parallel-line angle pairs — the vocabulary behind almost every angle-chasing problem.",
    scenes: [
      {
        type: "title",
        heading: "Angle Relationships",
        sub: "A handful of angle pairs — complementary, supplementary, vertical, corresponding — unlock nearly every angle problem on a geometry contest.",
      },
      {
        type: "text",
        heading: "Basic angle pairs",
        bullets: [
          "Complementary angles sum to 90°.",
          "Supplementary angles sum to 180°.",
          "Vertical angles (formed by two crossing lines) are always equal.",
          "A linear pair (two angles that form a straight line) is always supplementary.",
        ],
      },
      {
        type: "text",
        heading: "Parallel lines and a transversal",
        bullets: [
          "When a transversal crosses two parallel lines, corresponding angles are equal.",
          "Alternate interior angles (on opposite sides of the transversal, between the parallel lines) are equal.",
          "Co-interior (same-side interior) angles are supplementary, not equal.",
        ],
      },
      {
        type: "example",
        heading: "Finding an unknown angle",
        prompt:
          "Two parallel lines are cut by a transversal. One angle measures 65°. Find its alternate interior angle, and the co-interior angle on the other line.",
        bullets: [
          "Alternate interior angles are equal, so the alternate interior angle is also 65°.",
          "Co-interior angles are supplementary, so that angle is 180° - 65° = 115°.",
        ],
      },
      {
        type: "strategy",
        heading: "Fast angle-chasing",
        bullets: [
          "Mark every angle you know directly on the figure first, then hunt for a vertical, corresponding, or alternate pair that copies that value elsewhere.",
          "Any two angles that form a straight line are supplementary — use that to fill in a missing angle instantly.",
          "Don't assume corresponding angles are equal unless the lines are actually marked or stated to be parallel.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Confusing alternate interior angles (equal) with co-interior angles (supplementary) — they sit in similar-looking positions but obey different rules.",
          "Assuming two angles are vertical just because they look opposite; verify the two lines actually cross at a single shared point.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Two parallel lines are cut by a transversal. One angle measures 3x, and its co-interior angle on the other line measures 2x + 30. Find x.",
        answer:
          "x = 30. Co-interior angles are supplementary: 3x + (2x + 30) = 180, so 5x + 30 = 180, 5x = 150, x = 30.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Vertical angles and corresponding angles are equal; linear pairs and co-interior angles are supplementary.",
          "Alternate interior and alternate exterior angles are equal only when the two lines are parallel.",
          "Chase angles by labeling known values first and applying one relationship at a time.",
        ],
      },
    ],
  },
  {
    slug: "similarity-and-congruence-video",
    title: "Similarity & Congruence",
    topicSlug: "similarity-congruence",
    difficulty: 5,
    durationMinutes: 7,
    summary:
      "Telling congruence from similarity, proving each with the right rule, and using scale factors to find missing sides and areas.",
    scenes: [
      {
        type: "title",
        heading: "Similarity & Congruence",
        sub: "Congruent triangles are identical copies; similar triangles are scaled copies. Both are proved with a short list of rules.",
      },
      {
        type: "text",
        heading: "Congruence shortcuts",
        bullets: [
          "SSS: three pairs of corresponding sides are equal.",
          "SAS: two sides and the angle between them are equal.",
          "ASA / AAS: two angles and a corresponding side are equal.",
          "These rules prove two triangles are exactly the same size and shape.",
        ],
      },
      {
        type: "text",
        heading: "Similarity and scale factor",
        bullets: [
          "AA similarity: if two angles of one triangle equal two angles of another, the triangles are similar.",
          "Similar triangles have proportional corresponding sides, linked by one constant scale factor k.",
          "Perimeters of similar figures scale by k; areas scale by k².",
        ],
        diagram: {
          kind: "triangleAngles",
          angles: [50, 70, 60],
          labels: ["50°", "70°", "60°"],
        },
      },
      {
        type: "example",
        heading: "Using a scale factor",
        prompt:
          "Triangle ABC has sides 6, 8, 10. Triangle DEF is similar to ABC with scale factor 1.5. Find the sides of DEF and the ratio of their areas.",
        bullets: [
          "Multiply each side of ABC by 1.5: 6×1.5=9, 8×1.5=12, 10×1.5=15.",
          "DEF has sides 9, 12, 15.",
          "Area ratio = k² = 1.5² = 2.25, so DEF's area is 2.25 times ABC's area.",
        ],
      },
      {
        type: "strategy",
        heading: "Proving similarity or congruence fast",
        bullets: [
          "Look for a shared or vertical angle between two triangles — it's often the 'free' angle that unlocks AA similarity.",
          "To prove congruence, identify which three pieces of matching information you have and check them against a valid rule; SSA is not a valid rule on its own.",
          "Once similarity is established, set up a proportion between corresponding sides in the correct order and solve for the unknown.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Matching sides in the wrong order when writing a similarity ratio — if triangle ABC ~ DEF, then A↔D, B↔E, C↔F, and the sides must be paired the same way.",
          "Treating SSA as a valid congruence rule — it isn't, since the same three measurements can sometimes produce two different triangles.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Triangle PQR ~ Triangle STU, with PQ = 4, QR = 6, and ST = 6. Find TU.",
        answer:
          "TU = 9. The scale factor from PQR to STU is ST/PQ = 6/4 = 1.5, and TU corresponds to QR, so TU = QR × 1.5 = 6 × 1.5 = 9.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "SSS, SAS, ASA, and AAS prove congruence; SSA does not.",
          "AA proves similarity; matching corresponding sides in the correct order gives a constant scale factor k.",
          "Perimeters scale by k and areas scale by k² between similar figures.",
        ],
      },
    ],
  },
  {
    slug: "area-perimeter-video",
    title: "Area & Perimeter of Composite Figures",
    topicSlug: "area-volume",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "Splitting composite shapes into rectangles, triangles, and circles to compute area and perimeter accurately.",
    scenes: [
      {
        type: "title",
        heading: "Area & Perimeter of Composite Figures",
        sub: "Most real contest figures aren't simple rectangles or circles — they're built by combining or cutting pieces out of them.",
      },
      {
        type: "text",
        heading: "Core formulas",
        bullets: [
          "Rectangle: area = length × width, perimeter = 2(length + width).",
          "Triangle: area = (1/2) × base × height.",
          "Circle: area = πr², circumference = 2πr.",
        ],
      },
      {
        type: "text",
        heading: "Composite strategy",
        bullets: [
          "Split the figure into pieces you already have formulas for.",
          "Add the areas of pieces that are present; subtract the areas of pieces that are removed.",
          "For perimeter, trace only the outer boundary — never any dashed line you drew just to split the shape.",
        ],
      },
      {
        type: "example",
        heading: "A patio with a corner cut out",
        prompt:
          "A patio is a 9 m by 6 m rectangle with a 3 m by 2 m rectangular corner cut out. Find its area and perimeter.",
        bullets: [
          "Full rectangle area = 9×6 = 54 m².",
          "Removed corner area = 3×2 = 6 m².",
          "Patio area = 54 - 6 = 48 m².",
          "Because the notch is cut from a corner, the two new inner edges exactly replace the two segments removed from the original sides, so the perimeter is unchanged: 2(9+6) = 30 m.",
        ],
      },
      {
        type: "strategy",
        heading: "Composite figure moves",
        bullets: [
          "Redraw the figure with dashed lines splitting it into rectangles, triangles, or circular pieces.",
          "Decide whether each piece adds to or subtracts from the total area before computing anything.",
          "For perimeter, trace only the true outer boundary of the figure.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Including the dashed construction lines used to split a composite shape when computing perimeter — only the true outer boundary counts.",
          "Forgetting to subtract the area of a removed piece, such as a notch or a hole, and simply adding every piece together.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A rectangular lawn is 14 m by 8 m. A circular fountain of radius 3 m sits inside it. Find the area of the lawn NOT covered by the fountain, to the nearest 0.1 m².",
        answer:
          "≈83.7 m². Rectangle area = 14×8 = 112 m²; fountain area = π(3)² ≈ 28.3 m²; remaining area = 112 - 28.3 ≈ 83.7 m².",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Split composite shapes into familiar pieces, then add or subtract their areas.",
          "Perimeter only follows the outer boundary, never internal construction lines.",
          "Circular pieces need π — keep extra decimal places until the final rounding step.",
        ],
      },
    ],
  },
  {
    slug: "volume-surface-area-video",
    title: "Volume & Surface Area",
    topicSlug: "three-d-geometry",
    difficulty: 5,
    durationMinutes: 7,
    summary:
      "Computing volume and surface area for prisms, cylinders, and spheres, and telling the two quantities apart.",
    scenes: [
      {
        type: "title",
        heading: "Volume & Surface Area",
        sub: "Volume tells you how much a solid holds; surface area tells you how much material covers it. Keep the two straight.",
      },
      {
        type: "text",
        heading: "Volume formulas",
        bullets: [
          "Prism: volume = (area of base) × height.",
          "Cylinder: volume = πr²h.",
          "Sphere: volume = (4/3)πr³.",
          "Cone: volume = (1/3)πr²h.",
        ],
      },
      {
        type: "text",
        heading: "Surface area formulas",
        bullets: [
          "Prism: surface area = sum of the areas of all outer faces.",
          "Cylinder: surface area = 2πr² (two bases) + 2πrh (lateral surface).",
          "Sphere: surface area = 4πr².",
        ],
      },
      {
        type: "example",
        heading: "A cylindrical tank",
        prompt:
          "A cylindrical water tank has radius 4 m and height 6 m. Find its volume and total surface area, in terms of π.",
        bullets: [
          "Volume = πr²h = π(4)²(6) = 96π m³.",
          "The two circular bases contribute 2π(4)² = 32π m².",
          "The lateral surface unrolls into a rectangle of area 2πrh = 2π(4)(6) = 48π m².",
          "Total surface area = 32π + 48π = 80π m².",
        ],
      },
      {
        type: "strategy",
        heading: "Keep volume and surface area separate",
        bullets: [
          "Volume answers 'how much can it hold' (cubic units); surface area answers 'how much material covers it' (square units) — decide which is being asked before substituting into anything.",
          "For a cylinder, remember the lateral surface is a rectangle with width equal to the base's circumference (2πr) and height h.",
          "For compound solids, find the volume (or surface area) of each simple piece and add or subtract, just like composite area problems.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Using diameter where a formula calls for radius, or vice versa — always confirm which one is given before substituting.",
          "Forgetting one of the two circular bases when computing a cylinder's surface area.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A sphere has radius 3 cm. Find its volume and surface area, in terms of π.",
        answer:
          "Volume = (4/3)π(3)³ = 36π cm³; surface area = 4π(3)² = 36π cm². (At r = 3, volume and surface area happen to give the same numeric coefficient of π.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Prism and cylinder volume = base area × height; sphere volume = (4/3)πr³.",
          "Surface area sums every outer face — don't forget bases or the lateral/curved surface.",
          "Match units to the quantity: cubic units for volume, square units for surface area.",
        ],
      },
    ],
  },
  {
    slug: "coordinate-geometry-video",
    title: "Coordinate Geometry Toolkit",
    topicSlug: "coordinate-geometry",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Distance, midpoint, and slope formulas, and how they combine to describe lines and test for parallel or perpendicular relationships.",
    scenes: [
      {
        type: "title",
        heading: "Coordinate Geometry Toolkit",
        sub: "Distance, midpoint, and slope are the three tools that turn any two points into full information about the segment between them.",
      },
      {
        type: "text",
        heading: "Distance and midpoint",
        bullets: [
          "Distance = √((x2-x1)² + (y2-y1)²), a direct application of the Pythagorean theorem.",
          "Midpoint = ((x1+x2)/2, (y1+y2)/2), the average of the two x-coordinates and the average of the two y-coordinates.",
        ],
      },
      {
        type: "text",
        heading: "Slope and lines",
        bullets: [
          "Slope = rise/run = (y2-y1)/(x2-x1).",
          "Parallel lines have equal slopes.",
          "Perpendicular lines have slopes that multiply to -1 (negative reciprocals).",
          "Point-slope form: y - y1 = m(x - x1).",
        ],
      },
      {
        type: "example",
        heading: "Distance, midpoint, and slope together",
        prompt:
          "Find the distance, midpoint, and slope between (-2, 1) and (4, 9).",
        bullets: [
          "Distance = √((4-(-2))² + (9-1)²) = √(6² + 8²) = √100 = 10, a 6-8-10 Pythagorean triple.",
          "Midpoint = ((-2+4)/2, (1+9)/2) = (1, 5).",
          "Slope = (9-1)/(4-(-2)) = 8/6 = 4/3.",
        ],
      },
      {
        type: "strategy",
        heading: "Working efficiently with coordinates",
        bullets: [
          "Watch for Pythagorean triples hidden in the differences (3-4-5, 6-8-10, 5-12-13) — they let you skip a calculator.",
          "To test whether two segments are perpendicular, multiply their slopes; a product of -1 confirms it.",
          "For a line through a known point with a known slope, point-slope form is usually faster than solving for the y-intercept first.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Subtracting coordinates in an inconsistent order between the x's and the y's when finding slope — this silently flips the sign.",
          "Forgetting to take the square root at the end of the distance formula and reporting the sum of squares instead.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A line passes through (1, 4) and (3, -2). Find its slope, and determine whether the line 6x + 4y = 8 is parallel, perpendicular, or neither to it.",
        answer:
          "Neither. The slope through (1,4) and (3,-2) is (-2-4)/(3-1) = -3. Rewriting 6x+4y=8 as y = -1.5x + 2 gives slope -3/2, which is neither equal to -3 (not parallel) nor equal to 1/3 (not perpendicular, since the negative reciprocal of -3 is 1/3).",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Distance formula comes straight from the Pythagorean theorem applied to horizontal and vertical differences.",
          "Midpoint is the average of the x-coordinates and the average of the y-coordinates.",
          "Equal slopes mean parallel lines; slopes multiplying to -1 mean perpendicular lines.",
        ],
      },
    ],
  },
  {
    slug: "transformations-video",
    title: "Transformations in the Plane",
    topicSlug: "transformations",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "Coordinate rules for translations, reflections, rotations, and dilations, chained together across multi-step problems.",
    scenes: [
      {
        type: "title",
        heading: "Transformations in the Plane",
        sub: "Every transformation has a simple coordinate rule — memorize them and multi-step transformation problems become quick arithmetic.",
      },
      {
        type: "text",
        heading: "Rigid motions",
        bullets: [
          "Translation: (x,y) → (x+a, y+b).",
          "Reflection across the x-axis: (x,y) → (x,-y). Across the y-axis: (x,y) → (-x,y).",
          "Rotation 90° counterclockwise about the origin: (x,y) → (-y,x). Rotation 180°: (x,y) → (-x,-y).",
        ],
      },
      {
        type: "text",
        heading: "Dilations",
        bullets: [
          "Dilation about the origin with scale factor k: (x,y) → (kx, ky).",
          "Every length in the figure scales by k; every area scales by k².",
          "k > 1 enlarges the figure; 0 < k < 1 shrinks it.",
        ],
      },
      {
        type: "example",
        heading: "Chaining transformations",
        prompt:
          "Point A = (3, -1). Reflect A across the x-axis, then rotate the result 90° counterclockwise about the origin, then dilate by factor 3 about the origin. Find the final point.",
        bullets: [
          "Reflect across the x-axis: (3,-1) → (3, 1).",
          "Rotate 90° counterclockwise using (x,y) → (-y,x): (3,1) → (-1, 3).",
          "Dilate by factor 3 about the origin: (-1,3) → (-3, 9).",
        ],
      },
      {
        type: "strategy",
        heading: "Handling multi-step transformations",
        bullets: [
          "Apply transformations one at a time, in the exact order given — the order changes the final answer.",
          "Memorize the coordinate rules for 90°, 180°, and 270° rotations and for reflections across the x-axis, y-axis, and line y=x.",
          "For dilation, apply the scale factor to both coordinates at once; the center only matters if it isn't the origin.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Applying transformations in the wrong order — rotating then reflecting is not the same as reflecting then rotating.",
          "Using the 90° clockwise rule (x,y) → (y,-x) when the problem asked for counterclockwise (x,y) → (-y,x), or vice versa.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Point B = (-4, 2) is rotated 180° about the origin, then reflected across the y-axis. Find the final point.",
        answer:
          "(-4, -2). Rotating 180° sends (-4,2) to (4,-2); reflecting (4,-2) across the y-axis sends it to (-4,-2).",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Translations, reflections, and rotations preserve size and shape; dilations change size by a scale factor k.",
          "Coordinate rules let you compute transformed points directly without redrawing the figure.",
          "Order matters when chaining multiple transformations together.",
        ],
      },
    ],
  },
  {
    slug: "polygons-video",
    title: "Polygon Angle Sums & Diagonals",
    topicSlug: "polygons",
    difficulty: 6,
    durationMinutes: 7,
    summary:
      "Interior and exterior angle sums, regular polygon angles, and counting diagonals with a single formula.",
    scenes: [
      {
        type: "title",
        heading: "Polygon Angle Sums & Diagonals",
        sub: "Every convex polygon's angles and diagonals follow fixed formulas based only on its number of sides.",
      },
      {
        type: "text",
        heading: "Interior angles",
        bullets: [
          "The interior angles of any convex n-gon sum to (n-2) × 180°.",
          "For a regular n-gon, each interior angle measures (n-2) × 180° / n.",
        ],
      },
      {
        type: "text",
        heading: "Exterior angles and diagonals",
        bullets: [
          "The exterior angles of any convex polygon, one per vertex, always sum to 360°.",
          "For a regular n-gon, each exterior angle measures 360° / n.",
          "The number of diagonals in an n-gon is n(n-3)/2.",
        ],
      },
      {
        type: "example",
        heading: "A regular polygon from its angle",
        prompt:
          "A regular polygon has an interior angle of 150°. How many sides does it have, and how many diagonals?",
        bullets: [
          "Exterior angle = 180° - 150° = 30°.",
          "Number of sides n = 360° / 30° = 12 (a regular dodecagon).",
          "Diagonals = n(n-3)/2 = 12(9)/2 = 54.",
        ],
      },
      {
        type: "strategy",
        heading: "Working backward from one angle",
        bullets: [
          "Given an interior angle of a regular polygon, subtract from 180° to get the exterior angle, then divide 360° by that to find n.",
          "For diagonals, apply n(n-3)/2 directly rather than trying to count them by drawing, which gets error-prone past hexagons.",
          "Remember the 360° exterior-angle-sum rule only applies to convex polygons traced consistently in one rotational direction.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Using n instead of (n-2) in the interior angle sum formula, or forgetting to divide by n when finding a single interior angle of a regular polygon.",
          "Applying the 360° exterior-angle-sum rule to a non-convex (concave) polygon, where it does not hold.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A convex polygon has 9 diagonals. How many sides does it have?",
        answer:
          "6 sides (a hexagon). Solving n(n-3)/2 = 9 gives n² - 3n - 18 = 0, which factors as (n-6)(n+3) = 0, so n = 6.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Interior angle sum = (n-2) × 180°; exterior angles of a convex polygon always sum to 360°.",
          "A regular polygon's exterior angle, 360°/n, is often the fastest route to finding n.",
          "Diagonal count = n(n-3)/2.",
        ],
      },
    ],
  },

  {
    slug: "prime-factorization-basics",
    title: "Prime Factorization",
    topicSlug: "factorization",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "Every integer greater than 1 breaks down into a unique product of primes — the single fact behind gcd, lcm, and nearly every divisor-counting trick.",
    scenes: [
      {
        type: "title",
        heading: "Prime Factorization",
        sub: "The Fundamental Theorem of Arithmetic: every integer greater than 1 has exactly one prime factorization, up to reordering.",
      },
      {
        type: "text",
        heading: "Building the factorization",
        bullets: [
          "Divide repeatedly by the smallest prime that fits, starting with 2, then 3, 5, 7, and so on.",
          "Keep dividing by the same prime until it no longer divides evenly, then move to the next prime.",
          "Stop once the running quotient itself becomes 1 — every prime factor has been pulled out.",
          "Write the result as a product of prime powers, like 360 = 2³ · 3² · 5¹.",
        ],
      },
      {
        type: "example",
        heading: "Factoring 360",
        prompt: "Find the prime factorization of 360.",
        bullets: [
          "360 ÷ 2 = 180, 180 ÷ 2 = 90, 90 ÷ 2 = 45 — three 2's pulled out, 45 is odd so 2 stops here.",
          "45 ÷ 3 = 15, 15 ÷ 3 = 5 — two 3's pulled out, 5 is not divisible by 3.",
          "5 ÷ 5 = 1 — one 5 pulled out, quotient reaches 1.",
          "360 = 2³ · 3² · 5¹.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "360 = 2 · 180" },
            { expr: "180 = 2 · 90" },
            { expr: "90 = 2 · 45" },
            { expr: "45 = 3 · 15" },
            { expr: "15 = 3 · 5" },
            { expr: "360 = 2³ · 3² · 5", note: "collect the prime factors" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Working fast and clean",
        bullets: [
          "Only test primes up to √n — if no prime up to √n divides n, n itself is prime.",
          "Check divisibility by 2, 3, 5, 11 using their quick digit-based rules before resorting to long division.",
          "For very composite-looking numbers (round numbers like 360, 720, 1000), try pulling out factors of 10 first to simplify.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Stopping the division process too early and leaving a composite number labeled as if it were prime — always double-check the last factor is actually prime.",
          "Forgetting to track how many times a prime divides in, which undercounts the exponent in the final factorization.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Find the prime factorization of 504.",
        answer:
          "504 = 2³ · 3² · 7. (504 ÷ 2 = 252 ÷ 2 = 126 ÷ 2 = 63, then 63 ÷ 3 = 21 ÷ 3 = 7, then 7 ÷ 7 = 1.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Every integer greater than 1 has exactly one prime factorization.",
          "Build it by dividing out primes in increasing order until the quotient reaches 1.",
          "You only need to test primes up to √n to confirm a number is prime.",
        ],
      },
    ],
  },
  {
    slug: "gcd-lcm-euclidean-algorithm",
    title: "GCD & LCM with the Euclidean Algorithm",
    topicSlug: "integer-properties",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "The Euclidean algorithm finds the gcd of two numbers in just a few division steps, and the lcm follows for free from a single identity.",
    scenes: [
      {
        type: "title",
        heading: "GCD & LCM",
        sub: "gcd(a, b) · lcm(a, b) = a · b — one identity connects the two most useful functions in number theory.",
      },
      {
        type: "text",
        heading: "The Euclidean algorithm",
        bullets: [
          "To find gcd(a, b), divide the larger by the smaller and take the remainder.",
          "Replace the larger number with that remainder and repeat.",
          "Stop when the remainder hits 0 — the last nonzero remainder is the gcd.",
          "Once you have the gcd, lcm(a, b) = (a · b) / gcd(a, b).",
        ],
      },
      {
        type: "example",
        heading: "Finding gcd and lcm of 48 and 18",
        prompt: "Find gcd(48, 18) and lcm(48, 18).",
        bullets: [
          "48 = 2(18) + 12",
          "18 = 1(12) + 6",
          "12 = 2(6) + 0 — remainder hits 0, so gcd(48, 18) = 6.",
          "lcm(48, 18) = (48 · 18) / 6 = 864 / 6 = 144.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "48 = 2·18 + 12" },
            { expr: "18 = 1·12 + 6" },
            { expr: "12 = 2·6 + 0", note: "gcd = 6" },
            { expr: "lcm = 48·18 / 6 = 144" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "When to use which tool",
        bullets: [
          "Use the Euclidean algorithm for two numbers, especially large or awkward ones — it's faster than factoring.",
          "Use prime factorization instead when you need the gcd or lcm across three or more numbers, since the a·b/gcd shortcut only works for pairs.",
          "If a problem hands you both the gcd and the product ab, jump straight to lcm = ab/gcd rather than recomputing from scratch.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Stopping the Euclidean algorithm one step early and reporting the second-to-last remainder instead of the last nonzero one.",
          "Trying to apply gcd·lcm = ab to three or more numbers at once — that identity only holds for exactly two.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Find gcd(30, 42) and lcm(30, 42).",
        answer:
          "gcd(30, 42) = 6 and lcm(30, 42) = 210. (42 = 1·30+12, 30 = 2·12+6, 12 = 2·6+0, so gcd = 6; lcm = 30·42/6 = 1260/6 = 210.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "The Euclidean algorithm finds gcd(a, b) in a handful of division steps.",
          "lcm(a, b) = (a · b) / gcd(a, b), but only for exactly two numbers.",
          "For three or more numbers, factor into primes and take min/max exponents instead.",
        ],
      },
    ],
  },
  {
    slug: "converting-number-bases",
    title: "Base Representations",
    topicSlug: "number-patterns",
    difficulty: 4,
    durationMinutes: 7,
    summary:
      "The same integer looks completely different written in base 2, base 6, or base 10 — but the repeated-division method converts cleanly between any of them.",
    scenes: [
      {
        type: "title",
        heading: "Base Representations",
        sub: "A base-b numeral is a sum of digits times powers of b. Change the base, change the digits, but not the underlying quantity.",
      },
      {
        type: "text",
        heading: "Converting between bases",
        bullets: [
          "Decimal to base b: divide repeatedly by b, record each remainder, then read the remainders bottom to top.",
          "Base b to decimal: multiply each digit by its place value (b⁰, b¹, b², …) starting from the rightmost digit, then sum.",
          "Every digit in a base-b numeral must satisfy 0 ≤ digit < b — a base-8 numeral can never contain an 8 or 9.",
        ],
      },
      {
        type: "example",
        heading: "Converting 91 to binary",
        prompt: "Write 91 (base 10) in base 2.",
        bullets: [
          "91 ÷ 2 = 45 remainder 1",
          "45 ÷ 2 = 22 remainder 1",
          "22 ÷ 2 = 11 remainder 0",
          "11 ÷ 2 = 5 remainder 1",
          "5 ÷ 2 = 2 remainder 1",
          "2 ÷ 2 = 1 remainder 0",
          "1 ÷ 2 = 0 remainder 1",
          "Reading remainders bottom to top: 91 = 1011011 in base 2. Check: 64+16+8+2+1 = 91.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "91 = 2·45 + 1" },
            { expr: "45 = 2·22 + 1" },
            { expr: "22 = 2·11 + 0" },
            { expr: "11 = 2·5 + 1" },
            { expr: "5 = 2·2 + 1" },
            { expr: "2 = 2·1 + 0" },
            { expr: "1 = 2·0 + 1" },
            { expr: "91 = 1011011₂", note: "read remainders bottom to top" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Working efficiently",
        bullets: [
          "Set up a clean two-column division table (quotient, remainder) so you never lose track of the order.",
          "When converting back to decimal, write the place values above the digits before multiplying — it prevents exponent misalignment.",
          "For binary specifically, it's often faster to subtract the largest power of 2 that fits, repeatedly, than to do long division.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Reading the remainders in computed order instead of reversing them, which flips the digit order.",
          "Using a digit that's too large for the base — remember digits run from 0 to b−1, never up to b.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Convert 58 (base 10) to base 5.",
        answer:
          "213 in base 5. (58 ÷ 5 = 11 r3, 11 ÷ 5 = 2 r1, 2 ÷ 5 = 0 r2; reading bottom to top gives 213₅. Check: 2·25 + 1·5 + 3 = 58.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Decimal to base b: repeated division, read remainders bottom to top.",
          "Base b to decimal: multiply digits by place values b⁰, b¹, b², … and sum.",
          "Valid digits in base b always satisfy 0 ≤ digit < b.",
        ],
      },
    ],
  },
  {
    slug: "solving-linear-diophantine-equations",
    title: "Diophantine Equations",
    topicSlug: "diophantine-equations",
    difficulty: 6,
    durationMinutes: 8,
    summary:
      "ax + by = c has integer solutions exactly when gcd(a, b) divides c — and once it does, one particular solution unlocks the entire infinite family.",
    scenes: [
      {
        type: "title",
        heading: "Linear Diophantine Equations",
        sub: "ax + by = c has an integer solution if and only if gcd(a, b) divides c. When it does, every solution follows a simple pattern.",
      },
      {
        type: "text",
        heading: "The solvability condition and general solution",
        bullets: [
          "Every value of ax + by is automatically a multiple of g = gcd(a, b), so if g does not divide c, there is no integer solution at all.",
          "If g divides c, divide the whole equation by g to get coprime coefficients, then find one particular solution (x₀, y₀).",
          "The full solution family is x = x₀ + (b/g)t and y = y₀ − (a/g)t for any integer t — this covers every solution, no more and no fewer.",
        ],
      },
      {
        type: "example",
        heading: "Solving 15x + 24y = 39",
        prompt: "Find all integer solutions to 15x + 24y = 39.",
        bullets: [
          "gcd(15, 24) = 3, and 3 divides 39, so solutions exist.",
          "Divide by 3: 5x + 8y = 13.",
          "Try x = 1: 5 + 8y = 13, so y = 1. Particular solution: (1, 1).",
          "General solution: x = 1 + 8t, y = 1 − 5t.",
          "Check t = 1: x = 9, y = −4, and 15(9) + 24(−4) = 135 − 96 = 39. Correct.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "gcd(15,24) = 3, 3 | 39", note: "solvable" },
            { expr: "15x+24y=39 → 5x+8y=13", note: "divide by gcd" },
            { expr: "x=1, y=1", note: "particular solution" },
            { expr: "x = 1+8t, y = 1-5t", note: "general solution" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Working through it fast",
        bullets: [
          "Check gcd(a,b) | c first — if it fails, you can immediately declare no solutions and stop.",
          "Always reduce by the gcd before hunting for a particular solution; the coprime coefficients make guess-and-check much faster.",
          "If the problem restricts x and y to a range (like positive integers only), plug the general solution into the inequalities to count how many valid values of t exist.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Searching for a particular solution using the original (un-reduced) coefficients instead of dividing by the gcd first.",
          "Flipping the signs or coefficients in the general solution formula — it's x₀ + (b/g)t and y₀ − (a/g)t, and a sign error produces a family that fails the original equation.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Find one integer solution to 9x + 15y = 12.",
        answer:
          "(x, y) = (3, -1) works: 9(3) + 15(-1) = 27 - 15 = 12. (gcd(9,15) = 3 divides 12, so solutions exist; reducing gives 3x + 5y = 4, and x=3, y=-1 satisfies it.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "ax + by = c has integer solutions exactly when gcd(a, b) divides c.",
          "Divide by the gcd, find one particular solution, then generate the rest with x = x₀ + (b/g)t, y = y₀ − (a/g)t.",
          "Range restrictions on x or y translate directly into bounds on the parameter t.",
        ],
      },
    ],
  },
  {
    slug: "divisor-sum-and-totient-functions",
    title: "Number-Theoretic Functions",
    topicSlug: "primes",
    difficulty: 6,
    durationMinutes: 8,
    summary:
      "d(n), σ(n), and φ(n) all fall out of a single prime factorization — three formulas that turn one factoring step into three answers.",
    scenes: [
      {
        type: "title",
        heading: "Number-Theoretic Functions",
        sub: "Once you have the prime factorization of n, the number of divisors, sum of divisors, and count of coprime integers all follow from direct formulas.",
      },
      {
        type: "text",
        heading: "Three formulas from one factorization",
        bullets: [
          "If n = p₁^a₁ · p₂^a₂ · … · pₖ^aₖ, then d(n) = (a₁+1)(a₂+1)…(aₖ+1) counts the divisors.",
          "σ(n) = ∏ (pᵢ^(aᵢ+1) − 1)/(pᵢ − 1) sums the divisors, using the geometric series for each prime.",
          "φ(n) = n · ∏ (1 − 1/pᵢ), taken over distinct primes only, counts integers up to n coprime to n.",
          "All three functions are multiplicative: f(mn) = f(m)f(n) whenever gcd(m, n) = 1.",
        ],
      },
      {
        type: "example",
        heading: "Computing all three for n = 360",
        prompt: "Find d(360), σ(360), and φ(360).",
        bullets: [
          "360 = 2³ · 3² · 5¹.",
          "d(360) = (3+1)(2+1)(1+1) = 4 · 3 · 2 = 24.",
          "σ(360) = (2⁴−1)/(2−1) · (3³−1)/(3−1) · (5²−1)/(5−1) = 15 · 13 · 6 = 1170.",
          "φ(360) = 360 · (1/2) · (2/3) · (4/5) = 96.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "360 = 2³·3²·5" },
            { expr: "d(360) = 4·3·2 = 24" },
            { expr: "σ(360) = 15·13·6 = 1170" },
            { expr: "φ(360) = 360·(1/2)(2/3)(4/5) = 96" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Applying the formulas cleanly",
        bullets: [
          "Always fully factor n before touching any of these formulas — none of them can be computed from n directly.",
          "Keep the formulas distinct in your head: d(n) adds 1 to each exponent, σ(n) uses a geometric-series ratio per prime, φ(n) multiplies n by (1 − 1/p) per distinct prime.",
          "If a problem gives you d(n), σ(n), or φ(n) and asks for n, work backward from what exponent combinations could produce that value rather than guessing numbers directly.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Using a repeated prime factor more than once in the φ(n) product — each distinct prime appears exactly once regardless of its exponent.",
          "Confusing the σ(n) geometric-series formula with the simpler d(n) exponent-counting formula, especially under time pressure.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Find d(72), σ(72), and φ(72).",
        answer:
          "d(72) = 12, σ(72) = 195, φ(72) = 24. (72 = 2³·3²; d = 4·3 = 12; σ = 15·13 = 195; φ = 72·(1/2)·(2/3) = 24.)",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Factor n into primes first — everything else follows from that one step.",
          "d(n), σ(n), and φ(n) each have a direct formula from the exponents and prime bases.",
          "All three functions are multiplicative for coprime arguments, which is why the per-prime formulas can be combined by multiplying.",
        ],
      },
    ],
  },

  {
    slug: "permutations-arrangements-that-repeat",
    title: "Permutations",
    topicSlug: "permutations",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Permutations count arrangements where order matters, and the formula adjusts cleanly when some items repeat.",
    scenes: [
      {
        type: "title",
        heading: "Permutations",
        sub: "When the order of a selection matters, you're counting permutations, not combinations.",
      },
      {
        type: "text",
        heading: "Order matters",
        bullets: [
          "A permutation is an arrangement of items where the order counts as different outcomes.",
          "Arranging n distinct items in a row: n! = n · (n-1) · (n-2) · ... · 1 ways.",
          "Choosing and arranging r items out of n: P(n, r) = n! / (n - r)!.",
        ],
      },
      {
        type: "text",
        heading: "Permutations with repeats",
        bullets: [
          "If some items are identical, swapping two identical items doesn't create a new arrangement.",
          "Divide by the factorial of each repeated group's size: n! / (a! · b! · ...).",
          "Example: the letters of a word with repeated letters use this exact adjustment.",
        ],
      },
      {
        type: "example",
        heading: "Awarding medals",
        prompt:
          "In how many ways can gold, silver, and bronze medals be awarded among 8 runners?",
        bullets: [
          "Order matters here — gold, silver, and bronze are distinct positions.",
          "Use P(8, 3) = 8 · 7 · 6 = 336.",
          "There are 336 possible ways to award the three medals.",
        ],
        diagram: {
          kind: "countingTree",
          root: "8 runners",
          branches: [
            {
              label: "Gold: 8 choices",
              children: [
                {
                  label: "Silver: 7 choices",
                  children: [{ label: "Bronze: 6 choices" }],
                },
              ],
            },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Spotting order-sensitive problems",
        bullets: [
          "Ask: if I swap two selected items, is the outcome different? If yes, it's a permutation.",
          "For repeated items (like letters in a word), count total letters, then divide by the factorial of each letter's repeat count.",
          "Break P(n, r) into the product n · (n-1) · ... · (n - r + 1) if factorials feel unwieldy.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Using n! when only r of the n items are actually being arranged — that overcounts by (n-r)!.",
          "Forgetting to divide by repeated-letter factorials, which overcounts identical-looking arrangements as distinct.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "How many distinct arrangements are there of the letters in the word PEPPER?",
        answer:
          "60. PEPPER has 6 letters with P repeated 3 times and E repeated 2 times, so the count is 6! / (3! · 2!) = 720 / 12 = 60.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Permutations count arrangements where order matters: P(n, r) = n! / (n - r)!.",
          "When items repeat, divide by the factorial of each repeat count to remove duplicate orderings.",
        ],
      },
    ],
  },
  {
    slug: "casework-splitting-into-cases",
    title: "Casework",
    topicSlug: "casework",
    difficulty: 5,
    durationMinutes: 7,
    summary:
      "Casework breaks a hard counting problem into simpler, non-overlapping pieces that can be added together.",
    scenes: [
      {
        type: "title",
        heading: "Casework",
        sub: "When one clean formula won't cover every scenario, split the problem into cases and add up the results.",
      },
      {
        type: "text",
        heading: "The addition principle",
        bullets: [
          "If a problem naturally splits into cases that are mutually exclusive and exhaustive, count each case separately and add.",
          "Mutually exclusive means no outcome belongs to two cases; exhaustive means every outcome belongs to some case.",
          "Casework often appears when a condition like 'at least' or 'exactly' forces different sub-scenarios.",
        ],
      },
      {
        type: "text",
        heading: "Choosing good cases",
        bullets: [
          "Pick a variable that naturally divides the problem, such as 'how many women are on the committee.'",
          "Make sure every case is computed with the same method (often combinations) applied to different fixed values.",
          "Simplify by working from the most restrictive case (like 'exactly the maximum amount') outward.",
        ],
      },
      {
        type: "example",
        heading: "A committee with a minimum",
        prompt:
          "A committee of 4 is chosen from 5 men and 4 women, with at least 3 women on the committee. How many ways can this happen?",
        bullets: [
          "Case 1: exactly 3 women and 1 man: C(4,3) · C(5,1) = 4 · 5 = 20.",
          "Case 2: exactly 4 women and 0 men: C(4,4) · C(5,0) = 1 · 1 = 1.",
          "Total: 20 + 1 = 21 ways.",
        ],
      },
      {
        type: "strategy",
        heading: "Setting up cases cleanly",
        bullets: [
          "Write out every case explicitly before computing anything, so you can check they're exhaustive.",
          "Use a table: one row per case, with the count for each group being chosen.",
          "Add the case totals only after confirming no outcome could satisfy two cases at once.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Missing a case entirely — for 'at least 3,' remembering only 'exactly 3' and forgetting 'exactly 4' (or more).",
          "Creating overlapping cases that double-count the same outcome, which requires subtracting the overlap or redefining the cases.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A 5-person team is chosen from 6 boys and 4 girls, with at least 2 girls on the team. How many ways can this happen?",
        answer:
          "186. Case 2 girls/3 boys: C(4,2)·C(6,3) = 6·20 = 120. Case 3 girls/2 boys: C(4,3)·C(6,2) = 4·15 = 60. Case 4 girls/1 boy: C(4,4)·C(6,1) = 1·6 = 6. Total: 120 + 60 + 6 = 186.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Casework splits a problem into mutually exclusive, exhaustive scenarios and adds their counts.",
          "Always double-check that every case is covered and that no two cases overlap.",
        ],
      },
    ],
  },
  {
    slug: "combinations-order-doesnt-matter",
    title: "Combinations",
    topicSlug: "combinations",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "Combinations count unordered selections, and dividing out the redundant orderings is the key idea behind the formula.",
    scenes: [
      {
        type: "title",
        heading: "Combinations",
        sub: "When order doesn't matter — picking a group, not arranging it — you need combinations.",
      },
      {
        type: "text",
        heading: "Counting unordered groups",
        bullets: [
          "A combination is a selection of k items from n where order doesn't matter.",
          "The formula is C(n, k) = n! / (k! · (n - k)!).",
          "C(n, k) counts groups; if order mattered, you'd use the larger permutation count P(n, k) = n!/(n-k)! instead.",
        ],
      },
      {
        type: "text",
        heading: "Where combinations show up",
        bullets: [
          "Choosing committees, teams, or subsets with no distinct roles.",
          "Counting handshakes, pairs, or unordered pairings within a group.",
          "The symmetry rule C(n, k) = C(n, n - k): choosing who's in is the same as choosing who's left out.",
        ],
      },
      {
        type: "example",
        heading: "Forming a committee",
        prompt:
          "A club has 7 members. How many different 3-person committees can be formed?",
        bullets: [
          "Order doesn't matter — a committee is just a group, not a ranked list.",
          "C(7, 3) = 7! / (3! · 4!) = (7 · 6 · 5) / (3 · 2 · 1) = 210 / 6 = 35.",
          "There are 35 possible committees.",
        ],
      },
      {
        type: "strategy",
        heading: "Deciding combination vs. permutation",
        bullets: [
          "Ask whether swapping two chosen items changes the outcome — if not, it's a combination.",
          "It can help to compute the ordered count n!/(n-k)! first, then divide by k! to remove the extra orderings.",
          "Use the symmetry identity C(n, k) = C(n, n-k) to simplify awkward numbers, like turning C(8,5) into C(8,3).",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting to divide by k!, which leaves you with a permutation count instead of a combination count.",
          "Mixing up n and k when reading a problem — always double-check which number is the total pool and which is the group size.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "From a group of 8 friends, how many ways can you choose 5 to go on a trip?",
        answer:
          "56. C(8, 5) = C(8, 3) = 8! / (3! · 5!) = (8 · 7 · 6) / (3 · 2 · 1) = 336 / 6 = 56.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Combinations count unordered selections: C(n, k) = n! / (k!(n-k)!).",
          "Use the symmetry identity C(n, k) = C(n, n-k) to simplify calculations when convenient.",
        ],
      },
    ],
  },
  {
    slug: "binomial-theorem-finding-coefficients",
    title: "Binomial Theorem",
    topicSlug: "combinations",
    difficulty: 6,
    durationMinutes: 8,
    summary:
      "The binomial theorem expands (a+b)^n term by term using combinations, letting you pull out any single coefficient without full expansion.",
    scenes: [
      {
        type: "title",
        heading: "The Binomial Theorem",
        sub: "Expand (a + b)^n instantly, or grab just one term, using combinations as coefficients.",
      },
      {
        type: "text",
        heading: "The formula",
        bullets: [
          "(a + b)^n = the sum, over k = 0 to n, of C(n, k) · a^(n-k) · b^k.",
          "Each term's coefficient C(n, k) counts how many of the n factors contribute a 'b' rather than an 'a'.",
          "The exponents on a and b in every term always add to n.",
        ],
      },
      {
        type: "text",
        heading: "Useful special cases",
        bullets: [
          "Setting a = b = 1 gives 2^n as the sum of all the row's binomial coefficients.",
          "Setting a = 1, b = -1 gives an alternating sum of coefficients that equals 0 for any n ≥ 1.",
          "The coefficients C(n, 0), C(n, 1), ..., C(n, n) are exactly row n of Pascal's triangle.",
        ],
      },
      {
        type: "example",
        heading: "Pulling out one term",
        prompt: "Find the coefficient of x^3 in the expansion of (x + 3)^5.",
        bullets: [
          "Here a = x, b = 3, n = 5; the x^3 term needs the exponent on a to be 3, so n - k = 3, giving k = 2.",
          "That term is C(5, 2) · x^3 · 3^2 = 10 · x^3 · 9 = 90x^3.",
          "The coefficient is 90.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "(x+3)^5 term: C(5,2)·x^3·3^2",
              note: "k = 2 gives exponent 3 on x",
            },
            { expr: "10 · 9 = 90", note: "coefficient of x^3" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Finding a target term fast",
        bullets: [
          "Solve for the value of k that produces the exponent you want on the variable of interest, then evaluate only that one term.",
          "Always raise the entire second term — including its coefficient and sign — to the power k, not just its variable part.",
          "Use Pascal's triangle to double-check small coefficients like C(4,2) or C(5,2) quickly.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting to raise a coefficient like the 2 in (2x)^k, only exponentiating the variable and leaving the constant unchanged.",
          "Swapping which exponent belongs to a and which belongs to b, which silently changes the answer.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "What is the coefficient of x^2 in the expansion of (2x - 1)^4?",
        answer:
          "24. With a = 2x, b = -1, n = 4, the x^2 term needs n - k = 2, so k = 2: C(4,2)·(2x)^2·(-1)^2 = 6 · 4x^2 · 1 = 24x^2, so the coefficient is 24.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "The binomial theorem expands (a+b)^n as a sum of C(n,k)·a^(n-k)·b^k terms.",
          "To find one coefficient without full expansion, solve for the k that gives the exponent you need.",
        ],
      },
    ],
  },
  {
    slug: "pigeonhole-principle-worst-case-guarantees",
    title: "Pigeonhole Principle",
    topicSlug: "pigeonhole",
    difficulty: 5,
    durationMinutes: 6,
    summary:
      "The pigeonhole principle guarantees a repeat or a minimum grouping whenever more items than containers are distributed, by reasoning through the worst case.",
    scenes: [
      {
        type: "title",
        heading: "The Pigeonhole Principle",
        sub: "More pigeons than holes always forces at least one hole to hold more than one pigeon.",
      },
      {
        type: "text",
        heading: "The basic idea",
        bullets: [
          "If n items are placed into m containers and n > m, at least one container holds at least 2 items.",
          "The generalized version: distributing n items into m containers forces some container to hold at least ⌈n/m⌉ items.",
          "These are 'guarantee' problems — the answer must hold no matter how the items are distributed.",
        ],
      },
      {
        type: "text",
        heading: "Setting it up",
        bullets: [
          "Identify what plays the role of 'pigeons' (the items) and what plays the role of 'holes' (the categories).",
          "Always reason from the worst-case distribution: how many items can be spread out with no repeats before one is forced?",
          "The guarantee threshold is always one more than the maximum repeat-free count.",
        ],
      },
      {
        type: "example",
        heading: "Guaranteeing a matching sock",
        prompt:
          "A drawer has socks in 4 colors, mixed in the dark. How many socks must you pull to guarantee a matching pair?",
        bullets: [
          "There are 4 colors, so think of 4 holes.",
          "Pulling 4 socks could give one of each color in the worst case — no match yet.",
          "The 5th sock must repeat a color already drawn, so the answer is 5.",
        ],
      },
      {
        type: "strategy",
        heading: "Working the worst case",
        bullets: [
          "Compute the maximum number of items that can be placed with zero repeats — that's (number of holes) in the simplest version.",
          "Add 1 to that maximum to get the guarantee threshold for at least one repeat.",
          "For 'at least k in one hole' problems, use ⌈n/m⌉ ≥ k and solve for the smallest valid n.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Reasoning about an average or typical case instead of the true worst case, which understates the guarantee.",
          "Off-by-one errors — forgetting the guarantee needs one more item than the maximum repeat-free count, not the number of holes itself.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "40 students each take exactly one of 6 language electives. What is the minimum number of students guaranteed to be in the same elective?",
        answer:
          "7. If each of the 6 electives had at most 6 students, that covers only 36 students. With 40 students, at least one elective must have at least ⌈40/6⌉ = 7 students.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "The pigeonhole principle guarantees a repeat when there are more items than containers.",
          "Always reason from the worst-case distribution, then add one (or use the ceiling formula) to find the guarantee.",
        ],
      },
    ],
  },
  {
    slug: "recursive-counting-tiling-staircases",
    title: "Recursive Counting",
    topicSlug: "recursion-in-counting",
    difficulty: 7,
    durationMinutes: 8,
    summary:
      "Recursive counting builds the answer for size n from the answers for smaller sizes, turning hard problems into a simple step-by-step buildup.",
    scenes: [
      {
        type: "title",
        heading: "Recursive Counting",
        sub: "When there's no clean formula, build the count for n from the counts for smaller cases.",
      },
      {
        type: "text",
        heading: "The recursive idea",
        bullets: [
          "Define f(n) as the quantity you want to count for a problem of size n.",
          "Find base cases (usually f(1) and f(2)) by direct, hands-on counting.",
          "Find a recurrence relating f(n) to earlier terms, typically by casing on the last step of the construction.",
        ],
      },
      {
        type: "text",
        heading: "Where recursion shows up",
        bullets: [
          "Tiling a strip with tiles of different lengths (Fibonacci-style recurrences).",
          "Climbing a staircase taking 1 or 2 steps at a time.",
          "Sequences built one element at a time subject to a local restriction on neighboring elements.",
        ],
      },
      {
        type: "example",
        heading: "Tiling a strip",
        prompt:
          "How many ways can you tile a 1×6 board using only 1×1 tiles and 1×2 tiles?",
        bullets: [
          "Let f(n) be the number of ways to tile a 1×n board. Case on the last tile placed.",
          "If it's a 1×1 tile, the rest is a 1×(n-1) board: f(n-1) ways. If it's a 1×2 tile, the rest is a 1×(n-2) board: f(n-2) ways.",
          "So f(n) = f(n-1) + f(n-2), with f(1) = 1, f(2) = 2. Building up: f(3)=3, f(4)=5, f(5)=8, f(6)=13.",
        ],
      },
      {
        type: "strategy",
        heading: "Finding the recurrence",
        bullets: [
          "Case on the last (or first) piece of the construction — this naturally reduces to smaller versions of the same problem.",
          "Always verify the recurrence against the base cases and the first couple of computed terms by hand.",
          "Once the recurrence is trusted, just iterate upward rather than searching for a closed-form formula.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Getting a base case wrong (especially f(1) or f(2)), which throws off every later term in the buildup.",
          "Casing on the last step in a way that double-counts or misses a possibility, so the cases aren't truly exhaustive and mutually exclusive.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A staircase has 7 steps, and you can climb 1 or 2 steps at a time. In how many ways can you reach the top?",
        answer:
          "21. Let f(n) be the ways to climb n steps: f(n) = f(n-1) + f(n-2), with f(1)=1, f(2)=2. Then f(3)=3, f(4)=5, f(5)=8, f(6)=13, f(7)=21.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Recursive counting expresses f(n) in terms of smaller f(n-1), f(n-2), ... by casing on the last step.",
          "Always nail down the base cases and verify the recurrence on the first few terms before trusting it.",
        ],
      },
    ],
  },

  {
    slug: "conditional-probability-in-depth",
    title: "Conditional Probability",
    topicSlug: "conditional-probability",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Conditional probability answers 'given this happened, what's the chance of that?' — the key to solving problems with dependent events.",
    scenes: [
      {
        type: "title",
        heading: "Conditional Probability",
        sub: "Once you know part of the outcome, the sample space shrinks. Conditional probability tells you how the odds change.",
      },
      {
        type: "text",
        heading: "The formula",
        bullets: [
          "P(A | B) means the probability that A happens, given that B has already happened.",
          "Formula: P(A | B) = P(A and B) / P(B), as long as P(B) > 0.",
          "Conditioning on B shrinks the sample space down to just the outcomes where B is true.",
          "Two events are independent exactly when P(A | B) = P(A), meaning knowing B tells you nothing about A.",
        ],
      },
      {
        type: "text",
        heading: "Reading conditional probability from data",
        bullets: [
          "With a table or Venn diagram, P(A | B) is just (outcomes in both A and B) divided by (outcomes in B) — ignore everything outside B entirely.",
          "Order matters: P(A | B) is generally not equal to P(B | A). Mixing these up is the most common conditional probability error.",
          "For dependent draws without replacement, the probability of the second event depends on what the first draw removed from the pool.",
        ],
      },
      {
        type: "example",
        heading: "Marbles without replacement",
        prompt:
          "A bag has 5 red marbles and 3 blue marbles. Two marbles are drawn without replacement. Given that the first marble drawn is red, what is the probability the second marble is also red?",
        bullets: [
          "After removing one red marble, the bag has 4 red and 3 blue marbles left, 7 total.",
          "P(second red | first red) = 4/7.",
          "Notice this differs from the unconditional probability computed before any draw, since the first draw changes the pool.",
        ],
        diagram: {
          kind: "bars",
          total: 8,
          segments: [
            { label: "Red marbles", value: 5, tone: "brand" },
            { label: "Blue marbles", value: 3, tone: "slate" },
          ],
          note: "Starting pool: 5 red, 3 blue (8 total).",
        },
      },
      {
        type: "strategy",
        heading: "Fast approach",
        bullets: [
          "Whenever you see 'given that...', immediately redefine your sample space to only the outcomes consistent with the given condition, then count fresh from there.",
          "For sequential events (draws, rolls, deals), track how each event changes the pool available for the next one before multiplying probabilities.",
          "If a problem gives you P(A and B) and P(B) separately, plug directly into P(A|B) = P(A and B)/P(B) rather than re-deriving the sample space by hand.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Confusing P(A|B) with P(B|A): 'probability it rains given it's cloudy' is not the same as 'probability it's cloudy given it rains.'",
          "Forgetting to shrink the denominator: once you condition on B, the total outcomes to divide by is the count of B, not the original full sample space.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A standard deck of 52 cards has 4 aces. Two cards are dealt without replacement. Given that the first card dealt is an ace, what is the probability the second card is also an ace?",
        answer:
          "3/51 = 1/17. After removing one ace, 3 aces remain among 51 cards.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "P(A|B) = P(A and B)/P(B); conditioning shrinks the sample space to just the outcomes satisfying B.",
          "For draws without replacement, recompute the pool after each draw before finding the next conditional probability.",
          "P(A|B) and P(B|A) are generally different — keep the order straight.",
        ],
      },
    ],
  },
  {
    slug: "expected-value-in-depth",
    title: "Expected Value",
    topicSlug: "expected-value",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Expected value distills a random outcome into a single number — the long-run average — and it's linear, which makes complex games solvable.",
    scenes: [
      {
        type: "title",
        heading: "Expected Value",
        sub: "Expected value is the long-run average outcome of a random process, weighted by probability.",
      },
      {
        type: "text",
        heading: "Definition",
        bullets: [
          "For a random variable X with outcomes x1, x2, ..., xn and probabilities p1, p2, ..., pn, E(X) = x1*p1 + x2*p2 + ... + xn*pn.",
          "Expected value doesn't have to be an achievable outcome itself — rolling a standard die has E(X) = 3.5, even though you can never roll a 3.5.",
          "Expected value is linear: E(aX + b) = aE(X) + b, and the expected value of a sum of random variables equals the sum of their expected values.",
        ],
      },
      {
        type: "text",
        heading: "Using expected value in games",
        bullets: [
          "A fair game has expected net value 0; a favorable game has positive expected value for the player.",
          "For a game with a cost to play, subtract the entry cost from the expected payout to get the expected net gain or loss.",
          "When a problem has multiple independent stages (like rolling a die twice), you can find the expected value of each stage separately and add them, instead of building the entire joint distribution.",
        ],
      },
      {
        type: "example",
        heading: "A simple carnival game",
        prompt:
          "A game costs $2 to play. You roll a fair six-sided die. If you roll a 6, you win $9. Otherwise, you win nothing. What is the expected net gain from playing?",
        bullets: [
          "P(roll a 6) = 1/6, P(no 6) = 5/6.",
          "Expected payout = 9*(1/6) + 0*(5/6) = 9/6 = 1.5 dollars.",
          "Expected net gain = expected payout minus cost = 1.5 - 2 = -0.5 dollars. On average, you lose 50 cents per play.",
        ],
      },
      {
        type: "strategy",
        heading: "Setting up expected value fast",
        bullets: [
          "List every distinct outcome and its probability first, then check the probabilities sum to 1 before doing any arithmetic — that catches most setup errors immediately.",
          "Use linearity to break a complicated random process into simple pieces: find E(X) for each piece, then add.",
          "For 'expected number of successes in n independent trials with probability p each', the shortcut E = n*p often replaces a long sum.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Treating expected value as 'the most likely outcome' — it's an average, not a mode, and it can even be a value the variable never takes.",
          "Forgetting to subtract the cost to play when a problem asks for net expected value rather than expected payout.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A spinner has 4 equal sections labeled 1, 2, 3, and 10. What is the expected value of one spin?",
        answer: "4. E(X) = (1+2+3+10)/4 = 16/4 = 4.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "E(X) is the probability-weighted average of all possible outcomes.",
          "Expected value is linear, so you can compute pieces separately and add them together.",
          "For a game with a cost, expected net gain = expected payout minus cost to play.",
        ],
      },
    ],
  },
  {
    slug: "probability-distributions-explained",
    title: "Probability Distributions",
    topicSlug: "counting-probability",
    difficulty: 6,
    durationMinutes: 7,
    summary:
      "A probability distribution assigns a probability to every possible outcome of a random variable — and the binomial distribution is the most common one on contests.",
    scenes: [
      {
        type: "title",
        heading: "Probability Distributions",
        sub: "A probability distribution lists every outcome of a random variable together with its probability — and the probabilities always sum to 1.",
      },
      {
        type: "text",
        heading: "What a distribution is",
        bullets: [
          "A discrete probability distribution assigns a probability to each possible value of a random variable; every probability is between 0 and 1, and all of them together sum to exactly 1.",
          "The distribution can be shown as a table, a bar chart, or a formula — all three describe the same underlying random process.",
          "Once you have the full distribution, you can compute anything about the variable: its expected value, its variance, or the probability of any range of outcomes.",
        ],
      },
      {
        type: "text",
        heading: "The binomial distribution",
        bullets: [
          "A binomial distribution arises from n independent trials, each with the same success probability p (like flipping a coin n times).",
          "The probability of exactly k successes is P(X = k) = C(n, k) * p^k * (1-p)^(n-k), where C(n,k) counts the ways to choose which k trials succeed.",
          "The expected number of successes in a binomial distribution is simply n*p, and this shortcut is faster than summing the full distribution.",
        ],
      },
      {
        type: "example",
        heading: "Exactly 3 heads in 5 flips",
        prompt:
          "A fair coin is flipped 5 times. What is the probability of getting exactly 3 heads?",
        bullets: [
          "This is binomial with n=5, p=1/2, k=3.",
          "C(5,3) = 10 ways to choose which 3 flips are heads.",
          "P(X=3) = C(5,3) * (1/2)^3 * (1/2)^2 = 10 * (1/8) * (1/4) = 10/32 = 5/16.",
        ],
        diagram: {
          kind: "bars",
          total: 32,
          segments: [
            { label: "0 heads", value: 1, tone: "slate" },
            { label: "1 head", value: 5, tone: "slate" },
            { label: "2 heads", value: 10, tone: "slate" },
            { label: "3 heads", value: 10, tone: "brand" },
            { label: "4 heads", value: 5, tone: "slate" },
            { label: "5 heads", value: 1, tone: "slate" },
          ],
          note: "Number of 5-flip sequences with each head count (out of 32 total sequences).",
        },
      },
      {
        type: "strategy",
        heading: "Recognizing a binomial setup",
        bullets: [
          "Check for three signatures: a fixed number of trials n, only two outcomes per trial (success/failure), and the same success probability p on every trial.",
          "When a problem asks for 'at least' or 'at most' k successes, it's often faster to compute the complement (1 minus the probabilities you don't want) than to add up several binomial terms.",
          "Memorize small binomial coefficients (rows of Pascal's triangle) so you can compute C(n,k) instantly for n up to 6 or 7.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Forgetting the C(n,k) counting factor and just computing p^k*(1-p)^(n-k) — this only gives the probability of one specific ordering, not all the ways k successes can occur.",
          "Using binomial probability when trials are not independent or not identical (like drawing without replacement) — that situation needs a different distribution.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A basketball player makes free throws with probability 3/4. She shoots 4 free throws. What is the probability she makes exactly 2 of them?",
        answer:
          "27/128. C(4,2)*(3/4)^2*(1/4)^2 = 6 * 9/16 * 1/16 = 54/256 = 27/128.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "A probability distribution assigns a probability to every outcome, and all probabilities sum to 1.",
          "The binomial distribution models n independent identical trials: P(X=k) = C(n,k)*p^k*(1-p)^(n-k).",
          "Its expected value has the shortcut E(X) = n*p.",
        ],
      },
    ],
  },
  {
    slug: "geometric-probability-explained",
    title: "Geometric Probability",
    topicSlug: "counting-probability",
    difficulty: 6,
    durationMinutes: 6,
    summary:
      "When outcomes correspond to points in a continuous region, probability becomes a ratio of length, area, or volume instead of a count.",
    scenes: [
      {
        type: "title",
        heading: "Geometric Probability",
        sub: "When there are infinitely many equally likely outcomes, probability is measured with length, area, or volume instead of counting.",
      },
      {
        type: "text",
        heading: "From counting to measuring",
        bullets: [
          "Geometric probability applies when outcomes correspond to points chosen uniformly at random along a segment, inside a region, or within a solid.",
          "The probability of landing in a target region equals (measure of the target) / (measure of the whole space) — length over length, area over area, or volume over volume.",
          "This works because every point is equally likely, so the fraction of 'favorable' space directly gives the probability, just like counting favorable outcomes over total outcomes in discrete problems.",
        ],
      },
      {
        type: "text",
        heading: "Common setups",
        bullets: [
          "One-dimensional: a point is chosen at random on a segment, and you want the probability it falls in some sub-interval — this is just a ratio of lengths.",
          "Two-dimensional: a point is chosen at random inside a region (often a square, rectangle, or circle), and you want the probability it lands inside a smaller target region — this is a ratio of areas.",
          "Watch for problems phrased as 'two people arrive at random times between X and Y' — these can often be modeled as a random point in a square, with the condition (like 'they meet') carving out a region whose area you compute geometrically.",
        ],
      },
      {
        type: "example",
        heading: "A circular target on a square board",
        prompt:
          "A square dartboard has side length 10. A circular target of radius 3 is centered on the board. If a dart lands at a uniformly random point on the board, what is the probability it lands inside the circle?",
        bullets: [
          "Area of the square = 10*10 = 100.",
          "Area of the circle = pi*3^2 = 9*pi.",
          "Probability = (area of circle) / (area of square) = 9*pi/100.",
        ],
        diagram: {
          kind: "bars",
          total: 100,
          segments: [
            { label: "Inside circle", value: 28, tone: "brand" },
            { label: "Outside circle", value: 72, tone: "slate" },
          ],
          note: "Approximate area split (9*pi is about 28.3 out of 100).",
        },
      },
      {
        type: "strategy",
        heading: "Setting it up correctly",
        bullets: [
          "Identify the 'whole space' first (the full segment, region, or solid the point is chosen from), then identify the 'target' region satisfying the condition — the answer is always target measure over whole measure.",
          "For two-variable timing problems ('two people arrive between time 0 and T'), draw a square with both arrival times as axes; the condition often becomes a strip or triangle whose area you find directly.",
          "Units cancel in the ratio, so you can compute areas or lengths in any consistent unit without converting, as long as you use the same unit for both target and whole.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistake",
        bullets: [
          "Setting up a ratio of radii or side lengths instead of areas — geometric probability in 2D always compares areas (which scale with the square of length), not linear measurements.",
          "Forgetting that regions can overlap the boundary or extend outside the whole space; always confirm the target region lies entirely inside the sample space before computing its measure.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A stick of length 12 is broken at a uniformly random point. What is the probability that the shorter piece is less than 4 units long?",
        answer:
          "2/3. If the break point is x with pieces x and 12-x, the shorter piece is at least 4 only when x is between 4 and 8, a length-4 interval. The complement (x in (0,4) or (8,12)) has length 8, so the probability is 8/12 = 2/3.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Geometric probability replaces counting with measuring: probability = measure of target / measure of whole space (length, area, or volume).",
          "Two-dimensional problems often become area ratios inside a square or other simple region — sketch the region before computing.",
          "Always double check the target region's dimension matches the whole space's dimension (length with length, area with area).",
        ],
      },
    ],
  },

  {
    slug: "functional-equations-plug-and-chug",
    title: "Functional Equations",
    topicSlug: "functional-equations",
    difficulty: 5,
    durationMinutes: 8,
    summary:
      "Solve functional equations by strategically plugging in special values like 0, 1, and matching variables to reveal the hidden rule.",
    scenes: [
      {
        type: "title",
        heading: "Functional Equations",
        sub: "You're not given a formula for f — you're given a rule it must obey for every input. Plug in the right numbers and the formula falls out.",
      },
      {
        type: "text",
        heading: "What a functional equation asks",
        bullets: [
          "A functional equation states a relationship that must hold for all values of the variables, such as f(x + y) = f(x) + f(y) for all real x and y.",
          "Your job is usually to find f(some specific number), or to prove f must have a certain form (like f(x) = cx).",
          "The variables are 'free' — you get to choose what to plug in for x and y, and smart choices reveal information fast.",
        ],
      },
      {
        type: "text",
        heading: "The go-to substitutions",
        bullets: [
          "Try x = 0 and y = 0 first — this often isolates f(0) or reveals a simple constant.",
          "Try x = y — setting the two variables equal frequently simplifies a two-variable relation into a one-variable one.",
          "Try swapping x and y — if the equation isn't symmetric, comparing f(x,y) to f(y,x) can force extra structure, like f being even or odd.",
        ],
      },
      {
        type: "example",
        heading: "Finding f(0) and a general formula",
        prompt:
          "Suppose f(x + y) = f(x) + f(y) for all real x, y, and f(1) = 5. Find f(3).",
        bullets: [
          "Set x = y = 0: f(0) = f(0) + f(0), so f(0) = 0.",
          "Set y = x: f(2x) = 2f(x). With x = 1: f(2) = 2f(1) = 10.",
          "Set x = 2, y = 1: f(3) = f(2) + f(1) = 10 + 5 = 15.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "f(0+0) = f(0) + f(0)", note: "gives f(0) = 0" },
            { expr: "f(1+1) = f(1) + f(1) = 10", note: "f(2) = 10" },
            { expr: "f(2+1) = f(2) + f(1) = 15", note: "f(3) = 15" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "How to attack a new functional equation",
        bullets: [
          "Always test x = 0, y = 0, and x = y before anything fancier — these three substitutions solve a large fraction of contest functional equations.",
          "Once you find a pattern like f(2x) = 2f(x), guess the general form (here, f(x) = 5x) and verify it satisfies the original equation for all x, y.",
          "If the problem only asks for one specific value, you often don't need the full formula — just chain substitutions that build up to exactly that value, as in the worked example.",
        ],
      },
      {
        type: "pitfall",
        heading: "Don't assume more than the equation gives you",
        bullets: [
          "Never assume f is linear, continuous, or 'nice' unless the problem states it or you can prove it from the given equation — many contest functional equations have exotic solutions if extra conditions aren't given.",
          "A single computed value (like f(1) = 5) does not by itself prove f(x) = 5x for all x; treat a guessed formula as a hypothesis to verify, not a fact.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Suppose f(x + y) = f(x) + f(y) for all real x, y, and f(1) = 4. Find f(5).",
        answer:
          "f(5) = 20. Since f(0) = 0 and f(n) = n·f(1) for positive integers n (by repeated addition), f(5) = 5 × 4 = 20.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Plug in 0, plug in equal variables, and try swapping variables — these three moves crack most functional equations.",
          "Build up the value you need step by step from smaller substitutions rather than searching for the full formula immediately.",
        ],
      },
    ],
  },
  {
    slug: "logic-puzzles-grid-deduction",
    title: "Logic Puzzles",
    topicSlug: "logical-puzzles",
    difficulty: 4,
    durationMinutes: 7,
    summary:
      "Crack multi-clue logic puzzles by building an elimination grid and applying direct clues before relational ones.",
    scenes: [
      {
        type: "title",
        heading: "Logic Puzzles",
        sub: "Every clue removes a possibility. Track them all in a grid and the answer falls into place cell by cell.",
      },
      {
        type: "text",
        heading: "Setting up the grid",
        bullets: [
          "List every category (people, pets, colors, times) along the edges of a grid, one grid per pair of categories.",
          "A direct clue (like 'Amy owns the cat') lets you place a check mark and immediately X out that row and column everywhere else.",
          "A negative clue (like 'Ben does not own the cat') only removes one cell — it never confirms an answer by itself.",
        ],
      },
      {
        type: "text",
        heading: "Order of attack",
        bullets: [
          "Apply direct, specific clues first — they shrink the grid fastest.",
          "Apply negative clues next, crossing out exactly the one cell each one forbids.",
          "Save relational clues (older than, before, more than) for last, once few possibilities remain to compare.",
        ],
      },
      {
        type: "example",
        heading: "Filling in a 3-by-3 grid",
        prompt:
          "Dana, Eli, and Farah each play exactly one sport: soccer, tennis, or chess. Farah plays tennis. Dana does not play chess. Who plays what?",
        bullets: [
          "Farah = tennis is direct, so cross out tennis for Dana and Eli.",
          "Dana does not play chess, and tennis is already taken, so Dana must play soccer.",
          "The only sport left for Eli is chess.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "Farah = tennis", note: "direct clue" },
            { expr: "Dana ≠ chess, ≠ tennis", note: "forces Dana = soccer" },
            { expr: "Eli = chess", note: "only sport left" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Cascading deductions",
        bullets: [
          "Whenever a row or column has only one open cell remaining, that cell must be true — fill it immediately and re-scan the grid, since one deduction often unlocks several more.",
          "If you get stuck, list which cells are still open in each row and column; the puzzle is solvable once every row and column has exactly one open cell.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common trap",
        bullets: [
          "Don't read a negative clue as if it names the correct answer — 'Ben is not the tennis player' tells you nothing about who is, only who isn't.",
          "Forgetting to cross-eliminate after placing a confirmed check is the most common source of contradictions later in the grid.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Three students — Ravi, Sana, and Tom — each solved exactly one problem type: algebra, geometry, or combinatorics. Ravi solved geometry. Sana did not solve combinatorics. Who solved combinatorics?",
        answer:
          "Tom solved combinatorics. Ravi solved geometry (direct clue), so Sana and Tom split algebra and combinatorics; since Sana did not solve combinatorics, Sana solved algebra and Tom solved combinatorics.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Use a grid, apply direct clues first, then negative clues, then relational clues last.",
          "A completed row or column with one open cell is always a forced deduction — cascade it right away.",
        ],
      },
    ],
  },
  {
    slug: "graph-theory-basics-handshake-lemma",
    title: "Basic Graph Theory",
    topicSlug: "graph-theory",
    difficulty: 6,
    durationMinutes: 8,
    summary:
      "Vertices, edges, and degrees combine through the Handshake Lemma to unlock counting and existence problems on graphs.",
    scenes: [
      {
        type: "title",
        heading: "Basic Graph Theory",
        sub: "Dots and lines model friendships, roads, and tournaments alike. One counting fact — the Handshake Lemma — unlocks most contest graph problems.",
      },
      {
        type: "text",
        heading: "Vertices, edges, and degree",
        bullets: [
          "A graph is a set of vertices (dots) joined by edges (lines); it can model people, cities, or games in a tournament.",
          "The degree of a vertex is the number of edges touching it — for example, in a friendship graph, degree counts how many friends a person has.",
          "A path visits distinct vertices in a row; a cycle is a path that loops back to its start; a tree is connected with no cycles at all.",
        ],
      },
      {
        type: "text",
        heading: "The Handshake Lemma",
        bullets: [
          "Every edge touches exactly two vertices, so summing every vertex's degree counts each edge twice: sum of degrees = 2 × (number of edges).",
          "A direct consequence: the number of vertices with odd degree is always even — you can never have exactly one, or exactly three, odd-degree vertices.",
          "In a tree with n vertices, there are always exactly n − 1 edges, no matter how the tree is shaped.",
        ],
      },
      {
        type: "example",
        heading: "Counting edges from degrees",
        prompt:
          "A graph has 6 vertices, and every vertex has degree 3. How many edges does it have?",
        bullets: [
          "Sum of degrees = 6 × 3 = 18.",
          "By the Handshake Lemma, sum of degrees = 2 × (number of edges).",
          "Number of edges = 18 ÷ 2 = 9.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "sum of degrees = 6 × 3 = 18" },
            { expr: "18 = 2 × edges" },
            { expr: "edges = 9" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Where to start on a graph problem",
        bullets: [
          "If a problem gives degrees and asks for edges (or the reverse), reach for the Handshake Lemma immediately — sum the degrees and divide by 2.",
          "If a problem asks whether a configuration of handshakes or games is possible, check the odd-degree-count-must-be-even rule before trying to build an example.",
          "For tree problems, use vertices = edges + 1 to jump straight to whichever count you need.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common trap",
        bullets: [
          "Forgetting to divide by 2: the sum of degrees is twice the number of edges, not the number of edges itself.",
          "Assuming a connected graph with n vertices and n − 1 edges must be a specific shape — many different trees share the same vertex and edge count.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "At a party, every guest shakes hands with some other guests. Can exactly one guest end up having shaken hands with an odd number of people, while everyone else shook an even number?",
        answer:
          "No. The number of people with an odd handshake-count (odd degree) must always be even, by the Handshake Lemma, so a single odd-degree guest is impossible — there must be zero, two, four, and so on.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Degree counts edges touching a vertex; the Handshake Lemma says the degree sum is always twice the edge count.",
          "The number of odd-degree vertices is always even, and a tree with n vertices always has exactly n − 1 edges.",
        ],
      },
    ],
  },

  {
    slug: "am-gm-cauchy-schwarz-toolkit",
    title: "AM-GM and the Olympiad Toolkit",
    topicSlug: "inequalities-olympiad",
    difficulty: 8,
    durationMinutes: 8,
    summary:
      "Beyond the basic inequality: how AM-GM, Cauchy-Schwarz, and equality-case tracking combine to crack olympiad inequalities like Nesbitt's.",
    scenes: [
      {
        type: "title",
        heading: "AM-GM and the Olympiad Toolkit",
        sub: "Three inequalities, one habit — always track the equality case — solve the overwhelming majority of contest inequality problems.",
      },
      {
        type: "text",
        heading: "The big three inequalities",
        bullets: [
          "AM-GM: for nonnegative reals, (a_1+...+a_n)/n >= (a_1 a_2 ... a_n)^(1/n), with equality exactly when all a_i are equal.",
          "Cauchy-Schwarz: (sum a_i b_i)^2 <= (sum a_i^2)(sum b_i^2), with equality when the sequences (a_i) and (b_i) are proportional.",
          "Engel form / Titu's Lemma (a Cauchy-Schwarz consequence): sum(x_i^2 / y_i) >= (sum x_i)^2 / (sum y_i) for positive y_i — extremely useful for fractions with squared numerators.",
          "The power mean hierarchy QM >= AM >= GM >= HM is the umbrella all of these sit under.",
        ],
      },
      {
        type: "text",
        heading: "Strategy: normalize and track equality",
        bullets: [
          "Use homogeneity: if scaling all variables by t scales both sides the same way, you can fix a constraint like a+b+c=1 or abc=1 to cut down variables.",
          "Guess the equality case first (usually a=b=c by symmetry) — it tells you what bound to aim for before you've proven anything.",
          "When a sum of fractions appears, try Engel form before brute-force algebra.",
        ],
      },
      {
        type: "example",
        heading: "Nesbitt's Inequality",
        prompt:
          "For positive reals a, b, c, prove that a/(b+c) + b/(a+c) + c/(a+b) >= 3/2.",
        bullets: [
          "Rewrite each term with a squared numerator: a/(b+c) = a^2 / (a(b+c)), and likewise for the other two.",
          "Apply Engel form: sum a^2/(a(b+c)) >= (a+b+c)^2 / [a(b+c) + b(a+c) + c(a+b)] = (a+b+c)^2 / (2(ab+bc+ca)).",
          "It remains to show (a+b+c)^2 >= 3(ab+bc+ca), i.e. a^2+b^2+c^2 >= ab+bc+ca — true since it's equivalent to (a-b)^2+(b-c)^2+(c-a)^2 >= 0.",
          "Chaining the two steps gives the sum >= 3(ab+bc+ca) / (2(ab+bc+ca)) = 3/2, with equality when a=b=c.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            {
              expr: "sum a/(b+c) >= (a+b+c)^2 / (2(ab+bc+ca))",
              note: "Engel form",
            },
            {
              expr: "(a+b+c)^2 >= 3(ab+bc+ca)",
              note: "equivalent to sum of squares >= 0",
            },
            { expr: "sum a/(b+c) >= 3/2" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Spotting which tool to use",
        bullets: [
          "Sum of fractions with a variable squared on top and a linear expression on the bottom → try Engel form first.",
          "Product of terms with a fixed product constraint (like abc=1) → AM-GM on the terms directly.",
          "Whenever you finish a proof, restate the equality case explicitly — a contest solution is incomplete without it.",
        ],
      },
      {
        type: "pitfall",
        heading: "Where these proofs go wrong",
        bullets: [
          "AM-GM requires every term to be nonnegative — check positivity before applying it, especially after a substitution.",
          "Engel form's direction is easy to reverse if the denominators in the sum aren't matched exactly to the numerators being squared.",
          "A bound that's true but not tight (you proved >= 1 when the real answer is >= 3/2) is a wasted proof — always check whether your bound matches the guessed equality case.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Let x, y, z be positive reals with xyz = 1. Prove that x^2 + y^2 + z^2 >= x + y + z.",
        answer:
          "By QM-AM (power mean), x^2+y^2+z^2 >= (x+y+z)^2/3. By AM-GM, x+y+z >= 3(xyz)^(1/3) = 3. Combining: (x+y+z)^2/3 >= (x+y+z)*3/3 = x+y+z, using x+y+z >= 3 to replace one factor of (x+y+z)/3. So x^2+y^2+z^2 >= (x+y+z)^2/3 >= x+y+z, with equality when x=y=z=1.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "AM-GM, Cauchy-Schwarz, and Engel form (Titu's Lemma) cover most olympiad inequality problems between them.",
          "Normalize using homogeneity and guess the equality case (usually all variables equal) before grinding through algebra.",
          "Every complete proof states not just the inequality but the exact equality condition.",
        ],
      },
    ],
  },
  {
    slug: "invariants-and-monovariants",
    title: "Invariants and Monovariants",
    topicSlug: "proof-techniques",
    difficulty: 8,
    durationMinutes: 7,
    summary:
      "When a process repeatedly changes some state, find the quantity that never changes — or always moves the same direction — and the problem often solves itself.",
    scenes: [
      {
        type: "title",
        heading: "Invariants and Monovariants",
        sub: "The single most powerful technique for 'process' problems: find what stays the same, or what always moves the same way.",
      },
      {
        type: "text",
        heading: "What's an invariant?",
        bullets: [
          "An invariant is a quantity or property that every allowed move preserves exactly — it starts at some value and stays there forever.",
          "Common invariants: parity (odd/even) of a sum, a total mod n, a two-coloring argument, or the count of objects with a certain property.",
          "Invariants are used to prove impossibility (two states can never be reached from one another) or to characterize exactly what the end state must look like.",
        ],
      },
      {
        type: "text",
        heading: "Monovariants: invariants that move in one direction",
        bullets: [
          "A monovariant is a quantity that strictly increases (or strictly decreases) with every move, and is bounded — so the process cannot continue forever.",
          "Monovariants prove termination, and often let you bound the maximum number of moves in a process.",
          "The distinction matters: an invariant is exactly constant, a monovariant is only monotonic.",
        ],
      },
      {
        type: "example",
        heading: "A parity invariant on the whiteboard",
        prompt:
          "The numbers 1, 2, ..., 2025 are written on a board. Each move: erase two numbers a and b, and write |a-b| in their place (this reduces the count of numbers by one). After 2024 moves, a single number remains. Prove it must be odd.",
        bullets: [
          "Track S = the sum of all numbers currently on the board, mod 2.",
          "Replacing a, b with |a-b| changes S by (a+b) - |a-b|. Since a+b and a-b differ by 2b (an even number), a+b and |a-b| always have the same parity, so this change is always even — S mod 2 never changes.",
          "The initial sum is 1+2+...+2025 = 2025*2026/2 = 2025*1013. Both 2025 and 1013 are odd, so the initial sum is odd.",
          "Since S mod 2 is invariant, the final leftover number must also be odd.",
        ],
      },
      {
        type: "strategy",
        heading: "Finding the right invariant",
        bullets: [
          "Compute how a proposed quantity (sum, product, count mod k) changes after one generic move — don't just check it on one example, verify it algebraically for every legal move.",
          "Match the invariant to what's being asked: parity arguments prove odd/even claims, colorings prove impossibility of covering or tiling.",
          "For 'does this process terminate' or 'how many moves are needed' questions, look for a monovariant with a natural floor (like zero) or ceiling.",
        ],
      },
      {
        type: "pitfall",
        heading: "Where invariant arguments fail",
        bullets: [
          "Checking a quantity on only a few example moves and assuming it's invariant — it must be proven for the fully general move, algebraically.",
          "Using an invariant that's actually just 'often true' rather than exactly preserved — a single counterexample move breaks the whole argument.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A standard 8x8 chessboard is colored in the usual alternating black/white pattern, so opposite corner squares are the same color. Two opposite corners are removed, leaving 62 squares. Prove that these 62 squares cannot be exactly covered by 31 non-overlapping dominoes (each domino covers two adjacent squares).",
        answer:
          "Every domino covers exactly one black and one white square, since adjacent squares always differ in color. The full board has 32 black and 32 white squares; removing two same-colored corners leaves 30 squares of that color and 32 of the other, for 62 squares total. A tiling by 31 dominoes would need to cover exactly 31 black and 31 white squares, but only 30 squares of the removed color remain — a contradiction. So no such tiling exists.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "An invariant stays exactly constant under every move; a monovariant moves strictly in one direction and is bounded.",
          "Parity, mod-n sums, and two-colorings are the most common invariant types on contests.",
          "Always verify an invariant algebraically for the general move, not just by example.",
        ],
      },
    ],
  },
  {
    slug: "integer-polynomial-divisibility-lemma",
    title: "Integer Polynomial Divisibility",
    topicSlug: "advanced-number-theory",
    difficulty: 7,
    durationMinutes: 7,
    summary:
      "For integer-coefficient polynomials, a-b always divides P(a)-P(b) — a small lemma that rules out integer roots and solutions fast.",
    scenes: [
      {
        type: "title",
        heading: "Integer Polynomial Divisibility",
        sub: "A single lemma about integer-coefficient polynomials that rules out integer roots in a couple of lines.",
      },
      {
        type: "text",
        heading: "The core lemma",
        bullets: [
          "If P(x) has integer coefficients, then for any integers a and b, (a - b) divides P(a) - P(b).",
          "This follows term by term: each monomial c*x^k contributes c*(a^k - b^k), and a^k - b^k always factors as (a-b)(a^{k-1} + a^{k-2}b + ... + b^{k-1}), which is a multiple of (a-b).",
          "Taking b = 0 gives the useful corollary: if r is an integer root of P (so P(r) = 0), then r divides P(0), the constant term.",
        ],
      },
      {
        type: "text",
        heading: "Why this is powerful",
        bullets: [
          "It turns 'does this polynomial have an integer root' into 'check the finitely many divisors of the constant term' — often just a handful of candidates.",
          "It works even when the polynomial has no nice factorization and is too high-degree to solve directly.",
          "It generalizes beyond roots: it also constrains integer solutions to P(a) = P(b) for a != b.",
        ],
      },
      {
        type: "example",
        heading: "Ruling out an integer root",
        prompt:
          "Prove that P(x) = x^5 - x^4 + 2x^3 - 2x^2 + 3x + 2027 has no integer roots. (2027 is prime.)",
        bullets: [
          "If r is an integer root, then r divides the constant term P(0) = 2027.",
          "Since 2027 is prime, its only integer divisors are 1, -1, 2027, -2027.",
          "Check the small candidates: P(1) = 1-1+2-2+3+2027 = 2030 != 0, and P(-1) = -1-1-2-2-3+2027 = 2017 != 0.",
          "For r = 2027 or r = -2027, the x^5 term already has magnitude on the order of 2027^5, vastly larger than every other term combined, so P(r) cannot be zero.",
          "None of the divisors of 2027 are roots, so P has no integer root at all.",
        ],
      },
      {
        type: "strategy",
        heading: "Using the lemma efficiently",
        bullets: [
          "Any integer root of an integer-coefficient polynomial must divide the constant term — check this list of divisors first, before anything else.",
          "For large candidate values, argue the leading term dominates in magnitude rather than computing the full value.",
          "The general form (a-b) | P(a) - P(b) also helps prove two specific integers can't both be roots, or bounds how close two integer solutions can be.",
        ],
      },
      {
        type: "pitfall",
        heading: "Where this goes wrong",
        bullets: [
          "The lemma requires integer coefficients — it simply does not apply to polynomials with rational or irrational coefficients.",
          "Dividing the constant term is necessary but not sufficient for being a root — every candidate must still be checked by direct substitution.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Prove that Q(x) = x^3 + x^2 - 5x + 2029 has no integer root, given that 2029 is prime.",
        answer:
          "Any integer root must divide 2029, so the only candidates are 1, -1, 2029, -2029. Q(1) = 1+1-5+2029 = 2026 != 0, and Q(-1) = -1+1+5+2029 = 2034 != 0. For r = +-2029, the cubic term dominates and Q(r) cannot be zero. So Q has no integer root.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "For integer-coefficient P, (a-b) always divides P(a)-P(b); taking b=0 shows any integer root divides P(0).",
          "This reduces an infinite search to checking finitely many divisors of the constant term.",
          "Large candidates can often be dismissed by comparing the size of the leading term to the rest of the polynomial.",
        ],
      },
    ],
  },
  {
    slug: "line-and-circle-region-counting",
    title: "Counting Regions in Arrangements",
    topicSlug: "advanced-combinatorics",
    difficulty: 8,
    durationMinutes: 8,
    summary:
      "Each new line or circle added to an arrangement in general position adds a predictable number of regions — a clean recursive count with a closed form.",
    scenes: [
      {
        type: "title",
        heading: "Counting Regions in Arrangements",
        sub: "Adding one curve at a time to an arrangement and counting exactly how many new regions it creates.",
      },
      {
        type: "text",
        heading: "Building the recursion for lines",
        bullets: [
          "Start with the empty plane: 1 region.",
          "Adding the k-th line (in general position) crosses each of the previous k-1 lines exactly once, at k-1 distinct points, which split the new line into k pieces.",
          "Each of those k pieces cuts exactly one existing region into two, so adding the k-th line increases the region count by exactly k.",
          "Summing: total regions after n lines = 1 + 1 + 2 + ... + n = 1 + n + n(n-1)/2.",
        ],
      },
      {
        type: "text",
        heading: "General position matters",
        bullets: [
          "General position for lines means no two are parallel and no three meet at a single point — every pair crosses exactly once, and no crossing point is shared.",
          "Parallel lines or concurrent triples reduce the region count below this maximum, since a shared or missing crossing means fewer pieces are cut from the new line.",
          "The same idea applies to circles, but each pair of circles can intersect in at most 2 points instead of 1, changing the increment formula.",
        ],
      },
      {
        type: "example",
        heading: "Six lines in general position",
        prompt:
          "Find the maximum number of regions into which 6 lines can divide the plane.",
        bullets: [
          "Start with 1 region (0 lines). Line k adds k new regions when in general position.",
          "Total = 1 + (1+2+3+4+5+6) = 1 + 21 = 22.",
          "Check against the closed form: 1 + n + C(n,2) = 1 + 6 + 15 = 22. Matches.",
        ],
        diagram: {
          kind: "equationSteps",
          lines: [
            { expr: "R(n) = 1 + n + C(n,2)" },
            { expr: "R(6) = 1 + 6 + 15" },
            { expr: "R(6) = 22" },
          ],
        },
      },
      {
        type: "strategy",
        heading: "Adapting the recursion",
        bullets: [
          "'Maximum/minimum regions' problems reduce to counting how many new crossing points (and hence new pieces) each added curve contributes.",
          "For circles instead of lines: the k-th circle crosses each of the previous k-1 circles in at most 2 points, so it's split into 2(k-1) arcs (for k >= 2), each adding one region.",
          "Always confirm the general-position assumptions stated in the problem — they're exactly what makes the count achieve its maximum.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Forgetting that three concurrent lines create one fewer region than three lines in general position — a shared crossing point is 'wasted' compared to three separate ones.",
          "Applying the line-crossing recursion to line segments — segments don't necessarily cross every other segment, so the maximal-crossing count doesn't directly transfer.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Suppose 5 circles are drawn so that any two intersect in exactly 2 points and no three circles pass through a common point. What is the maximum number of regions the plane is divided into?",
        answer:
          "For circles, R(n) = n^2 - n + 2: starting from 1 region, the first circle adds 1 region, and the k-th circle (k >= 2) crosses all earlier circles in 2(k-1) points, adding 2(k-1) regions, giving R(n) = 2 + 2(1+2+...+(n-1)) = 2 + n(n-1) = n^2-n+2. For n=5: R(5) = 25 - 5 + 2 = 22 regions.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Region-counting problems come from a simple recursion: count how many new pieces each added curve is split into by its crossings with earlier curves.",
          "Lines add k new regions on the k-th line; circles add 2(k-1) new regions on the k-th circle.",
          "General position (no parallels/concurrences for lines, no shared triple points for circles) is what achieves the maximum count.",
        ],
      },
    ],
  },
  {
    slug: "multiplicative-order-mod-p",
    title: "Multiplicative Order mod p",
    topicSlug: "advanced-number-theory",
    difficulty: 7,
    durationMinutes: 7,
    summary:
      "The order of a mod p — the smallest exponent that returns 1 — reduces huge power computations and forces tight bounds in 'find all n' divisibility problems.",
    scenes: [
      {
        type: "title",
        heading: "Multiplicative Order mod p",
        sub: "The smallest d with a^d = 1 (mod p) controls every power of a mod p — and it always divides p-1.",
      },
      {
        type: "text",
        heading: "Definition and the key facts",
        bullets: [
          "For a prime p and an integer a with p not dividing a, the order of a mod p, written ord_p(a), is the smallest positive integer d such that a^d = 1 (mod p).",
          "By Fermat's Little Theorem, a^{p-1} = 1 (mod p), and it's a standard fact that ord_p(a) always divides p-1.",
          "More generally, if a^k = 1 (mod p) for some k, then ord_p(a) divides k — this is the fact that makes the order useful for both computing and bounding.",
        ],
      },
      {
        type: "text",
        heading: "Why the order is useful",
        bullets: [
          "To compute a^N mod p for a huge exponent N, find ord_p(a) and reduce N modulo that order — a^N depends only on N mod ord_p(a).",
          "In 'find all n such that...' divisibility problems, showing ord_p(a) must simultaneously divide two different numbers (like n and p-1) often forces the order to be very small (1 or 2), which pins down the answer.",
        ],
      },
      {
        type: "example",
        heading: "Reducing a huge power",
        prompt:
          "Find the order of 2 mod 31, and use it to compute 2^1000 mod 31.",
        bullets: [
          "Check small powers of 2 mod 31: 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32=1 (mod 31).",
          "So ord_31(2) = 5, and indeed 5 divides 30 = 31-1, consistent with Fermat's theorem.",
          "1000 mod 5 = 0, so 2^1000 = (2^5)^200 = 1^200 = 1 (mod 31).",
        ],
      },
      {
        type: "strategy",
        heading: "Using order arguments",
        bullets: [
          "To simplify a^N mod p, find ord_p(a) by testing divisors of p-1 in increasing order until one gives 1.",
          "To prove p | (a^n - 1), show ord_p(a) divides n; to prove p never divides a^n - 1, show ord_p(a) never divides n.",
          "When a problem forces ord_p(a) to divide two numbers with a small common structure, conclude the order itself is small and case-check.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Assuming ord_p(a) = p-1 by default — this is only true when a is a primitive root mod p, which isn't guaranteed.",
          "Using an order argument when p divides a — the order is only defined when gcd(a,p) = 1, so check that first.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "Find the remainder when 3^2024 is divided by 13.",
        answer:
          "3^1=3, 3^2=9, 3^3=27=1 (mod 13), so ord_13(3) = 3. Since 2024 = 3*674 + 2, 3^2024 = 3^2 = 9 (mod 13). The remainder is 9.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "ord_p(a) is the smallest d with a^d = 1 (mod p), and it always divides p-1.",
          "Reduce huge exponents modulo the order to compute a^N mod p quickly.",
          "In existence/uniqueness problems, forcing the order to divide two different quantities often collapses the possibilities to a small, checkable list.",
        ],
      },
    ],
  },
  {
    slug: "cauchy-equation-and-injectivity",
    title: "Cauchy's Equation and Injectivity",
    topicSlug: "functional-equations",
    difficulty: 9,
    durationMinutes: 8,
    summary:
      "The additive equation f(x+y)=f(x)+f(y) pins down f completely over the rationals, and injectivity plus induction are the standard tools for pinning down recursively defined functions.",
    scenes: [
      {
        type: "title",
        heading: "Cauchy's Equation and Injectivity",
        sub: "Two of the sharpest tools in functional equations: forcing linearity over Q, and using injectivity to drive an induction.",
      },
      {
        type: "text",
        heading: "Cauchy's equation over the rationals",
        bullets: [
          "If f(x+y) = f(x) + f(y) for all rational x, y, then setting x=y=0 gives f(0) = 0 immediately.",
          "By induction, f(n) = n*f(1) for every positive integer n, and f(-n) = -f(n) since f(n) + f(-n) = f(0) = 0.",
          "Scaling further: since f(1) = q*f(1/q) for any positive integer q (by adding f(1/q) to itself q times), f(1/q) = f(1)/q, and combining gives f(p/q) = (p/q)*f(1) for every rational p/q — so f is exactly linear on Q.",
          "Over the reals, without an extra assumption like continuity, monotonicity, or boundedness on some interval, wildly non-linear 'pathological' solutions exist — always note what regularity a problem grants you.",
        ],
      },
      {
        type: "text",
        heading: "Injectivity as a proof engine",
        bullets: [
          "If the functional equation lets you cancel matching terms to show f(a) = f(b) implies a = b, you've proven f is injective — often the key fact that forces a recursively-defined value to be unique.",
          "Injectivity combined with a known base value (like f(1)) frequently sets up a strong induction that determines f(n) for every n.",
        ],
      },
      {
        type: "example",
        heading: "Scaling a known value across the rationals",
        prompt:
          "Suppose f: Q -> Q satisfies f(x+y) = f(x) + f(y) for all rational x, y, and f(1) = 5. Find f(3/4).",
        bullets: [
          "Setting x=y=0: f(0) = f(0) + f(0), so f(0) = 0.",
          "By induction, f(n) = n*f(1) = 5n for every positive integer n.",
          "Since f(1) = f(1/4)+f(1/4)+f(1/4)+f(1/4) = 4*f(1/4), we get f(1/4) = 5/4.",
          "Then f(3/4) = 3*f(1/4) = 3*(5/4) = 15/4.",
        ],
      },
      {
        type: "strategy",
        heading: "The standard opening moves",
        bullets: [
          "Always compute f(0), f(1), and the result of x=y before attempting the general case — these three substitutions solve a surprising fraction of contest problems outright.",
          "Test early whether the equation forces injectivity or surjectivity; either one is usually the fastest route to uniqueness.",
          "Once a candidate formula appears, substitute it back into the fully general original equation — satisfying only the special cases used to derive it is not a proof.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Assuming continuity or monotonicity for a Cauchy-type equation over R when the problem never states it — additive alone does not imply linear over R.",
          "Stopping after finding one solution that works, without proving it's the only one — olympiad functional equation answers almost always require an explicit uniqueness argument.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A function f: Z+ -> Z+ satisfies f(f(n)) + f(n) = 2n + 3 for every positive integer n, and f is strictly increasing. Find f(1) and hence f(1993).",
        answer:
          "Let f(1) = a. Setting n=1 gives f(a) = 5 - a, so a <= 4. If a=1, f(1)=1 forces f(f(1))+f(1)=2, not 5 — rejected. If a=3, f(3)=2 < f(1)=3 contradicts strictly increasing (3>1 needs f(3)>f(1)). If a=4, f(4)=1 < f(1)=4 similarly contradicts monotonicity. Only a=2 survives: f(1)=2, f(2)=3. By induction, if f(n)=n+1 then the equation gives f(n+1) = 2n+3-f(n) = n+2, so f(n)=n+1 for all n. Hence f(1993) = 1994.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Cauchy's equation f(x+y)=f(x)+f(y) forces f(x)=cx on Q by induction and scaling, but needs extra regularity to force it on R.",
          "Injectivity, once established from the equation itself, is a powerful lever for turning a recursive relation into an explicit formula via induction.",
          "A derived candidate is not a solution until it's verified in the full original equation for arbitrary inputs.",
        ],
      },
    ],
  },
  {
    slug: "quadrilateral-properties-video",
    title: "Quadrilaterals",
    topicSlug: "quadrilaterals",
    difficulty: 4,
    durationMinutes: 6,
    summary:
      "Parallelograms, rectangles, rhombi, and trapezoids each carry a distinct bundle of angle, side, and diagonal guarantees — spotting the category unlocks them all at once.",
    scenes: [
      {
        type: "title",
        heading: "Quadrilaterals",
        sub: "Every quadrilateral's angles sum to 360° — but parallelograms, rectangles, rhombi, and trapezoids each add their own extra guarantees.",
      },
      {
        type: "text",
        heading: "Interior angles and parallelograms",
        bullets: [
          "Any quadrilateral's four interior angles sum to 360°, from splitting it into two triangles.",
          "A parallelogram has both pairs of opposite sides parallel: opposite sides are equal, opposite angles are equal, and consecutive angles are supplementary.",
          "A parallelogram's diagonals always bisect each other — this single fact solves most 'find the diagonal' problems instantly.",
        ],
      },
      {
        type: "text",
        heading: "Rectangles, rhombi, and squares",
        bullets: [
          "A rectangle is a parallelogram with four right angles, which forces its diagonals to be equal in length as well as bisecting.",
          "A rhombus is a parallelogram with four equal sides, which forces its diagonals to be perpendicular and to bisect the vertex angles.",
          "A square is both a rectangle and a rhombus, so it inherits every property from both: equal sides, right angles, and diagonals that are equal, perpendicular, and bisecting.",
        ],
      },
      {
        type: "example",
        heading: "Using the diagonal-bisection property",
        prompt:
          "In parallelogram ABCD, diagonals AC and BD meet at E. If AE = 9 and DE = 6, find the full lengths of both diagonals.",
        bullets: [
          "Diagonals of a parallelogram bisect each other, so E is the midpoint of both AC and BD.",
          "AC = 2·AE = 18.",
          "BD = 2·DE = 12.",
        ],
      },
      {
        type: "strategy",
        heading: "Classify first",
        bullets: [
          "Before computing anything, decide which category the quadrilateral belongs to — the category alone often hands you angle or length relationships for free.",
          "For trapezoids, check whether it's specified as isosceles before assuming equal legs, equal base angles, or equal diagonals.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Assuming a general parallelogram has equal diagonals — only rectangles (and squares) guarantee that.",
          "Assuming a general trapezoid has equal legs or base angles — those only hold for isosceles trapezoids.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt: "A rhombus has diagonals of length 16 and 12. What is its area?",
        answer:
          "96. A rhombus's area equals half the product of its diagonals: (16 × 12)/2 = 96.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "All quadrilaterals: interior angles sum to 360°.",
          "Parallelogram: opposite sides/angles equal, diagonals bisect each other.",
          "Rectangle: also equal diagonals. Rhombus: also perpendicular, angle-bisecting diagonals. Square: all of the above.",
        ],
      },
    ],
  },
  {
    slug: "games-and-strategies-video",
    title: "Games & Strategies",
    topicSlug: "games-and-strategies",
    difficulty: 6,
    durationMinutes: 7,
    summary:
      "Expected value tells you whether a game is fair — and comparing the expected value of stopping versus continuing tells you the optimal strategy at each stage.",
    scenes: [
      {
        type: "title",
        heading: "Games & Strategies",
        sub: "Is this game worth playing? Expected value turns that question into a single number you can compute.",
      },
      {
        type: "text",
        heading: "What makes a game 'fair'",
        bullets: [
          "A game is fair when its expected net gain is exactly 0 — over many plays, neither side gains on average.",
          "Expected net gain = (expected payout) − (cost to play).",
          "A positive expected net gain favors the player; a negative one favors the house.",
        ],
      },
      {
        type: "example",
        heading: "Is this die game fair?",
        prompt: "Pay $5 to roll a fair die and win $2 × (the number rolled). Is this fair?",
        bullets: [
          "Expected payout = 2 × (1+2+3+4+5+6)/6 = 2 × 21/6 = $7.",
          "Expected net gain = 7 − 5 = $2.",
          "The game favors the player by $2 per play on average — it is not fair.",
        ],
      },
      {
        type: "text",
        heading: "Multi-stage decisions",
        bullets: [
          "In games with several stages (like betting repeatedly until a target or bust), compare the expected value of stopping now to the expected value of continuing.",
          "You rarely need the full game tree — later stages can be summarized by their own expected value and plugged back in.",
        ],
      },
      {
        type: "strategy",
        heading: "Conditioning on the next move",
        bullets: [
          "Break a multi-stage decision into 'what happens on the very next step,' weight each branch by its probability, and add in the expected value of whatever position that branch leads to.",
          "This turns a huge tree into a short recursive computation.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Judging a game by its most likely single outcome instead of its expected value — a game can be profitable on average even if it usually loses a little, as long as rare big wins make up for it.",
          "Forgetting to subtract the cost to play before declaring a game favorable.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A game costs $3 to play. You flip a fair coin: heads pays $10, tails pays $0. What is the expected net gain, and does the game favor the player?",
        answer:
          "Expected net gain = $2. Expected payout = 0.5×10 + 0.5×0 = $5, minus the $3 cost = $2 net gain, so the game favors the player.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Expected net gain = expected payout − cost; zero means fair.",
          "For multi-stage games, compare stopping vs. continuing using expected value, conditioning on the next move.",
        ],
      },
    ],
  },
  {
    slug: "patterns-video",
    title: "Patterns",
    topicSlug: "patterns",
    difficulty: 3,
    durationMinutes: 6,
    summary:
      "When a term is too far away to compute directly, find the repeating cycle and use remainders to jump straight to the answer.",
    scenes: [
      {
        type: "title",
        heading: "Patterns",
        sub: "You can't compute the 100th term by hand — but you can find its cycle and jump straight there.",
      },
      {
        type: "text",
        heading: "Find the cycle, then use remainders",
        bullets: [
          "Compute the first several terms by hand until a repeating cycle (period) becomes clear.",
          "Divide the target position by the period length; the remainder tells you where in the cycle it lands.",
          "A remainder of 0 usually means the LAST position in the cycle, not a fresh position 0.",
        ],
      },
      {
        type: "example",
        heading: "Units digit of a huge power",
        prompt: "Find the units digit of 7^100.",
        bullets: [
          "Units digits of powers of 7: 7, 9, 3, 1, 7, 9, 3, 1, ... — period 4.",
          "100 ÷ 4 = 25 remainder 0, so it lands on the 4th (last) position in the cycle.",
          "The units digit is 1.",
        ],
      },
      {
        type: "text",
        heading: "Not every pattern is periodic",
        bullets: [
          "Some sequences grow by a fixed arithmetic or geometric rule instead of repeating — state the rule precisely and verify it against one more term.",
          "Watch for patterns in position (odd vs. even index) as well as in value.",
        ],
      },
      {
        type: "strategy",
        heading: "Write enough terms",
        bullets: [
          "Always generate at least 8-10 terms before committing to a pattern — 2 or 3 terms can accidentally fit more than one rule.",
          "Double-check your proposed rule against a term you haven't used yet to derive it.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Locking onto a pattern from too few terms and missing a longer true period.",
          "Off-by-one errors converting a remainder back into a cycle position.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "A row of tiles repeats the color pattern red, red, blue, green every 4 tiles. What color is the 50th tile?",
        answer:
          "Red. 50 ÷ 4 = 12 remainder 2, so the 50th tile matches the 2nd tile in the pattern, which is red.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Generate enough terms to find the true repeating cycle before trusting a pattern.",
          "Use remainder-of-division to map a far-away index onto its position within the cycle.",
        ],
      },
    ],
  },
  {
    slug: "strategy-video",
    title: "Strategy",
    topicSlug: "strategy",
    difficulty: 7,
    durationMinutes: 8,
    summary:
      "P-positions and N-positions let you label who wins a combinatorial game without ever playing it out — and pairing or strategy-stealing arguments can prove a winner even faster.",
    scenes: [
      {
        type: "title",
        heading: "Strategy",
        sub: "In games like Nim, you can determine the winner before a single move is played — by working backward from the end.",
      },
      {
        type: "text",
        heading: "P-positions and N-positions",
        bullets: [
          "A P-position means the Previous player wins — the player about to move is doomed with correct play.",
          "An N-position means the Next player (about to move) wins.",
          "A position is a P-position exactly when EVERY move from it leads to an N-position; it's an N-position if at least ONE move leads to a P-position.",
        ],
      },
      {
        type: "example",
        heading: "Nim with piles of 1-3 stones",
        prompt:
          "Players alternately remove 1, 2, or 3 stones from a pile; whoever takes the last stone wins. Who wins from a pile of 20?",
        bullets: [
          "From any multiple of 4, every move (removing 1, 2, or 3) leaves a non-multiple of 4 — a gift to your opponent.",
          "From any non-multiple of 4, you can always remove enough to leave the next-lower multiple of 4.",
          "So multiples of 4 are P-positions. 20 is a multiple of 4, so the player to move loses with correct opposing play.",
        ],
      },
      {
        type: "text",
        heading: "Pairing and strategy-stealing",
        bullets: [
          "A pairing strategy pairs up objects or squares so the second player can always mirror the first player's move — common in symmetric board games.",
          "Strategy-stealing: if the second player had a guaranteed win, the first player could make a throwaway first move and then steal that strategy — a contradiction in many symmetric games, proving player one must win (without revealing how).",
        ],
      },
      {
        type: "strategy",
        heading: "Finding the pattern",
        bullets: [
          "Label the smallest positions (0, 1, 2, 3, ... moves available) as P or N by hand, working backward from the terminal position.",
          "Look for an arithmetic pattern, like 'every multiple of k' — most contest Nim-variants reduce to one.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Mixing up which player 'facing' a P-position actually loses — it's the player about to move, not the player who just moved.",
          "Applying a pattern derived under 'taking the last object wins' to a variant where taking the last object actually loses (misère play), without re-deriving it.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Two players alternately remove 1 or 2 stones from a pile of 17; whoever takes the last stone wins. Does the first or second player have a winning strategy?",
        answer:
          "The first player wins. Here, P-positions are multiples of 3 (every move from a multiple of 3 leaves a non-multiple, and you can always return to the next-lower multiple of 3). 17 is not a multiple of 3, so it's an N-position — the first player wins by removing 2 stones to leave 15, a multiple of 3.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "P-position: the player to move loses. N-position: the player to move wins.",
          "Work backward from terminal positions to find the pattern, or use pairing/strategy-stealing to prove a winner exists without finding it explicitly.",
        ],
      },
    ],
  },
  {
    slug: "power-of-a-point-video",
    title: "Power of a Point",
    topicSlug: "advanced-geometry",
    difficulty: 9,
    durationMinutes: 8,
    summary:
      "One product, PA·PB, stays constant for every line through a fixed point and a circle — turning tangled chord-and-secant diagrams into one-line algebra.",
    scenes: [
      {
        type: "title",
        heading: "Power of a Point",
        sub: "Draw any line through a fixed point that crosses a circle twice, and PA·PB never changes — no matter which line you pick.",
      },
      {
        type: "text",
        heading: "The power of a point",
        bullets: [
          "For a point P and a circle, PA·PB is the same for every line through P meeting the circle at A and B.",
          "If P is outside the circle and a tangent from P touches at T, that same value equals PT².",
          "Algebraically, the power of P equals PO² − r², where O is the center and r the radius.",
        ],
      },
      {
        type: "text",
        heading: "Three interchangeable forms",
        bullets: [
          "Two chords crossing inside the circle at P: PA·PB = PC·PD.",
          "A secant and a tangent from an external point P: PA·PB = PT².",
          "Two secants from an external point P: PA·PB = PC·PD, using the full near-and-far distances from P on each line.",
        ],
      },
      {
        type: "example",
        heading: "Tangent and secant from one point",
        prompt:
          "From external point P, a tangent has length 12. A secant from P hits the circle at near point A and far point B, with PA = 8. Find PB.",
        bullets: [
          "Power of a point: PA · PB = PT².",
          "8 · PB = 12² = 144.",
          "PB = 18, so the chord AB = PB − PA = 10.",
        ],
      },
      {
        type: "strategy",
        heading: "Spot it fast",
        bullets: [
          "Any diagram with two chords crossing, or two lines from one external point hitting a circle, is a power-of-a-point setup.",
          "Write the equation immediately — it usually replaces several steps of angle-chasing or similar triangles with one algebraic line.",
        ],
      },
      {
        type: "pitfall",
        heading: "Common mistakes",
        bullets: [
          "Using the chord length AB instead of the full distances PA and PB from the external or internal point.",
          "Forgetting that for a point inside the circle, it's the two split segments on each chord (not the whole chords) that multiply to equal values.",
        ],
      },
      {
        type: "practice",
        heading: "Practice Problem",
        prompt:
          "Two chords of a circle intersect inside at point P. One chord is split into segments of length 6 and 4; the other is split into segments of length 8 and x. Find x.",
        answer: "x = 3. By power of a point, 6 × 4 = 8 × x, so 24 = 8x, giving x = 3.",
      },
      {
        type: "summary",
        heading: "Recap",
        bullets: [
          "Power of a point: PA·PB is constant for any line through P meeting a circle twice, and equals PT² for a tangent.",
          "Two chords, or a secant+tangent, or two secants from one point — all give the same style of equation.",
        ],
      },
    ],
  },
];
