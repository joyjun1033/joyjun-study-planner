import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface GoalCardShellProps {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
  /** 카드 하단 진행 상황 등 부가 정보 */
  footer?: ReactNode;
  className?: string;
}

/** 목표 카드 4개가 같은 헤더/여백을 쓰도록 감싸는 껍데기 */
export function GoalCardShell({
  label,
  icon: Icon,
  children,
  footer,
  className,
}: GoalCardShellProps) {
  return (
    <div className={cn("card flex flex-col p-5", className)}>
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} strokeWidth={1.8} />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex-1">{children}</div>
      {footer ? (
        <div className="mt-4 border-t border-slate-100 pt-3">{footer}</div>
      ) : null}
    </div>
  );
}
