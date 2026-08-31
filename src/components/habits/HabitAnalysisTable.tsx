"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { HabitStat } from "@/lib/habitStats";

interface HabitAnalysisTableProps {
  stats: HabitStat[];
}

export function HabitAnalysisTable({ stats }: HabitAnalysisTableProps) {
  if (stats.length === 0) {
    return <EmptyState title="아직 등록한 습관이 없습니다" description="위 그리드에서 습관을 추가해 보세요" />;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="rounded-lg bg-brand-50 text-left text-xs font-medium text-brand-700">
          <th className="rounded-l-lg py-2.5 pl-3 font-medium">습관</th>
          <th className="py-2.5 text-right font-medium">목표</th>
          <th className="py-2.5 text-right font-medium">실제</th>
          <th className="py-2.5 text-right font-medium">남음</th>
          <th className="w-28 py-2.5 pl-4 font-medium">진행 바</th>
          <th className="rounded-r-lg py-2.5 pr-3 text-right font-medium">%</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat) => (
          <tr key={stat.habit.id} className="border-b border-slate-50 last:border-0">
            <td className="max-w-[8rem] truncate py-3 pl-3 font-medium text-slate-800">
              {stat.habit.name}
            </td>
            <td className="tnum py-3 text-right text-slate-500">{stat.possible}</td>
            <td className="tnum py-3 text-right text-slate-500">{stat.done}</td>
            <td className="tnum py-3 text-right text-slate-500">{stat.remaining}</td>
            <td className="py-3 pl-4">
              <ProgressBar percent={stat.percent} />
            </td>
            <td className="tnum py-3 pr-3 text-right font-semibold text-slate-900">
              {stat.percent}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
