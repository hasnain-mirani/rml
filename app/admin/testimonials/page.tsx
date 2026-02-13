"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type TestimonialRow = {
  _id: string;
  name: string;
  text: string;
  image?: string;
  linkEnabled?: boolean;
  linkUrl?: string;
  published: boolean;
};

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonials", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    setItems((data?.items || []).map((x: any) => ({ ...x, _id: String(x._id) })));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    const ok = confirm("Delete this testimonial?");
    if (!ok) return;

    const res = await fetch(`/api/testimonials/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      alert(json?.message || "Delete failed");
      return;
    }

    setItems((prev) => prev.filter((t) => t._id !== String(id)));

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Testimonials
            </h1>
            <p className="mt-2 text-zinc-600">
              Add, review, and publish testimonials.
            </p>
          </div>

          <Link
            href="/admin/testimonials/new"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            + New Testimonial
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Link</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-6 text-zinc-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-zinc-600">No testimonials yet.</div>
          ) : (
            items.map((t) => (
              <div
                key={t._id}
                className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-zinc-100"
              >
                <div className="col-span-4 font-medium text-zinc-900 truncate">
                  {t.name}
                </div>

                <div className="col-span-4 text-zinc-600 truncate">
                  {t.linkEnabled ? t.linkUrl || "" : "—"}
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs border ${
                      t.published
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    {t.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <Link
                    href="/testimonials"
                    target="_blank"
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/testimonials/${t._id}`}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                  >
                    Edit
                  </Link>

                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(t._id)}
                    className="rounded-xl border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
