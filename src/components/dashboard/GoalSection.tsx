"use client";

import { GraduationCap, Sparkles, Target } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { GoalCardShell } from "./GoalCardShell";
import { GoalTaskList, TaskProgress } from "./GoalTaskList";
import { MonthGoalCard } from "./MonthGoalCard";
import { UniversitySelect } from "./UniversitySelect";
import { useGoals } from "@/hooks/useGoals";

export function GoalSection() {
  const { goals, setUniversity, setYear, setWeekTasks, setMonthTasks } = useGoals();

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <GoalCardShell label="목표 대학" icon={GraduationCap}>
        <UniversitySelect value={goals.university} onChange={setUniversity} />
      </GoalCardShell>

      <GoalCardShell
        label="이번 주 목표"
        icon={Target}
        footer={<TaskProgress tasks={goals.weekTasks} />}
      >
        <GoalTaskList
          tasks={goals.weekTasks}
          onChange={setWeekTasks}
          placeholder="이번 주 목표 추가"
        />
      </GoalCardShell>

      <MonthGoalCard monthTasks={goals.monthTasks} onMonthTasksChange={setMonthTasks} />

      <GoalCard
        label="올해 목표"
        icon={Sparkles}
        placeholder="올해 이루고 싶은 것"
        value={goals.year}
        onCommit={setYear}
      />
    </div>
  );
}
