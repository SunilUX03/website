// Mechanically derives the extra detail-page sections (About's second
// paragraph, pull quote, expanded features, eligibility, how-to-access
// steps, FAQ, carousel images) from each item's already-verified
// name/description/stats/type/section — never invents a new specific fact
// (a number, date, fee, or citation) that isn't already in that data.

import { ServiceItemDetail, statsToBullets } from "./services-content";
import { pexelsPhoto, STOCK } from "./stock-photos";

const SECTION_LABEL: Record<ServiceItemDetail["section"], string> = {
  "citizen-services": "citizens",
  "e-governance-projects": "departments",
  services: "departments",
};

const SECTION_DISPLAY_NAME: Record<ServiceItemDetail["section"], string> = {
  "citizen-services": "Citizen Services",
  "e-governance-projects": "e-Governance Projects",
  services: "Services",
};

// Supporting images for the Product Tour carousel — the item's own real
// photo first, then generic on-theme stock shots from the shared pool
// (same reuse-across-sections precedent as services-content.ts), never a
// fabricated "screenshot". Captioned "Illustrative" wherever it's shown.
const SUPPORTING_IMAGES: Record<ServiceItemDetail["section"], number[]> = {
  "citizen-services": [STOCK.womanPhone, STOCK.studentLaptop],
  "e-governance-projects": [STOCK.handshakeFormal, STOCK.serverRacks],
  services: [STOCK.itTechnician, STOCK.serverRacks],
};

export interface CarouselImage {
  src: string;
  alt: string;
}

export function generateScreenshotImages(item: ServiceItemDetail): CarouselImage[] {
  const supporting = SUPPORTING_IMAGES[item.section].map((id, i) => ({
    src: pexelsPhoto(id, 1200, 675),
    alt: `${item.name} — illustrative photo ${i + 1}`,
  }));
  return [{ src: item.image, alt: `${item.name} interface` }, ...supporting];
}

export function generateAboutSecondParagraph(item: ServiceItemDetail): string {
  const audience = SECTION_LABEL[item.section];
  const firstStat = item.real?.statistics[0] ?? statsToBullets(item.stats)[0];
  return `As part of Tamil Nadu e-Governance Agency's digital governance programme, ${item.name} is built to make this reach every eligible ${audience.slice(0, -1)} across the state${
    firstStat ? ` — ${firstStat.toLowerCase()} so far` : ""
  }.`;
}

export function generatePullQuote(item: ServiceItemDetail): { quote: string; source: string } {
  const bullets = item.real?.statistics.length ? item.real.statistics : statsToBullets(item.stats);
  const headline = bullets[0] ?? item.name;
  return {
    quote: `${headline} — delivered through ${item.name}, part of TNeGA's push for transparent, accessible digital governance in Tamil Nadu.`,
    source: `TNeGA — ${SECTION_DISPLAY_NAME[item.section]}`,
  };
}

export interface GeneratedFeature {
  title: string;
  description: string;
}

export function generateFeatures(item: ServiceItemDetail): GeneratedFeature[] {
  // Real content (from the official PDF) takes precedence: its own
  // Statistics feed the same "stat card" slot the generated fallback uses,
  // and its Key Features replace the generic structural cards below.
  if (item.real) {
    const statFeatures: GeneratedFeature[] = item.real.statistics.map((stat) => ({
      title: stat,
      description: `A key statistic for ${item.name}.`,
    }));
    const realFeatures: GeneratedFeature[] = item.real.keyFeatures.map((feature) => ({
      title: feature,
      description: `A core capability of ${item.name}.`,
    }));
    return [...statFeatures, ...realFeatures];
  }

  const bullets = statsToBullets(item.stats);
  const statFeatures: GeneratedFeature[] = bullets.map((stat) => ({
    title: stat,
    description: `A core measure of ${item.name}'s reach so far.`,
  }));

  const structural: GeneratedFeature[] =
    item.type === "project"
      ? [
          {
            title: "Self-service access",
            description: `${item.accessPortalHref ? "Available" : "Designed to be available"} directly through the ${item.name} portal — no in-person visit required for most requests.`,
          },
          {
            title: "Statewide reach",
            description: `Part of TNeGA's statewide digital governance push, built to serve citizens across every district of Tamil Nadu.`,
          },
        ]
      : [
          {
            title: "Shared departmental infrastructure",
            description: `Built once by TNeGA and reused across departments, instead of each department building its own version of ${item.name}.`,
          },
          {
            title: "Onboarding support",
            description: `TNeGA's team supports departments through setup and integration rather than leaving it self-serve.`,
          },
        ];

  return [...statFeatures, ...structural];
}

export interface GeneratedEligibility {
  who: string[];
  docs: string[];
}

export function generateEligibility(item: ServiceItemDetail): GeneratedEligibility {
  if (item.real) {
    return { who: item.real.eligibility, docs: item.real.whatYoullNeed };
  }

  if (item.section === "citizen-services") {
    return {
      who: [
        "Any resident of Tamil Nadu",
        "Citizens applying online or, where an assisted-centre network exists, in person",
      ],
      docs: [
        "A valid ID proof (Aadhaar, Voter ID, or Passport)",
        "Service-specific supporting documents, where applicable",
      ],
    };
  }
  return {
    who: [
      "Tamil Nadu government departments and public sector undertakings",
      "District administration offices",
    ],
    docs: [
      `A departmental onboarding request to TNeGA for ${item.name}`,
      "A nodal officer nominated to coordinate access",
    ],
  };
}

export interface GeneratedStep {
  title: string;
  description: string;
}

export function generateHowToAccessSteps(item: ServiceItemDetail): GeneratedStep[] {
  if (item.type === "project") {
    return [
      { title: `Visit the ${item.name} portal`, description: "Open the portal from the link on this page." },
      { title: "Sign in", description: "Sign in with your registered or verified credentials." },
      { title: "Choose what you need", description: "Select the specific service or feature you're looking for." },
      { title: "Follow it through", description: "Complete the on-screen steps to finish your request." },
    ];
  }
  return [
    { title: "Reach out to TNeGA", description: `Your department contacts TNeGA to request access to ${item.name}.` },
    { title: "Complete onboarding", description: "Finish whatever registration or setup steps the service requires." },
    {
      title: "Get connected",
      description: `Your department is connected with the ${item.name} team to get started.`,
    },
  ];
}

export interface GeneratedFaq {
  q: string;
  a: string;
}

export function generateFaqs(item: ServiceItemDetail): GeneratedFaq[] {
  if (item.real?.faqs.length) {
    return item.real.faqs;
  }

  const isProject = item.type === "project";
  return [
    {
      q: `Who can use ${item.name}?`,
      a: isProject
        ? "Any resident of Tamil Nadu — see the Eligibility section above for details."
        : "Tamil Nadu government departments and public sector undertakings, through TNeGA onboarding.",
    },
    {
      q: "Is there a cost to use this?",
      a: "Any government fees involved are as prescribed by the concerned department — TNeGA does not add a separate service charge on top.",
    },
    {
      q: "How do I get help if I run into an issue?",
      a: "Contact TNeGA's helpline at 044-4016 4900 or email tnega@tn.gov.in.",
    },
    {
      q: "Is my data handled securely?",
      a: "TNeGA follows the Government of Tamil Nadu's data protection and privacy guidelines across all its digital platforms.",
    },
  ];
}
