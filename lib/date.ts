// lib/date.ts
export function formatDateDMY(input: string | Date) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = months[d.getUTCMonth()]!;
  const yyyy = d.getUTCFullYear();

  return `${dd} ${mon} ${yyyy}`; // ✅ always same everywhere
}
