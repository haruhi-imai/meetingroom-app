import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone: string;
};

export function StatCard({ label, value, note, tone }: StatCardProps) {
  void tone;

  return (
    <Card className="surface-panel">
      <CardContent className="flex items-start justify-between gap-4 px-5 py-6 md:px-6 md:py-7">
        <div>
          <p className="text-xs font-medium tracking-[0.04em] text-slate-500">{label}</p>
          <p className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950 md:text-[2.35rem]">
            {value}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {note}
          </p>
        </div>
        <div className="flex items-center gap-1 pt-0.5 text-xs font-medium tracking-[0.04em] text-slate-500">
          詳細
          <ArrowUpRight className="size-3.5 text-slate-500" />
        </div>
      </CardContent>
    </Card>
  );
}
