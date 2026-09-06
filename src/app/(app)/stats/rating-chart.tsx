"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsDarkMode } from "@/lib/use-dark-mode";

export function RatingChart({ data }: { data: { date: string; rating: number }[] }) {
  const isDark = useIsDarkMode();
  const values = data.map((d) => d.rating);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(40, Math.round((max - min) * 0.2));

  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#94a3b8";
  const lineColor = isDark ? "#818cf8" : "#4f46e5";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0";
  const tooltipText = isDark ? "#f1f5f9" : "#0f172a";

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: tickColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis
          domain={[min - pad, max + pad]}
          tick={{ fontSize: 11, fill: tickColor }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: `1px solid ${tooltipBorder}`,
            fontSize: 12,
            background: tooltipBg,
            color: tooltipText,
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.06)",
          }}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={{ r: 3, fill: lineColor }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
