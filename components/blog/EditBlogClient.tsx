"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "./BlogEditor";

export default function EditBlogClient({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((d) => setData(d.item));
  }, [id]);

  if (!data) {
    return (
      <div className="p-6 text-sm text-white/50">
        Loading blog…
      </div>
    );
  }

  return (
    <BlogEditor
      initial={data}
      onSave={async (v) => {
        const res = await fetch(`/api/blog/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });

        if (!res.ok) {
          alert("Failed to update blog");
          return;
        }

        router.push("/admin/blog");
      }}
    />
  );
}
