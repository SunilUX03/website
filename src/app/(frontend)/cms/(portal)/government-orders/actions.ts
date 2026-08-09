"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const title = str(formData, "title");
  const fileInput = formData.get("file") as File | null;
  const fileId = await uploadFile("documents", fileInput, title);
  return {
    title,
    year: str(formData, "year"),
    department: str(formData, "department"),
    ...(fileId ? { file: fileId } : {}),
  };
}

export async function createGovernmentOrder(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  if (!data.file) {
    redirect(`/cms/government-orders/new?error=${encodeURIComponent("A PDF file is required.")}`);
  }
  const { file, ...rest } = data;

  const doc = publish
    ? await payload.create({ collection: "government-orders", data: { ...rest, file, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "government-orders", data: { ...rest, file, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Government Orders", `Created "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/government-orders/${doc.id}/edit`);
}

export async function updateGovernmentOrder(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "government-orders", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "government-orders", id, data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "government-orders", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Government Orders", `${action} "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/government-orders/${id}/edit`);
}

export async function deleteGovernmentOrder(id: number, title: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "government-orders", id, overrideAccess: true });
  await logActivity(user, "deleted", "Government Orders", `Deleted "${title}"`);
  revalidatePath("/", "layout");
  redirect("/cms/government-orders");
}
