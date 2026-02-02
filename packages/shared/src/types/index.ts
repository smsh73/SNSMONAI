/**
 * SNSMON-AI Shared Types
 * Core type definitions for the SNS Monitoring System
 */

// ============================================
// Platform & Basic Enums
// ============================================

export type Platform =
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'line'
  | 'telegram'
  | 'youtube';

export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export type EmotionType =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'surprise'
  | 'disgust'
  | 'trust'
  | 'anticipation';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

// ============================================
// API Key Management
// ============================================

export type ApiKeyType = 'ai' | 'social' | 'third_party';

export type AiProvider = 'openai' | 'anthropic' | 'prosa' | 'azure' | 'google';

export type SocialProvider = 'twitter' | 'meta' | 'tiktok' | 'telegram' | 'line';

export type ThirdPartyProvider = 'dataxet' | 'mediawave' | 'brightdata' | 'apify';

export interface ApiKeyConfig {
  id: string;
  organizationId: string;
  keyType: ApiKeyType;
  provider: string;
  name: string;

  // Encrypted credentials
  encryptedApiKey: string;
  encryptedSecretKey?: string;
  encryptedAccessToken?: string;

  // Additional config (provider-specific)
  config?: Record<string, unknown>;

  // Usage tracking
  usage: {
    currentPeriod: number;
    limit: number;
    resetDate: Date;
  };

  // Status
  isActive: boolean;
  lastValidated?: Date;
  expiresAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreateInput {
  organizationId: string;
  keyType: ApiKeyType;
  provider: string;
  name: string;
  apiKey: string;
  secretKey?: string;
  accessToken?: string;
  config?: Record<string, unknown>;
  usageLimit?: number;
  expiresAt?: Date;
}

// ============================================
// Keyword Management
// ============================================

export type KeywordCategory =
  | 'crisis_civil_unrest'
  | 'crisis_violence'
  | 'crisis_disaster'
  | 'crisis_incident'
  | 'government'
  | 'brand'
  | 'competitor'
  | 'custom';

export interface KeywordItem {
  term: string;
  variants: string[];
  weight: number; // 1-10
  language: 'id' | 'en' | 'both';
}

export interface KeywordMatchSettings {
  caseSensitive: boolean;
  exactMatch: boolean;
  includeHashtags: boolean;
  includeMentions: boolean;
}

export interface KeywordConfig {
  id: string;
  organizationId: string;
  category: KeywordCategory;
  name: string;
  description?: string;

  // Keywords
  keywords: KeywordItem[];
  excludeKeywords: string[];

  // Match settings
  matchSettings: KeywordMatchSettings;

  // Scope
  isActive: boolean;
  platforms: Platform[];
  regions?: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface KeywordCreateInput {
  organizationId: string;
  category: KeywordCategory;
  name: string;
  description?: string;
  keywords: KeywordItem[];
  excludeKeywords?: string[];
  matchSettings?: Partial<KeywordMatchSettings>;
  platforms?: Platform[];
  regions?: string[];
}

// ============================================
// Region & Geographic
// ============================================

export type RegionLevel = 'country' | 'province' | 'regency' | 'district';

export interface RegionData {
  code: string;           // BPS code (e.g., '31' for DKI Jakarta)
  level: RegionLevel;
  name: string;           // English name
  nameLocal: string;      // Local name (Indonesian)
  parentCode?: string;    // Parent region code

  // Location
  coordinates: {
    lat: number;
    lng: number;
  };

  // Metadata
  population?: number;
  timezone: string;

  // Status
  isActive: boolean;
}

export interface RegionConfig {
  id: string;
  organizationId: string;

  // Enabled regions
  enabledRegions: {
    countries: string[];
    provinces?: string[];
    cities?: string[];
  };

  // Regional overrides
  regionalKeywords?: {
    regionCode: string;
    additionalKeywords: string[];
    excludeKeywords: string[];
  }[];

  // Regional alerts
  regionalAlerts?: {
    regionCode: string;
    thresholds: {
      crisisScore: number;
      sentimentDrop: number;
      volumeSpike: number;
    };
    recipients: string[];
  }[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Schedule Management
// ============================================

export type ScheduleType = 'cron' | 'interval' | 'once';

export type JobType =
  | 'data_collection'
  | 'sentiment_analysis'
  | 'trend_calculation'
  | 'report_generation'
  | 'alert_evaluation'
  | 'data_cleanup'
  | 'api_health_check';

export type JobStatus = 'success' | 'failed' | 'running' | 'pending' | 'skipped';

export type JobPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ScheduleDefinition {
  type: ScheduleType;
  expression?: string;      // cron expression
  intervalMs?: number;      // interval in milliseconds
  executeAt?: Date;         // one-time execution
}

export interface ScheduleConfig {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  jobType: JobType;

  // Schedule
  schedule: ScheduleDefinition;

  // Job config
  config: {
    platforms?: Platform[];
    targets?: string[];
    regions?: string[];
    priority: JobPriority;
    maxRetries?: number;
    timeoutMs?: number;
  };

  // Status
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  lastStatus: JobStatus;
  lastError?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SNS Account Management
// ============================================

export type AccountType = 'owned' | 'monitored' | 'competitor';

export interface SocialAccountCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface SocialAccountMonitoring {
  collectPosts: boolean;
  collectComments: boolean;
  collectMentions: boolean;
  collectDMs: boolean;
  collectStories: boolean;
}

export interface SocialAccountSyncStatus {
  lastSync?: Date;
  postsCollected: number;
  mentionsCollected: number;
  errors: string[];
}

export interface SocialAccountConfig {
  id: string;
  organizationId: string;
  platform: Platform;

  // Account info
  accountId: string;
  accountName: string;
  accountType: AccountType;
  profileUrl?: string;

  // Credentials (encrypted)
  credentials: SocialAccountCredentials;

  // Monitoring settings
  monitoring: SocialAccountMonitoring;

  // Sync status
  syncStatus: SocialAccountSyncStatus;

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Monitoring & Analytics
// ============================================

export interface Post {
  id: string;
  organizationId: string;
  platform: Platform;

  // Post identifiers
  platformPostId: string;
  url?: string;

  // Author
  authorId: string;
  authorUsername: string;
  authorDisplayName?: string;
  authorFollowers?: number;
  authorVerified?: boolean;

  // Content
  content: string;
  contentLanguage: string;
  mediaType: 'text' | 'image' | 'video' | 'carousel' | 'story';
  mediaUrls?: string[];

  // Engagement
  likes: number;
  shares: number;
  comments: number;
  views?: number;
  engagementRate?: number;

  // Analysis
  sentiment?: SentimentLabel;
  sentimentScore?: number;
  emotions?: EmotionType[];
  topics?: string[];
  entities?: string[];
  hashtags?: string[];
  mentions?: string[];

  // Location
  regionCode?: string;
  regionName?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Classification
  isCrisisRelated?: boolean;
  matchedKeywords?: string[];
  targetIds?: string[];

  // Timestamps
  createdAt: Date;      // Post creation time
  collectedAt: Date;    // Collection time
  processedAt?: Date;   // Processing time
}

export interface SentimentResult {
  label: SentimentLabel;
  score: number;        // -1.0 to 1.0
  confidence: number;   // 0.0 to 1.0
  emotions?: {
    type: EmotionType;
    score: number;
  }[];
  aspects?: {
    aspect: string;
    sentiment: SentimentLabel;
    score: number;
  }[];
}

export interface TrendingTopic {
  id: string;
  organizationId: string;
  topic: string;
  platform?: Platform;
  regionCode?: string;

  // Metrics
  mentionCount: number;
  velocity: number;       // Change rate
  trendScore: number;     // Z-score based

  // Sentiment breakdown
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };

  // Sample posts
  samplePostIds: string[];

  // Time window
  periodStart: Date;
  periodEnd: Date;
  calculatedAt: Date;
}

// ============================================
// Crisis & Alerts
// ============================================

export type AlertType =
  | 'volume_spike'
  | 'sentiment_drop'
  | 'keyword_match'
  | 'crisis_detected'
  | 'competitor_spike'
  | 'influencer_mention'
  | 'custom_metric';

export type NotificationChannel = 'email' | 'slack' | 'webhook' | 'sms' | 'push';

export interface AlertCondition {
  // Volume spike
  volumeThreshold?: {
    percentage: number;
    baselineWindow: string;
    minVolume: number;
  };

  // Sentiment drop
  sentimentThreshold?: {
    minScore: number;
    dropPercentage: number;
    window: string;
  };

  // Keyword match
  keywords?: {
    include: string[];
    exclude: string[];
    caseSensitive: boolean;
  };

  // Crisis detection
  crisisKeywords?: {
    terms: string[];
    minMatches: number;
    sentimentThreshold: number;
  };

  // Custom metric
  customQuery?: {
    query: string;
    threshold: number;
    operator: '>' | '<' | '>=' | '<=' | '==';
  };
}

export interface AlertRule {
  id: string;
  organizationId: string;
  targetId?: string;
  name: string;
  description?: string;

  // Rule definition
  type: AlertType;
  condition: AlertCondition;

  // Notification
  channels: {
    type: NotificationChannel;
    config: Record<string, unknown>;
  }[];

  // Settings
  priority: AlertSeverity;
  cooldownMinutes: number;
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  organizationId: string;
  ruleId: string;

  // Alert details
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;

  // Trigger data
  triggerData: {
    metric: string;
    currentValue: number;
    threshold: number;
    regionCode?: string;
    platform?: Platform;
  };

  // Related content
  relatedPostIds?: string[];
  relatedTopics?: string[];

  // Resolution
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;

  // Timestamps
  triggeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Dashboard & Reports
// ============================================

export interface DashboardMetrics {
  // Volume
  totalMentions: number;
  mentionsByPlatform: Record<Platform, number>;
  mentionsByRegion: Record<string, number>;

  // Sentiment
  overallSentiment: SentimentLabel;
  sentimentScore: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };

  // Engagement
  totalEngagement: number;
  engagementRate: number;
  reach: number;

  // Authors
  uniqueAuthors: number;
  topInfluencers: {
    id: string;
    username: string;
    platform: Platform;
    followers: number;
    mentionCount: number;
  }[];

  // Trends
  trendingTopics: TrendingTopic[];

  // Alerts
  activeAlerts: number;
  alertsBySeverity: Record<AlertSeverity, number>;

  // Time range
  periodStart: Date;
  periodEnd: Date;
}

export interface ReportConfig {
  id: string;
  organizationId: string;
  name: string;
  description?: string;

  // Report type
  type: 'daily' | 'weekly' | 'monthly' | 'custom';

  // Content
  sections: string[];
  platforms: Platform[];
  regions?: string[];
  targets?: string[];

  // Schedule (optional)
  schedule?: ScheduleDefinition;
  recipients?: string[];

  // Format
  format: 'pdf' | 'excel' | 'html';

  // Status
  isActive: boolean;
  lastGenerated?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Organization & Users
// ============================================

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;

  // Plan
  planType: 'free' | 'basic' | 'pro' | 'enterprise';

  // Settings
  settings: {
    defaultLanguage: string;
    timezone: string;
    dateFormat: string;
  };

  // Limits
  limits: {
    users: number;
    targets: number;
    keywords: number;
    apiCalls: number;
  };

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  organizationId: string;

  // Profile
  email: string;
  name: string;
  avatarUrl?: string;

  // Role & permissions
  role: UserRole;
  permissions: string[];

  // Preferences
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      slack: boolean;
    };
  };

  // Status
  isActive: boolean;
  lastLoginAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate: Date;
  endDate: Date;
}

export interface FilterParams {
  platforms?: Platform[];
  regions?: string[];
  sentiments?: SentimentLabel[];
  keywords?: string[];
  targetIds?: string[];
}
