import { getPayloadClient } from "@/lib/payload-client";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { updateMetrics } from "./actions";

export const dynamic = "force-dynamic";

export default async function MetricsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "metrics-content", draft: true, overrideAccess: true });
  const metrics = doc.metrics ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Homepage Metrics</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The 6 stat cards on the homepage and About page. Always exactly 6 cards.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <form action={updateMetrics} className="flex max-w-[680px] flex-col gap-6">
        {Array.from({ length: 6 }, (_, i) => metrics[i]).map((metric, i) => (
          <section key={i} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-card p-5">
            <p className="type-caption-uppercase text-[var(--color-muted)]">Metric {i + 1}</p>
            <div>
              <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Label</label>
              <input
                name={`metric${i}Label`}
                defaultValue={metric?.label ?? ""}
                required
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Value</label>
                <input
                  type="number"
                  step="any"
                  name={`metric${i}Value`}
                  defaultValue={metric?.value}
                  required
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Decimals</label>
                <input
                  type="number"
                  name={`metric${i}Decimals`}
                  defaultValue={metric?.decimals ?? ""}
                  placeholder="0"
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Prefix</label>
                <input
                  name={`metric${i}Prefix`}
                  defaultValue={metric?.prefix ?? ""}
                  placeholder="₹"
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
              <div>
                <label className="type-caption-uppercase mb-1.5 block text-[var(--color-muted)]">Suffix</label>
                <input
                  name={`metric${i}Suffix`}
                  defaultValue={metric?.suffix ?? ""}
                  placeholder="+ Cr"
                  className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
                />
              </div>
            </div>
          </section>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" name="intent" value="draft" className="type-button btn-outline">
            Save draft
          </button>
          {doc._status === "published" ? (
            <ConfirmSubmitButton name="intent" value="unpublish" confirmMessage="Unpublish? These metrics will revert to whatever was last published." className="type-button btn-outline">
              Unpublish
            </ConfirmSubmitButton>
          ) : null}
          <ConfirmSubmitButton name="intent" value="publish" confirmMessage="Publish? This changes the homepage and About page immediately." className="type-button btn-primary">
            Publish
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
