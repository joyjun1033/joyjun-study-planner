"use client";

import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/EmptyState";
import type { HabitStat } from "@/lib/habitStats";

interface HabitTopListProps {
  stats: HabitStat[];
}

const TOP_COUNT = 10;

export function HabitTopList({ stats }: HabitTopListProps) {
  const top = stats.slice(0, TOP_COUNT);

  if (top.length === 0) {
    return <EmptyState title="순위를 매길 습관이 없습니다" />;
  }

  return (
    <ol className="flex flex-col gap-1">
      {top.map((stat, index) => {
        const rank = index + 1;
        const isTopThree = rank <= 3;
        return (
          <li
            key={stat.habit.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50"
          >
            <span
              className={cn(
                "tnum w-5 shrink-0 text-center text-sm font-bold",
                isTopThree ? "text-brand-600" : "text-slate-300"
              )}
            >
              {rank}
            </span>
            <span className="flex-1 truncate text-sm font-medium text-slate-700">
              {stat.habit.name}
            </span>
            <span className="tnum shrink-0 text-sm font-semibold text-slate-900">
              {stat.percent}%
            </span>
          </li>
        );
      })}
    </ol>
  );
}
