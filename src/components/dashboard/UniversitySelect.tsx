"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { UNIVERSITIES } from "@/lib/universities";
import { getUniversityLogoUrl } from "@/lib/universityLogos";

interface UniversitySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_SUGGESTIONS = 30;

/**
 * 검색형 셀렉트. 타이핑하면 포함되는 대학만 드롭다운으로 보여주고,
 * 목록에 없는 학교는 "직접 입력"으로 그대로 등록할 수 있다.
 */
export function UniversitySelect({ value, onChange }: UniversitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();

  const matches = useMemo(() => {
    if (!trimmed) return UNIVERSITIES.slice(0, MAX_SUGGESTIONS);
    return UNIVERSITIES.filter((name) => name.includes(trimmed)).slice(0, MAX_SUGGESTIONS);
  }, [trimmed]);

  // 목록에 없는 이름이면 "직접 입력" 항목을 하나 더 붙인다
  const allowCustom = trimmed !== "" && !UNIVERSITIES.includes(trimmed);
  const optionCount = matches.length + (allowCustom ? 1 : 0);

  useEffect(() => {
    setActiveIndex(0);
  }, [trimmed]);

  // 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function select(name: string) {
    const next = name.trim();
    if (!next) return;
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (optionCount === 0) return;
      setOpen(true);
      setActiveIndex((prev) => {
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return (prev + delta + optionCount) % optionCount;
      });
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (optionCount === 0) return;
      const picked = activeIndex < matches.length ? matches[activeIndex] : trimmed;
      select(picked);
    }
  }

  if (value) {
    const logoUrl = getUniversityLogoUrl(value);
    return (
      <div>
        <div className="flex items-start gap-2">
          <p className="flex-1 text-[15px] font-semibold leading-relaxed text-slate-900">
            {value}
          </p>
          <button
            type="button"
            aria-label="목표 대학 선택 해제"
            onClick={() => {
              onChange("");
              setQuery("");
            }}
            className="mt-0.5 shrink-0 rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
          >
            <X size={15} />
          </button>
        </div>
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${value} 로고`}
            width={28}
            height={28}
            className="mt-2 h-7 w-7 rounded-md"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
        <Search size={15} className="shrink-0 text-slate-300" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="대학 이름 검색"
          aria-label="목표 대학 검색"
          aria-expanded={open}
          role="combobox"
          aria-controls="university-listbox"
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none"
        />
      </div>

      {open ? (
        <ul
          id="university-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {matches.map((name, index) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(name)}
                className={cn(
                  "w-full px-3.5 py-2 text-left text-sm transition-colors",
                  index === activeIndex
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-slate-600"
                )}
              >
                {name}
              </button>
            </li>
          ))}

          {allowCustom ? (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === matches.length}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(matches.length)}
                onClick={() => select(trimmed)}
                className={cn(
                  "w-full border-t border-slate-100 px-3.5 py-2 text-left text-sm transition-colors",
                  activeIndex === matches.length
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-500"
                )}
              >
                <span className="font-medium text-slate-900">{trimmed}</span>
                <span className="ml-1.5 text-xs">직접 입력</span>
              </button>
            </li>
          ) : null}

          {optionCount === 0 ? (
            <li className="px-3.5 py-3 text-sm text-slate-400">검색 결과가 없습니다</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
