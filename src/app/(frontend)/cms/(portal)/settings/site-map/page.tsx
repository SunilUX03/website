import { getPayloadClient } from "@/lib/payload-client";
import { SiteMapContentForm } from "./SiteMapContentForm";
import { updateSiteMapContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function SiteMapSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-map-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Site Map</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The /sitemap page&apos;s link groups. Rows sharing the same group heading are shown together, in the order each group
        first appears.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/site-map" current={locale} />

      <SiteMapContentForm
        key={locale}
        action={updateSiteMapContent}
        locale={locale}
        values={{
          links: (doc.links ?? []).map((r) => ({ id: r.id ?? undefined, groupHeading: r.groupHeading, label: r.label, href: r.href })),
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
