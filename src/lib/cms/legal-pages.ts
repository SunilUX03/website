import { getPayloadClient } from "@/lib/payload-client";
import type { LegalPage } from "@/payload-types";

export type LegalSectionData = { heading: string; paragraphs: { text: string; isList: boolean }[] };

export type CmsLegalPage = {
  title: string;
  eyebrow: string;
  intro?: string;
  sections: LegalSectionData[];
};

/** A paragraph where every non-blank line starts with "- " renders as a
 * bullet list; anything else renders as a plain paragraph. Lets editors
 * write both shapes from one plain textarea per section. */
function parseBody(body: string): { text: string; isList: boolean }[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
      return {
        text: isList ? lines.map((l) => l.replace(/^- /, "")).join("\n") : paragraph,
        isList,
      };
    });
}

function toCmsLegalPage(doc: LegalPage): CmsLegalPage {
  return {
    title: doc.title,
    eyebrow: doc.eyebrow ?? "Legal",
    intro: doc.intro ?? undefined,
    sections: doc.sections?.map((s) => ({ heading: s.heading, paragraphs: parseBody(s.body) })) ?? [],
  };
}

export async function getLegalPage(slug: string): Promise<CmsLegalPage | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "legal-pages",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  });
  const doc = result.docs[0];
  return doc ? toCmsLegalPage(doc) : null;
}
