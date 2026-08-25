"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { parseRepeatable, str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Every localized array field's rows are kept as full objects (id
// included when present) all the way through, rather than collapsed to
// plain strings — Payload keys each row's per-locale text by the row's
// own id, so a row resubmitted without its id is treated as brand new
// and the *other* locale's translation for that row is silently wiped.
// See RepeatableRows.tsx / form-utils.ts's parseRepeatable for how the
// id round-trips through the hidden input on each row.
async function buildData(formData: FormData, existing: { mapImageId?: number; backgroundImageId?: number }) {
  const agencyLabelCycleRows = parseRepeatable(formData, "agencyLabelCycle", ["text"]);
  const headlineCycleWordRows = parseRepeatable(formData, "headlineCycleWords", ["word"]);

  const mapImageFile = formData.get("mapImage") as File | null;
  const mapImageId = await uploadFile("media", mapImageFile, "Hero map image");
  const mapImageValue = resolveUploadValue(formData, "mapImage", mapImageId);

  const backgroundImageFile = formData.get("backgroundImage") as File | null;
  const backgroundImageId = await uploadFile("media", backgroundImageFile, "Hero background image");
  const backgroundImageValue = resolveUploadValue(formData, "backgroundImage", backgroundImageId);

  return {
    agencyLabelCycle: agencyLabelCycleRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), text: r.text })),
    headlineTemplate: str(formData, "headlineTemplate"),
    headlineCycleWords: headlineCycleWordRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), word: r.word })),
    tagline: str(formData, "tagline"),
    mapImage: mapImageValue !== undefined ? mapImageValue : existing.mapImageId,
    backgroundImage: backgroundImageValue !== undefined ? backgroundImageValue : existing.backgroundImageId,
  };
}

export async function updateHeroContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "hero-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/hero?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  const data = await buildData(formData, {
    mapImageId: typeof current.mapImage === "number" ? current.mapImage : current.mapImage?.id,
    backgroundImageId: typeof current.backgroundImage === "number" ? current.backgroundImage : current.backgroundImage?.id,
  });

  if (!data.mapImage) {
    redirect(`/cms/settings/hero?locale=${locale}&error=${encodeURIComponent("The map image is required.")}`);
  }

  if (!data.headlineTemplate.includes("{word}")) {
    redirect(
      `/cms/settings/hero?locale=${locale}&error=${encodeURIComponent('The headline must contain the placeholder "{word}" exactly once.')}`
    );
  }

  const finalData = { ...data, mapImage: data.mapImage! };

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "hero-content", locale, data: { ...finalData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "hero-content", locale, data: { ...finalData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "hero-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Homepage Hero", `${action} the homepage Hero`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/hero?locale=${locale}&saved=1`);
}
