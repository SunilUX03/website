import { getPayloadClient } from "@/lib/payload-client";
import { PillarsForm } from "./PillarsForm";
import { updatePillars } from "./actions";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

function bannerUrl(image: number | Media | null | undefined): string | undefined {
  return typeof image === "object" && image ? image.url ?? undefined : undefined;
}

export default async function PillarsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "pillars-content", depth: 1, draft: true, overrideAccess: true });
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
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <PillarsForm
        action={boundAction}
        values={{
          pillars: Array.from({ length: 3 }, (_, i) => ({
            title: pillars[i]?.title ?? "",
            description: pillars[i]?.description ?? "",
            linkLabel: pillars[i]?.linkLabel ?? "",
            bannerImageUrl: bannerUrl(pillars[i]?.bannerImage),
          })),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
