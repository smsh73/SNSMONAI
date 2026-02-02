"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SentimentBadge, getSentimentFromScore } from "./sentiment-badge";
import { cn } from "@/lib/utils";

type Platform =
  | "twitter"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "telegram"
  | "whatsapp"
  | "line";

interface MentionItemProps {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  platform: Platform;
  content: string;
  timestamp: string;
  sentimentScore: number;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    retweets?: number;
  };
  className?: string;
  onClick?: () => void;
}

const platformLabels: Record<Platform, string> = {
  twitter: "X",
  instagram: "IG",
  facebook: "FB",
  tiktok: "TT",
  youtube: "YT",
  telegram: "TG",
  whatsapp: "WA",
  line: "LN",
};

export function MentionItem({
  authorName,
  authorUsername,
  authorAvatar,
  platform,
  content,
  timestamp,
  sentimentScore,
  engagement,
  className,
  onClick,
}: MentionItemProps) {
  const sentiment = getSentimentFromScore(sentimentScore);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalEngagement = (engagement?.likes || 0) + (engagement?.comments || 0) +
    (engagement?.shares || 0) + (engagement?.retweets || 0);

  return (
    <div
      className={cn(
        "p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={authorAvatar} alt={authorName} />
          <AvatarFallback className="text-xs font-medium bg-muted">
            {authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground truncate">{authorName}</span>
            <span className="text-muted-foreground">@{authorUsername}</span>
            <span className="text-muted-foreground">·</span>
            <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium text-[10px]">
              {platformLabels[platform]}
            </span>
            <span className="text-muted-foreground">{timestamp}</span>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2">
            {content}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {engagement?.likes !== undefined && (
                <span>{formatNumber(engagement.likes)} likes</span>
              )}
              {engagement?.comments !== undefined && (
                <span>{formatNumber(engagement.comments)} comments</span>
              )}
              {engagement?.retweets !== undefined && (
                <span>{formatNumber(engagement.retweets)} RT</span>
              )}
              {engagement?.shares !== undefined && (
                <span>{formatNumber(engagement.shares)} shares</span>
              )}
            </div>
            <SentimentBadge sentiment={sentiment} score={sentimentScore} showScore />
          </div>
        </div>
      </div>
    </div>
  );
}
