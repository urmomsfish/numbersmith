import { type Generator, int, intExcept, pick } from "./framework";

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
];
