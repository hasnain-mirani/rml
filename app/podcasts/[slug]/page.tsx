import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchPodcastBySlug } from "@/lib/fetchPodcasts";
import ContentBlocksRenderer from "@/components/content/ContentBlockRenderer";

type Params = { slug: string };

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Params | Promise<Params> }) {
  const { slug } = await params;
  const item = await fetchPodcastBySlug(slug, { publishedOnly: true });
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt || item.title,
    openGraph: {
      title: item.title,
      description: item.excerpt || item.title,
      images: item.image ? [item.image] : [],
      type: "article",
    },
    twitter: {
      card: item.image ? "summary_large_image" : "summary",
      title: item.title,
      description: item.excerpt || item.title,
      images: item.image ? [item.image] : [],
    },
  };
}

export default async function PodcastDetailPage({ params }: { params: Params | Promise<Params> }) {
  const { slug } = await params;
  const p = await fetchPodcastBySlug(slug, { publishedOnly: true });
  if (!p) notFound();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-7 flex items-center justify-between gap-3">
          <Link
            href="/podcasts"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition"
          >
            <span aria-hidden className="text-zinc-500">←</span>
            Back to Podcasts
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
              {p.category || "Podcast"}
            </span>
            {p.date ? (
              <span className="hidden sm:inline text-xs text-zinc-500">
                {formatDate(p.date)}
              </span>
            ) : null}
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            {p.title}
          </h1>
          {p.excerpt ? (
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-600 leading-relaxed">
              {p.excerpt}
            </p>
          ) : null}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        </header>

        {p.image ? (
          <section className="mb-10">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-zinc-100">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <ContentBlocksRenderer blocks={p.content_blocks || []} />
        </section>

        <footer className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            {p.date ? `Published ${formatDate(p.date)} • ` : ""}
            {p.category || "Podcast"}
          </div>

          <Link
            href="/podcasts"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            Explore more
          </Link>
        </footer>
      </article>
    </main>
  );
}
