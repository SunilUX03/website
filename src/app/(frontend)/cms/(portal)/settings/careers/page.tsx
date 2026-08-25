import { getPayloadClient } from "@/lib/payload-client";
import { CareersContentForm } from "./CareersContentForm";
import { updateCareersContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function CareersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "careers-content", locale, draft: true, overrideAccess: true });
  const steps = doc.applicationSteps ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Careers Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The Careers page hero — this is also the &quot;Join Us&quot; section on the About page, which reuses this
        same hero rather than having its own separate copy — plus the note under the job listing and the 4
        &quot;How to Apply&quot; steps. Job openings themselves are edited separately under Job Openings.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/careers" current={locale} />

      <CareersContentForm
        key={locale}
        action={updateCareersContent}
        locale={locale}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          heroCtaLabel: doc.hero.ctaLabel,
          openingsNote: doc.openingsNote,
          steps: Array.from({ length: 4 }, (_, i) => ({
            id: steps[i]?.id ?? undefined,
            title: steps[i]?.title ?? "",
            description: steps[i]?.description ?? "",
          })),
          howToApplyHeading: doc.howToApplySection.heading,
          howToApplySub: doc.howToApplySection.sub,
          openingsHeading: doc.openingsSection.heading,
          applyHeading: doc.applySection.heading,
          applySub: doc.applySection.sub,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
