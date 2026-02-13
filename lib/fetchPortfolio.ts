import { getBaseUrl } from "@/lib/getBaseUrl";

export type PortfolioItem = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  image: string;
  published: boolean;
  content_blocks: Array<{
    id: string;
    type: "text" | "image" | "link";
    text?: string;
    url?: string;
    label?: string;
    alt?: string;
  }>;
};

type ApiList = { items?: PortfolioItem[] };
type ApiOne = { item?: PortfolioItem };

export async function fetchPortfolio(opts?: { publishedOnly?: boolean }) {
  const qs = new URLSearchParams();
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/portfolio?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch portfolio: ${res.status} ${res.statusText}\n${body}`
    );
  }

  const data = (await res.json()) as ApiList;
  return data.items || [];
}

export async function fetchPortfolioBySlug(
  slug: string,
  opts?: { publishedOnly?: boolean }
) {
  const qs = new URLSearchParams({ slug });
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/portfolio?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as ApiOne;
  return data.item || null;
}
