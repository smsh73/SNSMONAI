"use client";

import { useState } from "react";
import {
  Map,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  Eye,
  BarChart3,
  Users,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import type { RegionData } from "@/components/maps/indonesia-leaflet-map";

// Dynamic import for Leaflet (SSR-safe)
const IndonesiaLeafletMap = dynamic(
  () => import("@/components/maps/indonesia-leaflet-map").then((mod) => mod.IndonesiaLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-sky-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Map...</p>
        </div>
      </div>
    )
  }
);
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

// Extended region data including all Kalimantan (Borneo) provinces
const regionDetails = [
  // Java
  {
    id: "31",
    name: "DKI Jakarta",
    crisisScore: 75,
    mentions: 1356000,
    sentiment: -0.35,
    reach: "375M",
    trending: ["#JakartaUpdate", "#Demo", "#Macet"],
    change: 32,
    topInfluencers: 4680,
    platforms: { twitter: 45, instagram: 30, facebook: 15, tiktok: 10 },
  },
  {
    id: "35",
    name: "Jawa Timur",
    crisisScore: 62,
    mentions: 867000,
    sentiment: -0.28,
    reach: "246M",
    trending: ["#Surabaya", "#JatimBangkit"],
    change: 18,
    topInfluencers: 2670,
    platforms: { twitter: 40, instagram: 35, facebook: 15, tiktok: 10 },
  },
  {
    id: "32",
    name: "Jawa Barat",
    crisisScore: 45,
    mentions: 963000,
    sentiment: -0.15,
    reach: "294M",
    trending: ["#Bandung", "#JabarJuara"],
    change: -5,
    topInfluencers: 3360,
    platforms: { twitter: 38, instagram: 32, facebook: 18, tiktok: 12 },
  },
  {
    id: "36",
    name: "Banten",
    crisisScore: 38,
    mentions: 468000,
    sentiment: -0.08,
    reach: "126M",
    trending: ["#Tangerang", "#Serang"],
    change: 8,
    topInfluencers: 1350,
    platforms: { twitter: 42, instagram: 28, facebook: 20, tiktok: 10 },
  },
  {
    id: "33",
    name: "Jawa Tengah",
    crisisScore: 28,
    mentions: 555000,
    sentiment: 0.12,
    reach: "165M",
    trending: ["#Semarang", "#Jateng"],
    change: -2,
    topInfluencers: 2010,
    platforms: { twitter: 35, instagram: 30, facebook: 25, tiktok: 10 },
  },
  {
    id: "34",
    name: "DI Yogyakarta",
    crisisScore: 22,
    mentions: 252000,
    sentiment: 0.25,
    reach: "72M",
    trending: ["#Jogja", "#DIY"],
    change: -8,
    topInfluencers: 2340,
    platforms: { twitter: 40, instagram: 35, facebook: 15, tiktok: 10 },
  },

  // Kalimantan (Borneo) - Complete coverage
  {
    id: "61",
    name: "Kalimantan Barat",
    crisisScore: 25,
    mentions: 195000,
    sentiment: 0.18,
    reach: "54M",
    trending: ["#Pontianak", "#Kalbar", "#BorneoWest"],
    change: 5,
    topInfluencers: 690,
    platforms: { twitter: 35, instagram: 30, facebook: 25, tiktok: 10 },
  },
  {
    id: "62",
    name: "Kalimantan Tengah",
    crisisScore: 35,
    mentions: 174000,
    sentiment: -0.05,
    reach: "45M",
    trending: ["#Palangkaraya", "#Kalteng"],
    change: 12,
    topInfluencers: 540,
    platforms: { twitter: 38, instagram: 28, facebook: 24, tiktok: 10 },
  },
  {
    id: "63",
    name: "Kalimantan Selatan",
    crisisScore: 42,
    mentions: 246000,
    sentiment: -0.15,
    reach: "66M",
    trending: ["#Banjarmasin", "#Kalsel"],
    change: 15,
    topInfluencers: 960,
    platforms: { twitter: 40, instagram: 30, facebook: 20, tiktok: 10 },
  },
  {
    id: "64",
    name: "Kalimantan Timur",
    crisisScore: 55,
    mentions: 375000,
    sentiment: -0.22,
    reach: "105M",
    trending: ["#Samarinda", "#Balikpapan", "#IKN"],
    change: 28,
    topInfluencers: 1350,
    platforms: { twitter: 45, instagram: 30, facebook: 15, tiktok: 10 },
  },
  {
    id: "65",
    name: "Kalimantan Utara",
    crisisScore: 18,
    mentions: 96000,
    sentiment: 0.25,
    reach: "24M",
    trending: ["#Tarakan", "#Kaltara"],
    change: 3,
    topInfluencers: 360,
    platforms: { twitter: 35, instagram: 25, facebook: 30, tiktok: 10 },
  },

  // Sumatra
  {
    id: "12",
    name: "Sumatera Utara",
    crisisScore: 35,
    mentions: 426000,
    sentiment: 0.05,
    reach: "114M",
    trending: ["#Medan", "#Sumut"],
    change: 12,
    topInfluencers: 1680,
    platforms: { twitter: 38, instagram: 32, facebook: 20, tiktok: 10 },
  },
  {
    id: "16",
    name: "Sumatera Selatan",
    crisisScore: 38,
    mentions: 324000,
    sentiment: -0.08,
    reach: "84M",
    trending: ["#Palembang", "#Sumsel"],
    change: 8,
    topInfluencers: 1020,
    platforms: { twitter: 35, instagram: 30, facebook: 25, tiktok: 10 },
  },

  // Sulawesi
  {
    id: "73",
    name: "Sulawesi Selatan",
    crisisScore: 42,
    mentions: 294000,
    sentiment: -0.12,
    reach: "78M",
    trending: ["#Makassar", "#Sulsel"],
    change: 10,
    topInfluencers: 1260,
    platforms: { twitter: 40, instagram: 30, facebook: 20, tiktok: 10 },
  },

  // Bali & Nusa Tenggara
  {
    id: "51",
    name: "Bali",
    crisisScore: 18,
    mentions: 369000,
    sentiment: 0.35,
    reach: "96M",
    trending: ["#Bali", "#BaliSafe", "#Denpasar"],
    change: 3,
    topInfluencers: 2670,
    platforms: { twitter: 35, instagram: 40, facebook: 15, tiktok: 10 },
  },

  // Papua
  {
    id: "91",
    name: "Papua",
    crisisScore: 48,
    mentions: 216000,
    sentiment: -0.18,
    reach: "54M",
    trending: ["#Jayapura", "#Papua"],
    change: 15,
    topInfluencers: 750,
    platforms: { twitter: 40, instagram: 25, facebook: 25, tiktok: 10 },
  },
];

const getStatusColor = (score: number) => {
  if (score >= 70) return "text-severity-critical";
  if (score >= 50) return "text-severity-high";
  if (score >= 30) return "text-severity-medium";
  if (score >= 15) return "text-severity-low";
  return "text-success";
};

const getStatusBg = (score: number) => {
  if (score >= 70) return "bg-severity-critical/10";
  if (score >= 50) return "bg-severity-high/10";
  if (score >= 30) return "bg-severity-medium/10";
  if (score >= 15) return "bg-severity-low/10";
  return "bg-success/10";
};

const getStatusLabel = (score: number) => {
  if (score >= 70) return "Critical";
  if (score >= 50) return "High";
  if (score >= 30) return "Elevated";
  if (score >= 15) return "Low";
  return "Normal";
};

export default function MapViewPage() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [viewMode, setViewMode] = useState<"crisis" | "sentiment" | "volume">("crisis");
  const [isDrilledDown, setIsDrilledDown] = useState(false);

  const selectedDetail = selectedRegion
    ? regionDetails.find((r) => r.name === selectedRegion.provinceName)
    : null;

  // Calculate totals
  const totalMentions = regionDetails.reduce((sum, r) => sum + r.mentions, 0);
  const avgCrisisScore = Math.round(
    regionDetails.reduce((sum, r) => sum + r.crisisScore, 0) / regionDetails.length
  );

  const handleRegionDoubleClick = (region: RegionData | null) => {
    if (region) {
      setSelectedRegion(region);
      setIsDrilledDown(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Map className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.map.title}</h1>
            <p className="text-muted-foreground">
              {t.map.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value="crisis">Crisis</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Layers className="mr-2 h-4 w-4" />
            Layers
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mentions</p>
                <p className="text-2xl font-bold">
                  {(totalMentions / 1000).toFixed(1)}K
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Crisis Score</p>
                <p className={cn("text-2xl font-bold", getStatusColor(avgCrisisScore))}>
                  {avgCrisisScore}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Regions Monitored</p>
                <p className="text-2xl font-bold">38</p>
              </div>
              <Map className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">52.4M</p>
              </div>
              <Eye className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Map - Full Width Hero Section */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Indonesia Regional Monitoring
                </CardTitle>
                <CardDescription className="text-sm">
                  Real-time social media activity across 38 provinces • Double-click to drill down
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
              <Button variant="outline" size="sm">
                <ZoomIn className="mr-2 h-4 w-4" />
                Zoom
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="mr-2 h-4 w-4" />
                Fullscreen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] rounded-b-lg overflow-hidden">
            <IndonesiaLeafletMap
              onRegionClick={setSelectedRegion}
              onRegionDoubleClick={handleRegionDoubleClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional Details Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Region Rankings - Left side */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Regional Rankings by Crisis Score
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Top 16 Regions
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x">
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {regionDetails
                    .sort((a, b) => b.crisisScore - a.crisisScore)
                    .slice(0, 8)
                    .map((region, index) => (
                      <div
                        key={region.id}
                        className={cn(
                          "flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                          selectedDetail?.id === region.id && "bg-primary/10"
                        )}
                        onClick={() =>
                          setSelectedRegion({
                            provinceCode: region.id,
                            provinceName: region.name,
                            crisisScore: region.crisisScore,
                            mentions: region.mentions,
                            sentiment: region.sentiment,
                          })
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                            index === 0 && "bg-rose-500 text-white",
                            index === 1 && "bg-orange-500 text-white",
                            index === 2 && "bg-amber-500 text-white",
                            index > 2 && "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{region.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(region.mentions / 1000).toFixed(0)}K mentions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "font-bold text-sm",
                            getStatusColor(region.crisisScore)
                          )}>
                            {region.crisisScore}
                          </span>
                          {region.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {regionDetails
                    .sort((a, b) => b.crisisScore - a.crisisScore)
                    .slice(8, 16)
                    .map((region, index) => (
                      <div
                        key={region.id}
                        className={cn(
                          "flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                          selectedDetail?.id === region.id && "bg-primary/10"
                        )}
                        onClick={() =>
                          setSelectedRegion({
                            provinceCode: region.id,
                            provinceName: region.name,
                            crisisScore: region.crisisScore,
                            mentions: region.mentions,
                            sentiment: region.sentiment,
                          })
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            {index + 9}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{region.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(region.mentions / 1000).toFixed(0)}K mentions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "font-bold text-sm",
                            getStatusColor(region.crisisScore)
                          )}>
                            {region.crisisScore}
                          </span>
                          {region.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Selected Region Details - Right side */}
        <div className="space-y-6">
          {/* Selected Region Card */}
          {selectedDetail ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {selectedDetail.name}
                  </CardTitle>
                  <Badge
                    className={cn(
                      getStatusBg(selectedDetail.crisisScore),
                      getStatusColor(selectedDetail.crisisScore),
                      "border-0"
                    )}
                  >
                    {getStatusLabel(selectedDetail.crisisScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Crisis Score</p>
                    <p className={cn("text-2xl font-bold", getStatusColor(selectedDetail.crisisScore))}>
                      {selectedDetail.crisisScore}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sentiment</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      selectedDetail.sentiment >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {selectedDetail.sentiment >= 0 ? "+" : ""}{selectedDetail.sentiment.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Mentions</p>
                    <p className="text-xl font-semibold">
                      {selectedDetail.mentions.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Reach</p>
                    <p className="text-xl font-semibold">{selectedDetail.reach}</p>
                  </div>
                </div>

                <Separator />

                {/* Platform Distribution */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Platform Distribution</p>
                  <div className="space-y-2">
                    {Object.entries(selectedDetail.platforms).map(([platform, percentage]) => (
                      <div key={platform} className="flex items-center gap-2">
                        <span className="text-xs w-16 capitalize">{platform}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Trending Topics */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Trending Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetail.trending.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedDetail.topInfluencers} Influencers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedDetail.trending.length} Topics</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">24h Change</span>
                  <span className={cn(
                    "flex items-center gap-1 font-medium",
                    selectedDetail.change >= 0 ? "text-destructive" : "text-success"
                  )}>
                    {selectedDetail.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {selectedDetail.change >= 0 ? "+" : ""}{selectedDetail.change}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Map className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Select a Region</p>
                <p className="text-sm">Click on the map to view regional details</p>
                <p className="text-xs mt-2">Double-click to drill down</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
