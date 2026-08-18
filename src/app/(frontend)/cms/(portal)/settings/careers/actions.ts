"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      heading: str(formData, "heroHeading"),
      body: str(formData, "heroBody"),
      ctaLabel: str(formData, "heroCtaLabel"),
    },
    openingsNote: str(formData, "openingsNote"),
    applicationSteps: Array.from({ length: 4 }, (_, i) => ({
      title: str(formData, `step${i}Title`),
      description: str(formData, `step${i}Description`),
    })),
  };
}

export async function updateCareersContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "careers-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "careers-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "careers-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Careers Page", `${action} the Careers page content`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/careers?saved=1");
}
