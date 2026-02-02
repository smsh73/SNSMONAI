"use client";

import { AlertTriangle, TrendingUp, TrendingDown, Activity, Users, Eye, Bell } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/contexts/drill-down-context";

// Crisis level configuration
const getCrisisLevel = (score: number) => {
  if (score >= 70) return { level: "CRITICAL", color: "text-red-500", bg: "bg-red-500/20", border: "border-red-500/50" };
  if (score >= 50) return { level: "HIGH", color: "text-orange-500", bg: "bg-orange-500/20", border: "border-orange-500/50" };
  if (score >= 30) return { level: "ELEVATED", color: "text-yellow-500", bg: "bg-yellow-500/20", border: "border-yellow-500/50" };
  return { level: "NORMAL", color: "text-green-500", bg: "bg-green-500/20", border: "border-green-500/50" };
};

// Active alerts data
const activeAlerts = [
  {
    id: "1",
    keyword: "Kerusuhan",
    location: "Jakarta",
    change: "+450%",
    mentions: 70230,
    severity: "critical" as const,
    time: "5m ago"
  },
  {
    id: "2",
    keyword: "Sentiment Drop",
    location: "East Java",
    change: "-40%",
    mentions: 26760,
    severity: "high" as const,
    time: "23m ago"
  },
];

// Platform stats
const platformStats = [
  { name: "X/Twitter", mentions: 1356000, color: "#1DA1F2" },
  { name: "Instagram", mentions: 963000, color: "#E4405F" },
  { name: "Facebook", mentions: 855000, color: "#1877F2" },
  { name: "TikTok", mentions: 744000, color: "#000000" },
];

export default function OverviewPage() {
  const { t } = useTranslation();
  const { openDrillDown } = useDrillDown();

  const crisisScore = 65;
  const crisisInfo = getCrisisLevel(crisisScore);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 -m-4 p-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">SYSTEM ONLINE</span>
          </div>
          <span className="text-sm text-slate-400">Last sync: 2s ago</span>
        </div>
        <div className="text-sm text-slate-400">
          {new Date().toLocaleString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT COLUMN - Crisis Status & Metrics */}
        <div className="col-span-4 space-y-6">

          {/* Crisis Score - Main Focus */}
          <div
            className={cn(
              "relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02]",
              crisisInfo.bg, crisisInfo.border
            )}
            onClick={() => openDrillDown("metric", "crisis", "Crisis Score")}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Crisis Level</span>
              <AlertTriangle className={cn("h-6 w-6", crisisInfo.color)} />
            </div>
            <div className="flex items-baseline gap-3">
              <span className={cn("text-6xl font-bold tabular-nums", crisisInfo.color)}>{crisisScore}</span>
              <span className={cn("text-2xl font-bold", crisisInfo.color)}>{crisisInfo.level}</span>
            </div>
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", crisisScore >= 70 ? "bg-red-500" : crisisScore >= 50 ? "bg-orange-500" : crisisScore >= 30 ? "bg-yellow-500" : "bg-green-500")}
                style={{ width: `${crisisScore}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MetricBox
              icon={<Activity className="h-5 w-5" />}
              label="Total Mentions"
              value="4.54M"
              change={12.5}
              onClick={() => openDrillDown("metric", "mentions", "Total Mentions")}
            />
            <MetricBox
              icon={<TrendingDown className="h-5 w-5" />}
              label="Sentiment"
              value="-0.23"
              change={-8.2}
              variant="danger"
              onClick={() => openDrillDown("metric", "sentiment", "Sentiment")}
            />
            <MetricBox
              icon={<Eye className="h-5 w-5" />}
              label="Reach"
              value="1.45B"
              change={23.1}
              onClick={() => openDrillDown("metric", "reach", "Reach")}
            />
            <MetricBox
              icon={<Bell className="h-5 w-5" />}
              label="Active Alerts"
              value="12"
              change={50}
              variant="warning"
              onClick={() => openDrillDown("metric", "alerts", "Alerts")}
            />
          </div>

          {/* Platform Distribution */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Platform Activity</h3>
            <div className="space-y-3">
              {platformStats.map((platform) => (
                <div key={platform.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm text-slate-400 flex-1">{platform.name}</span>
                  <span className="text-sm font-semibold text-slate-200 tabular-nums">
                    {(platform.mentions / 1000000).toFixed(2)}M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - Alerts */}
        <div className="col-span-5 space-y-6">

          {/* Active Alerts Panel */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Alerts</h3>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/50">
                {activeAlerts.length} ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]",
                    alert.severity === "critical"
                      ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                      : "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
                  )}
                  onClick={() => openDrillDown("alert", `alert-${alert.id}`, alert.keyword)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-bold uppercase",
                          alert.severity === "critical"
                            ? "bg-red-500/30 text-red-300"
                            : "bg-orange-500/30 text-orange-300"
                        )}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-slate-500">{alert.time}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        "{alert.keyword}" <span className="text-red-400">{alert.change}</span>
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>📍 {alert.location}</span>
                        <span>{alert.mentions.toLocaleString()} mentions</span>
                      </div>
                    </div>
                    <AlertTriangle className={cn(
                      "h-6 w-6",
                      alert.severity === "critical" ? "text-red-500" : "text-orange-500"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Timeline */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Today's Activity</h3>
            <SimpleTimeline />
          </div>
        </div>

        {/* RIGHT COLUMN - Trending & Quick Stats */}
        <div className="col-span-3 space-y-6">

          {/* Trending Topics */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Trending Now</h3>
            <div className="space-y-2">
              {[
                { topic: "#JakartaUpdate", change: 320 },
                { topic: "#Pemilu2024", change: 45 },
                { topic: "Harga BBM", change: 128 },
                { topic: "#KorupsiIndonesia", change: 89 },
                { topic: "Banjir Jakarta", change: -12 },
              ].map((item, idx) => (
                <div
                  key={item.topic}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => openDrillDown("topic", item.topic, item.topic)}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 flex items-center justify-center rounded text-xs font-bold",
                      idx === 0 ? "bg-amber-500 text-black" : "bg-slate-700 text-slate-300"
                    )}>{idx + 1}</span>
                    <span className="text-sm text-slate-300 truncate max-w-[120px]">{item.topic}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold flex items-center gap-1",
                    item.change >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(item.change)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Hotspots */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Regional Hotspots</h3>
            <div className="space-y-2">
              {[
                { region: "DKI Jakarta", score: 75, mentions: 45200 },
                { region: "East Java", score: 62, mentions: 28900 },
                { region: "West Java", score: 45, mentions: 32100 },
                { region: "Bali", score: 18, mentions: 12300 },
              ].map((item) => (
                <div
                  key={item.region}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <span className="text-sm text-slate-300">{item.region}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-xs font-bold",
                      item.score >= 70 ? "bg-red-500/30 text-red-300" :
                      item.score >= 50 ? "bg-orange-500/30 text-orange-300" :
                      item.score >= 30 ? "bg-yellow-500/30 text-yellow-300" :
                      "bg-green-500/30 text-green-300"
                    )}>{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Data Sources</h3>
            <div className="space-y-2">
              {[
                { name: "Twitter API", status: "online" },
                { name: "Instagram", status: "online" },
                { name: "TikTok", status: "online" },
                { name: "Facebook", status: "delayed" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2">
                  <span className="text-sm text-slate-400">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      item.status === "online" ? "bg-green-500" : "bg-yellow-500"
                    )} />
                    <span className={cn(
                      "text-xs",
                      item.status === "online" ? "text-green-400" : "text-yellow-400"
                    )}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Box Component
function MetricBox({
  icon,
  label,
  value,
  change,
  variant = "default",
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  variant?: "default" | "danger" | "warning";
  onClick?: () => void;
}) {
  return (
    <div
      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer transition-all hover:bg-slate-900 hover:border-slate-700"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className={cn(
        "text-xs font-semibold mt-1 flex items-center gap-1",
        change >= 0 ? "text-green-400" : "text-red-400"
      )}>
        {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change)}%
      </div>
    </div>
  );
}

// Simple Timeline Component
function SimpleTimeline() {
  const data = [
    { time: "06:00", value: 27 },
    { time: "08:00", value: 63 },
    { time: "10:00", value: 105 },
    { time: "12:00", value: 126 },
    { time: "14:00", value: 114 },
    { time: "16:00", value: 135 },
    { time: "18:00", value: 156 },
    { time: "20:00", value: 123 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-blue-500/60 rounded-t hover:bg-blue-500 transition-colors"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-[10px] text-slate-500">{item.time}</span>
        </div>
      ))}
    </div>
  );
}
