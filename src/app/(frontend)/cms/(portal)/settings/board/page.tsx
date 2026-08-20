import { getPayloadClient } from "@/lib/payload-client";
import { BoardContentForm } from "./BoardContentForm";
import { updateBoardContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function BoardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "board-content", draft: true, overrideAccess: true });

  const memberRows = (doc.members ?? []).map((m) => ({
    name: m.name,
    title: m.title ?? "",
    isPlaceholder: m.isPlaceholder ? "true" : "false",
  }));

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Governing Board</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown on the About page.</p>

      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <BoardContentForm
        action={updateBoardContent}
        values={{
          chairmanRole: doc.chairman?.role ?? "Chairman",
          chairmanName: doc.chairman?.name ?? "",
          chairmanTitle: doc.chairman?.title ?? "",
          memberSecretaryRole: doc.memberSecretary?.role ?? "Member Secretary",
          memberSecretaryName: doc.memberSecretary?.name ?? "",
          memberSecretaryTitle: doc.memberSecretary?.title ?? "",
          members: memberRows,
          status: doc._status as "draft" | "published",
        }}
      />
    </div>
  );
}
