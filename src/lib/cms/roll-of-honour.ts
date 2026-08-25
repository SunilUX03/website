import { getPayloadClient } from "@/lib/payload-client";
import type { RollOfHonour } from "@/payload-types";
import type { CmsRollOfHonourEntry } from "@/lib/cms/about-types";
import type { Locale } from "@/lib/locale";

export type { CmsRollOfHonourEntry } from "@/lib/cms/about-types";

function toCmsEntry(doc: RollOfHonour): CmsRollOfHonourEntry {
  return { id: doc.id, designation: doc.designation, name: doc.name ?? undefined, range: doc.range ?? undefined };
}

export async function getRollOfHonour(locale: Locale = "en"): Promise<CmsRollOfHonourEntry[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "roll-of-honour",
    locale,
    sort: "order",
    limit: 200,
    overrideAccess: false,
  });
  return result.docs.map(toCmsEntry);
}
