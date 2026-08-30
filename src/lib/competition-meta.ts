export const FORMAT_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  SHORT_ANSWER: "Short Answer",
  INTEGER: "Short Answer (Integer)",
  PROOF: "Proof-Based",
};

export const TEAM_LABEL: Record<string, string> = {
  INDIVIDUAL: "Individual",
  TEAM: "Team",
  BOTH: "Individual + Team",
};

export const CATEGORY_LABEL: Record<string, string> = {
  ELEMENTARY_MIDDLE: "Elementary / Middle School",
  HIGH_SCHOOL: "High School",
  OLYMPIAD: "Olympiad / Advanced",
};

export function gradeRangeLabel(min: number, max: number) {
  const fmt = (g: number) => (g === 0 ? "K" : String(g));
  return min === max ? `Grade ${fmt(min)}` : `Grades ${fmt(min)}–${fmt(max)}`;
}

export function difficultyRangeLabel(min: number, max: number) {
  const label = (d: number) => {
    if (d <= 2) return "Beginner";
    if (d <= 4) return "Intermediate";
    if (d <= 6) return "Advanced";
    if (d <= 8) return "Expert";
    return "Olympiad";
  };
  const lo = label(min);
  const hi = label(max);
  return lo === hi ? lo : `${lo} → ${hi}`;
}
