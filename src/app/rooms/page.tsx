import { SlidersHorizontal } from "lucide-react";

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
import { availableRooms } from "@/lib/mock-data";

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Rooms"
        title="設備・人数・料金で選べる会議室カタログ"
        description="会議室ごとの差を一覧比較しやすくし、予約判断を速くするための画面です。"
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
                ダミーUIですが、企業導入時の標準的なフィルターを想定しています。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <Input
            className="h-12 rounded-2xl bg-white"
            placeholder="会議室名・設備で検索"
          />
          <Select defaultValue="all">
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
          <Select defaultValue="all">
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="設備" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての設備</SelectItem>
              <SelectItem value="display">大型モニター</SelectItem>
              <SelectItem value="camera">会議カメラ</SelectItem>
              <SelectItem value="whiteboard">ホワイトボード</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="price">
            <SelectTrigger className="h-12 w-full rounded-2xl bg-white">
              <SelectValue placeholder="並び順" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">時間料金が安い順</SelectItem>
              <SelectItem value="availability">空室が多い順</SelectItem>
              <SelectItem value="capacity">人数が多い順</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-12 rounded-2xl bg-[#d9efff] px-6 text-slate-900 hover:bg-[#c9e6ff]">
            反映
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {availableRooms.map((room) => (
          <RoomCard key={room.id} room={room} compact={false} />
        ))}
      </div>
    </div>
  );
}
