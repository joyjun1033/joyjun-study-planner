"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";
import { addDays, formatFullDate, fromDateKey, todayKey } from "@/lib/date";
import { formatMinutes } from "@/lib/duration";
import type { DateKey, ScreenTimeByDate } from "@/lib/types";

type RangeMode = "week" | "month";

const RANGE_OPTIONS: Array<{ value: RangeMode; label: string; days: number }> = [
  { value: "week", label: "주간", days: 7 },
  { value: "month", label: "월간", days: 30 },
];

interface ChartRow {
  key: DateKey;
  label: string;
  minutes: number | null;
  hours: number | null;
}

function formatChartLabel(key: DateKey): string {
  const date = fromDateKey(key);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

interface ScreenTimeChartProps {
  entries: ScreenTimeByDate;
}

export function ScreenTimeChart({ entries }: ScreenTimeChartProps) {
  const [mode, setMode] = useState<RangeMode>("week");
  const days = RANGE_OPTIONS.find((option) => option.value === mode)?.days ?? 7;

  const rows = useMemo<ChartRow[]>(() => {
    const end = todayKey();
    return Array.from({ length: days }, (_, index) => {
      const key = addDays(end, index - (days - 1));
      const minutes = entries[key] ?? null;
      return { key, label: formatChartLabel(key), minutes, hours: minutes === null ? null : minutes / 60 };
    });
  }, [entries, days]);

  const recorded = rows.filter((row) => row.minutes !== null);
  const average =
    recorded.length === 0
      ? 0
      : Math.round(recorded.reduce((sum, row) => sum + (row.minutes ?? 0), 0) / recorded.length);

  // 30일치는 라벨이 다 들어가면 겹치므로 몇 개만 건너뛰며 보여준다
  const tickInterval = mode === "month" ? Math.ceil(days / 8) - 1 : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {recorded.length > 0 ? (
            <>
              {RANGE_OPTIONS.find((o) => o.value === mode)?.label} 평균{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatMinutes(average)}
              </span>
              <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">
                (기록 {recorded.length}일)
              </span>
            </>
          ) : (
            "이 기간에 기록된 스크린타임이 없습니다"
          )}
        </p>

        <div className="inline-flex shrink-0 rounded-full border border-slate-200 p-0.5 dark:border-slate-700">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                mode === option.value
                  ? "bg-brand-600 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E2E8F0" }}
            interval={tickInterval}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(value) => `${value}h`}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: "#CBD5E1", strokeWidth: 1 }}
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const point = payload[0].payload as ChartRow;
              if (point.minutes === null) return null;
              return (
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
                  <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formatFullDate(point.key)}
                  </p>
                  <p className="tnum text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatMinutes(point.minutes)}
                  </p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, stroke: "#FFFFFF" }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#FFFFFF" }}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
