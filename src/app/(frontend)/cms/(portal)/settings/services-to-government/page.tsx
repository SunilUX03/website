import { getPayloadClient } from "@/lib/payload-client";
import { ServicesToGovernmentForm } from "./ServicesToGovernmentForm";
import { updateServicesToGovernmentContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function ServicesToGovernmentSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "services-to-government-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Services to Government Page</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The page hero, its 4 service blocks, and the department-contact table's intro copy. The table rows
        themselves live under Department Contacts.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <ServicesToGovernmentForm
        action={updateServicesToGovernmentContent}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          services: (doc.services ?? []).map((s) => ({ name: s.name, description: s.description })),
          tableIntroEyebrow: doc.tableIntro.eyebrow,
          tableIntroHeading: doc.tableIntro.heading,
          tableIntroBody: doc.tableIntro.body,
          raiseTicketLabel: doc.raiseTicketLabel,
          raiseTicketHref: doc.raiseTicketHref,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
