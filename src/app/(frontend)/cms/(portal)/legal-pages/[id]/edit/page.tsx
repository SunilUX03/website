import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { LegalPageForm } from "../../LegalPageForm";
import { updateLegalPage } from "../../actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

// `id` on each mapped row is a Payload internal detail: the localized
// `sections` array stores its Tamil and English text keyed off the
// row's own id, not its position — a row resubmitted without that id
// gets treated as brand new, and Payload replaces the whole array
// wholesale, silently deleting the *other* locale's translation for
// every row. See ServiceForm.tsx / services/[id]/edit/page.tsx for the
// full explanation.
export default async function EditLegalPagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string; saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { locale: localeParam, saved, error } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "legal-pages", id: Number(id), locale, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateLegalPage.bind(null, doc.id);

  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">Edit: {doc.title}</h1>

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath={`/cms/legal-pages/${id}/edit`} current={locale} />

      <LegalPageForm
        key={locale}
        action={boundUpdate}
        locale={locale}
        error={error}
        values={{
          slug: doc.slug,
          title: doc.title,
          eyebrow: doc.eyebrow ?? "Legal",
          intro: doc.intro ?? "",
          sections: doc.sections?.map((s) => ({ id: s.id ?? undefined, heading: s.heading, body: s.body })) ?? [],
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
