import { getPayloadClient } from "@/lib/payload-client";
import { OrgChartForm } from "./OrgChartForm";
import { updateOrgChart } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";

export const dynamic = "force-dynamic";

export default async function OrgChartSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "org-chart-content", locale, draft: true, overrideAccess: true });
  const branches = doc.branches ?? [];

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Organisation Structure</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">
        The chart always has 1 top box and 7 divisions — you can&apos;t add or remove divisions here, only their titles and staff lists.
      </p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/org-chart" current={locale} />

      <OrgChartForm
        key={locale}
        action={updateOrgChart}
        locale={locale}
        values={{
          topLabel: doc.topLabel,
          jceoLabel: doc.jceoLabel,
          branches: Array.from({ length: 7 }, (_, i) => ({
            title: branches[i]?.title ?? "",
            subtitle: branches[i]?.subtitle ?? "",
            nodes: branches[i]?.nodes?.map((n) => ({ id: n.id ?? undefined, label: n.label, sublabel: n.sublabel ?? "", muted: n.muted ?? false })) ?? [],
          })),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
