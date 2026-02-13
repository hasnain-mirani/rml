"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PodcastEditor, { type Podcast } from "@/components/admin/PodcastEditor";
import { useMemo } from "react";

export default function EditPodcastClient({ initial }: { initial: any }) {
  const router = useRouter();
  const sp = useSearchParams();

  const deleteMode = sp.get("delete") === "1";

  const castInitial = useMemo(() => initial as Podcast, [initial]);

  async function onSave(v: Podcast) {
    const res = await fetch(`/api/podcasts/${String((initial as any)._id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.message || "Failed to update podcast");
    }

    router.push("/admin/podcasts");
    router.refresh();
  }

  async function onDelete() {
    const ok = confirm("Delete this podcast?");
    if (!ok) return;

    const res = await fetch(`/api/podcasts/${String((initial as any)._id)}`, {
      method: "DELETE",
    });

    const j = await res.json().catch(() => null);

    if (!res.ok) {
      alert(j?.message || "Delete failed");
      return;
    }

    router.push("/admin/podcasts");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Edit Podcast
            </h1>
            <p className="mt-2 text-zinc-600">
              Update content and publishing state.
            </p>
          </div>

          <button
            onClick={onDelete}
            className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        {deleteMode ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Delete mode enabled from list. Click Delete to confirm.
          </div>
        ) : null}

        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <PodcastEditor initial={castInitial} onSave={onSave} />
        </div>
      </div>
    </main>
  );
}
