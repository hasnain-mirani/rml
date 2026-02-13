// components/admin/PodcastEditor.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import ContentBlocksEditor, { type ContentBlock } from "./ContentBlocksEditor";

export type Podcast = {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date?: string;
  published: boolean;
  category?: string;
  content_blocks: ContentBlock[];
};

export default function PodcastEditor({
  initial,
  onSave,
}: {
  initial: Podcast;
  onSave: (v: Podcast) => Promise<void>;
}) {
  const [v, setV] = useState<Podcast>(() => ({
    ...initial,
    content_blocks: initial.content_blocks || [],
    date: initial.date || "",
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
    if (file) setLocalPreview(URL.createObjectURL(file));
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">
              Create a podcast post
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Heading, summary, cover, date, and rich blocks (YouTube/Spotify/Apple links).
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <label className="block text-xs font-medium text-zinc-600">
                Heading
              </label>
              <input
                placeholder="Podcast title"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
              />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <label className="block text-xs font-medium text-zinc-600">
                One line summary
              </label>
              <textarea
                placeholder="Short summary for cards and SEO..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                rows={3}
                value={v.excerpt}
                onChange={(e) => setV({ ...v, excerpt: e.target.value })}
              />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <label className="block text-xs font-medium text-zinc-600">
                Date
              </label>
              <input
                type="date"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.date || ""}
                onChange={(e) => setV({ ...v, date: e.target.value })}
              />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <ContentBlocksEditor
                theme="light"
                label="Main Text"
                helperText="Use blocks: text/links/images + YouTube/Spotify/Apple podcast URLs."
                value={v.content_blocks}
                onChange={(next) => setV({ ...v, content_blocks: next })}
                allowed={[
                  "heading",
                  "paragraph",
                  "link",
                  "image",
                  "youtube",
                  "spotify",
                  "apple",
                ]}
                enableImageUpload
              />
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Cover picture
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Upload to Cloudinary on save.
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                <div className="relative aspect-[16/10]">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500">
                      No cover selected
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <label className="cursor-pointer rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePickFile(e.target.files?.[0] || null)}
                  />
                  {imageFile ? "Change image" : "Upload image"}
                </label>

                {(imageFile || v.image) && (
                  <button
                    type="button"
                    onClick={() => {
                      handlePickFile(null);
                      setV({ ...v, image: "" });
                    }}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    Remove image
                  </button>
                )}

                {v.image && !imageFile && (
                  <div className="text-xs text-zinc-500 break-words">
                    Saved URL:{" "}
                    <span className="text-zinc-700">{v.image}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <label className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Publish
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Drafts won’t show on public pages.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setV({ ...v, published: !v.published })}
                  className={`relative h-7 w-12 rounded-full border transition ${
                    v.published
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-zinc-100 border-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      v.published ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>

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
                  });

                  if (localPreview) URL.revokeObjectURL(localPreview);
                  setLocalPreview("");
                  setImageFile(null);
                } finally {
                  setSaving(false);
                }
              }}
              className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Podcast"}
            </button>

            <p className="text-xs text-zinc-500">
              Tip: Add Cloudinary domain to next.config remotePatterns and restart dev server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
