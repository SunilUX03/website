import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";
import type { CmsProjectSpotlight } from "@/lib/cms/projects-spotlight-types";

export type { CmsProjectSpotlight, CmsProjectStat, CmsProjectCta } from "@/lib/cms/projects-spotlight-types";

export async function getProjectsSpotlight(): Promise<CmsProjectSpotlight[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects-spotlight",
    sort: "order",
    limit: 50,
    depth: 1,
    overrideAccess: false,
  });
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    description: doc.description,
    image: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? "" : "",
    badge: doc.badge ?? undefined,
    stats: (doc.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix ?? "", label: s.label })),
    ctas: (doc.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
  }));
}
