"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string>(value ?? "");

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={preview}
              alt="Blog image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          <div className="flex items-center justify-end gap-2 p-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPreview("");
                onChange("");
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-white/90">Cover image</div>
              <div className="text-xs text-white/50">Upload a 16:9 image (recommended)</div>
            </div>

            <CldUploadWidget
              uploadPreset="blog_uploads"
              options={{ resourceType: "image", multiple: false }}
              onUpload={(result) => {
                const info = (result as any)?.info;
                const url = info?.secure_url as string | undefined;
                if (!url) return;
                setPreview(url);
                onChange(url);
              }}
            >
              {({ open }) => (
                <Button type="button" onClick={() => open()}>
                  Upload
                </Button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      )}
    </div>
  );
}
