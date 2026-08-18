"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const name = str(formData, "name");
  const photoFile = formData.get("photo") as File | null;
  const photoId = await uploadFile("media", photoFile, name);
  return {
    name,
    designation: str(formData, "designation"),
    subject: optionalStr(formData, "subject"),
    order: Number(str(formData, "order") || "0"),
    ...(photoId ? { photo: photoId } : {}),
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

  if (intent === "publish") {
    await payload.update({ collection: "team-members", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "team-members", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "team-members", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Team Members", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/team-members/${id}/edit?saved=1`);
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
