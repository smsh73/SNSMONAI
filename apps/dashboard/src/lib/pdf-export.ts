/**
 * PDF Export Utility for SNSMON-AI Reports
 *
 * This module provides functions to generate PDF reports from dashboard data.
 * Uses browser's print functionality and CSS for styling.
 */

export interface ReportData {
  title: string;
  subtitle?: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalMentions: number;
    totalReach: number;
    avgSentiment: number;
    uniqueAuthors: number;
  };
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platformData: {
    name: string;
    mentions: number;
    percentage: number;
  }[];
  topKeywords: {
    keyword: string;
    count: number;
    sentiment: number;
  }[];
  topInfluencers: {
    name: string;
    username: string;
    followers: number;
    mentions: number;
  }[];
  regionData: {
    region: string;
    mentions: number;
    sentiment: number;
  }[];
  crisisEvents?: {
    date: string;
    title: string;
    severity: string;
    region: string;
  }[];
  emotionData?: {
    emotion: string;
    emotionId: string;
    value: number;
    percentage: number;
  }[];
}

export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  includeCharts: boolean;
  includeSummary: boolean;
  includeKeywords: boolean;
  includeInfluencers: boolean;
  includeRegions: boolean;
  includeCrisis: boolean;
  includeEmotions: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generate HTML content for PDF export
 */
export function generateReportHTML(data: ReportData, options: ExportOptions): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.title}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      background: white;
    }
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #102a43;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #102a43;
      margin-bottom: 8px;
    }
    .header .subtitle {
      font-size: 14px;
      color: #64748b;
    }
    .header .date-range {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 8px;
    }
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #102a43;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #102a43;
    }
    .stat-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .sentiment-bar {
      display: flex;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .sentiment-positive { background: #22c55e; }
    .sentiment-neutral { background: #94a3b8; }
    .sentiment-negative { background: #ef4444; }
    .sentiment-legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th {
      background: #f1f5f9;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:hover {
      background: #f8fafc;
    }
    .positive { color: #22c55e; }
    .negative { color: #ef4444; }
    .neutral { color: #64748b; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 500;
    }
    .badge-critical { background: #fef2f2; color: #dc2626; }
    .badge-high { background: #fff7ed; color: #ea580c; }
    .badge-medium { background: #fefce8; color: #ca8a04; }
    .badge-low { background: #f0fdf4; color: #16a34a; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
    }
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <h1>${data.title}</h1>
      ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ""}
      <p class="date-range">Report Period: ${data.dateRange.start} - ${data.dateRange.end}</p>
      <p class="date-range">Generated: ${formatDate(new Date())}</p>
    </div>

    ${options.includeSummary ? `
    <div class="section">
      <h2 class="section-title">Executive Summary</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${formatNumber(data.summary.totalMentions)}</div>
          <div class="stat-label">Total Mentions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(data.summary.totalReach)}</div>
          <div class="stat-label">Total Reach</div>
        </div>
        <div class="stat-card">
          <div class="stat-value ${data.summary.avgSentiment >= 0 ? 'positive' : 'negative'}">${data.summary.avgSentiment >= 0 ? '+' : ''}${data.summary.avgSentiment.toFixed(2)}</div>
          <div class="stat-label">Avg Sentiment</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(data.summary.uniqueAuthors)}</div>
          <div class="stat-label">Unique Authors</div>
        </div>
      </div>

      <h3 style="font-size: 12px; margin-bottom: 10px; color: #475569;">Sentiment Distribution</h3>
      <div class="sentiment-bar">
        <div class="sentiment-positive" style="width: ${data.sentimentBreakdown.positive}%"></div>
        <div class="sentiment-neutral" style="width: ${data.sentimentBreakdown.neutral}%"></div>
        <div class="sentiment-negative" style="width: ${data.sentimentBreakdown.negative}%"></div>
      </div>
      <div class="sentiment-legend">
        <div class="legend-item"><div class="legend-dot sentiment-positive"></div> Positive (${data.sentimentBreakdown.positive}%)</div>
        <div class="legend-item"><div class="legend-dot sentiment-neutral"></div> Neutral (${data.sentimentBreakdown.neutral}%)</div>
        <div class="legend-item"><div class="legend-dot sentiment-negative"></div> Negative (${data.sentimentBreakdown.negative}%)</div>
      </div>
    </div>
    ` : ""}

    <div class="two-column">
      <div class="section">
        <h2 class="section-title">Platform Distribution</h2>
        <table>
          <thead>
            <tr>
              <th>Platform</th>
              <th style="text-align: right;">Mentions</th>
              <th style="text-align: right;">Share</th>
            </tr>
          </thead>
          <tbody>
            ${data.platformData.map(p => `
              <tr>
                <td>${p.name}</td>
                <td style="text-align: right;">${formatNumber(p.mentions)}</td>
                <td style="text-align: right;">${p.percentage}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      ${options.includeKeywords ? `
      <div class="section">
        <h2 class="section-title">Top Keywords</h2>
        <table>
          <thead>
            <tr>
              <th>Keyword</th>
              <th style="text-align: right;">Count</th>
              <th style="text-align: right;">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            ${data.topKeywords.slice(0, 8).map(k => `
              <tr>
                <td>${k.keyword}</td>
                <td style="text-align: right;">${formatNumber(k.count)}</td>
                <td style="text-align: right;" class="${k.sentiment >= 0 ? 'positive' : 'negative'}">${k.sentiment >= 0 ? '+' : ''}${k.sentiment.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      ` : ""}
    </div>

    ${options.includeInfluencers ? `
    <div class="section">
      <h2 class="section-title">Top Influencers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th style="text-align: right;">Followers</th>
            <th style="text-align: right;">Mentions</th>
          </tr>
        </thead>
        <tbody>
          ${data.topInfluencers.slice(0, 10).map(i => `
            <tr>
              <td>${i.name}</td>
              <td>@${i.username}</td>
              <td style="text-align: right;">${formatNumber(i.followers)}</td>
              <td style="text-align: right;">${formatNumber(i.mentions)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${options.includeRegions ? `
    <div class="section">
      <h2 class="section-title">Regional Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th style="text-align: right;">Mentions</th>
            <th style="text-align: right;">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          ${data.regionData.map(r => `
            <tr>
              <td>${r.region}</td>
              <td style="text-align: right;">${formatNumber(r.mentions)}</td>
              <td style="text-align: right;" class="${r.sentiment >= 0 ? 'positive' : 'negative'}">${r.sentiment >= 0 ? '+' : ''}${r.sentiment.toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${options.includeCrisis && data.crisisEvents && data.crisisEvents.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Crisis Events</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Region</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${data.crisisEvents.map(e => `
            <tr>
              <td>${e.date}</td>
              <td>${e.title}</td>
              <td>${e.region}</td>
              <td><span class="badge badge-${e.severity.toLowerCase()}">${e.severity}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${options.includeEmotions && data.emotionData && data.emotionData.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Emotion Analysis (Top 12)</h2>
      <table>
        <thead>
          <tr>
            <th>Emotion</th>
            <th>Indonesian</th>
            <th style="text-align: right;">Count</th>
            <th style="text-align: right;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${data.emotionData.slice(0, 12).map(e => `
            <tr>
              <td>${e.emotion}</td>
              <td>${e.emotionId}</td>
              <td style="text-align: right;">${formatNumber(e.value)}</td>
              <td style="text-align: right;">${e.percentage}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    <div class="footer">
      <p>SNSMON-AI - Social Media Monitoring System</p>
      <p>Kejaksaan Agung Republik Indonesia</p>
      <p>This report is confidential and intended for authorized personnel only.</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Export report as PDF using browser print
 */
export function exportToPDF(data: ReportData, options: ExportOptions): void {
  const html = generateReportHTML(data, options);

  // Create a new window with the report content
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Export report data as CSV
 */
export function exportToCSV(data: ReportData, section: string): void {
  let csvContent = "";
  let filename = "";

  switch (section) {
    case "summary":
      csvContent = "Metric,Value\n";
      csvContent += `Total Mentions,${data.summary.totalMentions}\n`;
      csvContent += `Total Reach,${data.summary.totalReach}\n`;
      csvContent += `Average Sentiment,${data.summary.avgSentiment}\n`;
      csvContent += `Unique Authors,${data.summary.uniqueAuthors}\n`;
      csvContent += `Positive %,${data.sentimentBreakdown.positive}\n`;
      csvContent += `Negative %,${data.sentimentBreakdown.negative}\n`;
      csvContent += `Neutral %,${data.sentimentBreakdown.neutral}\n`;
      filename = "summary.csv";
      break;

    case "platforms":
      csvContent = "Platform,Mentions,Percentage\n";
      data.platformData.forEach(p => {
        csvContent += `${p.name},${p.mentions},${p.percentage}\n`;
      });
      filename = "platforms.csv";
      break;

    case "keywords":
      csvContent = "Keyword,Count,Sentiment\n";
      data.topKeywords.forEach(k => {
        csvContent += `${k.keyword},${k.count},${k.sentiment}\n`;
      });
      filename = "keywords.csv";
      break;

    case "influencers":
      csvContent = "Name,Username,Followers,Mentions\n";
      data.topInfluencers.forEach(i => {
        csvContent += `${i.name},@${i.username},${i.followers},${i.mentions}\n`;
      });
      filename = "influencers.csv";
      break;

    case "regions":
      csvContent = "Region,Mentions,Sentiment\n";
      data.regionData.forEach(r => {
        csvContent += `${r.region},${r.mentions},${r.sentiment}\n`;
      });
      filename = "regions.csv";
      break;

    default:
      return;
  }

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `snsmon_${filename}`;
  link.click();
}

/**
 * Generate sample report data for testing
 */
export function generateSampleReportData(): ReportData {
  return {
    title: "Social Media Monitoring Report",
    subtitle: "Weekly Analysis Summary",
    dateRange: {
      start: "January 22, 2024",
      end: "January 28, 2024",
    },
    summary: {
      totalMentions: 2877000,
      totalReach: 567000000,
      avgSentiment: -0.18,
      uniqueAuthors: 735000,
    },
    sentimentBreakdown: {
      positive: 38,
      negative: 35,
      neutral: 27,
    },
    platformData: [
      { name: "X (Twitter)", mentions: 1356000, percentage: 47 },
      { name: "Instagram", mentions: 963000, percentage: 33 },
      { name: "Facebook", mentions: 855000, percentage: 30 },
      { name: "TikTok", mentions: 744000, percentage: 26 },
      { name: "YouTube", mentions: 369000, percentage: 13 },
    ],
    topKeywords: [
      { keyword: "Pemerintah", count: 462600, sentiment: -0.15 },
      { keyword: "Ekonomi", count: 369000, sentiment: -0.28 },
      { keyword: "Pendidikan", count: 294000, sentiment: 0.12 },
      { keyword: "Kesehatan", count: 261000, sentiment: 0.25 },
      { keyword: "Infrastruktur", count: 228000, sentiment: 0.08 },
      { keyword: "Korupsi", count: 195000, sentiment: -0.65 },
      { keyword: "Lingkungan", count: 162000, sentiment: 0.18 },
      { keyword: "Keamanan", count: 144000, sentiment: -0.35 },
    ],
    topInfluencers: [
      { name: "Najwa Shihab", username: "najwashihab", followers: 15200000, mentions: 70230 },
      { name: "Erick Thohir", username: "eikikodir", followers: 8900000, mentions: 56760 },
      { name: "Ridwan Kamil", username: "ridwankamil", followers: 12500000, mentions: 49620 },
      { name: "Anies Baswedan", username: "aniesbaswedan", followers: 9800000, mentions: 42960 },
      { name: "Ganjar Pranowo", username: "gaborpranowo", followers: 7600000, mentions: 38610 },
    ],
    regionData: [
      { region: "DKI Jakarta", mentions: 1356000, sentiment: -0.35 },
      { region: "East Java", mentions: 867000, sentiment: -0.28 },
      { region: "West Java", mentions: 963000, sentiment: -0.15 },
      { region: "Central Java", mentions: 555000, sentiment: 0.12 },
      { region: "North Sumatra", mentions: 426000, sentiment: 0.05 },
    ],
    crisisEvents: [
      { date: "2024-01-25", title: "Protest in Central Jakarta", severity: "Critical", region: "DKI Jakarta" },
      { date: "2024-01-23", title: "Flood in East Java", severity: "High", region: "East Java" },
      { date: "2024-01-22", title: "Economic Policy Backlash", severity: "High", region: "National" },
    ],
    emotionData: [
      { emotion: "Anger", emotionId: "Kemarahan", value: 126000, percentage: 15.2 },
      { emotion: "Fear", emotionId: "Ketakutan", value: 114000, percentage: 13.8 },
      { emotion: "Sadness", emotionId: "Kesedihan", value: 96000, percentage: 11.6 },
      { emotion: "Joy", emotionId: "Kegembiraan", value: 87000, percentage: 10.5 },
      { emotion: "Trust", emotionId: "Kepercayaan", value: 78000, percentage: 9.4 },
      { emotion: "Disgust", emotionId: "Jijik", value: 72000, percentage: 8.7 },
      { emotion: "Surprise", emotionId: "Kejutan", value: 63000, percentage: 7.6 },
      { emotion: "Anticipation", emotionId: "Antisipasi", value: 57000, percentage: 6.9 },
      { emotion: "Frustration", emotionId: "Frustrasi", value: 51000, percentage: 6.2 },
      { emotion: "Hope", emotionId: "Harapan", value: 45000, percentage: 5.4 },
      { emotion: "Anxiety", emotionId: "Kecemasan", value: 39000, percentage: 4.7 },
      { emotion: "Love", emotionId: "Cinta", value: 33000, percentage: 4.0 },
    ],
  };
}
