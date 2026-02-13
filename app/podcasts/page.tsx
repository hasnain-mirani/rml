import PodcastPageClient from "./PodcastPageClient";
import { fetchPodcasts } from "@/lib/fetchPodcasts";

export default async function PodcastsPage() {
  try {
    const items = await fetchPodcasts({ publishedOnly: true });
    // eslint-disable-next-line react-hooks/error-boundaries
    return <PodcastPageClient initialItems={items} errorMsg="" />;
  } catch (err: any) {
    return (
      <PodcastPageClient
        initialItems={[]}
        errorMsg={err?.message || "Failed to load podcasts"}
      />
    );
  }
}
