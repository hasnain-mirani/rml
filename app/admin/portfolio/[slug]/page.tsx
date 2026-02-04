import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { CaseStudy } from "@/models/CaseStudy";

export default async function PortfolioCaseStudyPage({ params }: { params: { slug: string } }) {
  await dbConnect();
  const item = await CaseStudy.findOne({ slug: params.slug, published: true }).lean();

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f3e9ff] px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold text-[#5a2f86]">Not found</h1>
          <p className="mt-2 text-sm text-[#6b3e96]/70">This case study is not published.</p>
          <Link href="/" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const results = (item as any).results ?? [];
  const highlights = (item as any).highlights ?? [];

  return (
    <div className="min-h-screen bg-[#f3e9ff]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <Link href="/portfolio" className="text-sm text-[#7b4bb0] hover:underline">
          ← Back to Portfolio
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] bg-[#b894ff] p-6 shadow-[0_20px_60px_rgba(116,60,170,0.25)]">
              <div className="rounded-[22px] bg-[#d8c5ff] p-5">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-white/30">
                  <Image
                    src={(item as any).imageUrl}
                    alt={(item as any).title}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-medium tracking-wide text-[#5a2f86]/70">
                  {(item as any).label}
                </div>
                <div className="mt-1 text-2xl font-semibold text-[#4a2371]">
                  {(item as any).title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#4a2371]/75">
                  {(item as any).subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <h2 className="text-2xl font-semibold text-[#5a2f86]">{(item as any).overviewTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6b3e96]/70">
              {(item as any).overviewText}
            </p>

            <h3 className="mt-10 text-lg font-semibold text-[#5a2f86]">
              {(item as any).highlightsTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {highlights.map((h: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-sm text-[#6b3e96]/75">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8a54d6]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-lg font-semibold text-[#5a2f86]">{(item as any).resultsTitle}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {results.map((r: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/70 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="text-xs text-[#8a54d6]/70">{r.label}</div>
                  <div className="mt-2 text-xl font-semibold text-[#5a2f86]">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
