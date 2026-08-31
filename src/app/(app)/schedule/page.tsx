import { ScheduleView } from "@/components/calendar/ScheduleView";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        title="시험 일정"
        description="날짜를 눌러 시험과 일정을 등록하고 관리하세요."
      />
      <ScheduleView />
    </>
  );
}
