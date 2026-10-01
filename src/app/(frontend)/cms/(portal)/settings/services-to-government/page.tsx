import { getPayloadClient } from "@/lib/payload-client";
import { ServicesToGovernmentForm } from "./ServicesToGovernmentForm";
import { updateServicesToGovernmentContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function ServicesToGovernmentSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "services-to-government-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Services to Government Page</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The page hero, its service blocks, and the department-contact table — everything on the page, in one place.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/services-to-government" current={locale} />

      <ServicesToGovernmentForm
        key={locale}
        action={updateServicesToGovernmentContent}
        locale={locale}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          hideServicesSection: Boolean(doc.hideServicesSection),
          services: (doc.services ?? []).map((s) => ({ id: s.id ?? undefined, name: s.name, description: s.description })),
          hideTableIntroSection: Boolean(doc.hideTableIntroSection),
          tableIntroEyebrow: doc.tableIntro.eyebrow,
          tableIntroHeading: doc.tableIntro.heading,
          tableIntroBody: doc.tableIntro.body,
          tableHeaderSerialNumber: doc.tableColumnHeaders.serialNumber,
          tableHeaderDepartment: doc.tableColumnHeaders.department,
          tableHeaderContact: doc.tableColumnHeaders.contact,
          tableHeaderEmail: doc.tableColumnHeaders.email,
          tableHeaderPhone: doc.tableColumnHeaders.phone,
          raiseTicketLabel: doc.raiseTicketLabel,
          raiseTicketHref: doc.raiseTicketHref,
          hideDepartmentContactsSection: Boolean(doc.hideDepartmentContactsSection),
          departmentContacts: (doc.departmentContacts ?? []).map((d) => ({
            id: d.id ?? undefined,
            department: d.department,
            contact: d.contact,
            email: d.email,
            phone: d.phone,
          })),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
