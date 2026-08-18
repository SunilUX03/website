import { getPayloadClient } from "@/lib/payload-client";
import { NavContentForm } from "./NavContentForm";
import { updateNavContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function NavSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "nav-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Header Navigation</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the top of every page.</p>

      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <NavContentForm
        action={updateNavContent}
        values={{
          govLabel: doc.govLabel,
          about: doc.about ?? [],
          services: doc.services ?? [],
          notificationsUpdates: doc.notificationsUpdates ?? [],
          notificationsDocuments: doc.notificationsDocuments ?? [],
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
