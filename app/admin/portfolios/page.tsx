import Link from "next/link";
import { fetchPortfolio } from "@/lib/fetchPortfolio";

export default async function AdminPortfolioPage() {
  const items = await fetchPortfolio({ publishedOnly: false });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Portfolio (Admin)
            </h1>
            <p className="mt-2 text-zinc-600">
              Create, review, and publish portfolio items.
            </p>
          </div>

          <Link
            href="/admin/portfolios/new"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            + New Portfolio
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Open</div>
          </div>

          {items.map((p) => (
            <div
              key={p.slug}
              className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-zinc-100"
            >
              <div className="col-span-6 font-medium text-zinc-900 truncate">
                {p.title}
              </div>
              <div className="col-span-3 text-zinc-600 truncate">{p.slug}</div>
              <div className="col-span-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs border ${
                    p.published
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <Link
                  href={`/portfolios/${p.slug}`}
                  className="text-zinc-700 hover:text-zinc-900 underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <div className="p-6 text-zinc-600">No portfolio items yet.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
