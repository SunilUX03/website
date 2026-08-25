/** Kept separate from hero-content.ts for the same reason as
 * announcement-types.ts — Hero.tsx is a client component. */
export type CmsHeroContent = {
  agencyLabelCycle: string[];
  headlineTemplate: string;
  headlineCycleWords: string[];
  tagline: string;
  mapImageUrl: string;
  mapImageWidth: number;
  mapImageHeight: number;
  /** Optional full-bleed override for the Hero's background — empty
   * means "keep the default colour-wash gradient" (see
   * ATMOSPHERE_BACKGROUND in Hero.tsx). */
  backgroundImageUrl?: string;
};
