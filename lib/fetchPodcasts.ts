import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Podcast } from "@/lib/contentTypes";

type ApiList = { items?: Podcast[] };
type ApiOne = { item?: Podcast };

export async function fetchPodcasts(opts?: { publishedOnly?: boolean }) {
  const qs = new URLSearchParams();
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/podcasts?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch podcasts");
  const data = (await res.json()) as ApiList;
  return data.items || [];
}

export async function fetchPodcastBySlug(
  slug: string,
  opts?: { publishedOnly?: boolean }
) {
  const qs = new URLSearchParams({ slug });
  if (opts?.publishedOnly) qs.set("published", "1");

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/podcasts?${qs.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as ApiOne;
  return data.item || null;
}
