"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, parseRepeatable } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Both `services` (name/description, localized) and `departmentContacts`
// (department localized; contact/email/phone shared across locales) key
// each row's per-locale text off that row's own database id — a row
// resubmitted without its id is treated as brand new, and Payload
// replaces the whole array wholesale, silently deleting the OTHER
// locale's text for every row that lost its id. RepeatableRows/
// parseRepeatable round-trip each existing row's id via a hidden input;
// callers here just need to thread it back into the array data.
function buildData(formData: FormData) {
  const services = parseRepeatable(formData, "services", ["name", "description"]).map((row) => ({
    ...(row.id ? { id: row.id } : {}),
    name: row.name,
    description: row.description,
  }));

  const departmentContacts = parseRepeatable(formData, "departmentContacts", ["department", "contact", "email", "phone"]).map(
    (row) => ({
      ...(row.id ? { id: row.id } : {}),
      department: row.department,
      contact: row.contact,
      email: row.email,
      phone: row.phone,
    })
  );

  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
    },
    services,
    tableIntro: {
      eyebrow: str(formData, "tableIntroEyebrow"),
      heading: str(formData, "tableIntroHeading"),
      body: str(formData, "tableIntroBody"),
    },
    tableColumnHeaders: {
      serialNumber: str(formData, "tableHeaderSerialNumber"),
      department: str(formData, "tableHeaderDepartment"),
      contact: str(formData, "tableHeaderContact"),
      email: str(formData, "tableHeaderEmail"),
      phone: str(formData, "tableHeaderPhone"),
    },
    raiseTicketLabel: str(formData, "raiseTicketLabel"),
    raiseTicketHref: str(formData, "raiseTicketHref"),
    departmentContacts,
  };
}

export async function updateServicesToGovernmentContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "services-to-government-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/services-to-government?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "services-to-government-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "services-to-government-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "services-to-government-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Services to Government Page", `${action} the Services to Government page content`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/services-to-government?locale=${locale}&saved=1`);
}
