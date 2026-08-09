/** Pure types for the About page's CMS-backed sections — kept separate
 * from the data-fetching modules (which import the Payload Local API,
 * server-only) since several consuming components are client components
 * (AboutHero, WhoWeAreHierarchy, Awards, RollOfHonour, OrgChart). */

export type CmsAboutPageContent = {
  hero: { eyebrow: string; headline: string; description: string };
  whoWeAre: { heading: string; paragraph: string };
  hierarchy: { label: string; emphasized: boolean }[];
  visionMission: { label: string; title: string; description: string }[];
  connectWithUs: { email: string; social: { label: string; href: string }[] };
};

export type CmsOrgChartBranch = { director: string; engineer: string | null; manager: string; base: string };
export type CmsOrgChart = { top: string[]; branches: CmsOrgChartBranch[] };

export type CmsAward = { id: number; title: string; year: string; description: string; image: string };

export type CmsRollOfHonourEntry = { id: number; designation: string; name?: string; range?: string };
