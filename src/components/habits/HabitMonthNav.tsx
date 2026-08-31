"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthLabel } from "@/lib/date";

interface HabitMonthNavProps {
  year: number;
  month: number;
  isCurrentMonth: boolean;
  onMoveMonth: (delta: number) => void;
  onToday: () => void;
}

export function HabitMonthNav({
  year,
  month,
  isCurrentMonth,
  onMoveMonth,
  onToday,
}: HabitMonthNavProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <h2 className="tnum mr-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {formatMonthLabel(year, month)}
      </h2>
      <button
        type="button"
        aria-label="이전 달"
        onClick={() => onMoveMonth(-1)}
        className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        aria-label="다음 달"
        onClick={() => onMoveMonth(1)}
        className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <ChevronRight size={16} />
      </button>
      {!isCurrentMonth ? (
        <button type="button" onClick={onToday} className="btn-secondary ml-1 px-3 py-1.5 text-xs">
          이번 달
        </button>
      ) : null}
    </div>
  );
}
