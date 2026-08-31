import type { DateKey } from "./types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 로컬 타임존 기준 "YYYY-MM-DD" (UTC 변환으로 하루가 밀리는 것을 막는다) */
export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function addDays(key: DateKey, amount: number): DateKey {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

/** "2026년 8월 28일 (금)" */
export function formatFullDate(key: DateKey): string {
  const date = fromDateKey(key);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${
    WEEKDAYS[date.getDay()]
  })`;
}

/** "8월 28일 (금)" */
export function formatShortDate(key: DateKey): string {
  const date = fromDateKey(key);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export function formatMonthLabel(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export const WEEKDAY_LABELS = WEEKDAYS;

/**
 * 월간 달력 그리드(6주 x 7일)를 만든다.
 * 이전/다음 달 날짜도 채워서 항상 42칸을 반환한다.
 */
export function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return {
      key: toDateKey(date),
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month,
      weekday: date.getDay(),
    };
  });
}

/** 오늘까지 남은 일수 (음수면 지난 날짜) */
export function daysUntil(key: DateKey): number {
  const target = fromDateKey(key).getTime();
  const today = fromDateKey(todayKey()).getTime();
  return Math.round((target - today) / 86_400_000);
}

/** 매주 반복 일정의 발생일 목록을 만든다 (start부터 until까지 7일 간격, 최대 104회) */
export function buildWeeklyOccurrences(start: DateKey, until: DateKey): DateKey[] {
  const dates: DateKey[] = [];
  let cursor = start;
  while (cursor <= until && dates.length < 104) {
    dates.push(cursor);
    cursor = addDays(cursor, 7);
  }
  return dates;
}

/** "YYYY-MM" 월 키 */
export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export interface MonthDay {
  key: DateKey;
  day: number;
  weekday: number;
}

/** 해당 월의 1일 ~ 말일 목록 */
export function buildMonthDays(year: number, month: number): MonthDay[] {
  return Array.from({ length: daysInMonth(year, month) }, (_, index) => {
    const date = new Date(year, month, index + 1);
    return { key: toDateKey(date), day: date.getDate(), weekday: date.getDay() };
  });
}

/** 일요일을 기준으로 주 단위(Week 1, Week 2 ...)로 쪼갠다 */
export function chunkIntoWeeks(days: MonthDay[]): MonthDay[][] {
  const weeks: MonthDay[][] = [];
  let current: MonthDay[] = [];

  for (const day of days) {
    if (day.weekday === 0 && current.length > 0) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length > 0) weeks.push(current);

  return weeks;
}
