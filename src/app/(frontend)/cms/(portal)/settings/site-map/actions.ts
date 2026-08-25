"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

type LinkRow = { id?: string; groupHeading: string; label: string; href: string };

// `href` isn't localized, but Payload validates the full array-row shape
// on every locale update, so each row's (unchanged) href is resupplied
// here alongside its groupHeading/label regardless of which locale is
// being saved — see footer settings' actions.ts for the same pattern.
//
// Rows are kept as full objects (id included when present) all the way
// through — Payload keys each row's per-locale groupHeading/label text
// by the row's own id, so a row resubmitted without its id is treated as
// brand new and the *other* locale's translation for that row is
// silently wiped. See RepeatableRows.tsx / form-utils.ts's
// parseRepeatable for how the id round-trips through the hidden input
// on each row.
function buildData(formData: FormData) {
  const rows = parseRepeatable(formData, "links", ["groupHeading", "label", "href"]) as LinkRow[];
  return {
    links: rows.map((r) => ({ ...(r.id ? { id: r.id } : {}), groupHeading: r.groupHeading, label: r.label, href: r.href })),
  };
}

export async function updateSiteMapContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  const current = await payload.findGlobal({ slug: "site-map-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/site-map?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (data.links.length === 0) {
    redirect(`/cms/settings/site-map?locale=${locale}&error=${encodeURIComponent("At least one link is required.")}`);
  }

  await payload.updateGlobal({ slug: "site-map-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });

  await logActivity(user, "updated", "Site Map", "Updated the /sitemap page's link groups");
  revalidatePath("/", "layout");
  redirect(`/cms/settings/site-map?locale=${locale}&saved=1`);
}
