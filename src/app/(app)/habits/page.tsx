import { HabitTrackerView } from "@/components/habits/HabitTrackerView";
import { PageHeader } from "@/components/layout/PageHeader";

export default function HabitsPage() {
  return (
    <>
      <PageHeader
        title="습관 트래커"
        description="매일의 습관을 체크하고 한 달 단위로 달성률을 확인하세요."
      />
      <HabitTrackerView />
    </>
  );
}
