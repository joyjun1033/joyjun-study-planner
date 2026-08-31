"use client";

import useSWR from "swr";
import { apiRequest, fetcher } from "@/lib/api";
import type { DateKey, Todo } from "@/lib/types";

/**
 * 할 일은 날짜 키별로 서버에서 가져온다.
 * 새 날짜가 되면 그 날짜의 목록이 비어 있는 상태로 시작하고,
 * 과거 날짜의 기록은 그대로 남아 조회할 수 있다.
 */
export function useTodos(dateKey: DateKey) {
  const { data, mutate } = useSWR<Todo[]>(`/api/todos?date=${dateKey}`, fetcher);
  const todos = data ?? [];

  async function addTodo(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    await apiRequest("/api/todos", "POST", { date: dateKey, text: trimmed });
    mutate();
  }

  async function toggleTodo(id: string) {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;
    mutate(
      todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      false
    );
    await apiRequest(`/api/todos/${id}`, "PATCH", { done: !target.done });
    mutate();
  }

  async function removeTodo(id: string) {
    mutate(
      todos.filter((todo) => todo.id !== id),
      false
    );
    await apiRequest(`/api/todos/${id}`, "DELETE");
    mutate();
  }

  const doneCount = todos.filter((todo) => todo.done).length;
  const percent = todos.length === 0 ? 0 : Math.round((doneCount / todos.length) * 100);

  return { todos, addTodo, toggleTodo, removeTodo, doneCount, percent, hydrated: data !== undefined };
}
