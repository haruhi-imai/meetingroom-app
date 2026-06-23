"use client";

import { useState } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import { deriveScheduleBoard, timeSlots } from "@/lib/meetingroom-view";

const cellTone = {
  available: "bg-[#dff4e5] text-slate-800",
  busy: "bg-[#eef2f8] text-slate-500",
  almost: "bg-[#fff0df] text-slate-700",
};

export function SchedulePageClient() {
  const { rooms, reservations, loading, error, refetch } =
    useSupabaseMeetingData();
  const [floorFilter, setFloorFilter] = useState("all");

  if (loading) {
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

  const filteredRooms =
    floorFilter === "all"
      ? rooms
      : rooms.filter((room) => (room.floor ?? "未設定") === floorFilter);
  const board = deriveScheduleBoard(filteredRooms, reservations);

  if (board.length === 0) {
    return (
      <EmptyState
        title="空き状況データがありません"
        description="rooms と reservations のデータ投入後に、スケジュールボードへ反映されます。"
      />
    );
  }

  const floors = Array.from(new Set(rooms.map((room) => room.floor ?? "未設定")));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Schedule"
        title="時間帯ごとに空室を比較できる空き状況ボード"
        description="Supabase の reservation データを時間帯単位へ変換して、空室・利用中・まもなく開始を色で分けています。"
        actions={
          <>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#ffe8d9] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#ffdcca]"
            >
              料金表も確認
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

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">予約条件</CardTitle>
          <CardDescription>
            フロア絞り込みはクライアント側 state で処理しています。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <Select value={floorFilter} onValueChange={(value) => setFloorFilter(value ?? "all")}>
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="フロアを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのフロア</SelectItem>
              {floors.map((floor) => (
                <SelectItem key={floor} value={floor}>
                  {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-12 rounded-2xl bg-[#d9efff] px-6 text-slate-900 hover:bg-[#c9e6ff]">
            反映中
          </Button>
        </CardContent>
      </Card>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">本日の時間帯別空室</CardTitle>
              <CardDescription>
                reservations を元に、1時間ごとの状態へ変換した一覧です。
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#dff4e5] text-slate-800">空室</Badge>
              <Badge className="bg-[#fff0df] text-slate-700">まもなく開始</Badge>
              <Badge className="bg-[#eef2f8] text-slate-500">利用中</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[980px] space-y-3">
              <div className="grid grid-cols-[220px_repeat(8,minmax(84px,1fr))] gap-2">
                <div className="rounded-2xl bg-[#f4f7fb] px-4 py-3 text-sm font-semibold text-slate-500">
                  会議室
                </div>
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="rounded-2xl bg-[#f4f7fb] px-3 py-3 text-center text-sm font-semibold text-slate-500"
                  >
                    {slot}
                  </div>
                ))}
              </div>
              {board.map((room) => (
                <div
                  key={room.roomName}
                  className="grid grid-cols-[220px_repeat(8,minmax(84px,1fr))] gap-2"
                >
                  <div className="surface-soft flex flex-col justify-center px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{room.roomName}</p>
                      <Badge
                        variant="secondary"
                        className="bg-[#eef5ff] text-slate-700"
                      >
                        {room.hourlyRate}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{room.meta}</p>
                  </div>
                  {room.slots.map((slot) => (
                    <div
                      key={`${room.roomName}-${slot.time}`}
                      className={`flex min-h-20 flex-col items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-semibold ${cellTone[slot.state]}`}
                    >
                      <span>{slot.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
