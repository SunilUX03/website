import { getPayloadClient } from "@/lib/payload-client";
import { RtiContentForm } from "./RtiContentForm";
import { updateRtiContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function RtiSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "rti-content", draft: true, overrideAccess: true });
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

      <RtiContentForm
        action={updateRtiContent}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          contacts: Array.from({ length: 2 }, (_, i) => ({
            badge: contacts[i]?.badge ?? "",
            tone: contacts[i]?.tone ?? "light",
            name: contacts[i]?.name ?? "",
            designation: contacts[i]?.designation ?? "",
            detailsText: contacts[i]?.detailsText ?? "",
          })),
          disclosures: disclosures.map((d) => ({ sno: d.sno, item: d.item, rowsText: d.rowsText })),
          fileHeading: doc.howToFile.heading,
          fileSub: doc.howToFile.sub,
          fileBody: doc.howToFile.body,
          fileCtaLabel: doc.howToFile.ctaLabel,
          fileCtaHref: doc.howToFile.ctaHref,
          fileRedirectNote: doc.howToFile.redirectNote,
          fileEmail: doc.howToFile.email,
          filePhone: doc.howToFile.phone,
          filePhoneHref: doc.howToFile.phoneHref,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
