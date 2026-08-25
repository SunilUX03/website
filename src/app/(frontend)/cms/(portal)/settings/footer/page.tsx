import { getPayloadClient } from "@/lib/payload-client";
import { FooterContentForm } from "./FooterContentForm";
import { updateFooterContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

function rows(arr: { id?: string | null; label: string; href: string }[] | null | undefined) {
  return (arr ?? []).map((r) => ({ id: r.id ?? undefined, label: r.label, href: r.href }));
}

export default async function FooterSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; locale?: string; error?: string }>;
}) {
  const { saved, locale: localeParam, error } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "footer-content", locale, draft: true, overrideAccess: true });

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Footer</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the bottom of every page.</p>

      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/footer" current={locale} />

      <FooterContentForm
        key={locale}
        action={updateFooterContent}
        locale={locale}
        error={error}
        values={{
          description: doc.description,
          address: doc.address,
          phone: doc.phone,
          email: doc.email,
          socialLinks: doc.socialLinks ?? [],
          quickLinks: rows(doc.quickLinks),
          citizenServices: rows(doc.citizenServices),
          initiativesProjects: rows(doc.initiativesProjects),
          helpSupport: rows(doc.helpSupport),
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
