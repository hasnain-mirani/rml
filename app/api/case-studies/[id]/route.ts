import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";

export const dynamic = "force-dynamic";

/** Next 15: params may be a Promise */
type Ctx = { params: Promise<{ id: string }> | { id: string } };

console.log("✅ HIT case-studies/[id] route (file loaded)");

function cleanId(raw: unknown) {
  return decodeURIComponent(String(raw ?? "")).trim();
}

function isObjectId(id: string) {
  const is24Hex = /^[0-9a-fA-F]{24}$/.test(id);
  const mongooseOk =
    typeof (mongoose as any).isValidObjectId === "function"
      ? (mongoose as any).isValidObjectId(id)
      : mongoose.Types.ObjectId.isValid(id);
  return is24Hex && mongooseOk;
}

function serialize(doc: any) {
  if (!doc) return doc;
  const d = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...d, _id: String(d._id) };
}

async function getId(ctx: Ctx): Promise<string> {
  const p = await ctx.params; // ✅ unwrap promise if needed
  return cleanId(p?.id);
}

/** ✅ UPDATE */
export async function PUT(req: Request, ctx: Ctx) {
  const id = await getId(ctx);
  console.log("🟦 PUT /api/case-studies/[id] id =>", id);

  try {
    if (!id || !isObjectId(id)) {
      return NextResponse.json({ message: "Invalid id", id }, { status: 400 });
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }

    const updated = await CaseStudy.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: serialize(updated) }, { status: 200 });
  } catch (err: any) {
    console.error("PUT error =>", err);
    return NextResponse.json(
      { message: err?.message || "Update failed" },
      { status: 500 }
    );
  }
}

/** ✅ DELETE */
export async function DELETE(_req: Request, ctx: Ctx) {
  const id = await getId(ctx);
  console.log("🟥 DELETE /api/case-studies/[id] id =>", id);

  try {
    if (!id || !isObjectId(id)) {
      return NextResponse.json({ message: "Invalid id", id }, { status: 400 });
    }

    await dbConnect();

    const deleted = await CaseStudy.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE error =>", err);
    return NextResponse.json(
      { message: err?.message || "Delete failed" },
      { status: 500 }
    );
  }
}
