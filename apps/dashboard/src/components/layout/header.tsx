"use client";

import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

export function Header() {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, type: "critical", title: t.crisis.critical, message: t.data.alerts.keywordSpike, time: "2m" },
    { id: 2, type: "warning", title: t.data.alerts.sentimentDrop, message: t.data.regions.eastJava, time: "10m" },
    { id: 3, type: "info", title: t.reports.title, message: t.reports.weekly, time: "1h" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder={t.common.search + "..."}
          className="h-8 w-[280px] rounded-md border border-slate-700 bg-slate-800/50 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-800 relative text-slate-400 hover:text-white transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1 w-64 rounded-md border border-slate-700 bg-slate-800 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-700 p-2">
                <span className="text-xs font-semibold text-slate-200">{t.overview.activeAlerts}</span>
                <button className="text-[10px] text-slate-400 hover:text-white">{t.crisis.acknowledge}</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-2 border-b border-slate-700 p-2 hover:bg-slate-700/50">
                    <div className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                      n.type === "critical" && "bg-red-500",
                      n.type === "warning" && "bg-orange-500",
                      n.type === "info" && "bg-blue-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium truncate text-slate-200">{n.title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{n.message}</p>
                      <p className="text-[9px] text-slate-500">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1 hover:bg-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
              KA
            </div>
            <span className="text-xs font-medium hidden sm:inline text-slate-300">{t.branding.userRole}</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1 w-44 rounded-md border border-slate-700 bg-slate-800 shadow-lg">
              <div className="border-b border-slate-700 p-2">
                <p className="text-xs font-medium text-slate-200">{t.branding.orgName}</p>
                <p className="text-[10px] text-slate-400">{t.branding.userEmail}</p>
              </div>
              <div className="p-1">
                <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] text-slate-300 hover:bg-slate-700">
                  <User className="h-3 w-3" />{t.nav.accounts}
                </button>
                <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] text-slate-300 hover:bg-slate-700">
                  <Settings className="h-3 w-3" />{t.nav.settings}
                </button>
              </div>
              <div className="border-t border-slate-700 p-1">
                <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] text-red-400 hover:bg-red-500/10">
                  <LogOut className="h-3 w-3" />{t.common.close}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
