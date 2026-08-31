/** 날짜 키 형식: "YYYY-MM-DD" (로컬 타임존 기준) */
export type DateKey = string;

/** 월 키 형식: "YYYY-MM" */
export type MonthKey = string;

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

/** 날짜별로 분리 저장되는 할 일 기록 */
export type TodosByDate = Record<DateKey, Todo[]>;

/** 점수(0~100)로 기록할지, 등급(1~9)으로 기록할지 */
export type ScoreType = "score" | "grade";

/** 번호 매기기 목표 리스트의 한 항목 */
export interface GoalTask {
  id: string;
  text: string;
  done: boolean;
}

/** 이번 달 성적 목표 한 줄 (예: 수학 - 92점) */
export interface ScoreTarget {
  id: string;
  subject: string;
  scoreType: ScoreType;
  value: number;
}

export interface Goals {
  /** 목표 대학 (목록에서 선택하거나 직접 입력) */
  university: string;
  /** 이번 주 목표 — 번호 매기기 리스트 */
  weekTasks: GoalTask[];
  /** 이번 달 목표 — 성적 목표 */
  monthScoreTargets: ScoreTarget[];
  /** 이번 달 목표 — 일과 계획 */
  monthTasks: GoalTask[];
  /** 올해 목표 — 자유 텍스트 */
  year: string;
}

export const EMPTY_GOALS: Goals = {
  university: "",
  weekTasks: [],
  monthScoreTargets: [],
  monthTasks: [],
  year: "",
};

export interface ExamEvent {
  id: string;
  date: DateKey;
  title: string;
  subject: string;
}

export interface Grade {
  id: string;
  examName: string;
  subject: string;
  date: DateKey;
  scoreType: ScoreType;
  value: number;
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: number;
}

/** 월 → 습관 → 날짜 → 체크 여부. 월별로 나눠 저장해 이전 달 기록을 그대로 남긴다. */
export type HabitChecks = Record<MonthKey, Record<string, Record<DateKey, boolean>>>;

/** 습관 개수 상한 (그리드 가독성 유지) */
export const MAX_HABITS = 15;

/** 날짜별 스크린타임 기록 (분 단위, 직접 입력) */
export type ScreenTimeByDate = Record<DateKey, number>;
