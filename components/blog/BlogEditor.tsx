"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string; // Cloudinary URL
  published: boolean;
  category?: string;
};

export default function BlogEditor({
  initial,
  onSave,
}: {
  initial: Blog;
  onSave: (v: Blog) => Promise<void>;
}) {
  const [v, setV] = useState(initial);
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
    <div className="bg-white">
      {/* Top action bar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">
              Write a blog post
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Add cover, summary, content, then publish when ready.
            </p>
          </div>

          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                let imageUrl = v.image || "";
                if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

                await onSave({ ...v, image: imageUrl });

                if (localPreview) URL.revokeObjectURL(localPreview);
                setLocalPreview("");
                setImageFile(null);
              } finally {
                setSaving(false);
              }
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: fields */}
          <div className="lg:col-span-8 space-y-5">
            <Card title="Title">
              <input
                placeholder="Blog title"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
              />
            </Card>

            <Card title="One-line summary">
              <textarea
                placeholder="Short summary for cards and SEO..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[110px]"
                value={v.excerpt}
                onChange={(e) => setV({ ...v, excerpt: e.target.value })}
              />
            </Card>

            <Card title="Main text">
              <textarea
                placeholder="Write your blog content..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[360px]"
                value={v.content}
                onChange={(e) => setV({ ...v, content: e.target.value })}
              />
              <p className="mt-2 text-xs text-zinc-500">
                Tip: If you want links & images inside content, we can switch this
                textarea to a block editor later (same API).
              </p>
            </Card>
          </div>

          {/* Right: cover + publish */}
          <div className="lg:col-span-4 space-y-5">
            <Card
              title="Cover image"
              subtitle="Upload to Cloudinary on save."
            >
              <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                <div className="relative aspect-[16/10]">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 420px"
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
                    Saved URL: <span className="text-zinc-700">{v.image}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Publish" subtitle="Drafts won’t show publicly.">
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-zinc-700">
                  {v.published ? "Published" : "Draft"}
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
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-zinc-600">
                  Category (optional)
                </label>
                <input
                  className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  placeholder="General"
                  value={v.category || ""}
                  onChange={(e) => setV({ ...v, category: e.target.value })}
                />
              </div>
            </Card>

            <p className="text-xs text-zinc-500">
              If Cloudinary images don’t show, add domain to{" "}
              <span className="font-medium text-zinc-700">next.config.js</span>{" "}
              remotePatterns and restart dev server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
