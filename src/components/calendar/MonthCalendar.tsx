"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { WEEKDAY_LABELS, buildMonthGrid, formatMonthLabel } from "@/lib/date";
import { cn } from "@/lib/cn";
import type { DateKey } from "@/lib/types";

interface MonthCalendarProps {
  year: number;
  month: number;
  selected: DateKey;
  today: DateKey;
  /** 날짜별 일정 개수 — 점(dot) 표시에 사용 */
  countByDate: Record<DateKey, number>;
  onSelect: (date: DateKey) => void;
  onMoveMonth: (delta: number) => void;
  onToday: () => void;
}

export function MonthCalendar({
  year,
  month,
  selected,
  today,
  countByDate,
  onSelect,
  onMoveMonth,
  onToday,
}: MonthCalendarProps) {
  const cells = buildMonthGrid(year, month);

  return (
    <div className="card p-6">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="tnum text-lg font-bold tracking-tight text-slate-900">
          {formatMonthLabel(year, month)}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onToday} className="btn-secondary px-3 py-1.5 text-xs">
            오늘
          </button>
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => onMoveMonth(-1)}
            className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => onMoveMonth(1)}
            className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <div className="mb-2 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-xs font-medium text-slate-400">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell) => {
          const isSelected = cell.key === selected;
          const isToday = cell.key === today;
          const hasEvent = (countByDate[cell.key] ?? 0) > 0;

          return (
            <div key={cell.key} className="flex justify-center">
              <button
                type="button"
                onClick={() => onSelect(cell.key)}
                aria-pressed={isSelected}
                aria-label={cell.key}
                className={cn(
                  "tnum relative flex h-11 w-11 flex-col items-center justify-center rounded-full text-sm transition-colors",
                  isSelected && "bg-brand-600 font-semibold text-white",
                  !isSelected && isToday && "bg-brand-50 font-bold text-brand-600",
                  !isSelected && !isToday && cell.inCurrentMonth &&
                    "font-medium text-slate-700 hover:bg-slate-100",
                  !isSelected && !cell.inCurrentMonth && "text-slate-300 hover:bg-slate-50"
                )}
              >
                <span>{cell.day}</span>
                <span
                  className={cn(
                    "absolute bottom-2 h-1 w-1 rounded-full",
                    hasEvent
                      ? isSelected
                        ? "bg-white"
                        : "bg-brand-500"
                      : "bg-transparent"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
