"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  AlertTriangle,
  Building2,
  Target,
  Hash,
  ToggleLeft,
  ToggleRight,
  Skull,
  CloudRain,
  Car,
  Shield,
  Landmark,
  TrendingDown,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

interface Keyword {
  id: string;
  term: string;
  variants: string[];
  weight: number;
  language: "id" | "en" | "both";
  isActive: boolean;
}

interface KeywordCategory {
  id: string;
  name: string;
  nameId: string;
  description: string;
  type: "crisis" | "brand" | "competitor" | "custom";
  icon: string;
  keywords: Keyword[];
  isActive: boolean;
}

// Complete Indonesian Crisis Keywords as defined in the plan
const keywordCategories: KeywordCategory[] = [
  {
    id: "civil_unrest",
    name: "Civil Unrest",
    nameId: "Kerusuhan Sipil",
    description: "Keywords related to riots, demonstrations, and civil disturbances",
    type: "crisis",
    icon: "alert",
    isActive: true,
    keywords: [
      { id: "cu-1", term: "kerusuhan", variants: ["rusuh", "merusuh"], weight: 10, language: "id", isActive: true },
      { id: "cu-2", term: "demonstrasi", variants: ["demo"], weight: 9, language: "id", isActive: true },
      { id: "cu-3", term: "protes", variants: ["memprotes"], weight: 8, language: "id", isActive: true },
      { id: "cu-4", term: "aksi massa", variants: ["massa"], weight: 9, language: "id", isActive: true },
      { id: "cu-5", term: "unjuk rasa", variants: ["berunjuk rasa"], weight: 9, language: "id", isActive: true },
      { id: "cu-6", term: "bentrok", variants: ["bentrokan"], weight: 10, language: "id", isActive: true },
      { id: "cu-7", term: "ricuh", variants: ["kericuhan"], weight: 9, language: "id", isActive: true },
      { id: "cu-8", term: "anarkis", variants: ["anarkisme", "anarki"], weight: 10, language: "id", isActive: true },
    ],
  },
  {
    id: "violence",
    name: "Violence",
    nameId: "Kekerasan",
    description: "Keywords related to violent incidents and casualties",
    type: "crisis",
    icon: "skull",
    isActive: true,
    keywords: [
      { id: "vi-1", term: "tewas", variants: ["meninggal", "mati"], weight: 10, language: "id", isActive: true },
      { id: "vi-2", term: "korban jiwa", variants: ["korban meninggal"], weight: 10, language: "id", isActive: true },
      { id: "vi-3", term: "luka-luka", variants: ["terluka", "cedera"], weight: 8, language: "id", isActive: true },
      { id: "vi-4", term: "berdarah", variants: ["pendarahan"], weight: 9, language: "id", isActive: true },
      { id: "vi-5", term: "penembakan", variants: ["ditembak", "tembak"], weight: 10, language: "id", isActive: true },
      { id: "vi-6", term: "pembunuhan", variants: ["dibunuh", "membunuh"], weight: 10, language: "id", isActive: true },
      { id: "vi-7", term: "penusukan", variants: ["ditusuk", "tusuk"], weight: 9, language: "id", isActive: true },
      { id: "vi-8", term: "kekerasan", variants: ["KDRT", "penganiayaan"], weight: 9, language: "id", isActive: true },
    ],
  },
  {
    id: "natural_disaster",
    name: "Natural Disaster",
    nameId: "Bencana Alam",
    description: "Keywords for natural disasters and emergencies",
    type: "crisis",
    icon: "cloud",
    isActive: true,
    keywords: [
      { id: "nd-1", term: "gempa", variants: ["gempa bumi", "guncangan"], weight: 10, language: "id", isActive: true },
      { id: "nd-2", term: "banjir", variants: ["kebanjiran", "banjir bandang"], weight: 9, language: "id", isActive: true },
      { id: "nd-3", term: "tsunami", variants: [], weight: 10, language: "both", isActive: true },
      { id: "nd-4", term: "longsor", variants: ["tanah longsor"], weight: 9, language: "id", isActive: true },
      { id: "nd-5", term: "gunung meletus", variants: ["erupsi", "letusan"], weight: 10, language: "id", isActive: true },
      { id: "nd-6", term: "kebakaran hutan", variants: ["karhutla"], weight: 9, language: "id", isActive: true },
      { id: "nd-7", term: "bencana alam", variants: ["bencana"], weight: 8, language: "id", isActive: true },
    ],
  },
  {
    id: "incidents",
    name: "Incidents & Accidents",
    nameId: "Kecelakaan & Insiden",
    description: "Keywords for accidents and incidents",
    type: "crisis",
    icon: "car",
    isActive: true,
    keywords: [
      { id: "in-1", term: "kecelakaan", variants: ["lakalantas", "laka"], weight: 8, language: "id", isActive: true },
      { id: "in-2", term: "tabrakan", variants: ["bertabrakan", "nabrak"], weight: 8, language: "id", isActive: true },
      { id: "in-3", term: "pesawat jatuh", variants: ["kecelakaan pesawat"], weight: 10, language: "id", isActive: true },
      { id: "in-4", term: "kapal tenggelam", variants: ["kapal karam"], weight: 10, language: "id", isActive: true },
      { id: "in-5", term: "kebakaran", variants: ["terbakar", "membakar"], weight: 9, language: "id", isActive: true },
      { id: "in-6", term: "ledakan", variants: ["meledak", "ledak"], weight: 10, language: "id", isActive: true },
      { id: "in-7", term: "runtuh", variants: ["ambruk", "roboh"], weight: 9, language: "id", isActive: true },
    ],
  },
  {
    id: "government",
    name: "Government & Public",
    nameId: "Pemerintah & Publik",
    description: "Keywords related to government and public institutions",
    type: "crisis",
    icon: "landmark",
    isActive: true,
    keywords: [
      { id: "go-1", term: "korupsi", variants: ["koruptor"], weight: 9, language: "id", isActive: true },
      { id: "go-2", term: "suap", variants: ["penyuapan", "menyuap"], weight: 9, language: "id", isActive: true },
      { id: "go-3", term: "penangkapan", variants: ["ditangkap", "tangkap"], weight: 8, language: "id", isActive: true },
      { id: "go-4", term: "OTT", variants: ["operasi tangkap tangan"], weight: 10, language: "id", isActive: true },
      { id: "go-5", term: "KPK", variants: ["komisi pemberantasan korupsi"], weight: 8, language: "id", isActive: true },
      { id: "go-6", term: "kejaksaan", variants: ["jaksa", "kejagung"], weight: 8, language: "id", isActive: true },
      { id: "go-7", term: "pengadilan", variants: ["sidang", "persidangan"], weight: 7, language: "id", isActive: true },
      { id: "go-8", term: "vonis", variants: ["divonis", "hukuman"], weight: 8, language: "id", isActive: true },
    ],
  },
  {
    id: "security",
    name: "Security & Terror",
    nameId: "Keamanan & Teror",
    description: "Keywords related to terrorism and security threats",
    type: "crisis",
    icon: "shield",
    isActive: true,
    keywords: [
      { id: "se-1", term: "teror", variants: ["meneror"], weight: 10, language: "id", isActive: true },
      { id: "se-2", term: "teroris", variants: ["terorisme"], weight: 10, language: "id", isActive: true },
      { id: "se-3", term: "bom", variants: ["pemboman", "meledak"], weight: 10, language: "id", isActive: true },
      { id: "se-4", term: "ancaman", variants: ["mengancam", "diancam"], weight: 8, language: "id", isActive: true },
      { id: "se-5", term: "penyanderaan", variants: ["sandera", "disandera"], weight: 10, language: "id", isActive: true },
      { id: "se-6", term: "penculikan", variants: ["diculik", "culik"], weight: 9, language: "id", isActive: true },
      { id: "se-7", term: "radikalisme", variants: ["radikal"], weight: 9, language: "id", isActive: true },
      { id: "se-8", term: "ekstremisme", variants: ["ekstremis"], weight: 9, language: "id", isActive: true },
    ],
  },
  {
    id: "economic",
    name: "Economic Crisis",
    nameId: "Krisis Ekonomi",
    description: "Keywords related to economic and financial crises",
    type: "crisis",
    icon: "trending",
    isActive: true,
    keywords: [
      { id: "ec-1", term: "PHK", variants: ["pemutusan hubungan kerja", "dipecat"], weight: 9, language: "id", isActive: true },
      { id: "ec-2", term: "inflasi", variants: ["kenaikan harga"], weight: 8, language: "id", isActive: true },
      { id: "ec-3", term: "resesi", variants: ["krisis ekonomi"], weight: 9, language: "id", isActive: true },
      { id: "ec-4", term: "krisis", variants: ["darurat"], weight: 8, language: "id", isActive: true },
      { id: "ec-5", term: "bangkrut", variants: ["kebangkrutan", "pailit"], weight: 9, language: "id", isActive: true },
      { id: "ec-6", term: "utang", variants: ["hutang", "berutang"], weight: 7, language: "id", isActive: true },
      { id: "ec-7", term: "default", variants: ["gagal bayar"], weight: 9, language: "both", isActive: true },
      { id: "ec-8", term: "devaluasi", variants: ["pelemahan rupiah"], weight: 8, language: "id", isActive: true },
    ],
  },
  {
    id: "brand_kejaksaan",
    name: "Kejaksaan RI",
    nameId: "Kejaksaan Republik Indonesia",
    description: "Brand monitoring for Attorney General's Office of Indonesia",
    type: "brand",
    icon: "building",
    isActive: true,
    keywords: [
      { id: "br-1", term: "Kejaksaan Agung", variants: ["Kejagung"], weight: 10, language: "id", isActive: true },
      { id: "br-2", term: "Jaksa Agung", variants: ["Jaksa Agung RI"], weight: 10, language: "id", isActive: true },
      { id: "br-3", term: "Kejaksaan Tinggi", variants: ["Kejati"], weight: 9, language: "id", isActive: true },
      { id: "br-4", term: "Kejaksaan Negeri", variants: ["Kejari"], weight: 8, language: "id", isActive: true },
      { id: "br-5", term: "Jaksa Penuntut Umum", variants: ["JPU"], weight: 8, language: "id", isActive: true },
    ],
  },
];

const getCategoryIcon = (iconType: string) => {
  switch (iconType) {
    case "alert":
      return AlertTriangle;
    case "skull":
      return Skull;
    case "cloud":
      return CloudRain;
    case "car":
      return Car;
    case "landmark":
      return Landmark;
    case "shield":
      return Shield;
    case "trending":
      return TrendingDown;
    case "building":
      return Building2;
    case "target":
      return Target;
    default:
      return Hash;
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "crisis":
      return "text-severity-critical bg-severity-critical/10";
    case "brand":
      return "text-primary bg-primary/10";
    case "competitor":
      return "text-severity-medium bg-severity-medium/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

export default function KeywordsPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<KeywordCategory[]>(keywordCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("civil_unrest");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditKeywordDialogOpen, setIsEditKeywordDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [newKeyword, setNewKeyword] = useState({ term: "", variants: "", weight: 8 });
  const [newCategory, setNewCategory] = useState({ name: "", nameId: "", description: "", type: "custom" as const });

  const crisisCategories = categories.filter((c) => c.type === "crisis");
  const brandCategories = categories.filter((c) => c.type === "brand");
  const customCategories = categories.filter((c) => c.type === "custom");
  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  // Toggle category active state
  const handleToggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  // Toggle keyword active state
  const handleToggleKeyword = (keywordId: string) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      keywords: cat.keywords.map(kw =>
        kw.id === keywordId ? { ...kw, isActive: !kw.isActive } : kw
      )
    })));
  };

  // Add new keyword
  const handleAddKeyword = () => {
    if (!selectedCategory || !newKeyword.term.trim()) return;

    const keyword: Keyword = {
      id: `kw-${Date.now()}`,
      term: newKeyword.term.trim(),
      variants: newKeyword.variants.split(",").map(v => v.trim()).filter(Boolean),
      weight: newKeyword.weight,
      language: "id",
      isActive: true,
    };

    setCategories(prev => prev.map(cat =>
      cat.id === selectedCategory
        ? { ...cat, keywords: [...cat.keywords, keyword] }
        : cat
    ));
    setNewKeyword({ term: "", variants: "", weight: 8 });
    setIsAddDialogOpen(false);
  };

  // Edit keyword
  const handleEditKeyword = () => {
    if (!editingKeyword || !selectedCategory) return;

    setCategories(prev => prev.map(cat =>
      cat.id === selectedCategory
        ? {
            ...cat,
            keywords: cat.keywords.map(kw =>
              kw.id === editingKeyword.id ? editingKeyword : kw
            )
          }
        : cat
    ));
    setEditingKeyword(null);
    setIsEditKeywordDialogOpen(false);
  };

  // Delete keyword
  const handleDeleteKeyword = (keywordId: string) => {
    if (!selectedCategory) return;

    setCategories(prev => prev.map(cat =>
      cat.id === selectedCategory
        ? { ...cat, keywords: cat.keywords.filter(kw => kw.id !== keywordId) }
        : cat
    ));
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: KeywordCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name.trim(),
      nameId: newCategory.nameId.trim() || newCategory.name.trim(),
      description: newCategory.description.trim(),
      type: newCategory.type,
      icon: "hash",
      keywords: [],
      isActive: true,
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: "", nameId: "", description: "", type: "custom" });
    setIsAddCategoryDialogOpen(false);
    setSelectedCategory(category.id);
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  const totalKeywords = categories.reduce((sum, c) => sum + c.keywords.length, 0);
  const activeKeywords = categories.reduce(
    (sum, c) => sum + c.keywords.filter((k) => k.isActive).length,
    0
  );

  const renderCategoryCard = (category: KeywordCategory) => {
    const Icon = getCategoryIcon(category.icon);
    const isSelected = selectedCategory === category.id;

    return (
      <Card
        key={category.id}
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => setSelectedCategory(category.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={cn("rounded-lg p-2", getCategoryColor(category.type))}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  {category.isActive ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{category.nameId}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {category.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {category.keywords.length} keywords
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.keywords.filter((k) => k.isActive).length} active
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCategory(category.id);
              }}
            >
              {category.isActive ? (
                <ToggleRight className="h-5 w-5 text-success" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <p className="text-2xl font-bold">{keywordCategories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Crisis Categories</p>
            <p className="text-2xl font-bold text-severity-critical">{crisisCategories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Keywords</p>
            <p className="text-2xl font-bold">{totalKeywords}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Keywords</p>
            <p className="text-2xl font-bold text-success">{activeKeywords}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="crisis" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="crisis" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t.admin.keywords.crisisKeywords}
              <Badge variant="secondary" className="ml-1">
                {crisisCategories.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="brand" className="gap-2">
              <Building2 className="h-4 w-4" />
              {t.admin.keywords.brandKeywords}
              <Badge variant="secondary" className="ml-1">
                {brandCategories.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-2">
              <Hash className="h-4 w-4" />
              {t.admin.keywords.customKeywords}
            </TabsTrigger>
          </TabsList>
          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new keyword category for monitoring
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="catName">Category Name</Label>
                  <Input
                    id="catName"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catNameId">Indonesian Name (optional)</Label>
                  <Input
                    id="catNameId"
                    placeholder="Enter Indonesian name"
                    value={newCategory.nameId}
                    onChange={(e) => setNewCategory({ ...newCategory, nameId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catDesc">Description</Label>
                  <Input
                    id="catDesc"
                    placeholder="Enter category description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>
                    <Save className="mr-2 h-4 w-4" />
                    Create Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Categories List */}
          <div className="space-y-4">
            <TabsContent value="crisis" className="space-y-3 mt-0">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {crisisCategories.map(renderCategoryCard)}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="brand" className="space-y-3 mt-0">
              {brandCategories.map(renderCategoryCard)}
            </TabsContent>
            <TabsContent value="custom" className="mt-0">
              {customCategories.length > 0 ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {customCategories.map(renderCategoryCard)}
                  </div>
                </ScrollArea>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Hash className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No Custom Categories</p>
                    <p className="text-sm">Create custom keyword categories for specific monitoring needs</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsAddCategoryDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Category
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>

          {/* Keyword Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedCategoryData?.name || "Select a Category"}
                    {selectedCategoryData && (
                      <Badge variant="outline" className={getCategoryColor(selectedCategoryData.type)}>
                        {selectedCategoryData.type}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedCategoryData?.description || "Choose a category to view and edit keywords"}
                  </CardDescription>
                </div>
                {selectedCategoryData && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Keyword
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Keyword</DialogTitle>
                        <DialogDescription>
                          Add a new keyword to {selectedCategoryData.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="term">Keyword Term</Label>
                          <Input
                            id="term"
                            placeholder="Enter keyword"
                            value={newKeyword.term}
                            onChange={(e) => setNewKeyword({ ...newKeyword, term: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="variants">Variants (comma-separated)</Label>
                          <Input
                            id="variants"
                            placeholder="variant1, variant2, variant3"
                            value={newKeyword.variants}
                            onChange={(e) => setNewKeyword({ ...newKeyword, variants: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (1-10)</Label>
                          <Input
                            id="weight"
                            type="number"
                            min={1}
                            max={10}
                            value={newKeyword.weight}
                            onChange={(e) => setNewKeyword({ ...newKeyword, weight: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddKeyword} disabled={!newKeyword.term.trim()}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Keyword
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCategoryData ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {selectedCategoryData.keywords.map((keyword) => (
                      <div
                        key={keyword.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          keyword.isActive ? "bg-card" : "bg-muted/30 opacity-60"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{keyword.term}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                keyword.weight >= 9
                                  ? "border-severity-critical/30 text-severity-critical"
                                  : keyword.weight >= 7
                                  ? "border-severity-medium/30 text-severity-medium"
                                  : ""
                              )}
                            >
                              Weight: {keyword.weight}
                            </Badge>
                            <Badge variant="secondary" className="text-xs uppercase">
                              {keyword.language}
                            </Badge>
                            {!keyword.isActive && (
                              <Badge variant="outline" className="text-xs">
                                Disabled
                              </Badge>
                            )}
                          </div>
                          {keyword.variants.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="text-xs text-muted-foreground mr-1">Variants:</span>
                              {keyword.variants.map((variant) => (
                                <Badge
                                  key={variant}
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  {variant}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingKeyword(keyword);
                              setIsEditKeywordDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteKeyword(keyword.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Select a category to view keywords</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Edit Keyword Dialog */}
      <Dialog open={isEditKeywordDialogOpen} onOpenChange={setIsEditKeywordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keyword</DialogTitle>
            <DialogDescription>
              Modify the keyword settings
            </DialogDescription>
          </DialogHeader>
          {editingKeyword && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTerm">Keyword Term</Label>
                <Input
                  id="editTerm"
                  value={editingKeyword.term}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, term: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVariants">Variants (comma-separated)</Label>
                <Input
                  id="editVariants"
                  value={editingKeyword.variants.join(", ")}
                  onChange={(e) => setEditingKeyword({
                    ...editingKeyword,
                    variants: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editWeight">Weight (1-10)</Label>
                <Input
                  id="editWeight"
                  type="number"
                  min={1}
                  max={10}
                  value={editingKeyword.weight}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, weight: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="editActive">Active</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingKeyword({ ...editingKeyword, isActive: !editingKeyword.isActive })}
                >
                  {editingKeyword.isActive ? (
                    <ToggleRight className="h-4 w-4 mr-2 text-success" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-2" />
                  )}
                  {editingKeyword.isActive ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditKeywordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditKeyword}>
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
