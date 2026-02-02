"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Activity, Bell } from "lucide-react";

type EventType = "alert" | "spike" | "activity" | "notification";

interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  severity?: "critical" | "high" | "medium" | "low";
}

interface CrisisTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventConfig: Record<
  EventType,
  { icon: typeof AlertTriangle; color: string }
> = {
  alert: { icon: AlertTriangle, color: "text-severity-critical" },
  spike: { icon: TrendingUp, color: "text-severity-high" },
  activity: { icon: Activity, color: "text-severity-medium" },
  notification: { icon: Bell, color: "text-muted-foreground" },
};

export function CrisisTimeline({ events, className }: CrisisTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {events.map((event) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;

          return (
            <div key={event.id} className="relative flex gap-4 pl-8">
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2",
                  event.severity === "critical" && "border-severity-critical",
                  event.severity === "high" && "border-severity-high",
                  event.severity === "medium" && "border-severity-medium",
                  event.severity === "low" && "border-severity-low",
                  !event.severity && "border-border"
                )}
              >
                <Icon className={cn("h-3 w-3", config.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{event.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
