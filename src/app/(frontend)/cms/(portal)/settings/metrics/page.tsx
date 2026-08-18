import { getPayloadClient } from "@/lib/payload-client";
import { MetricsForm } from "./MetricsForm";
import { updateMetrics } from "./actions";

export const dynamic = "force-dynamic";

export default async function MetricsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
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
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <MetricsForm
        action={updateMetrics}
        values={{
          metrics: Array.from({ length: 6 }, (_, i) => ({
            label: metrics[i]?.label ?? "",
            value: metrics[i]?.value ?? "",
            decimals: metrics[i]?.decimals ?? "",
            prefix: metrics[i]?.prefix ?? "",
            suffix: metrics[i]?.suffix ?? "",
          })),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
