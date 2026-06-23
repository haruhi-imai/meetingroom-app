"use client";

import { useDeferredValue, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { RoomCard } from "@/components/room-card";
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
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import { createBundle, deriveRoomCards } from "@/lib/meetingroom-view";

export function RoomsPageClient() {
  const { rooms, reservations, participants, equipment, loading, error, refetch } =
    useSupabaseMeetingData();
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("price");
  const deferredSearch = useDeferredValue(searchQuery);

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

  const roomCards = deriveRoomCards(createBundle(rooms, reservations, participants, equipment));
  let filteredRooms = roomCards.filter((room) =>
    `${room.name} ${room.floor} ${room.features.join(" ")}`.toLowerCase().includes(
      deferredSearch.toLowerCase(),
    ),
  );

  if (capacityFilter === "small") {
    filteredRooms = filteredRooms.filter((room) => room.capacity <= 4);
  }
  if (capacityFilter === "medium") {
    filteredRooms = filteredRooms.filter(
      (room) => room.capacity >= 5 && room.capacity <= 10,
    );
  }
  if (capacityFilter === "large") {
    filteredRooms = filteredRooms.filter((room) => room.capacity >= 11);
  }
  if (equipmentFilter !== "all") {
    filteredRooms = filteredRooms.filter((room) =>
      room.features.some((feature) =>
        feature.toLowerCase().includes(equipmentFilter.toLowerCase()),
      ),
    );
  }

  filteredRooms = filteredRooms.slice().sort((a, b) => {
    if (sortOrder === "availability") {
      return a.status.localeCompare(b.status, "ja");
    }
    if (sortOrder === "capacity") {
      return b.capacity - a.capacity;
    }
    return a.hourlyRate - b.hourlyRate;
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Rooms"
        title="設備・人数・料金で選べる会議室カタログ"
        description="rooms と equipment を組み合わせた一覧です。検索と絞り込みはクライアントイベントで処理しています。"
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

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef5ff] p-3">
              <SlidersHorizontal className="size-5 text-slate-700" />
            </div>
            <div>
              <CardTitle className="text-xl">絞り込み</CardTitle>
              <CardDescription>
                入力イベントと Select の値変更で一覧をその場で更新します。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <Input
            className="h-12 rounded-2xl bg-white"
            placeholder="会議室名・設備で検索"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Select
            value={capacityFilter}
            onValueChange={(value) => setCapacityFilter(value ?? "all")}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="人数" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての人数</SelectItem>
              <SelectItem value="small">4名以下</SelectItem>
              <SelectItem value="medium">5〜10名</SelectItem>
              <SelectItem value="large">11名以上</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={equipmentFilter}
            onValueChange={(value) => setEquipmentFilter(value ?? "all")}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="設備" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての設備</SelectItem>
              <SelectItem value="monitor">monitor</SelectItem>
              <SelectItem value="camera">camera</SelectItem>
              <SelectItem value="board">board</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value ?? "price")}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="並び順" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">時間料金が安い順</SelectItem>
              <SelectItem value="availability">状態順</SelectItem>
              <SelectItem value="capacity">人数が多い順</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-12 rounded-2xl bg-[#d9efff] px-6 text-slate-900 hover:bg-[#c9e6ff]">
            反映中
          </Button>
        </CardContent>
      </Card>

      {filteredRooms.length === 0 ? (
        <EmptyState
          title="条件に合う会議室がありません"
          description="検索条件または Supabase のデータ内容を見直してください。"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} compact={false} />
          ))}
        </div>
      )}
    </div>
  );
}
