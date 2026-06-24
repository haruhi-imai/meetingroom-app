"use client";

import { useDeferredValue, useState } from "react";
import { useSearchParams } from "next/navigation";
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
} from "@/components/ui/select";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import {
  createBundle,
  deriveRoomCards,
  type RoomCardData,
} from "@/lib/meetingroom-view";
import type {
  EquipmentRow,
  ParticipantRow,
  ReservationRow,
  RoomRow,
} from "@/lib/supabase/types";

function hashText(value: string) {
  return Array.from(value).reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 7);
}

function pickBySeed<T>(items: T[], seed: number) {
  return items[seed % items.length];
}

function createSuggestedRoom(
  query: string,
  capacityFilter: string,
  equipmentFilter: string,
): RoomCardData {
  const normalized = query.trim();
  const seed = hashText(`${normalized}:${capacityFilter}:${equipmentFilter}`);
  const capacityOptions =
    capacityFilter === "small"
      ? [4, 6]
      : capacityFilter === "medium"
        ? [6, 8, 10]
        : capacityFilter === "large"
          ? [12, 16, 20]
          : [4, 6, 8, 10, 12, 16, 20];
  const statusOptions: RoomCardData["status"][] = ["空室", "空室", "空室", "調整中", "利用中"];
  const rateOptions = [2200, 2800, 3200, 3600, 4200, 4800, 5600, 6800];
  const floorOptions = [
    "5F West",
    "6F South",
    "7F East",
    "8F Central",
    "9F North",
  ];
  const nextSlotOptions = [
    "今すぐ - 13:00",
    "今すぐ - 15:00",
    "14:00から予約可",
    "16:00から予約可",
    "本日終日予約可",
  ];
  const durationOptions = ["最短30分", "最短45分", "最短1時間", "最短90分"];
  const featurePool = ["モニター", "カメラ", "ボード", "個室ブース", "Web会議設備", "録画対応"];
  const equipmentLabelMap: Record<string, string> = {
    all: "",
    monitor: "モニター",
    camera: "カメラ",
    board: "ボード",
  };
  const preferredFeature = equipmentLabelMap[equipmentFilter];
  const features = Array.from(
    new Set(
      [preferredFeature, pickBySeed(featurePool, seed), pickBySeed(featurePool, seed + 3)].filter(
        Boolean,
      ),
    ),
  ) as string[];
  const compactQuery = normalized.replace(/\s+/g, " ").slice(0, 18);

  return {
    id: `suggested-${seed}`,
    name: `${compactQuery} 会議室`,
    floor: pickBySeed(floorOptions, seed + 5),
    status: pickBySeed(statusOptions, seed + 7),
    nextSlot: pickBySeed(nextSlotOptions, seed + 11),
    capacity: pickBySeed(capacityOptions, seed + 13),
    hourlyRate: pickBySeed(rateOptions, seed + 17),
    duration: pickBySeed(durationOptions, seed + 19),
    note: `検索語「${normalized}」をもとに自動生成した提案会議室です。`,
    features: features.length > 0 ? features : ["モニター"],
  };
}

type RoomsCatalogViewProps = {
  equipment: EquipmentRow[];
  initialSearchQuery: string;
  participants: ParticipantRow[];
  refetch: () => void;
  reservations: ReservationRow[];
  rooms: RoomRow[];
};

function RoomsCatalogView({
  equipment,
  initialSearchQuery,
  participants,
  refetch,
  reservations,
  rooms,
}: RoomsCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("price");
  const deferredSearch = useDeferredValue(searchQuery);
  const normalizedSearch = deferredSearch.trim();

  const roomCards = deriveRoomCards(createBundle(rooms, reservations, participants, equipment));
  let filteredRooms = roomCards.filter((room) => {
    if (normalizedSearch.length === 0) {
      return true;
    }

    return `${room.name} ${room.floor} ${room.features.join(" ")}`.toLowerCase().includes(
      normalizedSearch.toLowerCase(),
    );
  });

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

  if (normalizedSearch.length > 0) {
    filteredRooms = [
      createSuggestedRoom(normalizedSearch, capacityFilter, equipmentFilter),
      ...filteredRooms,
    ];
  }

  const capacityLabel =
    {
      all: "すべての人数",
      small: "少人数向け",
      medium: "中人数向け",
      large: "大人数向け",
    }[capacityFilter] ?? "人数";
  const equipmentLabel =
    {
      all: "すべての設備",
      monitor: "モニター",
      camera: "カメラ",
      board: "ボード",
    }[equipmentFilter] ?? "設備";
  const sortOrderLabel =
    {
      price: "料金が安い順",
      availability: "空き状況順",
      capacity: "人数が多い順",
    }[sortOrder] ?? "並び順";

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Rooms"
        title="設備・人数・料金で選べる会議室カタログ"
        description="設備、人数、料金を見比べながら条件に合う会議室を探せます。"
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
                条件を変えると一覧がその場で更新されます。
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
              <span className="flex flex-1 text-left">{capacityLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての人数</SelectItem>
              <SelectItem value="small">少人数向け</SelectItem>
              <SelectItem value="medium">中人数向け</SelectItem>
              <SelectItem value="large">大人数向け</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={equipmentFilter}
            onValueChange={(value) => setEquipmentFilter(value ?? "all")}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <span className="flex flex-1 text-left">{equipmentLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての設備</SelectItem>
              <SelectItem value="monitor">モニター</SelectItem>
              <SelectItem value="camera">カメラ</SelectItem>
              <SelectItem value="board">ボード</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value ?? "price")}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <span className="flex flex-1 text-left">{sortOrderLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">料金が安い順</SelectItem>
              <SelectItem value="availability">空き状況順</SelectItem>
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
          description="検索条件を変えて、別の会議室を探してください。"
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

export function RoomsPageClient() {
  const searchParams = useSearchParams();
  const { rooms, reservations, participants, equipment, loading, refreshing, error, refetch } =
    useSupabaseMeetingData();
  const initialSearchQuery = searchParams.get("q") ?? "";

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

  return (
    <RoomsCatalogView
      key={initialSearchQuery}
      equipment={equipment}
      initialSearchQuery={initialSearchQuery}
      participants={participants}
      refetch={refetch}
      reservations={reservations}
      rooms={rooms}
    />
  );
}
