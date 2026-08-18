"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const text = str(formData, "text");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, text.slice(0, 60) || "Social post image");

  return {
    platform: str(formData, "platform") as "facebook" | "instagram" | "x" | "youtube" | "linkedin",
    text,
    date: str(formData, "date"),
    link: optionalStr(formData, "link"),
    // Omitted (not set to null) when no new file was picked — preserves
    // whatever image was already attached instead of clearing it.
    ...(imageId ? { image: imageId } : {}),
  };
}

export async function createSocialPost(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "social-posts", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "social-posts", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Social Media", `Created a ${data.platform} post`);
  revalidatePath("/", "layout");
  redirect(`/cms/social-media/${doc.id}/edit?saved=1`);
}

export async function updateSocialPost(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "social-posts", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "social-posts", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "social-posts", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Social Media", `${action} a ${data.platform} post`);
  revalidatePath("/", "layout");
  redirect(`/cms/social-media/${id}/edit?saved=1`);
}

export async function deleteSocialPost(id: number, platform: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "social-posts", id, overrideAccess: true });
  await logActivity(user, "deleted", "Social Media", `Deleted a ${platform} post`);
  revalidatePath("/", "layout");
  redirect("/cms/social-media");
}
