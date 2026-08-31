"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeekStat } from "@/lib/habitStats";

interface HabitProgressChartProps {
  weeklyStats: WeekStat[];
}

export function HabitProgressChart({ weeklyStats }: HabitProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={weeklyStats} margin={{ top: 12, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#E2E8F0" }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          cursor={{ fill: "#EEF2FF" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const point = payload[0].payload as WeekStat;
            return (
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card">
                <p className="mb-1 text-xs font-semibold text-slate-500">{point.label}</p>
                <p className="tnum text-sm font-semibold text-slate-900">
                  {point.done}/{point.possible} · {point.percent}%
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="percent" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
