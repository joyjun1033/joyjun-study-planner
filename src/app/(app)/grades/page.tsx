import { GradesView } from "@/components/grades/GradesView";
import { PageHeader } from "@/components/layout/PageHeader";

export default function GradesPage() {
  return (
    <>
      <PageHeader
        title="시험 성적"
        description="시험 성적을 기록하고 과목별 추이를 확인하세요."
      />
      <GradesView />
    </>
  );
}
