export async function uploadToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  if (!uploadPreset) throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(url, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  // Most important field:
  return {
    secure_url: data.secure_url as string,
    public_id: data.public_id as string,
  };
}
