import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are SNSMON-AI Assistant, an AI-powered social media monitoring assistant for Indonesian government agencies. You help analyze social media data, provide insights, and answer questions about:

1. **Sentiment Analysis**: Understanding public sentiment about specific topics, policies, or events
2. **Crisis Monitoring**: Providing real-time updates about potential crises and unusual activity patterns
3. **Trend Analysis**: Identifying trending topics, hashtags, and patterns in social media conversations
4. **Data Insights**: Providing recommendations and insights based on monitoring data

Current monitoring context:
- Primary region: Indonesia (38 provinces)
- Platforms monitored: Twitter/X, Instagram, Facebook, TikTok, YouTube, Telegram
- Current crisis score: 65/100 (Elevated)
- Active alerts: 3 (1 Critical, 1 High, 1 Medium)
- Top trending: #JakartaUpdate, #Pemilu2024, Harga BBM

When answering questions:
- Provide specific, actionable insights
- Use data and metrics when available
- Highlight any risks or concerns
- Suggest follow-up actions when appropriate
- You can respond in Indonesian, English, or Korean based on the user's language

If asked about real-time data that you don't have access to, explain that you're showing simulated data for demonstration purposes.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, apiKey } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get API key from request or environment
    const anthropicApiKey = apiKey || process.env.ANTHROPIC_API_KEY;

    if (!anthropicApiKey) {
      // Return a simulated response if no API key is available
      return NextResponse.json({
        response: generateSimulatedResponse(message),
        isSimulated: true,
      });
    }

    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // Call Claude API
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract the text content from the response
    const textContent = response.content.find((c) => c.type === "text");
    const responseText = textContent ? textContent.text : "No response generated";

    return NextResponse.json({
      response: responseText,
      isSimulated: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // If API call fails, return simulated response
    const body = await request.clone().json();
    return NextResponse.json({
      response: generateSimulatedResponse(body.message || ""),
      isSimulated: true,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function generateSimulatedResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("sentimen") || lowerMessage.includes("sentiment")) {
    return `**Sentiment Analysis Summary (Last 7 Days)**

Based on monitoring data analysis:

**Overall Sentiment Score:** -0.23 (Slightly Negative)

**Breakdown:**
- Positive: 35% (-5% from last week)
- Negative: 45% (+8% from last week)
- Neutral: 20% (-3% from last week)

**Key Findings:**
1. Significant increase in negative sentiment detected, particularly around:
   - "kebijakan" (policy) - +45% negative mentions
   - "harga" (prices) - +38% negative mentions
   - "ekonomi" (economy) - +32% negative mentions

2. Regional Hotspot: DKI Jakarta shows the highest negative sentiment score (-0.42)

3. Platform Analysis:
   - Twitter/X: Most negative (-0.35)
   - Instagram: Moderately negative (-0.18)
   - TikTok: Neutral (0.02)

**Recommendations:**
- Increase monitoring in Jakarta region
- Prepare response strategy for economic-related discussions
- Consider proactive communication about policy changes

---
Note: This is simulated data for demonstration. Configure API key for real-time analysis.`;
  }

  if (lowerMessage.includes("trend") || lowerMessage.includes("topic") || lowerMessage.includes("trending")) {
    return `**Trending Topics Analysis (Today)**

**Top Trending Topics:**

| Rank | Topic | Mentions | Sentiment | Velocity |
|------|-------|----------|-----------|----------|
| 1 | #JakartaUpdate | 15,420 | -0.35 | +320% |
| 2 | #Pemilu2024 | 12,300 | +0.05 | +45% |
| 3 | Harga BBM | 8,900 | -0.48 | +128% |
| 4 | #KorupsiIndonesia | 6,700 | -0.72 | +89% |
| 5 | Banjir Jakarta | 5,400 | -0.55 | -12% |

**Emerging Topics (Last 2 Hours):**
- "demonstrasi" - New spike detected (+450%)
- "kerusuhan" - Potential crisis indicator

**Platform Distribution:**
- Twitter/X: 45% of trending conversations
- TikTok: 28% (growing rapidly)
- Instagram: 18%
- Facebook: 9%

**Recommended Actions:**
1. Monitor #JakartaUpdate closely - unusual velocity increase
2. Prepare crisis response for "demonstrasi" related content
3. Track cross-platform spread patterns

---
Note: This is simulated data for demonstration.`;
  }

  if (lowerMessage.includes("crisis") || lowerMessage.includes("alert") || lowerMessage.includes("krisis")) {
    return `**Active Crisis Alerts Summary**

**Current Crisis Score: 65/100 (ELEVATED)**

**Active Alerts (3):**

1. **CRITICAL** - Keyword Spike: "kerusuhan"
   - Location: DKI Jakarta
   - Volume: +450% increase in 1 hour
   - Related Mentions: 2,341
   - Status: Active Monitoring
   - Risk Level: High potential for escalation

2. **HIGH** - Negative Sentiment Surge
   - Location: East Java (Surabaya area)
   - Sentiment Drop: -40% in 2 hours
   - Related Mentions: 892
   - Status: Under Review
   - Trigger: Government policy discussions

3. **MEDIUM** - Coordinated Activity Detected
   - Platform: Twitter/X
   - Flagged Accounts: 150+
   - Content Similarity: 78%
   - Status: Investigation in progress
   - Assessment: Potential bot network

**Recommended Actions:**
1. Escalate Jakarta situation to crisis response team
2. Prepare official communication strategy
3. Monitor for cross-regional spread
4. Document coordinated activity for reporting

**Timeline:**
- 14:32 - Critical alert triggered (Jakarta)
- 14:15 - High alert detected (East Java)
- 13:45 - Medium alert flagged (Twitter bots)

---
Note: This is simulated data for demonstration.`;
  }

  if (lowerMessage.includes("jakarta") || lowerMessage.includes("regional")) {
    return `**Regional Analysis: DKI Jakarta**

**Overview:**
- Crisis Score: 75/100 (CRITICAL)
- Total Mentions Today: 45,200
- Sentiment Score: -0.35
- Total Reach: 12.5M

**Platform Breakdown:**
| Platform | Mentions | Sentiment | Share |
|----------|----------|-----------|-------|
| Twitter/X | 20,340 | -0.42 | 45% |
| Instagram | 13,560 | -0.28 | 30% |
| Facebook | 6,780 | -0.32 | 15% |
| TikTok | 4,520 | -0.15 | 10% |

**Top Keywords:**
1. "demo" - 8,500 mentions
2. "macet" - 5,200 mentions
3. "banjir" - 3,800 mentions
4. "pemerintah" - 3,200 mentions

**Key Influencers Discussing:**
- 156 accounts with >100K followers
- Combined reach: 45M+

**24-Hour Change:**
- Mentions: +32%
- Negative Sentiment: +18%
- Crisis Score: +15 points

**Recommendations:**
- Immediate attention required
- Deploy monitoring team
- Prepare crisis communication

---
Note: This is simulated data for demonstration.`;
  }

  // Default response
  return `**SNSMON-AI Assistant**

Thank you for your question. Based on available monitoring data:

**Current Overview:**
- Total Mentions Today: 151,300
- Overall Sentiment Score: -0.23 (Slightly Negative)
- Active Alerts: 3 (1 Critical, 1 High, 1 Medium)
- Regions Monitored: 38 provinces
- Top Platform: Twitter/X (45%)

**Quick Stats:**
| Metric | Value | Change |
|--------|-------|--------|
| Total Mentions | 151.3K | +12.5% |
| Unique Authors | 24.5K | +15.8% |
| Total Reach | 48.2M | +23.1% |
| Crisis Score | 65 | +8 pts |

**How can I help you further?**

I can assist with:
- Sentiment analysis for specific topics or regions
- Trending topics and keyword analysis
- Crisis monitoring and alert details
- Regional breakdowns (all 38 Indonesian provinces)
- Platform-specific insights
- Influencer tracking

Please ask a specific question and I'll provide detailed analysis.

---
Note: This is simulated data for demonstration. Configure API key for AI-powered analysis.`;
}
