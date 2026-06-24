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
  "inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 md:h-12 md:px-5";

export function DashboardPage() {
  const { isGuest } = useAuth();
  const { rooms, reservations, participants, equipment, loading, error, refetch } =
    useSupabaseMeetingData();
  const visibleFeatureHighlights = featureHighlights.filter((feature) => {
    if (!isGuest) {
      return true;
    }

    return feature.href !== "/requests" && feature.href !== "/insights";
  });

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
        description="会議室や予約の情報を登録すると、このダッシュボードに反映されます。"
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
    <div className="space-y-4 md:space-y-6">
      <PageIntro
        eyebrow="Main"
        title="空き会議室をすぐ見つけて予約"
        description="空室確認、料金把握、予約状況の要点をこの画面でまとめて見られます。"
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
              className="h-10 rounded-2xl border-slate-200 bg-white px-4 md:h-12 md:px-5"
              onClick={refetch}
            >
              <RefreshCw className="size-4" />
              最新化
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="surface-card border-slate-100">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">今日の最短予約導線</CardTitle>
                <CardDescription>
                  予約判断に必要な会議室を、空き状況つきで見やすく並べています。
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="h-8 rounded-full bg-[#eef5ff] px-3 text-slate-700"
              >
                会議室 {roomCards.length}室
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-5">
            <Tabs defaultValue="today" className="gap-4 md:gap-5">
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
              <TabsContent value="today" className="space-y-3 md:space-y-4">
                <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {roomCards.slice(0, 3).map((room, index) => (
                    <div
                      key={room.id}
                      className={index === 2 ? "hidden xl:block" : undefined}
                    >
                      <RoomCard room={room} />
                    </div>
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

        <div className="space-y-4 md:space-y-6">
          <Card className="surface-card border-slate-100">
            <CardHeader>
              <CardTitle className="text-xl">直近の予約</CardTitle>
              <CardDescription>
                まもなく始まる予約を一覧で確認できます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {upcomingReservations.length === 0 ? (
                <p className="text-sm text-slate-500">予約データはまだありません。</p>
              ) : null}
              {upcomingReservations.slice(0, 3).map((reservation, index) => (
                <div key={`${reservation.title}-${reservation.time}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500 md:text-sm">{reservation.time}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 md:text-base">
                        {reservation.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 md:hidden">
                        {reservation.room}
                      </p>
                      <p className="mt-1 hidden text-sm text-slate-600 md:block">
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
                会議室運用で見落としやすいポイントをまとめています。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="surface-soft flex items-start gap-3 p-4">
                <div className="rounded-2xl bg-[#f5e8ff] p-3 text-slate-800">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    会議室・予約・備品の3系統を連携
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    会議室情報、予約状況、設備情報をまとめて、予約判断しやすい形に整理しています。
                    {isGuest ? " ゲスト利用時は一部の所有者情報を非表示にしています。" : null}
                  </p>
                </div>
              </div>
              {!isGuest ? (
                <details className="surface-soft p-4 md:hidden">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                    関連画面を開く
                  </summary>
                  <div className="mt-3 grid gap-3">
                    <Link
                      href="/requests"
                      className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-3 transition hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-3 font-semibold text-slate-900">
                        <DoorOpen className="size-5 text-slate-500" />
                        申請一覧を見る
                      </span>
                      <ArrowRight className="size-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/insights"
                      className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-3 transition hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-3 font-semibold text-slate-900">
                        <ChartNoAxesCombined className="size-5 text-slate-500" />
                        利用傾向を見る
                      </span>
                      <ArrowRight className="size-4 text-slate-400" />
                    </Link>
                  </div>
                </details>
              ) : null}
              {!isGuest ? (
                <div className="hidden gap-3 md:grid md:grid-cols-2">
                  <Link
                    href="/requests"
                    className="surface-soft flex items-center justify-between p-3.5 transition hover:-translate-y-0.5 md:p-4"
                  >
                    <span className="flex items-center gap-3 font-semibold text-slate-900">
                      <DoorOpen className="size-5 text-slate-500" />
                      申請一覧を見る
                    </span>
                    <ArrowRight className="size-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/insights"
                    className="surface-soft flex items-center justify-between p-3.5 transition hover:-translate-y-0.5 md:p-4"
                  >
                    <span className="flex items-center gap-3 font-semibold text-slate-900">
                      <ChartNoAxesCombined className="size-5 text-slate-500" />
                      利用傾向を見る
                    </span>
                    <ArrowRight className="size-4 text-slate-400" />
                  </Link>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">主要機能画面</CardTitle>
          <CardDescription>
            用途ごとに必要な画面へすぐ移動できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-5">
          {visibleFeatureHighlights.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={`surface-soft flex h-full flex-col justify-between p-4 md:p-5 transition hover:-translate-y-1 ${
                  feature.href === "/requests" || feature.href === "/insights"
                    ? "hidden md:flex"
                    : ""
                }`}
              >
                <div>
                  <div className="mb-3 inline-flex rounded-2xl bg-[#f4f7fb] p-3 md:mb-4">
                    <Icon className="size-5 text-slate-700" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 md:leading-6">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700 md:mt-4">
                  <span>{feature.cta}</span>
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
          <div className="surface-soft flex items-center justify-between p-4 text-sm font-semibold text-slate-700 md:hidden">
            <span>その他の機能はメニューから確認</span>
            <ArrowRight className="size-4 text-slate-400" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
        <Link
          href="/schedule"
          className="surface-soft flex items-center justify-between px-4 py-3.5 text-slate-900 transition hover:-translate-y-0.5 md:px-5 md:py-4"
        >
          <span className="flex items-center gap-3 font-semibold">
            <DoorOpen className="size-5 text-slate-500" />
            空室から予約へ進む
          </span>
          <ArrowRight className="size-4 text-slate-400" />
        </Link>
        <Link
          href="/pricing"
          className="surface-soft flex items-center justify-between px-4 py-3.5 text-slate-900 transition hover:-translate-y-0.5 md:px-5 md:py-4"
        >
          <span className="flex items-center gap-3 font-semibold">
            <CircleDollarSign className="size-5 text-slate-500" />
            時間料金を比較する
          </span>
          <ArrowRight className="size-4 text-slate-400" />
        </Link>
        <Link
          href="/insights"
          className={`items-center justify-between px-4 py-3.5 text-slate-900 transition hover:-translate-y-0.5 md:px-5 md:py-4 ${
            isGuest ? "hidden" : "hidden md:flex"
          }`}
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
