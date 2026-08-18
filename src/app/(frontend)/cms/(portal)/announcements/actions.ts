"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { textToLexical } from "@/lib/portal/lexical";
import { uploadFile } from "@/lib/portal/upload";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const heading = str(formData, "heading");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, heading);
  const bodyText = str(formData, "body");

  return {
    heading,
    // Auto-derived from `heading` by the collection's beforeValidate hook
    // — this satisfies the generated type's required `slug` field without
    // ever actually being used verbatim (an empty string is falsy, so the
    // hook always recomputes it from the heading instead).
    slug: "",
    date: str(formData, "date"),
    description: str(formData, "description"),
    category: optionalStr(formData, "category"),
    ...(imageId ? { image: imageId } : {}),
    ...(bodyText ? { body: textToLexical(bodyText) } : {}),
    facts: parseRepeatable(formData, "facts", ["label", "value"]) as { label: string; value: string }[],
    links: parseRepeatable(formData, "links", ["label", "href"]) as { label: string; href: string }[],
    tickerFeatured: formData.get("tickerFeatured") === "on",
    tickerOrder: Number(str(formData, "tickerOrder") || "0"),
  };
}

export async function createAnnouncement(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({
        collection: "announcements",
        data: { ...data, _status: "published" },
        draft: false,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "announcements",
        data: { ...data, _status: "draft" },
        draft: true,
        overrideAccess: true,
      });

  await logActivity(user, publish ? "published" : "created", "Announcements", `Created "${data.heading}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/announcements/${doc.id}/edit?saved=1`);
}

export async function updateAnnouncement(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "announcements", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "announcements", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "announcements", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Announcements", `${action === "updated" ? "Updated" : action === "published" ? "Published" : "Unpublished"} "${data.heading}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/announcements/${id}/edit?saved=1`);
}

export async function deleteAnnouncement(id: number, heading: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "announcements", id, overrideAccess: true });
  await logActivity(user, "deleted", "Announcements", `Deleted "${heading}"`);
  revalidatePath("/", "layout");
  redirect("/cms/announcements");
}
