import { getPayloadClient } from "@/lib/payload-client";
import { HeroContentForm } from "./HeroContentForm";
import { updateHeroContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function HeroSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "hero-content", locale, depth: 1, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Homepage Hero</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">The first thing every visitor sees.</p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/hero" current={locale} />

      <HeroContentForm
        key={locale}
        action={updateHeroContent}
        locale={locale}
        values={{
          agencyLabelCycle: (doc.agencyLabelCycle ?? []).map((r) => ({ id: r.id ?? undefined, text: r.text })),
          headlineTemplate: doc.headlineTemplate,
          headlineCycleWords: (doc.headlineCycleWords ?? []).map((r) => ({ id: r.id ?? undefined, word: r.word })),
          tagline: doc.tagline,
          mapImageUrl: typeof doc.mapImage === "object" && doc.mapImage ? (doc.mapImage as Media).url ?? undefined : undefined,
          backgroundImageUrl: typeof doc.backgroundImage === "object" && doc.backgroundImage ? (doc.backgroundImage as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
