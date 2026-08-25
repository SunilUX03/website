import { getPayloadClient } from "@/lib/payload-client";
import { MetricsForm } from "./MetricsForm";
import { updateMetrics } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function MetricsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "metrics-content", locale, draft: true, overrideAccess: true });
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

      <LocaleTabs basePath="/cms/settings/metrics" current={locale} />

      <MetricsForm
        key={locale}
        action={updateMetrics}
        locale={locale}
        values={{
          heading: doc.heading,
          metrics: Array.from({ length: 6 }, (_, i) => ({
            id: metrics[i]?.id ?? undefined,
            metric: metrics[i]?.metric ?? "",
            label: metrics[i]?.label ?? "",
          })),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
