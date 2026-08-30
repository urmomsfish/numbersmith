export type CompetitionSeed = {
  slug: string;
  name: string;
  shortName: string;
  category: "ELEMENTARY_MIDDLE" | "HIGH_SCHOOL" | "OLYMPIAD";
  format: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "INTEGER" | "PROOF";
  individualOrTeam: "INDIVIDUAL" | "TEAM" | "BOTH";
  gradeMin: number;
  gradeMax: number;
  difficultyMin: number;
  difficultyMax: number;
  numQuestions: number | null;
  timeLimitMinutes: number | null;
  organization: string;
  description: string;
  roadmap: string;
  order: number;
};

export const COMPETITIONS: CompetitionSeed[] = [
  // ---- Elementary / Middle School ----
  {
    slug: "math-kangaroo",
    name: "Math Kangaroo",
    shortName: "Kangaroo",
    category: "ELEMENTARY_MIDDLE",
    format: "MULTIPLE_CHOICE",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 1,
    gradeMax: 8,
    difficultyMin: 1,
    difficultyMax: 4,
    numQuestions: 24,
    timeLimitMinutes: 75,
    organization: "Math Kangaroo in USA (practice track, not officially affiliated)",
    description:
      "A playful, puzzle-driven multiple-choice competition open to a wide range of grade levels, emphasizing creative problem solving over rote computation.",
    roadmap:
      "Build fluency with arithmetic and simple logic puzzles, then layer in early geometry and pattern-recognition problems under light time pressure.",
    order: 1,
  },
  {
    slug: "moems",
    name: "Math Olympiads for Elementary and Middle Schools",
    shortName: "MOEMS",
    category: "ELEMENTARY_MIDDLE",
    format: "SHORT_ANSWER",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 2,
    gradeMax: 8,
    difficultyMin: 1,
    difficultyMax: 4,
    numQuestions: 5,
    timeLimitMinutes: 30,
    organization: "MOEMS (practice track, not officially affiliated)",
    description:
      "Short, five-problem contests (Division E for grades 2-6, Division M for grades 5-8) that reward clean reasoning over multiple steps rather than speed alone.",
    roadmap:
      "Focus on multi-step word problems with clean integer answers — practice showing full reasoning, not just guessing from choices.",
    order: 2,
  },
  {
    slug: "mathcounts",
    name: "MATHCOUNTS",
    shortName: "MATHCOUNTS",
    category: "ELEMENTARY_MIDDLE",
    format: "SHORT_ANSWER",
    individualOrTeam: "BOTH",
    gradeMin: 6,
    gradeMax: 8,
    difficultyMin: 3,
    difficultyMax: 6,
    numQuestions: 30,
    timeLimitMinutes: 40,
    organization: "MATHCOUNTS Foundation (practice track, not officially affiliated)",
    description:
      "The premier US middle school competition with four rounds: Sprint (speed), Target (depth), Team (collaboration), and Countdown (head-to-head buzzer round).",
    roadmap:
      "Drill Sprint-style speed sets, then slow down for Target-style multi-step problems, and finish with timed Countdown-style mental math reps.",
    order: 3,
  },
  {
    slug: "amc8",
    name: "AMC 8",
    shortName: "AMC 8",
    category: "ELEMENTARY_MIDDLE",
    format: "MULTIPLE_CHOICE",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 6,
    gradeMax: 8,
    difficultyMin: 2,
    difficultyMax: 5,
    numQuestions: 25,
    timeLimitMinutes: 40,
    organization: "MAA (practice track, not officially affiliated)",
    description:
      "A 25-question, 40-minute multiple-choice contest for students in grade 8 and below, covering arithmetic, pre-algebra, and introductory geometry and counting.",
    roadmap:
      "Build broad topic coverage first, then run full 25-question / 40-minute simulations to build pacing and multiple-choice elimination strategy.",
    order: 4,
  },
  {
    slug: "purple-comet",
    name: "Purple Comet Math Meet",
    shortName: "Purple Comet",
    category: "HIGH_SCHOOL",
    format: "INTEGER",
    individualOrTeam: "TEAM",
    gradeMin: 6,
    gradeMax: 12,
    difficultyMin: 3,
    difficultyMax: 8,
    numQuestions: 20,
    timeLimitMinutes: 120,
    organization: "Purple Comet (practice track, not officially affiliated)",
    description:
      "A free online team competition with Middle and High School divisions, featuring integer-answer problems that increase steadily in difficulty.",
    roadmap:
      "Practice integer-answer problem sets in increasing difficulty order, and rehearse team communication and problem-splitting strategy.",
    order: 5,
  },
  {
    slug: "math-league-elementary-middle",
    name: "Math League (Elementary & Middle School)",
    shortName: "Math League",
    category: "ELEMENTARY_MIDDLE",
    format: "SHORT_ANSWER",
    individualOrTeam: "BOTH",
    gradeMin: 4,
    gradeMax: 8,
    difficultyMin: 2,
    difficultyMax: 5,
    numQuestions: 6,
    timeLimitMinutes: 30,
    organization: "Math League (practice track, not officially affiliated)",
    description:
      "A season-long series of short contests testing grade-appropriate topics with an emphasis on consistent, steady scoring across the year.",
    roadmap:
      "Build steady topic-by-topic mastery so accuracy stays high across every contest in the season, not just a single test date.",
    order: 6,
  },

  // ---- High School ----
  {
    slug: "amc10",
    name: "AMC 10",
    shortName: "AMC 10",
    category: "HIGH_SCHOOL",
    format: "MULTIPLE_CHOICE",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 8,
    gradeMax: 10,
    difficultyMin: 4,
    difficultyMax: 7,
    numQuestions: 25,
    timeLimitMinutes: 75,
    organization: "MAA (practice track, not officially affiliated)",
    description:
      "A 25-question, 75-minute multiple-choice contest for students in grade 10 and below, covering algebra, geometry, number theory, combinatorics, and probability.",
    roadmap:
      "Strengthen algebra and geometry fundamentals, then build speed with mixed topic sets and full-length timed simulations.",
    order: 7,
  },
  {
    slug: "amc12",
    name: "AMC 12",
    shortName: "AMC 12",
    category: "HIGH_SCHOOL",
    format: "MULTIPLE_CHOICE",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 10,
    gradeMax: 12,
    difficultyMin: 5,
    difficultyMax: 8,
    numQuestions: 25,
    timeLimitMinutes: 75,
    organization: "MAA (practice track, not officially affiliated)",
    description:
      "The senior sibling of the AMC 10, adding trigonometry, logarithms, and more advanced algebra and geometry to the same 25-question format.",
    roadmap:
      "Layer advanced algebra, trig, and complex numbers on top of AMC 10 fundamentals, then push pacing with full simulations.",
    order: 8,
  },
  {
    slug: "aime",
    name: "American Invitational Mathematics Examination",
    shortName: "AIME",
    category: "HIGH_SCHOOL",
    format: "INTEGER",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 6,
    difficultyMax: 9,
    numQuestions: 15,
    timeLimitMinutes: 180,
    organization: "MAA (practice track, not officially affiliated)",
    description:
      "An invitational 15-question, 3-hour exam for top AMC scorers, requiring an integer answer from 0-999 with no multiple-choice safety net.",
    roadmap:
      "Master integer-answer techniques (no elimination strategy to fall back on), and build the stamina for a 3-hour, 15-question format.",
    order: 9,
  },
  {
    slug: "arml",
    name: "American Regions Mathematics League",
    shortName: "ARML",
    category: "HIGH_SCHOOL",
    format: "SHORT_ANSWER",
    individualOrTeam: "TEAM",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 5,
    difficultyMax: 9,
    numQuestions: 10,
    timeLimitMinutes: 60,
    organization: "ARML (practice track, not officially affiliated)",
    description:
      "A team-oriented competition combining individual, relay, and full-team rounds, rewarding both deep problem solving and collaboration under time pressure.",
    roadmap:
      "Train individually on advanced mixed-topic sets, then practice relay-style problems where each answer feeds the next.",
    order: 10,
  },
  {
    slug: "hmmt",
    name: "Harvard-MIT Mathematics Tournament",
    shortName: "HMMT",
    category: "HIGH_SCHOOL",
    format: "SHORT_ANSWER",
    individualOrTeam: "BOTH",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 7,
    difficultyMax: 10,
    numQuestions: 10,
    timeLimitMinutes: 50,
    organization: "HMMT (practice track, not officially affiliated)",
    description:
      "One of the most competitive high school tournaments, with subject-specific rounds (Algebra, Geometry, Combinatorics, Number Theory) plus team and guts rounds.",
    roadmap:
      "Specialize in one subject round at a time, building deep pattern libraries for algebra, geometry, combinatorics, and number theory separately.",
    order: 11,
  },
  {
    slug: "pumac",
    name: "Princeton University Mathematics Competition",
    shortName: "PUMaC",
    category: "HIGH_SCHOOL",
    format: "SHORT_ANSWER",
    individualOrTeam: "BOTH",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 7,
    difficultyMax: 10,
    numQuestions: 10,
    timeLimitMinutes: 60,
    organization: "PUMaC (practice track, not officially affiliated)",
    description:
      "A large university-run tournament with individual subject tests and team rounds, similar in spirit and difficulty to HMMT.",
    roadmap:
      "Continue subject-round specialization from HMMT prep, with an emphasis on speed across many short, hard problems.",
    order: 12,
  },
  {
    slug: "stanford-math-tournament",
    name: "Stanford Math Tournament",
    shortName: "SMT",
    category: "HIGH_SCHOOL",
    format: "SHORT_ANSWER",
    individualOrTeam: "BOTH",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 6,
    difficultyMax: 9,
    numQuestions: 10,
    timeLimitMinutes: 50,
    organization: "SMT (practice track, not officially affiliated)",
    description:
      "A university-hosted tournament-style competition with general and subject-specific rounds for advanced high school students.",
    roadmap:
      "Blend general mixed-topic rounds with focused subject practice to prepare for both formats.",
    order: 13,
  },
  {
    slug: "math-league-high-school",
    name: "Math League (High School)",
    shortName: "Math League",
    category: "HIGH_SCHOOL",
    format: "MULTIPLE_CHOICE",
    individualOrTeam: "BOTH",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 4,
    difficultyMax: 7,
    numQuestions: 6,
    timeLimitMinutes: 30,
    organization: "Math League (practice track, not officially affiliated)",
    description:
      "A season-long series of short high-school-level contests, testing consistent mastery of the core high school curriculum plus competition techniques.",
    roadmap:
      "Focus on consistency across many short contests rather than one high-stakes exam — steady weekly practice compounds here.",
    order: 14,
  },
  {
    slug: "math-prize-for-girls",
    name: "Math Prize for Girls",
    shortName: "Math Prize for Girls",
    category: "HIGH_SCHOOL",
    format: "SHORT_ANSWER",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 7,
    difficultyMax: 10,
    numQuestions: 20,
    timeLimitMinutes: 120,
    organization: "Advantage Testing Foundation (practice track, not officially affiliated)",
    description:
      "A prestigious invitational competition for young women excelling in mathematics, featuring short-answer problems at AIME-and-beyond difficulty.",
    roadmap:
      "Push into AIME-and-above difficulty with an emphasis on clean short-answer writeups under real time pressure.",
    order: 15,
  },

  // ---- Olympiad / Advanced ----
  {
    slug: "usamts",
    name: "USA Mathematical Talent Search",
    shortName: "USAMTS",
    category: "OLYMPIAD",
    format: "PROOF",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 8,
    gradeMax: 12,
    difficultyMin: 7,
    difficultyMax: 10,
    numQuestions: 5,
    timeLimitMinutes: null,
    organization: "USAMTS (practice track, not officially affiliated)",
    description:
      "An untimed, at-home proof-based competition — the ideal on-ramp from short-answer contests into full olympiad-style proof writing.",
    roadmap:
      "Start writing full proofs (not just final answers): justify every step, and practice explaining *why*, not only *what*.",
    order: 16,
  },
  {
    slug: "usamo",
    name: "USA Mathematical Olympiad",
    shortName: "USAMO",
    category: "OLYMPIAD",
    format: "PROOF",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 9,
    difficultyMax: 10,
    numQuestions: 6,
    timeLimitMinutes: 270,
    organization: "MAA (practice track, not officially affiliated)",
    description:
      "The premier US olympiad, a six-problem, two-day proof-based exam for the nation's top AIME qualifiers.",
    roadmap:
      "Master core olympiad techniques — invariants, extremal principle, induction, clever constructions — across algebra, geometry, number theory, and combinatorics.",
    order: 17,
  },
  {
    slug: "imo",
    name: "International Mathematical Olympiad",
    shortName: "IMO",
    category: "OLYMPIAD",
    format: "PROOF",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 9,
    difficultyMax: 10,
    numQuestions: 6,
    timeLimitMinutes: 270,
    organization: "IMO (practice track, not officially affiliated)",
    description:
      "The world championship of mathematical problem solving — six proof-based problems across two days for national teams worldwide.",
    roadmap:
      "Refine olympiad proof technique to international competition standard, with heavy emphasis on functional equations and advanced geometry.",
    order: 18,
  },
  {
    slug: "imo-shortlist",
    name: "IMO Shortlist",
    shortName: "IMO Shortlist",
    category: "OLYMPIAD",
    format: "PROOF",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 10,
    gradeMax: 12,
    difficultyMin: 9,
    difficultyMax: 10,
    numQuestions: null,
    timeLimitMinutes: null,
    organization: "IMO (practice track, not officially affiliated)",
    description:
      "The curated pool of hardest candidate problems considered for the IMO each year — a training staple for advanced olympiad students.",
    roadmap:
      "Work shortlist-style problems by subject area, focusing on the hardest 20% of problems within each topic.",
    order: 19,
  },
  {
    slug: "egmo",
    name: "European Girls' Mathematical Olympiad",
    shortName: "EGMO",
    category: "OLYMPIAD",
    format: "PROOF",
    individualOrTeam: "INDIVIDUAL",
    gradeMin: 9,
    gradeMax: 12,
    difficultyMin: 8,
    difficultyMax: 10,
    numQuestions: 6,
    timeLimitMinutes: 270,
    organization: "EGMO (practice track, not officially affiliated)",
    description:
      "An international olympiad for young women, proof-based and structured like the IMO across two days of competition.",
    roadmap:
      "Follow an IMO-style prep track with a slightly gentler difficulty ramp, ideal for olympiad newcomers aiming at national team selection.",
    order: 20,
  },
];
