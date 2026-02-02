"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export type AlertSeverity = "critical" | "high" | "medium" | "low";

interface AlertCardProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  location?: string;
  timestamp: string;
  mentions?: number;
  isGrowing?: boolean;
  onView?: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  className?: string;
}

const severityConfig = {
  critical: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-600 text-white",
    label: "CRITICAL",
  },
  high: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    badge: "bg-orange-500 text-white",
    label: "HIGH",
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    badge: "bg-amber-500 text-white",
    label: "MEDIUM",
  },
  low: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500 text-white",
    label: "LOW",
  },
};

export function AlertCard({
  id,
  title,
  description,
  severity,
  location,
  timestamp,
  mentions,
  isGrowing,
  onView,
  onAcknowledge,
  onDoubleClick,
  className,
}: AlertCardProps) {
  const config = severityConfig[severity];

  return (
    <Card
      className={cn(
        "border-0 shadow-sm transition-all",
        config.bg,
        onDoubleClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onDoubleClick={() => onDoubleClick?.(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold tracking-wide",
                config.badge
              )}>
                {config.label}
              </span>
              {location && (
                <span className="text-xs text-muted-foreground">
                  {location}
                </span>
              )}
            </div>
            <p className={cn("text-sm font-semibold leading-tight", config.text)}>
              {title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{timestamp}</span>
              {mentions !== undefined && (
                <span className="flex items-center gap-1.5">
                  {mentions.toLocaleString()} mentions
                  {isGrowing && (
                    <TrendingUp className="h-3 w-3 text-rose-500" />
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(id)}
              className="h-7 px-3 text-xs"
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAcknowledge?.(id)}
              className="h-7 px-3 text-xs"
            >
              Ack
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
