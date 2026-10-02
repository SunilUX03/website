"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { textToLexical } from "@/lib/portal/lexical";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

/** Documents rows aren't plain-text like facts/links — each one also
 * carries a file upload, so they can't go through parseRepeatable. A row
 * is kept only if it ends up with an actual file attached (a fresh
 * upload, or — on edit — the id of whatever was already there); a row
 * with a label but no file either way is silently dropped rather than
 * saved broken, since Payload requires `file` on this field. */
async function parseDocumentRows(formData: FormData, existingDocuments: { id: string; file?: number }[]) {
  const existingById = new Map(existingDocuments.map((d) => [d.id, d.file]));
  const rows: { id?: string; label: string; file: number }[] = [];
  for (let i = 0; ; i++) {
    const labelKey = `documents.${i}.label`;
    const fileKey = `documents.${i}.file`;
    if (!formData.has(labelKey) && !formData.has(fileKey)) break;

    const id = String(formData.get(`documents.${i}.id`) ?? "") || undefined;
    const label = String(formData.get(labelKey) ?? "").trim();
    const file = formData.get(fileKey) as File | null;
    const newFileId = await uploadFile("documents", file, label || "Announcement document");
    const fileId = newFileId ?? (id ? existingById.get(id) : undefined);

    if (fileId) rows.push({ ...(id ? { id } : {}), label, file: fileId });
  }
  return rows;
}

async function buildData(formData: FormData, existingDocuments: { id: string; file?: number }[] = []) {
  const heading = str(formData, "heading");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, heading);
  const imageValue = resolveUploadValue(formData, "image", imageId);
  const bodyText = str(formData, "body");

  // Kept as full row objects (not collapsed to plain strings) so each
  // row's `id` survives into the Payload data below — losing it makes
  // Payload treat the row as brand new and wipes that field's Tamil
  // translation on save. See RepeatableRows.tsx for the full explanation.
  const factsRows = parseRepeatable(formData, "facts", ["label", "value"]);
  const linksRows = parseRepeatable(formData, "links", ["label", "href"]);
  const documentsRows = await parseDocumentRows(formData, existingDocuments);

  return {
    heading,
    // Auto-derived from `heading` by the collection's beforeValidate hook
    // — this satisfies the generated type's required `slug` field without
    // ever actually being used verbatim (an empty string is falsy, so the
    // hook always recomputes it from the heading instead).
    slug: "",
    date: str(formData, "date"),
    description: str(formData, "description"),
    category: optionalStr(formData, "category"),
    ...(imageValue !== undefined ? { image: imageValue } : {}),
    ...(bodyText ? { body: textToLexical(bodyText) } : {}),
    facts: factsRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), label: r.label, value: r.value })),
    links: linksRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), label: r.label, href: r.href })),
    documents: documentsRows,
    tickerFeatured: formData.get("tickerFeatured") === "on",
    tickerOrder: Number(str(formData, "tickerOrder") || "0"),
  };
}

export async function createAnnouncement(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  // New announcements land at the end of the list — reorder with drag
  // on /cms/announcements afterward if it should appear earlier.
  const { docs: existing } = await payload.find({
    collection: "announcements",
    sort: "-order",
    limit: 1,
    depth: 0,
    select: { order: true },
    overrideAccess: true,
  });
  const order = (existing[0]?.order ?? -1) + 1;

  const doc = publish
    ? await payload.create({
        collection: "announcements",
        data: { ...data, order, _status: "published" },
        draft: false,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "announcements",
        data: { ...data, order, _status: "draft" },
        draft: true,
        overrideAccess: true,
      });

  await logActivity(user, publish ? "published" : "created", "Announcements", `Created "${data.heading}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/announcements/${doc.id}/edit?saved=1`);
}

export async function updateAnnouncement(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "announcements", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/announcements/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  const existingDocuments = (current.documents ?? []).map((d) => ({
    id: d.id ?? "",
    file: typeof d.file === "number" ? d.file : d.file?.id,
  }));
  const data = await buildData(formData, existingDocuments);

  if (intent === "publish") {
    await payload.update({ collection: "announcements", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "announcements", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "announcements", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Announcements", `${action === "updated" ? "Updated" : action === "published" ? "Published" : "Unpublished"} "${data.heading}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/announcements/${id}/edit?locale=${locale}&saved=1`);
}

export async function deleteAnnouncement(id: number, heading: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "announcements", id, overrideAccess: true });
  await logActivity(user, "deleted", "Announcements", `Deleted "${heading}"`);
  revalidatePath("/", "layout");
  redirect("/cms/announcements");
}

// `orderedIds` is the full list's ids in the admin's new drag order —
// every doc's `order` becomes its index in that list.
export async function reorderAnnouncements(orderedIds: number[]) {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "announcements",
    limit: 200,
    depth: 0,
    select: { _status: true },
    draft: true,
    overrideAccess: true,
  });
  const statusById = new Map(docs.map((d) => [d.id, d._status]));

  await Promise.all(
    orderedIds.map((id, order) =>
      statusById.get(id) === "draft"
        ? payload.update({ collection: "announcements", id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "announcements", id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/cms/announcements");
}

// Bulk-marks announcements as ticker-featured, appending them after any
// currently-featured items (by tickerOrder) — used by the "Add to
// homepage" picker on the announcements list page.
export async function addAnnouncementsToTicker(ids: number[]) {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs: featured } = await payload.find({
    collection: "announcements",
    where: { tickerFeatured: { equals: true } },
    sort: "-tickerOrder",
    limit: 1,
    depth: 0,
    select: { tickerOrder: true },
    draft: true,
    overrideAccess: true,
  });
  let nextOrder = (featured[0]?.tickerOrder ?? -1) + 1;

  for (const id of ids) {
    const doc = await payload.findByID({ collection: "announcements", id, depth: 0, draft: true, overrideAccess: true });
    const data = { tickerFeatured: true, tickerOrder: nextOrder };
    if (doc._status === "draft") {
      await payload.update({ collection: "announcements", id, data, draft: true, overrideAccess: true });
    } else {
      await payload.update({ collection: "announcements", id, data, overrideAccess: true });
    }
    nextOrder += 1;
  }

  revalidatePath("/", "layout");
  revalidatePath("/cms/announcements");
}

// `orderedIds` is the ticker-featured list's ids in the admin's new drag
// order — every doc's `tickerOrder` becomes its index in that list.
export async function reorderTickerAnnouncements(orderedIds: number[]) {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "announcements",
    limit: 200,
    depth: 0,
    select: { _status: true },
    draft: true,
    overrideAccess: true,
  });
  const statusById = new Map(docs.map((d) => [d.id, d._status]));

  await Promise.all(
    orderedIds.map((id, tickerOrder) =>
      statusById.get(id) === "draft"
        ? payload.update({ collection: "announcements", id, data: { tickerOrder }, draft: true, overrideAccess: true })
        : payload.update({ collection: "announcements", id, data: { tickerOrder }, overrideAccess: true })
    )
  );
  revalidatePath("/", "layout");
  revalidatePath("/cms/announcements");
}

// Removes an announcement from the homepage ticker (doesn't touch its
// publish status — only unfeatures it).
export async function removeAnnouncementFromTicker(id: number) {
  await requireSession();
  const payload = await getPayloadClient();
  const doc = await payload.findByID({ collection: "announcements", id, depth: 0, draft: true, overrideAccess: true });
  const data = { tickerFeatured: false };
  if (doc._status === "draft") {
    await payload.update({ collection: "announcements", id, data, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "announcements", id, data, overrideAccess: true });
  }
  revalidatePath("/", "layout");
  revalidatePath("/cms/announcements");
}
