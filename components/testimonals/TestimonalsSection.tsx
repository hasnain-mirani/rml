"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export type Testimonial = {
  name: string;
  text: string;
  image: string;
  linkEnabled: boolean;
  linkUrl?: string;
  published: boolean;
};

export default function TestimonialEditor({
  initial,
  onSave,
}: {
  initial: Testimonial;
  onSave: (v: Testimonial) => Promise<void>;
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
      {/* Top bar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">
              New Testimonial
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Add a review with optional link toggle.
            </p>
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
                  linkUrl: v.linkEnabled ? (v.linkUrl || "") : "",
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
            {saving ? "Saving..." : "Save Testimonial"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-7 space-y-5">
            <Card title="Person / Company name">
              <input
                placeholder="e.g. Acme Inc. / John Doe"
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={v.name}
                onChange={(e) => setV({ ...v, name: e.target.value })}
              />
            </Card>

            <Card title="Review text">
              <textarea
                placeholder="Write the testimonial..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 min-h-[240px]"
                value={v.text}
                onChange={(e) => setV({ ...v, text: e.target.value })}
              />
            </Card>

            <Card title="Optional link">
              <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-zinc-900">
                    Enable link
                  </div>
                  <div className="text-xs text-zinc-500">
                    Show “Visit” link on the testimonial.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setV({
                      ...v,
                      linkEnabled: !v.linkEnabled,
                      linkUrl: !v.linkEnabled ? v.linkUrl || "" : "",
                    })
                  }
                  className={`relative h-7 w-12 rounded-full border transition ${
                    v.linkEnabled
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      v.linkEnabled ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <input
                disabled={!v.linkEnabled}
                placeholder="https://company.com (optional)"
                className={`mt-3 h-12 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                  v.linkEnabled
                    ? "border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500"
                }`}
                value={v.linkUrl || ""}
                onChange={(e) => setV({ ...v, linkUrl: e.target.value })}
              />
            </Card>

            <Card title="Publish">
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

          {/* Right */}
          <div className="lg:col-span-5 space-y-5">
            <Card title="Photo / Company logo" subtitle="Upload to Cloudinary on save.">
              <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
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
                    <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500">
                      No image selected
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
