'use client'
import BlogEditor from "@/components/blog/BlogEditor";


type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  category?: string;
};

export default function NewBlogPage() {
  const initial: Blog = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
    category: "General",
  };

  async function onSave(v: Blog) {
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "Failed to save blog");
      throw new Error(msg);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            New Blog
          </h1>
          <p className="mt-2 text-zinc-600">
            Create a blog post with title, summary, cover image, and content.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        </div>

        {/* Editor keeps its own UI; this page provides white admin wrapper */}
        <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <BlogEditor initial={initial as any} onSave={onSave as any} />
        </div>
      </div>
    </main>
  );
}
