"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Timer,
  Database,
  Brain,
  AlertTriangle,
  Settings,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import {
  getCrawlingConfigs,
  addCrawlingConfig,
  updateCrawlingConfig,
  deleteCrawlingConfig,
  getCrawlingStats,
  getCrawlingJobs,
  startCrawling,
  stopCrawling,
  isConfigRunning,
  initializeDemoData,
  type CrawlingConfig,
  type CrawlingMode,
  type Platform,
  type CrawlingStats,
  type CrawlingJob,
} from "@/lib/crawling-service";
import { type AIProvider, getProviderConfig } from "@/lib/ai-service";

const PLATFORMS: { value: Platform; label: string; icon: React.ReactNode }[] = [
  { value: "twitter", label: "Twitter/X", icon: <Twitter className="h-4 w-4" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
  { value: "tiktok", label: "TikTok", icon: <span className="text-xs font-bold">TT</span> },
  { value: "telegram", label: "Telegram", icon: <span className="text-xs font-bold">TG</span> },
  { value: "youtube", label: "YouTube", icon: <span className="text-xs font-bold">YT</span> },
];

const REGIONS = [
  "DKI Jakarta",
  "East Java",
  "West Java",
  "Central Java",
  "North Sumatra",
  "Bali",
  "South Sulawesi",
  "West Kalimantan",
  "Yogyakarta",
  "Riau",
  "Lampung",
  "South Sumatra",
];

const AI_PROVIDERS: AIProvider[] = ["openai", "anthropic", "google", "perplexity"];

function getPlatformIcon(platform: Platform) {
  const found = PLATFORMS.find((p) => p.value === platform);
  return found?.icon || <Database className="h-4 w-4" />;
}

function getModeColor(mode: CrawlingMode) {
  switch (mode) {
    case "realtime":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    case "near_realtime":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "batch":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function SchedulesPage() {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<CrawlingConfig[]>([]);
  const [jobs, setJobs] = useState<CrawlingJob[]>([]);
  const [stats, setStats] = useState<CrawlingStats | null>(null);
  const [runningConfigs, setRunningConfigs] = useState<Set<string>>(new Set());

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<CrawlingConfig | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    platform: "twitter" as Platform,
    mode: "near_realtime" as CrawlingMode,
    interval: 5,
    keywords: "",
    regions: [] as string[],
    enableAIAnalysis: true,
    aiProvider: "openai" as AIProvider,
  });

  // Load data
  const loadData = useCallback(() => {
    initializeDemoData();
    const loadedConfigs = getCrawlingConfigs();
    setConfigs(loadedConfigs);
    setJobs(getCrawlingJobs());
    setStats(getCrawlingStats());

    // Check which configs are running
    const running = new Set<string>();
    loadedConfigs.forEach((config) => {
      if (isConfigRunning(config.id)) {
        running.add(config.id);
      }
    });
    setRunningConfigs(running);
  }, []);

  useEffect(() => {
    loadData();
    // Refresh stats every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle create config
  const handleCreateConfig = () => {
    const newConfig = addCrawlingConfig({
      name: formData.name,
      platform: formData.platform,
      mode: formData.mode,
      isActive: true,
      interval: formData.interval,
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      regions: formData.regions,
      accounts: [],
      enableAIAnalysis: formData.enableAIAnalysis,
      aiProvider: formData.enableAIAnalysis ? formData.aiProvider : undefined,
    });

    setConfigs([...configs, newConfig]);
    setIsCreateDialogOpen(false);
    resetForm();
    loadData();
  };

  // Handle update config
  const handleUpdateConfig = () => {
    if (!selectedConfig) return;

    const updated = updateCrawlingConfig(selectedConfig.id, {
      name: formData.name,
      platform: formData.platform,
      mode: formData.mode,
      interval: formData.interval,
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      regions: formData.regions,
      enableAIAnalysis: formData.enableAIAnalysis,
      aiProvider: formData.enableAIAnalysis ? formData.aiProvider : undefined,
    });

    if (updated) {
      setConfigs(configs.map((c) => (c.id === updated.id ? updated : c)));
    }
    setIsEditDialogOpen(false);
    setSelectedConfig(null);
    resetForm();
    loadData();
  };

  // Handle delete config
  const handleDeleteConfig = () => {
    if (!selectedConfig) return;

    // Stop if running
    if (runningConfigs.has(selectedConfig.id)) {
      stopCrawling(selectedConfig.id);
    }

    deleteCrawlingConfig(selectedConfig.id);
    setConfigs(configs.filter((c) => c.id !== selectedConfig.id));
    setIsDeleteDialogOpen(false);
    setSelectedConfig(null);
    loadData();
  };

  // Handle start/stop crawling
  const handleToggleCrawling = async (config: CrawlingConfig) => {
    if (runningConfigs.has(config.id)) {
      stopCrawling(config.id);
      setRunningConfigs((prev) => {
        const next = new Set(prev);
        next.delete(config.id);
        return next;
      });
    } else {
      await startCrawling(config, {
        onProgress: () => loadData(),
        onError: (error) => console.error("Crawling error:", error),
      });
      setRunningConfigs((prev) => new Set(prev).add(config.id));
    }
    loadData();
  };

  // Handle edit click
  const handleEditClick = (config: CrawlingConfig) => {
    setSelectedConfig(config);
    setFormData({
      name: config.name,
      platform: config.platform,
      mode: config.mode,
      interval: config.interval || 5,
      keywords: config.keywords.join(", "),
      regions: config.regions,
      enableAIAnalysis: config.enableAIAnalysis,
      aiProvider: config.aiProvider || "openai",
    });
    setIsEditDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      platform: "twitter",
      mode: "near_realtime",
      interval: 5,
      keywords: "",
      regions: [],
      enableAIAnalysis: true,
      aiProvider: "openai",
    });
  };

  // Get job for config
  const getJobForConfig = (configId: string) => {
    return jobs.find((j) => j.configId === configId);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats?.activeConfigs || 0}</p>
                <p className="text-xs text-muted-foreground">{t.admin.scheduler.activeCrawlers}</p>
              </div>
              <Zap className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats?.totalPostsCollected || 0}</p>
                <p className="text-xs text-muted-foreground">{t.admin.scheduler.totalCollected}</p>
              </div>
              <Database className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-500">{stats?.totalPostsAnalyzed || 0}</p>
                <p className="text-xs text-muted-foreground">{t.admin.scheduler.analyzedPosts}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{stats?.errorCount || 0}</p>
                <p className="text-xs text-muted-foreground">{t.admin.scheduler.errorsToday}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t.admin.scheduler.crawlingConfigs}</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.admin.scheduler.addSchedule}
        </Button>
      </div>

      {/* Config List */}
      <Card>
        <CardContent className="p-0">
          {configs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold">{t.admin.scheduler.noConfigs}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.admin.scheduler.createFirst}</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t.admin.scheduler.newConfig}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {configs.map((config) => {
                  const job = getJobForConfig(config.id);
                  const isRunning = runningConfigs.has(config.id);

                  return (
                    <div
                      key={config.id}
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                        !config.isActive && "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted">
                          {getPlatformIcon(config.platform)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{config.name}</h3>
                            <Badge variant="outline" className={getModeColor(config.mode)}>
                              {config.mode === "realtime"
                                ? t.admin.scheduler.realtime
                                : config.mode === "near_realtime"
                                ? t.admin.scheduler.nearRealtime
                                : t.admin.scheduler.batch}
                            </Badge>
                            {isRunning && (
                              <Badge className="bg-success text-success-foreground">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                {t.admin.scheduler.running}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {config.mode === "realtime"
                                ? `10 ${t.admin.scheduler.seconds}`
                                : `${config.interval || 5} ${t.admin.scheduler.minutes}`}
                            </span>
                            <span>
                              {t.admin.scheduler.keywords}: {config.keywords.length}
                            </span>
                            {config.enableAIAnalysis && (
                              <span className="flex items-center gap-1 text-purple-500">
                                <Brain className="h-3.5 w-3.5" />
                                {config.aiProvider?.toUpperCase() || "AI"}
                              </span>
                            )}
                          </div>
                          {job && (
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>
                                {t.admin.scheduler.collectedToday}: {job.itemsCollected}
                              </span>
                              {job.itemsAnalyzed > 0 && (
                                <span>
                                  {t.admin.scheduler.analyzedPosts}: {job.itemsAnalyzed}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Separator orientation="vertical" className="h-6" />
                        <Button
                          variant={isRunning ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleCrawling(config)}
                        >
                          {isRunning ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              {t.admin.scheduler.stop}
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              {t.admin.scheduler.start}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClick(config)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            setSelectedConfig(config);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Platform Stats */}
      {stats && stats.platformStats.some((p) => p.posts > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {stats.platformStats
                .filter((p) => p.posts > 0)
                .map((ps) => (
                  <div key={ps.platform} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    {getPlatformIcon(ps.platform)}
                    <div>
                      <p className="font-semibold capitalize">{ps.platform}</p>
                      <p className="text-xs text-muted-foreground">
                        {ps.posts} posts collected
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.admin.scheduler.newConfig}</DialogTitle>
            <DialogDescription>
              Configure a new SNS data crawling job
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.admin.scheduler.configName}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Twitter Crisis Monitor"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.selectPlatform}</Label>
              <Select
                value={formData.platform}
                onValueChange={(v) => setFormData({ ...formData, platform: v as Platform })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        {p.icon}
                        {p.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.selectMode}</Label>
              <Select
                value={formData.mode}
                onValueChange={(v) => setFormData({ ...formData, mode: v as CrawlingMode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-red-500" />
                      {t.admin.scheduler.realtime} (10s)
                    </div>
                  </SelectItem>
                  <SelectItem value="near_realtime">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-amber-500" />
                      {t.admin.scheduler.nearRealtime} (1-5 min)
                    </div>
                  </SelectItem>
                  <SelectItem value="batch">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {t.admin.scheduler.batch}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.mode !== "realtime" && (
              <div className="space-y-2">
                <Label htmlFor="interval">{t.admin.scheduler.interval} ({t.admin.scheduler.minutes})</Label>
                <Input
                  id="interval"
                  type="number"
                  min={1}
                  max={1440}
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) || 5 })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="keywords">{t.admin.scheduler.keywords}</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder={t.admin.scheduler.enterKeywords}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.regions}</Label>
              <Select
                value={formData.regions[0] || ""}
                onValueChange={(v) => {
                  if (!formData.regions.includes(v)) {
                    setFormData({ ...formData, regions: [...formData.regions, v] });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.admin.scheduler.selectRegions} />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.regions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.regions.map((r) => (
                    <Badge
                      key={r}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setFormData({ ...formData, regions: formData.regions.filter((x) => x !== r) })
                      }
                    >
                      {r} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableAI">{t.admin.scheduler.enableAI}</Label>
              <Switch
                id="enableAI"
                checked={formData.enableAIAnalysis}
                onCheckedChange={(c) => setFormData({ ...formData, enableAIAnalysis: c })}
              />
            </div>

            {formData.enableAIAnalysis && (
              <div className="space-y-2">
                <Label>{t.admin.scheduler.selectAIProvider}</Label>
                <Select
                  value={formData.aiProvider}
                  onValueChange={(v) => setFormData({ ...formData, aiProvider: v as AIProvider })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((p) => {
                      const config = getProviderConfig(p);
                      return (
                        <SelectItem key={p} value={p}>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: config?.color }}
                            >
                              {config?.icon}
                            </span>
                            {config?.displayName}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleCreateConfig} disabled={!formData.name}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.admin.scheduler.editConfig}</DialogTitle>
            <DialogDescription>
              Update crawling configuration settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t.admin.scheduler.configName}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.selectPlatform}</Label>
              <Select
                value={formData.platform}
                onValueChange={(v) => setFormData({ ...formData, platform: v as Platform })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        {p.icon}
                        {p.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.selectMode}</Label>
              <Select
                value={formData.mode}
                onValueChange={(v) => setFormData({ ...formData, mode: v as CrawlingMode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">
                    {t.admin.scheduler.realtime} (10s)
                  </SelectItem>
                  <SelectItem value="near_realtime">
                    {t.admin.scheduler.nearRealtime} (1-5 min)
                  </SelectItem>
                  <SelectItem value="batch">
                    {t.admin.scheduler.batch}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.mode !== "realtime" && (
              <div className="space-y-2">
                <Label htmlFor="edit-interval">{t.admin.scheduler.interval} ({t.admin.scheduler.minutes})</Label>
                <Input
                  id="edit-interval"
                  type="number"
                  min={1}
                  max={1440}
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) || 5 })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-keywords">{t.admin.scheduler.keywords}</Label>
              <Input
                id="edit-keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.admin.scheduler.regions}</Label>
              <Select
                value=""
                onValueChange={(v) => {
                  if (!formData.regions.includes(v)) {
                    setFormData({ ...formData, regions: [...formData.regions, v] });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.admin.scheduler.selectRegions} />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.regions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.regions.map((r) => (
                    <Badge
                      key={r}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setFormData({ ...formData, regions: formData.regions.filter((x) => x !== r) })
                      }
                    >
                      {r} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-enableAI">{t.admin.scheduler.enableAI}</Label>
              <Switch
                id="edit-enableAI"
                checked={formData.enableAIAnalysis}
                onCheckedChange={(c) => setFormData({ ...formData, enableAIAnalysis: c })}
              />
            </div>

            {formData.enableAIAnalysis && (
              <div className="space-y-2">
                <Label>{t.admin.scheduler.selectAIProvider}</Label>
                <Select
                  value={formData.aiProvider}
                  onValueChange={(v) => setFormData({ ...formData, aiProvider: v as AIProvider })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((p) => {
                      const config = getProviderConfig(p);
                      return (
                        <SelectItem key={p} value={p}>
                          {config?.displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleUpdateConfig} disabled={!formData.name}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin.scheduler.deleteConfig}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedConfig?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfig} className="bg-destructive text-destructive-foreground">
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
