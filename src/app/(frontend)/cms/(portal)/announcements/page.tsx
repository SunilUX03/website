import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function AnnouncementsListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "announcements",
    sort: "-date",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Announcements</h1>
        <Link href="/cms/announcements/new" className="type-button btn-primary">
          + Add announcement
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink">{doc.heading}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.date?.slice(0, 10)}</td>
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
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.tickerFeatured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/cms/announcements/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No announcements yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
