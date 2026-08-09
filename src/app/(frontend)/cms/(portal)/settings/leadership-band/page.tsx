import Image from "next/image";
import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateLeadershipBand } from "./actions";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

function photoUrl(photo: number | Media | null | undefined): string | undefined {
  return typeof photo === "object" && photo ? photo.url ?? undefined : undefined;
}
function photoId(photo: number | Media | null | undefined): number | undefined {
  return typeof photo === "object" && photo ? photo.id : typeof photo === "number" ? photo : undefined;
}

export default async function LeadershipBandSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "leadership-band-content", depth: 1, draft: true, overrideAccess: true });
  const [leader1, leader2] = doc.leaders ?? [];

  const boundAction = updateLeadershipBand.bind(null, [photoId(leader1?.photo), photoId(leader2?.photo)]);

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Leadership Band</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">The CM/Minister signature strip on the homepage.</p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={boundAction} className="flex max-w-[680px] flex-col gap-6">
        <section className="rounded-xl border border-hairline bg-surface-card p-5">
          <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
          <textarea
            name="description"
            defaultValue={doc.description}
            required
            rows={3}
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
        </section>

        {[
          { index: 1, leader: leader1, title: "Leader 1 (larger signature)" },
          { index: 2, leader: leader2, title: "Leader 2 (smaller signature)" },
        ].map(({ index, leader, title }) => (
          <section key={index} className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">{title}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Name</label>
                <input
                  name={`leader${index}Name`}
                  defaultValue={leader?.name ?? ""}
                  required
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
                <input
                  name={`leader${index}Title`}
                  defaultValue={leader?.title ?? ""}
                  required
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Photo</label>
              {photoUrl(leader?.photo) ? (
                <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full border border-hairline">
                  <Image src={photoUrl(leader?.photo)!} alt="" fill className="object-cover" />
                </div>
              ) : null}
              <input type="file" name={`leader${index}Photo`} accept="image/*" className="type-body-sm block" />
            </div>
            <div className="max-w-[200px]">
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
                Photo position <span className="normal-case text-[11px]">(e.g. &quot;50% 20%&quot;)</span>
              </label>
              <input
                name={`leader${index}PhotoPosition`}
                defaultValue={leader?.photoPosition ?? "50% 50%"}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? This band will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the homepage immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
