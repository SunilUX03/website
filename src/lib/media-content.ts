// Content for the Media & Press page, ported from the standalone HTML
// prototype (src_media.html).
//
// Thumbnails still point at picsum.photos, exactly as the prototype did —
// these are placeholders standing in for real event photography and video
// stills. picsum.photos is already allowed in next.config.ts. Videos have
// no player wired up yet; the cards render a play affordance only.

import type { Facet } from "@/components/documents/FilterBar";

export const hero = {
  eyebrow: "Latest Updates",
  heading: "News, Events & Media from TNeGA",
  body: "Stay updated with the latest photos, videos and press coverage from Tamil Nadu e-Governance Agency.",
  orbs: [
    { color: "mint", className: "-left-16 -top-24 h-[420px] w-[420px]" },
    { color: "sky", className: "-bottom-10 right-[60px] h-[340px] w-[340px]" },
  ] as const,
};

export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  date: string;
};

export const photos: MediaItem[] = [
  {
    id: "photo-01",
    src: "https://picsum.photos/400/280?random=1",
    alt: "TNeGA Workshop on GIS for Smart Governance",
    caption: "TNeGA Workshop on GIS for Smart Governance",
    date: "May 2025",
  },
  {
    id: "photo-02",
    src: "https://picsum.photos/400/280?random=2",
    alt: "e-Sevai Platinum Jubilee: 4 Crore Transactions",
    caption: "e-Sevai Platinum Jubilee: 4 Crore Transactions Milestone",
    date: "Apr 2025",
  },
  {
    id: "photo-03",
    src: "https://picsum.photos/400/280?random=3",
    alt: "Namma Arasu WhatsApp Service Launch",
    caption: "Namma Arasu WhatsApp Service Launch: January 2026",
    date: "Jan 2026",
  },
  {
    id: "photo-04",
    src: "https://picsum.photos/400/280?random=4",
    alt: "KMUT: 1 Crore Beneficiaries Celebration",
    caption: "KMUT: 1.14 Crore Beneficiaries Celebration Event",
    date: "Mar 2025",
  },
  {
    id: "photo-05",
    src: "https://picsum.photos/400/280?random=5",
    alt: "TNeGA AI Centre of Excellence Launch",
    caption: "TNeGA AI Centre of Excellence: Inauguration Ceremony",
    date: "Feb 2026",
  },
  {
    id: "photo-06",
    src: "https://picsum.photos/400/280?random=6",
    alt: "e-Office Secretariat 100% Rollout",
    caption: "e-Office 100% Rollout Across Tamil Nadu Secretariat",
    date: "Dec 2024",
  },
  {
    id: "photo-07",
    src: "https://picsum.photos/400/280?random=7",
    alt: "TNSSP: 29 Lakh Scholarship Beneficiaries",
    caption: "TNSSP: 29 Lakh Scholarship Beneficiaries Benefited",
    date: "Nov 2024",
  },
  {
    id: "photo-08",
    src: "https://picsum.photos/400/280?random=8",
    alt: "Data Purity Drive: ₹1,350 Cr Savings",
    caption: "Data Purity Drive: ₹1,350 Cr Annual Savings Achieved",
    date: "Sep 2024",
  },
  {
    id: "photo-09",
    src: "https://picsum.photos/400/280?random=9",
    alt: "TNGIS Tamil Nilam: Public Portal Launch",
    caption: "TNGIS Tamil Nilam: Public Geospatial Portal Launch",
    date: "Aug 2024",
  },
];

export const videos: MediaItem[] = [
  {
    id: "video-01",
    src: "https://picsum.photos/400/280?random=10",
    alt: "SimpleGov Launch: Chief Minister's Address",
    caption: "SimpleGov Launch: Chief Minister's Address",
    date: "May 2025",
  },
  {
    id: "video-02",
    src: "https://picsum.photos/400/280?random=11",
    alt: "Namma Arasu: How It Works",
    caption: "Namma Arasu: How to Access Government Services on WhatsApp",
    date: "Feb 2026",
  },
  {
    id: "video-03",
    src: "https://picsum.photos/400/280?random=12",
    alt: "TNeGA at Digital India Summit 2025",
    caption: "TNeGA at Digital India Summit 2025: Panel Discussion",
    date: "Oct 2025",
  },
  {
    id: "video-04",
    src: "https://picsum.photos/400/280?random=13",
    alt: "e-Parvai AI Eye Screening Demo",
    caption: "e-Parvai: AI-Powered Cataract Detection in Action",
    date: "Jul 2025",
  },
  {
    id: "video-05",
    src: "https://picsum.photos/400/280?random=14",
    alt: "KMUT DBT: Beneficiary Stories",
    caption: "KMUT: Beneficiary Stories from Across Tamil Nadu",
    date: "Apr 2025",
  },
  {
    id: "video-06",
    src: "https://picsum.photos/400/280?random=15",
    alt: "TNeGA Annual Review 2024–25",
    caption: "TNeGA Annual Review 2024–25: Key Achievements",
    date: "Mar 2025",
  },
];

/** "May 2025" -> "2025". */
export function yearOf(date: string): string {
  const match = date.match(/\b(\d{4})\b/);
  return match ? match[1] : "";
}

/**
 * Year options derived from the items themselves, so the dropdown can't
 * offer a year with no media or hide media from a year it forgot to list.
 */
const years = Array.from(
  new Set([...photos, ...videos].map((m) => yearOf(m.date)).filter(Boolean))
).sort((a, b) => Number(b) - Number(a));

export const facets: Facet[] = [
  {
    id: "year",
    kind: "select",
    ariaLabel: "Filter by year",
    initial: "all",
    options: [
      { value: "all", label: "All Years" },
      ...years.map((y) => ({ value: y, label: y })),
    ],
  },
];

export const searchPlaceholder = "Search photos and videos...";
export const searchAriaLabel = "Search photos and videos";
export const filterBarLabel = "Filter media";
export const noResultsText = "No media matches your filters.";
