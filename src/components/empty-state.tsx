import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-[#fbfdff] px-6 py-14 text-center",
        className,
      )}
    >
      <div className="rounded-3xl bg-[#eef5ff] p-4 text-slate-700">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
