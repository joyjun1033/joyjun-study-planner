"use client";

import { useMemo, useState } from "react";
import { HabitDonutChart } from "./HabitDonutChart";
import { HabitGrid } from "./HabitGrid";
import { HabitMonthNav } from "./HabitMonthNav";
import { HabitProgressChart } from "./HabitProgressChart";
import { HabitSummaryCards } from "./HabitSummaryCards";
import { Card, CardHeader } from "@/components/ui/Card";
import { useHabits } from "@/hooks/useHabits";
import { useToday } from "@/hooks/useToday";
import { buildHabitMonthStats } from "@/lib/habitStats";
import { fromDateKey, toMonthKey } from "@/lib/date";

export function HabitTrackerView() {
  const today = useToday();
  const [cursor, setCursor] = useState(() => {
    const date = fromDateKey(today);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const monthKey = toMonthKey(cursor.year, cursor.month);

  const {
    habits,
    checks: monthChecks,
    addHabit,
    removeHabit,
    renameHabit,
    toggleCheck,
    atCapacity,
  } = useHabits(monthKey);

  const stats = useMemo(
    () => buildHabitMonthStats(habits, monthChecks, cursor.year, cursor.month),
    [habits, monthChecks, cursor.year, cursor.month]
  );

  function moveMonth(delta: number) {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function goToday() {
    const date = fromDateKey(today);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
  }

  const todayDate = fromDateKey(today);
  const isCurrentMonth =
    cursor.year === todayDate.getFullYear() && cursor.month === todayDate.getMonth();

  return (
    <div>
      <HabitMonthNav
        year={cursor.year}
        month={cursor.month}
        isCurrentMonth={isCurrentMonth}
        onMoveMonth={moveMonth}
        onToday={goToday}
      />

      <div className="flex flex-col gap-6">
        <HabitGrid
          habits={habits}
          weeks={stats.weeks}
          checks={monthChecks}
          todayKey={today}
          atCapacity={atCapacity}
          onToggle={toggleCheck}
          onAddHabit={addHabit}
          onRemoveHabit={removeHabit}
          onRenameHabit={renameHabit}
        />

        <Card>
          <CardHeader title="Daily Progress" description="주차별 습관 달성률" />
          <HabitProgressChart weeklyStats={stats.weeklyStats} />
        </Card>

        <HabitSummaryCards
          totalPossible={stats.totalPossible}
          totalDone={stats.totalDone}
          remaining={stats.remaining}
        />

        <Card>
          <CardHeader title="Overall Stats" description="이번 달 전체 달성률" />
          <HabitDonutChart percent={stats.overallPercent} />
        </Card>
      </div>
    </div>
  );
}
