"use client";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { useAuth } from "@/components/auth-provider";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import {
  createBundle,
  deriveInsightStats,
  deriveRoomCards,
  deriveUtilizationByRoom,
  deriveWeeklyUsage,
} from "@/lib/meetingroom-view";

export function InsightsPageClient() {
  const { isGuest } = useAuth();
  const { rooms, reservations, participants, equipment, loading, refreshing, error, refetch } =
    useSupabaseMeetingData();

  if (isGuest) {
    return (
      <EmptyState
        title="この画面は利用できません"
        description="ゲスト利用ではインサイトを閲覧できません。管理用アカウントでログインしてください。"
      />
    );
  }

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

  const bundle = createBundle(rooms, reservations, participants, equipment);
  const roomCards = deriveRoomCards(bundle);
  const insightStats = deriveInsightStats(bundle, roomCards);
  const utilizationByRoom = deriveUtilizationByRoom(bundle);
  const weeklyUsage = deriveWeeklyUsage(reservations);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Insights"
        title="会議室の使われ方を把握する利用インサイト"
        description="稼働率や利用の偏りを見ながら、改善ポイントを把握できます。"
        actions={
          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 bg-white px-5"
            onClick={refetch}
          >
            再読み込み
          </Button>
        }
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
              会議室ごとの使われ方を比較できます。
          </CardDescription>
        </CardHeader>
          <CardContent className="space-y-5">
            {utilizationByRoom.map((item) => (
              <Progress key={item.room} value={item.value} className="gap-2">
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
            <CardTitle className="text-xl">運用メモ</CardTitle>
            <CardDescription>
              改善のヒントを短くまとめています。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="surface-soft p-4 text-sm leading-6 text-slate-600">
              よく使われる会議室と余力のある会議室を分けて見られるようにしています。
            </div>
            <div className="surface-soft p-4 text-sm leading-6 text-slate-600">
              予約が集中しやすい時間帯を把握しやすくしています。
            </div>
            <div className="surface-soft p-4 text-sm leading-6 text-slate-600">
              将来的には参加人数や設備利用もあわせて確認できます。
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">週次トレンド</CardTitle>
          <CardDescription>
            予約開始曜日の分布を横棒の比率として可視化しています。
          </CardDescription>
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
