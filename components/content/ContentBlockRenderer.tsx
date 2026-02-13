import Image from "next/image";
import type { ContentBlock } from "@/components/admin/ContentBlocksEditor";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    return null;
  } catch {
    return null;
  }
}

export default function ContentBlocksRenderer({
  blocks,
}: {
  blocks: ContentBlock[];
}) {
  if (!blocks?.length) return null;

  return (
    <div className="prose prose-zinc max-w-none">
      {blocks.map((b) => {
        if (b.type === "heading") {
          return (
            <h2 key={b.id} className="mt-8 scroll-mt-24">
              {b.text}
            </h2>
          );
        }

        if (b.type === "paragraph") {
          return (
            <p key={b.id} className="leading-relaxed">
              {b.text}
            </p>
          );
        }

        if (b.type === "link") {
          return (
            <p key={b.id}>
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 no-underline hover:bg-zinc-100"
              >
                <span className="font-medium">{b.label || "Link"}</span>
                <span className="text-zinc-500 break-all">{b.url}</span>
              </a>
            </p>
          );
        }

        if (b.type === "image") {
          return (
            <div
              key={b.id}
              className="my-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="relative aspect-[16/9] bg-zinc-100">
                <Image
                  src={b.url}
                  alt={b.alt || "Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1000px"
                />
              </div>
              {b.alt ? (
                <div className="px-4 py-3 text-xs text-zinc-500">{b.alt}</div>
              ) : null}
            </div>
          );
        }

        if (b.type === "youtube") {
          const id = extractYouTubeId(b.url);
          if (!id) {
            return (
              <p key={b.id}>
                <a href={b.url} target="_blank" rel="noreferrer">
                  YouTube: {b.url}
                </a>
              </p>
            );
          }
          return (
            <div
              key={b.id}
              className="my-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
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
          );
        }

        if (b.type === "spotify" || b.type === "apple") {
          const label = b.type === "spotify" ? "Spotify" : "Apple Podcast";
          return (
            <p key={b.id}>
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 no-underline hover:bg-zinc-50"
              >
                <span className="font-medium">{label}</span>
                <span className="text-zinc-500 break-all">{b.url}</span>
              </a>
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
