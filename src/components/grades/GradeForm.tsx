"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { todayKey } from "@/lib/date";
import type { NewGrade } from "@/hooks/useGrades";
import type { ScoreType } from "@/lib/types";

interface GradeFormProps {
  onAdd: (grade: NewGrade) => void;
}

const SCORE_TYPES: Array<{ value: ScoreType; label: string; hint: string }> = [
  { value: "score", label: "점수", hint: "0 ~ 100" },
  { value: "grade", label: "등급", hint: "1 ~ 9" },
];

export function GradeForm({ onAdd }: GradeFormProps) {
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(todayKey);
  const [scoreType, setScoreType] = useState<ScoreType>("score");
  const [value, setValue] = useState("");

  const max = scoreType === "score" ? 100 : 9;
  const min = scoreType === "score" ? 0 : 1;
  const parsed = Number(value);
  const valueValid = value !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max;
  const canSubmit = examName.trim() !== "" && subject.trim() !== "" && date !== "" && valueValid;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onAdd({
      examName: examName.trim(),
      subject: subject.trim(),
      date,
      scoreType,
      value: parsed,
    });
    setExamName("");
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="label" htmlFor="grade-exam">
            시험 이름
          </label>
          <input
            id="grade-exam"
            value={examName}
            onChange={(event) => setExamName(event.target.value)}
            placeholder="예: 1학기 중간고사"
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="grade-subject">
            과목
          </label>
          <input
            id="grade-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="예: 수학"
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="grade-date">
            날짜
          </label>
          <input
            id="grade-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="field tnum"
          />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div>
          <span className="label">기록 방식</span>
          <div className="inline-flex rounded-full border border-slate-200 p-1 dark:border-slate-700">
            {SCORE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setScoreType(type.value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  scoreType === type.value
                    ? "bg-brand-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-32">
          <label className="label" htmlFor="grade-value">
            {scoreType === "score" ? "점수" : "등급"}
            <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
              ({min} ~ {max})
            </span>
          </label>
          <input
            id="grade-value"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={scoreType === "score" ? 0.1 : 1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={scoreType === "score" ? "92" : "2"}
            className="field tnum"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          <Plus size={16} strokeWidth={2.4} />
          성적 추가
        </button>
      </div>
    </form>
  );
}
