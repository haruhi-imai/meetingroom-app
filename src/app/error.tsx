"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="surface-card w-full max-w-xl border-slate-100 px-8 py-10 text-center">
        <div className="mx-auto inline-flex rounded-3xl bg-[#ffe8d9] p-4 text-slate-800">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-950">
          エラーが発生しました
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          もう一度試してください
        </p>
        <div className="mt-8">
          <Button
            className="h-12 rounded-2xl bg-[#d9efff] px-6 text-sm font-semibold text-slate-900 hover:bg-[#c9e6ff]"
            onClick={() => window.location.reload()}
          >
            リロード
          </Button>
        </div>
      </div>
    </div>
  );
}
