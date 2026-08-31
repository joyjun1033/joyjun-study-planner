"use client";

import { cn } from "@/lib/cn";

interface SubjectFilterProps {
  subjects: string[];
  selected: string;
  onChange: (subject: string) => void;
}

export const ALL_SUBJECTS = "__all__";

export function SubjectFilter({ subjects, selected, onChange }: SubjectFilterProps) {
  if (subjects.length === 0) return null;

  const options = [{ value: ALL_SUBJECTS, label: "전체" }].concat(
    subjects.map((subject) => ({ value: subject, label: subject }))
  );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            selected === option.value
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
