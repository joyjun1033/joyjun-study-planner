"use client";

import { Smartphone, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatShortDate } from "@/lib/date";
import { formatMinutes } from "@/lib/duration";
import type { DateKey } from "@/lib/types";

interface ScreenTimeTableProps {
  dates: DateKey[];
  minutesByDate: Record<DateKey, number>;
  onRemove: (date: DateKey) => void;
}

export function ScreenTimeTable({ dates, minutesByDate, onRemove }: ScreenTimeTableProps) {
  if (dates.length === 0) {
    return (
      <EmptyState
        icon={<Smartphone size={28} strokeWidth={1.5} />}
        title="아직 입력한 스크린타임이 없습니다"
        description="위 폼에서 오늘의 스크린타임을 기록해 보세요"
      />
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
          <th className="pb-3 pl-2 font-medium">날짜</th>
          <th className="pb-3 text-right font-medium">스크린타임</th>
          <th className="w-10 pb-3" />
        </tr>
      </thead>
      <tbody>
        {dates.map((date) => (
          <tr key={date} className="group border-b border-slate-50 last:border-0">
            <td className="tnum py-3.5 pl-2 text-slate-500">{formatShortDate(date)}</td>
            <td className="tnum py-3.5 text-right font-semibold text-slate-900">
              {formatMinutes(minutesByDate[date])}
            </td>
            <td className="py-3.5 text-right">
              <button
                type="button"
                aria-label="스크린타임 기록 삭제"
                onClick={() => onRemove(date)}
                className="rounded-full p-1 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100"
              >
                <X size={15} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
