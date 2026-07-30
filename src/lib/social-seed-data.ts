// Seed/placeholder data behind the same shape a real platform API
// integration would return, so /api/social/* routes can swap their
// internals for a real Graph/X/YouTube API call later without the client
// component (SocialMedia.tsx) needing to change at all.
//
// Real API integration requires registering an app + credentials with each
// platform (Facebook Graph API, X API, YouTube Data API) — flagged as a
// setup dependency, not something wireable without those credentials.

export interface SocialPost {
  text: string;
  date: string;
  image: string;
}

export const SOCIAL_SEED: Record<"facebook" | "x" | "youtube", SocialPost[]> = {
  facebook: [
    {
      text: "TNeGA's SimpleGov initiative simplifies 10 government services — paperless, online and instant. A new era of governance begins.",
      date: "29 May 2025",
      image: "https://picsum.photos/seed/tnega-fb-simplegov/640/360",
    },
    {
      text: "e-Sevai centres have now processed over 4 crore citizen transactions across Tamil Nadu.",
      date: "14 Jul 2025",
      image: "https://picsum.photos/seed/tnega-fb-esevai/640/360",
    },
    {
      text: "UMIS now integrates student data from 5,490 institutions statewide — one platform for all of higher education.",
      date: "02 Sep 2025",
      image: "https://picsum.photos/seed/tnega-fb-umis/640/360",
    },
  ],
  x: [
    {
      text: "Namma Arasu is live! Access 51 government services on WhatsApp at 7845252525. Governance at your fingertips.",
      date: "08 Jan 2026",
      image: "https://picsum.photos/seed/tnega-x-nammaarasu/640/360",
    },
    {
      text: "TN GIS now maps 400+ spatial layers — land records, guideline values and civic amenities in one click.",
      date: "22 Oct 2025",
      image: "https://picsum.photos/seed/tnega-x-tngis/640/360",
    },
    {
      text: "e-Office has crossed 1,28,243 daily users across state government departments.",
      date: "05 Nov 2025",
      image: "https://picsum.photos/seed/tnega-x-eoffice/640/360",
    },
  ],
  youtube: [
    {
      text: "Watch: Chief Minister launches SimpleGov — Tamil Nadu's landmark digital governance reform initiative.",
      date: "29 May 2025",
      image: "https://picsum.photos/seed/tnega-yt-simplegov/640/360",
    },
    {
      text: "Explainer: how e-Sevai brings 410+ services within reach of every district in Tamil Nadu.",
      date: "18 Aug 2025",
      image: "https://picsum.photos/seed/tnega-yt-esevai/640/360",
    },
    {
      text: "Inside Namma Arasu: how WhatsApp is becoming a channel for government services.",
      date: "20 Jan 2026",
      image: "https://picsum.photos/seed/tnega-yt-nammaarasu/640/360",
    },
  ],
};
