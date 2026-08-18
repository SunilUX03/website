import { getPayloadClient } from "@/lib/payload-client";
import type { SocialPost as SocialPostDoc, Media } from "@/payload-types";

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

function formatPostDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function toCmsSocialPost(doc: SocialPostDoc): CmsSocialPost {
  const image = typeof doc.image === "object" ? (doc.image as Media) : undefined;
  return {
    text: doc.text,
    date: formatPostDate(doc.date),
    image: image?.url ?? undefined,
    link: doc.link ?? undefined,
  };
}

/** Published posts for one platform, most recent first. */
export async function getSocialPosts(platform: SocialPlatform): Promise<CmsSocialPost[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "social-posts",
    depth: 1,
    sort: "-date",
    limit: 20,
    overrideAccess: false,
    where: { platform: { equals: platform } },
  });
  return result.docs.map(toCmsSocialPost);
}
