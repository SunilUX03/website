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
  const text = str(formData, "text");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, text.slice(0, 60) || "Social post image");
  const imageValue = resolveUploadValue(formData, "image", imageId);

  return {
    platform: str(formData, "platform") as "facebook" | "instagram" | "x" | "youtube" | "linkedin",
    text,
    date: str(formData, "date"),
    link: optionalStr(formData, "link"),
    // Omitted (not set to null) when no new file was picked and it wasn't
    // explicitly removed — preserves whatever image was already attached.
    ...(imageValue !== undefined ? { image: imageValue } : {}),
  };
}

export async function createSocialPost(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  // New posts land at the end of the list — reorder with drag on
  // /cms/social-media afterward if it should appear earlier.
  const { docs: existing } = await payload.find({
    collection: "social-posts",
    sort: "-order",
    limit: 1,
    depth: 0,
    select: { order: true },
    overrideAccess: true,
  });
  const order = (existing[0]?.order ?? -1) + 1;

  const doc = publish
    ? await payload.create({ collection: "social-posts", data: { ...data, order, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "social-posts", data: { ...data, order, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Social Media", `Created a ${data.platform} post`);
  revalidatePath("/", "layout");
  redirect(`/cms/social-media/${doc.id}/edit?saved=1`);
}

export async function updateSocialPost(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "social-posts", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/social-media/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "social-posts", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "social-posts", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "social-posts", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Social Media", `${action} a ${data.platform} post`);
  revalidatePath("/", "layout");
  redirect(`/cms/social-media/${id}/edit?locale=${locale}&saved=1`);
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

// `orderedIds` is the full list's ids in the admin's new drag order —
// every doc's `order` becomes its index in that list.
export async function reorderSocialPosts(orderedIds: number[]) {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "social-posts",
    limit: 200,
    depth: 0,
    select: { _status: true },
    draft: true,
    overrideAccess: true,
  });
  const statusById = new Map(docs.map((d) => [d.id, d._status]));

  await Promise.all(
    orderedIds.map((id, order) =>
      statusById.get(id) === "draft"
        ? payload.update({ collection: "social-posts", id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "social-posts", id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/cms/social-media");
}
