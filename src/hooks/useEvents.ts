"use client";

import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import type { DateKey, ExamEvent } from "@/lib/types";

export interface AddEventInput {
  title: string;
  subject?: string;
  category?: string;
  color?: string;
  /** 매주 반복할 경우, 반복이 끝나는 날짜(포함) */
  repeatUntil?: string;
}

export interface EventCategoryOption {
  name: string;
  color: string;
}

export function useEvents() {
  const { data, mutate } = useSWR<ExamEvent[]>("/api/events", fetcher);
  const events = data ?? [];

  /** 날짜별로 그 날 있는 일정들의 색(종류별, 중복 제거) — 달력 점 표시에 사용 */
  const dotsByDate = useMemo(() => {
    const map: Record<DateKey, string[]> = {};
    for (const event of events) {
      const colors = map[event.date] ?? (map[event.date] = []);
      if (!colors.includes(event.color)) colors.push(event.color);
    }
    return map;
  }, [events]);

  /** 지금까지 쓰인 활동 종류 목록(최근 순, 이름 중복 제거) — 새 일정 등록 시 선택지로 사용 */
  const categories = useMemo<EventCategoryOption[]>(() => {
    const seen = new Set<string>();
    const list: EventCategoryOption[] = [];
    for (const event of [...events].sort((a, b) => b.date.localeCompare(a.date))) {
      if (!event.category || seen.has(event.category)) continue;
      seen.add(event.category);
      list.push({ name: event.category, color: event.color });
    }
    return list;
  }, [events]);

  const eventsOn = useCallback(
    (date: DateKey) => events.filter((event) => event.date === date),
    [events]
  );

  async function addEvent(date: DateKey, input: AddEventInput) {
    const trimmed = input.title.trim();
    if (!trimmed) return;
    await apiRequest("/api/events", "POST", {
      date,
      title: trimmed,
      subject: (input.subject ?? "").trim(),
      category: (input.category ?? "").trim(),
      color: input.color,
      repeatUntil: input.repeatUntil,
    });
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

  return {
    events,
    dotsByDate,
    categories,
    eventsOn,
    addEvent,
    removeEvent,
    hydrated: data !== undefined,
  };
}
