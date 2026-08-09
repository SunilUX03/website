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
    category: str(formData, "category"),
    ...(fileId ? { file: fileId } : {}),
  };
}

export async function createPolicy(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  if (!data.file) {
    redirect(`/cms/policies/new?error=${encodeURIComponent("A PDF file is required.")}`);
  }
  const { file, ...rest } = data;

  const doc = publish
    ? await payload.create({ collection: "policies", data: { ...rest, file, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "policies", data: { ...rest, file, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Policies & Guidelines", `Created "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/policies/${doc.id}/edit`);
}

export async function updatePolicy(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "policies", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "policies", id, data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "policies", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Policies & Guidelines", `${action} "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/policies/${id}/edit`);
}

export async function deletePolicy(id: number, title: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "policies", id, overrideAccess: true });
  await logActivity(user, "deleted", "Policies & Guidelines", `Deleted "${title}"`);
  revalidatePath("/", "layout");
  redirect("/cms/policies");
}
