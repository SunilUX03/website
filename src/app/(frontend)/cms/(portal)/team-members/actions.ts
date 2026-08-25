"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

async function buildData(formData: FormData) {
  const name = str(formData, "name");
  const photoFile = formData.get("photo") as File | null;
  const photoId = await uploadFile("media", photoFile, name);
  const photoValue = resolveUploadValue(formData, "photo", photoId);
  return {
    name,
    designation: str(formData, "designation"),
    subject: optionalStr(formData, "subject"),
    order: Number(str(formData, "order") || "0"),
    ...(photoValue !== undefined ? { photo: photoValue } : {}),
  };
}

export async function createTeamMember(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "team-members", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "team-members", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Team Members", `Created "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/team-members/${doc.id}/edit?saved=1`);
}

export async function updateTeamMember(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "team-members", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/team-members/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "team-members", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "team-members", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "team-members", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Team Members", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/team-members/${id}/edit?locale=${locale}&saved=1`);
}

export async function deleteTeamMember(id: number, name: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "team-members", id, overrideAccess: true });
  await logActivity(user, "deleted", "Team Members", `Deleted "${name}"`);
  revalidatePath("/", "layout");
  redirect("/cms/team-members");
}

export async function moveTeamMember(id: number, direction: "up" | "down") {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "team-members",
    sort: "order",
    limit: 200,
    depth: 0,
    select: { order: true, _status: true },
    draft: true,
    overrideAccess: true,
  });

  const index = docs.findIndex((d) => d.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= docs.length) {
    revalidatePath("/", "layout");
    redirect("/cms/team-members");
  }

  const current = docs[index];
  const neighbor = docs[swapIndex];

  await Promise.all(
    [
      [current, neighbor.order] as const,
      [neighbor, current.order] as const,
    ].map(([doc, order]) =>
      doc._status === "draft"
        ? payload.update({ collection: "team-members", id: doc.id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "team-members", id: doc.id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  redirect("/cms/team-members");
}
