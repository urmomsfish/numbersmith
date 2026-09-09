import { cn } from "@/lib/cn";
import type { Diagram } from "@/lib/video-lessons/types";

const TONE_STROKE: Record<string, string> = {
  brand: "text-brand-600 dark:text-brand-400",
  success: "text-success-600 dark:text-success-400",
  warning: "text-warning-600 dark:text-warning-400",
  slate: "text-slate-400 dark:text-slate-500",
};
const TONE_FILL: Record<string, string> = {
  brand: "fill-brand-500/80",
  success: "fill-success-500/80",
  warning: "fill-warning-500/80",
  slate: "fill-slate-400/70",
};

export function DiagramCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-center justify-center rounded-xl border border-slate-200 bg-background px-4 py-6 dark:border-slate-700">
      {children}
    </div>
  );
}

export function DiagramRenderer({ diagram }: { diagram: Diagram }) {
  switch (diagram.kind) {
    case "numberline":
      return <Numberline {...diagram} />;
    case "bars":
      return <Bars {...diagram} />;
    case "equationSteps":
      return <EquationSteps {...diagram} />;
    case "triangleAngles":
      return <TriangleAngles {...diagram} />;
    case "circle":
      return <CircleDiagram {...diagram} />;
    case "vennTwo":
      return <VennTwo {...diagram} />;
    case "modularClock":
      return <ModularClock {...diagram} />;
    case "countingTree":
      return <CountingTree {...diagram} />;
    default:
      return null;
  }
}

function Numberline({
  min,
  max,
  points,
  note,
}: Extract<Diagram, { kind: "numberline" }>) {
  const width = 560;
  const pad = 30;
  const x = (v: number) => pad + ((v - min) / (max - min)) * (width - pad * 2);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <DiagramCanvas>
      <div>
        <svg viewBox={`0 0 ${width} 90`} className="w-full max-w-xl text-slate-400 dark:text-slate-500">
          <line x1={pad} y1="40" x2={width - pad} y2="40" stroke="currentColor" strokeWidth="1.5" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} y1="35" x2={x(t)} y2="45" stroke="currentColor" strokeWidth="1.5" />
              <text x={x(t)} y="60" fontSize="11" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500">
                {t}
              </text>
            </g>
          ))}
          {points.map((p, i) => (
            <g key={i} className={TONE_STROKE[p.tone ?? "brand"]}>
              <circle cx={x(p.value)} cy="40" r="6" className={TONE_FILL[p.tone ?? "brand"]} stroke="currentColor" strokeWidth="1.5" />
              <text x={x(p.value)} y="22" fontSize="11" fontWeight="600" textAnchor="middle" fill="currentColor">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        {note && <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function Bars({ total, segments, note }: Extract<Diagram, { kind: "bars" }>) {
  return (
    <DiagramCanvas>
      <div className="w-full max-w-md">
        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
          {segments.map((s, i) => (
            <div
              key={i}
              style={{ width: `${(s.value / total) * 100}%` }}
              className={cn(
                "flex items-center justify-center border-r border-white/40 text-xs font-semibold text-white last:border-r-0 dark:border-slate-900/40",
                {
                  brand: "bg-brand-500",
                  success: "bg-success-500",
                  warning: "bg-warning-500",
                  slate: "bg-slate-400",
                }[s.tone ?? "brand"]
              )}
            >
              {s.label}
            </div>
          ))}
        </div>
        {note && <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function EquationSteps({ lines }: Extract<Diagram, { kind: "equationSteps" }>) {
  return (
    <DiagramCanvas>
      <div className="w-full max-w-sm space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-baseline justify-between gap-3 rounded-lg bg-card px-3 py-2">
            <code className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">{l.expr}</code>
            {l.note && <span className="text-xs text-slate-400 dark:text-slate-500">{l.note}</span>}
          </div>
        ))}
      </div>
    </DiagramCanvas>
  );
}

function TriangleAngles({ angles, labels }: Extract<Diagram, { kind: "triangleAngles" }>) {
  const pts = [
    [110, 20],
    [20, 160],
    [200, 160],
  ] as const;
  return (
    <DiagramCanvas>
      <svg viewBox="0 0 220 180" className="h-44 w-auto text-brand-500 dark:text-brand-400">
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <text
            key={i}
            x={p[0]}
            y={i === 0 ? p[1] - 8 : p[1] + (i === 1 ? -8 : 16)}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            className="fill-slate-900 dark:fill-slate-50"
          >
            {labels[i]} = {angles[i]}°
          </text>
        ))}
      </svg>
    </DiagramCanvas>
  );
}

function CircleDiagram({ radius, showRadius, inscribedAngle }: Extract<Diagram, { kind: "circle" }>) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  return (
    <DiagramCanvas>
      <svg viewBox="0 0 200 200" className="h-44 w-44 text-brand-500 dark:text-brand-400">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" />
        {showRadius && (
          <>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={cx + r / 2} y={cy - 6} fontSize="11" className="fill-slate-500 dark:fill-slate-400">
              r = {radius}
            </text>
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-900 dark:fill-slate-50" />
          </>
        )}
        {inscribedAngle && (
          <>
            <line x1={cx - r} y1={cy} x2={cx} y2={cy - r} stroke="currentColor" strokeWidth="2" className="text-success-500" />
            <line x1={cx + r} y1={cy} x2={cx} y2={cy - r} stroke="currentColor" strokeWidth="2" className="text-success-500" />
            <text x={cx} y={cy - r + 26} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-success-600 dark:fill-success-400">
              {inscribedAngle.at}
            </text>
            <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">
              arc {inscribedAngle.arc}
            </text>
          </>
        )}
      </svg>
    </DiagramCanvas>
  );
}

function VennTwo({ left, right, both, universe }: Extract<Diagram, { kind: "vennTwo" }>) {
  return (
    <DiagramCanvas>
      <div>
        <svg viewBox="0 0 260 160" className="h-36 w-auto">
          <circle cx="100" cy="80" r="65" className={cn(TONE_STROKE[left.tone ?? "brand"], "fill-brand-500/10")} stroke="currentColor" strokeWidth="2" />
          <circle cx="160" cy="80" r="65" className={cn(TONE_STROKE[right.tone ?? "success"], "fill-success-500/10")} stroke="currentColor" strokeWidth="2" />
          <text x="70" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-900 dark:fill-slate-50">
            {left.onlyCount}
          </text>
          <text x="130" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-900 dark:fill-slate-50">
            {both}
          </text>
          <text x="190" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-900 dark:fill-slate-50">
            {right.onlyCount}
          </text>
          <text x="70" y="30" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-brand-600 dark:fill-brand-400">
            {left.label}
          </text>
          <text x="190" y="30" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-success-600 dark:fill-success-400">
            {right.label}
          </text>
        </svg>
        {universe !== undefined && (
          <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">Total: {universe}</p>
        )}
      </div>
    </DiagramCanvas>
  );
}

function ModularClock({ modulus, highlight, note }: Extract<Diagram, { kind: "modularClock" }>) {
  const r = 65;
  const cx = 90;
  const cy = 90;
  const positions = Array.from({ length: modulus }, (_, i) => {
    const angle = (i / modulus) * 2 * Math.PI - Math.PI / 2;
    return { n: i, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <DiagramCanvas>
      <div>
        <svg viewBox="0 0 180 180" className="h-44 w-44 text-slate-300 dark:text-slate-600">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
          {positions.map((p) => (
            <g key={p.n}>
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                className={highlight.includes(p.n) ? "fill-brand-500 text-brand-500" : "fill-card text-slate-300 dark:text-slate-600"}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className={highlight.includes(p.n) ? "fill-white" : "fill-slate-600 dark:fill-slate-300"}
              >
                {p.n}
              </text>
            </g>
          ))}
        </svg>
        {note && <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function CountingTree({ root, branches }: Extract<Diagram, { kind: "countingTree" }>) {
  return (
    <DiagramCanvas>
      <div className="flex flex-col items-center">
        <div className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">{root}</div>
        <div className="mt-3 flex gap-4">
          {branches.map((b, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
              <div className="rounded-lg border border-slate-300 bg-card px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                {b.label}
              </div>
              {b.children && b.children.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {b.children.map((c, j) => (
                    <div key={j} className="flex flex-col items-center">
                      <div className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
                      <div className="rounded border border-slate-200 bg-background px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        {c.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DiagramCanvas>
  );
}
