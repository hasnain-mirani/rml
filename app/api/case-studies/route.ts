import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";

export const dynamic = "force-dynamic";

function toBool(v: string | null) {
  return v === "1" || v === "true";
}

function serialize(doc: any) {
  if (!doc) return doc;
  const d = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...d,
    _id: String(d._id),
  };
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const publishedOnly = toBool(searchParams.get("published"));

    // SINGLE
    if (slug) {
      const q: any = { slug };
      if (publishedOnly) q.published = true;

      const item = await CaseStudy.findOne(q).lean();
      if (!item) return NextResponse.json({ item: null }, { status: 404 });

      return NextResponse.json({ item: serialize(item) }, { status: 200 });
    }

    // LIST
    const q: any = {};
    if (publishedOnly) q.published = true;

    const items = await CaseStudy.find(q).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { items: items.map(serialize) },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }

    const created = await CaseStudy.create(body);
    return NextResponse.json({ item: serialize(created) }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { message: err?.message || "Create failed" },
      { status: 500 }
    );
  }
}
