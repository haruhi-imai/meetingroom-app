import Link from "next/link";
import { Clock3, MonitorPlay, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYen, type Room } from "@/lib/mock-data";

type RoomCardProps = {
  room: Room;
  compact?: boolean;
};

const statusTone = {
  空室: "bg-[#dff4e5] text-slate-800",
  調整中: "bg-[#fff0df] text-slate-700",
  利用中: "bg-[#eef2f8] text-slate-500",
};

export function RoomCard({ room, compact = true }: RoomCardProps) {
  return (
    <Card className="surface-soft h-full border-slate-200/80">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <CardDescription>{room.floor}</CardDescription>
          </div>
          <Badge className={statusTone[room.status]}>{room.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f6f9fc] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Hourly
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {formatYen(room.hourlyRate)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f6f9fc] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Next Slot
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {room.nextSlot}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
            <Users className="size-4 text-slate-500" />
            {room.capacity}名
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
            <Clock3 className="size-4 text-slate-500" />
            {room.duration}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
            <MonitorPlay className="size-4 text-slate-500" />
            {room.features[0]}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">{room.note}</p>

        <div className="flex flex-wrap gap-2">
          {room.features.map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="rounded-full bg-[#eef5ff] px-3 py-1 text-slate-700"
            >
              {feature}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <Link
            href="/schedule"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff]"
          >
            {compact ? "このまま予約" : "空き状況を確認"}
          </Link>
          {!compact ? (
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#ffe8d9] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#ffdcca]"
            >
              料金を見る
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
