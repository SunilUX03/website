import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsMetricsContent } from "@/lib/cms/metrics-types";
import type { Locale } from "@/lib/locale";

export type { CmsMetric, CmsMetricsContent } from "@/lib/cms/metrics-types";

export const getMetrics = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsMetricsContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "metrics-content", locale, overrideAccess: false });
    return {
      heading: doc.heading,
      metrics: (doc.metrics ?? []).map((m) => ({
        metric: m.metric,
        label: m.label,
      })),
    };
  },
  ["metrics-content"],
  { revalidate: 60, tags: ["metrics-content"] }
);
