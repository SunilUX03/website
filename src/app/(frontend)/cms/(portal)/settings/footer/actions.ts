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
// phone/email/socialLinks aren't localized at all, so they're written
// the same way on every save without any locale-specific handling.
//
// quickLinks/citizenServices/helpSupport rows are kept as full objects
// (id included when present) all the way through — Payload keys each
// row's per-locale `label` text by the row's own id, so a row
// resubmitted without its id is treated as brand new and the *other*
// locale's translation for that row is silently wiped. See
// RepeatableRows.tsx / form-utils.ts's parseRepeatable for how the id
// round-trips through the hidden input on each row.
function readRows(formData: FormData, name: string): LinkRow[] {
  return parseRepeatable(formData, name, ["label", "href"]) as LinkRow[];
}

function withId(row: LinkRow) {
  return { ...(row.id ? { id: row.id } : {}), label: row.label, href: row.href };
}

function buildData(formData: FormData) {
  return {
    description: str(formData, "description"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    socialLinks: parseRepeatable(formData, "socialLinks", ["label", "href"]) as {
      label: "Facebook" | "X" | "YouTube" | "Instagram" | "LinkedIn";
      href: string;
    }[],
    quickLinks: readRows(formData, "quickLinks").map(withId),
    citizenServices: readRows(formData, "citizenServices").map(withId),
    initiativesProjects: readRows(formData, "initiativesProjects").map(withId),
    helpSupport: readRows(formData, "helpSupport").map(withId),
  };
}

export async function updateFooterContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "footer-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/footer?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "footer-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "footer-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "footer-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Footer", `${action} the site footer`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/footer?locale=${locale}&saved=1`);
}
