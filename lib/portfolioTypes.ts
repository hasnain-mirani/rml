export type ResultMetric = {
  label: string;
  value: string;
};

export type PortfolioCaseStudy = {
  _id: string; // Mongo id
  slug: string;

  // Left card
  label: string;
  title: string;
  subtitle: string;
  imageUrl: string;

  // Right content
  overviewTitle: string;
  overviewText: string;

  highlightsTitle: string;
  highlights: string[];

  resultsTitle: string;
  results: ResultMetric[];

  published: boolean;

  createdAt: string;
  updatedAt: string;
};
