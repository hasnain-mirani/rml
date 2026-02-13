"use client";

import { useRouter } from "next/navigation";
import BlogEditor from "./BlogEditor";

export default function NewBlogClient() {
  const router = useRouter();

  return (
    <BlogEditor
      initial={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        image: "",
        published: false,
      }}
      onSave={async (v) => {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });

        if (!res.ok) {
          alert("Failed to save blog");
          return;
        }

        router.push("/admin/blog");
      }}
    />
  );
}
