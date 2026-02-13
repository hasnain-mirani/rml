export function getBaseUrl() {
  // Browser can use relative URLs
  if (typeof window !== "undefined") return "";

  // Server needs absolute URL
  // Set NEXT_PUBLIC_SITE_URL in env (both local + vercel)
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
