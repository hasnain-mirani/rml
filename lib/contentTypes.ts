import type { ContentBlock } from "@/components/admin/ContentBlocksEditor";

export type Podcast = {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date?: string; // YYYY-MM-DD
  published: boolean;
  category?: string;
  content_blocks: ContentBlock[];
};

export type CaseStudy = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  image?: string;
  published: boolean;
  content_blocks: ContentBlock[];
};

export type Testimonial = {
  name: string;
  text: string;
  image: string;
  linkEnabled: boolean;
  linkUrl?: string;
  published: boolean;
};
