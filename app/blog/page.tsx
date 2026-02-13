// app/blog/page.tsx
import BlogPageClient from "./BlogPageClient";
import { fetchBlogs, type Blog } from "@/lib/fetchBlogs";

export default async function BlogPage() {
  let blogs: Blog[] = [];
  let errorMsg = "";

  try {
    blogs = await fetchBlogs(); // public default => published only
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Failed to load blogs.";
  }

  return <BlogPageClient initialBlogs={blogs} errorMsg={errorMsg} />;
}
