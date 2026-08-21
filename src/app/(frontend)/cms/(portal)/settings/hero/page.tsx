import { getPayloadClient } from "@/lib/payload-client";
import { HeroContentForm } from "./HeroContentForm";
import { updateHeroContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function HeroSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const payload = await getPayloadClient();
  const [doc, docTa] = await Promise.all([
    payload.findGlobal({ slug: "hero-content", draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: "hero-content", locale: "ta", draft: true, overrideAccess: true }),
  ]);

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

      <HeroContentForm
        action={updateHeroContent}
        values={{
          agencyLabelCycle: doc.agencyLabelCycle?.map((r) => ({ text: r.text })) ?? [],
          headlineTemplate: doc.headlineTemplate,
          headlineTemplateTa: docTa.headlineTemplate ?? "",
          headlineCycleWords: (doc.headlineCycleWords ?? []).map((r, i) => ({
            word: r.word,
            taWord: docTa.headlineCycleWords?.[i]?.word ?? "",
          })),
          tagline: doc.tagline,
          taglineTa: docTa.tagline ?? "",
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
