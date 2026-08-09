import { getPayloadClient } from "@/lib/payload-client";
import type { Announcement, Media } from "@/payload-types";
import { type CmsAnnouncement } from "@/lib/cms/announcement-types";

export type { CmsAnnouncement } from "@/lib/cms/announcement-types";

function formatTimestamp(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function toCmsAnnouncement(doc: Announcement): CmsAnnouncement {
  const image = typeof doc.image === "object" && doc.image !== null ? (doc.image as Media).url ?? undefined : undefined;
  return {
    id: doc.id,
    slug: doc.slug,
    heading: doc.heading,
    description: doc.description,
    timestamp: formatTimestamp(doc.date),
    href: `/notifications/announcements/${doc.slug}`,
    image,
    category: doc.category ?? undefined,
    facts: doc.facts?.map((f) => ({ label: f.label, value: f.value })),
    links: doc.links?.map((l) => ({ label: l.label, href: l.href })),
    body: doc.body,
  };
}

/** Published announcements, newest first — the only ordering any page
 * on the site actually needs. */
export async function getAnnouncements(): Promise<CmsAnnouncement[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "announcements",
    depth: 1,
    sort: "-date",
    limit: 200,
    overrideAccess: false,
  });
  return result.docs.map(toCmsAnnouncement);
}

export async function getAnnouncementBySlug(slug: string): Promise<CmsAnnouncement | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "announcements",
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  });
  const doc = result.docs[0];
  return doc ? toCmsAnnouncement(doc) : null;
}

export { yearOf, yearsOf } from "@/lib/cms/announcement-types";
