import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-slate-700">
      {icon ? <div className="mb-3 text-slate-300 dark:text-slate-600">{icon}</div> : null}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
