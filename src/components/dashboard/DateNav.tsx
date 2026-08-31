"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatFullDate, todayKey } from "@/lib/date";
import type { DateKey } from "@/lib/types";

interface DateNavProps {
  dateKey: DateKey;
  onChange: (next: DateKey) => void;
}

/** 과거 기록을 넘겨보기 위한 날짜 이동 컨트롤 */
export function DateNav({ dateKey, onChange }: DateNavProps) {
  const isToday = dateKey === todayKey();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="이전 날짜"
        onClick={() => onChange(addDays(dateKey, -1))}
        className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="tnum min-w-[10.5rem] text-center text-sm font-semibold text-slate-700">
        {formatFullDate(dateKey)}
      </span>
      <button
        type="button"
        aria-label="다음 날짜"
        onClick={() => onChange(addDays(dateKey, 1))}
        className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50"
      >
        <ChevronRight size={16} />
      </button>
      {!isToday ? (
        <button
          type="button"
          onClick={() => onChange(todayKey())}
          className="btn-secondary ml-1 px-3 py-1.5 text-xs"
        >
          오늘로
        </button>
      ) : null}
    </div>
  );
}
