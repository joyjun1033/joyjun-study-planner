"use client";

import { useState } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";
import { Modal } from "@/components/ui/Modal";
import { useEvents } from "@/hooks/useEvents";
import { useToday } from "@/hooks/useToday";
import { daysUntil, formatFullDate, fromDateKey } from "@/lib/date";

export function ScheduleView() {
  const today = useToday();
  const [popupDate, setPopupDate] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => {
    const date = fromDateKey(today);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const { dotsByDate, categories, eventsOn, addEvent, removeEvent } = useEvents();
  const dayEvents = popupDate ? eventsOn(popupDate) : [];
  const dday = popupDate ? daysUntil(popupDate) : 0;

  function moveMonth(delta: number) {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function selectDate(date: string) {
    setPopupDate(date);
  }

  function goToday() {
    const date = fromDateKey(today);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
  }

  return (
    <div className="flex flex-col gap-6">
      <MonthCalendar
        year={cursor.year}
        month={cursor.month}
        selected={popupDate ?? ""}
        today={today}
        dotsByDate={dotsByDate}
        onSelect={selectDate}
        onMoveMonth={moveMonth}
        onToday={goToday}
      />

      {popupDate ? (
        <Modal title={formatFullDate(popupDate)} onClose={() => setPopupDate(null)}>
          <div className="mb-5 flex items-center justify-between gap-4">
            {dday > 0 ? (
              <span className="tnum rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                D-{dday}
              </span>
            ) : dday === 0 ? (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
                D-DAY
              </span>
            ) : (
              <span />
            )}
            <span className="tnum text-sm text-slate-400 dark:text-slate-500">
              일정 {dayEvents.length}개
            </span>
          </div>

          <div className="mb-6">
            <EventList events={dayEvents} onRemove={removeEvent} />
          </div>

          <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
            <EventForm
              date={popupDate}
              categories={categories}
              onAdd={(input) => addEvent(popupDate, input)}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
