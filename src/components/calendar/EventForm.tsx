"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface EventFormProps {
  onAdd: (title: string, subject: string) => void;
}

export function EventForm({ onAdd }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title, subject);
    setTitle("");
    setSubject("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="label" htmlFor="event-title">
          일정 제목
        </label>
        <input
          id="event-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="예: 9월 모의고사"
          className="field"
        />
      </div>
      <div className="w-40">
        <label className="label" htmlFor="event-subject">
          과목
        </label>
        <input
          id="event-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="예: 수학"
          className="field"
        />
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={!title.trim()}>
        <Plus size={16} strokeWidth={2.4} />
        추가
      </button>
    </form>
  );
}
