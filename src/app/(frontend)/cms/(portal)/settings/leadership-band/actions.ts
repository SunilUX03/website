"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Each leader's own row `id` (threaded via a hidden `leader${index}Id`
// input — see LeadershipBandForm.tsx) must round-trip back into the
// update data. Payload's localized array fields (`title` here — `name`
// is deliberately NOT localized) key each row's per-locale text off that
// row's own id — submitting a row without its id makes Payload treat it
// as brand new and silently wipes that row's OTHER locale's `title`.
async function buildLeader(formData: FormData, index: number, existingPhotoId: number | undefined) {
  const name = str(formData, `leader${index}Name`);
  const photoFile = formData.get(`leader${index}Photo`) as File | null;
  const photoId = await uploadFile("media", photoFile, name);
  const photoValue = resolveUploadValue(formData, `leader${index}Photo`, photoId);
  const rowId = optionalStr(formData, `leader${index}Id`);
  return {
    ...(rowId ? { id: rowId } : {}),
    name,
    title: str(formData, `leader${index}Title`),
    photo: photoValue !== undefined ? photoValue : existingPhotoId,
    photoPosition: str(formData, `leader${index}PhotoPosition`) || "50% 50%",
  };
}

async function buildData(formData: FormData, existingPhotoIds: [number | undefined, number | undefined]) {
  return {
    heading: str(formData, "heading"),
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
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "leadership-band-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/leadership-band?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (!data.leaders[0].photo || !data.leaders[1].photo) {
    redirect(`/cms/settings/leadership-band?locale=${locale}&error=${encodeURIComponent("Both leaders need a photo.")}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "leadership-band-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "leadership-band-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "leadership-band-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Leadership Band", `${action} the homepage leadership band`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/leadership-band?locale=${locale}&saved=1`);
}
