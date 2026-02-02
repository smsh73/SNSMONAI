"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Link2,
  Link2Off,
  Loader2,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PlatformIcon, getPlatformLabel } from "@/components/dashboard/platform-icon";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

type Platform = "twitter" | "instagram" | "facebook" | "tiktok" | "youtube" | "telegram";
type AccountType = "owned" | "monitored" | "competitor";

interface SocialAccount {
  id: string;
  platform: Platform;
  accountId: string;
  accountName: string;
  accountUsername: string;
  accountType: AccountType;
  avatar?: string;
  followers?: number;
  isConnected: boolean;
  lastSync?: string;
  postsCollected?: number;
  mentionsCollected?: number;
  status: "active" | "expired" | "error";
  errorMessage?: string;
}

// Mock data
const accounts: SocialAccount[] = [
  {
    id: "1",
    platform: "twitter",
    accountId: "kejaksaan_ri",
    accountName: "Kejaksaan RI",
    accountUsername: "KejaksaanRI",
    accountType: "owned",
    followers: 1250000,
    isConnected: true,
    lastSync: "2024-01-28 14:30:00",
    postsCollected: 15420,
    mentionsCollected: 89000,
    status: "active",
  },
  {
    id: "2",
    platform: "instagram",
    accountId: "kejaksaan_ri_ig",
    accountName: "Kejaksaan Republik Indonesia",
    accountUsername: "kejaksaan_ri",
    accountType: "owned",
    followers: 850000,
    isConnected: true,
    lastSync: "2024-01-28 14:15:00",
    postsCollected: 8900,
    mentionsCollected: 45000,
    status: "active",
  },
  {
    id: "3",
    platform: "facebook",
    accountId: "kejaksaan_fb",
    accountName: "Kejaksaan RI Official",
    accountUsername: "KejaksaanRepublikIndonesia",
    accountType: "owned",
    followers: 620000,
    isConnected: false,
    lastSync: "2024-01-15 10:00:00",
    status: "expired",
    errorMessage: "Access token expired. Please re-authenticate.",
  },
  {
    id: "4",
    platform: "tiktok",
    accountId: "kejaksaan_tiktok",
    accountName: "Kejaksaan RI",
    accountUsername: "kejaksaan_ri",
    accountType: "owned",
    followers: 320000,
    isConnected: false,
    status: "error",
    errorMessage: "API access not available.",
  },
  {
    id: "5",
    platform: "twitter",
    accountId: "kpk_ri",
    accountName: "KPK",
    accountUsername: "KPK_RI",
    accountType: "monitored",
    followers: 2100000,
    isConnected: true,
    lastSync: "2024-01-28 14:25:00",
    postsCollected: 12000,
    status: "active",
  },
  {
    id: "6",
    platform: "twitter",
    accountId: "kemenkumham",
    accountName: "Kemenkumham RI",
    accountUsername: "Aborasi_KUMHAM",
    accountType: "monitored",
    followers: 980000,
    isConnected: true,
    lastSync: "2024-01-28 14:20:00",
    postsCollected: 8500,
    status: "active",
  },
  {
    id: "7",
    platform: "instagram",
    accountId: "polri_ig",
    accountName: "POLRI",
    accountUsername: "divaborasipolri",
    accountType: "competitor",
    followers: 1500000,
    isConnected: true,
    lastSync: "2024-01-28 14:00:00",
    postsCollected: 5200,
    status: "active",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "expired":
      return <AlertTriangle className="h-4 w-4 text-severity-medium" />;
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/30";
    case "expired":
      return "bg-severity-medium/10 text-severity-medium border-severity-medium/30";
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getAccountTypeLabel = (type: AccountType) => {
  const labels: Record<AccountType, string> = {
    owned: "Owned",
    monitored: "Monitored",
    competitor: "Competitor",
  };
  return labels[type];
};

const getAccountTypeColor = (type: AccountType) => {
  const colors: Record<AccountType, string> = {
    owned: "bg-primary/10 text-primary",
    monitored: "bg-blue-500/10 text-blue-500",
    competitor: "bg-amber-500/10 text-amber-500",
  };
  return colors[type];
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function AccountsPage() {
  const { t } = useTranslation();
  const [accountsList, setAccountsList] = useState<SocialAccount[]>(accounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);
  const [connectingAccountId, setConnectingAccountId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    platform: "twitter" as Platform,
    accountName: "",
    accountUsername: "",
    accountType: "monitored" as AccountType,
  });

  const ownedAccounts = accountsList.filter((a) => a.accountType === "owned");
  const monitoredAccounts = accountsList.filter((a) => a.accountType === "monitored");
  const competitorAccounts = accountsList.filter((a) => a.accountType === "competitor");

  const connectedCount = accountsList.filter((a) => a.isConnected).length;
  const errorCount = accountsList.filter((a) => a.status === "error" || a.status === "expired").length;

  // Handle account sync
  const handleSync = async (accountId: string) => {
    setSyncingAccountId(accountId);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAccountsList(prev => prev.map(acc =>
      acc.id === accountId
        ? { ...acc, lastSync: new Date().toISOString().replace("T", " ").slice(0, 19) }
        : acc
    ));
    setSyncingAccountId(null);
  };

  // Handle account connect
  const handleConnect = async (accountId: string) => {
    setConnectingAccountId(accountId);
    // Simulate OAuth connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAccountsList(prev => prev.map(acc =>
      acc.id === accountId
        ? {
            ...acc,
            isConnected: true,
            status: "active" as const,
            lastSync: new Date().toISOString().replace("T", " ").slice(0, 19),
            errorMessage: undefined,
          }
        : acc
    ));
    setConnectingAccountId(null);
  };

  // Handle account delete
  const handleDelete = (accountId: string) => {
    setAccountsList(prev => prev.filter(acc => acc.id !== accountId));
  };

  // Handle edit account
  const handleEditAccount = () => {
    if (!editingAccount) return;
    setAccountsList(prev => prev.map(acc =>
      acc.id === editingAccount.id ? editingAccount : acc
    ));
    setEditingAccount(null);
    setIsEditDialogOpen(false);
  };

  // Handle add account
  const handleAddAccount = () => {
    if (!newAccount.accountName.trim() || !newAccount.accountUsername.trim()) return;

    const account: SocialAccount = {
      id: `acc-${Date.now()}`,
      platform: newAccount.platform,
      accountId: `${newAccount.platform}_${Date.now()}`,
      accountName: newAccount.accountName,
      accountUsername: newAccount.accountUsername,
      accountType: newAccount.accountType,
      isConnected: false,
      status: "error",
      errorMessage: "Not connected yet. Click Connect to authenticate.",
    };

    setAccountsList(prev => [...prev, account]);
    setNewAccount({
      platform: "twitter",
      accountName: "",
      accountUsername: "",
      accountType: "monitored",
    });
    setIsAddDialogOpen(false);
  };

  const renderAccountCard = (account: SocialAccount) => (
    <Card key={account.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.avatar} />
              <AvatarFallback>
                {account.accountName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <PlatformIcon platform={account.platform} size="sm" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{account.accountName}</h3>
              <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                {getAccountTypeLabel(account.accountType)}
              </Badge>
              <Badge variant="outline" className={getStatusColor(account.status)}>
                {getStatusIcon(account.status)}
                <span className="ml-1 capitalize">{account.status}</span>
              </Badge>
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>@{account.accountUsername}</span>
              {account.followers && (
                <span>{formatNumber(account.followers)} followers</span>
              )}
            </div>

            {account.status === "active" && account.lastSync && (
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Last sync: {account.lastSync}</span>
                {account.postsCollected && (
                  <span>{account.postsCollected.toLocaleString()} posts</span>
                )}
                {account.mentionsCollected && (
                  <span>{account.mentionsCollected.toLocaleString()} mentions</span>
                )}
              </div>
            )}

            {account.errorMessage && (
              <p className="text-xs text-destructive mt-2">{account.errorMessage}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {account.isConnected ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleSync(account.id)}
                disabled={syncingAccountId === account.id}
              >
                <RefreshCw className={cn("h-4 w-4", syncingAccountId === account.id && "animate-spin")} />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnect(account.id)}
                disabled={connectingAccountId === account.id}
              >
                {connectingAccountId === account.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="mr-2 h-4 w-4" />
                )}
                {connectingAccountId === account.id ? "Connecting..." : "Connect"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditingAccount(account);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDelete(account.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{accounts.length}</p>
                <p className="text-xs text-muted-foreground">Total Accounts</p>
              </div>
              <Users className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{connectedCount}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <Link2 className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
              </div>
              <Link2Off className="h-8 w-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {formatNumber(accounts.reduce((sum, a) => sum + (a.followers || 0), 0))}
                </p>
                <p className="text-xs text-muted-foreground">Total Reach</p>
              </div>
              <Users className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="owned" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="owned" className="gap-2">
              Owned Accounts
              <Badge variant="secondary" className="ml-1">
                {ownedAccounts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="monitored" className="gap-2">
              Monitored
              <Badge variant="secondary" className="ml-1">
                {monitoredAccounts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="competitor" className="gap-2">
              Competitors
              <Badge variant="secondary" className="ml-1">
                {competitorAccounts.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Social Account</DialogTitle>
                <DialogDescription>
                  Add a new social media account to monitor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={newAccount.platform}
                    onValueChange={(value: Platform) => setNewAccount({ ...newAccount, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input
                    placeholder="Display name"
                    value={newAccount.accountName}
                    onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    placeholder="@username"
                    value={newAccount.accountUsername}
                    onChange={(e) => setNewAccount({ ...newAccount, accountUsername: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select
                    value={newAccount.accountType}
                    onValueChange={(value: AccountType) => setNewAccount({ ...newAccount, accountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="monitored">Monitored</SelectItem>
                      <SelectItem value="competitor">Competitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAccount} disabled={!newAccount.accountName.trim()}>
                    <Save className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="owned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Owned Accounts</CardTitle>
              <CardDescription>
                Social media accounts owned by your organization. Full access to posting analytics and direct messages.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {ownedAccounts.map(renderAccountCard)}
          </div>
        </TabsContent>

        <TabsContent value="monitored" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitored Accounts</CardTitle>
              <CardDescription>
                Public accounts you're tracking for mentions, engagement, and content analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {monitoredAccounts.map(renderAccountCard)}
          </div>
        </TabsContent>

        <TabsContent value="competitor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Accounts</CardTitle>
              <CardDescription>
                Track competitor accounts for benchmarking and competitive analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {competitorAccounts.map(renderAccountCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Modify account settings
            </DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input
                  value={editingAccount.accountName}
                  onChange={(e) => setEditingAccount({ ...editingAccount, accountName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={editingAccount.accountUsername}
                  onChange={(e) => setEditingAccount({ ...editingAccount, accountUsername: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  value={editingAccount.accountType}
                  onValueChange={(value: AccountType) => setEditingAccount({ ...editingAccount, accountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="monitored">Monitored</SelectItem>
                    <SelectItem value="competitor">Competitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditAccount}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
