import { getPayloadClient } from "@/lib/payload-client";
import { OrgChartForm } from "./OrgChartForm";
import { updateOrgChart } from "./actions";

export const dynamic = "force-dynamic";

export default async function OrgChartSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
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
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <OrgChartForm
        action={updateOrgChart}
        values={{
          topPrimary: doc.topPrimary,
          topSecondary: doc.topSecondary,
          branches: Array.from({ length: 6 }, (_, i) => ({
            director: branches[i]?.director ?? "",
            engineer: branches[i]?.engineer ?? "",
            manager: branches[i]?.manager ?? "",
            base: branches[i]?.base ?? "",
          })),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
