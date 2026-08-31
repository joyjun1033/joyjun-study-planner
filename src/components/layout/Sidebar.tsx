"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useEvents } from "@/hooks/useEvents";
import { useGoals } from "@/hooks/useGoals";
import { useToday } from "@/hooks/useToday";
import { daysUntil } from "@/lib/date";

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/schedule", label: "시험 일정", icon: CalendarDays },
  { href: "/grades", label: "시험 성적", icon: GraduationCap },
  { href: "/habits", label: "습관 트래커", icon: ListChecks },
  { href: "/screentime", label: "스크린타임", icon: Smartphone },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { events } = useEvents();
  const { goals } = useGoals();
  const today = useToday();

  const nextEvent = events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
      <Link href="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
          S
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Study Planner
        </span>
      </Link>

      {nextEvent ? (
        <Link
          href="/schedule"
          className="mb-6 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/15"
        >
          <span className="tnum shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
            {daysUntil(nextEvent.date) === 0 ? "D-DAY" : `D-${daysUntil(nextEvent.date)}`}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-brand-700 dark:text-brand-400">
            {nextEvent.title}
          </span>
        </Link>
      ) : null}

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                  : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}

        {goals.year ? (
          <p className="mt-4 px-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            [올해 목표: {goals.year}]
          </p>
        ) : null}
      </nav>

      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4 dark:border-slate-800">
        {session?.user ? (
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
              {session.user.name?.slice(0, 1) ?? "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {session.user.email}
              </p>
            </div>
          </div>
        ) : null}
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
              : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          )}
        >
          <Settings size={18} strokeWidth={1.8} />
          설정
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <LogOut size={18} strokeWidth={1.8} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
