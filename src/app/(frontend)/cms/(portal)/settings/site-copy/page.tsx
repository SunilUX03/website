import { getPayloadClient } from "@/lib/payload-client";
import { SiteCopyForm } from "./SiteCopyForm";
import { updateSiteCopy } from "./actions";

export const dynamic = "force-dynamic";

export default async function SiteCopySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const [doc, docTa] = await Promise.all([
    payload.findGlobal({ slug: "site-copy-content", draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: "site-copy-content", locale: "ta", draft: true, overrideAccess: true }),
  ]);
  const panels = doc.reachUsPanels ?? [];
  const panelsTa = docTa.reachUsPanels ?? [];

  const emptyHero = { eyebrow: "", heading: "", body: "" };

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Other Page Copy</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Small hero blurbs for the Notifications and Services list pages, plus the homepage&apos;s Reach Us and
        Current Openings panels. The item lists on each page are edited separately.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <SiteCopyForm
        action={updateSiteCopy}
        values={{
          announcementsHero: doc.announcementsHero,
          announcementsHeroTa: docTa.announcementsHero ?? emptyHero,
          governmentOrdersHero: doc.governmentOrdersHero,
          governmentOrdersHeroTa: docTa.governmentOrdersHero ?? emptyHero,
          policiesHero: doc.policiesHero,
          policiesHeroTa: docTa.policiesHero ?? emptyHero,
          mediaHero: doc.mediaHero,
          mediaHeroTa: docTa.mediaHero ?? emptyHero,
          servicesHero: doc.servicesHero,
          servicesHeroTa: docTa.servicesHero ?? emptyHero,
          reachUsPanels: Array.from({ length: 2 }, (_, i) => ({
            eyebrow: panels[i]?.eyebrow ?? "",
            title: panels[i]?.title ?? "",
            description: panels[i]?.description ?? "",
            ctaLabel: panels[i]?.ctaLabel ?? "",
          })),
          reachUsPanelsTa: Array.from({ length: 2 }, (_, i) => ({
            eyebrow: panelsTa[i]?.eyebrow ?? "",
            title: panelsTa[i]?.title ?? "",
            description: panelsTa[i]?.description ?? "",
            ctaLabel: panelsTa[i]?.ctaLabel ?? "",
          })),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
