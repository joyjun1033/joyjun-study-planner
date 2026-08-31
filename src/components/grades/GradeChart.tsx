"use client";

import { useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/date";
import type { Grade, ScoreType } from "@/lib/types";

/** 검증된 카테고리 팔레트 (고정 순서로만 배정, 순환시키지 않는다) */
const SERIES_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

/** 색만으로 구분되지 않도록 표시할 수 있는 계열 수를 제한한다 */
const MAX_SERIES = SERIES_COLORS.length;

interface GradeChartProps {
  grades: Grade[];
}

type ChartRow = Record<string, string | number | null>;

export function GradeChart({ grades }: GradeChartProps) {
  const [preferred, setPreferred] = useState<ScoreType>("score");

  const availableTypes: ScoreType[] = (["score", "grade"] as const).filter((type) =>
    grades.some((grade) => grade.scoreType === type)
  );

  if (availableTypes.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        성적을 입력하면 과목별 추이가 그려집니다
      </p>
    );
  }

  // 점수와 등급은 축이 다르므로 한 번에 하나만 그린다 (이중 축 금지)
  const scoreType = availableTypes.includes(preferred) ? preferred : availableTypes[0];
  const scoped = grades.filter((grade) => grade.scoreType === scoreType);

  const subjects = Array.from(new Set(scoped.map((grade) => grade.subject)));
  const shown = subjects.slice(0, MAX_SERIES);
  const hiddenCount = subjects.length - shown.length;

  const dates = Array.from(new Set(scoped.map((grade) => grade.date))).sort();
  const rows: ChartRow[] = dates.map((date) => {
    const row: ChartRow = { label: formatShortDate(date).slice(0, -4), date };
    shown.forEach((subject, index) => {
      const match = scoped.find(
        (grade) => grade.date === date && grade.subject === subject
      );
      row[`s${index}`] = match ? match.value : null;
    });
    return row;
  });

  // 계열별 마지막 데이터 지점 — 직접 라벨은 여기에만 붙인다
  const lastIndexOf = shown.map((_, index) => {
    let last = -1;
    rows.forEach((row, rowIndex) => {
      if (row[`s${index}`] !== null && row[`s${index}`] !== undefined) last = rowIndex;
    });
    return last;
  });

  const isGrade = scoreType === "grade";
  const unit = isGrade ? "등급" : "점";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {shown.length >= 2 ? (
            shown.map((subject, index) => (
              <span key={subject} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: SERIES_COLORS[index] }}
                />
                {subject}
              </span>
            ))
          ) : shown.length === 1 ? (
            <span className="text-xs font-medium text-slate-500">{shown[0]} 추이</span>
          ) : null}
        </div>

        {availableTypes.length > 1 ? (
          <div className="inline-flex shrink-0 rounded-full border border-slate-200 p-0.5">
            {availableTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPreferred(type)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  scoreType === type
                    ? "bg-brand-600 text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {type === "score" ? "점수" : "등급"}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {scoped.length < 2 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          기록이 2개 이상 쌓이면 추이가 표시됩니다
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={rows} margin={{ top: 12, right: 56, bottom: 0, left: -8 }}>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              domain={isGrade ? [1, 9] : [0, 100]}
              reversed={isGrade}
              allowDecimals={!isGrade}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ stroke: "#CBD5E1", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card">
                    <p className="tnum mb-1.5 text-xs font-semibold text-slate-500">
                      {String(label)}
                    </p>
                    {payload
                      .filter((entry) => entry.value !== null && entry.value !== undefined)
                      .map((entry) => (
                        <p
                          key={String(entry.dataKey)}
                          className="flex items-center gap-2 text-xs text-slate-700"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="flex-1">{entry.name}</span>
                          <span className="tnum font-semibold text-slate-900">
                            {entry.value}
                            {unit}
                          </span>
                        </p>
                      ))}
                  </div>
                );
              }}
            />
            {shown.map((subject, index) => (
              <Line
                key={subject}
                type="monotone"
                dataKey={`s${index}`}
                name={subject}
                stroke={SERIES_COLORS[index]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "#FFFFFF" }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#FFFFFF" }}
                connectNulls
                isAnimationActive={false}
              >
                {shown.length <= 4 ? (
                  <LabelList
                    dataKey={`s${index}`}
                    content={(props) => {
                      const { index: pointIndex, x, y } = props as {
                        index?: number;
                        x?: number;
                        y?: number;
                      };
                      if (pointIndex !== lastIndexOf[index]) return null;
                      if (typeof x !== "number" || typeof y !== "number") return null;
                      return (
                        <text x={x + 10} y={y + 4} fill="#475569" fontSize={11} fontWeight={600}>
                          {subject}
                        </text>
                      );
                    }}
                  />
                ) : null}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {hiddenCount > 0 ? (
        <p className="mt-3 text-xs text-slate-400">
          과목이 많아 {shown.length}개만 표시했습니다. 나머지 {hiddenCount}개 과목은 위 필터에서
          선택해 확인하세요.
        </p>
      ) : null}
    </div>
  );
}
