"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

async function buildData(
  formData: FormData,
  existing: { emblemImageId?: number; markImageId?: number; faviconImageId?: number }
) {
  const emblemFile = formData.get("emblemImage") as File | null;
  const emblemId = await uploadFile("media", emblemFile, "Government of Tamil Nadu emblem");
  const emblemValue = resolveUploadValue(formData, "emblemImage", emblemId);

  const markFile = formData.get("markImage") as File | null;
  const markId = await uploadFile("media", markFile, "TNeGA mark");
  const markValue = resolveUploadValue(formData, "markImage", markId);

  const faviconFile = formData.get("faviconImage") as File | null;
  const faviconId = await uploadFile("media", faviconFile, "Favicon");
  const faviconValue = resolveUploadValue(formData, "faviconImage", faviconId);

  return {
    emblemImage: emblemValue !== undefined ? emblemValue : existing.emblemImageId,
    markImage: markValue !== undefined ? markValue : existing.markImageId,
    faviconImage: faviconValue !== undefined ? faviconValue : existing.faviconImageId,
    nameTamil: str(formData, "nameTamil"),
    nameEnglish: str(formData, "nameEnglish"),
  };
}

export async function updateSiteIdentity(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();

  const current = await payload.findGlobal({ slug: "site-identity", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/site-identity?error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  const data = await buildData(formData, {
    emblemImageId: typeof current.emblemImage === "number" ? current.emblemImage : current.emblemImage?.id,
    markImageId: typeof current.markImage === "number" ? current.markImage : current.markImage?.id,
    faviconImageId: typeof current.faviconImage === "number" ? current.faviconImage : current.faviconImage?.id,
  });

  if (!data.emblemImage || !data.markImage) {
    redirect(`/cms/settings/site-identity?error=${encodeURIComponent("Both the emblem and the mark are required.")}`);
  }

  await payload.updateGlobal({
    slug: "site-identity",
    data: { ...data, emblemImage: data.emblemImage!, markImage: data.markImage!, _status: "published" },
    overrideAccess: true,
  });

  await logActivity(user, "updated", "Site Identity", "Updated the header/footer emblem, mark, and organisation name");
  revalidatePath("/", "layout");
  redirect("/cms/settings/site-identity?saved=1");
}
