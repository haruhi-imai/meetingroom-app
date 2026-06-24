"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth-provider";
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
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const notifications: Array<{
  id: string;
  title: string;
  description: string;
}> = [];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationAreaRef = useRef<HTMLDivElement | null>(null);
  const { user, signOut, isGuest } = useAuth();
  const isLoginPath = pathname === "/login" || pathname === "/login/";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!notificationAreaRef.current) {
        return;
      }

      if (!notificationAreaRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

  if (isLoginPath) {
    return <>{children}</>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:py-4 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="メニューを開く"
                className="size-11 rounded-2xl border-slate-200 bg-white shadow-sm hover:bg-[#fffaf5] sm:size-14"
                onClick={() => setOpen(true)}
              >
                <Menu className="size-5 text-slate-700" />
              </Button>
              <div className="min-w-0">
                <Link
                  href="/"
                  className="block truncate text-[15px] font-semibold tracking-tight whitespace-nowrap text-slate-900 sm:text-lg"
                >
                  Meeting Room Flow
                </Link>
                <p className="hidden text-sm text-slate-500 sm:block">
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

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right md:block">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Today
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  6月23日 火曜日
                </p>
              </div>
              <div className="relative" ref={notificationAreaRef}>
                <Button
                  variant="outline"
                  size="icon-lg"
                  aria-label="通知を確認"
                  aria-expanded={notificationsOpen}
                  aria-controls="notification-panel"
                  className={cn(
                    "size-11 rounded-2xl border-slate-200 bg-white hover:bg-[#f8fbff] sm:size-12",
                    notificationsOpen && "bg-[#f8fbff]",
                  )}
                  onClick={() => setNotificationsOpen((current) => !current)}
                >
                  <Bell className="size-5 text-slate-700" />
                </Button>
                {notificationsOpen ? (
                  <div
                    id="notification-panel"
                    role="dialog"
                    aria-label="通知一覧"
                    className="fixed top-[4.9rem] right-4 left-4 z-50 overflow-hidden rounded-[26px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,251,255,0.96)_100%)] shadow-[0_28px_90px_-42px_rgba(15,23,42,0.42)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:absolute sm:top-[calc(100%+0.75rem)] sm:right-0 sm:left-auto sm:w-[22rem]"
                  >
                    <div className="border-b border-slate-200/80 px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">通知</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        予約変更や承認結果をここで確認できる想定です。
                      </p>
                    </div>
                    <div className="px-5 py-5">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-white/75 px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <div className="rounded-2xl bg-[#eef5ff] p-3 text-slate-700 shadow-[0_12px_24px_-18px_rgba(74,144,226,0.55)]">
                            <Bell className="size-5" />
                          </div>
                          <p className="mt-4 text-sm font-semibold text-slate-900">
                            通知はまだありません
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            予約の更新や承認結果が出た時に、ここへ一覧表示します。
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left lg:block">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Account
                </p>
                <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                  {user?.email ?? "Signed in"}
                </p>
              </div>
              <Button
                variant="outline"
                aria-label="ログアウト"
                className="hidden h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 hover:bg-[#f8fbff] sm:inline-flex"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                <span>ログアウト</span>
              </Button>
              <Link
                href={pathname === "/schedule" ? "/" : "/schedule"}
                className="hidden h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff] sm:inline-flex"
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
          <SidebarNav
            pathname={pathname}
            userEmail={user?.email ?? null}
            isGuest={isGuest}
            onNavigate={() => setOpen(false)}
            onSignOut={handleSignOut}
          />
        </SheetContent>

        <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-6 lg:px-6">
          <div key={pathname} className="route-transition-shell">
            {children}
          </div>
        </main>
      </div>
    </Sheet>
  );
}
