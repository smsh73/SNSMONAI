"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { DrillDownLevel, DrillDownContext as DrillDownContextType } from "@/types/drill-down";

interface DrillDownState {
  isOpen: boolean;
  type: "platform" | "region" | "topic" | "metric" | "alert" | "post" | "author" | null;
  key: string | null;
  context: DrillDownContextType;
  history: { type: string; key: string; label: string }[];
}

interface DrillDownContextValue {
  state: DrillDownState;
  openDrillDown: (type: DrillDownState["type"], key: string, label?: string) => void;
  closeDrillDown: () => void;
  goBack: () => void;
  navigateTo: (type: DrillDownState["type"], key: string, label?: string) => void;
  clearHistory: () => void;
}

const initialContext: DrillDownContextType = {
  level: "overview",
  filters: {},
  breadcrumbs: [{ level: "overview", label: "Overview" }],
};

const initialState: DrillDownState = {
  isOpen: false,
  type: null,
  key: null,
  context: initialContext,
  history: [],
};

const DrillDownContext = createContext<DrillDownContextValue | null>(null);

export function DrillDownProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DrillDownState>(initialState);

  const openDrillDown = useCallback((
    type: DrillDownState["type"],
    key: string,
    label?: string
  ) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      type,
      key,
      history: [{ type: type || "", key, label: label || key }],
      context: {
        ...prev.context,
        breadcrumbs: [
          { level: "overview", label: "Overview" },
          { level: type as DrillDownLevel, label: label || key },
        ],
      },
    }));
  }, []);

  const closeDrillDown = useCallback(() => {
    setState(initialState);
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length <= 1) {
        return initialState;
      }

      const newHistory = prev.history.slice(0, -1);
      const lastItem = newHistory[newHistory.length - 1];

      return {
        ...prev,
        type: lastItem.type as DrillDownState["type"],
        key: lastItem.key,
        history: newHistory,
        context: {
          ...prev.context,
          breadcrumbs: prev.context.breadcrumbs.slice(0, -1),
        },
      };
    });
  }, []);

  const navigateTo = useCallback((
    type: DrillDownState["type"],
    key: string,
    label?: string
  ) => {
    setState((prev) => ({
      ...prev,
      type,
      key,
      history: [...prev.history, { type: type || "", key, label: label || key }],
      context: {
        ...prev.context,
        breadcrumbs: [
          ...prev.context.breadcrumbs,
          { level: type as DrillDownLevel, label: label || key },
        ],
      },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      history: prev.history.length > 0 ? [prev.history[0]] : [],
      context: {
        ...prev.context,
        breadcrumbs: prev.context.breadcrumbs.length > 1
          ? [prev.context.breadcrumbs[0], prev.context.breadcrumbs[1]]
          : prev.context.breadcrumbs,
      },
    }));
  }, []);

  return (
    <DrillDownContext.Provider
      value={{
        state,
        openDrillDown,
        closeDrillDown,
        goBack,
        navigateTo,
        clearHistory,
      }}
    >
      {children}
    </DrillDownContext.Provider>
  );
}

export function useDrillDown() {
  const context = useContext(DrillDownContext);
  if (!context) {
    throw new Error("useDrillDown must be used within a DrillDownProvider");
  }
  return context;
}
