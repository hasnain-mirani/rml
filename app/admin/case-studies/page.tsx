"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CaseStudyRow = {
  _id: any; // debug: keep any to catch weird shapes
  title: string;
  slug: string;
  published: boolean;
};

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const [items, setItems] = useState<CaseStudyRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    console.log("==== ADMIN LOAD CASE STUDIES ====");

    const res = await fetch("/api/case-studies", { cache: "no-store" });
    const data = await res.json().catch(() => null);

    console.log("LIST status =>", res.status);
    console.log("LIST data =>", data);
    console.log("LIST first item =>", data?.items?.[0]);
    console.log("LIST first _id =>", data?.items?.[0]?._id, typeof data?.items?.[0]?._id);

    const normalized = (data?.items || []).map((x: any) => ({
      ...x,
      _id: x?._id, // keep raw for debugging
    }));

    setItems(normalized);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(rawId: any) {
    console.log("==== ADMIN DELETE CLICK ====");
    console.log("RAW id =>", rawId, { type: typeof rawId });

    // common cases: object id, undefined, null
    const stringId = rawId == null ? "" : String(rawId);
    const trimmedId = stringId.trim();
    const safeId = encodeURIComponent(trimmedId);

    console.log("STRING id =>", stringId, { len: stringId.length });
    console.log("TRIMMED id =>", trimmedId, { len: trimmedId.length });
    console.log("SAFE id =>", safeId);
    console.log("DELETE url =>", `/api/case-studies/${safeId}`);

    if (!trimmedId) {
      alert("ID is empty. Check console: API is not returning _id properly.");
      return;
    }

    const ok = confirm("Delete this case study?");
    if (!ok) return;

    const res = await fetch(`/api/case-studies/${safeId}`, { method: "DELETE" });
    const json = await res.json().catch(() => null);

    console.log("DELETE status =>", res.status);
    console.log("DELETE json =>", json);

    if (!res.ok) {
      alert(json?.message || "Delete failed");
      return;
    }

    // optimistic remove
    setItems((prev) =>
      prev.filter((i) => String(i._id).trim() !== trimmedId)
    );

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Case Studies (Admin)
            </h1>
            <p className="mt-2 text-zinc-600">
              Create, edit, and manage case studies.
            </p>
          </div>

          <Link
            href="/admin/case-studies/new"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            + New Case Study
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-6 text-zinc-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-zinc-600">No case studies yet.</div>
          ) : (
            items.map((c) => {
              const idStr = c._id == null ? "" : String(c._id);
              return (
                <div
                  key={`${c.slug}-${idStr}`}
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-zinc-100"
                >
                  <div className="col-span-5 font-medium text-zinc-900 truncate">
                    {c.title}
                  </div>
                  <div className="col-span-3 text-zinc-600 truncate">{c.slug}</div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs border ${
                        c.published
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    <Link
                      href={`/case-studies/${c.slug}?preview=1`}
                      target="_blank"
                      className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/case-studies/${c.slug}`}
                      className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="rounded-xl border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
