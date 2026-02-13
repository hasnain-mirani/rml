"use client";

import { useRouter } from "next/navigation";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";

export default function EditCaseStudyClient({ initial }: { initial: any }) {
  const router = useRouter();

  return (
    <CaseStudyEditor
      initial={initial}
      onSave={async (payload) => {
        const res = await fetch(`/api/case-studies/${String(initial._id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Update failed");
        }

        router.push("/admin/case-studies");
        router.refresh();
      }}
    />
  );
}
