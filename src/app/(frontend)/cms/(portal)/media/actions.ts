"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

async function buildData(formData: FormData) {
  const caption = str(formData, "caption");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, caption);
  const imageValue = resolveUploadValue(formData, "image", imageId);

  return {
    type: (str(formData, "type") || "photo") as "photo" | "video",
    caption,
    altText: optionalStr(formData, "altText"),
    date: str(formData, "date"),
    ...(imageValue !== undefined ? { image: imageValue } : {}),
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
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "media-items", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/media/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "media-items", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "media-items", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "media-items", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Media & Press", `${action} "${data.caption}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/media/${id}/edit?locale=${locale}&saved=1`);
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
