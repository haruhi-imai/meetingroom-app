import { Lightbulb, TrendingUp } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
} from "@/components/ui/progress";
import { insightStats, utilizationByRoom, weeklyUsage } from "@/lib/mock-data";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Insights"
        title="会議室の使われ方を把握する利用インサイト"
        description="管理者向けに、稼働率や偏りを短時間で判断できるダミー画面を用意しています。"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insightStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <CardTitle className="text-xl">会議室ごとの稼働率</CardTitle>
            <CardDescription>
              よく使われる会議室と空きが多い会議室を一覧で見分けられます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {utilizationByRoom.map((item) => (
              <Progress
                key={item.room}
                value={item.value}
                className="gap-2"
              >
                <div className="flex w-full items-center gap-3">
                  <ProgressLabel className="font-semibold text-slate-900">
                    {item.room}
                  </ProgressLabel>
                  <Badge className="bg-[#eef5ff] text-slate-700">
                    {item.note}
                  </Badge>
                  <span className="ml-auto text-sm text-slate-500">
                    {item.value}%
                  </span>
                </div>
              </Progress>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#fff0df] p-3">
                <Lightbulb className="size-5 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-xl">改善提案</CardTitle>
                <CardDescription>
                  データから次の改善候補を導く想定です。
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="surface-soft p-4">
              <p className="font-semibold text-slate-900">
                14:00〜16:00に予約が集中
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                人気フロアの中会議室を増やすか、時間帯によって価格調整する余地があります。
              </p>
            </div>
            <div className="surface-soft p-4">
              <p className="font-semibold text-slate-900">
                Atlas Room の稼働が高止まり
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                代替候補を予約時にレコメンドすることで、予約競合を減らせます。
              </p>
            </div>
            <div className="surface-soft p-4">
              <p className="font-semibold text-slate-900">
                No-show が月間5件
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                開始15分前のリマインドと、自動キャンセルルールの併用が有効です。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#dff4e5] p-3">
              <TrendingUp className="size-5 text-slate-700" />
            </div>
            <div>
              <CardTitle className="text-xl">週次トレンド</CardTitle>
              <CardDescription>
                棒の長さだけで変化量を比較できるよう、数値と横棒を組み合わせています。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {weeklyUsage.map((item) => (
            <div key={item.label} className="surface-soft p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {item.value}%
              </p>
              <div className="mt-4 h-3 rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#d9efff]"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
