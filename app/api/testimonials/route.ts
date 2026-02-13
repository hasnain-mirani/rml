import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonal";

export const dynamic = "force-dynamic";

function serialize(doc: any) {
  if (!doc) return doc;
  const d = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...d, _id: String(d._id) };
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

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published"); // "1" => only published

    const filter: Record<string, any> = {};
    if (published === "1") filter.published = true;

    const items = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ items: items.map(serialize) });
  } catch (err: any) {
    console.error("[GET /api/testimonials] ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    const name = isNonEmptyString(body.name) ? body.name.trim() : "";
    const text = isNonEmptyString(body.text) ? body.text.trim() : "";

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    if (!text) {
      return NextResponse.json(
        { message: "Testimonial text is required" },
        { status: 400 }
      );
    }

    const image = pickImageUrl(body);

    const linkEnabled = Boolean(body.linkEnabled);
    const linkUrl =
      linkEnabled && isNonEmptyString(body.linkUrl) ? body.linkUrl.trim() : "";

    const item = await Testimonial.create({
      name,
      text,
      image,
      linkEnabled,
      linkUrl,
      published: Boolean(body.published),
    });

    return NextResponse.json({ item: serialize(item) }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/testimonials] ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
