/** Pure types for the About page's CMS-backed sections — kept separate
 * from the data-fetching modules (which import the Payload Local API,
 * server-only) since several consuming components are client components
 * (AboutHero, WhoWeAreHierarchy, Awards, RollOfHonour, OrgChart). */

export type CmsSectionHeading = { eyebrow: string; heading: string };

export type CmsAboutPageContent = {
  hero: { eyebrow: string; headline: string; description: string };
  whoWeAre: { heading: string; paragraph: string };
  hierarchy: { label: string; emphasized: boolean }[];
  visionMission: { label: string; title: string; description: string }[];
  connectWithUs: { email: string; social: { label: string; href: string }[] };
  orgChartSection: CmsSectionHeading;
  leadershipSection: CmsSectionHeading;
  boardSection: CmsSectionHeading;
  awardsSection: CmsSectionHeading;
  rollOfHonourSection: CmsSectionHeading;
};

export type CmsOrgChartNode = { label: string; sublabel: string | null; muted: boolean };
export type CmsOrgChartBranch = { title: string; subtitle: string; nodes: CmsOrgChartNode[] };
export type CmsOrgChart = { topLabel: string; jceoLabel: string; branches: CmsOrgChartBranch[] };

export type CmsAward = { id: number; title: string; year: string; description: string; image: string };

export type CmsRollOfHonourEntry = { id: number; designation: string; name?: string; range?: string };
