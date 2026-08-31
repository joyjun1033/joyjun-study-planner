"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="할 일을 입력하고 Enter"
        aria-label="할 일 추가"
        className="field flex-1"
      />
      <button type="submit" className="btn-primary shrink-0" disabled={!text.trim()}>
        <Plus size={16} strokeWidth={2.4} />
        추가
      </button>
    </form>
  );
}
