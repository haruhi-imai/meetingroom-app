import {
  ChartNoAxesCombined,
  CircleDollarSign,
  DoorOpen,
  ListTodo,
  MapPinned,
} from "lucide-react";

export type Room = {
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

export const dashboardStats = [
  {
    label: "平均予約時間",
    value: "35秒",
    note: "空室一覧から3クリックで予約完了する想定です。",
    tone: "bg-[#d9efff]",
  },
  {
    label: "本日の空室数",
    value: "12室",
    note: "東京本社フロアの今すぐ使える部屋を表示しています。",
    tone: "bg-[#dff4e5]",
  },
  {
    label: "今日の利用率",
    value: "76%",
    note: "ピークは14時台。大部屋の予約集中を検知しています。",
    tone: "bg-[#ffe8d9]",
  },
  {
    label: "承認待ち",
    value: "4件",
    note: "来客対応や役員会議の申請をまとめて確認できます。",
    tone: "bg-[#f5e8ff]",
  },
] as const;

export const requestStats = [
  {
    label: "承認待ち件数",
    value: "4件",
    note: "役員会議2件、来客対応1件、レイアウト変更1件です。",
    tone: "bg-[#fff0df]",
  },
  {
    label: "本日完了",
    value: "11件",
    note: "総務チームが対応した依頼を反映しています。",
    tone: "bg-[#dff4e5]",
  },
  {
    label: "平均対応時間",
    value: "14分",
    note: "承認ルートを短くしたことで前週より改善しています。",
    tone: "bg-[#eef5ff]",
  },
] as const;

export const insightStats = [
  {
    label: "平均稼働率",
    value: "78%",
    note: "今週の全フロア平均です。",
    tone: "bg-[#d9efff]",
  },
  {
    label: "No-show",
    value: "5件",
    note: "月間の無断キャンセル回数です。",
    tone: "bg-[#ffe8d9]",
  },
  {
    label: "ピーク時間帯",
    value: "14時",
    note: "中会議室の取り合いが発生しやすい時間です。",
    tone: "bg-[#dff4e5]",
  },
  {
    label: "代替提案率",
    value: "63%",
    note: "埋まっている場合に別室候補を出せた割合です。",
    tone: "bg-[#f5e8ff]",
  },
] as const;

export const availableRooms: Room[] = [
  {
    id: "atlas",
    name: "Atlas Room",
    floor: "8F East",
    status: "空室",
    nextSlot: "今すぐ - 11:30",
    capacity: 12,
    hourlyRate: 4800,
    duration: "最短30分",
    note: "大型モニターとWeb会議設備が揃った、汎用性の高い会議室です。",
    features: ["大型モニター", "Web会議", "ホワイトボード"],
  },
  {
    id: "luna",
    name: "Luna Room",
    floor: "7F South",
    status: "調整中",
    nextSlot: "12:00から予約可",
    capacity: 8,
    hourlyRate: 3600,
    duration: "最短30分",
    note: "商談向けの落ち着いた中会議室。来客対応にも向いています。",
    features: ["会議カメラ", "65inchモニター", "来客向け"],
  },
  {
    id: "node",
    name: "Node Studio",
    floor: "6F Creative",
    status: "利用中",
    nextSlot: "15:30から予約可",
    capacity: 6,
    hourlyRate: 3200,
    duration: "最短1時間",
    note: "壁面ホワイトボード付き。短い打ち合わせや設計レビュー向けです。",
    features: ["壁面ボード", "可動机", "ハイブリッド会議"],
  },
  {
    id: "aurora",
    name: "Aurora Hall",
    floor: "9F North",
    status: "空室",
    nextSlot: "13:00まで利用可",
    capacity: 18,
    hourlyRate: 6800,
    duration: "最短1時間",
    note: "役員会議や部門横断ミーティング向けの大会議室です。",
    features: ["大型スクリーン", "来客導線", "録画設備"],
  },
  {
    id: "harbor",
    name: "Harbor Room",
    floor: "5F West",
    status: "空室",
    nextSlot: "今すぐ - 10:30",
    capacity: 4,
    hourlyRate: 2200,
    duration: "最短30分",
    note: "少人数の1on1や面接利用に向いた静かな小会議室です。",
    features: ["1on1向け", "静音", "予約しやすい"],
  },
] as const;

export const upcomingReservations = [
  {
    time: "10:30 - 11:00",
    title: "営業定例ショートMTG",
    room: "Harbor Room",
    host: "Sales Team",
    status: "調整可",
  },
  {
    time: "11:30 - 12:30",
    title: "プロダクト優先度確認",
    room: "Atlas Room",
    host: "PM Office",
    status: "確定済み",
  },
  {
    time: "14:00 - 16:00",
    title: "役員レビュー",
    room: "Aurora Hall",
    host: "Executive",
    status: "承認済み",
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

export const scheduleBoard = [
  {
    roomName: "Atlas Room",
    hourlyRate: "¥4,800 / h",
    meta: "12名 | Web会議向け",
    slots: [
      { time: "09:00", label: "予約可", state: "available" },
      { time: "10:00", label: "予約可", state: "available" },
      { time: "11:00", label: "利用中", state: "busy" },
      { time: "12:00", label: "12:30空き", state: "almost" },
      { time: "13:00", label: "予約可", state: "available" },
      { time: "14:00", label: "利用中", state: "busy" },
      { time: "15:00", label: "利用中", state: "busy" },
      { time: "16:00", label: "16:30空き", state: "almost" },
    ],
  },
  {
    roomName: "Luna Room",
    hourlyRate: "¥3,600 / h",
    meta: "8名 | 商談向け",
    slots: [
      { time: "09:00", label: "利用中", state: "busy" },
      { time: "10:00", label: "10:30空き", state: "almost" },
      { time: "11:00", label: "予約可", state: "available" },
      { time: "12:00", label: "予約可", state: "available" },
      { time: "13:00", label: "利用中", state: "busy" },
      { time: "14:00", label: "15:00空き", state: "almost" },
      { time: "15:00", label: "予約可", state: "available" },
      { time: "16:00", label: "予約可", state: "available" },
    ],
  },
  {
    roomName: "Aurora Hall",
    hourlyRate: "¥6,800 / h",
    meta: "18名 | 役員会議向け",
    slots: [
      { time: "09:00", label: "予約可", state: "available" },
      { time: "10:00", label: "予約可", state: "available" },
      { time: "11:00", label: "予約可", state: "available" },
      { time: "12:00", label: "利用中", state: "busy" },
      { time: "13:00", label: "利用中", state: "busy" },
      { time: "14:00", label: "利用中", state: "busy" },
      { time: "15:00", label: "16:00空き", state: "almost" },
      { time: "16:00", label: "予約可", state: "available" },
    ],
  },
] as const;

export const pricingPlans = [
  {
    name: "Focus Room",
    badge: "少人数向け",
    badgeClass: "bg-[#dff4e5] text-slate-800",
    description: "1on1や短時間ミーティング向けの小会議室プランです。",
    hourlyRate: 2200,
    features: ["4名まで利用可能", "最短30分から予約", "静音フロア"],
  },
  {
    name: "Standard Room",
    badge: "標準プラン",
    badgeClass: "bg-[#eef5ff] text-slate-700",
    description: "営業会議やプロジェクト定例に使いやすい中会議室です。",
    hourlyRate: 3600,
    features: ["8〜12名向け", "大型モニター標準", "ハイブリッド会議対応"],
  },
  {
    name: "Executive Suite",
    badge: "役員会議向け",
    badgeClass: "bg-[#ffe8d9] text-slate-700",
    description: "来客対応や重要会議向けの高機能大会議室プランです。",
    hourlyRate: 6800,
    features: ["16名以上に対応", "録画設備あり", "受付導線込み"],
  },
] as const;

export const rateRows = [
  {
    name: "Focus Room",
    oneHour: 2200,
    twoHours: 4400,
    fourHours: 8800,
    note: "短時間利用向け",
  },
  {
    name: "Standard Room",
    oneHour: 3600,
    twoHours: 7200,
    fourHours: 14400,
    note: "最も利用が多い標準帯",
  },
  {
    name: "Executive Suite",
    oneHour: 6800,
    twoHours: 13600,
    fourHours: 27200,
    note: "来客・役員会議向け",
  },
] as const;

export const requestQueue: RequestQueueItem[] = [
  {
    title: "役員レビューの来客対応",
    owner: "総務部 佐藤",
    room: "Aurora Hall",
    slot: "6/23 14:00-16:00",
    status: "承認待ち",
  },
  {
    title: "営業提案会の座席レイアウト変更",
    owner: "営業部 高橋",
    room: "Atlas Room",
    slot: "6/23 11:30-12:30",
    status: "調整中",
  },
  {
    title: "採用面接の受付連携",
    owner: "人事部 森",
    room: "Harbor Room",
    slot: "6/23 10:30-11:00",
    status: "完了",
  },
] as const;

export const utilizationByRoom = [
  { room: "Atlas Room", value: 86, note: "高稼働" },
  { room: "Luna Room", value: 72, note: "安定稼働" },
  { room: "Aurora Hall", value: 64, note: "大型会議中心" },
  { room: "Harbor Room", value: 58, note: "1on1中心" },
] as const;

export const weeklyUsage = [
  { label: "Mon", value: 72 },
  { label: "Tue", value: 78 },
  { label: "Wed", value: 84 },
  { label: "Thu", value: 76 },
  { label: "Fri", value: 61 },
] as const;

export function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}
