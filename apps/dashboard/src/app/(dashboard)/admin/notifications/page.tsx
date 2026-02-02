"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Mail,
  MessageSquare,
  Webhook,
  Plus,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  Trash2,
  Edit,
  TestTube,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface EmailConfig {
  id: string;
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  recipients: string[];
  isActive: boolean;
  lastTest?: Date;
  lastTestStatus?: "success" | "failed";
}

interface SlackConfig {
  id: string;
  name: string;
  webhookUrl: string;
  channel: string;
  username: string;
  iconEmoji: string;
  isActive: boolean;
  lastTest?: Date;
  lastTestStatus?: "success" | "failed";
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: "POST" | "PUT";
  headers: Record<string, string>;
  authType: "none" | "bearer" | "basic" | "api_key";
  authValue?: string;
  isActive: boolean;
  lastTest?: Date;
  lastTestStatus?: "success" | "failed";
}

interface AlertRule {
  id: string;
  name: string;
  condition: {
    metric: string;
    operator: "gt" | "lt" | "eq" | "gte" | "lte";
    value: number;
  };
  channels: {
    email: string[];
    slack: string[];
    webhook: string[];
  };
  severity: "critical" | "high" | "medium" | "low";
  isActive: boolean;
}

// Mock data
const mockEmailConfigs: EmailConfig[] = [
  {
    id: "email-1",
    name: "Primary Alert Email",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    username: "alerts@kejaksaan.go.id",
    password: "********",
    fromEmail: "alerts@kejaksaan.go.id",
    fromName: "SNSMON-AI Alerts",
    recipients: ["admin@kejaksaan.go.id", "security@kejaksaan.go.id"],
    isActive: true,
    lastTest: new Date("2024-01-15T10:30:00"),
    lastTestStatus: "success",
  },
];

const mockSlackConfigs: SlackConfig[] = [
  {
    id: "slack-1",
    name: "Crisis Team Channel",
    webhookUrl: "https://hooks.slack.com/services/xxx/yyy/zzz",
    channel: "#crisis-alerts",
    username: "SNSMON-AI",
    iconEmoji: ":warning:",
    isActive: true,
    lastTest: new Date("2024-01-15T11:00:00"),
    lastTestStatus: "success",
  },
];

const mockWebhookConfigs: WebhookConfig[] = [
  {
    id: "webhook-1",
    name: "Internal Alert System",
    url: "https://internal-api.kejaksaan.go.id/alerts",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    authType: "bearer",
    authValue: "********",
    isActive: true,
    lastTest: new Date("2024-01-15T09:00:00"),
    lastTestStatus: "success",
  },
];

const mockAlertRules: AlertRule[] = [
  {
    id: "rule-1",
    name: "Critical Crisis Score",
    condition: { metric: "crisis_score", operator: "gte", value: 80 },
    channels: { email: ["email-1"], slack: ["slack-1"], webhook: ["webhook-1"] },
    severity: "critical",
    isActive: true,
  },
  {
    id: "rule-2",
    name: "High Negative Sentiment",
    condition: { metric: "sentiment_score", operator: "lte", value: -0.7 },
    channels: { email: ["email-1"], slack: ["slack-1"], webhook: [] },
    severity: "high",
    isActive: true,
  },
  {
    id: "rule-3",
    name: "Volume Spike Alert",
    condition: { metric: "volume_change", operator: "gte", value: 300 },
    channels: { email: [], slack: ["slack-1"], webhook: [] },
    severity: "medium",
    isActive: true,
  },
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>(mockEmailConfigs);
  const [slackConfigs, setSlackConfigs] = useState<SlackConfig[]>(mockSlackConfigs);
  const [webhookConfigs, setWebhookConfigs] = useState<WebhookConfig[]>(mockWebhookConfigs);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [isAddSlackOpen, setIsAddSlackOpen] = useState(false);
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);

  const getStatusBadge = (status?: "success" | "failed") => {
    if (!status) return null;
    return status === "success" ? (
      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        Connected
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
        <XCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: "bg-red-500/10 text-red-600 border-red-500/20",
      high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
    return (
      <Badge variant="outline" className={styles[severity as keyof typeof styles]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const handleTestConnection = (type: string, id: string) => {
    // Simulate test connection
    console.log(`Testing ${type} connection: ${id}`);
  };

  // Toggle email config
  const handleToggleEmail = (configId: string) => {
    setEmailConfigs(prev => prev.map(config =>
      config.id === configId ? { ...config, isActive: !config.isActive } : config
    ));
  };

  // Delete email config
  const handleDeleteEmail = (configId: string) => {
    setEmailConfigs(prev => prev.filter(config => config.id !== configId));
  };

  // Toggle slack config
  const handleToggleSlack = (configId: string) => {
    setSlackConfigs(prev => prev.map(config =>
      config.id === configId ? { ...config, isActive: !config.isActive } : config
    ));
  };

  // Delete slack config
  const handleDeleteSlack = (configId: string) => {
    setSlackConfigs(prev => prev.filter(config => config.id !== configId));
  };

  // Toggle webhook config
  const handleToggleWebhook = (configId: string) => {
    setWebhookConfigs(prev => prev.map(config =>
      config.id === configId ? { ...config, isActive: !config.isActive } : config
    ));
  };

  // Delete webhook config
  const handleDeleteWebhook = (configId: string) => {
    setWebhookConfigs(prev => prev.filter(config => config.id !== configId));
  };

  // Toggle alert rule
  const handleToggleRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  // Delete alert rule
  const handleDeleteRule = (ruleId: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure alert channels and notification rules
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Channels</p>
                <p className="text-2xl font-bold">{emailConfigs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slack Channels</p>
                <p className="text-2xl font-bold">{slackConfigs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Webhook className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-2xl font-bold">{webhookConfigs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{alertRules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          {/* Email Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription>SMTP configuration for email alerts</CardDescription>
                </div>
              </div>
              <Dialog open={isAddEmailOpen} onOpenChange={setIsAddEmailOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Email Configuration</DialogTitle>
                    <DialogDescription>
                      Configure SMTP settings for email notifications
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Configuration Name</Label>
                      <Input placeholder="e.g., Primary Alert Email" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SMTP Host</Label>
                        <Input placeholder="smtp.gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>SMTP Port</Label>
                        <Input type="number" placeholder="587" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input placeholder="user@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" placeholder="********" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>From Email</Label>
                        <Input placeholder="alerts@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>From Name</Label>
                        <Input placeholder="SNSMON-AI Alerts" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Recipients (comma-separated)</Label>
                      <Input placeholder="admin@example.com, team@example.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddEmailOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddEmailOpen(false)}>
                      Add Configuration
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => handleToggleEmail(config.id)}
                      />
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.smtpHost}:{config.smtpPort} | {config.recipients.length} recipients
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(config.lastTestStatus)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("email", config.id)}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setIsAddEmailOpen(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteEmail(config.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slack Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Slack Notifications</CardTitle>
                  <CardDescription>Slack webhook configuration for instant alerts</CardDescription>
                </div>
              </div>
              <Dialog open={isAddSlackOpen} onOpenChange={setIsAddSlackOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slack
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Slack Configuration</DialogTitle>
                    <DialogDescription>
                      Configure Slack webhook for notifications
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Configuration Name</Label>
                      <Input placeholder="e.g., Crisis Team Channel" />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://hooks.slack.com/services/..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Channel</Label>
                        <Input placeholder="#crisis-alerts" />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input placeholder="SNSMON-AI" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Emoji</Label>
                      <Input placeholder=":warning:" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddSlackOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddSlackOpen(false)}>
                      Add Configuration
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slackConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => handleToggleSlack(config.id)}
                      />
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.channel} | @{config.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(config.lastTestStatus)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("slack", config.id)}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setIsAddSlackOpen(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteSlack(config.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <Webhook className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Custom Webhooks</CardTitle>
                  <CardDescription>HTTP webhook endpoints for custom integrations</CardDescription>
                </div>
              </div>
              <Dialog open={isAddWebhookOpen} onOpenChange={setIsAddWebhookOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Webhook Configuration</DialogTitle>
                    <DialogDescription>
                      Configure custom HTTP webhook for notifications
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Configuration Name</Label>
                      <Input placeholder="e.g., Internal Alert System" />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://api.example.com/alerts" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HTTP Method</Label>
                        <Select defaultValue="POST">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Auth Type</Label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="bearer">Bearer Token</SelectItem>
                            <SelectItem value="basic">Basic Auth</SelectItem>
                            <SelectItem value="api_key">API Key</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Auth Value (if applicable)</Label>
                      <Input type="password" placeholder="Token or credentials" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddWebhookOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddWebhookOpen(false)}>
                      Add Configuration
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhookConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => handleToggleWebhook(config.id)}
                      />
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.method} | {config.url.substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(config.lastTestStatus)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("webhook", config.id)}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setIsAddWebhookOpen(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteWebhook(config.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Alert Rules</CardTitle>
                  <CardDescription>
                    Configure conditions and channels for automatic alerts
                  </CardDescription>
                </div>
              </div>
              <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Alert Rule</DialogTitle>
                    <DialogDescription>
                      Configure alert conditions and notification channels
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Rule Name</Label>
                      <Input placeholder="e.g., Critical Crisis Score Alert" />
                    </div>
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select defaultValue="crisis_score">
                          <SelectTrigger>
                            <SelectValue placeholder="Metric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="crisis_score">Crisis Score</SelectItem>
                            <SelectItem value="sentiment_score">Sentiment Score</SelectItem>
                            <SelectItem value="volume_change">Volume Change %</SelectItem>
                            <SelectItem value="viral_velocity">Viral Velocity</SelectItem>
                            <SelectItem value="bot_score">Bot Activity Score</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="gte">
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gt">{">"}</SelectItem>
                            <SelectItem value="gte">{">="}</SelectItem>
                            <SelectItem value="lt">{"<"}</SelectItem>
                            <SelectItem value="lte">{"<="}</SelectItem>
                            <SelectItem value="eq">{"="}</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Value" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notification Channels</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Switch id="email-channel" />
                          <Label htmlFor="email-channel" className="font-normal">
                            Email (Primary Alert Email)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="slack-channel" />
                          <Label htmlFor="slack-channel" className="font-normal">
                            Slack (Crisis Team Channel)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="webhook-channel" />
                          <Label htmlFor="webhook-channel" className="font-normal">
                            Webhook (Internal Alert System)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddRuleOpen(false)}>
                      Add Rule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rule.name}</p>
                          {getSeverityBadge(rule.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          When {rule.condition.metric.replace("_", " ")}{" "}
                          {rule.condition.operator === "gte" ? ">=" :
                           rule.condition.operator === "lte" ? "<=" :
                           rule.condition.operator === "gt" ? ">" :
                           rule.condition.operator === "lt" ? "<" : "="}{" "}
                          {rule.condition.value}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {rule.channels.email.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Badge>
                          )}
                          {rule.channels.slack.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Slack
                            </Badge>
                          )}
                          {rule.channels.webhook.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Webhook className="h-3 w-3 mr-1" />
                              Webhook
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setIsAddRuleOpen(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
