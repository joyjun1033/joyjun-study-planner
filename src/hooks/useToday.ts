"use client";

import { useEffect, useState } from "react";
import { todayKey } from "@/lib/date";
import type { DateKey } from "@/lib/types";

/**
 * 자정을 넘기면 값이 바뀌는 "오늘" 날짜 키.
 * 페이지를 켜둔 채로 날짜가 바뀌어도 새 리스트로 넘어가게 해준다.
 */
export function useToday(): DateKey {
  const [today, setToday] = useState<DateKey>(todayKey);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setToday((prev) => {
        const next = todayKey();
        return next === prev ? prev : next;
      });
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return today;
}
