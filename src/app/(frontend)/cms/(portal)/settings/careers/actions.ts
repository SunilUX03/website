"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Each application step's own row `id` (threaded via a hidden
// `step${i}Id` input — see CareersContentForm.tsx) must round-trip back
// into the update data. Payload's localized array fields (title/
// description here) key each row's per-locale text off that row's own
// id — submitting a row without its id makes Payload treat it as brand
// new and silently wipes that row's OTHER locale's text.
function buildData(formData: FormData) {
  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
      ctaLabel: str(formData, "heroCtaLabel"),
    },
    openingsNote: str(formData, "openingsNote"),
    applicationSteps: Array.from({ length: 4 }, (_, i) => {
      const rowId = optionalStr(formData, `step${i}Id`);
      return {
        ...(rowId ? { id: rowId } : {}),
        title: str(formData, `step${i}Title`),
        description: str(formData, `step${i}Description`),
      };
    }),
    howToApplySection: {
      heading: str(formData, "howToApplyHeading"),
      sub: str(formData, "howToApplySub"),
    },
    openingsSection: { heading: str(formData, "openingsHeading") },
    applySection: {
      heading: str(formData, "applyHeading"),
      sub: str(formData, "applySub"),
    },
  };
}

export async function updateCareersContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "careers-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/careers?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "careers-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "careers-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "careers-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Careers Page", `${action} the Careers page content`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/careers?locale=${locale}&saved=1`);
}
