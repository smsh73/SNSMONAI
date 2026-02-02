"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CrisisStat {
  label: string;
  value: number;
  max: number;
  color: string;
  trend?: "up" | "down" | "stable";
}

interface CrisisStatsProps {
  stats: CrisisStat[];
  className?: string;
}

export function CrisisStats({ stats, className }: CrisisStatsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{stat.label}</span>
            <span className="text-muted-foreground">
              {stat.value.toLocaleString()} / {stat.max.toLocaleString()}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={(stat.value / stat.max) * 100}
              className="h-2"
              style={
                {
                  "--progress-color": stat.color,
                } as React.CSSProperties
              }
            />
            <div
              className="absolute inset-y-0 left-0 h-2 rounded-full transition-all"
              style={{
                width: `${(stat.value / stat.max) * 100}%`,
                backgroundColor: stat.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
