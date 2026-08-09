import { getPayloadClient } from "@/lib/payload-client";
import type { Award, Media } from "@/payload-types";
import type { CmsAward } from "@/lib/cms/about-types";

export type { CmsAward } from "@/lib/cms/about-types";

function toCmsAward(doc: Award): CmsAward {
  return {
    id: doc.id,
    title: doc.title,
    year: doc.year,
    description: doc.description,
    image: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? "" : "",
  };
}

export async function getAwards(): Promise<CmsAward[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "awards",
    depth: 1,
    sort: "-year",
    limit: 100,
    overrideAccess: false,
  });
  return result.docs.map(toCmsAward);
}
