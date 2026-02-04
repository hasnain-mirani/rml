import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { isAuthedOnServer } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isAuthedOnServer()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ ok: false, message: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const res = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 900, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });

  return NextResponse.json({
    ok: true,
    url: res.secure_url,
    public_id: res.public_id,
  });
}
