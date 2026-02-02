"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SentimentType = "positive" | "negative" | "neutral";

interface SentimentBadgeProps {
  sentiment: SentimentType;
  score?: number;
  showScore?: boolean;
  className?: string;
}

const sentimentConfig: Record<
  SentimentType,
  { color: string; label: string }
> = {
  positive: {
    color: "bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/30",
    label: "Positive",
  },
  negative: {
    color: "bg-sentiment-negative/10 text-sentiment-negative border-sentiment-negative/30",
    label: "Negative",
  },
  neutral: {
    color: "bg-sentiment-neutral/10 text-sentiment-neutral border-sentiment-neutral/30",
    label: "Neutral",
  },
};

export function SentimentBadge({
  sentiment,
  score,
  showScore = false,
  className,
}: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];

  return (
    <Badge
      variant="outline"
      className={cn("font-semibold text-xs px-2.5 py-1", config.color, className)}
    >
      {config.label}
      {showScore && score !== undefined && (
        <span className="ml-1.5 opacity-75">({score.toFixed(2)})</span>
      )}
    </Badge>
  );
}

export function getSentimentFromScore(score: number): SentimentType {
  if (score >= 0.3) return "positive";
  if (score <= -0.3) return "negative";
  return "neutral";
}
