"use client";

import { useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Maximize2, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { WEEKDAY_LABELS, type MonthDay } from "@/lib/date";
import { Modal } from "@/components/ui/Modal";
import type { Habit } from "@/lib/types";

const CELL_WIDTH = 36;
const NAME_WIDTH = 152;
const VISIBLE_WEEKS = 3;

interface HabitGridProps {
  habits: Habit[];
  weeks: MonthDay[][];
  checks: Record<string, Record<string, boolean>>;
  todayKey: string;
  atCapacity: boolean;
  onToggle: (habitId: string, dateKey: string) => void;
  onAddHabit: (name: string) => void;
  onRemoveHabit: (id: string) => void;
  onRenameHabit: (id: string, name: string) => void;
}

export function HabitGrid({
  habits,
  weeks,
  checks,
  todayKey,
  atCapacity,
  onToggle,
  onAddHabit,
  onRemoveHabit,
  onRenameHabit,
}: HabitGridProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const maxOffset = Math.max(0, weeks.length - VISIBLE_WEEKS);
  const clampedOffset = Math.min(weekOffset, maxOffset);
  const visibleWeeks = weeks.slice(clampedOffset, clampedOffset + VISIBLE_WEEKS);
  const canGoPrev = clampedOffset > 0;
  const canGoNext = clampedOffset < maxOffset;

  const tableProps = {
    habits,
    checks,
    todayKey,
    atCapacity,
    onToggle,
    onAddHabit,
    onRemoveHabit,
    onRenameHabit,
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          습관 체크 · 최대 15개까지 등록할 수 있어요
        </p>

        {weeks.length > VISIBLE_WEEKS ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="이전 주"
              onClick={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
              disabled={!canGoPrev}
              className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="다음 주"
              onClick={() => setWeekOffset((offset) => Math.min(maxOffset, offset + 1))}
              disabled={!canGoNext}
              className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="btn-secondary ml-1 flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <Maximize2 size={13} />
              전체보기
            </button>
          </div>
        ) : null}
      </div>

      <HabitGridTable weeks={visibleWeeks} weekLabelOffset={clampedOffset} {...tableProps} />

      {showAll ? (
        <Modal title="습관 체크 · 전체보기" onClose={() => setShowAll(false)}>
          <div className="overflow-x-auto">
            <HabitGridTable weeks={weeks} weekLabelOffset={0} {...tableProps} />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

interface HabitGridTableProps {
  habits: Habit[];
  weeks: MonthDay[][];
  weekLabelOffset: number;
  checks: Record<string, Record<string, boolean>>;
  todayKey: string;
  atCapacity: boolean;
  onToggle: (habitId: string, dateKey: string) => void;
  onAddHabit: (name: string) => void;
  onRemoveHabit: (id: string) => void;
  onRenameHabit: (id: string, name: string) => void;
}

/** 습관 체크 표 자체. 압축 뷰(주 3개)와 전체보기 모달에서 같은 구조를 재사용한다 */
function HabitGridTable({
  habits,
  weeks,
  weekLabelOffset,
  checks,
  todayKey,
  atCapacity,
  onToggle,
  onAddHabit,
  onRemoveHabit,
  onRenameHabit,
}: HabitGridTableProps) {
  return (
    <div className="inline-block min-w-full">
      <div className="flex">
        <div
          className="sticky left-0 z-20 flex shrink-0 items-center bg-white text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          style={{ width: NAME_WIDTH }}
        >
          습관
        </div>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{ width: week.length * CELL_WIDTH }}
            className={cn(
              "flex items-center justify-center border-b border-slate-100 pb-1.5 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500",
              weekIndex > 0 && "border-l-2 border-slate-100 dark:border-slate-700"
            )}
          >
            Week {weekLabelOffset + weekIndex + 1}
          </div>
        ))}
      </div>

      <div className="flex">
        <div
          className="sticky left-0 z-20 shrink-0 border-b border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800"
          style={{ width: NAME_WIDTH }}
        />
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={day.key}
              style={{ width: CELL_WIDTH }}
              className={cn(
                "flex shrink-0 flex-col items-center justify-center border-b border-slate-100 py-1.5 dark:border-slate-700",
                weekIndex > 0 && dayIndex === 0 && "border-l-2 border-slate-100 dark:border-slate-700"
              )}
            >
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {WEEKDAY_LABELS[day.weekday]}
              </span>
              <span className="tnum text-xs font-medium text-slate-600 dark:text-slate-300">
                {day.day}
              </span>
            </div>
          ))
        )}
      </div>

      {habits.map((habit) => (
        <div key={habit.id} className="group flex items-center">
          <HabitNameCell
            habit={habit}
            onRename={(name) => onRenameHabit(habit.id, name)}
            onRemove={() => onRemoveHabit(habit.id)}
          />
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const checked = checks[habit.id]?.[day.key] === true;
              const isFuture = day.key > todayKey;
              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={isFuture}
                  aria-pressed={checked}
                  aria-label={`${habit.name} ${day.key}`}
                  onClick={() => onToggle(habit.id, day.key)}
                  style={{ width: CELL_WIDTH }}
                  className={cn(
                    "flex h-8 shrink-0 items-center justify-center border-b border-slate-50 disabled:cursor-not-allowed dark:border-slate-800",
                    weekIndex > 0 && dayIndex === 0 && "border-l-2 border-slate-100 dark:border-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                      checked
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800",
                      isFuture && "opacity-40"
                    )}
                  >
                    {checked ? <Check size={12} strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ))}

      <div className="flex items-center pt-2">
        <div
          className="sticky left-0 z-10 shrink-0 bg-white dark:bg-slate-800"
          style={{ width: NAME_WIDTH }}
        >
          <AddHabitRow disabled={atCapacity} onAdd={onAddHabit} />
        </div>
      </div>
    </div>
  );
}

interface HabitNameCellProps {
  habit: Habit;
  onRename: (name: string) => void;
  onRemove: () => void;
}

function HabitNameCell({ habit, onRename, onRemove }: HabitNameCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);

  function commit() {
    setEditing(false);
    onRename(draft);
    setDraft(habit.name);
  }

  return (
    <div
      className="sticky left-0 z-10 flex shrink-0 items-center gap-1 border-b border-slate-50 bg-white py-1.5 pr-2 dark:border-slate-800 dark:bg-slate-800"
      style={{ width: NAME_WIDTH }}
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
            if (event.key === "Escape") {
              setDraft(habit.name);
              setEditing(false);
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-brand-300 px-1.5 py-0.5 text-sm text-slate-900 focus:outline-none dark:bg-slate-900 dark:text-slate-100"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 truncate rounded-lg px-1.5 py-0.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {habit.name}
        </button>
      )}
      <button
        type="button"
        aria-label="습관 삭제"
        onClick={onRemove}
        className="shrink-0 rounded-full p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
      >
        <X size={13} />
      </button>
    </div>
  );
}

interface AddHabitRowProps {
  disabled: boolean;
  onAdd: (name: string) => void;
}

function AddHabitRow({ disabled, onAdd }: AddHabitRowProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
    inputRef.current?.focus();
  }

  if (disabled) {
    return (
      <p className="px-1.5 py-1 text-xs text-slate-300 dark:text-slate-600">
        습관은 최대 15개까지 등록할 수 있어요
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 py-1">
      <Plus size={13} className="shrink-0 text-slate-300 dark:text-slate-600" />
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          submit();
        }}
        onBlur={submit}
        placeholder="습관 추가"
        aria-label="습관 추가"
        className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-600"
      />
    </div>
  );
}
