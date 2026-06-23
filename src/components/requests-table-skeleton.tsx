import { Skeleton } from "@/components/ui/skeleton";

export function RequestsTableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={`head-${index}`}
            className="h-10 rounded-2xl bg-[#f0f5fb]"
          />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-6 gap-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
