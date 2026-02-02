"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  variant?: "default" | "highlight" | "warning" | "danger" | "info";
  onDoubleClick?: () => void;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  trend,
  className,
  variant = "default",
  onDoubleClick,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-600 dark:text-emerald-400";
    if (trend === "down") return "text-rose-600 dark:text-rose-400";
    return "text-muted-foreground";
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "highlight":
        return "bg-primary/5 dark:bg-primary/10";
      case "warning":
        return "bg-amber-50/80 dark:bg-amber-950/30";
      case "danger":
        return "bg-rose-50/80 dark:bg-rose-950/30";
      case "info":
        return "bg-sky-50/80 dark:bg-sky-950/30";
      default:
        return "bg-card";
    }
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-sm transition-all",
        getVariantStyles(),
        onDoubleClick && "cursor-pointer hover:shadow-md hover:scale-[1.01]",
        className
      )}
      onDoubleClick={onDoubleClick}
    >
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {title}
        </p>
        <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
          {value}
        </p>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1.5 mt-2", getTrendColor())}>
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
            {trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
            <span className="text-xs font-semibold">
              {change > 0 ? "+" : ""}{change}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
