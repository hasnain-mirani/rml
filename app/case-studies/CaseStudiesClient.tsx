"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";

type CaseStudy = {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  createdAt?: string;
};

type Props = {
  initialItems?: CaseStudy[]; // ✅ allow undefined safely
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

/** Safe tag extraction */
function getTagsAsCategories(items?: CaseStudy[]) {
  const set = new Set<string>();

  (Array.isArray(items) ? items : []).forEach((c) => {
    (Array.isArray(c?.tags) ? c.tags : []).forEach((t) => {
      const clean = (t || "").trim();
      if (clean) set.add(clean);
    });
  });

  return [
    "All",
    ...Array.from(set).sort((a, b) => a.localeCompare(b)),
  ];
}

export default function CaseStudiesClient({
  initialItems,
  errorMsg = "",
}: Props) {

  // ✅ ALWAYS GUARANTEE ARRAY
  const safeItems: CaseStudy[] = Array.isArray(initialItems)
    ? initialItems
    : [];

  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");

  const categories = useMemo(
    () => getTagsAsCategories(safeItems),
    [safeItems]
  );

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();

    let filtered =
      category === "All"
        ? safeItems
        : safeItems.filter((c) =>
            (Array.isArray(c?.tags) ? c.tags : []).includes(category)
          );

    if (ql) {
      filtered = filtered.filter((c) => {
        const hay = `${c?.title || ""} ${c?.excerpt || ""} ${
          Array.isArray(c?.tags) ? c.tags.join(" ") : ""
        }`.toLowerCase();
        return hay.includes(ql);
      });
    }

    return [...filtered].sort((a, b) => {
      const ad = Date.parse(a?.createdAt || "");
      const bd = Date.parse(b?.createdAt || "");
      return bd - ad;
    });
  }, [safeItems, category, q]);

  const featured = items[0];
  const side = items.slice(1, 4);
  const rest = items.slice(4);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Navbar scrollContainerRef={scrollContainerRef} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />

        <header className="mt-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Case Studies: Builds, launches & measurable outcomes
          </h1>

          <div className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search case studies…"
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

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Recent case studies</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Tag:</span>
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

        {errorMsg ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-semibold">Couldn’t load case studies</div>
            <div className="mt-1 break-words">{errorMsg}</div>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <div className="text-lg font-semibold">No published case studies yet</div>
            <div className="mt-2 text-sm text-neutral-600">
              Publish a case study from the admin panel and it will appear here.
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              {featured && (
                <article className="lg:col-span-7">
                  <Link
                    href={`/case-studies/${featured.slug}`}
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
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{formatDate(featured.createdAt)}</span>
                      </div>

                      <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight group-hover:underline">
                        {featured.title}
                      </h3>

                      {featured.excerpt && (
                        <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
