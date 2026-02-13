import PortfolioPageClient from "./PortfolioPageClient";
import { fetchPortfolio } from "@/lib/fetchPortfolio";

export default async function PortfolioPage() {
  try {
    const items = await fetchPortfolio({ publishedOnly: true });
    // eslint-disable-next-line react-hooks/error-boundaries
    return <PortfolioPageClient initialItems={items} errorMsg="" />;
  } catch (err: any) {
    return (
      <PortfolioPageClient
        initialItems={[]}
        errorMsg={err?.message || "Failed to load portfolio"}
      />
    );
  }
}
