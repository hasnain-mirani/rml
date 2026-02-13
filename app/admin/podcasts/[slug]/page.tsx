import { fetchPodcastBySlug } from "@/lib/fetchPodcasts";
import EditPodcastClient from "./EditPodcastClient";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function EditPodcastPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { slug } = await params;
  const item = await fetchPodcastBySlug(slug);

  if (!item) {
    return <div className="p-10 text-zinc-600">Podcast not found</div>;
  }

  return <EditPodcastClient initial={item} />;
}
