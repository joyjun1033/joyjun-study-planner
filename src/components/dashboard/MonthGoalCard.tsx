"use client";

import { CalendarRange } from "lucide-react";
import { GoalCardShell } from "./GoalCardShell";
import { GoalTaskList, TaskProgress } from "./GoalTaskList";
import type { GoalTask } from "@/lib/types";

interface MonthGoalCardProps {
  monthTasks: GoalTask[];
  onMonthTasksChange: (tasks: GoalTask[]) => void;
}

/** 이번 달 목표: 일과 계획 리스트 */
export function MonthGoalCard({ monthTasks, onMonthTasksChange }: MonthGoalCardProps) {
  return (
    <GoalCardShell
      label="이번 달 목표"
      icon={CalendarRange}
      footer={<TaskProgress tasks={monthTasks} />}
    >
      <GoalTaskList
        tasks={monthTasks}
        onChange={onMonthTasksChange}
        placeholder="이번 달 일과 추가"
      />
    </GoalCardShell>
  );
}
