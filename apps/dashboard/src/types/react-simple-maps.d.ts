declare module "react-simple-maps" {
  import { ReactNode, CSSProperties } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      scale?: number;
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    properties: Record<string, unknown>;
    geometry: object;
    id?: string | number;
  }

  export interface GeographyProps {
    geography: Geography;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
  }

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: "butt" | "round" | "square";
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export interface GraticuleProps {
    stroke?: string;
    strokeWidth?: number;
    step?: [number, number];
  }

  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    curve?: number;
    connectorProps?: object;
    children?: ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Line: React.FC<LineProps>;
  export const Graticule: React.FC<GraticuleProps>;
  export const Sphere: React.FC<SphereProps>;
  export const Annotation: React.FC<AnnotationProps>;
}
