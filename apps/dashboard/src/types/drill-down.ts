// Drill-down data types and structures

// Drill-down levels
export type DrillDownLevel =
  | "overview"      // Top level - aggregate metrics
  | "platform"      // Platform breakdown (Twitter, Instagram, etc.)
  | "region"        // Regional breakdown (Province level)
  | "city"          // City level detail
  | "topic"         // Topic/keyword detail
  | "post"          // Individual post detail
  | "author"        // Author profile detail
  | "timeline";     // Time-based breakdown

// Context for tracking drill-down navigation
export interface DrillDownContext {
  level: DrillDownLevel;
  parentLevel?: DrillDownLevel;
  filters: {
    platform?: string;
    region?: string;
    city?: string;
    topic?: string;
    dateRange?: { start: Date; end: Date };
    sentiment?: "positive" | "negative" | "neutral";
  };
  breadcrumbs: { level: DrillDownLevel; label: string; filters?: Record<string, string> }[];
}

// Platform breakdown data
export interface PlatformBreakdown {
  platform: string;
  mentions: number;
  reach: number;
  engagement: number;
  sentiment: number;
  change: number;
  topPosts: PostSummary[];
  hourlyData: { hour: string; mentions: number }[];
}

// Region breakdown data
export interface RegionBreakdown {
  regionCode: string;
  regionName: string;
  mentions: number;
  sentiment: number;
  crisisScore: number;
  topCities: CityBreakdown[];
  topTopics: TopicBreakdown[];
  platformDistribution: { platform: string; count: number; percentage: number }[];
}

// City breakdown data
export interface CityBreakdown {
  cityCode: string;
  cityName: string;
  provinceName: string;
  mentions: number;
  sentiment: number;
  crisisScore: number;
  topAuthors: AuthorSummary[];
  recentPosts: PostSummary[];
}

// Topic breakdown data
export interface TopicBreakdown {
  topic: string;
  hashtags: string[];
  mentions: number;
  reach: number;
  sentiment: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  relatedTopics: string[];
  topPosts: PostSummary[];
  timeline: { date: string; mentions: number; sentiment: number }[];
}

// Post summary for lists
export interface PostSummary {
  id: string;
  platform: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  region?: string;
  city?: string;
  topics?: string[];
}

// Post detail (full data)
export interface PostDetail extends PostSummary {
  url: string;
  media?: { type: "image" | "video"; url: string }[];
  replies?: PostSummary[];
  relatedPosts?: PostSummary[];
  authorProfile: AuthorSummary;
  locationData?: {
    region: string;
    city: string;
    coordinates?: [number, number];
  };
}

// Author summary for lists
export interface AuthorSummary {
  id: string;
  platform: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  following: number;
  totalPosts: number;
  avgSentiment: number;
  influenceScore: number;
  isVerified: boolean;
  accountType: "individual" | "organization" | "media" | "government" | "unknown";
}

// Author detail (full profile)
export interface AuthorDetail extends AuthorSummary {
  bio?: string;
  location?: string;
  joinedDate?: string;
  recentPosts: PostSummary[];
  sentimentTrend: { date: string; sentiment: number }[];
  topTopics: string[];
  engagementRate: number;
  reachTrend: { date: string; reach: number }[];
}

// Timeline breakdown data
export interface TimelineBreakdown {
  period: "hourly" | "daily" | "weekly" | "monthly";
  data: {
    timestamp: string;
    mentions: number;
    reach: number;
    sentiment: number;
    topPlatform: string;
    topTopic: string;
    crisisScore: number;
  }[];
  aggregates: {
    totalMentions: number;
    avgSentiment: number;
    peakTime: string;
    peakMentions: number;
  };
}

// Alert detail data
export interface AlertDetail {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "spike" | "sentiment_drop" | "crisis" | "trending" | "anomaly";
  title: string;
  description: string;
  detectedAt: string;
  status: "active" | "acknowledged" | "resolved";
  metrics: {
    currentValue: number;
    previousValue: number;
    changePercent: number;
    threshold: number;
  };
  affectedRegions: string[];
  relatedTopics: string[];
  relatedPosts: PostSummary[];
  timeline: { timestamp: string; value: number }[];
  recommendations: string[];
}

// Metric card drill-down data
export interface MetricDrillDown {
  metricType: "mentions" | "sentiment" | "reach" | "alerts";
  currentValue: number;
  previousValue: number;
  change: number;
  breakdown: {
    byPlatform: { platform: string; value: number; change: number }[];
    byRegion: { region: string; value: number; change: number }[];
    byTime: { period: string; value: number }[];
  };
  topContributors: PostSummary[] | AuthorSummary[];
}
