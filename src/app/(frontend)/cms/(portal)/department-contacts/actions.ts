"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    department: str(formData, "department"),
    contact: str(formData, "contact"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    order: Number(str(formData, "order") || "0"),
  };
}

export async function createDepartmentContact(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "department-contacts", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "department-contacts", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Department Contacts", `Created "${data.department}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/department-contacts/${doc.id}/edit?saved=1`);
}

export async function updateDepartmentContact(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "department-contacts", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "department-contacts", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "department-contacts", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Department Contacts", `${action} "${data.department}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/department-contacts/${id}/edit?saved=1`);
}

export async function deleteDepartmentContact(id: number, department: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "department-contacts", id, overrideAccess: true });
  await logActivity(user, "deleted", "Department Contacts", `Deleted "${department}"`);
  revalidatePath("/", "layout");
  redirect("/cms/department-contacts");
}
