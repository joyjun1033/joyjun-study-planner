"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import type { Grade } from "@/lib/types";

export type NewGrade = Omit<Grade, "id" | "createdAt">;

export function useGrades() {
  const { data, mutate } = useSWR<Grade[]>("/api/grades", fetcher);
  const grades = data ?? [];

  /** 최신순 (같은 날짜면 나중에 입력한 것이 위로) */
  const sorted = useMemo(
    () =>
      [...grades].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [grades]
  );

  const subjects = useMemo(
    () =>
      Array.from(new Set(grades.map((grade) => grade.subject))).sort((a, b) =>
        a.localeCompare(b, "ko")
      ),
    [grades]
  );

  async function addGrade(input: NewGrade) {
    await apiRequest("/api/grades", "POST", input);
    mutate();
  }

  async function removeGrade(id: string) {
    mutate(
      grades.filter((grade) => grade.id !== id),
      false
    );
    await apiRequest(`/api/grades/${id}`, "DELETE");
    mutate();
  }

  return { grades, sorted, subjects, addGrade, removeGrade, hydrated: data !== undefined };
}
