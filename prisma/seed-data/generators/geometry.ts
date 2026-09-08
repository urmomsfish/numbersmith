import { type Generator, frac, gcd, int, intExcept, pick } from "./framework";

/** Reduce n/d by trial division on shared prime factors.
 *
 * Deliberately not Euclid's algorithm — `frac` in the framework already uses
 * that, and the arc/sector generators below reduce the same fraction twice by
 * two different algorithms so that a bug in one reducer cannot pass unnoticed. */
function reduceByFactoring(n: number, d: number): [number, number] {
  let a = n;
  let b = d;
  for (let p = 2; p <= Math.min(a, b); p++) {
    while (a % p === 0 && b % p === 0) {
      a /= p;
      b /= p;
    }
  }
  return [a, b];
}

/** Renders a rational multiple of π: "6π", "(15/2)π", "π". */
function piTerm(n: number, d: number): string {
  const [rn, rd] = reduceByFactoring(n, d);
  if (rd === 1) return rn === 1 ? "π" : `${rn}π`;
  return `(${rn}/${rd})π`;
}

/** Central angles that keep arc and sector answers to tidy fractions. */
const NICE_ANGLES = [30, 36, 40, 45, 60, 72, 90, 108, 120, 135, 144, 150, 180, 216, 240, 270, 300];

/** Pythagorean triples used where an integer hypotenuse is required. */
const TRIPLES: [number, number, number][] = [
  [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29],
  [9, 40, 41], [12, 35, 37], [28, 45, 53], [11, 60, 61], [16, 63, 65],
];

export const GEOMETRY: Generator[] = [
  {
    id: "gen-angle-supplement",
    topicSlug: "angles",
    difficulty: 1,
    competitionSlug: "math-kangaroo",
    variants: 110,
    params: (r) => ({ a: int(r, 15, 165), kind: int(r, 0, 1) }),
    build: ({ a, kind }) => {
      if (kind === 1 && a >= 90) throw new Error("reject");
      const total = kind === 1 ? 90 : 180;
      const answer = total - a;
      const word = kind === 1 ? "complement" : "supplement";
      // 180 − answer is just `a` again, so it can never be a distractor here.
      const distractors = [a, total + a, Math.abs(90 - a), answer + 10, answer - 10, 360 - a]
        .filter((d) => d !== answer && d > 0)
        .map((d) => `${d}°`);
      return {
        question: `What is the ${word} of a ${a}° angle?`,
        format: "MULTIPLE_CHOICE",
        answer: `${answer}°`,
        distractors,
        solution: `${word[0].toUpperCase() + word.slice(1)}ary angles sum to ${total}°, so the answer is ${total} − ${a} = ${answer}°.`,
        hints: [`${word[0].toUpperCase() + word.slice(1)}ary angles add to ${total}°.`, `Subtract ${a} from ${total}.`],
      };
    },
    check: ({ a, kind }) => {
      const total = kind === 1 ? 90 : 180;
      let x = total;
      for (let i = 0; i < a; i++) x -= 1;
      return `${x}°`;
    },
  },

  {
    id: "gen-angle-triangle",
    topicSlug: "angles",
    difficulty: 2,
    competitionSlug: "amc8",
    variants: 130,
    params: (r) => {
      const a = int(r, 20, 120);
      const b = int(r, 20, 150 - a);
      if (180 - a - b < 10) throw new Error("reject");
      return { a, b };
    },
    build: ({ a, b }) => {
      const answer = 180 - a - b;
      return {
        question: `Two angles of a triangle measure ${a}° and ${b}°. What is the measure of the third angle, in degrees?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The angles of a triangle sum to 180°, so the third is 180 − ${a} − ${b} = ${answer}°.`,
        hints: ["The three angles of any triangle sum to 180°.", `Subtract both given angles from 180.`],
      };
    },
    check: ({ a, b }) => String(180 - (a + b)),
  },

  {
    id: "gen-triangle-pythagoras",
    topicSlug: "triangles",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 50,
    params: (r) => {
      const i = int(r, 0, TRIPLES.length - 1);
      const k = int(r, 1, 4);
      return { i, k, want: int(r, 0, 1) };
    },
    build: ({ i, k, want }) => {
      const [a, b, c] = TRIPLES[i].map((x) => x * k) as [number, number, number];
      if (want === 1) {
        return {
          question: `A right triangle has legs of length ${a} and ${b}. What is the length of its hypotenuse?`,
          format: "SHORT_ANSWER",
          answer: String(c),
          solution: `By the Pythagorean theorem, c = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`,
          hints: ["Use a² + b² = c².", `Compute ${a}² + ${b}² first.`],
        };
      }
      return {
        question: `A right triangle has hypotenuse ${c} and one leg ${a}. What is the length of the other leg?`,
        format: "SHORT_ANSWER",
        answer: String(b),
        solution: `By the Pythagorean theorem, b = √(${c}² − ${a}²) = √${c * c - a * a} = ${b}.`,
        hints: ["Rearrange a² + b² = c² to solve for the missing leg.", `Compute ${c}² − ${a}².`],
      };
    },
    // Independent route: integer search for the missing side.
    check: ({ i, k, want }) => {
      const [a, b, c] = TRIPLES[i].map((x) => x * k);
      for (let t = 1; t <= 400; t++) {
        if (want === 1 && a * a + b * b === t * t) return String(t);
        if (want === 0 && a * a + t * t === c * c) return String(t);
      }
      throw new Error("no side");
    },
  },

  {
    id: "gen-triangle-area",
    topicSlug: "area-volume",
    difficulty: 2,
    competitionSlug: "math-league-elementary-middle",
    variants: 110,
    params: (r) => {
      const base = int(r, 3, 30);
      const h = int(r, 2, 24);
      if ((base * h) % 2 !== 0) throw new Error("reject");
      return { base, h };
    },
    build: ({ base, h }) => {
      const answer = (base * h) / 2;
      return {
        question: `A triangle has base ${base} and height ${h}. What is its area?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Area = ½ × base × height = ½ × ${base} × ${h} = ${answer}.`,
        hints: ["The area of a triangle is half the base times the height.", `Multiply ${base} by ${h}, then halve it.`],
      };
    },
    check: ({ base, h }) => {
      let total = 0;
      for (let i = 0; i < h; i++) total += base;
      return String(total / 2);
    },
  },

  {
    id: "gen-rectangle-perimeter-area",
    topicSlug: "quadrilaterals",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 120,
    params: (r) => {
      const w = int(r, 2, 25);
      const h = intExcept(r, 2, 25, [w]);
      return { w, h, want: int(r, 0, 1) };
    },
    build: ({ w, h, want }) => {
      const answer = want === 1 ? w * h : 2 * (w + h);
      const label = want === 1 ? "area" : "perimeter";
      const distractors = [want === 1 ? 2 * (w + h) : w * h, w + h, 2 * w * h, Math.abs(w - h)]
        .filter((d) => d !== answer && d > 0)
        .map(String);
      return {
        question: `A rectangle measures ${w} by ${h}. What is its ${label}?`,
        format: "MULTIPLE_CHOICE",
        answer: String(answer),
        distractors,
        solution:
          want === 1
            ? `Area = ${w} × ${h} = ${answer}.`
            : `Perimeter = 2(${w} + ${h}) = ${answer}.`,
        hints: [
          want === 1 ? "Area of a rectangle is length times width." : "Perimeter is twice the sum of the two side lengths.",
          want === 1 ? `Multiply ${w} by ${h}.` : `Add ${w} and ${h}, then double.`,
        ],
      };
    },
    check: ({ w, h, want }) => {
      if (want === 1) {
        let a = 0;
        for (let i = 0; i < h; i++) a += w;
        return String(a);
      }
      return String(w + h + w + h);
    },
  },

  {
    id: "gen-polygon-interior",
    topicSlug: "polygons",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 25,
    params: (r) => ({ n: int(r, 3, 27) }),
    build: ({ n }) => {
      const answer = (n - 2) * 180;
      return {
        question: `What is the sum of the interior angles of a convex polygon with ${n} sides, in degrees?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The interior angles of an n-gon sum to (n − 2) × 180°. For n = ${n}: ${n - 2} × 180 = ${answer}.`,
        hints: ["Split the polygon into triangles from one vertex.", "An n-gon splits into n − 2 triangles."],
      };
    },
    // Independent route: accumulate 180 once per triangle in the fan.
    check: ({ n }) => {
      let s = 0;
      for (let t = 0; t < n - 2; t++) s += 180;
      return String(s);
    },
  },

  {
    id: "gen-polygon-sides-from-exterior",
    topicSlug: "polygons",
    difficulty: 4,
    competitionSlug: "amc10",
    // Only 14 divisors of 360 give an integer interior angle for n >= 3.
    variants: 14,
    params: (r) => {
      const n = pick(r, [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
      return { n };
    },
    build: ({ n }) => {
      const interior = 180 - 360 / n;
      if (!Number.isInteger(interior)) throw new Error("reject");
      return {
        question: `Each interior angle of a regular polygon measures ${interior}°. How many sides does it have?`,
        format: "SHORT_ANSWER",
        answer: String(n),
        solution: `Each exterior angle is 180 − ${interior} = ${360 / n}°. Since exterior angles sum to 360°, there are 360 ÷ ${360 / n} = ${n} sides.`,
        hints: ["Find the exterior angle first — it's 180° minus the interior angle.", "The exterior angles of any convex polygon sum to 360°."],
      };
    },
    // Independent route: search n directly against the interior-angle formula.
    check: ({ n }) => {
      const interior = 180 - 360 / n;
      for (let k = 3; k <= 400; k++) if (Math.abs(180 - 360 / k - interior) < 1e-9) return String(k);
      throw new Error("no n");
    },
  },

  {
    id: "gen-circle-area-circumference",
    topicSlug: "circles",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 46,
    params: (r) => ({ radius: int(r, 2, 25), want: int(r, 0, 1) }),
    build: ({ radius, want }) => {
      const answer = want === 1 ? `${radius * radius}π` : `${2 * radius}π`;
      const label = want === 1 ? "area" : "circumference";
      // r² and 2r coincide at r = 2, and 4r coincides with r² at r = 4, so the
      // pool needs more candidates than the four obvious ones.
      const distractors = [
        want === 1 ? `${2 * radius}π` : `${radius * radius}π`,
        `${radius}π`,
        `${4 * radius}π`,
        `${2 * radius * radius}π`,
        `${radius * radius + radius}π`,
        `${3 * radius}π`,
      ].filter((d) => d !== answer);
      return {
        question: `A circle has radius ${radius}. What is its ${label}? Express your answer in terms of π.`,
        format: "MULTIPLE_CHOICE",
        answer,
        distractors,
        solution:
          want === 1
            ? `Area = πr² = π(${radius})² = ${radius * radius}π.`
            : `Circumference = 2πr = 2π(${radius}) = ${2 * radius}π.`,
        hints: [want === 1 ? "Area of a circle is πr²." : "Circumference is 2πr.", `Here r = ${radius}.`],
      };
    },
    check: ({ radius, want }) => {
      if (want === 1) {
        let sq = 0;
        for (let i = 0; i < radius; i++) sq += radius;
        return `${sq}π`;
      }
      return `${radius + radius}π`;
    },
  },

  {
    id: "gen-coord-distance",
    topicSlug: "coordinate-geometry",
    difficulty: 3,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const i = int(r, 0, 5);
      const k = int(r, 1, 3);
      const x1 = int(r, -9, 9);
      const y1 = int(r, -9, 9);
      const flip = int(r, 0, 1);
      return { i, k, x1, y1, flip };
    },
    build: ({ i, k, x1, y1, flip }) => {
      const [dx0, dy0, d] = TRIPLES[i].map((x) => x * k);
      const dx = flip === 1 ? dy0 : dx0;
      const dy = flip === 1 ? dx0 : dy0;
      return {
        question: `What is the distance between the points (${x1}, ${y1}) and (${x1 + dx}, ${y1 + dy})?`,
        format: "SHORT_ANSWER",
        answer: String(d),
        solution: `The horizontal change is ${dx} and the vertical change is ${dy}, so the distance is √(${dx}² + ${dy}²) = √${dx * dx + dy * dy} = ${d}.`,
        hints: ["Use the distance formula — it's the Pythagorean theorem in disguise.", `The legs are ${dx} and ${dy}.`],
      };
    },
    check: ({ i, k }) => String(TRIPLES[i][2] * k),
  },

  {
    id: "gen-coord-slope",
    topicSlug: "coordinate-geometry",
    difficulty: 3,
    competitionSlug: "math-league-high-school",
    variants: 100,
    params: (r) => {
      const x1 = int(r, -9, 9);
      const y1 = int(r, -9, 9);
      const run = intExcept(r, 1, 8, [0]);
      const m = intExcept(r, -6, 6, [0]);
      return { x1, y1, run, m };
    },
    build: ({ x1, y1, run, m }) => {
      const x2 = x1 + run;
      const y2 = y1 + m * run;
      const distractors = [-m, m + 1, m - 1, 2 * m].filter((d) => d !== m).map(String);
      return {
        question: `What is the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})?`,
        format: "MULTIPLE_CHOICE",
        answer: String(m),
        distractors,
        solution: `Slope = (${y2} − ${y1}) / (${x2} − ${x1}) = ${y2 - y1}/${run} = ${m}.`,
        hints: ["Slope is rise over run.", `The rise is ${y2 - y1} and the run is ${run}.`],
      };
    },
    check: ({ x1, y1, run, m }) => String((y1 + m * run - y1) / (x1 + run - x1)),
  },

  {
    id: "gen-transform-reflect",
    topicSlug: "transformations",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 90,
    params: (r) => ({
      x: intExcept(r, -9, 9, [0]),
      y: intExcept(r, -9, 9, [0]),
      axis: int(r, 0, 2),
    }),
    build: ({ x, y, axis }) => {
      const names = ["the x-axis", "the y-axis", "the origin"];
      const out = axis === 0 ? [x, -y] : axis === 1 ? [-x, y] : [-x, -y];
      const answer = `(${out[0]}, ${out[1]})`;
      const distractors = [
        `(${x}, ${-y})`, `(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`,
        `(${x}, ${y})`, `(${-y}, ${-x})`,
      ].filter((d) => d !== answer);
      return {
        question: `The point (${x}, ${y}) is reflected over ${names[axis]}. What are its new coordinates?`,
        format: "MULTIPLE_CHOICE",
        answer,
        distractors,
        solution:
          axis === 0
            ? `Reflecting over the x-axis negates the y-coordinate: (${x}, ${y}) → ${answer}.`
            : axis === 1
              ? `Reflecting over the y-axis negates the x-coordinate: (${x}, ${y}) → ${answer}.`
              : `Reflecting through the origin negates both coordinates: (${x}, ${y}) → ${answer}.`,
        hints: [
          axis === 0 ? "The x-coordinate is unchanged." : axis === 1 ? "The y-coordinate is unchanged." : "Both coordinates change sign.",
          "Reflection flips the sign across the fixed axis.",
        ],
      };
    },
    check: ({ x, y, axis }) => {
      const mx = axis === 1 || axis === 2 ? -1 : 1;
      const my = axis === 0 || axis === 2 ? -1 : 1;
      return `(${x * mx}, ${y * my})`;
    },
  },

  {
    id: "gen-3d-volume",
    topicSlug: "three-d-geometry",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 120,
    params: (r) => ({ a: int(r, 2, 14), b: int(r, 2, 14), c: int(r, 2, 14) }),
    build: ({ a, b, c }) => {
      const answer = a * b * c;
      return {
        question: `A rectangular box measures ${a} by ${b} by ${c}. What is its volume?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Volume = ${a} × ${b} × ${c} = ${answer}.`,
        hints: ["Volume of a box is the product of its three dimensions.", `Compute ${a} × ${b} first.`],
      };
    },
    // Independent route: sum the volume layer by layer.
    check: ({ a, b, c }) => {
      let v = 0;
      for (let i = 0; i < c; i++) v += a * b;
      return String(v);
    },
  },

  {
    id: "gen-3d-surface-area",
    topicSlug: "three-d-geometry",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 110,
    params: (r) => ({ a: int(r, 2, 13), b: int(r, 2, 13), c: int(r, 2, 13) }),
    build: ({ a, b, c }) => {
      const answer = 2 * (a * b + b * c + a * c);
      return {
        question: `A rectangular box measures ${a} by ${b} by ${c}. What is its total surface area?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The three distinct faces have areas ${a * b}, ${b * c}, and ${a * c}. Each occurs twice, so the total is 2(${a * b} + ${b * c} + ${a * c}) = ${answer}.`,
        hints: ["A box has three pairs of identical faces.", "Add the three distinct face areas, then double."],
      };
    },
    // Independent route: add all six faces individually.
    check: ({ a, b, c }) => String(a * b + a * b + b * c + b * c + a * c + a * c),
  },

  {
    id: "gen-similar-triangles",
    topicSlug: "similarity-congruence",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const k = int(r, 2, 6);
      const a = int(r, 2, 15);
      const b = int(r, 2, 15);
      return { k, a, b };
    },
    build: ({ k, a, b }) => {
      const answer = b * k;
      return {
        question: `Two triangles are similar. A side of length ${a} in the first corresponds to a side of length ${a * k} in the second. If another side of the first triangle has length ${b}, what is the length of the corresponding side in the second?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The scale factor is ${a * k} ÷ ${a} = ${k}. So the corresponding side is ${b} × ${k} = ${answer}.`,
        hints: ["Find the scale factor between the two triangles first.", `Multiply ${b} by that factor.`],
      };
    },
    // Independent route: solve the proportion by search.
    check: ({ k, a, b }) => {
      for (let x = 1; x <= 5000; x++) if (x * a === b * (a * k)) return String(x);
      throw new Error("no solution");
    },
  },

  // =========================================================================
  // Circles, polygons and triangles.
  //
  // These three subtopics held 48, 41 and 52 problems between them while
  // neighbouring ones held several hundred — a student filtering practice to
  // "Circles" ran out almost immediately.
  // =========================================================================

  {
    id: "gen-circle-arc-sector",
    topicSlug: "circles",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 130,
    params: (r) => ({
      radius: int(r, 2, 24),
      theta: pick(r, NICE_ANGLES),
      want: int(r, 0, 1),
    }),
    build: ({ radius, theta, want }) => {
      // Arc: (θ/180)·r·π. Sector: (θ/360)·r²·π.
      const answer = want === 1 ? piTerm(theta * radius * radius, 360) : piTerm(theta * radius, 180);
      const label = want === 1 ? "area of the sector" : "length of the arc";
      return {
        question: `A circle has radius ${radius}. A sector of the circle has a central angle of ${theta}°. What is the ${label}? Express your answer in terms of π.`,
        // Typed. The π is enterable from the symbol palette, and `checkAnswer`
        // accepts any equivalent notation — "(36/5)π", "36π/5", "36/5 pi".
        format: "SHORT_ANSWER",
        answer,
        solution:
          want === 1
            ? `The sector is ${frac(theta, 360)} of the circle, whose area is ${radius * radius}π. So the sector area is ${frac(theta, 360)} × ${radius * radius}π = ${answer}.`
            : `The arc is ${frac(theta, 360)} of the circumference, which is ${2 * radius}π. So the arc length is ${frac(theta, 360)} × ${2 * radius}π = ${answer}.`,
        hints: [
          `The sector is ${theta}/360 of the whole circle.`,
          want === 1 ? "Find the whole circle's area first, then take that fraction of it." : "Find the whole circumference first, then take that fraction of it.",
        ],
      };
    },
    // Independent route: build the fraction from the whole circle rather than
    // from the pre-simplified formula, and reduce it by factoring rather than
    // by Euclid's algorithm.
    check: ({ radius, theta, want }) => {
      let numerator = 0;
      const perDegree = want === 1 ? radius * radius : 2 * radius;
      for (let i = 0; i < theta; i++) numerator += perDegree;
      const [rn, rd] = reduceByFactoring(numerator, 360);
      if (rd === 1) return rn === 1 ? "π" : `${rn}π`;
      return `(${rn}/${rd})π`;
    },
  },

  {
    id: "gen-circle-inscribed-angle",
    topicSlug: "circles",
    difficulty: 3,
    competitionSlug: "amc10",
    variants: 120,
    params: (r) => {
      const want = int(r, 0, 2);
      // want 0 needs an even arc so the inscribed angle is a whole number.
      const a = want === 0 ? 2 * int(r, 10, 170) : want === 1 ? int(r, 10, 170) : int(r, 30, 150);
      return { a, want };
    },
    build: ({ a, want }) => {
      if (want === 0) {
        return {
          question: `In a circle, an inscribed angle intercepts an arc measuring ${a}°. What is the measure of the inscribed angle, in degrees?`,
          format: "SHORT_ANSWER",
          answer: String(a / 2),
          solution: `An inscribed angle is half the arc it intercepts, so the angle measures ${a} ÷ 2 = ${a / 2}°.`,
          hints: ["An inscribed angle is half of its intercepted arc.", `Halve ${a}.`],
        };
      }
      if (want === 1) {
        return {
          question: `In a circle, an inscribed angle measures ${a}°. What is the measure of the arc it intercepts, in degrees?`,
          format: "SHORT_ANSWER",
          answer: String(2 * a),
          solution: `An inscribed angle is half its intercepted arc, so the arc is twice the angle: 2 × ${a} = ${2 * a}°.`,
          hints: ["An inscribed angle is half of its intercepted arc.", "Reverse that relationship to get the arc."],
        };
      }
      return {
        question: `A quadrilateral is inscribed in a circle. One of its angles measures ${a}°. What is the measure of the opposite angle, in degrees?`,
        format: "SHORT_ANSWER",
        answer: String(180 - a),
        solution: `Opposite angles of a cyclic quadrilateral are supplementary, because together they intercept the entire circle. So the opposite angle is 180 − ${a} = ${180 - a}°.`,
        hints: [
          "The two opposite angles between them intercept the whole 360° of the circle.",
          "Each is half its intercepted arc, so the two must sum to 180°.",
        ],
      };
    },
    // Independent route: search for the value satisfying the defining
    // relationship rather than applying it directly.
    check: ({ a, want }) => {
      for (let x = 1; x <= 360; x++) {
        if (want === 0 && 2 * x === a) return String(x);
        if (want === 1 && x === 2 * a) return String(x);
        // The two opposite angles intercept complementary arcs that together
        // make up the whole circle: 2x + 2a = 360.
        if (want === 2 && 2 * x + 2 * a === 360) return String(x);
      }
      throw new Error("no angle");
    },
  },

  {
    id: "gen-circle-chord-distance",
    topicSlug: "circles",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 70,
    params: (r) => ({ i: int(r, 0, TRIPLES.length - 1), k: int(r, 1, 4), want: int(r, 0, 1) }),
    build: ({ i, k, want }) => {
      // Half-chord, distance from centre, and radius form a right triangle.
      const [half, dist, radius] = TRIPLES[i].map((x) => x * k) as [number, number, number];
      if (want === 1) {
        return {
          question: `A chord of length ${2 * half} is drawn in a circle of radius ${radius}. How far is the chord from the centre of the circle?`,
          format: "SHORT_ANSWER",
          answer: String(dist),
          solution: `Drop a perpendicular from the centre to the chord; it bisects the chord, giving a right triangle with legs ${half} and the distance d, and hypotenuse ${radius}. So d = √(${radius}² − ${half}²) = √${radius * radius - half * half} = ${dist}.`,
          hints: [
            "The perpendicular from the centre to a chord bisects that chord.",
            "That creates a right triangle with the radius as hypotenuse.",
          ],
        };
      }
      return {
        question: `A chord of a circle of radius ${radius} lies ${dist} units from the centre. What is the length of the chord?`,
        format: "SHORT_ANSWER",
        answer: String(2 * half),
        solution: `The perpendicular from the centre bisects the chord, forming a right triangle with legs ${dist} and half the chord, and hypotenuse ${radius}. Half the chord is √(${radius}² − ${dist}²) = ${half}, so the chord is 2 × ${half} = ${2 * half}.`,
        hints: [
          "The perpendicular from the centre to a chord bisects that chord.",
          "Find half the chord first, then double it.",
        ],
      };
    },
    // Independent route: integer search for the missing side of the right
    // triangle, never using the subtraction above.
    check: ({ i, k, want }) => {
      const [half, dist, radius] = TRIPLES[i].map((x) => x * k);
      for (let t = 1; t <= 500; t++) {
        if (want === 1 && half * half + t * t === radius * radius) return String(t);
        if (want === 0 && t * t + dist * dist === radius * radius) return String(2 * t);
      }
      throw new Error("no side");
    },
  },

  {
    id: "gen-circle-tangent-length",
    topicSlug: "circles",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 40,
    params: (r) => ({ i: int(r, 0, TRIPLES.length - 1), k: int(r, 1, 4) }),
    build: ({ i, k }) => {
      // Radius, tangent segment and the distance to the external point form a
      // right triangle, because a tangent meets the radius at 90°.
      const [radius, tangent, dist] = TRIPLES[i].map((x) => x * k) as [number, number, number];
      return {
        question: `A circle has radius ${radius} and centre O. A point P lies ${dist} units from O, and PT is tangent to the circle at T. What is the length of PT?`,
        format: "SHORT_ANSWER",
        answer: String(tangent),
        solution: `A tangent is perpendicular to the radius at the point of tangency, so triangle OTP has a right angle at T. Then PT = √(OP² − OT²) = √(${dist}² − ${radius}²) = √${dist * dist - radius * radius} = ${tangent}.`,
        hints: [
          "A tangent line meets the radius at the point of tangency at a right angle.",
          "That gives a right triangle with OP as the hypotenuse.",
        ],
      };
    },
    // Independent route: integer search for the leg.
    check: ({ i, k }) => {
      const [radius, , dist] = TRIPLES[i].map((x) => x * k);
      for (let t = 1; t <= 500; t++) if (radius * radius + t * t === dist * dist) return String(t);
      throw new Error("no tangent");
    },
  },

  {
    id: "gen-polygon-diagonals",
    topicSlug: "polygons",
    difficulty: 3,
    competitionSlug: "mathcounts",
    variants: 37,
    params: (r) => ({ n: int(r, 4, 40) }),
    build: ({ n }) => {
      const answer = (n * (n - 3)) / 2;
      return {
        question: `How many diagonals does a convex polygon with ${n} sides have?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Each of the ${n} vertices connects by a diagonal to all but itself and its two neighbours, giving ${n} × ${n - 3} endpoints. Each diagonal is counted twice that way, so there are ${n} × ${n - 3} ÷ 2 = ${answer}.`,
        hints: [
          "From each vertex, count how many other vertices are not adjacent to it.",
          "Every diagonal gets counted once from each of its two ends.",
        ],
      };
    },
    // Independent route: enumerate every pair of vertices and discard the
    // adjacent ones, rather than using the formula.
    check: ({ n }) => {
      let count = 0;
      for (let a = 0; a < n; a++) {
        for (let b = a + 1; b < n; b++) {
          const adjacent = b - a === 1 || (a === 0 && b === n - 1);
          if (!adjacent) count++;
        }
      }
      return String(count);
    },
  },

  {
    id: "gen-polygon-exterior-each",
    topicSlug: "polygons",
    difficulty: 2,
    competitionSlug: "amc8",
    // n must divide 360 for the exterior angle to be a whole number.
    variants: 17,
    params: (r) => ({ n: pick(r, [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60]) }),
    build: ({ n }) => {
      const answer = 360 / n;
      return {
        question: `What is the measure, in degrees, of each exterior angle of a regular polygon with ${n} sides?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The exterior angles of any convex polygon sum to 360°, and in a regular polygon they are all equal. So each is 360 ÷ ${n} = ${answer}°.`,
        hints: ["The exterior angles of any convex polygon always sum to 360°.", `Divide 360 by ${n}.`],
      };
    },
    // Independent route: go via the interior angle sum instead of the 360°
    // exterior fact — each exterior angle is 180° minus the interior angle.
    check: ({ n }) => String(180 - ((n - 2) * 180) / n),
  },

  {
    id: "gen-polygon-apothem-area",
    topicSlug: "polygons",
    difficulty: 4,
    competitionSlug: "mathcounts",
    variants: 90,
    params: (r) => {
      const n = int(r, 5, 12);
      const s = int(r, 2, 20);
      const a = int(r, 2, 20);
      if ((n * s * a) % 2 !== 0) throw new Error("reject");
      return { n, s, a };
    },
    build: ({ n, s, a }) => {
      const perimeter = n * s;
      const answer = (perimeter * a) / 2;
      return {
        question: `A regular polygon has ${n} sides, each of length ${s}, and an apothem of length ${a}. What is its area?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The area of a regular polygon is half the apothem times the perimeter. The perimeter is ${n} × ${s} = ${perimeter}, so the area is ½ × ${a} × ${perimeter} = ${answer}.`,
        hints: [
          "Join the centre to every vertex — the polygon becomes a fan of identical triangles.",
          "Each triangle has base equal to a side and height equal to the apothem.",
        ],
      };
    },
    // Independent route: add up the n triangles one at a time rather than
    // using the half-apothem-times-perimeter shortcut.
    check: ({ n, s, a }) => {
      let total = 0;
      for (let i = 0; i < n; i++) total += (s * a) / 2;
      return String(total);
    },
  },

  {
    id: "gen-triangle-inequality-count",
    topicSlug: "triangles",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 110,
    params: (r) => {
      const a = int(r, 3, 40);
      const b = intExcept(r, 3, 40, [a]);
      return { a, b };
    },
    build: ({ a, b }) => {
      const answer = 2 * Math.min(a, b) - 1;
      const lo = Math.abs(a - b);
      const hi = a + b;
      return {
        question: `Two sides of a triangle have lengths ${a} and ${b}. How many integer values are possible for the length of the third side?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The triangle inequality requires the third side x to satisfy ${lo} < x < ${hi}. The integers strictly between are ${lo + 1} through ${hi - 1}, which is ${hi - 1} − ${lo + 1} + 1 = ${answer} values.`,
        hints: [
          "The third side must be less than the sum of the other two and more than their difference.",
          "Count the integers strictly between those two bounds.",
        ],
      };
    },
    // Independent route: test every candidate length against all three
    // triangle inequalities rather than counting a range.
    check: ({ a, b }) => {
      let count = 0;
      for (let c = 1; c <= a + b; c++) {
        if (a + b > c && a + c > b && b + c > a) count++;
      }
      return String(count);
    },
  },

  {
    id: "gen-triangle-exterior-angle",
    topicSlug: "triangles",
    difficulty: 3,
    competitionSlug: "amc8",
    variants: 110,
    params: (r) => {
      const a = int(r, 20, 110);
      const b = int(r, 20, 150 - a);
      if (180 - a - b < 15) throw new Error("reject");
      return { a, b };
    },
    build: ({ a, b }) => {
      const answer = a + b;
      return {
        question: `In triangle ABC, angle A measures ${a}° and angle B measures ${b}°. Side BC is extended beyond C to a point D. What is the measure of exterior angle ACD, in degrees?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `Angle ACB is 180 − ${a} − ${b} = ${180 - a - b}°, and angle ACD is its supplement: 180 − ${180 - a - b} = ${answer}°. Equivalently, an exterior angle equals the sum of the two remote interior angles: ${a} + ${b} = ${answer}°.`,
        hints: [
          "Find the third interior angle of the triangle first.",
          "The exterior angle and the adjacent interior angle form a straight line.",
        ],
      };
    },
    // Independent route: go the long way round, via the third interior angle
    // and its supplement, instead of adding the two remote angles.
    check: ({ a, b }) => {
      const third = 180 - a - b;
      return String(180 - third);
    },
  },

  {
    id: "gen-triangle-isosceles-angle",
    topicSlug: "triangles",
    difficulty: 2,
    competitionSlug: "math-kangaroo",
    variants: 110,
    params: (r) => {
      const want = int(r, 0, 1);
      // want 1 gives the apex and asks for a base angle, so it must be even.
      const v = want === 1 ? 2 * int(r, 5, 87) : int(r, 20, 88);
      return { v, want };
    },
    build: ({ v, want }) => {
      if (want === 1) {
        return {
          question: `An isosceles triangle has a vertex angle of ${v}°. What is the measure of each base angle, in degrees?`,
          format: "SHORT_ANSWER",
          answer: String((180 - v) / 2),
          solution: `The two base angles are equal and the three angles sum to 180°, so each base angle is (180 − ${v}) ÷ 2 = ${(180 - v) / 2}°.`,
          hints: ["The base angles of an isosceles triangle are equal.", "Subtract the vertex angle from 180, then halve."],
        };
      }
      return {
        question: `An isosceles triangle has base angles measuring ${v}° each. What is the measure of the vertex angle, in degrees?`,
        format: "SHORT_ANSWER",
        answer: String(180 - 2 * v),
        solution: `The two base angles account for 2 × ${v} = ${2 * v}°, so the vertex angle is 180 − ${2 * v} = ${180 - 2 * v}°.`,
        hints: ["Both base angles are equal.", "Subtract their total from 180."],
      };
    },
    // Independent route: search for the angle that makes the three sum to 180.
    check: ({ v, want }) => {
      for (let x = 1; x < 180; x++) {
        if (want === 1 && v + x + x === 180) return String(x);
        if (want === 0 && x + v + v === 180) return String(x);
      }
      throw new Error("no angle");
    },
  },

  {
    id: "gen-triangle-centroid-median",
    topicSlug: "triangles",
    difficulty: 4,
    competitionSlug: "amc10",
    variants: 60,
    params: (r) => ({ t: int(r, 2, 31), want: int(r, 0, 1) }),
    build: ({ t, want }) => {
      const m = 3 * t; // median length, kept a multiple of 3 for whole answers
      const answer = want === 1 ? 2 * t : t;
      const which = want === 1 ? "vertex" : "midpoint of the opposite side";
      return {
        question: `In a triangle, a median has length ${m}. The three medians meet at the centroid. What is the distance from the centroid to the ${which} of that median?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The centroid divides each median in a 2:1 ratio, measured from the vertex. So the median splits into ${2 * t} and ${t}, and the distance to the ${which} is ${answer}.`,
        hints: [
          "The centroid cuts every median in the same ratio, 2:1 from the vertex.",
          `Split ${m} into two parts in that ratio.`,
        ],
      };
    },
    // Independent route: solve the split by search — find the short piece x
    // such that x and 2x together make the median.
    check: ({ t, want }) => {
      const m = 3 * t;
      for (let x = 1; x <= m; x++) {
        if (x + 2 * x === m) return String(want === 1 ? 2 * x : x);
      }
      throw new Error("no split");
    },
  },

  {
    id: "gen-triangle-angle-bisector",
    topicSlug: "triangles",
    difficulty: 5,
    competitionSlug: "amc10",
    variants: 90,
    params: (r) => {
      const c = int(r, 3, 24); // AB
      const b = intExcept(r, 3, 24, [c]); // AC
      // BD = a·c/(b + c), so for a whole-number answer BC must be a multiple
      // of (b + c)/gcd(b, c). BC must also be shorter than b + c to be a real
      // triangle, which leaves room only when b and c share a factor.
      const g = gcd(b, c);
      if (g === 1) throw new Error("reject");
      const step = (b + c) / g;
      const a = step * int(r, 1, g - 1);
      if (a <= Math.abs(b - c) || a >= b + c) throw new Error("reject");
      return { a, b, c };
    },
    build: ({ a, b, c }) => {
      const answer = (a * c) / (b + c);
      return {
        question: `In triangle ABC, AB = ${c}, AC = ${b}, and BC = ${a}. The bisector of angle A meets BC at D. What is the length of BD?`,
        format: "SHORT_ANSWER",
        answer: String(answer),
        solution: `The angle bisector theorem gives BD/DC = AB/AC = ${c}/${b}. Since BD + DC = ${a}, BD is ${c}/(${c} + ${b}) of ${a}, which is ${a} × ${c} ÷ ${b + c} = ${answer}.`,
        hints: [
          "The bisector from A divides BC in the ratio of the two sides adjacent to A.",
          "Split BC into parts in that ratio.",
        ],
      };
    },
    // Independent route: search for the split point satisfying the ratio
    // as a cross-multiplied equation, rather than computing the share.
    check: ({ a, b, c }) => {
      for (let bd = 1; bd < a; bd++) {
        const dc = a - bd;
        if (bd * b === dc * c) return String(bd);
      }
      throw new Error("no split");
    },
  },
];
