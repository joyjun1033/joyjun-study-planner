"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && password.length >= 8;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setLoading(false);
      setError(body.error ?? "회원가입에 실패했습니다.");
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("가입은 완료됐지만 로그인에 실패했습니다. 다시 로그인해주세요.");
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-base font-bold text-white">
            S
          </span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="signup-name">
              이름
            </label>
            <input
              id="signup-name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="signup-email">
              이메일
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="signup-password">
              비밀번호
              <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
                (8자 이상)
              </span>
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
            />
          </div>

          {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={!canSubmit || loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
