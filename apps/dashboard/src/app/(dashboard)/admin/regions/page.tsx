"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  MapPin,
  Check,
  X,
  ChevronRight,
  Globe,
  Building,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

interface Province {
  code: string;
  name: string;
  capital: string;
  isEnabled: boolean;
  customThresholds?: {
    crisisScore: number;
    sentimentDrop: number;
    volumeSpike: number;
  };
}

interface Country {
  code: string;
  name: string;
  isEnabled: boolean;
  provinces: Province[];
}

// Mock data
const countries: Country[] = [
  {
    code: "ID",
    name: "Indonesia",
    isEnabled: true,
    provinces: [
      { code: "31", name: "DKI Jakarta", capital: "Jakarta", isEnabled: true, customThresholds: { crisisScore: 60, sentimentDrop: 30, volumeSpike: 150 } },
      { code: "32", name: "West Java", capital: "Bandung", isEnabled: true },
      { code: "33", name: "Central Java", capital: "Semarang", isEnabled: true },
      { code: "34", name: "DI Yogyakarta", capital: "Yogyakarta", isEnabled: true },
      { code: "35", name: "East Java", capital: "Surabaya", isEnabled: true, customThresholds: { crisisScore: 65, sentimentDrop: 35, volumeSpike: 180 } },
      { code: "36", name: "Banten", capital: "Serang", isEnabled: true },
      { code: "51", name: "Bali", capital: "Denpasar", isEnabled: true },
      { code: "11", name: "Aceh", capital: "Banda Aceh", isEnabled: true },
      { code: "12", name: "North Sumatra", capital: "Medan", isEnabled: true },
      { code: "13", name: "West Sumatra", capital: "Padang", isEnabled: true },
      { code: "14", name: "Riau", capital: "Pekanbaru", isEnabled: true },
      { code: "15", name: "Jambi", capital: "Jambi", isEnabled: false },
      { code: "16", name: "South Sumatra", capital: "Palembang", isEnabled: true },
      { code: "17", name: "Bengkulu", capital: "Bengkulu", isEnabled: false },
      { code: "18", name: "Lampung", capital: "Bandar Lampung", isEnabled: true },
      { code: "19", name: "Bangka Belitung", capital: "Pangkal Pinang", isEnabled: false },
      { code: "21", name: "Riau Islands", capital: "Tanjung Pinang", isEnabled: true },
      { code: "61", name: "West Kalimantan", capital: "Pontianak", isEnabled: true },
      { code: "62", name: "Central Kalimantan", capital: "Palangka Raya", isEnabled: false },
      { code: "63", name: "South Kalimantan", capital: "Banjarmasin", isEnabled: true },
      { code: "64", name: "East Kalimantan", capital: "Samarinda", isEnabled: true },
      { code: "65", name: "North Kalimantan", capital: "Tanjung Selor", isEnabled: false },
      { code: "71", name: "North Sulawesi", capital: "Manado", isEnabled: true },
      { code: "72", name: "Central Sulawesi", capital: "Palu", isEnabled: true },
      { code: "73", name: "South Sulawesi", capital: "Makassar", isEnabled: true },
      { code: "74", name: "Southeast Sulawesi", capital: "Kendari", isEnabled: false },
      { code: "75", name: "Gorontalo", capital: "Gorontalo", isEnabled: false },
      { code: "76", name: "West Sulawesi", capital: "Mamuju", isEnabled: false },
      { code: "81", name: "Maluku", capital: "Ambon", isEnabled: true },
      { code: "82", name: "North Maluku", capital: "Sofifi", isEnabled: false },
      { code: "91", name: "West Papua", capital: "Manokwari", isEnabled: true },
      { code: "94", name: "Papua", capital: "Jayapura", isEnabled: true },
      { code: "52", name: "West Nusa Tenggara", capital: "Mataram", isEnabled: true },
      { code: "53", name: "East Nusa Tenggara", capital: "Kupang", isEnabled: true },
    ],
  },
  {
    code: "MY",
    name: "Malaysia",
    isEnabled: false,
    provinces: [],
  },
  {
    code: "SG",
    name: "Singapore",
    isEnabled: false,
    provinces: [],
  },
];

export default function RegionsPage() {
  const { t } = useTranslation();
  const [countriesData, setCountriesData] = useState<Country[]>(countries);
  const [selectedCountry, setSelectedCountry] = useState<string>("ID");
  const [selectedProvince, setSelectedProvince] = useState<string | null>("31");
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [editingThresholds, setEditingThresholds] = useState({
    crisisScore: 70,
    sentimentDrop: 40,
    volumeSpike: 200,
  });

  const country = countriesData.find((c) => c.code === selectedCountry);
  const enabledProvinces = country?.provinces.filter((p) => p.isEnabled) || [];
  const disabledProvinces = country?.provinces.filter((p) => !p.isEnabled) || [];
  const selectedProvinceData = country?.provinces.find((p) => p.code === selectedProvince);

  // Toggle province enabled state
  const handleToggleProvince = (provinceCode: string) => {
    setCountriesData(prev => prev.map(c =>
      c.code === selectedCountry
        ? {
            ...c,
            provinces: c.provinces.map(p =>
              p.code === provinceCode ? { ...p, isEnabled: !p.isEnabled } : p
            )
          }
        : c
    ));
  };

  // Select all provinces
  const handleSelectAll = () => {
    const allEnabled = country?.provinces.every(p => p.isEnabled);
    setCountriesData(prev => prev.map(c =>
      c.code === selectedCountry
        ? {
            ...c,
            provinces: c.provinces.map(p => ({ ...p, isEnabled: !allEnabled }))
          }
        : c
    ));
  };

  // Save custom thresholds
  const handleSaveThresholds = () => {
    if (!selectedProvince) return;
    setCountriesData(prev => prev.map(c =>
      c.code === selectedCountry
        ? {
            ...c,
            provinces: c.provinces.map(p =>
              p.code === selectedProvince
                ? { ...p, customThresholds: { ...editingThresholds } }
                : p
            )
          }
        : c
    ));
    setIsThresholdDialogOpen(false);
  };

  // Reset to default thresholds
  const handleResetThresholds = () => {
    if (!selectedProvince) return;
    setCountriesData(prev => prev.map(c =>
      c.code === selectedCountry
        ? {
            ...c,
            provinces: c.provinces.map(p =>
              p.code === selectedProvince
                ? { ...p, customThresholds: undefined }
                : p
            )
          }
        : c
    ));
  };

  // Open threshold dialog
  const openThresholdDialog = () => {
    if (selectedProvinceData?.customThresholds) {
      setEditingThresholds(selectedProvinceData.customThresholds);
    } else {
      setEditingThresholds({ crisisScore: 70, sentimentDrop: 40, volumeSpike: 200 });
    }
    setIsThresholdDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{countries.filter((c) => c.isEnabled).length}</p>
                <p className="text-xs text-muted-foreground">Active Countries</p>
              </div>
              <Globe className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{enabledProvinces.length}</p>
                <p className="text-xs text-muted-foreground">Active Provinces</p>
              </div>
              <MapPin className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{disabledProvinces.length}</p>
                <p className="text-xs text-muted-foreground">Disabled Provinces</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {country?.provinces.filter((p) => p.customThresholds).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Custom Thresholds</p>
              </div>
              <Building className="h-8 w-8 text-severity-medium/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Country Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Countries</CardTitle>
            <CardDescription>Select a country to manage regions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {countries.map((c) => (
                <div
                  key={c.code}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedCountry === c.code && "bg-muted"
                  )}
                  onClick={() => setSelectedCountry(c.code)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      c.isEnabled ? "bg-success" : "bg-muted-foreground"
                    )} />
                    <span className="font-medium">{c.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {c.provinces.filter((p) => p.isEnabled).length} active
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Province List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Provinces/States</CardTitle>
                <CardDescription>{country?.name} - {country?.provinces.length} total</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                {country?.provinces.every(p => p.isEnabled) ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              <div className="divide-y">
                {country?.provinces
                  .sort((a, b) => {
                    if (a.isEnabled !== b.isEnabled) return a.isEnabled ? -1 : 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((province) => (
                    <div
                      key={province.code}
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedProvince === province.code && "bg-muted",
                        !province.isEnabled && "opacity-60"
                      )}
                      onClick={() => setSelectedProvince(province.code)}
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleProvince(province.code);
                          }}
                        >
                          {province.isEnabled ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <div>
                          <p className="font-medium text-sm">{province.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {province.capital}
                          </p>
                        </div>
                      </div>
                      {province.customThresholds && (
                        <Badge variant="outline" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Province Details */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedProvinceData?.name || "Select a Province"}
                </CardTitle>
                {selectedProvinceData && (
                  <CardDescription>
                    Capital: {selectedProvinceData.capital}
                  </CardDescription>
                )}
              </div>
              {selectedProvinceData && (
                <Button size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedProvinceData ? (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monitoring Status</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedProvinceData.isEnabled
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {selectedProvinceData.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <Separator />

                {/* Thresholds */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Alert Thresholds</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Crisis Score</span>
                      <span className="font-medium">
                        {selectedProvinceData.customThresholds?.crisisScore || 70}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sentiment Drop (%)</span>
                      <span className="font-medium">
                        {selectedProvinceData.customThresholds?.sentimentDrop || 40}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Volume Spike (%)</span>
                      <span className="font-medium">
                        {selectedProvinceData.customThresholds?.volumeSpike || 200}%
                      </span>
                    </div>
                  </div>

                  {selectedProvinceData.customThresholds ? (
                    <Badge variant="outline" className="w-full justify-center">
                      Using Custom Thresholds
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="w-full justify-center">
                      Using Default Thresholds
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={openThresholdDialog}>
                    Configure Custom Thresholds
                  </Button>
                  {selectedProvinceData.customThresholds && (
                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground"
                      onClick={handleResetThresholds}
                    >
                      Reset to Default Thresholds
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" disabled>
                    Add Regional Keywords
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Set Alert Recipients
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a province to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Threshold Configuration Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Alert Thresholds</DialogTitle>
            <DialogDescription>
              Set custom thresholds for {selectedProvinceData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Crisis Score Threshold</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editingThresholds.crisisScore}
                  onChange={(e) => setEditingThresholds({
                    ...editingThresholds,
                    crisisScore: parseInt(e.target.value) || 0
                  })}
                />
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <p className="text-xs text-muted-foreground">Alert when crisis score exceeds this value</p>
            </div>
            <div className="space-y-2">
              <Label>Sentiment Drop (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editingThresholds.sentimentDrop}
                  onChange={(e) => setEditingThresholds({
                    ...editingThresholds,
                    sentimentDrop: parseInt(e.target.value) || 0
                  })}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Alert when sentiment drops by this percentage</p>
            </div>
            <div className="space-y-2">
              <Label>Volume Spike (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  value={editingThresholds.volumeSpike}
                  onChange={(e) => setEditingThresholds({
                    ...editingThresholds,
                    volumeSpike: parseInt(e.target.value) || 0
                  })}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Alert when mention volume increases by this percentage</p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsThresholdDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveThresholds}>
                <Save className="mr-2 h-4 w-4" />
                Save Thresholds
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
