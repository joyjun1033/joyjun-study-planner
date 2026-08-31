"use client";

import { useState } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";
import { Card } from "@/components/ui/Card";
import { useEvents } from "@/hooks/useEvents";
import { useToday } from "@/hooks/useToday";
import { daysUntil, formatFullDate, fromDateKey } from "@/lib/date";

export function ScheduleView() {
  const today = useToday();
  const [selected, setSelected] = useState(today);
  const [cursor, setCursor] = useState(() => {
    const date = fromDateKey(today);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const { countByDate, eventsOn, addEvent, removeEvent } = useEvents();
  const dayEvents = eventsOn(selected);
  const dday = daysUntil(selected);

  function moveMonth(delta: number) {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function selectDate(date: string) {
    setSelected(date);
    // 이전/다음 달 날짜를 눌렀다면 달력도 그 달로 따라간다
    const target = fromDateKey(date);
    if (target.getFullYear() !== cursor.year || target.getMonth() !== cursor.month) {
      setCursor({ year: target.getFullYear(), month: target.getMonth() });
    }
  }

  function goToday() {
    const date = fromDateKey(today);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
    setSelected(today);
  }

  return (
    <div className="flex flex-col gap-6">
      <MonthCalendar
        year={cursor.year}
        month={cursor.month}
        selected={selected}
        today={today}
        countByDate={countByDate}
        onSelect={selectDate}
        onMoveMonth={moveMonth}
        onToday={goToday}
      />

      <Card>
        <header className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h2 className="tnum text-base font-semibold text-slate-900 dark:text-slate-100">
              {formatFullDate(selected)}
            </h2>
            {dday > 0 ? (
              <span className="tnum rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                D-{dday}
              </span>
            ) : dday === 0 ? (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
                D-DAY
              </span>
            ) : null}
          </div>
          <span className="tnum text-sm text-slate-400 dark:text-slate-500">
            일정 {dayEvents.length}개
          </span>
        </header>

        <div className="mb-6">
          <EventList events={dayEvents} onRemove={removeEvent} />
        </div>

        <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
          <EventForm onAdd={(title, subject) => addEvent(selected, title, subject)} />
        </div>
      </Card>
    </div>
  );
}
