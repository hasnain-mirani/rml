import { fetchCaseStudyBySlug } from "@/lib/fetchCaseStudies";
import EditCaseStudyClient from "./EditCaseStudyClient";

type Params = { slug: string };

export default async function EditCaseStudyPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { slug } = await params;

  const item = await fetchCaseStudyBySlug(slug);

  if (!item) {
    return <div className="p-10 text-zinc-600">Case study not found</div>;
  }

  return <EditCaseStudyClient initial={item} />;
}
