export type TopicSeed = {
  slug: string;
  name: string;
  order: number;
  children?: { slug: string; name: string; order: number }[];
};

export const TOPICS: TopicSeed[] = [
  {
    slug: "arithmetic",
    name: "Arithmetic",
    order: 1,
    children: [
      { slug: "fractions", name: "Fractions", order: 1 },
      { slug: "ratios-proportions", name: "Ratios & Proportions", order: 2 },
      { slug: "percentages", name: "Percentages", order: 3 },
      { slug: "rates", name: "Rates", order: 4 },
      { slug: "averages", name: "Averages", order: 5 },
      { slug: "number-properties", name: "Number Properties", order: 6 },
    ],
  },
  {
    slug: "algebra",
    name: "Algebra",
    order: 2,
    children: [
      { slug: "linear-equations", name: "Linear Equations", order: 1 },
      { slug: "systems-of-equations", name: "Systems of Equations", order: 2 },
      { slug: "inequalities", name: "Inequalities", order: 3 },
      { slug: "factoring", name: "Factoring", order: 4 },
      { slug: "polynomials", name: "Polynomials", order: 5 },
      { slug: "exponents-radicals", name: "Exponents & Radicals", order: 6 },
      { slug: "sequences", name: "Sequences", order: 7 },
      { slug: "functions", name: "Functions", order: 8 },
      { slug: "quadratics", name: "Quadratics", order: 9 },
    ],
  },
  {
    slug: "geometry",
    name: "Geometry",
    order: 3,
    children: [
      { slug: "angles", name: "Angles", order: 1 },
      { slug: "triangles", name: "Triangles", order: 2 },
      { slug: "quadrilaterals", name: "Quadrilaterals", order: 3 },
      { slug: "polygons", name: "Polygons", order: 4 },
      { slug: "circles", name: "Circles", order: 5 },
      { slug: "similarity-congruence", name: "Similarity & Congruence", order: 6 },
      { slug: "coordinate-geometry", name: "Coordinate Geometry", order: 7 },
      { slug: "area-volume", name: "Area & Volume", order: 8 },
      { slug: "transformations", name: "Transformations", order: 9 },
      { slug: "three-d-geometry", name: "3D Geometry", order: 10 },
    ],
  },
  {
    slug: "number-theory",
    name: "Number Theory",
    order: 4,
    children: [
      { slug: "divisibility", name: "Divisibility", order: 1 },
      { slug: "primes", name: "Prime Numbers", order: 2 },
      { slug: "modular-arithmetic", name: "Modular Arithmetic", order: 3 },
      { slug: "diophantine-equations", name: "Diophantine Equations", order: 4 },
      { slug: "factorization", name: "Factorization", order: 5 },
      { slug: "number-patterns", name: "Number Patterns", order: 6 },
      { slug: "integer-properties", name: "Integer Properties", order: 7 },
    ],
  },
  {
    slug: "combinatorics",
    name: "Combinatorics",
    order: 5,
    children: [
      { slug: "counting-principles", name: "Counting Principles", order: 1 },
      { slug: "permutations", name: "Permutations", order: 2 },
      { slug: "combinations", name: "Combinations", order: 3 },
      { slug: "casework", name: "Casework", order: 4 },
      { slug: "pigeonhole", name: "Pigeonhole Principle", order: 5 },
      { slug: "inclusion-exclusion", name: "Inclusion-Exclusion", order: 6 },
      { slug: "recursion-in-counting", name: "Recursion in Counting", order: 7 },
      { slug: "graph-theory", name: "Graph Theory", order: 8 },
    ],
  },
  {
    slug: "probability",
    name: "Probability",
    order: 6,
    children: [
      { slug: "basic-probability", name: "Basic Probability", order: 1 },
      { slug: "conditional-probability", name: "Conditional Probability", order: 2 },
      { slug: "expected-value", name: "Expected Value", order: 3 },
      { slug: "counting-probability", name: "Counting Probability", order: 4 },
      { slug: "games-and-strategies", name: "Games & Strategies", order: 5 },
    ],
  },
  {
    slug: "logic",
    name: "Logic",
    order: 7,
    children: [
      { slug: "deduction", name: "Deduction", order: 1 },
      { slug: "logical-puzzles", name: "Logical Puzzles", order: 2 },
      { slug: "patterns", name: "Patterns", order: 3 },
      { slug: "invariants", name: "Invariants", order: 4 },
      { slug: "strategy", name: "Strategy", order: 5 },
    ],
  },
  {
    slug: "advanced-olympiad",
    name: "Advanced / Olympiad",
    order: 8,
    children: [
      { slug: "functional-equations", name: "Functional Equations", order: 1 },
      { slug: "advanced-number-theory", name: "Advanced Number Theory", order: 2 },
      { slug: "advanced-combinatorics", name: "Advanced Combinatorics", order: 3 },
      { slug: "advanced-geometry", name: "Advanced Geometry", order: 4 },
      { slug: "inequalities-olympiad", name: "Inequalities", order: 5 },
      { slug: "proof-techniques", name: "Proof Techniques", order: 6 },
    ],
  },
];
