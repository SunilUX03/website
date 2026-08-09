/** Kept separate from hero-content.ts for the same reason as
 * announcement-types.ts — Hero.tsx is a client component. */
export type CmsHeroContent = {
  agencyLabelCycle: string[];
  headlineTemplate: string;
  headlineCycleWords: string[];
  tagline: string;
};
