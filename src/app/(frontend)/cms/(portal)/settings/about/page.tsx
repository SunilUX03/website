import { getPayloadClient } from "@/lib/payload-client";
import { AboutPageForm } from "./AboutPageForm";
import { updateAboutPageContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AboutPageSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "about-page-content", draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">About Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Hero, Who We Are, the reporting-line strip, Vision &amp; Mission, and Connect With Us.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <AboutPageForm
        action={updateAboutPageContent}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeadline: doc.hero.headline,
          heroDescription: doc.hero.description,
          whoWeAreHeading: doc.whoWeAre.heading,
          whoWeAreParagraph: doc.whoWeAre.paragraph,
          hierarchy: doc.hierarchy?.map((r) => ({ label: r.label, emphasized: r.emphasized ? "true" : "false" })) ?? [],
          visionMission: doc.visionMission?.map((r) => ({ label: r.label, title: r.title, description: r.description })) ?? [],
          connectEmail: doc.connectWithUs.email,
          connectSocial: doc.connectWithUs.social?.map((r) => ({ label: r.label, href: r.href })) ?? [],
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
