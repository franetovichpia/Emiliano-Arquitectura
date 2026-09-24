export type PortfolioProjectFact = {
  label: string;
  value: string;
};

export type PortfolioProject = {
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  images: string[];
  externalLink?: string;
  bimSlug?: string;
  has5D?: boolean;
  zodiacSign?: string;
  tools: readonly string[];
  facts: readonly PortfolioProjectFact[];
};