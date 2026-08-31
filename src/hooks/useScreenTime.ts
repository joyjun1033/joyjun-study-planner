"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import type { DateKey, ScreenTimeByDate } from "@/lib/types";

export function useScreenTime() {
  const { data, mutate } = useSWR<ScreenTimeByDate>("/api/screentime", fetcher);
  const entries = data ?? {};

  /** 분 단위 값을 기록(덮어쓰기). 0 이하이면 기록을 지운다 */
  async function setEntry(date: DateKey, minutes: number) {
    const next = { ...entries };
    if (minutes <= 0) delete next[date];
    else next[date] = minutes;
    mutate(next, false);
    await apiRequest("/api/screentime", "PUT", { date, minutes });
    mutate();
  }

  async function removeEntry(date: DateKey) {
    const next = { ...entries };
    delete next[date];
    mutate(next, false);
    await apiRequest(`/api/screentime/${date}`, "DELETE");
    mutate();
  }

  /** 최신순(날짜 내림차순) 날짜 목록 */
  const sortedDates = useMemo(
    () => Object.keys(entries).sort((a, b) => b.localeCompare(a)),
    [entries]
  );

  return { entries, setEntry, removeEntry, sortedDates, hydrated: data !== undefined };
}
