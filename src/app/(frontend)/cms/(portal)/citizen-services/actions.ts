"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

async function buildData(formData: FormData, existingImageId: number | undefined) {
  const name = str(formData, "name");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, name);
  const imageValue = resolveUploadValue(formData, "image", imageId);
  return {
    name,
    description: str(formData, "description"),
    buttonLabel: optionalStr(formData, "buttonLabel"),
    buttonHref: str(formData, "buttonHref"),
    externalLink: formData.get("externalLink") === "on",
    image: imageValue !== undefined ? imageValue : existingImageId,
  };
}

export async function createCitizenService(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, undefined);
  const publish = formData.get("intent") === "publish";

  if (!data.image) {
    redirect(`/cms/citizen-services/new?error=${encodeURIComponent("An image is required.")}`);
  }

  const { docs: existing } = await payload.find({
    collection: "citizen-services",
    sort: "-order",
    limit: 1,
    depth: 0,
    select: { order: true },
    overrideAccess: true,
  });
  const order = (existing[0]?.order ?? -1) + 1;

  const doc = publish
    ? await payload.create({ collection: "citizen-services", data: { ...data, image: data.image!, order, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "citizen-services", data: { ...data, image: data.image!, order, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Citizen Services", `Created "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/citizen-services/${doc.id}/edit?saved=1`);
}

export async function updateCitizenService(id: number, existingImageId: number | undefined, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, existingImageId);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "citizen-services", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/citizen-services/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (!data.image) {
    redirect(`/cms/citizen-services/${id}/edit?error=${encodeURIComponent("An image is required.")}`);
  }

  const finalData = { ...data, image: data.image! };

  if (intent === "publish") {
    await payload.update({ collection: "citizen-services", id, locale, data: { ...finalData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "citizen-services", id, locale, data: { ...finalData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "citizen-services", id, locale, data: finalData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Citizen Services", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/citizen-services/${id}/edit?locale=${locale}&saved=1`);
}

export async function deleteCitizenService(id: number, name: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "citizen-services", id, overrideAccess: true });
  await logActivity(user, "deleted", "Citizen Services", `Deleted "${name}"`);
  revalidatePath("/", "layout");
  redirect("/cms/citizen-services");
}

export async function moveCitizenService(id: number, direction: "up" | "down") {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "citizen-services",
    sort: "order",
    limit: 200,
    depth: 0,
    select: { order: true, _status: true },
    draft: true,
    overrideAccess: true,
  });

  const index = docs.findIndex((d) => d.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= docs.length) {
    revalidatePath("/", "layout");
    redirect("/cms/citizen-services");
  }

  const current = docs[index];
  const neighbor = docs[swapIndex];

  await Promise.all(
    [
      [current, neighbor.order] as const,
      [neighbor, current.order] as const,
    ].map(([doc, order]) =>
      doc._status === "draft"
        ? payload.update({ collection: "citizen-services", id: doc.id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "citizen-services", id: doc.id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  redirect("/cms/citizen-services");
}
