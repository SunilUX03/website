// Centralized homepage copy, pulled verbatim from the locked build spec.
// See inline notes below for what's since moved out to CMS globals.

// nav used to live here — it's now the "nav-content" Payload global (see
// lib/cms/nav-content.ts), fetched by TopNav.tsx and passed down to
// AccessibilityBar/MainNav/MobileDrawer.

// hero used to live here — it's now split across two Payload globals:
// "hero-content" (agencyLabelCycle/headlineTemplate/headlineCycleWords/
// tagline, see lib/cms/hero-content.ts, used by Hero.tsx) and
// "leadership-band-content" (description/leaders, see
// lib/cms/leadership-band.ts, used by AboutLeadership.tsx) — two
// different homepage sections that happened to share one static object
// before this migration.

// ticker used to live here — it's now derived from Announcements flagged
// "Show in ticker" (see getTickerAnnouncements in lib/cms/announcements.ts),
// so it can never drift out of sync with an announcement's own content.

// One row in a pillar card's item list — the shape every pillar's items
// get normalized to before reaching PillarCards.tsx, regardless of
// whether they're a fixed curated link (Citizen Services, Services to
// Government) or derived from a live Services collection record (the
// Initiatives & Projects pillar, resolved in page.tsx via
// getServiceItemsByNames). `external` marks links that leave the site
// entirely (a target/rel difference, not just a styling one).
export type PillarLinkItem = {
  name: string;
  description: string;
  href: string;
  external?: boolean;
};

// pillars' chrome (title/linkLabel/bannerImage) is now the "pillars-content"
// Payload global (see lib/cms/pillars-content.ts), fetched by Home and About
// and merged with the structural fields below. `description` is still in
// that global's schema but intentionally unrendered — the pillar cards show
// heading + items only, no card-level blurb. `href` stays in code — a
// structural reference to a page anchor rather than freeform copy.
//
// Citizen Services and Services to Government are fixed, curated link
// lists (not derived from the Services collection) — each links straight
// to the destination the redesign asked for rather than a detail page.
// The third pillar (Initiatives & Projects) still resolves its items from
// live Services records by name in page.tsx via getServiceItemsByNames.
type CuratedPillar = { href: string; items: PillarLinkItem[]; seeAllLabel?: string };
type DerivedPillar = { href: string; itemNames: string[]; seeAllLabel?: string };

export const pillars: (CuratedPillar | DerivedPillar)[] = [
  {
    href: "/citizen-services",
    items: [
      {
        name: "e-Sevai",
        description: "Access citizen-related Government services online.",
        href: "https://www.tnesevai.tn.gov.in/",
        external: true,
      },
      {
        name: "UMIS",
        description: "Track student welfare and academic records.",
        href: "https://umisdashboard.tnega.org/",
        external: true,
      },
    ] satisfies PillarLinkItem[],
  },
  {
    href: "/services-to-government",
    items: [
      {
        name: "Software Development / Procurement",
        description: "Software development and IT hardware/software procurement support for Government Departments.",
        href: "/services-to-government#software-development-procurement",
      },
      {
        name: "Security Audit",
        description: "Mandatory IT security audits for Government websites, apps, APIs and cloud applications.",
        href: "/services-to-government#security-audit",
      },
      {
        name: "SMS / WhatsApp Gateway",
        description: "Centralized SMS and WhatsApp Gateway services for Government-to-citizen communication.",
        href: "/services-to-government#sms-whatsapp-gateway",
      },
      {
        name: "Aadhaar Services",
        description: "Aadhaar-based authentication and e-KYC services for Government Departments.",
        href: "/services-to-government#aadhaar-services",
      },
    ] satisfies PillarLinkItem[],
    seeAllLabel: "See all Services to Government",
  },
  {
    href: "/initiatives-projects",
    // "Initiatives & Projects" — a curated 5 (of the full catalogue on
    // /services) chosen to read as the agency's flagship, most
    // recognizable projects rather than shared infrastructure services.
    itemNames: ["GRAINS", "Namma Arasu", "TNSSP", "Nambikkai Inaiyam", "DBT (Direct Benefit Transfer Portal)"],
    seeAllLabel: "See all Initiatives & Projects",
  },
];

// Each platform card auto-rotates through posts fetched from
// /api/social/<platform> (server-side, currently seed data — see
// src/lib/social-seed-data.ts and the route handlers for the real-API
// swap-in point). Only platform metadata lives here.
export const socialMedia = [
  {
    platform: "Facebook",
    apiPath: "/api/social/facebook",
    href: "https://www.facebook.com/tnegaofficial",
    followLabel: "Follow on Facebook",
  },
  {
    platform: "X",
    apiPath: "/api/social/x",
    href: "https://twitter.com/TNeGA_Official",
    followLabel: "Follow on X",
  },
  {
    platform: "Instagram",
    apiPath: "/api/social/instagram",
    href: "https://instagram.com/tnegaofficial",
    followLabel: "Follow on Instagram",
  },
  {
    platform: "LinkedIn",
    apiPath: "/api/social/linkedin",
    href: "https://www.linkedin.com/company/tnega/",
    followLabel: "Follow on LinkedIn",
  },
  {
    platform: "YouTube",
    apiPath: "/api/social/youtube",
    href: "https://www.youtube.com/@tnega",
    followLabel: "Subscribe on YouTube",
  },
] as const;

// footer used to live here — it's now the "footer-content" Payload
// global (see lib/cms/footer.ts), fetched by the Footer server wrapper
// component and passed down to FooterClient.tsx.

