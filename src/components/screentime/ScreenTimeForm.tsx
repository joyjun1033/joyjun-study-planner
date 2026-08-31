"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { todayKey } from "@/lib/date";
import type { DateKey, ScreenTimeByDate } from "@/lib/types";

interface ScreenTimeFormProps {
  entries: ScreenTimeByDate;
  onSave: (date: DateKey, minutes: number) => void;
}

/** 총 분(minutes)을 시/분 입력칸에 채워 넣기 위한 변환 */
function splitMinutes(minutes: number | undefined) {
  if (!minutes) return { hours: "", minutes: "" };
  return { hours: String(Math.floor(minutes / 60)), minutes: String(minutes % 60) };
}

export function ScreenTimeForm({ entries, onSave }: ScreenTimeFormProps) {
  const [date, setDate] = useState(todayKey);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  // 이미 기록이 있는 날짜를 고르면 기존 값을 불러와 바로 수정할 수 있게 한다
  useEffect(() => {
    const existing = splitMinutes(entries[date]);
    setHours(existing.hours);
    setMinutes(existing.minutes);
  }, [date, entries]);

  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;
  const total = h * 60 + m;
  const canSubmit = date !== "" && total > 0 && h >= 0 && h <= 24 && m >= 0 && m < 60;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onSave(date, total);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="label" htmlFor="screentime-date">
            날짜
          </label>
          <input
            id="screentime-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="field tnum"
          />
        </div>

        <div className="w-24">
          <label className="label" htmlFor="screentime-hours">
            시간
          </label>
          <input
            id="screentime-hours"
            type="number"
            inputMode="numeric"
            min={0}
            max={24}
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            placeholder="0"
            className="field tnum"
          />
        </div>

        <div className="w-24">
          <label className="label" htmlFor="screentime-minutes">
            분
          </label>
          <input
            id="screentime-minutes"
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            placeholder="0"
            className="field tnum"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          <Plus size={16} strokeWidth={2.4} />
          기록
        </button>
      </div>
    </form>
  );
}
