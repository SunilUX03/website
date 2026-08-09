import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateSiteCopy } from "./actions";

export const dynamic = "force-dynamic";

const HEROES = [
  { key: "announcementsHero", label: "Announcements page hero" },
  { key: "governmentOrdersHero", label: "Government Orders page hero" },
  { key: "policiesHero", label: "Policies & Guidelines page hero" },
  { key: "mediaHero", label: "Media & Press page hero" },
  { key: "servicesHero", label: "Services page hero" },
] as const;

const PANEL_NAMES = ["Reach Us panel", "Current Openings panel"];

export default async function SiteCopySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-copy-content", draft: true, overrideAccess: true });
  const panels = doc.reachUsPanels ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Other Page Copy</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Small hero blurbs for the Notifications and Services list pages, plus the homepage&apos;s Reach Us and
        Current Openings panels. The item lists on each page are edited separately.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateSiteCopy} className="flex max-w-[680px] flex-col gap-6">
        {HEROES.map(({ key, label }) => {
          const hero = doc[key];
          return (
            <section key={key} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
              <p className="type-caption-uppercase text-[var(--color-muted)]">{label}</p>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
                <input name={`${key}Eyebrow`} defaultValue={hero.eyebrow} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Heading</label>
                <input name={`${key}Heading`} defaultValue={hero.heading} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Body</label>
                <textarea name={`${key}Body`} defaultValue={hero.body} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
            </section>
          );
        })}

        {Array.from({ length: 2 }, (_, i) => panels[i]).map((panel, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">Homepage — {PANEL_NAMES[i]}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Eyebrow</label>
                <input name={`panel${i}Eyebrow`} defaultValue={panel?.eyebrow ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Title</label>
                <input name={`panel${i}Title`} defaultValue={panel?.title ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
              </div>
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Description</label>
              <textarea name={`panel${i}Description`} defaultValue={panel?.description ?? ""} required rows={2} className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
            <div className="max-w-[240px]">
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Button text</label>
              <input name={`panel${i}CtaLabel`} defaultValue={panel?.ctaLabel ?? ""} required className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]" />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? These pages will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes multiple pages immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
