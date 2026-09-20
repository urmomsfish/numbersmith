import { cn } from "@/lib/cn";
import type { Diagram } from "@/lib/video-lessons/types";

// Diagrams only ever render inside the video stage (scene-player.tsx), which
// forces a permanent dark "player chrome" regardless of site theme, so
// these use flat white/slate-on-dark colors rather than the app's usual
// light/dark: pairs.

const TONE_STROKE: Record<string, string> = {
  brand: "text-brand-400",
  success: "text-success-500",
  warning: "text-warning-500",
  slate: "text-slate-400",
};
const TONE_FILL: Record<string, string> = {
  brand: "fill-brand-500/80",
  success: "fill-success-500/80",
  warning: "fill-warning-500/80",
  slate: "fill-slate-400/70",
};
const TONE_BG: Record<string, string> = {
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  slate: "bg-slate-500",
};

/** SVG stroke "draw-on": animates dashoffset from the path's own length to 0. */
function drawStyle(len: number, delayMs: number): React.CSSProperties {
  return {
    strokeDasharray: len,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ["--draw-len" as any]: len,
    animation: `draw-on 0.9s ease-out ${delayMs}ms both`,
  };
}

export function DiagramCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-6">
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

function Numberline({ min, max, points, note }: Extract<Diagram, { kind: "numberline" }>) {
  const width = 560;
  const pad = 30;
  const x = (v: number) => pad + ((v - min) / (max - min)) * (width - pad * 2);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const lineLen = width - pad * 2;

  return (
    <DiagramCanvas>
      <div>
        <svg viewBox={`0 0 ${width} 90`} className="w-full max-w-xl text-slate-500">
          <line
            x1={pad}
            y1="40"
            x2={width - pad}
            y2="40"
            stroke="currentColor"
            strokeWidth="1.5"
            style={drawStyle(lineLen, 0)}
          />
          {ticks.map((t) => (
            <g key={t} className="animate-[fade-up_0.3s_ease-out_both]" style={{ animationDelay: "500ms" }}>
              <line x1={x(t)} y1="35" x2={x(t)} y2="45" stroke="currentColor" strokeWidth="1.5" />
              <text x={x(t)} y="60" fontSize="11" textAnchor="middle" className="fill-slate-500">
                {t}
              </text>
            </g>
          ))}
          {points.map((p, i) => (
            <g
              key={i}
              className={cn(TONE_STROKE[p.tone ?? "brand"], "origin-center animate-[pop-in_0.4s_ease-out_both]")}
              style={{ animationDelay: `${650 + i * 220}ms`, transformOrigin: `${x(p.value)}px 40px` }}
            >
              <circle cx={x(p.value)} cy="40" r="6" className={TONE_FILL[p.tone ?? "brand"]} stroke="currentColor" strokeWidth="1.5" />
              <text x={x(p.value)} y="22" fontSize="11" fontWeight="600" textAnchor="middle" fill="currentColor">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        {note && <p className="mt-2 text-center text-xs text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function Bars({ total, segments, note }: Extract<Diagram, { kind: "bars" }>) {
  return (
    <DiagramCanvas>
      <div className="w-full max-w-md">
        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-white/20">
          {segments.map((s, i) => (
            <div
              key={i}
              style={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--target-w" as any]: `${(s.value / total) * 100}%`,
                animation: `grow-w 0.7s ease-out ${i * 250}ms both`,
              }}
              className={cn(
                "flex items-center justify-center overflow-hidden border-r border-black/20 text-xs font-semibold whitespace-nowrap text-white last:border-r-0",
                TONE_BG[s.tone ?? "brand"]
              )}
            >
              {s.label}
            </div>
          ))}
        </div>
        {note && <p className="mt-2 text-center text-xs text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function EquationSteps({ lines }: Extract<Diagram, { kind: "equationSteps" }>) {
  return (
    <DiagramCanvas>
      <div className="w-full max-w-sm space-y-2">
        {lines.map((l, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 350}ms` }}
            className="flex items-baseline justify-between gap-3 rounded-lg bg-white/10 px-3 py-2 opacity-0 animate-[fade-up_0.4s_ease-out_forwards]"
          >
            <code className="font-mono text-sm font-semibold text-slate-50">{l.expr}</code>
            {l.note && <span className="text-xs text-slate-400">{l.note}</span>}
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
  const perimeter =
    Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]) +
    Math.hypot(pts[1][0] - pts[2][0], pts[1][1] - pts[2][1]) +
    Math.hypot(pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]);
  return (
    <DiagramCanvas>
      <svg viewBox="0 0 220 180" className="h-44 w-auto text-brand-400">
        <polygon
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          style={drawStyle(perimeter, 0)}
        />
        {pts.map((p, i) => (
          <text
            key={i}
            x={p[0]}
            y={i === 0 ? p[1] - 8 : p[1] + (i === 1 ? -8 : 16)}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            className="fill-slate-50 opacity-0 animate-[fade-up_0.4s_ease-out_forwards]"
            style={{ animationDelay: `${900 + i * 200}ms` }}
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
  const circumference = 2 * Math.PI * r;
  return (
    <DiagramCanvas>
      <svg viewBox="0 0 200 200" className="h-44 w-44 text-brand-400">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" style={drawStyle(circumference, 0)} />
        {showRadius && (
          <g className="opacity-0 animate-[fade-up_0.4s_ease-out_forwards]" style={{ animationDelay: "700ms" }}>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={cx + r / 2} y={cy - 6} fontSize="11" className="fill-slate-400">
              r = {radius}
            </text>
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-50" />
          </g>
        )}
        {inscribedAngle && (
          <g className="opacity-0 animate-[fade-up_0.4s_ease-out_forwards]" style={{ animationDelay: "700ms" }}>
            <line x1={cx - r} y1={cy} x2={cx} y2={cy - r} stroke="currentColor" strokeWidth="2" className="text-success-500" />
            <line x1={cx + r} y1={cy} x2={cx} y2={cy - r} stroke="currentColor" strokeWidth="2" className="text-success-500" />
            <text x={cx} y={cy - r + 26} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-success-400">
              {inscribedAngle.at}
            </text>
            <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="10" className="fill-slate-400">
              arc {inscribedAngle.arc}
            </text>
          </g>
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
          <circle
            cx="100"
            cy="80"
            r="65"
            className={cn(TONE_STROKE[left.tone ?? "brand"], "fill-brand-500/15 origin-center animate-[pop-in_0.5s_ease-out_both]")}
            stroke="currentColor"
            strokeWidth="2"
            style={{ transformOrigin: "100px 80px" }}
          />
          <circle
            cx="160"
            cy="80"
            r="65"
            className={cn(TONE_STROKE[right.tone ?? "success"], "fill-success-500/15 origin-center animate-[pop-in_0.5s_ease-out_both]")}
            stroke="currentColor"
            strokeWidth="2"
            style={{ animationDelay: "180ms", transformOrigin: "160px 80px" }}
          />
          <g className="opacity-0 animate-[fade-up_0.4s_ease-out_forwards]" style={{ animationDelay: "600ms" }}>
            <text x="70" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-50">
              {left.onlyCount}
            </text>
            <text x="130" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-50">
              {both}
            </text>
            <text x="190" y="84" textAnchor="middle" fontSize="20" fontWeight="700" className="fill-slate-50">
              {right.onlyCount}
            </text>
            <text x="70" y="30" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-brand-400">
              {left.label}
            </text>
            <text x="190" y="30" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-success-400">
              {right.label}
            </text>
          </g>
        </svg>
        {universe !== undefined && <p className="mt-1 text-center text-xs text-slate-400">Total: {universe}</p>}
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
        <svg viewBox="0 0 180 180" className="h-44 w-44 text-slate-600">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" style={drawStyle(2 * Math.PI * r, 0)} />
          {positions.map((p, i) => (
            <g
              key={p.n}
              className="origin-center animate-[pop-in_0.35s_ease-out_both]"
              style={{ animationDelay: `${500 + i * 90}ms`, transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                className={highlight.includes(p.n) ? "fill-brand-500 text-brand-500" : "fill-white/5 text-slate-600"}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className={highlight.includes(p.n) ? "fill-white" : "fill-slate-300"}
              >
                {p.n}
              </text>
            </g>
          ))}
        </svg>
        {note && <p className="mt-1 text-center text-xs text-slate-400">{note}</p>}
      </div>
    </DiagramCanvas>
  );
}

function CountingTree({ root, branches }: Extract<Diagram, { kind: "countingTree" }>) {
  return (
    <DiagramCanvas>
      <div className="flex flex-col items-center">
        <div className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white opacity-0 animate-[pop-in_0.4s_ease-out_forwards]">
          {root}
        </div>
        <div className="mt-3 flex gap-4">
          {branches.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center opacity-0 animate-[fade-up_0.4s_ease-out_forwards]"
              style={{ animationDelay: `${350 + i * 220}ms` }}
            >
              <div className="h-4 w-px bg-slate-600" />
              <div className="rounded-lg border border-slate-600 bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                {b.label}
              </div>
              {b.children && b.children.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {b.children.map((c, j) => (
                    <div key={j} className="flex flex-col items-center">
                      <div className="h-3 w-px bg-slate-600" />
                      <div className="rounded border border-slate-700 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
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
