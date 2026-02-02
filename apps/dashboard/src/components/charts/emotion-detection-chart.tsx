"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 28 Emotion Categories based on Plutchik's model and extended classifications
export interface EmotionData {
  emotion: string;
  emotionId: string;       // Indonesian name
  value: number;           // Count or percentage
  percentage: number;
  category: "primary" | "secondary" | "tertiary";
  sentiment: "positive" | "negative" | "neutral";
  color: string;
}

interface EmotionDetectionChartProps {
  data: EmotionData[];
  title?: string;
  description?: string;
  className?: string;
  showRadar?: boolean;
}

// Extended emotion categories (28 types)
export const EMOTION_CATEGORIES: EmotionData[] = [
  // Primary Emotions - Positive
  { emotion: "Joy", emotionId: "Kegembiraan", value: 0, percentage: 0, category: "primary", sentiment: "positive", color: "#22C55E" },
  { emotion: "Trust", emotionId: "Kepercayaan", value: 0, percentage: 0, category: "primary", sentiment: "positive", color: "#3B82F6" },
  { emotion: "Anticipation", emotionId: "Antisipasi", value: 0, percentage: 0, category: "primary", sentiment: "positive", color: "#F59E0B" },
  { emotion: "Surprise", emotionId: "Kejutan", value: 0, percentage: 0, category: "primary", sentiment: "neutral", color: "#8B5CF6" },

  // Primary Emotions - Negative
  { emotion: "Fear", emotionId: "Ketakutan", value: 0, percentage: 0, category: "primary", sentiment: "negative", color: "#6366F1" },
  { emotion: "Sadness", emotionId: "Kesedihan", value: 0, percentage: 0, category: "primary", sentiment: "negative", color: "#64748B" },
  { emotion: "Disgust", emotionId: "Jijik", value: 0, percentage: 0, category: "primary", sentiment: "negative", color: "#84CC16" },
  { emotion: "Anger", emotionId: "Kemarahan", value: 0, percentage: 0, category: "primary", sentiment: "negative", color: "#EF4444" },

  // Secondary Emotions - Positive
  { emotion: "Love", emotionId: "Cinta", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#EC4899" },
  { emotion: "Optimism", emotionId: "Optimisme", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#10B981" },
  { emotion: "Hope", emotionId: "Harapan", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#06B6D4" },
  { emotion: "Pride", emotionId: "Kebanggaan", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#F97316" },
  { emotion: "Gratitude", emotionId: "Rasa Syukur", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#14B8A6" },
  { emotion: "Admiration", emotionId: "Kekaguman", value: 0, percentage: 0, category: "secondary", sentiment: "positive", color: "#A855F7" },

  // Secondary Emotions - Negative
  { emotion: "Guilt", emotionId: "Rasa Bersalah", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#78716C" },
  { emotion: "Shame", emotionId: "Rasa Malu", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#9CA3AF" },
  { emotion: "Anxiety", emotionId: "Kecemasan", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#7C3AED" },
  { emotion: "Envy", emotionId: "Iri Hati", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#65A30D" },
  { emotion: "Contempt", emotionId: "Penghinaan", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#DC2626" },
  { emotion: "Disappointment", emotionId: "Kekecewaan", value: 0, percentage: 0, category: "secondary", sentiment: "negative", color: "#475569" },

  // Tertiary Emotions
  { emotion: "Frustration", emotionId: "Frustrasi", value: 0, percentage: 0, category: "tertiary", sentiment: "negative", color: "#B91C1C" },
  { emotion: "Confusion", emotionId: "Kebingungan", value: 0, percentage: 0, category: "tertiary", sentiment: "neutral", color: "#6B7280" },
  { emotion: "Excitement", emotionId: "Kegembiraan", value: 0, percentage: 0, category: "tertiary", sentiment: "positive", color: "#FBBF24" },
  { emotion: "Relief", emotionId: "Kelegaan", value: 0, percentage: 0, category: "tertiary", sentiment: "positive", color: "#34D399" },
  { emotion: "Nostalgia", emotionId: "Nostalgia", value: 0, percentage: 0, category: "tertiary", sentiment: "neutral", color: "#A78BFA" },
  { emotion: "Empathy", emotionId: "Empati", value: 0, percentage: 0, category: "tertiary", sentiment: "positive", color: "#F472B6" },
  { emotion: "Outrage", emotionId: "Kemarahan Besar", value: 0, percentage: 0, category: "tertiary", sentiment: "negative", color: "#991B1B" },
  { emotion: "Apathy", emotionId: "Apatis", value: 0, percentage: 0, category: "tertiary", sentiment: "neutral", color: "#94A3B8" },
];

export function EmotionDetectionChart({
  data,
  title = "Emotion Detection",
  description = "28 emotion categories detected from social media mentions",
  className,
  showRadar = true,
}: EmotionDetectionChartProps) {
  // Get top 8 emotions for radar chart (primary emotions)
  const radarData = data
    .filter(d => d.category === "primary")
    .map(d => ({
      emotion: d.emotion,
      emotionId: d.emotionId,
      value: d.percentage,
      fullMark: 100,
    }));

  // Get top 10 emotions by count for bar chart
  const barData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Group by sentiment
  const sentimentGroups = {
    positive: data.filter(d => d.sentiment === "positive"),
    negative: data.filter(d => d.sentiment === "negative"),
    neutral: data.filter(d => d.sentiment === "neutral"),
  };

  const totalPositive = sentimentGroups.positive.reduce((sum, d) => sum + d.value, 0);
  const totalNegative = sentimentGroups.negative.reduce((sum, d) => sum + d.value, 0);
  const totalNeutral = sentimentGroups.neutral.reduce((sum, d) => sum + d.value, 0);
  const total = totalPositive + totalNegative + totalNeutral;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              Positive: {total > 0 ? Math.round((totalPositive / total) * 100) : 0}%
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
              Negative: {total > 0 ? Math.round((totalNegative / total) * 100) : 0}%
            </Badge>
            <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
              Neutral: {total > 0 ? Math.round((totalNeutral / total) * 100) : 0}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="radar">Primary Emotions</TabsTrigger>
            <TabsTrigger value="details">All Emotions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="emotionId"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={75}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value.toLocaleString()} (${props.payload.percentage}%)`,
                      props.payload.emotion,
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="radar">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis
                    dataKey="emotionId"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <Radar
                    name="Emotion Distribution"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Percentage"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-4 gap-2 max-h-[350px] overflow-y-auto pr-2">
              {data
                .sort((a, b) => b.value - a.value)
                .map((emotion) => (
                  <div
                    key={emotion.emotion}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: emotion.color }}
                      />
                      <div>
                        <p className="text-xs font-medium">{emotion.emotionId}</p>
                        <p className="text-[10px] text-muted-foreground">{emotion.emotion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{emotion.percentage}%</p>
                      <p className="text-[10px] text-muted-foreground">{emotion.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper function to generate sample emotion data
export function generateSampleEmotionData(): EmotionData[] {
  const baseData = EMOTION_CATEGORIES.map(category => ({
    ...category,
    value: Math.floor(Math.random() * 150000) + 3000,
  }));

  const total = baseData.reduce((sum, d) => sum + d.value, 0);

  return baseData.map(d => ({
    ...d,
    percentage: Math.round((d.value / total) * 100 * 10) / 10,
  }));
}
