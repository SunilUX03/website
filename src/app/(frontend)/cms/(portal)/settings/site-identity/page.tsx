import { getPayloadClient } from "@/lib/payload-client";
import { SiteIdentityForm } from "./SiteIdentityForm";
import { updateSiteIdentity } from "./actions";
import type { Media } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function SiteIdentitySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-identity", depth: 1, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Site Identity</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The government emblem, TNeGA mark, favicon, and organisation name shown across the site.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <SiteIdentityForm
        action={updateSiteIdentity}
        values={{
          emblemImageUrl: typeof doc.emblemImage === "object" && doc.emblemImage ? (doc.emblemImage as Media).url ?? undefined : undefined,
          markImageUrl: typeof doc.markImage === "object" && doc.markImage ? (doc.markImage as Media).url ?? undefined : undefined,
          faviconImageUrl: typeof doc.faviconImage === "object" && doc.faviconImage ? (doc.faviconImage as Media).url ?? undefined : undefined,
          nameTamil: doc.nameTamil ?? "",
          nameEnglish: doc.nameEnglish ?? "",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
