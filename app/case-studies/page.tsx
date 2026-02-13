import { fetchCaseStudies } from "@/lib/fetchCaseStudies";
import CaseStudiesClient from "./CaseStudiesClient";

export default async function CaseStudiesPage() {
  try {
    const items = await fetchCaseStudies({ publishedOnly: true });

    // eslint-disable-next-line react-hooks/error-boundaries
    return <CaseStudiesClient initialItems={items} />;
  } catch (err: unknown) {
    return (
      <CaseStudiesClient
      />
    );
  }
}
