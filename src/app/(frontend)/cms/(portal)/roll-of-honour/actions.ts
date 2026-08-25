"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

function buildData(formData: FormData) {
  return {
    designation: str(formData, "designation"),
    name: optionalStr(formData, "name"),
    range: optionalStr(formData, "range"),
    order: Number(str(formData, "order") || "0"),
  };
}

export async function createRollOfHonourEntry(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "roll-of-honour", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "roll-of-honour", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Roll of Honour", `Created "${data.designation}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/roll-of-honour/${doc.id}/edit?saved=1`);
}

export async function updateRollOfHonourEntry(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "roll-of-honour", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/roll-of-honour/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "roll-of-honour", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "roll-of-honour", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "roll-of-honour", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Roll of Honour", `${action} "${data.designation}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/roll-of-honour/${id}/edit?locale=${locale}&saved=1`);
}

export async function deleteRollOfHonourEntry(id: number, designation: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "roll-of-honour", id, overrideAccess: true });
  await logActivity(user, "deleted", "Roll of Honour", `Deleted "${designation}"`);
  revalidatePath("/", "layout");
  redirect("/cms/roll-of-honour");
}
