import { GoalSection } from "@/components/dashboard/GoalSection";
import { TodoSection } from "@/components/dashboard/TodoSection";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="대시보드"
        description="오늘 할 일을 체크하고, 목표를 한눈에 확인하세요."
      />
      <div className="flex flex-col gap-6">
        <GoalSection />
        <TodoSection />
      </div>
    </>
  );
}
