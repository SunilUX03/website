import { getPayloadClient } from "@/lib/payload-client";
import { SiteCopyForm } from "./SiteCopyForm";
import { updateSiteCopy } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";

export const dynamic = "force-dynamic";

export default async function SiteCopySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-copy-content", locale, draft: true, overrideAccess: true });
  const panels = doc.reachUsPanels ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Other Page Copy</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Small hero blurbs for the Notifications pages, Citizen Services, Initiatives &amp; Projects and Contact Us,
        plus the homepage&apos;s Reach Us and Current Openings panels. The item lists on each page are edited
        separately.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/site-copy" current={locale} />

      <SiteCopyForm
        key={locale}
        action={updateSiteCopy}
        locale={locale}
        values={{
          announcementsHero: doc.announcementsHero,
          governmentOrdersHero: doc.governmentOrdersHero,
          policiesHero: doc.policiesHero,
          mediaHero: doc.mediaHero,
          citizenServicesHero: doc.citizenServicesHero,
          initiativesProjectsHero: doc.initiativesProjectsHero,
          reachUsHero: doc.reachUsHero,
          reachUsPanels: Array.from({ length: 2 }, (_, i) => ({
            id: panels[i]?.id ?? undefined,
            eyebrow: panels[i]?.eyebrow ?? "",
            title: panels[i]?.title ?? "",
            description: panels[i]?.description ?? "",
            ctaLabel: panels[i]?.ctaLabel ?? "",
          })),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
