import { getPayloadClient } from "@/lib/payload-client";
import type { MediaItem, Media } from "@/payload-types";
import { type CmsMediaItem } from "@/lib/cms/media-item-types";
import type { Locale } from "@/lib/locale";

export type { CmsMediaItem } from "@/lib/cms/media-item-types";
export { yearOf, yearsOf } from "@/lib/cms/media-item-types";

function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ta" ? "ta-IN" : "en-GB", { month: "short", year: "numeric" }).format(
    new Date(isoDate)
  );
}

function toCmsMediaItem(doc: MediaItem, locale: Locale): CmsMediaItem {
  const image = typeof doc.image === "object" && doc.image !== null ? (doc.image as Media).url ?? "" : "";
  return {
    id: doc.id,
    type: doc.type,
    src: image,
    alt: doc.altText || doc.caption,
    caption: doc.caption,
    date: formatDate(doc.date, locale),
  };
}

/** Published photos and videos, newest first — callers split by `type`. */
export async function getMediaItems(locale: Locale = "en"): Promise<CmsMediaItem[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "media-items",
    locale,
    depth: 1,
    sort: "-date",
    limit: 200,
    overrideAccess: false,
  });
  return result.docs.map((doc) => toCmsMediaItem(doc, locale));
}
