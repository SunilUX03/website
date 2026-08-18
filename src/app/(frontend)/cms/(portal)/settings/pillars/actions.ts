"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildPillar(formData: FormData, i: number, existingImageId: number | undefined) {
  const title = str(formData, `pillar${i}Title`);
  const imageFile = formData.get(`pillar${i}BannerImage`) as File | null;
  const imageId = await uploadFile("media", imageFile, title);
  return {
    title,
    description: str(formData, `pillar${i}Description`),
    linkLabel: str(formData, `pillar${i}LinkLabel`),
    bannerImage: imageId ?? existingImageId,
  };
}

async function buildData(formData: FormData, existingImageIds: (number | undefined)[]) {
  return {
    pillars: [
      await buildPillar(formData, 0, existingImageIds[0]),
      await buildPillar(formData, 1, existingImageIds[1]),
      await buildPillar(formData, 2, existingImageIds[2]),
    ],
  };
}

export async function updatePillars(existingImageIds: (number | undefined)[], formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, existingImageIds);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "pillars-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "pillars-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "pillars-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Pillar Cards", `${action} the pillar cards`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/pillars?saved=1");
}
