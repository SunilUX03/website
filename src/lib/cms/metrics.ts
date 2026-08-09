import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsMetric } from "@/lib/cms/metrics-types";

export type { CmsMetric } from "@/lib/cms/metrics-types";

export const getMetrics = unstable_cache(
  async (): Promise<CmsMetric[]> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "metrics-content", overrideAccess: false });
    return (doc.metrics ?? []).map((m) => ({
      value: m.value,
      decimals: m.decimals ?? undefined,
      prefix: m.prefix ?? "",
      suffix: m.suffix ?? "",
      label: m.label,
    }));
  },
  ["metrics-content"],
  { revalidate: 60, tags: ["metrics-content"] }
);
