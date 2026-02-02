"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  RefreshCw,
  Key,
  Loader2,
  TestTube,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  type AIApiKey,
  type AIProvider,
  getStoredApiKeys,
  addApiKey,
  updateApiKey,
  deleteApiKey,
  getProviderConfig,
  testApiKey,
  validateApiKeyFormat,
  getFallbackChainStatus,
  AI_FALLBACK_ORDER,
} from "@/lib/ai-service";

interface LegacyApiKey {
  id: string;
  name: string;
  provider: string;
  type: "social" | "third_party";
  status: "active" | "expired" | "invalid";
  lastValidated: string;
  usage: {
    current: number;
    limit: number;
  };
  maskedKey: string;
}

// Mock data for social and third party APIs (these would typically be stored separately)
const socialApiKeys: LegacyApiKey[] = [
  {
    id: "social-1",
    name: "X/Twitter API v2",
    provider: "twitter",
    type: "social",
    status: "active",
    lastValidated: "2024-01-28 14:00",
    usage: { current: 450000, limit: 500000 },
    maskedKey: "AAAA...xxxxBBBB",
  },
  {
    id: "social-2",
    name: "Meta Graph API",
    provider: "meta",
    type: "social",
    status: "expired",
    lastValidated: "2024-01-15 10:00",
    usage: { current: 0, limit: 0 },
    maskedKey: "EAAx...xxxx",
  },
  {
    id: "social-3",
    name: "TikTok API",
    provider: "tiktok",
    type: "social",
    status: "invalid",
    lastValidated: "2024-01-20 08:00",
    usage: { current: 0, limit: 0 },
    maskedKey: "tt-...xxxx",
  },
];

const thirdPartyApiKeys: LegacyApiKey[] = [
  {
    id: "tp-1",
    name: "Dataxet:Sonar",
    provider: "dataxet",
    type: "third_party",
    status: "active",
    lastValidated: "2024-01-28 10:00",
    usage: { current: 25000, limit: 50000 },
    maskedKey: "dxs-...xxxx",
  },
  {
    id: "tp-2",
    name: "MediaWave Indonesia",
    provider: "mediawave",
    type: "third_party",
    status: "active",
    lastValidated: "2024-01-28 09:00",
    usage: { current: 18000, limit: 30000 },
    maskedKey: "mw-...xxxx",
  },
];

const AI_PROVIDERS: { value: AIProvider; label: string; description: string }[] = [
  { value: "openai", label: "OpenAI GPT-4", description: "GPT-4, GPT-4 Turbo, GPT-3.5 Turbo" },
  { value: "anthropic", label: "Claude (Anthropic)", description: "Claude 3 Opus, Sonnet, Haiku" },
  { value: "google", label: "Google Gemini", description: "Gemini Pro, Gemini Pro Vision" },
  { value: "perplexity", label: "Perplexity AI", description: "PPLX Online, PPLX Chat models" },
];

export default function ApiKeysPage() {
  const [aiKeys, setAiKeys] = useState<AIApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<AIApiKey | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Form state
  const [formProvider, setFormProvider] = useState<AIProvider>("openai");
  const [formName, setFormName] = useState("");
  const [formApiKey, setFormApiKey] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Load API keys from storage
  useEffect(() => {
    setAiKeys(getStoredApiKeys());
  }, []);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskApiKey = (key: string): string => {
    if (key.length <= 10) return "****";
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  const resetForm = () => {
    setFormProvider("openai");
    setFormName("");
    setFormApiKey("");
    setFormIsActive(true);
  };

  const handleAddKey = () => {
    if (!formApiKey || !formName) return;

    const newKey = addApiKey({
      provider: formProvider,
      name: formName,
      apiKey: formApiKey,
      isActive: formIsActive,
    });

    setAiKeys([...aiKeys, newKey]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditKey = () => {
    if (!editingKey || !formApiKey || !formName) return;

    const updated = updateApiKey(editingKey.id, {
      provider: formProvider,
      name: formName,
      apiKey: formApiKey,
      isActive: formIsActive,
    });

    if (updated) {
      setAiKeys(aiKeys.map(k => k.id === updated.id ? updated : k));
    }

    setEditingKey(null);
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    deleteApiKey(id);
    setAiKeys(aiKeys.filter(k => k.id !== id));
  };

  const handleTestKey = async (key: AIApiKey) => {
    setIsTesting(key.id);
    setTestResult(null);

    const result = await testApiKey(key.provider, key.apiKey);
    setTestResult({ id: key.id, ...result });
    setIsTesting(null);

    // Auto-clear result after 5 seconds
    setTimeout(() => {
      setTestResult(null);
    }, 5000);
  };

  const openEditDialog = (key: AIApiKey) => {
    setEditingKey(key);
    setFormProvider(key.provider);
    setFormName(key.name);
    setFormApiKey(key.apiKey);
    setFormIsActive(key.isActive);
    setIsEditDialogOpen(true);
  };

  const toggleKeyActive = (key: AIApiKey) => {
    const updated = updateApiKey(key.id, { isActive: !key.isActive });
    if (updated) {
      setAiKeys(aiKeys.map(k => k.id === updated.id ? updated : k));
    }
  };

  const renderAIApiKeyCard = (key: AIApiKey) => {
    const config = getProviderConfig(key.provider);

    return (
      <Card key={key.id} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white text-sm"
                style={{ backgroundColor: config?.color || "#666" }}
              >
                {config?.icon || "??"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{key.name}</h3>
                  <Badge
                    variant="outline"
                    className={key.isActive
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-muted text-muted-foreground"
                    }
                  >
                    {key.isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                  {testResult?.id === key.id && (
                    <Badge
                      variant="outline"
                      className={testResult.success
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {testResult.success ? "Valid" : "Invalid"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {config?.displayName || key.provider}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    <span className="font-mono">
                      {showKeys[key.id] ? key.apiKey : maskApiKey(key.apiKey)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {showKeys[key.id] ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Added: {new Date(key.createdAt).toLocaleDateString()}</span>
                  {key.lastUsed && (
                    <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                  )}
                  <span>Uses: {key.usageCount}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Switch
                checked={key.isActive}
                onCheckedChange={() => toggleKeyActive(key)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleTestKey(key)}
                disabled={isTesting === key.id}
              >
                {isTesting === key.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openEditDialog(key)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{key.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteKey(key.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLegacyApiKeyCard = (key: LegacyApiKey) => (
    <Card key={key.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-sm">
              {key.provider === "twitter" ? "X" :
               key.provider === "meta" ? "FB" :
               key.provider === "tiktok" ? "TT" :
               key.provider === "dataxet" ? "DX" :
               key.provider === "mediawave" ? "MW" : "??"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{key.name}</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    key.status === "active" && "bg-success/10 text-success border-success/30",
                    key.status === "expired" && "bg-severity-medium/10 text-severity-medium border-severity-medium/30",
                    key.status === "invalid" && "bg-destructive/10 text-destructive border-destructive/30"
                  )}
                >
                  {key.status === "active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  <span className="capitalize">{key.status}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" />
                  <span className="font-mono">{key.maskedKey}</span>
                </div>
              </div>
              {key.status === "active" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">
                      {key.usage.current.toLocaleString()} / {key.usage.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        key.usage.current / key.usage.limit > 0.9 ? "bg-destructive" :
                        key.usage.current / key.usage.limit > 0.7 ? "bg-severity-medium" : "bg-primary"
                      )}
                      style={{ width: `${(key.usage.current / key.usage.limit) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Last validated: {key.lastValidated}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Form content as inline JSX to prevent re-mount on state changes
  const formContent = (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>AI Provider</Label>
        <Select value={formProvider} onValueChange={(v: AIProvider) => setFormProvider(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_PROVIDERS.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                <div>
                  <div className="font-medium">{provider.label}</div>
                  <div className="text-xs text-muted-foreground">{provider.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Input
          placeholder="e.g., Production API Key"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>API Key</Label>
        <Input
          type="password"
          placeholder="Enter your API key"
          value={formApiKey}
          onChange={(e) => setFormApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {formProvider === "openai" && "Starts with sk-"}
          {formProvider === "anthropic" && "Starts with sk-ant-"}
          {formProvider === "google" && "Google AI API key"}
          {formProvider === "perplexity" && "Starts with pplx-"}
        </p>
      </div>
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Set as Active
        </Label>
        <Switch
          id="isActive"
          checked={formIsActive}
          onCheckedChange={setFormIsActive}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI APIs
              <Badge variant="secondary" className="ml-1">
                {aiKeys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              Social APIs
              <Badge variant="secondary" className="ml-1">
                {socialApiKeys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="third_party" className="gap-2">
              Third Party
              <Badge variant="secondary" className="ml-1">
                {thirdPartyApiKeys.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add AI API Key</DialogTitle>
                <DialogDescription>
                  Add a new API key for AI-powered analysis features.
                </DialogDescription>
              </DialogHeader>
              {formContent}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddKey} disabled={!formApiKey || !formName}>
                  Add API Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Service APIs</CardTitle>
              <CardDescription>
                Configure API keys for OpenAI, Claude, Gemini, and Perplexity for sentiment analysis, crisis detection, and natural language processing.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Fallback Chain Status */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                AI Fallback Chain
              </CardTitle>
              <CardDescription>
                When an AI provider fails, the system automatically tries the next available provider.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {getFallbackChainStatus().map((status, index) => {
                  const config = getProviderConfig(status.provider);
                  return (
                    <div key={status.provider} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                          status.available
                            ? "bg-background border-success/50"
                            : "bg-muted/50 border-muted text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
                            status.available ? "text-white" : "bg-muted-foreground/20 text-muted-foreground"
                          )}
                          style={{ backgroundColor: status.available ? config?.color : undefined }}
                        >
                          {config?.icon}
                        </span>
                        <span className="font-medium text-sm">{status.name}</span>
                        {status.available ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {index < AI_FALLBACK_ORDER.length - 1 && (
                        <span className="text-muted-foreground font-medium">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Priority order: OpenAI (1st) → Gemini (2nd) → Claude (3rd). Add API keys to enable each provider.
              </p>
            </CardContent>
          </Card>

          {aiKeys.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No AI API Keys Configured</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your first AI API key to enable sentiment analysis, crisis detection, and chatbot features.
                </p>
                <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First API Key
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {aiKeys.map(renderAIApiKeyCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media APIs</CardTitle>
              <CardDescription>
                Manage API credentials for collecting data from social media platforms.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {socialApiKeys.map(renderLegacyApiKeyCard)}
          </div>
        </TabsContent>

        <TabsContent value="third_party" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Third Party Services</CardTitle>
              <CardDescription>
                Configure API keys for partner services like Dataxet and MediaWave for Indonesian market data.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {thirdPartyApiKeys.map(renderLegacyApiKeyCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update the API key configuration.
            </DialogDescription>
          </DialogHeader>
          {formContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingKey(null); }}>
              Cancel
            </Button>
            <Button onClick={handleEditKey} disabled={!formApiKey || !formName}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
