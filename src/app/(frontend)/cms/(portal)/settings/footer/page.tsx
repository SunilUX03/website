import { getPayloadClient } from "@/lib/payload-client";
import { FooterContentForm } from "./FooterContentForm";
import { updateFooterContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function FooterSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const payload = await getPayloadClient();
  const [doc, docTa] = await Promise.all([
    payload.findGlobal({ slug: "footer-content", draft: true, overrideAccess: true }),
    payload.findGlobal({ slug: "footer-content", locale: "ta", draft: true, overrideAccess: true }),
  ]);

  const zip = <T extends { label: string; href: string }>(en: T[] | null | undefined, ta: T[] | null | undefined) =>
    (en ?? []).map((row, i) => ({ label: row.label, href: row.href, taLabel: ta?.[i]?.label ?? "" }));

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Footer</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown at the bottom of every page.</p>

      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <FooterContentForm
        action={updateFooterContent}
        values={{
          description: doc.description,
          descriptionTa: docTa.description ?? "",
          address: doc.address,
          addressTa: docTa.address ?? "",
          phone: doc.phone,
          email: doc.email,
          socialLinks: doc.socialLinks ?? [],
          quickLinks: zip(doc.quickLinks, docTa.quickLinks),
          citizenServices: zip(doc.citizenServices, docTa.citizenServices),
          helpSupport: zip(doc.helpSupport, docTa.helpSupport),
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
