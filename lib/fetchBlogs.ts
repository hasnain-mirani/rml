import { headers } from "next/headers";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt: string;
  content?: string;
  image?: string;
  published?: boolean;
  createdAt?: string; // ✅ from timestamps
  updatedAt?: string;
};

type BlogListApiResponse =
  | { items?: Blog[] }
  | { data?: Blog[] }
  | { blogs?: Blog[] }
  | Blog[];

type BlogSingleApiResponse =
  | { item?: Blog }
  | { data?: Blog }
  | { blog?: Blog }
  | Blog;

function toArray(res: BlogListApiResponse): Blog[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    const anyRes = res as any;
    if (Array.isArray(anyRes.items)) return anyRes.items;
    if (Array.isArray(anyRes.data)) return anyRes.data;
    if (Array.isArray(anyRes.blogs)) return anyRes.blogs;
  }
  return [];
}

function toBlog(res: BlogSingleApiResponse): Blog | null {
  if (!res) return null;
  const anyRes = res as any;
  return (anyRes.blog ?? anyRes.item ?? anyRes.data ?? anyRes) as Blog;
}

async function getBaseUrl(): Promise<string> {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_URL;

  if (env) {
    const withProto = env.startsWith("http") ? env : `https://${env}`;
    return withProto.replace(/\/$/, "");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`.replace(/\/$/, "");
}

async function serverUrl(path: string) {
  return typeof window !== "undefined" ? path : `${await getBaseUrl()}${path}`;
}

/** ✅ Get all blogs (public default = published only)
 * Supports optional filters that the client can also apply locally.
 */
export async function fetchBlogs(opts?: {
  includeDrafts?: boolean;
  category?: string; // optional server filter
  time?: "all" | "7d" | "30d" | "90d" | "year";
}) {
  const includeDrafts = opts?.includeDrafts ?? false;

  const qp = new URLSearchParams();
  if (!includeDrafts) qp.set("published", "1");
  if (opts?.category && opts.category !== "all") qp.set("category", opts.category);
  if (opts?.time && opts.time !== "all") qp.set("time", opts.time);

  const path = qp.toString() ? `/api/blog?${qp.toString()}` : "/api/blog";
  const url = await serverUrl(path);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);

  const json = (await res.json()) as BlogListApiResponse;
  return toArray(json);
}

export async function fetchBlogBySlug(
  slug: string,
  opts?: { includeDrafts?: boolean; publishedOnly?: boolean }
) {
  const includeDrafts = opts?.includeDrafts ?? false;
  const publishedOnly = opts?.publishedOnly ?? !includeDrafts;

  const qp = new URLSearchParams();
  qp.set("slug", slug);
  if (publishedOnly) qp.set("published", "1");

  const url = await serverUrl(`/api/blog?${qp.toString()}`);
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load blog (${res.status})`);

  const json = (await res.json()) as BlogSingleApiResponse;
  const blog = toBlog(json);

  if (!blog) return null;
  if (publishedOnly && blog.published === false) return null;

  return blog;
}
