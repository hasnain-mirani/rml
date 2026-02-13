import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Podcast } from "@/models/Podcast";

export const dynamic = "force-dynamic";

/** ---------- helpers ---------- */
function serialize(doc: any) {
  if (!doc) return doc;
  const d = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...d, _id: String(d._id) };
}

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

async function ensureUniqueSlug(base: string) {
  let slug = base || "post";
  let counter = 2;

  while (await Podcast.exists({ slug })) {
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
  if (time === "year") return new Date(now.getFullYear(), 0, 1);

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

function pickImageUrl(body: any): string {
  const candidates: unknown[] = [
    body?.image,
    body?.imageUrl,
    body?.secure_url,
    body?.image?.secure_url,
  ];

  for (const c of candidates) {
    if (isNonEmptyString(c)) {
      const s = c.trim();
      if (isValidHttpUrl(s)) return s;
      if (s.startsWith("/")) return s;
    }
  }
  return "";
}

function pickBlocks(body: any) {
  const blocks = body?.content_blocks;
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((b: any) => ({
      id: isNonEmptyString(b?.id) ? b.id : "",
      type: isNonEmptyString(b?.type) ? b.type : "",
      text: isNonEmptyString(b?.text) ? b.text : "",
      label: isNonEmptyString(b?.label) ? b.label : "",
      url: isNonEmptyString(b?.url) ? b.url : "",
      alt: isNonEmptyString(b?.alt) ? b.alt : "",
    }))
    .filter((b: any) => b.id && b.type);
}

/** ---------- GET ---------- */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const published = searchParams.get("published"); // "1"
    const category = searchParams.get("category"); // all | name
    const time = searchParams.get("time"); // 7d | 30d | 90d | year | all

    if (slug) {
      const item = await Podcast.findOne({ slug }).lean();
      if (!item)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      if (published === "1" && !(item as any).published) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ item: serialize(item) });
    }

    const filter: Record<string, any> = {};
    if (published === "1") filter.published = true;
    if (category && category !== "all") filter.category = category;

    const since = parseTimeFilter(time);
    if (since) filter.createdAt = { $gte: since };

    const items = await Podcast.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items: items.map(serialize) });
  } catch (err: any) {
    console.error("[GET /api/podcasts] ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/** ---------- POST ---------- */
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
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
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
      : "Podcast";
    const excerpt = isNonEmptyString(body.excerpt) ? body.excerpt : "";
    const date = isNonEmptyString(body.date) ? body.date : "";
    const image = pickImageUrl(body);
    const content_blocks = pickBlocks(body);

    const item = await Podcast.create({
      title,
      slug,
      category,
      excerpt,
      date,
      image,
      content_blocks,
      published: Boolean(body.published),
    });

    return NextResponse.json({ item: serialize(item) }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/podcasts] ERROR:", err);
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
