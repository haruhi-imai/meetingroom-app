import { PageIntro } from "@/components/page-intro";
import { RequestsTableSkeleton } from "@/components/requests-table-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Requests"
        title="承認・調整・付帯依頼をまとめる運用画面"
        description="申請データを読み込んでいます。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface-card border border-slate-100 p-6">
            <Skeleton className="h-5 w-28 rounded-2xl" />
            <Skeleton className="mt-4 h-10 w-24 rounded-2xl" />
            <Skeleton className="mt-4 h-5 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">申請一覧</CardTitle>
          <CardDescription>申請データを読み込んでいます。</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
