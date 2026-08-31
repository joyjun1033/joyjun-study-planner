import { ScreenTimeView } from "@/components/screentime/ScreenTimeView";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ScreenTimePage() {
  return (
    <>
      <PageHeader
        title="스크린타임"
        description="스크린타임을 직접 기록하고 주간·월간 변화 추이를 확인하세요."
      />
      <ScreenTimeView />
    </>
  );
}
