import Link from "next/link";
import { ArrowRight, Calculator, Clock3 } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
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
import { formatYen, pricingPlans, rateRows } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Pricing"
        title="時間単位の金額がすぐ分かる料金ガイド"
        description="合計金額だけでなく、1時間ごとの費用が直感的に分かる構成にしています。"
        actions={
          <Link
            href="/schedule"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff]"
          >
            料金から予約へ進む
          </Link>
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
                  {formatYen(plan.hourlyRate)}
                  <span className="ml-2 text-base font-medium text-slate-500">
                    / 時間
                  </span>
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

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#fff0df] p-3">
                <Clock3 className="size-5 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-xl">時間単位の料金比較</CardTitle>
                <CardDescription>
                  企業ユーザーが見積もり感覚で比較できるよう、時間軸で揃えています。
                </CardDescription>
              </div>
            </div>
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

        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#dff4e5] p-3">
                <Calculator className="size-5 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-xl">見積もり例</CardTitle>
                <CardDescription>
                  役員会議を2時間実施する想定のダミー見積もりです。
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="surface-soft p-4">
              <p className="text-sm text-slate-500">プラン</p>
              <p className="mt-1 font-semibold text-slate-900">
                Executive Suite
              </p>
            </div>
            <div className="surface-soft p-4">
              <p className="text-sm text-slate-500">利用時間</p>
              <p className="mt-1 font-semibold text-slate-900">2時間</p>
            </div>
            <div className="surface-soft p-4">
              <p className="text-sm text-slate-500">時間料金</p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatYen(6800)} × 2
              </p>
            </div>
            <div className="rounded-[24px] bg-[#172033] px-5 py-4 text-white">
              <p className="text-sm text-white/70">概算合計</p>
              <p className="mt-2 text-3xl font-semibold">{formatYen(13600)}</p>
            </div>
            <Link
              href="/schedule"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d9efff] px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-[#c9e6ff]"
            >
              この条件で予約する
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
