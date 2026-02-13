import Link from "next/link";
import { fetchPodcasts } from "@/lib/fetchPodcasts";

export const dynamic = "force-dynamic";

export default async function AdminPodcastsPage() {
  const items = await fetchPodcasts({ publishedOnly: false });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Podcasts
            </h1>
            <p className="mt-2 text-zinc-600">
              Create, review, and publish podcast posts.
            </p>
          </div>

          <Link
            href="/admin/podcasts/new"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            + New Podcast
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {items.map((p: any) => (
            <div
              key={p._id || p.slug}
              className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-zinc-100"
            >
              <div className="col-span-5 font-medium text-zinc-900 truncate">
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

              <div className="col-span-2 flex justify-end gap-2">
                <Link
                  href={`/podcasts/${p.slug}?preview=1`}
                  target="_blank"
                  className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                >
                  View
                </Link>

                <Link
                  href={`/admin/podcasts/${p.slug}`}
                  className="rounded-xl border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50"
                >
                  Edit
                </Link>

                <Link
                  href={`/admin/podcasts/${p.slug}?delete=1`}
                  className="rounded-xl border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </Link>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <div className="p-6 text-zinc-600">No podcasts yet.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
