import Link from "next/link";
import { CalendarRange, Clock3 } from "lucide-react";

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
import { scheduleBoard, timeSlots } from "@/lib/mock-data";

const cellTone = {
  available: "bg-[#dff4e5] text-slate-800",
  busy: "bg-[#eef2f8] text-slate-500",
  almost: "bg-[#fff0df] text-slate-700",
};

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Schedule"
        title="時間帯ごとに空室を比較できる空き状況ボード"
        description="PCで横に並べて見やすい構成にしています。空室、直前終了、利用中を色で即判別できます。"
        actions={
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#ffe8d9] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#ffdcca]"
          >
            料金表も確認
          </Link>
        }
      />

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl">予約条件</CardTitle>
          <CardDescription>
            ダミーデータですが、企業導入時に想定する検索条件を配置しています。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <Select defaultValue="tokyo">
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="拠点を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokyo">東京本社</SelectItem>
              <SelectItem value="osaka">大阪支社</SelectItem>
              <SelectItem value="nagoya">名古屋営業所</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="日付を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">本日</SelectItem>
              <SelectItem value="tomorrow">明日</SelectItem>
              <SelectItem value="week">今週</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="設備を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="monitor">大型モニター</SelectItem>
              <SelectItem value="hybrid">Web会議設備</SelectItem>
              <SelectItem value="board">ホワイトボード</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-12 rounded-2xl bg-[#d9efff] px-6 text-slate-900 hover:bg-[#c9e6ff]">
            条件を反映
          </Button>
        </CardContent>
      </Card>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">本日の時間帯別空室</CardTitle>
              <CardDescription>
                クリック先を予約確定画面にする想定で、空いているセルを強調しています。
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#dff4e5] text-slate-800">空室</Badge>
              <Badge className="bg-[#fff0df] text-slate-700">まもなく空く</Badge>
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
              {scheduleBoard.map((room) => (
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
                      <Clock3 className="mb-2 size-4" />
                      <span>{slot.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-soft p-5">
          <div className="mb-3 inline-flex rounded-2xl bg-[#d9efff] p-3">
            <CalendarRange className="size-5 text-slate-800" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            即予約に向いた運用
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            空室セルからそのまま予約確認へ遷移させる前提の配置です。
          </p>
        </div>
        <div className="surface-soft p-5">
          <h3 className="text-base font-semibold text-slate-900">
            競合回避
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            直前に埋まった場合は、代替会議室候補を下に自動表示する想定です。
          </p>
        </div>
        <div className="surface-soft p-5">
          <h3 className="text-base font-semibold text-slate-900">
            PC向けの一覧性
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            横比較がしやすいように、時間帯は折り返さずスクロール対応にしています。
          </p>
        </div>
      </div>
    </div>
  );
}
