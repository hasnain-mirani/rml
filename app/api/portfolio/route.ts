import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";
import { isAuthedOnServer } from "@/lib/adminAuth";

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const createSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  imageUrl: z.string().min(1),

  overviewTitle: z.string().min(1),
  overviewText: z.string().min(1),

  highlightsTitle: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),

  resultsTitle: z.string().min(1),
  results: z.array(metricSchema).min(1),

  published: z.boolean(),
});

export async function GET() {
  await dbConnect();
  const items = await CaseStudy.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  if (!isAuthedOnServer()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const created = await CaseStudy.create(parsed.data);
    return NextResponse.json({ ok: true, item: created });
  } catch (e: any) {
    const msg =
      e?.code === 11000 ? "Slug already exists." : e?.message ?? "Create failed";
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }
}
