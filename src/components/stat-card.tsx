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
      <CardContent className="flex items-start justify-between gap-4 px-6 py-6">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
        </div>
        <div className={`rounded-2xl p-3 ${tone}`}>
          <ArrowUpRight className="size-5 text-slate-800" />
        </div>
      </CardContent>
    </Card>
  );
}
