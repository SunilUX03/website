import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateOrgChart } from "./actions";

export const dynamic = "force-dynamic";

export default async function OrgChartSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "org-chart-content", draft: true, overrideAccess: true });
  const branches = doc.branches ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Organisation Structure</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        Labels only — the chart always has 2 top boxes and 6 branches; you can&apos;t add or remove branches here.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateOrgChart} className="flex max-w-[680px] flex-col gap-6">
        <section className="grid grid-cols-2 gap-4 rounded-xl border border-hairline bg-surface-card p-5">
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Top box (e.g. CEO)</label>
            <input
              name="topPrimary"
              defaultValue={doc.topPrimary}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
          <div>
            <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Second box (e.g. JCEO)</label>
            <input
              name="topSecondary"
              defaultValue={doc.topSecondary}
              required
              className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
            />
          </div>
        </section>

        {Array.from({ length: 6 }, (_, i) => branches[i]).map((branch, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">Branch {i + 1}</p>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Director-level box</label>
              <input
                name={`branch${i}Director`}
                defaultValue={branch?.director ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">
                Engineer-level box <span className="normal-case text-[11px]">(leave blank to skip this level for this branch)</span>
              </label>
              <input
                name={`branch${i}Engineer`}
                defaultValue={branch?.engineer ?? ""}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Manager-level box</label>
              <input
                name={`branch${i}Manager`}
                defaultValue={branch?.manager ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Base-level box</label>
              <input
                name={`branch${i}Base`}
                defaultValue={branch?.base ?? ""}
                required
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
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? The About page's org chart will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the About page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
