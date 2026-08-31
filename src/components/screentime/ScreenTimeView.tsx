"use client";

import { ScreenTimeChart } from "./ScreenTimeChart";
import { ScreenTimeForm } from "./ScreenTimeForm";
import { ScreenTimeTable } from "./ScreenTimeTable";
import { Card, CardHeader } from "@/components/ui/Card";
import { useScreenTime } from "@/hooks/useScreenTime";

export function ScreenTimeView() {
  const { entries, sortedDates, setEntry, removeEntry } = useScreenTime();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="스크린타임 입력" description="오늘 사용한 스크린타임을 직접 기록하세요." />
        <ScreenTimeForm entries={entries} onSave={setEntry} />
      </Card>

      <Card>
        <CardHeader title="변화 추이" description="주간·월간 단위로 스크린타임 변화를 확인하세요." />
        <ScreenTimeChart entries={entries} />
      </Card>

      <Card>
        <CardHeader
          title="기록"
          description="최신순으로 정렬됩니다."
          action={<span className="tnum text-sm text-slate-400">{sortedDates.length}건</span>}
        />
        <ScreenTimeTable dates={sortedDates} minutesByDate={entries} onRemove={removeEntry} />
      </Card>
    </div>
  );
}
