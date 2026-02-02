"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Settings,
  Key,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/lib/i18n/context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isSimulated?: boolean;
}

const suggestedQueries = [
  {
    icon: TrendingUp,
    label: "Sentiment Trend",
    query: "What is the current sentiment trend for the past week?",
  },
  {
    icon: AlertTriangle,
    label: "Crisis Alert",
    query: "Are there any active crisis alerts I should be aware of?",
  },
  {
    icon: MessageSquare,
    label: "Top Mentions",
    query: "Show me the top mentioned topics today",
  },
  {
    icon: Lightbulb,
    label: "Insights",
    query: "What insights can you provide about recent social media activity?",
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `Hello! I am the AI Assistant for SNSMON-AI. I can help you with:

- Sentiment Analysis: Understanding public sentiment about specific topics
- Crisis Monitoring: Providing real-time updates about potential crises
- Trend Analysis: Identifying trending topics and patterns
- Data Insights: Providing recommendations based on data

Feel free to ask anything about Indonesia social media monitoring.`,
    timestamp: new Date(),
    suggestions: [
      "Bagaimana sentimen publik tentang pemerintah minggu ini?",
      "Apa trending topics di Jakarta hari ini?",
      "Apakah ada peringatan krisis yang aktif?",
    ],
  },
];

const API_KEY_STORAGE = "snsmon-anthropic-api-key";

export default function ChatbotPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem(API_KEY_STORAGE, tempApiKey.trim());
      setTempApiKey("");
      setIsApiKeyDialogOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your Anthropic API key has been saved successfully.",
      });
    }
  };

  const handleClearApiKey = () => {
    setApiKey("");
    localStorage.removeItem(API_KEY_STORAGE);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed.",
    });
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied",
      description: "Response copied to clipboard.",
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        isSimulated: data.isSimulated,
        suggestions: [
          "Give me more details",
          "Compare with previous period",
          "Show regional breakdown",
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.chatbot.title}</h1>
            <p className="text-muted-foreground">
              {t.chatbot.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            Claude AI
          </Badge>
          {apiKey ? (
            <Badge variant="outline" className="gap-1.5 text-success border-success/30">
              <CheckCircle className="h-3 w-3" />
              API Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              Demo Mode
            </Badge>
          )}
          <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Key className="mr-2 h-4 w-4" />
                API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Anthropic API Key</DialogTitle>
                <DialogDescription>
                  Enter your Anthropic API key to enable AI-powered responses. The key is stored locally in your browser.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-ant-..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>
                </div>
                {apiKey && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">API key configured</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleClearApiKey}>
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveApiKey} disabled={!tempApiKey.trim()}>
                    Save Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages(initialMessages)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.chatbot.newChat}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Suggested Queries */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t.chatbot.quickQueries}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQueries.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSuggestionClick(item.query)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                >
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t.chatbot.aiCapabilities}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>- Real-time data analysis</p>
              <p>- Natural language queries</p>
              <p>- Trend identification</p>
              <p>- Crisis detection</p>
              <p>- Sentiment interpretation</p>
              <p>- Actionable recommendations</p>
            </CardContent>
          </Card>

          {!apiKey && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Enable AI Mode</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add your Anthropic API key to get AI-powered responses instead of demo data.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 h-auto mt-1"
                      onClick={() => setIsApiKeyDialogOpen(true)}
                    >
                      Configure API Key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col h-[700px]">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">SNSMON AI Assistant</CardTitle>
                <CardDescription className="text-xs">
                  Powered by Claude AI - Always online
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.isSimulated && message.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border/50">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Demo Data
                        </Badge>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                      {message.content}
                    </div>

                    {message.suggestions && message.role === "assistant" && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">
                          Suggested follow-ups:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-2 py-1 rounded-md bg-background border hover:bg-muted transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Analyzing data...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about social media monitoring..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {apiKey
                ? "AI responses powered by Claude"
                : "Demo mode - Add API key for AI-powered responses"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
