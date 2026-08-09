import { getPayloadClient } from "@/lib/payload-client";
import type { GovernmentOrder, Document as PayloadDocument } from "@/payload-types";
import type { DocumentRow } from "@/components/documents/types";

function fileUrl(file: number | PayloadDocument): string {
  return typeof file === "object" && file !== null ? file.url ?? "" : "";
}

function toRow(doc: GovernmentOrder): DocumentRow {
  return {
    id: String(doc.id),
    searchText: `${doc.title} ${doc.year}`,
    facets: { year: doc.year, dept: doc.department },
    cells: [
      { kind: "title", text: doc.title },
      { kind: "ref", text: doc.title },
      { kind: "date", text: doc.year },
      { kind: "badge", text: doc.department, tone: "sky" },
      { kind: "download", href: fileUrl(doc.file), label: "PDF", ariaLabel: `Download ${doc.title} PDF` },
    ],
  };
}

/** Published Government Orders, mapped into the same DocumentRow shape
 * the old static lib/government-orders-content.ts array used, so
 * DocumentTable.tsx (search/sort/filter/pagination) needs no changes. */
export async function getGovernmentOrderRows(): Promise<DocumentRow[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "government-orders",
    depth: 1,
    sort: "-year",
    limit: 1000,
    overrideAccess: false,
  });
  return result.docs.map(toRow);
}
