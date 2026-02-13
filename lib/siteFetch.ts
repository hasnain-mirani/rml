export function getApiBase(): string {
  // Change this once and everything works.
  // 
  return (
    process.env.NEXT_PUBLIC_SITE_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE ||
    ""
  );
}

export async function siteFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<T> {
  const base = getApiBase();
  const url = base ? `${base}${path}` : path;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    // keep it simple & debuggable
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}) ${url} ${text}`);
  }

  return (await res.json()) as T;
}
