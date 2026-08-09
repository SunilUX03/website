import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { CmsOrgChart } from "@/lib/cms/about-types";

export type { CmsOrgChart, CmsOrgChartBranch } from "@/lib/cms/about-types";

const EMPTY: CmsOrgChart = { top: [], branches: [] };

export const getOrgChart = unstable_cache(
  async (): Promise<CmsOrgChart> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "org-chart-content", depth: 0, overrideAccess: false });
    if (!doc) return EMPTY;
    return {
      top: [doc.topPrimary, doc.topSecondary].filter(Boolean),
      branches:
        doc.branches?.map((b) => ({
          director: b.director,
          engineer: b.engineer || null,
          manager: b.manager,
          base: b.base,
        })) ?? [],
    };
  },
  ["org-chart-content"],
  { revalidate: 60, tags: ["org-chart-content"] }
);
