"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";

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

  if (intent === "publish") {
    await payload.update({ collection: "roll-of-honour", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "roll-of-honour", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "roll-of-honour", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Roll of Honour", `${action} "${data.designation}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/roll-of-honour/${id}/edit?saved=1`);
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
