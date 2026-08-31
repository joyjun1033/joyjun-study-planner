"use client";

import { CalendarX, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ExamEvent } from "@/lib/types";

interface EventListProps {
  events: ExamEvent[];
  onRemove: (id: string) => void;
}

export function EventList({ events, onRemove }: EventListProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<CalendarX size={28} strokeWidth={1.5} />}
        title="이 날짜에 예정된 일정이 없습니다"
        description="아래에서 시험이나 일정을 추가해 보세요"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: event.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
              {event.title}
            </p>
            {event.subject ? (
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {event.subject}
              </p>
            ) : null}
          </div>
          {event.category ? (
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${event.color}1A`, color: event.color }}
            >
              {event.category}
            </span>
          ) : null}
          <button
            type="button"
            aria-label="일정 삭제"
            onClick={() => onRemove(event.id)}
            className="shrink-0 rounded-full p-1 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}
