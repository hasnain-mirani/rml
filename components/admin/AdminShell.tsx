"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0D12] via-[#0E1118] to-[#090B10] text-white">
      {/* subtle glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-24 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Mobile menu button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="outline"
            className="fixed left-3 top-3 z-50 h-11 w-11 rounded-full border-white/10 bg-white/5 px-0 backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
            aria-label="Open menu"
          >
            ☰
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[330px] p-0">
          <div className="h-full bg-[#0B0D12]">
            <div className="h-full border-r border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur">
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar (attached to screen) */}
        <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-[290px]">
          <div className="h-full w-full border-r border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <AdminSidebar />
          </div>
        </aside>

        {/* Content (full width minus sidebar) */}
        <main className="flex-1 md:ml-[290px]">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  );
}
