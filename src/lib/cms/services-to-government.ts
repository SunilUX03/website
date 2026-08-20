import { getPayloadClient } from "@/lib/payload-client";

export type CmsServicesToGovernmentContent = {
  hero: { eyebrow: string; heading: string; body: string };
  services: { id: string; name: string; description: string }[];
  tableIntro: { eyebrow: string; heading: string; body: string };
  raiseTicketLabel: string;
  raiseTicketHref: string;
};

export async function getServicesToGovernmentContent(): Promise<CmsServicesToGovernmentContent> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "services-to-government-content" });
  return {
    hero: doc.hero,
    services: (doc.services ?? []).map((s, i) => ({ id: s.id ?? String(i), name: s.name, description: s.description })),
    tableIntro: doc.tableIntro,
    raiseTicketLabel: doc.raiseTicketLabel,
    raiseTicketHref: doc.raiseTicketHref,
  };
}
