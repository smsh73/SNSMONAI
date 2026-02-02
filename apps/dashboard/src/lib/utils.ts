import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with abbreviations (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

/**
 * Format percentage change with + or - sign
 */
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format sentiment score to readable label
 */
export function formatSentiment(score: number): {
  label: string;
  color: string;
} {
  if (score >= 0.3) {
    return { label: "Positive", color: "text-sentiment-positive" };
  }
  if (score <= -0.3) {
    return { label: "Negative", color: "text-sentiment-negative" };
  }
  return { label: "Neutral", color: "text-sentiment-neutral" };
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return then.toLocaleDateString();
}

/**
 * Get platform icon name
 */
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: "twitter",
    instagram: "instagram",
    facebook: "facebook",
    tiktok: "music",
    telegram: "send",
    line: "message-circle",
    whatsapp: "message-circle",
    youtube: "youtube",
  };
  return icons[platform.toLowerCase()] || "globe";
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "text-severity-critical",
    high: "text-severity-high",
    medium: "text-severity-medium",
    low: "text-severity-low",
  };
  return colors[severity.toLowerCase()] || "text-gray-500";
}

/**
 * Get severity background class
 */
export function getSeverityBg(severity: string): string {
  const colors: Record<string, string> = {
    critical: "bg-severity-critical/10",
    high: "bg-severity-high/10",
    medium: "bg-severity-medium/10",
    low: "bg-severity-low/10",
  };
  return colors[severity.toLowerCase()] || "bg-gray-500/10";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
