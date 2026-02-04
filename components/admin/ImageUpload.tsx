"use client";

import { useState } from "react";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <img
          src={value}
          alt="Uploaded"
          className="h-40 w-full rounded-xl object-cover border border-white/10"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/50">
          No image uploaded
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
        className="block w-full text-sm text-white/70
                   file:mr-4 file:rounded-xl file:border-0
                   file:bg-white file:px-4 file:py-2
                   file:text-sm file:font-medium file:text-black"
      />

      {loading && <p className="text-xs text-white/60">Uploading...</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
