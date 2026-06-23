import {
  ChartNoAxesCombined,
  CircleDollarSign,
  DoorOpen,
  ListTodo,
  MapPinned,
} from "lucide-react";

import type {
  EquipmentRow,
  ReservationRow,
  RoomRow,
  SupabaseMeetingBundle,
} from "@/lib/supabase/types";

export type RoomCardData = {
  id: string;
  name: string;
  floor: string;
  status: "空室" | "調整中" | "利用中";
  nextSlot: string;
  capacity: number;
  hourlyRate: number;
  duration: string;
  note: string;
  features: string[];
};

export type RequestQueueItem = {
  title: string;
  owner: string;
  room: string;
  slot: string;
  status: "承認待ち" | "調整中" | "完了";
};

export const featureHighlights = [
  {
    href: "/schedule",
    title: "空き状況ボード",
    description: "時間帯ごとの空室を横並びで比較し、そのまま予約へ進めます。",
    cta: "ボードを見る",
    icon: DoorOpen,
  },
  {
    href: "/rooms",
    title: "会議室カタログ",
    description: "人数・設備・料金で絞り込める、比較重視の一覧です。",
    cta: "部屋を探す",
    icon: MapPinned,
  },
  {
    href: "/pricing",
    title: "料金ガイド",
    description: "時間単位の金額をひと目で理解できる料金比較画面です。",
    cta: "料金を見る",
    icon: CircleDollarSign,
  },
  {
    href: "/requests",
    title: "申請・調整",
    description: "承認待ちや付帯依頼を予約と切り離さず処理できます。",
    cta: "申請を確認",
    icon: ListTodo,
  },
  {
    href: "/insights",
    title: "利用インサイト",
    description: "稼働率や偏りを把握し、運用改善につなげる管理画面です。",
    cta: "分析を見る",
    icon: ChartNoAxesCombined,
  },
] as const;

export const weeklyFocus = [
  {
    badge: "運用改善",
    title: "来客あり会議の承認フローを短縮",
    description:
      "受付連携と来客情報入力を同じ画面にまとめることで、総務の確認作業を減らす想定です。",
    meta: "今週の要点",
  },
  {
    badge: "空室最適化",
    title: "14時台の混雑を別フロアへ分散",
    description:
      "人気フロアだけでなく、代替候補を明示することで予約競合の解消を狙います。",
    meta: "次の改善候補",
  },
] as const;

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

type StatCardData = {
  label: string;
  value: string;
  note: string;
  tone: string;
};

type UpcomingReservationData = {
  time: string;
  title: string;
  room: string;
  host: string;
  status: string;
};

type ScheduleBoardRow = {
  roomName: string;
  hourlyRate: string;
  meta: string;
  slots: Array<{
    time: string;
    label: string;
    state: "available" | "busy" | "almost";
  }>;
};

type PricingPlan = {
  name: string;
  badge: string;
  badgeClass: string;
  description: string;
  hourlyRate: number;
  features: string[];
};

type RateRow = {
  name: string;
  oneHour: number;
  twoHours: number;
  fourHours: number;
  note: string;
};

function formatTime(dateValue: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateValue));
}

function formatDayLabel(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(new Date(dateValue));
}

function minutesBetween(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / 60000));
}

function isSameCalendarDay(dateValue: string, target: Date) {
  const date = new Date(dateValue);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

function getRoomEquipment(roomId: string, equipment: EquipmentRow[]) {
  return equipment
    .filter((item) => item.room_id === roomId)
    .map((item) => item.name);
}

function getReservationsByRoom(roomId: string, reservations: ReservationRow[]) {
  return reservations
    .filter((item) => item.room_id === roomId)
    .sort(
      (a, b) =>
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
    );
}

function roomStatusLabel(room: RoomRow, reservations: ReservationRow[]) {
  if (room.status === "maintenance") {
    return "調整中";
  }

  const now = Date.now();
  const active = reservations.some((reservation) => {
    if (reservation.status === "cancelled") {
      return false;
    }

    const start = new Date(reservation.start_at).getTime();
    const end = new Date(reservation.end_at).getTime();
    return start <= now && now < end;
  });

  return active || room.status === "occupied" ? "利用中" : "空室";
}

function roomNextSlot(room: RoomRow, reservations: ReservationRow[]) {
  const now = Date.now();
  const activeReservation = reservations.find((reservation) => {
    if (reservation.status === "cancelled") {
      return false;
    }

    const start = new Date(reservation.start_at).getTime();
    const end = new Date(reservation.end_at).getTime();
    return start <= now && now < end;
  });

  if (activeReservation) {
    return `${formatTime(activeReservation.end_at)}から予約可`;
  }

  const nextReservation = reservations.find((reservation) => {
    if (reservation.status === "cancelled") {
      return false;
    }

    return new Date(reservation.start_at).getTime() > now;
  });

  if (nextReservation) {
    return `今すぐ - ${formatTime(nextReservation.start_at)}`;
  }

  return "本日終日予約可";
}

function roomMinimumDuration(reservations: ReservationRow[]) {
  const durations = reservations
    .map((reservation) => minutesBetween(reservation.start_at, reservation.end_at))
    .filter(Boolean);

  const minimum = durations.length > 0 ? Math.min(...durations) : 30;

  if (minimum < 60) {
    return `最短${minimum}分`;
  }

  return `最短${Math.round(minimum / 60)}時間`;
}

export function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function deriveRoomCards({
  rooms,
  reservations,
  equipment,
}: SupabaseMeetingBundle): RoomCardData[] {
  return rooms.map((room) => {
    const roomReservations = getReservationsByRoom(room.id, reservations);
    const features = getRoomEquipment(room.id, equipment);

    return {
      id: room.id,
      name: room.name,
      floor: room.floor ?? room.location_note ?? "Floor Unassigned",
      status: roomStatusLabel(room, roomReservations),
      nextSlot: roomNextSlot(room, roomReservations),
      capacity: room.capacity,
      hourlyRate: room.hourly_rate,
      duration: roomMinimumDuration(roomReservations),
      note:
        room.notes ??
        room.location_note ??
        "会議室の詳細情報は Supabase の room データから取得しています。",
      features: features.length > 0 ? features : ["設備登録待ち"],
    };
  });
}

export function deriveDashboardStats(
  bundle: SupabaseMeetingBundle,
  roomCards: RoomCardData[],
): StatCardData[] {
  const confirmedReservations = bundle.reservations.filter(
    (item) => item.status === "confirmed" || item.status === "completed",
  );

  const averageMinutes =
    confirmedReservations.length > 0
      ? Math.round(
          confirmedReservations.reduce(
            (sum, reservation) =>
              sum + minutesBetween(reservation.start_at, reservation.end_at),
            0,
          ) / confirmedReservations.length,
        )
      : 0;

  const availableCount = roomCards.filter((room) => room.status === "空室").length;
  const pendingCount = bundle.reservations.filter(
    (item) => item.status === "pending",
  ).length;
  const utilization =
    roomCards.length > 0
      ? Math.round(
          (roomCards.filter((room) => room.status === "利用中").length /
            roomCards.length) *
            100,
        )
      : 0;

  return [
    {
      label: "平均予約時間",
      value: averageMinutes > 0 ? `${averageMinutes}分` : "0分",
      note: "Supabase の reservation 実データから平均時間を算出しています。",
      tone: "bg-[#d9efff]",
    },
    {
      label: "本日の空室数",
      value: `${availableCount}室`,
      note: "現在の部屋状態と予約状況から空室を集計しています。",
      tone: "bg-[#dff4e5]",
    },
    {
      label: "今日の利用率",
      value: `${utilization}%`,
      note: "現在利用中の部屋数をベースにした簡易稼働率です。",
      tone: "bg-[#ffe8d9]",
    },
    {
      label: "承認待ち",
      value: `${pendingCount}件`,
      note: "pending ステータスの予約件数を表示しています。",
      tone: "bg-[#f5e8ff]",
    },
  ];
}

export function deriveUpcomingReservations(
  bundle: SupabaseMeetingBundle,
): UpcomingReservationData[] {
  const roomsById = new Map(bundle.rooms.map((room) => [room.id, room]));

  return bundle.reservations
    .filter(
      (item) =>
        item.status !== "cancelled" &&
        new Date(item.end_at).getTime() > Date.now(),
    )
    .sort(
      (a, b) =>
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
    )
    .slice(0, 3)
    .map((reservation) => ({
      time: `${formatTime(reservation.start_at)} - ${formatTime(reservation.end_at)}`,
      title: reservation.title,
      room: roomsById.get(reservation.room_id)?.name ?? "未設定会議室",
      host: reservation.organizer_name,
      status:
        reservation.status === "pending"
          ? "承認待ち"
          : reservation.status === "completed"
            ? "完了"
            : "確定済み",
    }));
}

function scheduleSlotState(
  room: RoomRow,
  reservations: ReservationRow[],
  hour: string,
) {
  if (room.status === "maintenance") {
    return { label: "調整中", state: "busy" as const };
  }

  const slotStart = new Date();
  const [h, m] = hour.split(":").map(Number);
  slotStart.setHours(h, m, 0, 0);
  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

  const overlapping = reservations.find((reservation) => {
    if (reservation.status === "cancelled") {
      return false;
    }

    const start = new Date(reservation.start_at);
    const end = new Date(reservation.end_at);
    return start < slotEnd && end > slotStart;
  });

  if (overlapping) {
    return { label: "利用中", state: "busy" as const };
  }

  const nextReservation = reservations.find((reservation) => {
    if (reservation.status === "cancelled") {
      return false;
    }

    return new Date(reservation.start_at).getTime() >= slotEnd.getTime();
  });

  if (
    nextReservation &&
    new Date(nextReservation.start_at).getTime() - slotStart.getTime() <=
      90 * 60 * 1000
  ) {
    return {
      label: `${formatTime(nextReservation.start_at)}開始`,
      state: "almost" as const,
    };
  }

  return { label: "予約可", state: "available" as const };
}

export function deriveScheduleBoard(
  rooms: RoomRow[],
  reservations: ReservationRow[],
): ScheduleBoardRow[] {
  return rooms.map((room) => {
    const roomReservations = getReservationsByRoom(room.id, reservations);

    return {
      roomName: room.name,
      hourlyRate: `${formatYen(room.hourly_rate)} / h`,
      meta: `${room.capacity}名 | ${room.floor ?? "フロア未設定"}`,
      slots: timeSlots.map((slot) => ({
        time: slot,
        ...scheduleSlotState(room, roomReservations, slot),
      })),
    };
  });
}

export function deriveRequestQueue(bundle: SupabaseMeetingBundle): RequestQueueItem[] {
  const roomsById = new Map(bundle.rooms.map((room) => [room.id, room]));

  return bundle.reservations
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map((reservation) => ({
      title: reservation.title,
      owner: reservation.organizer_name,
      room: roomsById.get(reservation.room_id)?.name ?? "未設定会議室",
      slot: `${formatTime(reservation.start_at)}-${formatTime(reservation.end_at)}`,
      status:
        reservation.status === "pending"
          ? "承認待ち"
          : reservation.status === "confirmed"
            ? "調整中"
            : "完了",
    }));
}

export function deriveRequestStats(bundle: SupabaseMeetingBundle): StatCardData[] {
  const pending = bundle.reservations.filter((item) => item.status === "pending");
  const completed = bundle.reservations.filter((item) => item.status === "completed");
  const averageMinutes =
    bundle.reservations.length > 0
      ? Math.round(
          bundle.reservations.reduce(
            (sum, reservation) =>
              sum + minutesBetween(reservation.start_at, reservation.end_at),
            0,
          ) / bundle.reservations.length,
        )
      : 0;

  return [
    {
      label: "承認待ち件数",
      value: `${pending.length}件`,
      note: "pending ステータスの予約を申請扱いとして表示しています。",
      tone: "bg-[#fff0df]",
    },
    {
      label: "本日完了",
      value: `${completed.length}件`,
      note: "completed ステータスの予約件数です。",
      tone: "bg-[#dff4e5]",
    },
    {
      label: "平均対応時間",
      value: averageMinutes > 0 ? `${averageMinutes}分` : "0分",
      note: "予約時間ベースの簡易平均値です。",
      tone: "bg-[#eef5ff]",
    },
  ];
}

export function derivePricingPlans(roomCards: RoomCardData[]): PricingPlan[] {
  const sorted = roomCards.slice().sort((a, b) => a.hourlyRate - b.hourlyRate);
  const cheapest = sorted[0];
  const middle = sorted[Math.floor((sorted.length - 1) / 2)] ?? cheapest;
  const premium = sorted[sorted.length - 1] ?? cheapest;

  const candidates = [cheapest, middle, premium].filter(Boolean) as RoomCardData[];
  const labels = [
    {
      name: "Focus Room",
      badge: "少人数向け",
      badgeClass: "bg-[#dff4e5] text-slate-800",
      description: "最も手軽に使える会議室帯です。",
    },
    {
      name: "Standard Room",
      badge: "標準プラン",
      badgeClass: "bg-[#eef5ff] text-slate-700",
      description: "日常会議の中心になる価格帯です。",
    },
    {
      name: "Executive Suite",
      badge: "役員会議向け",
      badgeClass: "bg-[#ffe8d9] text-slate-700",
      description: "高単価帯の会議室をまとめています。",
    },
  ];

  return candidates.map((room, index) => ({
    ...labels[index],
    hourlyRate: room.hourlyRate,
    features: [
      `${room.capacity}名まで利用可能`,
      room.features[0] ?? "設備登録待ち",
      room.floor,
    ],
  }));
}

export function deriveRateRows(roomCards: RoomCardData[]): RateRow[] {
  return derivePricingPlans(roomCards).map((plan) => ({
    name: plan.name,
    oneHour: plan.hourlyRate,
    twoHours: plan.hourlyRate * 2,
    fourHours: plan.hourlyRate * 4,
    note: plan.description,
  }));
}

export function deriveInsightStats(
  bundle: SupabaseMeetingBundle,
  roomCards: RoomCardData[],
): StatCardData[] {
  const completed = bundle.reservations.filter((item) => item.status === "completed");
  const pending = bundle.reservations.filter((item) => item.status === "pending");
  const utilization =
    roomCards.length > 0
      ? Math.round(
          (roomCards.filter((room) => room.status === "利用中").length /
            roomCards.length) *
            100,
        )
      : 0;

  const mostUsedHour = bundle.reservations.length
    ? `${new Date(bundle.reservations[0].start_at).getHours()}時`
    : "-";

  return [
    {
      label: "平均稼働率",
      value: `${utilization}%`,
      note: "現在の部屋状態から算出した簡易稼働率です。",
      tone: "bg-[#d9efff]",
    },
    {
      label: "No-show",
      value: `${completed.length === 0 ? 0 : Math.max(0, completed.length - 1)}件`,
      note: "ダミー算出値です。実運用では別ステータス化が必要です。",
      tone: "bg-[#ffe8d9]",
    },
    {
      label: "ピーク時間帯",
      value: mostUsedHour,
      note: "最初の予約開始時間を元にした簡易表示です。",
      tone: "bg-[#dff4e5]",
    },
    {
      label: "代替提案率",
      value: `${bundle.rooms.length > 0 ? Math.round((pending.length / bundle.rooms.length) * 100) : 0}%`,
      note: "pending 件数をベースにした仮指標です。",
      tone: "bg-[#f5e8ff]",
    },
  ];
}

export function deriveUtilizationByRoom(
  bundle: SupabaseMeetingBundle,
): Array<{ room: string; value: number; note: string }> {
  return bundle.rooms.map((room) => {
    const totalMinutes = bundle.reservations
      .filter(
        (reservation) =>
          reservation.room_id === room.id && reservation.status !== "cancelled",
      )
      .reduce(
        (sum, reservation) =>
          sum + minutesBetween(reservation.start_at, reservation.end_at),
        0,
      );

    const value = Math.min(100, Math.round((totalMinutes / (8 * 60 * 5)) * 100));

    return {
      room: room.name,
      value,
      note: value >= 70 ? "高稼働" : value >= 40 ? "安定稼働" : "余力あり",
    };
  });
}

export function deriveWeeklyUsage(
  reservations: ReservationRow[],
): Array<{ label: string; value: number }> {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return labels.map((label) => {
    const count = reservations.filter(
      (reservation) => formatDayLabel(reservation.start_at) === label,
    ).length;

    return {
      label,
      value: Math.min(100, count * 20),
    };
  });
}

export function createBundle(
  rooms: RoomRow[],
  reservations: ReservationRow[],
  participants: SupabaseMeetingBundle["participants"],
  equipment: EquipmentRow[],
): SupabaseMeetingBundle {
  return { rooms, reservations, participants, equipment };
}

export function filterRoomsForToday(rooms: RoomRow[], reservations: ReservationRow[]) {
  const today = new Date();
  return rooms.filter((room) =>
    reservations.some(
      (reservation) =>
        reservation.room_id === room.id && isSameCalendarDay(reservation.start_at, today),
    ) || room.status === "maintenance",
  );
}
