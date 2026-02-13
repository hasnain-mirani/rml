// components/admin/CaseStudyEditor.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import ContentBlocksEditor, { type ContentBlock } from "./ContentBlocksEditor";

export type CaseStudy = {
  title: string;
  slug: string; // ✅ required by schema
  excerpt: string;
  tags: string[];
  published: boolean;
  image?: string;
  content_blocks: ContentBlock[];
};

function toSlug(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/g, "");
}

function normalizeTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 25);
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
        {subtitle ? (
          <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function CaseStudyEditor({
  initial,
  onSave,
  mode,
}: {
  initial: CaseStudy;
  onSave: (v: CaseStudy) => Promise<void>;
  mode?: "new" | "edit"; // optional (nice for UI)
}) {
  const [v, setV] = useState<CaseStudy>(() => ({
    ...initial,
    // ✅ ensure schema-required slug exists (auto from title if empty)
    slug: initial.slug?.trim() ? initial.slug : toSlug(initial.title),
    content_blocks: initial.content_blocks || [],
    tags: initial.tags || [],
    image: initial.image || "",
  }));

  const [saving, setSaving] = useState(false);

  // cover image upload (cloudinary)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>("");

  const previewSrc = useMemo(() => {
    if (localPreview) return localPreview;
    return v.image || "";
  }, [localPreview, v.image]);

  // ✅ keep slug in sync with title (ONLY if user hasn't manually edited slug)
  const [slugTouched, setSlugTouched] = useState<boolean>(() => !!initial.slug?.trim());
  useEffect(() => {
    if (!slugTouched) {
      setV((prev) => ({ ...prev, slug: toSlug(prev.title) }));
    }
  }, [v.title, slugTouched]);

  async function handlePickFile(file: File | null) {
    setImageFile(file);

    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview("");

    if (file) setLocalPreview(URL.createObjectURL(file));
  }

  const slugError = !v.slug?.trim();
  const titleError = !v.title?.trim();

  return (
    <div className="bg-white">
      {/* Top bar (PortfolioEditor theme) */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">
              {mode === "edit" ? "Edit Case Study" : "Case Study Editor"}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Cover + summary + tags + rich blocks.
            </p>
          </div>

          <button
            disabled={saving || titleError || slugError}
            onClick={async () => {
              setSaving(true);
              try {
                let coverUrl = v.image || "";
                if (imageFile) coverUrl = await uploadToCloudinary(imageFile);

                await onSave({
                  ...v,
                  slug: toSlug(v.slug || v.title), // ✅ ensure safe slug
                  image: coverUrl || "",
                });

                if (localPreview) URL.revokeObjectURL(localPreview);
                setLocalPreview("");
                setImageFile(null);
              } finally {
                setSaving(false);
              }
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Case Study"}
          </button>
        </div>

        {(titleError || slugError) && (
          <div className="text-xs text-amber-700">
            {titleError ? "Title is required. " : ""}
            {slugError ? "Slug is required." : ""}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8 space-y-5">
            <Card title="Heading">
              <input
                placeholder="Case study title"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.title}
                onChange={(e) => setV({ ...v, title: e.target.value })}
              />
            </Card>

            {/* ✅ Slug field (required) */}
            <Card
              title="Slug"
              subtitle="Used in URL: /case-studies/[slug]. Auto-generated from title."
            >
              <input
                placeholder="e.g. my-awesome-project"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setV({ ...v, slug: toSlug(e.target.value) });
                }}
              />

              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <div className="text-zinc-500 truncate">
                  Preview: <span className="text-zinc-700">/case-studies/{v.slug || "…"}</span>
                </div>

                {!slugTouched ? (
                  <span className="text-zinc-500">Auto</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(false);
                      setV((prev) => ({ ...prev, slug: toSlug(prev.title) }));
                    }}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
                  >
                    Reset
                  </button>
                )}
              </div>
            </Card>

            <Card title="One line summary">
              <textarea
                placeholder="Short summary for cards and SEO..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[110px]"
                value={v.excerpt}
                onChange={(e) => setV({ ...v, excerpt: e.target.value })}
              />
            </Card>

            <Card title="Tags" subtitle="Comma separated (e.g. UI/UX, Branding, React)">
              <input
                placeholder="UI/UX, Branding, React"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.tags.join(", ")}
                onChange={(e) => setV({ ...v, tags: normalizeTags(e.target.value) })}
              />

              {v.tags.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>

            {/* Content blocks — keep existing component */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <ContentBlocksEditor
                theme="light"
                label="Main Text"
                helperText="Add headings, paragraphs, links, and images inside the case study."
                value={v.content_blocks}
                onChange={(next) => setV({ ...v, content_blocks: next })}
                allowed={["heading", "paragraph", "link", "image"]}
                enableImageUpload
              />
            </div>
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

                {v.image && !imageFile ? (
                  <div className="text-xs text-zinc-500 break-words">
                    Saved URL: <span className="text-zinc-700">{v.image}</span>
                  </div>
                ) : null}
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

            <p className="text-xs text-zinc-500">
              Tip: Add Cloudinary domain to next.config remotePatterns and restart dev server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
