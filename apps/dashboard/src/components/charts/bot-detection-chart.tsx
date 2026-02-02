"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, User, AlertTriangle, ShieldAlert, Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotDetectionData {
  authenticAccounts: number;
  suspiciousAccounts: number;
  confirmedBots: number;
  coordinatedAccounts: number;
}

interface SuspiciousAccount {
  username: string;
  platform: string;
  botScore: number;
  indicators: string[];
  createdAt: string;
  postCount: number;
}

interface BotDetectionChartProps {
  data: BotDetectionData;
  suspiciousAccounts?: SuspiciousAccount[];
  title?: string;
  description?: string;
  className?: string;
}

const COLORS = ["#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

export function BotDetectionChart({
  data,
  suspiciousAccounts = [],
  title = "Bot & Coordinated Activity Detection",
  description = "AI-powered detection of automated and coordinated accounts",
  className,
}: BotDetectionChartProps) {
  const total = data.authenticAccounts + data.suspiciousAccounts + data.confirmedBots + data.coordinatedAccounts;
  const botPercentage = ((data.confirmedBots + data.coordinatedAccounts) / total * 100);
  const suspiciousPercentage = (data.suspiciousAccounts / total * 100);
  const riskLevel = botPercentage > 15 ? "high" : botPercentage > 5 ? "medium" : "low";

  const pieData = [
    { name: "Authentic", value: data.authenticAccounts, color: "#22C55E" },
    { name: "Suspicious", value: data.suspiciousAccounts, color: "#F59E0B" },
    { name: "Confirmed Bots", value: data.confirmedBots, color: "#EF4444" },
    { name: "Coordinated", value: data.coordinatedAccounts, color: "#8B5CF6" },
  ];

  const getRiskBadge = () => {
    switch (riskLevel) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <ShieldAlert className="h-3 w-3 mr-1" />
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Activity className="h-3 w-3 mr-1" />
            Low Risk
          </Badge>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {getRiskBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString()} (${(value / total * 100).toFixed(1)}%)`,
                    "Accounts",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Authentic Accounts</span>
                </div>
                <span className="font-semibold">{data.authenticAccounts.toLocaleString()}</span>
              </div>
              <Progress value={(data.authenticAccounts / total) * 100} className="h-2 bg-muted [&>div]:bg-green-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Suspicious Activity</span>
                </div>
                <span className="font-semibold">{data.suspiciousAccounts.toLocaleString()}</span>
              </div>
              <Progress value={(data.suspiciousAccounts / total) * 100} className="h-2 bg-muted [&>div]:bg-yellow-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Confirmed Bots</span>
                </div>
                <span className="font-semibold">{data.confirmedBots.toLocaleString()}</span>
              </div>
              <Progress value={(data.confirmedBots / total) * 100} className="h-2 bg-muted [&>div]:bg-red-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Coordinated Activity</span>
                </div>
                <span className="font-semibold">{data.coordinatedAccounts.toLocaleString()}</span>
              </div>
              <Progress value={(data.coordinatedAccounts / total) * 100} className="h-2 bg-muted [&>div]:bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Coordinated Activity Score */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Coordinated Activity Score</span>
            <span className={cn(
              "text-lg font-bold",
              botPercentage > 15 ? "text-red-500" : botPercentage > 5 ? "text-yellow-500" : "text-green-500"
            )}>
              {botPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={botPercentage}
            className={cn(
              "h-3 bg-muted",
              botPercentage > 15 ? "[&>div]:bg-red-500" : botPercentage > 5 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"
            )}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {botPercentage > 15
              ? "High level of automated/coordinated activity detected. Investigation recommended."
              : botPercentage > 5
              ? "Moderate level of suspicious activity. Continue monitoring."
              : "Activity levels appear normal. No immediate action required."}
          </p>
        </div>

        {/* Suspicious Accounts List */}
        {suspiciousAccounts.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Top Suspicious Accounts</h4>
            <div className="space-y-2">
              {suspiciousAccounts.slice(0, 5).map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium",
                      account.botScore > 0.8 ? "bg-red-500/10 text-red-600" :
                      account.botScore > 0.5 ? "bg-yellow-500/10 text-yellow-600" :
                      "bg-blue-500/10 text-blue-600"
                    )}>
                      {account.botScore > 0.7 ? <Bot className="h-4 w-4" /> : account.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">@{account.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.platform} · {account.postCount} posts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        account.botScore > 0.8 ? "bg-red-500/10 text-red-600 border-red-500/20" :
                        account.botScore > 0.5 ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                        "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      )}
                    >
                      {(account.botScore * 100).toFixed(0)}% bot score
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Generate sample data
export function generateBotDetectionData(): BotDetectionData {
  return {
    authenticAccounts: Math.floor(8000 + Math.random() * 2000),
    suspiciousAccounts: Math.floor(500 + Math.random() * 300),
    confirmedBots: Math.floor(100 + Math.random() * 150),
    coordinatedAccounts: Math.floor(50 + Math.random() * 100),
  };
}

export function generateSuspiciousAccountsData(): SuspiciousAccount[] {
  return [
    {
      username: "news_bot_2024",
      platform: "X (Twitter)",
      botScore: 0.92,
      indicators: ["High post frequency", "Similar content patterns", "New account"],
      createdAt: "2024-01-15",
      postCount: 1234,
    },
    {
      username: "info_share_id",
      platform: "X (Twitter)",
      botScore: 0.85,
      indicators: ["Coordinated posting", "Identical timestamps"],
      createdAt: "2024-01-10",
      postCount: 892,
    },
    {
      username: "viral_news_jkt",
      platform: "Instagram",
      botScore: 0.78,
      indicators: ["Copy-paste content", "Suspicious followers"],
      createdAt: "2024-01-08",
      postCount: 567,
    },
    {
      username: "breaking_indo",
      platform: "TikTok",
      botScore: 0.65,
      indicators: ["Unusual engagement patterns"],
      createdAt: "2023-12-20",
      postCount: 345,
    },
    {
      username: "update_harian",
      platform: "X (Twitter)",
      botScore: 0.55,
      indicators: ["Repetitive hashtags", "Network cluster"],
      createdAt: "2023-11-15",
      postCount: 234,
    },
  ];
}
