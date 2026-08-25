"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, optionalStr, parseRepeatable } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// `id`s below are a Payload internal detail worth documenting once: the
// contacts/disclosures arrays' localized subfields (badge/name/designation/
// detailsText, item/rowsText) are keyed off each row's own database id, not
// its position — a row resubmitted without that id gets treated as brand
// new, and Payload replaces the array wholesale, silently deleting the
// *other* locale's translation for every row. `contacts` isn't rendered via
// the generic RepeatableRows widget (it's a fixed pair of named fields), so
// RtiContentForm carries each contact's id through its own hidden
// `contact{i}Id` input instead.
//
// `tone` (contacts) and `sno` (disclosures) aren't localized, but they're
// siblings of localized fields within the same array row — RtiContentForm
// keeps them visible and editable on both the English and Tamil tabs (a
// shared field, not a separate Tamil value), so they're always present in
// the submitted FormData and safe to include unconditionally here.
//
// `ctaHref`/`email`/`phone`/`phoneHref` inside `howToFile` aren't localized
// either, but they're siblings of localized fields (heading/sub/body/
// ctaLabel/redirectNote) within the same *group*, not an array row — since
// the whole group is always resubmitted together, RtiContentForm instead
// renders those four as read-only fields with a hidden input carrying the
// current shared value forward on the Tamil tab (see `LockedField`), so
// they're always present here too and never get blanked by an absent field.
function buildData(formData: FormData) {
  const disclosureRows = parseRepeatable(formData, "disclosures", ["sno", "item", "rowsText"]);

  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
    },
    contacts: [0, 1].map((i) => {
      const id = optionalStr(formData, `contact${i}Id`);
      return {
        ...(id ? { id } : {}),
        badge: str(formData, `contact${i}Badge`),
        tone: (str(formData, `contact${i}Tone`) || "light") as "light" | "dark",
        name: str(formData, `contact${i}Name`),
        designation: str(formData, `contact${i}Designation`),
        detailsText: str(formData, `contact${i}DetailsText`),
      };
    }),
    disclosures: disclosureRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), sno: r.sno, item: r.item, rowsText: r.rowsText })),
    howToFile: {
      heading: str(formData, "fileHeading"),
      sub: str(formData, "fileSub"),
      body: str(formData, "fileBody"),
      ctaLabel: str(formData, "fileCtaLabel"),
      ctaHref: str(formData, "fileCtaHref"),
      redirectNote: str(formData, "fileRedirectNote"),
      email: str(formData, "fileEmail"),
      phone: str(formData, "filePhone"),
      phoneHref: str(formData, "filePhoneHref"),
    },
  };
}

export async function updateRtiContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "rti-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/rti?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "rti-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "rti-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "rti-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "RTI Page", `${action} the RTI page content`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/rti?locale=${locale}&saved=1`);
}
