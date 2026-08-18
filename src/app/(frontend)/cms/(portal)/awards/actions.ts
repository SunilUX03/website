"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildData(formData: FormData, existingImageId: number | undefined) {
  const title = str(formData, "title");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, title);
  return {
    title,
    year: str(formData, "year"),
    description: str(formData, "description"),
    image: imageId ?? existingImageId,
  };
}

export async function createAward(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, undefined);
  const publish = formData.get("intent") === "publish";

  if (!data.image) {
    redirect(`/cms/awards/new?error=${encodeURIComponent("An image is required.")}`);
  }

  const doc = publish
    ? await payload.create({ collection: "awards", data: { ...data, image: data.image!, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "awards", data: { ...data, image: data.image!, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Awards", `Created "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/awards/${doc.id}/edit?saved=1`);
}

export async function updateAward(id: number, existingImageId: number | undefined, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, existingImageId);
  const intent = formData.get("intent");

  if (!data.image) {
    redirect(`/cms/awards/${id}/edit?error=${encodeURIComponent("An image is required.")}`);
  }

  const finalData = { ...data, image: data.image! };

  if (intent === "publish") {
    await payload.update({ collection: "awards", id, data: { ...finalData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "awards", id, data: { ...finalData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "awards", id, data: finalData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Awards", `${action} "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/awards/${id}/edit?saved=1`);
}

export async function deleteAward(id: number, title: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "awards", id, overrideAccess: true });
  await logActivity(user, "deleted", "Awards", `Deleted "${title}"`);
  revalidatePath("/", "layout");
  redirect("/cms/awards");
}
