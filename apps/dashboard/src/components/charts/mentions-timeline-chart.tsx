"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimelineData {
  time: string;
  mentions: number;
}

interface MentionsTimelineChartProps {
  data: TimelineData[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-sm text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{payload[0].value.toLocaleString()} mentions</p>
      </div>
    );
  }
  return null;
};

export function MentionsTimelineChart({
  data,
  title = "Mentions Timeline",
  className,
}: MentionsTimelineChartProps) {
  const total = data.reduce((sum, item) => sum + item.mentions, 0);
  const max = Math.max(...data.map(d => d.mentions));
  const peakTime = data.find(d => d.mentions === max)?.time || "";

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span>Total: <span className="font-semibold text-foreground">{total.toLocaleString()}</span></span>
            <span>Peak: <span className="font-semibold text-foreground">{peakTime}</span></span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-5">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} width={35} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
              <Bar dataKey="mentions" fill="url(#barGradient)" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fillOpacity={entry.mentions === max ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
