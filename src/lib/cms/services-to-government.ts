import { getPayloadClient } from "@/lib/payload-client";
import type { Locale } from "@/lib/locale";

export type CmsServicesToGovernmentContent = {
  hero: { eyebrow: string; heading: string; body: string };
  services: { id: string; name: string; description: string }[];
  tableIntro: { eyebrow: string; heading: string; body: string };
  tableColumnHeaders: { serialNumber: string; department: string; contact: string; email: string; phone: string };
  raiseTicketLabel: string;
  raiseTicketHref: string;
  departmentContacts: { id: string; department: string; contact: string; email: string; phone: string }[];
};

export async function getServicesToGovernmentContent(locale: Locale = "en"): Promise<CmsServicesToGovernmentContent> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "services-to-government-content", locale });
  return {
    hero: doc.hero,
    services: (doc.services ?? []).map((s, i) => ({ id: s.id ?? String(i), name: s.name, description: s.description })),
    tableIntro: doc.tableIntro,
    tableColumnHeaders: doc.tableColumnHeaders,
    raiseTicketLabel: doc.raiseTicketLabel,
    raiseTicketHref: doc.raiseTicketHref,
    // Row order IS display order (drag-reorderable in the CMS) — no
    // separate `order` number, unlike the old department-contacts
    // collection this replaced.
    departmentContacts: (doc.departmentContacts ?? []).map((d, i) => ({
      id: d.id ?? String(i),
      department: d.department,
      contact: d.contact,
      email: d.email,
      phone: d.phone,
    })),
  };
}
