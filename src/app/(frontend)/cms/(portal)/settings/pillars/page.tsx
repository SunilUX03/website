import Image from "next/image";
import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updatePillars } from "./actions";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

const PILLAR_NAMES = ["Citizen Services", "e-Governance Projects", "Services"];

function bannerUrl(image: number | Media | null | undefined): string | undefined {
  return typeof image === "object" && image ? image.url ?? undefined : undefined;
}

export default async function PillarsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
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

      <form action={boundAction} className="flex max-w-[680px] flex-col gap-6">
        {Array.from({ length: 3 }, (_, i) => pillars[i]).map((pillar, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">
              Card {i + 1} {PILLAR_NAMES[i] ? `— ${PILLAR_NAMES[i]}` : ""}
            </p>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
              <input
                name={`pillar${i}Title`}
                defaultValue={pillar?.title ?? PILLAR_NAMES[i] ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
              <textarea
                name={`pillar${i}Description`}
                defaultValue={pillar?.description ?? ""}
                required
                rows={3}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
                Link label <span className="normal-case text-[11px]">(e.g. &quot;View all Citizen Services&quot;)</span>
              </label>
              <input
                name={`pillar${i}LinkLabel`}
                defaultValue={pillar?.linkLabel ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Banner image</label>
              {bannerUrl(pillar?.bannerImage) ? (
                <div className="relative mb-2 h-24 w-40 overflow-hidden rounded-lg border border-hairline">
                  <Image src={bannerUrl(pillar?.bannerImage)!} alt="" fill className="object-cover" />
                </div>
              ) : null}
              <input type="file" name={`pillar${i}BannerImage`} accept="image/*" className="type-body-sm block" />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? These cards will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the Home and About pages immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
