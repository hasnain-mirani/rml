"use client";

import { useRouter } from "next/navigation";
import PodcastEditor, { type Podcast } from "@/components/admin/PodcastEditor";

export default function NewPodcastPage() {
  const router = useRouter();

  const initial: Podcast = {
    title: "",
    slug: "",
    excerpt: "",
    image: "",
    date: "",
    published: false,
    category: "Podcast",
    content_blocks: [],
  };

  async function onSave(v: Podcast) {
    const res = await fetch("/api/podcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.message || "Failed to save podcast");
    }

    // after save → go back to list
    router.push("/admin/podcasts");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            New Podcast
          </h1>
          <p className="mt-2 text-zinc-600">
            Create a podcast post (cover, summary, date, embeds).
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <PodcastEditor initial={initial} onSave={onSave} />
        </div>
      </div>
    </main>
  );
}
