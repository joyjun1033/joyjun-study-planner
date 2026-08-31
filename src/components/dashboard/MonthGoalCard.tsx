"use client";

import { CalendarRange } from "lucide-react";
import { GoalCardShell } from "./GoalCardShell";
import { GoalTaskList, TaskProgress } from "./GoalTaskList";
import { ScoreTargetList } from "./ScoreTargetList";
import { useGrades } from "@/hooks/useGrades";
import type { GoalTask, ScoreTarget } from "@/lib/types";

interface MonthGoalCardProps {
  scoreTargets: ScoreTarget[];
  monthTasks: GoalTask[];
  onScoreTargetsChange: (targets: ScoreTarget[]) => void;
  onMonthTasksChange: (tasks: GoalTask[]) => void;
}

/** 이번 달 목표: 성적 목표 / 일과 계획 두 섹션으로 나뉜 카드 */
export function MonthGoalCard({
  scoreTargets,
  monthTasks,
  onScoreTargetsChange,
  onMonthTasksChange,
}: MonthGoalCardProps) {
  const { sorted: grades } = useGrades();

  return (
    <GoalCardShell
      label="이번 달 목표"
      icon={CalendarRange}
      footer={<TaskProgress tasks={monthTasks} />}
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-400">성적 목표</p>
          <ScoreTargetList targets={scoreTargets} grades={grades} onChange={onScoreTargetsChange} />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-semibold text-slate-400">일과 계획</p>
          <GoalTaskList
            tasks={monthTasks}
            onChange={onMonthTasksChange}
            placeholder="이번 달 일과 추가"
          />
        </div>
      </div>
    </GoalCardShell>
  );
}
