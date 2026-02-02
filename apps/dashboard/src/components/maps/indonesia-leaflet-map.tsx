"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface RegionData {
  provinceCode: string;
  provinceName: string;
  crisisScore: number;
  mentions: number;
  sentiment: number;
}

interface IndonesiaLeafletMapProps {
  regionData?: RegionData[];
  onRegionClick?: (region: RegionData | null) => void;
  onRegionDoubleClick?: (region: RegionData | null) => void;
  className?: string;
}

// Province name normalization map
const PROVINCE_NAME_MAP: Record<string, string> = {
  "DI. ACEH": "Aceh",
  "DI ACEH": "Aceh",
  "NANGGROE ACEH DARUSSALAM": "Aceh",
  "ACEH": "Aceh",
  "SUMATERA UTARA": "Sumatera Utara",
  "SUMATERA BARAT": "Sumatera Barat",
  "RIAU": "Riau",
  "JAMBI": "Jambi",
  "SUMATERA SELATAN": "Sumatera Selatan",
  "BENGKULU": "Bengkulu",
  "LAMPUNG": "Lampung",
  "KEPULAUAN BANGKA BELITUNG": "Kepulauan Bangka Belitung",
  "KEPULAUAN RIAU": "Kepulauan Riau",
  "DKI JAKARTA": "DKI Jakarta",
  "JAWA BARAT": "Jawa Barat",
  "JAWA TENGAH": "Jawa Tengah",
  "DAERAH ISTIMEWA YOGYAKARTA": "DI Yogyakarta",
  "JAWA TIMUR": "Jawa Timur",
  "BANTEN": "Banten",
  "BALI": "Bali",
  "NUSA TENGGARA BARAT": "Nusa Tenggara Barat",
  "NUSATENGGARA BARAT": "Nusa Tenggara Barat",
  "NUSA TENGGARA TIMUR": "Nusa Tenggara Timur",
  "KALIMANTAN BARAT": "Kalimantan Barat",
  "KALIMANTAN TENGAH": "Kalimantan Tengah",
  "KALIMANTAN SELATAN": "Kalimantan Selatan",
  "KALIMANTAN TIMUR": "Kalimantan Timur",
  "KALIMANTAN UTARA": "Kalimantan Utara",
  "SULAWESI UTARA": "Sulawesi Utara",
  "SULAWESI TENGAH": "Sulawesi Tengah",
  "SULAWESI SELATAN": "Sulawesi Selatan",
  "SULAWESI TENGGARA": "Sulawesi Tenggara",
  "GORONTALO": "Gorontalo",
  "SULAWESI BARAT": "Sulawesi Barat",
  "MALUKU": "Maluku",
  "MALUKU UTARA": "Maluku Utara",
  "PAPUA": "Papua",
  "PAPUA BARAT": "Papua Barat",
  "PAPUA SELATAN": "Papua Selatan",
  "PAPUA TENGAH": "Papua Tengah",
  "PAPUA PEGUNUNGAN": "Papua Pegunungan",
  "PAPUA BARAT DAYA": "Papua Barat Daya",
};

const normalizeProvinceName = (name: string): string => {
  if (!name) return "";
  const upperName = name.toUpperCase().trim();
  return PROVINCE_NAME_MAP[upperName] || name;
};

const defaultRegionData: RegionData[] = [
  { provinceCode: "31", provinceName: "DKI Jakarta", crisisScore: 75, mentions: 45200, sentiment: -0.35 },
  { provinceCode: "32", provinceName: "Jawa Barat", crisisScore: 45, mentions: 32100, sentiment: -0.15 },
  { provinceCode: "33", provinceName: "Jawa Tengah", crisisScore: 28, mentions: 18500, sentiment: 0.12 },
  { provinceCode: "35", provinceName: "Jawa Timur", crisisScore: 62, mentions: 28900, sentiment: -0.28 },
  { provinceCode: "34", provinceName: "DI Yogyakarta", crisisScore: 22, mentions: 8400, sentiment: 0.25 },
  { provinceCode: "36", provinceName: "Banten", crisisScore: 38, mentions: 15600, sentiment: -0.08 },
  { provinceCode: "11", provinceName: "Aceh", crisisScore: 32, mentions: 9800, sentiment: -0.12 },
  { provinceCode: "12", provinceName: "Sumatera Utara", crisisScore: 35, mentions: 14200, sentiment: 0.05 },
  { provinceCode: "51", provinceName: "Bali", crisisScore: 18, mentions: 12300, sentiment: 0.35 },
  { provinceCode: "61", provinceName: "Kalimantan Barat", crisisScore: 25, mentions: 6500, sentiment: 0.18 },
  { provinceCode: "64", provinceName: "Kalimantan Timur", crisisScore: 55, mentions: 12500, sentiment: -0.22 },
  { provinceCode: "73", provinceName: "Sulawesi Selatan", crisisScore: 42, mentions: 9800, sentiment: -0.12 },
  { provinceCode: "91", provinceName: "Papua", crisisScore: 48, mentions: 7200, sentiment: -0.18 },
];

const getRegionColor = (crisisScore: number) => {
  if (crisisScore >= 70) return "#EF4444";
  if (crisisScore >= 50) return "#F97316";
  if (crisisScore >= 30) return "#F59E0B";
  if (crisisScore >= 15) return "#22C55E";
  return "#94A3B8";
};

export function IndonesiaLeafletMap({
  regionData = defaultRegionData,
  onRegionClick,
  onRegionDoubleClick,
  className,
}: IndonesiaLeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<any>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Dynamic import for Leaflet (SSR-safe)
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Import CSS
      await import("leaflet/dist/leaflet.css");

      // Check if map already exists
      if (map) return;

      // Create map
      const newMap = L.map(mapRef.current!, {
        center: [-2.5, 118],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add tile layer (CartoDB Positron for clean look)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(newMap);

      // Load GeoJSON
      try {
        const response = await fetch("/geo/indonesia.geojson");
        if (!response.ok) throw new Error("Failed to load GeoJSON");
        const geoData = await response.json();

        // Style function
        const getStyle = (feature: any) => {
          const rawName = feature.properties?.Propinsi || feature.properties?.NAME_1 || "";
          const normalizedName = normalizeProvinceName(rawName);
          const data = regionData.find(
            (r) => r.provinceName.toLowerCase() === normalizedName.toLowerCase()
          );
          const color = data ? getRegionColor(data.crisisScore) : "#94A3B8";

          return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: "#1E293B",
            fillOpacity: 0.7,
          };
        };

        // Add GeoJSON layer
        const geoLayer = L.geoJSON(geoData, {
          style: getStyle,
          onEachFeature: (feature, layer) => {
            const rawName = feature.properties?.Propinsi || feature.properties?.NAME_1 || "";
            const normalizedName = normalizeProvinceName(rawName);
            const data = regionData.find(
              (r) => r.provinceName.toLowerCase() === normalizedName.toLowerCase()
            );

            // Popup content
            const popupContent = data
              ? `<div style="font-family: system-ui; min-width: 150px;">
                  <strong style="font-size: 14px;">${normalizedName}</strong>
                  <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    <div>Crisis Score: <span style="font-weight: 600; color: ${getRegionColor(data.crisisScore)}">${data.crisisScore}</span></div>
                    <div>Mentions: <span style="font-weight: 600;">${data.mentions.toLocaleString()}</span></div>
                    <div>Sentiment: <span style="font-weight: 600; color: ${data.sentiment >= 0 ? '#22C55E' : '#EF4444'}">${data.sentiment >= 0 ? '+' : ''}${data.sentiment.toFixed(2)}</span></div>
                  </div>
                </div>`
              : `<div style="font-family: system-ui;"><strong>${normalizedName}</strong><div style="color: #666; font-size: 12px;">No data available</div></div>`;

            layer.bindPopup(popupContent);

            // Mouse events
            layer.on({
              mouseover: (e) => {
                const l = e.target;
                l.setStyle({
                  weight: 2,
                  color: "#0F172A",
                  fillOpacity: 0.85,
                });
                l.bringToFront();
                setHoveredRegion(normalizedName);
              },
              mouseout: (e) => {
                geoLayer.resetStyle(e.target);
                setHoveredRegion(null);
              },
              click: () => {
                onRegionClick?.(data || null);
              },
              dblclick: () => {
                if (data) {
                  newMap.setView([feature.properties?.lat || -2.5, feature.properties?.lng || 118], 7);
                }
                onRegionDoubleClick?.(data || null);
              },
            });
          },
        }).addTo(newMap);

        setMap(newMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load GeoJSON:", error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full min-h-[400px]", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-sky-50 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading Indonesia Map...</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px" }} />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/95 border rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs font-semibold mb-2">Crisis Level</p>
        <div className="space-y-1.5">
          {[
            { label: "Critical (70+)", color: "#EF4444" },
            { label: "High (50-69)", color: "#F97316" },
            { label: "Medium (30-49)", color: "#F59E0B" },
            { label: "Low (15-29)", color: "#22C55E" },
            { label: "Normal (<15)", color: "#94A3B8" },
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

      {/* Hover info */}
      {hoveredRegion && (
        <div className="absolute top-4 left-4 bg-card border rounded-lg shadow-lg px-3 py-2 z-[1000]">
          <p className="text-sm font-medium">{hoveredRegion}</p>
        </div>
      )}
    </div>
  );
}
