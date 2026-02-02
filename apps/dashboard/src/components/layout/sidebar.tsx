"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";
import { ChevronDown, Activity } from "lucide-react";
import { useState } from "react";

interface NavItem {
  titleKey: keyof typeof import("@/lib/i18n/translations").translations.en.nav;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { titleKey: "overview", href: "/overview" },
  { titleKey: "feed", href: "/feed", badge: "Live" },
  { titleKey: "posts", href: "/posts" },
  { titleKey: "analytics", href: "/analytics" },
  { titleKey: "crisis", href: "/crisis", badge: "3" },
  { titleKey: "map", href: "/map" },
  { titleKey: "reports", href: "/reports" },
  { titleKey: "chatbot", href: "/chatbot" },
];

const adminNavItems: NavItem[] = [
  { titleKey: "apiKeys", href: "/admin/api-keys" },
  { titleKey: "keywords", href: "/admin/keywords" },
  { titleKey: "scheduler", href: "/admin/schedules" },
  { titleKey: "settings", href: "/admin/regions" },
  { titleKey: "accounts", href: "/admin/accounts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [adminExpanded, setAdminExpanded] = useState(true);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-slate-800 bg-slate-900">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white">{t.branding.appName}</span>
              <span className="text-[10px] text-slate-500 truncate">{t.branding.appSubtitle}</span>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} t={t} />
            ))}
          </div>

          {/* Admin Section */}
          <div className="pt-4">
            <button
              onClick={() => setAdminExpanded(!adminExpanded)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
            >
              <span>{t.nav.admin}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", adminExpanded && "rotate-180")} />
            </button>

            {adminExpanded && (
              <div className="mt-1 space-y-0.5">
                {adminNavItems.map((item) => (
                  <NavLink key={item.href} item={item} isActive={pathname === item.href} t={t} />
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3">
          <div className="rounded-lg bg-slate-800/50 p-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>{t.data.status.online}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.data.status.lastSync}: 2s</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ item, isActive, t }: { item: NavItem; isActive: boolean; t: ReturnType<typeof useTranslation>["t"] }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <span className="truncate">{t.nav[item.titleKey]}</span>
      {item.badge && (
        <span
          className={cn(
            "ml-2 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold",
            isActive
              ? "bg-white/20 text-white"
              : item.badge === "Live"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
