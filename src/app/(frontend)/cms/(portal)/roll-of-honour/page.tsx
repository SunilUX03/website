import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function RollOfHonourListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "roll-of-honour",
    sort: "order",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Roll of Honour</h1>
        <Link href="/cms/roll-of-honour/new" className="type-button btn-primary">
          + Add entry
        </Link>
      </div>
      <p className="type-body-sm mb-4 max-w-[680px] text-[var(--color-muted)]">
        Lower &quot;Order&quot; numbers show first (most recent first). Edit an entry&apos;s Order to move it up or down the timeline.
      </p>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Range</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.order}</td>
                <td className="px-4 py-3 text-ink">{doc.designation}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.name ?? "—"}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.range ?? "—"}</td>
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
                  <Link href={`/cms/roll-of-honour/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No entries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
