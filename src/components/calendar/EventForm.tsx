"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AddEventInput, EventCategoryOption } from "@/hooks/useEvents";
import { EVENT_COLOR_PALETTE, type DateKey } from "@/lib/types";

interface EventFormProps {
  date: DateKey;
  categories: EventCategoryOption[];
  onAdd: (input: AddEventInput) => void;
}

export function EventForm({ date, categories, onAdd }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [selected, setSelected] = useState<EventCategoryOption | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(EVENT_COLOR_PALETTE[0]);
  const [repeat, setRepeat] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState("");

  const chips: EventCategoryOption[] =
    selected && !categories.some((category) => category.name === selected.name)
      ? [selected, ...categories]
      : categories;

  function confirmNewCategory() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSelected({ name: trimmed, color: newColor });
    setCreating(false);
    setNewName("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    if (repeat && (!repeatUntil || repeatUntil < date)) return;

    onAdd({
      title,
      subject,
      category: selected?.name ?? "",
      color: selected?.color,
      repeatUntil: repeat ? repeatUntil : undefined,
    });

    setTitle("");
    setSubject("");
    setRepeat(false);
    setRepeatUntil("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="event-title">
          일정 제목
        </label>
        <input
          id="event-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="예: 9월 모의고사"
          className="field"
        />
      </div>

      <div>
        <label className="label" htmlFor="event-subject">
          메모 <span className="font-normal text-slate-400 dark:text-slate-500">(선택)</span>
        </label>
        <input
          id="event-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="예: 수학, 3층 동아리방"
          className="field"
        />
      </div>

      <div>
        <p className="label">종류</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected === null
                ? "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            없음
          </button>
          {chips.map((category) => {
            const active = selected?.name === category.name;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelected(category)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-transparent text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
                style={active ? { backgroundColor: category.color } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: active ? "#FFFFFF" : category.color }}
                />
                {category.name}
              </button>
            );
          })}
          {!creating ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              + 새 종류
            </button>
          ) : null}
        </div>

        {creating ? (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="종류 이름 (예: 동아리)"
              className="field"
              autoFocus
            />
            <div className="flex items-center gap-2">
              {EVENT_COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  onClick={() => setNewColor(color)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-transform",
                    newColor === color && "scale-110 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setNewName("");
                }}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmNewCategory}
                disabled={!newName.trim()}
                className="btn-primary px-3 py-1.5 text-xs"
              >
                이 종류 사용
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={repeat}
            onChange={(event) => setRepeat(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
          />
          매주 반복
        </label>
        {repeat ? (
          <div>
            <label className="label" htmlFor="event-repeat-until">
              반복 종료일
            </label>
            <input
              id="event-repeat-until"
              type="date"
              min={date}
              value={repeatUntil}
              onChange={(event) => setRepeatUntil(event.target.value)}
              className="field"
            />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={!title.trim() || (repeat && (!repeatUntil || repeatUntil < date))}
      >
        <Plus size={16} strokeWidth={2.4} />
        추가
      </button>
    </form>
  );
}
