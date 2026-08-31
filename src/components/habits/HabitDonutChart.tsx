"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface HabitDonutChartProps {
  percent: number;
}

export function HabitDonutChart({ percent }: HabitDonutChartProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const data = [
    { name: "완료", value: clamped },
    { name: "미완료", value: 100 - clamped },
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={84}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill="#6366F1" />
            <Cell className="fill-slate-200 dark:fill-slate-700" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-3xl font-bold text-slate-900 dark:text-slate-100">
          {clamped}%
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          이번 달 달성률
        </span>
      </div>
    </div>
  );
}
