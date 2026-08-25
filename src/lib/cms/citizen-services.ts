import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Media } from "@/payload-types";
import type { Locale } from "@/lib/locale";

export type CmsCitizenService = {
  id: number;
  name: string;
  description: string;
  image: string;
  buttonLabel?: string;
  buttonHref: string;
  externalLink: boolean;
};

export const getCitizenServices = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsCitizenService[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "citizen-services",
      locale,
      sort: "order",
      limit: 100,
      depth: 1,
      overrideAccess: false,
    });
    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      image: typeof d.image === "object" && d.image ? (d.image as Media).url ?? "" : "",
      buttonLabel: d.buttonLabel ?? undefined,
      buttonHref: d.buttonHref ?? "",
      externalLink: d.externalLink ?? true,
    }));
  },
  ["citizen-services"],
  { revalidate: 60, tags: ["citizen-services"] }
);
