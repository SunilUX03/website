"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

type LinkRow = { id?: string; label: string; href: string };

// `href` isn't localized, but Payload validates the full array-row shape
// on every locale update, so each row's (unchanged) href is resupplied
// here alongside its label regardless of which locale is being saved.
//
// Every row is kept as a full object (id included when present) all the
// way through — Payload keys each row's per-locale `label` text by the
// row's own id, so a row resubmitted without its id is treated as brand
// new and the *other* locale's translation for that row is silently
// wiped. See RepeatableRows.tsx / form-utils.ts's parseRepeatable for
// how the id round-trips through the hidden input on each row.
function readRows(formData: FormData, name: string): LinkRow[] {
  return parseRepeatable(formData, name, ["label", "href"]) as LinkRow[];
}

function withId(row: LinkRow) {
  return { ...(row.id ? { id: row.id } : {}), label: row.label, href: row.href };
}

function buildData(formData: FormData) {
  return {
    govLabel: str(formData, "govLabel"),
    about: readRows(formData, "about").map(withId),
    services: readRows(formData, "services").map(withId),
    notificationsUpdates: readRows(formData, "notificationsUpdates").map(withId),
    notificationsDocuments: readRows(formData, "notificationsDocuments").map(withId),
  };
}

export async function updateNavContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "nav-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/nav?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "nav-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "nav-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "nav-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Site Navigation", `${action} the header navigation`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/nav?locale=${locale}&saved=1`);
}
