import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";
import { isAuthedOnServer } from "@/lib/adminAuth";

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const patchSchema = z.object({
  slug: z.string().min(1).optional(),
  label: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),

  overviewTitle: z.string().min(1).optional(),
  overviewText: z.string().min(1).optional(),

  highlightsTitle: z.string().min(1).optional(),
  highlights: z.array(z.string().min(1)).min(1).optional(),

  resultsTitle: z.string().min(1).optional(),
  results: z.array(metricSchema).min(1).optional(),

  published: z.boolean().optional(),
});

export async function GET(_: Request, ctx: { params: { id: string } }) {
  await dbConnect();
  const item = await CaseStudy.findById(ctx.params.id).lean();
  if (!item) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  if (!isAuthedOnServer()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const updated = await CaseStudy.findByIdAndUpdate(
      ctx.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    const msg =
      e?.code === 11000 ? "Slug already exists." : e?.message ?? "Update failed";
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  if (!isAuthedOnServer()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const res = await CaseStudy.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: Boolean(res) });
}
