import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { TeamMemberForm } from "../../TeamMemberForm";
import { updateTeamMember, deleteTeamMember } from "../../actions";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import type { Media } from "@/payload-types";

export default async function EditTeamMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const user = await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload
    .findByID({ collection: "team-members", id: Number(id), depth: 1, draft: true, overrideAccess: true })
    .catch(() => null);
  if (!doc) notFound();

  const boundUpdate = updateTeamMember.bind(null, doc.id);
  const boundDelete = deleteTeamMember.bind(null, doc.id, doc.name);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="type-display-sm text-ink">Edit team member</h1>
        {user.role === "admin" ? (
          <form action={boundDelete}>
            <ConfirmSubmitButton
              confirmMessage={`Delete "${doc.name}"? This can't be undone.`}
              className="type-caption font-semibold text-[var(--color-error)] hover:underline"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      {saved ? (
        <p className="type-body-sm mb-6 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <TeamMemberForm
        action={boundUpdate}
        values={{
          name: doc.name,
          designation: doc.designation,
          subject: doc.subject ?? "",
          order: doc.order,
          photoUrl: typeof doc.photo === "object" && doc.photo ? (doc.photo as Media).url ?? undefined : undefined,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
