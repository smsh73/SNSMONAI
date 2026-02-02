"use client";

import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { AlertTriangle, AlertOctagon, Info, CheckCircle, X, MapPin, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type CrisisAlertSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface CrisisAlert {
  id: string;
  title: string;
  description: string;
  severity: CrisisAlertSeverity;
  region?: string;
  keyword?: string;
  mentionCount?: number;
  changePercent?: number;
  timestamp: Date;
  source?: string;
}

interface CrisisAlertContextType {
  alerts: CrisisAlert[];
  addAlert: (alert: Omit<CrisisAlert, "id" | "timestamp">) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  simulateAlert: () => void;
}

const CrisisAlertContext = createContext<CrisisAlertContextType | undefined>(undefined);

// Sample crisis alerts for simulation
const sampleAlerts: Omit<CrisisAlert, "id" | "timestamp">[] = [
  {
    title: "Critical: Kerusuhan Spike Detected",
    description: "Unusual spike in 'kerusuhan' keyword mentions in DKI Jakarta region",
    severity: "critical",
    region: "DKI Jakarta",
    keyword: "kerusuhan",
    mentionCount: 2341,
    changePercent: 450,
    source: "X (Twitter)",
  },
  {
    title: "High: Negative Sentiment Surge",
    description: "Negative sentiment dropped below threshold in Surabaya",
    severity: "high",
    region: "East Java",
    mentionCount: 892,
    changePercent: -40,
    source: "Multiple Platforms",
  },
  {
    title: "Medium: Unusual Activity Pattern",
    description: "Coordinated activity detected - possible bot involvement",
    severity: "medium",
    region: "Bandung",
    mentionCount: 234,
    changePercent: 125,
    source: "Instagram",
  },
  {
    title: "Trending: Korupsi keyword spike",
    description: "The keyword 'korupsi' is trending with increased negative sentiment",
    severity: "high",
    keyword: "korupsi",
    mentionCount: 1542,
    changePercent: 280,
    source: "X (Twitter)",
  },
  {
    title: "Info: New influencer mention",
    description: "High-profile account mentioned monitoring target",
    severity: "info",
    mentionCount: 1,
    source: "X (Twitter)",
  },
];

const getSeverityConfig = (severity: CrisisAlertSeverity) => {
  switch (severity) {
    case "critical":
      return {
        icon: AlertOctagon,
        bgColor: "bg-red-500",
        borderColor: "border-red-500",
        textColor: "text-red-500",
        badgeColor: "bg-red-500/10 text-red-600 border-red-500/20",
        pulseColor: "animate-pulse",
      };
    case "high":
      return {
        icon: AlertTriangle,
        bgColor: "bg-orange-500",
        borderColor: "border-orange-500",
        textColor: "text-orange-500",
        badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        pulseColor: "",
      };
    case "medium":
      return {
        icon: AlertTriangle,
        bgColor: "bg-yellow-500",
        borderColor: "border-yellow-500",
        textColor: "text-yellow-500",
        badgeColor: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        pulseColor: "",
      };
    case "low":
      return {
        icon: Info,
        bgColor: "bg-blue-500",
        borderColor: "border-blue-500",
        textColor: "text-blue-500",
        badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        pulseColor: "",
      };
    case "info":
    default:
      return {
        icon: CheckCircle,
        bgColor: "bg-green-500",
        borderColor: "border-green-500",
        textColor: "text-green-500",
        badgeColor: "bg-green-500/10 text-green-600 border-green-500/20",
        pulseColor: "",
      };
  }
};

interface CrisisAlertToastContentProps {
  alert: CrisisAlert;
  onDismiss: () => void;
}

function CrisisAlertToastContent({ alert, onDismiss }: CrisisAlertToastContentProps) {
  const config = getSeverityConfig(alert.severity);
  const Icon = config.icon;

  return (
    <div className={cn("w-full max-w-md p-4 rounded-lg border-l-4", config.borderColor, "bg-background shadow-lg")}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", config.bgColor, config.pulseColor)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm truncate">{alert.title}</h4>
            <button
              onClick={onDismiss}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {alert.region && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {alert.region}
              </div>
            )}
            {alert.mentionCount && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {alert.mentionCount.toLocaleString()} mentions
              </div>
            )}
            {alert.changePercent && (
              <span
                className={cn(
                  "text-xs font-medium",
                  alert.changePercent > 0 ? "text-red-500" : "text-green-500"
                )}
              >
                {alert.changePercent > 0 ? "+" : ""}
                {alert.changePercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className={cn("text-xs px-2 py-0.5 rounded-full border", config.badgeColor)}>
              {alert.severity.toUpperCase()}
            </span>
            {alert.source && (
              <span className="text-xs text-muted-foreground">
                via {alert.source}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrisisAlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);

  const addAlert = useCallback((alertData: Omit<CrisisAlert, "id" | "timestamp">) => {
    const newAlert: CrisisAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts

    // Show toast notification
    const duration = alertData.severity === "critical" ? 10000 : alertData.severity === "high" ? 8000 : 5000;

    toast.custom(
      (t) => (
        <CrisisAlertToastContent
          alert={newAlert}
          onDismiss={() => toast.dismiss(t)}
        />
      ),
      {
        duration,
        position: "top-right",
      }
    );

    // Play sound for critical alerts (if supported)
    if (alertData.severity === "critical" && typeof window !== "undefined") {
      try {
        const audio = new Audio("/sounds/alert.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {}); // Ignore if autoplay is blocked
      } catch {
        // Audio not supported
      }
    }
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const simulateAlert = useCallback(() => {
    const randomAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    addAlert(randomAlert);
  }, [addAlert]);

  return (
    <CrisisAlertContext.Provider
      value={{ alerts, addAlert, removeAlert, clearAlerts, simulateAlert }}
    >
      {children}
    </CrisisAlertContext.Provider>
  );
}

export function useCrisisAlert() {
  const context = useContext(CrisisAlertContext);
  if (context === undefined) {
    throw new Error("useCrisisAlert must be used within a CrisisAlertProvider");
  }
  return context;
}

// Demo button component for testing
export function CrisisAlertDemoButton() {
  const { simulateAlert } = useCrisisAlert();

  return (
    <button
      onClick={simulateAlert}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      Simulate Alert
    </button>
  );
}
