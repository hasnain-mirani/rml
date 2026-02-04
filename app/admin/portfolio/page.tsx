import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";

export default async function AdminPortfolioListPage() {
  await dbConnect();
  const items = await CaseStudy.find().sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Portfolio Case Studies</h2>
          <p className="text-sm text-white/60">Create, edit, publish and delete.</p>
        </div>

        <Link
          href="/admin/portfolio/new"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black hover:opacity-90"
        >
          + New Case Study
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-12 bg-white/5 px-4 py-3 text-xs text-white/60">
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-white/60">
            No items yet.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((x: any) => (
              <div key={String(x._id)} className="grid grid-cols-12 items-center px-4 py-4">
                <div className="col-span-4">
                  <div className="font-medium">{x.title}</div>
                  <div className="text-xs text-white/50">{x.label}</div>
                </div>
                <div className="col-span-3 text-sm text-white/70">{x.slug}</div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs ${
                      x.published
                        ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20"
                        : "bg-white/10 text-white/70 border border-white/10"
                    }`}
                  >
                    {x.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Link
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                    href={`/portfolio/${x.slug}`}
                    target="_blank"
                  >
                    View
                  </Link>
                  <Link
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                    href={`/admin/portfolio/${String(x._id)}/edit`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
