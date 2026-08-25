import { getPayloadClient } from "@/lib/payload-client";
import { PillarsForm } from "./PillarsForm";
import { updatePillars } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

function bannerUrl(image: number | Media | null | undefined): string | undefined {
  return typeof image === "object" && image ? image.url ?? undefined : undefined;
}

export default async function PillarsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "pillars-content", locale, depth: 1, draft: true, overrideAccess: true });
  const pillars = doc.pillars ?? [];
  const existingImageIds = pillars.map((p) =>
    typeof p.bannerImage === "object" && p.bannerImage ? p.bannerImage.id : typeof p.bannerImage === "number" ? p.bannerImage : undefined
  );
  const boundAction = updatePillars.bind(null, existingImageIds);

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Pillar Cards</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The 3 &quot;Enabling Digital Governance&quot; cards on the Home and About pages. Always exactly 3 cards — the
        project list on the back of each card comes from the Services collection, not from here.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/pillars" current={locale} />

      <PillarsForm
        key={locale}
        action={boundAction}
        locale={locale}
        values={{
          eyebrow: doc.eyebrow,
          heading: doc.heading,
          pillars: Array.from({ length: 3 }, (_, i) => ({
            id: pillars[i]?.id ?? undefined,
            title: pillars[i]?.title ?? "",
            linkLabel: pillars[i]?.linkLabel ?? "",
            bannerImageUrl: bannerUrl(pillars[i]?.bannerImage),
          })),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
