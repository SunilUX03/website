import { getPayloadClient } from "@/lib/payload-client";
import { TendersContentForm } from "./TendersContentForm";
import { updateTendersContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";

export const dynamic = "force-dynamic";

export default async function TendersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "tenders-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Tenders Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The Tenders page hero and the panel linking out to the Government e-Tendering portal.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/tenders" current={locale} />

      <TendersContentForm
        key={locale}
        action={updateTendersContent}
        locale={locale}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          portalHeading: doc.tenderPortal.heading,
          portalSub: doc.tenderPortal.sub,
          portalBody: doc.tenderPortal.body,
          portalCtaLabel: doc.tenderPortal.ctaLabel,
          portalCtaHref: doc.tenderPortal.ctaHref,
          portalRedirectNote: doc.tenderPortal.redirectNote,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
