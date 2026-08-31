"use client";

import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import { EMPTY_GOALS, type GoalTask, type Goals, type ScoreTarget } from "@/lib/types";

export function useGoals() {
  const { data, mutate } = useSWR<Goals>("/api/goals", fetcher);
  const goals = data ?? EMPTY_GOALS;

  async function patch(changes: Partial<Goals>) {
    const next = { ...goals, ...changes };
    mutate(next, false);
    await apiRequest("/api/goals", "PUT", changes);
    mutate();
  }

  const setUniversity = (value: string) => patch({ university: value });
  const setYear = (value: string) => patch({ year: value });
  const setWeekTasks = (tasks: GoalTask[]) => patch({ weekTasks: tasks });
  const setMonthTasks = (tasks: GoalTask[]) => patch({ monthTasks: tasks });
  const setScoreTargets = (targets: ScoreTarget[]) => patch({ monthScoreTargets: targets });

  return {
    goals,
    setUniversity,
    setYear,
    setWeekTasks,
    setMonthTasks,
    setScoreTargets,
    hydrated: data !== undefined,
  };
}
