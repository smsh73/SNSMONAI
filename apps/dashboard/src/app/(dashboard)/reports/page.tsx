"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Eye,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  BarChart3,
  AlertTriangle,
  Users,
  Target,
  Map,
  Settings,
  FileDown,
  Table,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { exportToPDF, exportToCSV, generateSampleReportData, type ExportOptions } from "@/lib/pdf-export";
import { useTranslation } from "@/lib/i18n/context";

type ReportStatus = "completed" | "generating" | "scheduled" | "failed";
type ReportType = "sentiment" | "crisis" | "influencer" | "competitor" | "custom";

interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  completedAt?: string;
  scheduledAt?: string;
  size?: string;
  progress?: number;
  format: "pdf" | "excel" | "csv";
  author: string;
}

// Mock data
const reports: Report[] = [
  {
    id: "1",
    name: "Weekly Sentiment Analysis Report",
    type: "sentiment",
    status: "completed",
    createdAt: "2024-01-28 09:00",
    completedAt: "2024-01-28 09:15",
    size: "2.4 MB",
    format: "pdf",
    author: "System (Auto)",
  },
  {
    id: "2",
    name: "Crisis Monitoring Summary - January 2024",
    type: "crisis",
    status: "completed",
    createdAt: "2024-01-28 08:00",
    completedAt: "2024-01-28 08:22",
    size: "5.8 MB",
    format: "pdf",
    author: "Admin User",
  },
  {
    id: "3",
    name: "Top Influencers Report Q1 2024",
    type: "influencer",
    status: "generating",
    createdAt: "2024-01-28 10:30",
    progress: 65,
    format: "excel",
    author: "Admin User",
  },
  {
    id: "4",
    name: "Competitor Analysis - Government Agencies",
    type: "competitor",
    status: "scheduled",
    createdAt: "2024-01-27 14:00",
    scheduledAt: "2024-01-29 06:00",
    format: "pdf",
    author: "Admin User",
  },
  {
    id: "5",
    name: "Custom Report - Jakarta Region Focus",
    type: "custom",
    status: "completed",
    createdAt: "2024-01-27 11:00",
    completedAt: "2024-01-27 11:45",
    size: "3.2 MB",
    format: "pdf",
    author: "Admin User",
  },
  {
    id: "6",
    name: "Daily Mentions Export",
    type: "sentiment",
    status: "failed",
    createdAt: "2024-01-26 23:00",
    format: "csv",
    author: "System (Auto)",
  },
  {
    id: "7",
    name: "Monthly Executive Summary - December 2023",
    type: "sentiment",
    status: "completed",
    createdAt: "2024-01-01 00:00",
    completedAt: "2024-01-01 00:30",
    size: "8.5 MB",
    format: "pdf",
    author: "System (Auto)",
  },
];

const reportTemplates: { id: string; name: string; description: string; icon: LucideIcon; fields: string[] }[] = [
  {
    id: "1",
    name: "Sentiment Analysis",
    description: "Comprehensive sentiment breakdown with trends and insights",
    icon: BarChart3,
    fields: ["Date Range", "Platforms", "Keywords", "Regions"],
  },
  {
    id: "2",
    name: "Crisis Report",
    description: "Crisis events summary with timeline and response analysis",
    icon: AlertTriangle,
    fields: ["Date Range", "Severity Level", "Regions", "Keywords"],
  },
  {
    id: "3",
    name: "Influencer Analysis",
    description: "Top influencers, reach, and engagement metrics",
    icon: Users,
    fields: ["Date Range", "Platforms", "Min Followers", "Topics"],
  },
  {
    id: "4",
    name: "Competitor Benchmark",
    description: "Compare performance against competitor accounts",
    icon: Target,
    fields: ["Date Range", "Competitor Accounts", "Metrics"],
  },
  {
    id: "5",
    name: "Regional Analysis",
    description: "Geographic breakdown of social media activity",
    icon: Map,
    fields: ["Date Range", "Regions", "Platforms", "Keywords"],
  },
  {
    id: "6",
    name: "Custom Report",
    description: "Build your own report with custom parameters",
    icon: Settings,
    fields: ["All Parameters"],
  },
];

const getStatusIcon = (status: ReportStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "generating":
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-info" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
};

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success border-success/30";
    case "generating":
      return "bg-primary/10 text-primary border-primary/30";
    case "scheduled":
      return "bg-info/10 text-info border-info/30";
    case "failed":
      return "bg-destructive/10 text-destructive border-destructive/30";
  }
};

const getTypeLabel = (type: ReportType) => {
  const labels: Record<ReportType, string> = {
    sentiment: "Sentiment",
    crisis: "Crisis",
    influencer: "Influencer",
    competitor: "Competitor",
    custom: "Custom",
  };
  return labels[type];
};

export default function ReportsPage() {
  const { t } = useTranslation();
  const [reportsList, setReportsList] = useState<Report[]>(reports);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState("Social Media Monitoring Report");
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    includeKeywords: true,
    includeInfluencers: true,
    includeRegions: true,
    includeCrisis: true,
    includeEmotions: true,
  });

  const handleExport = () => {
    setIsGenerating(true);
    const reportData = generateSampleReportData();

    setTimeout(() => {
      if (exportOptions.format === "pdf") {
        exportToPDF(reportData, exportOptions);
      } else if (exportOptions.format === "csv") {
        exportToCSV(reportData, "summary");
        exportToCSV(reportData, "platforms");
        exportToCSV(reportData, "keywords");
        exportToCSV(reportData, "influencers");
        exportToCSV(reportData, "regions");
      }

      // Add to reports list
      const newReport: Report = {
        id: `report-${Date.now()}`,
        name: reportTitle,
        type: "custom",
        status: "completed",
        createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        completedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        size: "2.1 MB",
        format: exportOptions.format as "pdf" | "excel" | "csv",
        author: "Current User",
      };
      setReportsList(prev => [newReport, ...prev]);

      setIsGenerating(false);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  // Handle template click
  const handleTemplateClick = (template: typeof reportTemplates[0]) => {
    setReportTitle(`${template.name} Report`);
    setIsExportDialogOpen(true);
  };

  // Handle view report (download)
  const handleViewReport = (report: Report) => {
    if (report.status !== "completed") return;
    // In a real app, this would open the report in a viewer
    const reportData = generateSampleReportData();
    if (report.format === "pdf") {
      exportToPDF(reportData, exportOptions);
    }
  };

  // Handle download report
  const handleDownloadReport = (report: Report) => {
    if (report.status !== "completed") return;
    const reportData = generateSampleReportData();
    if (report.format === "pdf") {
      exportToPDF(reportData, exportOptions);
    } else if (report.format === "csv") {
      exportToCSV(reportData, "summary");
    }
  };

  // Handle delete report
  const handleDeleteReport = (reportId: string) => {
    setReportsList(prev => prev.filter(r => r.id !== reportId));
  };

  const filteredReports = reportsList.filter((report) => {
    if (searchQuery && !report.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTab !== "all" && report.status !== selectedTab) {
      return false;
    }
    return true;
  });

  const stats = {
    total: reportsList.length,
    completed: reportsList.filter((r) => r.status === "completed").length,
    generating: reportsList.filter((r) => r.status === "generating").length,
    scheduled: reportsList.filter((r) => r.status === "scheduled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.reports.title}</h1>
            <p className="text-muted-foreground">
              {t.reports.subtitle}
            </p>
          </div>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Configure and export your social media monitoring report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Report Title */}
              <div className="space-y-2">
                <Label>Report Title</Label>
                <Input
                  placeholder="Weekly Social Media Analysis"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" defaultValue="2024-01-22" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" defaultValue="2024-01-28" />
                </div>
              </div>

              {/* Export Format */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value: "pdf" | "excel" | "csv") =>
                    setExportOptions({ ...exportOptions, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileDown className="h-4 w-4" />
                        PDF Document
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        CSV (Multiple Files)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Options */}
              <div className="space-y-3">
                <Label>Include Sections</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="summary" className="font-normal cursor-pointer">
                      Executive Summary
                    </Label>
                    <Switch
                      id="summary"
                      checked={exportOptions.includeSummary}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeSummary: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="keywords" className="font-normal cursor-pointer">
                      Top Keywords
                    </Label>
                    <Switch
                      id="keywords"
                      checked={exportOptions.includeKeywords}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeKeywords: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="influencers" className="font-normal cursor-pointer">
                      Top Influencers
                    </Label>
                    <Switch
                      id="influencers"
                      checked={exportOptions.includeInfluencers}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeInfluencers: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="regions" className="font-normal cursor-pointer">
                      Regional Analysis
                    </Label>
                    <Switch
                      id="regions"
                      checked={exportOptions.includeRegions}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeRegions: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="crisis" className="font-normal cursor-pointer">
                      Crisis Events
                    </Label>
                    <Switch
                      id="crisis"
                      checked={exportOptions.includeCrisis}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeCrisis: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="emotions" className="font-normal cursor-pointer">
                      Emotion Analysis
                    </Label>
                    <Switch
                      id="emotions"
                      checked={exportOptions.includeEmotions}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeEmotions: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
              <FileText className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.generating}</p>
                <p className="text-xs text-muted-foreground">Generating</p>
              </div>
              <Loader2 className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-info">{stats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
              <Calendar className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Templates */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Report Templates</CardTitle>
            <CardDescription>Quick start with pre-built templates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="flex items-start gap-3">
                      <template.icon className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.fields.slice(0, 3).map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {template.fields.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.fields.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Reports</CardTitle>
                <CardDescription>View and download your reports</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-[200px] rounded-lg border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="generating">Generating</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[450px]">
                <div className="space-y-3">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(report.status)}
                          <div>
                            <p className="font-medium text-sm">{report.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(report.type)}
                              </Badge>
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(report.status))}>
                                {report.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.format.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created: {report.createdAt} · By: {report.author}
                            </p>
                            {report.status === "generating" && report.progress && (
                              <div className="mt-2 w-[200px]">
                                <Progress value={report.progress} className="h-1.5" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {report.progress}% complete
                                </p>
                              </div>
                            )}
                            {report.status === "scheduled" && report.scheduledAt && (
                              <p className="text-xs text-info mt-1">
                                Scheduled for: {report.scheduledAt}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.size && (
                            <span className="text-xs text-muted-foreground">{report.size}</span>
                          )}
                          {report.status === "completed" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewReport(report)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownloadReport(report)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-30" />
                      <p className="font-medium">No reports found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
