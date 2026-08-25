import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";
import { moveCitizenService } from "./actions";

export const dynamic = "force-dynamic";

export default async function CitizenServicesListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "citizen-services",
    sort: "order",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Citizen Services</h1>
        <Link href="/cms/citizen-services/new" className="type-button btn-primary">
          + Add card
        </Link>
      </div>
      <p className="type-body-sm mb-4 max-w-[680px] text-[var(--color-muted)]">
        The cards on the /citizen-services page. Use the arrows to control the order they appear in.
      </p>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <form action={moveCitizenService.bind(null, doc.id, "up")}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label={`Move ${doc.name} up`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline-strong text-[var(--color-muted)] hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveCitizenService.bind(null, doc.id, "down")}>
                      <button
                        type="submit"
                        disabled={i === docs.length - 1}
                        aria-label={`Move ${doc.name} down`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline-strong text-[var(--color-muted)] hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink">{doc.name}</td>
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
                  <Link href={`/cms/citizen-services/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No cards yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
