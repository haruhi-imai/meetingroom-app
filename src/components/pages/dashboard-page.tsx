"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  DoorOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { RoomCard } from "@/components/room-card";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import {
  createBundle,
  deriveDashboardStats,
  deriveRoomCards,
  deriveUpcomingReservations,
  featureHighlights,
  weeklyFocus,
} from "@/lib/meetingroom-view";

const actionLinkClass =
  "inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5";

export function DashboardPage() {
  const { isGuest } = useAuth();
  const { rooms, reservations, participants, equipment, loading, error, refetch } =
    useSupabaseMeetingData();

  if (loading) {
    return <LoadingOverlay />;
  }

  const bundle = createBundle(rooms, reservations, participants, equipment);
  const roomCards = deriveRoomCards(bundle);
  const dashboardStats = deriveDashboardStats(bundle, roomCards);
  const upcomingReservations = deriveUpcomingReservations(bundle);

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

  if (roomCards.length === 0) {
    return (
      <EmptyState
        title="会議室データがありません"
        description="Supabase の rooms / reservations / equipment テーブルにデータを入れると、このダッシュボードに反映されます。"
        action={
          <Button
            className="h-12 rounded-2xl bg-[#d9efff] px-5 text-slate-900 hover:bg-[#c9e6ff]"
            onClick={refetch}
          >
            再読み込み
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Main"
        title="空き会議室を一目で見て、そのまま予約できるダッシュボード"
        description="Supabase の rooms と reservations を読み込み、空室確認、料金把握、予約状況の要点をこの画面でまとめて見られるようにしています。"
        actions={
          <>
            <Link
              href="/schedule"
              className={`${actionLinkClass} bg-[#d9efff] hover:bg-[#c9e6ff]`}
            >
              今すぐ予約
            </Link>
            <Link
              href="/pricing"
              className={`${actionLinkClass} bg-[#ffe8d9] hover:bg-[#ffdcca]`}
            >
              時間料金を見る
            </Link>
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-slate-200 bg-white px-5"
              onClick={refetch}
            >
              <RefreshCw className="size-4" />
              最新化
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="surface-card border-slate-100">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">今日の最短予約導線</CardTitle>
                <CardDescription>
                  Supabase 上の会議室データから、予約判断に使う部屋をそのままカード化しています。
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="h-8 rounded-full bg-[#eef5ff] px-3 text-slate-700"
              >
                rooms: {roomCards.length}件
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs defaultValue="today" className="gap-5">
              <TabsList className="h-auto rounded-2xl bg-[#f4f7fb] p-1.5">
                <TabsTrigger
                  value="today"
                  className="rounded-xl px-4 py-2.5 data-active:bg-white"
                >
                  本日の空室
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="rounded-xl px-4 py-2.5 data-active:bg-white"
                >
                  今週の注目
                </TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {roomCards.slice(0, 3).map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyFocus.map((item) => (
                    <div
                      key={item.title}
                      className="surface-soft p-5 transition hover:-translate-y-0.5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-[#fff5ec] text-slate-700"
                        >
                          {item.badge}
                        </Badge>
                        <span className="text-sm text-slate-500">{item.meta}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="surface-card border-slate-100">
            <CardHeader>
              <CardTitle className="text-xl">直近の予約</CardTitle>
              <CardDescription>
                reservations テーブルから近い予定を表示しています。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingReservations.length === 0 ? (
                <p className="text-sm text-slate-500">予約データはまだありません。</p>
              ) : null}
              {upcomingReservations.map((reservation, index) => (
                <div key={`${reservation.title}-${reservation.time}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">{reservation.time}</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {reservation.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {reservation.room} | {isGuest ? "非表示" : reservation.host}
                      </p>
                    </div>
                    <Badge className="bg-[#dff4e5] text-slate-800">
                      {reservation.status}
                    </Badge>
                  </div>
                  {index < upcomingReservations.length - 1 ? (
                    <Separator className="mt-4" />
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card border-slate-100">
            <CardHeader>
              <CardTitle className="text-xl">運用メモ</CardTitle>
              <CardDescription>
                画面構成はそのままに、データだけ Supabase へ差し替えています。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="surface-soft flex items-start gap-3 p-4">
                <div className="rounded-2xl bg-[#f5e8ff] p-3 text-slate-800">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    会議室・予約・備品の3系統を連携
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    `rooms` と `reservations` に `equipment` を重ねて、カードUIへ変換しています。
                    {isGuest ? " guest アカウントでは一部の所有者情報を非表示にしています。" : null}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Link
                  href="/requests"
                  className="surface-soft flex items-center justify-between p-4 transition hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-900">
                    <DoorOpen className="size-5 text-slate-500" />
                    申請一覧を見る
                  </span>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
                <Link
                  href="/insights"
                  className="surface-soft flex items-center justify-between p-4 transition hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-900">
                    <ChartNoAxesCombined className="size-5 text-slate-500" />
                    利用傾向を見る
                  </span>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">主要機能画面</CardTitle>
          <CardDescription>
            各画面も Supabase 取得データを元に描画する構成に差し替えています。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featureHighlights.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="surface-soft flex h-full flex-col justify-between p-5 transition hover:-translate-y-1"
              >
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-[#f4f7fb] p-3">
                    <Icon className="size-5 text-slate-700" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>{feature.cta}</span>
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href="/schedule"
          className="surface-soft flex items-center justify-between px-5 py-4 text-slate-900 transition hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-3 font-semibold">
            <DoorOpen className="size-5 text-slate-500" />
            空室から予約へ進む
          </span>
          <ArrowRight className="size-4 text-slate-400" />
        </Link>
        <Link
          href="/pricing"
          className="surface-soft flex items-center justify-between px-5 py-4 text-slate-900 transition hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-3 font-semibold">
            <CircleDollarSign className="size-5 text-slate-500" />
            時間料金を比較する
          </span>
          <ArrowRight className="size-4 text-slate-400" />
        </Link>
        <Link
          href="/insights"
          className="surface-soft flex items-center justify-between px-5 py-4 text-slate-900 transition hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-3 font-semibold">
            <ChartNoAxesCombined className="size-5 text-slate-500" />
            稼働率を確認する
          </span>
          <ArrowRight className="size-4 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
