"use client";

import { useRouter } from "next/navigation";
import CaseStudyEditor, { type CaseStudy } from "@/components/admin/CaseStudyEditor";

export default function NewCaseStudyPage() {
  const router = useRouter();

  const initial: CaseStudy = {
    title: "",
    slug: "",
    excerpt: "",
    tags: [],
    image: "",
    published: false,
    content_blocks: [],
  };

  async function onSave(v: CaseStudy) {
    const res = await fetch("/api/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      throw new Error(j?.message || "Failed to save case study");
    }

    router.push("/admin/case-studies");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            New Case Study
          </h1>
          <p className="mt-2 text-zinc-600">Create a case study with tags and rich blocks.</p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <CaseStudyEditor initial={initial} onSave={onSave} />
        </div>
      </div>
    </main>
  );
}
