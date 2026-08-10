import { getPayloadClient } from "@/lib/payload-client";
import type { Media, Service } from "@/payload-types";
import type { CmsProjectSpotlight } from "@/lib/cms/projects-spotlight-types";

export type { CmsProjectSpotlight, CmsProjectStat, CmsProjectCta } from "@/lib/cms/projects-spotlight-types";

export async function getProjectsSpotlight(): Promise<CmsProjectSpotlight[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects-spotlight",
    sort: "order",
    limit: 50,
    depth: 2,
    overrideAccess: false,
  });
  return docs
    .filter((doc) => typeof doc.service === "object" && doc.service)
    .map((doc) => {
      const service = doc.service as Service;
      return {
        id: doc.id,
        name: service.name,
        description: service.description,
        image: typeof service.image === "object" && service.image ? (service.image as Media).url ?? "" : "",
        badge: doc.badge ?? undefined,
        stats: (doc.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix ?? "", label: s.label })),
        ctas: (doc.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
      };
    });
}
