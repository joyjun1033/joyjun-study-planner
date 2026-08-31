"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface GoalCardProps {
  label: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onCommit: (value: string) => void;
}

/**
 * 클릭하면 바로 편집되는 목표 카드.
 * 저장 버튼 없이 blur 시점(또는 언마운트 시점)에 자동 저장한다.
 */
export function GoalCard({ label, icon: Icon, placeholder, value, onCommit }: GoalCardProps) {
  const [draft, setDraft] = useState(value);
  const draftRef = useRef(draft);
  const commitRef = useRef(onCommit);
  const dirtyRef = useRef(false);

  draftRef.current = draft;
  commitRef.current = onCommit;

  // 외부(다른 탭/초기 로딩)에서 값이 바뀌면 편집 중이 아닐 때만 따라간다
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(value);
  }, [value]);

  // 저장 전에 페이지를 벗어나도 입력이 사라지지 않도록
  useEffect(() => {
    return () => {
      if (dirtyRef.current) commitRef.current(draftRef.current);
    };
  }, []);

  function handleBlur() {
    dirtyRef.current = false;
    onCommit(draft.trim());
    setDraft((prev) => prev.trim());
  }

  return (
    <div className="card p-5 transition-colors focus-within:border-brand-300">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} strokeWidth={1.8} />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <textarea
        rows={2}
        value={draft}
        placeholder={placeholder}
        aria-label={label}
        onChange={(event) => {
          dirtyRef.current = true;
          setDraft(event.target.value);
        }}
        onBlur={handleBlur}
        className="w-full resize-none border-0 bg-transparent p-0 text-[15px] font-semibold leading-relaxed
                   text-slate-900 placeholder:font-normal placeholder:text-slate-300 focus:outline-none"
      />
    </div>
  );
}
