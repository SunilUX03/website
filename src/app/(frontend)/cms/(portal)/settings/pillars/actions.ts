"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Each pillar's own row `id` (threaded via a hidden `pillar${i}Id` input —
// see PillarsForm.tsx) must round-trip back into the update data. Payload's
// localized array fields (title/linkLabel here) key each row's per-locale
// text off that row's own id — submitting a row without its id makes
// Payload treat it as brand new and silently wipes that row's OTHER
// locale's text.
async function buildPillar(formData: FormData, i: number, existingImageId: number | undefined) {
  const title = str(formData, `pillar${i}Title`);
  const imageFile = formData.get(`pillar${i}BannerImage`) as File | null;
  const imageId = await uploadFile("media", imageFile, title);
  const imageValue = resolveUploadValue(formData, `pillar${i}BannerImage`, imageId);
  const rowId = optionalStr(formData, `pillar${i}Id`);
  return {
    ...(rowId ? { id: rowId } : {}),
    title,
    linkLabel: str(formData, `pillar${i}LinkLabel`),
    bannerImage: imageValue !== undefined ? imageValue : existingImageId,
  };
}

async function buildData(formData: FormData, existingImageIds: (number | undefined)[]) {
  return {
    eyebrow: str(formData, "eyebrow"),
    heading: str(formData, "heading"),
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
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "pillars-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/pillars?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "pillars-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "pillars-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "pillars-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Pillar Cards", `${action} the pillar cards`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/pillars?locale=${locale}&saved=1`);
}
