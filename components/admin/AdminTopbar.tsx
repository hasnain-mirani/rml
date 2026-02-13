"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminTopbar({
  title,
  subtitle,
  createHref,
}: {
  title: string;
  subtitle?: string;
  createHref?: string; // <— use this
}) {
  const [q, setQ] = useState("");
  const isValid = useMemo(() => /^[a-z0-9\s\-_.]*$/i.test(q), [q]);

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold tracking-tight">{title}</div>
          {subtitle ? <div className="truncate text-xs text-white/50">{subtitle}</div> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className={`h-10 w-[240px] rounded-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40 shadow-sm md:w-[340px]
              transition focus-visible:ring-2 focus-visible:ring-white/10 ${!isValid ? "border-red-400/40" : ""}`}
            />
          </div>

          {createHref ? (
            <Button
              asChild
              className="h-10 rounded-full bg-white px-4 text-black hover:bg-white/90 transition active:scale-[0.98]"
            >
              <Link href={createHref}>
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>
          ) : null}

          <Button
            variant="outline"
            className="h-10 w-10 rounded-full border-white/10 bg-white/5 px-0 text-white hover:bg-white/10 transition active:scale-[0.98]"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Avatar className="h-10 w-10 border border-white/10 bg-white/5">
            <AvatarFallback className="bg-transparent text-xs text-white/70">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {!isValid ? (
        <div className="mt-2 text-xs text-red-300">
          Search can only contain letters, numbers, spaces, and - _ .
        </div>
      ) : null}
    </div>
  );
}
