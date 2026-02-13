// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogBySlug } from "@/lib/fetchBlogs";
import BlogContent from "@/components/blog/BlogContent";

type Params = { slug: string };

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ✅ Next 15+ can treat params as Promise in RSC
export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug, { publishedOnly: true });
  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image ? [blog.image] : [],
      type: "article",
    },
    twitter: {
      card: blog.image ? "summary_large_image" : "summary",
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug, { publishedOnly: true });
  if (!blog) notFound();

  const category = (blog as any).category || "General";
  const createdAt = (blog as any).createdAt as string | undefined;

  return (
    <main className="relative min-h-screen bg-white text-zinc-900">
      {/* soft white page glow (polished, but still WHITE) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-zinc-200/60 blur-3xl" />
        <div className="absolute -bottom-28 right-[-6rem] h-72 w-[38rem] rounded-full bg-zinc-100 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_60%)]" />
      </div>

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top nav */}
        <div className="mb-7 flex items-center justify-between gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition"
          >
            <span aria-hidden className="text-zinc-500">
              ←
            </span>
            Back to Blog
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
              {category}
            </span>
            {createdAt ? (
              <span className="hidden sm:inline text-xs text-zinc-500">
                {formatDate(createdAt)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900">
            {blog.title}
          </h1>

          {blog.excerpt ? (
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-600 leading-relaxed">
              {blog.excerpt}
            </p>
          ) : null}

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        </header>

        {/* Hero image */}
        {blog.image ? (
          <section className="mb-10">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-zinc-100">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
                {/* subtle vignette for readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </div>
          </section>
        ) : null}

        {/* Content card */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <BlogContent content={blog.content || ""} />
        </section>

        {/* Footer actions */}
        <footer className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            {createdAt ? `Published ${formatDate(createdAt)} • ` : ""}
            {category}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition"
            >
              Explore more posts
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
