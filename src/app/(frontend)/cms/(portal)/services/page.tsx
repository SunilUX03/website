import Link from "next/link";
import { getPayloadClient } from "@/lib/payload-client";
import { ServicesTable } from "./ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "services",
    sort: "order",
    limit: 200,
    draft: true,
    overrideAccess: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Initiatives & Projects</h1>
        <Link href="/cms/services/new" className="type-button btn-primary">
          + Add initiative/project
        </Link>
      </div>
      <p className="type-body-sm mb-4 max-w-[680px] text-[var(--color-muted)]">
        The cards on the /initiatives-projects page. Drag a row by its handle to control the order they appear in
        (and anywhere else they&apos;re listed).
      </p>

      <ServicesTable docs={docs} />
    </div>
  );
}
