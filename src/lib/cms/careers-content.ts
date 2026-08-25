import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type CmsCareersContent = {
  hero: { eyebrow: string; heading: string; body: string; ctaLabel: string };
  openingsNote: string;
  applicationSteps: { title: string; description: string }[];
  howToApplySection: { heading: string; sub: string };
  openingsSection: { heading: string };
  applySection: { heading: string; sub: string };
};

export const getCareersContent = unstable_cache(
  async (locale: Locale = "en"): Promise<CmsCareersContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "careers-content", locale, overrideAccess: false });
    return {
      hero: {
        eyebrow: doc.hero.eyebrow,
        heading: doc.hero.heading,
        body: doc.hero.body,
        ctaLabel: doc.hero.ctaLabel,
      },
      openingsNote: doc.openingsNote,
      applicationSteps: (doc.applicationSteps ?? []).map((s) => ({ title: s.title, description: s.description })),
      howToApplySection: {
        heading: doc.howToApplySection?.heading ?? "",
        sub: doc.howToApplySection?.sub ?? "",
      },
      openingsSection: { heading: doc.openingsSection?.heading ?? "" },
      applySection: {
        heading: doc.applySection?.heading ?? "",
        sub: doc.applySection?.sub ?? "",
      },
    };
  },
  ["careers-content"],
  { revalidate: 60, tags: ["careers-content"] }
);
