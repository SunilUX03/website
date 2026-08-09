import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { lexicalToText } from "@/lib/portal/lexical";
import { AnnouncementForm } from "../../AnnouncementForm";
import { updateAnnouncement, deleteAnnouncement } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "announcements", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateAnnouncement.bind(null, doc.id);
  const boundDelete = deleteAnnouncement.bind(null, doc.id, doc.heading);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit announcement</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.heading}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <AnnouncementForm
        action={boundUpdate}
        values={{
          heading: doc.heading,
          date: doc.date?.slice(0, 10) ?? "",
          description: doc.description,
          category: doc.category ?? "",
          body: lexicalToText(doc.body),
          imageUrl: typeof doc.image === "object" && doc.image ? (doc.image as Media).url ?? undefined : undefined,
          facts: doc.facts?.map((f) => ({ label: f.label, value: f.value })) ?? [],
          links: doc.links?.map((l) => ({ label: l.label, href: l.href })) ?? [],
          tickerFeatured: doc.tickerFeatured ?? false,
          tickerOrder: doc.tickerOrder ?? 0,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
