import { buildMonthDays, chunkIntoWeeks, type MonthDay } from "./date";
import type { Habit } from "./types";

export interface HabitStat {
  habit: Habit;
  done: number;
  possible: number;
  remaining: number;
  percent: number;
}

export interface WeekStat {
  label: string;
  done: number;
  possible: number;
  percent: number;
}

export interface HabitMonthStats {
  days: MonthDay[];
  weeks: MonthDay[][];
  totalPossible: number;
  totalDone: number;
  remaining: number;
  overallPercent: number;
  weeklyStats: WeekStat[];
  /** 달성률 내림차순 정렬 */
  perHabitStats: HabitStat[];
}

/** 한 달치 습관 체크 데이터를 그리드/카드/차트/테이블이 공통으로 쓸 수 있게 한 번에 계산한다 */
export function buildHabitMonthStats(
  habits: Habit[],
  monthChecks: Record<string, Record<string, boolean>>,
  year: number,
  month: number
): HabitMonthStats {
  const days = buildMonthDays(year, month);
  const weeks = chunkIntoWeeks(days);

  function isChecked(habitId: string, dateKey: string) {
    return monthChecks[habitId]?.[dateKey] === true;
  }

  const perHabitStats: HabitStat[] = habits
    .map((habit) => {
      const done = days.reduce((sum, day) => sum + (isChecked(habit.id, day.key) ? 1 : 0), 0);
      const possible = days.length;
      const percent = possible === 0 ? 0 : Math.round((done / possible) * 100);
      return { habit, done, possible, remaining: possible - done, percent };
    })
    .sort((a, b) => b.percent - a.percent);

  const totalDone = perHabitStats.reduce((sum, stat) => sum + stat.done, 0);
  const totalPossible = habits.length * days.length;
  const remaining = totalPossible - totalDone;
  const overallPercent = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

  const weeklyStats: WeekStat[] = weeks.map((week, index) => {
    const possible = habits.length * week.length;
    const done = habits.reduce(
      (sum, habit) =>
        sum + week.reduce((weekSum, day) => weekSum + (isChecked(habit.id, day.key) ? 1 : 0), 0),
      0
    );
    const percent = possible === 0 ? 0 : Math.round((done / possible) * 100);
    return { label: `Week ${index + 1}`, done, possible, percent };
  });

  return {
    days,
    weeks,
    totalPossible,
    totalDone,
    remaining,
    overallPercent,
    weeklyStats,
    perHabitStats,
  };
}
