"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlatformData {
  name: string;
  value: number;
  color: string;
}

interface PlatformDistributionChartProps {
  data: PlatformData[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border rounded-lg p-3 shadow-sm text-xs">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-muted-foreground">{data.value.toLocaleString()} mentions</p>
      </div>
    );
  }
  return null;
};

export function PlatformDistributionChart({
  data,
  title = "Platform Distribution",
  className,
}: PlatformDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-5">
        <div className="flex items-center gap-4">
          <div className="relative h-[160px] w-[160px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">{(total / 1000000).toFixed(1)}M</span>
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {sortedData.slice(0, 5).map((item) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-muted-foreground">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
