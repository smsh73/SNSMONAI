"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViralVelocityData {
  time: string;
  velocity: number;
  mentions: number;
}

interface ViralVelocityChartProps {
  data: ViralVelocityData[];
  title?: string;
  description?: string;
  threshold?: number;
  className?: string;
}

export function ViralVelocityChart({
  data,
  title = "Viral Velocity",
  description = "Rate of mention spread per hour",
  threshold = 200,
  className,
}: ViralVelocityChartProps) {
  const currentVelocity = data[data.length - 1]?.velocity || 0;
  const avgVelocity = data.reduce((sum, d) => sum + d.velocity, 0) / data.length;
  const maxVelocity = Math.max(...data.map(d => d.velocity));
  const isViral = currentVelocity >= threshold;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={cn("h-5 w-5", isViral ? "text-orange-500" : "text-muted-foreground")} />
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isViral && (
            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Viral Spread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className={cn(
              "text-2xl font-bold",
              currentVelocity >= threshold ? "text-orange-500" : "text-foreground"
            )}>
              {currentVelocity.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{avgVelocity.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-red-500">{maxVelocity.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Peak</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(0)}%`, "Velocity"]}
              />
              <ReferenceLine
                y={threshold}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{
                  value: "Threshold",
                  position: "right",
                  fill: "#EF4444",
                  fontSize: 10,
                }}
              />
              <Line
                type="monotone"
                dataKey="velocity"
                stroke="#F97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#F97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn(
              "h-4 w-4",
              currentVelocity > avgVelocity ? "text-red-500" : "text-green-500"
            )} />
            <span className="text-sm text-muted-foreground">
              {currentVelocity > avgVelocity ? "Above" : "Below"} average by{" "}
              <span className="font-medium">
                {Math.abs(currentVelocity - avgVelocity).toFixed(0)}%
              </span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Threshold: {threshold}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Generate sample data
export function generateViralVelocityData(): ViralVelocityData[] {
  const data: ViralVelocityData[] = [];
  const hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
                 "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  for (let i = 0; i < hours.length; i++) {
    const baseVelocity = 50 + Math.random() * 50;
    const spike = i >= 12 ? Math.random() * 200 : 0; // Spike in afternoon
    data.push({
      time: hours[i],
      velocity: baseVelocity + spike,
      mentions: Math.floor(1000 + Math.random() * 5000),
    });
  }

  return data;
}
