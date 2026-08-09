import type { Announcement } from "@/payload-types";

/** The shape every existing announcement-rendering component already
 * expects (heading/description/timestamp/href/image) — extended with
 * the detail-page-only fields. Kept in its own module, separate from
 * announcements.ts, because that file imports the Payload Local API
 * (server-only: drizzle-kit, file-type, child_process) — a client
 * component pulling in just this type would otherwise drag that entire
 * server bundle into the browser build. */
export type CmsAnnouncement = {
  id: number;
  slug: string;
  heading: string;
  description: string;
  timestamp: string;
  href: string;
  image?: string;
  category?: string;
  facts?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  body?: Announcement["body"];
};

/** "29 May 2025" -> "2025". Timestamps end with the year in this format. */
export function yearOf(timestamp: string): string {
  return timestamp.match(/\d{4}/)?.[0] ?? "";
}

/** Distinct years present in a list, newest first — same derive-don't-
 * hardcode approach the old lib/announcements-content.ts used, so adding
 * an announcement from a new year never requires a matching code change. */
export function yearsOf(items: CmsAnnouncement[]): string[] {
  return Array.from(new Set(items.map((a) => yearOf(a.timestamp)).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
}
