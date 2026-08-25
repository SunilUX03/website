import { getPayloadClient } from "@/lib/payload-client";
import { NavContentForm } from "./NavContentForm";
import { updateNavContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

function rows(arr: { id?: string | null; label: string; href: string }[] | null | undefined) {
  return (arr ?? []).map((r) => ({ id: r.id ?? undefined, label: r.label, href: r.href }));
}

export default async function NavSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "nav-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Header Navigation</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the top of every page.</p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/nav" current={locale} />

      <NavContentForm
        key={locale}
        action={updateNavContent}
        locale={locale}
        values={{
          govLabel: doc.govLabel,
          about: rows(doc.about),
          services: rows(doc.services),
          notificationsUpdates: rows(doc.notificationsUpdates),
          notificationsDocuments: rows(doc.notificationsDocuments),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
