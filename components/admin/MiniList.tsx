import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Item = {
  title: string;
  sub: string;
  tag: string;
  tagVariant?: "default" | "secondary" | "outline" | "destructive";
};

export default function MiniList({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <Card className="rounded-[22px] border-black/5 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <CardContent className="p-5">
        <div className="text-sm font-semibold">{title}</div>

        <div className="mt-4 space-y-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{it.title}</div>
                <div className="truncate text-xs text-black/50">{it.sub}</div>
              </div>
              <Badge variant={it.tagVariant ?? "secondary"} className="rounded-full">
                {it.tag}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
