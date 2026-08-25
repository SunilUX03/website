"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

function buildData(formData: FormData) {
  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
    },
    tenderPortal: {
      heading: str(formData, "portalHeading"),
      sub: str(formData, "portalSub"),
      body: str(formData, "portalBody"),
      ctaLabel: str(formData, "portalCtaLabel"),
      ctaHref: str(formData, "portalCtaHref"),
      redirectNote: str(formData, "portalRedirectNote"),
    },
  };
}

export async function updateTendersContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "tenders-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/tenders?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "tenders-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "tenders-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "tenders-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Tenders Page", `${action} the Tenders page content`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/tenders?locale=${locale}&saved=1`);
}
