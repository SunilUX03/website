/** Kept separate from media-items.ts (which imports the Payload Local
 * API — server-only: drizzle-kit, file-type, child_process) so the
 * client-side MediaTabs component can import this pure shape/helper
 * without dragging that server bundle into the browser build. Same
 * split as lib/cms/announcement-types.ts, after that exact mistake
 * broke the client build once already. */
export type CmsMediaItem = {
  id: number;
  type: "photo" | "video";
  src: string;
  alt: string;
  caption: string;
  date: string;
};

/** "May 2025" -> "2025". */
export function yearOf(date: string): string {
  return date.match(/\b\d{4}\b/)?.[0] ?? "";
}

/** Distinct years present in a list, newest first. */
export function yearsOf(items: CmsMediaItem[]): string[] {
  return Array.from(new Set(items.map((m) => yearOf(m.date)).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
}
