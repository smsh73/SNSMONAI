"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MessageCircle,
  Share2,
  Heart,
  AlertTriangle,
  Shield,
  Calendar,
  Filter,
  BarChart3,
  Users,
  Target,
  Zap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";

type Platform = "twitter" | "instagram" | "facebook" | "youtube" | "tiktok";

interface OfficialPost {
  id: string;
  platform: Platform;
  content: string;
  contentId: string; // Indonesian content
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    score: number;
  };
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  influence: {
    reach: number;
    engagementRate: number;
    viralityScore: number;
    responseTime: number; // average response time in minutes
  };
  topResponses: {
    type: "positive" | "negative" | "neutral";
    content: string;
    author: string;
    likes: number;
  }[];
  keywords: string[];
  category: string;
}

// Mock data for official posts
const officialPosts: OfficialPost[] = [
  {
    id: "1",
    platform: "twitter",
    content: "Attorney General's Office successfully prosecutes major corruption case involving infrastructure project funds worth IDR 2.5 trillion",
    contentId: "Kejaksaan Agung berhasil menuntaskan kasus korupsi besar proyek infrastruktur senilai Rp 2,5 triliun",
    publishedAt: "2024-01-28 09:00",
    engagement: { likes: 45600, comments: 12300, shares: 28900, views: 2450000 },
    sentiment: { positive: 62, negative: 18, neutral: 20, score: 0.44 },
    riskLevel: "low",
    riskScore: 22,
    influence: { reach: 8500000, engagementRate: 3.54, viralityScore: 78, responseTime: 12 },
    topResponses: [
      { type: "positive", content: "Terima kasih Kejaksaan sudah bekerja keras!", author: "@citizen_id", likes: 2340 },
      { type: "positive", content: "Akhirnya koruptor diadili dengan tegas", author: "@netizen_jkt", likes: 1890 },
      { type: "negative", content: "Kenapa baru sekarang? Harusnya lebih cepat", author: "@kritisi_hukum", likes: 890 },
    ],
    keywords: ["korupsi", "infrastruktur", "hukum", "keadilan"],
    category: "Law Enforcement",
  },
  {
    id: "2",
    platform: "instagram",
    content: "Press conference on the arrest of tax evasion syndicate operating across 5 provinces",
    contentId: "Konferensi pers penangkapan sindikat penggelapan pajak yang beroperasi di 5 provinsi",
    publishedAt: "2024-01-27 14:30",
    engagement: { likes: 78900, comments: 8900, shares: 15600, views: 1890000 },
    sentiment: { positive: 55, negative: 28, neutral: 17, score: 0.27 },
    riskLevel: "medium",
    riskScore: 45,
    influence: { reach: 5200000, engagementRate: 5.47, viralityScore: 65, responseTime: 8 },
    topResponses: [
      { type: "positive", content: "Lanjutkan! Berantas mafia pajak!", author: "@warga_peduli", likes: 3450 },
      { type: "negative", content: "Bagaimana dengan kasus yang lebih besar?", author: "@pengamat_hukum", likes: 2100 },
      { type: "neutral", content: "Semoga proses hukumnya transparan", author: "@mahasiswa_ui", likes: 1560 },
    ],
    keywords: ["pajak", "sindikat", "penangkapan", "hukum"],
    category: "Tax Enforcement",
  },
  {
    id: "3",
    platform: "facebook",
    content: "Community legal education program in East Java reaches 50,000 participants",
    contentId: "Program edukasi hukum masyarakat di Jawa Timur menjangkau 50.000 peserta",
    publishedAt: "2024-01-26 10:00",
    engagement: { likes: 23400, comments: 4500, shares: 8900, views: 890000 },
    sentiment: { positive: 78, negative: 8, neutral: 14, score: 0.70 },
    riskLevel: "low",
    riskScore: 12,
    influence: { reach: 2100000, engagementRate: 4.14, viralityScore: 45, responseTime: 25 },
    topResponses: [
      { type: "positive", content: "Program yang sangat bermanfaat untuk masyarakat!", author: "@guru_sma", likes: 890 },
      { type: "positive", content: "Semoga bisa diadakan di daerah lain juga", author: "@warga_jatim", likes: 670 },
      { type: "neutral", content: "Kapan ada di Kalimantan?", author: "@borneo_citizen", likes: 450 },
    ],
    keywords: ["edukasi", "hukum", "masyarakat", "Jawa Timur"],
    category: "Public Education",
  },
  {
    id: "4",
    platform: "twitter",
    content: "Official statement regarding viral news about alleged misconduct - clarification and facts",
    contentId: "Pernyataan resmi terkait berita viral dugaan penyimpangan - klarifikasi dan fakta",
    publishedAt: "2024-01-25 16:45",
    engagement: { likes: 12300, comments: 34500, shares: 45600, views: 5670000 },
    sentiment: { positive: 25, negative: 55, neutral: 20, score: -0.30 },
    riskLevel: "critical",
    riskScore: 82,
    influence: { reach: 15000000, engagementRate: 1.63, viralityScore: 92, responseTime: 3 },
    topResponses: [
      { type: "negative", content: "Klarifikasi tidak meyakinkan!", author: "@aktivis_hukum", likes: 8900 },
      { type: "negative", content: "Kami butuh bukti bukan hanya kata-kata", author: "@journalist_id", likes: 6700 },
      { type: "positive", content: "Terima kasih sudah merespons dengan cepat", author: "@pendukung_ri", likes: 2300 },
    ],
    keywords: ["klarifikasi", "viral", "fakta", "transparansi"],
    category: "Crisis Response",
  },
  {
    id: "5",
    platform: "youtube",
    content: "Documentary: 5 Years of Anti-Corruption Achievements by the Attorney General's Office",
    contentId: "Dokumenter: 5 Tahun Pencapaian Anti-Korupsi Kejaksaan Agung",
    publishedAt: "2024-01-24 12:00",
    engagement: { likes: 156000, comments: 23400, shares: 34500, views: 8900000 },
    sentiment: { positive: 68, negative: 15, neutral: 17, score: 0.53 },
    riskLevel: "low",
    riskScore: 18,
    influence: { reach: 12000000, engagementRate: 2.40, viralityScore: 72, responseTime: 45 },
    topResponses: [
      { type: "positive", content: "Video yang sangat informatif dan inspiratif!", author: "@mahasiswa_hukum", likes: 4560 },
      { type: "positive", content: "Bangga dengan pencapaian ini", author: "@patriot_id", likes: 3890 },
      { type: "neutral", content: "Semoga terus konsisten ke depannya", author: "@pengamat_politik", likes: 2340 },
    ],
    keywords: ["dokumenter", "anti-korupsi", "pencapaian", "reformasi"],
    category: "Public Relations",
  },
  {
    id: "6",
    platform: "tiktok",
    content: "Behind the scenes: A day in the life of a prosecutor handling major cases",
    contentId: "Di balik layar: Sehari bersama jaksa penuntut kasus besar",
    publishedAt: "2024-01-23 18:00",
    engagement: { likes: 234000, comments: 45600, shares: 78900, views: 12500000 },
    sentiment: { positive: 72, negative: 12, neutral: 16, score: 0.60 },
    riskLevel: "low",
    riskScore: 15,
    influence: { reach: 18000000, engagementRate: 2.87, viralityScore: 88, responseTime: 5 },
    topResponses: [
      { type: "positive", content: "Keren banget! Jadi termotivasi jadi jaksa", author: "@gen_z_id", likes: 12300 },
      { type: "positive", content: "Content yang sangat edukatif!", author: "@content_creator", likes: 8900 },
      { type: "neutral", content: "Lebih banyak konten seperti ini dong", author: "@follower_setia", likes: 5600 },
    ],
    keywords: ["behind the scenes", "jaksa", "edukasi", "viral"],
    category: "Public Engagement",
  },
];

const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
};

const PLATFORM_ICONS: Record<Platform, string> = {
  twitter: "𝕏",
  instagram: "📸",
  facebook: "f",
  youtube: "▶",
  tiktok: "♪",
};

const SENTIMENT_COLORS = {
  positive: "#22C55E",
  negative: "#EF4444",
  neutral: "#94A3B8",
};

const RISK_COLORS = {
  low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  critical: "bg-rose-500/10 text-rose-600 border-rose-500/30",
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Engagement over time data
const engagementTrendData = [
  { date: "Jan 22", posts: 3, engagement: 125000, reach: 2500000, sentiment: 0.45 },
  { date: "Jan 23", posts: 4, engagement: 358500, reach: 18000000, sentiment: 0.60 },
  { date: "Jan 24", posts: 2, engagement: 213900, reach: 12000000, sentiment: 0.53 },
  { date: "Jan 25", posts: 3, engagement: 92400, reach: 15000000, sentiment: -0.30 },
  { date: "Jan 26", posts: 2, engagement: 36800, reach: 2100000, sentiment: 0.70 },
  { date: "Jan 27", posts: 3, engagement: 103400, reach: 5200000, sentiment: 0.27 },
  { date: "Jan 28", posts: 2, engagement: 86800, reach: 8500000, sentiment: 0.44 },
];

// Platform performance data
const platformPerformanceData = [
  { platform: "Twitter", posts: 8, avgEngagement: 68000, avgReach: 4200000, avgSentiment: 0.35 },
  { platform: "Instagram", posts: 5, avgEngagement: 89000, avgReach: 3800000, avgSentiment: 0.42 },
  { platform: "Facebook", posts: 4, avgEngagement: 45000, avgReach: 2100000, avgSentiment: 0.55 },
  { platform: "YouTube", posts: 3, avgEngagement: 156000, avgReach: 8900000, avgSentiment: 0.53 },
  { platform: "TikTok", posts: 6, avgEngagement: 234000, avgReach: 12500000, avgSentiment: 0.48 },
];

// Category performance data
const categoryData = [
  { name: "Law Enforcement", value: 35, color: "#3B82F6" },
  { name: "Public Education", value: 25, color: "#22C55E" },
  { name: "Crisis Response", value: 15, color: "#EF4444" },
  { name: "Public Relations", value: 15, color: "#8B5CF6" },
  { name: "Public Engagement", value: 10, color: "#F59E0B" },
];

export default function PostsAnalysisPage() {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<OfficialPost | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  const filteredPosts = officialPosts.filter(
    (post) => selectedPlatform === "all" || post.platform === selectedPlatform
  );

  // Calculate totals
  const totalEngagement = officialPosts.reduce(
    (sum, p) => sum + p.engagement.likes + p.engagement.comments + p.engagement.shares,
    0
  );
  const totalReach = officialPosts.reduce((sum, p) => sum + p.influence.reach, 0);
  const avgSentiment =
    officialPosts.reduce((sum, p) => sum + p.sentiment.score, 0) / officialPosts.length;
  const criticalPosts = officialPosts.filter((p) => p.riskLevel === "critical" || p.riskLevel === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.posts?.title || "Official Posts Analysis"}</h1>
            <p className="text-muted-foreground">
              {t.posts?.subtitle || "Monitor public response to Kejaksaan Agung's official social media posts"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {t.common?.custom || "Custom"}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-5">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">{t.posts?.totalPosts || "Total Posts"}</p>
                <p className="metric-value">{officialPosts.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">{t.posts?.totalEngagement || "Total Engagement"}</p>
                <p className="metric-value">{formatNumber(totalEngagement)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">{t.posts?.totalReach || "Total Reach"}</p>
                <p className="metric-value">{formatNumber(totalReach)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={cn("border-0 shadow-sm", avgSentiment >= 0 ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-rose-50/50 dark:bg-rose-950/20")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">{t.posts?.avgSentiment || "Avg. Sentiment"}</p>
                <p className={cn("metric-value", avgSentiment >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {avgSentiment >= 0 ? "+" : ""}{avgSentiment.toFixed(2)}
                </p>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", avgSentiment >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10")}>
                {avgSentiment >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-rose-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={cn("border-0 shadow-sm", criticalPosts > 0 && "bg-rose-50/50 dark:bg-rose-950/20")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">{t.posts?.highRiskPosts || "High Risk Posts"}</p>
                <p className={cn("metric-value", criticalPosts > 0 && "text-rose-600")}>{criticalPosts}</p>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", criticalPosts > 0 ? "bg-rose-500/10" : "bg-muted")}>
                <AlertTriangle className={cn("h-6 w-6", criticalPosts > 0 ? "text-rose-500" : "text-muted-foreground")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Engagement Trend */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">{t.posts?.engagementTrend || "Engagement & Sentiment Trend"}</CardTitle>
            <CardDescription className="text-sm">{t.posts?.engagementTrendDesc || "Daily engagement and sentiment score from official posts"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementTrendData}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[-1, 1]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "engagement") return [formatNumber(value), "Engagement"];
                      if (name === "sentiment") return [value.toFixed(2), "Sentiment"];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#3B82F6"
                    fill="url(#colorEngagement)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: "#22C55E", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">{t.posts?.categoryDistribution || "Post Categories"}</CardTitle>
            <CardDescription className="text-sm">{t.posts?.categoryDistributionDesc || "Distribution by content type"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-muted-foreground truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Posts List */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">{t.posts?.officialPosts || "Official Posts"}</CardTitle>
                <CardDescription className="text-sm">{t.posts?.officialPostsDesc || "All posts from Kejaksaan Agung official accounts"}</CardDescription>
              </div>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.common?.all || "All"} Platforms</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={cn(
                      "p-5 rounded-xl border cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md",
                      selectedPost?.id === post.id && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Platform Icon */}
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-base shrink-0"
                          style={{ backgroundColor: PLATFORM_COLORS[post.platform] }}
                        >
                          {PLATFORM_ICONS[post.platform]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed line-clamp-2">{post.contentId}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground">{post.publishedAt}</span>
                            <Badge variant="secondary" className="text-xs font-medium">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-xs font-semibold shrink-0 px-2.5 py-1", RISK_COLORS[post.riskLevel])}>
                        {post.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-5 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(post.engagement.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(post.engagement.comments)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Share2 className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(post.engagement.shares)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(post.engagement.views)}</span>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            post.sentiment.score >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}
                        >
                          {post.sentiment.score >= 0 ? "+" : ""}
                          {post.sentiment.score.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Sentiment Bar */}
                    <div className="flex h-2 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${post.sentiment.positive}%` }}
                      />
                      <div
                        className="bg-slate-400"
                        style={{ width: `${post.sentiment.neutral}%` }}
                      />
                      <div
                        className="bg-rose-500"
                        style={{ width: `${post.sentiment.negative}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Post Detail */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">{t.posts?.postDetail || "Post Analysis"}</CardTitle>
            <CardDescription className="text-sm">
              {selectedPost
                ? t.posts?.detailDesc || "Detailed metrics and public response analysis"
                : t.posts?.selectPost || "Select a post to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPost ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-5">
                  {/* Risk Score */}
                  <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">{t.posts?.riskScore || "Risk Score"}</span>
                      <span
                        className={cn(
                          "text-xl font-bold",
                          selectedPost.riskScore >= 70
                            ? "text-rose-600"
                            : selectedPost.riskScore >= 40
                            ? "text-amber-600"
                            : "text-emerald-600"
                        )}
                      >
                        {selectedPost.riskScore}/100
                      </span>
                    </div>
                    <Progress
                      value={selectedPost.riskScore}
                      className={cn(
                        "h-2.5",
                        selectedPost.riskScore >= 70
                          ? "[&>div]:bg-rose-500"
                          : selectedPost.riskScore >= 40
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-emerald-500"
                      )}
                    />
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="p-4 rounded-xl border bg-card">
                    <span className="text-sm font-semibold">{t.posts?.sentimentBreakdown || "Sentiment Breakdown"}</span>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-600 font-medium">{t.feed?.positive || "Positive"}</span>
                        <span className="text-sm font-semibold">{selectedPost.sentiment.positive}%</span>
                      </div>
                      <Progress value={selectedPost.sentiment.positive} className="h-2 [&>div]:bg-emerald-500" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">{t.feed?.neutral || "Neutral"}</span>
                        <span className="text-sm font-semibold">{selectedPost.sentiment.neutral}%</span>
                      </div>
                      <Progress value={selectedPost.sentiment.neutral} className="h-2 [&>div]:bg-slate-400" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-rose-600 font-medium">{t.feed?.negative || "Negative"}</span>
                        <span className="text-sm font-semibold">{selectedPost.sentiment.negative}%</span>
                      </div>
                      <Progress value={selectedPost.sentiment.negative} className="h-2 [&>div]:bg-rose-500" />
                    </div>
                  </div>

                  {/* Influence Metrics */}
                  <div className="p-4 rounded-xl border bg-card">
                    <span className="text-sm font-semibold">{t.posts?.influenceMetrics || "Influence Metrics"}</span>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold">{formatNumber(selectedPost.influence.reach)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.metrics?.reach || "Reach"}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold">{selectedPost.influence.engagementRate}%</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.posts?.engagementRate || "Engagement Rate"}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold">{selectedPost.influence.viralityScore}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.posts?.viralityScore || "Virality Score"}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold">{selectedPost.influence.responseTime}m</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.posts?.avgResponseTime || "Avg Response Time"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Responses */}
                  <div className="p-4 rounded-xl border bg-card">
                    <span className="text-sm font-semibold">{t.posts?.topResponses || "Top Responses"}</span>
                    <div className="mt-4 space-y-3">
                      {selectedPost.topResponses.map((response, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-3 rounded-lg",
                            response.type === "positive"
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-l-3 border-emerald-500"
                              : response.type === "negative"
                              ? "bg-rose-50 dark:bg-rose-950/30 border-l-3 border-rose-500"
                              : "bg-slate-50 dark:bg-slate-950/30 border-l-3 border-slate-400"
                          )}
                        >
                          <p className="text-sm text-foreground leading-relaxed">{response.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium text-muted-foreground">{response.author}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Heart className="h-3 w-3" />
                              {formatNumber(response.likes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="p-4 rounded-xl border bg-card">
                    <span className="text-sm font-semibold">{t.posts?.keywords || "Keywords"}</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPost.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs px-2.5 py-1">
                          #{keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-10">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t.posts?.viewOriginal || "View Original"}
                    </Button>
                    <Button variant="outline" className="flex-1 h-10">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {t.posts?.fullReport || "Full Report"}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Target className="h-14 w-14 mb-5 opacity-30" />
                <p className="text-base font-medium">{t.posts?.noPostSelected || "No Post Selected"}</p>
                <p className="text-sm mt-1">{t.posts?.clickToSelect || "Click on a post to view detailed analysis"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">{t.posts?.platformPerformance || "Platform Performance Comparison"}</CardTitle>
          <CardDescription className="text-sm">{t.posts?.platformPerformanceDesc || "Compare engagement metrics across different social media platforms"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <YAxis
                  type="category"
                  dataKey="platform"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={85}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number, name: string) => [formatNumber(value), name]}
                />
                <Legend wrapperStyle={{ fontSize: "13px" }} />
                <Bar dataKey="avgEngagement" name="Avg Engagement" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="avgReach" name="Avg Reach" fill="#22C55E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
