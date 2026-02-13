import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Testimonial } from "@/lib/contentTypes";

type ApiList = { items?: Testimonial[] };

export async function fetchTestimonials(opts?: { publishedOnly?: boolean }) {
  const qs = new URLSearchParams();
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/testimonials?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch testimonials");
  const data = (await res.json()) as ApiList;
  return data.items || [];
}
