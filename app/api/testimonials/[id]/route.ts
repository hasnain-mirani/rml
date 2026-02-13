import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonal";

export const dynamic = "force-dynamic";

/** Next 15: params might be Promise */
type Ctx = { params: Promise<{ id: string }> | { id: string } };

function serialize(doc: any) {
  if (!doc) return doc;
  const d = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...d, _id: String(d._id) };
}

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

async function getId(ctx: Ctx) {
  const p = await ctx.params;
  return cleanId(p?.id);
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);
    if (!id || !isObjectId(id)) {
      return NextResponse.json({ message: "Invalid id", id }, { status: 400 });
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }

    // allow only known fields (avoid accidental schema pollution)
    const patch = {
      name: typeof body.name === "string" ? body.name.trim() : undefined,
      text: typeof body.text === "string" ? body.text.trim() : undefined,
      image: typeof body.image === "string" ? body.image.trim() : undefined,
      linkEnabled: typeof body.linkEnabled === "boolean" ? body.linkEnabled : undefined,
      linkUrl: typeof body.linkUrl === "string" ? body.linkUrl.trim() : undefined,
      published: typeof body.published === "boolean" ? body.published : undefined,
    } as any;

    // remove undefined keys
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

    const updated = await Testimonial.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: serialize(updated) }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);
    if (!id || !isObjectId(id)) {
      return NextResponse.json({ message: "Invalid id", id }, { status: 400 });
    }

    await dbConnect();

    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Delete failed" },
      { status: 500 }
    );
  }
}
