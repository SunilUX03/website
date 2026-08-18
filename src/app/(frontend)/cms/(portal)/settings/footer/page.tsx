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
  const doc = await payload.findGlobal({ slug: "footer-content", draft: true, overrideAccess: true });

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
          address: doc.address,
          phone: doc.phone,
          email: doc.email,
          socialLinks: doc.socialLinks ?? [],
          quickLinks: doc.quickLinks ?? [],
          citizenServices: doc.citizenServices ?? [],
          helpSupport: doc.helpSupport ?? [],
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
