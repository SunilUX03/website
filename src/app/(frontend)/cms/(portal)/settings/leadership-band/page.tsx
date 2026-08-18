import { getPayloadClient } from "@/lib/payload-client";
import { LeadershipBandForm } from "./LeadershipBandForm";
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
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
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
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LeadershipBandForm
        action={boundAction}
        values={{
          description: doc.description,
          leader1Name: leader1?.name ?? "",
          leader1Title: leader1?.title ?? "",
          leader1PhotoUrl: photoUrl(leader1?.photo),
          leader1PhotoPosition: leader1?.photoPosition ?? "50% 50%",
          leader2Name: leader2?.name ?? "",
          leader2Title: leader2?.title ?? "",
          leader2PhotoUrl: photoUrl(leader2?.photo),
          leader2PhotoPosition: leader2?.photoPosition ?? "50% 50%",
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
