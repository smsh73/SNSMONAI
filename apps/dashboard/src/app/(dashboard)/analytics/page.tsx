"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

// Dynamic imports for heavy chart components
const SentimentTrendChart = dynamic(
  () => import("@/components/charts/sentiment-trend-chart").then(mod => ({ default: mod.SentimentTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
);
const PlatformDistributionChart = dynamic(
  () => import("@/components/charts/platform-distribution-chart").then(mod => ({ default: mod.PlatformDistributionChart })),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
);
const MentionsTimelineChart = dynamic(
  () => import("@/components/charts/mentions-timeline-chart").then(mod => ({ default: mod.MentionsTimelineChart })),
  { ssr: false, loading: () => <ChartSkeleton height={200} /> }
);
const EmotionDetectionChart = dynamic(
  () => import("@/components/charts/emotion-detection-chart").then(mod => ({ default: mod.EmotionDetectionChart })),
  { ssr: false, loading: () => <ChartSkeleton height={300} /> }
);
const generateSampleEmotionData = () => {
  // Simple inline data generator to avoid importing the heavy module
  return [
    { time: "00:00", joy: 20, trust: 30, fear: 15, surprise: 10, sadness: 12, disgust: 8, anger: 10, anticipation: 25 },
    { time: "04:00", joy: 18, trust: 28, fear: 18, surprise: 12, sadness: 15, disgust: 10, anger: 12, anticipation: 22 },
    { time: "08:00", joy: 35, trust: 40, fear: 12, surprise: 15, sadness: 8, disgust: 5, anger: 8, anticipation: 35 },
    { time: "12:00", joy: 45, trust: 42, fear: 10, surprise: 20, sadness: 10, disgust: 8, anger: 15, anticipation: 40 },
    { time: "16:00", joy: 38, trust: 38, fear: 15, surprise: 18, sadness: 12, disgust: 10, anger: 18, anticipation: 35 },
    { time: "20:00", joy: 25, trust: 32, fear: 20, surprise: 15, sadness: 18, disgust: 12, anger: 22, anticipation: 28 },
  ];
};

function ChartSkeleton({ height }: { height: number }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="animate-pulse" style={{ height }}>
          <div className="h-4 w-32 bg-muted rounded mb-4" />
          <div className="h-full bg-muted/50 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

const weeklyData = [
  { date: "Mon", mentions: 375000, positive: 45, negative: 25, neutral: 30, reach: 75000000 },
  { date: "Tue", mentions: 426000, positive: 42, negative: 28, neutral: 30, reach: 84000000 },
  { date: "Wed", mentions: 354000, positive: 48, negative: 22, neutral: 30, reach: 69000000 },
  { date: "Thu", mentions: 468000, positive: 40, negative: 35, neutral: 25, reach: 93000000 },
  { date: "Fri", mentions: 546000, positive: 38, negative: 40, neutral: 22, reach: 108000000 },
  { date: "Sat", mentions: 402000, positive: 35, negative: 45, neutral: 20, reach: 81000000 },
  { date: "Sun", mentions: 306000, positive: 32, negative: 48, neutral: 20, reach: 60000000 },
];

const platformData = [
  { name: "X (Twitter)", value: 1356000, color: "#1DA1F2", change: 12 },
  { name: "Instagram", value: 963000, color: "#E4405F", change: 8 },
  { name: "Facebook", value: 855000, color: "#1877F2", change: -5 },
  { name: "TikTok", value: 744000, color: "#000000", change: 25 },
  { name: "YouTube", value: 369000, color: "#FF0000", change: 3 },
  { name: "Telegram", value: 252000, color: "#26A5E4", change: 15 },
];

// Moved to component to use translations

const topInfluencers = [
  { name: "Najwa Shihab", username: "najwashihab", followers: 15200000, mentions: 70230 },
  { name: "Erick Thohir", username: "eikikodir", followers: 8900000, mentions: 56760 },
  { name: "Ridwan Kamil", username: "ridwankamil", followers: 12500000, mentions: 49620 },
  { name: "Anies Baswedan", username: "aniesbaswedan", followers: 9800000, mentions: 42960 },
  { name: "Ganjar Pranowo", username: "gaborpranowo", followers: 7600000, mentions: 38610 },
];

// Moved to component to use translations

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("7d");

  const topKeywords = [
    { keyword: t.data.keywords.government, count: 462600, sentiment: -0.15, change: 32 },
    { keyword: t.data.keywords.economy, count: 369000, sentiment: -0.28, change: 18 },
    { keyword: t.data.keywords.education, count: 294000, sentiment: 0.12, change: -5 },
    { keyword: t.data.keywords.health, count: 261000, sentiment: 0.25, change: 12 },
    { keyword: t.data.keywords.infrastructure, count: 228000, sentiment: 0.08, change: 8 },
    { keyword: t.data.keywords.corruption, count: 195000, sentiment: -0.65, change: 45 },
  ];

  const regionAnalytics = [
    { region: t.data.regions.jakarta, mentions: 1356000, sentiment: -0.35, reach: 375000000 },
    { region: t.data.regions.eastJava, mentions: 867000, sentiment: -0.28, reach: 246000000 },
    { region: t.data.regions.westJava, mentions: 963000, sentiment: -0.15, reach: 294000000 },
    { region: t.data.regions.centralJava, mentions: 555000, sentiment: 0.12, reach: 165000000 },
    { region: t.data.regions.northSumatra, mentions: 426000, sentiment: 0.05, reach: 114000000 },
  ];

  const totalMentions = weeklyData.reduce((sum, d) => sum + d.mentions, 0);
  const totalReach = weeklyData.reduce((sum, d) => sum + d.reach, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{t.analytics.title}</h1>
          <p className="text-xs text-muted-foreground">{t.analytics.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="h-7">
              <TabsTrigger value="24h" className="text-[10px] px-2 h-5">24h</TabsTrigger>
              <TabsTrigger value="7d" className="text-[10px] px-2 h-5">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-[10px] px-2 h-5">30D</TabsTrigger>
              <TabsTrigger value="90d" className="text-[10px] px-2 h-5">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
            <Calendar className="h-3 w-3 mr-1" />{t.common.custom}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
            <Download className="h-3 w-3 mr-1" />{t.common.export}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 grid-cols-4">
        <Card className="border shadow-sm">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.overview.totalMentions}</p>
            <p className="text-lg font-semibold">{formatNumber(totalMentions)}</p>
            <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-2.5 w-2.5" />+12.5%
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.overview.totalReach}</p>
            <p className="text-lg font-semibold">{formatNumber(totalReach)}</p>
            <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-2.5 w-2.5" />+8.3%
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-rose-50/50 dark:bg-rose-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.analytics.avgSentiment}</p>
            <p className="text-lg font-semibold text-rose-600">-0.18</p>
            <p className="text-[9px] text-rose-600 flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="h-2.5 w-2.5" />-5.2%
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.analytics.uniqueAuthors}</p>
            <p className="text-lg font-semibold">24.5K</p>
            <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-2.5 w-2.5" />+15.8%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-3 lg:grid-cols-3">
        <SentimentTrendChart
          data={weeklyData.map(d => ({ date: d.date, positive: d.positive, negative: d.negative, neutral: d.neutral }))}
          title={t.analytics.sentimentTrend}
          className="lg:col-span-2"
        />
        <PlatformDistributionChart data={platformData} title={t.overview.platformDistribution} />
      </div>

      <EmotionDetectionChart data={generateSampleEmotionData()} title={t.metrics.sentiment} description={t.analytics.sentimentTrend} />

      <div className="grid gap-3 lg:grid-cols-2">
        <MentionsTimelineChart data={weeklyData.map(d => ({ time: d.date, mentions: d.mentions }))} title={t.analytics.mentionsOverTime} />
        <Card className="border shadow-sm">
          <CardHeader className="py-2 px-3 border-b">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t.analytics.platformPerformance}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1.5">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] font-medium">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{formatNumber(p.value)}</span>
                  <span className={cn("text-[9px] font-medium flex items-center gap-0.5", p.change >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {p.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(p.change)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader className="py-2 px-3 border-b">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t.analytics.topKeywords}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {topKeywords.map((kw, i) => (
              <div key={kw.keyword} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={cn("w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold",
                    i < 3 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                  )}>{i + 1}</span>
                  <div>
                    <p className="text-[10px] font-medium">{kw.keyword}</p>
                    <p className="text-[9px] text-muted-foreground">{formatNumber(kw.count)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-medium px-1 rounded", kw.sentiment >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                    {kw.sentiment >= 0 ? "+" : ""}{kw.sentiment.toFixed(2)}
                  </span>
                  <span className={cn("text-[9px] flex items-center gap-0.5", kw.change >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {kw.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(kw.change)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="py-2 px-3 border-b">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t.analytics.topInfluencers}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {topInfluencers.map((inf, i) => (
              <div key={inf.username} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={cn("w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold",
                    i < 3 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                  )}>{i + 1}</span>
                  <div>
                    <p className="text-[10px] font-medium">{inf.name}</p>
                    <p className="text-[9px] text-muted-foreground">@{inf.username} · {formatNumber(inf.followers)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold">{formatNumber(inf.mentions)}</p>
                  <p className="text-[9px] text-muted-foreground">{t.feed.mentions}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Regional */}
      <Card className="border shadow-sm">
        <CardHeader className="py-2 px-3 border-b">
          <CardTitle className="text-xs font-medium text-muted-foreground">{t.analytics.regionalAnalytics}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid gap-2 grid-cols-5">
            {regionAnalytics.map((r) => (
              <div key={r.region} className={cn("p-2.5 rounded-lg border", r.sentiment < -0.2 ? "bg-rose-50/50 dark:bg-rose-950/20" : r.sentiment > 0.05 ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-muted/30")}>
                <p className="text-[10px] font-semibold mb-1.5">{r.region}</p>
                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.metrics.mentions}</span>
                    <span className="font-medium">{formatNumber(r.mentions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.metrics.sentiment}</span>
                    <span className={cn("font-medium", r.sentiment >= 0 ? "text-emerald-600" : "text-rose-600")}>
                      {r.sentiment >= 0 ? "+" : ""}{r.sentiment.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.metrics.reach}</span>
                    <span className="font-medium">{formatNumber(r.reach)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
