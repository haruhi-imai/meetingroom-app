"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import { deriveScheduleBoard, formatYenPerHour, timeSlots } from "@/lib/meetingroom-view";

const cellTone = {
  available: "bg-[#dff4e5] text-slate-800",
  busy: "bg-[#eef2f8] text-slate-500",
  almost: "bg-[#fff0df] text-slate-700",
};

type ScheduleCellState = keyof typeof cellTone;

type SyntheticScheduleRoom = {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  hourlyRate: number;
  status: "空室" | "調整中" | "利用中";
  nextSlot: string;
};

function createSyntheticScheduleRow(room: SyntheticScheduleRoom) {
  const immediateWindowMatch = room.nextSlot.match(/今すぐ\s*-\s*(\d{2}:\d{2})/);
  const availableFromMatch = room.nextSlot.match(/(\d{2}:\d{2})から予約可/);

  return {
    roomName: room.name,
    hourlyRate: formatYenPerHour(room.hourlyRate),
    meta: `${room.capacity}名 | ${room.floor}`,
    slots: timeSlots.map((slot) => {
      if (room.status === "調整中") {
        return { time: slot, label: "調整中", state: "busy" as ScheduleCellState };
      }

      if (availableFromMatch) {
        const availableFrom = availableFromMatch[1];
        const state: ScheduleCellState = slot < availableFrom ? "busy" : "available";
        return {
          time: slot,
          label: state === "busy" ? "利用中" : "予約可",
          state,
        };
      }

      if (room.status === "利用中") {
        return {
          time: slot,
          label: slot === timeSlots[0] ? "利用中" : "予約可",
          state:
            slot === timeSlots[0]
              ? ("busy" as ScheduleCellState)
              : ("available" as ScheduleCellState),
        };
      }

      if (immediateWindowMatch) {
        const reservationStart = immediateWindowMatch[1];
        if (slot === reservationStart) {
          return {
            time: slot,
            label: `${reservationStart}開始`,
            state: "almost" as ScheduleCellState,
          };
        }
      }

      return {
        time: slot,
        label: "予約可",
        state: "available" as ScheduleCellState,
      };
    }),
  };
}

export function SchedulePageClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { rooms, reservations, equipment, loading, refreshing, error, refetch } =
    useSupabaseMeetingData();
  const [partySize, setPartySize] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const requestedRoomId = searchParams.get("room");
  const selectedRoom = requestedRoomId
    ? rooms.find((room) => room.id === requestedRoomId) ?? null
    : null;
  const syntheticRoom =
    requestedRoomId && !selectedRoom && searchParams.get("roomName")
      ? {
          id: requestedRoomId,
          name: searchParams.get("roomName") ?? "検索結果会議室",
          floor: searchParams.get("roomFloor") ?? "フロア未設定",
          capacity: Number.parseInt(searchParams.get("roomCapacity") ?? "0", 10) || 0,
          hourlyRate: Number.parseInt(searchParams.get("roomRate") ?? "0", 10) || 0,
          status:
            (searchParams.get("roomStatus") as SyntheticScheduleRoom["status"]) ?? "空室",
          nextSlot: searchParams.get("roomNextSlot") ?? "本日終日予約可",
        }
      : null;
  const roomFilter = selectedRoom?.id ?? syntheticRoom?.id ?? "all";
  const isFocusedRoomView = roomFilter !== "all";

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

  const requiredSeats = Number.parseInt(partySize, 10);
  const filteredRooms = rooms.filter((room) => {
    const matchesRoom = roomFilter === "all" ? true : room.id === roomFilter;
    const matchesPartySize =
      Number.isNaN(requiredSeats) || requiredSeats <= 0
        ? true
        : room.capacity >= requiredSeats;

    const matchesEquipment =
      equipmentFilter === "all"
        ? true
        : equipment.some(
            (item) =>
              item.room_id === room.id &&
              item.name.toLowerCase().includes(equipmentFilter.toLowerCase()),
          );

    return matchesRoom && matchesPartySize && matchesEquipment;
  });
  const board = selectedRoom
    ? deriveScheduleBoard(filteredRooms, reservations)
    : syntheticRoom
      ? [createSyntheticScheduleRow(syntheticRoom)]
      : deriveScheduleBoard(filteredRooms, reservations);

  if (board.length === 0) {
    return (
      <EmptyState
        title="空き状況データがありません"
        description="会議室や予約の情報が入ると、スケジュールボードへ反映されます。"
      />
    );
  }

  const equipmentOptions = Array.from(
    new Map(
      equipment.map((item) => {
        const name = item.name.toLowerCase();

        if (name.includes("camera")) {
          return ["camera", { value: "camera", label: "カメラ" }] as const;
        }

        if (name.includes("monitor")) {
          return ["monitor", { value: "monitor", label: "モニター" }] as const;
        }

        if (name.includes("projector")) {
          return [
            "projector",
            { value: "projector", label: "プロジェクター" },
          ] as const;
        }

        if (name.includes("board")) {
          return ["board", { value: "board", label: "ボード" }] as const;
        }

        return [name, { value: name, label: item.name }] as const;
      }),
    ).values(),
  );
  const equipmentFilterLabel =
    equipmentFilter === "all"
      ? "指定なし"
      : equipmentOptions.find((option) => option.value === equipmentFilter)?.label ??
        "設備を選択";
  const roomFilterLabel =
    syntheticRoom
      ? syntheticRoom.name
      : roomFilter === "all"
      ? "すべての会議室"
      : rooms.find((room) => room.id === roomFilter)?.name ?? "会議室を選択";
  const handleClearRoomFocus = () => {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.delete("room");
    nextParams.delete("roomName");
    nextParams.delete("roomFloor");
    nextParams.delete("roomCapacity");
    nextParams.delete("roomRate");
    nextParams.delete("roomStatus");
    nextParams.delete("roomNextSlot");

    const query = nextParams.toString();
    router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageIntro
        eyebrow="Schedule"
        title="時間帯ごとに空室を比較できる空き状況ボード"
        description="時間帯ごとの空室、利用中、まもなく開始を色で見分けられます。"
        actions={
          <>
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#ffe8d9] px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#ffdcca] md:h-12 md:px-5"
            >
              料金表も確認
            </Link>
            <Button
              variant="outline"
              className="h-10 rounded-2xl border-slate-200 bg-white px-4 md:h-12 md:px-5"
              onClick={refetch}
            >
              再読み込み
            </Button>
          </>
        }
      />

      {isFocusedRoomView ? (
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">{roomFilterLabel}</CardTitle>
                <CardDescription>
                  この会議室だけの空き状況を表示しています。
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-slate-200 bg-white px-4"
                onClick={handleClearRoomFocus}
              >
                全会議室に戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-[#eef5ff] text-slate-700">
              {board[0]?.meta ?? "会議室情報"}
            </Badge>
            <Badge variant="secondary" className="bg-[#f4f7fb] text-slate-700">
              {board[0]?.hourlyRate ?? "-"}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <CardTitle className="text-xl">予約条件</CardTitle>
            <CardDescription>
              利用人数と必要な設備に合う会議室だけを表示できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">会議室</p>
              <Select
                value={roomFilter}
                onValueChange={(value) => {
                  const nextParams = new URLSearchParams(searchParams.toString());
                  const nextRoomFilter = value ?? "all";

                  if (nextRoomFilter === "all") {
                    nextParams.delete("room");
                  } else {
                    nextParams.set("room", nextRoomFilter);
                  }

                  const query = nextParams.toString();
                  router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
                }}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
                  <span className="flex flex-1 text-left">{roomFilterLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての会議室</SelectItem>
                  {syntheticRoom ? (
                    <SelectItem value={syntheticRoom.id}>{syntheticRoom.name}</SelectItem>
                  ) : null}
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">利用人数</p>
              <Input
                inputMode="numeric"
                className="h-12 rounded-2xl bg-white"
                placeholder="例: 6"
                value={partySize}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^\d]/g, "");
                  setPartySize(value);
                }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">必要な設備</p>
              <Select
                value={equipmentFilter}
                onValueChange={(value) => setEquipmentFilter(value ?? "all")}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
                  <span className="flex flex-1 text-left">{equipmentFilterLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">指定なし</SelectItem>
                  {equipmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="h-12 rounded-2xl bg-[#d9efff] px-6 text-slate-900 hover:bg-[#c9e6ff]">
              反映中
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">本日の時間帯別空室</CardTitle>
              <CardDescription>
                1時間ごとの状態を一覧で見比べられます。
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
          <Tabs defaultValue="cards" className="gap-4 md:hidden">
            <TabsList className="rounded-2xl bg-[#f4f7fb] p-1.5">
              <TabsTrigger
                value="cards"
                className="rounded-xl px-4 py-2.5 data-active:bg-white"
              >
                一覧で見る
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="rounded-xl px-4 py-2.5 data-active:bg-white"
              >
                時間表で見る
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cards" className="space-y-3">
              {board.map((room) => {
                const availableCount = room.slots.filter(
                  (slot) => slot.state === "available",
                ).length;
                const nextBusySlot = room.slots.find((slot) => slot.state !== "available");

                return (
                  <div
                    key={room.roomName}
                    className="surface-soft space-y-3 rounded-[22px] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{room.roomName}</p>
                        <p className="mt-1 text-sm text-slate-500">{room.meta}</p>
                      </div>
                      <Badge className="bg-[#eef5ff] text-slate-700">
                        {room.hourlyRate}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-[#f6f9fc] px-3 py-2.5">
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                          予約可能枠
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-900">
                          {availableCount}件
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#f6f9fc] px-3 py-2.5">
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                          直近の予定
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {nextBusySlot?.label ?? "本日終日予約可"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="board">
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
            </TabsContent>
          </Tabs>

          <div className="hidden overflow-x-auto md:block">
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
