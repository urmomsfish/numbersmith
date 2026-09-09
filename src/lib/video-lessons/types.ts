// A "video lesson" has no audio track and no actual video file — it's an
// animated, scripted walkthrough rendered client-side scene by scene. This
// keeps lessons diffable/reviewable as data and needs no media pipeline.
// `VideoLesson.scenes` in the database is this array, JSON-encoded.

export type NumberlinePoint = {
  value: number;
  label: string;
  tone?: "brand" | "success" | "warning";
};

export type BarSegment = {
  label: string;
  value: number;
  tone?: "brand" | "success" | "warning" | "slate";
};

export type EquationLine = {
  expr: string;
  note?: string;
};

export type VennSet = {
  label: string;
  onlyCount: number;
  tone?: "brand" | "success";
};

export type CountingBranch = {
  label: string;
  children?: CountingBranch[];
};

export type Diagram =
  | { kind: "numberline"; min: number; max: number; points: NumberlinePoint[]; note?: string }
  | { kind: "bars"; total: number; segments: BarSegment[]; note?: string }
  | { kind: "equationSteps"; lines: EquationLine[] }
  | { kind: "triangleAngles"; angles: [number, number, number]; labels: [string, string, string] }
  | { kind: "circle"; radius: number; showRadius?: boolean; inscribedAngle?: { at: string; arc: string } }
  | { kind: "vennTwo"; left: VennSet; right: VennSet; both: number; universe?: number }
  | { kind: "modularClock"; modulus: number; highlight: number[]; note?: string }
  | { kind: "countingTree"; root: string; branches: CountingBranch[] };

export type Scene =
  | { type: "title"; heading: string; sub: string }
  | { type: "text"; heading: string; bullets: string[]; diagram?: Diagram }
  | { type: "example"; heading: string; prompt: string; bullets: string[]; diagram?: Diagram }
  | { type: "strategy"; heading: string; bullets: string[] }
  | { type: "pitfall"; heading: string; bullets: string[] }
  | { type: "summary"; heading: string; bullets: string[] };

export type VideoLessonSeed = {
  slug: string;
  title: string;
  topicSlug: string;
  difficulty: number;
  durationMinutes: number;
  summary: string;
  scenes: Scene[];
};
