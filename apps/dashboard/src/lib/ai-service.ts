/**
 * AI Service for SNSMON-AI
 *
 * Manages AI API integrations for:
 * - Sentiment Analysis
 * - Crisis Detection
 * - Emotion Detection
 * - Report Generation
 * - Chatbot
 *
 * Fallback Order: OpenAI > Gemini > Claude
 */

export type AIProvider = "openai" | "anthropic" | "google" | "perplexity";

// Fallback order for AI providers: OpenAI > Gemini > Claude
export const AI_FALLBACK_ORDER: AIProvider[] = ["openai", "google", "anthropic"];

export interface AIApiKey {
  id: string;
  provider: AIProvider;
  name: string;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export interface AIAnalysisRequest {
  type: "sentiment" | "crisis" | "emotion" | "summary" | "chat";
  content: string;
  language?: "id" | "en" | "ko";
  options?: Record<string, unknown>;
}

export interface AIAnalysisResponse {
  success: boolean;
  provider: AIProvider;
  result: unknown;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
  fallbackUsed?: boolean;
  attemptedProviders?: AIProvider[];
}

// Storage key for localStorage
const STORAGE_KEY = "snsmon_ai_api_keys";

/**
 * Get all stored API keys
 */
export function getStoredApiKeys(): AIApiKey[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load API keys:", error);
  }
  return [];
}

/**
 * Save API keys to storage
 */
export function saveApiKeys(keys: AIApiKey[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error("Failed to save API keys:", error);
  }
}

/**
 * Add a new API key
 */
export function addApiKey(key: Omit<AIApiKey, "id" | "createdAt" | "usageCount">): AIApiKey {
  const newKey: AIApiKey = {
    ...key,
    id: `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };

  const keys = getStoredApiKeys();
  keys.push(newKey);
  saveApiKeys(keys);

  return newKey;
}

/**
 * Update an existing API key
 */
export function updateApiKey(id: string, updates: Partial<AIApiKey>): AIApiKey | null {
  const keys = getStoredApiKeys();
  const index = keys.findIndex(k => k.id === id);

  if (index === -1) return null;

  keys[index] = { ...keys[index], ...updates };
  saveApiKeys(keys);

  return keys[index];
}

/**
 * Delete an API key
 */
export function deleteApiKey(id: string): boolean {
  const keys = getStoredApiKeys();
  const filtered = keys.filter(k => k.id !== id);

  if (filtered.length === keys.length) return false;

  saveApiKeys(filtered);
  return true;
}

/**
 * Get the active API key for a provider
 */
export function getActiveApiKey(provider: AIProvider): AIApiKey | null {
  const keys = getStoredApiKeys();
  return keys.find(k => k.provider === provider && k.isActive) || null;
}

/**
 * Get all available active providers in fallback order
 */
export function getAvailableProvidersInOrder(): { provider: AIProvider; key: AIApiKey }[] {
  const available: { provider: AIProvider; key: AIApiKey }[] = [];

  for (const provider of AI_FALLBACK_ORDER) {
    const key = getActiveApiKey(provider);
    if (key) {
      available.push({ provider, key });
    }
  }

  // Also check perplexity (not in fallback order but can be used if explicitly selected)
  const perplexityKey = getActiveApiKey("perplexity");
  if (perplexityKey) {
    available.push({ provider: "perplexity", key: perplexityKey });
  }

  return available;
}

/**
 * Get provider configuration
 */
export function getProviderConfig(provider: AIProvider) {
  const configs = {
    openai: {
      name: "OpenAI",
      displayName: "OpenAI GPT-4",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      endpoint: "https://api.openai.com/v1",
      icon: "AI",
      color: "#10A37F",
      keyPrefix: "sk-",
      features: ["sentiment", "crisis", "emotion", "summary", "chat"],
      priority: 1,
    },
    google: {
      name: "Google",
      displayName: "Gemini",
      models: ["gemini-pro", "gemini-pro-vision"],
      endpoint: "https://generativelanguage.googleapis.com/v1",
      icon: "GE",
      color: "#4285F4",
      keyPrefix: "AI",
      features: ["sentiment", "crisis", "emotion", "summary", "chat"],
      priority: 2,
    },
    anthropic: {
      name: "Anthropic",
      displayName: "Claude",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      endpoint: "https://api.anthropic.com/v1",
      icon: "CL",
      color: "#D97706",
      keyPrefix: "sk-ant-",
      features: ["sentiment", "crisis", "emotion", "summary", "chat"],
      priority: 3,
    },
    perplexity: {
      name: "Perplexity",
      displayName: "Perplexity AI",
      models: ["pplx-7b-online", "pplx-70b-online", "pplx-7b-chat", "pplx-70b-chat"],
      endpoint: "https://api.perplexity.ai",
      icon: "PP",
      color: "#6366F1",
      keyPrefix: "pplx-",
      features: ["sentiment", "summary", "chat"],
      priority: 4,
    },
  };

  return configs[provider];
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(provider: AIProvider, apiKey: string): boolean {
  const config = getProviderConfig(provider);
  if (!config) return false;

  // Basic validation - check if key starts with expected prefix
  if (config.keyPrefix && !apiKey.startsWith(config.keyPrefix)) {
    // Google keys don't always have a specific prefix
    if (provider !== "google") {
      return false;
    }
  }

  // Check minimum length
  if (apiKey.length < 20) return false;

  return true;
}

/**
 * Test API key by making a simple request
 */
export async function testApiKey(provider: AIProvider, apiKey: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const config = getProviderConfig(provider);
    if (!config) {
      return { success: false, message: "Unknown provider" };
    }

    // Test request based on provider
    let testEndpoint = "";
    let headers: Record<string, string> = {};
    const method = "GET";

    switch (provider) {
      case "openai":
        testEndpoint = "https://api.openai.com/v1/models";
        headers = { Authorization: `Bearer ${apiKey}` };
        break;
      case "anthropic":
        // Claude doesn't have a simple test endpoint, so we'll just validate format
        if (!apiKey.startsWith("sk-ant-")) {
          return { success: false, message: "Invalid API key format" };
        }
        return { success: true, message: "API key format validated" };
      case "google":
        // Google AI API test
        testEndpoint = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        break;
      case "perplexity":
        // Perplexity doesn't have a simple test endpoint
        if (!apiKey.startsWith("pplx-")) {
          return { success: false, message: "Invalid API key format" };
        }
        return { success: true, message: "API key format validated" };
      default:
        return { success: false, message: "Unknown provider" };
    }

    const response = await fetch(testEndpoint, {
      method,
      headers,
    });

    if (response.ok) {
      return { success: true, message: "API key is valid" };
    } else {
      const error = await response.text();
      return { success: false, message: `API key validation failed: ${error}` };
    }
  } catch (error) {
    return { success: false, message: `Connection error: ${error}` };
  }
}

/**
 * Perform AI analysis with automatic fallback
 * Fallback Order: OpenAI > Gemini > Claude
 */
export async function performAnalysis(
  request: AIAnalysisRequest,
  preferredProvider?: AIProvider
): Promise<AIAnalysisResponse> {
  const attemptedProviders: AIProvider[] = [];
  const errors: string[] = [];

  // Build the list of providers to try
  let providersToTry: AIProvider[] = [];

  if (preferredProvider) {
    // If preferred provider is specified, try it first, then fallback
    const preferredKey = getActiveApiKey(preferredProvider);
    if (preferredKey) {
      providersToTry.push(preferredProvider);
    }

    // Add remaining providers from fallback order
    for (const provider of AI_FALLBACK_ORDER) {
      if (provider !== preferredProvider) {
        const key = getActiveApiKey(provider);
        if (key) {
          providersToTry.push(provider);
        }
      }
    }
  } else {
    // Use standard fallback order: OpenAI > Gemini > Claude
    for (const provider of AI_FALLBACK_ORDER) {
      const key = getActiveApiKey(provider);
      if (key) {
        providersToTry.push(provider);
      }
    }
  }

  // If no providers available, return error
  if (providersToTry.length === 0) {
    return {
      success: false,
      provider: "openai",
      result: null,
      error: "No active API key configured. Please add an API key in Admin > API Keys.",
      attemptedProviders: [],
    };
  }

  // Build the prompt
  const systemPrompt = buildSystemPrompt(request.type, request.language);

  // Try each provider in order
  for (const provider of providersToTry) {
    attemptedProviders.push(provider);

    const activeKey = getActiveApiKey(provider);
    if (!activeKey) continue;

    try {
      console.log(`[AI Service] Attempting ${provider}...`);

      const result = await callAIProvider(
        provider,
        activeKey.apiKey,
        systemPrompt,
        request.content
      );

      // Success! Update usage count
      updateApiKey(activeKey.id, {
        lastUsed: new Date().toISOString(),
        usageCount: activeKey.usageCount + 1,
      });

      const fallbackUsed = attemptedProviders.length > 1;
      if (fallbackUsed) {
        console.log(`[AI Service] Success with ${provider} (fallback from: ${attemptedProviders.slice(0, -1).join(" > ")})`);
      } else {
        console.log(`[AI Service] Success with ${provider}`);
      }

      return {
        success: true,
        provider,
        result,
        fallbackUsed,
        attemptedProviders,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(`${provider}: ${errorMessage}`);
      console.warn(`[AI Service] ${provider} failed: ${errorMessage}. Trying next provider...`);
      // Continue to next provider
    }
  }

  // All providers failed
  return {
    success: false,
    provider: providersToTry[providersToTry.length - 1] || "openai",
    result: null,
    error: `All AI providers failed. Errors: ${errors.join("; ")}`,
    fallbackUsed: attemptedProviders.length > 1,
    attemptedProviders,
  };
}

/**
 * Perform AI analysis with a specific provider (no fallback)
 */
export async function performAnalysisWithProvider(
  request: AIAnalysisRequest,
  provider: AIProvider
): Promise<AIAnalysisResponse> {
  const activeKey = getActiveApiKey(provider);

  if (!activeKey) {
    return {
      success: false,
      provider,
      result: null,
      error: `No active API key for ${provider}. Please add an API key in Admin > API Keys.`,
    };
  }

  const systemPrompt = buildSystemPrompt(request.type, request.language);

  try {
    const result = await callAIProvider(
      provider,
      activeKey.apiKey,
      systemPrompt,
      request.content
    );

    // Update usage count
    updateApiKey(activeKey.id, {
      lastUsed: new Date().toISOString(),
      usageCount: activeKey.usageCount + 1,
    });

    return {
      success: true,
      provider,
      result,
      fallbackUsed: false,
    };
  } catch (error) {
    return {
      success: false,
      provider,
      result: null,
      error: `AI analysis failed with ${provider}: ${error}`,
      fallbackUsed: false,
    };
  }
}

/**
 * Build system prompt for different analysis types
 */
function buildSystemPrompt(type: AIAnalysisRequest["type"], language?: string): string {
  const lang = language || "en";

  const prompts: Record<string, string> = {
    sentiment: `You are a sentiment analysis expert specializing in Indonesian social media content.
Analyze the following text and provide:
1. Overall sentiment score (-1.0 to 1.0)
2. Sentiment category (positive, negative, neutral)
3. Confidence level (0-100%)
4. Key phrases that influenced the sentiment
Respond in JSON format.`,

    crisis: `You are a crisis detection expert for Indonesian government agencies.
Analyze the following social media content for potential crisis indicators:
1. Crisis score (0-100)
2. Crisis category (civil_unrest, violence, natural_disaster, incident, government, security, economic)
3. Severity level (critical, high, medium, low)
4. Key indicators found
5. Recommended actions
Respond in JSON format.`,

    emotion: `You are an emotion detection specialist.
Analyze the following text and detect emotions from these 28 categories:
Primary: joy, trust, anticipation, surprise, fear, sadness, disgust, anger
Secondary: love, optimism, hope, pride, gratitude, admiration, guilt, shame, anxiety, envy, contempt, disappointment
Tertiary: frustration, confusion, excitement, relief, nostalgia, empathy, outrage, apathy
Provide scores (0-100) for each detected emotion.
Respond in JSON format.`,

    summary: `You are a social media monitoring expert.
Summarize the following content and provide:
1. Key themes and topics
2. Main sentiment
3. Notable mentions or entities
4. Trending keywords
5. Actionable insights
Respond in ${lang === "id" ? "Indonesian (Bahasa Indonesia)" : lang === "ko" ? "Korean" : "English"}.`,

    chat: `You are SNSMON-AI, an AI assistant for social media monitoring and analysis.
You help Indonesian government agencies monitor and analyze social media content.
You can provide insights on sentiment, crisis detection, trends, and recommendations.
Be helpful, accurate, and professional.
Respond in ${lang === "id" ? "Indonesian (Bahasa Indonesia)" : lang === "ko" ? "Korean" : "English"}.`,
  };

  return prompts[type] || prompts.chat;
}

/**
 * Call AI provider API
 */
async function callAIProvider(
  provider: AIProvider,
  apiKey: string,
  systemPrompt: string,
  content: string
): Promise<unknown> {
  switch (provider) {
    case "openai":
      return callOpenAI(apiKey, systemPrompt, content);
    case "anthropic":
      return callAnthropic(apiKey, systemPrompt, content);
    case "google":
      return callGoogle(apiKey, systemPrompt, content);
    case "perplexity":
      return callPerplexity(apiKey, systemPrompt, content);
    default:
      throw new Error("Unknown provider");
  }
}

async function callOpenAI(apiKey: string, systemPrompt: string, content: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

async function callAnthropic(apiKey: string, systemPrompt: string, content: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.content[0]?.text;
}

async function callGoogle(apiKey: string, systemPrompt: string, content: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nUser: ${content}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text;
}

async function callPerplexity(apiKey: string, systemPrompt: string, content: string) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "pplx-70b-online",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

/**
 * Get the fallback chain status for display
 */
export function getFallbackChainStatus(): {
  provider: AIProvider;
  name: string;
  available: boolean;
  priority: number;
}[] {
  return AI_FALLBACK_ORDER.map((provider, index) => {
    const config = getProviderConfig(provider);
    const key = getActiveApiKey(provider);
    return {
      provider,
      name: config?.displayName || provider,
      available: !!key,
      priority: index + 1,
    };
  });
}
