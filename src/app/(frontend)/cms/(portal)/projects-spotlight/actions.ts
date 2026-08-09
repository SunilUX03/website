"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str, optionalStr, parseRepeatable } from "@/lib/portal/form-utils";

async function buildData(formData: FormData, existingImageId: number | undefined) {
  const name = str(formData, "name");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, name);
  const statsRows = parseRepeatable(formData, "stats", ["value", "suffix", "label"]);
  const ctasRows = parseRepeatable(formData, "ctas", ["label", "href"]);
  return {
    name,
    description: str(formData, "description"),
    image: imageId ?? existingImageId,
    badge: optionalStr(formData, "badge"),
    stats: statsRows.map((r) => ({ value: Number(r.value || "0"), suffix: r.suffix, label: r.label })),
    ctas: ctasRows.map((r) => ({ label: r.label, href: r.href })),
    order: Number(str(formData, "order") || "0"),
  };
}

export async function createProjectSpotlight(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, undefined);
  const publish = formData.get("intent") === "publish";

  if (!data.image) {
    redirect(`/cms/projects-spotlight/new?error=${encodeURIComponent("An image is required.")}`);
  }

  const doc = publish
    ? await payload.create({ collection: "projects-spotlight", data: { ...data, image: data.image!, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "projects-spotlight", data: { ...data, image: data.image!, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Projects Spotlight", `Created "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/projects-spotlight/${doc.id}/edit`);
}

export async function updateProjectSpotlight(id: number, existingImageId: number | undefined, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, existingImageId);
  const intent = formData.get("intent");

  if (!data.image) {
    redirect(`/cms/projects-spotlight/${id}/edit?error=${encodeURIComponent("An image is required.")}`);
  }

  const finalData = { ...data, image: data.image! };

  if (intent === "publish") {
    await payload.update({ collection: "projects-spotlight", id, data: { ...finalData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "projects-spotlight", id, data: { ...finalData, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "projects-spotlight", id, data: finalData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Projects Spotlight", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/projects-spotlight/${id}/edit`);
}

export async function deleteProjectSpotlight(id: number, name: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "projects-spotlight", id, overrideAccess: true });
  await logActivity(user, "deleted", "Projects Spotlight", `Deleted "${name}"`);
  revalidatePath("/", "layout");
  redirect("/cms/projects-spotlight");
}
