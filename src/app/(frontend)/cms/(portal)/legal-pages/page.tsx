import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";

export const dynamic = "force-dynamic";

export default async function LegalPagesListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "legal-pages",
    limit: 50,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="type-display-sm text-ink">Legal Pages</h1>
        <p className="type-body-sm mt-1 text-[var(--color-muted)]">
          Privacy Policy, Terms & Conditions, Terms of Use, Disclaimer, Help, and the Feedback page&apos;s intro text.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
        <table className="w-full text-left">
          <thead>
            <tr className="type-caption-uppercase border-b border-hairline text-[var(--color-muted)]">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="type-body-sm border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink">{doc.title}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{doc.slug}</td>
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
                  <Link href={`/cms/legal-pages/${doc.id}/edit`} className="type-caption font-semibold text-[var(--color-primary-blue)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
