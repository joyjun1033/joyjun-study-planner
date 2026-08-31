"use client";

import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import { MAX_HABITS, type Habit } from "@/lib/types";

type MonthChecks = Record<string, Record<string, boolean>>;

/** monthKey에 해당하는 달의 습관 체크 현황을 함께 불러온다 */
export function useHabits(monthKey: string) {
  const { data: habits, mutate: mutateHabits } = useSWR<Habit[]>("/api/habits", fetcher);
  const { data: checksData, mutate: mutateChecks } = useSWR<MonthChecks>(
    monthKey ? `/api/habits/checks?month=${monthKey}` : null,
    fetcher
  );

  const habitList = habits ?? [];
  const checks = checksData ?? {};

  async function addHabit(name: string) {
    const trimmed = name.trim();
    if (!trimmed || habitList.length >= MAX_HABITS) return;
    await apiRequest("/api/habits", "POST", { name: trimmed });
    mutateHabits();
  }

  async function removeHabit(id: string) {
    mutateHabits(
      habitList.filter((habit) => habit.id !== id),
      false
    );
    await apiRequest(`/api/habits/${id}`, "DELETE");
    mutateHabits();
    mutateChecks();
  }

  async function renameHabit(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    mutateHabits(
      habitList.map((habit) => (habit.id === id ? { ...habit, name: trimmed } : habit)),
      false
    );
    await apiRequest(`/api/habits/${id}`, "PATCH", { name: trimmed });
    mutateHabits();
  }

  async function toggleCheck(habitId: string, dateKey: string) {
    const current = checks[habitId]?.[dateKey] === true;
    mutateChecks(
      {
        ...checks,
        [habitId]: { ...checks[habitId], [dateKey]: !current },
      },
      false
    );
    await apiRequest(`/api/habits/${habitId}/checks`, "POST", { date: dateKey });
    mutateChecks();
  }

  const atCapacity = habitList.length >= MAX_HABITS;
  const hydrated = habits !== undefined && checksData !== undefined;

  return {
    habits: habitList,
    checks,
    addHabit,
    removeHabit,
    renameHabit,
    toggleCheck,
    atCapacity,
    hydrated,
  };
}
