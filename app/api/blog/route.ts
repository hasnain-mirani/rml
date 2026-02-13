// app/api/blog/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

/** ---------- helpers ---------- */
function toSlug(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/g, "");
}

/** Generate a unique slug: my-post, my-post-2, my-post-3 ... */
async function ensureUniqueSlug(base: string) {
  let slug = base || "post";
  let counter = 2;

  while (await Blog.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

function parseTimeFilter(time: string | null): Date | null {
  if (!time || time === "all") return null;

  const now = new Date();

  if (time === "7d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (time === "30d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  if (time === "90d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 90);
    return d;
  }
  if (time === "year") {
    return new Date(now.getFullYear(), 0, 1);
  }

  return null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidHttpUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Extract Cloudinary secure_url from common shapes */
function pickImageUrl(body: any): string {
  // common fields people send
  const candidates: unknown[] = [
    body?.image,
    body?.imageUrl,
    body?.secure_url,
    body?.image?.secure_url, // if someone sent cloudinary response object
  ];

  for (const c of candidates) {
    if (isNonEmptyString(c)) {
      const s = c.trim();
      if (isValidHttpUrl(s)) return s;
      // allow relative assets if you ever use local images
      if (s.startsWith("/")) return s;
    }
  }

  return "";
}

/** ---------- GET ---------- */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug");
    const published = searchParams.get("published"); // "1" => only published
    const category = searchParams.get("category"); // all | category name
    const time = searchParams.get("time"); // 7d | 30d | 90d | year | all

    // ✅ /api/blog?slug=some-slug  -> return { item }
    if (slug) {
      const item = await Blog.findOne({ slug }).lean();
      if (!item) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      // optional: enforce published on public calls
      if (published === "1" && !(item as any).published) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      return NextResponse.json({ item });
    }

    // ✅ List filters
    const filter: Record<string, any> = {};

    if (published === "1") filter.published = true;

    if (category && category !== "all") {
      filter.category = category;
    }

    const since = parseTimeFilter(time);
    if (since) {
      filter.createdAt = { $gte: since };
    }

    const items = await Blog.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("[GET /api/blog] ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/** ---------- POST ---------- */
/**
 * Expects JSON body:
 * {
 *   title: string,
 *   slug?: string,
 *   category?: string,
 *   excerpt?: string,
 *   content?: string,
 *   image?: string (Cloudinary secure_url)  // ✅ IMPORTANT
 *   published?: boolean
 * }
 *
 * NOTE: Upload to Cloudinary must happen on the client (unsigned) OR via a separate server upload route.
 * This endpoint only stores the resulting URL string.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const title = isNonEmptyString(body.title) ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const baseSlugInput =
      isNonEmptyString(body.slug) && body.slug.trim() ? body.slug : title;

    const baseSlug = toSlug(baseSlugInput);
    if (!baseSlug) {
      return NextResponse.json(
        { message: "Slug/title produced an empty slug" },
        { status: 400 }
      );
    }

    const slug = await ensureUniqueSlug(baseSlug);

    const category = isNonEmptyString(body.category)
      ? body.category.trim()
      : "General";

    // ✅ Cloudinary: store secure_url (must be sent from client after upload)
    const image = pickImageUrl(body);

    const blog = await Blog.create({
      title,
      slug,
      category,
      excerpt: isNonEmptyString(body.excerpt) ? body.excerpt : "",
      content: isNonEmptyString(body.content) ? body.content : "",
      image, // ✅ URL string
      published: Boolean(body.published),
    });

    return NextResponse.json({ item: blog }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/blog] ERROR:", err);

    // ✅ Mongo duplicate key error
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Slug already exists. Please use a unique slug." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
