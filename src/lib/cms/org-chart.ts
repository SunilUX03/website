import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsOrgChart } from "@/lib/cms/about-types";
import type { Locale } from "@/lib/locale";

export type { CmsOrgChart, CmsOrgChartBranch, CmsOrgChartNode } from "@/lib/cms/about-types";

const EMPTY: CmsOrgChart = { topLabel: "", jceoLabel: "", branches: [] };

export const getOrgChart = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsOrgChart> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "org-chart-content", locale, depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      topLabel: doc.topLabel,
      jceoLabel: doc.jceoLabel,
      branches:
        doc.branches?.map((b) => ({
          title: b.title,
          subtitle: b.subtitle,
          nodes: b.nodes?.map((n) => ({ label: n.label, sublabel: n.sublabel || null, muted: n.muted ?? false })) ?? [],
        })) ?? [],
    };
  },
  ["org-chart-content"],
  { revalidate: 60, tags: ["org-chart-content"] }
);
