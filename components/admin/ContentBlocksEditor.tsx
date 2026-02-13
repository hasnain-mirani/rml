"use client";

import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

/* =========================
   CONTENT BLOCKS
========================= */

export type ContentBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "link"; label: string; url: string }
  | { id: string; type: "image"; url: string; alt?: string }
  | { id: string; type: "youtube"; url: string }
  | { id: string; type: "spotify"; url: string }
  | { id: string; type: "apple"; url: string };

type AllowedBlockType = ContentBlock["type"];

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isUrlLike(s: string) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // youtube.com/embed/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    return null;
  } catch {
    return null;
  }
}

export function blocksToPlainText(blocks: ContentBlock[]) {
  return blocks
    .map((b) => {
      if (b.type === "heading") return `# ${b.text}`;
      if (b.type === "paragraph") return b.text;
      if (b.type === "link") return `${b.label}: ${b.url}`;
      if (b.type === "image") return `[image] ${b.url}`;
      if (b.type === "youtube") return `[youtube] ${b.url}`;
      if (b.type === "spotify") return `[spotify] ${b.url}`;
      if (b.type === "apple") return `[apple] ${b.url}`;
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

type Props = {
  label?: string;
  helperText?: string;
  value: ContentBlock[];
  onChange: (next: ContentBlock[]) => void;

  /** which block buttons appear */
  allowed?: AllowedBlockType[];

  /** if true, image blocks can upload via Cloudinary */
  enableImageUpload?: boolean;

  /** cosmetic */
  theme?: "dark" | "light";
};

const DEFAULT_ALLOWED: AllowedBlockType[] = ["heading", "paragraph", "link", "image"];

export default function ContentBlocksEditor({
  label = "Main Text",
  helperText = "Build your content with blocks (text, links, images, embeds).",
  value,
  onChange,
  allowed = DEFAULT_ALLOWED,
  enableImageUpload = true,
  theme = "dark",
}: Props) {
  const isDark = theme === "dark";

  const shell = isDark
    ? "rounded-3xl border border-white/10 bg-white/[0.03]"
    : "rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]";

  const labelCls = isDark ? "text-white/60" : "text-zinc-600";
  const titleCls = isDark ? "text-white" : "text-zinc-900";
  const helperCls = isDark ? "text-white/50" : "text-zinc-500";

  const inputBase = isDark
    ? "bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/20"
    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300";

  const btnBase = isDark
    ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.06]"
    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50";

  const dangerBtn = isDark
    ? "border-white/10 bg-black/30 text-white/80 hover:text-white"
    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50";

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    onChange(value.map((b) => (b.id === id ? ({ ...b, ...patch } as any) : b)));
  }

  function removeBlock(id: string) {
    onChange(value.filter((b) => b.id !== id));
  }

  function move(id: string, dir: -1 | 1) {
    const idx = value.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= value.length) return;

    const copy = [...value];
    const [item] = copy.splice(idx, 1);
    copy.splice(nextIdx, 0, item);
    onChange(copy);
  }

  function addBlock(type: AllowedBlockType) {
    const base: any = { id: uid(), type };
    if (type === "heading" || type === "paragraph") base.text = "";
    if (type === "link") {
      base.label = "";
      base.url = "";
    }
    if (type === "image") {
      base.url = "";
      base.alt = "";
    }
    if (type === "youtube" || type === "spotify" || type === "apple") base.url = "";
    onChange([...(value || []), base]);
  }

  async function uploadImageForBlock(blockId: string, file: File | null) {
    if (!file) return;
    const url = await uploadToCloudinary(file);
    updateBlock(blockId, { url } as any);
  }

  const hasBlocks = value?.length > 0;

  return (
    <div className={`${shell} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-sm font-semibold ${titleCls}`}>{label}</div>
          <div className={`mt-1 text-xs ${helperCls}`}>{helperText}</div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {allowed.includes("heading") && (
            <button
              type="button"
              onClick={() => addBlock("heading")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Heading
            </button>
          )}
          {allowed.includes("paragraph") && (
            <button
              type="button"
              onClick={() => addBlock("paragraph")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Text
            </button>
          )}
          {allowed.includes("link") && (
            <button
              type="button"
              onClick={() => addBlock("link")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Link
            </button>
          )}
          {allowed.includes("image") && (
            <button
              type="button"
              onClick={() => addBlock("image")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Image
            </button>
          )}
          {allowed.includes("youtube") && (
            <button
              type="button"
              onClick={() => addBlock("youtube")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + YouTube
            </button>
          )}
          {allowed.includes("spotify") && (
            <button
              type="button"
              onClick={() => addBlock("spotify")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Spotify
            </button>
          )}
          {allowed.includes("apple") && (
            <button
              type="button"
              onClick={() => addBlock("apple")}
              className={`rounded-2xl border px-3 py-2 text-xs transition ${btnBase}`}
            >
              + Apple
            </button>
          )}
        </div>
      </div>

      {!hasBlocks ? (
        <div
          className={`mt-4 rounded-2xl border p-4 text-sm ${
            isDark
              ? "border-white/10 bg-black/30 text-white/60"
              : "border-zinc-200 bg-zinc-50 text-zinc-600"
          }`}
        >
          No blocks yet. Add “Text” to start writing, then mix in links, images, or embeds.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {value.map((b, idx) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 ${
                isDark ? "border-white/10 bg-black/20" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`text-xs font-medium ${labelCls}`}>
                  {idx + 1}.{" "}
                  <span className={isDark ? "text-white/80" : "text-zinc-800"}>
                    {b.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(b.id, -1)}
                    className={`rounded-xl border px-2 py-1 text-xs transition ${btnBase}`}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(b.id, 1)}
                    className={`rounded-xl border px-2 py-1 text-xs transition ${btnBase}`}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(b.id)}
                    className={`rounded-xl border px-2 py-1 text-xs transition ${dangerBtn}`}
                    aria-label="Remove block"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Block fields */}
              <div className="mt-3">
                {(b.type === "heading" || b.type === "paragraph") && (
                  <>
                    <label className={`block text-xs font-medium ${labelCls}`}>
                      {b.type === "heading" ? "Heading text" : "Paragraph text"}
                    </label>
                    <textarea
                      rows={b.type === "heading" ? 2 : 6}
                      className={`mt-2 w-full rounded-2xl border p-3 text-sm outline-none transition ${inputBase}`}
                      value={b.text}
                      onChange={(e) => updateBlock(b.id, { text: e.target.value } as any)}
                      placeholder={
                        b.type === "heading"
                          ? "Section heading..."
                          : "Write your content..."
                      }
                    />
                  </>
                )}

                {b.type === "link" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={`block text-xs font-medium ${labelCls}`}>
                        Link label
                      </label>
                      <input
                        className={`mt-2 h-11 w-full rounded-2xl border px-3 text-sm outline-none transition ${inputBase}`}
                        value={b.label}
                        onChange={(e) => updateBlock(b.id, { label: e.target.value } as any)}
                        placeholder="e.g. Official website"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium ${labelCls}`}>
                        URL
                      </label>
                      <input
                        className={`mt-2 h-11 w-full rounded-2xl border px-3 text-sm outline-none transition ${inputBase}`}
                        value={b.url}
                        onChange={(e) => updateBlock(b.id, { url: e.target.value } as any)}
                        placeholder="https://..."
                      />
                      {!!b.url && !isUrlLike(b.url) ? (
                        <div className={isDark ? "mt-2 text-xs text-amber-300/80" : "mt-2 text-xs text-amber-700"}>
                          This doesn’t look like a valid URL.
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {b.type === "image" && (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={`block text-xs font-medium ${labelCls}`}>
                          Image URL (auto after upload)
                        </label>
                        <input
                          className={`mt-2 h-11 w-full rounded-2xl border px-3 text-sm outline-none transition ${inputBase}`}
                          value={b.url}
                          onChange={(e) => updateBlock(b.id, { url: e.target.value } as any)}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${labelCls}`}>
                          Alt text (optional)
                        </label>
                        <input
                          className={`mt-2 h-11 w-full rounded-2xl border px-3 text-sm outline-none transition ${inputBase}`}
                          value={b.alt || ""}
                          onChange={(e) => updateBlock(b.id, { alt: e.target.value } as any)}
                          placeholder="Describe the image..."
                        />
                      </div>
                    </div>

                    {enableImageUpload && (
                      <label
                        className={`group flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-sm transition ${btnBase}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            uploadImageForBlock(b.id, e.target.files?.[0] || null)
                          }
                        />
                        <span className="font-medium">Upload image</span>
                      </label>
                    )}

                    <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-white/10 bg-black/30" : "border-zinc-200 bg-zinc-50"}`}>
                      <div className="relative aspect-[16/10]">
                        {b.url ? (
                          <Image
                            src={b.url}
                            alt={b.alt || "Content image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center text-sm ${isDark ? "text-white/50" : "text-zinc-500"}`}>
                            No image selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(b.type === "youtube" || b.type === "spotify" || b.type === "apple") && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium ${labelCls}`}>
                        {b.type === "youtube"
                          ? "YouTube URL"
                          : b.type === "spotify"
                          ? "Spotify URL"
                          : "Apple Podcast URL"}
                      </label>
                      <input
                        className={`mt-2 h-11 w-full rounded-2xl border px-3 text-sm outline-none transition ${inputBase}`}
                        value={b.url}
                        onChange={(e) => updateBlock(b.id, { url: e.target.value } as any)}
                        placeholder="https://..."
                      />
                    </div>

                    {b.type === "youtube" ? (
                      (() => {
                        const id = extractYouTubeId(b.url);
                        return id ? (
                          <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-white/10 bg-black/30" : "border-zinc-200 bg-zinc-50"}`}>
                            <div className="relative aspect-video">
                              <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`https://www.youtube-nocookie.com/embed/${id}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        ) : b.url ? (
                          <div className={isDark ? "text-xs text-amber-300/80" : "text-xs text-amber-700"}>
                            Paste a valid YouTube link (watch, youtu.be, or embed).
                          </div>
                        ) : null;
                      })()
                    ) : (
                      <div
                        className={`rounded-2xl border p-3 text-xs ${
                          isDark
                            ? "border-white/10 bg-black/30 text-white/60"
                            : "border-zinc-200 bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        Embed preview can be added later. For now we store the URL and render it on the public page.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
