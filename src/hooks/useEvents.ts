"use client";

import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import type { DateKey, ExamEvent } from "@/lib/types";

export function useEvents() {
  const { data, mutate } = useSWR<ExamEvent[]>("/api/events", fetcher);
  const events = data ?? [];

  const countByDate = useMemo(() => {
    const map: Record<DateKey, number> = {};
    for (const event of events) {
      map[event.date] = (map[event.date] ?? 0) + 1;
    }
    return map;
  }, [events]);

  const eventsOn = useCallback(
    (date: DateKey) => events.filter((event) => event.date === date),
    [events]
  );

  async function addEvent(date: DateKey, title: string, subject: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    await apiRequest("/api/events", "POST", { date, title: trimmed, subject: subject.trim() });
    mutate();
  }

  async function removeEvent(id: string) {
    mutate(
      events.filter((event) => event.id !== id),
      false
    );
    await apiRequest(`/api/events/${id}`, "DELETE");
    mutate();
  }

  return { events, countByDate, eventsOn, addEvent, removeEvent, hydrated: data !== undefined };
}
