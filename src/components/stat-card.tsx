import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone: string;
};

export function StatCard({ label, value, note, tone }: StatCardProps) {
  return (
    <Card className="surface-card border-slate-100">
      <CardContent className="flex items-start justify-between gap-3 px-5 py-5 md:gap-4 md:px-6 md:py-6">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 md:mt-2 md:text-3xl">
            {value}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 md:mt-3 md:leading-6">
            {note}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 md:rounded-2xl md:p-3 ${tone}`}>
          <ArrowUpRight className="size-4 text-slate-800 md:size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
