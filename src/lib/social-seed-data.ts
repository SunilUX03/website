// Seed/placeholder data behind the same shape a real platform API
// integration would return, so /api/social/* routes can swap their
// internals for a real Graph/X/YouTube API call later without the client
// component (SocialMedia.tsx) needing to change at all.
//
// Real API integration requires registering an app + credentials with each
// platform (Facebook Graph API, X API, YouTube Data API) — flagged as a
// setup dependency, not something wireable without those credentials.
//
// Images: real, content-appropriate curated stock photos (see
// lib/stock-photos.ts) rather than random placeholders.

import { pexelsPhoto, STOCK } from "./stock-photos";

export interface SocialPost {
  text: string;
  date: string;
  image: string;
}

export const SOCIAL_SEED: Record<
  "facebook" | "x" | "youtube" | "instagram" | "linkedin",
  SocialPost[]
> = {
  facebook: [
    {
      text: "TNeGA's SimpleGov initiative simplifies 10 government services, paperless, online and instant. A new era of governance begins.",
      date: "29 May 2025",
      image: pexelsPhoto(STOCK.handshakeFormal, 640, 360),
    },
    {
      text: "e-Sevai centres have now processed over 4 crore citizen transactions across Tamil Nadu.",
      date: "14 Jul 2025",
      image: pexelsPhoto(STOCK.ruralWomanPhone, 640, 360),
    },
    {
      text: "UMIS now integrates student data from 5,490 institutions statewide, one platform for all of higher education.",
      date: "02 Sep 2025",
      image: pexelsPhoto(STOCK.studentLaptop, 640, 360),
    },
  ],
  x: [
    {
      text: "Namma Arasu is live! Access 51 government services on WhatsApp at 7845252525. Governance at your fingertips.",
      date: "08 Jan 2026",
      image: pexelsPhoto(STOCK.womanPhone, 640, 360),
    },
    {
      text: "TN GIS now maps 400+ spatial layers: land records, guideline values and civic amenities in one click.",
      date: "22 Oct 2025",
      image: pexelsPhoto(STOCK.networkRack, 640, 360),
    },
    {
      text: "e-Office has crossed 1,28,243 daily users across state government departments.",
      date: "05 Nov 2025",
      image: pexelsPhoto(STOCK.itTechnician, 640, 360),
    },
  ],
  youtube: [
    {
      text: "Watch: Chief Minister launches SimpleGov, Tamil Nadu's landmark digital governance reform initiative.",
      date: "29 May 2025",
      image: pexelsPhoto(STOCK.handshakeLeaders, 640, 360),
    },
    {
      text: "Explainer: how e-Sevai brings 410+ services within reach of every district in Tamil Nadu.",
      date: "18 Aug 2025",
      image: pexelsPhoto(STOCK.elderlyManPhone, 640, 360),
    },
    {
      text: "Inside Namma Arasu: how WhatsApp is becoming a channel for government services.",
      date: "20 Jan 2026",
      image: pexelsPhoto(STOCK.elderlyWomanPhone, 640, 360),
    },
  ],
  instagram: [
    {
      text: "Behind the scenes at the SimpleGov launch event: 10 services, one paperless platform.",
      date: "29 May 2025",
      image: pexelsPhoto(STOCK.presentation, 640, 360),
    },
    {
      text: "TNeGA hosted a workshop on GIS for Smart Governance, bringing district teams together.",
      date: "May 2025",
      image: pexelsPhoto(STOCK.workshopGroup, 640, 360),
    },
    {
      text: "Marking 4 crore citizen transactions processed across e-Sevai centres statewide.",
      date: "Apr 2025",
      image: pexelsPhoto(STOCK.attentiveGroup, 640, 360),
    },
  ],
  linkedin: [
    {
      text: "TNeGA is hiring across engineering and program management roles, join us in building Tamil Nadu's digital public infrastructure.",
      date: "12 Jan 2026",
      image: pexelsPhoto(STOCK.officeBuilding, 640, 360),
    },
    {
      text: "Proud to partner with Government departments statewide on SimpleGov: 10 services made paperless, online and instant.",
      date: "29 May 2025",
      image: pexelsPhoto(STOCK.handshakeBusiness, 640, 360),
    },
    {
      text: "UMIS now integrates student data from 5,490 institutions statewide, one platform for all of higher education.",
      date: "02 Sep 2025",
      image: pexelsPhoto(STOCK.studentLaptop, 640, 360),
    },
  ],
};
