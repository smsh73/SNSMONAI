import type {
  PlatformBreakdown,
  RegionBreakdown,
  TopicBreakdown,
  PostSummary,
  AuthorSummary,
  MetricDrillDown,
  AlertDetail,
} from "@/types/drill-down";

// Platform breakdown mock data
export const platformBreakdownData: Record<string, PlatformBreakdown> = {
  twitter: {
    platform: "Twitter/X",
    mentions: 1850000,
    reach: 580000000,
    engagement: 12500000,
    sentiment: -0.18,
    change: 15.2,
    topPosts: [
      {
        id: "tw-1",
        platform: "twitter",
        authorId: "auth-1",
        authorName: "Kompas News",
        authorUsername: "kompaborneo",
        content: "Breaking: Kejaksaan Agung melakukan operasi tangkap tangan terhadap pejabat korup di Jakarta...",
        sentiment: "negative",
        sentimentScore: -0.75,
        timestamp: "2 hours ago",
        engagement: { likes: 45200, comments: 8900, shares: 12300, reach: 2500000 },
        region: "DKI Jakarta",
        topics: ["korupsi", "kejaksaan"],
      },
      {
        id: "tw-2",
        platform: "twitter",
        authorId: "auth-2",
        authorName: "Detik News",
        authorUsername: "detikcom",
        content: "Program bantuan sosial berhasil menjangkau 5 juta keluarga di seluruh Indonesia...",
        sentiment: "positive",
        sentimentScore: 0.65,
        timestamp: "4 hours ago",
        engagement: { likes: 28700, comments: 3200, shares: 8900, reach: 1800000 },
        region: "DKI Jakarta",
        topics: ["bansos", "pemerintah"],
      },
    ],
    hourlyData: [
      { hour: "00:00", mentions: 45000 },
      { hour: "03:00", mentions: 28000 },
      { hour: "06:00", mentions: 52000 },
      { hour: "09:00", mentions: 125000 },
      { hour: "12:00", mentions: 185000 },
      { hour: "15:00", mentions: 165000 },
      { hour: "18:00", mentions: 142000 },
      { hour: "21:00", mentions: 98000 },
    ],
  },
  instagram: {
    platform: "Instagram",
    mentions: 1250000,
    reach: 420000000,
    engagement: 18500000,
    sentiment: 0.12,
    change: 8.5,
    topPosts: [
      {
        id: "ig-1",
        platform: "instagram",
        authorId: "auth-3",
        authorName: "Info Jakarta",
        authorUsername: "infojakarta",
        content: "Pembangunan MRT fase 3 resmi dimulai hari ini! Jakarta makin modern...",
        sentiment: "positive",
        sentimentScore: 0.82,
        timestamp: "3 hours ago",
        engagement: { likes: 125000, comments: 8500, shares: 15000, reach: 3200000 },
        region: "DKI Jakarta",
        topics: ["MRT", "infrastruktur"],
      },
    ],
    hourlyData: [
      { hour: "00:00", mentions: 32000 },
      { hour: "03:00", mentions: 18000 },
      { hour: "06:00", mentions: 45000 },
      { hour: "09:00", mentions: 98000 },
      { hour: "12:00", mentions: 145000 },
      { hour: "15:00", mentions: 132000 },
      { hour: "18:00", mentions: 165000 },
      { hour: "21:00", mentions: 125000 },
    ],
  },
  facebook: {
    platform: "Facebook",
    mentions: 890000,
    reach: 320000000,
    engagement: 8900000,
    sentiment: -0.05,
    change: -3.2,
    topPosts: [],
    hourlyData: [],
  },
  tiktok: {
    platform: "TikTok",
    mentions: 420000,
    reach: 180000000,
    engagement: 25000000,
    sentiment: 0.25,
    change: 45.8,
    topPosts: [],
    hourlyData: [],
  },
  youtube: {
    platform: "YouTube",
    mentions: 130000,
    reach: 95000000,
    engagement: 4500000,
    sentiment: 0.08,
    change: 12.1,
    topPosts: [],
    hourlyData: [],
  },
};

// Region breakdown mock data
export const regionBreakdownData: Record<string, RegionBreakdown> = {
  "DKI Jakarta": {
    regionCode: "31",
    regionName: "DKI Jakarta",
    mentions: 452000,
    sentiment: -0.35,
    crisisScore: 75,
    topCities: [
      { cityCode: "3171", cityName: "Jakarta Pusat", provinceName: "DKI Jakarta", mentions: 125000, sentiment: -0.42, crisisScore: 82, topAuthors: [], recentPosts: [] },
      { cityCode: "3172", cityName: "Jakarta Utara", provinceName: "DKI Jakarta", mentions: 89000, sentiment: -0.28, crisisScore: 68, topAuthors: [], recentPosts: [] },
      { cityCode: "3173", cityName: "Jakarta Barat", provinceName: "DKI Jakarta", mentions: 78000, sentiment: -0.35, crisisScore: 72, topAuthors: [], recentPosts: [] },
      { cityCode: "3174", cityName: "Jakarta Selatan", provinceName: "DKI Jakarta", mentions: 95000, sentiment: -0.25, crisisScore: 65, topAuthors: [], recentPosts: [] },
      { cityCode: "3175", cityName: "Jakarta Timur", provinceName: "DKI Jakarta", mentions: 65000, sentiment: -0.38, crisisScore: 70, topAuthors: [], recentPosts: [] },
    ],
    topTopics: [
      { topic: "#korupsi", hashtags: ["korupsi", "KPK", "OTT"], mentions: 45000, reach: 125000000, sentiment: -0.72, sentimentBreakdown: { positive: 8, neutral: 22, negative: 70 }, relatedTopics: ["hukum", "politik"], topPosts: [], timeline: [] },
      { topic: "#banjir", hashtags: ["banjir", "jakarta"], mentions: 32000, reach: 89000000, sentiment: -0.58, sentimentBreakdown: { positive: 12, neutral: 28, negative: 60 }, relatedTopics: ["cuaca", "infrastruktur"], topPosts: [], timeline: [] },
    ],
    platformDistribution: [
      { platform: "Twitter", count: 185000, percentage: 40.9 },
      { platform: "Instagram", count: 125000, percentage: 27.7 },
      { platform: "Facebook", count: 89000, percentage: 19.7 },
      { platform: "TikTok", count: 42000, percentage: 9.3 },
      { platform: "YouTube", count: 11000, percentage: 2.4 },
    ],
  },
  "Jawa Barat": {
    regionCode: "32",
    regionName: "Jawa Barat",
    mentions: 321000,
    sentiment: -0.15,
    crisisScore: 45,
    topCities: [
      { cityCode: "3273", cityName: "Bandung", provinceName: "Jawa Barat", mentions: 125000, sentiment: -0.12, crisisScore: 42, topAuthors: [], recentPosts: [] },
      { cityCode: "3271", cityName: "Bogor", provinceName: "Jawa Barat", mentions: 68000, sentiment: -0.18, crisisScore: 48, topAuthors: [], recentPosts: [] },
      { cityCode: "3275", cityName: "Bekasi", provinceName: "Jawa Barat", mentions: 58000, sentiment: -0.15, crisisScore: 45, topAuthors: [], recentPosts: [] },
      { cityCode: "3276", cityName: "Depok", provinceName: "Jawa Barat", mentions: 45000, sentiment: -0.10, crisisScore: 38, topAuthors: [], recentPosts: [] },
    ],
    topTopics: [],
    platformDistribution: [
      { platform: "Twitter", count: 128000, percentage: 39.9 },
      { platform: "Instagram", count: 98000, percentage: 30.5 },
      { platform: "Facebook", count: 58000, percentage: 18.1 },
      { platform: "TikTok", count: 28000, percentage: 8.7 },
      { platform: "YouTube", count: 9000, percentage: 2.8 },
    ],
  },
  "Jawa Timur": {
    regionCode: "35",
    regionName: "Jawa Timur",
    mentions: 289000,
    sentiment: -0.28,
    crisisScore: 62,
    topCities: [
      { cityCode: "3578", cityName: "Surabaya", provinceName: "Jawa Timur", mentions: 145000, sentiment: -0.32, crisisScore: 68, topAuthors: [], recentPosts: [] },
      { cityCode: "3573", cityName: "Malang", provinceName: "Jawa Timur", mentions: 52000, sentiment: -0.22, crisisScore: 52, topAuthors: [], recentPosts: [] },
    ],
    topTopics: [],
    platformDistribution: [],
  },
};

// Topic drill-down data
export const topicBreakdownData: Record<string, TopicBreakdown> = {
  "#korupsi": {
    topic: "#korupsi",
    hashtags: ["korupsi", "KPK", "OTT", "suap", "gratifikasi"],
    mentions: 89500,
    reach: 285000000,
    sentiment: -0.72,
    sentimentBreakdown: { positive: 8, neutral: 22, negative: 70 },
    relatedTopics: ["#KPK", "#hukum", "#politik", "#pemerintah"],
    topPosts: [
      {
        id: "tp-1",
        platform: "twitter",
        authorId: "auth-1",
        authorName: "CNN Indonesia",
        authorUsername: "CNNIndonesia",
        content: "KPK Tetapkan Tersangka Baru dalam Kasus Korupsi Proyek Infrastruktur...",
        sentiment: "negative",
        sentimentScore: -0.85,
        timestamp: "1 hour ago",
        engagement: { likes: 12500, comments: 3200, shares: 8900, reach: 4500000 },
        topics: ["korupsi", "KPK"],
      },
    ],
    timeline: [
      { date: "Jan 22", mentions: 12000, sentiment: -0.68 },
      { date: "Jan 23", mentions: 15000, sentiment: -0.72 },
      { date: "Jan 24", mentions: 18500, sentiment: -0.75 },
      { date: "Jan 25", mentions: 22000, sentiment: -0.78 },
      { date: "Jan 26", mentions: 28000, sentiment: -0.82 },
      { date: "Jan 27", mentions: 45000, sentiment: -0.85 },
      { date: "Jan 28", mentions: 89500, sentiment: -0.72 },
    ],
  },
  "#ekonomi": {
    topic: "#ekonomi",
    hashtags: ["ekonomi", "bisnis", "investasi", "IHSG"],
    mentions: 67800,
    reach: 195000000,
    sentiment: 0.15,
    sentimentBreakdown: { positive: 42, neutral: 38, negative: 20 },
    relatedTopics: ["#bisnis", "#investasi", "#saham"],
    topPosts: [],
    timeline: [],
  },
};

// Metric drill-down data
export const metricDrillDownData: Record<string, MetricDrillDown> = {
  mentions: {
    metricType: "mentions",
    currentValue: 4540000,
    previousValue: 4035000,
    change: 12.5,
    breakdown: {
      byPlatform: [
        { platform: "Twitter/X", value: 1850000, change: 15.2 },
        { platform: "Instagram", value: 1250000, change: 8.5 },
        { platform: "Facebook", value: 890000, change: -3.2 },
        { platform: "TikTok", value: 420000, change: 45.8 },
        { platform: "YouTube", value: 130000, change: 12.1 },
      ],
      byRegion: [
        { region: "DKI Jakarta", value: 452000, change: 18.5 },
        { region: "Jawa Barat", value: 321000, change: 12.2 },
        { region: "Jawa Timur", value: 289000, change: 15.8 },
        { region: "Jawa Tengah", value: 185000, change: 8.2 },
        { region: "Sumatera Utara", value: 142000, change: 22.5 },
      ],
      byTime: [
        { period: "00:00-06:00", value: 380000 },
        { period: "06:00-12:00", value: 1250000 },
        { period: "12:00-18:00", value: 1680000 },
        { period: "18:00-24:00", value: 1230000 },
      ],
    },
    topContributors: [],
  },
  sentiment: {
    metricType: "sentiment",
    currentValue: -0.23,
    previousValue: -0.15,
    change: -8.2,
    breakdown: {
      byPlatform: [
        { platform: "Twitter/X", value: -0.35, change: -12.5 },
        { platform: "Instagram", value: 0.12, change: 5.2 },
        { platform: "Facebook", value: -0.18, change: -8.8 },
        { platform: "TikTok", value: 0.25, change: 15.2 },
        { platform: "YouTube", value: 0.08, change: 2.1 },
      ],
      byRegion: [
        { region: "DKI Jakarta", value: -0.35, change: -15.2 },
        { region: "Jawa Barat", value: -0.15, change: -5.5 },
        { region: "Jawa Timur", value: -0.28, change: -12.8 },
        { region: "Bali", value: 0.35, change: 8.5 },
        { region: "DI Yogyakarta", value: 0.25, change: 12.2 },
      ],
      byTime: [
        { period: "Jan 22", value: -0.15 },
        { period: "Jan 23", value: -0.18 },
        { period: "Jan 24", value: -0.22 },
        { period: "Jan 25", value: -0.25 },
        { period: "Jan 26", value: -0.28 },
        { period: "Jan 27", value: -0.32 },
        { period: "Jan 28", value: -0.23 },
      ],
    },
    topContributors: [],
  },
  reach: {
    metricType: "reach",
    currentValue: 1450000000,
    previousValue: 1178000000,
    change: 23.1,
    breakdown: {
      byPlatform: [
        { platform: "Twitter/X", value: 580000000, change: 18.5 },
        { platform: "Instagram", value: 420000000, change: 25.2 },
        { platform: "Facebook", value: 320000000, change: 12.8 },
        { platform: "TikTok", value: 180000000, change: 85.5 },
        { platform: "YouTube", value: 95000000, change: 15.2 },
      ],
      byRegion: [],
      byTime: [],
    },
    topContributors: [],
  },
  alerts: {
    metricType: "alerts",
    currentValue: 12,
    previousValue: 8,
    change: 50,
    breakdown: {
      byPlatform: [
        { platform: "Twitter/X", value: 5, change: 25 },
        { platform: "Instagram", value: 3, change: 50 },
        { platform: "Facebook", value: 2, change: 100 },
        { platform: "TikTok", value: 1, change: 0 },
        { platform: "YouTube", value: 1, change: 0 },
      ],
      byRegion: [
        { region: "DKI Jakarta", value: 4, change: 33 },
        { region: "Jawa Timur", value: 3, change: 50 },
        { region: "Jawa Barat", value: 2, change: 100 },
        { region: "Sumatera Utara", value: 2, change: 0 },
        { region: "Sulawesi Selatan", value: 1, change: 0 },
      ],
      byTime: [],
    },
    topContributors: [],
  },
};

// Alert detail data
export const alertDetailData: Record<string, AlertDetail> = {
  "alert-1": {
    id: "alert-1",
    severity: "critical",
    type: "spike",
    title: "Lonjakan Mention Negatif tentang 'kerusuhan'",
    description: "Terdeteksi peningkatan drastis mention dengan kata kunci 'kerusuhan' sebesar 450% dalam 30 menit terakhir. Mayoritas berasal dari DKI Jakarta.",
    detectedAt: "5 minutes ago",
    status: "active",
    metrics: {
      currentValue: 2341,
      previousValue: 425,
      changePercent: 450,
      threshold: 200,
    },
    affectedRegions: ["DKI Jakarta", "Jawa Barat"],
    relatedTopics: ["#kerusuhan", "#demo", "#jakarta"],
    relatedPosts: [
      {
        id: "rp-1",
        platform: "twitter",
        authorId: "auth-5",
        authorName: "News Reporter",
        authorUsername: "newsreporter",
        content: "BREAKING: Situasi mencekam di kawasan Monas, massa mulai berkumpul...",
        sentiment: "negative",
        sentimentScore: -0.92,
        timestamp: "3 minutes ago",
        engagement: { likes: 5200, comments: 1800, shares: 3500, reach: 850000 },
      },
    ],
    timeline: [
      { timestamp: "14:00", value: 45 },
      { timestamp: "14:10", value: 128 },
      { timestamp: "14:20", value: 425 },
      { timestamp: "14:30", value: 892 },
      { timestamp: "14:40", value: 1542 },
      { timestamp: "14:50", value: 2341 },
    ],
    recommendations: [
      "Monitor situasi secara real-time",
      "Siapkan tim komunikasi krisis",
      "Koordinasi dengan pihak keamanan",
      "Persiapkan statement resmi",
    ],
  },
};

// Helper function to get drill-down data
export function getDrillDownData(
  type: "platform" | "region" | "topic" | "metric" | "alert",
  key: string
) {
  switch (type) {
    case "platform":
      return platformBreakdownData[key];
    case "region":
      return regionBreakdownData[key];
    case "topic":
      return topicBreakdownData[key];
    case "metric":
      return metricDrillDownData[key];
    case "alert":
      return alertDetailData[key];
    default:
      return null;
  }
}
