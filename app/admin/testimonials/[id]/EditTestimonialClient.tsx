"use client";

import { useRouter } from "next/navigation";
import TestimonialEditor, { type TestimonialValue } from "@/components/testimonals/TestimonalsSection";

export default function EditTestimonialClient({ initial }: { initial: any }) {
  const router = useRouter();

  async function onSave(v: TestimonialValue) {
    const res = await fetch(`/api/testimonials/${encodeURIComponent(String(initial._id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });

    const j = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(j?.message || "Failed to update testimonial");
    }

    router.push("/admin/testimonials");
    router.refresh();
  }

  async function onDelete() {
    const ok = confirm("Delete this testimonial?");
    if (!ok) return;

    const res = await fetch(`/api/testimonials/${encodeURIComponent(String(initial._id))}`, {
      method: "DELETE",
    });

    const j = await res.json().catch(() => null);

    if (!res.ok) {
      alert(j?.message || "Delete failed");
      return;
    }

    router.push("/admin/testimonials");
    router.refresh();
  }

  const castInitial: TestimonialValue = {
    name: initial.name || "",
    text: initial.text || "",
    image: initial.image || "",
    linkEnabled: Boolean(initial.linkEnabled),
    linkUrl: initial.linkUrl || "",
    published: Boolean(initial.published),
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Edit Testimonial
            </h1>
            <p className="mt-2 text-zinc-600">Update and publish testimonial.</p>
          </div>

          <button
            onClick={onDelete}
            className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <TestimonialEditor initial={castInitial} onSave={onSave} />
        </div>
      </div>
    </main>
  );
}
