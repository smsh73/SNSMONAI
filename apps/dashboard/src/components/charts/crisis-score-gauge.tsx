"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CrisisScoreGaugeProps {
  score: number;
  title?: string;
  className?: string;
}

export function CrisisScoreGauge({
  score,
  title = "Crisis Score",
  className,
}: CrisisScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return {
      color: "text-rose-600 dark:text-rose-400",
      gradient: "from-rose-500 to-rose-600",
    };
    if (score >= 50) return {
      color: "text-orange-600 dark:text-orange-400",
      gradient: "from-orange-400 to-orange-600",
    };
    if (score >= 30) return {
      color: "text-amber-600 dark:text-amber-400",
      gradient: "from-amber-400 to-amber-600",
    };
    return {
      color: "text-emerald-600 dark:text-emerald-400",
      gradient: "from-emerald-400 to-emerald-600",
    };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Critical";
    if (score >= 50) return "High";
    if (score >= 30) return "Elevated";
    return "Normal";
  };

  const { color, gradient } = getScoreColor(score);
  const label = getScoreLabel(score);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference * 0.75;
  const offset = circumference * 0.75 - progress;

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-5">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-32">
            <svg className="w-full h-full" viewBox="0 0 160 130">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="30%" stopColor="#F59E0B" />
                  <stop offset="60%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>

              <path
                d="M 15 110 A 70 70 0 1 1 145 110"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className="text-slate-200 dark:text-slate-700"
              />

              <path
                d="M 15 110 A 70 70 0 1 1 145 110"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${circumference * 0.75}`}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />

              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = -135 + (tick / 100) * 270;
                const rad = (angle * Math.PI) / 180;
                const x1 = 80 + 78 * Math.cos(rad);
                const y1 = 95 + 78 * Math.sin(rad);
                const x2 = 80 + 84 * Math.cos(rad);
                const y2 = 95 + 84 * Math.sin(rad);
                return (
                  <line
                    key={tick}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-slate-400 dark:text-slate-500"
                  />
                );
              })}

              <text x="18" y="125" className="text-[10px] fill-muted-foreground">0</text>
              <text x="130" y="125" className="text-[10px] fill-muted-foreground">100</text>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className={cn("text-3xl font-bold", color)}>
                {score}
              </span>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded bg-gradient-to-r text-white mt-1",
                gradient
              )}>
                {label}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Elevated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
