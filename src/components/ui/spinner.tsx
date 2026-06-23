import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({
  className,
  label = "読み込み中",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
