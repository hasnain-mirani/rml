import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchCaseStudyBySlug } from "@/lib/fetchCaseStudies";

type Params = { slug: string };

export default async function CaseStudyDetail({
  params,
}: {
  params: Params;
}) {
  const item = await fetchCaseStudyBySlug(params.slug);

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          href="/case-studies"
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to case studies
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {item.title}
          </h1>

          {item.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {item.image ? (
          <div className="mt-8 relative aspect-[16/9] overflow-hidden rounded-3xl border border-zinc-200">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        {item.content ? (
          <div
            className="prose prose-zinc mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ) : null}
      </article>
    </main>
  );
}
