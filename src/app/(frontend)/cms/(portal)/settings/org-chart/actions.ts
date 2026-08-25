"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

/** Mirrors OrgChartForm.tsx's own nodesToText — "Label :: Sublabel" per
 * line for a boxed card, or a bare line for a plain grey row.
 *
 * `ids` is that same branch's node ids in the original top-to-bottom
 * order (from the form's hidden `branch{i}NodeIds` field, one per line,
 * blank for a node that had no id yet). A line at the same position as
 * before keeps that position's id, so Payload recognizes it as the same
 * row rather than a brand-new one — losing a row's id on save makes
 * Payload treat it as new, silently wiping that row's other-locale text.
 * Lines added/removed/reordered by the admin fall out of alignment with
 * the old ids past that point and get fresh rows, same tradeoff the
 * plain-textarea editor already accepted for edit history in general. */
function parseNodes(text: string, ids: string[]): { id?: string; label: string; sublabel: string; muted: boolean }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const id = ids[i];
      const sepIndex = line.indexOf("::");
      const parsed =
        sepIndex === -1
          ? { label: line, sublabel: "", muted: true }
          : { label: line.slice(0, sepIndex).trim(), sublabel: line.slice(sepIndex + 2).trim(), muted: false };
      return { ...(id ? { id } : {}), ...parsed };
    });
}

function buildData(formData: FormData) {
  return {
    topLabel: str(formData, "topLabel"),
    jceoLabel: str(formData, "jceoLabel"),
    branches: Array.from({ length: 7 }, (_, i) => ({
      title: str(formData, `branch${i}Title`),
      subtitle: str(formData, `branch${i}Subtitle`),
      nodes: parseNodes(str(formData, `branch${i}Nodes`), str(formData, `branch${i}NodeIds`).split("\n")),
    })),
  };
}

export async function updateOrgChart(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "org-chart-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/org-chart?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "org-chart-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "org-chart-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "org-chart-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Organisation Structure", `${action} the About page's org chart`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/org-chart?locale=${locale}&saved=1`);
}
