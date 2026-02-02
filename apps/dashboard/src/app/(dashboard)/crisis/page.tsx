"use client";

import { useState, useCallback } from "react";
import {
  Filter,
  RefreshCw,
  Volume2,
  VolumeX,
  TrendingUp,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCard, AlertSeverity } from "@/components/dashboard/alert-card";
import { MentionItem } from "@/components/dashboard/mention-item";
import { CrisisTimeline } from "@/components/dashboard/crisis-timeline";
import {
  CrisisScoreGauge,
  ViralVelocityChart,
  generateViralVelocityData,
  BotDetectionChart,
  generateBotDetectionData,
  generateSuspiciousAccountsData,
} from "@/components/charts";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

// Moved to component to use translations

// Moved to component to use translations

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical": return "bg-rose-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-amber-500";
    case "low": return "bg-blue-500";
    default: return "bg-emerald-500";
  }
};

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  location: string;
  timestamp: string;
  mentions: number;
  isGrowing: boolean;
  isAcknowledged?: boolean;
}

export default function CrisisCenterPage() {
  const { t } = useTranslation();

  const initialAlerts: Alert[] = [
    {
      id: "1",
      title: `"Kerusuhan" ${t.data.alerts.keywordSpike} (+450%)`,
      description: t.data.alerts.massiveIncrease,
      severity: "critical" as AlertSeverity,
      location: t.data.regions.jakarta,
      timestamp: "5m",
      mentions: 70230,
      isGrowing: true,
    },
    {
      id: "2",
      title: `${t.data.alerts.sentimentDrop} (-40%)`,
      description: t.data.alerts.sharpDecline,
      severity: "high" as AlertSeverity,
      location: t.data.regions.eastJava,
      timestamp: "23m",
      mentions: 26760,
      isGrowing: false,
    },
    {
      id: "3",
      title: t.data.alerts.unusualActivity,
      description: t.data.alerts.coordinatedActivity,
      severity: "medium" as AlertSeverity,
      location: t.data.regions.westJava,
      timestamp: "1h",
      mentions: 7020,
      isGrowing: false,
    },
  ];

  const timelineEvents = [
    { id: "1", type: "alert" as const, title: t.crisis.critical, description: t.data.alerts.keywordSpike, timestamp: "14:32", severity: "critical" as const },
    { id: "2", type: "spike" as const, title: t.data.alerts.keywordSpike, description: "+200%", timestamp: "14:28", severity: "high" as const },
    { id: "3", type: "activity" as const, title: t.data.alerts.unusualActivity, description: t.data.alerts.coordinatedActivity, timestamp: "14:15", severity: "medium" as const },
    { id: "4", type: "notification" as const, title: t.data.status.stable, description: t.map.normal, timestamp: "14:00" },
  ];

  const relatedPosts = [
    { id: "1", authorName: "Jakarta Update", authorUsername: "jakarta_update", platform: "twitter" as const, content: "Breaking news from Jakarta...", timestamp: "2m", sentimentScore: -0.65, engagement: { likes: 37020, retweets: 17010, comments: 2670 } },
    { id: "2", authorName: "Berita Viral", authorUsername: "beritaviral_id", platform: "instagram" as const, content: "Viral video...", timestamp: "5m", sentimentScore: -0.45, engagement: { likes: 267000, comments: 12960 } },
    { id: "3", authorName: "News Channel", authorUsername: "newschannel_id", platform: "tiktok" as const, content: "Live update...", timestamp: "8m", sentimentScore: -0.72, engagement: { likes: 468000, comments: 63000, shares: 102000 } },
  ];

  const regionStats = [
    { region: t.data.regions.jakarta, score: 85, mentions: 462600, trend: "up" as const, status: "critical" },
    { region: t.data.regions.eastJava, score: 62, mentions: 267000, trend: "up" as const, status: "high" },
    { region: t.data.regions.westJava, score: 45, mentions: 201000, trend: "stable" as const, status: "medium" },
    { region: t.data.regions.centralJava, score: 28, mentions: 126000, trend: "down" as const, status: "low" },
    { region: t.data.regions.bali, score: 15, mentions: 63000, trend: "stable" as const, status: "normal" },
  ];

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<string | null>("1");
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    showCritical: true,
    showHigh: true,
    showMedium: true,
    showLow: true,
    showAcknowledged: true,
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isAcknowledged: !alert.isAcknowledged } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!filterOptions.showAcknowledged && alert.isAcknowledged) return false;
    if (!filterOptions.showCritical && alert.severity === "critical") return false;
    if (!filterOptions.showHigh && alert.severity === "high") return false;
    if (!filterOptions.showMedium && alert.severity === "medium") return false;
    if (!filterOptions.showLow && alert.severity === "low") return false;
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === "critical" && !a.isAcknowledged).length;
  const highCount = alerts.filter(a => a.severity === "high" && !a.isAcknowledged).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{t.crisis.title}</h1>
          <p className="text-xs text-muted-foreground">{t.crisis.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-rose-500/10 text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {criticalCount + highCount} {t.overview.live}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)} className="h-7 w-7 p-0">
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                <Filter className="h-3 w-3 mr-1" />{t.common.filter}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-3">
                <p className="text-xs font-medium">{t.common.filter}</p>
                {[
                  { id: "critical", label: t.crisis.critical, color: "bg-rose-500" },
                  { id: "high", label: t.crisis.high, color: "bg-orange-500" },
                  { id: "medium", label: t.crisis.medium, color: "bg-amber-500" },
                  { id: "low", label: t.crisis.low, color: "bg-blue-500" },
                ].map(({ id, label, color }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={filterOptions[`show${label}` as keyof typeof filterOptions]}
                      onCheckedChange={(checked) =>
                        setFilterOptions(prev => ({ ...prev, [`show${label}`]: !!checked }))
                      }
                    />
                    <Label htmlFor={id} className="text-[10px] flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", color)} />{label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-7 text-[10px] px-2">
            <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
            {t.common.refresh}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-4">
        <Card className="border shadow-sm bg-rose-50/50 dark:bg-rose-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.crisis.critical}</p>
            <p className="text-lg font-semibold text-rose-600">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.crisis.high}</p>
            <p className="text-lg font-semibold text-orange-600">{highCount}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.crisis.medium}</p>
            <p className="text-lg font-semibold text-amber-600">{alerts.filter(a => a.severity === "medium" && !a.isAcknowledged).length}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.crisis.low}</p>
            <p className="text-lg font-semibold text-blue-600">{alerts.filter(a => a.severity === "low" && !a.isAcknowledged).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {/* Alerts */}
          <Card className="border shadow-sm">
            <CardHeader className="py-2 px-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground">{t.crisis.activeAlerts}</CardTitle>
                <Tabs defaultValue="all">
                  <TabsList className="h-6">
                    <TabsTrigger value="all" className="text-[9px] px-2 h-5">{t.common.all}</TabsTrigger>
                    <TabsTrigger value="critical" className="text-[9px] px-2 h-5">{t.crisis.critical}</TabsTrigger>
                    <TabsTrigger value="high" className="text-[9px] px-2 h-5">{t.crisis.high}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[280px]">
                <div className="space-y-2">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "cursor-pointer transition-all relative",
                        selectedAlert === alert.id && "ring-1 ring-primary rounded-lg",
                        alert.isAcknowledged && "opacity-60"
                      )}
                      onClick={() => setSelectedAlert(alert.id)}
                    >
                      {alert.isAcknowledged && (
                        <Badge variant="outline" className="absolute top-1 right-1 z-10 text-[8px] px-1 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          <Check className="h-2 w-2 mr-0.5" />Ack
                        </Badge>
                      )}
                      <AlertCard {...alert} onView={(id) => setSelectedAlert(id)} onAcknowledge={handleAcknowledgeAlert} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid gap-3 lg:grid-cols-2">
            <ViralVelocityChart data={generateViralVelocityData()} threshold={200} />
            <BotDetectionChart data={generateBotDetectionData()} suspiciousAccounts={generateSuspiciousAccountsData()} />
          </div>

          {/* Related Posts */}
          <Card className="border shadow-sm">
            <CardHeader className="py-2 px-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground">{t.crisis.relatedPosts}</CardTitle>
                <span className="flex items-center gap-1 text-[9px] text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{t.overview.live}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-2 space-y-1.5">
              {relatedPosts.map((post) => <MentionItem key={post.id} {...post} />)}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <CrisisScoreGauge score={72} title={t.crisis.crisisScore} />

          <Card className="border shadow-sm">
            <CardHeader className="py-2 px-3 border-b">
              <CardTitle className="text-xs font-medium text-muted-foreground">{t.crisis.regionalStatus}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {regionStats.map((region) => (
                <div key={region.region} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", getStatusColor(region.status))} />
                    <div>
                      <p className="text-[10px] font-medium">{region.region}</p>
                      <p className="text-[9px] text-muted-foreground">{region.mentions.toLocaleString()} {t.feed.mentions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold">{region.score}</span>
                    {region.trend === "up" && <TrendingUp className="h-2.5 w-2.5 text-rose-500" />}
                    {region.trend === "down" && <TrendingUp className="h-2.5 w-2.5 text-emerald-500 rotate-180" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="py-2 px-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground">{t.crisis.eventTimeline}</CardTitle>
                <Badge variant="secondary" className="text-[8px] px-1.5 py-0">{t.common.today}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[200px]">
                <CrisisTimeline events={timelineEvents} />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
