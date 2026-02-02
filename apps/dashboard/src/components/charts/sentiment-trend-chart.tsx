"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SentimentData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentTrendChartProps {
  data: SentimentData[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-sm text-xs">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <span className="text-muted-foreground capitalize">{entry.name}</span>
            <span className="font-semibold" style={{ color: entry.color }}>{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SentimentTrendChart({
  data,
  title = "Sentiment Trend",
  className,
}: SentimentTrendChartProps) {
  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-xs text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs text-muted-foreground">Negative</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-5">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPositive)" dot={false} />
              <Area type="monotone" dataKey="neutral" stroke="#94A3B8" strokeWidth={2} fillOpacity={1} fill="url(#colorNeutral)" dot={false} />
              <Area type="monotone" dataKey="negative" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorNegative)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
