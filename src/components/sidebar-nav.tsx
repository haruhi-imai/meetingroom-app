"use client";

import Link from "next/link";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  DoorOpen,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MapPinned,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  pathname: string;
  userEmail?: string | null;
  isGuest?: boolean;
  onNavigate?: () => void;
  onSignOut?: () => void;
};

const navItems = [
  {
    href: "/",
    label: "メイン画面",
    description: "空室確認と即予約の起点",
    icon: LayoutDashboard,
  },
  {
    href: "/schedule",
    label: "空き状況ボード",
    description: "時間帯別の予約判断",
    icon: DoorOpen,
  },
  {
    href: "/rooms",
    label: "会議室カタログ",
    description: "設備・人数・料金比較",
    icon: MapPinned,
  },
  {
    href: "/pricing",
    label: "料金ガイド",
    description: "時間単位の価格比較",
    icon: CircleDollarSign,
  },
  {
    href: "/requests",
    label: "申請・調整",
    description: "承認や付帯依頼を処理",
    icon: ListTodo,
  },
  {
    href: "/insights",
    label: "利用インサイト",
    description: "稼働率と改善候補を確認",
    icon: ChartNoAxesCombined,
  },
];

export function SidebarNav({
  pathname,
  userEmail,
  isGuest = false,
  onNavigate,
  onSignOut,
}: SidebarNavProps) {
  const visibleItems = navItems.filter((item) => {
    if (isGuest && (item.href === "/requests" || item.href === "/insights")) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-start gap-4 rounded-sm px-4 py-4 transition",
                active
                  ? "bg-[#f5f5f7] text-slate-900"
                  : "text-slate-700 hover:bg-[#f5f5f7]",
              )}
            >
              <div
                className={cn(
                  "rounded-sm border border-[#d2d2d7] bg-white p-3",
                  active ? "text-slate-900" : "text-slate-700",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="surface-soft p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">導入先</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              North Star Holdings
            </p>
          </div>
          <Badge className="rounded-none bg-[#f0f0f2] text-slate-700">運用中</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          予約導線を最短化しつつ、企業運用に必要な管理画面も同じUIトーンで揃えています。
        </p>
        {userEmail ? (
          <p className="mt-3 text-xs font-medium tracking-[0.12em] text-slate-400">
            {userEmail}
          </p>
        ) : null}
        {onSignOut ? (
          <Button
            variant="outline"
            className="mt-4 h-11 w-full rounded-md border-[#d2d2d7] bg-white text-slate-900 hover:bg-[#f5f5f7] sm:hidden"
            onClick={onSignOut}
          >
            <LogOut className="size-4" />
            ログアウト
          </Button>
        ) : null}
      </div>

      <div className="surface-soft p-4">
        <p className="text-sm font-semibold text-slate-900">利用チーム</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          総務、営業、役員室で共通利用する想定のダミーデータです。
        </p>
        <AvatarGroup className="mt-4">
          <Avatar size="lg">
            <AvatarFallback>SO</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>EX</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
    </div>
  );
}
