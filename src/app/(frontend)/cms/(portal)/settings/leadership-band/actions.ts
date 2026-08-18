"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildLeader(formData: FormData, index: number, existingPhotoId: number | undefined) {
  const name = str(formData, `leader${index}Name`);
  const photoFile = formData.get(`leader${index}Photo`) as File | null;
  const photoId = await uploadFile("media", photoFile, name);
  return {
    name,
    title: str(formData, `leader${index}Title`),
    photo: photoId ?? existingPhotoId,
    photoPosition: str(formData, `leader${index}PhotoPosition`) || "50% 50%",
  };
}

async function buildData(formData: FormData, existingPhotoIds: [number | undefined, number | undefined]) {
  return {
    description: str(formData, "description"),
    leaders: [
      await buildLeader(formData, 1, existingPhotoIds[0]),
      await buildLeader(formData, 2, existingPhotoIds[1]),
    ],
  };
}

export async function updateLeadershipBand(existingPhotoIds: [number | undefined, number | undefined], formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData, existingPhotoIds);
  const intent = formData.get("intent");

  if (!data.leaders[0].photo || !data.leaders[1].photo) {
    redirect(`/cms/settings/leadership-band?error=${encodeURIComponent("Both leaders need a photo.")}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "leadership-band-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "leadership-band-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "leadership-band-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Leadership Band", `${action} the homepage leadership band`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/leadership-band?saved=1");
}
