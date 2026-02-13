import AdminTopbar from "@/components/admin/AdminTopbar";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboardPage() {
  // Later: fetch real counts from Mongo (blogs/podcasts/portfolio)
  const stats = {
    blogs: { total: 0, published: 0, drafts: 0 },
    podcasts: { total: 0 },
    portfolio: { total: 0 },
  };

  return (
    <div>
      <AdminTopbar
        title="Dashboard"
        subtitle="Overview of your content and activity"
        createHref="/admin/blog/new"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats row (same style as Blog page) */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Blog Posts"
            value={String(stats.blogs.total)}
            helper="All blog posts"
          />
          <StatCard
            label="Published"
            value={String(stats.blogs.published)}
            helper="Visible on website"
            badge={{ text: "Live", positive: true }}
          />
          <StatCard
            label="Drafts"
            value={String(stats.blogs.drafts)}
            helper="Not visible yet"
            badge={{ text: "Hidden" }}
          />
        </div>

        {/* Secondary stats (optional but makes dashboard feel real) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Podcasts"
            value={String(stats.podcasts.total)}
            helper="All podcast episodes"
          />
          <StatCard
            label="Portfolio Items"
            value={String(stats.portfolio.total)}
            helper="All portfolio case studies"
          />
        </div>

        {/* Main panel (dashboard section like Blog empty state) */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <h3 className="text-lg font-semibold">No activity yet</h3>
          <p className="mt-2 text-sm text-white/50">
            Start by creating a blog post, podcast episode, or portfolio item.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href="/admin/blog/new"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition active:scale-[0.98]"
            >
              Create Blog Post
            </a>
            <a
              href="/admin/podcast/new"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white hover:bg-white/10 transition active:scale-[0.98]"
            >
              Create Podcast
            </a>
            <a
              href="/admin/portfolio/new"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white hover:bg-white/10 transition active:scale-[0.98]"
            >
              Create Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
