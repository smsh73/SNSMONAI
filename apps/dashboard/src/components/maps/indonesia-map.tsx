"use client";

import { useState, memo, useCallback, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, Loader2 } from "lucide-react";

// Indonesia GeoJSON local file
const INDONESIA_GEO_URL_LOCAL = "/geo/indonesia.geojson";

// Province name normalization map to handle different naming conventions in GeoJSON files
const PROVINCE_NAME_MAP: Record<string, string> = {
  // Mixed case and English variants (from current GeoJSON)
  "SPECIAL REGION OF ACEH": "Aceh",
  "WEST SUMATERA": "Sumatera Barat",
  "NORTH SUMATERA": "Sumatera Utara",
  "BANGKA BELITUNG ISLANDS": "Kepulauan Bangka Belitung",
  "SPECIAL REGION OF YOGYAKARTA": "DI Yogyakarta",
  "EAST JAVA": "Jawa Timur",
  "WEST JAVA": "Jawa Barat",
  "CENTRAL JAVA": "Jawa Tengah",
  "SOUTH KALIMANTAN": "Kalimantan Selatan",
  "WEST KALIMANTAN": "Kalimantan Barat",
  "CENTRAL KALIMANTAN": "Kalimantan Tengah",
  "EAST KALIMANTAN": "Kalimantan Timur",
  "NORTH KALIMANTAN": "Kalimantan Utara",
  "SPECIAL REGION OF WEST PAPUA": "Papua Barat",
  "SOUTH SULAWESI": "Sulawesi Selatan",
  "NORTH SULAWESI": "Sulawesi Utara",
  "CENTRAL SULAWESI": "Sulawesi Tengah",
  "SOUTH EAST SULAWESI": "Sulawesi Tenggara",
  "SOUTHEAST SULAWESI": "Sulawesi Tenggara",
  "WEST SULAWESI": "Sulawesi Barat",
  "SOUTH SUMATERA": "Sumatera Selatan",
  "WEST NUSA TENGGARA": "Nusa Tenggara Barat",
  "EAST NUSA TENGGARA": "Nusa Tenggara Timur",
  "WEST PAPUA": "Papua Barat",
  "NORTH MALUKU": "Maluku Utara",
  "RIAU ISLANDS": "Kepulauan Riau",
  // State names from GeoJSON (without spaces/hyphens)
  "BANGKA-BELITUNG": "Kepulauan Bangka Belitung",
  "JAKARTA": "DKI Jakarta",
  "JAKARTA RAYA": "DKI Jakarta",
  // Uppercase Indonesian variants
  "KALIMANTAN BARAT": "Kalimantan Barat",
  "KALIMANTAN TENGAH": "Kalimantan Tengah",
  "KALIMANTAN SELATAN": "Kalimantan Selatan",
  "KALIMANTAN TIMUR": "Kalimantan Timur",
  "KALIMANTAN UTARA": "Kalimantan Utara",
  "DKI JAKARTA": "DKI Jakarta",
  "JAWA BARAT": "Jawa Barat",
  "JAWA TENGAH": "Jawa Tengah",
  "JAWA TIMUR": "Jawa Timur",
  "DAERAH ISTIMEWA YOGYAKARTA": "DI Yogyakarta",
  "DI YOGYAKARTA": "DI Yogyakarta",
  "YOGYAKARTA": "DI Yogyakarta",
  "BANTEN": "Banten",
  "PROBANTEN": "Banten",
  "ACEH": "Aceh",
  "DI. ACEH": "Aceh",
  "DI ACEH": "Aceh",
  "NANGGROE ACEH DARUSSALAM": "Aceh",
  "SUMATERA UTARA": "Sumatera Utara",
  "SUMATERA BARAT": "Sumatera Barat",
  "RIAU": "Riau",
  "JAMBI": "Jambi",
  "SUMATERA SELATAN": "Sumatera Selatan",
  "BENGKULU": "Bengkulu",
  "LAMPUNG": "Lampung",
  "KEPULAUAN BANGKA BELITUNG": "Kepulauan Bangka Belitung",
  "BANGKA BELITUNG": "Kepulauan Bangka Belitung",
  "KEPULAUAN RIAU": "Kepulauan Riau",
  "SULAWESI UTARA": "Sulawesi Utara",
  "SULAWESI TENGAH": "Sulawesi Tengah",
  "SULAWESI SELATAN": "Sulawesi Selatan",
  "SULAWESI TENGGARA": "Sulawesi Tenggara",
  "GORONTALO": "Gorontalo",
  "SULAWESI BARAT": "Sulawesi Barat",
  "BALI": "Bali",
  "NUSA TENGGARA BARAT": "Nusa Tenggara Barat",
  "NUSATENGGARA BARAT": "Nusa Tenggara Barat",
  "NUSA TENGGARA TIMUR": "Nusa Tenggara Timur",
  "MALUKU": "Maluku",
  "MALUKU UTARA": "Maluku Utara",
  "PAPUA": "Papua",
  "PAPUA BARAT": "Papua Barat",
  "PAPUA SELATAN": "Papua Selatan",
  "PAPUA TENGAH": "Papua Tengah",
  "PAPUA PEGUNUNGAN": "Papua Pegunungan",
  "PAPUA BARAT DAYA": "Papua Barat Daya",
  "IRIAN JAYA TIMUR": "Papua",
  "IRIAN JAYA TENGAH": "Papua Tengah",
  "IRIAN JAYA BARAT": "Papua Barat",
};

// Normalize province name from GeoJSON
const normalizeProvinceName = (name: string): string => {
  if (!name) return "";
  const upperName = name.toUpperCase().trim();
  return PROVINCE_NAME_MAP[upperName] || name;
};

export interface RegionData {
  provinceCode: string;
  provinceName: string;
  crisisScore: number;
  mentions: number;
  sentiment: number;
}

interface MarkerData {
  name: string;
  coordinates: [number, number];
  alertLevel: "critical" | "high" | "medium" | "low" | "normal";
  mentions?: number;
}

type DrillDownLevel = "country" | "province";

interface IndonesiaMapProps {
  regionData?: RegionData[];
  markers?: MarkerData[];
  onRegionClick?: (region: RegionData | null) => void;
  onRegionDoubleClick?: (region: RegionData | null) => void;
  className?: string;
  enableDrillDown?: boolean;
}

const getRegionColor = (crisisScore: number) => {
  if (crisisScore >= 70) return "#EF4444"; // critical - red
  if (crisisScore >= 50) return "#F97316"; // high - orange
  if (crisisScore >= 30) return "#F59E0B"; // medium - amber
  if (crisisScore >= 15) return "#22C55E"; // low - green
  return "#6B7280"; // normal - gray
};

const getMarkerColor = (alertLevel: string) => {
  switch (alertLevel) {
    case "critical":
      return "#EF4444";
    case "high":
      return "#F97316";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#22C55E";
    default:
      return "#6B7280";
  }
};

// Complete Indonesia provinces data including Kalimantan (Borneo)
const defaultRegionData: RegionData[] = [
  // Java Island
  { provinceCode: "31", provinceName: "DKI Jakarta", crisisScore: 75, mentions: 45200, sentiment: -0.35 },
  { provinceCode: "32", provinceName: "Jawa Barat", crisisScore: 45, mentions: 32100, sentiment: -0.15 },
  { provinceCode: "33", provinceName: "Jawa Tengah", crisisScore: 28, mentions: 18500, sentiment: 0.12 },
  { provinceCode: "35", provinceName: "Jawa Timur", crisisScore: 62, mentions: 28900, sentiment: -0.28 },
  { provinceCode: "34", provinceName: "DI Yogyakarta", crisisScore: 22, mentions: 8400, sentiment: 0.25 },
  { provinceCode: "36", provinceName: "Banten", crisisScore: 38, mentions: 15600, sentiment: -0.08 },

  // Sumatra Island
  { provinceCode: "11", provinceName: "Aceh", crisisScore: 32, mentions: 9800, sentiment: -0.12 },
  { provinceCode: "12", provinceName: "Sumatera Utara", crisisScore: 35, mentions: 14200, sentiment: 0.05 },
  { provinceCode: "13", provinceName: "Sumatera Barat", crisisScore: 25, mentions: 7600, sentiment: 0.18 },
  { provinceCode: "14", provinceName: "Riau", crisisScore: 42, mentions: 11200, sentiment: -0.15 },
  { provinceCode: "15", provinceName: "Jambi", crisisScore: 20, mentions: 5400, sentiment: 0.22 },
  { provinceCode: "16", provinceName: "Sumatera Selatan", crisisScore: 38, mentions: 10800, sentiment: -0.08 },
  { provinceCode: "17", provinceName: "Bengkulu", crisisScore: 15, mentions: 3200, sentiment: 0.28 },
  { provinceCode: "18", provinceName: "Lampung", crisisScore: 30, mentions: 8900, sentiment: 0.05 },
  { provinceCode: "19", provinceName: "Kepulauan Bangka Belitung", crisisScore: 12, mentions: 2800, sentiment: 0.32 },
  { provinceCode: "21", provinceName: "Kepulauan Riau", crisisScore: 28, mentions: 6500, sentiment: 0.12 },

  // Kalimantan (Borneo) - Complete coverage
  { provinceCode: "61", provinceName: "Kalimantan Barat", crisisScore: 25, mentions: 6500, sentiment: 0.18 },
  { provinceCode: "62", provinceName: "Kalimantan Tengah", crisisScore: 35, mentions: 5800, sentiment: -0.05 },
  { provinceCode: "63", provinceName: "Kalimantan Selatan", crisisScore: 42, mentions: 8200, sentiment: -0.15 },
  { provinceCode: "64", provinceName: "Kalimantan Timur", crisisScore: 55, mentions: 12500, sentiment: -0.22 },
  { provinceCode: "65", provinceName: "Kalimantan Utara", crisisScore: 18, mentions: 3200, sentiment: 0.25 },

  // Sulawesi Island
  { provinceCode: "71", provinceName: "Sulawesi Utara", crisisScore: 22, mentions: 5400, sentiment: 0.18 },
  { provinceCode: "72", provinceName: "Sulawesi Tengah", crisisScore: 38, mentions: 6800, sentiment: -0.10 },
  { provinceCode: "73", provinceName: "Sulawesi Selatan", crisisScore: 42, mentions: 9800, sentiment: -0.12 },
  { provinceCode: "74", provinceName: "Sulawesi Tenggara", crisisScore: 25, mentions: 4500, sentiment: 0.15 },
  { provinceCode: "75", provinceName: "Gorontalo", crisisScore: 18, mentions: 2800, sentiment: 0.22 },
  { provinceCode: "76", provinceName: "Sulawesi Barat", crisisScore: 15, mentions: 2200, sentiment: 0.28 },

  // Bali & Nusa Tenggara
  { provinceCode: "51", provinceName: "Bali", crisisScore: 18, mentions: 12300, sentiment: 0.35 },
  { provinceCode: "52", provinceName: "Nusa Tenggara Barat", crisisScore: 28, mentions: 5600, sentiment: 0.08 },
  { provinceCode: "53", provinceName: "Nusa Tenggara Timur", crisisScore: 32, mentions: 4800, sentiment: -0.05 },

  // Maluku
  { provinceCode: "81", provinceName: "Maluku", crisisScore: 25, mentions: 3500, sentiment: 0.12 },
  { provinceCode: "82", provinceName: "Maluku Utara", crisisScore: 22, mentions: 2800, sentiment: 0.18 },

  // Papua
  { provinceCode: "91", provinceName: "Papua", crisisScore: 48, mentions: 7200, sentiment: -0.18 },
  { provinceCode: "92", provinceName: "Papua Barat", crisisScore: 35, mentions: 4500, sentiment: -0.08 },
  { provinceCode: "93", provinceName: "Papua Selatan", crisisScore: 28, mentions: 2800, sentiment: 0.05 },
  { provinceCode: "94", provinceName: "Papua Tengah", crisisScore: 32, mentions: 3200, sentiment: -0.02 },
  { provinceCode: "95", provinceName: "Papua Pegunungan", crisisScore: 25, mentions: 2500, sentiment: 0.08 },
  { provinceCode: "96", provinceName: "Papua Barat Daya", crisisScore: 20, mentions: 2200, sentiment: 0.12 },
];

const defaultMarkers: MarkerData[] = [
  // Java
  { name: "Jakarta", coordinates: [106.8456, -6.2088], alertLevel: "critical", mentions: 45200 },
  { name: "Surabaya", coordinates: [112.7508, -7.2575], alertLevel: "high", mentions: 28900 },
  { name: "Bandung", coordinates: [107.6191, -6.9175], alertLevel: "medium", mentions: 18500 },
  { name: "Semarang", coordinates: [110.4203, -6.9666], alertLevel: "low", mentions: 12400 },
  { name: "Yogyakarta", coordinates: [110.3608, -7.7972], alertLevel: "low", mentions: 8400 },

  // Sumatra
  { name: "Medan", coordinates: [98.6722, 3.5952], alertLevel: "medium", mentions: 14200 },
  { name: "Palembang", coordinates: [104.7458, -2.9761], alertLevel: "medium", mentions: 10800 },
  { name: "Pekanbaru", coordinates: [101.4500, 0.5071], alertLevel: "medium", mentions: 11200 },
  { name: "Banda Aceh", coordinates: [95.3236, 5.5483], alertLevel: "medium", mentions: 9800 },

  // Kalimantan (Borneo) - All 5 province capitals with enhanced visibility
  { name: "Pontianak", coordinates: [109.3425, -0.0263], alertLevel: "low", mentions: 6500 },
  { name: "Palangkaraya", coordinates: [113.9213, -2.2161], alertLevel: "medium", mentions: 5800 },
  { name: "Banjarmasin", coordinates: [114.5943, -3.3194], alertLevel: "medium", mentions: 8200 },
  { name: "Samarinda", coordinates: [117.1536, -0.5022], alertLevel: "high", mentions: 12500 },
  { name: "Balikpapan", coordinates: [116.8529, -1.2654], alertLevel: "medium", mentions: 9800 },
  { name: "Tarakan", coordinates: [117.5785, 3.3006], alertLevel: "low", mentions: 3200 },
  { name: "Nusantara (IKN)", coordinates: [116.7044, -1.1839], alertLevel: "medium", mentions: 8500 },

  // Sulawesi
  { name: "Makassar", coordinates: [119.4327, -5.1477], alertLevel: "medium", mentions: 9800 },
  { name: "Manado", coordinates: [124.8455, 1.4748], alertLevel: "low", mentions: 5400 },
  { name: "Palu", coordinates: [119.8707, -0.9002], alertLevel: "medium", mentions: 6800 },

  // Eastern Indonesia
  { name: "Denpasar", coordinates: [115.2167, -8.6500], alertLevel: "low", mentions: 12300 },
  { name: "Mataram", coordinates: [116.1169, -8.5833], alertLevel: "low", mentions: 5600 },
  { name: "Kupang", coordinates: [123.5868, -10.1787], alertLevel: "low", mentions: 4800 },
  { name: "Ambon", coordinates: [128.1849, -3.6954], alertLevel: "low", mentions: 3500 },
  { name: "Jayapura", coordinates: [140.7033, -2.5333], alertLevel: "medium", mentions: 7200 },
  { name: "Manokwari", coordinates: [134.0719, -0.8614], alertLevel: "medium", mentions: 4500 },
];

// Province center coordinates for drill-down zoom
const provinceCoordinates: Record<string, { center: [number, number]; zoom: number }> = {
  "DKI Jakarta": { center: [106.85, -6.21], zoom: 12 },
  "Jawa Barat": { center: [107.5, -6.8], zoom: 3 },
  "Jawa Tengah": { center: [110.0, -7.2], zoom: 3 },
  "Jawa Timur": { center: [112.5, -7.5], zoom: 3 },
  "Banten": { center: [106.2, -6.4], zoom: 4 },
  "Kalimantan Barat": { center: [110.0, 0.0], zoom: 2.5 },
  "Kalimantan Tengah": { center: [113.5, -1.5], zoom: 2 },
  "Kalimantan Selatan": { center: [115.0, -3.0], zoom: 3 },
  "Kalimantan Timur": { center: [117.0, 0.5], zoom: 2 },
  "Kalimantan Utara": { center: [117.5, 3.0], zoom: 2.5 },
  "Sulawesi Selatan": { center: [120.0, -4.5], zoom: 3 },
  "Papua": { center: [138.0, -4.0], zoom: 2 },
};

function IndonesiaMapComponent({
  regionData = defaultRegionData,
  markers = defaultMarkers,
  onRegionClick,
  onRegionDoubleClick,
  className,
  enableDrillDown = true,
}: IndonesiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [118, -2] as [number, number], zoom: 1 });
  const [drillDownLevel, setDrillDownLevel] = useState<DrillDownLevel>("country");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Double-click detection
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Pre-fetch GeoJSON to check if it's available
    fetch(INDONESIA_GEO_URL_LOCAL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch GeoJSON");
        return res.json();
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  const getRegionData = (provinceName: string) => {
    const normalizedName = normalizeProvinceName(provinceName);
    return regionData.find(
      (r) => r.provinceName.toLowerCase() === normalizedName.toLowerCase()
    );
  };

  const handleRegionClick = useCallback((provinceName: string, data: RegionData | null) => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      // Single click
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          onRegionClick?.(data);
        }
        clickCountRef.current = 0;
      }, 250);
    } else if (clickCountRef.current === 2) {
      // Double click
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;

      if (!enableDrillDown) return;

      const provinceConfig = provinceCoordinates[provinceName];
      if (provinceConfig) {
        setPosition({
          coordinates: provinceConfig.center,
          zoom: provinceConfig.zoom,
        });
        setDrillDownLevel("province");
        setSelectedProvince(provinceName);
      }

      onRegionDoubleClick?.(data);
    }
  }, [enableDrillDown, onRegionClick, onRegionDoubleClick]);

  const handleBackToCountry = useCallback(() => {
    setPosition({ coordinates: [118, -2], zoom: 1 });
    setDrillDownLevel("country");
    setSelectedProvince(null);
  }, []);

  const filteredMarkers = selectedProvince
    ? markers.filter((m) => {
        const provinceConfig = provinceCoordinates[selectedProvince];
        if (!provinceConfig) return true;
        const [cx, cy] = provinceConfig.center;
        const [mx, my] = m.coordinates;
        const distance = Math.sqrt(Math.pow(cx - mx, 2) + Math.pow(cy - my, 2));
        return distance < 8;
      })
    : markers;

  if (isLoading) {
    return (
      <div className={cn("relative w-full h-full min-h-[400px] flex items-center justify-center bg-sky-100", className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Indonesia Map...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cn("relative w-full h-full min-h-[400px] flex items-center justify-center bg-sky-100", className)}>
        <div className="flex flex-col items-center gap-3 text-center p-4">
          <p className="text-lg font-semibold text-destructive">Failed to load map</p>
          <p className="text-sm text-muted-foreground">Please check if GeoJSON file exists at /geo/indonesia.geojson</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full min-h-[400px]", className)}>
      {/* Drill-down controls */}
      {drillDownLevel === "province" && selectedProvince && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBackToCountry}
            className="shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Indonesia
          </Button>
          <div className="bg-card border rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-sm font-medium">{selectedProvince}</span>
          </div>
        </div>
      )}

      {/* Drill-down hint */}
      {enableDrillDown && drillDownLevel === "country" && (
        <div className="absolute top-4 left-4 z-10 bg-card/90 border rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Double-click a region to zoom in</span>
          </div>
        </div>
      )}

      <div className="w-full h-full" style={{ backgroundColor: "#0EA5E9", minHeight: "400px" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [118, -2],
          scale: 1200,
        }}
        width={800}
        height={500}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={0.8}
          maxZoom={12}
        >
          {/* Ocean background */}
          <rect x={-1000} y={-1000} width={3000} height={2000} fill="#0EA5E9" />

          <Geographies geography={INDONESIA_GEO_URL_LOCAL}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) {
                return null;
              }
              return geographies.map((geo) => {
                const props = geo.properties as {
                  Propinsi?: string;
                  NAME_1?: string;
                  name?: string;
                  PROVINSI?: string;
                  state?: string;
                };
                // Check multiple property names for province name
                const rawProvinceName = props.state || props.Propinsi || props.NAME_1 || props.name || props.PROVINSI || "";
                const provinceName = normalizeProvinceName(rawProvinceName);
                const data = getRegionData(rawProvinceName);
                const isHovered = hoveredRegion === provinceName;
                const isSelected = selectedProvince === provinceName;
                const fillColor = data
                  ? getRegionColor(data.crisisScore)
                  : "#E5E7EB";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredRegion(provinceName)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(provinceName, data || null)}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "#1E293B",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: fillColor,
                        stroke: "#0F172A",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: fillColor,
                        stroke: "#0F172A",
                        strokeWidth: 1.5,
                        outline: "none",
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>

          {/* City Markers */}
          {filteredMarkers.map((marker) => (
            <Marker key={marker.name} coordinates={marker.coordinates}>
              <circle
                r={position.zoom > 2 ? 4 : 6}
                fill={getMarkerColor(marker.alertLevel)}
                stroke="#FFFFFF"
                strokeWidth={2}
                className="cursor-pointer"
              />
              {marker.alertLevel === "critical" && (
                <circle
                  r={position.zoom > 2 ? 8 : 12}
                  fill="none"
                  stroke={getMarkerColor(marker.alertLevel)}
                  strokeWidth={2}
                  className="animate-ping"
                  style={{ animationDuration: "1.5s" }}
                />
              )}
              {position.zoom > 1.5 && (
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{
                    fontFamily: "system-ui",
                    fontSize: position.zoom > 3 ? "8px" : "10px",
                    fill: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {marker.name}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      </div>

      {/* Hover Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-4 right-4 bg-card border rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
          <p className="font-semibold text-sm">{hoveredRegion}</p>
          {(() => {
            const data = getRegionData(hoveredRegion);
            if (data) {
              return (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Crisis Score: <span className="font-medium text-foreground">{data.crisisScore}</span></p>
                  <p>Mentions: <span className="font-medium text-foreground">{data.mentions.toLocaleString()}</span></p>
                  <p>Sentiment: <span className={cn(
                    "font-medium",
                    data.sentiment >= 0 ? "text-success" : "text-destructive"
                  )}>{data.sentiment >= 0 ? "+" : ""}{data.sentiment.toFixed(2)}</span></p>
                </div>
              );
            }
            return <p className="text-xs text-muted-foreground mt-1">No data available</p>;
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/95 border rounded-lg shadow-lg p-3 z-10">
        <p className="text-xs font-semibold mb-2">Crisis Level</p>
        <div className="space-y-1.5">
          {[
            { label: "Critical (70+)", color: "#EF4444" },
            { label: "High (50-69)", color: "#F97316" },
            { label: "Medium (30-49)", color: "#F59E0B" },
            { label: "Low (15-29)", color: "#22C55E" },
            { label: "Normal (<15)", color: "#6B7280" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const IndonesiaMap = memo(IndonesiaMapComponent);
