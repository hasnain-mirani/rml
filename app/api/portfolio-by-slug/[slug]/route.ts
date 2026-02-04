import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";

export async function GET(_: Request, ctx: { params: { slug: string } }) {
  await dbConnect();
  const item = await CaseStudy.findOne({ slug: ctx.params.slug, published: true }).lean();
  if (!item) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}
