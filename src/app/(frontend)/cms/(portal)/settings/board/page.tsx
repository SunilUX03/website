import { getPayloadClient } from "@/lib/payload-client";
import { BoardContentForm } from "./BoardContentForm";
import { updateBoardContent } from "./actions";
import { LocaleTabs } from "@/components/portal/LocaleTabs";
import type { Locale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function BoardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; locale?: string }>;
}) {
  const { error, saved, locale: localeParam } = await searchParams;
  const locale: Locale = localeParam === "ta" ? "ta" : "en";
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "board-content", locale, draft: true, overrideAccess: true });

  const memberRows = (doc.members ?? []).map((m) => ({
    id: m.id ?? undefined,
    name: m.name,
    title: m.title ?? "",
    isPlaceholder: m.isPlaceholder ? "true" : "false",
  }));

  return (
    <div>
      <h1 className="type-display-sm mb-1 text-ink">Governing Board</h1>
      <p className="type-body-sm mb-6 text-[var(--color-muted)]">Shown on the About page.</p>

      {error ? (
        <p className="type-body-sm mb-4 max-w-[680px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="type-body-sm mb-6 max-w-[680px] rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-[#15803d]">Saved.</p>
      ) : null}

      <LocaleTabs basePath="/cms/settings/board" current={locale} />

      <BoardContentForm
        key={locale}
        action={updateBoardContent}
        locale={locale}
        values={{
          chairmanRole: doc.chairman?.role ?? "Chairman",
          chairmanName: doc.chairman?.name ?? "",
          chairmanTitle: doc.chairman?.title ?? "",
          memberSecretaryRole: doc.memberSecretary?.role ?? "Member Secretary",
          memberSecretaryName: doc.memberSecretary?.name ?? "",
          memberSecretaryTitle: doc.memberSecretary?.title ?? "",
          members: memberRows,
          status: doc._status as "draft" | "published",
          updatedAt: doc.updatedAt ?? undefined,
        }}
      />
    </div>
  );
}
