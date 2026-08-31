"use client";

import { Plus, X } from "lucide-react";
import { createId } from "@/lib/storage";
import type { Grade, ScoreTarget } from "@/lib/types";

interface ScoreTargetListProps {
  targets: ScoreTarget[];
  grades: Grade[];
  onChange: (targets: ScoreTarget[]) => void;
}

/** 같은 과목·같은 점수 유형의 최신 성적을 목표와 비교한다 (등급은 낮을수록 우수) */
function isAchieved(target: ScoreTarget, grades: Grade[]): boolean {
  if (!target.subject.trim()) return false;
  const match = grades.find(
    (grade) => grade.subject === target.subject && grade.scoreType === target.scoreType
  );
  if (!match) return false;
  return target.scoreType === "score" ? match.value >= target.value : match.value <= target.value;
}

/** "수학 - 92점" 같은 성적 목표를 여러 줄 추가할 수 있는 리스트 */
export function ScoreTargetList({ targets, grades, onChange }: ScoreTargetListProps) {
  function update(id: string, changes: Partial<ScoreTarget>) {
    onChange(targets.map((target) => (target.id === id ? { ...target, ...changes } : target)));
  }

  function remove(id: string) {
    onChange(targets.filter((target) => target.id !== id));
  }

  function add() {
    onChange([...targets, { id: createId(), subject: "", scoreType: "score", value: 0 }]);
  }

  return (
    <div className="flex flex-col gap-1">
      {targets.map((target) => {
        const achieved = isAchieved(target, grades);
        return (
          <div key={target.id} className="group flex items-center gap-1.5">
            <input
              value={target.subject}
              onChange={(event) => update(target.id, { subject: event.target.value })}
              placeholder="과목"
              aria-label="과목"
              className="min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                update(target.id, { scoreType: target.scoreType === "score" ? "grade" : "score" })
              }
              className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              {target.scoreType === "score" ? "점수" : "등급"}
            </button>

            <input
              type="number"
              value={target.value || ""}
              onChange={(event) => update(target.id, { value: Number(event.target.value) })}
              aria-label="목표 값"
              className="tnum w-12 shrink-0 rounded-lg border border-slate-200 px-1.5 py-1 text-right text-sm focus:border-brand-400 focus:outline-none"
            />

            {achieved ? (
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                달성
              </span>
            ) : null}

            <button
              type="button"
              aria-label="목표 삭제"
              onClick={() => remove(target.id)}
              className="shrink-0 rounded-full p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="mt-0.5 flex items-center gap-1 self-start text-xs font-medium text-slate-400 transition-colors hover:text-brand-600"
      >
        <Plus size={13} /> 목표 추가
      </button>
    </div>
  );
}
