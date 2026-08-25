"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

function buildData(formData: FormData) {
  // Kept as full row objects (not collapsed to plain strings) so each
  // row's `id` survives into the Payload data below — losing it makes
  // Payload treat the row as brand new and wipes that field's Tamil
  // translation on save. See RepeatableRows.tsx for the full explanation.
  const sectionsRows = parseRepeatable(formData, "sections", ["heading", "body"]);

  return {
    slug: str(formData, "slug") as
      | "privacy-policy"
      | "terms-conditions"
      | "terms-of-use"
      | "disclaimer"
      | "help"
      | "feedback",
    title: str(formData, "title"),
    eyebrow: str(formData, "eyebrow") || "Legal",
    intro: optionalStr(formData, "intro"),
    sections: sectionsRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), heading: r.heading, body: r.body })),
  };
}

export async function updateLegalPage(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "legal-pages", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/legal-pages/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "legal-pages", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "legal-pages", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "legal-pages", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Legal Pages", `${action} "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/legal-pages/${id}/edit?locale=${locale}&saved=1`);
}
