// components/admin/TestimonialEditor.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export type Testimonial = {
  name: string; // company/person name
  text: string; // testimonial text
  image: string; // person/company picture (Cloudinary URL)
  linkEnabled: boolean; // toggle on/off
  linkUrl?: string; // optional link
  published: boolean;
};

export default function TestimonialEditor({
  initial,
  onSave,
}: {
  initial: Testimonial;
  onSave: (v: Testimonial) => Promise<void>;
}) {
  const [v, setV] = useState<Testimonial>(() => ({
    ...initial,
    linkEnabled: initial.linkEnabled ?? false,
    linkUrl: initial.linkUrl || "",
  }));
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>("");

  const previewSrc = useMemo(() => {
    if (localPreview) return localPreview;
    return v.image || "";
  }, [localPreview, v.image]);

  async function handlePickFile(file: File | null) {
    setImageFile(file);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview("");

    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Add a testimonial</h2>
          <p className="mt-1 text-sm text-white/60">
            Photo, review text, name, and optional link (toggle).
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <label className="block text-xs font-medium text-white/60">
                Company / Person name
              </label>
              <input
                placeholder="e.g. Acme Inc. / John Doe"
                className="mt-2 h-12 w-full rounded-2xl bg-black/30 border border-white/10 px-4 text-base text-white outline-none transition focus:border-white/20"
                value={v.name}
                onChange={(e) => setV({ ...v, name: e.target.value })}
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <label className="block text-xs font-medium text-white/60">
                Review / testimonial text
              </label>
              <textarea
                placeholder="Write the testimonial..."
                className="mt-2 w-full rounded-2xl bg-black/30 border border-white/10 p-4 text-sm text-white outline-none transition focus:border-white/20 min-h-[220px]"
                value={v.text}
                onChange={(e) => setV({ ...v, text: e.target.value })}
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Optional link
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    Toggle on/off to show the link on public page.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setV((prev) => ({
                      ...prev,
                      linkEnabled: !prev.linkEnabled,
                    }))
                  }
                  className={`relative h-7 w-12 rounded-full border transition ${
                    v.linkEnabled
                      ? "bg-emerald-500/80 border-emerald-400/30"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                      v.linkEnabled ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {v.linkEnabled ? (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-white/60">
                    Link URL
                  </label>
                  <input
                    placeholder="https://..."
                    className="mt-2 h-12 w-full rounded-2xl bg-black/30 border border-white/10 px-4 text-sm text-white outline-none transition focus:border-white/20"
                    value={v.linkUrl || ""}
                    onChange={(e) => setV({ ...v, linkUrl: e.target.value })}
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div>
                <div className="text-sm font-semibold text-white">Picture</div>
                <div className="mt-1 text-xs text-white/60">
                  Upload to Cloudinary on save.
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="relative aspect-[4/3]">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Testimonial"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <label className="group flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white transition hover:bg-white/[0.06]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePickFile(e.target.files?.[0] || null)}
                  />
                  <span className="font-medium">
                    {imageFile ? "Change image" : "Upload image"}
                  </span>
                </label>

                {(imageFile || v.image) && (
                  <button
                    type="button"
                    onClick={() => {
                      handlePickFile(null);
                      setV({ ...v, image: "" });
                    }}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 hover:text-white transition"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>

            {/* Publish toggle */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <label className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">Publish</div>
                  <div className="mt-1 text-xs text-white/60">
                    Drafts won’t show on public pages.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setV({ ...v, published: !v.published })}
                  className={`relative h-7 w-12 rounded-full border transition ${
                    v.published
                      ? "bg-emerald-500/80 border-emerald-400/30"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                      v.published ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Save */}
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  let imageUrl = v.image || "";
                  if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

                  await onSave({
                    ...v,
                    image: imageUrl,
                    linkUrl: v.linkEnabled ? v.linkUrl || "" : "",
                  });

                  if (localPreview) URL.revokeObjectURL(localPreview);
                  setLocalPreview("");
                  setImageFile(null);
                } finally {
                  setSaving(false);
                }
              }}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 transition active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
