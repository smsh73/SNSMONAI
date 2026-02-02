"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Pause,
  Play,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentionItem } from "@/components/dashboard/mention-item";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

type Platform = "twitter" | "instagram" | "facebook" | "tiktok" | "youtube" | "telegram";

interface FeedItem {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  platform: Platform;
  content: string;
  timestamp: string;
  sentimentScore: number;
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
    retweets?: number;
  };
}

const generateMockFeed = (): FeedItem[] => [
  {
    id: "1",
    authorName: "Berita Jakarta",
    authorUsername: "beritajakarta",
    platform: "twitter",
    content: "BREAKING: Situasi terkini di depan Gedung DPR. Kerumunan massa mulai berkumpul sejak pagi hari. #JakartaUpdate #Indonesia",
    timestamp: "Just now",
    sentimentScore: -0.65,
    engagement: { likes: 37020, retweets: 17010, comments: 2670 },
  },
  {
    id: "2",
    authorName: "Info Surabaya",
    authorUsername: "infosurabaya",
    platform: "instagram",
    content: "Cuaca cerah di Surabaya hari ini. Warga beraktivitas normal. Semoga hari ini menyenangkan! 🌞",
    timestamp: "30s ago",
    sentimentScore: 0.72,
    engagement: { likes: 70230, comments: 4680 },
  },
  {
    id: "3",
    authorName: "Warga Bandung",
    authorUsername: "wargabandung_",
    platform: "tiktok",
    content: "Kemacetan parah di Jalan Asia Afrika! Hindari jalur ini. Gunakan alternatif Jalan Braga. #Bandung #MacetBandung",
    timestamp: "1m ago",
    sentimentScore: -0.45,
    engagement: { likes: 168000, comments: 12960, shares: 26700 },
  },
  {
    id: "4",
    authorName: "Netizen Indonesia",
    authorUsername: "netizen_id",
    platform: "twitter",
    content: "Apresiasi untuk pemerintah yang sudah mendengarkan aspirasi rakyat. Terima kasih telah responsif! 🇮🇩",
    timestamp: "2m ago",
    sentimentScore: 0.85,
    engagement: { likes: 102630, retweets: 37020, comments: 17010 },
  },
  {
    id: "5",
    authorName: "Media Medan",
    authorUsername: "mediamedan",
    platform: "facebook",
    content: "Banjir melanda beberapa wilayah di Medan akibat hujan deras semalam. Warga diimbau waspada. #Medan #Banjir",
    timestamp: "3m ago",
    sentimentScore: -0.78,
    engagement: { likes: 26700, shares: 13680, comments: 7020 },
  },
  {
    id: "6",
    authorName: "Update Bali",
    authorUsername: "updatebali",
    platform: "instagram",
    content: "Sunset cantik di Tanah Lot hari ini. Wisatawan mulai ramai kembali. Bali siap menyambut Anda! 🌅",
    timestamp: "4m ago",
    sentimentScore: 0.92,
    engagement: { likes: 375000, comments: 26700 },
  },
  {
    id: "7",
    authorName: "Kompas News",
    authorUsername: "kompasonline",
    platform: "twitter",
    content: "Update: Kejaksaan Agung gelar konferensi pers terkait penanganan kasus korupsi proyek infrastruktur. #Hukum #KorupsiIndonesia",
    timestamp: "5m ago",
    sentimentScore: -0.32,
    engagement: { likes: 89100, retweets: 45600, comments: 12300 },
  },
  {
    id: "8",
    authorName: "Detik News",
    authorUsername: "detikcom",
    platform: "twitter",
    content: "Presiden umumkan paket kebijakan ekonomi baru untuk mendukung UMKM. Ini rincian lengkapnya. #EkonomiIndonesia",
    timestamp: "6m ago",
    sentimentScore: 0.55,
    engagement: { likes: 156000, retweets: 78000, comments: 23400 },
  },
  {
    id: "9",
    authorName: "Makassar Info",
    authorUsername: "infomakassar",
    platform: "facebook",
    content: "Festival Budaya Makassar 2024 resmi dibuka! Ribuan pengunjung padati lokasi acara. #Makassar #Budaya",
    timestamp: "7m ago",
    sentimentScore: 0.88,
    engagement: { likes: 45600, shares: 18900, comments: 8700 },
  },
  {
    id: "10",
    authorName: "Jogja Updates",
    authorUsername: "jogjaupdates",
    platform: "instagram",
    content: "Malioboro malam ini ramai dikunjungi wisatawan. Suasana sangat meriah! #Jogja #Wisata",
    timestamp: "8m ago",
    sentimentScore: 0.78,
    engagement: { likes: 234000, comments: 15600 },
  },
  {
    id: "11",
    authorName: "Kaltim Terkini",
    authorUsername: "kaltimterkini",
    platform: "telegram",
    content: "Pembangunan IKN terus berlanjut. Progress terbaru dari proyek ibu kota nusantara. #IKN #Kalimantan",
    timestamp: "9m ago",
    sentimentScore: 0.42,
    engagement: { likes: 67800, comments: 9300 },
  },
  {
    id: "12",
    authorName: "Tribun Semarang",
    authorUsername: "tribunsemarang",
    platform: "twitter",
    content: "Laporan langsung: Unjuk rasa buruh di depan Balai Kota Semarang berlangsung damai. #Semarang #BuruhIndonesia",
    timestamp: "10m ago",
    sentimentScore: -0.15,
    engagement: { likes: 34200, retweets: 12600, comments: 5400 },
  },
];

// Moved to component to use translations

export default function FeedPage() {
  const { t } = useTranslation();
  const [isLive, setIsLive] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>(generateMockFeed());
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const platformFilters = [
    { label: t.common.all, value: "all" },
    { label: "X", value: "twitter" },
    { label: "IG", value: "instagram" },
    { label: "FB", value: "facebook" },
    { label: "TT", value: "tiktok" },
    { label: "TG", value: "telegram" },
  ];

  const sentimentFilters = [
    { label: t.common.all, value: "all" },
    { label: t.feed.positive, value: "positive" },
    { label: t.feed.negative, value: "negative" },
    { label: t.feed.neutral, value: "neutral" },
  ];

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newItem: FeedItem = {
        id: Date.now().toString(),
        authorName: "User " + Math.floor(Math.random() * 1000),
        authorUsername: "user" + Math.floor(Math.random() * 1000),
        platform: ["twitter", "instagram", "facebook", "tiktok"][Math.floor(Math.random() * 4)] as Platform,
        content: "New mention... " + new Date().toLocaleTimeString(),
        timestamp: "Just now",
        sentimentScore: Math.random() * 2 - 1,
        engagement: { likes: Math.floor(Math.random() * 50000) + 5000, comments: Math.floor(Math.random() * 5000) + 500 },
      };
      setFeed((prev) => [newItem, ...prev.slice(0, 49)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredFeed = feed.filter((item) => {
    if (selectedPlatform !== "all" && item.platform !== selectedPlatform) return false;
    if (selectedSentiment === "positive" && item.sentimentScore < 0.2) return false;
    if (selectedSentiment === "negative" && item.sentimentScore > -0.2) return false;
    if (selectedSentiment === "neutral" && (item.sentimentScore > 0.2 || item.sentimentScore < -0.2)) return false;
    if (searchQuery && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: feed.length,
    positive: feed.filter((f) => f.sentimentScore > 0.2).length,
    negative: feed.filter((f) => f.sentimentScore < -0.2).length,
    neutral: feed.filter((f) => f.sentimentScore >= -0.2 && f.sentimentScore <= 0.2).length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{t.feed.title}</h1>
          <p className="text-xs text-muted-foreground">{t.feed.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium",
            isLive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
            {isLive ? t.overview.live : t.feed.pause}
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)} className="h-7 text-[10px] px-2">
            {isLive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-4">
        <Card className="border shadow-sm">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.common.all}</p>
            <p className="text-lg font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.feed.positive}</p>
            <p className="text-lg font-semibold text-emerald-600">{stats.positive}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-rose-50/50 dark:bg-rose-950/20">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.feed.negative}</p>
            <p className="text-lg font-semibold text-rose-600">{stats.negative}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{t.feed.neutral}</p>
            <p className="text-lg font-semibold text-muted-foreground">{stats.neutral}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="h-8">
            {platformFilters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="text-[10px] px-2 h-6">{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={selectedSentiment} onValueChange={setSelectedSentiment}>
          <TabsList className="h-8">
            {sentimentFilters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="text-[10px] px-2 h-6">{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Feed */}
      <Card className="border shadow-sm">
        <CardHeader className="py-2 px-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t.metrics.mentions} ({filteredFeed.length})</CardTitle>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
              <RefreshCw className="h-3 w-3 mr-1" />{t.common.refresh}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px]">
            <div className="p-2 space-y-1.5">
              {filteredFeed.length > 0 ? (
                filteredFeed.map((item) => <MentionItem key={item.id} {...item} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p className="text-xs font-medium">{t.common.noData}</p>
                  <p className="text-[10px]">{t.common.filter}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
