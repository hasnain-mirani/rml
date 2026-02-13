// lib/slugify.ts
export function slugify(input: string) {
  return (input ?? "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")          // remove quotes
    .replace(/[^a-z0-9]+/g, "-")   // non-alphanumeric -> dash
    .replace(/-+/g, "-")           // collapse multiple dashes
    .replace(/^-+|-+$/g, "");      // trim leading/trailing dash
}
