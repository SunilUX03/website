import { getPayloadClient } from "@/lib/payload-client";

export type CmsRtiContactDetail = { text: string; href: string | null };
export type CmsRtiContact = {
  badge: string;
  tone: "light" | "dark";
  name: string;
  designation: string;
  details: CmsRtiContactDetail[];
};
export type CmsRtiDisclosureGroup = {
  sno: string;
  item: string;
  rows: { detail: string; info: string }[];
};
export type CmsRtiContent = {
  hero: { eyebrow: string; heading: string; body: string };
  contacts: CmsRtiContact[];
  disclosures: CmsRtiDisclosureGroup[];
  howToFile: {
    heading: string;
    sub: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    redirectNote: string;
    email: string;
    phone: string;
    phoneHref: string;
  };
};

function parseDetailLine(line: string): CmsRtiContactDetail {
  const [text, href] = line.split(" :: ").map((s) => s.trim());
  return { text, href: href || null };
}

function parseDisclosureRow(line: string): { detail: string; info: string } {
  const [detail, info] = line.split(" :: ").map((s) => s.trim());
  return { detail: detail ?? "", info: info ?? "" };
}

export async function getRtiContent(): Promise<CmsRtiContent> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "rti-content", overrideAccess: false });
  return {
    hero: doc.hero,
    contacts: (doc.contacts ?? []).map((c) => ({
      badge: c.badge,
      tone: c.tone,
      name: c.name,
      designation: c.designation,
      details: c.detailsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map(parseDetailLine),
    })),
    disclosures: (doc.disclosures ?? []).map((d) => ({
      sno: d.sno,
      item: d.item,
      rows: d.rowsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map(parseDisclosureRow),
    })),
    howToFile: doc.howToFile,
  };
}
