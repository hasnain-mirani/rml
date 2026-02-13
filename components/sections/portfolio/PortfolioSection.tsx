import Link from "next/link";
import Image from "next/image";
import PortfolioWaves from "./PortfolioWaves";
import { fetchPortfolio } from "@/lib/fetchPortfolio";

export default async function PortfolioSection() {
  // ✅ dynamic from API/db
  const items = await fetchPortfolio({ publishedOnly: true });

  return (
    <section className="relative overflow-hidden bg-[var(--bg-soft)] pb-20">
      
      {/* Waves background */}
      <div className="pointer-events-none absolute inset-0">
        <PortfolioWaves />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-16 md:pt-20">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--purple)] transition hover:opacity-80"
          >
            <span className="text-lg">←</span>
            Back to Home Page
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-display text-[38px] font-semibold leading-tight text-[var(--purple)] md:text-[56px]">
            Proven Impact: Our Case Studies & <br className="hidden md:block" />
            Success Portfolio
          </h1>
        </div>

        {/* Cards (dynamic) */}
        <div className="mt-14">
          {items.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-sm text-[var(--purple)]/80 backdrop-blur">
              No portfolio items published yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <Link
                  key={it.slug}
                  href={`/portfolio/${it.slug}`}
                  className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/15"
                >
                  {/* Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {it.image ? (
                      <Image
                        src={it.image}
                        alt={it.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-sm text-[var(--purple)]/60">
                        No cover
                      </div>
                    )}

                    {/* soft overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {(it.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-[var(--purple)]/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-[var(--purple)]">
                      {it.title}
                    </h3>

                    {it.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--purple)]/75">
                        {it.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--purple)] opacity-90 transition group-hover:opacity-100">
                      View details <span aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
