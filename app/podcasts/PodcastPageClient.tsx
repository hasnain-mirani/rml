"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import type { Podcast } from "@/lib/fetchPodcasts";

type Props = {
  initialItems: Podcast[];
  errorMsg?: string;
};

/** deterministic date: "09 Feb 2026" */
function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ] as const;

  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = months[d.getUTCMonth()] ?? "";
  const yyyy = d.getUTCFullYear();
  return mon ? `${dd} ${mon} ${yyyy}` : "";
}

function getCategories(items: Podcast[]) {
  const set = new Set<string>();
  items.forEach((p) => set.add((p.category || "Podcast").trim() || "Podcast"));
  return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}

export default function PodcastPageClient({ initialItems, errorMsg = "" }: Props) {
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");

  const categories = useMemo(() => getCategories(initialItems), [initialItems]);

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();

    let filtered =
      category === "All"
        ? initialItems
        : initialItems.filter((p) => (p.category || "Podcast") === category);

    if (ql) {
      filtered = filtered.filter((p) => {
        const hay = `${p.title || ""} ${p.excerpt || ""}`.toLowerCase();
        return hay.includes(ql);
      });
    }

    return [...filtered].sort(
      (a, b) => Date.parse((b as any).createdAt || "") - Date.parse((a as any).createdAt || "")
    );
  }, [initialItems, category, q]);

  const featured = items[0];
  const side = items.slice(1, 4);
  const rest = items.slice(4);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Navbar scrollContainerRef={scrollContainerRef} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Gradient line */}
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-600" />

        {/* HERO */}
        <header className="mt-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Podcasts: Interviews, insights & product stories
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            Listen on YouTube, Spotify, or Apple Podcasts — with show notes and links.
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search podcasts…"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={() => setQ("")}
              className="shrink-0 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition"
            >
              Clear
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Recent episodes</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR / EMPTY */}
        {errorMsg ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-semibold">Couldn’t load podcasts</div>
            <div className="mt-1 break-words">{errorMsg}</div>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <div className="text-lg font-semibold">No published podcasts yet</div>
            <div className="mt-2 text-sm text-neutral-600">
              Publish a podcast from the admin panel and it will appear here.
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              {/* Featured */}
              {featured ? (
                <article className="lg:col-span-7">
                  <Link
                    href={`/podcasts/${featured.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative aspect-[16/10] w-full bg-neutral-100">
                      {featured.image ? (
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                          No cover image
                        </div>
                      )}

                      {/* play badge */}
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
                        ▶ Episode
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{formatDate((featured as any).createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300" />
                        <span className="rounded-full border border-neutral-200 px-2 py-0.5">
                          {featured.category || "Podcast"}
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight group-hover:underline">
                        {featured.title}
                      </h3>

                      {featured.excerpt ? (
                        <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                          {featured.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-4 text-sm font-medium text-neutral-900">
                        Listen now{" "}
                        <span className="inline-block transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ) : null}

              {/* Side list */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {side.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/podcasts/${p.slug}`}
                    className="group grid grid-cols-12 gap-4 rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative col-span-5 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 40vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
                          No cover image
                        </div>
                      )}
                      <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm">
                        ▶
                      </div>
                    </div>

                    <div className="col-span-7 pr-2 py-1">
                      <div className="text-xs text-neutral-500">
                        {formatDate((p as any).createdAt)}
                      </div>
                      <h3 className="mt-1 font-semibold leading-snug group-hover:underline">
                        {p.title}
                      </h3>

                      {p.excerpt ? (
                        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                          {p.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-600">
                        <span className="rounded-full border border-neutral-200 px-2 py-0.5">
                          {p.category || "Podcast"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rest grid */}
            {rest.length > 0 ? (
              <div className="mt-12">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">More episodes</h3>
                  <div className="text-sm text-neutral-500">{rest.length} items</div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/podcasts/${p.slug}`}
                      className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="relative aspect-[16/10] bg-neutral-100">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                            No cover image
                          </div>
                        )}
                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm">
                          ▶ Listen
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-xs text-neutral-500">
                          {formatDate((p as any).createdAt)} • {p.category || "Podcast"}
                        </div>
                        <h4 className="mt-2 font-semibold leading-snug group-hover:underline">
                          {p.title}
                        </h4>
                        {p.excerpt ? (
                          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                            {p.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
