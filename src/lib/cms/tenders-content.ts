import { getPayloadClient } from "@/lib/payload-client";

export type CmsTendersContent = {
  hero: { eyebrow: string; heading: string; body: string };
  tenderPortal: {
    heading: string;
    sub: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    redirectNote: string;
  };
};

export async function getTendersContent(): Promise<CmsTendersContent> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "tenders-content", overrideAccess: false });
  return {
    hero: doc.hero,
    tenderPortal: doc.tenderPortal,
  };
}
