"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon-lg"
                className="size-14 rounded-2xl border-slate-200 bg-white shadow-sm hover:bg-[#fffaf5]"
                onClick={() => setOpen(true)}
              >
                <Menu className="size-5 text-slate-700" />
              </Button>
              <div>
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-slate-900"
                >
                  Meeting Room Flow
                </Link>
                <p className="text-sm text-slate-500">
                  企業向け会議室予約ダミーUI
                </p>
              </div>
            </div>

            <div className="hidden flex-1 justify-center lg:flex">
              <div className="w-full max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="h-12 rounded-2xl border-slate-200 bg-white pl-10"
                    placeholder="会議室・設備・フロアを検索"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right md:block">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Today
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  6月23日 火曜日
                </p>
              </div>
              <Button
                variant="outline"
                size="icon-lg"
                className="size-12 rounded-2xl border-slate-200 bg-white hover:bg-[#f8fbff]"
              >
                <Bell className="size-5 text-slate-700" />
              </Button>
              <Link
                href={pathname === "/schedule" ? "/" : "/schedule"}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff]"
              >
                {pathname === "/schedule" ? "ダッシュボードへ" : "今すぐ予約"}
              </Link>
            </div>
          </div>
        </header>

        <SheetContent
          side="left"
          className="w-[360px] border-r border-slate-200 bg-white/95 p-0 sm:max-w-[360px]"
        >
          <SheetHeader className="border-b border-slate-200/80 pb-4">
            <SheetTitle>メニュー</SheetTitle>
            <SheetDescription>
              主要画面へすぐ移動できるサイドバーです。
            </SheetDescription>
          </SheetHeader>
          <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
        </SheetContent>

        <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-6 lg:px-6">
          {children}
        </main>
      </div>
    </Sheet>
  );
}
