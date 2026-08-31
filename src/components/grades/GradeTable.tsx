"use client";

import { GraduationCap, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatShortDate } from "@/lib/date";
import type { Grade } from "@/lib/types";

interface GradeTableProps {
  grades: Grade[];
  onRemove: (id: string) => void;
}

export function GradeTable({ grades, onRemove }: GradeTableProps) {
  if (grades.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap size={28} strokeWidth={1.5} />}
        title="아직 입력한 성적이 없습니다"
        description="위 폼에서 첫 시험 성적을 기록해 보세요"
      />
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
          <th className="pb-3 pl-2 font-medium">날짜</th>
          <th className="pb-3 font-medium">시험</th>
          <th className="pb-3 font-medium">과목</th>
          <th className="pb-3 text-right font-medium">기록</th>
          <th className="w-10 pb-3" />
        </tr>
      </thead>
      <tbody>
        {grades.map((grade) => (
          <tr key={grade.id} className="group border-b border-slate-50 last:border-0">
            <td className="tnum py-3.5 pl-2 text-slate-500">{formatShortDate(grade.date)}</td>
            <td className="py-3.5 font-medium text-slate-800">{grade.examName}</td>
            <td className="py-3.5">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {grade.subject}
              </span>
            </td>
            <td className="tnum py-3.5 text-right font-semibold text-slate-900">
              {grade.value}
              <span className="ml-0.5 text-xs font-medium text-slate-400">
                {grade.scoreType === "score" ? "점" : "등급"}
              </span>
            </td>
            <td className="py-3.5 text-right">
              <button
                type="button"
                aria-label="성적 삭제"
                onClick={() => onRemove(grade.id)}
                className="rounded-full p-1 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-500 focus:opacity-100 group-hover:opacity-100"
              >
                <X size={15} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
