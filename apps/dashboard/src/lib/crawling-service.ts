/**
 * SNS Data Crawling Service for SNSMON-AI
 *
 * Manages social media data collection with support for:
 * - Real-time crawling (WebSocket/Streaming)
 * - Near real-time crawling (1-5 minute intervals)
 * - Batch crawling (configurable intervals)
 */

import { performAnalysis, type AIProvider } from "./ai-service";

// ============ Types ============

export type CrawlingMode = "realtime" | "near_realtime" | "batch";
export type Platform = "twitter" | "instagram" | "facebook" | "tiktok" | "telegram" | "youtube";
export type JobStatus = "idle" | "running" | "paused" | "error";

export interface CrawlingConfig {
  id: string;
  name: string;
  platform: Platform;
  mode: CrawlingMode;
  isActive: boolean;
  interval?: number; // minutes (for near_realtime and batch modes)
  keywords: string[];
  regions: string[];
  accounts: string[];
  enableAIAnalysis: boolean;
  aiProvider?: AIProvider;
  createdAt: string;
  updatedAt: string;
}

export interface CrawlingJob {
  id: string;
  configId: string;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  itemsCollected: number;
  itemsAnalyzed: number;
  errors: string[];
  lastError?: string;
}

export interface CrawledPost {
  id: string;
  platform: Platform;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorFollowers?: number;
  content: string;
  contentType: "text" | "image" | "video" | "link";
  language?: string;
  hashtags: string[];
  mentions: string[];
  url: string;
  publishedAt: string;
  collectedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  location?: {
    region: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  // AI Analysis Results
  analysis?: {
    sentiment: {
      score: number;
      label: "positive" | "negative" | "neutral";
      confidence: number;
    };
    emotions?: {
      emotion: string;
      score: number;
    }[];
    crisisIndicators?: {
      score: number;
      category?: string;
      keywords: string[];
    };
    isSpam: boolean;
    isBotLikely: boolean;
    analyzedAt: string;
    provider: AIProvider;
  };
}

export interface CrawlingStats {
  totalConfigs: number;
  activeConfigs: number;
  totalPostsCollected: number;
  totalPostsAnalyzed: number;
  postsToday: number;
  errorCount: number;
  lastCrawlTime?: string;
  platformStats: {
    platform: Platform;
    posts: number;
    lastCrawl?: string;
  }[];
}

// ============ Storage ============

const STORAGE_KEYS = {
  CONFIGS: "snsmon_crawling_configs",
  JOBS: "snsmon_crawling_jobs",
  POSTS: "snsmon_crawled_posts",
  STATS: "snsmon_crawling_stats",
};

// ============ Configuration Management ============

export function getCrawlingConfigs(): CrawlingConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIGS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCrawlingConfigs(configs: CrawlingConfig[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(configs));
}

export function addCrawlingConfig(
  config: Omit<CrawlingConfig, "id" | "createdAt" | "updatedAt">
): CrawlingConfig {
  const newConfig: CrawlingConfig = {
    ...config,
    id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const configs = getCrawlingConfigs();
  configs.push(newConfig);
  saveCrawlingConfigs(configs);

  return newConfig;
}

export function updateCrawlingConfig(
  id: string,
  updates: Partial<CrawlingConfig>
): CrawlingConfig | null {
  const configs = getCrawlingConfigs();
  const index = configs.findIndex((c) => c.id === id);
  if (index === -1) return null;

  configs[index] = {
    ...configs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveCrawlingConfigs(configs);
  return configs[index];
}

export function deleteCrawlingConfig(id: string): boolean {
  const configs = getCrawlingConfigs();
  const filtered = configs.filter((c) => c.id !== id);
  if (filtered.length === configs.length) return false;
  saveCrawlingConfigs(filtered);
  return true;
}

// ============ Job Management ============

export function getCrawlingJobs(): CrawlingJob[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCrawlingJobs(jobs: CrawlingJob[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
}

export function getJobForConfig(configId: string): CrawlingJob | null {
  const jobs = getCrawlingJobs();
  return jobs.find((j) => j.configId === configId) || null;
}

// ============ Posts Management ============

export function getCrawledPosts(limit = 100, offset = 0): CrawledPost[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    const posts: CrawledPost[] = stored ? JSON.parse(stored) : [];
    return posts.slice(offset, offset + limit);
  } catch {
    return [];
  }
}

export function saveCrawledPosts(posts: CrawledPost[]): void {
  if (typeof window === "undefined") return;
  // Keep only last 1000 posts to avoid localStorage limits
  const trimmed = posts.slice(-1000);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(trimmed));
}

export function addCrawledPost(post: CrawledPost): void {
  const posts = getCrawledPosts(1000);
  posts.push(post);
  saveCrawledPosts(posts);
}

// ============ Stats ============

export function getCrawlingStats(): CrawlingStats {
  const configs = getCrawlingConfigs();
  const posts = getCrawledPosts(1000);
  const jobs = getCrawlingJobs();

  const today = new Date().toISOString().split("T")[0];
  const postsToday = posts.filter((p) => p.collectedAt.startsWith(today)).length;

  const platformStats: CrawlingStats["platformStats"] = [];
  const platforms: Platform[] = ["twitter", "instagram", "facebook", "tiktok", "telegram", "youtube"];

  for (const platform of platforms) {
    const platformPosts = posts.filter((p) => p.platform === platform);
    const lastPost = platformPosts[platformPosts.length - 1];
    platformStats.push({
      platform,
      posts: platformPosts.length,
      lastCrawl: lastPost?.collectedAt,
    });
  }

  const errorCount = jobs.reduce((sum, j) => sum + j.errors.length, 0);
  const lastJob = jobs.filter((j) => j.completedAt).sort((a, b) =>
    (b.completedAt || "").localeCompare(a.completedAt || "")
  )[0];

  return {
    totalConfigs: configs.length,
    activeConfigs: configs.filter((c) => c.isActive).length,
    totalPostsCollected: posts.length,
    totalPostsAnalyzed: posts.filter((p) => p.analysis).length,
    postsToday,
    errorCount,
    lastCrawlTime: lastJob?.completedAt,
    platformStats,
  };
}

// ============ Crawling Simulation ============

// Simulated data for demo purposes
const SAMPLE_AUTHORS = [
  { id: "1", name: "Najwa Shihab", username: "najwashihab", followers: 15200000 },
  { id: "2", name: "Erick Thohir", username: "eikikodir", followers: 8900000 },
  { id: "3", name: "Ridwan Kamil", username: "ridwankamil", followers: 12500000 },
  { id: "4", name: "Ganjar Pranowo", username: "gaborranowo", followers: 7600000 },
  { id: "5", name: "Berita Jakarta", username: "beritajakarta", followers: 500000 },
  { id: "6", name: "Info Surabaya", username: "infosurabaya", followers: 320000 },
  { id: "7", name: "Warga Bandung", username: "wargabandung", followers: 180000 },
  { id: "8", name: "News Update ID", username: "newsupdateid", followers: 420000 },
];

const SAMPLE_CONTENTS = [
  { text: "Situasi terkini di Jakarta, masyarakat diminta tetap tenang.", sentiment: "neutral" },
  { text: "Pemerintah mengumumkan program bantuan sosial baru untuk masyarakat.", sentiment: "positive" },
  { text: "Kerusuhan terjadi di beberapa titik, keamanan diperketat.", sentiment: "negative" },
  { text: "Ekonomi Indonesia menunjukkan tanda-tanda pemulihan yang positif.", sentiment: "positive" },
  { text: "Banjir melanda beberapa wilayah di Jawa Timur.", sentiment: "negative" },
  { text: "Festival budaya Indonesia sukses digelar dengan antusias.", sentiment: "positive" },
  { text: "Kasus korupsi baru terungkap, publik marah.", sentiment: "negative" },
  { text: "Infrastruktur baru diresmikan, warga menyambut positif.", sentiment: "positive" },
];

const SAMPLE_HASHTAGS = [
  "#Indonesia", "#Jakarta", "#BeritaTerkini", "#Pemerintah",
  "#Ekonomi", "#Sosial", "#Politik", "#Masyarakat",
];

const REGIONS = [
  "DKI Jakarta", "East Java", "West Java", "Central Java",
  "North Sumatra", "Bali", "South Sulawesi", "West Kalimantan",
];

function generateSimulatedPost(platform: Platform, keywords: string[]): CrawledPost {
  const author = SAMPLE_AUTHORS[Math.floor(Math.random() * SAMPLE_AUTHORS.length)];
  const content = SAMPLE_CONTENTS[Math.floor(Math.random() * SAMPLE_CONTENTS.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

  // Add keywords to content if any match
  let finalContent = content.text;
  if (keywords.length > 0) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    if (!finalContent.toLowerCase().includes(keyword.toLowerCase())) {
      finalContent = `${finalContent} #${keyword}`;
    }
  }

  const hashtags = [
    SAMPLE_HASHTAGS[Math.floor(Math.random() * SAMPLE_HASHTAGS.length)],
    SAMPLE_HASHTAGS[Math.floor(Math.random() * SAMPLE_HASHTAGS.length)],
  ].filter((v, i, a) => a.indexOf(v) === i);

  return {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    platform,
    postId: `${platform}-${Date.now()}`,
    authorId: author.id,
    authorName: author.name,
    authorUsername: author.username,
    authorFollowers: author.followers,
    content: finalContent,
    contentType: "text",
    language: "id",
    hashtags,
    mentions: [],
    url: `https://${platform}.com/${author.username}/status/${Date.now()}`,
    publishedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    collectedAt: new Date().toISOString(),
    engagement: {
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 100000),
    },
    location: {
      region,
    },
  };
}

// ============ AI Analysis ============

/**
 * Analyze post with AI using automatic fallback (OpenAI > Gemini > Claude)
 * If preferredProvider is specified, it will be tried first before falling back
 */
async function analyzePostWithAI(post: CrawledPost, preferredProvider?: AIProvider): Promise<CrawledPost> {
  // Try real AI analysis with automatic fallback
  try {
    // performAnalysis now automatically handles fallback: OpenAI > Gemini > Claude
    const result = await performAnalysis({
      type: "sentiment",
      content: post.content,
      language: "id",
    }, preferredProvider);

    if (result.success && result.result) {
      const parsed = typeof result.result === "string"
        ? JSON.parse(result.result)
        : result.result;

      post.analysis = {
        sentiment: {
          score: parsed.sentimentScore || parsed.sentiment_score || 0,
          label: parsed.sentimentCategory || parsed.sentiment_category || "neutral",
          confidence: parsed.confidence || parsed.confidenceLevel || 0.8,
        },
        emotions: parsed.emotions,
        crisisIndicators: parsed.crisisIndicators,
        isSpam: parsed.isSpam || false,
        isBotLikely: parsed.isBotLikely || false,
        analyzedAt: new Date().toISOString(),
        provider: result.provider,
      };

      // Log fallback information if used
      if (result.fallbackUsed) {
        console.log(`[Crawling] AI analysis used fallback. Attempted: ${result.attemptedProviders?.join(" > ")}`);
      }

      return post;
    }
  } catch (error) {
    console.error("AI analysis failed:", error);
  }

  // Fallback to simulated analysis if all AI providers fail
  console.log("[Crawling] All AI providers failed, using simulated analysis");
  const sentimentMap: Record<string, { score: number; label: "positive" | "negative" | "neutral" }> = {
    positive: { score: 0.7 + Math.random() * 0.3, label: "positive" },
    negative: { score: -(0.7 + Math.random() * 0.3), label: "negative" },
    neutral: { score: -0.2 + Math.random() * 0.4, label: "neutral" },
  };

  const detectedSentiment = post.content.includes("kerusuhan") || post.content.includes("korupsi")
    ? "negative"
    : post.content.includes("sukses") || post.content.includes("positif")
    ? "positive"
    : "neutral";

  post.analysis = {
    sentiment: {
      ...sentimentMap[detectedSentiment],
      confidence: 0.8 + Math.random() * 0.2,
    },
    emotions: [
      { emotion: detectedSentiment === "negative" ? "anger" : "joy", score: Math.random() * 100 },
      { emotion: "anticipation", score: Math.random() * 50 },
    ],
    crisisIndicators: {
      score: detectedSentiment === "negative" ? 50 + Math.random() * 50 : Math.random() * 30,
      keywords: post.hashtags,
    },
    isSpam: Math.random() < 0.05,
    isBotLikely: Math.random() < 0.1,
    analyzedAt: new Date().toISOString(),
    provider: "openai", // Default for simulation
  };

  return post;
}

// ============ Crawling Execution ============

export interface CrawlingCallbacks {
  onPostCollected?: (post: CrawledPost) => void;
  onPostAnalyzed?: (post: CrawledPost) => void;
  onProgress?: (collected: number, analyzed: number) => void;
  onError?: (error: string) => void;
  onComplete?: (job: CrawlingJob) => void;
}

let activeIntervals: Map<string, NodeJS.Timeout> = new Map();

export async function startCrawling(
  config: CrawlingConfig,
  callbacks?: CrawlingCallbacks
): Promise<CrawlingJob> {
  // Create or update job
  const jobs = getCrawlingJobs();
  let job = jobs.find((j) => j.configId === config.id);

  if (!job) {
    job = {
      id: `job-${Date.now()}`,
      configId: config.id,
      status: "idle",
      itemsCollected: 0,
      itemsAnalyzed: 0,
      errors: [],
    };
    jobs.push(job);
  }

  job.status = "running";
  job.startedAt = new Date().toISOString();
  saveCrawlingJobs(jobs);

  const executeCrawl = async () => {
    try {
      // Simulate crawling based on config
      const postsToCollect = config.mode === "realtime" ? 5 : config.mode === "near_realtime" ? 10 : 20;

      for (let i = 0; i < postsToCollect; i++) {
        const post = generateSimulatedPost(config.platform, config.keywords);

        // Filter by region if specified
        if (config.regions.length > 0 && post.location) {
          if (!config.regions.includes(post.location.region)) {
            continue;
          }
        }

        addCrawledPost(post);
        job!.itemsCollected++;
        callbacks?.onPostCollected?.(post);

        // AI Analysis if enabled
        if (config.enableAIAnalysis) {
          const analyzedPost = await analyzePostWithAI(post, config.aiProvider);
          job!.itemsAnalyzed++;
          callbacks?.onPostAnalyzed?.(analyzedPost);

          // Update stored post with analysis
          const posts = getCrawledPosts(1000);
          const postIndex = posts.findIndex((p) => p.id === post.id);
          if (postIndex >= 0) {
            posts[postIndex] = analyzedPost;
            saveCrawledPosts(posts);
          }
        }

        callbacks?.onProgress?.(job!.itemsCollected, job!.itemsAnalyzed);

        // Small delay between posts
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Update job
      const updatedJobs = getCrawlingJobs();
      const jobIndex = updatedJobs.findIndex((j) => j.id === job!.id);
      if (jobIndex >= 0) {
        updatedJobs[jobIndex] = job!;
        saveCrawlingJobs(updatedJobs);
      }

    } catch (error) {
      job!.errors.push(String(error));
      job!.lastError = String(error);
      callbacks?.onError?.(String(error));
    }
  };

  // Execute based on mode
  if (config.mode === "realtime") {
    // Continuous execution every 10 seconds
    const interval = setInterval(executeCrawl, 10000);
    activeIntervals.set(config.id, interval);
    await executeCrawl(); // Initial execution
  } else if (config.mode === "near_realtime") {
    // Execute every 1-5 minutes
    const intervalMs = (config.interval || 1) * 60 * 1000;
    const interval = setInterval(executeCrawl, intervalMs);
    activeIntervals.set(config.id, interval);
    await executeCrawl();
  } else {
    // Batch mode - execute once and schedule next
    await executeCrawl();
    job.status = "idle";
    job.completedAt = new Date().toISOString();

    const updatedJobs = getCrawlingJobs();
    const jobIndex = updatedJobs.findIndex((j) => j.id === job!.id);
    if (jobIndex >= 0) {
      updatedJobs[jobIndex] = job!;
      saveCrawlingJobs(updatedJobs);
    }

    callbacks?.onComplete?.(job);
  }

  return job;
}

export function stopCrawling(configId: string): boolean {
  const interval = activeIntervals.get(configId);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(configId);

    // Update job status
    const jobs = getCrawlingJobs();
    const job = jobs.find((j) => j.configId === configId);
    if (job) {
      job.status = "paused";
      job.completedAt = new Date().toISOString();
      saveCrawlingJobs(jobs);
    }

    return true;
  }
  return false;
}

export function stopAllCrawling(): void {
  activeIntervals.forEach((interval, configId) => {
    clearInterval(interval);
  });
  activeIntervals.clear();

  // Update all jobs
  const jobs = getCrawlingJobs();
  jobs.forEach((job) => {
    if (job.status === "running") {
      job.status = "paused";
      job.completedAt = new Date().toISOString();
    }
  });
  saveCrawlingJobs(jobs);
}

export function isConfigRunning(configId: string): boolean {
  return activeIntervals.has(configId);
}

// ============ Demo Data Initialization ============

export function initializeDemoData(): void {
  const configs = getCrawlingConfigs();
  if (configs.length > 0) return; // Already initialized

  // Add sample configurations
  const demoConfigs: Omit<CrawlingConfig, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Twitter Crisis Monitor",
      platform: "twitter",
      mode: "realtime",
      isActive: true,
      keywords: ["kerusuhan", "demo", "protes", "banjir"],
      regions: ["DKI Jakarta", "East Java", "West Java"],
      accounts: [],
      enableAIAnalysis: true,
      aiProvider: "openai",
    },
    {
      name: "Instagram Brand Monitor",
      platform: "instagram",
      mode: "near_realtime",
      isActive: true,
      interval: 5,
      keywords: ["pemerintah", "kebijakan"],
      regions: [],
      accounts: [],
      enableAIAnalysis: true,
    },
    {
      name: "TikTok Trend Batch",
      platform: "tiktok",
      mode: "batch",
      isActive: false,
      interval: 60,
      keywords: ["viral", "trending"],
      regions: [],
      accounts: [],
      enableAIAnalysis: false,
    },
  ];

  demoConfigs.forEach(addCrawlingConfig);
}
