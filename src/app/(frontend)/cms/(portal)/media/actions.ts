"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const caption = str(formData, "caption");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, caption);

  return {
    type: (str(formData, "type") || "photo") as "photo" | "video",
    caption,
    altText: optionalStr(formData, "altText"),
    date: str(formData, "date"),
    ...(imageId ? { image: imageId } : {}),
  };
}

export async function createMediaItem(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  if (!data.image) {
    redirect(`/cms/media/new?error=${encodeURIComponent("A photo/thumbnail is required.")}`);
  }
  const { image, ...rest } = data;
  const createData = { ...rest, image };

  const doc = publish
    ? await payload.create({ collection: "media-items", data: { ...createData, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "media-items", data: { ...createData, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Media & Press", `Created "${data.caption}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/media/${doc.id}/edit?saved=1`);
}

export async function updateMediaItem(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "media-items", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "media-items", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "media-items", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Media & Press", `${action} "${data.caption}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/media/${id}/edit?saved=1`);
}

export async function deleteMediaItem(id: number, caption: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "media-items", id, overrideAccess: true });
  await logActivity(user, "deleted", "Media & Press", `Deleted "${caption}"`);
  revalidatePath("/", "layout");
  redirect("/cms/media");
}
