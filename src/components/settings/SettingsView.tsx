"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useTheme } from "@/components/providers/ThemeProvider";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { ThemePreference } from "@/lib/theme";

export function SettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <ThemeCard />
      <ProfileCard />
      <PasswordCard />
      <DangerZoneCard />
    </div>
  );
}

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: "system", label: "시스템", icon: Monitor },
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
];

function ThemeCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader title="테마" description="라이트/다크 모드를 선택하세요." />
      <div className="inline-flex rounded-full border border-slate-200 p-1 dark:border-slate-700">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
            >
              <Icon size={15} />
              {option.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ProfileCard() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(session?.user?.name ?? "");
  }, [session?.user?.name]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    setMessage("");
    try {
      await apiRequest("/api/account", "PATCH", { name: trimmed });
      await update({ user: { name: trimmed } });
      setMessage("저장되었습니다.");
    } catch {
      setMessage("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader title="프로필" description="이름과 이메일을 확인하고 수정하세요." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="max-w-sm">
          <label className="label" htmlFor="settings-name">
            이름
          </label>
          <input
            id="settings-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
          />
        </div>

        <div className="max-w-sm">
          <label className="label" htmlFor="settings-email">
            이메일
          </label>
          <input
            id="settings-email"
            value={session?.user?.email ?? ""}
            disabled
            className="field cursor-not-allowed bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={saving || !name.trim()}>
            {saving ? "저장 중..." : "저장"}
          </button>
          {message ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">{message}</span>
          ) : null}
        </div>
      </form>
    </Card>
  );
}

function PasswordCard() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit =
    currentPassword !== "" && newPassword.length >= 8 && newPassword === confirmPassword;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/account/password", "PATCH", { currentPassword, newPassword });
      // 보안을 위해 비밀번호 변경 후에는 다시 로그인하도록 한다
      await signOut({ redirect: false });
      router.push("/login");
    } catch {
      setError("현재 비밀번호가 올바르지 않거나 변경에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader title="비밀번호 변경" description="변경 후에는 다시 로그인해야 합니다." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="max-w-sm">
          <label className="label" htmlFor="current-password">
            현재 비밀번호
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="field"
          />
        </div>
        <div className="max-w-sm">
          <label className="label" htmlFor="new-password">
            새 비밀번호
            <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">(8자 이상)</span>
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="field"
          />
        </div>
        <div className="max-w-sm">
          <label className="label" htmlFor="confirm-password">
            새 비밀번호 확인
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="field"
          />
        </div>

        {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}

        <button type="submit" className="btn-primary self-start" disabled={!canSubmit || saving}>
          {saving ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </Card>
  );
}

function DangerZoneCard() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await apiRequest("/api/account", "DELETE");
      await signOut({ redirect: false });
      router.push("/signup");
    } catch {
      setDeleting(false);
    }
  }

  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <CardHeader title="계정 삭제" description="계정과 모든 데이터가 영구적으로 삭제됩니다." />
      {confirming ? (
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            정말로 삭제할까요? 되돌릴 수 없습니다.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? "삭제 중..." : "네, 삭제합니다"}
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="btn-secondary">
            취소
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          계정 삭제
        </button>
      )}
    </Card>
  );
}
