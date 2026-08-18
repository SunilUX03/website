import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { LegalPageForm } from "../../LegalPageForm";
import { updateLegalPage } from "../../actions";

export default async function EditLegalPagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "legal-pages", id: Number(id), draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateLegalPage.bind(null, doc.id);

  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">Edit: {doc.title}</h1>

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LegalPageForm
        action={boundUpdate}
        values={{
          slug: doc.slug,
          title: doc.title,
          eyebrow: doc.eyebrow ?? "Legal",
          intro: doc.intro ?? "",
          sections: doc.sections?.map((s) => ({ heading: s.heading, body: s.body })) ?? [],
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
