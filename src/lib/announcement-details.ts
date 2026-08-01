// ─────────────────────────────────────────────────────────────────────
// DRAFT BODY COPY — REQUIRES SIGN-OFF BEFORE PUBLISHING
//
// The `announcements` array in content.ts carries only a heading and a
// one-line description; there was never any long-form text for the
// individual announcement pages. Rather than invent facts about
// Government of Tamil Nadu initiatives, every sentence below is
// assembled from statements that already appear elsewhere on this site
// (content.ts ticker + announcement descriptions, services-content.ts
// service stats, government-orders-content.ts GO titles).
//
// No new claim, date, figure or quote has been introduced. Even so, this
// is placeholder prose written to demonstrate the page template — it is
// NOT official communication. Replace each `paragraphs` block with
// approved copy from the communications team before this goes live.
//
// Adding a new announcement: add it to `announcements` in content.ts,
// then add a matching entry here keyed by the slug at the end of its
// href. A missing entry renders the summary and related links without
// body copy rather than breaking the page.
// ─────────────────────────────────────────────────────────────────────

export type AnnouncementDetail = {
  /** Short label shown above the headline. */
  category: string;
  /** Pulled-out figures rendered as a small stat strip. */
  facts?: { label: string; value: string }[];
  paragraphs: string[];
  /** Optional further reading, e.g. related GOs or service pages. */
  links?: { label: string; href: string }[];
};

export const announcementDetails: Record<string, AnnouncementDetail> = {
  "simplegov-launch": {
    category: "Service Launch",
    facts: [
      { label: "Services live", value: "10" },
      { label: "Launched", value: "29 May 2025" },
    ],
    paragraphs: [
      "The SimpleGov initiative was launched by the Hon'ble Chief Minister on 29 May 2025, bringing the first ten government services onto a single paperless, online and instant delivery model.",
      "Under SimpleGov, services that previously required in-person visits and physical paperwork are issued digitally. The initial set spans multiple departments, including sanitation certificate digitization, registration of old age homes, verification of characters and antecedents, no-objection certificates for dryland non-agricultural purposes, registration of working women hostels, lift and escalator licensing, and fire licensing.",
      "Each service was notified through a Government Order issued by the concerned department. The full set of orders is published on the Government Orders page.",
    ],
    links: [
      { label: "Government Orders", href: "/notifications/government-orders" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
  },

  "namma-arasu-live": {
    category: "Service Launch",
    facts: [
      { label: "Services", value: "51" },
      { label: "Departments", value: "16" },
      { label: "WhatsApp", value: "7845252525" },
    ],
    paragraphs: [
      "Namma Arasu WhatsApp governance is now live, making 51 government services accessible directly through WhatsApp on 7845252525.",
      "The services span 16 departments, allowing citizens to complete requests from their own phone without visiting a service centre or navigating a separate portal.",
    ],
    links: [
      { label: "Namma Arasu", href: "/services/citizen/namma-arasu" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
  },

  "cm-award": {
    category: "Awards",
    facts: [{ label: "Status", value: "Applications open" }],
    paragraphs: [
      "Applications are now open for the annual Chief Minister's Award for e-Governance Students, which recognises student innovation in e-governance.",
      "The award is presented annually. Details on eligibility, the application process and closing dates are issued with the call for applications.",
    ],
    links: [{ label: "All announcements", href: "/notifications/announcements" }],
  },

  "e-sevai-helpline": {
    category: "Service Update",
    facts: [
      { label: "Helpline", value: "1800-42-56000" },
      { label: "Centres", value: "34,843" },
    ],
    paragraphs: [
      "The e-Sevai helpline on 1800-42-56000 now operates with extended hours to assist citizens across the state.",
      "e-Sevai is Tamil Nadu's unified digital service delivery platform, offering 410 services online and through 34,843 assisted centres statewide. The helpline supports citizens using either channel.",
    ],
    links: [
      { label: "e-Sevai", href: "/services/citizen/e-sevai" },
      { label: "Citizen Services", href: "/services#citizen-services" },
    ],
  },
};

/** "/notifications/announcements/simplegov-launch" -> "simplegov-launch" */
export function slugOf(href: string): string {
  return href.split("/").filter(Boolean).pop() ?? "";
}
