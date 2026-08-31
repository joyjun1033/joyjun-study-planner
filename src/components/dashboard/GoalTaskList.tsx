"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/storage";
import type { GoalTask } from "@/lib/types";

interface GoalTaskListProps {
  tasks: GoalTask[];
  onChange: (tasks: GoalTask[]) => void;
  placeholder?: string;
}

/**
 * 1. 2. 3. 번호가 붙는 목표 리스트.
 * 맨 아래 입력줄에서 Enter를 누르면 항목이 추가되고 다음 번호가 이어진다.
 */
export function GoalTaskList({ tasks, onChange, placeholder }: GoalTaskListProps) {
  const [draft, setDraft] = useState("");
  const draftRef = useRef<HTMLInputElement>(null);

  function addFromDraft() {
    const text = draft.trim();
    if (!text) return;
    onChange([...tasks, { id: createId(), text, done: false }]);
    setDraft("");
  }

  function updateTask(id: string, changes: Partial<GoalTask>) {
    onChange(tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)));
  }

  function removeTask(id: string) {
    onChange(tasks.filter((task) => task.id !== id));
  }

  return (
    <ol className="flex flex-col gap-0.5">
      {tasks.map((task, index) => (
        <li key={task.id} className="group flex items-center gap-2">
          <span
            className={cn(
              "tnum w-4 shrink-0 text-right text-xs font-semibold",
              task.done ? "text-slate-300 dark:text-slate-600" : "text-slate-400 dark:text-slate-500"
            )}
          >
            {index + 1}.
          </span>

          <button
            type="button"
            role="checkbox"
            aria-checked={task.done}
            aria-label={task.text || `${index + 1}번 항목 달성`}
            onClick={() => updateTask(task.id, { done: !task.done })}
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
              task.done
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 bg-white hover:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
            )}
          >
            {task.done ? <Check size={11} strokeWidth={3} /> : null}
          </button>

          <input
            value={task.text}
            onChange={(event) => updateTask(task.id, { text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              draftRef.current?.focus();
            }}
            aria-label={`${index + 1}번 목표`}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm focus:outline-none",
              task.done
                ? "text-slate-400 line-through dark:text-slate-600"
                : "text-slate-700 dark:text-slate-200"
            )}
          />

          <button
            type="button"
            aria-label="항목 삭제"
            onClick={() => removeTask(task.id)}
            className="shrink-0 rounded-full p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={14} />
          </button>
        </li>
      ))}

      <li className="flex items-center gap-2">
        <span className="tnum w-4 shrink-0 text-right text-xs font-semibold text-slate-300 dark:text-slate-600">
          {tasks.length + 1}.
        </span>
        <span className="h-4 w-4 shrink-0 rounded border border-dashed border-slate-200 dark:border-slate-700" />
        <input
          ref={draftRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            addFromDraft();
          }}
          onBlur={addFromDraft}
          placeholder={placeholder ?? "입력 후 Enter"}
          aria-label="목표 항목 추가"
          className="min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-600"
        />
      </li>
    </ol>
  );
}

interface TaskProgressProps {
  tasks: GoalTask[];
}

/** "3/5 달성" 진행 상황 */
export function TaskProgress({ tasks }: TaskProgressProps) {
  const done = tasks.filter((task) => task.done).length;
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="tnum shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {done}/{tasks.length} 달성
      </span>
    </div>
  );
}
