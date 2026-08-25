import { getPayloadClient } from "@/lib/payload-client";
import type { Policy, Document as PayloadDocument } from "@/payload-types";
import type { DocumentRow } from "@/components/documents/types";
import type { Locale } from "@/lib/locale";

function fileUrl(file: number | PayloadDocument): string {
  return typeof file === "object" && file !== null ? file.url ?? "" : "";
}

function toRow(doc: Policy, locale: Locale): DocumentRow {
  const downloadAriaLabel = locale === "ta" ? `${doc.title} PDF பதிவிறக்கவும்` : `Download ${doc.title} PDF`;
  return {
    id: String(doc.id),
    searchText: `${doc.title} ${doc.year}`,
    facets: { year: doc.year, cat: doc.category },
    cells: [
      { kind: "title", text: doc.title },
      { kind: "ref", text: doc.title },
      { kind: "date", text: doc.year },
      { kind: "badge", text: doc.category, tone: "violet" },
      { kind: "download", href: fileUrl(doc.file), label: "PDF", ariaLabel: downloadAriaLabel },
    ],
  };
}

/** Published Policies & Guidelines, mapped into the same DocumentRow
 * shape the old static lib/policies-guidelines-content.ts array used. */
export async function getPolicyRows(locale: Locale = "en"): Promise<DocumentRow[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "policies",
    locale,
    depth: 1,
    sort: "-year",
    limit: 1000,
    overrideAccess: false,
  });
  return result.docs.map((doc) => toRow(doc, locale));
}
