"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    role: str(formData, "role"),
    type: str(formData, "type") || "Contract",
    department: str(formData, "department"),
    deadline: str(formData, "deadline"),
    jdHref: optionalStr(formData, "jdHref"),
  };
}

export async function createJobOpening(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "job-openings", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "job-openings", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Job Openings", `Created "${data.role}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/job-openings/${doc.id}/edit`);
}

export async function updateJobOpening(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "job-openings", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "job-openings", id, data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "job-openings", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Job Openings", `${action} "${data.role}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/job-openings/${id}/edit`);
}

export async function deleteJobOpening(id: number, role: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "job-openings", id, overrideAccess: true });
  await logActivity(user, "deleted", "Job Openings", `Deleted "${role}"`);
  revalidatePath("/", "layout");
  redirect("/cms/job-openings");
}
