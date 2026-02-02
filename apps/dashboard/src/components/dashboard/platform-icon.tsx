"use client";

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

interface PlatformIconProps {
  platform: Platform;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const platformConfig: Record<
  Platform,
  { color: string; bgColor: string; label: string }
> = {
  twitter: {
    color: "text-black dark:text-white",
    bgColor: "bg-black/10 dark:bg-white/10",
    label: "X",
  },
  instagram: {
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
    label: "IG",
  },
  facebook: {
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/10",
    label: "FB",
  },
  tiktok: {
    color: "text-black dark:text-white",
    bgColor: "bg-black/10 dark:bg-white/10",
    label: "TT",
  },
  youtube: {
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10",
    label: "YT",
  },
  telegram: {
    color: "text-[#26A5E4]",
    bgColor: "bg-[#26A5E4]/10",
    label: "TG",
  },
  whatsapp: {
    color: "text-[#25D366]",
    bgColor: "bg-[#25D366]/10",
    label: "WA",
  },
  line: {
    color: "text-[#00B900]",
    bgColor: "bg-[#00B900]/10",
    label: "LN",
  },
};

const sizeConfig = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function PlatformIcon({
  platform,
  className,
  size = "md",
}: PlatformIconProps) {
  const config = platformConfig[platform];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold",
        config.bgColor,
        config.color,
        sizeConfig[size],
        className
      )}
    >
      {config.label}
    </div>
  );
}

export function getPlatformColor(platform: Platform) {
  return platformConfig[platform]?.color || "text-muted-foreground";
}

export function getPlatformLabel(platform: Platform) {
  const labels: Record<Platform, string> = {
    twitter: "X (Twitter)",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    line: "LINE",
  };
  return labels[platform] || platform;
}
