import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  DoorOpen,
  Sparkles,
} from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { RoomCard } from "@/components/room-card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  dashboardStats,
  featureHighlights,
  upcomingReservations,
  weeklyFocus,
  availableRooms,
} from "@/lib/mock-data";

const actionLinkClass =
  "inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5";

export default function Home() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Main"
        title="空き会議室を一目で見て、そのまま予約できるダッシュボード"
        description="会議直前でも迷わない導線を優先したPC向けレイアウトです。空室確認、料金把握、予約確定をこの画面から始められます。"
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
                  すぐ押せる大きめのボタンと、一覧で判断しやすい空室カードを並べています。
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="h-8 rounded-full bg-[#eef5ff] px-3 text-slate-700"
              >
                予約完了まで平均35秒
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
                  {availableRooms.slice(0, 3).map((room) => (
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
                        <span className="text-sm text-slate-500">
                          {item.meta}
                        </span>
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
                変更やキャンセルが必要な予定を一覧で確認できます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingReservations.map((reservation, index) => (
                <div key={reservation.title}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        {reservation.time}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {reservation.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {reservation.room} | {reservation.host}
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
                企業導入向けに、使い始めでつまずきやすい点を先回りして表示します。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="surface-soft flex items-start gap-3 p-4">
                <div className="rounded-2xl bg-[#f5e8ff] p-3 text-slate-800">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    来客会議は承認フロー付きに設定
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    申請画面から、来客ありの予約だけ管理者確認へ分岐できます。
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
                    承認待ちを見る
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
          <CardTitle className="text-xl">今回追加した5つの機能画面</CardTitle>
          <CardDescription>
            予約スピードと運用管理の両方を補強するための導線です。
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
