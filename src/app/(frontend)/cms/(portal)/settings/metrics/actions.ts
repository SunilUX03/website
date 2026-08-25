"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Each metric's own row `id` (threaded via a hidden `metric${i}Id` input
// — see MetricsForm.tsx) must round-trip back into the update data.
// Payload's localized array fields (`label` here — `metric` is
// deliberately NOT localized, e.g. "273+" reads the same either way) key
// each row's per-locale text off that row's own id — submitting a row
// without its id makes Payload treat it as brand new and silently wipes
// that row's OTHER locale's `label`.
function buildData(formData: FormData) {
  return {
    heading: str(formData, "heading"),
    metrics: Array.from({ length: 6 }, (_, i) => {
      const rowId = optionalStr(formData, `metric${i}Id`);
      return {
        ...(rowId ? { id: rowId } : {}),
        metric: str(formData, `metric${i}Metric`),
        label: str(formData, `metric${i}Label`),
      };
    }),
  };
}

export async function updateMetrics(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "metrics-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/metrics?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "metrics-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "metrics-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "metrics-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Homepage Metrics", `${action} the homepage metrics`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/metrics?locale=${locale}&saved=1`);
}
