"use client";

import Link from "next/link";
import { Trash2, Edit3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogTable() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setBlogs(d.items || []));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this blog?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    setBlogs((p) => p.filter((b) => b._id !== id));
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="grid grid-cols-12 border-b border-white/10 px-5 py-3 text-xs text-white/50">
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {blogs.length === 0 && (
        <div className="p-10 text-center text-white/40">
          No blog posts yet.
        </div>
      )}

      {blogs.map((b) => (
        <div
          key={b._id}
          className="group grid grid-cols-12 items-center px-5 py-4 transition hover:bg-white/[0.04]"
        >
          <div className="col-span-5">
            <div className="font-medium">{b.title}</div>
            <div className="text-xs text-white/40">{b.excerpt}</div>
          </div>

          <div className="col-span-3 text-sm text-white/60">{b.slug}</div>

          <div className="col-span-2">
            <span
              className={`rounded-full px-2 py-1 text-xs ring-1 ${
                b.published
                  ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/20"
                  : "bg-zinc-500/15 text-zinc-200 ring-zinc-500/20"
              }`}
            >
              {b.published ? "Published" : "Draft"}
            </span>
          </div>

          <div className="col-span-2 flex justify-end gap-2">
            <Link
              href={`/admin/blog/${b._id}/edit`}
              className="rounded-full border border-white/10 p-2 hover:bg-white/10"
            >
              <Edit3 className="h-4 w-4" />
            </Link>

            <button
              onClick={() => remove(b._id)}
              className="rounded-full border border-white/10 p-2 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
