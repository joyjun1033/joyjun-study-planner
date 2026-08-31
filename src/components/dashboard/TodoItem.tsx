"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Todo } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50">
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.text}
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          todo.done
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 bg-white hover:border-brand-400"
        )}
      >
        {todo.done ? <Check size={13} strokeWidth={3} /> : null}
      </button>

      <span
        className={cn(
          "flex-1 text-sm transition-colors",
          todo.done ? "text-slate-400 line-through" : "text-slate-700"
        )}
      >
        {todo.text}
      </span>

      <button
        type="button"
        aria-label="삭제"
        onClick={() => onRemove(todo.id)}
        className="rounded-full p-1 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100"
      >
        <X size={15} />
      </button>
    </li>
  );
}
