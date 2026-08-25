import { getPayloadClient } from "@/lib/payload-client";
import { RtiContentForm } from "./RtiContentForm";
import { updateRtiContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function RtiSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "rti-content", locale, draft: true, overrideAccess: true });
  const contacts = doc.contacts ?? [];
  const disclosures = doc.disclosures ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">RTI Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The RTI page hero, the 2 key-contact cards, the Section 4(1)(b) disclosure table, and the How to File panel.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[720px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[720px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/rti" current={locale} />

      <RtiContentForm
        key={locale}
        action={updateRtiContent}
        locale={locale}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          contacts: Array.from({ length: 2 }, (_, i) => ({
            id: contacts[i]?.id ?? undefined,
            badge: contacts[i]?.badge ?? "",
            tone: contacts[i]?.tone ?? "light",
            name: contacts[i]?.name ?? "",
            designation: contacts[i]?.designation ?? "",
            detailsText: contacts[i]?.detailsText ?? "",
          })),
          disclosures: disclosures.map((d) => ({ id: d.id ?? undefined, sno: d.sno, item: d.item, rowsText: d.rowsText })),
          fileHeading: doc.howToFile.heading,
          fileSub: doc.howToFile.sub,
          fileBody: doc.howToFile.body,
          fileCtaLabel: doc.howToFile.ctaLabel,
          // ctaHref/email/phone/phoneHref aren't localized — same value
          // regardless of which locale this doc was fetched in, so it's
          // safe to populate always even though the form only lets them be
          // edited on the English tab (see RtiContentForm's `LockedField`).
          fileCtaHref: doc.howToFile.ctaHref,
          fileRedirectNote: doc.howToFile.redirectNote,
          fileEmail: doc.howToFile.email,
          filePhone: doc.howToFile.phone,
          filePhoneHref: doc.howToFile.phoneHref,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
