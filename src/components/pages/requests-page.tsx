"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ClipboardCheck,
  MessageSquareMore,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageIntro } from "@/components/page-intro";
import { RequestsTableSkeleton } from "@/components/requests-table-skeleton";
import { StatCard } from "@/components/stat-card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/auth-provider";
import { useSupabaseMeetingData } from "@/hooks/use-supabase-meeting-data";
import {
  createBundle,
  deriveRequestQueue,
  deriveRequestStats,
  type RequestQueueItem,
} from "@/lib/meetingroom-view";
import { resolveCollectionViewState } from "@/lib/view-state";

const statusTone = {
  承認待ち: "bg-[#fff0df] text-slate-700",
  調整中: "bg-[#eef5ff] text-slate-700",
  完了: "bg-[#dff4e5] text-slate-800",
};

const stateOptions = [
  { value: "empty", label: "0件" },
  { value: "ready", label: "通常" },
  { value: "loading", label: "読込中" },
  { value: "refreshing", label: "更新中" },
  { value: "error", label: "エラー" },
] as const;

function normalizeScenario(state: string | null, items: RequestQueueItem[], error: string | null) {
  if (state === "empty") {
    return {
      items: [] as RequestQueueItem[],
      isLoading: false,
      isRefreshing: false,
      error: null,
      activeState: "empty",
    };
  }

  if (state === "loading") {
    return {
      items: [] as RequestQueueItem[],
      isLoading: true,
      isRefreshing: false,
      error: null,
      activeState: "loading",
    };
  }

  if (state === "refreshing") {
    return {
      items,
      isLoading: false,
      isRefreshing: true,
      error: null,
      activeState: "refreshing",
    };
  }

  if (state === "error") {
    return {
      items: [] as RequestQueueItem[],
      isLoading: false,
      isRefreshing: false,
      error: "申請データの取得に失敗しました。",
      activeState: "error",
    };
  }

  return {
    items,
    isLoading: false,
    isRefreshing: false,
    error,
    activeState: "ready",
  };
}

export function RequestsPageClient() {
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");
  const { isGuest } = useAuth();
  const { rooms, reservations, participants, equipment, loading, refreshing, error, refetch } =
    useSupabaseMeetingData();

  if (loading && forcedState !== "loading") {
    return <LoadingOverlay />;
  }

  const bundle = createBundle(rooms, reservations, participants, equipment);
  const requestQueue = deriveRequestQueue(bundle);
  const requestStats = deriveRequestStats(bundle);
  const scenario = normalizeScenario(forcedState, requestQueue, error);
  const viewState = resolveCollectionViewState({
    items: scenario.items,
    isLoading: scenario.isLoading || (loading && forcedState === "loading"),
    isRefreshing: scenario.isRefreshing || refreshing,
    error: scenario.error,
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Requests"
        title="承認・調整・付帯依頼をまとめる運用画面"
        description="承認待ちや調整中の予約をまとめて確認できます。"
        actions={
          <div className="flex flex-wrap gap-2">
            {stateOptions.map((option) => {
              const href =
                option.value === "ready" ? "/requests" : `/requests?state=${option.value}`;

              return (
                <Link
                  key={option.value}
                  href={href}
                  className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
                    scenario.activeState === option.value
                      ? "bg-[#d9efff] text-slate-900"
                      : "bg-white text-slate-600 hover:bg-[#f4f7fb]"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
            <Button
              variant="outline"
              className="h-11 rounded-2xl border-slate-200 bg-white px-4"
              onClick={refetch}
            >
              再読み込み
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {requestStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">申請一覧</CardTitle>
              <CardDescription>
                状態ごとに申請の進み具合を確認できます。
              </CardDescription>
            </div>
            {viewState === "refreshing" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f4f7fb] px-4 py-2 text-sm font-semibold text-slate-600">
                <Spinner />
                最新の申請を更新中
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {viewState === "loading" ? <RequestsTableSkeleton /> : null}

          {viewState === "empty" ? (
            <EmptyState
              title="申請がありません"
              description="現在処理中の申請はありません。新しい申請が入ると、この一覧に表示されます。"
              action={
                <Link
                  href="/schedule"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d9efff] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#c9e6ff]"
                >
                  予約状況を確認する
                </Link>
              }
            />
          ) : null}

          {viewState === "error" ? (
            <EmptyState
              icon={AlertCircle}
              title="エラーが発生しました"
              description="もう一度試してください"
              action={
                <Button
                  className="h-12 rounded-2xl bg-[#ffe8d9] px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#ffdcca]"
                  onClick={refetch}
                >
                  リロード
                </Button>
              }
            />
          ) : null}

          {viewState === "ready" || viewState === "refreshing" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>件名</TableHead>
                  <TableHead>申請者</TableHead>
                  <TableHead>会議室</TableHead>
                  <TableHead>希望時間</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenario.items.map((request) => (
                  <TableRow key={`${request.title}-${request.slot}`}>
                    <TableCell className="font-semibold text-slate-900">
                      {request.title}
                    </TableCell>
                    <TableCell>{isGuest ? "非表示" : request.owner}</TableCell>
                    <TableCell>{request.room}</TableCell>
                    <TableCell>{request.slot}</TableCell>
                    <TableCell>
                      <Badge className={statusTone[request.status]}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="h-10 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 hover:bg-[#f8fbff]"
                      >
                        詳細を見る
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="rounded-2xl bg-[#fff0df] p-3 w-fit">
              <ClipboardCheck className="size-5 text-slate-700" />
            </div>
            <CardTitle className="text-lg">承認ルール</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-600">
            申請の状態が分かるように、一覧上で見やすく整理しています。
          </CardContent>
        </Card>
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="rounded-2xl bg-[#eef5ff] p-3 w-fit">
              <MessageSquareMore className="size-5 text-slate-700" />
            </div>
            <CardTitle className="text-lg">付帯依頼</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-600">
            将来的には参加人数や設備依頼もあわせて確認できます。
          </CardContent>
        </Card>
        <Card className="surface-card border-slate-100">
          <CardHeader>
            <div className="rounded-2xl bg-[#dff4e5] p-3 w-fit">
              <ShieldCheck className="size-5 text-slate-700" />
            </div>
            <CardTitle className="text-lg">監査しやすさ</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-600">
            利用者ごとに必要な情報だけを見せる運用を想定しています。
            {isGuest ? " ゲスト利用では所有者情報を非表示にしています。" : null}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card border-slate-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f5e8ff] p-3">
              <RefreshCw className="size-5 text-slate-700" />
            </div>
            <div>
              <CardTitle className="text-lg">状態判定</CardTitle>
              <CardDescription>
                読み込み中や更新中などの状態を切り替えて確認できます。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
