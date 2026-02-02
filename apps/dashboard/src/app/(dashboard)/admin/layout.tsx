"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Key,
  Hash,
  Calendar,
  MapPin,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { title: "API Keys", href: "/admin/api-keys", icon: Key },
  { title: "Keywords", href: "/admin/keywords", icon: Hash },
  { title: "Schedules", href: "/admin/schedules", icon: Calendar },
  { title: "Regions", href: "/admin/regions", icon: MapPin },
  { title: "Accounts", href: "/admin/accounts", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure API keys, keywords, schedules, and more
          </p>
        </div>
      </div>

      {/* Admin Navigation */}
      <nav className="flex items-center gap-2 border-b pb-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Admin Content */}
      {children}
    </div>
  );
}
