"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str, parseRepeatable } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  const disclosureRows = parseRepeatable(formData, "disclosures", ["sno", "item", "rowsText"]);

  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
    },
    contacts: [0, 1].map((i) => ({
      badge: str(formData, `contact${i}Badge`),
      tone: (str(formData, `contact${i}Tone`) || "light") as "light" | "dark",
      name: str(formData, `contact${i}Name`),
      designation: str(formData, `contact${i}Designation`),
      detailsText: str(formData, `contact${i}DetailsText`),
    })),
    disclosures: disclosureRows.map((r) => ({ sno: r.sno, item: r.item, rowsText: r.rowsText })),
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

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "rti-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "rti-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "rti-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "RTI Page", `${action} the RTI page content`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/rti?saved=1");
}
