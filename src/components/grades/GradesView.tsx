"use client";

import { useMemo, useState } from "react";
import { GradeChart } from "./GradeChart";
import { GradeForm } from "./GradeForm";
import { GradeTable } from "./GradeTable";
import { ALL_SUBJECTS, SubjectFilter } from "./SubjectFilter";
import { Card, CardHeader } from "@/components/ui/Card";
import { useGrades } from "@/hooks/useGrades";

export function GradesView() {
  const { sorted, subjects, addGrade, removeGrade } = useGrades();
  const [subject, setSubject] = useState<string>(ALL_SUBJECTS);

  // 필터에 있던 과목이 모두 삭제되면 전체로 되돌린다
  const activeSubject = subjects.includes(subject) ? subject : ALL_SUBJECTS;

  const filtered = useMemo(
    () =>
      activeSubject === ALL_SUBJECTS
        ? sorted
        : sorted.filter((grade) => grade.subject === activeSubject),
    [sorted, activeSubject]
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="성적 입력" description="시험 이름, 과목, 날짜와 기록을 남겨보세요." />
        <GradeForm onAdd={addGrade} />
      </Card>

      {sorted.length > 0 ? (
        <Card>
          <CardHeader
            title="과목별 추이"
            description={
              activeSubject === ALL_SUBJECTS
                ? "기록한 시험 순서대로 과목별 변화를 보여줍니다."
                : `${activeSubject} 과목의 변화를 보여줍니다.`
            }
          />
          <GradeChart grades={filtered} />
        </Card>
      ) : null}

      <Card>
        <CardHeader
          title="성적 기록"
          description="최신순으로 정렬됩니다."
          action={
            <span className="tnum text-sm text-slate-400 dark:text-slate-500">
              {filtered.length}건
            </span>
          }
        />
        {subjects.length > 0 ? (
          <div className="mb-5">
            <SubjectFilter
              subjects={subjects}
              selected={activeSubject}
              onChange={setSubject}
            />
          </div>
        ) : null}
        <GradeTable grades={filtered} onRemove={removeGrade} />
      </Card>
    </div>
  );
}
