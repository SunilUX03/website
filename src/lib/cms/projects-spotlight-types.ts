export type CmsProjectStat = { value: number; suffix: string; label: string };
export type CmsProjectCta = { label: string; href: string };

export type CmsProjectSpotlight = {
  id: number;
  name: string;
  description: string;
  image: string;
  badge?: string;
  stats: CmsProjectStat[];
  ctas: CmsProjectCta[];
};
