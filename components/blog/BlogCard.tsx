import Link from "next/link";
import Image from "next/image";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
};

function isDataUrl(src: string) {
  return src.startsWith("data:image/");
}

function safeImageSrc(src?: string) {
  if (!src) return null;
  const s = src.trim();
  if (!s) return null;
  return s;
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const img = safeImageSrc(blog.image);

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.04]">
        {img ? (
          <Image
            src={img}
            alt={blog.title}
            fill
            // If it's a base64/data URL, Next can optimize weirdly; disable optimization.
            unoptimized={isDataUrl(img)}
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          // fallback “cover” so layout stays consistent
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-xs font-medium text-white/40">No cover image</div>
          </div>
        )}
      </div>

      <div className="space-y-3 p-6">
        <h2 className="text-lg font-semibold text-white">{blog.title}</h2>

        <p className="text-sm leading-relaxed text-white/60 line-clamp-3">
          {blog.excerpt || "—"}
        </p>

        <span className="inline-block text-sm font-medium text-white/80 group-hover:text-white">
          Read article →
        </span>
      </div>
    </Link>
  );
}
