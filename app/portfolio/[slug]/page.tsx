import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchPortfolioBySlug } from "@/lib/fetchPortfolio";

export const dynamic = "force-dynamic";

type Params = { slug: string };

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ] as const;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = months[d.getUTCMonth()] ?? "";
  const yyyy = d.getUTCFullYear();
  return mon ? `${dd} ${mon} ${yyyy}` : "";
}

export default async function PortfolioDetailPage({
  params,
  searchParams,
}: {
  params: Params | Promise<Params>;
  searchParams?: { preview?: string };
}) {
  const { slug } = await params;

  const preview = searchParams?.preview === "1";

  const item = await fetchPortfolioBySlug(slug, {
    publishedOnly: !preview,
  });

  if (!item) notFound();

  const createdAt = (item as any).createdAt as string | undefined;

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Preview Notice */}
        {!item.published ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Preview mode: this portfolio item is not published yet.
          </div>
        ) : null}

        {/* Top nav */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 transition"
          >
            <span aria-hidden>←</span> Back to Portfolio
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {item.tags?.slice(0, 4).map((t: string) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700"
              >
                {t}
              </span>
            ))}
            {createdAt ? (
              <span className="hidden sm:inline text-xs text-neutral-500">
                {formatDate(createdAt)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            {item.title}
          </h1>

          {item.excerpt ? (
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-neutral-600 leading-relaxed">
              {item.excerpt}
            </p>
          ) : null}

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        </header>

        {/* Hero image */}
        {item.image ? (
          <section className="mb-10">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Content blocks */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 space-y-6">
          {(item.content_blocks || []).length === 0 ? (
            <div className="text-sm text-neutral-600">
              No content blocks yet.
            </div>
          ) : (
            item.content_blocks.map((b: any) => {
              if (b.type === "text") {
                return (
                  <p
                    key={b.id}
                    className="text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-wrap"
                  >
                    {b.text || ""}
                  </p>
                );
              }

              if (b.type === "image" && b.url) {
                return (
                  <div key={b.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={b.url}
                        alt={b.alt || "Portfolio image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />
                    </div>
                  </div>
                );
              }

              if (b.type === "link" && b.url) {
                return (
                  <div key={b.id}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition"
                    >
                      {b.label || "Open link"} <span aria-hidden>↗</span>
                    </a>
                  </div>
                );
              }

              return null;
            })
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-neutral-500">
            {createdAt ? `Published ${formatDate(createdAt)} • ` : ""}
            {item.tags?.[0] || "Portfolio"}
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50 transition"
          >
            Explore more work
          </Link>
        </footer>
      </article>
    </main>
  );
}
