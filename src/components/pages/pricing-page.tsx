"use client";

import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import {
  createBundle,
  derivePricingPlans,
  deriveRateRows,
  deriveRoomCards,
  formatYen,
  formatYenPerHour,
} from "@/lib/meetingroom-view";

export function PricingPageClient() {
  const { rooms, reservations, participants, equipment, loading, refreshing, error, refetch } =
    useSupabaseMeetingData();

  if (loading || refreshing) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <EmptyState
        title="エラーが発生しました"
        description="もう一度試してください"
        action={
          <Button
            className="h-12 rounded-2xl bg-[#d9efff] px-5 text-slate-900 hover:bg-[#c9e6ff]"
            onClick={refetch}
          >
            リロード
          </Button>
        }
      />
    );
  }

  const roomCards = deriveRoomCards(createBundle(rooms, reservations, participants, equipment));
  const pricingPlans = derivePricingPlans(roomCards);
  const rateRows = deriveRateRows(roomCards);

  if (pricingPlans.length === 0) {
    return (
      <EmptyState
        title="料金データがありません"
        description="会議室の料金を登録すると、この料金ガイドに反映されます。"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Pricing"
        title="時間単位の金額がすぐ分かる料金ガイド"
        description="時間ごとの料金をまとめて見比べられます。"
        actions={
          <>
            <Link
              href="/schedule"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff]"
            >
              料金から予約へ進む
            </Link>
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-slate-200 bg-white px-5"
              onClick={refetch}
            >
              再読み込み
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="surface-card border-slate-100">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <Badge className={plan.badgeClass}>{plan.badge}</Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] bg-[#f6f9fc] p-5">
                <p className="text-sm text-slate-500">時間単価</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {formatYenPerHour(plan.hourlyRate)}
                </p>
              </div>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>・{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">時間単位の料金比較</CardTitle>
          <CardDescription>
            1時間、2時間、4時間の目安料金をまとめています。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>会議室タイプ</TableHead>
                <TableHead>1時間</TableHead>
                <TableHead>2時間</TableHead>
                <TableHead>4時間</TableHead>
                <TableHead>補足</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rateRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-semibold text-slate-900">
                    {row.name}
                  </TableCell>
                  <TableCell>{formatYen(row.oneHour)}</TableCell>
                  <TableCell>{formatYen(row.twoHours)}</TableCell>
                  <TableCell>{formatYen(row.fourHours)}</TableCell>
                  <TableCell className="text-slate-500">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
