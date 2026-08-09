import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function GovernmentOrdersListPage() {
  const payload = await getPayloadClient();
  const { docs, totalDocs } = await payload.find({
    collection: "government-orders",
    sort: "-year",
    limit: 500,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Government Orders ({totalDocs})</h1>
        <Link href="/cms/government-orders/new" className="type-button btn-primary">
          + Add Government Order
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink">{doc.title}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.year}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.department}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      doc._status === "published"
                        ? "badge-pill type-caption-uppercase !bg-[rgba(16,138,74,0.1)] !text-[#108a4a]"
                        : "badge-pill type-caption-uppercase"
                    }
                  >
                    {doc._status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/cms/government-orders/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No Government Orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
