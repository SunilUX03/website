import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";

export type CmsCareersContent = {
  hero: { eyebrow: string; heading: string; body: string; ctaLabel: string };
  openingsNote: string;
  applicationSteps: { title: string; description: string }[];
};

export const getCareersContent = unstable_cache(
  async (): Promise<CmsCareersContent> => {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "careers-content", overrideAccess: false });
    return {
      hero: {
        eyebrow: doc.hero.eyebrow,
        heading: doc.hero.heading,
        body: doc.hero.body,
        ctaLabel: doc.hero.ctaLabel,
      },
      openingsNote: doc.openingsNote,
      applicationSteps: (doc.applicationSteps ?? []).map((s) => ({ title: s.title, description: s.description })),
    };
  },
  ["careers-content"],
  { revalidate: 60, tags: ["careers-content"] }
);
