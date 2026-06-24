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
import { type RoomCardData } from "@/lib/meetingroom-view";

type RoomCardProps = {
  room: RoomCardData;
  compact?: boolean;
};

const statusTone = {
  空室: "bg-[#f0f0f2] text-slate-800",
  調整中: "bg-[#f7f7f8] text-slate-700",
  利用中: "bg-[#ebebed] text-slate-600",
};

export function RoomCard({ room, compact = true }: RoomCardProps) {
  const visibleFeatures = room.features.slice(0, compact ? 2 : room.features.length);
  const hiddenFeatureCount = room.features.length - visibleFeatures.length;
  const hourlyRateLabel = new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(room.hourlyRate);
  const scheduleHref = `/schedule?room=${encodeURIComponent(room.id)}`;

  return (
    <Card className="surface-panel h-full min-w-0">
      <CardHeader className="gap-3 md:gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-[1.35rem] font-semibold tracking-tight text-slate-950">
              {room.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-500">
              {room.floor}
            </CardDescription>
          </div>
          <Badge className={`rounded-none ${statusTone[room.status]}`}>{room.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="min-w-0 rounded-none bg-[#f5f5f7] p-3 [container-type:inline-size] md:p-4">
            <p className="text-[11px] font-medium tracking-[0.08em] text-slate-500">
              時間料金
            </p>
            <p className="mt-1.5 flex max-w-full items-end gap-0.5 whitespace-nowrap font-semibold text-slate-900 md:mt-2">
              <span className="pb-[0.08em] text-[clamp(0.82rem,10cqi,1rem)] leading-none">
                ¥
              </span>
              <span className="text-[clamp(1.05rem,19cqi,1.75rem)] leading-none">
                {hourlyRateLabel}
              </span>
              <span className="pb-[0.08em] text-[clamp(0.8rem,10cqi,1rem)] leading-none">
                /h
              </span>
            </p>
          </div>
          <div className="min-w-0 rounded-none bg-[#f5f5f7] p-3 md:p-4">
            <p className="text-[11px] font-medium tracking-[0.08em] text-slate-500">
              次に予約できる時間
            </p>
            <p className="mt-1.5 break-words text-sm font-semibold text-slate-900 md:mt-2">
              {room.nextSlot}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-none bg-white px-2.5 py-1.5 md:gap-2 md:px-3 md:py-2">
            <Users className="size-3.5 text-slate-500 md:size-4" />
            {room.capacity}名
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-none bg-white px-2.5 py-1.5 md:gap-2 md:px-3 md:py-2">
            <Clock3 className="size-3.5 text-slate-500 md:size-4" />
            {room.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-none bg-white px-2.5 py-1.5 md:gap-2 md:px-3 md:py-2">
            <MonitorPlay className="size-3.5 text-slate-500 md:size-4" />
            {room.features[0]}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {room.note}
        </p>

        <div className="flex flex-wrap gap-2">
          {visibleFeatures.map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="rounded-none bg-[#f0f0f2] px-2.5 py-1 text-xs text-slate-700 md:px-3 md:text-sm"
            >
              {feature}
            </Badge>
          ))}
          {hiddenFeatureCount > 0 ? (
            <Badge
              variant="secondary"
              className="rounded-none bg-[#f5f5f7] px-2.5 py-1 text-xs text-slate-600 md:px-3 md:text-sm"
            >
              +{hiddenFeatureCount}
            </Badge>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1 md:gap-3 md:pt-2">
          <Link
            href={scheduleHref}
            className="inline-flex h-10 items-center justify-center rounded-none bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 md:h-12 md:px-5"
          >
            {compact ? "このまま予約" : "空き状況を確認"}
          </Link>
          {!compact ? (
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center justify-center rounded-none border border-[#d2d2d7] bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-[#f5f5f7] md:h-12 md:px-5"
            >
              料金を見る
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
