"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export type PortfolioBlock =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; url: string; alt?: string }
  | { id: string; type: "link"; url: string; label?: string };

export type PortfolioItem = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  image: string;
  published: boolean;
  content_blocks: PortfolioBlock[];
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function parseTags(input: string) {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export default function PortfolioEditor({
  initial,
  onSave,
}: {
  initial: PortfolioItem;
  onSave: (v: PortfolioItem) => Promise<void>;
}) {
  const [v, setV] = useState<PortfolioItem>(initial);
  const [saving, setSaving] = useState(false);

  // cover image upload (cloudinary)
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

  function addBlock(type: PortfolioBlock["type"]) {
    const id = uid();
    const block: PortfolioBlock =
      type === "text"
        ? { id, type: "text", text: "" }
        : type === "image"
        ? { id, type: "image", url: "", alt: "" }
        : { id, type: "link", url: "", label: "" };

    setV((prev) => ({ ...prev, content_blocks: [...prev.content_blocks, block] }));
  }

  function updateBlock(id: string, patch: any) {
    setV((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }

  function removeBlock(id: string) {
    setV((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((b) => b.id !== id),
    }));
  }

  return (
    <div className="bg-white">
      {/* Top bar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">
              Portfolio Editor
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Cover + summary + tags + rich blocks (text, links, images).
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
            {saving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8 space-y-5">
            <Card title="Heading">
              <input
                placeholder="Project title"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
              />
            </Card>

            <Card title="One line summary">
              <textarea
                placeholder="Short summary for cards..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[110px]"
                value={v.excerpt}
                onChange={(e) => setV({ ...v, excerpt: e.target.value })}
              />
            </Card>

            <Card title="Tags" subtitle="Comma separated (e.g. Next.js, UI, SaaS)">
              <input
                placeholder="Next.js, React, UI, SaaS"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.tags.join(", ")}
                onChange={(e) => setV({ ...v, tags: parseTags(e.target.value) })}
              />

              {v.tags.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card
              title="Main content"
              subtitle="Build your page using blocks (text, image, link)."
            >
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addBlock("text")}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("link")}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  + Link
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {v.content_blocks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
                    No blocks yet. Add text, images, or links.
                  </div>
                ) : null}

                {v.content_blocks.map((b, idx) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-900">
                        {idx + 1}. {b.type.toUpperCase()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBlock(b.id)}
                        className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
                      >
                        Remove
                      </button>
                    </div>

                    {b.type === "text" ? (
                      <textarea
                        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[150px]"
                        placeholder="Write text..."
                        value={b.text}
                        onChange={(e) => updateBlock(b.id, { text: e.target.value })}
                      />
                    ) : null}

                    {b.type === "image" ? (
                      <div className="mt-3 grid gap-3">
                        <input
                          className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                          placeholder="Image URL (Cloudinary or https://...)"
                          value={b.url}
                          onChange={(e) => updateBlock(b.id, { url: e.target.value })}
                        />
                        <input
                          className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                          placeholder="Alt text (optional)"
                          value={b.alt || ""}
                          onChange={(e) => updateBlock(b.id, { alt: e.target.value })}
                        />
                      </div>
                    ) : null}

                    {b.type === "link" ? (
                      <div className="mt-3 grid gap-3">
                        <input
                          className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                          placeholder="https://..."
                          value={b.url}
                          onChange={(e) => updateBlock(b.id, { url: e.target.value })}
                        />
                        <input
                          className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                          placeholder="Label (optional)"
                          value={(b as any).label || ""}
                          onChange={(e) => updateBlock(b.id, { label: e.target.value })}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-5">
            <Card title="Cover image" subtitle="Upload to Cloudinary on save.">
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
              </div>
            </Card>

            <Card title="Publish" subtitle="Drafts won’t show publicly.">
              <div className="mt-2 flex items-center justify-between">
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
            </Card>
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
      <div>
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-zinc-500">{subtitle}</div> : null}
      </div>
      {children}
    </section>
  );
}
