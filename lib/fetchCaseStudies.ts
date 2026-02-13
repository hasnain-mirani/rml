import { getBaseUrl } from "@/lib/getBaseUrl";
import type { CaseStudy } from "@/lib/contentTypes";

type ApiList = { items?: CaseStudy[] };
type ApiOne = { item?: CaseStudy | null };

async function parseErrorBody(res: Response) {
  const text = await res.text().catch(() => "");
  return text?.slice(0, 4000) || "";
}

export async function fetchCaseStudies(opts?: { publishedOnly?: boolean }) {
  const qs = new URLSearchParams();
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const url = `${base}/api/case-studies?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const body = await parseErrorBody(res);
    throw new Error(
      `Failed to fetch case studies: ${res.status} ${res.statusText}\nURL: ${url}\nBody: ${body}`
    );
  }

  const data = (await res.json()) as ApiList;
  return data.items || [];
}

export async function fetchCaseStudyBySlug(
  slug: string,
  opts?: { publishedOnly?: boolean }
) {
  const qs = new URLSearchParams({ slug });
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const url = `${base}/api/case-studies?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return null;

  const data = (await res.json()) as ApiOne;
  return data.item || null;
}
