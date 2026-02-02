"use client";

import { useEffect } from "react";
import { X, ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/contexts/drill-down-context";
import {
  platformBreakdownData,
  regionBreakdownData,
  topicBreakdownData,
  metricDrillDownData,
  alertDetailData,
} from "@/lib/mock-data/drill-down-data";

export function DrillDownModal() {
  const { state, closeDrillDown, goBack, navigateTo } = useDrillDown();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrillDown();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeDrillDown]);

  if (!state.isOpen || !state.type || !state.key) {
    return null;
  }

  const renderContent = () => {
    switch (state.type) {
      case "metric":
        return <MetricDrillDownContent metricKey={state.key} onNavigate={navigateTo} />;
      case "platform":
        return <PlatformDrillDownContent platformKey={state.key} onNavigate={navigateTo} />;
      case "region":
        return <RegionDrillDownContent regionKey={state.key} onNavigate={navigateTo} />;
      case "topic":
        return <TopicDrillDownContent topicKey={state.key} onNavigate={navigateTo} />;
      case "alert":
        return <AlertDrillDownContent alertKey={state.key} onNavigate={navigateTo} />;
      default:
        return <div className="p-8 text-center text-muted-foreground">No data available</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closeDrillDown}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-card border rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {state.history.length > 1 && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-sm">
              {state.context.breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span
                    className={cn(
                      index === state.context.breadcrumbs.length - 1
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeDrillDown}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Metric drill-down content
function MetricDrillDownContent({
  metricKey,
  onNavigate,
}: {
  metricKey: string;
  onNavigate: (type: any, key: string, label?: string) => void;
}) {
  const data = metricDrillDownData[metricKey];
  if (!data) return <div>Data not found</div>;

  const formatValue = (value: number, type: string) => {
    if (type === "mentions" || type === "reach") {
      if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
    }
    if (type === "sentiment") return value.toFixed(2);
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-2xl font-bold">{formatValue(data.currentValue, data.metricType)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Previous</p>
            <p className="text-2xl font-bold">{formatValue(data.previousValue, data.metricType)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Change</p>
            <div className={cn(
              "flex items-center gap-1 text-2xl font-bold",
              data.change >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {data.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {data.change >= 0 ? "+" : ""}{data.change}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">By Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.breakdown.byPlatform.map((item) => (
            <div
              key={item.platform}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onDoubleClick={() => onNavigate("platform", item.platform.toLowerCase().replace("/", ""), item.platform)}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{item.platform}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatValue(item.value, data.metricType)}</span>
                <span className={cn(
                  "text-xs font-medium",
                  item.change >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {item.change >= 0 ? "+" : ""}{item.change}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Region breakdown */}
      {data.breakdown.byRegion.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">By Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.breakdown.byRegion.map((item) => (
              <div
                key={item.region}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onDoubleClick={() => onNavigate("region", item.region, item.region)}
              >
                <span className="font-medium text-sm">{item.region}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatValue(item.value, data.metricType)}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    item.change >= 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {item.change >= 0 ? "+" : ""}{item.change}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">Double-click an item to drill down further</p>
    </div>
  );
}

// Platform drill-down content
function PlatformDrillDownContent({
  platformKey,
  onNavigate,
}: {
  platformKey: string;
  onNavigate: (type: any, key: string, label?: string) => void;
}) {
  const data = platformBreakdownData[platformKey];
  if (!data) return <div>Platform data not found</div>;

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Mentions</p>
            <p className="text-xl font-bold">{(data.mentions / 1000000).toFixed(2)}M</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Reach</p>
            <p className="text-xl font-bold">{(data.reach / 1000000).toFixed(0)}M</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Engagement</p>
            <p className="text-xl font-bold">{(data.engagement / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
            <p className={cn("text-xl font-bold", data.sentiment >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {data.sentiment >= 0 ? "+" : ""}{data.sentiment.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hourly chart placeholder */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Hourly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end gap-2">
            {data.hourlyData.map((item) => {
              const maxValue = Math.max(...data.hourlyData.map(d => d.mentions));
              const height = (item.mentions / maxValue) * 100;
              return (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/80 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.hour.split(":")[0]}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top posts */}
      {data.topPosts.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topPosts.map((post) => (
              <div
                key={post.id}
                className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors"
                onDoubleClick={() => onNavigate("post", post.id, post.authorName)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{post.authorName}</span>
                  <span className="text-xs text-muted-foreground">@{post.authorUsername}</span>
                  <Badge variant={post.sentiment === "positive" ? "default" : post.sentiment === "negative" ? "destructive" : "secondary"} className="text-[10px]">
                    {post.sentiment}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{post.engagement.likes.toLocaleString()} likes</span>
                  <span>{post.engagement.shares.toLocaleString()} shares</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Region drill-down content
function RegionDrillDownContent({
  regionKey,
  onNavigate,
}: {
  regionKey: string;
  onNavigate: (type: any, key: string, label?: string) => void;
}) {
  const data = regionBreakdownData[regionKey];
  if (!data) return <div>Region data not found</div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Mentions</p>
            <p className="text-xl font-bold">{(data.mentions / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
            <p className={cn("text-xl font-bold", data.sentiment >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {data.sentiment >= 0 ? "+" : ""}{data.sentiment.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Crisis Score</p>
            <p className={cn("text-xl font-bold", data.crisisScore >= 70 ? "text-rose-600" : data.crisisScore >= 50 ? "text-orange-600" : data.crisisScore >= 30 ? "text-amber-600" : "text-emerald-600")}>
              {data.crisisScore}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Cities</p>
            <p className="text-xl font-bold">{data.topCities.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cities breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Top Cities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.topCities.map((city) => (
            <div
              key={city.cityCode}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onDoubleClick={() => onNavigate("region", city.cityName, city.cityName)}
            >
              <span className="font-medium text-sm">{city.cityName}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">{(city.mentions / 1000).toFixed(0)}K mentions</span>
                <Badge variant={city.crisisScore >= 70 ? "destructive" : city.crisisScore >= 50 ? "default" : "secondary"}>
                  Score: {city.crisisScore}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Platform distribution */}
      {data.platformDistribution.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.platformDistribution.map((item) => (
              <div key={item.platform} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.platform}</span>
                  <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Topic drill-down content
function TopicDrillDownContent({
  topicKey,
  onNavigate,
}: {
  topicKey: string;
  onNavigate: (type: any, key: string, label?: string) => void;
}) {
  const data = topicBreakdownData[topicKey];
  if (!data) return <div>Topic data not found</div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Mentions</p>
            <p className="text-xl font-bold">{(data.mentions / 1000).toFixed(1)}K</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Reach</p>
            <p className="text-xl font-bold">{(data.reach / 1000000).toFixed(0)}M</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
            <p className={cn("text-xl font-bold", data.sentiment >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {data.sentiment >= 0 ? "+" : ""}{data.sentiment.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Hashtags</p>
            <p className="text-xl font-bold">{data.hashtags.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Sentiment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">Positive</span>
                <span className="font-medium">{data.sentimentBreakdown.positive}%</span>
              </div>
              <Progress value={data.sentimentBreakdown.positive} className="h-2 [&>div]:bg-emerald-500" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Neutral</span>
                <span className="font-medium">{data.sentimentBreakdown.neutral}%</span>
              </div>
              <Progress value={data.sentimentBreakdown.neutral} className="h-2 [&>div]:bg-slate-400" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-rose-600">Negative</span>
                <span className="font-medium">{data.sentimentBreakdown.negative}%</span>
              </div>
              <Progress value={data.sentimentBreakdown.negative} className="h-2 [&>div]:bg-rose-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related topics */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Related Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.relatedTopics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="cursor-pointer hover:bg-muted"
                onClick={() => onNavigate("topic", topic, topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtags */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Hashtags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Alert drill-down content
function AlertDrillDownContent({
  alertKey,
  onNavigate,
}: {
  alertKey: string;
  onNavigate: (type: any, key: string, label?: string) => void;
}) {
  const data = alertDetailData[alertKey];
  if (!data) return <div>Alert data not found</div>;

  const severityColors = {
    critical: "bg-rose-500",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("w-2 h-full min-h-[60px] rounded-full", severityColors[data.severity])} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={data.severity === "critical" ? "destructive" : "default"}>
              {data.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline">{data.type}</Badge>
            <Badge variant="secondary">{data.status}</Badge>
          </div>
          <h3 className="text-lg font-semibold">{data.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current Value</p>
            <p className="text-xl font-bold">{data.metrics.currentValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Previous Value</p>
            <p className="text-xl font-bold">{data.metrics.previousValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Change</p>
            <p className="text-xl font-bold text-rose-600">+{data.metrics.changePercent}%</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Threshold</p>
            <p className="text-xl font-bold">{data.metrics.threshold}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Alert Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-end gap-2">
            {data.timeline.map((item, index) => {
              const maxValue = Math.max(...data.timeline.map(d => d.value));
              const height = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t",
                      index === data.timeline.length - 1 ? "bg-rose-500" : "bg-primary/60"
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                  {index + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Affected regions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Affected Regions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.affectedRegions.map((region) => (
              <Badge
                key={region}
                variant="secondary"
                className="cursor-pointer hover:bg-muted"
                onClick={() => onNavigate("region", region, region)}
              >
                {region}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
