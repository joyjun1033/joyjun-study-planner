"use client";

import { useEffect, useRef, useState } from "react";
import { ListChecks } from "lucide-react";
import { DateNav } from "./DateNav";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTodos } from "@/hooks/useTodos";
import { useToday } from "@/hooks/useToday";

export function TodoSection() {
  const today = useToday();
  const [dateKey, setDateKey] = useState(today);
  const prevToday = useRef(today);

  // 자정이 지나면(오늘을 보고 있었을 때에 한해) 새 날짜의 리스트로 넘어간다
  useEffect(() => {
    if (today === prevToday.current) return;
    setDateKey((current) => (current === prevToday.current ? today : current));
    prevToday.current = today;
  }, [today]);

  const { todos, addTodo, toggleTodo, removeTodo, doneCount, percent } = useTodos(dateKey);
  const isToday = dateKey === today;

  return (
    <Card>
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {isToday ? "오늘 할 일" : "지난 기록"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {todos.length === 0 ? (
              "아직 등록된 할 일이 없습니다"
            ) : (
              <>
                <span className="tnum font-semibold text-brand-600">
                  {doneCount}/{todos.length} 완료
                </span>
                <span className="tnum text-slate-400 dark:text-slate-500"> · {percent}%</span>
              </>
            )}
          </p>
        </div>
        <DateNav dateKey={dateKey} onChange={setDateKey} />
      </header>

      {todos.length > 0 ? (
        <div className="mb-5">
          <ProgressBar percent={percent} />
        </div>
      ) : null}

      {todos.length > 0 ? (
        <ul className="mb-5 -mx-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onRemove={removeTodo}
            />
          ))}
        </ul>
      ) : (
        <div className="mb-5">
          <EmptyState
            icon={<ListChecks size={28} strokeWidth={1.5} />}
            title={isToday ? "오늘의 첫 할 일을 추가해 보세요" : "이 날짜에는 기록이 없습니다"}
            description={isToday ? "작게 쪼갤수록 체크하기 쉬워집니다" : undefined}
          />
        </div>
      )}

      <TodoInput onAdd={addTodo} />
    </Card>
  );
}
