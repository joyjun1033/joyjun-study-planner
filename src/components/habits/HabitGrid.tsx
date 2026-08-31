"use client";

import { useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { WEEKDAY_LABELS, type MonthDay } from "@/lib/date";
import type { Habit } from "@/lib/types";

const CELL_WIDTH = 36;
const NAME_WIDTH = 152;

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
  return (
    <div className="card p-6">
      <p className="mb-4 text-xs font-medium text-slate-500">
        습관 체크 · 최대 15개까지 등록할 수 있어요
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="sticky left-0 z-20 shrink-0 bg-white" style={{ width: NAME_WIDTH }} />
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                style={{ width: week.length * CELL_WIDTH }}
                className={cn(
                  "flex items-center justify-center border-b border-slate-100 pb-1.5 text-xs font-semibold text-slate-400",
                  weekIndex > 0 && "border-l-2 border-slate-100"
                )}
              >
                Week {weekIndex + 1}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="sticky left-0 z-20 shrink-0 border-b border-slate-100 bg-white" style={{ width: NAME_WIDTH }} />
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={day.key}
                  style={{ width: CELL_WIDTH }}
                  className={cn(
                    "flex shrink-0 flex-col items-center justify-center border-b border-slate-100 py-1.5",
                    weekIndex > 0 && dayIndex === 0 && "border-l-2 border-slate-100"
                  )}
                >
                  <span className="text-[10px] text-slate-400">{WEEKDAY_LABELS[day.weekday]}</span>
                  <span className="tnum text-xs font-medium text-slate-600">{day.day}</span>
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
                        "flex h-8 shrink-0 items-center justify-center border-b border-slate-50 disabled:cursor-not-allowed",
                        weekIndex > 0 && dayIndex === 0 && "border-l-2 border-slate-100"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                          checked
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-slate-200 bg-white",
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
            <div className="sticky left-0 z-10 shrink-0 bg-white" style={{ width: NAME_WIDTH }}>
              <AddHabitRow disabled={atCapacity} onAdd={onAddHabit} />
            </div>
          </div>
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
      className="sticky left-0 z-10 flex shrink-0 items-center gap-1 border-b border-slate-50 bg-white py-1.5 pr-2"
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
          className="min-w-0 flex-1 rounded-lg border border-brand-300 px-1.5 py-0.5 text-sm text-slate-900 focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 truncate rounded-lg px-1.5 py-0.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {habit.name}
        </button>
      )}
      <button
        type="button"
        aria-label="습관 삭제"
        onClick={onRemove}
        className="shrink-0 rounded-full p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100"
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
    return <p className="px-1.5 py-1 text-xs text-slate-300">습관은 최대 15개까지 등록할 수 있어요</p>;
  }

  return (
    <div className="flex items-center gap-1 py-1">
      <Plus size={13} className="shrink-0 text-slate-300" />
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
        className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none"
      />
    </div>
  );
}
