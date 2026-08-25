import { getPayloadClient } from "@/lib/payload-client";
import type { SocialPost as SocialPostDoc, Media } from "@/payload-types";
import type { Locale } from "@/lib/locale";

export type SocialPlatform = "facebook" | "instagram" | "x" | "youtube" | "linkedin";

/** Shape consumed by SocialMedia.tsx / CommunityFeed.tsx — mirrors the old
 * SOCIAL_SEED entries (see lib/social-seed-data.ts) so those components
 * needed no changes beyond swapping their `link` fallback logic. */
export type CmsSocialPost = {
  text: string;
  date: string;
  image?: string;
  link?: string;
};

function formatPostDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ta" ? "ta-IN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function toCmsSocialPost(doc: SocialPostDoc, locale: Locale): CmsSocialPost {
  const image = typeof doc.image === "object" ? (doc.image as Media) : undefined;
  return {
    text: doc.text,
    date: formatPostDate(doc.date, locale),
    image: image?.url ?? undefined,
    link: doc.link ?? undefined,
  };
}

/** Published posts for one platform, in the admin's drag-set order (see
 * /cms/social-media). */
export async function getSocialPosts(platform: SocialPlatform, locale: Locale = "en"): Promise<CmsSocialPost[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "social-posts",
    locale,
    depth: 1,
    sort: "order",
    limit: 20,
    overrideAccess: false,
    where: { platform: { equals: platform } },
  });
  return result.docs.map((doc) => toCmsSocialPost(doc, locale));
}
