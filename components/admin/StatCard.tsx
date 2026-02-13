import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export default function StatCard({
  label,
  value,
  helper,
  badge,
}: {
  label: string;
  value: string;
  helper?: string;
  badge?: { text: string; positive?: boolean };
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]",
        "shadow-[0_18px_55px_rgba(0,0,0,0.35)]",
        "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:-translate-y-1 hover:bg-white/[0.055]",
        "hover:shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
      )}
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-200 hover:opacity-100" />

      {/* inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-white/50">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {value}
            </div>
          </div>

          {badge ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                badge.positive
                  ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/20"
                  : "bg-zinc-500/15 text-zinc-200 ring-zinc-500/20"
              )}
            >
              {badge.text}
            </span>
          ) : null}
        </div>

        {helper ? <div className="mt-3 text-xs text-white/40">{helper}</div> : null}
      </CardContent>
    </Card>
  );
}
