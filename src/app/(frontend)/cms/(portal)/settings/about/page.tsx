import { getPayloadClient } from "@/lib/payload-client";
import { AboutPageForm } from "./AboutPageForm";
import { updateAboutPageContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function AboutPageSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "about-page-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">About Page Content</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Hero, Who We Are, the reporting-line strip, Vision &amp; Mission, Connect With Us, and the heading for every
        other section on this page.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/about" current={locale} />

      <AboutPageForm
        key={locale}
        action={updateAboutPageContent}
        locale={locale}
        values={{
          heroEyebrow: doc.hero.eyebrow,
          heroHeadline: doc.hero.headline,
          heroDescription: doc.hero.description,
          whoWeAreHeading: doc.whoWeAre.heading,
          whoWeAreParagraph: doc.whoWeAre.paragraph,
          hierarchy: doc.hierarchy?.map((r) => ({ id: r.id ?? undefined, label: r.label, emphasized: r.emphasized ? "true" : "false" })) ?? [],
          visionMission: doc.visionMission?.map((r) => ({ id: r.id ?? undefined, label: r.label, title: r.title, description: r.description })) ?? [],
          // connectWithUs is entirely non-localized — its value is the same
          // regardless of which locale this doc was fetched in, so it's
          // safe to populate always even though the form only renders it
          // (and lets it be edited) on the English tab.
          connectEmail: doc.connectWithUs.email,
          connectSocial: doc.connectWithUs.social?.map((r) => ({ id: r.id ?? undefined, label: r.label, href: r.href })) ?? [],
          orgChartEyebrow: doc.orgChartSection.eyebrow,
          orgChartHeading: doc.orgChartSection.heading,
          leadershipEyebrow: doc.leadershipSection.eyebrow,
          leadershipHeading: doc.leadershipSection.heading,
          boardEyebrow: doc.boardSection.eyebrow,
          boardHeading: doc.boardSection.heading,
          awardsEyebrow: doc.awardsSection.eyebrow,
          awardsHeading: doc.awardsSection.heading,
          rollOfHonourEyebrow: doc.rollOfHonourSection.eyebrow,
          rollOfHonourHeading: doc.rollOfHonourSection.heading,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
