"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Mic2,
  Briefcase,
  Quote,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog", icon: FileText },

  // ✅ fixed path (you now use /admin/podcasts)
  { href: "/admin/podcasts", label: "Podcasts", icon: Mic2 },

  // ✅ added new sections
  { href: "/admin/case-studies", label: "Case Studies", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
 { href: "/admin/portfolios", label: "Portfolio", icon: Briefcase },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-5">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <div className="h-5 w-5 rounded-md bg-white/60" />
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight">
            Admin Panel
          </div>
          <div className="truncate text-xs text-white/50">
            Content Management
          </div>
        </div>
      </div>

      <Separator className="my-5 bg-white/10" />

      {/* Nav */}
      <nav className="space-y-1.5">
        {nav.map((it) => {
          const active =
            pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;

          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onNavigate}
              className={cn(
                "relative group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm",
                "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                "text-white/60 hover:text-white hover:bg-white/[0.06]",
                "active:scale-[0.99]"
              )}
            >
              {/* Active indicator (no bg) */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full",
                  "transition-all duration-200",
                  active
                    ? "bg-white/50"
                    : "bg-transparent group-hover:bg-white/20"
                )}
              />

              {/* Icon */}
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl",
                  "transition-all duration-200",
                  "bg-white/[0.04] ring-1 ring-white/10",
                  "group-hover:bg-white/10 group-hover:ring-white/15 group-hover:scale-[1.04]",
                  active && "bg-white/[0.06] ring-white/20"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-white" : "text-white/70"
                  )}
                />
              </span>

              {/* Label */}
              <span
                className={cn(
                  "font-medium tracking-tight transition-all duration-200",
                  "group-hover:translate-x-[1px]",
                  active ? "text-white" : "text-white/75"
                )}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-5">
        <Separator className="my-5 bg-white/10" />

        <Button
          variant="outline"
          className="w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            window.location.href = "/admin/login";
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>

        <p className="mt-3 text-xs text-white/40">Dark • modern • polished</p>
      </div>
    </div>
  );
}
