import { getPayloadClient } from "@/lib/payload-client";
import { CareersContentForm } from "./CareersContentForm";
import { updateCareersContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function CareersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "careers-content", draft: true, overrideAccess: true });
  const steps = doc.applicationSteps ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Careers Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The Careers page hero (also shown as a teaser on the About page), the note under the job listing, and the
        4 &quot;How to Apply&quot; steps. Job openings themselves are edited separately under Job Openings.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <CareersContentForm
        action={updateCareersContent}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeading: doc.hero.heading,
          heroBody: doc.hero.body,
          heroCtaLabel: doc.hero.ctaLabel,
          openingsNote: doc.openingsNote,
          steps: Array.from({ length: 4 }, (_, i) => ({
            title: steps[i]?.title ?? "",
            description: steps[i]?.description ?? "",
          })),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
